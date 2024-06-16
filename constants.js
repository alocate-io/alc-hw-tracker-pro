const deviceId = process.env.DEVICE_ID;
const mqttEndpoint = `mqtts://${process.env.AWS_ALOCATE_MQTT_ENDPOINT}:8883`;
const mqttSensorTopic =
  `alocate/sensor/stream/${deviceId}`;

module.exports = {
    mqttEndpoint,
    mqttSensorTopic
}