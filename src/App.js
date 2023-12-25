import React, { useState } from 'react'; 
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Mainn from './component/main'; 
import Login from './component/Login'; 
import Register from './component/Register'; 

// App 함수 컴포넌트
function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  // 로그아웃 성공 핸들러
  const handleLogoutSuccess = () => {
    setLoggedIn(false); // 로그인 상태를 false로 설정
  };


  return (
    <Router>
      <Routes>
        {loggedIn ? (
          // 로그인이 된 상태이면 Mainn 컴포넌트를 렌더링
          <Route 
            path="/" 
            element={<Mainn onLogoutSuccess={handleLogoutSuccess} />} 
          />
        ) : (
          // 로그인이 안 된 상태이면 Login 컴포넌트를 렌더링
          <Route 
            path="/" 
            element={<Login onLoginSuccess={() => setLoggedIn(true)} />} 
          />
        )}
        
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App; 
