//
//  ContactLog.swift
//  TraceCovid
//
//  Created by TaiPV on 5/9/20.
//  Copyright © 2020 Bkav Corporation. All rights reserved.
//

import Foundation

class ContactLog {
    var mOwerBlId: Data?
    var mContactBlId: Data?
    var mMacId: String?
    var mRssi: Int32?
    var mTxPower: Int32?
    var mState: Int32?
    var mTimestamp: Int64?
}

protocol LogBuilderProtocol {
    func build() -> ContactLog
    func setOwerBlId(blId: Data) -> LogBuilder
    func setContactBlId(contactBlId: Data) -> LogBuilder
    func setMacId(macId: String) -> LogBuilder
    func setRssi(rssi: Int32) -> LogBuilder
    func setTxPower(tx: Int32) -> LogBuilder
    func setState(state: Int32) -> LogBuilder
    func setTimestamp(time: Int64) -> LogBuilder
}

class LogBuilder: LogBuilderProtocol {
    var dbLog: ContactLog
    
    init() {
        self.dbLog = ContactLog()
    }
    
    func build() -> ContactLog {
        return dbLog
    }
    
    func setOwerBlId(blId: Data) -> LogBuilder {
        dbLog.mOwerBlId = blId
        return self
    }
    
    func setContactBlId(contactBlId: Data) -> LogBuilder {
        dbLog.mContactBlId = contactBlId
        return self
    }
    
    func setMacId(macId: String) -> LogBuilder {
        dbLog.mMacId = macId
        return self
    }
    
    func setRssi(rssi: Int32) -> LogBuilder {
        dbLog.mRssi = rssi
        return self
    }
    
    func setTxPower(tx: Int32) -> LogBuilder {
        dbLog.mTxPower = tx
        return self
    }
    
    func setState(state: Int32) -> LogBuilder {
        dbLog.mState = state
        return self
    }
    
    func setTimestamp(time: Int64) -> LogBuilder {
        dbLog.mTimestamp = time
        return self
    }
}
