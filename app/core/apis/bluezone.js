/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import {Platform} from 'react-native';
import * as RNFS from 'react-native-fs';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

// local
import retryApi from './retryApi';
import {
  UpdateTokenFirebaseErrorCode,
  CreateAndSendOTPCodeErrorCode,
  ConfirmOTPCodeErrorCode,
  DeclareInformation,
  RegisterInfomation,
} from './errorCode';
import configuration, {syncTokenFirebase} from '../../configuration';
import log from '../log';
import tmpl, * as msg from '../../const/log';

// Const
import {
  DOMAIN,
  DOMAIN_CONFIG,
  DOMAIN_NEW,
  CONFIG_APP_FILE_NAME,
  RESOURCE_APP_FILE_NAME,
  VERSION_APP_FILE_NAME,
  FAQ_FILE_NAME,
} from './server';
import {
  TIME_RETRY_REGISTER_USER,
  TIME_RETRY_UPDATE_TOKEN_FIREBASE,
  TIME_RETRY_UPLOAD_HISTORY,
} from '../../const/api';
import Service from './service';
import {setTokenForDeclaration} from '../storage';

const _defaultFunc = () => {};

const createErrorFn = (fn, nameField = 'data') => {
  return e => {
    const data = {
      [nameField]: {
        isOk: false,
        Status: -1,
        Object: e.toString(),
      },
    };
    fn(data);
  };
};

const registerTokenFirebase = (
  TokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
) => {
  const options = {
    method: 'post',
    data: {
      TokenFirebase: TokenFirebase,
      TypeOS: Platform.OS,
    },
    url: `${DOMAIN}/api/App/RegisterUser`,
    timeout: 10000,
  };

  const _success = response => {
    log.info(msg.REGISTER_TOKEN_FIREBASE_SUCCESS, response);
    success(response.data);
  };

  const _failure = e => {
    log.error(msg.REGISTER_TOKEN_FIREBASE_FAILURE, e);
    failure(e);
  };

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
    } else {
      _failure(response);
    }
  }, createErrorFn(_failure));
};

const retryRegisterTokenFirebase = (
  TokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry = TIME_RETRY_REGISTER_USER,
) => {
  retryApi(
    (_success, _failure) => {
      registerTokenFirebase(TokenFirebase, _success, _failure);
    },
    success,
    failure,
    timeRetry,
  );
};

/**
 * Cap nhat token len server
 * @param TokenFirebaseNew
 * @param TokenFirebaseOld
 * @param success
 * @param failure
 */
const updateTokenFirebase = (
  TokenFirebaseNew,
  TokenFirebaseOld,
  success = _defaultFunc,
  failure = _defaultFunc,
) => {
  const {PhoneNumber} = configuration;
  const options = {
    method: 'POST',
    data: {
      TokenFirebaseNew: TokenFirebaseNew,
      TokenFirebaseOld: TokenFirebaseOld,
      PhoneNumber: PhoneNumber,
    },
    url: `${DOMAIN}/api/App/UpdateTokenFirebase`,
    timeout: 10000,
  };

  const _success = response => {
    log.info(msg.UPDATE_TOKEN_FIREBASE_SUCCESS, response);
    success(response.data);
  };

  const _failure = e => {
    log.error(msg.UPDATE_TOKEN_FIREBASE_FAILURE, e);
    failure(e);
  };

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
      return;
    }

    // Trường hợp firebase chưa được đăng kí.
    if (
      response?.data?.Status ===
      UpdateTokenFirebaseErrorCode.TOKEN_FIREBASE_CU_CHUA_DUOC_DANG_KI
    ) {
      registerTokenFirebase(TokenFirebaseNew, success, failure);
    } else {
      _failure(response);
    }
  }, createErrorFn(_failure));
};

const retryUpdateTokenFirebase = (
  TokenFirebaseNew,
  TokenFirebaseOld,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry = TIME_RETRY_UPDATE_TOKEN_FIREBASE,
) => {
  retryApi(
    (_success, _failure) => {
      updateTokenFirebase(
        TokenFirebaseNew,
        TokenFirebaseOld,
        _success,
        _failure,
      );
    },
    success,
    failure,
    timeRetry,
  );
};

/**
 * Dang ki so dien thoai
 * @param PhoneNumber
 * @param TokenFirebase
 * @param success
 * @param failure
 * @param numberRetry
 * @constructor
 */
const _createAndSendOTPCode = (
  PhoneNumber,
  TokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
  numberRetry = 0,
) => {
  const options = {
    method: 'POST',
    data: {
      PhoneNumber: PhoneNumber,
      TokenFirebase: TokenFirebase,
      TypeOS: Platform.OS,
    },
    url: `${DOMAIN}/api/App/CreateAndSendOTPCode`,
    timeout: 10000,
  };

  const _success = response => success(response.data);

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
      return;
    }

    // Co gang dang ki lai token firebase neu co loi
    if (
      (response.data.Status ===
        CreateAndSendOTPCodeErrorCode.TOKEN_FIREBASE_KHONG_HOP_LE ||
        response.data.Status ===
          CreateAndSendOTPCodeErrorCode.TOKEN_FIREBASE_CHUA_DANG_KI) &&
      numberRetry < 1
    ) {
      numberRetry++;
      syncTokenFirebase(
        _tokenFirebase => {
          _createAndSendOTPCode(
            PhoneNumber,
            _tokenFirebase,
            success, // Cho nay bat buoc la success goc tren param, khong duoc dung _success
            failure,
            numberRetry,
          );
        },
        () => failure(response), // Sync token firebay loi thi dung luon, day response goc ra
      );
    } else {
      failure(response);
    }
  }, createErrorFn(failure));
};

const CreateAndSendOTPCode = (PhoneNumber, TokenFirebase, success, failure) => {
  _createAndSendOTPCode(PhoneNumber, TokenFirebase, success, failure, 0);
};

/**
 * Xac thuc OTP dung cho Dang ki so dien thoai
 * @param PhoneNumber
 * @param TokenFirebase
 * @param OTPCode
 * @param success
 * @param failure
 * @param numberRetry
 * @constructor
 */
export const _verifyOTPCode = (
  PhoneNumber,
  TokenFirebase,
  OTPCode,
  success = _defaultFunc,
  failure = _defaultFunc,
  numberRetry = 0,
) => {
  const options = {
    method: 'POST',
    data: {
      TokenFirebase: TokenFirebase,
      PhoneNumber: PhoneNumber,
      OTPCode: OTPCode,
      TypeOS: Platform.OS,
    },
    url: `${DOMAIN}/api/App/ConfirmOTPCode`,
    timeout: 10000,
  };

  const _success = response => success(response.data);

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
      return;
    }

    if (
      response.data.Status ===
        ConfirmOTPCodeErrorCode.TOKEN_FIREBASE_CHUA_DANG_KI &&
      numberRetry < 1
    ) {
      numberRetry++;
      syncTokenFirebase(
        _tokenFirebase => {
          _verifyOTPCode(
            _tokenFirebase,
            PhoneNumber,
            OTPCode,
            success, // Cho nay bat buoc la success goc tren param, khong duoc dung _success
            failure,
            numberRetry,
          );
        },
        () => failure(response), // Sync token firebay loi thi dung luon, day response goc ra
      );
    } else {
      failure(response);
    }
  }, createErrorFn(failure));
};

const VerifyOTPCode = (
  PhoneNumber,
  TokenFirebase,
  OTPCode,
  success,
  failure,
) => {
  _verifyOTPCode(PhoneNumber, TokenFirebase, OTPCode, success, failure, 0);
};

/**
 * Thêm thông tin bổ sung
 * @param TokenFirebase
 * @param PhoneNumber
 * @param Fullname
 * @param Address
 * @param success
 * @param failure
 * @param numberRetry
 * @constructor
 */
const _addDeclareInformation = (
  TokenFirebase,
  PhoneNumber,
  Fullname,
  Address,
  success = _defaultFunc,
  failure = _defaultFunc,
  numberRetry = 0,
) => {
  const options = {
    method: 'POST',
    data: {
      PhoneNumber: PhoneNumber,
      TokenFirebase: TokenFirebase,
      Fullname: Fullname,
      Address: Address,
    },
    url: `${DOMAIN}/api/App/DeclareInformation`,
    timeout: 10000,
  };

  const _success = response => success(response.data);

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
      return;
    }

    // Co gang dang ki lai token firebase neu co loi
    if (
      response.data.Status === RegisterInfomation.TOKEN_FIREBASE_CHUA_DANG_KI &&
      numberRetry < 1
    ) {
      numberRetry++;
      syncTokenFirebase(
        _tokenFirebase => {
          _addDeclareInformation(
            _tokenFirebase,
            PhoneNumber,
            Fullname,
            Address,
            success, // Cho nay bat buoc la success goc tren param, khong duoc dung _success
            failure,
            numberRetry,
          );
        },
        () => failure(response), // Sync token firebay loi thi dung luon, day response goc ra
      );
    } else {
      failure(response);
    }
  }, createErrorFn(failure));
};

const AddDeclareInformation = (
  TokenFirebase,
  PhoneNumber,
  Fullname,
  Address,
  success,
  failure,
) => {
  _addDeclareInformation(
    TokenFirebase,
    PhoneNumber,
    Fullname,
    Address,
    success,
    failure,
    0,
  );
};

const UploadType = {
  F01Auto: {
    LogText: 'F01Auto',
    toUrl: `${DOMAIN}/api/AppHistoryContact/ReportHistory_GetInfo`,
    toUrlSendInfo: `${DOMAIN}/api/AppHistoryContact/ReportHistory_GetInfo_NoFile`,
    Fields: {FindGUID: ''},
  },
  F01OTP: {
    LogText: 'F01OTP',
    toUrl: `${DOMAIN}/api/AppHistoryContact/ReportHistory_ConfirmDeclare`,
    toUrlSendInfo: `${DOMAIN}/api/AppHistoryContact/ReportHistory_ConfirmDeclare_NoFile`,
    Fields: {OTP: ''},
  },
  F12: {
    LogText: 'F12',
    toUrl: `${DOMAIN}/api/AppHistoryContact/ReportHistory_ConfirmContact`,
    toUrlSendInfo: `${DOMAIN}/api/AppHistoryContact/ReportHistory_ConfirmContact_NoFile`,
    Fields: {FindGUID: ''},
  },
};

const deleteHistoryFile = filePath => {
  RNFS.unlink(filePath)
    .then(() => {
      log.info(msg.DELETE_FILE_SUCCESS, filePath);
    })
    .catch(() => {
      log.info(msg.DELETE_FILE_FAILURE, filePath);
    });
};

const getUploadField = (UploadConfig, OtpOrFindGuid) => {
  let _fields = {...UploadConfig.Fields}; // Clone Fields
  const _firstProp = Object.keys(_fields)[0]; // Lay field dau tien, la: OTP hoac FindGUID
  _fields[_firstProp] = OtpOrFindGuid; // Gan cho prop dau tien (FindGUID hoac OTP) gia tri
  return _fields;
};

const _uploadHistory = (
  filePath,
  bluezoneInfo,
  OtpOrFindGuid,
  Type,
  success = _defaultFunc,
  failure = _defaultFunc,
  optionMore = {},
  numberRetry,
) => {
  const UploadConfig = {...UploadType[Type]};
  const {TokenFirebase, PhoneNumber} = configuration;

  log.info(tmpl(msg.HISTORY_FILE, UploadConfig.LogText), filePath);

  const _success = response => {
    log.info(tmpl(msg.UPLOAD_SUCCESS, UploadConfig.LogText), filePath);
    const data = response?.body?.Object ? response.body.Object : {};
    success(data);
  };
  const _failure = e => {
    log.info(tmpl(msg.UPLOAD_FAILURE, UploadConfig.LogText, numberRetry), e);
    failure(e);
  };

  let countProgressUploadLoop = 0;

  const _progress =
    typeof optionMore.progress === 'function'
      ? optionMore.progress
      : _defaultFunc;

  let _fields = getUploadField(UploadConfig, OtpOrFindGuid);

  const body = [
    {
      name: 'history',
      filename: 'data_trace.txt',
      type: 'text/xml',
      data: RNFetchBlob.wrap(filePath),
    },
    {name: 'TokenFirebase', data: TokenFirebase},
    {name: 'InfoF', data: bluezoneInfo},
    {name: 'PhoneNumber', data: PhoneNumber},
  ];

  for (const property in _fields) {
    body.push({
      name: property,
      data: _fields[property],
    });
  }

  if (Type === 'F01OTP') {
    RNFetchBlob.fs.stat(filePath).then(fileInfo => {
      log.info(tmpl(msg.INFO_FILE_UPLOAD, UploadConfig.LogText), fileInfo);
    });
  }

  let t = 0;

  RNFetchBlob.fetch(
    'POST',
    UploadConfig.toUrl,
    {
      Accept: 'application/json',
      'Content-Type': 'application/octet-stream',
    },
    body,
  )
    .uploadProgress((written, total) => {
      if (Type === 'F01OTP') {
        const tle = (written / total) * 100;
        if (tle > t) {
          log.info(tmpl(msg.UPLOAD_PROGRESS, UploadConfig.LogText, tle));
          t += 25;
        }
      }

      if (written === 0) {
        countProgressUploadLoop++;
      }
      if (countProgressUploadLoop === 10) {
        log.info(tmpl(msg.UPLOAD_STOP, UploadConfig.LogText, numberRetry), {
          written,
          total,
        });
        countProgressUploadLoop = 0;
      }
      _progress(written, total);
    })
    .then(response => {
      try {
        response.data =
          typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
      } catch (e) {
        log.info(
          tmpl(msg.PARSE_RESPONSE_BODY_FAILURE, UploadConfig.LogText),
          response,
        );
      }
      if (response.respInfo.status === 200 && response.data.isOk === true) {
        _success(response);
      } else {
        _failure(response);
      }
    })
    .catch(createErrorFn(_failure));
};

const _sendInfoBluezone = (
  bluezoneInfo,
  OtpOrFindGuid,
  Type,
  success = _defaultFunc,
  failure = _defaultFunc,
  numberRetry,
) => {
  const UploadConfig = {...UploadType[Type]};
  const {TokenFirebase, PhoneNumber} = configuration;
  const _success = response => {
    log.info(
      tmpl(msg.SEND_INFO_BLUEZONE_SUCCESS, UploadConfig.LogText),
      bluezoneInfo,
    );
    const data = response?.body?.Object ? response.body.Object : {};
    success(data);
  };
  const _failure = e => {
    log.info(
      tmpl(msg.SEND_INFO_BLUEZONE_FAILURE, UploadConfig.LogText, numberRetry),
      e,
    );
    failure(e);
  };

  let _fields = getUploadField(UploadConfig, OtpOrFindGuid);

  const bodyFormData = new FormData();
  bodyFormData.append('TokenFirebase', TokenFirebase);
  bodyFormData.append('InfoF', bluezoneInfo);
  bodyFormData.append('PhoneNumber', PhoneNumber);

  for (const property in _fields) {
    bodyFormData.append(property, _fields[property]);
  }

  // Object.assign(_fields, {
  //   TokenFirebase: TokenFirebase,
  //   InfoF: bluezoneInfo,
  //   PhoneNumber: PhoneNumber,
  // });

  const options = {
    method: 'POST',
    data: bodyFormData,
    url: UploadConfig.toUrlSendInfo,
    timeout: 10000,
  };

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
    } else {
      _failure(response);
    }
  }, createErrorFn(_failure));
};

const handleUploadFile = async (numberDays, request, success, failure) => {
  log.info(msg.BEGIN_WRITE_HISTORY_FILE);
  const filePath = await Service.writeHistoryContact(numberDays);
  log.info(msg.END_WRITE_HISTORY_FILE, filePath);
  log.info(msg.BEGIN_GET_BZ_INFO);
  const infoF = await Service.getBluezoneIdInfo();
  log.info(msg.END_GET_BZ_INFO);
  const _success = data => {
    deleteHistoryFile(filePath);
    success && success(data);
  };
  const _failure = e => {
    deleteHistoryFile(filePath);
    failure && failure(e);
    log.uploadFileLog();
  };
  request(filePath, infoF, _success, _failure);
};

const handleGetInfoF = (success = _defaultFunc) => {
  log.info(msg.BEGIN_GET_BZ_INFO);
  Service.getBluezoneIdInfo()
    .then(infoF => {
      success(infoF);
      log.info(msg.END_GET_BZ_INFO);
    })
    .catch(_defaultFunc);
};

// TODO: Can xu ly Job cho ham nay
/**
 * Day lich su tiep xuc khi truy vet F1, F2 co tiep xuc
 * @param numberDays
 * @param FindGUID
 * @param success
 * @param failure
 * @param optionMore
 * @param timeRetry
 */
const retryUploadHistoryF12 = (
  numberDays,
  FindGUID,
  success,
  failure,
  timeRetry = TIME_RETRY_UPLOAD_HISTORY,
  optionMore,
) => {
  const _successF12 = data => {
    const {Token} = data; // Token dung cho khai bao y te
    setTokenForDeclaration(Token);
    success(data);
  };

  handleGetInfoF(infoF => {
    retryApi(
      (_success, _failure, numberRetry) => {
        _sendInfoBluezone(
          infoF,
          FindGUID,
          'F12',
          _success,
          _failure,
          numberRetry,
        );
      },
      _defaultFunc,
      _defaultFunc,
      timeRetry,
    );
  });

  handleUploadFile(
    numberDays,
    (filePath, infoF, handleSuccess, handleFailure) => {
      retryApi(
        (_success, _failure, numberRetry) => {
          _uploadHistory(
            filePath,
            infoF,
            FindGUID,
            'F12',
            _success,
            _failure,
            optionMore,
            numberRetry,
          );
        },
        handleSuccess,
        handleFailure,
        timeRetry,
      );
    },
    _successF12,
    failure,
  ).then(_defaultFunc);
};

const uploadHistoryF01ByOTP = (
  numberDays,
  OTPCode,
  success,
  failure,
  optionMore,
) => {
  handleGetInfoF(infoF => {
    _sendInfoBluezone(infoF, OTPCode, 'F01OTP', _defaultFunc, _defaultFunc, 0);
  });

  handleUploadFile(
    numberDays,
    (filePath, infoF, handleSuccess, handleFailure) => {
      _uploadHistory(
        filePath,
        infoF,
        OTPCode,
        'F01OTP',
        handleSuccess,
        handleFailure,
        optionMore,
        0,
      );
    },
    success,
    failure,
  ).then(() => {});
};

/**
 * Day lich su bang ma OTP
 * @param numberDays
 * @param OTPCode
 * @param success
 * @param failure
 * @param optionMore
 * @param timeRetry
 */
const retryUploadHistoryF01ByOTP = (
  numberDays,
  OTPCode,
  success,
  failure,
  timeRetry = TIME_RETRY_UPLOAD_HISTORY,
  optionMore = {},
) => {
  handleGetInfoF(infoF => {
    retryApi(
      (_success, _failure, numberRetry) => {
        _sendInfoBluezone(
          infoF,
          OTPCode,
          'F01OTP',
          _success,
          _failure,
          numberRetry,
        );
      },
      _defaultFunc,
      _defaultFunc,
      timeRetry,
    );
  });

  handleUploadFile(
    numberDays,
    (filePath, infoF, handleSuccess, handleFailure) => {
      retryApi(
        (_success, _failure, numberRetry) => {
          _uploadHistory(
            filePath,
            infoF,
            OTPCode,
            'F01OTP',
            _success,
            _failure,
            optionMore,
            numberRetry,
          );
        },
        handleSuccess,
        handleFailure,
        timeRetry,
      );
    },
    success,
    failure,
  ).then(_defaultFunc);
};

/**
 * Day lich su khi da xac dinh la F0, F1
 * @param numberDays
 * @param FindGUID
 * @param success
 * @param failure
 * @param optionMore
 * @param timeRetry
 */
const retryUploadHistoryF01Auto = (
  numberDays,
  FindGUID,
  success,
  failure,
  timeRetry = TIME_RETRY_UPLOAD_HISTORY,
  optionMore,
) => {
  handleGetInfoF(infoF => {
    retryApi(
      (_success, _failure, numberRetry) => {
        _sendInfoBluezone(
          infoF,
          FindGUID,
          'F01Auto',
          _success,
          _failure,
          numberRetry,
        );
      },
      _defaultFunc,
      _defaultFunc,
      timeRetry,
    );
  });

  handleUploadFile(
    numberDays,
    (filePath, infoF, handleSuccess, handleFailure) => {
      retryApi(
        (_success, _failure, numberRetry) => {
          _uploadHistory(
            filePath,
            infoF,
            FindGUID,
            'F01Auto',
            _success,
            _failure,
            optionMore,
            numberRetry,
          );
        },
        handleSuccess,
        handleFailure,
        timeRetry,
      );
    },
    success,
    failure,
  ).then(_defaultFunc);
};

const _declaration = (
  FindGUID,
  bluezoneInfo,
  Token,
  UserInfo,
  success = _defaultFunc,
  failure = _defaultFunc,
  numberRetry = 0,
) => {
  const {TokenFirebase} = configuration;
  const options = {
    method: 'POST',
    data: {
      FindGUID: FindGUID,
      Token: Token,
      InfoF: bluezoneInfo,
      TokenFirebase: TokenFirebase,
      UserInfo: UserInfo,
    },
    url: `${DOMAIN}/api/AppHistoryContact/DeclareInformation`,
    timeout: 10000,
  };

  const _success = response => success(response.data);

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
      return;
    }

    if (
      response.data.Status === DeclareInformation.TOKEN_FIREBASE_KHONG_HOP_LE &&
      numberRetry < 1
    ) {
      numberRetry++;
      syncTokenFirebase(
        () => {
          _declaration(
            FindGUID,
            bluezoneInfo,
            Token,
            UserInfo,
            success,
            failure,
            numberRetry,
          );
        },
        () => failure(response),
      );
    } else {
      failure(response);
    }
  }, createErrorFn(failure));
};

/**
 * Khai bao y te
 * @param FindGUID
 * @param bluezoneInfo
 * @param Token
 * @param UserInfo
 * @param success
 * @param failure
 */
const declaration = (
  FindGUID,
  bluezoneInfo,
  Token,
  UserInfo,
  success,
  failure,
) => {
  _declaration(FindGUID, bluezoneInfo, Token, UserInfo, success, failure, 0);
};

const retryDeclaration = (
  FindGUID,
  bluezoneInfo,
  Token,
  UserInfo,
  success,
  failure,
  timeRetry = TIME_RETRY_UPLOAD_HISTORY,
) => {
  retryApi(
    (_success, _failure) => {
      declaration(FindGUID, bluezoneInfo, Token, UserInfo, _success, _failure);
    },
    success,
    failure,
    timeRetry,
  );
};

/**
 * Dang ki, update lai thong tin nguoi dung
 * @param TokenFirebaseOld
 * @param TokenFirebaseNew
 * @param PushGUID
 * @param success
 * @param failure
 */
const registerTokenFirebaseAgain = (
  TokenFirebaseOld,
  TokenFirebaseNew,
  PushGUID,
  success = _defaultFunc,
  failure = _defaultFunc,
) => {
  const {PhoneNumber} = configuration;
  const options = {
    method: 'POST',
    data: {
      TokenFirebaseNew: TokenFirebaseNew,
      TokenFirebaseOld: TokenFirebaseOld,
      PhoneNumber: PhoneNumber,
      PushGUID: PushGUID,
      TypeOS: Platform.OS,
    },
    url: `${DOMAIN}/api/AppHistoryContact/PushInfoApp`,
  };

  const _success = response => success(response.data);

  axios(options).then(response => {
    if (response.status === 200 && response.data.isOk === true) {
      _success(response);
    } else {
      // TODO Can xu ly thu lai
      failure(response);
    }
  }, createErrorFn(failure));
};

const retryRegisterTokenFirebaseAgain = (
  TokenFirebaseOld,
  TokenFirebaseNew,
  PushGUID,
  success,
  failure,
  timeRetry = TIME_RETRY_UPLOAD_HISTORY,
) => {
  retryApi(
    (_success, _failure) => {
      registerTokenFirebaseAgain(
        TokenFirebaseOld,
        TokenFirebaseNew,
        PushGUID,
        _success,
        _failure,
      );
    },
    success,
    failure,
    timeRetry,
  );
};

/**
 * Lay thong bao HTML, LINK
 * @param bzNewId
 * @param success
 * @param failure
 */
const getNews = (bzNewId, success = _defaultFunc, failure = _defaultFunc) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN_NEW}/bzentries/${bzNewId}`,
    timeout: 10000,
  };

  const _success = response => success(response.data);

  axios(options).then(response => {
    if (response.status === 200) {
      _success(response);
    } else {
      failure(response);
    }
  }, createErrorFn(failure));
};

/**
 * Kiem tra phien ban moi cua app, resource, cau hinh
 * @param success
 * @param failure
 * @param timeout
 */
const getCheckVersions = (
  success = _defaultFunc,
  failure = _defaultFunc,
  timeout,
) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN_CONFIG}/api/App/${VERSION_APP_FILE_NAME}`,
    timeout: timeout,
  };

  axios(options).then(response => {
    success(response.data);
  }, createErrorFn(failure));
};

/**
 * Lấy thông tin cau hinh moi nhat
 * @param success
 * @param failure
 * @returns {Promise<void>}
 */
const getConfiguration = (success = _defaultFunc, failure = _defaultFunc) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN_CONFIG}/api/App/${CONFIG_APP_FILE_NAME}`,
    timeout: 3000,
  };

  axios(options).then(response => {
    success(response.data);
  }, createErrorFn(failure));
};

/**
 * Lấy danh sách câu hỏi FAQ
 * @param success
 * @param failure
 * @returns {Promise<void>}
 */
const getQuestionFAQ = (success = _defaultFunc, failure = _defaultFunc) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN_CONFIG}/api/App/${FAQ_FILE_NAME}`,
    timeout: 3000,
  };

  axios(options).then(response => {
    success(response.data);
  }, createErrorFn(failure));
};

/**
 * Lay cau hinh resource ngon ngu moi nhat
 * @param success
 * @param failure
 * @param timeout
 */
const getResourceLanguage = (
  success = _defaultFunc,
  failure = _defaultFunc,
  timeout,
) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN_CONFIG}/api/App/${RESOURCE_APP_FILE_NAME}`,
    timeout: timeout,
  };

  axios(options).then(response => {
    success(response.data);
  }, createErrorFn(failure));
};

const getAnswerMessage = (question, successCb, errorCb) => {
  const options = {
    method: 'POST',
    data: question,
    url: 'https://chatbot-bluezone.bkav.ai/api/chat',
    headers: {
      Authorization:
        'Bearer ' +
        'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.GuL2NVeQIZRR-EDvL3uig_RFNToLv1ZRUBD7xwHQgBvo5NQq2ycD_1GxG_v4LZ1HKLwPGELVR4XInNPXV8XN0g',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    // url: `${DOMAIN_NEW}/https://chatbot-bluezone.bkav.ai/api/chat`,
  };
  axios(options).then(response => {
    if (response && response.status === 200 && response.data.isOk === true) {
      // successCb && successCb(response);
    } else {
      // errorCb && errorCb(response);
    }
  }, createErrorFn(errorCb));
};

const retryUploadLogFile = (
  filePath,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry = TIME_RETRY_UPLOAD_HISTORY,
  optionMore,
) => {
  retryApi(
    (_success, _failure, numberRetry) => {
      uploadLogFile(filePath, _success, _failure, optionMore, numberRetry);
    },
    success,
    failure,
    timeRetry,
  );
};

const uploadLogFile = (
  filePath,
  success = _defaultFunc(),
  failure = _defaultFunc,
  optionMore = {},
  numberRetry,
) => {
  const _progress =
    typeof optionMore.progress === 'function'
      ? optionMore.progress
      : _defaultFunc;

  const {TokenFirebase, PhoneNumber} = configuration;

  const _success = e => {
    log.info(msg.UPLOAD_LOG_FILE_SUCCESS, e);
    success(e);
  };

  const _failure = e => {
    log.info(tmpl(msg.UPLOAD_LOG_FILE_ERROR, numberRetry), e);
    failure(e);
  };

  RNFetchBlob.fetch(
    'POST',
    `${DOMAIN}/api/AppLog/SaveFile`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/octet-stream',
    },
    [
      {
        name: 'history',
        filename: 'log.txt',
        type: 'text/xml',
        data: RNFetchBlob.wrap(filePath),
      },
      {name: 'TokenFirebase', data: TokenFirebase},
      {name: 'PhoneNumber', data: PhoneNumber},
    ],
  )
    .uploadProgress({interval: 100}, (written, total) => {
      _progress(written, total);
    })
    .then(response => {
      try {
        response.data =
          typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
      } catch (e) {
        log.info(tmpl(msg.PARSE_RESPONSE_BODY_FAILURE, 'LogFile'), response);
      }
      if (response.respInfo.status === 200 && response.data.isOk === true) {
        _success(response);
      } else {
        _failure(response);
      }
    })
    .catch(createErrorFn(_failure));
};

export {
  // Token firebase
  registerTokenFirebase,
  retryRegisterTokenFirebase,
  registerTokenFirebaseAgain,
  retryRegisterTokenFirebaseAgain,
  updateTokenFirebase,
  retryUpdateTokenFirebase,
  // Upload lich su tiep xuc
  retryUploadHistoryF12,
  uploadHistoryF01ByOTP,
  retryUploadHistoryF01ByOTP,
  retryUploadHistoryF01Auto,
  retryUploadLogFile,
  // Khai bao y te
  retryDeclaration,
  // Version
  getCheckVersions,
  // Dang ki so dien thoai
  CreateAndSendOTPCode,
  VerifyOTPCode,
  AddDeclareInformation,
  // Tin tuc
  getNews,
  getConfiguration,
  getResourceLanguage,
  getAnswerMessage,
  getQuestionFAQ,
};
