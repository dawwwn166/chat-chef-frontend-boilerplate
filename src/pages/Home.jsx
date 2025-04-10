import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import Button from "../components/Button";
import Title from "../components/Title"; // Title 컴포넌트 import

const Home = () => {
  // logic
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStart = () => {
    // API 호출 제거하고 페이지 이동 로직만 남김
    console.log("info페이지로 이동");
    navigate('/info'); // /info 경로로 이동
  };

  // view
  return (
    <div className="w-full h-full px-6 pt-10 break-keep overflow-auto flex flex-col"> {/* flex 추가 */}
      <i className="w-168 h-168 rounded-full bg-chef-green-500 fixed -z-10 -left-60 -top-96"></i>

      {/* Title 컴포넌트 사용 */}
      <Title
        mainTitle="맛있는 쉐프"
        subTitle="냉장고에 있는 재료로 뭐 해먹을지 고민되시나요? 남은 재료만 넣으면 맛있는 레시피가 나옵니다!"
      />

      {/* 이미지 영역 */}
      <div className="flex-grow flex items-center justify-center relative -z-10"> {/* flex-grow 추가 및 중앙 정렬 */}
          <img src="./images/hero.svg" alt="hero" className="max-w-full max-h-full object-contain"/> {/* 이미지 크기 조정 */}
      </div>

      {/* START:Button 영역 (하단 고정 위해 mt-auto 제거하고 부모 flex 활용) */}
      <div className="pb-6 pt-4 flex-shrink-0"> {/* 패딩 조정 */}
          <Button
            text="Get started"
            color="bg-chef-green-500"
            onClick={handleStart}
          />
      </div>
      {/* END:Button 영역 */}
    </div>
  );
};

export default Home;