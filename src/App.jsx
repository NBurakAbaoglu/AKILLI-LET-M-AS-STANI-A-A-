import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Google Provider import edildi

// Sayfalar
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Mail from './pages/Mail';
import Profile from './pages/Profile';
import Settings from './pages/SettingsPage';
import Database from './pages/DatasetPage';
// ÖNEMLİ: Google Cloud Console'dan aldığın Client ID'yi buraya yapıştır
// Örnek: "1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
const GOOGLE_CLIENT_ID = "853910323193-odv9g7crdchod8onnufg5fkbt9f0oer3.apps.googleusercontent.com";

function App() {
  return (
    // Tüm uygulamayı Google OAuth Provider ile sarıyoruz
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/database" element={<Settings />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;