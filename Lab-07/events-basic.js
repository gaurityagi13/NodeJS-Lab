const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

emitter.emit('greet', 'Class');






/*const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.emit('greet', 'Class');

emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});
There is no output because the event was triggered before the listener was registered. EventEmitter does not automatically replay previous events to listeners added later*/