import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./reducer/userReducer";
import agentReducer from "./reducer/agentReducer";
import adminReducer from "./reducer/adminReducer";


const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  agent:agentReducer,
  admin:adminReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type reduxStore = typeof store;  
export type RootState = ReturnType<reduxStore["getState"]>;
export type AppDispatch = reduxStore["dispatch"];



