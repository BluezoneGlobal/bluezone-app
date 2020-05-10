//
//  ScannerManagerModule.m
//  CPMSMobileApp
//
//  Created by Dũng Đình on 4/10/20.
//


#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(ScannerManager, RCTViewManager)
RCT_EXTERN_METHOD(startService)
RCT_EXTERN_METHOD(stopService)
RCT_EXTERN_METHOD(setId:(NSString *) userId)
RCT_EXTERN_METHOD(onSetTimeDelay:(NSInteger *) userId)
RCT_EXTERN_METHOD(generatorBluezoneId: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBluezoneId: (RCTPromiseResolveBlock)resolve
rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setMaxNumberSubKey:(NSInteger *) maxSubKey)
@end

@interface RCT_EXTERN_MODULE(TraceCovid, RCTEventEmitter)
RCT_EXTERN_METHOD(onGetUUId: (String)value)
@end
