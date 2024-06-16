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
    set updateBattery(val) {
        this.battery.voltage.value = val;
    },
    set updateGPS(val) {
        this.gps = val;
    },
    set updateLTE(val) {
        this.lte.signal.value = val;
    },                   
};

module.exports = {
    telemetry
}