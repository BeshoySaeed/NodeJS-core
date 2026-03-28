const net = require("net");

const socket = net.createConnection({
    port: 3020,
    host: "127.0.0.1"
}, () => {
    socket.write(Buffer.alloc(2));
    // socket.end();
})