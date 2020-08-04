//
//  ContactLogDBHelper.swift
//  TraceCovid
//
//  Created by TaiPV on 5/9/20.
//  Copyright © 2020 Bkav Corporation. All rights reserved.
//

import Foundation
import SQLite3

enum DataType: String {
    case NULL
    case INTEGER
    case TEXT
    case REAL
    case BLOB
}

public class ContactLogDBHelper {
    
    // contact table name
    let CONTACT_LOG_TABLE = "trace_info"
    
    // Column
    let COLUMN_ID = "_id"
    let COLUMN_OWNER_BLID = "blid"
    let COLUMN_CONTACT_BLID = "blid_contact"
    let COLUMN_MAC_ID = "macid"
    let COLUMN_RSSI = "rssi"
    let COLUMN_TX_POWER = "tx_power"
    let COLUMN_STATE = "state"
    let COLUMN_TIME = "timestamp"
    
    // Index
    static let COLUMN_INDEX_ID: Int32 = 0
    static let COLUMN_INDEX_OWNER_BLID: Int32 = 1
    static let COLUMN_INDEX_CONTACT_BLID: Int32 = 2
    static let COLUMN_INDEX_MAC_ID: Int32 = 3
    static let COLUMN_INDEX_RSSI: Int32 = 4
    static let COLUMN_INDEX_TX_POWER: Int32 = 5
    static let COLUMN_INDEX_STATE: Int32 = 6
    static let COLUMN_INDEX_TIME: Int32 = 7
    
    // db version
    var DATABASE_VERSION: Int = 0
    // db name
    public static let DATABASE_NAME: String = "app_db_2.db"
    // db pointer
    var dbPointer: OpaquePointer?
    
    // init
    init() {
        // open db
        dbPointer = openDatabase()
        
        // create contact log table
        createLogTable()
    }
    
    // open connection to file db
    func openDatabase() -> OpaquePointer? {
        // Doc url luu file
          let fileURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            .appendingPathComponent(ContactLogDBHelper.DATABASE_NAME)
          //
          var db: OpaquePointer? = nil
        
          // Check file mo
          if sqlite3_open(fileURL.path, &db) != SQLITE_OK {
              print("Error while opening database")
              return nil
          } else {
            print("Successfully opened connection to database at \(fileURL.path)")
              return db
          }
    }
    
    // create table
    func createLogTable() {
        // query statement
        let createLogTable = "CREATE TABLE IF NOT EXISTS \(CONTACT_LOG_TABLE) (\(COLUMN_ID) \(DataType.INTEGER.rawValue) PRIMARY KEY AUTOINCREMENT, \(COLUMN_OWNER_BLID) \(DataType.BLOB.rawValue), \(COLUMN_CONTACT_BLID) \(DataType.BLOB.rawValue), \(COLUMN_MAC_ID) \(DataType.TEXT.rawValue), \(COLUMN_RSSI) \(DataType.INTEGER.rawValue), \(COLUMN_TX_POWER) \(DataType.INTEGER.rawValue), \(COLUMN_STATE) \(DataType.INTEGER.rawValue), \(COLUMN_TIME) \(DataType.INTEGER.rawValue));"
        
        print(createLogTable)
        
        var createLogTableStatement: OpaquePointer? = nil
        
        // Check ket noi ok
        if sqlite3_prepare_v2(dbPointer, createLogTable, -1, &createLogTableStatement, nil) == SQLITE_OK {
            // Tao DB
            if sqlite3_step(createLogTableStatement) == SQLITE_DONE {
                print("Contact Log table created.")
            } else {
                print("Contact Log table could not be created.")
            }
        } else {
            print("CREATE TABLE statement could not be prepared.")
        }
        // remove statement when done
        sqlite3_finalize(createLogTableStatement)
    }
    
    /*
     * Lay ban ghi cuoi cung
     */
    func getLastRecord() -> [ContactLog] {
        // Doc
        let queryStatementString = "SELECT * FROM \(CONTACT_LOG_TABLE) ORDER BY \(COLUMN_ID) DESC LIMIT 1;"
        var queryStatement: OpaquePointer? = nil
        var psns : [ContactLog] = []
        
        // Check ket noi ok
        if sqlite3_prepare_v2(dbPointer, queryStatementString, -1, &queryStatement, nil) == SQLITE_OK {
            while sqlite3_step(queryStatement) == SQLITE_ROW {
                
                // get blid owner
                var blIdData: Data = Data()
                let blIdCount = sqlite3_column_bytes(queryStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID)
                
                if let blId = sqlite3_column_blob(queryStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID), blIdCount > 0 {
                    blIdData = Data(bytes: blId, count: Int(blIdCount))
                }
                
                // get blid owner
                var contactBlIdData: Data = Data()
                let contactBlIdCount = sqlite3_column_bytes(queryStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID)
                
                if let blId = sqlite3_column_blob(queryStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID), blIdCount > 0 {
                    contactBlIdData = Data(bytes: blId, count: Int(contactBlIdCount))
                }
                
                // get mac id
                let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, ContactLogDBHelper.COLUMN_INDEX_MAC_ID)))
                
                // timestamp
                let timestamp = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_TIME)
                
                // rssi
                let RSSI = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_RSSI)
                
                // tx
                let txPower = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_TX_POWER)
                
                // state
                let state = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_STATE)
                
                let logBuilder = LogBuilder()
                
                let contactLog = logBuilder.setOwerBlId(blId: blIdData)
                    .setContactBlId(contactBlId: contactBlIdData)
                    .setMacId(macId: macId)
                    .setRssi(rssi: RSSI)
                    .setTxPower(tx: txPower)
                    .setState(state: state)
                    .setTimestamp(time: Int64(timestamp))
                    .build()

                psns.append(contactLog)
            }
        } else {
            print("SELECT statement could not be prepared")
        }
        sqlite3_finalize(queryStatement)
      
        return psns
    }
    
    /*
     * insert db
     */
    func insert(scan: ContactLog) {
        let insertStatementString = "INSERT INTO \(CONTACT_LOG_TABLE) (\(COLUMN_OWNER_BLID), \(COLUMN_CONTACT_BLID), \(COLUMN_MAC_ID), \(COLUMN_RSSI), \(COLUMN_TX_POWER), \(COLUMN_STATE), \(COLUMN_TIME)) VALUES (?, ?, ?, ?, ?, ?, ?);"
        var insertStatement: OpaquePointer? = nil
      
        // Check
        if sqlite3_prepare_v2(dbPointer, insertStatementString, -1, &insertStatement, nil) == SQLITE_OK {
            
            // insert blid owner
            sqlite3_bind_blob(insertStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID, Array(scan.mOwerBlId!), Int32(scan.mOwerBlId!.count), nil)
            
            // insert blid owner
            sqlite3_bind_blob(insertStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID, Array(scan.mContactBlId!), Int32(scan.mContactBlId!.count), nil)
            
            // mac id
            sqlite3_bind_text(insertStatement, ContactLogDBHelper.COLUMN_INDEX_MAC_ID, (scan.mMacId! as NSString).utf8String, -1, nil)
            
            sqlite3_bind_int(insertStatement, ContactLogDBHelper.COLUMN_INDEX_RSSI, Int32(scan.mRssi!))
            
            sqlite3_bind_int(insertStatement, ContactLogDBHelper.COLUMN_INDEX_TX_POWER, Int32(scan.mTxPower!))
            sqlite3_bind_int(insertStatement, ContactLogDBHelper.COLUMN_INDEX_STATE, Int32(scan.mState!))
            
            sqlite3_bind_int64(insertStatement, ContactLogDBHelper.COLUMN_INDEX_TIME, scan.mTimestamp!)
            
            let status = sqlite3_step(insertStatement)
            
            if status == SQLITE_DONE {
                print("Successfully inserted row.")
            } else {
                print("Could not insert row.\(status)")
            }
        } else {
            print("INSERT statement could not be prepared.")
        }
      
        sqlite3_finalize(insertStatement)
    }
    
    /*
     * Doc du lieu
     */
    func read() -> [ContactLog] {
        let queryStatementString = "SELECT * FROM \(CONTACT_LOG_TABLE);"
        var queryStatement: OpaquePointer? = nil
        var psns : [ContactLog] = []
      
        // Check
        if sqlite3_prepare_v2(dbPointer, queryStatementString, -1, &queryStatement, nil) == SQLITE_OK {
            while sqlite3_step(queryStatement) == SQLITE_ROW {
                
                // get blid owner
                var blIdData: Data = Data()
                let blIdCount = sqlite3_column_bytes(queryStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID)
                
                if let blId = sqlite3_column_blob(queryStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID), blIdCount > 0 {
                    blIdData = Data(bytes: blId, count: Int(blIdCount))
                }
                
                // get blid owner
                var contactBlIdData: Data = Data()
                let contactBlIdCount = sqlite3_column_bytes(queryStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID)
                
                if let blId = sqlite3_column_blob(queryStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID), blIdCount > 0 {
                    contactBlIdData = Data(bytes: blId, count: Int(contactBlIdCount))
                }
                
                // get mac id
                let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, ContactLogDBHelper.COLUMN_INDEX_MAC_ID)))
                
                // timestamp
                let timestamp = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_TIME)
                
                // rssi
                let RSSI = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_RSSI)
                
                // tx
                let txPower = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_TX_POWER)
                
                // state
                let state = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_STATE)
                
                let logBuilder = LogBuilder()
                
                let contactLog = logBuilder.setOwerBlId(blId: blIdData)
                    .setContactBlId(contactBlId: contactBlIdData)
                    .setMacId(macId: macId)
                    .setRssi(rssi: RSSI)
                    .setTxPower(tx: txPower)
                    .setState(state: state)
                    .setTimestamp(time: Int64(timestamp))
                    .build()

                psns.append(contactLog)
            }
        } else {
            print("SELECT statement could not be prepared")
        }
        sqlite3_finalize(queryStatement)
      
        return psns
    }
    
    /**
    * is Trace
    * @param bluezoneId
    * @return
    */
    func isTrace(bluezoneID: Data, timeStart: Int64, timeEnd: Int64) -> Bool {
        let hexStringData = bluezoneID.hexEncodedString()
        let queryStatementString = "SELECT * FROM \(CONTACT_LOG_TABLE) WHERE hex(\(COLUMN_CONTACT_BLID)) LIKE '\(hexStringData)' AND \(COLUMN_TIME) BETWEEN \(timeStart) AND \(timeEnd);"
        var queryStatement: OpaquePointer? = nil
        var isTrace: Bool = false
        
        if sqlite3_prepare_v2(dbPointer, queryStatementString, -1, &queryStatement, nil) == SQLITE_OK {
            if sqlite3_step(queryStatement) == SQLITE_ROW {
                isTrace = true
            }
        } else {
            print("SELECT statement could not be prepared")
        }
        sqlite3_finalize(queryStatement)
        
        return isTrace
    }
        
    /*
     * Xoa tat ca
     */
    func deleteAll() {
        let deleteStatementStirng = "DELETE FROM \(CONTACT_LOG_TABLE);"
        var deleteStatement: OpaquePointer? = nil
      
        // Check
        if sqlite3_prepare_v2(dbPointer, deleteStatementStirng, -1, &deleteStatement, nil) == SQLITE_OK {
            if sqlite3_step(deleteStatement) == SQLITE_DONE {
                print("Successfully deleted all.")
            } else {
                print("Could not delete row.")
            }
        } else {
            print("DELETE statement could not be prepared")
        }
        
        sqlite3_finalize(deleteStatement)
    }
    
    // get current version of database
    func getUserVersion() -> Int {
        var dbVersion: Int = -1
        var getUserVersion: OpaquePointer? = nil
        if sqlite3_prepare_v2(dbPointer, "PRAGMA user_version;", -1, &getUserVersion, nil) == SQLITE_OK {
            while (sqlite3_step(getUserVersion)) == SQLITE_ROW {
                dbVersion = Int(sqlite3_column_int(getUserVersion, 0))
                print("current database version \(dbVersion)")
            }
        }
        sqlite3_finalize(getUserVersion)
        return dbVersion
    }
    
    // set database version to value of DATABASE_VERSION
    func setUserVersion(version: Int) {
        let stringQuery = "PRAGMA user_version = \(version);"
        var setUserVersion: OpaquePointer? = nil
        if sqlite3_prepare_v2(dbPointer, stringQuery, -1, &setUserVersion, nil) == SQLITE_OK {
            while (sqlite3_step(setUserVersion)) == SQLITE_DONE {
                print("database version updated")
            }
        }
        sqlite3_finalize(setUserVersion)
    }
    
    /// add column to database
    func addColumn(name columnName: String, type dataType: String, table tableName: String) -> Bool {
        let stringQuery = "ALTER TABLE " + tableName + " ADD COLUMN " + columnName + " " + dataType + ";"
        print("add column query \(stringQuery)")
        var statement: OpaquePointer? = nil
        
        if sqlite3_prepare_v2(dbPointer, stringQuery, -1, &statement, nil) == SQLITE_OK {
            if sqlite3_step(statement) == SQLITE_DONE {
                print("Successfully add column \(columnName)")
                sqlite3_finalize(statement)
                return true
            } else {
                print("Could not add column")
            }
        }
        
        return false
    }
}
