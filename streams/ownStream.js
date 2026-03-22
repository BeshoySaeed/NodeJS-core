const fs = require("fs/promises");

// without streams
// (async () => {
//   console.time("copy");
//   const fileHandler = await fs.readFile("./text.txt");
//   await fs.writeFile("text-copy.txt", fileHandler);
//   console.timeEnd("copy");
// })();

// with streams
// (async () => {
//   console.time("copy");
//   const fileHandler = await fs.open("./text.txt", "r");
//   const destFileHandler = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;

//   while (bytesRead != 0) {
//     const { buffer } = await fileHandler.read();
//     await destFileHandler.write(buffer);
//     bytesRead = (await fileHandler.read()).bytesRead;
//   }
//   console.timeEnd("copy");
// })();

// with streams and pipe
(async () => {
  console.time("copy");
  const fileHandler = await fs.open("./text.txt", "r");
  const destFileHandler = await fs.open("text-copy.txt", "w");

  const readStream = fileHandler.createReadStream();
  const writeStream = destFileHandler.createWriteStream();

  readStream.pipe(writeStream);

  // readStream.on("data", (chunk) => {
  //   writeStream.write(chunk);
  // });

  console.timeEnd("copy");
})();
