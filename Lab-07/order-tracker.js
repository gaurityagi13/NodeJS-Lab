const EventEmitter = require('events');

class OrderTracker extends EventEmitter {
    constructor() {
        super();
        this.customers = new Set();

        // Handle errors safely
        this.on('error', (err) => {
            console.log('Order Error:', err.message);
        });

        // Order placed listeners
        this.on('orderPlaced', (order) => {
            console.log(
                `Customer Notification: Your order ${order.id} has been placed.`
            );
        });

        this.on('orderPlaced', (order) => {
            console.log(
                `Restaurant: Received order ${order.id} for ${order.item}.`
            );
        });

        // Order prepared listeners
        this.on('orderPrepared', (order) => {
            console.log(
                `Customer Notification: Your ${order.item} is prepared.`
            );
        });

        this.on('orderPrepared', (order) => {
            console.log(
                `Delivery Partner: Collect order ${order.id}.`
            );
        });

        // Order delivered listeners
        this.on('orderDelivered', (order) => {
            console.log(
                `Customer Notification: Order ${order.id} delivered!`
            );
        });

        this.on('orderDelivered', (order) => {
            console.log(
                `System: Order ${order.id} marked as completed.`
            );
        });
    }

    placeOrder(customer, item, id) {
        const order = { customer, item, id };

        console.log(`\nPlacing order ${id} for ${customer}...`);

        // Bonus for the first order from each customer
        if (!this.customers.has(customer)) {
            this.customers.add(customer);
            this.emit('firstOrderBonus', customer);
        }

        this.emit('orderPlaced', order);

        setTimeout(() => {
            this.prepareOrder(order);
        }, 2000);
    }

    prepareOrder(order) {
        console.log(`\nPreparing ${order.item}...`);

        this.emit('orderPrepared', order);

        setTimeout(() => {
            this.deliverOrder(order);
        }, 2000);
    }

    deliverOrder(order) {
        console.log(`\nDelivering ${order.item}...`);

        this.emit('orderDelivered', order);
    }
}

const tracker = new OrderTracker();

// First order bonus listener
tracker.on('firstOrderBonus', (customer) => {
    console.log(`Bonus: Welcome ${customer}! You earned a first-order reward.`);
});

// Start the order
tracker.placeOrder('Aman', 'Pizza', 101);

// Place a second order for the same customer
setTimeout(() => {
    tracker.placeOrder('Aman', 'Burger', 102);
}, 6000);