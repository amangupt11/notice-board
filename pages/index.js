import { useState } from "react";
import prisma from "@/lib/prisma";
import Layout from "@/components/Layout";
import NoticeCard from "@/components/NoticeCard";
import ConfirmDialog from "@/components/ConfirmDialog";

// Fetch notices on the server with Urgent-first ordering done in the DB query.
export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: "desc" },
      { publishDate: "desc" },
      { createdAt: "desc" },
    ],
  });

  return {
    props: {
      notices: notices.map((n) => ({
        ...n,
        publishDate: n.publishDate.toISOString(),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    },
  };
}

export default function Home({ notices: initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [target, setTarget] = useState(null); // notice pending deletion
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${target.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error();
      setNotices((list) => list.filter((n) => n.id !== target.id));
      setTarget(null);
    } catch {
      alert("Failed to delete the notice. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
        <p className="text-sm text-gray-500">
          {notices.length} {notices.length === 1 ? "notice" : "notices"}
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
          No notices yet. Click <span className="font-medium">+ New Notice</span>{" "}
          to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onDelete={setTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete notice?"
        message={
          target
            ? `"${target.title}" will be permanently removed.`
            : ""
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </Layout>
  );
}
