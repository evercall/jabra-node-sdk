#pragma once

#include <plog/Log.h>
#include <napi.h>

/**
 * The unique plog logging instance that we are using in this module. This
 * should be unique across npm modules that also use plog in it's single
 * process.
 * 
 * All plog logging should be done using the instance!
 */
const unsigned int LOGINSTANCE = 9; // Any unused, non-zero value should do.

/**
 * Helper method for configuring logging with plog (https://github.com/SergiusTheBest/plog)
 * based on same environment settings as Jabra SDK (LIBJABRA_RESOURCE_PATH, LIBJABRA_TRACE_LEVEL etc).
 */
void configureLogging();

/**
* Get path of log file.
*/
const std::string& getLogFilePath();

/**
* Simple string logging. Useful for cases where iostream operators are in the way, such
* as certian lambdas that might not compile otherwise under MSVC. Use this only if standard
* logging gives problems.
*/
void logSimpleString(const plog::Severity severity, const std::string str);

/**
 * Expose method to add message to native log file from node.
 */
Napi::Value napi_NativeAddonLog(const Napi::CallbackInfo& info);

/**
 * Expose method to get native log configuration from node.
 */
Napi::Value napi_GetNativeAddonLogConfig(const Napi::CallbackInfo& info);

