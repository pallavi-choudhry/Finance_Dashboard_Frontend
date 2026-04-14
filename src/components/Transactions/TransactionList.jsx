import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import toast from 'react-hot-toast';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions(filters);
      setTransactions(response || []);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (transactionData) => {
    try {
      await transactionService.createTransaction(transactionData);
      toast.success('Transaction created successfully');
      fetchTransactions();
      setShowForm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create transaction');
    }
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await transactionService.updateTransaction(id, transactionData);
      toast.success('Transaction updated successfully');
      fetchTransactions();
      setEditingTransaction(null);
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Salary', 'Freelance', 'Shopping', 'Healthcare', 'Other'];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your income and expense records
          </p>
          <p className="mt-1 text-xs text-indigo-600">
            Role: {user?.role} {user?.role === 'viewer' ? '(can add only)' : '(can add/edit transactions)'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      <TransactionFilters filters={filters} setFilters={setFilters} categories={categories} />

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <TransactionForm onSubmit={handleCreateTransaction} categories={categories} />
        </div>
      )}

      {editingTransaction && user.role !== 'viewer' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Transaction</h3>
          <TransactionForm
            onSubmit={(data) => handleUpdateTransaction(editingTransaction._id, data)}
            initialData={editingTransaction}
            categories={categories}
          />
          <button
            onClick={() => setEditingTransaction(null)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel Edit
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                {user.role !== 'viewer' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    {user.role !== 'viewer' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingTransaction(transaction)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;