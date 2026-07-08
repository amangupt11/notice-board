import { useState } from "react";
import { useRouter } from "next/router";
import { CATEGORIES, PRIORITIES } from "@/lib/validate";

// Turn any date value into the yyyy-mm-dd string a <input type="date"> expects.
function toDateInput(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

// Shared form used for both creating and editing a notice.
// When `noticeId` is passed it edits (PUT); otherwise it creates (POST).
export default function NoticeForm({ initial, noticeId }) {
  const router = useRouter();
  const isEdit = Boolean(noticeId);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    body: initial?.body ?? "",
    category: initial?.category ?? "General",
    priority: initial?.priority ?? "Normal",
    publishDate: toDateInput(initial?.publishDate),
    image: initial?.image ?? "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the file."));
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: dataUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      update("image", json.url);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError("");
    try {
      const res = await fetch(
        isEdit ? `/api/notices/${noticeId}` : "/api/notices",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (res.status === 400) {
        const json = await res.json();
        setErrors(json.errors || {});
        return;
      }
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      router.push("/");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      noValidate
    >
      {formError ? (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className={inputClass}
          placeholder="e.g. Mid-term exam schedule"
        />
        {errors.title ? <p className={errorClass}>{errors.title}</p> : null}
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Body <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          rows={5}
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          className={inputClass}
          placeholder="Write the notice details here…"
        />
        {errors.body ? <p className={errorClass}>{errors.body}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category ? <p className={errorClass}>{errors.category}</p> : null}
        </div>

        <div>
          <label htmlFor="priority" className={labelClass}>
            Priority
          </label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
            className={inputClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.priority ? <p className={errorClass}>{errors.priority}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className={labelClass}>
          Publish date <span className="text-red-500">*</span>
        </label>
        <input
          id="publishDate"
          type="date"
          value={form.publishDate}
          onChange={(e) => update("publishDate", e.target.value)}
          className={inputClass}
        />
        {errors.publishDate ? (
          <p className={errorClass}>{errors.publishDate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>
          Image <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading ? (
          <p className="mt-1 text-xs text-gray-500">Uploading image…</p>
        ) : null}
        {form.image ? (
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.image}
              alt=""
              className="h-16 w-16 rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => update("image", "")}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : null}
        {errors.image ? <p className={errorClass}>{errors.image}</p> : null}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : isEdit
              ? "Update notice"
              : "Create notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
