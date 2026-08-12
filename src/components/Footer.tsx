import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const shouldRenderFooter =
    normalizedPath === "/" || normalizedPath === "/brands" || normalizedPath === "/contact";
  const isHomePage = normalizedPath === "/";
  const footerLinkClass = isHomePage
    ? "text-white hover:text-white/80 hover:underline"
    : "hover:underline";
  const socialLinkClass = isHomePage
    ? "flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
    : "flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 transition-colors hover:bg-foreground/5";

  if (!shouldRenderFooter) {
    return null;
  }

  return (
    <footer className={`w-full px-6 py-12 md:px-12 ${isHomePage ? "text-white" : ""}`}>
      <div className="mx-auto max-w-7xl py-12">
        <div className="mb-12 grid grid-cols-1 gap-8 py-12 md:grid-cols-5">
          <div>
            <Logo light={isHomePage} />
            <div className="mt-5 flex space-x-3">
              <a
                href="https://www.instagram.com/erfluencer.turkiye/"
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61581630993825&locale=tr_TR"
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@erfluencer.turkiye"
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/erfleuncer-tr-0a8412373/"
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 hidden text-lg font-semibold sm:block">Şirket</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={footerLinkClass}>
                  Ana Sayfa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Destek</h3>
            <ul className="space-y-2">
              <li>İletişim@erfluencer.com</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Hakkımızda</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className={footerLinkClass}>
                  İletişim
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={footerLinkClass}>
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/terms" className={footerLinkClass}>
                  Hizmet Koşulları
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/brands" className={footerLinkClass}>
                  Markalar ve Ajanslar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`pt-6 text-center text-sm ${
            isHomePage ? "border-t border-white/15" : "border-t border-foreground/10"
          }`}
        >
          <p>Telif Hakkı © {currentYear} Erfluencer. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
