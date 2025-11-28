import { useReducer } from "react";

function historyReducer(state, action) {
  switch (action.type) {
    case "ADD_ENTRY": {
      const incomming = {
        pinned: false,
        createdAt: action.payload.createdAt || new Date().toISOString(),
        ...action.payload,
      };
      const existing = state.history.filter((h) => h.id !== incomming.id);
      const next = [incomming, ...existing].slice(0, 10);
      return { ...state, history: next };
    }
    case "DELETE_ENTRY":
      return { ...state, history: state.history.filter((h) => h.id !== action.id) };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
  }
}
export default function useClosetHistory() {
  const [state, dispatch] = useReducer(historyReducer, undefined, inittHistory);
}
