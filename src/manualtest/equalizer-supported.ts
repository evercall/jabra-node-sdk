import { createJabraApplication } from '../main/index';

(async () => {
    try {
        let jabra = await createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=');

        jabra.on('attach', async device => {
           
            if (device.deviceName === 'Jabra Elite 45h') {
                console.log(device.deviceName);
                const supported = await device.isEqualizerSupportedAsync();

                console.log('Supported:', supported);

                let enableReturn = await device.enableEqualizerAsync(true);

                let isEnabled = await device.isEqualizerEnabledAsync();

                console.log('Is enabled:', isEnabled);

                enableReturn = await device.enableEqualizerAsync(false);

                console.log('Disable equalizer...', enableReturn);

                isEnabled = await device.isEqualizerEnabledAsync();

                console.log('Is enabled (expected false):', isEnabled);
            }
        });

    } catch (err) {
        console.log(err);
    }
})();
