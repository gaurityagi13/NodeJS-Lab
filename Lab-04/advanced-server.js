const http = require('http');
const url = require('url');

// Student data
const students = [
    { id: 1, name: "Aditya", course: "BIT", marks: 72 },
    { id: 2, name: "Ayush", course: "BCA", marks: 80 },
    { id: 3, name: "Bhaskar", course: "BIT", marks: 78 },
    { id: 4, name: "Gauri", course: "BCA", marks: 85 },
    { id: 5, name: "Kanak", course: "BCA", marks: 79 },
    { id: 6, name: "Pragya", course: "BIT", marks: 70 },
    { id: 7, name: "Rishabh", course: "BCA", marks: 84 },
    { id: 8, name: "Sayon", course: "BCA", marks: 88 },
    { id: 9, name: "Shreya Singh", course: "BCA", marks: 84 },
    { id: 10, name: "Shreya Kashyup", course: "BCA", marks: 76 },
    { id: 11, name: "Sudanshu", course: "BCA", marks: 60 },
    { id: 12, name: "Yadev", course: "BIT", marks: 77 }
];

// Create server
function handler(req, res) {

    // Response will be in JSON format
    res.setHeader('Content-Type', 'application/json');

    // Read URL and query parameters
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const query = parsedUrl.query;

    // We are working with /students route
    if (pathName === '/students') {

        // Start with all students
        let result = students;

        // -----------------------------
        // TASK 3: Filter by course
        // Example: /students?course=BCA
        // -----------------------------
        if (query.course) {
            result = result.filter(student =>
                student.course.toLowerCase() === query.course.toLowerCase()
            );
        }

        // -----------------------------
        // TASK 3 + TASK 7: Filter by minimum marks
        // Example: /students?minMarks=70
        // -----------------------------
        if (query.minMarks) {

            // Check whether minMarks is a valid number
            if (isNaN(Number(query.minMarks))) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    error: "minMarks must be a number"
                }));
            }

            result = result.filter(student =>
                student.marks >= Number(query.minMarks)
            );
        }

        // -----------------------------
        // TASK 4: Search by student name
        // Example: /students?search=ga
        // -----------------------------
        if (query.search) {

            const searchText = query.search.toLowerCase();

            result = result.filter(student =>
                student.name.toLowerCase().includes(searchText)
            );
        }

        // -----------------------------
        // TASK 5: Sorting
        // Example: /students?sort=marks
        // -----------------------------

        if (query.sort) {

            // Only name and marks are allowed
            if (query.sort !== 'name' && query.sort !== 'marks') {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    error: "sort must be either name or marks"
                }));
            }

            // Default order is ascending
            const order = query.order || 'asc';

            // Check order value
            if (order !== 'asc' && order !== 'desc') {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    error: "order must be either asc or desc"
                }));
            }

            // Sort by name
            if (query.sort === 'name') {

                result.sort((a, b) => {
                    if (order === 'asc') {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });

            }

            // Sort by marks
            if (query.sort === 'marks') {

                result.sort((a, b) => {

                    if (order === 'asc') {
                        return a.marks - b.marks;
                    } else {
                        return b.marks - a.marks;
                    }

                });
            }
        }

        // Send final result
        res.statusCode = 200;
        res.end(JSON.stringify(result));

    } else {

        // If route is wrong
        res.statusCode = 404;
        res.end(JSON.stringify({
            error: "Route not found"
        }));
    }
}

// Start server
module.exports = handler;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    const server = http.createServer(handler);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}