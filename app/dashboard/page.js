"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";
import { Neuo, zentry } from "../font";

const initialTasks = {
  "To Do": [],
  "In Progress": [],
  Review: [],
  Done: [],
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [selectedColumn, setSelectedColumn] = useState("To Do");
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = () => {
    if (!newTask) return;
    const newTaskObj = {
      title: newTask,
      description: taskDescription,
      dueDate: taskDueDate,
      priority: taskPriority,
    };
    setTasks((prev) => ({
      ...prev,
      [selectedColumn]: [...prev[selectedColumn], newTaskObj],
    }));
    setNewTask("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Medium");
    setShowForm(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/");
  };

  return (
    <div className="dashboard">
      <div className={`header ${Neuo.className}`}>
        <h1>Kanban Dashboard.</h1>
        <div className="header-buttons">
          <button className="new-task-button" onClick={() => setShowForm(true)}>
            + Create New Task
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {showForm && (
        <div className="task-form-overlay" onClick={() => setShowForm(false)}>
          <div className="task-form" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {Object.keys(tasks).map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <button onClick={handleAddTask}>Add</button>
          </div>
        </div>
      )}

      <div className="board">
        {Object.keys(tasks).map((column) => (
          <div className="column" key={column}>
            <h2>{column}</h2>
            {tasks[column].map((task, index) => (
              <div key={index} className="task-card">
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <small>Due: {task.dueDate || "N/A"}</small>
                <small>Priority: {task.priority}</small>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
