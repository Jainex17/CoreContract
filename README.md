# Contact Management System

This project is a Contact Management System designed to efficiently manage contact details, including features for adding, viewing, updating, and deleting contacts. The backend is implemented using TypeScript, and an online PostgreSQL database is used for data storage. The frontend leverages Material UI (MUI) for a modern and responsive user interface.

---

## Features

- **Add Contacts**: Create new contact records with fields for first name, last name, email, phone number, company, and job title.
- **View Contacts**: Display a list of all contacts stored in the database.
- **Update Contacts**: Edit details of existing contacts.
- **Delete Contacts**: Remove unwanted contact records.

---

## Project Structure

### Backend
- **TypeScript**: Ensures type safety and maintainability.
- **PostgreSQL Database**: Used for reliable and scalable data storage.
- **RESTful API**: Enables communication between the frontend and backend.

### Frontend
- **Material UI (MUI)**: Provides a responsive and user-friendly interface for managing contacts.

---

## Major Technical Decisions

1. **Database**: Chose PostgreSQL for its robust relational data handling and online hosting capabilities.
2. **Backend Language**: TypeScript was used for strong type checking and easier debugging.
3. **Frontend Framework**: Material UI was selected for its extensive library of prebuilt, customizable components.
4. **CRUD Operations**: Focused on creating a clear and modular API to handle the core functionalities of adding, viewing, updating, and deleting contacts.

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn

### Database Setup
1. Create a .env File
In the root directory of the project, create a file named .env and define the DATABASE_URL environment variable. Replace the placeholder values with your actual PostgreSQL connection details.

```
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"
```