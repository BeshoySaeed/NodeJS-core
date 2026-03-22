const { Readable } = require("stream");
const fs = require("fs");

class CustomReadable extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) {
        // handle error
        return callback(err);
      }
      // no error means we have the file descriptor successfully
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);

    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) {
        return this.destroy(err);
      }
      if (bytesRead === 0) {
        // fire end event by pushing null when no more data to read
        this.push(null);
      } else {
        this.push(buffer.subarray(0, bytesRead));
      }
    });
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (closeErr) => {
        callback(closeErr || err);
      });
    } else {
      callback(err);
    }
  }
}

const readable = new CustomReadable({
  highWaterMark: 16,
  fileName: "text.txt",
});

readable.on("data", (chunk) => {
  console.log(`Received chunk: `, chunk.toString());
});

// fire when push(null) is called, indicating no more data to read
readable.on("end", () => {
  console.log("No more data to read.");
});
