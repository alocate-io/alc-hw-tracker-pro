const ping = require('ping');
const testHost = 'google.com';

const logEnvironmentVariables = () => {
    console.log('DEVICE_ID', process.env.DEVICE_ID);
    console.log('AWS_ALOCATE_MQTT_ENDPOINT', process.env.AWS_ALOCATE_MQTT_ENDPOINT);
}

const testInternet = async () => {
    const result = await ping.promise.probe(testHost);

    return result.alive;
}

module.exports ={
    logEnvironmentVariables,
    testInternet
}