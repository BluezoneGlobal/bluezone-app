//
//  Scanner.swift
//  CPMSMobileApp
//
//  Created by Dũng Đình on 4/10/20.
//

import Foundation
import CoreBluetooth


@objc(ScannerManager)
public class ScannerManager: RCTViewManager {

  // Bluetooth
  // Phát
  var peripheralManager: CBPeripheralManager!

  var  db: DBHelper = DBHelper()
  var timer = Timer()
  
  // Delay ban vao su kien
  let TIME_DELAY = 5 * 1000;
  
  // Delay luu vao DB
  var TIME_DELAY_SAVE_DB = 60 * 1000;

  // Scan Bluetooth
  var mBleCentral: BleCentralManager!
  var mBlePeripheral: BlePeripheralManager!

  // Bien luu thong tin scan duoc
  private var mScannedUserId = [(userId : String, time: Int64)]()

  @objc func setOnGetUUId(callback:RCTDirectEventBlock) {
    //       super.init()
      //    self.onClickStart()
  }

  @objc func startService() {
    print("onStartViaManager");
      DispatchQueue.main.async {
        self.onStartService()
      }
  }

  @objc func stopService() {
    print("onStopViaManager");
    DispatchQueue.main.async {
      self.onStopService()
    }
  }

  @objc func setId(_ userId: String) {
    print("setId");
    if userId.count > 0 {
        UserDefaults.standard.set(userId, forKey: AppConstant.USER_DATA_PHONE_NUMBER)
    }
  }
  
  @objc func generatorBluezoneId(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let _id = BluezonerIdGenerator.createBluezonerId(numberChar: 6)
    resolve(_id)
  }
  
  @objc func onSetTimeDelay(_ time: Int64) {
    print("onSetTimeDelay");
    TIME_DELAY_SAVE_DB = Int(truncatingIfNeeded: time)
  }

  public func onStartService() {
      // Tạo thiết bị mới, check nếu gọi thành công thì sẽ start việc tìm kiếm
      print("start scanning")
      
      // Tạo thiết bị mới, check nếu gọi thành công thì sẽ start việc tìm kiếm
      startAdvertising()
      
      // Scan thiết bị
      scanPeripheral()
  }

  public func onStopService() {
      // check
      if mBleCentral != nil {
          mBleCentral.stopScanPeripheral()
      }
      
      // check
      if mBlePeripheral != nil {
          mBlePeripheral.stopAdvertising()
      }
  }

  /*
   * Bắt đầu phát làm thiết bị ngoại vi
   */
  func startAdvertising() {
      // Khởi tạo
      mBlePeripheral = BlePeripheralManager()
      
      // Start
      mBlePeripheral.startAdvertising(onSuccess: {(isSucces) -> Void in}, onError: {(error) -> Void in})
  }
  
  /*
   * Scan Peripheral
   */
  private func scanPeripheral() {
//    if #available(iOS 10.0, *) {
//      AppUtils.createAndRequest(content: AppUtils.createNotificationContent(title: "HumanShield", body: "Bộ Y Tế khuyến cáo moị người giữ gìn sức khỏe và chỉ ra ngoài nếu cần thiết"))
//    } else {
//      // Fallback on earlier versions
//    }
      // Khởi tao
      mBleCentral = BleCentralManager()
      
      // Scan
      mBleCentral.scanPeripheral(onDataScan: {(nameScan, identifier, rssi) -> Void in
          // Check tên gửi sang
            if !nameScan.isEmpty && self.checkUserIdInsert(userId: nameScan) {
                
                 if (self.bridge != nil) {
                   // Check xem app da ton tai trong thoi gian truoc do
                   let result : AnyHashable = [
                       "id":nameScan,
                       "address": "",
                       "rssi": String(rssi)
                   ]
                   
                   let module = self.bridge!.module(forName: "TraceCovid") as! TraceCovid
                   module.onGetUUId(result)
                 }

                let timestamp = Date().currentTimeMillis()
              let scan: CovidLog = CovidLog(userId: nameScan, macId: "", timestamp: timestamp, rssi: Int32(rssi))
              
                self.db.insert(scan:scan)
            }
        }, onError: {(error) -> Void in
            // Check co loi ko
            if !error.isEmpty {
                print(error)
            }
        })
    }
  
    /*
     * Check user id insert
     */
  func checkUserIdInsert(userId: String) -> Bool {
    
      var ret: Bool = true;

      let time = Date().currentTimeMillis()

      if (userId == "and111") {
            print("and111")
        }

        print(self.mScannedUserId)
    
        // Check scan
        if self.mScannedUserId.count > 0 {
            // Check da luu
            for item in self.mScannedUserId {
                let userSave: String = item.userId
                let timeSave: Int64 = item.time
              
                // Check insert
               if userSave.elementsEqual(userId) && (time - timeSave < TIME_DELAY) {
                   // Dung
                   ret = false;
                }
            }
          
            // Check
            if (ret) {
                 // Remove va insert vao
                 self.mScannedUserId.removeAll{$0.userId == userId}
                 self.mScannedUserId.append((userId, time))
            }
        } else {
            self.mScannedUserId.append((userId, time))
            ret = true;
        }

        return ret;
    }
}

@objc(TraceCovid)
public class TraceCovid: RCTEventEmitter {

    // MARK: Event emitting to JS
  @objc func onGetUUId(_ value:AnyHashable) {
    sendEvent(withName: "onScanResult", body: value)
    }


    // MARK: Overrides

    override public func supportedEvents() -> [String]! {
        return ["onScanResult"]
    }

    @objc override public static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override public func constantsToExport() -> [AnyHashable : Any]! {
        return [:]
    }

}

extension Date {
    func currentTimeMillis() -> Int64 {
        return Int64(self.timeIntervalSince1970 * 1000)
    }
}
