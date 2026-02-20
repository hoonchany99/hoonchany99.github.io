import { useState } from 'react';

const navLinks = [
  { label: '홈', href: '/' },
  { label: '블로그', href: '/posts/' },
  { label: '소개', href: '/about/' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="block hover:opacity-90 transition-opacity">
            <img src="/img/logo_no_background.png" alt="윤원장의 치과사전" className="h-12 w-auto md:hidden" />
            <img src="/img/logo_no_background_horizontal.png" alt="윤원장의 치과사전" className="h-14 w-auto hidden md:block" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex space-x-8">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-gray-600 hover:text-brand font-medium transition-colors">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-brand hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="메뉴 열기"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {open && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-gray-600 hover:text-brand transition-colors" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
