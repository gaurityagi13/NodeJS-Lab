const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execFile } = require('child_process');
const { promisify } = require('util');
const slugify = require('slugify');

const labs = require('./labs');
const { logger, LOG_FILE } = require('./modules/logger');

const execFileAsync = promisify(execFile);

const PORT = process.env.PORT || 3000;


// ==================================================
// SEND RESPONSE
// ==================================================

function send(res, status, data, contentType = 'application/json') {

    res.writeHead(status, {
        'Content-Type': `${contentType}; charset=utf-8`
    });

    if (contentType.includes('application/json')) {
        res.end(JSON.stringify(data, null, 2));
    } else {
        res.end(data);
    }
}


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


// ==================================================
// FIND LAB
// ==================================================

function getLab(id) {
    return labs.find(lab => lab.id === id);
}


// ==================================================
// GET LIVE ROUTE
// ==================================================

function getLiveRoute(lab) {

    if (lab.try) {
        return lab.try;
    }

    if (lab.id === '03' || lab.id === '04') {
        return '/students';
    }

    return '/';
}


// ==================================================
// GET LAB SCREENSHOTS
// ==================================================

async function getLabScreenshots(id) {

    const screenshotDir = path.join(
        __dirname,
        'public',
        'screenshots'
    );

    try {

        const files = await fs.promises.readdir(
            screenshotDir
        );

        const prefix = `lab${id}`;

        return files.filter(file =>
            file.toLowerCase().startsWith(
                prefix.toLowerCase()
            ) &&
            /\.(png|jpg|jpeg)$/i.test(file)
        );

    } catch (error) {

        return [];

    }
}


// ==================================================
// PORTAL HTML
// ==================================================

function createPortalHTML() {

    const environment = process.env.RENDER
        ? 'live (Render)'
        : 'local';

    const cards = labs.map(lab => {

        return `
        <div class="card">

            <div class="lab-number">
                LAB ${lab.id}
            </div>

            <h2>${escapeHTML(lab.title)}</h2>

            <p>${escapeHTML(lab.topic)}</p>

            <span class="type ${lab.type}">
                ${lab.type.toUpperCase()}
            </span>

            <br><br>

            <a href="/labs/${lab.id}">
                View Lab
            </a>

        </div>
        `;

    }).join('');

    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Node.js Integrated Lab Server</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f7fa;
    color: #1f2937;
}

header {
    background: white;
    padding: 35px 20px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
}

header h1 {
    margin: 0 0 10px;
    font-size: 32px;
}

header p {
    margin: 6px 0;
    color: #6b7280;
}

.environment {
    display: inline-block;
    margin-top: 15px;
    padding: 8px 14px;
    border-radius: 20px;
    background: #eef2ff;
    color: #3730a3;
    font-size: 14px;
}

.container {
    max-width: 1100px;
    margin: 35px auto;
    padding: 0 20px;
}

.links {
    text-align: center;
    margin-bottom: 30px;
}

.links a {
    margin: 0 8px;
    color: #2563eb;
    text-decoration: none;
    font-weight: bold;
}

.grid {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
}

.card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.lab-number {
    font-size: 13px;
    font-weight: bold;
    color: #6b7280;
}

.card h2 {
    margin: 10px 0;
}

.card p {
    color: #6b7280;
    min-height: 45px;
}

.type {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: bold;
}

.type.server {
    background: #dbeafe;
    color: #1d4ed8;
}

.type.script {
    background: #dcfce7;
    color: #15803d;
}

.card a {
    display: inline-block;
    padding: 9px 14px;
    background: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 6px;
}

footer {
    text-align: center;
    padding: 30px;
    color: #6b7280;
}

</style>

</head>

<body>

<header>

<h1>Node.js Integrated Lab Server</h1>

<p>Labs 01 to 07 in one portal</p>

<div class="environment">
Environment: ${environment}
</div>

</header>

<div class="container">

<div class="links">

    <a href="/about">About</a>

    <a href="/health">Health</a>

    <a href="/labs">Lab API</a>

    <a href="/api/dashboard">Dashboard API</a>

</div>

<div class="grid">

${cards}

</div>

</div>

<footer>

CS403NOD — Node.js Lab Assignment 08

</footer>

</body>

</html>
`;
}


// ==================================================
// INDIVIDUAL LAB PAGE
// ==================================================

async function createLabHTML(lab) {

    const filePath = path.resolve(
        __dirname,
        lab.file
    );

    let sourceCode;

    try {

        sourceCode = await fs.promises.readFile(
            filePath,
            'utf8'
        );

    } catch (error) {

        sourceCode =
            `Unable to read source code: ${error.message}`;

    }

    const screenshots =
        await getLabScreenshots(lab.id);

    const screenshotHTML =
        screenshots.length > 0

        ? screenshots.map(file => `
            <div class="screenshot">

                <img
                    src="/screenshots/${encodeURIComponent(file)}"
                    alt="${escapeHTML(file)}"
                >

                <p>${escapeHTML(file)}</p>

            </div>
        `).join('')

        : '<p>No screenshots added yet.</p>';


    let actionHTML = '';


    // Script Lab
    if (lab.type === 'script') {

        actionHTML = `
            <a class="button"
               href="/labs/${lab.id}/run">
               Run Lab
            </a>
        `;

    }

    // Server Lab
    else {

        const liveRoute = getLiveRoute(lab);

        actionHTML = `
            <a class="button"
               href="/labs/${lab.id}/app${liveRoute}">
               Open Live Lab
            </a>
        `;

    }


    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>
Lab ${lab.id} - ${escapeHTML(lab.title)}
</title>

<style>

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f7fa;
    color: #1f2937;
}

header {
    background: white;
    padding: 25px;
    border-bottom: 1px solid #ddd;
}

.container {
    max-width: 1100px;
    margin: 30px auto;
    padding: 0 20px;
}

.section {
    background: white;
    margin-bottom: 25px;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

.button {
    display: inline-block;
    background: #2563eb;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    text-decoration: none;
    margin-top: 10px;
}

pre {
    background: #111827;
    color: #e5e7eb;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    line-height: 1.5;
}

.screenshot {
    margin-bottom: 25px;
}

.screenshot img {
    max-width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.back {
    color: #2563eb;
    text-decoration: none;
}

</style>

</head>

<body>

<header>

<a class="back" href="/">
← Back to Portal
</a>

<h1>
Lab ${lab.id}: ${escapeHTML(lab.title)}
</h1>

<p>
${escapeHTML(lab.topic)}
</p>

${actionHTML}

</header>

<div class="container">

<div class="section">

<h2>Lab Information</h2>

<p>
<strong>Type:</strong> ${lab.type}
</p>

<p>
<strong>File:</strong> ${escapeHTML(lab.file)}
</p>

</div>


<div class="section">

<h2>Source Code</h2>

<pre><code>${escapeHTML(sourceCode)}</code></pre>

</div>


<div class="section">

<h2>Screenshots</h2>

${screenshotHTML}

</div>

</div>

</body>

</html>
`;
}


// ==================================================
// MAIN REQUEST HANDLER
// ==================================================

async function handler(req, res) {

    // Log every request
    logger.emit(
        'request',
        req.method,
        req.url
    );


    try {

        const parsedUrl =
            url.parse(req.url, true);

        const pathname =
            parsedUrl.pathname;


        // ==================================================
        // GET /
        // ==================================================

        if (
            req.method === 'GET' &&
            pathname === '/'
        ) {

            return send(
                res,
                200,
                createPortalHTML(),
                'text/html'
            );

        }


        // ==================================================
        // GET /about
        // ==================================================

        if (
            req.method === 'GET' &&
            pathname === '/about'
        ) {

            return send(res, 200, {

                project:
                    'Integrated Node.js Lab Server',

                student:
                    process.env.STUDENT_NAME ||
                    'Gauri Tyagi',

                labs:
                    labs.length

            });

        }


        // ==================================================
        // GET /health
        // ==================================================

        if (
            req.method === 'GET' &&
            pathname === '/health'
        ) {

            return send(res, 200, {

                status: 'ok',

                environment:
                    process.env.RENDER
                        ? 'live (Render)'
                        : 'local',

                uptimeSeconds:
                    Math.floor(process.uptime())

            });

        }


        // ==================================================
        // GET /labs
        // ==================================================

        if (
            req.method === 'GET' &&
            pathname === '/labs'
        ) {

            const result =
                labs.map(lab => ({

                    ...lab,

                    slug:
                        slugify(
                            lab.title,
                            {
                                lower: true
                            }
                        )

                }));

            return send(
                res,
                200,
                result
            );

        }


        // ==================================================
        // GET /api/dashboard
        // ==================================================

        if (
            req.method === 'GET' &&
            pathname === '/api/dashboard'
        ) {

            const screenshotDir =
                path.join(
                    __dirname,
                    'public',
                    'screenshots'
                );


            const [
                logContent,
                screenshotFiles
            ] = await Promise.all([

                fs.promises
                    .readFile(
                        LOG_FILE,
                        'utf8'
                    )
                    .catch(() => ''),

                fs.promises
                    .readdir(
                        screenshotDir
                    )
                    .catch(() => [])

            ]);


            const requestsLogged =
                logContent.trim()
                    ? logContent
                        .trim()
                        .split('\n')
                        .length
                    : 0;


            const screenshots =
                screenshotFiles.filter(
                    file =>
                        /\.(png|jpg|jpeg)$/i
                            .test(file)
                );


            return send(
                res,
                200,
                {

                    labs:
                        labs.length,

                    screenshots,

                    requestsLogged

                }
            );

        }


        // ==================================================
        // GET /screenshots/<name>
        // ==================================================

        if (
            req.method === 'GET' &&
            pathname.startsWith(
                '/screenshots/'
            )
        ) {

            const filename =
                path.basename(
                    pathname.substring(
                        '/screenshots/'.length
                    )
                );


            if (
                !/\.(png|jpg|jpeg)$/i
                    .test(filename)
            ) {

                return send(
                    res,
                    400,
                    {
                        error:
                            'Only image files are allowed'
                    }
                );

            }


            const imagePath =
                path.join(
                    __dirname,
                    'public',
                    'screenshots',
                    filename
                );


            try {

                await fs.promises.access(
                    imagePath
                );

            } catch {

                return send(
                    res,
                    404,
                    {
                        error:
                            'Screenshot not found'
                    }
                );

            }


            const extension =
                path.extname(
                    filename
                ).toLowerCase();


            const contentType =
                extension === '.png'
                    ? 'image/png'
                    : 'image/jpeg';


            res.writeHead(
                200,
                {
                    'Content-Type':
                        contentType
                }
            );


            return fs
                .createReadStream(
                    imagePath
                )
                .pipe(res);

        }


        // ==================================================
        // /labs/:id ROUTES
        // ==================================================

        const labMatch =
            pathname.match(
                /^\/labs\/([^/]+)(.*)$/
            );


        if (labMatch) {

            const labId =
                labMatch[1];

            const remainingPath =
                labMatch[2];


            const lab =
                getLab(labId);


            // --------------------------------------------------
            // Unknown Lab
            // --------------------------------------------------

            if (!lab) {

                return send(
                    res,
                    404,
                    {
                        error:
                            'Lab not found',

                        id:
                            labId
                    }
                );

            }


            // --------------------------------------------------
            // GET /labs/:id
            // --------------------------------------------------

            if (
                req.method === 'GET' &&
                (
                    remainingPath === '' ||
                    remainingPath === '/'
                )
            ) {

                const html =
                    await createLabHTML(
                        lab
                    );


                return send(
                    res,
                    200,
                    html,
                    'text/html'
                );

            }


            // --------------------------------------------------
            // GET /labs/:id/run
            // --------------------------------------------------

            if (
                remainingPath === '/run'
            ) {

                if (
                    lab.type !== 'script'
                ) {

                    return send(
                        res,
                        400,
                        {
                            error:
                                'This is a server lab. Use the /app route instead.'
                        }
                    );

                }


                const filePath =
                    path.resolve(
                        __dirname,
                        lab.file
                    );


                try {

                    const result =
                        await execFileAsync(
                            process.execPath,
                            [filePath],
                            {
                                timeout: 5000
                            }
                        );


                    return send(
                        res,
                        200,
                        {

                            ok: true,

                            output:
                                result.stdout,

                            error:
                                result.stderr || ''

                        }
                    );


                } catch (error) {

                    return send(
                        res,
                        200,
                        {

                            ok: false,

                            output:
                                error.stdout || '',

                            error:
                                error.stderr ||
                                error.message

                        }
                    );

                }

            }


            // --------------------------------------------------
            // /labs/:id/app/...
            // --------------------------------------------------

            if (
                remainingPath.startsWith(
                    '/app'
                )
            ) {

                if (
                    lab.type !== 'server'
                ) {

                    return send(
                        res,
                        400,
                        {
                            error:
                                'This is a script lab. Use the /run route instead.'
                        }
                    );

                }


                const handlerPath =
                    path.resolve(
                        __dirname,
                        lab.file
                    );


                let labHandler;


                try {

                    labHandler =
                        require(
                            handlerPath
                        );

                } catch (error) {

                    return send(
                        res,
                        500,
                        {

                            error:
                                'Unable to load lab server',

                            message:
                                error.message

                        }
                    );

                }


                if (
                    typeof labHandler !==
                    'function'
                ) {

                    return send(
                        res,
                        500,
                        {
                            error:
                                'Lab server handler is not a function'
                        }
                    );

                }


                // Remove /labs/:id/app
                let newPath =
                    remainingPath.substring(
                        '/app'.length
                    );


                // Default route
                if (
                    !newPath ||
                    newPath === '/'
                ) {

                    newPath =
                        getLiveRoute(
                            lab
                        );

                }


                // Keep query string
                if (
                    parsedUrl.search
                ) {

                    newPath +=
                        parsedUrl.search;

                }


                const oldUrl =
                    req.url;


                req.url =
                    newPath;


                try {

                    return labHandler(
                        req,
                        res
                    );

                } finally {

                    req.url =
                        oldUrl;

                }

            }

        }


        // ==================================================
        // 404
        // ==================================================

        return send(
            res,
            404,
            {

                error:
                    'Route not found',

                path:
                    pathname

            }
        );


    } catch (error) {

        console.error(
            error
        );


        return send(
            res,
            500,
            {
                error:
                    'Internal Server Error'
            }
        );

    }

}


// ==================================================
// START SERVER
// ==================================================

const server =
    http.createServer(
        handler
    );


server.listen(
    PORT,
    '0.0.0.0',
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);