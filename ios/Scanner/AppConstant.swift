//
//  AppConstant.swift
//  TraceCovid
//
//  Created by KhanhXu on 4/8/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import CoreBluetooth

class AppConstant {
    // User data
    public static let USER_DATA_PHONE_NUMBER = "app_phone_number"

    // Bluetooth
    public static let BLUEZONE_UUID = "4E56"; // VN
    public static let BLE_UUID_ANDROID = CBUUID(string: "0000\(BLUEZONE_UUID)-0000-1000-8000-00805F9B34FB")
    public static let BLE_UUID_IOS = CBUUID(string: "0000\(BLUEZONE_UUID)-73F5-4BC4-A12F-17D1AD07A667")
    public static let BLE_CHAR_UUID = CBUUID(string: "0000\(BLUEZONE_UUID)-73F5-4BC4-A12F-17D1AD07A689")
    //public static let BLE_UUID_ANDROID = CBUUID(string: "E20A39F4-73F5-4BC4-A12F-17D1AD07A889")

    // Khai bao de khởi động lại
    public static let RESTORE_KEY_IDENTIFIER_CENTRAL = "com.bkav.ble.central"
    public static let RESTORE_KEY_IDENTIFIER_PERIPHARAL = "com.bkav.ble.peripharal"

    // Backup
    public static let PATH_APP = "Bluezone"
    public static let BACKUP_DATABASE_NAME = "app_db_2.db"
    public static let BACKUP_FOLDER = "backup"


}
