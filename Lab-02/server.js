const http = require('http');

function handler(req, res) {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        res.end(
            'Welcome to my Node.js Server\n' +
            'Name: Gauri Tyagi\n' +
            'Scholar Number: 23145006\n' +
            'Course: BCA'
        );

    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('I am a BCA student and I am learning Node.js.');

    } else if (req.url === '/college') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('College: Dev Sanskriti Vishwavidyalaya\nSemester: BCA VII');

    } else if (req.url === '/profile') {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        const profile = {
            name: 'Gauri Tyagi',
            scholarNumber: '23145006',
            course: 'BCA',
            semester: 'VII',
            college: 'Dev Sanskriti Vishwavidyalaya'
        };

        res.end(JSON.stringify(profile));

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }
}


// Export the handler so Lab-08 can use it
module.exports = handler;


// Start the server only when this file is run directly
if (require.main === module) {

    const PORT = process.env.PORT || 3000;

    const server = http.createServer(handler);

    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}