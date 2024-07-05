import { useState } from "react";
import "./App.css";
import Auth from "./pages/auth/Auth";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return <Auth />;
}

export default App;
