import Link from "next/link";
import UrgentBadge from "@/components/UrgentBadge";

const categoryStyles = {
  Exam: "bg-purple-100 text-purple-700",
  Event: "bg-green-100 text-green-700",
  General: "bg-gray-100 text-gray-700",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Locale-independent, UTC-based formatting so the server and client always
// render the same string (avoids React hydration mismatches). Using UTC also
// keeps a date-only value (stored at midnight UTC) from shifting a day.
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

// A single responsive notice card with Edit and Delete actions.
export default function NoticeCard({ notice, onDelete }) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <article
      className={`flex flex-col rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md ${
        isUrgent ? "border-red-300" : "border-gray-200"
      }`}
    >
      {notice.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="mb-4 h-40 w-full rounded-md object-cover"
        />
      ) : null}

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            categoryStyles[notice.category] ?? categoryStyles.General
          }`}
        >
          {notice.category}
        </span>
        {isUrgent ? <UrgentBadge /> : null}
      </div>

      <h2 className="text-lg font-semibold text-gray-900">{notice.title}</h2>
      <p className="mt-1 line-clamp-4 flex-1 whitespace-pre-line text-sm text-gray-600">
        {notice.body}
      </p>
      <p className="mt-3 text-xs text-gray-400">{formatDate(notice.publishDate)}</p>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
        <Link
          href={`/edit/${notice.id}`}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(notice)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
