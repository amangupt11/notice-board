import prisma from "@/lib/prisma";
import { validateNotice } from "@/lib/validate";

// /api/notices
//   GET  -> list all notices, Urgent first (ordering done in the DB query)
//   POST -> create a notice (server-side validation)
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        // Urgent > Normal (enum declaration order), then newest publishDate.
        orderBy: [
          { priority: "desc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
      });
      return res.status(200).json(notices);
    }

    if (req.method === "POST") {
      const { valid, errors, data } = validateNotice(req.body);
      if (!valid) {
        return res.status(400).json({ errors });
      }
      const notice = await prisma.notice.create({ data });
      return res.status(201).json(notice);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  } catch (err) {
    console.error("Notice collection error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
