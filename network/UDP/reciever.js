const dgram = require('dgram');

const reciever = dgram.createSocket('udp4');

reciever.on('message', (msg, rinfo) => {
    console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
});


reciever.bind({port : 2020, address: '127.0.0.1'});

reciever.on('listening', () => {
    const address = reciever.address();
    console.log(`UDP reciever is listening on ${address.address}:${address.port}`);
});