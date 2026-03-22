const { Buffer, constants } = require("buffer");

const memoryContainer = Buffer.alloc(4); // 4 bytes or 32 bits from the heap memory

console.log("memoryContainer", memoryContainer);

memoryContainer[0] = 0xf4; // 244 in decimal
memoryContainer[1] = 0x34; // 244 in decimal
memoryContainer[2] = 0xb6; // 244 in decimal
memoryContainer[3] = 0xff; // 244 in decimal
console.log("memoryContainer", memoryContainer);
console.log("first byte in memoryContainer", memoryContainer[0]);
console.log("second byte in memoryContainer", memoryContainer[1]);
console.log("third byte in memoryContainer", memoryContainer[2]);
console.log("fourth byte in memoryContainer", memoryContainer[3]);

const bufferContainer = Buffer.alloc(3);

bufferContainer[0] = 0x48;
bufferContainer[1] = 0x69;
bufferContainer[2] = 0x21;

console.log("bufferContainer", bufferContainer);
console.log("bufferContainer (utf8)", bufferContainer.toString("utf8"));

console.log("constants max length of buffer", constants.MAX_LENGTH);
