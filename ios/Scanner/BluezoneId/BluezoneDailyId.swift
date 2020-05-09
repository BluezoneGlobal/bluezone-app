//
//  BluezoneDailyId.swift
//  TraceCovid
//
//  Created by KhanhXu on 5/9/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation

struct BluezoneDailyId: Codable {
    
    var data: [BluezoneId]
    var bluezoneDate: BluezoneDate
}

