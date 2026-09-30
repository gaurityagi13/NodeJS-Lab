function placeOrder(item) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Order Placed: ${item}`);
            resolve(item);
        }, 1000);
    });
}

function trackOrder(item) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Preparing: ${item}`);
            resolve(item);
        }, 1000);
    });
}

function confirmDelivery(item) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Out for Delivery: ${item}`);
            resolve(item);
        }, 1000);
    });
}

placeOrder('Pasta')
    .then((item) => {
        return trackOrder(item);
    })
    .then((item) => {
        return confirmDelivery(item);
    })
    .then((item) => {
        console.log(`Delivered: ${item}`);
    })
    .catch((error) => {
        console.log(`Order failed: ${error}`);
    });