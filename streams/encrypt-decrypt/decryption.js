const { Transform } = require("stream");
const fs = require("fs/promises");

class Decrypt extends Transform {
  constructor() {
    super();
    this.totalBytesRead = 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalBytesRead += chunk.length;
    // bytesread
    let iterations = 0;
    for (let i = 0; i < chunk.length; i++) {
      iterations++;
      if (chunk[i] > 0) {
        chunk[i] = chunk[i] - 1;
      }

      const bytesDecryptedInChunk = i + 1;
      const totalBytesDecrypted =
        this.totalBytesRead - (chunk.length - bytesDecryptedInChunk);

      if (iterations % 100 === 0) {
        console.log(
          "loader",
          Math.round((totalBytesDecrypted / this.totalBytesRead) * 100) + "%",
        );
      }
    }
    console.log("loader", "100%");

    callback(null, chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open("write.txt", "r");
  const writeFileHandle = await fs.open("decrypted.txt", "w");

  const { size } = await readFileHandler.stat();
  console.log(size);

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const decrypt = new Decrypt();
  readStream.pipe(decrypt).pipe(writeStream);
})();
