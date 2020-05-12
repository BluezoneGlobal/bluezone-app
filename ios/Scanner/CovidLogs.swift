//
//  ScanLog.swift
//  CPMSMobileApp
//
//  Created by Dũng Đình on 4/11/20.
//

import Foundation

class CovidLog {
    var mId: Int
    var mUserId: String
    var mMacId: String
    var mDevices: String
    var mRssi: Int32
    var mTimestamp: Int64
    var mTxPower: Int32 = 0
    var mState: Int32 = 0
    var mBlId: String = ""
   
    
    init(id: Int, userId: String, macId: String, timestamp: Int64, rssi: Int32) {
        self.mId = id
        self.mUserId = userId
        self.mMacId = macId
        self.mTimestamp = timestamp
        self.mRssi = rssi
        self.mDevices = ""
    }
  
    init(userId: String, timestamp: Int64, rssi: Int32) {
        self.mId = -1
        self.mUserId = userId
        self.mMacId = ""
        self.mTimestamp = timestamp
        self.mRssi = rssi
        self.mDevices = ""
    }
  
    init(macId: String, timestamp: Int64, rssi: Int32) {
        self.mId = -1
        self.mUserId = ""
        self.mMacId = macId
        self.mTimestamp = timestamp
        self.mRssi = rssi
        self.mDevices = ""
    }
  
    init(userId: String,macId: String, timestamp: Int64, rssi: Int32) {
        self.mId = -1
        self.mUserId = userId
        self.mMacId = macId
        self.mTimestamp = timestamp
        self.mRssi = rssi
        self.mDevices = ""
    }
    
    init(userId: String,macId: String, timestamp: Int64, rssi: Int32, tx: Int32, state: Int32, blId: String) {
        self.mId = -1
        self.mUserId = userId
        self.mMacId = macId
        self.mTimestamp = timestamp
        self.mRssi = rssi
        self.mDevices = ""
        self.mBlId = blId
        self.mTxPower = tx
        self.mState = state
    }
}
