const EventEmitter = require('events');

const orders = new EventEmitter();

// Kitchen listener
orders.on('placed', (item) => {
    console.log(`Kitchen: prepare ${item}`);
});

// Billing listener
orders.on('placed', (item) => {
    console.log(`Billing: charge for ${item}`);
});

// SMS listener
orders.on('placed', (item) => {
    console.log(`SMS: order confirmed`);
});

// Trigger the event
orders.emit('placed', 'Pizza');







// Loyalty Points listener
orders.on('placed', (item) => {
    console.log(`Loyalty Points: points added for ${item}`);
});