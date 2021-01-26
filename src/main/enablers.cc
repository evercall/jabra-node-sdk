#include "enablers.h"

Napi::Value napi_IsDevLogEnabled(const Napi::CallbackInfo& info) {   
  return util::SimpleDeviceAsyncFunction<Napi::Boolean, bool>(__func__, info, [](unsigned short deviceId) {
    const bool result = Jabra_IsDevLogEnabled(deviceId);
    return result;
  }, [](const Napi::Env& env, bool cppResult) { return Napi::Boolean::New(env, cppResult); });
}

Napi::Value napi_EnableDevLog(const Napi::CallbackInfo& info) {
  const char * const functionName = __func__;
  return util::SimpleDeviceAsyncBoolSetter(functionName, info, [functionName](unsigned short deviceId, bool enable) {
        const Jabra_ReturnCode result = Jabra_EnableDevLog(deviceId, enable);
        if (result != Return_Ok) {
          throw util::JabraReturnCodeException(functionName, result);
        }
  });
}