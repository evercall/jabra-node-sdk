/*
* Common include file all N-API based sdk integration C++ code.
*/

#pragma once

#define NODE_ADDON_API_DISABLE_DEPRECATED

// Common stuff.
#include <string>
#include <iostream>
#include <memory>
#include <thread>

// Node lib headers:
#include <napi.h>

// Jabra lib headers:
#include <Common.h>
#include <JabraDeviceConfig.h>
#include <JabraNativeHid.h>

// Own stuff:
#include "jabrautil.h"
#include "napiutil.h"
#include "logger.h"

// Temporary util until supported by napi c++ api.
// https://github.com/mika-fischer/napi-thread-safe-callback

#include "napi-thread-safe-callback.hpp"
