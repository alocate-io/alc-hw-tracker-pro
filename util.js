const ping = require("ping");
const testHost = "google.com";

const logEnvironmentVariables = () => {
  console.log("DEVICE_ID", process.env.DEVICE_ID);
  console.log(
    "AWS_ALOCATE_MQTT_ENDPOINT",
    process.env.AWS_ALOCATE_MQTT_ENDPOINT
  );
};

const testInternet = async () => {
  const result = await ping.promise.probe(testHost, {
    timeout: 50,
  });

  return result.alive;
};

const delay = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  logEnvironmentVariables,
  testInternet,
  delay,
};
