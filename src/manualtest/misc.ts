import readline = require("readline");

import { createJabraApplication, DeviceType, JabraType, jabraEnums, enumHidState, enumWizardMode, enumSecureConnectionMode, JabraError, AudioFileFormatEnum } from '../main/index';

let reserved1 = {
    proxy: "this.httpProxyService.getProxy()",
    blockAllNetworkAccess: false,
    baseUrl_capabilities: "this.appConfig.jabraConfiguration.manifestEndpoint",
    baseUrl_fw: "this.appConfig.jabraConfiguration.firmwareEndpoint"
};

(async () => {
    try {
        let jabra = await createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=', {}, true)

        console.log("!! Jabra initialized correctly !!");

        jabra.getSDKVersionAsync().then(v => {
            console.log("SDK version is '" + v + "'");
        }).catch(err => {
            console.error("'get sdk version failed : " + err);
            console.log('get sdk version failed with error code : ' + err.code || "undefined"); 
        });
 
        jabra.getErrorStringAsync(8).then((r) => {
            console.log("getErrorStringAsync success with result " + r);
        }).catch((err: JabraError) => {
            console.log("getErrorStringAsync failed with error " + err);
        });

        // let r = jabra._SyncExperiment(0);
        // console.log("_SyncExperiment returned '" + JSON.stringify(r, null, 3) + "'");
  
        jabra.on('attach', async (device: DeviceType) => {
            console.log('Device attched: ', JSON.stringify(device, null, 2));

            device.setHidWorkingStateAsync(enumHidState.GN_HID).catch( (err) => {
                console.error("setHidWorkingStateAsync failed with error " + err);
            });

            device.checkForFirmwareUpdateAsync().then((r) => {
                console.log("checkForFirmwareUpdateAsync success with result " + r);
            }).catch( (err) => {
                console.error("checkForFirmwareUpdateAsync failed with error " + err);
            });

            device.getFailedSettingNamesAsync().then((r) => {
                console.log("getFailedSettingNamesAsync success with result " + JSON.stringify(r, null, 3));
            }).catch( (err) => {
                console.error("getFailedSettingNamesAsync failed with error " + err);
            });
            device.getSecureConnectionModeAsync().then((r) => {
                console.log("getSecureConnectionModeAsync success with result " + r);
            }).catch( (err) => {
                console.error("getSecureConnectionModeAsync failed with error " + err);
            });
            /*
            device.rebootDeviceAsync().then((r) => {
                console.log("rebootDeviceAsync success with result " + r);
            }).catch( (err) => {
                console.error("rebootDeviceAsync failed with error " + err);
            });
            */
            /*
            device.uploadImageAsync("dummyfilename.ext").then((r) => {
                console.log("updateFirmwareAsync success ");
            }).catch((err: JabraError) => {
                console.log("updateFirmwareAsync failed with error " + err);
            });
            */

            /*
            device.getTimestampAsync().then((n) => {
                console.log("getTimestampAsync returned " + n);
            }).catch((err: JabraError) => {
                console.log("getTimestampAsync failed with error " + err);
            });

            console.log("Device attached with device " + JSON.stringify(device, null, 2));

            // await device.connectNewDeviceAsync("myname", "010AFF000F07", true);            

            device.getSupportedFeaturesAsync().then((v) => {
                console.log("getSupportedFeaturesAsync returned " + JSON.stringify(v, null, 2));
            });

            
            device.getEqualizerParametersAsync().then((result) => {
                console.log("getEqualizerParametersAsync returned " + JSON.stringify(result, null, 2));
            }).catch(err => {
                console.log("getEqualizerParametersAsync failed with error " + err);
            });
            

            device.setEqualizerParametersAsync([1, 2, 3]).then ((v) => {
                console.log("setEqualizerParametersAsync sucess");
            }).catch((err: JabraError) => {
                console.log("setEqualizerParametersAsync failed with error " + err);
            });
            */

            device.getButtonFocusAsync([
                {
                    buttonTypeKey: 27,
                    buttonTypeValue: "hej",
                    buttonEventType: [ { key: 42, value: "bla" }]
                }
             ]).then((result) => {
                console.log("getButtonFocusAsync returned " + JSON.stringify(result, null, 2));
            }).catch((err: JabraError) => {
                console.error("getButtonFocusAsync failed with error " + err);
            });

            device.setDateTimeAsync({
                sec: 12, min: 38, hour: 10, mday: 24, mon: 8, year: 119, wday: 2 
            }).then(() => {
                console.log("setDateTimeAsync succeded ");
            }).catch((err) => {
                console.error("setDateTimeAsync failed with error " + err);
            });

            // console.log("before getFirmwareVersionAsync");
/*
            device.isBusyLightSupportedAsync().then((result) => {
                console.log("...........................................................");
                console.log('isBusyLightSupportedAsync: ', result);
            }).catch( (err) => {
                console.log('isBusyLightSupportedAsync failed with error: ' + err); 
            });
            device.setBusyLightStatusAsync(false).then((issupported) => {
                console.log("...........................................................");
                console.log('offhookAsync: ', issupported);
            device.isBusyLightSupportedAsync().then((result) => {
                    console.log("...........................................................");
                    console.log('isBusyLightSupportedAsync: ', result);
                }).catch( (err) => {
                    console.log('isBusyLightSupportedAsync failed with error: ' + err); 
                });
            device.getBusyLightStatusAsync().then((issupported) => {
                    console.log("...........................................................");
                    console.log('getBusyLightStatusAsync: ', issupported);
                }).catch( (err) => {
                    console.log('setOnlineAsync failed with error: ' + err); 
                });
            }).catch( (err) => {
                console.log('online supported failed with error: ' + err); 
            });

            device.getConnectedBTDeviceNameAsync().then((deviceName) => {
                console.log("...........................................................");
                console.log('getConnectedBTDeviceName: ', deviceName);
            }).catch( (err) => {
                console.log('getConnectedBTDeviceNameAsync failed with error: ' + err); 
            });

             device.isFirmwareLockEnabledAsync().then((result) => {
                console.log("...........................................................");
                console.log("isFirmwareLockEnabledAsync returns " + result);
            }).catch((err) => {
                console.error("Failed isFirmwareLockEnabledAsync with error: " + err);
            });

            device.isSetDateTimeSupportedAsync().then((result) => {
                console.log("...........................................................");
                console.log("isSetDateTimeSupportedAsync returns " + JSON.stringify(result));
            }).catch((err) => {
                console.error("Failed isSetDateTimeSupportedAsync with error: " + err);
            });
*/
            // const newDate = new Date().getTime();
            // device.setTimestampAsync(newDate).then((result) => {
            //     console.log("...........................................................");
            //     console.log("setTimestampAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed setTimestampAsync with error: " + err);
            // });
        
            // device.isFeatureSupportedAsync(1001).then((result) => {
            //     console.log("isFeatureSupportedAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed isFeatureSupportedAsync with error: " + err);
            // });

            // device.isEqualizerSupportedAsync().then((result) => {
            //     console.log("...........................................................");
            //     console.log("isEqualizerSupportedAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed isEqualizerSupportedAsync with error: " + err);
            // });

            // device.isEqualizerEnabledAsync().then((result) => {
            //     console.log("...........................................................");
            //     console.log("isEqualizerEnabledAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed isEqualizerEnabledAsync with error: " + err);
            // });

            device.getAudioFileParametersForUploadAsync().then((result) => {
              if (result.audioFileType == AudioFileFormatEnum.AUDIO_FILE_FORMAT_NOT_USED) {}

              console.log("getAudioFileParametersForUploadAsync returns " + JSON.stringify(result, null, 3));
            }).catch((err) => {
              console.error("Failed getAudioFileParametersForUploadAsync with error: " + err);
            }); 

            // device.enableEqualizerAsync().then(() => {
            //     console.log("...........................................................");
            //     console.log("enableEqualizerAsync returns " + JSON.stringify(wiz));
            // }).catch((err) => {
            //     console.error("Failed enableEqualizerAsync with error: " + err);
            // });
            // if (device.isDongleDevice) {
            //     device.getPairingListAsync().then((deviceList) => {
            //         console.log('getPairingListAsync: ', deviceList);
            //         device.clearPairedDeviceAsync('Jabra EVOLVE 65', '501aa56d87ab', false).then(() => {
            //             console.log('clearPairedDeviceAsync successful');
            //             device.getPairingListAsync().then((deviceList1) => {
            //                 console.log('getPairingListAsync new: ', deviceList1);
            //             }).catch( (err) => {
            //                 console.log('getPairingListAsync new failed with error: ' + err); 
            //             });
            //         }).catch( (err) => {
            //             console.log('clearPairedDeviceAsync failed with error: ' + err); 
            //         });
            //     }).catch( (err) => {
            //         console.log('getPairingListAsync failed with error: ' + err); 
            //     });
            // }

            // device.holdAsync().then(() => {
            //     console.log("...........................................................");
            //     console.log('holdAsync: ', 'holdAsync');
            // }).catch( (err) => {
            //     console.log('holdAsync failed with error: ' + err); 
            // });

            // device.resumeAsync().then(() => {
            //     console.log("...........................................................");
            //     console.log('resumeAsync: ', 'resumeAsync');
            // }).catch( (err) => {
            //     console.log('resumeAsync failed with error: ' + err); 
            // });
            
//             device.getFirmwareVersionAsync().then((result) => {
//                 console.log("Device firmware version is " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getting firmware version with error: " + err);
//             });
            
//             console.log("before getLatestFirmwareInformationAsync");
// /*
//             device.getLatestFirmwareInformationAsync().then((result) => {
//                 console.log("Latest device firmware version is " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getLatestFirmwareInformationAsync with error: " + err);
//             }); */

//             console.log("before getImagePathAsync");

//             device.getImagePathAsync().then((result) => {
//                 console.log("Latest ImagePath is " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getImagePathAsync with error: " + err);
//             });
                       
//             console.log("before getImageThumbnailPathAsync");

//             device.getImageThumbnailPathAsync().then((result) => {
//                 console.log("Latest ImageThumbnailPath is " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getImageThumbnailPathAsync with error: " + err);
//             }); 

//             console.log("before isSettingProtectionEnabledAsync");

//             device.isSettingProtectionEnabledAsync().then((result) => {
//                 console.log("isSettingProtectionEnabledAsync returns " + result);
//             }).catch((err) => {
//                 console.error("Failed isSettingProtectionEnabledAsync with error: " + err);
//             }); 

//             console.log("before isUploadImageSupportedAsync");

//             device.isUploadImageSupportedAsync().then((result) => {
//                 console.log("isUploadImageSupportedAsync returns " + result);
//             }).catch((err) => {
//                 console.error("Failed isUploadImageSupportedAsync with error: " + err);
//             }); 

//             console.log("before isUploadRingtoneSupportedAsync");

//             device.isUploadRingtoneSupportedAsync().then((result) => {
//                 console.log("isUploadRingtoneSupportedAsync returns " + result);
//             }).catch((err) => {
//                 console.error("Failed isUploadRingtoneSupportedAsync with error: " + err);
//             }); 

//             console.log("before getPanicsAsync");

//             device.getPanicsAsync().then((result) => {
//                 console.log("getPanicsAsync returns " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getPanicsAsync with error: " + err);
//             }); 

//             console.log("before isBatterySupportedAsync");

//             device.isBatterySupportedAsync().then((result) => {
//                 console.log("isBatterySupportedAsync returns " + result);
//             }).catch((err) => {
//                 console.error("Failed isBatterySupportedAsync with error: " + err);
//             }); 

//             console.log("before getBatteryStatusAsync");

//             device.getBatteryStatusAsync().then((result) => {
//                 console.log("getBatteryStatusAsync returns " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getBatteryStatusAsync with error: " + err);
//             }); 

//             console.log("before isGnHidStdHidSupportedAsync");

//             device.isGnHidStdHidSupportedAsync().then((result) => {
//                 console.log("isGnHidStdHidSupportedAsync returns " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed isGnHidStdHidSupportedAsync with error: " + err);
//             }); 

//             console.log("before setHidWorkingStateAsync");

//             device.setHidWorkingStateAsync(jabraEnums.enumHidState.STD_HID).then((result) => {
//                 console.log("setHidWorkingStateAsync returns " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed setHidWorkingStateAsync with error: " + err);
//             }); 

//             console.log("before getHidWorkingStateAsync");

//             device.getHidWorkingStateAsync().then((result) => {
//                 console.log("getHidWorkingStateAsync returns " + JSON.stringify(result));
//             }).catch((err) => {
//                 console.error("Failed getHidWorkingStateAsync with error: " + err);
//             });

            // device.searchNewDevicesAsync().then(() => {
            //     console.log("...........................................................");
            //     console.log("searchNewDevicesAsync returned");
            // }).catch((err) => {
            //     console.error("Failed searchNewDevicesAsync with error: " + err);
            // });
            
            // device.connectBTDeviceAsync().then(() => {
            //     console.log("...........................................................");
            //     console.log("connectBTDeviceAsync returned");
            // }).catch((err) => {
            //     console.error("Failed searconnectBTDevicconnectBTDeviceAsynceAsyncchNewDevicesAsync with error: " + err);
            // });

/*
            device.uploadWavRingtoneAsync("dummy.wav").then(() => {
                console.log("uploadWavRingtoneAsync success");
            }).catch((err) => {
                console.error("Failed uploadWavRingtoneAsync with error: " + err);
            }); 

            device.uploadRingtoneAsync("dummy.wav").then(() => {
                console.log("uploadRingtoneAsync success");
            }).catch((err) => {
                console.error("Failed uploadRingtoneAsync with error: " + err);
            });

            device.uploadImageAsync("dummy.wav").then(() => {
                console.log("uploadImageAsync success");
            }).catch((err) => {
                console.error("Failed uploadImageAsync with error: " + err);
            });*/

            // device.getNamedAssetAsyngetNamec("HERO_IMAGE").then((result) => {
            //     console.log("...........................................................");
            //     console.log("getNamedAssetAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed getNamedAssetAsync with error: " + err);
            // });

            // device.getSupportedButtonEventsAsync().then((result) => {
            //     console.log("...........................................................");
            //     console.log("getSupportedButtonEventsAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed getSupportedButtonEventsAsync with error: " + err);
            // });

            // device.isHoldSupportedAsync().then((result) => {
            //     console.log("...........................................................");
            //     console.log("isHoldSupportedAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed isHoldSupportedAsync with error: " + err);
            // });

            // device.isMuteSupportedAsync().then((result) => {
            //     console.log("...........................................................");
            //     console.log("isMuteSupportedAsync returns " + JSON.stringify(result));
            // }).catch((err) => {
            //     console.error("Failed isMuteSupportedAsync with error: " + err);
            // });


            //console.log("before on btnPress");

            // device.on('btnPress', (btnType: number, value: boolean) => {
            //     // jabraEnums.enumDeviceBtnType[1];
            //     console.log('New input from device is received: ', jabraEnums.enumDeviceBtnType[btnType], value);
            //     // let offHook = jabraEnums.enumDeviceBtnType.OffHook;
            // });

            // console.log("before on onDevLogEvent");

            // device.on('onDevLogEvent', (log: string) => {
            //     console.log('New dev log event received for my device ' + device.deviceID + ' : ', log);
            // });

            // device.on('onBatteryStatusUpdate', (levelInPercent, isCharging, isBatteryLow) => {
            //     console.log('New battery status for my device ' + device.deviceID + ' : ' + levelInPercent + ' ' + isCharging + ' ' + isBatteryLow);
            // });

            // device.on('onUploadProgress', (status, levelInPercent)  => {
            //     console.log('New upload status for my device ' + device.deviceID + ' : ' + status + ' ' + levelInPercent);
            // });
            
            // device.on('onBTParingListChange', (pairedListInfo)  => {
            //     console.log('New pairing list for my device ' + JSON.stringify(pairedListInfo, null, 3));
            // });
            
            // device.enableDevLogAsync(true).then(() => {
            //     console.log('Dev log enabling succeded');
            // }).catch( (err) => {
            //     console.log('Dev log enabling failed with error: ' + err); 
            // });
            
           /*
            device.getSettingsAsync().then((result) => {
                console.log('getSettings succeded with ' + JSON.stringify(result, null, 3));
            }).catch( (err) => {
                console.log('getSettings failed with error: ' + err); 
                console.log('getSettings failed with error code : ' + err.code || "undefined"); 
            });*/
            
            // console.log("before on getSettingAsync");
            // 3F08CD45-8B92-4C4F-A7C4-B8739403BAEF (validationrule)
            // D1BF2202-4AA1-4B2C-8D3C-6CF7D3EE072F (list key values)
            /*
            device.getSettingAsync("D1BF2202-4AA1-4B2C-8D3C-6CF7D3EE072F").then((result) => {
                console.log('getSetting succeded with ' + JSON.stringify(result, null, 3));
*/
                /*
                device.setSettingsAsync(result).then((setResult) => {
                    console.log('setSettingsAsync succeded with ' + JSON.stringify(setResult, null, 3));

                    device.getSettingAsync("D1BF2202-4AA1-4B2C-8D3C-6CF7D3EE072F").then((result) => {
                        console.log('2nd getSetting succeded with ' + JSON.stringify(result, null, 3));
                    }).catch( (err) => {
                        console.log('2nd getSettingsAsync failed with error: ' + err); 
                        console.log('2nd getSettingsAsync failed with error code : ' + err.code || "undefined"); 
                    });
                }).catch( (err) => {
                    console.log('setSettingsAsync failed with error: ' + err); 
                    console.log('setSettingsAsync failed with error code : ' + err.code || "undefined"); 
                });*/
/*
            }).catch( (err) => {
                console.log('getSetting failed with error: ' + err); 
                console.log('getSetting failed with error code : ' + err.code || "undefined"); 
            });*/

/*
            console.log("before on isFactoryResetSupportedAsync");

            device.isFactoryResetSupportedAsync().then((result) => {
                console.log('isFactoryResetSupportedAsync succeded with ' + result);
            }).catch( (err) => {
                console.log('isFactoryResetSupportedAsync failed with error: ' + err); 
                console.log('isFactoryResetSupportedAsync failed with error code : ' + err.code || "undefined"); 
            });

            device.getSerialNumberAsync().then((result) => {
                console.log("getSerialNumberAsync returns " + result);
            }).catch((err) => {
                console.error("Failed getSerialNumberAsync with error: " + err);
            });*/

             
            console.log("done all calls - waiting");
        });

        /*
         // Below can be used to test device connected via a dongle (Just un-comment the code)
         // Make sure you BT device is connected to the dongle.
         // Unplug the dongle
         // Start this program
         // First the above test is runned for the dongle
         // Next the belov is runned for the dongle connect device        
        jabra.on('attach', async (device: DeviceType) => {
            console.log('Device attched: ', JSON.stringify(device, null, 2));

            device.enableFirmwareLockAsync(true).then(() => {
                console.log('Enable firmware lock succeded');
             }).catch( (err) => {
                console.log('Enable firmware lock failed with error: ' + err); 
            });
            device.isFirmwareLockEnabledAsync().then((r) => {
                console.log('Is firmware lock enabled succeded ' + r);
             }).catch( (err) => {
                console.log('Is firmware lock enabled failed with error: ' + err); 
            });
            device.enableFirmwareLockAsync(false).then(() => {
                console.log('Enable firmware lock succeded');
             }).catch( (err) => {
                console.log('Enable firmware lock failed with error: ' + err); 
            });
            device.isFirmwareLockEnabledAsync().then((r) => {
                console.log('Is firmware lock enabled succeded ' + r);
             }).catch( (err) => {
                console.log('Is firmware lock enabled failed with error: ' + err); 
            });
        });
        */

        jabra.on('detach', (device) => {
            console.log('Device detached with device: ', JSON.stringify(device, null, 2));
            jabra.disposeAsync();
        });

        jabra.on('firstScanDone', () => {
            console.log('First scan done');
        });
/*
        console.log("Waiting... Press ctrl-c to exit");

        rl.on('close', () => {            
            jabra.disposeAsync();
            console.log("Got close event");
        });   
  */    
    } catch (err) {
        console.error("Got exception err " + err);
        console.log('get exception error code : ' + err.code || "undefined"); 
    }

})();


