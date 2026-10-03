const EventEmitter = require('events');

class NotificationCenter extends EventEmitter {
}

const notifier = new NotificationCenter();

// New message event
notifier.on('newMessage', (from, text) => {
    console.log(`New message from ${from}: ${text}`);
});

// Error event
notifier.on('error', (err) => {
    console.log('Handled:', err.message);
});

// Trigger the events
notifier.emit('newMessage', 'Priya', 'You free?');

notifier.emit('error', new Error('Notification failed'));




notifier.on('userOnline', (username) => {
    console.log(`${username} is now online.`);
});