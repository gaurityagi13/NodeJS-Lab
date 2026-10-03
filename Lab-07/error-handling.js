/*const EventEmitter = require('events');

const risky = new EventEmitter();

risky.emit('error', new Error('Something broke'));*/

/*replace with because it broke */
const EventEmitter = require('events');

const risky = new EventEmitter();

// Register an error listener
risky.on('error', (err) => {
    console.log('Handled gracefully:', err.message);
});

// Emit the error
risky.emit('error', new Error('Something broke'));

console.log('Program continues running.');