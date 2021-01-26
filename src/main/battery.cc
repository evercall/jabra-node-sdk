#include "battery.h"

#include <string.h>
#include <limits.h>
#include <stdint.h>

class BatteryStatusDto
{
  public:
    int levelInPercent;
    bool charging;
    bool batteryLow;
    BatteryStatusDto()
    {
      levelInPercent = 0;
      charging = false;
      batteryLow = false;
    }
};

Napi::Value napi_GetBatteryStatus(const Napi::CallbackInfo& info) {
  const char * const functionName = __func__;
  return util::SimpleDeviceAsyncFunction<Napi::Object, BatteryStatusDto>(functionName, info, 
    [functionName](unsigned short deviceId) {
      int levelInPercent;
      bool charging;
      bool batteryLow;
      Jabra_ReturnCode retv;
      if ((retv = Jabra_GetBatteryStatus(deviceId, &levelInPercent, &charging, &batteryLow)) == Return_Ok) {
        BatteryStatusDto dto;
        dto.levelInPercent = levelInPercent;
        dto.charging = charging;
        dto.batteryLow = batteryLow;
        return dto;
      } else {
        util::JabraReturnCodeException::LogAndThrow(functionName, retv);
        // Dummy return - avoid compiler warnings.
        BatteryStatusDto dto;
        return dto;
      }
    }, 
    [](const Napi::Env& env, const BatteryStatusDto& batteryStatus) { 
        Napi::Object napiResult = Napi::Object::New(env);
        napiResult.Set(Napi::String::New(env, "levelInPercent"), (Napi::Number::New(env, batteryStatus.levelInPercent)));
        napiResult.Set(Napi::String::New(env, "charging"), (Napi::Boolean::New(env, batteryStatus.charging)));
        napiResult.Set(Napi::String::New(env, "batteryLow"), (Napi::Boolean::New(env, batteryStatus.batteryLow)));
        return napiResult;
      }
  );
}

Napi::Value napi_IsBatteryStatusSupported(const Napi::CallbackInfo& info) {
  const char * const functionName = __func__;
  return util::SimpleDeviceAsyncFunction<Napi::Boolean, bool>(functionName, info, 
    [functionName](unsigned short deviceId) {
      // Not sure how this was implemented in the previous wrapper implementation
      int levelInPercent;
      bool charging;
      bool batteryLow;
      Jabra_ReturnCode retv;
      if ((retv = Jabra_GetBatteryStatus(deviceId, &levelInPercent, &charging, &batteryLow)) == Return_Ok) {
        return true;
      }
      return false;
    }, 
    [](const Napi::Env& env, const bool cppResult) { 
        return Napi::Boolean::New(env, cppResult);
      }
  );
}