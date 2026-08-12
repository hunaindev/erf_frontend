import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, House, LayoutGrid, MapPin, Menu, MessageSquareMore, PanelRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import UserMenu from './UserMenu';
import NotificationsMenu from './NotificationsMenu';
import WhatsNewDialog from './WhatsNewDialog';
import MobileBackButton from './MobileBackButton';
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

interface ForYouNavItemProps {
  active: boolean;
}

const ForYouNavItem: React.FC<ForYouNavItemProps> = ({ active }) => {
  return (
    <div className="relative group">
      <Link
        to="/influencer/for-you/all-campaigns"
        className={`px-4 py-2 ${active ? 'text-primary font-medium' : 'text-foreground/70 hover:text-foreground'} transition-colors duration-200`}
      >
        Kampanyalar
      </Link>
    </div>
  );
};

const InfluencerNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [whatsNewDialogOpen, setWhatsNewDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [count, setCount] = useState([]);
  const { id } = JSON.parse(localStorage.getItem('user'));
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const instagramBağlaned = Boolean(localStorage.getItem('instagram'));
  const tiktokBağlaned = Boolean(localStorage.getItem('tiktok'));

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
      to: '/influencer/dashboard',
      active: currentPath.includes('/influencer/dashboard'),
      icon: House,
    },
    {
      label: 'Sizin İçin',
      to: '/influencer/for-you/all-campaigns',
      active: currentPath.includes('/influencer/for-you'),
      icon: Compass,
    },
    {
      label: 'Mesaj',
      to: '/influencer/messages',
      active: currentPath === '/influencer/messages',
      icon: MessageSquareMore,
      badge: count.length > 0 ? count.length : null,
    },
  ];

  const isMobileProfileActive =
    currentPath === '/influencer/profile' ||
    currentPath === '/influencer/settings' ||
    currentPath === '/influencer/bank-account';
  const isDashboardRoute = currentPath.includes('/influencer/dashboard');
  const dashboardTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const dashboardMenuLinks = [
    { key: 'overview', label: 'Genel Bakis', to: '/influencer/dashboard?tab=overview', icon: LayoutGrid },
    { key: 'participated-campaigns', label: 'Katıldığım Kampanyalar', to: '/influencer/dashboard?tab=participated-campaigns', icon: PanelRight },
    ...(user?.instagram === 1 && instagramBağlaned
      ? [{ key: 'instagram-post', label: 'Instagram Gönderisi', to: '/influencer/dashboard?tab=instagram-post', icon: PanelRight }]
      : []),
    ...(user?.tiktok === 1 && tiktokBağlaned
      ? [{ key: 'tiktok-post', label: 'TikTok Gönderisi', to: '/influencer/dashboard?tab=tiktok-post', icon: PanelRight }]
      : []),
    { key: 'partnerships', label: 'Ortakliklar', to: '/influencer/dashboard?tab=partnerships', icon: MapPin },
  ];

  const handleMobilePageNavigate = (to: string) => {
    navigate(to);
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-3 border-b border-border bg-white/95 px-4 pb-3 pt-8 backdrop-blur-sm md:static md:top-auto md:z-auto md:px-8 md:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MobileBackButton fallbackPath="/influencer/dashboard" />
          <Link to="#" className="flex min-w-0 flex-1 items-center justify-center text-foreground transition-colors duration-200 hover:text-primary md:justify-start">
            <div className="flex w-full items-center justify-center gap-[0.2rem] text-2xl tracking-tight md:justify-start">
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
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <NavItem to="/influencer/dashboard" active={currentPath.includes('/influencer/dashboard')}>Ana Sayfa</NavItem>


          <ForYouNavItem active={currentPath.includes('/influencer/for-you')} />


          <NavItem to="/influencer/messages" active={currentPath === '/influencer/messages'}>
            <span>Mesajlar</span>
            {count.length > 0 && (
              <>

                <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md min-w-[20px] text-center">

                  {count.length}
                </span>
              </>
            )}
          </NavItem>

        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
          <NotificationsMenu />
          <div className="hidden md:block">
            <UserMenu onOpenWhatsNew={() => setWhatsNewDialogOpen(true)} userType="influencer" />
          </div>
        </div>
      </header >
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[84%] max-w-xs border-r-0 bg-[hsl(var(--primary-ink))] p-6 text-white md:hidden"
        >
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="text-lg font-semibold text-white">Menu</SheetTitle>
            </SheetHeader>

            <div className="mb-10">
              <div className="space-y-4">
                {dashboardMenuLinks.map(({ key, label, to, icon: Icon }) => {
                  const active = isDashboardRoute && dashboardTab === key;

                  return (
                    <button
                      key={to}
                      type="button"
                      onClick={() => handleMobilePageNavigate(to)}
                      className={`flex w-full items-center rounded-full p-2.5 transition-colors ${
                        active ? 'bg-white text-primary' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-medium text-white/55">Sosyal Medya Hesabı </h3>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-white">2</div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full rounded-full transition-colors hover:bg-white/10"
                  onClick={() => handleMobilePageNavigate('/influencer/dashboard?tab=instagram')}
                >
                  <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-2">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500">
                        <span className="text-sm font-semibold text-white">I</span>
                      </div>
                      <span className="font-medium text-white">Instagram</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${
                      user?.instagram === 1 && instagramBağlaned ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {user?.instagram === 1 && instagramBağlaned ? 'Bağlı' : 'Bağlan'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="w-full rounded-full transition-colors hover:bg-white/10"
                  onClick={() => handleMobilePageNavigate('/influencer/dashboard?tab=tiktok')}
                >
                  <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-2">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <span className="text-sm font-semibold text-white">T</span>
                      </div>
                      <span className="font-medium text-white">TikTok</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${
                      user?.tiktok === 1 && tiktokBağlaned ? 'bg-gray-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {user?.tiktok === 1 && tiktokBağlaned ? 'Bağlı' : 'Bağlan'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

      <nav className="fixed inset-x-0 bottom-3 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.2rem)] md:hidden">
        <div className="mx-auto flex w-full max-w-sm items-center gap-1 rounded-[1.75rem] border border-primary/12 bg-white/95 px-2 py-2 shadow-[0_24px_50px_-26px_rgba(77,28,91,0.35)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-1 py-2 text-[11px] font-semibold transition-all duration-200 active:scale-[0.96] ${
              isMobileMenuOpen
                ? 'text-[hsl(var(--primary-deep))]'
                : 'text-foreground/45 hover:text-[hsl(var(--primary-deep))]'
            }`}
          >
            <span
              className={`absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full transition-opacity duration-200 ${
                isMobileMenuOpen ? 'bg-primary opacity-100' : 'bg-transparent opacity-0'
              }`}
            />
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                isMobileMenuOpen ? 'bg-primary/12 shadow-[0_10px_18px_-14px_rgba(77,28,91,0.45)]' : ''
              }`}
            >
              <Menu size={18} strokeWidth={isMobileMenuOpen ? 2.4 : 2} />
            </span>
            <span className="truncate">Menu</span>
          </button>
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
              userType="influencer"
              mobileNav
              mobileActive={isMobileProfileActive}
            />
          </div>
        </div>
      </nav>

      <WhatsNewDialog open={whatsNewDialogOpen} onOpenChange={setWhatsNewDialogOpen} />
    </>
  );
};

export default InfluencerNavbar;
