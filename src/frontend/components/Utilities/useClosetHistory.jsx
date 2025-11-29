import { useEffect, useReducer } from "react";

const HISTORY_STORAGE_KEY = "closet-history";

const initHistory = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
    return { history: Array.isArray(parsed) ? parsed : [] };
  } catch (e) {
    console.log(e);
    return { history: [] };
  }
};

function historyReducer(state, action) {
  switch (action.type) {
    case "ADD_ENTRY": {
      const incoming = {
        pinned: false,
        createdAt: action.payload.createdAt || new Date().toISOString(),
        ...action.payload,
      };
      const existing = state.history.filter((h) => h.id !== incoming.id);
      const next = [incoming, ...existing].slice(0, 10);
      return { ...state, history: next };
    }
    case "DELETE_ENTRY":
      return { ...state, history: state.history.filter((h) => h.id !== action.id) };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    default:
      return state;
  }
}
export default function useClosetHistory() {
  const [state, dispatch] = useReducer(historyReducer, undefined, initHistory);
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(state.history));
  }, [state.history]);

  return {
    history: state.history,
    addEntry: (payload) => dispatch({ type: "ADD_ENTRY", payload }),
    deleteEntry: (id) => dispatch({ type: "DELETE_ENTRY", id }),
    clearHistory: () => dispatch({ type: "CLEAR_HISTORY" }),
  };
}
