module.exports = [
    {
        id: '01',
        title: 'Node.js Basics',
        topic: 'Node.js introduction and basic program',
        type: 'script',
        file: '../Lab-01/app.js'
    },

    {
        id: '02',
        title: 'Basic HTTP Server',
        topic: 'HTTP module, routing and JSON response',
        type: 'server',
        file: '../Lab-02/server.js',
        try: '/'
    },

    {
        id: '03',
        title: 'Student Directory Server',
        topic: 'HTTP server, students API and routing',
        type: 'server',
        file: '../Lab-03/students-server.js',
        try: '/students'
    },

    {
        id: '04',
        title: 'Advanced Student API',
        topic: 'Query parameters, filtering, searching and sorting',
        type: 'server',
        file: '../Lab-04/advanced-server.js',
        try: '/students'
    },

    {
        id: '05',
        title: 'Food Delivery Tracker',
        topic: 'Callbacks, Promises and Async/Await',
        type: 'script',
        file: '../Lab-05/async-await-version.js'
    },

    {
        id: '06',
        title: 'File System Operations',
        topic: 'Node.js File System module',
        type: 'script',
        file: '../Lab-06/write-file.js'
    },

    {
        id: '07',
        title: 'EventEmitter',
        topic: 'Events and EventEmitter in Node.js',
        type: 'script',
        file: '../Lab-07/events-basic.js'
    }
];