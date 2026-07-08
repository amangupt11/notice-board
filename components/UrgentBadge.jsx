// Red "Urgent" badge required by the spec for urgent notices.
export default function UrgentBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
      Urgent
    </span>
  );
}
