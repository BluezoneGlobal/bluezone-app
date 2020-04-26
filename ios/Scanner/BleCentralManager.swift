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
    private var onDataScan: ((_ nameScan: String,_ identifier: String,_ rssi: Int) -> Void)?
    
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
    func scanPeripheral(onDataScan: ((_ nameScan: String,_ identifier: String,_ rssi: Int) -> Void)? , onError: ((_ error: String) -> Void)?) {
        
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
        var idUser : String = ""
        var identifier : String = ""
      
        // gan lai
        let advertist = advertisementData as NSDictionary

        // Check
        if advertist.count > 0 {
            
            // var listUuid : NSArray?
            var manuData : Data?
            var keyHash: Bool = false
                 
            // Duyệt mảng
            for keyData in advertist.allKeys {
                // Lay key
                let key = keyData as! String
            
                // Lấy tên
                if key.elementsEqual("kCBAdvDataLocalName") {
                    idUser = advertisementData[key] as! String
                }
              
                // Lấy tên
                if key.elementsEqual("kCBAdvDataHashedServiceUUIDs") {
                    keyHash = true
                }
                
                // Lấy manu
                if key.elementsEqual("kCBAdvDataManufacturerData") {
                    manuData = advertist[keyData] as? Data
                }
            }
            
            // check
            if manuData != nil {
                // Cat 2 gia tri dau
                let dataSub = manuData?.subdata(in: 2..<manuData!.count)
  
                // convert data sang string
                idUser = String(decoding: dataSub!, as: UTF8.self)
            } else if !idUser.isEmpty {
                // Dich lai
                idUser = AppUtils.getNameDevices(input: idUser)
            } else {
              
                // Lấy identifiter
                identifier = peripheral.identifier.uuidString
              
                // Lấy trên trong peripheral
                if peripheral.name != nil {
                    idUser = peripheral.name! // ??? Có TH nil

                    // check
                    if !idUser.isEmpty {
                        // Dich lai
                        idUser = AppUtils.getNameDevices(input: idUser)
                    }
                }
              
                // peripheral name không thoả mãn thì kết nối để đọc data
                if idUser.isEmpty {
                    
                    // giờ mảng scanned không có value nữa, check mảng founded
                    self.mFoundedPeripherals.forEach { (foundedPeri) in
                        // check indentifier
                        if peripheral.identifier == foundedPeri.peripheral.identifier {
                            idUser = foundedPeri.name
                        }
                    }
                    
                    // Check xem đã connect chưa nếu chưa thì connect
                    if idUser.isEmpty && keyHash && mScannedPeripherals[peripheral.identifier] == nil {
                        // Log
                        print("connect")

                        // append luon vao mang da scan duoc
                        self.mScannedPeripherals.updateValue(peripheral, forKey: peripheral.identifier)
                        // Thu hien ket noi TaiPV
                      mBleManager.connect(peripheral/*, options: [CBConnectPeripheralOptionNotifyOnNotificationKey: true]*/)
                    }
                }
            }
            
            // Check nil
            if !idUser.isEmpty {
                // Lưu tên
                onDataScan!("\(idUser)", identifier, RSSI.intValue);

                // Print
                print("khanhvd Bắt được: \(idUser) - RSSI=\(RSSI.intValue)")
            } else if !isConecting {
                // Rỗng
                onDataScan!("", "", 0);

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
        
        // Bat lai co
        //isConecting = false;
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
        
        print("TaiPV characteristic \(characteristic)")

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
            
                // doc du lieu trong data
                var data = String(data: receivedCharacteristicValue, encoding: .utf8) ?? ""
                
                // Check rong
                if !data.isEmpty {
                    
                    // in
                    print("data doc duoc \(data)")
                    
                    // Convert
                    data = AppUtils.getNameDevices(input: data)
                    
                    // check
                    if !data.isEmpty {
                        // Lưu tên
                        onDataScan!("\(data)", peripheral.identifier.uuidString, -99);
                        
                        // Print
                        print("khanhvd Bắt được: \(data)")
                        
                        // update peripheral de connect
                        peripheral.delegate = self
                        
                        // bây giờ thêm vào mảng founde
                      self.mFoundedPeripherals.append((peripheral, data, Date().currentTimeMillis()))
                    }
                }
            }
        } else {
            print("Error: \(error!)")
        }
        // test keep connect
        // Disconnect
        mBleManager.cancelPeripheralConnection(peripheral)
    }
}
