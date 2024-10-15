import { useState } from 'react';

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <header className="navbar">
        <div className="logo">
          <a href="/" onClick={closeMenu}>
            MyApp
          </a>
        </div>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          ☰
        </button>
        <nav className={`menu ${isMenuOpen ? 'show' : ''}`}>
          <a href="/" onClick={closeMenu}>
            Home
          </a>
          <a href="/about" onClick={closeMenu}>
            About
          </a>
          <a href="/contact" onClick={closeMenu}>
            Contact
          </a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
