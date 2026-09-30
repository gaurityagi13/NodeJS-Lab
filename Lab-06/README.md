# Lab 06 – Working With The File System (fs) Module

**Lab Number:** 06
**Course:** CS403NOD – Node.js
**Semester:** BCA VII
**Date:** 30 September 2026

## Objective

This lab demonstrates how to work with the Node.js File System (`fs`) module for reading, writing, appending, deleting, and storing data in files.

## Files and Their Purpose

* **read-async.js** – Demonstrates asynchronous reading of a file using `fs.readFile()`.
* **read-sync.js** – Demonstrates synchronous reading of a file using `fs.readFileSync()`.
* **write-file.js** – Demonstrates writing and overwriting content in a file using `fs.writeFile()`.
* **append-file.js** – Demonstrates adding new content to an existing file using `fs.appendFile()`.
* **delete-file.js** – Demonstrates deleting a file using `fs.unlink()`.
* **async-await-version.js** – Demonstrates reading and writing files using `fs.promises` with async/await and try/catch.
* **add-note.js** – Adds a timestamped note to notes.txt using a command-line argument.
* **read-notes.js** – Reads and displays the notes stored in notes.txt.

## Files Used

* `sample.txt` – Input file used for reading and copying.
* `output.txt` – Temporary file used for writing and appending.
* `copy.txt` – Copy of sample.txt created using async/await.
* `notes.txt` – File used to store notes in the command-line Notes App.
* `reflection-notes.txt` – Contains the observations and answers from the lab.

## Output Screenshots

* `read-comparison.png` – Comparison of asynchronous and synchronous file reading.
* `notes-app-output.png` – Output showing two notes added and displayed.

## Problems Faced

### Task No.: Task 6

**Issue:**
Running `delete-file.js` a second time produced an error because the file had already been deleted.

**Attempted Solution:**
I checked the error message and understood that `ENOENT` means the specified file or directory does not exist. The first execution had already deleted `output.txt`, so there was no file left for the second execution to delete.

## Conclusion

This lab helped me understand the Node.js File System module and the difference between asynchronous and synchronous file operations. I also practiced writing, appending, deleting, and copying files. Finally, I created a small command-line Notes App using file storage.
