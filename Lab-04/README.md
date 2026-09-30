# Lab Assignment – 04
## Advanced Search, Filter & Sort API

### Student Information

- Name: Gauri
- Course: BCA
- Semester: VII
- Lab No.: 04
- Subject: Node.js

---

## Objective

The objective of this lab is to create an API using Node.js that supports
filtering, searching, sorting and input validation.

---

## Features

This API supports:

- Filter students by course
- Filter students by minimum marks
- Search students by name
- Sort students by name or marks
- Sort in ascending or descending order
- Combine multiple query parameters
- Validate incorrect input
- Return proper HTTP status codes

---

## Query Parameters

### 1. course

Filters students according to their course.

Example:

http://localhost:3000/students?course=BCA

---

### 2. minMarks

Returns students whose marks are greater than or equal to the given marks.

Example:

http://localhost:3000/students?minMarks=80

---

### 3. search

Searches for text inside the student's name.
The search is case-insensitive and supports partial matching.

Example:

http://localhost:3000/students?search=ga

---

### 4. sort

Sorts the students by name or marks.

Allowed values:

- name
- marks

Example:

http://localhost:3000/students?sort=marks

---

### 5. order

Controls the sorting order.

Allowed values:

- asc
- desc

Example:

http://localhost:3000/students?sort=marks&order=desc

---

## Combined Query

Multiple parameters can be used together.

Example:

http://localhost:3000/students?course=BCA&minMarks=60&search=a&sort=marks&order=desc

The API first filters the students and then sorts the filtered results.

---

## Input Validation

Invalid input is checked before processing the request. If `minMarks` is not a number, the API returns HTTP status 400 with an error message. Similarly, an invalid value for `sort` returns HTTP status 400 instead of silently ignoring the error.

---

## Testing

The following tests were performed:

1. `/students` – Returns all students.
2. `/students?course=BCA` – Filters BCA students.
3. `/students?minMarks=80` – Filters students with 80 or more marks.
4. `/students?search=ga` – Performs partial name search.
5. `/students?sort=marks&order=desc` – Sorts marks from highest to lowest.
6. `/students?sort=xyz` – Tests invalid sort input.
7. `/students?minMarks=abc` – Tests invalid marks input.
8. Combined filtering, searching and sorting.

---

## Problems Faced

### Task No.: Task 5

**Issue:**  
Sorting had to work in both ascending and descending order.

**Attempted Solution:**  
Used JavaScript's `.sort()` method and changed the comparison depending on the value of `order`.

### Task No.: Task 7

**Issue:**  
The server should not crash when an invalid value such as `minMarks=abc` is provided.

**Attempted Solution:**  
Used `isNaN()` to check whether `minMarks` is a valid number. If it is invalid, the server returns status code 400 with an error message.

---

## Conclusion

This lab helped me understand how search, filtering, sorting and input validation can be implemented in a Node.js API. I also learned how multiple query parameters can be combined to create a more useful REST API.