const fsPromises = require("fs/promises");
const fs = require("fs");

// take 24s 60CPU 50Memory
// ( async () => {
//     const fileHandler = await fsPromises.open('./test.txt', 'w');
//     try {
//         console.time('time');
//         for(let i = 0; i < 1000000; i++) {
//             await fileHandler.write(`Line ${i}\n`);
//         }
//         console.timeEnd('time')
//     } catch (error) {
//         console.log(error);
//     } finally {
//         fileHandler.close();
//     }
// } )()

// done in 1.9s also lower cpu and memorys
// ( async () => {
//     const fileHandler = fs.open('./test.txt', 'w', (err, fd) => {
//         console.time('time');
//         for(let i = 0; i < 1000000; i++) {
//             const buff = Buffer.from(`${ i }`);
//             fs.writeSync(fd, buff)
//         }
//         console.timeEnd('time')
//     });
//     try {

//     } catch (error) {
//         console.log(error);
//     } finally {
//     }
// } )()

(async () => {
  console.time("stream");

  const stream = fs.createWriteStream("text.txt");
  let i = 0;

  function write() {
    let ok = true;

    while (i < 1000000 && ok) {
      ok = stream.write(` ${i} `);
      i++;
    }

    if (i < 1000000) {
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
