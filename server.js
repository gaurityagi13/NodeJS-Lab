/*const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 5000;
const ROOT = __dirname;

const LABS = [
    "Lab-01",
    "Lab-02",
    "Lab-03",
    "Lab-04",
    "Lab-05",
    "Lab-06",
    "Lab-07"
];


// ===============================
// GET FILES OF A LAB
// ===============================

function getLabFiles(lab) {

    const labPath = path.join(ROOT, lab);

    if (!fs.existsSync(labPath)) {
        return [];
    }

    return fs.readdirSync(labPath, {
        withFileTypes: true
    })
    .filter(item => !item.name.startsWith("."))
    .map(item => {

        const ext =
            path.extname(item.name).toLowerCase();

        return {
            name: item.name,
            isFolder: item.isDirectory(),
            isJS: ext === ".js",
            isImage: [
                ".png",
                ".jpg",
                ".jpeg",
                ".gif"
            ].includes(ext)
        };
    });
}


// ===============================
// RUN JAVASCRIPT FILE
// ===============================

function runProgram(lab, file, callback) {

    const filePath =
        path.join(ROOT, lab, file);

    if (!fs.existsSync(filePath)) {

        callback("File not found.");

        return;
    }

    if (path.extname(filePath) !== ".js") {

        callback("Only JavaScript files can be run.");

        return;
    }


    const program =
        spawn(
            process.execPath,
            [filePath],
            {
                cwd: path.dirname(filePath)
            }
        );


    let output = "";


    program.stdout.on(
        "data",
        data => {

            output += data.toString();

        }
    );


    program.stderr.on(
        "data",
        data => {

            output += data.toString();

        }
    );


    // Stop programs that keep running
    const timer =
        setTimeout(
            () => {

                program.kill();

                output +=
                    "\n\n[Program stopped automatically.]";

                callback(output);

            },
            5000
        );


    program.on(
        "close",
        code => {

            clearTimeout(timer);

            if (output.trim() === "") {

                output =
                    "Program finished without output.";

            }

            callback(
                output +
                "\n\nExit Code: " +
                code
            );

        }
    );


    program.on(
        "error",
        error => {

            clearTimeout(timer);

            callback(
                error.message
            );

        }
    );
}


// ===============================
// WEBSITE
// ===============================

function webpage() {

    return `

<!DOCTYPE html>

<html>

<head>

<title>Node.js Labs</title>

<style>

body {

    font-family: Arial, sans-serif;

    margin: 0;

    padding: 30px;

    background: #f5f5f5;

    color: #222;

}

h1 {

    margin-bottom: 5px;

}

p {

    color: #666;

}

button {

    padding: 10px 15px;

    margin: 5px;

    border: 1px solid #ccc;

    background: white;

    border-radius: 5px;

    cursor: pointer;

}

button:hover {

    background: #eee;

}

.lab-buttons {

    margin: 20px 0;

}

.files {

    background: white;

    padding: 20px;

    border-radius: 8px;

    margin-top: 20px;

}

.file {

    padding: 12px;

    border-bottom: 1px solid #eee;

}

.run {

    background: #222;

    color: white;

}

#output {

    background: #111;

    color: #eee;

    padding: 20px;

    min-height: 150px;

    white-space: pre-wrap;

    border-radius: 8px;

    overflow: auto;

}

#code {

    background: #222;

    color: #eee;

    padding: 20px;

    white-space: pre-wrap;

    overflow: auto;

    border-radius: 8px;

}

</style>

</head>


<body>


<h1>My Node.js Labs</h1>

<p>
    BCA Node.js Laboratory — Lab 01 to Lab 07
</p>


<h2>Select Laboratory</h2>

<div class="lab-buttons">

${LABS.map(lab => `

<button onclick="loadLab('${lab}')">

${lab}

</button>

`).join("")}

</div>


<div class="files">

<h2 id="labTitle">
Select a Lab
</h2>

<div id="fileList">

Select a laboratory above.

</div>

</div>


<h2>Code</h2>

<pre id="code">
Select a JavaScript file.
</pre>


<h2>Program Output</h2>

<pre id="output">
Click Run to execute a program.
</pre>


<script>


// ===============================
// LOAD LAB
// ===============================

async function loadLab(lab) {

    document.getElementById(
        "labTitle"
    ).textContent = lab;


    const response =
        await fetch(
            "/files?lab=" +
            encodeURIComponent(lab)
        );


    const files =
        await response.json();


    const container =
        document.getElementById(
            "fileList"
        );


    container.innerHTML = "";


    files.forEach(file => {


        if (file.isFolder) {

            return;

        }


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "file";


        let html =
            "<b>" +
            file.name +
            "</b>";


        if (file.isJS) {

            html +=

                ' <button onclick="viewCode(\\'' +
                lab +
                '\\',\\'' +
                file.name +
                '\\')">' +
                "View" +
                "</button>";


            html +=

                ' <button class="run" onclick="runCode(\\'' +
                lab +
                '\\',\\'' +
                file.name +
                '\\')">' +
                "Run" +
                "</button>";

        }


        if (file.isImage) {

            html +=

                ' <button onclick="viewImage(\\'' +
                lab +
                '\\',\\'' +
                file.name +
                '\\')">' +
                "View" +
                "</button>";

        }


        if (
            !file.isJS &&
            !file.isImage
        ) {

            html +=

                ' <button onclick="viewText(\\'' +
                lab +
                '\\',\\'' +
                file.name +
                '\\')">' +
                "View" +
                "</button>";

        }


        row.innerHTML =
            html;


        container.appendChild(
            row
        );

    });

}


// ===============================
// VIEW CODE
// ===============================

async function viewCode(
    lab,
    file
) {

    const response =
        await fetch(
            "/read?lab=" +
            encodeURIComponent(lab) +
            "&file=" +
            encodeURIComponent(file)
        );


    const data =
        await response.json();


    document.getElementById(
        "code"
    ).textContent =
        data.content ||
        data.error;

}


// ===============================
// VIEW TEXT
// ===============================

async function viewText(
    lab,
    file
) {

    const response =
        await fetch(
            "/read?lab=" +
            encodeURIComponent(lab) +
            "&file=" +
            encodeURIComponent(file)
        );


    const data =
        await response.json();


    document.getElementById(
        "code"
    ).textContent =
        data.content ||
        data.error;

}


// ===============================
// RUN PROGRAM
// ===============================

async function runCode(
    lab,
    file
) {

    document.getElementById(
        "output"
    ).textContent =
        "Running " + file + "...";


    const response =
        await fetch(
            "/run",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        lab: lab,
                        file: file
                    })

            }
        );


    const data =
        await response.json();


    document.getElementById(
        "output"
    ).textContent =
        data.output;

}


// ===============================
// VIEW IMAGE
// ===============================

function viewImage(
    lab,
    file
) {

    document.getElementById(
        "code"
    ).innerHTML =

        '<img src="/image?lab=' +
        encodeURIComponent(lab) +
        '&file=' +
        encodeURIComponent(file) +
        '" style="max-width:100%;">';

}

</script>


</body>

</html>

`;
}


// ===============================
// SERVER
// ===============================

const server =
    http.createServer(
        (req, res) => {


    const requestURL =
        new URL(
            req.url,
            "http://localhost:" + PORT
        );


    // HOME
    if (
        requestURL.pathname === "/"
    ) {

        res.writeHead(
            200,
            {
                "Content-Type":
                    "text/html"
            }
        );

        res.end(
            webpage()
        );

        return;
    }


    // FILE LIST
    if (
        requestURL.pathname === "/files"
    ) {

        const lab =
            requestURL.searchParams.get(
                "lab"
            );


        res.writeHead(
            200,
            {
                "Content-Type":
                    "application/json"
            }
        );


        res.end(
            JSON.stringify(
                getLabFiles(lab)
            )
        );

        return;
    }


    // READ FILE
    if (
        requestURL.pathname === "/read"
    ) {

        const lab =
            requestURL.searchParams.get(
                "lab"
            );


        const file =
            requestURL.searchParams.get(
                "file"
            );


        const filePath =
            path.join(
                ROOT,
                lab,
                file
            );


        try {

            const content =
                fs.readFileSync(
                    filePath,
                    "utf8"
                );


            res.writeHead(
                200,
                {
                    "Content-Type":
                        "application/json"
                }
            );


            res.end(
                JSON.stringify({
                    content: content
                })
            );

        }

        catch (error) {

            res.writeHead(
                404,
                {
                    "Content-Type":
                        "application/json"
                }
            );


            res.end(
                JSON.stringify({
                    error:
                        "Cannot read this file."
                })
            );

        }

        return;
    }


    // IMAGE
    if (
        requestURL.pathname === "/image"
    ) {

        const lab =
            requestURL.searchParams.get(
                "lab"
            );


        const file =
            requestURL.searchParams.get(
                "file"
            );


        const filePath =
            path.join(
                ROOT,
                lab,
                file
            );


        if (
            !fs.existsSync(
                filePath
            )
        ) {

            res.writeHead(404);

            res.end();

            return;
        }


        res.writeHead(
            200,
            {
                "Content-Type":
                    "image/png"
            }
        );


        fs.createReadStream(
            filePath
        ).pipe(res);


        return;
    }


    // RUN
    if (
        requestURL.pathname === "/run" &&
        req.method === "POST"
    ) {

        let body = "";


        req.on(
            "data",
            chunk => {

                body += chunk;

            }
        );


        req.on(
            "end",
            () => {

                const data =
                    JSON.parse(body);


                runProgram(
                    data.lab,
                    data.file,
                    output => {

                        res.writeHead(
                            200,
                            {
                                "Content-Type":
                                    "application/json"
                            }
                        );


                        res.end(
                            JSON.stringify({
                                output:
                                    output
                            })
                        );

                    }
                );

            }
        );


        return;
    }


    res.writeHead(404);

    res.end("Not Found");

});


server.listen(
    PORT,
    () => {

        console.log(
            "Node.js Lab Website running at:"
        );

        console.log(
            "http://localhost:" +
            PORT
        );

    }
);*/
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 5000;
const ROOT = __dirname;

const LABS = [
    "Lab-01",
    "Lab-02",
    "Lab-03",
    "Lab-04",
    "Lab-05",
    "Lab-06",
    "Lab-07"
];

const IMAGE_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml"
};


// ========================================
// SAFE FILE PATH
// ========================================

function getSafePath(lab, file) {

    if (!LABS.includes(lab)) {
        return null;
    }

    const labRoot = path.resolve(ROOT, lab);

    const target = path.resolve(
        labRoot,
        file || ""
    );

    if (
        target !== labRoot &&
        !target.startsWith(labRoot + path.sep)
    ) {
        return null;
    }

    return target;
}


// ========================================
// CREATE FILE / FOLDER TREE
// ========================================

function createTree(folder, relativePath) {

    if (!fs.existsSync(folder)) {
        return [];
    }

    const items = fs.readdirSync(
        folder,
        { withFileTypes: true }
    );

    items.sort(function (a, b) {

        if (
            a.isDirectory() &&
            !b.isDirectory()
        ) {
            return -1;
        }

        if (
            !a.isDirectory() &&
            b.isDirectory()
        ) {
            return 1;
        }

        return a.name.localeCompare(b.name);
    });


    return items

        .filter(function (item) {

            return !item.name.startsWith(".");
        })

        .map(function (item) {

            const itemRelativePath =
                relativePath
                    ? path.join(
                        relativePath,
                        item.name
                    )
                    : item.name;


            if (item.isDirectory()) {

                return {

                    type: "folder",

                    name: item.name,

                    path:
                        itemRelativePath,

                    children:
                        createTree(
                            path.join(
                                folder,
                                item.name
                            ),
                            itemRelativePath
                        )
                };
            }


            const extension =
                path.extname(
                    item.name
                ).toLowerCase();


            return {

                type: "file",

                name: item.name,

                path:
                    itemRelativePath,

                extension:
                    extension,

                runnable:
                    extension === ".js",

                image:
                    Boolean(
                        IMAGE_TYPES[
                            extension
                        ]
                    )
            };

        });
}


// ========================================
// SEND JSON
// ========================================

function sendJSON(
    res,
    data,
    status
) {

    res.writeHead(
        status || 200,
        {
            "Content-Type":
                "application/json; charset=utf-8",

            "Cache-Control":
                "no-store"
        }
    );

    res.end(
        JSON.stringify(data)
    );
}


// ========================================
// RUN NODE.JS FILE
// ========================================

function runProgram(
    lab,
    file
) {

    return new Promise(
        function (resolve) {

            const filePath =
                getSafePath(
                    lab,
                    file
                );


            if (
                !filePath ||
                !fs.existsSync(filePath)
            ) {

                resolve({

                    success:
                        false,

                    output:
                        "File not found."

                });

                return;
            }


            if (
                path.extname(
                    filePath
                ).toLowerCase() !== ".js"
            ) {

                resolve({

                    success:
                        false,

                    output:
                        "Only .js files can be run."

                });

                return;
            }


            const program =
                spawn(
                    process.execPath,
                    [filePath],
                    {

                        cwd:
                            path.dirname(
                                filePath
                            ),

                        windowsHide:
                            true
                    }
                );


            let output = "";

            let finished = false;


            function finish(result) {

                if (finished) {
                    return;
                }

                finished = true;

                resolve(result);
            }


            program.stdout.on(
                "data",
                function (data) {

                    output +=
                        data.toString();

                }
            );


            program.stderr.on(
                "data",
                function (data) {

                    output +=
                        data.toString();

                }
            );


            program.on(
                "error",
                function (error) {

                    finish({

                        success:
                            false,

                        output:
                            error.message

                    });

                }
            );


            const timer =
                setTimeout(
                    function () {

                        program.kill();

                        finish({

                            success:
                                true,

                            output:
                                (
                                    output.trim()
                                        ? output.trim() +
                                          "\n\n"
                                        : ""
                                ) +
                                "Program stopped automatically after 8 seconds."

                        });

                    },
                    8000
                );


            program.on(
                "close",
                function (code) {

                    clearTimeout(
                        timer
                    );


                    finish({

                        success:
                            code === 0,

                        output:
                            (
                                output.trim()
                                    ? output.trim()
                                    : "(No console output)"
                            ) +

                            "\n\nExit Code: " +
                            code

                    });

                }
            );

        }
    );
}


// ========================================
// WEBSITE HTML
// ========================================

function getHTML() {

    return `<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Node.js Lab Explorer
</title>


<style>

* {
    box-sizing: border-box;
}


body {

    margin: 0;

    font-family:
        "Segoe UI",
        Arial,
        sans-serif;

    background:
        #f5f7fb;

    color:
        #172033;
}


/* ==============================
   MAIN LAYOUT
============================== */

.app {

    min-height:
        100vh;

    display:
        grid;

    grid-template-columns:
        250px 1fr;
}


/* ==============================
   SIDEBAR
============================== */

.sidebar {

    background:
        #ffffff;

    border-right:
        1px solid #e3e8f0;

    padding:
        22px 15px;

    height:
        100vh;

    position:
        sticky;

    top:
        0;

    overflow-y:
        auto;
}


.logo {

    display:
        flex;

    align-items:
        center;

    gap:
        12px;

    padding:
        5px 8px 22px;

    border-bottom:
        1px solid #edf0f4;

    margin-bottom:
        20px;
}


.logo-box {

    width:
        40px;

    height:
        40px;

    border-radius:
        10px;

    background:
        #eaf2ff;

    color:
        #2563eb;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-weight:
        800;
}


.logo h1 {

    margin:
        0;

    font-size:
        17px;
}


.logo span {

    display:
        block;

    margin-top:
        3px;

    color:
        #8a94a6;

    font-size:
        12px;
}


.lab-button {

    width:
        100%;

    border:
        none;

    background:
        transparent;

    text-align:
        left;

    padding:
        12px 13px;

    border-radius:
        8px;

    cursor:
        pointer;

    color:
        #4b5568;

    margin-bottom:
        4px;

    font-size:
        14px;
}


.lab-button:hover {

    background:
        #f3f6fb;
}


.lab-button.active {

    background:
        #eaf2ff;

    color:
        #1d4ed8;

    font-weight:
        700;
}


/* ==============================
   MAIN
============================== */

.main {

    min-width:
        0;
}


/* ==============================
   TOP BAR
============================== */

.topbar {

    min-height:
        74px;

    background:
        #ffffff;

    border-bottom:
        1px solid #e3e8f0;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        15px;

    padding:
        15px 28px;
}


.topbar h2 {

    margin:
        0;

    font-size:
        21px;
}


.topbar p {

    margin:
        4px 0 0;

    color:
        #8993a5;

    font-size:
        13px;
}


.status {

    background:
        #ecfdf3;

    color:
        #16803c;

    padding:
        7px 12px;

    border-radius:
        20px;

    font-size:
        12px;

    font-weight:
        600;
}


/* ==============================
   CONTENT
============================== */

.content {

    padding:
        25px 28px;
}


.search {

    width:
        100%;

    max-width:
        520px;

    padding:
        11px 14px;

    border:
        1px solid #dce2eb;

    border-radius:
        8px;

    background:
        #ffffff;

    outline:
        none;

    margin-bottom:
        18px;
}


.search:focus {

    border-color:
        #7ba6f5;
}


/* ==============================
   WORKSPACE
============================== */

.workspace {

    display:
        grid;

    grid-template-columns:
        340px minmax(0, 1fr);

    gap:
        18px;
}


.panel {

    background:
        #ffffff;

    border:
        1px solid #e2e7ef;

    border-radius:
        11px;

    overflow:
        hidden;
}


.panel-title {

    padding:
        14px 17px;

    border-bottom:
        1px solid #edf0f4;

    font-size:
        14px;

    font-weight:
        700;
}


/* ==============================
   FILE TREE
============================== */

.file-tree {

    padding:
        10px;

    max-height:
        calc(100vh - 190px);

    overflow:
        auto;
}


.folder summary {

    cursor:
        pointer;

    padding:
        8px;

    border-radius:
        7px;

    font-size:
        13px;

    color:
        #475569;

    list-style:
        none;
}


.folder summary::-webkit-details-marker {

    display:
        none;
}


.folder summary:hover {

    background:
        #f5f7fa;
}


.folder summary::before {

    content:
        "▸";

    margin-right:
        7px;

    color:
        #8a94a6;
}


.folder[open]
> summary::before {

    content:
        "▾";
}


.folder-content {

    padding-left:
        17px;
}


.file {

    display:
        flex;

    align-items:
        center;

    gap:
        8px;

    padding:
        8px;

    border-radius:
        7px;

    cursor:
        pointer;

    font-size:
        13px;

    color:
        #4b5568;
}


.file:hover {

    background:
        #f4f7fb;
}


.file.selected {

    background:
        #eaf2ff;

    color:
        #1d4ed8;

    font-weight:
        600;
}


.icon {

    width:
        20px;

    text-align:
        center;
}


/* ==============================
   VIEWER
============================== */

.viewer {

    min-height:
        calc(100vh - 190px);

    display:
        flex;

    flex-direction:
        column;
}


.viewer-header {

    padding:
        14px 18px;

    border-bottom:
        1px solid #edf0f4;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        15px;
}


.file-name {

    min-width:
        0;
}


.file-name strong {

    display:
        block;

    white-space:
        nowrap;

    overflow:
        hidden;

    text-overflow:
        ellipsis;
}


.file-name small {

    color:
        #8a94a6;

    display:
        block;

    margin-top:
        4px;
}


.actions {

    display:
        flex;

    gap:
        8px;
}


.action {

    border:
        none;

    padding:
        8px 13px;

    border-radius:
        7px;

    cursor:
        pointer;

    font-weight:
        600;
}


.run {

    background:
        #2563eb;

    color:
        white;
}


.run:hover {

    background:
        #1d4ed8;
}


.code {

    flex:
        1;

    margin:
        0;

    padding:
        20px;

    background:
        #101722;

    color:
        #dce5f2;

    min-height:
        430px;

    overflow:
        auto;

    white-space:
        pre;

    font-family:
        Consolas,
        "Courier New",
        monospace;

    font-size:
        13px;

    line-height:
        1.65;
}


.output-title {

    padding:
        11px 18px;

    background:
        #f8fafc;

    border-top:
        1px solid #e5e9ef;

    font-size:
        13px;

    font-weight:
        700;
}


.output {

    margin:
        0;

    padding:
        17px 18px;

    background:
        #0b111a;

    color:
        #b9f6c5;

    min-height:
        130px;

    max-height:
        260px;

    overflow:
        auto;

    white-space:
        pre-wrap;

    font-family:
        Consolas,
        monospace;

    font-size:
        13px;
}


.preview {

    max-width:
        95%;

    max-height:
        600px;

    display:
        block;

    margin:
        25px auto;

    border:
        1px solid #dfe5ed;

    border-radius:
        8px;
}


.empty {

    padding:
        40px 20px;

    text-align:
        center;

    color:
        #8a94a6;
}


/* ==============================
   RESPONSIVE
============================== */

@media (max-width: 900px) {

    .app {

        grid-template-columns:
            1fr;
    }

    .sidebar {

        position:
            static;

        height:
            auto;
    }

    .workspace {

        grid-template-columns:
            1fr;
    }

    .file-tree {

        max-height:
            400px;
    }

}

</style>

</head>


<body>


<div class="app">


<!-- SIDEBAR -->

<aside class="sidebar">


    <div class="logo">

        <div class="logo-box">
            JS
        </div>


        <div>

            <h1>
                Node.js Labs
            </h1>

            <span>
                BCA Laboratory
            </span>

        </div>

    </div>


    <div id="labs"></div>


</aside>



<!-- MAIN -->

<main class="main">


    <header class="topbar">


        <div>

            <h2 id="title">
                Node.js Laboratory
            </h2>


            <p>
                Explore Lab-01 to Lab-07
            </p>

        </div>


        <div class="status">

            ● Node.js Connected

        </div>


    </header>



    <section class="content">


        <input
            id="search"
            class="search"
            placeholder="Search files..."
            oninput="searchFiles()"
        >


        <div class="workspace">


            <!-- FILES -->

            <section class="panel">


                <div class="panel-title">
                    Files & Folders
                </div>


                <div
                    id="tree"
                    class="file-tree"
                >

                    <div class="empty">
                        Select a laboratory
                    </div>

                </div>


            </section>



            <!-- VIEWER -->

            <section
                class="panel viewer"
            >


                <div
                    class="viewer-header"
                >


                    <div class="file-name">


                        <strong
                            id="fileName"
                        >
                            No file selected
                        </strong>


                        <small
                            id="filePath"
                        >
                            Choose a file from the left
                        </small>


                    </div>



                    <div class="actions">


                        <button
                            id="runButton"
                            class="action run"
                            style="display:none"
                            onclick="runFile()"
                        >

                            ▶ Run

                        </button>


                    </div>


                </div>



                <pre
                    id="code"
                    class="code"
                >Select a file to view its contents.</pre>



                <div class="output-title">

                    Program Output

                </div>



                <pre
                    id="output"
                    class="output"
                >Run a JavaScript file to see its output.</pre>


            </section>


        </div>


    </section>


</main>


</div>



<script>


const LABS =
${JSON.stringify(LABS)};


let currentLab = "";

let currentFile = "";

let currentTree = [];


// ========================================
// SHOW LABS
// ========================================

function showLabs() {

    const container =
        document.getElementById(
            "labs"
        );


    LABS.forEach(
        function (lab) {


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "lab-button";


            button.id =
                "lab-" + lab;


            button.textContent =
                lab;


            button.onclick =
                function () {

                    openLab(lab);

                };


            container.appendChild(
                button
            );


        }
    );
}


showLabs();


// ========================================
// OPEN LAB
// ========================================

async function openLab(lab) {

    currentLab =
        lab;


    currentFile =
        "";


    document.getElementById(
        "title"
    ).textContent =
        lab +
        " — Node.js Lab";


    document
        .querySelectorAll(
            ".lab-button"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


    document.getElementById(
        "lab-" + lab
    ).classList.add(
        "active"
    );


    document.getElementById(
        "search"
    ).value =
        "";


    const response =
        await fetch(
            "/api/tree?lab=" +
            encodeURIComponent(
                lab
            )
        );


    currentTree =
        await response.json();


    document.getElementById(
        "tree"
    ).innerHTML =
        renderTree(
            currentTree
        );


    document.getElementById(
        "code"
    ).textContent =
        "Select a file from the left.";


    document.getElementById(
        "output"
    ).textContent =
        "Run a JavaScript file to see its output.";


    document.getElementById(
        "fileName"
    ).textContent =
        "No file selected";


    document.getElementById(
        "filePath"
    ).textContent =
        "Choose a file from the left";


    document.getElementById(
        "runButton"
    ).style.display =
        "none";
}


// ========================================
// RENDER TREE
// ========================================

function renderTree(nodes) {

    let html = "";


    nodes.forEach(
        function (node) {


            if (
                node.type ===
                "folder"
            ) {


                html +=
                    '<details class="folder" open>' +

                        '<summary>' +

                            '📁 ' +

                            escapeHTML(
                                node.name
                            ) +

                        '</summary>' +

                        '<div class="folder-content">' +

                            renderTree(
                                node.children
                            ) +

                        '</div>' +

                    '</details>';


            }

            else {


                html +=
                    '<div class="file" ' +

                    'data-path="' +

                    escapeHTML(
                        node.path
                    ) +

                    '">' +

                        '<span class="icon">' +

                            getIcon(
                                node
                            ) +

                        '</span>' +

                        '<span>' +

                            escapeHTML(
                                node.name
                            ) +

                        '</span>' +

                    '</div>';

            }

        }
    );


    return html;
}


// ========================================
// FILE CLICK
// ========================================

document.addEventListener(
    "click",
    function (event) {


        const fileElement =
            event.target.closest(
                ".file"
            );


        if (!fileElement) {
            return;
        }


        selectFile(
            encodeURIComponent(
                fileElement.dataset.path
            )
        );

    }
);


// ========================================
// ICON
// ========================================

function getIcon(file) {

    if (file.image) {
        return "🖼️";
    }


    if (
        file.extension ===
        ".js"
    ) {
        return "📄";
    }


    if (
        file.extension ===
        ".json"
    ) {
        return "▣";
    }


    if (
        file.extension ===
        ".md"
    ) {
        return "M";
    }


    if (
        file.extension ===
        ".txt"
    ) {
        return "T";
    }


    return "•";
}


// ========================================
// SELECT FILE
// ========================================

async function selectFile(encoded) {

    currentFile =
        decodeURIComponent(
            encoded
        );


    document
        .querySelectorAll(
            ".file"
        )
        .forEach(
            function (item) {


                item.classList.remove(
                    "selected"
                );


                if (
                    item.dataset.path ===
                    currentFile
                ) {

                    item.classList.add(
                        "selected"
                    );

                }

            }
        );


    const file =
        findFile(
            currentTree,
            currentFile
        );


    if (!file) {
        return;
    }


    document.getElementById(
        "fileName"
    ).textContent =
        file.name;


    document.getElementById(
        "filePath"
    ).textContent =
        currentLab +
        " / " +
        currentFile;


    if (file.image) {


        document.getElementById(
            "code"
        ).innerHTML =
            '<img class="preview" src="/api/image?lab=' +

            encodeURIComponent(
                currentLab
            ) +

            '&file=' +

            encodeURIComponent(
                currentFile
            ) +

            '">';


        document.getElementById(
            "runButton"
        ).style.display =
            "none";


        return;
    }


    document.getElementById(
        "runButton"
    ).style.display =
        file.runnable
            ? "block"
            : "none";


    await loadFile();
}


// ========================================
// FIND FILE
// ========================================

function findFile(
    nodes,
    wanted
) {

    for (
        let i = 0;
        i < nodes.length;
        i++
    ) {


        const node =
            nodes[i];


        if (
            node.type ===
                "file" &&

            node.path ===
                wanted
        ) {

            return node;
        }


        if (
            node.type ===
                "folder"
        ) {


            const result =
                findFile(
                    node.children,
                    wanted
                );


            if (result) {
                return result;
            }

        }

    }


    return null;
}


// ========================================
// LOAD FILE
// ========================================

async function loadFile() {


    const response =
        await fetch(
            "/api/read?lab=" +

            encodeURIComponent(
                currentLab
            ) +

            "&file=" +

            encodeURIComponent(
                currentFile
            )
        );


    const data =
        await response.json();


    document.getElementById(
        "code"
    ).textContent =
        data.content ||
        data.error;
}


// ========================================
// RUN FILE
// ========================================

async function runFile() {


    const output =
        document.getElementById(
            "output"
        );


    output.textContent =
        "▶ Running " +
        currentFile +
        "...";


    const response =
        await fetch(
            "/api/run",
            {

                method:
                    "POST",

                headers:
                    {
                        "Content-Type":
                            "application/json"
                    },

                body:
                    JSON.stringify({

                        lab:
                            currentLab,

                        file:
                            currentFile

                    })

            }
        );


    const data =
        await response.json();


    output.textContent =
        data.output ||
        data.error;
}


// ========================================
// SEARCH
// ========================================

function searchFiles() {


    const query =
        document.getElementById(
            "search"
        )
        .value
        .toLowerCase();


    document
        .querySelectorAll(
            ".file"
        )
        .forEach(
            function (file) {


                const name =
                    file.textContent
                        .toLowerCase();


                file.style.display =
                    name.includes(
                        query
                    )
                        ? "flex"
                        : "none";

            }
        );
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}

</script>


</body>

</html>`;

}


// ========================================
// SERVER
// ========================================

const server =
    http.createServer(
        function (req, res) {


            const request =
                new URL(
                    req.url,
                    "http://localhost:" +
                    PORT
                );


            // HOME PAGE

            if (
                req.method === "GET" &&
                request.pathname === "/"
            ) {


                res.writeHead(
                    200,
                    {
                        "Content-Type":
                            "text/html; charset=utf-8"
                    }
                );


                res.end(
                    getHTML()
                );


                return;
            }


            // FILE TREE

            if (
                req.method === "GET" &&
                request.pathname ===
                    "/api/tree"
            ) {


                const lab =
                    request.searchParams.get(
                        "lab"
                    );


                if (
                    !LABS.includes(lab)
                ) {


                    sendJSON(
                        res,
                        {
                            error:
                                "Invalid laboratory."
                        },
                        400
                    );


                    return;
                }


                const tree =
                    createTree(
                        path.join(
                            ROOT,
                            lab
                        ),
                        ""
                    );


                sendJSON(
                    res,
                    tree
                );


                return;
            }


            // READ FILE

            if (
                req.method === "GET" &&
                request.pathname ===
                    "/api/read"
            ) {


                const lab =
                    request.searchParams.get(
                        "lab"
                    );


                const file =
                    request.searchParams.get(
                        "file"
                    );


                const filePath =
                    getSafePath(
                        lab,
                        file
                    );


                if (
                    !filePath ||
                    !fs.existsSync(
                        filePath
                    )
                ) {


                    sendJSON(
                        res,
                        {
                            error:
                                "File not found."
                        },
                        404
                    );


                    return;
                }


                try {


                    const content =
                        fs.readFileSync(
                            filePath,
                            "utf8"
                        );


                    sendJSON(
                        res,
                        {
                            content:
                                content
                        }
                    );


                }

                catch (error) {


                    sendJSON(
                        res,
                        {
                            error:
                                "This file cannot be displayed as text."
                        },
                        400
                    );

                }


                return;
            }


            // IMAGE

            if (
                req.method === "GET" &&
                request.pathname ===
                    "/api/image"
            ) {


                const lab =
                    request.searchParams.get(
                        "lab"
                    );


                const file =
                    request.searchParams.get(
                        "file"
                    );


                const filePath =
                    getSafePath(
                        lab,
                        file
                    );


                if (
                    !filePath ||
                    !fs.existsSync(
                        filePath
                    )
                ) {


                    res.writeHead(
                        404
                    );


                    res.end(
                        "Image not found."
                    );


                    return;
                }


                const extension =
                    path.extname(
                        filePath
                    ).toLowerCase();


                const type =
                    IMAGE_TYPES[
                        extension
                    ];


                if (!type) {


                    res.writeHead(
                        400
                    );


                    res.end(
                        "Not an image."
                    );


                    return;
                }


                res.writeHead(
                    200,
                    {
                        "Content-Type":
                            type
                    }
                );


                fs.createReadStream(
                    filePath
                ).pipe(res);


                return;
            }


            // RUN JAVASCRIPT

            if (
                req.method === "POST" &&
                request.pathname ===
                    "/api/run"
            ) {


                let body = "";


                req.on(
                    "data",
                    function (chunk) {

                        body +=
                            chunk.toString();

                    }
                );


                req.on(
                    "end",
                    async function () {


                        try {


                            const data =
                                JSON.parse(
                                    body
                                );


                            const result =
                                await runProgram(
                                    data.lab,
                                    data.file
                                );


                            sendJSON(
                                res,
                                result
                            );


                        }

                        catch (error) {


                            sendJSON(
                                res,
                                {
                                    success:
                                        false,

                                    output:
                                        error.message
                                },
                                400
                            );

                        }

                    }
                );


                return;
            }


            res.writeHead(
                404
            );


            res.end(
                "Page not found"
            );

        }
    );


// ========================================
// START SERVER
// ========================================

server.listen(
    PORT,
    function () {

        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            "     NODE.JS LAB EXPLORER STARTED"
        );

        console.log(
            "======================================"
        );

        console.log("");

        console.log(
            "Open: http://localhost:" +
            PORT
        );

        console.log("");
    }
);