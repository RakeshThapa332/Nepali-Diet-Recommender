import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>} />

        <Route path="/login" element={<div>Login</div>} />

        <Route path="/register" element={<div>Register</div>} />

        <Route path="/dashboard" element={<div>Dashboard</div>} />

        <Route path="/generate" element={<div>Generate Diet</div>} />

        <Route path="/meal-plan" element={<div>Meal Plan</div>} />

        <Route path="/foods" element={<div>Food Explorer</div>} />

        <Route path="/logs" element={<div>Logs</div>} />

        <Route path="/progress" element={<div>Progress</div>} />

        <Route path="/profile" element={<div>Profile</div>} />

        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;