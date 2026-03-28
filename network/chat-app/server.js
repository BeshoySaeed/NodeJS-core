const net = require("net");

const port = 3020;
const host = "127.0.0.1";


const server = net.createServer();
let clients = [];

const colors = [
    '\x1b[31m',
    '\x1b[32m',
    '\x1b[33m',
    '\x1b[34m',
    '\x1b[35m',
    '\x1b[36m',
    '\x1b[37m',
    '\x1b[38m',
    '\x1b[39m',
]
const resetColor = '\x1b[0m';

server.on("connection", (socket) => {
    const color = colors[socket.remotePort % colors.length];
    let clientId = socket.remoteAddress + '-' + socket.remotePort;

    console.log(`${color}${clientId} connected${resetColor}`);

    clients.map((client) => {
        client.socket.write(`${color}${clientId}${resetColor} : connected`);
    })

    socket.on("data", (data) => {
        // Use sender's color for broadcasting
        const message = `${color}${clientId}${resetColor} : ${data.toString()}`;
        clients.forEach(client => {
            client.socket.write(message);
        });
    });


    socket.on("end", () => {
        clients = clients.filter(c => c.clientId !== clientId);
        clients.forEach((client) => {
            client.socket.write(`User ${color}${clientId}${resetColor} left!`);
        });
    });

    socket.on("error", (err) => {
        console.log(`${color}${clientId}${resetColor} error: ${err.message}`);
        clients = clients.filter(c => c.clientId !== clientId);
        clients.forEach((client) => {
            client.socket.write(`User ${color}${clientId}${resetColor} left!`);
        });
    });

    clients.push({ socket, clientId, color });
});



server.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`, server.address());
})