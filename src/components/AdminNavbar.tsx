
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Building2, Megaphone, UserRoundCog, CreditCard, Shield, Folder, FileText } from 'lucide-react';
import Logo from './Logo';
import MobileBackButton from './MobileBackButton';
import AdminUserMenu from './AdminUserMenu';
import NotificationsMenu from './NotificationsMenu';
import '../styles/admin-dashboard.css';
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  active: boolean;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, children, active, icon }) => {
  return (
    <Link
      to={to}
      className={`nav-item ${active ? 'active' : ''}`}
    >
      {icon}
      {children}
    </Link>
  );
};

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;


  return (
    <header className="admin-navbar sticky top-0 z-40 md:static md:top-auto md:z-auto">
      <div className="flex items-center">
        <MobileBackButton fallbackPath="/admin/dashboard" />
        <Logo />
        <div className="admin-panel-badge">
          <Shield size={14} />
          Yönetici Paneli
        </div>
      </div>

      <nav className="nav-items md-flex">
        <NavItem
          to="/admin/dashboard"
          active={currentPath === '/admin/dashboard' || currentPath === '/admin'}
          icon={<BarChart3 size={16} />}
        >
          Kontrol Paneli
        </NavItem>

        <NavItem
          to="/admin/influencers"
          active={currentPath === '/admin/influencers'}
          icon={<Users size={16} />}
        >
          Influencer'lar
        </NavItem>
        <NavItem
          to="/admin/brands"
          active={currentPath === '/admin/brands'}
          icon={<Building2 size={16} />}
        >
          Markalar
        </NavItem>
        <NavItem
          to="/admin/campaigns"
          active={currentPath.includes('/admin/campaigns')}
          icon={<Megaphone size={16} />}
        >
          Kampanyalar
        </NavItem>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
        ${currentPath.includes('/admin/post') || currentPath.includes('/admin/category')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
            >
              <FileText size={16} />
              <span>Blog</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="w-56 rounded-xl border bg-white p-2 shadow-lg"
          >
            <DropdownMenuItem asChild>
              <NavLink
                to="/admin/category"
                className={
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm
                  ${currentPath.includes('/admin/category') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                <Folder size={16} className="text-gray-500" />
                Yazı Kategorisi
              </NavLink>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <NavLink
                to="/admin/post"
                className={
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm
                      ${currentPath.includes('/admin/post') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                <FileText size={16} className="text-gray-500" />
                Yazı
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>



        <NavItem
          to="/admin/not-approved"
          active={currentPath.includes('/admin/not-approved')}
          icon={<UserRoundCog size={16} />}
        >
          Onay Bekleyenler
        </NavItem>
      </nav>

      <div className="flex items-center gap-3">
        {/* <BildirimlerMenu /> */}
        <AdminUserMenu onOpenWhatsNew={() => { }} userType="admin" />
      </div>
    </header >
  );
};

export default AdminNavbar;
