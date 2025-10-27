import { Request, Response } from "express";
import Contact from "../models/contact"; // <-- Make sure this path matches your folder structure

// Save contact message
export async function sendContactMessage(req: Request, res: Response) {
  const { name, company, email, phone, interests, message, referral } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required." });
  }

  try {
    const contact = new Contact({
      name,
      company,
      email,
      phone,
      interests,
      message,
      referral,
    });

    await contact.save();

    res.status(201).json({
      message: "Your message has been received and saved successfully.",
      data: contact,
    });
  } catch (err) {
    console.error("Error saving contact:", err);
    res
      .status(500)
      .json({ message: "Failed to save contact message", error: err });
  }
}

// Retrieve all contact messages (for admin dashboard)
export async function getAllContacts(req: Request, res: Response) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Contacts fetched successfully", data: contacts });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch contacts", error: err });
  }
}

// Retrieve a single contact by ID
export async function getContactById(req: Request, res: Response) {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact fetched successfully", data: contact });
  } catch (err) {
    console.error("Error fetching contact:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch contact", error: err });
  }
}
