// src/components/ui/AddTask.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";
import { auth, db } from "@/firebase";
import {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
} from "@/lib/taskService";

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
      setError(
        "Error saving task: Missing or insufficient permissions. Check Firebase rules."
      );
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
        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded-md">
            {error}
          </div>
        )}

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

        <TaskForm
          showForm={showForm}
          editId={editId}
          tasks={tasks}
          onSubmit={handleAddTask}
          loading={loading}
        />

        <TaskTable
          tasks={tasks}
          filter={filter}
          loading={loading}
          onStatusToggle={handleStatusToggle}
          onEdit={setEditId}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default AddTask;