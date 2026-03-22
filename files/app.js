// promise

const fsPromise = require("fs/promises");
const fs = require("fs");
const commands = {
  create: "create new file",
  read: "read file",
  update: "update file",
  delete: "delete file",
};
(async () => {
  try {
    await fsPromise.copyFile(
      "D:\\2026\\nodeJS\\files\\text.txt",
      "D:\\2026\\nodeJS\\files\\text_copy.txt",
    );

    // delete file
    // await fs.unlink("D:\\2026\\nodeJS\\files\\text_copy.txt");

    fs.watch(
      // ← Remove the 'await' here
      "D:\\2026\\nodeJS\\files\\text_copy.txt",
      (eventType, filename) => {
        // read the file content
        if (eventType == "change") {
          fs.readFile(
            "D:\\2026\\nodeJS\\files\\text_copy.txt",
            "utf-8",
            (err, data) => {
              if (err) console.log(err);
              console.log(`File content: ${data}`);
              if (data.includes(commands.create)) {
                console.log("Create command detected.");
              }
            },
          );
          console.log(`File ${filename} has been ${eventType}`);
        }
      },
    );

    // write file
    await fs.writeFile(
      "D:\\2026\\nodeJS\\files\\text_copy.txt",
      "Copied file with promise and then write on it.",
    );
  } catch (err) {
    console.log(err);
  }
})();

// call back function

// const fs = require("fs");
// fs.copyFile(
//   "D:\\2026\\nodeJS\\files\\text.txt",
//   "D:\\2026\\nodeJS\\files\\text_copy-2.txt",
//   (err) => {
//     if (err) console.log(err);
//   },
// );

// sync function

// const fs = require("fs");
// fs.copyFileSync(
//   "D:\\2026\\nodeJS\\files\\text.txt",
//   "D:\\2026\\nodeJS\\files\\text_copy-3.txt",
// );
