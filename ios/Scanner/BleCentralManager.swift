//
//  BleCentralManager.swift
//  TraceCovid
//  Class thực hiện việc trung tâm quét các bluetooth
//  Created by KhanhXu on 4/11/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import CoreBluetooth

class BleCentralManager: NSObject, CBCentralManagerDelegate {
    // Ble Trung tâm
    private var mBleManager: CBCentralManager!
    
    // Trai lai cho ham call
    private var onDataScan: ((_ contactBlId: Data,_ identifier: String,_ rssi: Int, _ txPower: Int) -> Void)?
    
        // bien de luu cac pheripheral da scan duoc
    private var mScannedPeripherals = [UUID : CBPeripheral]()
    
    // Nếu tìm được data thì lưu vào mảng này
    private var mFoundedPeripherals = [(peripheral : CBPeripheral, name: String, time: Int64)]()
    
    // Check connect
    private var isConecting = false;
    
    // Error
    private var onError: ((_ error: String) -> Void)?
    
    /*
     * Ham scan
     */
    func scanPeripheral(onDataScan: ((_ contactBlId: Data,_ identifier: String,_ rssi: Int, _ txPower: Int) -> Void)? , onError: ((_ error: String) -> Void)?) {
        
        // Khởi tạo
        mBleManager = CBCentralManager.init(delegate: self, queue: nil)
      
        // callback
        self.onDataScan = onDataScan
        
        // error
        self.onError = onError
    }
    
    /*
     * Scan Peripheral
     */
    private func startScanPeripheral() {
        // Thưc hien tao va scan
        print("Start scanning")
        
       // Disconnect voi cac peripheral va reset data truoc khi scan
        self.mScannedPeripherals.forEach { (scannedPeri) in
            mBleManager.cancelPeripheralConnection(scannedPeri.value)}
        self.mFoundedPeripherals.forEach { (foundedPeri) in
            mBleManager.cancelPeripheralConnection(foundedPeri.peripheral)
        }
        
        // mBleManager.registerForConnectionEvents(options: )
        
        // reset data
        self.mScannedPeripherals = [UUID : CBPeripheral]()
        self.mFoundedPeripherals = [(peripheral : CBPeripheral, name: String, time: Int64)]()
        
        // Scan với UUID
        mBleManager.scanForPeripherals(withServices: [AppConstant.BLE_UUID_IOS, AppConstant.BLE_UUID_ANDROID],
                                              options: [CBCentralManagerScanOptionAllowDuplicatesKey: true])
    }
    
    /*
     * Hàm stop ^^
     */
    func stopScanPeripheral() {
        // Check
        if mBleManager != nil {
            mBleManager.stopScan()
        }
    }

    /*
     * Status khởi tạo xem có thành công hay không?
     */
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        var consoleLog = ""
        
        // Check
        switch central.state {
        case .poweredOn:
          consoleLog = "BLE is poweredOn"
          // ok
          self.onError!("")
          
            // Chạy
            startScanPeripheral()
          return;
        case .poweredOff:
            consoleLog = "BLE is powered off"
            break
        case .resetting:
            consoleLog = "BLE is resetting"
            break
        case .unauthorized:
            consoleLog = "BLE is unauthorized"
            break
        case .unknown:
            consoleLog = "BLE is unknown"
            break
        case .unsupported:
            consoleLog = "BLE is unsupported"
            break
        default:
            consoleLog = "default"
        }

        // In
        print(consoleLog)
        
        // Callback
        self.onError!(consoleLog)
    }
    
    /*
     * Call back khi trả về, kiểm tra nếu thiết bị có sóng yếu thì bỏ qua
     */
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any], rssi RSSI: NSNumber) {
        // Loại bỏ nhưng thiết bị có sóng yếu
        guard RSSI.intValue >= -100 else {
                print("Discovered perhiperal not in expected range, at %d", RSSI.intValue)
            return
        }
        print("------------------------------------------------------------------------")
        print(advertisementData)
        print(peripheral)
        
        // Data user
        var idUser : Data = Data()
        var identifier : String = ""
      
        // gan lai
        let advertist = advertisementData as NSDictionary

        // Check
        if advertist.count > 0 {
            
            // var listUuid : NSArray?
            var manuData : Data?
                 
            // Duyệt mảng
            for keyData in advertist.allKeys {
                // Lay key
                let key = keyData as! String
                
                // Lấy manu
                if key.elementsEqual("kCBAdvDataManufacturerData") {
                    manuData = advertist[keyData] as? Data
                }
            }
            
            // check
            if manuData != nil {
                // Cat 2 gia tri dau
                if let data = manuData?.subdata(in: 2..<manuData!.count), data.count > 0 {
                    idUser = data
                }
            } else {
              
                // Lấy identifiter
                identifier = peripheral.identifier.uuidString
              
                // peripheral name không thoả mãn thì kết nối để đọc data
                if idUser.isEmpty {
                    
//                    // giờ mảng scanned không có value nữa, check mảng founded
//                    self.mFoundedPeripherals.forEach { (foundedPeri) in
//                        // check indentifier
//                        if peripheral.identifier == foundedPeri.peripheral.identifier {
//                            idUser = foundedPeri.name
//                        }
//                    }
                    
                    // Check xem đã connect chưa nếu chưa thì connect
                    if idUser.isEmpty && mScannedPeripherals[peripheral.identifier] == nil {
                        // Log
                        print("connect")

                        // append luon vao mang da scan duoc
                        self.mScannedPeripherals.updateValue(peripheral, forKey: peripheral.identifier)
                        // Thu hien ket noi
                        mBleManager.connect(peripheral)
                    }
                }
            }
            
            // Check nil
            if !idUser.isEmpty {
                // Lưu tên
                onDataScan!(idUser, identifier, RSSI.intValue, -12);

                // Print
                print("Bắt được: \(idUser) - RSSI=\(RSSI.intValue)")
            } else if !isConecting {
                // Rỗng
                onDataScan!(Data(), "", 0, 0);

                // Print
                print("Không lấy được thông tin")
            }
            
             print("------------------------------------------------------------------------")
        }
    }
    
    /*
     * ham nay duoc goi khi central ket noi den mot peripheral
     */

    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        // gan cc hien tai thanh peripharel delegate
        peripheral.delegate = self

        // tim services
        peripheral.discoverServices([AppConstant.BLE_UUID_IOS])
    }
    
    /*
     * ham nay duoc goi khi ngat ket noi voi mot peripheral
     */
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        print("CC didDisconnectPeripheral \(peripheral) , \(error != nil ? "error: \(error.debugDescription)" : "" )")
      
        // khi disconnect lấy lại thông tin
        print(peripheral)
        //
        print(error.debugDescription)
    }

    /*
     * tra ve khi khoi tao ket noi bij loi
     */
    func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?) {
        print("CC didFailToConnect peripheral \(error != nil ? "error: \(error.debugDescription)" : "" )")
    }
}

/*
 * Khi da ket noi, central tro thanh peripheral de nhan data
 */
extension BleCentralManager: CBPeripheralDelegate {
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        if let err = error {
            print("error: \(err)")
        }
        guard let service = peripheral.services?.first(where: { $0.uuid == AppConstant.BLE_UUID_IOS }) else { return }

        peripheral.discoverCharacteristics([AppConstant.BLE_CHAR_UUID], for: service)

    }
  
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        if let err = error {
            print("error: \(err)")
        }

        guard let characteristic = service.characteristics?.first(where: { $0.uuid == AppConstant.BLE_CHAR_UUID}) else { return }
        
        print("Characteristic \(characteristic)")

        peripheral.readValue(for: characteristic)

    }

    /*
     * Khi charateristic thay doi (da doc dc data)
     */
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        // Check
        if error == nil {
           // if let scannedPeri = scannedPeripherals[peripheral.identifier],
             if let receivedCharacteristicValue = characteristic.value {
            
                // in
                print("data doc duoc \(receivedCharacteristicValue)")
                
                // Lưu tên
                onDataScan!(receivedCharacteristicValue, peripheral.identifier.uuidString, -99, 7);
                  
                // update peripheral de connect
                peripheral.delegate = self
                  
                // bây giờ thêm vào mảng founde
                self.mFoundedPeripherals.append((peripheral, String(data: receivedCharacteristicValue, encoding: .utf8)!, Date().currentTimeMillis()))
            }
        } else {
            print("Error: \(error!)")
        }
        // test keep connect
        // Disconnect
        mBleManager.cancelPeripheralConnection(peripheral)
    }
}
