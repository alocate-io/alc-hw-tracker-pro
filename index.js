const {
  activateKVS,
  getCPUTemperature,
  getBatteryLevel,
  getBatteryVoltage,
  getBatteryCharging,
} = require("./spawn");
const { mqttMotorChannel, mqttSensorTopic } = require("./constants");
const { mqttClient } = require("./iot");
const { lteSerialPort, lteSerialParser, ltePortWrite } = require("./lteSerial");
const { telemetry } = require("./data");
const { testInternet, logEnvironmentVariables, delay } = require("./util");

const GPS = require("gps");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

let isMQTTConnected = false;

logEnvironmentVariables();

// LTE SERIAL LISTENER
lteSerialPort.on("open", async () => {
  console.log(new Date().toISOString(), "LTE Serial Port: Ready");

  await ltePortWrite("AT\r\n");
  await updateTelemetry();

  /** NOTE: commenting this out, since we'll be using AT+CGPSAUTO=1 on device*/
  // await ltePortWrite('AT+CGPS=1\r\n');

  setTimeout(() => {
    gpsInitialize();
  }, 15000);

  setTimeout(() => {
    kvsInitialize();
  }, 20000);
});

lteSerialParser.on("data", (data) => {
  data = data.toString();

  console.log("MODEM:", data);

  if (data.includes("+CSQ:")) {
    data = data.replace("+CSQ: ", "");

    telemetry.updateLTE = data;
  }
});

const gpsInitialize = () => {
  console.log("GPS:", "Initializing NMEA Stream");

  const port = new SerialPort({ path: "/dev/ttyUSB1", baudRate: 115200 });
  const gpsSerialParser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  const gps = new GPS();

  // GPS SERIAL LISTENERS
  gps.on("data", () => {
    if (gps.state.lat && gps.state.lon) {
      telemetry.updateGPS = {
        lat: { value: gps.state.lat },
        lon: { value: gps.state.lon },
        speed: { value: Math.round(gps.state.speed) },
        track: { value: Math.round(gps.state.track), unit: "°" },
        alt: { value: Math.round(gps.state.alt), unit: "m" },
      };
    }
  });

  gpsSerialParser.on("data", (data) => {
    if (
      data.includes("$GPVTG") ||
      data.includes("$GPGGA") ||
      data.includes("$GPHDT") ||
      data.includes("$GPRMC")
    )
      gps.update(data);
  });
};

const kvsInitialize = async () => {
  const attempts = 10;

  for (let step = 0; step < attempts; step++) {
    if (await testInternet()) {
      console.log(`${new Date().toLocaleString()} | LTE: Internet Connected'`);
      await delay(10000);
      activateKVS();
      break;
    } else console.log("LTE: No Internet");
  }
};

// MQTT LISTENERS
mqttClient.on("connect", () => {
  console.log("MQTT Client: Connected");
  isMQTTConnected = true;

  mqttClient.subscribe(mqttMotorChannel, (err) => {
    if (!err) console.log(`Subscribed to [${mqttMotorChannel}]`);
  });
});

mqttClient.on("disconnect", () => {
  console.log("MQTT Client: Disconnected");
  isMQTTConnected = false;

  telemetry.updateKVS = false;
});

mqttClient.on("close", () => {
  console.log("MQTT Client: Closed");
  isMQTTConnected = false;

  telemetry.updateKVS = false;
});

const updateTelemetry = async () => {
  // const batteryLevel = await getBatteryLevel();
  // const batteryVoltage = await getBatteryVoltage();
  // const batteryIsCharging = await getBatteryCharging();
  const cpuTemperature = await getCPUTemperature();

  await ltePortWrite("AT+CSQ\r\n");

  // telemetry.updateBatteryLevel = batteryLevel;
  // telemetry.updateBatteryIsCharging = batteryIsCharging;
  // telemetry.updateBatteryVoltage = batteryVoltage;
  telemetry.updateCPUTemperature = cpuTemperature;
};

// INTERVAL READERS
setInterval(() => {
  if (isMQTTConnected) {
    mqttClient.publish(mqttSensorTopic, JSON.stringify(telemetry));
  }
}, 1000);

setInterval(async () => {
  await updateTelemetry();

  if (!telemetry.kvs) {
    console.log("KVS status is disconnected, attempting to reconnect...");
    kvsInitialize();
  } else console.log("KVS status is normal");
}, 60000);
