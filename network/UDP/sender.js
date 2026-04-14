const dgram = require('dgram');

const port = 2020;
const address = '127.0.0.1';

const sender = dgram.createSocket('udp4');

sender.send('Hello, UDP!', port, address);