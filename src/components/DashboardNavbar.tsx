import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BriefcaseBusiness, House, MessageSquareMore, Plus, WalletCards } from 'lucide-react';
import Logo from './Logo';
import UserMenu from './UserMenu';
import NotificationsMenu from './NotificationsMenu';
import WhatsNewDialog from './WhatsNewDialog';
import AgencyUpgradeDialog from './AgencyUpgradeDialog';
import echo from "../pages/echo";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, children, active }) => {
  return (
    <Link
      to={to}
      className={`px-4 py-2 ${active ? 'text-primary font-medium' : 'text-foreground/70 hover:text-foreground'} transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

const DashboardNavbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [whatsNewDialogOpen, setWhatsNewDialogOpen] = useState(false);
  const [agencyUpgradeDialogOpen, setAgencyUpgradeDialogOpen] = useState(false);

  const [count, setCount] = useState([]);

  const { id } = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const channel = echo.private(`chat.${id}`)
      .listen('MessageSent', (e) => {

        setCount(prev => [...prev, e]);
      });

    return () => {
      channel.stopListening('MessageSent');
      echo.leave(`chat.${id}`);
    };
  }, [id]);

  const mobileNavItems = [
    {
      label: 'Ana Sayfa',
      to: '/dashboard',
      active: currentPath === '/dashboard',
      icon: House,
    },
    {
      label: 'Finans',
      to: '/financials',
      active: currentPath === '/financials',
      icon: WalletCards,
    },
    {
      label: 'Mesaj',
      to: '/messages',
      active: currentPath === '/messages',
      icon: MessageSquareMore,
      badge: count.length > 0 ? count.length : null,
    },
    {
      label: 'Kampanya',
      to: '/campaigns',
      active: currentPath === '/campaigns',
      icon: BriefcaseBusiness,
    },
  ];

  const isMobileProfileActive =
    currentPath === '/settings' ||
    currentPath === '/subscription' ||
    currentPath === '/how-to' ||
    currentPath === '/add-brands';

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-border bg-white/95 px-4 pb-3 pt-8 backdrop-blur-sm md:px-8 md:pb-4 md:pt-4">
        <div className="flex items-center ">
          <Link to="#" className="transition-colors duration-200 text-foreground hover:text-primary flex items-center">
            <div className=" text-2xl tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span className="inline-block font-bold text-4xl">E</span>
              <span className="inline-block font-bold text-4xl">R</span>
              <span className="inline-block">F</span>
              <span className="inline-block">L</span>
              <span className="inline-block">U</span>
              <span className="inline-block">E</span>
              <span className="inline-block">N</span>
              <span className="inline-block">C</span>
              <span className="inline-block">E</span>
              <span className="inline-block">R</span>
            </div>
          </Link>

          <button
            className="ml-2 px-2 py-2 rounded-full hover:bg-primary/10"
            onClick={() => setAgencyUpgradeDialogOpen(true)}
          >
            <Plus size={18} />
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <NavItem to="/dashboard" active={currentPath === '/dashboard'}>Ana Sayfa</NavItem>
          <NavItem to="/financials" active={currentPath === '/financials'}>Finansal</NavItem>
          <NavItem to="/messages" active={currentPath === '/messages'}>Mesajlar
            {count.length > 0 && (
              <>

                <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md min-w-[20px] text-center">

                  {count.length}
                </span>
              </>
            )}</NavItem>

          <NavItem to="/campaigns" active={currentPath === '/campaigns'}>Kampanyalar</NavItem>
          <NavItem to="/how-to" active={currentPath === '/how-to'}>Nasıl Yapılır</NavItem>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <NotificationsMenu />
          <div className="hidden md:block">
            <UserMenu onOpenWhatsNew={() => setWhatsNewDialogOpen(true)} />
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-3 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.2rem)] md:hidden">
        <div className="mx-auto flex w-full max-w-sm items-center gap-1 rounded-[1.75rem] border border-primary/12 bg-white/95 px-2 py-2 shadow-[0_24px_50px_-26px_rgba(77,28,91,0.35)] backdrop-blur-md">
          {mobileNavItems.map(({ label, to, active, icon: Icon, badge }) => (
            <Link
              key={to}
              to={to}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-1 py-2 text-[11px] font-semibold transition-all duration-200 active:scale-[0.96] ${
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
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                  active ? 'bg-primary/12 shadow-[0_10px_18px_-14px_rgba(77,28,91,0.45)]' : ''
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {badge ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {badge}
                  </span>
                ) : null}
              </span>
              <span className="truncate">{label}</span>
            </Link>
          ))}
          <div className="min-w-0 flex-1">
            <UserMenu
              onOpenWhatsNew={() => setWhatsNewDialogOpen(true)}
              mobileNav
              mobileActive={isMobileProfileActive}
            />
          </div>
        </div>
      </nav>

      <WhatsNewDialog open={whatsNewDialogOpen} onOpenChange={setWhatsNewDialogOpen} />
      <AgencyUpgradeDialog open={agencyUpgradeDialogOpen} onOpenChange={setAgencyUpgradeDialogOpen} />
    </>
  );
};

export default DashboardNavbar;
