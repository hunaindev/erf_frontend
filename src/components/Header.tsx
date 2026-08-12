import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Building2, House, LayoutGrid, Users } from 'lucide-react';
import Logo from './Logo';
import MobileBackButton from './MobileBackButton';

const Header = ({ isInfluencer = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = JSON.parse(localStorage.getItem('user'));
  const isHomePage = currentPath === '/';

  const isLoggedIn = user;
  const dashboardPath = isLoggedIn?.role === 'influencer' ? '/influencer/dashboard' : '/dashboard';

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Markalar & Ajanslar', path: '/brands' },
    { name: 'İçerik Üreticileri', path: '/brands#Infulencer' },
    { name: 'Bloglar', path: '/blogs' },
    { name: 'SSS', path: '/brands#faq' },
    { name: 'Demo Talep Edin', path: '/demo' },
  ];

  const getLinkClass = (path) => {
    const isActive =
      path === '/'
        ? currentPath === '/' && isInfluencer
        : currentPath === path || (path === '/blogs' && (currentPath.includes('/blogs') || currentPath.includes('/case-studies')));

    if (isHomePage) {
      return `transition-colors duration-200 ${isActive ? 'text-white font-medium' : 'text-white/80 hover:text-white'}`;
    }

    return `transition-colors duration-200 ${isActive ? 'text-primary font-medium' : 'text-foreground/70 hover:text-primary'}`;
  };

  const mobileNavLinks = [
    {
      name: 'Ana Sayfa',
      path: '/',
      icon: House,
      active: currentPath === '/',
    },
    {
      name: 'Markalar',
      path: '/brands',
      icon: Building2,
      active: currentPath === '/brands',
    },
    {
      name: 'İçerik',
      path: '/brands#Infulencer',
      icon: Users,
      active: currentPath === '/brands',
    },
    {
      name: 'Bloglar',
      path: '/blogs',
      icon: BookOpen,
      active: currentPath.includes('/blogs') || currentPath.includes('/case-studies'),
    },
    {
      name: isLoggedIn ? 'Panel' : 'Başla',
      path: isLoggedIn ? dashboardPath : '/brand-signup',
      icon: LayoutGrid, 
      active: currentPath === dashboardPath || currentPath === '/brand-signup' || currentPath === '/influencer-signup' || currentPath === '/signin',
    },
  ];

  return (
    <>
      <header className={`w-full px-4 pt-3 pb-2 md:px-12 md:py-4 flex justify-between items-center z-10 relative max-lg:mt-10 lg:mt-0 ${isHomePage ? 'text-white' : ''}`}>
        <div className="flex items-center">
          <MobileBackButton fallbackPath={isLoggedIn ? dashboardPath : '/'} />
          <Logo light={isHomePage} />
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ name, path }) => (
            <Link key={path} to={path} className={getLinkClass(path)}>
              {name}
            </Link>
          ))}
        </nav>

        {isLoggedIn ? (
          <Link
            to={dashboardPath}
            className={`px-6 py-2 hidden md:inline-block rounded-full transition-colors duration-200 font-medium ${
              isHomePage
                ? 'bg-white text-[hsl(var(--primary-deep))] hover:bg-white/90'
                : isInfluencer
                  ? 'bg-white text-primary hover:bg-white/80'
                  : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            Kontrol Paneli
          </Link>
        ) : (
          <Link
            to="/brand-signup"
            className={`px-6 py-2 hidden md:inline-block rounded-full transition-colors duration-200 font-medium ${
              isHomePage
                ? 'bg-white text-[hsl(var(--primary-deep))] hover:bg-white/90'
                : isInfluencer
                  ? 'bg-white text-primary hover:bg-white/80'
                  : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            Ücretsiz Başla
          </Link>
        )}
      </header>

      {/* <nav className="fixed inset-x-0 bottom-3 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.2rem)] md:hidden">
        <div className="mx-auto flex w-full max-w-sm items-center gap-1 rounded-[1.75rem] border border-primary/12 bg-white/95 px-2 py-2 shadow-[0_24px_50px_-26px_rgba(77,28,91,0.35)] backdrop-blur-md">
          {mobileNavLinks.map(({ name, path, icon: Icon, active }) => (
            <Link   
              key={name}
              to={path}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-1 py-2 text-[11px] font-semibold transition-all duration-200 ${
                active
                  ? 'text-[hsl(var(--primary-deep))]'
                  : 'text-foreground/45 hover:text-[hsl(var(--primary-deep))]'
              }`}
            >
              <span
                className={`absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full transition-opacity duration-200 ${
                  active ? 'bg-primary opacity-100' : 'bg-transparent opacity-0'
                }`}
              />
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                  active ? 'bg-primary/12 shadow-[0_10px_18px_-14px_rgba(77,28,91,0.45)]' : ''
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className="truncate">{name}</span>
            </Link>
          ))}
        </div>
      </nav> */}
    </>
  );
};

export default Header;
