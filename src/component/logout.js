import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Logout({ onLogoutSuccess }) {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    console.log(typeof onLogoutSuccess); 
    const username = localStorage.getItem('username'); // 로컬 스토리지에서 username 값을 가져옴

    if (!username) {
      alert('로그인 상태가 아닙니다.');
      return; 
    }

    try {
      const response = await axios.get('http://3.34.48.56:5000/logout'); 
      if (response.status === 200) { 
        alert(response.data); 
        localStorage.removeItem('username'); // 로컬 스토리지에서 username 항목을 삭제
        onLogoutSuccess(); // 부모 컴포넌트로 로그아웃 성공
        navigate('/'); // 로그아웃 후 메인 페이지로 이동
      } else { 
        alert('로그아웃 중 오류가 발생하였습니다.'); 
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  return (
    <button className="button2" onClick={handleLogout}>로그아웃</button> 
  );
}

export default Logout; 
