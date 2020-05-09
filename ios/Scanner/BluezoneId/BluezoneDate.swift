//
//  BluezoneDate.swift
//  TraceCovid
//
//  Created by KhanhXu on 5/9/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation

class BluezoneDate: Codable {
    
    var mTime: TimeInterval = 0.0
    
    /*
     * init
     */
    init(date: Date = Date()) {
        var calendar = Calendar.current
        calendar.timeZone = NSTimeZone(abbreviation: "UTC")! as TimeZone
        let components = calendar.dateComponents([.year, .day, .month], from: date)
        self.mTime = calendar.date(from: components)!.timeIntervalSince1970
    }
    
    /*
     * Get time start day
     */
    func getTimeStart() -> TimeInterval {
        return mTime
    }
}
