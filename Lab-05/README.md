# Lab 05 – Simulating a Food Delivery Tracker

## Department of Computer Science

**Course:** CS403NOD – Node.js  
**Semester:** BCA VII  
**Lab Number:** 05  
**Date:** 01-09-2026  

## Objective

The objective of this lab is to understand asynchronous programming in Node.js using callbacks, Promises and async/await. The lab also demonstrates Promise chaining, error handling, Promise.all() and the Event Loop.

## Files and Their Purpose

### 1. callback-version.js
Demonstrates asynchronous order processing using callbacks and nested callbacks.

### 2. promise-version.js
Demonstrates how Promises handle successful and failed order processing using .then() and .catch().

### 3. chaining-version.js
Demonstrates Promise chaining for the complete order lifecycle from placing an order to delivery.

### 4. async-await-version.js
Demonstrates the same order process using async/await with try/catch for error handling.

### 5. concurrent-orders.js
Demonstrates running multiple orders at the same time using Promise.all().

## Tasks Completed

- Task 1 – Project Setup
- Task 2 – Callback Version
- Task 3 – Promise Version
- Task 4 – Promise Chaining
- Task 5 – Async/Await Refactor
- Task 6 – Concurrent Orders with Promise.all()
- Task 7 – Event Loop Reflection

## Key Learning

Through this lab, I learned that callbacks can become difficult to manage when many asynchronous operations are nested. Promises make asynchronous code easier to chain and handle errors. Async/await makes Promise-based code easier to read. I also learned that Promise.all() can run independent asynchronous operations concurrently and usually takes approximately the time of the longest operation.

## Problems Faced

No major problems were faced while completing this lab.

## Conclusion

This lab helped me understand asynchronous programming in Node.js. I learned three different ways of handling asynchronous operations: callbacks, Promises and async/await. I also understood how Promise.all() works and how asynchronous operations are connected with the Node.js Event Loop.