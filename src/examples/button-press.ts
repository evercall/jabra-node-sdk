/// <reference path="../main/index.ts" />

import { createJabraApplication, enumDeviceBtnType, enumHidState } from '../main/index';

createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=').then((jabra) => {
    jabra.on('attach', (device) => {
        console.log('Press any key on Jabra device ' + device.deviceName);

        device.on('btnPress', (btnType, btnValue) => {
          console.log('New input from device is received: ', enumDeviceBtnType[btnType], btnValue);
        });
    });    
});
