const net = require("net");

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log('data as buffer', data)
        console.log('data as string', data.toString())
    })
})

server.listen(3020, "127.0.0.1", () => {
    console.log("Server is running on port 3020", server.address());
});