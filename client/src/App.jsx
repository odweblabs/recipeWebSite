import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Menus from './pages/Menus';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import RecipeForm from './pages/admin/RecipeForm';
import CategoryList from './pages/admin/CategoryList';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Calories from './pages/Calories';
import Trend from './pages/Trend';
import WhatToCook from './pages/WhatToCook';
import Lists from './pages/Lists';
import PlaceholderPage from './pages/placeholders/PlaceholderPage';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import MobileTabBar from './components/MobileTabBar';
import ScrollToTop from './components/ScrollToTop';
import Heartbeat from './components/Heartbeat';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Heartbeat />
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/categories" element={<PlaceholderPage />} />

          {/* New Menu Routes */}
          <Route path="/menus" element={<Menus />} />
          <Route path="/trend" element={<Trend />} />
          <Route path="/what-to-cook" element={<WhatToCook />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/calories" element={<Calories />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/favorites" element={<PlaceholderPage />} />
          <Route path="/courses" element={<PlaceholderPage />} />
          <Route path="/community" element={<PlaceholderPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/recipes/new" element={
          <ProtectedRoute>
            <RecipeForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/recipes/edit/:id" element={
          <ProtectedRoute>
            <RecipeForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute>
            <CategoryList />
          </ProtectedRoute>
        } />
      </Routes>
      <MobileTabBar />
    </Router>
  );
}

export default App;
