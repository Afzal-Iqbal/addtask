import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HelloWorld from "./pages/dashboard";
import AddStudent from "./pages/add-student";
import Course from "./layout/course";
import AddTaskPage from "./pages/add-task"; // ✅ New Add Task Page
import CourseList from "./pages/course-list";
import TaskListPage from "./pages/task-list";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={<HelloWorld />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="add-course" element={<Course />} />
        <Route path="add-task" element={<AddTaskPage />} /> {/* ✅ Add Task Route */}
        <Route path="course-list" element={<CourseList />} />
        <Route path="task-list" element={<TaskListPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;