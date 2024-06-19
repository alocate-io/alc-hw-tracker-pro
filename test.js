const ping = require('ping');

const testHost = 'google.com';

const testInternet = async () => {
    return await ping.promise.probe(testHost);
}

const init = async () =>{
    console.log(await testInternet());
}

init();