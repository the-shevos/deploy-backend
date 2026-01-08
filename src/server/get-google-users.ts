import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

router.get("/get-google-users", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    const googleUsers = data.users
      .filter((u) => u.app_metadata?.provider === "google")
      .map((u) => ({
        id: u.id,
        name: u.user_metadata?.full_name || "Google User",
        email: u.email,
        avatar: u.user_metadata?.avatar_url || null,
        provider: "Google",
        createdAt: u.created_at,
        isBlocked: u.user_metadata?.isBlocked || false,
      }));

    res.json({ users: googleUsers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/block/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { isBlocked: true },
    });

    if (error) throw error;

    res.json({ message: "User blocked successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/unblock/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { isBlocked: false },
    });

    if (error) throw error;

    res.json({ message: "User unblocked successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
