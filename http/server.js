const http = require('http');


const port = 3000;

const server = http.createServer();


server.on('request', (request, response) => {

    console.log('request: method', request.method);
    response.write('message from server');

    console.log("the body");
    server.on('data', (chunk) => {
        // listen on the body as stream;
        console.log(chunk.toString());
    })
})

server.listen(port, () => {
    console.log('connection on ', server.address());
});