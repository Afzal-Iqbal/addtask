// src/components/ui/TaskTable.jsx
import { Button } from "@/components/ui/button";

function TaskTable({ tasks, filter, loading, onStatusToggle, onEdit, onDelete }) {
  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : task.status === filter
  );

  const today = new Date().toISOString().split("T")[0];

  return (
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
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Mark Complete
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Edit
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider">
                  Delete
                </th>
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
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {task.taskName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {task.description}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        isUpcoming ? "text-green-600 font-semibold" : "text-gray-500"
                      }`}
                    >
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
                        <div className="text-xs text-gray-500 mt-1">
                          Completed on: {completedDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {task.status === "Pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStatusToggle(task.id)}
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
                        onClick={() => onEdit(task.id)}
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
                        onClick={() => onDelete(task.id)}
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
  );
}

export default TaskTable;