/// <reference path="../main/index.ts" />

const j = require("../main/index");

j.createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=').then((jabra) => {
    jabra.on('attach', (device) => {
        console.log('Press any key on Jabra device ' + device.deviceName);
  
        device.on('btnPress', (btnType, btnValue) => {
          console.log('New input from device is received: ', j.enumDeviceBtnType[btnType], btnValue);
        });
    });    
});
