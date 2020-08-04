//
//  BlePeripheralManager.swift
//  TraceCovid
//
//  Created by KhanhXu on 4/11/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import CoreBluetooth

class BlePeripheralManager: NSObject, CBPeripheralManagerDelegate, CBPeripheralDelegate {
    // Phát
    var mPeripheralManager: CBPeripheralManager!

    // success
    private var onSuccess: ((_ isSuccess: Bool) -> Void)?

    // Error
    private var onError: ((_ error: String) -> Void)?
    /*
     * Hàm gọi để chaỵ ^^
     */
    func startAdvertising(onSuccess: ((_ isSuccess: Bool) -> Void)?, onError: ((_ error: String) -> Void)?) {
        // Tạo thiết bị mới, check nếu gọi thành công thì sẽ start việc tìm kiếm
        if mPeripheralManager == nil {
            mPeripheralManager = CBPeripheralManager(delegate: self, queue: nil)
        }
        //options: [CBPeripheralManagerOptionRestoreIdentifierKey: AppConstant.RESTORE_KEY_IDENTIFIER_CENTRAL]

        // Call back
        self.onSuccess = onSuccess
        self.onError = onError
    }

    /*
     * Cài đặt để phát giả làm 1 thiết bị ngoại vi
     */
    private func setupPeripheral() {
        // Tao ten
        var phoneNumber = UserDefaults.standard.string(forKey: AppConstant.USER_DATA_PHONE_NUMBER) ?? ""

        // Check
        if phoneNumber.isEmpty {
            phoneNumber = "BLEios"
        } else {
            phoneNumber = AppUtils.convertNameDevices(phone: phoneNumber)
        }

        // Khởi tạo CBMutableCharacteristic.
        let transferCharacteristic = CBMutableCharacteristic(type: AppConstant.BLE_CHAR_UUID, properties: [.read],
                                                             value: nil, permissions: [.readable])

        // Tạo service -> characteristic.
        let transferService = CBMutableService(type: AppConstant.BLE_UUID_IOS, primary: true)

        // Thêm characteristic to service.
        transferService.characteristics = [transferCharacteristic]

        // And peripheral manager.
        mPeripheralManager.add(transferService)

        // start
        //mPeripheralManager.removeAllServices()
        mPeripheralManager.startAdvertising([CBAdvertisementDataLocalNameKey : "Bluezone", CBAdvertisementDataServiceUUIDsKey : [AppConstant.BLE_UUID_IOS]])
    }

    /*
     * Hàm gọi để chaỵ ^^
     */
    func stopAdvertising() {
        // Check
        if mPeripheralManager != nil {
            mPeripheralManager.stopAdvertising()
        }
    }

    /*
     * Trả về khi đăng kí sự kiện
     */
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        var log = "";

        switch peripheral.state {
        case .poweredOn:
            // ok cai dat
            self.onSuccess!(true)
            self.onError!("")

            // Bắt đầu phát
            setupPeripheral()

            return
        case .poweredOff:
            log = "CBManager is not powered on"
            break
        case .resetting:
            log = "CBManager is resetting"
            break
        case .unauthorized:
            log = "unauthorized"
        case .unknown:
            log = "CBManager state is unknown"
            break
        case .unsupported:
            log = "Bluetooth is not supported on this device"
            break
        @unknown default:
            log = "A previously unknown peripheral manager state occurred"
        }

        print(log)
        self.onSuccess!(false)
        self.onError!(log)
    }

    /*
    * respond khi co central muon doc data
    */
    public func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: CBATTRequest) {
        print("\(["request": request] as AnyObject)")

        // data la mang byte
        let dataToRespond = BluezoneIdGenerator.init().getBluezoneId()

        // them data vao va respond
        request.value = Data(dataToRespond)

        peripheral.respond(to: request, withResult: .success)

    }

    public func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]) {
        //
    }
}
