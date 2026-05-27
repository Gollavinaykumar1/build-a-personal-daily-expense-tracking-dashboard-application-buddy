# LLM Output

=== FILE: src/App.jsx ===
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import { FiPlus } from 'react-icons/fi';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/expenses`);
        setExpenses(response.data);
        setFilteredExpenses(response.data);
        calculateTotalSpent(response.data);
      } catch (error) {
        toast.error('Error fetching expenses');
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        toast.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const calculateTotalSpent = (expenses) => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalSpent(total);
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter((expense) => expense.category === category));
    }
  };

  const handleAddExpense = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/expenses`, data);
      setExpenses([...expenses, response.data]);
      setFilteredExpenses([...filteredExpenses, response.data]);
      calculateTotalSpent([...expenses, response.data]);
      reset();
    } catch (error) {
      toast.error('Error adding expense');
    }
  };

  return (
    <HashRouter>
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-4">Daily Expense Tracker</h1>
        <div className="flex justify-between mb-4">
          <Link to="/" className="text-lg font-bold">All</Link>
          {categories.map((category) => (
            <Link
              key={category}
              to="#"
              className={clsx('text-lg font-bold mx-2', {
                'text-blue-500': selectedCategory === category,
              })}
              onClick={() => handleFilter(category)}
            >
              {category}
            </Link>
          ))}
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Total Spent: ₹{totalSpent}</h2>
          <div className="flex justify-between">
            {categories.map((category) => (
              <div key={category} className="text-lg font-bold mx-2">
                {category}: ₹{filteredExpenses.reduce((acc, expense) => expense.category === category ? acc + expense.amount : acc, 0)}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit(handleAddExpense)} className="mb-4">
          <div className="flex flex-col mb-2">
            <label htmlFor="description" className="text-lg font-bold mb-1">Description</label>
            <input
              type="text"
              id="description"
              {...register('description')}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="amount" className="text-lg font-bold mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              {...register('amount')}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="category" className="text-lg font-bold mb-1">Category</label>
            <select
              id="category"
              {...register('category')}
              className="p-2 border border-gray-300 rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="date" className="text-lg font-bold mb-1">Date</label>
            <input
              type="date"
              id="date"
              {...register('date')}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            <FiPlus className="mr-2" /> Add Expense
          </button>
        </form>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="text-lg font-bold">Category</th>
              <th className="text-lg font-bold">Amount</th>
              <th className="text-lg font-bold">Date</th>
              <th className="text-lg font-bold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>₹{expense.amount}</td>
                <td>{format(new Date(expense.date), 'dd MMM yyyy')}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HashRouter>
  );
};

export default App;
=== END ===

=== FILE: src/main.jsx ===
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
=== END ===

=== FILE: src/index.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-100;
}

table {
  @apply border-collapse border border-gray-300;
}

th, td {
  @apply border border-gray-300 p-2;
}

th {
  @apply bg-gray-200;
}
=== END ===

=== FILE: src/api.js ===
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addExpense = async (data) => {
  try {
    const response = await api.post('/expenses', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
=== END ===