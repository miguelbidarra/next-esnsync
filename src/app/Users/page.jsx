"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/Users", {
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      console.log("Users loaded", data);
    } catch (error) {
      console.log("Error loading Users", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`/api/Users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.log("Error deleting user", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/Users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();

      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      handleClose();
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditClick(user)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(user._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit User</h2>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Users;
