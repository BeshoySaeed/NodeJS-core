const EventEmitter = require("events");

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

myEmitter.on("foo", () => {
  console.log('"Foo Event.');
});

myEmitter.on("foo", (h) => {
  console.log('"Foo Event 2.', h);
});

myEmitter.once("eOnce", () => {
  console.log("emit event for one time");
});

myEmitter.emit("foo", 2);
myEmitter.emit("eOnce");
myEmitter.emit("eOnce");
