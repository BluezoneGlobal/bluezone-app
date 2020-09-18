//
//  BluezoneIdTrace.swift
//  Bluezone
//
//  Created by Bkav  BSO on 7/25/20.
//

import Foundation
import SQLite3

class BluezoneIdTrace {

    /// Lấy thông tin người nhiễm COVID-19
    static func getBluezoneIdInfo() -> String {
        var ret: String = ""
        let bluezoneDailyKey = BluezoneIdGenerator.init().getBluezoneBaseId();
        if bluezoneDailyKey.data.count > 0 {
          let bluezoneIdInfo : [String: Any] = [BluezoneIdConstants.TraceInfo.JSON_BLUEZONE_BASE_ID: bluezoneDailyKey.data.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)),
                                            BluezoneIdConstants.TraceInfo.JSON_BLUEZONE_BASE_ID_TIME: bluezoneDailyKey.bluezoneDate.getTimeStart()]
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: bluezoneIdInfo, options: [])
                ret = String(data: jsonData, encoding: String.Encoding.ascii)!
            } catch {

            }
        }

        return ret
    }

    /// Lấy thông tin người nhiễm COVID-19
    static func getBluezoneIdInfo(dayStartTrace: Int) -> String {
        var ret: String = ""
        let bluezoneDailyKey = BluezoneIdGenerator.init().getBluezoneBaseId();
        // Lay thong tin người nhiễm COVID-19
        let bluezoneDailyKeyDx = BluezoneIdGenerator.init().createBluezoneDailyKey(dayStart: dayStartTrace)
        if bluezoneDailyKey.data.count > 0 && bluezoneDailyKeyDx.data.count > 0 {



            let bluezoneIdInfo : [String: Any] = [BluezoneIdConstants.TraceInfo.JSON_BLUEZONE_BASE_ID: bluezoneDailyKey.data.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)),
                                            BluezoneIdConstants.TraceInfo.JSON_BLUEZONE_BASE_ID_TIME: bluezoneDailyKey.bluezoneDate.getTimeStart(),
                                            BluezoneIdConstants.TraceInfo.JSON_F0_DAILY_KEY: bluezoneDailyKeyDx.data.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)),
                                            BluezoneIdConstants.TraceInfo.JSON_F0_TIME_DK: bluezoneDailyKeyDx.bluezoneDate.getTimeStart()]
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: bluezoneIdInfo, options: [])
                ret = String(data: jsonData, encoding: String.Encoding.ascii)!
            } catch {

            }
        }

        return ret
    }

    /// Export  data
    public static func exportTraceData() -> URL? {
        var database: String
        var output: URL
        let pathDocuments = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)

        // path of database
        database = pathDocuments[0].appendingPathComponent(ContactLogDBHelper.DATABASE_NAME).path
        output = pathDocuments[0].appendingPathComponent(BluezoneIdConstants.TraceInfo.FILE_NAME_TRACE_DATA)

        // neu co file roi thi xoa
      if FileManager.default.fileExists(atPath: output.path) {
            do {
              try FileManager.default.removeItem(atPath: output.path)
            } catch {
                print("error at remove output file: \(error.localizedDescription)")
                return nil
            }
        }

        var db: OpaquePointer?

        // query db va ghi
        if FileManager.default.fileExists(atPath: database) {
          FileManager.default.createFile(atPath: output.path, contents: nil, attributes: nil)

            // ghi ra output file
            if let fileUpdater = try? FileHandle(forUpdating: output) {
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

                            // timestamp
                            let timestamp = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_TIME)

                            // rssi
                            let RSSI = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_RSSI)

                            let rowString = "\(blIdData.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)))\t\(contactBlIdData.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)))\t\(RSSI)\t\(timestamp)\n"

                            fileUpdater.write(rowString.data(using: .utf8)!)
                        }
                    } else {
                        print("Query returned no results.")
                    }
                    sqlite3_finalize(queryStatement)
                }

                fileUpdater.closeFile()

                return output
            }
        }

        return nil
    }

    /// Export  data
    public static func exportTraceData(dayStartTrace: Int) -> URL? {
        var database: String
        var output: String
        let pathDocuments = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)

        // path of database
        database = pathDocuments[0].appendingPathComponent(ContactLogDBHelper.DATABASE_NAME).path
        output = pathDocuments[0].appendingPathComponent(BluezoneIdConstants.TraceInfo.FILE_NAME_TRACE_DATA).path

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
                    let timeEnd = Double(Double(Date().currentTime()) - (Double(dayStartTrace) * BluezoneIdConstants.DAY_MILLISECONDS))
                    // query tat ca trong bang CovidLogs trace_info
                    let queryString = "SELECT * FROM trace_info WHERE timestamp >= \(timeEnd);"
                    var queryStatement: OpaquePointer? = nil

                    if sqlite3_prepare_v2(db, queryString, -1, &queryStatement, nil) == SQLITE_OK {

                        while sqlite3_step(queryStatement) == SQLITE_ROW {

                            // get blid owner
                            var blIdData: Data = Data()
                            let blIdCount = sqlite3_column_bytes(queryStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID)

                            if let blId = sqlite3_column_blob(queryStatement, ContactLogDBHelper.COLUMN_INDEX_OWNER_BLID), blIdCount > 0 {
                                blIdData = Data(bytes: blId, count: Int(blIdCount))
                            }

                            // get blid contact
                            var contactBlIdData: Data = Data()
                            let contactBlIdCount = sqlite3_column_bytes(queryStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID)

                            if let blId2 = sqlite3_column_blob(queryStatement, ContactLogDBHelper.COLUMN_INDEX_CONTACT_BLID), contactBlIdCount > 0 {
                                contactBlIdData = Data(bytes: blId2, count: Int(contactBlIdCount))
                            }

                            // timestamp
                            let timestamp = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_TIME)

                            // rssi
                            let RSSI = sqlite3_column_int(queryStatement, ContactLogDBHelper.COLUMN_INDEX_RSSI)

                            let rowString = "\(blIdData.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)))\t\(contactBlIdData.hexEncodedString(options: Data.HexEncodingOptions(rawValue: 1)))\t\(RSSI)\t\(timestamp)\n"

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

    /// Check Contact
    static func isContactF(dataF0: String) -> Bool {
        var ret: Bool = false
        if dataF0.count > 0 {
            let jsonData = dataF0.data(using: String.Encoding.utf8)
            let jsonDecoder = JSONDecoder()
            let jsonDataF0 = try? jsonDecoder.decode(DataF0.self, from: jsonData!)
            if jsonDataF0 != nil {
                let data: [DataF0One] = jsonDataF0!.data
                if !(data.isEmpty) {
                    for f0 in data {
                        if checkContactF(bluezoneDailyKeyk: f0.dailyKey, timeDk: f0.timeDk, max: f0.max, timeTe: f0.timeTe) {
                            ret = true
                            break
                        }
                    }
                }
            }
        }

        return ret
    }

    /// Find Fx
    static func checkContactF(bluezoneDailyKeyk: String, timeDk: Double, max: Int, timeTe: Double) -> Bool {
        var ret: Bool = false

        //  Convert Hex -> Bytes, Create SubKey
        var dataCreateFirstSubKey: Data = Data(hexString: bluezoneDailyKeyk)!
        var bluezoneSubKey: Data = dataCreateFirstSubKey
        bluezoneSubKey.append(contentsOf: BluezoneIdConstants.Config.SALT_SUB_KEY_DAILY)

        var timeNext: Double = timeDk
        let delta: Double = BluezoneIdConstants.DAY_MILLISECONDS / Double(max)
        var i: Int = 0;

        // Find Fx
        while (timeNext <= timeTe) {
            bluezoneSubKey = BluezoneIdUtils.sha256(bluezoneSubKey);
            let bluezoneId: Data = BluezoneIdGenerator.convertBluezoneSubKeyToBluezoneId(bluezoneSubKey)
            let timeStart = timeNext
            timeNext = timeNext + delta
            let timeEnd = timeNext

            let logDB = ContactLogDBHelper()
            if logDB.isTrace(bluezoneID: bluezoneId, timeStart: Int64(timeStart), timeEnd: Int64(timeEnd)) {
                ret = true;
                break;
            }

            i += 1

            // Check time next day
            if (i == max) {
                dataCreateFirstSubKey = BluezoneIdUtils.sha256(dataCreateFirstSubKey);
                bluezoneSubKey = dataCreateFirstSubKey
                bluezoneSubKey.append(contentsOf: BluezoneIdConstants.Config.SALT_SUB_KEY_DAILY)
                i = 0;
            }
        }

        return ret
    }
}

struct DataF0: Decodable {
    var data: [DataF0One]
}

struct DataF0One: Decodable {
    var dailyKey: String
    var timeDk: TimeInterval
    var max: Int
    var timeTe: TimeInterval

    enum CodingKeys: String, CodingKey {
        case dailyKey = "daily_key"
        case timeDk = "time_start"
        case max
        case timeTe = "time_end"
    }

}

extension Data {
    init?(hexString: String) {
        let length = hexString.count / 2
        var data = Data(capacity: length)
        for i in 0 ..< length {
            let j = hexString.index(hexString.startIndex, offsetBy: i * 2)
            let k = hexString.index(j, offsetBy: 2)
            let bytes = hexString[j..<k]
            if var byte = UInt8(bytes, radix: 16) {
                data.append(&byte, count: 1)
            } else {
                return nil
            }
        }
        self = data
    }
}

