import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { expenseActions } from '../store/expenseSlice';
import { themeActions } from '../store/themeSlice';

const FIREBASE_DB_URL = "https://react-form-24af0-default-rtdb.firebaseio.com/expenses";

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expense.expenses); 

  const { isPremium, isDarkTheme } = useSelector((state) => state.theme);

  const totalExpenses = expenses.reduce((total, item) => total + Number(item.amount), 0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${FIREBASE_DB_URL}.json`);
      if (!response.ok) throw new Error('Failed to fetch expenses.');
      
      const data = await response.json();
      const loadedExpenses = [];
      for (const key in data) {
        loadedExpenses.push({ id: key, amount: data[key].amount, description: data[key].description, category: data[key].category });
      }
      
      dispatch(expenseActions.setExpenses(loadedExpenses));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    setError(null);
    const expenseData = { amount, description, category };

    try {
      if (editId) {
        const response = await fetch(`${FIREBASE_DB_URL}/${editId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });
        if (!response.ok) throw new Error('Failed to update expense.');

        dispatch(expenseActions.updateExpense({ id: editId, ...expenseData }));
        setEditId(null);
      } else {
        const response = await fetch(`${FIREBASE_DB_URL}.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });
        if (!response.ok) throw new Error('Failed to add expense.');
        
        const data = await response.json();
        dispatch(expenseActions.addExpense({ id: data.name, ...expenseData }));
      }

      setAmount('');
      setDescription('');
      setCategory('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${FIREBASE_DB_URL}/${id}.json`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete expense.');
      
      console.log("Expense successfuly deleted");
      dispatch(expenseActions.removeExpense(id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (expense) => {
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditId(expense.id);
  };

  const downloadCSV = () => {
    const csvHeader = ["Category", "Description", "Amount"];
    const csvRows = expenses.map(exp => [exp.category, exp.description, exp.amount]);

    const csvContent = [csvHeader, ...csvRows]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formBgColor = isDarkTheme ? '#333' : '#fff';
  const itemBgColor = isDarkTheme ? '#444' : '#f9f9f9';
  const textColor = isDarkTheme ? '#fff' : '#000';

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
      
      {/* Activate Premium Button - Shows only when total > 10000 */}
      {totalExpenses > 10000 && (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3 style={{ color: '#856404', margin: '0 0 10px 0' }}>Total Expenses: ₹{totalExpenses}</h3>
          <button 
          onClick={() => dispatch(themeActions.activatePremium())}
          style={{ padding: '10px 20px', backgroundColor: '#ffc107', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Activate Premium
          </button>
        </div>
      )}    

   {/* 2. Show Premium Features (Theme Toggle & CSV) once activated */}
      {isPremium && (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: isDarkTheme ? '#555' : '#e2e3e5', borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button 
            onClick={() => dispatch(themeActions.toggleTheme())} 
            style={{ padding: '8px 15px', backgroundColor: '#343a40', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>   

          <button 
            onClick={downloadCSV} 
            style={{ padding: '8px 15px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬇️ Download Expenses (CSV)
          </button>
        </div>
     )}
     
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {editId ? 'Edit Expense' : 'Add Daily Expense'}
      </h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleAddOrUpdateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" required style={{ padding: '10px' }} />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required style={{ padding: '10px' }} />   
        <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ padding: '10px' }}>
          <option value="" disabled>Select Category</option>
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" style={{ padding: '12px', backgroundColor: editId ? '#ffc107' : '#28a745', color: editId ? 'black' : 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {editId ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      <div style={{ marginTop: '40px' }}>
        <h3>Your Expenses</h3>
        {isLoading && <p>Loading...</p>}
        {!isLoading && expenses.length === 0 ? <p>No expenses found.</p> : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {expenses.map((expense) => (
              <li key={expense.id} style={{ padding: '15px', border: '1px solid #eee', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{expense.category}</strong>
                  <div>{expense.description}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#dc3545', margin: '0 15px' }}>₹{expense.amount}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(expense)} style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteExpense(expense.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;