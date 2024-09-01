const { spawn } = require('child_process');
const { telemetry } = require('./data');

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    let stdoutData = '';

    // Listen for stdout data
    childProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    // Listen for the process to exit
    childProcess.on('close', (code) => {
      resolve(stdoutData);
    });

    // Listen for error events
    childProcess.on('error', (err) => {
      console.error('Failed to execute command:', err);
      reject(err);
    });
  });
}

const activateKVS = () => {
  setTimeout(()=>{
      const kvsClient = spawn('/home/pi/kvs/kvsWebrtcClientMasterGstSample', [process.env.DEVICE_ID]);    
      console.log(`${new Date().toLocaleString()} | KVS: Start`);
      telemetry.updateKVS = true;
  }, 10000);
}

const getCPUTemperature = async () =>{
  const result = await executeCommand('cat /sys/class/thermal/thermal_zone0/temp');
  const tempCelsius = (parseInt(result, 10) / 1000).toFixed(2);

  return parseFloat(tempCelsius);
}

const getBatteryLevel = async () =>{
  const result = await executeCommand('echo "get battery" | nc -q 0 127.0.0.1 8423');
  return parseFloat(result?.split(' ')[1] || 0);
}

const getBatteryCharging = async () =>{
  const result = await executeCommand('echo "get battery_charging" | nc -q 0 127.0.0.1 8423');
  return result.includes('true') ? true : false; 
}

const getBatteryVoltage = async () =>{
  const result = await executeCommand('echo "get battery_v" | nc -q 0 127.0.0.1 8423');
  return parseFloat(result?.split(' ')[1] || 0); 
}

module.exports = {
  activateKVS,
  getBatteryLevel,
  getBatteryCharging,
  getBatteryVoltage,
  getCPUTemperature
}