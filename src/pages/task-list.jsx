import Layout from "@/layout/layout";
import AddTask from "./add-task"; // ✅ Corrected path

export default function TaskListPage() {
  return (
    <Layout>
      <AddTask />
    </Layout>
  );
}