const telemetry = {
  battery: {
    voltage: {
      value: null,
      unit: "V",
    },
    level: {
      value: null,
      unit: "%",
    },
    isCharging: {
      value: false,
      unit: "boolean",
    },
  },
  cpu: {
    usage: {
      value: null,
      unit: "%",
    },
    temperature: {
      value: null,
      unit: "°C",
    },
  },
  gps: {
    lat: {
      value: null,
    },
    lon: {
      value: null,
    },
    speed: {
      value: null,
    },
    track: {
      value: 0,
      unit: "°",
    },
    alt: {
      value: null,
      unit: "m",
    },
  },
  lte: {
    signal: { value: null },
  },
  kvs: false,
  set updateBatteryLevel(val) {
    this.battery.level.value = val;
  },
  set updateBatteryIsCharging(val) {
    this.battery.isCharging.value = val;
  },
  set updateBatteryVoltage(val) {
    this.battery.voltage.value = val;
  },
  set updateCPUTemperature(val) {
    this.cpu.temperature.value = val;
  },
  set updateCPUUsage(val) {
    this.cpu.usage.value = val;
  },
  set updateKVS(val) {
    this.kvs = val;
  },
  set updateGPS(val) {
    this.gps = val;
  },
  set updateLTE(val) {
    this.lte.signal.value = parseInt(val?.split(",")[0] || "0");
  },
};

module.exports = {
  telemetry,
};
