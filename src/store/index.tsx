import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, DailySummary, MonthlyStats } from '../types';
import { getRecords, addRecord, deleteRecord, getDailySummary, getMonthlyStats, getRecordsByDate, generateId } from '../services/storage';
import { format } from 'date-fns';

interface AppState {
  records: Transaction[];
  selectedDate: Date;
  dailySummary: DailySummary;
  monthlyStats: MonthlyStats;
  recentRecords: Transaction[];
}

type Action =
  | { type: 'SET_RECORDS'; payload: Transaction[] }
  | { type: 'ADD_RECORD'; payload: Transaction }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'UPDATE_SUMMARIES' };

const initialState: AppState = {
  records: [],
  selectedDate: new Date(),
  dailySummary: {
    date: format(new Date(), 'yyyy-MM-dd'),
    totalIntake: 0,
    totalBurn: 0,
    netCalories: 0,
    recordCount: 0,
  },
  monthlyStats: {
    month: format(new Date(), 'yyyy-MM'),
    totalIntake: 0,
    totalBurn: 0,
    avgNetCalories: 0,
    dailyTrend: [],
  },
  recentRecords: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addNewRecord: (record: Omit<Transaction, 'id'>) => void;
  removeRecord: (id: string) => void;
  selectDate: (date: Date) => void;
} | null>(null);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_RECORDS':
      return { ...state, records: action.payload };
    case 'ADD_RECORD':
      return { ...state, records: [...state.records, action.payload] };
    case 'DELETE_RECORD':
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'UPDATE_SUMMARIES': {
      const dailySummary = getDailySummary(state.selectedDate);
      const monthlyStats = getMonthlyStats(state.selectedDate);
      const recentRecords = getRecordsByDate(state.selectedDate).slice(-10).reverse();
      return { ...state, dailySummary, monthlyStats, recentRecords };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const records = getRecords();
    dispatch({ type: 'SET_RECORDS', payload: records });
    dispatch({ type: 'UPDATE_SUMMARIES' });
  }, []);

  useEffect(() => {
    dispatch({ type: 'UPDATE_SUMMARIES' });
  }, [state.records, state.selectedDate]);

  const addNewRecord = (record: Omit<Transaction, 'id'>) => {
    const newRecord: Transaction = {
      ...record,
      id: generateId(),
    };
    addRecord(newRecord);
    dispatch({ type: 'ADD_RECORD', payload: newRecord });
  };

  const removeRecord = (id: string) => {
    deleteRecord(id);
    dispatch({ type: 'DELETE_RECORD', payload: id });
  };

  const selectDate = (date: Date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addNewRecord, removeRecord, selectDate }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}