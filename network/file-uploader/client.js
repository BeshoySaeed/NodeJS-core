const net = require('net');
const fs = require('fs/promises');

const host = '::1';
const port = 2020;

const socket = net.createConnection({ host, port }, async () => {
    
    
    console.log(process.argv);
    const filePath = './text.txt';
    const fileHandler = await fs.open(filePath, 'r');
    const fileStream = fileHandler.createReadStream();

    fileStream.on('data', chunk => {

        const isOk = socket.write(chunk);
        if(!isOk) {
            fileStream.pause();


            socket.once('drain', () => {
                fileStream.resume();
            });
        }
    })
    fileStream.on('end', () => {
        console.log('File read completed');
        socket.end();
    });

    socket.on('data', (data) => {
        console.log('Server response:', data.toString());
    });

});

