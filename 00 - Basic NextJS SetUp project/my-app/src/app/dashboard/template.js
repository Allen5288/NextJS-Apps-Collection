"use client";
import React from "react";

const DashboardTemplate = ({ children }) => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="border-2 border-dashed border-black p-4 w-1/2 mx-auto mt-10">
      <h2>DashboardTemplate {count}</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setCount(count + 1)}>
          Increment
        </button>
      {children}
    </div>
  );
};

export default DashboardTemplate;
