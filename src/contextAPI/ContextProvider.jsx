import React, { createContext, useContext, useState, useEffect } from "react";

// API URL

// Create Context
const TaskContext = createContext();

// Context Provider
export const TaskProvider = ({ children }) => {
  const url = "https://task-manager-backend-ashy-ten.vercel.app/api/tasks";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${url}/`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch tasks from the server
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async (task) => {
    try {
      const response = await fetch(`${url}/create`, {
        method: "POST",
        body: task, // Send FormData directly
      });
      if (response.ok) {
        await fetchTasks();
      }
      // if (response.ok) {
      //   const newTask = await response.json();
      //   setTasks((prevTasks) => [...prevTasks, newTask]);
      // }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update task details
  const updateTask = async (taskId, updatedTaskData) => {
    try {
      const response = await fetch(`${url}/${taskId}`, {
        method: "PUT",
        body: updatedTaskData, // Send FormData directly
      });
      if (response.ok) {
        await fetchTasks();
      }
      // if (response.ok) {
      //   setTasks((prevTasks) =>
      //     prevTasks.map((task) =>
      //       task.id === taskId ? { ...task, ...updatedTaskData } : task
      //     )
      //   );
      // }
      let err = await response.json();
      if (err.message) alert(err.message);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${url}/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchTasks();
      }
      // if (response.ok) {
      //   setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      // }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const downloadTaskFile = async (taskId) => {
    try {
      let curr = `${url}/file/${taskId}`;
      const response = await fetch(curr, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const urls = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger the download
      const a = document.createElement("a");
      a.href = urls;
      a.download = `task-${taskId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urls);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        updateTask,
        downloadTaskFile,
        loading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom Hook to use Task Context
export const useTask = () => {
  return useContext(TaskContext);
};
