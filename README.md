# Online Collaborative Text Editor

## Project Description

This project is a real-time collaborative text editor developed as a requirement for the CMPS211 Advanced Programming Techniques course at Computer Engineering Cairo University. The aim of this project is to design and implement a basic online collaborative text editor, allowing multiple users to edit the same document simultaneously, similar to Google Docs. 

## Specifications

### User Management [10%]

- **User Registration**: Allow users to register and create an account.
- **User Authentication**: Allow users to login to their account.

### Document Management [25%]

- **File Management**: Allow users to create, open, rename, and delete files.
- **Access Control**: Allow users to share documents with other users and control sharing permissions (viewer or editor).
- **List Documents**: Allow users to see a list of their documents and documents shared with them.

### Real-time Collaborative Editing [40%]

- **Support File Editing**: Allow users to edit the document text and format (support bold and italic only).
- **Support Concurrent Edits**: Implement a reasonable algorithm to handle concurrency issues and conflicts occurring due to multiple edits happening at the same time by different users.
- **Real-time Updates**: Allow users to view in real-time the edits done by other users and a representation of other users' cursors moving.

### UI [25%]

- Implement a simple UI for the following parts:
  - **Login**
  - **Sign up**
  - **File Management**:
    - List all documents owned by user
    - List all documents shared by others
    - Create a document
    - Delete, rename, share, and open options for each document (as per permissions)
  - **Text Editor**

## Bonus Features

- Supporting version history and allow rolling back to previous document version.

## Implementation and Deliverables

### Deadlines

The project is due on Sunday, 11th of May, at 4 pm. Each team should submit a zipped folder named `Team_<team number>.zip` containing the following materials:

- A link to your GitHub source project
- A `readme.txt`, explaining how to run your code
- A `members.txt` containing the names and IDs of each student in the group
- A PDF file containing any algorithms used

### Teams

Work in groups of 3-4 members.

### Implementation

- Implementation is primarily done in Java. However, for the UI module, use the languages/frameworks you prefer.
- Select the best data structures, algorithms, techniques, and tools to enhance project performance.
- Handle basic network problems and exceptions in your program.

## Libraries and Packages Regulations

- Libraries can be used for implementing the UI and user management.
- For document management and real-time editing modules, only use libraries for a small percentage of the module functionality.
- You are responsible for the accuracy of the libraries used.

## Evaluation and Grading Criteria

- The project is graded as a whole.
- Any delay in delivery will result in a penalty of losing 10% of the grade for each late day.
- Original code is mandatory; plagiarism will result in zero grades for the project.
- Note: Plagiarism may also affect other coursework grades.

Good Luck!

---
