import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

const tasksRef = collection(db, "tasks");

export async function createTask(task) {
  return await addDoc(tasksRef, task);
}

export async function getTasksByUser(userId) {
  const q = query(tasksRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateTask(id, updates) {
  const taskDoc = doc(db, "tasks", id);
  return await updateDoc(taskDoc, updates);
}

export async function deleteTask(id) {
  const taskDoc = doc(db, "tasks", id);
  return await deleteDoc(taskDoc);
}