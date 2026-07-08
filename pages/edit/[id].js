import prisma from "@/lib/prisma";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";

// Load the notice on the server so the form opens pre-filled with its values.
export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    },
  };
}

export default function EditNoticePage({ notice }) {
  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Notice</h1>
      <NoticeForm initial={notice} noticeId={notice.id} />
    </Layout>
  );
}
