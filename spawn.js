const { spawn } = require('child_process');

async function executeCommand(command, args) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args);
    let stdoutData = '';

    // Listen for stdout data
    childProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    // Listen for stderr data
    childProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Listen for the process to exit
    childProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
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
    return await executeCommand('echo "get battery" | nc -q 0 127.0.0.1 8423');
}

const getBatteryCharging = async () =>{
    return await executeCommand('echo "get battery_charging" | nc -q 0 127.0.0.1 8423');
}

const getBatteryVoltage = async () =>{
    return await executeCommand('echo "get battery_v" | nc -q 0 127.0.0.1 8423');
}

module.exports = {
  activateKVS,
  getBatteryLevel,
  getBatteryCharging,
  getBatteryVoltage
}