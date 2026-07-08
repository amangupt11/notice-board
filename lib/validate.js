// Server-side validation for notices. Runs inside the API routes so the rules
// hold regardless of what the browser sends.

export const CATEGORIES = ["Exam", "Event", "General"];
export const PRIORITIES = ["Normal", "Urgent"];

const asString = (value) => (typeof value === "string" ? value.trim() : "");

// Returns { valid, errors, data } where `data` is the cleaned, safe-to-persist
// object (only present for fields that passed validation).
export function validateNotice(input = {}) {
  const errors = {};
  const data = {};

  const title = asString(input.title);
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > 200) {
    errors.title = "Title must be 200 characters or fewer.";
  } else {
    data.title = title;
  }

  const body = asString(input.body);
  if (!body) {
    errors.body = "Body is required.";
  } else {
    data.body = body;
  }

  if (!CATEGORIES.includes(input.category)) {
    errors.category = "Category must be Exam, Event, or General.";
  } else {
    data.category = input.category;
  }

  if (!PRIORITIES.includes(input.priority)) {
    errors.priority = "Priority must be Normal or Urgent.";
  } else {
    data.priority = input.priority;
  }

  const publishDate = new Date(input.publishDate);
  if (!input.publishDate || Number.isNaN(publishDate.getTime())) {
    errors.publishDate = "A valid publish date is required.";
  } else {
    data.publishDate = publishDate;
  }

  // Image is optional. When present it must be a reasonable URL string.
  const image = asString(input.image);
  if (image) {
    if (image.length > 500) {
      errors.image = "Image URL is too long.";
    } else {
      data.image = image;
    }
  } else {
    data.image = null;
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}
