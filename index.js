const { activateKVS, getCPUTemperature,  getBatteryLevel, getBatteryVoltage, getBatteryCharging } = require('./spawn');
const { mqttMotorChannel, mqttSensorTopic } = require("./constants");
const { mqttClient } = require('./iot');
const { gps, gpsSerialParser } = require('./gpsSerial');
const { lteSerialPort, lteSerialParser, ltePortWrite } = require('./lteSerial');
const { telemetry } = require('./data');
const { testInternet, logEnvironmentVariables } = require('./util');

let isMQTTConnected = false;

logEnvironmentVariables();

// LTE SERIAL LISTENER
lteSerialPort.on('open', async()=>{
   console.log('LTE Serial Port: Ready');

   await ltePortWrite('AT\r\n');
   await updateTelemetry();
});

lteSerialParser.on('data', (data)=>{
   data = data.toString();

   console.log('MODEM:', data);

   if(data.includes('+CSQ:')) {
       data = data.replace('+CSQ: ', '');
    
       telemetry.updateLTE = data;
   }
});

const initialize = async () =>{
    for (let step = 0; step < 5; step++) {
        if(await testInternet()) {
            console.log('LTE: Internet Connected');
            activateKVS();
            break;
        } else console.log('LTE: No Internet')
    }
}

// MQTT LISTENERS
mqttClient.on("connect", () => {
    console.log('MQTT Client: Connected');
    isMQTTConnected = true;

    // [1] Initialize KVS
    initialize();

    mqttClient.subscribe(mqttMotorChannel, (err) => {
        if(!err) console.log(`Subscribed to [${mqttMotorChannel}]`);
    });
});

// GPS SERIAL LISTENERS
gps.on('data', () => {
    if(gps.state.lat && gps.state.lon) {
        telemetry.updateGPS = {
            lat: { value: gps.state.lat },
            lon: { value: gps.state.lon},
            speed: { value: Math.round(gps.state.speed)},
            track: { value: Math.round(gps.state.track), unit: "°"},
            alt: { value: Math.round(gps.state.alt), unit: "m"},
        }
    }
})

gpsSerialParser.on('data', (data)=>{
    if(data.includes('$GPVTG') || data.includes('$GPGGA') || data.includes('$GPHDT') || data.includes('$GPRMC')) gps.update(data);
});

const updateTelemetry = async () => {
    const batteryLevel = await getBatteryLevel();
    const batteryVoltage = await getBatteryVoltage();
    const batteryIsCharging = await getBatteryCharging();
    const cpuTemperature = await getCPUTemperature();

    await ltePortWrite('AT+CSQ\r\n');

    telemetry.updateBatteryLevel = batteryLevel;
    telemetry.updateBatteryIsCharging = batteryIsCharging;
    telemetry.updateBatteryVoltage = batteryVoltage;
    telemetry.updateCPUTemperature = cpuTemperature;
}

// INTERVAL READERS
setInterval(()=>{
    if(isMQTTConnected) {
        mqttClient.publish(mqttSensorTopic, JSON.stringify(telemetry));
    }
},  1000);

setInterval(async ()=>{
    await updateTelemetry();
},  60000);

