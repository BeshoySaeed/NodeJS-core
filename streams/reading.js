const fs = require("fs/promises");

(async () => {
  const fileHandlerRead = await fs.open("./text.txt", "r");
  const fileHandlerWrite = await fs.open("./text2.txt", "w");

  const stream = fileHandlerRead.createReadStream({ highWaterMark: 64 * 1024 });
  const writeStream = fileHandlerWrite.createWriteStream();

  let split = "";
  stream.on("data", (chunk) => {
    const number = chunk.toString("utf-8").split("  ");

    if (split && Number(number[0]) + 1 !== Number(number[1])) {
      number[0] = split.trim() + number[0].trim();
      split = "";
    }

    if (
      Number(number[number.length - 2]) + 1 !==
      Number(number[number.length - 1])
    ) {
      split = number.pop();
    } else {
      split = "";
    }

    console.log("number", number);

    let i = 0;
    function write() {
      while (i < number.length) {
        const num = number[i];

        if (Number(num) % 2 === 0) {
          const ok = writeStream.write(num + "  ");

          if (!ok) {
            stream.pause();

            writeStream.once("drain", () => {
              stream.resume();
              write();
            });

            return;
          }
        }

        i++;
      }
    }

    write();
  });
})();
