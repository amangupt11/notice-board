import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";

export default function NewNoticePage() {
  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New Notice</h1>
      <NoticeForm />
    </Layout>
  );
}
