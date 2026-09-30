const http = require('http');

const students = [
    {
        id: 1,
        name: "Gauri",
        scholarNo: "BCA001",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "B+",
        email: "gauri.bca001@example.com",
        phone: "9876500001",
        address: "Muzaffarnagar, Uttar Pradesh"
    },
    {
        id: 2,
        name: "Shreya Singh",
        scholarNo: "BCA002",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "O+",
        email: "shreya.bca002@example.com",
        phone: "9876500002",
        address: "Motihari, Bihar"
    },
    {
        id: 3,
        name: "Kanak",
        scholarNo: "BCA003",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "A+",
        email: "kanak.bca003@example.com",
        phone: "9876500003",
        address: "Bijnor, Uttar Pradesh"
    },
    {
        id: 4,
        name: "Pragya",
        scholarNo: "BCA004",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "AB+",
        email: "pragya.bca004@example.com",
        phone: "9876500004",
        address: "Varanasi, Uttar Pradesh"
    },
    {
        id: 5,
        name: "Shreya Kashyap",
        scholarNo: "BCA005",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "B-",
        email: "shreya.k.bca005@example.com",
        phone: "9876500005",
        address: "Dehradun, Uttarakhand"
    },
    {
        id: 6,
        name: "Mikky",
        scholarNo: "BCA006",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "O-",
        email: "mikky.bca006@example.com",
        phone: "9876500006",
        address: "Gaya, Bihar"
    },
    {
        id: 7,
        name: "Nisha",
        scholarNo: "BCA007",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "A-",
        email: "nisha.bca007@example.com",
        phone: "9876500007",
        address: "Patna, Bihar"
    },
    {
        id: 8,
        name: "Aditya",
        scholarNo: "BCA008",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "B+",
        email: "aditya.bca008@example.com",
        phone: "9876500008",
        address: "Chhindwara, Madhya Pradesh"
    },
    {
        id: 9,
        name: "Ayush Ram Tripathi",
        scholarNo: "BCA009",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "O+",
        email: "ayush.bca009@example.com",
        phone: "9876500009",
        address: "Gorakhpur, Uttar Pradesh"
    },
    {
        id: 10,
        name: "Bhaskar",
        scholarNo: "BCA010",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "AB-",
        email: "bhaskar.bca010@example.com",
        phone: "9876500010",
        address: "Kushinagar, Uttar Pradesh"
    },
    {
        id: 11,
        name: "Rishabh",
        scholarNo: "BCA011",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "A+",
        email: "rishabh.bca011@example.com",
        phone: "9876500011",
        address: "Imphal, Manipur"
    },
    {
        id: 12,
        name: "Sayon",
        scholarNo: "BCA012",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "B+",
        email: "sayon.bca012@example.com",
        phone: "9876500012",
        address: "New Delhi, Delhi"
    },
    {
        id: 13,
        name: "Yadev Singh Nishad",
        scholarNo: "BCA013",
        course: "BCA",
        semester: "VII",
        section: "A",
        department: "Computer Science",
        bloodGroup: "O+",
        email: "yadev.bca013@example.com",
        phone: "9876500013",
        address: "Raipur, Chhattisgarh"
    }
];

const items = [
    {
        id: 1,
        name: "Node.js Basics",
        category: "Programming",
        author: "John Smith",
        price: 450,
        availability: "Available"
    },
    {
        id: 2,
        name: "JavaScript Essentials",
        category: "Programming",
        author: "David Miller",
        price: 550,
        availability: "Available"
    },
    {
        id: 3,
        name: "Web Development Guide",
        category: "Web Development",
        author: "Robert Brown",
        price: 600,
        availability: "Available"
    },
    {
        id: 4,
        name: "Database Fundamentals",
        category: "Database",
        author: "James Wilson",
        price: 500,
        availability: "Available"
    },
    {
        id: 5,
        name: "Computer Networks",
        category: "Networking",
        author: "Michael Davis",
        price: 650,
        availability: "Available"
    }
];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // Return all students
    if (req.url === '/students') {
        res.end(JSON.stringify(students));
    }

    // Return all items
    else if (req.url === '/items') {
        res.end(JSON.stringify(items));
    }

    // Return only BCA students using filter()
    else if (req.url === '/students/course/BCA') {
        const bcaStudents = students.filter(s => s.course === 'BCA');
        res.end(JSON.stringify(bcaStudents));
    }

    // Return one student by ID
    else if (req.url.startsWith('/students/')) {
        const id = Number(req.url.split('/')[2]);

        // Handle non-numeric ID
        if (isNaN(id)) {
            res.writeHead(400);
            res.end(JSON.stringify({
                error: "Student ID must be a number"
            }));
        } 
        
        else {
            const student = students.find(s => s.id === id);

            if (student) {
                res.end(JSON.stringify(student));
            } 
            
            else {
                res.writeHead(404);
                res.end(JSON.stringify({
                    error: "Student not found"
                }));
            }
        }
    }

    // Return one item by ID
    else if (req.url.startsWith('/items/')) {
        const id = Number(req.url.split('/')[2]);
        const item = items.find(i => i.id === id);

        if (item) {
            res.end(JSON.stringify(item));
        } 
        
        else {
            res.writeHead(404);
            res.end(JSON.stringify({
                error: "Item not found"
            }));
        }
    }

    // Route not found
    else {
        res.writeHead(404);
        res.end(JSON.stringify({
            error: "Route not found"
        }));
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});