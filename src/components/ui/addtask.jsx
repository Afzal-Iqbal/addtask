import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth, db } from "@/firebase";
import { createTask, getTasksByUser, updateTask, deleteTask } from "@/lib/taskService";

const today = new Date().toISOString().split("T")[0];

const TaskSchema = Yup.object().shape({
  taskName: Yup.string().required("Task name is required"),
  description: Yup.string(),
  deadline: Yup.date()
    .min(today, "Deadline must be today or in the future")
    .required("Deadline is required"),
});

function AddTask() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else if (user === null) {
      setTasks([]);
      setError("Please log in to view or add tasks.");
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getTasksByUser(user.uid);
      setTasks(fetchedTasks);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Failed to load tasks. Check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (values, { resetForm }) => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    const userId = user.uid;
    const editingTask = editId !== null ? tasks.find((t) => t.id === editId) : null;

    const taskData = {
      taskName: values.taskName,
      description: values.description,
      deadline: values.deadline,
      status: editingTask ? editingTask.status : "Pending",
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      completedAt: editingTask ? editingTask.completedAt : null,
      userId,
    };

    try {
      if (editId !== null) {
        await updateTask(editId, taskData);
        setTasks((prev) =>
          prev.map((t) => (t.id === editId ? { ...t, ...taskData } : t))
        );
      } else {
        const docRef = await createTask(taskData);
        setTasks((prev) => [...prev, { id: docRef.id, ...taskData }]);
      }
      resetForm();
      setShowForm(false);
      setEditId(null);
    } catch (error) {
      console.error("Error saving task:", error.message);
      setError("Error saving task: Missing or insufficient permissions. Check Firebase rules.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task.status !== "Pending") return;

    setLoading(true);
    setError(null);
    const updates = {
      status: "Completed",
      completedAt: new Date().toISOString(),
    };

    try {
      await updateTask(id, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    } catch (error) {
      console.error("Error updating status:", error.message);
      setError("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.message);
      setError("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : task.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Loading Bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-2 bg-blue-200 z-50">
          <div className="h-full bg-blue-600 animate-pulse w-1/3"></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">📝 Task Manager</h1>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-200"
            disabled={loading || !user}
          >
            {showForm ? "Cancel" : "Add Task"}
          </Button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded-md">{error}</div>}

        {/* Filter Buttons */}
        <div className="flex gap-3">
          {["All", "Pending", "Completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-200 ${
                filter === status
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              disabled={loading || !user}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Task Form */}
        {showForm && (
          <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                {editId !== null ? "Edit Task" : "Create a New Task"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={
                  editId !== null
                    ? {
                        taskName: tasks.find((t) => t.id === editId)?.taskName || "",
                        description: tasks.find((t) => t.id === editId)?.description || "",
                        deadline: tasks.find((t) => t.id === editId)?.deadline || "",
                      }
                    : { taskName: "", description: "", deadline: "" }
                }
                enableReinitialize
                validationSchema={TaskSchema}
                onSubmit={handleAddTask}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <Label htmlFor="taskName" className="font-medium text-gray-700">
                        Task Name
                      </Label>
                      <Field
                        name="taskName"
                        as={Input}
                        placeholder="Enter task name"
                        className="mt-1 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      />
                      <ErrorMessage
                        name="taskName"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="font-medium text-gray-700">
                        Description
                      </Label>
                      <Field
                        name="description"
                        as="textarea"
                        rows="3"
                        placeholder="Optional task details"
                        className="w-full border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deadline" className="font-medium text-gray-700">
                        Deadline
                      </Label>
                      <Field
                        name="deadline"
                        type="date"
                        as={Input}
                        min={today}
                        className="mt-1 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      />
                      <ErrorMessage
                        name="deadline"
                        component="div"
                        className="text-sm text-red-600 mt-1"
                      />
                    </div>

                    <CardFooter className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-200"
                      >
                        {isSubmitting
                          ? editId !== null
                            ? "Updating..."
                            : "Adding..."
                          : editId !== null
                          ? "Update Task"
                          : "Add Task"}
                      </Button>
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        )}

        {/* Task Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">📋 Tasks</h2>
          {loading ? (
            <p className="text-gray-600 text-sm font-medium">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-gray-600 text-sm font-medium">No tasks found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Task Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Mark Complete</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Edit</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const isUpcoming = new Date(task.deadline) >= new Date(today);
                    const completedDate = task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString()
                      : null;

                    return (
                      <tr
                        key={task.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                      >
                        <td className="px-6 py-4 text-gray-800 font-medium">{task.taskName}</td>
                        <td className="px-6 py-4 text-gray-600">{task.description}</td>
                        <td className={`px-6 py-4 ${isUpcoming ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                          {task.deadline}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              task.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.status}
                          </span>
                          {task.status === "Completed" && completedDate && (
                            <div className="text-xs text-gray-500 mt-1">Completed on: {completedDate}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {task.status === "Pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle(task.id)}
                              title="Mark Complete"
                              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200 disabled:bg-gray-100 disabled:text-gray-400"
                              disabled={loading}
                            >
                              ✅
                            </Button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditId(task.id);
                              setShowForm(true);
                            }}
                            title="Edit Task"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
                            disabled={loading}
                          >
                            ✏️
                          </Button>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete Task"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 disabled:bg-gray-100 disabled:text-gray-400"
                            disabled={loading}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddTask;