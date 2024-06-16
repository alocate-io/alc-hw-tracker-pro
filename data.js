const telemetry = {
    battery: {
      voltage: {
        value: null,
        unit: "V",
      },
      level: {
        value: null,
        unit: "%"
      },
      isCharging: {
        value: false,
        unit: 'boolean'
      }
    },
    temperature: {
      cpu: {
        value: null,
        unit: "°C",
      }
    },
    gps: {
      lat: {
        value: 43.66322274012296,
      },
      lon: {
        value: -79.51939702033998,
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
      this.temperature.cpu.value = val;
  },
    set updateGPS(val) {
        this.gps = val;
    },
    set updateLTE(val) {
        this.lte.signal.value = parseInt(val?.split(',')[0] || '0');
    },                   
};

module.exports = {
    telemetry
}