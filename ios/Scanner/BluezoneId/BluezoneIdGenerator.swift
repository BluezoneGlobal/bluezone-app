//
//  BluezonerIdGenerator.swift
//  TraceCovid
//
//  Created by KhanhXu on 4/25/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import CommonCrypto

public class BluezoneIdGenerator {
    
    init() {
        
    }
    
    /*
     * Get Bluezone Id
     */
    func getBluezoneId() -> Data {
        if (BluezoneIdConstants.Config.IS_ROLLING_ID) {
            return rollingBluezoneId();
        }

        return Data(randomBluezoneId().utf8)
    }
    
    /*
     * Get bluezone id with time
     */
    func rollingBluezoneId() -> Data {
        var bluezoneId = Data.init()
        let now: Int64 = Date().currentTime()
        let bluezoneDateNow = BluezoneDate()
        
        // Get list BluezoneDailyId
        let bluezoneDailyId = getBluezoneDailyId()
        if bluezoneDailyId.data.count > 0 && bluezoneDailyId.bluezoneDate.getTimeStart() >= bluezoneDateNow.getTimeStart() {
            let index = getIndexSubKey(time: now)
            if index >= 0 {
                let bluezoneIdSave = bluezoneDailyId.data[index];
                bluezoneId = bluezoneIdSave.bluezoneId;
            }
        } else {
            // Create BluezoneDailyId
            let bluezoneDailyKey = getBluezoneBaseId();
            if bluezoneDailyKey.data.count > 0 {
                // Other date
                bluezoneId = createListBluezoneDailyId(createBluezoneDailyKey(bluezoneDailyKey, timeEnd: bluezoneDateNow.getTimeStart()))
            } else {
                // New create
                bluezoneId = createBluezoneBaseId();
            }
        }
        
        return bluezoneId
    }
    
    /*
     * Create bluezoneId base Id
     */
    func createBluezoneBaseId() -> Data {
        var bluezoneDailyKeyNow: Data
        
        // Save Key daily base
        let bluezoneDailyKey = BluezoneDailyKey(data: initRandomBluezoneBaseId(), bluezoneDate: BluezoneDate())
        saveBluezoneBaseId(bluezoneDailyKey)
        
        // Get Id
        bluezoneDailyKeyNow = createListBluezoneDailyId(bluezoneDailyKey.data)
        
        return bluezoneDailyKeyNow
    }
    
    /*
     * Create BluezoneDailyKey
     */
    func createBluezoneDailyKey(_ bluezoneDailyKey: BluezoneDailyKey, timeEnd: Double) -> Data {
        var bluezoneDailyKeyNow = bluezoneDailyKey.data
        let times = Int(((timeEnd - bluezoneDailyKey.bluezoneDate.getTimeStart()) / BluezoneIdConstants.DAY_MILLISECONDS))
        if times > 0 {
            for _ in 0..<times {
                bluezoneDailyKeyNow = BluezoneIdUtils.sha256(bluezoneDailyKeyNow);
            }
        }
        
        return bluezoneDailyKeyNow
    }
    
    /*
     * Create list BluezoneDailyId and save
     */
    func createListBluezoneDailyId(_ bluezoneDailyKey: Data) -> Data {
        var bluezoneDailyKeyNow = Data.init()
        
        // Get max sub sub key per day
        let maxSubKey = getMaxNumberSubKey();
        
        // Data for subkey = bluezoneDailyKey + salt sub key
        var dataCreateSubKey: Data = bluezoneDailyKey
        dataCreateSubKey.append(contentsOf: BluezoneIdConstants.Config.SALT_SUB_KEY_DAILY)
        var bluezoneSubKey: Data = BluezoneIdUtils.sha256(dataCreateSubKey)
        
        // Date subkey
        let dateSubKey: BluezoneDateSubKey = BluezoneDateSubKey.init(maxSubKey: Int(maxSubKey))
        let indexSubKey: Int = dateSubKey.getIndexSubKey()
        
        var listBluezoneId = [BluezoneId]()
        
        for i in 0..<maxSubKey {
            let bluezoneId: Data = convertBluezoneSubKeyToBluezoneId(bluezoneSubKey)
            if (bluezoneId.count > 0) {
                let bluezoneIdData = BluezoneId(bluezoneId: bluezoneId, bluezoneDate: dateSubKey.nextTimeSubKey())
                listBluezoneId.append(bluezoneIdData)

                // Check index subkey
                if indexSubKey == i {
                    bluezoneDailyKeyNow = bluezoneId;
                }
            }

            bluezoneSubKey = BluezoneIdUtils.sha256(bluezoneSubKey);
        }
        
        // Save list daily id
        saveBluezoneDailyId(BluezoneDailyId(data: listBluezoneId, bluezoneDate: BluezoneDate()))
        
        return bluezoneDailyKeyNow
    }
    
    /*
     * Convert BluezoneSubKey to BluezoneId
     */
    func convertBluezoneSubKeyToBluezoneId(_ bluezoneSubKey: Data) -> Data {
        var bluezoneDailyId = Data.init()
        let bluezoneSubKeyBytes = [UInt8](bluezoneSubKey)
        
        // 12 Byte: 4 x 4 bytes + 2 x 8 bytes
        for i in 0..<BluezoneIdConstants.Config.LENGTH_BLID {
            var start = i * 4
            
            // Check 8 end
            if i > 3 {
                start = (i - 4) * 2 +  16;
            }
            
            bluezoneDailyId.append(bluezoneSubKeyBytes[start])
        }
        
        return bluezoneDailyId
    }
    
    /*
     * Create BluezoneBaseId
     */
    func initRandomBluezoneBaseId() -> Data {
        var keyGenerator = Data(count: Int(CC_SHA256_DIGEST_LENGTH))
        let result = keyGenerator.withUnsafeMutableBytes {
            SecRandomCopyBytes(kSecRandomDefault, Int(CC_SHA256_DIGEST_LENGTH), $0.baseAddress!)
        }
        
        guard result == errSecSuccess else {
            return Data()
        }
        
        return keyGenerator
    }
    
    /*
     * Create bluezonerId random
     */
    func randomBluezoneId() -> String {
        // Id
        var bluezonerId = getRadomBluezoneId()
        
            if bluezonerId.count < 1 {
            // Char
            let charRandom = BluezoneIdConstants.Config.CHAR_RANDOM
            let charCount = charRandom.count

            for _ in 0..<BluezoneIdConstants.Config.LENGTH_BLID {
                // Ramdom time
                let index = Int(arc4random_uniform(UInt32(charCount)))
                
                // Add
                bluezonerId += String(charRandom[charRandom.index(charRandom.startIndex, offsetBy: index)])
            }
                
            saveRadomBluezoneId(randomBluezoneId());
        }

        return bluezonerId
    }
    
    /*
     * Get Index Sub Key
     */
    func getIndexSubKey(time: Int64) -> Int {
       // Get max sub sub key per day
       let maxSubKey = getMaxNumberSubKey()

       // Index
        return Int((Double(time) - BluezoneDate().getTimeStart()) / (BluezoneIdConstants.DAY_MILLISECONDS / Double(maxSubKey)));
    }
    
    /*
     * Save Bluezone base Id
     */
    func saveBluezoneBaseId(_ bluezoneBaseId: BluezoneDailyKey) {
        UserDefaults.standard.set(BluezoneIdUtils.toJson(bluezoneBaseId), forKey: BluezoneIdConstants.UserDefaults.BLUEZONE_BASE_ID)
    }
    
    /*
     * Get Bluezone base Id
     */
    func getBluezoneBaseId() -> BluezoneDailyKey {
        let bluezoneBaseId = UserDefaults.standard.object(forKey: BluezoneIdConstants.UserDefaults.BLUEZONE_BASE_ID)
        if bluezoneBaseId != nil {
            let result = BluezoneIdUtils.jsonToDailyKey(data: bluezoneBaseId as! Data)
            switch result {
                case let .success(object):
                    return object
                case .failure(_):
                    break
            }
        }

        return BluezoneDailyKey(data: Data(), bluezoneDate: BluezoneDate())
    }
    
    /*
     * Save Bluezone Daily Id
     */
    func saveBluezoneDailyId(_ bluezoneDailyId: BluezoneDailyId) {
        UserDefaults.standard.set(BluezoneIdUtils.toJson(bluezoneDailyId), forKey: BluezoneIdConstants.UserDefaults.BLUEZONE_DAILY_ID)
    }
    
    /*
     * Get Bluezone Daily Id
     */
    func getBluezoneDailyId() -> BluezoneDailyId {
        let bluezoneDailyId = UserDefaults.standard.object(forKey: BluezoneIdConstants.UserDefaults.BLUEZONE_DAILY_ID)
        if bluezoneDailyId != nil {
            let result = BluezoneIdUtils.jsonToDailyId(data: bluezoneDailyId as! Data)
            switch result {
                case let .success(object):
                    return object
                case .failure(_):
                    break
            }
        }

        return BluezoneDailyId(data: [], bluezoneDate: BluezoneDate())
    }
    
    /*
     * Save Bluezone Daily Id
     */
    func saveRadomBluezoneId(_ bluezoneId: String) {
        UserDefaults.standard.set(bluezoneId, forKey: BluezoneIdConstants.UserDefaults.BLUEZONE_DAILY_ID)
    }

    /*
     * Get Bluezone Id if Bluezone is Random
     */
    func getRadomBluezoneId() -> String {
        return UserDefaults.standard.string(forKey: BluezoneIdConstants.UserDefaults.BLUEZONE_DAILY_ID) ?? ""
    }
    
    /*
     * Get Number sub key per day
     */
    func getMaxNumberSubKey() -> Int {
        var maxSubKey = UserDefaults.standard.integer(forKey: BluezoneIdConstants.UserDefaults.MAX_NUMBER_SUB_KEY_PER_DAY)
        if (maxSubKey < 1) {
            maxSubKey = BluezoneIdConstants.Config.MAX_NUMBER_SUB_KEY_PER_DAY;
        }

        return maxSubKey
    }
  
    /*
     * Set Number sub key per day
     */
    public static func setMaxNumberSubKey(maxSubKey: Int64) {
      UserDefaults.standard.set(maxSubKey, forKey: BluezoneIdConstants.UserDefaults.MAX_NUMBER_SUB_KEY_PER_DAY)
    }
}

extension Data {
    func subdata(in range: ClosedRange<Index>) -> Data {
        return subdata(in: range.lowerBound ..< range.upperBound + 1)
    }
    
    var uint32: UInt32 {
       get {
           let i32array = self.withUnsafeBytes { $0.load(as: UInt32.self) }
           return i32array
       }
   }
}

extension String {
    func charAt(at: Int) -> Character {
        let charIndex = self.index(self.startIndex, offsetBy: at)
        return self[charIndex]
    }
}

