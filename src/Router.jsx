import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HelloWorld from "./pages/dashboard";
import AddTaskPage from "./pages/add-task"; // ✅ New Add Task Page
import TaskList from "./pages/task-list";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={<HelloWorld />} />
        <Route path="add-task" element={<AddTaskPage />} /> {/* ✅ Add Task Route */}
        <Route path="/task-list" element={<TaskList />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;