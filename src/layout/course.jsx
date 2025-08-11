
import React, {useState} from "react";

function Course() {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseName: "",
    instructorName: "",
    institutionName: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses([...courses, formData]);
    setFormData({
      courseName: "",
      instructorName: "",
      institutionName: "",
      startDate: "",
      endDate: "",
    });
    setIsOpen(false);
  };

  const instructors = ["Afzal", "Ahmed Ali", "Ali Huzaifa"];
  const institutions = ["Code Academy", "Coursera", "SkillHub"];
  const courseNames = ["React Basics", "Advanced JS", "Firebase Mastery"];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Course Name</th>
              <th className="px-4 py-2 text-left">Instructor Name</th>
              <th className="px-4 py-2 text-left">Institution Name</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{course.courseName}</td>
                <td className="px-4 py-2">{course.instructorName}</td>
                <td className="px-4 py-2">{course.institutionName}</td>
                <td className="px-4 py-2">{course.startDate}</td>
                <td className="px-4 py-2">{course.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dropdowns */}
              <div>
                <label className="block mb-1">Course Name</label>
                <select
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Course</option>
                  {courseNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Instructor Name</label>
                <select
                  required
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Institution Name</label>
                <select
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Institution</option>
                  {institutions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div>
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;