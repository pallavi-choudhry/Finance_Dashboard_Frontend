import React, { useEffect, useState } from "react";
import { transactionService } from "../../services/transactionService";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import TransactionFilter from "./TransactionFilter";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchTransactions = async () => {
    const data = await transactionService.getTransactions(filters);
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <div>
      <h2>Transactions</h2>

      <TransactionFilter setFilters={setFilters} />

      <TransactionForm onSuccess={fetchTransactions} />

      <TransactionList
        transactions={transactions}
        onDelete={fetchTransactions}
        onUpdate={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;