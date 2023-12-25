import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import './Auth.css'; 

// Login 함수 컴포넌트
// onLoginSuccess라는 콜백 함수를 prop으로 받음
function Login({ onLoginSuccess }) {
  const [id, setId] = useState(''); // id 상태와 그 상태를 설정하는 함수를 선언
  const [password, setPassword] = useState(''); // password 상태와 그 상태를 설정하는 함수를 선언

  const navigate = useNavigate(); 


  const handleSubmit = async (e) => {
    e.preventDefault(); //페이지 새로고침을 막음
    try {
      const response = await axios.post('http://3.34.48.56:5000/login', { id, password });
      console.log(response.data);

      // 로컬 스토리지에 사용자 이름을 저장
      localStorage.setItem('username', response.data.username);

      // 로그인 성공 시 콜백 함수를 실행
      onLoginSuccess(true);
    } catch (error) { 
      if (error.response) {
        alert(error.response.data);
      } else if (error.request) {
        alert("서버에서 응답이 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };


  return (
    <div className="login-container">
      <div className="login-form">
      <h2>AI온라인회의기록서비스</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              name="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </label>
          <button className="login-button" type="submit">로그인</button>
        </form>
        <button className="register-button" onClick={() => navigate('/register')}>회원가입</button>
        
      </div>
      <button onClick={() => onLoginSuccess(true) }>현제는 서버기한 끝으로 로그인 불가. 클릭시 다음페이지로 이동</button>
    </div>
  );
}

export default Login; 
