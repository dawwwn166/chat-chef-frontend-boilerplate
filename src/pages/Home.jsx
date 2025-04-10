import React from "react";
import Button from "../components/Button";

const Home = () => {
  // logic

  const handleStart = async() => {
    console.log("info페이지로 이동");
    /*try {
     //api 요청
        //openai api 연결 여부 확인 코드 추가
    // fetch 안에 backend url을 넣어주면 됨
     const response = await fetch("http://localhost:8080/test");
     const result = await response.json();    // 자바스크립트가 읽을 수 있는 형태인 json으로 변환
      console.log(result); 

    } catch (error) {
      console.error("Error fetching data:", error);
      // 예외 처리 코드 추가
      // 프론트엔드 서버가 죽지 않도록 처리
      // 예를 들어, 사용자에게 오류 메시지를 표시하거나 대체 동작을 수행할 수 있습니다.
    } //예외 처리 해주는 코드 이걸 안하면 프론트 엔드 서버가 죽어버림
 
    
    */

    // message api

    try {
      const response = await fetch("http://localhost:8080/message", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userMessage: "안녕하세요",
        }),
      });

      const result = response
      console.log(result); // 서버에서 받은 응답

    } catch (error) {
    }


  };

  // view
  return (
    <div className="w-full h-full px-6 pt-10 break-keep overflow-auto">
      <i className="w-168 h-168 rounded-full bg-chef-green-500 fixed -z-10 -left-60 -top-96"></i>
      <div className="fixed left-0 top-1/2 transform -translate-y-1/3 -z-10">
        <img src="./images/hero.svg" alt="hero" />
      </div>
      <div className="h-full flex flex-col">
        {/* TODO:Title 컴포넌트 */}
        <div className="px-2 pt-6">
          <h1 className="text-4.5xl font-black text-white">맛있는 쉐프</h1>
          <span className="block text-sm mt-3 text-white break-keep pr-9">
            냉장고에 있는 재료로 뭐 해먹을지 고민되시나요? 남은 재료만 넣으면
            맛있는 레시피가 나옵니다!
          </span>
        </div>
        {/* // TODO:Title 컴포넌트 */}
        {/* START:Button 영역 */}
        <Button
          text="Get started"
          color="bg-chef-green-500"
          onClick={handleStart}
        />
        {/* END:Button 영역 */}
      </div>
    </div>
  );
};

export default Home;
