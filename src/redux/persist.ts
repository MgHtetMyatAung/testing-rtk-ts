import storage from "redux-persist/lib/storage";

const persistSlices = ["auth"];

export const persistConfig = {
  key: "root", // Key for the persisted state
  devTools: true, // Enable dev tools only in non-production environment
  storage: storage, // Storage engine for persisting the state (redux-persist uses 'localStorage' by default)
  whitelist: persistSlices, // List of reducers to be persisted
};
