"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardLayout = ({ children }) => {
  const [count, setCount] = React.useState(0);
  const pathName = usePathname();
  const linkData = [
    { href: "/dashboard/about", label: "About" },
    { href: "/dashboard/settings", label: "Settings" },
  ];
  return (
    <div className="border-2 border-dashed border-black p-4 w-1/2 mx-auto mt-10">
      <div className="flex gap-4 font-bold text-lg mb-4">
        {linkData.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathName === link.href ? "text-blue-500 hover:underline" : ""
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
      <h2>Dashboard Layout {count}</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      {children}
    </div>
  );
};

export default DashboardLayout;
