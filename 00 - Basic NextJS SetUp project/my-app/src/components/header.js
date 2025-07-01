"use client";

import Link from "next/link";
import PropTypes from "prop-types";

const linkData = [
  { name: "Performance", href: "/performance" },
  { name: "Reliability", href: "/reliability" },
  { name: "Scale", href: "/scale" },
];

const NavLink = ({ href, children }) => (
  <Link href={href} className="hover:underline">
    {children}
  </Link>
);

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-white">
          Home
        </Link>
        <div className="text-lg font-bold">My App</div>
        <ul className="flex space-x-4">
          {linkData.map((link) => (
            <li key={link.name}>
              <NavLink href={link.href}>{link.name}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
