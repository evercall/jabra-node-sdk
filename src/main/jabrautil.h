// Jabra lib headers:
#include <Common.h>
#include <JabraDeviceConfig.h>

#include <string>
#include <vector>
#include <array>
#include <algorithm>

/** 
* Memory managed version of FirmwareInfo that can be safely moved around and inspected (no C-pointers, no nulls).
*/
struct ManagedDeviceInfo {
  unsigned short deviceID;
  unsigned short productID;
  unsigned short vendorID;
  std::string deviceName;
  std::string usbDevicePath;
  std::string parentInstanceId;
  Jabra_ErrorStatus errStatus;
  bool isDongle;
  std::string dongleName;
  std::string variant;
  std::string serialNumber;
  bool isInFirmwareUpdateMode;
  DeviceConnectionType deviceconnection;
  unsigned long connectionId;
  unsigned short parentDeviceId;

  explicit ManagedDeviceInfo() {}

  explicit  ManagedDeviceInfo(const Jabra_DeviceInfo& deviceInfo)
                : deviceID(deviceInfo.deviceID), productID(deviceInfo.productID), vendorID(deviceInfo.vendorID),
                  deviceName(deviceInfo.deviceName ? deviceInfo.deviceName : ""), usbDevicePath(deviceInfo.usbDevicePath ? deviceInfo.usbDevicePath : ""), parentInstanceId(deviceInfo.parentInstanceId ? deviceInfo.parentInstanceId : ""),
                  errStatus(deviceInfo.errStatus), isDongle(deviceInfo.isDongle), dongleName(deviceInfo.dongleName ? deviceInfo.dongleName : ""),
                  variant(deviceInfo.variant ? deviceInfo.variant : ""), serialNumber(deviceInfo.serialNumber ? deviceInfo.serialNumber : ""), isInFirmwareUpdateMode(deviceInfo.isInFirmwareUpdateMode),
                  deviceconnection(deviceInfo.deviceconnection), connectionId(deviceInfo.connectionId), parentDeviceId(deviceInfo.parentDeviceId) {}
};

/** 
* Memory managed version of PairedDevice that can be safely moved around and inspected (no C-pointers, no nulls).
*/
struct ManagedPairedDevice {
  std::string deviceName;
  std::array<uint8_t, 6> deviceBTAddr;
  bool isConnected;

  explicit ManagedPairedDevice() {}
  explicit ManagedPairedDevice(const Jabra_PairedDevice& src): deviceName(src.deviceName), deviceBTAddr(), isConnected(src.isConnected) {
    std::copy( src.deviceBTAddr, src.deviceBTAddr + 6, deviceBTAddr.begin() );
  }
};

/** 
* Memory managed version of PairingList that can be safely moved around and inspected (no C-pointers, no nulls).
*/
struct ManagedPairingList {
  Jabra_DeviceListType listType;
  std::vector<ManagedPairedDevice> pairedDevice;

  explicit ManagedPairingList() {}
  explicit ManagedPairingList(const Jabra_PairingList& src): listType(src.listType), pairedDevice(initVector(src.count, src.pairedDevice)) {}

  private:
  static std::vector<ManagedPairedDevice> initVector(unsigned short count, Jabra_PairedDevice* pairedDevice) {
    auto vec = std::vector<ManagedPairedDevice>();

    if (pairedDevice != nullptr)  {
      for (int i = 0; i<count; ++i) {
        ManagedPairedDevice e(pairedDevice[i]);
        vec.push_back(e);
      }
    }

    return vec;
  }
};

/**
 * Raw "C" pair of a feature list pointer and a count.
 */
struct FeatureListCountPair {
  const DeviceFeature* featureList;
  unsigned int featureCount;
};

/**
 * Raw "C" pair of a bands list pointer and a count.
 */
struct EqualizerBandsListCountPair {
   Jabra_EqualizerBand * bands;
   unsigned int bandsCount;
};

/*
* Determine if it is a get or a release focus operation.
*/
typedef enum { GET_FOCUS, RELEASE_FOCUS } GetReleaseButtonFocusEnum;

/** 
* Memory managed version of unpacked ButtonEvent information that can be safely moved around and inspected (no C-pointers, no nulls).
*/
struct ManagedButtonEventInfo {   
  unsigned short buttonTypeKey;
  std::string buttonTypeValue;

	unsigned short key;
	std::string value;
};
