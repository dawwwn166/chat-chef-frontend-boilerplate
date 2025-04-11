import React, { useState, useEffect, useRef } from "react"; // useEffect, useRef 추가
import { useLocation, useNavigate } from "react-router-dom"; // useLocation, useNavigate 추가
import MessageBox from "../components/MessageBox";
// Removed unused PrevButton import
import { MoonLoader } from "react-spinners";

const Chat = () => {
  // --- State ---
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]); // setMessages 추가
  // isInfoLoading 제거 -> 초기 메시지 유무로 로딩 판단
  const [isMessageLoading, setIsMessageLoading] = useState(false); // set 함수 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // --- Hooks ---
  const location = useLocation(); // 페이지 이동 시 전달받은 state 접근
  const navigate = useNavigate(); // 페이지 이동 함수
  const messagesEndRef = useRef(null); // 스크롤 맨 아래로 이동시키기 위한 ref

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://chat-chef-backend-410540418129.asia-northeast3.run.app'; // 백엔드 주소


  // --- Effects ---
  // 컴포넌트 마운트 시 Info 페이지에서 전달받은 초기 메시지 설정
  useEffect(() => {
    const initialData = location.state?.initialMessages;
    if (initialData && Array.isArray(initialData)) {
      setMessages(initialData);
    } else {
      // 초기 데이터가 없으면 에러 처리 또는 홈으로 리다이렉트
      console.error("초기 채팅 데이터가 없습니다.");
      setError("채팅을 시작할 수 없습니다. 재료를 다시 입력해주세요.");
      // navigate('/'); // 예시: 홈으로 돌려보내기
    }
  }, [location.state, navigate]); // 의존성 배열에 location.state와 navigate 추가

  // 메시지가 업데이트될 때마다 스크롤 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Functions ---
  const handleChange = (event) => { // 함수명 오타 수정 (hadleChange -> handleChange)
    setValue(event.target.value);
    if (error) setError(null); // 입력 시 에러 초기화
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessageContent = value.trim();
    if (!userMessageContent) return;
  
    const newUserMessage = { role: "user", content: userMessageContent };
    const updatedMessages = [...messages, newUserMessage];
  
    setMessages(updatedMessages);
    setValue("");
    setIsMessageLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages, // 👈 이전 메시지
          userMessage: newUserMessage, // 👈 새 사용자 메시지
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `메시지 전송 오류 (${response.status})`);
      }
  
      const result = await response.json();
      setMessages([...updatedMessages, result.data]);
  
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      setError(err.message || "메시지를 처리하는 중 오류가 발생했습니다.");
    } finally {
      setIsMessageLoading(false);
    }
  };

  // --- View ---
  // 초기 메시지 로딩 중 또는 에러 시 로딩/에러 화면 표시
   if (messages.length === 0 && !error) {
       return (
           <div className="w-full h-screen flex justify-center items-center">
               <MoonLoader color="#46A195" />
           </div>
       );
   }

    if (error && messages.length === 0) { // 초기 로딩 에러 시
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center px-6">
                 <p className="text-red-500 text-center mb-4">{error}</p>
                 <button
                   className="bg-gray-400 text-white px-4 py-2 rounded"
                   onClick={() => navigate('/info')}
                 >
                   돌아가기
                 </button>
            </div>
        )
    }


  return (
    // 전체 레이아웃 구조는 유지
    <div className="w-full h-screen px-6 pt-10 break-keep overflow-hidden flex flex-col"> {/* h-full -> h-screen 등 조정 */}
      {/* <PrevButton />  채팅 중 뒤로가기 버튼은 UX 고려하여 필요시 추가 */}
      <div className="h-full flex flex-col min-h-0"> {/* flex 구조 */}
        {/* START:헤더 영역 */}
        <div className="-mx-6 -mt-10 py-7 bg-chef-green-500 flex-shrink-0"> {/* 헤더 고정 */}
          <span className="block text-xl text-center text-white">
            맛있는 쉐프
          </span>
        </div>
        {/* END:헤더 영역 */}

        {/* START:채팅 영역 (스크롤 가능하게) */}
        <div className="flex-grow overflow-auto py-4"> {/* py-4 추가 */}
          <MessageBox messages={messages} isLoading={isMessageLoading} />
          {/* 스크롤 맨 아래로 이동시키기 위한 빈 div */}
          <div ref={messagesEndRef} />
        </div>
        {/* END:채팅 영역 */}

        {/* 에러 메시지 표시 (API 통신 중 에러) */}
         {error && <p className="text-red-500 text-center text-sm pb-2">{error}</p>}


        {/* START:메시지 입력 영역 (하단 고정) */}
        <div className="flex-shrink-0 py-3 -mx-2 border-t border-gray-100 flex items-center"> {/* flex, items-center 추가 */}
          <form
            id="sendForm"
            className="flex-grow px-2" // flex-grow 추가
            onSubmit={handleSubmit}
          >
            <input
              className="w-full text-sm px-4 py-3 h-full block rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-chef-green-500" // 스타일 수정
              type="text"
              name="message"
              value={value}
              onChange={handleChange}
              placeholder="메시지를 입력하세요..."
              disabled={isMessageLoading} // 메시지 전송 중 입력 비활성화
            />
          </form>
          <button
            type="submit"
            form="sendForm"
            className="w-10 h-10 min-w-10 rounded-full bg-chef-green-500 text-white flex items-center justify-center disabled:opacity-50" // 스타일 수정, 비활성화 스타일
            disabled={isMessageLoading || value.trim() === ""} // 로딩 중이거나 입력값 없으면 비활성화
          >
            {/* 아이콘 사용 권장 */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
        {/* END:메시지 입력 영역 */}
      </div>
    </div>
  );
};

export default Chat;