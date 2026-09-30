# Lab 03 - Student Directory API

## Student Information

**Name:** Gauri  
**Scholar Number:** BCA001  
**Course:** BCA  
**Semester:** VII  
**Lab Number:** Lab 03  

## Date

11 August 2026

## Brief Description

This lab implements a simple Student Directory API using Node.js built-in HTTP module.

The API provides student information in JSON format and also includes a custom Books Directory.

## Routes Added

### Student Routes

- `/students` - Returns the complete list of students.
- `/students/:id` - Returns one student according to the given ID.
- `/students/course/BCA` - Returns only students from the BCA course using `Array.filter()`.
- `/students/abc` - Returns a clear error message when the student ID is not numeric.

### Items Routes

- `/items` - Returns the complete list of books.
- `/items/:id` - Returns one book according to the given ID.
- `/items/99` - Returns an "Item not found" message when the item does not exist.

## req.url.split()

`req.url.split('/')` splits the URL into parts so that the ID can be extracted from the URL.

## Problems Faced

### Task No.
Task 2 / Task 4

### Issue
The Node.js server showed an `EADDRINUSE` error because port 3000 was already being used by another process.

### Attempted Solution
I used the `netstat` command to find the process using port 3000 and then terminated that process using the `taskkill` command. After that, the Node.js server started successfully.

## Output Screenshots

- `students-output.png` - Student API output.
- `items-output.png` - Complete items directory output.
- `items-output2.png` - Individual item output.