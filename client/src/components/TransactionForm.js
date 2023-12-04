import React, { useState } from "react";
import api from "../utils/api";

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    receiverId: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/transactions/make-transaction",
        formData
      );
      // Handle the response
      console.log(response.data);
    } catch (error) {
      console.error("Transaction error:", error.response.data);
    }
  };

  return (
    <div>
      <h2>Make a Transaction</h2>
      <form onSubmit={handleSubmit}>
        <label>Receiver ID:</label>
        <input
          type="text"
          name="receiverId"
          value={formData.receiverId}
          onChange={handleChange}
        />
        <br />
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Make Transaction</button>
      </form>
    </div>
  );
};

export default TransactionForm;
