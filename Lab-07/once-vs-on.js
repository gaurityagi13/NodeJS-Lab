const EventEmitter = require('events');

const app = new EventEmitter();

// Welcome bonus: only once
app.once('firstLogin', (user) => {
    console.log(`Welcome bonus applied for ${user}!`);
});

// Login message: every time
app.on('login', (user) => {
    console.log(`${user} logged in.`);
});

// Trigger the events
app.emit('firstLogin', 'Aman');
app.emit('login', 'Aman');

app.emit('firstLogin', 'Aman');
app.emit('login', 'Aman');

app.emit('firstLogin', 'Aman');
app.emit('login', 'Aman');