// encryption/decryption => crypto
// hashing/salting => crypto
// compression => zlib
// decoding/encoding => buffer and text-encoding/encoding

const { Transform } = require("stream");
const fs = require("fs/promises");

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    console.log("we are here", chunk);

    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] < 255) {
        chunk[i] = chunk[i] + 1;
      }
    }

    callback(null, chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open("read.txt", "r");
  const writeFileHandle = await fs.open("write.txt", "w");

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const encrypt = new Encrypt();
  readStream.pipe(encrypt).pipe(writeStream);
})();
