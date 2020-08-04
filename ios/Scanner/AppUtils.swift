//
//  AppUtils.swift
//  TraceCovid
//
//  Created by KhanhXu on 4/8/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation

class AppUtils {
    /*
     * Lấy thời gian hiện tại
     */
    static func getDateCurrent() -> String {
        let dateFormatter : DateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MMM-dd HH:mm:ss"
        let date = Date()
        let dateString = dateFormatter.string(from: date)
        _ = date.timeIntervalSince1970
        
        return dateString;
    }
    
    /*
      * func tao local name
      */
     static func convertNameDevices(phone: String) -> String {
         var returnValue: String = ""
         let char1 = Int.random(in: 1..<6)
         var char2: Int = char1
         while char2 == char1 {
             char2 = Int.random(in: 1..<6)
         }
        
         var array = Array(phone)
         
         let item1 = array[char1-1]
         let item2 = array[char2-1]
         
         if char1 > char2 {
             array.insert(item2, at: char1)
             array.insert(item1, at: char2)
             
             array.insert(contentsOf: String(char1), at: array.startIndex)
             array.insert(contentsOf: String(char2), at: array.endIndex)
         } else {
             array.insert(item1, at: char2)
             array.insert(item2, at: char1)
             
             array.insert(contentsOf: String(char1), at: array.startIndex)
             array.insert(contentsOf: String(char2), at: array.endIndex)
         }
         
         for char in array {
             returnValue += String(char)
         }
         
         return returnValue
     }
    
    /*
     * lay ra local name, neu dung tra ve local name, sai tra ve ""
     */
    static func getNameDevices(input: String) -> String {
        var array = Array(input)
        // neu do dai 10 moi xu ly
        if array.count == 10 {
            // Biến
            var start: Int
            var end: Int
            let index1 = array[0]
            let index2 = array[9]
            
            var value: String = ""
            
            // Đọc vị trí
            if let index = Int(String(index1)) {
                start = index
                print(start)
            } else {
                return ""
            }
            
            if let index = Int(String(index2)) {
                end = index
                print(end)
            } else {
                return ""
            }
            
            // Xoá đầu cuối
            array.remove(at: 9)
            array.remove(at: 0)
            
            // Doi cho
            let tmp = end
            if (start > end) {
                end = start
                start = tmp
            }
            
            // laay string
            let startString = array[start]
            let endString = array[end + 1]
            
            // Remove
            array.remove(at: end + 1)
            array.remove(at: start)
            
            // Check
            if startString == array[end - 1] && endString == array[start - 1] {
                for char in array {
                    value += String(char)
                }
                // return
                return value
            }
        }
        return ""
    }
  
  @available(iOS 10.0, *)
  /*@objc*/ static func createNotificationContent(title: String, body: String) -> UNMutableNotificationContent {
      //create content
      let content = UNMutableNotificationContent()
      content.title = title
      content.body = body
    
      return content
      
  }
  
  @available(iOS 10.0, *)
  /*@objc */static func createAndRequest(content: UNMutableNotificationContent) -> Void {
    // Fire in 30 minutes (60 seconds times 30)
    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: (30*60), repeats: true)
    
    // Create the request
    let uuidString = UUID().uuidString
    let request = UNNotificationRequest(identifier: uuidString,
                content: content, trigger: trigger)

    // Schedule the request with the system.
    let notificationCenter = UNUserNotificationCenter.current()
    notificationCenter.add(request) { (error) in
       if error != nil {
          // Handle any errors.
          // do nothing
       }
    }
  }
  
  /*
     * Thực hiện copy file
     */
     static func backupDatabase() {
         // Tao thư mục icloud
         createIcloudBluezone()
         
         // Copy file
         copyDatabase()
     }
     
     /*
      * Tạo thư mục
      */
     static func createIcloudBluezone() {
         if let iCloudDocumentsURL = FileManager.default.url(forUbiquityContainerIdentifier: nil)?.appendingPathComponent(AppConstant.PATH_APP) {
             if (!FileManager.default.fileExists(atPath: iCloudDocumentsURL.path, isDirectory: nil)) {
                 do {
                     try FileManager.default.createDirectory(at: iCloudDocumentsURL, withIntermediateDirectories: true, attributes: nil)
                 } catch let error as NSError {
                     print("Error: \(error)")
                 }
             }
         }
     }
     
     /*
      * Copy vao icloud
      */
     static func copyDatabase() {
         // File manager
         let fileManager = FileManager.default
         
         let documentsUrl = fileManager.urls(for: .documentDirectory, in: .userDomainMask)

         // Tim đường dẫn
         guard documentsUrl.count != 0 else {
             return
         }
         // file DB
         let finalDatabaseURL = documentsUrl.first!.appendingPathComponent(AppConstant.BACKUP_DATABASE_NAME)
         
         // icloud
         guard let iCloudDocumentsURL = fileManager.url(forUbiquityContainerIdentifier: nil)?
             .appendingPathComponent(AppConstant.PATH_APP).appendingPathComponent(AppConstant.BACKUP_FOLDER) else {
             return
         }
         
         // check
         var isDir:ObjCBool = false
         
         print(iCloudDocumentsURL)
         
         // check
         if FileManager.default.fileExists(atPath: iCloudDocumentsURL.path, isDirectory: &isDir) {
             do {
                 try FileManager.default.removeItem(at: iCloudDocumentsURL)
             } catch let error as NSError {
                 print("Error: \(error)")
             }
         }
         
         // Thực hiện việc copy
         do {
             try FileManager.default.copyItem(at: finalDatabaseURL, to: iCloudDocumentsURL)
         } catch let error as NSError {
             print("Error: \(error)")
         }
     }
}

extension Data {
    struct HexEncodingOptions: OptionSet {
        let rawValue: Int
        static let upperCase = HexEncodingOptions(rawValue: 1 << 0)
    }

    func hexEncodedString(options: HexEncodingOptions = []) -> String {
        let format = options.contains(.upperCase) ? "%02hhX" : "%02hhx"
        return map { String(format: format, $0) }.joined()
    }
}
