import { createJabraApplication, JabraError } from '../main/index';

createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=').then((jabra) => {
    jabra.on('attach', (device) => {
        device.isRingerSupportedAsync().then( (supported) => {
            if (supported) {
              device.offhookAsync().then ( () => {
                console.log("ringing");
              }).catch ((err: JabraError) => {
                console.log("ring failed with error " + err);
              }); //ring the device
              setTimeout(() => {
                device.unringAsync().then(() => {
                    console.log("stopped ringing");
                }).catch ((err: JabraError) => {
                    console.log("unring failed with error " + err);
                });
              }, 5000); //stop ringing the device after 5 second
            }          
        }).catch( (err: JabraError) => {
            console.error('Jabra call failed with error ' + err)
        });
    });
    
    jabra.on('detach', (device) => {
        console.log('Device detached with deviceID:', device.deviceID);

        // In this demo example, we will auto shutdown once all jabra devices are removed:
        let remainingAttachedDevices = jabra.getAttachedDevices();
        if (remainingAttachedDevices.length == 0) {
            jabra.disposeAsync().then (() => {}); // Cleanup and allow node process to exit.
        }
    });
});
