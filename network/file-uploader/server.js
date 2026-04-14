const net = require('net');
const fs = require('fs/promises');

const host = '::1';
const port = 2020;

const server = net.createServer(() => {});

server.on('connection', async socket => {
    console.log('Client connected', socket.remoteAddress, socket.remotePort);
    const fileHandler = await fs.open('./storage/file.txt', 'a');
    const fileStream = fileHandler.createWriteStream();
    socket.on('data', async (data) => {


        // backpressure handling
        function writeToFile () {
            const canWrite = fileStream.write(data);
            if (!canWrite) {
                socket.pause();
                fileStream.once('drain', () => {
                    socket.resume();
                    writeToFile();
                });
            }
        }

        writeToFile();

        fileStream.on('finish', () => {
            console.log('File saved successfully');
            socket.end('File uploaded successfully');
        });

        fileStream.on('error', (err) => {
            console.error('Error writing file:', err);
            socket.end('Error uploading file');
        });

    });

    socket.on('end', () => {
        console.log('Client disconnected', socket.remoteAddress, socket.remotePort);
        fileStream.end();
    });
})


server.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`, server.address());
})