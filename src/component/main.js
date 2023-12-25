import React, { useState, useEffect, } from 'react';
import '../App.css'
import axios from 'axios';
import ClovaSpeechClient from './ClovaSpeechClient';
import Logout from './logout';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; // 플레이어 스타일

export default function Mainn({ onLogoutSuccess }) {


  const [audioFile, setAudioFile] = useState(null); // 음성 파일과 관련된 상태와 상태를 업데이트하는 함수를 정의
  const [transcript, setTranscript] = useState(''); // 텍스트 변환 결과와 관련된 상태와 상태를 업데이트하는 함수를 정의
  const [transcript2, setTranscript2] = useState('');//화자인식 
  const [summary, setSummary] = useState(''); // 요약 결과와 관련된 상태와 상태를 업데이트하는 함수를 정의
  const [result, setResult] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(''); // 선택된 언어
  const [translationResult, setTranslationResult] = useState(''); // 번역 결과 표시
  const [audioSrc, setAudioSrc] = useState(null); // 오디오 파일 URL을 관리하는 상태 추가
  const [summaryCount, setSummaryCount] = useState(3); //요약 몇줄인지
  const username = localStorage.getItem('username');
  const [fileName, setFileName] = useState(''); // 파일 이름을 저장하는 변수
  const [uploadTime, setUploadTime] = useState(null); // 업로드 시간을 저장하는 변수


  

  const handleTranslation = async () => {//papago 번역기능
    const clientId = 'e9kqgfcros'; // 네이버 클라우드 API 인증 정보
    const clientSecret = 'wFgsAwla7sDWXS8GJkY5ALuwt0Rsk8zVCr8cpNAD'; // 네이버 클라우드 API 인증 정보

    try {
      const response = await axios.post(
        'nmt/v1/translation',
        {
          source: 'ko',
          target: selectedLanguage,
          text: transcript,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-NCP-APIGW-API-KEY-ID': clientId,
            'X-NCP-APIGW-API-KEY': clientSecret,
          },
        }
      );

      const translatedText = response.data.message.result.translatedText;
      setTranslationResult(translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };


// 언어 변경 핸들러
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setTranslationResult(''); // 언어 선택 변경 시 번역 결과 초기화
  };
// 번역 확인 버튼 핸들러
  const handleConfirm = () => {
    if (selectedLanguage) {
      handleTranslation();
    }
  };




// 화자 변환 버튼 핸들러
  const handleFileUpload = async (event) => { // 화자인식
    const client = new ClovaSpeechClient();
    const res = await client.req_upload(audioFile, 'sync');
    if (res) {
      const segments = res.data.segments;
      const text = segments.map((segment) => `${segment.speaker.name}: ${segment.text}`).join('\n');
      setTranscript2(text);
    }
  }



// 감정 분석 함수
  const onSubmit = async (e) => {//감정분석
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/sentiment-analysis/v1/analyze",
        { content: transcript },
        {
          headers: {
            "X-NCP-APIGW-API-KEY-ID": "vn0z38f5og",
            "X-NCP-APIGW-API-KEY": "YFZ3anoXv5PJ2pQXpERRp3zBH77IwLzBl5oYoqzX",
            "Content-Type": "application/json",
          },
        }
      );
      setResult(
        <div>
          <div>전체 감정: {data.document.sentiment}</div>
          <div>긍정: {data.document.confidence.positive.toFixed(2)}</div>
          <div>부정: {data.document.confidence.negative.toFixed(2)}</div>
          <div>중립: {data.document.confidence.neutral.toFixed(2)}</div>
        </div>
      );
    } catch (error) {
      console.error(error);
      setResult("Error");
    }
  };


  

  const handleTranscript = async () => { // 텍스트 변환 버튼 클릭 시 호출되는 함수

    const fileReader = new FileReader(); // FileReader 객체 생성
    fileReader.readAsArrayBuffer(audioFile); // 선택된 파일을 ArrayBuffer로 읽어옴
    fileReader.onload = async () => { // 파일을 모두 읽어온 후 호출되는 함수
      
      try {
        const client = new ClovaSpeechClient();
        const res = await client.req_upload(audioFile, 'sync');
        if (res) {
          const segments = res.data.text;

          setTranscript(segments);

        }

      } catch (error) {
        console.error(error); // 에러가 발생하면 콘솔에 에러 메시지 출력
      }
    };

  
  };


  const handleSummary = async () => {//요약
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': 'vn0z38f5og',
        'X-NCP-APIGW-API-KEY': 'YFZ3anoXv5PJ2pQXpERRp3zBH77IwLzBl5oYoqzX',
      },
    };

    try {
      const response = await axios.post(
        '/text-summary/v1/summarize',
        {
          document: {
            content: transcript,
            title: 'Summary',
          },
          option: {
            language: "ko",
            model: "general",
            summaryCount: summaryCount, // summaryCount 상태를 사용하도록 수정
          },
        },
        config
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
    }
  };




  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);

    // 파일 이름 업데이트
    const selectedFile = event.target.files[0];
    setFileName(selectedFile.name);
    const currentTime = new Date();
    setUploadTime(currentTime);

    // 파일이 선택되면 URL을 생성하여 audioSrc 상태에 저장
    const audioURL = URL.createObjectURL(event.target.files[0]);
    setAudioSrc(audioURL);
  };



  useEffect(() => {
    // 컴포넌트가 unmount 될 때 URL을 해제
    return () => {
      URL.revokeObjectURL(audioSrc);
    };
  }, [audioSrc]);





  return (
    <div className="main">

      <div className="main2">
        <div className="content">
          <h2>{fileName && <p>선택된 파일: {fileName}</p>}</h2>
          {uploadTime && (
        <h3>파일 업로드 시간: {uploadTime.toLocaleString()}</h3>
      )}
          <h4>사용자 이름 : {username}</h4>
          <Logout onLogoutSuccess={onLogoutSuccess} />
        </div>
        <div className="main3">
          <div className="main4">

            <h1>음성기록</h1>
            <div className="App">
              <input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} />
              <button className="button" onClick={handleTranscript}>텍스트 변환버튼</button>
              <div className="scrollable-content">{transcript}</div>
            </div>
          </div>





          <div className='main4'>
            <h1>화자인식</h1>
            <button className="button" onClick={handleFileUpload} >화자변환버튼</button>
            <div >
              <div className="scrollable-content">{transcript2}</div>
            </div>
          </div>


          <div className='main5'>
            <h1>감정분석</h1>
            <div>
              <form onSubmit={onSubmit}>
                <button className="button" type="submit">감정분석버튼</button>
              </form>
              <div >
                <div className="scrollable-content">{result}</div>
              </div>
            </div>


          </div>
          <div className="main6">
            <h1>상황요약</h1>
            <input
              type="number"
              value={summaryCount}
              onChange={(e) => setSummaryCount(e.target.value)}
              className="inputWidth"
            /> {/* 요약할 항목 수 입력받는 인풋 추가 */}
            줄로 요약
            <button className="button" onClick={handleSummary}>요약버튼</button>
            <div>
              <div className="scrollable-content">{summary}</div>
            </div>
          </div>

        </div>

        <div className='papagomain'>
          <div className='papagomain2'>
            <div className="papago">
              <h1>파파고</h1>
              <select value={selectedLanguage} onChange={handleLanguageChange}>
              <option >선택하기</option>
                <option value="en">영어</option>
                <option value="ja">일본어</option>
                <option value="zh-CN">중국어(간체)</option>
                <option value="zh-TW">중국어(번체)</option>
                <option value="vi">베트남어</option>
                <option value="th">태국어</option>
                <option value="id">인도네시아어</option>
                <option value="fr">프랑스어</option>
                <option value="es">스페인어</option>
                <option value="ru">러시아어</option>
                <option value="de">독일어</option>
                <option value="it">이탈리아어</option>
              </select>
              <button  className="papagobutton" onClick={handleConfirm}>번역하기버튼</button>

            </div>
            <div className='papagomain3'>
              {translationResult && (
                <div className="scrollable-content2">
                  <h3>{selectedLanguage}</h3>
                  <p>{translationResult}</p>
                </div>
              )}
            </div>

          </div>
          <div>
            <AudioPlayer
              autoPlay
              src={audioSrc}
              onPlay={e => console.log("onPlay")}
            />
          </div>
        </div>



      </div>
    </div>
  );
}

