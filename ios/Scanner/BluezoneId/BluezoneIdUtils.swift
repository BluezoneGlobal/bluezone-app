//
//  BluezoneIdUtils.swift
//  TraceCovid
//
//  Created by KhanhXu on 5/9/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import CommonCrypto

class BluezoneIdUtils {
  
  /*
   * Get Hex Bluezone id
   */
  static func getBluezoneIdHex() -> String {
      return BluezoneIdGenerator.init().getBluezoneId().hexEncodedString(options: .upperCase)
  }
    
    /*
     * SHA256
     */
    static func sha256(_ data: Data) -> Data {
        var digest = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        data.withUnsafeBytes {
            _ = CC_SHA256($0.baseAddress, CC_LONG(data.count), &digest)
        }
        
        return Data(digest)
    }
    
   /*
    * Convert object to json
    */
    static func toJson<T: Codable>(_ object: T) -> Data {
        let encoder = JSONEncoder()

        if let encoded = try? encoder.encode(object) {
            return encoded
        }
        
        return Data()
    }
    
    /*
     * Convert json to Object
     */
//    static func jsonToObject<T: Codable>(data: Data, _ object: T) ->  Result<T, Error> {
//        let decoder = JSONDecoder()
//        
//        do {
//            let object = try decoder.decode(T.self, from: data)
//            return .success(object)
//        } catch {
//            return .failure(error)
//        }
//    }
    
    /*
     * Convert json to Object
     */
    static func jsonToDailyKey(data: Data) ->  Result<BluezoneDailyKey, Error> {
        do {
            let object = try JSONDecoder().decode(BluezoneDailyKey.self, from: data)
            return .success(object)
        } catch {
            return .failure(error)
        }
    }
    
    /*
     * Convert json to Object
     */
    static func jsonToDailyId(data: Data) ->  Result<BluezoneDailyId, Error> {
        do {
            let object = try JSONDecoder().decode(BluezoneDailyId.self, from: data)
            return .success(object)
        } catch {
            return .failure(error)
        }
    }
}
