import { Request, Response } from "express";
import pool from "./db";

export default function setupRoutes(app: any) {
  app.get("/", home);
  app.post("/api/v1/contacts", createContact);
  app.get("/api/v1/contacts", getContacts);
  app.put("/api/v1/contacts/:id", updateContact);
  app.delete("/api/v1/contacts/:id", deleteContact);
}

function home(req: Request, res: Response) {
  res.send("API is running...");
}

async function createContact(req: Request, res: Response) {
  try {
    const { FirstName, LastName, Email, PhoneNumber, Company, JobTitle } =
      req.body;

    if (
      !FirstName ||
      !LastName ||
      !Email ||
      !PhoneNumber ||
      !Company ||
      !JobTitle
    ) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const emailExists = await pool.query(
      "SELECT * FROM contacts WHERE email = $1",
      [Email]
    );

    if (emailExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Contact with this email already exists" });
    }

    const newContact = await pool.query(
      "INSERT INTO contacts (first_name, last_name, email, phone_number, company, job_title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [FirstName, LastName, Email, PhoneNumber, Company, JobTitle]
    );

    res.json(newContact.rows[0]);
  } catch (err) {
    console.log("Error adding contact", err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getContacts(req: Request, res: Response) {
  try {
    const allContacts = await pool.query("SELECT * FROM contacts");
    res.json(allContacts.rows);
  } catch (err) {
    console.log("Error getting contacts", err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updateContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { FirstName, LastName, Email, PhoneNumber, Company, JobTitle } =
      req.body;

    if (
      !id ||
      !FirstName ||
      !LastName ||
      !Email ||
      !PhoneNumber ||
      !Company ||
      !JobTitle
    ) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const contact = await pool.query("SELECT * FROM contacts WHERE id = $1", [
      id,
    ]);

    if (contact.rows.length === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const updatedContact = await pool.query(
      "UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone_number = $4, company = $5, job_title = $6 WHERE id = $7 RETURNING *",
      [FirstName, LastName, Email, PhoneNumber, Company, JobTitle, id]
    );

    res.json(updatedContact.rows[0]);
  } catch (err) {
    console.log("Error updating contact", err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function deleteContact(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide contact ID" });
    }

    const data = await pool.query("DELETE FROM contacts WHERE id = $1", [id]);
    
    if(data && data.rowCount === 0) {
        return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.log("Error deleting contact", err);
    res.status(500).json({ message: "Server Error" });
  }
}
