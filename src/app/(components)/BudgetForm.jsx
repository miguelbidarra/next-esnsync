"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  IconButton,
  TableCell,
  Table,
  TableRow,
  TableHead,
  TableBody,
  Checkbox,
  FormGroup,
  Grid,
  Box,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const BudgetForm = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity of people
  const [nights, setNights] = useState(1); // Default number of nights
  const [expenseOptions, setExpenseOptions] = useState({
    perPerson: false,
    perNight: false,
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [numErasmus, setNumErasmus] = useState("");
  const [numESNers, setNumESNers] = useState("");
  const [fee, setFee] = useState("");

  const handleAddOrEditItem = () => {
    if (item && amount && !isNaN(amount)) {
      let finalAmount = parseFloat(amount);
      if (expenseOptions.perPerson) {
        finalAmount *= parseInt(quantity, 10);
      }
      if (expenseOptions.perNight) {
        finalAmount *= parseInt(nights, 10);
      }
      const newItem = {
        item,
        amount: parseFloat(amount),
        finalAmount, // Store the computed final amount
        quantity: parseInt(quantity, 10),
        nights: parseInt(nights, 10),
        expenseOptions: { ...expenseOptions },
      };
      if (editIndex >= 0) {
        // Edit mode
        const updatedItems = [...items];
        updatedItems[editIndex] = newItem;
        setItems(updatedItems);
        setEditIndex(-1);
      } else {
        // Add mode
        if (calculateTotalParticipants() !== 0) {
          newItem.quantity = parseInt(numErasmus, 10);
        }
        setItems([...items, newItem]);
      }
      setItem("");
      setAmount("");
      setQuantity(1);
      setNights(1);
      setExpenseOptions({
        perPerson: false,
        perNight: false,
      });
    }
  };

  const handleEdit = (index) => {
    setItem(items[index].item);
    setAmount(items[index].amount.toString());
    setQuantity(items[index].quantity.toString());
    setNights(items[index].nights.toString());
    setExpenseOptions(items[index].expenseOptions);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filteredItems = items.filter((_, i) => i !== index);
    setItems(filteredItems);
  };

  const handleCheckboxChange = (event) => {
    setExpenseOptions({
      ...expenseOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + curr.finalAmount, 0).toFixed(2);
  };

  const calculateTotalParticipants = () => {
    const totalErasmus = parseInt(numErasmus, 10) || 0;
    const totalESNers = parseInt(numESNers, 10) || 0;
    return totalErasmus + totalESNers;
  };

  const calculateCostPerErasmus = () => {
    const totalErasmus = parseInt(numErasmus, 10) || 0;
    const totalExpenses = parseFloat(calculateTotal());
    const costPerErasmus = totalErasmus > 0 ? totalExpenses / totalErasmus : 0;
    const costPerErasmusWithStripeTax = costPerErasmus * 1.015 + 0.25;
    return costPerErasmusWithStripeTax.toFixed(2);
  };

  const calculateIncome = () => {
    const totalErasmus = parseInt(numErasmus, 10) || 0;
    const feeAmount = parseFloat(fee) || 0;
    return (totalErasmus * feeAmount).toFixed(2);
  };

  const calculateDifference = () => {
    const totalErasmus = parseInt(numErasmus, 10) || 0;
    const totalExpenses = parseFloat(calculateTotal());

    const costPerErasmus = totalErasmus > 0 ? totalExpenses / totalErasmus : 0;
    const costPerErasmusWithStripeTax = costPerErasmus * 1.015 + 0.25;

    const income = parseFloat(calculateIncome());
    const totalCostIncludingStripeTax =
      totalErasmus * costPerErasmusWithStripeTax;
    return (income - totalCostIncludingStripeTax).toFixed(2);
  };

  return (
    <Container sx={{ maxWidth: "100%" }} maxWidth={false}>
      <Paper style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h6">Event Budget Planner</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Nº Erasmus"
              variant="outlined"
              type="number"
              value={numErasmus}
              onChange={(e) => setNumErasmus(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Nº ESNers"
              variant="outlined"
              type="number"
              value={numESNers}
              onChange={(e) => setNumESNers(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6">
              Nº Total: {calculateTotalParticipants()}
            </Typography>
          </Grid>
        </Grid>
        <FormControl component="fieldset" style={{ marginBottom: "20px" }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expenseOptions.perPerson}
                  onChange={handleCheckboxChange}
                  name="perPerson"
                />
              }
              label="Price Per Person"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={expenseOptions.perNight}
                  onChange={handleCheckboxChange}
                  name="perNight"
                />
              }
              label="Price Per Night"
            />
          </FormGroup>
        </FormControl>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Expense Item"
              variant="outlined"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Amount"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          {expenseOptions.perPerson && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Quantity (People)"
                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Grid>
          )}
          {expenseOptions.perNight && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Quantity (Nights)"
                variant="outlined"
                type="number"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
              />
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddOrEditItem}
            >
              {editIndex >= 0 ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expense Item</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Nights</TableCell>
              <TableCell>Final Amount</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.item}</TableCell>
                <TableCell>{entry.amount.toFixed(2)}€</TableCell>
                <TableCell>
                  {entry.quantity === 1 ? "" : entry.quantity}
                </TableCell>
                <TableCell>{entry.nights === 1 ? "" : entry.nights}</TableCell>
                <TableCell>{entry.finalAmount.toFixed(2)}€</TableCell>
                <TableCell>
                  <IconButton edge="end" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Total: ${calculateTotal()}€
        </Typography>
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Cost per Erasmus: ${calculateCostPerErasmus()}€
        </Typography>
        <TextField
          label="Fee"
          variant="outlined"
          type="number"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Income: ${calculateIncome()}€
        </Typography>
        <Typography
          variant="h6"
          style={{
            marginTop: "20px",
            backgroundColor:
              calculateDifference() >= 0 ? "lightgreen" : "lightcoral",
          }}
        >
          Balance: ${calculateDifference()}€
        </Typography>
      </Paper>
    </Container>
  );
};

export default BudgetForm;
