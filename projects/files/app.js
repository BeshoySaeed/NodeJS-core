const fsPromises = require("fs/promises");
const { Buffer } = require("buffer");


(async () => {
  try {

    const commands = {
      create: async (dirPath, fileName, content = '') => {
        dirPath = dirPath.trim();
        fileName = fileName.trim();
        // we want to check whether we have the file or not
        let isExist;
        try {
          // try to open the file
          isExist = await fsPromises.open(`${dirPath}/${fileName}`, 'r');
          console.log('File already exists');
          // close the file
          isExist.close();
          return;
        } catch (err) {
          // if file does not exist, create it
          const newFileHandle = await fsPromises.open(`${dirPath}/${fileName}`, 'w');
          newFileHandle.close();
        }


      },

      delete: async (dirPath, fileName, content = '') => {
        // trim the path and file name
        dirPath = dirPath.trim();
        fileName = fileName.trim();
        try{
          // delete the file
          await fsPromises.unlink(`${dirPath}/${fileName}`);
        }catch (err) {
          console.log('file not exist', err)
        }
      },

      rename: async (oldPath, newPath, content = '') => {
        oldPath = oldPath.trim();
        newPath = newPath.trim();
        try{
          const commandFile = await fsPromises.open(oldPath, 'r');
          await fsPromises.rename(oldPath, newPath);
          commandFile.close();
        }catch (err) {
          console.log('file not exist', err)
        }
        
      },

      update: async (dirPath, fileName, content = '') => {
        try {
          await fsPromises.writeFile(
            `${dirPath}/${fileName}`,
            content,
            'utf8'
        );
        } catch (err) {
          console.log('Update error:', err.message);
        }
      },
    };


    const commandFile = await fsPromises.open('./command.txt', 'r');
    commandFile.on('change', async () => {
      const { size } = await commandFile.stat();
      // alocate buffer with the size of the file
      const buff = Buffer.alloc(size);
      // define the offset, position and length
      const offset = 0;
      const position = 0;
      const length = buff.byteLength;
      // read the file
      await commandFile.read(buff, offset, length, position);
      const content = buff.toString('utf8').trim();
      const lines = content.split('\n');
      for (let line of lines) {
        const [command, dirPath, fileName, ...contentParts] = line.split(' ');

        if (commands[command]) {
          const content = contentParts.join(' ');
          await commands[command](dirPath, fileName, content);
        }
      }

    })



    const watcher = fsPromises.watch('./command.txt');
    for await (let event of watcher) {
      if (event.eventType == 'change') {
        commandFile.emit('change')
      }
    }

  } catch (err) {
  }
})();
