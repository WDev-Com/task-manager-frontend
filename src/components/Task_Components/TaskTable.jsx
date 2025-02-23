import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Stack,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Edit, Delete, CloudDownload } from "@mui/icons-material";
import { useTask } from "../../contextAPI/ContextProvider";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getStatus = (task) => {
  const today = new Date();
  const deadlineDate = new Date(task.deadline);
  const isDone = task.status === "DONE";

  if (isDone && today <= deadlineDate)
    return { label: "Achieved", color: "green" };
  if (!isDone && today > deadlineDate) return { label: "Failed", color: "red" };
  return { label: "In Progress", color: "blue" };
};

const TaskTable = ({ editTask }) => {
  const { tasks, deleteTask, downloadTaskFile, updateTask } = useTask();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleStatusChange = (task) => {
    // console.log(task);
    const newStatus = task.status === "TODO" ? "DONE" : "TODO"; // Toggle between TODO & DONE

    // Prepare FormData
    const formData = new FormData();
    formData.append("status", newStatus);

    updateTask(task._id, formData);
  };

  React.useEffect(() => {
    if (tasks.length > 0) {
      setIsLoading(false);
    }
  }, [tasks]);

  return isLoading ? (
    <Stack alignItems="center" my={3}>
      <CircularProgress />
    </Stack>
  ) : (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Title</b>
            </TableCell>
            <TableCell>
              <b>Description</b>
            </TableCell>
            <TableCell>
              <b>Created On</b>
            </TableCell>
            <TableCell>
              <b>Deadline</b>
            </TableCell>
            <TableCell>
              <b>Status</b>
            </TableCell>
            <TableCell>
              <b>Action</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{formatDate(task.created_on)}</TableCell>
              <TableCell>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2" fontWeight="bold">
                    {formatDate(task.deadline)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: getStatus(task).color,
                      fontWeight: "bold",
                      mt: 0.5,
                    }}
                  >
                    {getStatus(task).label}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      task.status === "DONE"
                        ? "green"
                        : task.status === "TODO"
                        ? "orange"
                        : "gray",
                    color: "white",
                    borderRadius: "20px",
                    px: 3,
                  }}
                  onClick={() => handleStatusChange(task)}
                >
                  {task.status}
                </Button>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      downloadTaskFile(task._id);
                    }}
                  >
                    <CloudDownload />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => editTask(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteTask(task._id)}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
