const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

// Every route in this file needs login
router.use(requireAuth);

// READ: list my applications (optional ?status=Interview&search=google)
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = "SELECT * FROM applications WHERE user_id = $1";
    const params = [req.userId];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (company ILIKE $${params.length} OR role ILIKE $${params.length})`;
    }
    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE: add an application
router.post("/", async (req, res) => {
  try {
    const { company, role, status, job_link, salary, notes, applied_date } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }
    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `INSERT INTO applications (user_id, company, role, status, job_link, salary, notes, applied_date)
       VALUES ($1, $2, $3, COALESCE($4, 'Applied'), $5, $6, $7, COALESCE($8, CURRENT_DATE))
       RETURNING *`,
      [req.userId, company, role, status, job_link, salary, notes, applied_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE: change an application
router.put("/:id", async (req, res) => {
  try {
    const { company, role, status, job_link, salary, notes, applied_date } = req.body;

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE applications SET
         company = COALESCE($1, company),
         role = COALESCE($2, role),
         status = COALESCE($3, status),
         job_link = COALESCE($4, job_link),
         salary = COALESCE($5, salary),
         notes = COALESCE($6, notes),
         applied_date = COALESCE($7, applied_date)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [company, role, status, job_link, salary, notes, applied_date, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: remove an application
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;