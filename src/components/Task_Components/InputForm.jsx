import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTask } from "../../contextAPI/ContextProvider";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const formatDateForInput = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

const InputForm = ({ open, handleClose, taskToEdit }) => {
  const { addTask, updateTask } = useTask();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    created_on: "",
    deadline: "",
    file: null,
  });

  const [errors, setErrors] = useState({
    title: null,
    description: null,
    deadline: null,
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        created_on: formatDateForInput(taskToEdit.created_on),
        deadline: formatDateForInput(taskToEdit.deadline),
        file: null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        created_on: new Date().toISOString().split("T")[0],
        deadline: "",
        file: null,
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("created_on", formData.created_on);
    formDataToSend.append("deadline", formData.deadline);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    if (taskToEdit) {
      updateTask(taskToEdit._id, formDataToSend);
    } else {
      addTask(formDataToSend);
    }

    setFormData({
      title: "",
      description: "",
      created_on: new Date().toISOString().split("T")[0],
      deadline: "",
      file: null,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="outlined"
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          variant="outlined"
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          error={!!errors.deadline}
          helperText={errors.deadline}
        />
        <Box mt={2}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload File
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {formData.file && (
            <Typography mt={1}>{formData.file.name}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {taskToEdit ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputForm;
