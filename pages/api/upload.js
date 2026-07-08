import { v2 as cloudinary } from "cloudinary";

// Optional image upload (bonus). The browser sends a base64 data URL; we hand it
// to Cloudinary and return the hosted secure URL to store on the notice.
// If Cloudinary env vars are not configured the endpoint reports that cleanly
// and the rest of the app keeps working (image is optional).
export const config = {
  api: { bodyParser: { sizeLimit: "8mb" } },
};

const isConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  if (!isConfigured) {
    return res
      .status(501)
      .json({ error: "Image upload is not configured on the server." });
  }

  const file = req.body?.file;
  if (typeof file !== "string" || !file.startsWith("data:image/")) {
    return res.status(400).json({ error: "A valid image file is required." });
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "notice-board",
    });
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ error: "Image upload failed." });
  }
}
