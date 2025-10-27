import { Router } from "express";
import {
  sendContactMessage,
  getAllContacts,
  getContactById,
  deleteContactById, // 👈 new import
} from "../controllers/contactController";

const router = Router();

// 📨 Save new contact message
router.post("/contact", sendContactMessage);

// 📋 Get all contact messages
router.get("/contact", getAllContacts);

// 🔍 Get a single contact message by ID
router.get("/contact/:id", getContactById);

// 🗑️ Delete a specific contact message
router.delete("/contact/:id", deleteContactById);

export default router;
