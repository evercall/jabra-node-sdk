
#include "stdafx.h"

Napi::Value napi_Initialize(const Napi::CallbackInfo& info);
Napi::Value napi_UnInitialize(const Napi::CallbackInfo& info);

Napi::Value napi_ConnectToJabraApplication(const Napi::CallbackInfo& info);
Napi::Value napi_DisconnectFromJabraApplication(const Napi::CallbackInfo& info);
Napi::Value napi_SetSoftphoneReady(const Napi::CallbackInfo& info);
Napi::Value napi_IsSoftphoneInFocus(const Napi::CallbackInfo& info);

Napi::Value napi_GetErrorString(const Napi::CallbackInfo& info);

Napi::Value napi_GetVersion(const Napi::CallbackInfo& info);

Napi::Value napi_SyncExperiment(const Napi::CallbackInfo& info);

