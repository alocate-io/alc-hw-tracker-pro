const { activateKVS, getBatteryLevel, getBatteryVoltage, getBatteryCharging } = require('./spawn');
const { mqttMotorChannel, mqttSensorTopic } = require("./constants");
const { mqttClient } = require('./iot');
const { gps, gpsSerialParser } = require('./gpsSerial');
const { lteSerialPort, lteSerialParser, ltePortWrite } = require('./lteSerial');
const { telemetry } = require('./data');

let isMQTTConnected = false;

// LTE SERIAL LISTENER
lteSerialPort.on('open', async()=>{
   console.log('LTE Serial Port: Ready');

   // Get initial modem signal quality
   await ltePortWrite('AT+CSQ\r\n');

   // Activate GPS NMEA stream
   await ltePortWrite('AT+CGPS=1\r\n');
});

lteSerialParser.on('data', (data)=>{
   data = data.toString();

   if(data.includes('+CSQ:')) {
       data = data.replace('+CSQ: ', '');
    
       telemetry.updateLTE = data;
   }
});

// MQTT LISTENERS
mqttClient.on("connect", () => {
    console.log('MQTT Client: Connected');
    isMQTTConnected = true;

    // [1] Initialize KVS
    activateKVS();

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

// INTERVAL READERS
setInterval(()=>{
    if(isMQTTConnected) {
        mqttClient.publish(mqttSensorTopic, JSON.stringify(telemetry));
    }
},  1000);


setInterval(async ()=>{
    await ltePortWrite('AT+CSQ\r\n');
    const batteryLevel = await getBatteryLevel();
    const batteryVoltage = await getBatteryVoltage();
    const batteryIsCharging = await getBatteryCharging();

    console.log('batteryLevel', batteryLevel)
    console.log('batteryVoltage', batteryVoltage)
    console.log('batteryIsCharging', batteryIsCharging)

},  60000);

