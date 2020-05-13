//
//  DBHelper.swift
//  CPMSMobileApp
//
//  Created by Dũng Đình on 4/11/20.
//

import Foundation
import SQLite3

class DBHelper {
    // let TIME_BACKUP =

    // Table
    let TABLE_NAME = "trace_info"

    // Column
    let COLUMN_ID = "_id"
    let COLUMN_USER_ID = "userid"
    let COLUMN_MAC_ID = "macid"
    let COLUMN_TIME = "timestamp"
    let COLUMN_RSSI = "rssi"
    let COLUMN_DEVICES = "devices"
    let COLUMN_TX_POWER = "tx_power"
    let COLUMN_STATE = "state"
    let COLUMN_BLID = "blid"

    // index
    static let COLUMN_INDEX_ID : Int32 = 0
    static let COLUMN_INDEX_USER_ID : Int32 = 1
    static let COLUMN_INDEX_MAC_ID : Int32 = 2
    static let COLUMN_INDEX_TIME : Int32 = 3
    static let COLUMN_INDEX_RSSI : Int32 = 4
    static let COLUMN_INDEX_DEVICES : Int32 = 5
    static let COLUMN_INDEX_TX_POWER : Int32 = 6
    static let COLUMN_INDEX_STATE : Int32 = 7
    static let COLUMN_INDEX_BLID : Int32 = 8
    // db
    var DATABASE_VERSION: Int = 1
    let dbPath: String = "app_db.db"  //.sqlite"
    var db:OpaquePointer?

    // Ham khoi tao
    init() {
        // Tao DB
        db = openDatabase()

        // Tao bang
        createTable()
    }

    /*
     * Tao bang
     */
    func createTable() {
        let createTableString = "CREATE TABLE IF NOT EXISTS \(TABLE_NAME) (\(COLUMN_ID) INTEGER PRIMARY KEY AUTOINCREMENT, \(COLUMN_USER_ID) TEXT, \(COLUMN_MAC_ID) TEXT, \(COLUMN_TIME) INTEGER, \(COLUMN_RSSI) INTEGER, \(COLUMN_DEVICES) TEXT);"
        var createTableStatement: OpaquePointer? = nil

        // Check ket noi ok
        if sqlite3_prepare_v2(db, createTableString, -1, &createTableStatement, nil) == SQLITE_OK {
            // Tao DB
            if sqlite3_step(createTableStatement) == SQLITE_DONE {
                print("CovidLogs table created.")
            } else {
                print("CovidLogs table could not be created.")
            }
        } else {
            print("CREATE TABLE statement could not be prepared.")
        }

        // remove statement when done
        sqlite3_finalize(createTableStatement)

        /// add new column if database is old version
        if getUserVersion() < DATABASE_VERSION {
            // add columns
            if addColumn(name: COLUMN_TX_POWER, type: DataType.INTEGER.rawValue, table: TABLE_NAME) && addColumn(name: COLUMN_STATE, type: DataType.INTEGER.rawValue, table: TABLE_NAME) && addColumn(name: COLUMN_BLID, type: DataType.TEXT.rawValue, table: TABLE_NAME) {
                setUserVersion()
            }
        }
    }

    /*
     * Open DB
     */
    func openDatabase() -> OpaquePointer? {
        // Doc url luu file
        let fileURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            .appendingPathComponent(dbPath)
        //
        var db: OpaquePointer? = nil

        // Check file mo
        if sqlite3_open(fileURL.path, &db) != SQLITE_OK {
            print("error opening database")
            return nil
        } else {
            print("Successfully opened connection to database at \(dbPath)")
            return db
        }
    }

    /*
     * Lay ban ghi cuoi cung
     */
    func getLastRecord() -> [CovidLog] {
        // Doc
        let queryStatementString = "SELECT * FROM \(TABLE_NAME) ORDER BY \(COLUMN_ID) DESC LIMIT 1;"
        var queryStatement: OpaquePointer? = nil
        var psns : [CovidLog] = []

        // Check ket noi ok
        if sqlite3_prepare_v2(db, queryStatementString, -1, &queryStatement, nil) == SQLITE_OK {
            while sqlite3_step(queryStatement) == SQLITE_ROW {
                let id = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_ID)
                let userId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_USER_ID)))
                let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_MAC_ID)))
                let timestamp = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_TIME)
                let RSSI = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_RSSI)

                psns.append(CovidLog(id: Int(id), userId:userId , macId:macId,timestamp: Int64(timestamp), rssi: Int32(RSSI)))
                print("Query Result:")
                print("\(id) | \(userId) | \(macId)")
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
    func insert(scan: CovidLog) {
        let insertStatementString = "INSERT INTO \(TABLE_NAME) (\(COLUMN_USER_ID), \(COLUMN_MAC_ID), \(COLUMN_TIME), \(COLUMN_RSSI)) VALUES (?, ?, ?, ?);"
        var insertStatement: OpaquePointer? = nil

        // Check
        if sqlite3_prepare_v2(db, insertStatementString, -1, &insertStatement, nil) == SQLITE_OK {
            //sqlite3_bind_int(insertStatement, 1, Int32(scan.id))
            sqlite3_bind_text(insertStatement, DBHelper.COLUMN_INDEX_USER_ID, (scan.mUserId as NSString).utf8String, -1, nil)
            sqlite3_bind_text(insertStatement, DBHelper.COLUMN_INDEX_MAC_ID, (scan.mMacId as NSString).utf8String, -1, nil)
            sqlite3_bind_int64(insertStatement, DBHelper.COLUMN_INDEX_TIME, scan.mTimestamp)
            sqlite3_bind_int(insertStatement, DBHelper.COLUMN_INDEX_RSSI, Int32(scan.mRssi))
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

        // Check backup db

    }

    /*
     * Thuc hien viec backup data
     */
    func backupData() {

    }

    /*
     * Doc du lieu
     */
    func read() -> [CovidLog] {
        let queryStatementString = "SELECT * FROM \(TABLE_NAME);"
        var queryStatement: OpaquePointer? = nil
        var psns : [CovidLog] = []

        // Check
        if sqlite3_prepare_v2(db, queryStatementString, -1, &queryStatement, nil) == SQLITE_OK {
            while sqlite3_step(queryStatement) == SQLITE_ROW {
                let id = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_ID)
                let userId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_USER_ID)))
                let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_MAC_ID)))
                let timestamp = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_TIME)
                let RSSI = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_RSSI)

                psns.append(CovidLog(id: Int(id), userId:userId , macId:macId, timestamp: Int64(timestamp), rssi: Int32(RSSI)))
                print("Query Result:")
                print("\(id) | \(userId) | \(macId)")
            }
        } else {
            print("SELECT statement could not be prepared")
        }
        sqlite3_finalize(queryStatement)

        return psns
    }

    /*
     * Xoa item theo id
     */
    func deleteByID(id: Int) {
        let deleteStatementStirng = "DELETE FROM \(TABLE_NAME) WHERE \(COLUMN_ID) = ?;"
        var deleteStatement: OpaquePointer? = nil

        // Check
        if sqlite3_prepare_v2(db, deleteStatementStirng, -1, &deleteStatement, nil) == SQLITE_OK {
            sqlite3_bind_int(deleteStatement, DBHelper.COLUMN_INDEX_ID, Int32(id))
            if sqlite3_step(deleteStatement) == SQLITE_DONE {
                print("Successfully deleted row.")
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
        if sqlite3_prepare_v2(db, "PRAGMA user_version;", -1, &getUserVersion, nil) == SQLITE_OK {
            while (sqlite3_step(getUserVersion)) == SQLITE_ROW {
                dbVersion = Int(sqlite3_column_int(getUserVersion, 0))
                print("current database version \(dbVersion)")
            }
        }
        sqlite3_finalize(getUserVersion)
        return dbVersion
    }

    // set database version to value of DATABASE_VERSION
    func setUserVersion() {
        let stringQuery = "PRAGMA user_version = \(DATABASE_VERSION);"
        var setUserVersion: OpaquePointer? = nil
        if sqlite3_prepare_v2(db, stringQuery, -1, &setUserVersion, nil) == SQLITE_OK {
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

        if sqlite3_prepare_v2(db, stringQuery, -1, &statement, nil) == SQLITE_OK {
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
