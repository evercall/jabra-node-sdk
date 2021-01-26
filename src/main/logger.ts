import { SdkIntegration } from "./sdkintegration";
import { AddonLogSeverity, NativeAddonLogConfig } from "./core-types";
import { isNodeJs } from './util';

/** @internal */
let sdkIntegration: SdkIntegration;

// @ts-ignore
if (isNodeJs()) {
    // These statements should be executed under nodejs only to avoid browserfy problems:    
    let bindings = require('bindings');
    sdkIntegration = bindings('sdkintegration');
} 

/**
 * Add a message to native Jabra SDK log file. This function should be used instead og calling
 * sdkIntegration.NativeAddonLog as it is faster and more flexible.
 * 
 * This function is for internal only use by helpers and tests (Refer to sdkIntegration
 * comments for details).
 * 
 * The function is optimized so that it filters out disabled log entries automatically in JS, and
 * only calls in the native log code if needed.
 * 
 * Nb. The method is does not throw exceptions even on failure. So it ought to be safe to call in any context.
 * 
 * @hidden
 */
export function _JabraNativeAddonLog(severity: AddonLogSeverity, caller: string, msg: string | Error | (() => string), ...args: (string | object | boolean | number | Array<any> | (() => string))[]): void {
    try {
      const config = _JabraGetNativeAddonLogConfig();
      const maxSeverity = config ? config.maxSeverity : AddonLogSeverity.verbose;
      if (severity <= maxSeverity) {
        let totalMessage = mapLogValue(msg);
        if (args.length > 0 ) {
            const argsStr = args.map(arg => mapLogValue(arg)).join(", ");
            totalMessage = totalMessage + " : " + argsStr;
        }
        
        return sdkIntegration.NativeAddonLog(severity, caller, totalMessage);
      }
    } catch (e) { // Make sure any exceptions does not propagate.
        // If the console is up, shown internal error:
        console.error("Could not add message " + (caller || "?") + " : " + (msg || "?") + " to Jabra native log. Got error " + e);
    }
}

// Internal helper for logging function to ensure native logger only get what it supports
function mapLogValue(value: any): string | Error {
    if (typeof value === 'string' || value instanceof Error) {
        return value;
    } else if (typeof value === "function") {
      // Support lazy evaluation of messages if the msg is a function.
      return mapLogValue(value());
    } else if (value === null) {
        return "<null>";
    } else if (value === undefined) {
        return "<undefined>"
    } else if (value instanceof String || (value !== Object(value)) || value.hasOwnProperty('toString')) {
        return value.toString();
    } else {
        return JSON.stringify(value);
    }
}

/**
 * Cached native log configuration.
 */
let cachedLogConfig: NativeAddonLogConfig | undefined  = undefined;

/**
 * Get native Jabra SDK log configuration (caching old value if called repeatedly)
 * 
 * This function is for internal only use by helpers and tests (Refer to sdkIntegration
 * comments for details).
 * 
 * Nb. The method is does not throw exceptions even on failure. So it ought to be safe to call in any context.
 * 
 * @hidden
 */
export function _JabraGetNativeAddonLogConfig() : NativeAddonLogConfig | undefined {
    if (cachedLogConfig) {
        return cachedLogConfig;
    } else {
        try {
            const config = sdkIntegration.GetNativeAddonLogConfig();
            cachedLogConfig = config;
            return config;
        } catch (e) { // Make sure any exceptions does not propagate.
            // If the console is up, show internal error: 
            console.error("Could not read log configuration. Got error " + e);
            return undefined;
        }
    }
}
