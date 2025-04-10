import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrevButton from "../components/PrevButton";
import InfoInput from "../components/InfoInput"; // value, onChange props 처리 필요
import AddButton from "../components/AddButton";
import Button from "../components/Button";
import Title from "../components/Title"; // Title 컴포넌트 사용

const Info = () => {
  // --- State ---
  const [ingredientList, setIngredientList] = useState([
    { id: Date.now(), value: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Hooks ---
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // 백엔드 주소

  // --- Functions ---
  const addIngredient = () => {
    const newIngredient = { id: Date.now(), value: "" };
    setIngredientList([...ingredientList, newIngredient]);
  };

  const handleIngredientChange = (id, newValue) => {
    setIngredientList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
    if (error) setError(null);
  };

  const handleNext = async () => {
    const validIngredients = ingredientList.filter(item => item.value.trim() !== '');
    if (validIngredients.length === 0) {
      setError("재료를 하나 이상 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/recipe`, { // 백엔드 /recipe 호출
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientList: validIngredients }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `서버 오류 (${response.status})`);
      }

      const result = await response.json();
      navigate('/chat', { state: { initialMessages: result.data } }); // Chat 페이지로 데이터와 함께 이동

    } catch (err) {
      console.error("API 호출 실패:", err);
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- View ---
  return (
    <div className="w-full h-screen px-6 pt-10 break-keep overflow-hidden flex flex-col"> {/* h-full -> h-screen, flex 등 조정 */}
      <i className="w-168 h-168 rounded-full bg-chef-green-500 fixed -z-10 -left-60 -top-104"></i>
      <PrevButton />
      <div className="flex-grow flex flex-col min-h-0"> {/* flex 구조 */}
        <Title text="당신의 냉장고를 알려주세요" /> {/* Title 컴포넌트 사용 */}

        <div className="mt-12 md:mt-20 flex-grow overflow-auto pr-2"> {/* 스크롤 영역 */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3">
              {ingredientList.map((item, index) => (
                <InfoInput
                key={item.id}
                value={item.value}
                onChange={(e) => handleIngredientChange(item.id, e.target.value)}
                placeholder={`재료 ${index + 1}`}
                onRemove={() => {
                  // 필요시 재료 삭제 로직 구현
                }}
              />
              ))}
            </div>
          </form>
        </div>

        <div className="mt-4">
            <AddButton onClick={addIngredient} disabled={isLoading} />
        </div>

        {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

        <div className="flex-shrink-0 pt-4 pb-6"> {/* 하단 버튼 영역 */}
          <Button
            text={isLoading ? "레시피 찾는 중..." : "Next"}
            color="bg-chef-green-500"
            onClick={handleNext}
            disabled={isLoading || ingredientList.filter(i => i.value.trim()).length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Info;