import React from 'react';

function Section(props) {
  const {sectionKeys}=props
  return (
    <div className='bg-black h-full w-full p-6 rounded-l-lg flex flex-col gap-4'>
      {sectionKeys.map((sectionName) => (
        <h1 key={sectionName} className='w-full' onClick={() => { props.setActiveKey(sectionName) }}>
          <strong className={`text-white w-full p-2 ${props.activeKey === sectionName ? "bg-[#5535df]" : ""}`}>{sectionName}</strong>
        </h1>
      ))}
    </div>
  );
}

export default Section;
