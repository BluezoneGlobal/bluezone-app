//
//  BluezoneIdConstants.swift
//  TraceCovid
//
//  Created by KhanhXu on 5/8/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation

class BluezoneIdConstants {
    
    static let DAY_MILLISECONDS: TimeInterval = 24 * 60 * 60;

    // Constant config
    class Config {
        // Rolling ID
        public static let IS_ROLLING_ID: Bool = true

        // Length Blid
        public static let LENGTH_BLID: Int = 12 // Byte
        
        // Length byte create id
        public static let LENGTH_BYTE: UInt64 = 256

        // Char random
        public static let CHAR_RANDOM: String = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        
        // Salt Subkey
        private static let SALT_SUB_KEY_DAILY_STRING: String = "bluzonesubkey"

        // Salt Subkey
        public static let SALT_SUB_KEY_DAILY: [UInt8] = SALT_SUB_KEY_DAILY_STRING.utf8.map{UInt8($0)}

        // Max number subkey daily
        public static let MAX_NUMBER_SUB_KEY_PER_DAY: Int = 24 * 4;
    }
    
    // Constant UserDefaults
    class UserDefaults {
        // Save bluezone base id
        public static let BLUEZONE_BASE_ID: String = "pre_bluezone_base_id"

        // Save bluezone daily id
        public static let BLUEZONE_DAILY_ID: String = "pre_bluezone_daily_id"

        // Save max number subkey per day
        public static let MAX_NUMBER_SUB_KEY_PER_DAY: String = "pre_max_number_sub_key_per_day"
    }
}
