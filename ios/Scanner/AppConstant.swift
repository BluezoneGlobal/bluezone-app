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
    public static let BLE_UUID_IOS = CBUUID(string: "E20A39F4-73F5-4BC4-A12F-17D1AD07A667")
    public static let BLE_UUID_ANDROID = CBUUID(string: "E20A39F4-73F5-4BC4-A12F-17D1AD07A889")
    public static let BLE_CHAR_UUID = CBUUID(string: "08590F7E-DB05-467E-8757-72F6FAEB13D4") // characteristic

    // Khai bao de khởi động lại
    public static let RESTORE_KEY_IDENTIFIER_CENTRAL = "com.bkav.ble.central"
    public static let RESTORE_KEY_IDENTIFIER_PERIPHARAL = "com.bkav.ble.peripharal"
  
    // Backup
    public static let PATH_APP = "Bluezone"
    public static let BACKUP_DATABASE_NAME = "app_db.db"
    public static let BACKUP_FOLDER = "backup"
  
    
}
