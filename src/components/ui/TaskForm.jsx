// src/components/ui/TaskForm.jsx
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

const today = new Date().toISOString().split("T")[0];

const TaskSchema = Yup.object().shape({
  taskName: Yup.string().required("Task name is required"),
  description: Yup.string(),
  deadline: Yup.date()
    .min(today, "Deadline must be today or in the future")
    .required("Deadline is required"),
});

function TaskForm({ showForm, editId, tasks, onSubmit, loading }) {
  const handleAddTask = async (values, { resetForm }) => {
    await onSubmit(values, { resetForm });
  };

  return (
    showForm && (
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
                    description:
                      tasks.find((t) => t.id === editId)?.description || "",
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
                  <Label
                    htmlFor="description"
                    className="font-medium text-gray-700"
                  >
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
    )
  );
}

export default TaskForm;