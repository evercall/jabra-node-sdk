import { createJabraApplication, enumFirmwareEventStatus } from '../main/index';

(async () => {
    try {
        let jabra = await createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=');

        jabra.on('attach', async device => {
            /* Get firmware file path */
            let firmwareInfo = await device.getLatestFirmwareInformationAsync();
            let deviceVersionMap: { [k: number]: string } = {};

            if (firmwareInfo) {
                deviceVersionMap[device.deviceID] = firmwareInfo.version;
                await device.downloadFirmwareAsync(firmwareInfo.version);
            }

            device.on("downloadFirmwareProgress", (async (...args: any[]) => {
                if (args[1] === enumFirmwareEventStatus.Completed) {
                    let firmwarePath = await device.getFirmwareFilePathAsync(deviceVersionMap[device.deviceID]);
                    console.log('Firmware path for ' + device.deviceName + ' ', firmwarePath)
                }
            }));

            /* Get thumbnail file path */
            let imageThumbnailPath = await device.getImageThumbnailPathAsync();
            console.log('imageThumbnailPath: ', imageThumbnailPath);

            /* Get image file path */
            let imagePath = await device.getImagePathAsync();
            console.log('imagePath: ', imagePath);
        });

    } catch (err) {
        console.log(err);
    }
})();
