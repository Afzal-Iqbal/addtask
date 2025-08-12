import Layout from "@/layout/layout";
import AddTask from "./add-task"; // ✅ Corrected path

export default function TaskList() {
  return (
    <Layout>
      <AddTask />
    </Layout>
  );
}