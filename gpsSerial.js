const GPS = require('gps');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({ path: '/dev/ttyUSB1', baudRate: 115200 });
const gpsSerialParser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
const gps = new GPS;

module.exports = {
    gps,
    gpsSerialParser
}

