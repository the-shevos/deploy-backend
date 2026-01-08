import { Request, Response } from "express";
import { ContactRequest } from "../model/ContactRequest";
import { sendReplyEmail } from "../utills/send-email";

export const createContactRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = new ContactRequest({
      name,
      email,
      message,
      isRead: false,
    });

    await newRequest.save();

    res.status(201).json({ message: "Contact request submitted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const replyContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const contact = await ContactRequest.findById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });

    await sendReplyEmail(contact.email, contact.name, message);

    await ContactRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "Reply sent and contact deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getContactRequests = async (req: Request, res: Response) => {
  try {
    const requests = await ContactRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err: any) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const getContactRequestsLimit = async (req: Request, res: Response) => {
  try {
    const requests = await ContactRequest.find()
      .sort({ createdAt: -1 })
      .limit(6);
    res.status(200).json(requests);
  } catch (err: any) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const getNewContactCount = async (req: Request, res: Response) => {
  try {
    const count = await ContactRequest.countDocuments({ isRead: false });
    res.status(200).json({ count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ContactRequest.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Marked as read" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const markAllContactsRead = async (req: Request, res: Response) => {
  try {
    await ContactRequest.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: "All contacts marked as read" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
