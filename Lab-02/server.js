const http = require('http');

const server = http.createServer((req, res) => {

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
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('Server is running at http://localhost:3000');
});