const { spawn } = require('child_process');

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, {
      shell: true,
      stdio: 'inherit'
    });
    let stdoutData = '';

    // Listen for stdout data
    childProcess.on('data', (data) => {
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
  }, 5000);
}

const getBatteryLevel = async () =>{
  const result = await executeCommand('echo "get battery" | nc -q 0 127.0.0.1 8423');
  return parseFloat(result?.split(' ')[1] || 0);
}

const getBatteryCharging = async () =>{
  const result = await executeCommand('echo "get battery_charging" | nc -q 0 127.0.0.1 8423');
  return result?.split(' ')[1] === 'true' ? true : false; 
}

const getBatteryVoltage = async () =>{
  const result = await executeCommand('echo "get battery_v" | nc -q 0 127.0.0.1 8423');
  return parseFloat(result?.split(' ')[1] || 0); 
}

module.exports = {
  activateKVS,
  getBatteryLevel,
  getBatteryCharging,
  getBatteryVoltage
}