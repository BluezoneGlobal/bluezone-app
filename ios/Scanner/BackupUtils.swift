//
//  BackupUtils.swift
//  TraceCovid
//
//  Created by KhanhXu on 4/24/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import SQLite3

public class BackupUtils {
    // Path documents
    public static let PATH_COMPONENTS: String = "Documents"
    
    /*
     * write file contact log to file text (new thread)
     */
    public static func writeContactLogToFile(fileName: String = "") -> URL? {
        var database: String
        var output: String
        let pathDocuments = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        
        // path of database
        database = pathDocuments[0].appendingPathComponent("app_db_2.db").path
        
        if fileName.elementsEqual("") {
            output = pathDocuments[0].appendingPathComponent("ContactLog.txt").path
        } else {
            output = pathDocuments[0].appendingPathComponent(fileName).path
        }
        
        // neu co file roi thi xoa
        if FileManager.default.fileExists(atPath: output) {
            do {
                try FileManager.default.removeItem(atPath: output)
            } catch {
                print("error at remove output file: \(error.localizedDescription)")
                return nil
            }
        }
        
        var db: OpaquePointer?
        
        // query db va ghi
        if FileManager.default.fileExists(atPath: database) {
            // tao file
            FileManager.default.createFile(atPath: output, contents: nil, attributes: nil)
            
            // ghi ra output file
            if let fileUpdater = try? FileHandle(forUpdating: URL(string: output)!) {
                fileUpdater.seekToEndOfFile()
                
                // check connect den db
                if sqlite3_open(database, &db) == SQLITE_OK {
                    
                    // query tat ca trong bang CovidLogs trace_info
                    let queryString = "SELECT * FROM trace_info;"
                    var queryStatement: OpaquePointer? = nil

                    if sqlite3_prepare_v2(db, queryString, -1, &queryStatement, nil) == SQLITE_OK {
                        
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
                            
                            let rowString = "\(Array(blIdData))\t\(Array(contactBlIdData))\t\(macId)\t\(RSSI)\t\(txPower)\t\(state)\t\(timestamp)\n"

                            fileUpdater.write(rowString.data(using: .utf8)!)
                        }
                    } else {
                        print("Query returned no results.")
                    }
                    sqlite3_finalize(queryStatement)
                }
                
                fileUpdater.closeFile()
                
                return URL(fileURLWithPath: output)
            }
        }
        
        return nil
    }
    
//    /*
//     * write file db to file text (new thread)
//     */
//    public static func writeDbToText(outputFileName: String = "") -> URL? {
//        var database: String
//        var output: String
//        let pathDocuments = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
//
//        // path of database
//        database = pathDocuments[0].appendingPathComponent(AppConstant.BACKUP_DATABASE_NAME).path
//
//        if outputFileName.elementsEqual("") {
//            output = pathDocuments[0].appendingPathComponent("OutputFile.txt").path
//        } else {
//            output = pathDocuments[0].appendingPathComponent(outputFileName).path
//        }
//
//        // neu co file roi thi xoa
//        if FileManager.default.fileExists(atPath: output) {
//            do {
//                try FileManager.default.removeItem(atPath: output)
//            } catch {
//                print("error at remove output file: \(error.localizedDescription)")
//                return nil
//            }
//        }
//
//        var db: OpaquePointer?
//
//        // query db va ghi
//        if FileManager.default.fileExists(atPath: database) {
//            // tao file output
//            FileManager.default.createFile(atPath: output, contents: nil, attributes: nil)
//
//            // ghi ra output file
//            if let fileUpdater = try? FileHandle(forUpdating: URL(string: output)!) {
//                fileUpdater.seekToEndOfFile()
//
//                // check connect den db
//                if sqlite3_open(database, &db) == SQLITE_OK {
//
//                    // query tat ca trong bang CovidLogs trace_info
//                    let queryString = "SELECT * FROM trace_info;"
//                    var queryStatement: OpaquePointer? = nil
//
//                    if sqlite3_prepare_v2(db, queryString, -1, &queryStatement, nil) == SQLITE_OK {
//                        print("query all ok")
//                        while sqlite3_step(queryStatement) == SQLITE_ROW {
//                            //let id = sqlite3_column_int(queryStatement, DataBaseHelper.COLUMN_INDEX_ID)
//                            let userId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_USER_ID)))
//                            let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_MAC_ID)))
//                            let timestamp = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_TIME)
//                            let RSSI = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_RSSI)
//
//                            let blId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_BLID)))
//                            let txPower = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_TX_POWER)
//                            let state = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_STATE)
//                            // device khong co trong db
//                            let devices = ""
//
//                            let rowString = "\(blId)\t\(userId)\t\(macId)\t\(devices)\t\(RSSI)\t\(txPower)\t\(state)\t\(timestamp)\n"
//
//                            fileUpdater.write(rowString.data(using: .utf8)!)
//                        }
//                    } else {
//                        print("Query returned no results.")
//                    }
//                    sqlite3_finalize(queryStatement)
//                }
//
//                fileUpdater.closeFile()
//
//                return URL(fileURLWithPath: output)
//            }
//        }
//
//        return nil
//    }
//
//    /*
//     * Create file check server
//     */
//    public static func backupFileData(userId: [String]) -> Bool {
//        var ret = false;
//
//        // File manager
//        let fileManager = FileManager.default
//
//        // Folder document
//        let documentsUrl = fileManager.urls(for: .documentDirectory, in: .userDomainMask)
//
//        // Check url
//        guard documentsUrl.count != 0 else {
//            return ret
//        }
//
//        // File data trace
//        let dataTraceFile = documentsUrl.first!.appendingPathComponent(AppConstant.BACKUP_FILE_DATA_TRACE)
//
//        // neu co file backup thi xoa
//        if fileManager.fileExists(atPath: dataTraceFile.path)  {
//            do {
//                print("remove \(dataTraceFile)")
//                try fileManager.removeItem(at: dataTraceFile)
//            } catch {
//                print("error while removed file: \(error.localizedDescription)")
//            }
//        }
//
//        // DB Local
//        let localDb: DBHelper = DBHelper()
//
//        // Querry
//        let queryStatement: OpaquePointer? = localDb.readAll()
//
//        // check
//        if queryStatement != nil {
//            let blid = UserDefaults.standard.string(forKey: AppConstant.USER_DATA_PHONE_NUMBER) ?? ""
//            // read
//            while sqlite3_step(queryStatement) == SQLITE_ROW {
//                let blidDb = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_BLID)))
//                let userId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_USER_ID)))
//                let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, DBHelper.COLUMN_INDEX_MAC_ID)))
//                let timestamp = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_TIME)
//                let rssi = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_RSSI)
//                let tx_power = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_TX_POWER)
//                let state = sqlite3_column_int(queryStatement, DBHelper.COLUMN_INDEX_STATE)
//
//                // Log
//                print("\(userId) | \(macId) | \(timestamp)")
//
//                // Log
//                let item = "\(blidDb.count > 0 ? blidDb : blid)\t\(userId.count > 0 ? userId : "")\t\t\(rssi)\t\(tx_power)\t\(state)\t\(timestamp)\n"
//
//                // write
//                if !fileManager.fileExists(atPath: dataTraceFile.path) {
//                    do {
//                        try item.write(to: dataTraceFile, atomically: true, encoding: String.Encoding.utf8)
//                    } catch {
//                        print("error while write userId \(error.localizedDescription)")
//                    }
//                } else {
//                    if let fileUpdater = try? FileHandle(forUpdating: dataTraceFile) {
//                        fileUpdater.seekToEndOfFile()
//                        fileUpdater.write(item.data(using: .utf8)!)
//                        fileUpdater.closeFile()
//
//                        // ret
//                        ret = true;
//                    }
//                }
//            }
//
//            sqlite3_finalize(queryStatement)
//        }
//
//        return ret;
//    }
//
//    /*
//     * Tạo file chứa user id và backup lên icloud
//     */
//    public static func createAndBackupUserId(userId: String) -> Bool {
//        var ret = false;
//
//        // Check UserId
//        if userId.count == AppConstant.USER_ID_COUNT {
//
//            // File manager
//            let fileManager = FileManager.default
//
//            // Thư mục document
//            let documentsUrl = fileManager.urls(for: .documentDirectory, in: .userDomainMask)
//
//            // Tim đường dẫn
//            guard documentsUrl.count != 0 else {
//                return ret
//            }
//            // File Url
//            let userIdUrl = documentsUrl.first!.appendingPathComponent(AppConstant.BACKUP_FILE_USER_ID)
//
//            // Ghi userId vao file
//            do {
//                try userId.write(to: userIdUrl, atomically: true, encoding: String.Encoding.utf8)
//            } catch {
//                print("error while write userId \(error.localizedDescription)")
//            }
//
//            print(userIdUrl)
//            print(fileManager.fileExists(atPath: userIdUrl.path))
//
//            // icloud document
//            guard let icloudDocumentUrl = fileManager.url(forUbiquityContainerIdentifier: nil)?.appendingPathComponent(PATH_COMPONENTS, isDirectory: true) else {
//                return ret;
//            }
//
//            // Dir
//            var isDirectory: ObjCBool = false
//
//            // Update userId vao userId file in cloud document
//            if fileManager.fileExists(atPath: icloudDocumentUrl.path, isDirectory: &isDirectory) {
//                // File backup UserId
//                let backupFile = icloudDocumentUrl.appendingPathComponent(AppConstant.BACKUP_FILE_USER_ID)
//
//                // Log
//                print("write \(userId) to \(backupFile)")
//
//                // Neu chua co file tren icloud thi copy
//                if !fileManager.fileExists(atPath: backupFile.path) {
//                    do {
//                        print("copy from \(userIdUrl) to \(backupFile)")
//                        try fileManager.copyItem(at: userIdUrl, to: backupFile)
//
//                        // ret
//                        ret = true;
//                    } catch {
//                        print("error while copy file: \(error.localizedDescription)")
//                    }
//                } else {
//                    // Co file roi thi update user id vao file backup
//                    let newId = "\n\(userId)"
//
//                    // Check va luu
//                    if let fileUpdater = try? FileHandle(forUpdating: backupFile) {
//                        fileUpdater.seekToEndOfFile()
//                        fileUpdater.write(newId.data(using: .utf8)!)
//                        fileUpdater.closeFile()
//
//                        // ret
//                        ret = true;
//                    }
//                }
//            }
//        }
//
//        return ret;
//    }
//
//    /*
//     * Lay userId tu icloud neu co. Tra ve user id hoac "" neu khong co
//     */
//    public static func getUserIdFromCloud() -> String {
//
//        // Ret
//        var ret: String = ""
//
//        // File manager
//        let fileManager = FileManager.default
//
//        // Url document icloud
//        guard let icloudDocumentUrl = fileManager.url(forUbiquityContainerIdentifier: nil)?
//            .appendingPathComponent(PATH_COMPONENTS, isDirectory: true) else {
//            return ret
//        }
//
//        // Check file
//        if fileManager.fileExists(atPath: icloudDocumentUrl.path) {
//            // url file userID
//            let userIdURL = icloudDocumentUrl.appendingPathComponent(AppConstant.BACKUP_FILE_USER_ID)
//
//            // neu file userId ton tai thi doc va tra ve userId
//            if fileManager.fileExists(atPath: userIdURL.path) {
//                do {
//                    let contents = try String(contentsOfFile: userIdURL.path)
//
//                    // Log
//                    print("contents doc duoc \(contents)")
//
//                    // Lấy thông tin
//                    let lineData = contents.components(separatedBy: .newlines)
//
//                    // Tam thoi lay luon dong dau, hoac dung vong lap de lay cac dong sau
//                    for line: String in lineData {
//                        // Check
//                        if line.count == AppConstant.USER_ID_COUNT {
//                            ret = line
//                            break;
//                        }
//                    }
//                } catch {
//                    print(error.localizedDescription)
//                }
//            }
//        }
//
//        return ret
//    }
//
//    /*
//     * Copy vao icloud
//     */
//    public static func copyDatabase() {
//        // File manager
//        let fileManager = FileManager.default
//
//        let documentsUrl = fileManager.urls(for: .documentDirectory, in: .userDomainMask)
//
//        // Tim đường dẫn
//        guard documentsUrl.count != 0 else {
//            return
//        }
//
//        // file DB
//        let finalDatabaseURL = documentsUrl.first!.appendingPathComponent(AppConstant.BACKUP_DATABASE_NAME)
//
//        // icloud document
//        guard let icloudDocumentUrl = fileManager.url(forUbiquityContainerIdentifier: nil)?.appendingPathComponent(PATH_COMPONENTS, isDirectory: true) else {
//            return
//        }
//
//        // neu co file backup thi xoa
//        if fileManager.fileExists(atPath: icloudDocumentUrl.appendingPathComponent(AppConstant.BACKUP_FILE_NAME).path)  {
//            do {
//                let backupFile = icloudDocumentUrl.appendingPathComponent(AppConstant.BACKUP_FILE_NAME)
//                print("remove \(backupFile)")
//                try fileManager.removeItem(at: backupFile)
//            } catch {
//                print("error while removed file: \(error.localizedDescription)")
//            }
//        }
//
//        var isDirectory: ObjCBool = false
//
//        // copy file db vao document
//        if fileManager.fileExists(atPath: icloudDocumentUrl.path, isDirectory: &isDirectory) {
//            do {
//                let backupFile = icloudDocumentUrl.appendingPathComponent(AppConstant.BACKUP_FILE_NAME)
//                print("copy from \(finalDatabaseURL) to \(backupFile)")
//                try fileManager.copyItem(at: finalDatabaseURL, to: backupFile)
//            } catch {
//                print("error while copy file: \(error.localizedDescription)")
//            }
//        }
//    }
//
//    /*
//     * Download file backup tu icloud document
//     */
//    public static func downloadFileBackup() {
//        // File manager
//        let fileManager = FileManager.default
//        let iCloudDocumentsURL = FileManager.default.url(forUbiquityContainerIdentifier: nil)?.appendingPathComponent(PATH_COMPONENTS, isDirectory: true)
//
//        // File backup
//        let backupFileUrl = iCloudDocumentsURL?.appendingPathComponent(AppConstant.BACKUP_FILE_NAME, isDirectory: false)
//        let userIdUrl = iCloudDocumentsURL?.appendingPathComponent(AppConstant.BACKUP_FILE_USER_ID, isDirectory: false)
//
//        do {
//            try fileManager.startDownloadingUbiquitousItem(at: backupFileUrl!)
//            print("Downloading file: \(AppConstant.BACKUP_FILE_NAME)")
//
//            try fileManager.startDownloadingUbiquitousItem(at: userIdUrl!)
//            print("Downloading file: \(AppConstant.BACKUP_FILE_USER_ID)")
//        } catch let error as NSError {
//            print("DownloadFileBackup error \(error), \(error.userInfo)")
//        }
//    }
//
//    /*
//     * restore database, should run on new thread
//     */
//    public static func restoreDatabase() {
//        // File manager
//        let fileManager = FileManager.default
//
//        // DB Local
//        let localDb: DBHelper = DBHelper()
//
//        var db: OpaquePointer?
//
//        // url document icloud
//        guard let icloudDocumentUrl = fileManager.url(forUbiquityContainerIdentifier: nil)?
//            .appendingPathComponent("Documents", isDirectory: true) else {
//            return
//        }
//
//        // Check file exist
//        if fileManager.fileExists(atPath: icloudDocumentUrl.path) {
//
//            // url file backup
//            let backupFileURL = icloudDocumentUrl.appendingPathComponent(AppConstant.BACKUP_FILE_NAME)
//
//            // Neu file backup ton tai thi query va ghi vao db hien tai
//            if fileManager.fileExists(atPath: backupFileURL.path) {
//                // check connect den file backup
//                if sqlite3_open(backupFileURL.path, &db) == SQLITE_OK {
//                    print("ket noi den file backup thanh cong")
//                    do {
//                        let attr: NSDictionary = try fileManager.attributesOfItem(atPath: backupFileURL.path) as NSDictionary
//                        print("size of file: \(attr.fileSize())")
//                    } catch {
//                        print(error.localizedDescription)
//                    }
//                    // query tat ca trong bang CovidLogs trace_info
//                    let queryStatementString = "SELECT * FROM trace_info;"
//                    var queryStatement: OpaquePointer? = nil
//
//                    // Check and insert
//                    if sqlite3_prepare_v2(db, queryStatementString, -1, &queryStatement, nil) == SQLITE_OK {
//
//                        // Log
//                        print("query all ok")
//
//                        // Querry
//                        while sqlite3_step(queryStatement) == SQLITE_ROW {
//                            let id = sqlite3_column_int(queryStatement, 0)
//                            let userId = String(describing: String(cString: sqlite3_column_text(queryStatement, 1)))
//                            let macId = String(describing: String(cString: sqlite3_column_text(queryStatement, 2)))
//                            let timestamp = sqlite3_column_int(queryStatement, 3)
//                            let RSSI = sqlite3_column_int(queryStatement, 4)
//
//                            print("inserted:")
//                            print("\(id) | \(userId) | \(macId)")
//
//                            // query duoc thi insert luon vao db hien tai
//                            localDb.insert(scan: CovidLog(id: Int(id), userId:userId , macId:macId, timestamp: Int64(timestamp), rssi: Int32(RSSI)))
//                        }
//                    } else {
//                        print("Query returned no results.")
//                    }
//
//                    sqlite3_finalize(queryStatement)
//                }
//            }
//        }
//
//    }
}
