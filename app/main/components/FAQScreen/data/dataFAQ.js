/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 15/09/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import {getQuestionFAQ as getQuestionFAQAPI} from '../../../../core/apis/bluezone';
import {setQuestionFAQ, getQuestionFAQ} from '../../../../core/storage';
import dataFAQ from '../dataFAQ.json';

const _defaultFunc = () => {};

const syncQuestionFAQ = async (
  success = _defaultFunc,
  failure = _defaultFunc,
) => {
  const FAQStorage = await getQuestionFAQ();
  let syncFAQ = dataFAQ;
  if (FAQStorage) {
    syncFAQ = FAQStorage;
  }

  const _success = FAQApi => {
    // >
    if (FAQApi.version !== syncFAQ.version) {
      setQuestionFAQ(FAQApi);
      syncFAQ = FAQApi;
    }

    success(syncFAQ);
  };

  const _failre = () => {
    success(syncFAQ);
  };

  return getQuestionFAQAPI(_success, _failre);
};

export default dataFAQ;

export {syncQuestionFAQ};
