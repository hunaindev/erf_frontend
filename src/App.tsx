import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BrandSignUp from "./pages/BrandSignUp";
import InfluencerSignUp from "./pages/InfluencerSignUp";
import Dashboard from "./pages/Dashboard";
import Financials from "./pages/Financials";
import Messages from "./pages/Messages";
import Campaigns from "./pages/Campaigns";
import CampaignScheduling from "./pages/CampaignScheduling";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Blogs from "./pages/BlogPage";
import SingleBlog from "./pages/SingleBlogPage";
import SingleCaseStudy from "./pages/SingleCaseStudy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import InfluencerAgreement from "./pages/InfluencerAgreement";
import ShowInfluencer from "./pages/ShowInfluencer";
import Contact from "./pages/Contact";
import Brands from "./pages/Brands";
import AddBrands from "./pages/AddBrands";
import HowToUsePlatform from "./pages/HowToUsePlatform";
import InfluencerNotifications from "./pages/influencer/Notifications";
import CampaignDetails from "./pages/CampaignDetails";



import ProtectedBrand from "./pages/protected/ProtectedBrand";
import ProtectedInfluencer from "./pages/protected/ProtectedInfluencer";
import ProtectedAdmin from "./pages/protected/ProtectedAdmin";



// Influencer pages
import InfluencerDashboard from "./pages/influencer/Dashboard";
import InfluencerEarnings from "./pages/influencer/Earnings";
import InfluencerMessages from "./pages/influencer/Messages";
import InfluencerForYou from "./pages/influencer/ForYou";
import InfluencerBankAccount from "./pages/influencer/BankAccount";
import InfluencerSettings from "./pages/influencer/Settings";
import CampaignDetail from "./pages/influencer/CampaignDetail";
import InfluencerProfile from "./pages/influencer/Profile";
import TikTokAuth from "./pages/influencer/TikTokAuth";
import InstagramAuth from "./pages/influencer/InstagramAuth";
import InfluencerAlert from "./pages/influencer/influencerAlert";



// admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInfluencers from "./pages/admin/Influencers";
import NotApproved from "./pages/admin/NotApproved";
import AdminBrands from "./pages/admin/Brands";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminCampaignDetailsView from "./pages/admin/CampaignDetailsView";
import AdminCampaignDetail from "./pages/admin/CampaignDetails";
import AdminPayments from "./pages/admin/Payments";
import AdminSettings from "./pages/admin/Settings";
import AdminSignIn from "./pages/admin/SignIn";
import Category from "./pages/admin/Category";
import Post from "./pages/admin/Post";
import OAuthCallback from "./pages/OauthCallback";
import VerifyEmail from "./pages/VerifyEmail";
import Demo from "./pages/Demo";
import {
  initPushNotifications,
  syncStoredPushTokenToBackend,
} from "./services/pushNotifications";
import { getAppRouteFromUrl, isNativeApp } from "./utils/nativeOAuth";



const queryClient = new QueryClient();
const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
};

const NativeOAuthHandler = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isNativeApp()) {
      return;
    }

    const handleNavigation = async (incomingUrl: string) => {
      const appRoute = getAppRouteFromUrl(incomingUrl);
      if (!appRoute) {
        return;
      }

      await Browser.close().catch(() => undefined);

      const currentRoute = `${location.pathname}${location.search}`;
      if (currentRoute === appRoute) {
        return;
      }

      window.location.hash = `#${appRoute}`;
    };

    void CapacitorApp.getLaunchUrl().then((result) => {
      if (result?.url) {
        void handleNavigation(result.url);
      }
    });

    const listenerPromise = CapacitorApp.addListener("appUrlOpen", ({ url }) => {
      void handleNavigation(url);
    });

    return () => {
      void listenerPromise.then((listener) => listener.remove());
    };
  }, [location.pathname, location.search]);

  return null;
};

const App = () => {

  setInterval(() => {
  console.clear();
}, 800);

  useEffect(() => {
    void initPushNotifications();
    void syncStoredPushTokenToBackend();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router future={routerFuture}>
            <ScrollToTop />
            <NativeOAuthHandler />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/brand-signup" element={<BrandSignUp />} />
              <Route path="/influencer-signup" element={<InfluencerSignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/influencer-alert" element={<InfluencerAlert />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/demo" element={<Demo />} />

              {/* Blog */}
              <Route path="/blogs/:slug" element={<SingleBlog />} />
              <Route path="/blogs" element={<Blogs />} />



              {/* Public routes for legal pages */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/agreement" element={<InfluencerAgreement />} />

              {/* Landing pages */}
              <Route path="/brands" element={<Brands />} />

              {/* Brand Routes */}
              <Route path="/dashboard" element={<ProtectedBrand Component={Dashboard} />} />
              <Route path="/show-influencer/:ids" element={<ProtectedBrand Component={ShowInfluencer} />} />
              <Route path="/financials" element={<ProtectedBrand Component={Financials} />} />
              <Route path="/pricing" element={<ProtectedBrand Component={NotFound} />} />
              <Route path="/faq" element={<ProtectedBrand Component={NotFound} />} />
              <Route path="/blog" element={<ProtectedBrand Component={NotFound} />} />
              <Route path="/get-started" element={<ProtectedBrand Component={NotFound} />} />
              <Route path="/privacy-policy" element={<ProtectedBrand Component={PrivacyPolicy} />} />
              <Route path="/terms-of-service" element={<ProtectedBrand Component={TermsOfService} />} />
              <Route path="/influencer-agreement" element={<ProtectedBrand Component={InfluencerAgreement} />} />
              <Route path="/influencers" element={<NotFound />} />
              <Route path="/messages" element={<ProtectedBrand Component={Messages} />} />
              <Route path="/campaigns" element={<ProtectedBrand Component={Campaigns} />} />
              <Route path="/campaign-scheduling" element={<ProtectedBrand Component={CampaignScheduling} />} />
              {/* <Route path="/blogs" element={<Blogs />} /> */}
              {/* <Route path="/blogs/:id" element={<SingleBlog />} /> */}
              <Route path="/case-studies/:id" element={<SingleCaseStudy />} />
              <Route path="/settings" element={<ProtectedBrand Component={Settings} />} />
              <Route path="/subscription" element={<ProtectedBrand Component={Subscription} />} />
              <Route path="/notifications" element={<ProtectedBrand Component={Notifications} />} />
              <Route path="/how-to" element={<ProtectedBrand Component={HowToUsePlatform} />} />
              <Route path="/add-brands" element={<ProtectedBrand Component={AddBrands} />} />
              <Route path="/campaign-details/:id" element={<ProtectedBrand Component={CampaignDetails} />} />


              {/* Admin routes */}
              <Route path="/admin/signin" element={<AdminSignIn />} />
              <Route path="/admin/dashboard" element={<ProtectedAdmin Component={AdminDashboard} />} />
              <Route path="/admin/influencers" element={<ProtectedAdmin Component={AdminInfluencers} />} />
              <Route path="/admin/not-approved" element={<ProtectedAdmin Component={NotApproved} />} />
              <Route path="/admin/brands" element={<ProtectedAdmin Component={AdminBrands} />} />
              <Route path="/admin/campaigns" element={<ProtectedAdmin Component={AdminCampaigns} />} />
              <Route path="/admin/campaign-details/:id" element={<ProtectedAdmin Component={AdminCampaignDetailsView} />} />
              <Route path="/admin/campaign/:id" element={<ProtectedAdmin Component={AdminCampaignDetail} />} />
              <Route path="/admin/payments" element={<ProtectedAdmin Component={AdminPayments} />} />
              <Route path="/admin/settings" element={<ProtectedAdmin Component={AdminSettings} />} />
              <Route path="/admin/category" element={<ProtectedAdmin Component={Category} />} />
              <Route path="/admin/post" element={<ProtectedAdmin Component={Post} />} />



              {/* Influencer Routes */}
              <Route path="/influencer/dashboard" element={<ProtectedInfluencer Component={InfluencerDashboard} />} />
              <Route path="/influencer/earnings" element={<ProtectedInfluencer Component={InfluencerEarnings} />} />
              <Route path="/influencer/messages" element={<ProtectedInfluencer Component={InfluencerMessages} />} />
              <Route path="/influencer/settings" element={<ProtectedInfluencer Component={InfluencerSettings} />} />
              <Route path="/influencer/profile" element={<ProtectedInfluencer Component={InfluencerProfile} />} />
              <Route path="/influencer/for-you" element={<ProtectedInfluencer Component={InfluencerForYou} />} />
              <Route path="/influencer/for-you/campaigns-i-like" element={<ProtectedInfluencer Component={InfluencerForYou} />} />
              <Route path="/influencer/for-you/popular-campaigns" element={<ProtectedInfluencer Component={InfluencerForYou} />} />
              <Route path="/influencer/for-you/recently-viewed" element={<ProtectedInfluencer Component={InfluencerForYou} />} />
              <Route path="/influencer/for-you/all-campaigns" element={<ProtectedInfluencer Component={InfluencerForYou} />} />
              <Route path="/influencer/for-you/participated-campaigns" element={<ProtectedInfluencer Component={InfluencerForYou} />} />
              <Route path="/influencer/bank-account" element={<ProtectedInfluencer Component={InfluencerBankAccount} />} />
              <Route path="/influencer/campaign/:ids" element={<ProtectedInfluencer Component={CampaignDetail} />} />
              <Route path="/influencer/privacy-policy" element={<ProtectedInfluencer Component={PrivacyPolicy} />} />
              <Route path="/influencer/terms-of-service" element={<ProtectedInfluencer Component={TermsOfService} />} />
              <Route path="/influencer/influencer-agreement" element={<ProtectedInfluencer Component={InfluencerAgreement} />} />
              <Route path="influencer/notifications" element={<ProtectedInfluencer Component={InfluencerNotifications} />} />
              <Route path="*" element={<NotFound />} />

              <Route path="influencer/tiktok-success" element={<ProtectedInfluencer Component={TikTokAuth} />} />
              <Route path="influencer/instagram-success" element={<ProtectedInfluencer Component={InstagramAuth} />} />


            </Routes>
          </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
