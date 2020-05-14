//
//  BleCentralManager.swift
//  TraceCovid
//  Class thực hiện việc trung tâm quét các bluetooth
//  Created by KhanhXu on 4/11/20.
//  Copyright © 2020 KhanhXu. All rights reserved.
//

import Foundation
import CoreBluetooth

struct PeripheralDetails {
    var rssiValue: Int?
    var txPowerLever: Int?
    var connectBlId: Data?
    var timestamp: Date = Date()
    var lastConnection: Date?
}

class BleCentralManager: NSObject, CBCentralManagerDelegate {
    // Ble Trung tâm
    private var mBleManager: CBCentralManager?

    // Trai lai cho ham call
    private var onDataScan: ((_ contactBlId: Data,_ identifier: String,_ rssi: Int, _ txPower: Int) -> Void)?

    // Error
    private var onError: ((_ error: String) -> Void)?

    // list peripheral to connect
    private var pendingPeripherals: [CBPeripheral: PeripheralDetails] = [:]

    // list peripheral is going to be remove from pending
    private var removingPeripherals: [CBPeripheral]?

    /*
     * Ham scan
     */
    func scanPeripheral(onDataScan: ((_ contactBlId: Data,_ identifier: String,_ rssi: Int, _ txPower: Int) -> Void)? , onError: ((_ error: String) -> Void)?) {

        if mBleManager != nil {
//            mBleManager?.stopScan()
//            mBleManager?.scanForPeripherals(withServices: [AppConstant.BLE_UUID_IOS, AppConstant.BLE_UUID_ANDROID], options: [
//                CBCentralManagerOptionShowPowerAlertKey: NSNumber(booleanLiteral: true), CBCentralManagerScanOptionAllowDuplicatesKey: true])
        } else {
            mBleManager = CBCentralManager(delegate: self, queue: nil, options: [
                CBCentralManagerOptionShowPowerAlertKey: NSNumber(booleanLiteral: true),
                CBCentralManagerOptionRestoreIdentifierKey: AppConstant.RESTORE_KEY_IDENTIFIER_CENTRAL])
        }

        // callback
        self.onDataScan = onDataScan

        // error
        self.onError = onError
    }

    /*
     * Hàm stop ^^
     */
    public func stopScanPeripheral() {
        mBleManager?.stopScan()
        mBleManager = nil
        pendingPeripherals.removeAll()
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

            mBleManager?.scanForPeripherals(withServices: [AppConstant.BLE_UUID_IOS, AppConstant.BLE_UUID_ANDROID], options: [
                CBCentralManagerOptionShowPowerAlertKey: NSNumber(booleanLiteral: true), CBCentralManagerScanOptionAllowDuplicatesKey: true
            ])
            removingPeripherals?.forEach { peripheral in
                self.mBleManager?.cancelPeripheralConnection(peripheral)
            }
            removingPeripherals = nil
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

        //
        var macId = ""
        var power: Int = 0

        // get txPower level from advertisement data
        if let txPowerLevel = advertisementData[CBAdvertisementDataTxPowerLevelKey] as? Double {
            power = Int(txPowerLevel)
        }

        // check list pending peripherals
        cleanUpPendingPeripherals()

        // check manufacturer data
        if let manufacturerData = advertisementData[CBAdvertisementDataManufacturerDataKey] as? Data {
            let manufacturer = manufacturerData.subdata(in: 0..<2)
            print(manufacturer.hexEncodedString)

            let value = manufacturerData.subdata(in: 2..<manufacturerData.count)
            print(value.hexEncodedString)
            // neu dung do dai thi ok
            if value.count == 12 {
                //
                macId = "Android"
                // luu data
                onDataScan!(value, macId, RSSI.intValue, power)
            }
        } else {  // neu khong doc duoc trong manufacturer data thi phai connect de doc
            
            if let details = pendingPeripherals[peripheral] {
                if Date().timeIntervalSince(details.timestamp) >= 5.0 {
                    pendingPeripherals[peripheral] = .init()
                    pendingPeripherals[peripheral]?.rssiValue = RSSI.intValue
                    pendingPeripherals[peripheral]?.txPowerLever = power

                    mBleManager?.connect(peripheral)
                }
            } else {
                pendingPeripherals[peripheral] = .init()
                pendingPeripherals[peripheral]?.rssiValue = RSSI.intValue
                pendingPeripherals[peripheral]?.txPowerLever = power

                mBleManager?.connect(peripheral)
            }
        }
    }

    // check list pending peripherals, dicard peripheral state connecting too long
    func cleanUpPendingPeripherals() {
        removingPeripherals = []

        for (peripheral, details) in pendingPeripherals {
            // neu lan cuoi ket noi lon hon 30 phut
            if let lastConnection = details.lastConnection, Date().timeIntervalSince(lastConnection) > 30 * 60.0 {
                removingPeripherals?.append(peripheral)
            } else if Date().timeIntervalSince(details.timestamp) > 30 * 60.0 {
                // hoac khoang thoi gian tim thay lan truoc lon hon 30 phut
                removingPeripherals?.append(peripheral)
            }
        }

        // cancel connection with peripherals and remove from pending peripherals list
        if let removing = removingPeripherals, removing.count > 0 {
            removing.forEach {
                mBleManager?.cancelPeripheralConnection($0)
                pendingPeripherals.removeValue(forKey: $0)
            }
        }
    }

    /*
     * when central connected to pheripheral
     */
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        // set last connection
        pendingPeripherals[peripheral]?.lastConnection = Date()

        //
        cleanUpPendingPeripherals()

        // gan cc hien tai thanh peripharel delegate
        peripheral.delegate = self

        // tim services
        peripheral.discoverServices([AppConstant.BLE_UUID_IOS])

        // read rssi
        peripheral.readRSSI()
    }

    /*
     * ham nay duoc goi khi ngat ket noi voi mot peripheral
     */
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        print("CC didDisconnectPeripheral \(peripheral) , \(error != nil ? "error: \(error.debugDescription)" : "" )")

        // neu lan cuoi connect duoc den peripheral lon hon 20 phut thi bo khoi pending peripheral
        if let detail = pendingPeripherals[peripheral],
            let lastConnection = detail.lastConnection {
            if Date().timeIntervalSince(lastConnection) > 20 * 60.0 {

                pendingPeripherals.removeValue(forKey: peripheral)
                return
            }
        }

        // neu disconnect vi loi thi connect lai
        if let error = error {
            print(" didDisconnectPeripheral (unexpected): \(peripheral) with error: \(error)")
            mBleManager?.connect(peripheral)
        } else {
            // ket noi nhung delay 2 phut
            mBleManager?.connect(peripheral, options: [CBConnectPeripheralOptionStartDelayKey: NSNumber(integerLiteral: Int(2 * 60.0))])
        }
    }

    /*
     * tra ve khi khoi tao ket noi bij loi
     */
    func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?) {
        print("CC didFailToConnect peripheral \(error != nil ? "error: \(error.debugDescription)" : "" )")

        // neu thoi gian ke tu lan cuoi ket noi den, hoac lan cuoi dicover duoc qua lau thi xoa khoi pending peripheral, 20 phut
        if let detail = pendingPeripherals[peripheral] {
            if let lastConnection = detail.lastConnection,
                Date().timeIntervalSince(lastConnection) > 20 * 60.0 {
                pendingPeripherals.removeValue(forKey: peripheral)
                return
            } else if Date().timeIntervalSince(detail.timestamp) > 20 * 60.0 {
                pendingPeripherals.removeValue(forKey: peripheral)
                return
            }
        }

        // khong thi co connect lai
        mBleManager?.connect(peripheral)
    }

    func centralManager(_ central: CBCentralManager, willRestoreState dict: [String : Any]) {
        print("CentralManager#willRestoreState")

        // restore data pending peripherals
        if let peripherals: [CBPeripheral] = dict[CBCentralManagerRestoredStatePeripheralsKey] as? [CBPeripheral] {
            removingPeripherals = []

            peripherals
                .forEach {
                    let details = PeripheralDetails(timestamp: Date().addingTimeInterval(-15*60.0))
                    pendingPeripherals[$0] = details
                }
        }
    }

    func peripheral(_ peripheral: CBPeripheral, didReadRSSI RSSI: NSNumber, error _: Error?) {
        print("didReadRSSI for \(peripheral) -> rssi: \(RSSI)")

        pendingPeripherals[peripheral]?.rssiValue = RSSI.intValue

        checkToCancelConnection(peripheral)
    }

    // check to cancel connection to a peripheral
    func checkToCancelConnection(_ peripheral: CBPeripheral) {
        // check all data in peripheral details
        guard let details = pendingPeripherals[peripheral] else { return }

        guard let value = details.connectBlId else {
            // neu chua co rssi
//            if details.rssiValue == nil {
//                peripheral.readRSSI()
//            }
            return
        }

        // luu data
        onDataScan!(value, "iOS", details.rssiValue ?? 0, details.txPowerLever ?? 0)

        // cancel connection, reset values
        pendingPeripherals[peripheral]?.rssiValue = 0
        pendingPeripherals[peripheral]?.connectBlId = nil
        mBleManager?.cancelPeripheralConnection(peripheral)
    }
}

/*
 * Khi da ket noi, central tro thanh peripheral de nhan data
 */
extension BleCentralManager: CBPeripheralDelegate {

    /*
    * when did discover services
    */
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        print("didDiscoverServices for \(peripheral.identifier)")

        if let err = error {
            print("error: \(err.localizedDescription)")
        }
        // neu dung service uuid, discover characteristics, khong thi cancel connection
        if let service = peripheral.services?.first(where: { $0.uuid == AppConstant.BLE_UUID_IOS }) {
            peripheral.discoverCharacteristics([AppConstant.BLE_CHAR_UUID], for: service)
        } else {
            print("No service found found: -> (\(peripheral.services?.description ?? "none"))")

            mBleManager?.cancelPeripheralConnection(peripheral)
        }

    }

    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        if let error = error {
            print("didDiscoverCharacteristicsFor " + error.localizedDescription)
            return
        }

        guard let characteristic = service.characteristics?.first(where: { $0.uuid == AppConstant.BLE_CHAR_UUID}) else { return }

        print("Characteristic \(characteristic)")

        // read value
        peripheral.readValue(for: characteristic)

    }

    /*
     * Khi charateristic thay doi (da doc dc data)
     */
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {

        if let error = error {
            print("didUpdateValueFor " + error.localizedDescription)
            mBleManager?.cancelPeripheralConnection(peripheral)
            return
        }

        guard let data = characteristic.value else {
            mBleManager?.cancelPeripheralConnection(peripheral)
            return
        }

        // neu du data
        guard data.count == 12 else {
            mBleManager?.cancelPeripheralConnection(peripheral)
            return
        }
        print("Received (\(data.count) bytes) from \(peripheral.identifier) at \(Date()): \(data.hexEncodedString(options: .upperCase))")

        pendingPeripherals[peripheral]?.connectBlId = data

        checkToCancelConnection(peripheral)
    }
}
