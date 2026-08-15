import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<div>Landing Page</div>} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Rourtes */}
        <Route element = {<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/generate" element={<div>Generate Diet</div>} />
          <Route path="/meal-plan" element={<div>Meal Plan</div>} />
          <Route path="/foods" element={<div>Food Explorer</div>} />
          <Route path="/logs" element={<div>Logs</div>} />
          <Route path="/progress" element={<div>Progress</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;