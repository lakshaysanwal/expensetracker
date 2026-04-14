import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/expenses';

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.jwt;
    const response = await axios.get(API_URL, authHeader(token));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addExpense = createAsyncThunk('expenses/addExpense', async (expense, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.jwt;
    const response = await axios.post(API_URL, expense, authHeader(token));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.jwt;
    await axios.delete(`${API_URL}/${id}`, authHeader(token));
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateExpense = createAsyncThunk('expenses/updateExpense', async (expense, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.jwt;
    const response = await axios.put(`${API_URL}/${expense.id}`, expense, authHeader(token));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    search: '',
    category: 'All',
    sortBy: 'date-desc'
  }
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { setFilters } = expenseSlice.actions;
export default expenseSlice.reducer;
