const { Writable } = require("stream");
const fs = require("fs");

class CustomWritable extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.chunkQueue = [];
    this.chunkSize = 0;
    this.numberOfWrites = 0;
  }

  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // handle error
        callback(err);
      } else {
        // no error means we have the file descriptor successfully
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunkQueue.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize >= this.writableHighWaterMark) {
      const bufferToWrite = Buffer.concat(this.chunkQueue, this.chunkSize);
      fs.write(this.fd, bufferToWrite, (err) => {
        if (err) {
          callback(err);
        }
        this.chunkQueue = [];
        this.chunkSize = 0;
        ++this.numberOfWrites;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    // call back in final call finish event will be emitted
    if (this.chunkSize > 0) {
      const bufferToWrite = Buffer.concat(this.chunkQueue, this.chunkSize);
      fs.write(this.fd, bufferToWrite, (err) => {
        if (err) {
          callback(err);
        }
        this.chunkQueue = [];
        this.chunkSize = 0;
        callback();
      });
    } else {
      callback();
    }
    console.log(`Write #${this.numberOfWrites} completed`);
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (closeErr) => {
        if (closeErr) {
          callback(closeErr);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  }
}

(async () => {
  console.time("stream");

  const stream = new CustomWritable({
    highWaterMark: 16 * 1024, // 16KB
    fileName: "text.txt",
  });
  let i = 0;

  function write() {
    let ok = true;

    while (i < 1000000 && ok) {
      ok = stream.write(` ${i} \n`);
      i++;
    }

    if (i < 1000000 && ok) {
      stream.once("drain", write);
    } else {
      stream.end();
    }
  }

  stream.on("finish", () => {
    console.log("Finished writing:", i);
    console.timeEnd("stream");
  });

  write();
})();
