const logEnvironmentVariables = () => {
    console.log('DEVICE_ID', process.env.DEVICE_ID);
    console.log('AWS_ALOCATE_MQTT_ENDPOINT', process.env.AWS_ALOCATE_MQTT_ENDPOINT);
}

module.exports ={
    logEnvironmentVariables
}