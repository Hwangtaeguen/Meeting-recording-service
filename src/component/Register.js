import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import './Auth.css'; 

// 회원 가입 함수 컴포넌트
function Register() {

  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); //페이지 새로고침을 막음

    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
    } else {
      try {
        const response = await axios.post('http://3.34.48.56:5000/register', { id, username, password, confirmPassword });
        console.log(response.data); 
        alert(response.data); 
        navigate('/'); // 회원가입 완료 후 로그인 페이지로 이동
      } catch (error) {
        if (error.response) {
          alert(error.response.data);
        } else if (error.request) {
          alert("서버에서 응답이 없습니다. 잠시 후 다시 시도해주세요."); 
        } else {
          alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요."); 
        }
      }
    }
  };




  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          
        <label>
          
          <input 
          type="text"
          name="id" 
          onChange={(e) => setId(e.target.value)} 
          placeholder="아이디를 입력하세요"/>
        </label>
        <label>
          
          <input 
          type="text" 
          name="username" 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="사용자 이름를 입력하세요"/>
        </label>
        <label>
          
          <input 
          type="password" 
          name="password" 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="비밀번호를 입력하세요"/>
        </label>
        <label>
          
          <input 
          type="password" 
          name="confirmPassword" 
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호 확인를 입력하세요" />
        </label>
          <button className="login-button" type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default Register; 
