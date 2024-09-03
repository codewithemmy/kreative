// src/components/TuitionAndFeeTracking.tsx

import React, { useState } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
}

interface Props {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
}

const TuitionAndFeeTracking: React.FC<Props> = ({ transactions, onAddTransaction }) => {
  const [newTransaction, setNewTransaction] = useState<Transaction>({ id: '', description: '', amount: 0 });

  const handleAddTransaction = () => {
    onAddTransaction(newTransaction);
    setNewTransaction({ id: '', description: '', amount: 0 });
  };

  return (
    <div>
      <h2>Tuition and Fee Tracking</h2>
      <div>
        <h3>Transactions</h3>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>{`${transaction.description} - ${transaction.amount}`}</li>
          ))}
        </ul>
        <label>
          Description:
          <input
            type="text"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: +e.target.value })}
          />
        </label>
        <button onClick={handleAddTransaction}>Add Transaction</button>
      </div>
    </div>
  );
};

export default TuitionAndFeeTracking;
