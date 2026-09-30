const fs = require('fs');

fs.writeFile('output.txt', 'This is the second message from Lab 06!', (err) => {
    if (err) throw err;

    console.log('File written successfully.');
});