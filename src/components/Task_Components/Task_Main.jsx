import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import TaskTable from "./TaskTable";
import InputForm from "./InputForm";
import { useTask } from "../../contextAPI/ContextProvider";

export default function TaskManager() {
  const [open, setOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(false);
  const { tasks, addTask, updateTask, deleteTask, loading } = useTask();

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setOpen(true);
  };

  const handleSave = async (task) => {
    if (task.id) {
      await updateTask(task.id, task);
    } else {
      await addTask(task);
    }
    setOpen(false);
  };

  return (
    <Box p={3}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
          }}
        >
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        // Show "No Tasks Found" message in center if no tasks
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh", // Adjust as needed
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No Tasks Found !
          </Typography>
        </Box>
      ) : (
        <TaskTable
          tasks={tasks}
          editTask={handleEdit}
          deleteTask={deleteTask}
        />
      )}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setOpen(true)}
      >
        <Add />
      </Fab>
      <InputForm
        open={open}
        handleClose={() => {
          setOpen(false);
          setTaskToEdit(false);
        }}
        taskToEdit={taskToEdit}
        onSave={handleSave}
      />
    </Box>
  );
}
