import { createJabraApplication, JabraError, JabraType, DectInfo } from '../main/index';

(async () => {
    let jabra = await createJabraApplication('A7tSsfD42VenLagL2mM6i2f0VafP/842cbuPCnC+uE8=');
    console.log('Jabra app created');

    jabra.on('attach', device => {
        console.log(`Device attached: ${device.deviceName}`);

        device.on('onDectInfoEvent', dectInfo => {
            let kind :DectInfo.Kind = dectInfo.kind;
            console.log(`DectInfo received of kind: ${kind}`);
            console.log(`This is the raw data: ${dectInfo.rawData.toString()}`)
            switch (dectInfo.kind) {
                case 'density':
                    console.log('This is the rest:');
                    console.log(`\tsumMeasuredRSSI: ${dectInfo.sumMeasuredRSSI}`);
                    console.log(`\tmaximumReferenceRSSI: ${dectInfo.maximumReferenceRSSI}`);
                    console.log(`\tnumberMeasuredSlots: ${dectInfo.numberMeasuredSlots}`);
                    console.log(`\tdataAgeSeconds: ${dectInfo.dataAgeSeconds}`);
                    break;

                case 'errorCount':
                    console.log('This is the rest:');
                    console.log(`\tsyncErrors: ${dectInfo.syncErrors}`);
                    console.log(`\taErrors: ${dectInfo.aErrors}`);
                    console.log(`\txErrors: ${dectInfo.xErrors}`);
                    console.log(`\tzErrors: ${dectInfo.zErrors}`);
                    console.log(`\thubSyncErrors: ${dectInfo.hubSyncErrors}`);
                    console.log(`\thubAErrors: ${dectInfo.hubAErrors}`);
                    console.log(`\thandoversCount: ${dectInfo.handoversCount}`);
                    break;
            }
        })
    });
})();
