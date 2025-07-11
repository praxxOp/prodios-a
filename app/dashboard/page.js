"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";
import { Neuo } from "../font";

const initialTasks = {
  "To Do": [],
  "In Progress": [],
  Review: [],
  Done: [],
};

const columns = [
  { key: "To Do", title: "To Do", className: "todo" },
  { key: "In Progress", title: "In Progress", className: "inprogress" },
  { key: "Review", title: "Review", className: "review" },
  { key: "Done", title: "Done", className: "done" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [selectedColumn, setSelectedColumn] = useState("To Do");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editColumn, setEditColumn] = useState(null);
  const [dragged, setDragged] = useState(null); // { colKey, index }

  const saveTimeout = useRef(null);

  // Load tasks from DB on mount
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        const grouped = {
          "To Do": [],
          "In Progress": [],
          Review: [],
          Done: [],
        };
        for (const task of data) {
          grouped[task.status].push({
            title: task.title,
            description: task.description,
            dueDate: task.due_date,
            priority: task.priority,
          });
        }
        setTasks(grouped);
      }
    };
    fetchTasks();
  }, []);

  // Save tasks to DB when they change
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      const saveTasks = async () => {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tasks),
        });
      };
      saveTasks();
    }, 1000);

    return () => clearTimeout(saveTimeout.current);
  }, [tasks]);

  const resetForm = () => {
    setNewTask("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Medium");
    setSelectedColumn("To Do");
    setEditIndex(null);
    setEditColumn(null);
    setShowForm(false);
  };

  const handleAddOrUpdateTask = () => {
    if (!newTask) return;
    const newTaskObj = { title: newTask, description: taskDescription, dueDate: taskDueDate, priority: taskPriority };
    const updated = { ...tasks };
    if (editIndex !== null && editColumn !== null) {
      updated[editColumn].splice(editIndex, 1);
      updated[selectedColumn].push(newTaskObj);
    } else {
      updated[selectedColumn].push(newTaskObj);
    }
    setTasks(updated);
    resetForm();
  };

  const handleEditTask = (task, index, column) => {
    setNewTask(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate);
    setTaskPriority(task.priority);
    setSelectedColumn(column);
    setEditIndex(index);
    setEditColumn(column);
    setShowForm(true);
  };

  const handleDeleteTask = (index, column) => {
    const updated = { ...tasks };
    updated[column].splice(index, 1);
    setTasks(updated);
  };

  const handleDragStart = (colKey, idx) => {
    setDragged({ colKey, idx });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetColKey, targetIdx = null) => {
    if (!dragged) return;
    const { colKey: fromCol, idx: fromIdx } = dragged;
    if (fromCol === targetColKey && (targetIdx === null || fromIdx === targetIdx)) {
      setDragged(null);
      return;
    }
    const updated = { ...tasks };
    const [movedTask] = updated[fromCol].splice(fromIdx, 1);
    if (targetIdx === null || targetIdx >= updated[targetColKey].length) {
      updated[targetColKey].push(movedTask);
    } else {
      updated[targetColKey].splice(targetIdx, 0, movedTask);
    }
    setTasks(updated);
    setDragged(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="dashboard">
      <div className={`header ${Neuo.className}`}>
        <h1>Kanban Dashboard.</h1>
        <div className="header-buttons">
          <button className="new-task-button" onClick={() => { resetForm(); setShowForm(true); }}>+ Create New Task</button>
          <button className="logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {showForm && (
        <div className="task-form-overlay" onClick={resetForm}>
          <div className={`task-form ${Neuo.className}`} onClick={e => e.stopPropagation()}>
            <input type="text" placeholder="Title." value={newTask} onChange={e => setNewTask(e.target.value)} />
            <textarea placeholder="Description." value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
            <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
            <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
              <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
            </select>
            <select value={selectedColumn} onChange={e => setSelectedColumn(e.target.value)}>
              {columns.map(col => <option key={col.key} value={col.key}>{col.title}</option>)}
            </select>
            <button onClick={handleAddOrUpdateTask}>{editIndex !== null ? "Update Task" : "Add Task"}</button>
          </div>
        </div>
      )}

      <div className={`kanban-board ${Neuo.className}`}>
        {columns.map(col => (
          <div
            key={col.key}
            className={`kanban-column ${col.className}`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.key)}
          >
            <div className="kanban-column-title">{col.title}.</div>
            <div className="kanban-column-cards">
              {tasks[col.key].map((task, index) => (
                <div
                  key={index}
                  className={`kanban-card${dragged && dragged.colKey === col.key && dragged.idx === index ? ' dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(col.key, index)}
                  onDragOver={handleDragOver}
                  onDrop={e => {
                    e.stopPropagation();
                    handleDrop(col.key, index);
                  }}
                  style={{ opacity: dragged && dragged.colKey === col.key && dragged.idx === index ? 0.5 : 1 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", width: "100%" }}>
                    <span style={{ fontSize: "1.5rem", width: "60%", wordBreak: "break-word", whiteSpace: "normal", display: "block" }}>{task.title}.</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <button className="kanban-edit-btn-small" title="Edit task" onClick={() => handleEditTask(task, index, col.key)}>Edit</button>
                      <button className="kanban-delete-btn-small" title="Delete task" onClick={() => handleDeleteTask(index, col.key)}>Delete</button>
                    </div>
                  </div>
                  <div style={{ fontSize: '.8rem', opacity: 0.85, wordBreak: 'break-word', whiteSpace: 'normal', width: '100%' }}>{task.description}</div>
                  <div className="kanban-card-meta"><small>Due: {task.dueDate || "N/A"}</small><small>Priority: {task.priority}</small></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
