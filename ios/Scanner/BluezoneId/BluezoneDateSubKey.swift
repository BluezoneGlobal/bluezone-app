//
//  BluezoneDateSubKey.swift
//  TraceCovid
//
//  Created by KhanhXu on 5/9/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation

class BluezoneDateSubKey {
    
    var mNextSubKey: Int = 0
    var mDetal: TimeInterval = 0.0
    var mTimeNext: TimeInterval = 0.0
    var mTimeCurrent: TimeInterval = 0.0
    var mMaxSubKey: Int = 0
    var mTime: TimeInterval = 0.0
    
    /*
     * Init
     */
    init(date: Date = Date(), maxSubKey: Int) {
        mNextSubKey = 0
        mMaxSubKey = maxSubKey
        mDetal = BluezoneIdConstants.DAY_MILLISECONDS / Double(maxSubKey)
        mTimeCurrent = TimeInterval(date.currentTime())
        
        // Cal mTime
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
    
    /*
     * Init max sub key
     */
    func setMaxSubKey(maxSubKey: Int) {
        mNextSubKey = 0
        mMaxSubKey = maxSubKey
        mDetal = BluezoneIdConstants.DAY_MILLISECONDS / Double(maxSubKey)
    }
    
    /*
     * Reset getnext subkey
     */
    func ressetNextSubKey() {
        mNextSubKey = 0
    }

    /*
     * Call next subtime
     */
    func nextTimeSubKey() -> TimeInterval {
        mTimeNext = getTimeStart() + (Double(mNextSubKey) * mDetal)
        mNextSubKey+=1
        return mTimeNext
    }

    /*
     * Check bluezone id
     */
    func isBluezoneNow() -> Bool {
       if (mTimeCurrent <= mTimeNext && (mTimeNext >= mTimeNext - mDetal)) {
           return true
       }

       return false
    }

    /*
     * Get Index Sub Key
     */
    func getIndexSubKey() -> Int {
        return (Int) ((mTimeCurrent - mTime) / mDetal)
    }
}
