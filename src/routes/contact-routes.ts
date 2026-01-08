import express from "express";
import {
  createContactRequest,
  getContactRequests,
  replyContact,
  getContactRequestsLimit,
  getNewContactCount,
  markAsRead,
  markAllContactsRead,
} from "../controller/contact-controller";

const router = express.Router();

router.post("/", createContactRequest);

router.get("/", getContactRequests);

router.get("/limit", getContactRequestsLimit);

router.get("/new-count", getNewContactCount);

router.post("/reply/:id", replyContact);

router.post("/read/:id", markAsRead);

router.post("/read-all", markAllContactsRead);

export default router;
