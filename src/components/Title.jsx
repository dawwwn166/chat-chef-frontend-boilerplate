import React from 'react';

const Title = ({ mainTitle, subTitle }) => {
  // Props를 직접 사용하도록 수정
  return (
    <div className="px-2 pt-6">
      <h1 className="text-4.5xl font-black text-white">{mainTitle}</h1>
      {subTitle && ( // subTitle이 있을 경우에만 span 렌더링
        <span className="block text-sm mt-3 text-white break-keep pr-9">
          {subTitle}
        </span>
      )}
    </div>
  );
};

export default Title;