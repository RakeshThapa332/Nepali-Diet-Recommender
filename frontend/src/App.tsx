import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GenerateDiet from "./pages/GenerateDiet";
import MealPlan from "./pages/MealPlan";
import FoodExplorer from "./pages/FoodExplorer";
import FoodDetails from "./pages/FoodDetails";
import Logs from "./pages/Logs";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Rourtes */}
        <Route element = {<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/generate" element={<GenerateDiet/>} />
          <Route path="/meal-plan" element={<MealPlan/>} />
          <Route path="/foods" element={
            <DashboardLayout>
              <FoodExplorer/>
            </DashboardLayout>
          }/>
          <Route path="/foods/:id" element={<FoodDetails/>} />
          <Route path="/logs" element={<Logs/>} />
          <Route path="/progress" element={<Progress/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/settings" element={<Settings/>} />
        </Route>
        {/* Unknown route */}
        <Route
          path = "*"
          element={
            <Navigate to = "/dashboard" replace /> 
          }
            />
      </Routes>
    </BrowserRouter>
  );
}

export default App;