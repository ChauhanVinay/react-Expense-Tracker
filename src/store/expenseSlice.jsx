import { createSlice } from "@reduxjs/toolkit";

const initialExpenseState = {
    expenses: [],
};
   
const expenseSlice = createSlice({
    name: "expense",
    initialState: initialExpenseState,
    reducers: {
        setExpenses(state, action) {
            state.expenses = action.payload;//For fetching from backend
        },
        addExpense(state, action) {
            state.expenses.push(action.payload);//For new expenses
        },
        removeExpense(state, action) {
            state.expenses = state.expenses.filter(expense => expense.id !== action.payload);//For deleting an expense
        },
        updateExpense(state, action) {
            const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) {
                state.expenses[index] = action.payload;//For updating an expense
            }
        }
    },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;