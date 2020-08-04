//
//  BluezonerIdGenerator.swift
//  TraceCovid
//
//  Created by KhanhXu on 4/25/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation

public class BluezonerIdGenerator {
    /*
     * Create bluezonerId random
     */
    static func createBluezonerId(numberChar: Int) -> String {
        // Char
        let charRandom = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        let charCount = Int32(charRandom.count)
        
        // Id
        var bluezonerId = ""

        // For
        for _ in 0..<numberChar {
            // Ramdom time
            let valueRandom = Int32(arc4random_uniform(UInt32(Date().currentTime())))
            
            // Get index charCount
            let index = Int(valueRandom % charCount)
            
            // Add
            bluezonerId += String(charRandom[charRandom.index(charRandom.startIndex, offsetBy: index)])
        }

        return bluezonerId
    }
}
//
//extension Date {
//    func currentTime() -> Int64 {
//        return Int64(self.timeIntervalSince1970)
//    }
//}

