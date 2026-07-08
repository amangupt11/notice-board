import prisma from "@/lib/prisma";
import { validateNotice } from "@/lib/validate";

// /api/notices/:id
//   GET    -> fetch one notice
//   PUT    -> update a notice (server-side validation)
//   DELETE -> remove a notice
export default async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  try {
    if (req.method === "GET") {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found." });
      }
      return res.status(200).json(notice);
    }

    if (req.method === "PUT") {
      const { valid, errors, data } = validateNotice(req.body);
      if (!valid) {
        return res.status(400).json({ errors });
      }
      const notice = await prisma.notice.update({ where: { id }, data });
      return res.status(200).json(notice);
    }

    if (req.method === "DELETE") {
      await prisma.notice.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  } catch (err) {
    // P2025 = record to update/delete does not exist.
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error("Notice item error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
