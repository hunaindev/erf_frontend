import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import InfluencerNavbar from "@/components/InfluencerNavbar";
import Footer from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Instagram,
  PanelRight,
  Grid3X3,
  LayoutGrid,
  Briefcase,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { baseUrl, imageUrl } from "@/utils/constants";
import { isNativeApp, openOAuthUrl } from "@/utils/nativeOAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getAcceptApplyCampaign, imageURL } from "../../api/ApiRoute";
import { useQuery } from "@tanstack/react-query";

// Reusable NoDataFound Component
const NoDataFound = () => (
  <div className="text-center py-10 flex flex-col items-center">
    <div className="inline-block mb-4">
      <img
        src="/lovable-uploads/no-data.png"
        alt="Veri yok"
        className="w-20 h-20 mx-auto"
      />
    </div>
    <p className="text-gray-500">Veri Yok</p>
  </div>
);

// ShimmerCard Component (already provided)
const ShimmerCard = () => (
  <div className="animate-pulse bg-white p-4 rounded-lg shadow-sm border">
    <div className="h-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const InfluencerDashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName] = useState("");
  const [instaData, setInstaData] = useState([]);
  const [tiktokData, setTikTokData] = useState([]);
  const [connect, setBağlan] = useState(false);
  const [tiktokBağlan, setTikTokBağlan] = useState(false);
  const [active, setActive] = useState([]);
  const [applied, setApplied] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [tiktokConfirm, setTikTokConfirm] = useState(false);
  const [instagramConfirm, setInstagramConfirm] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const isOverviewTab = activeTab === "overview";

  const SidebarContent = ({
    activeTab,
    setActiveTab,
    connect,
    handleClose,
  }) => (
    <>
      {/* Menu Section */}
      <div className="mb-10 ">
        {/* <h3 className="font-medium mb-6 text-gray-400">MENU</h3> */}
        <div className="space-y-4">
          {[
            {
              key: "overview",
              label: "Genel Bakış",
              icon: <LayoutGrid className="h-5 w-5" />,
            },
            {
              key: "participated-campaigns",
              label: "Katıldığım Kampanyalar",
              icon: <PanelRight className="h-5 w-5" />,
            },
            ...(connect
              ? [
                  {
                    key: "instagram-post",
                    label: "Instagram Gönderisi",
                    icon: <PanelRight className="h - 5 w- 5" />,
                  },
                ]
              : []),
            ...(tiktokBağlan
              ? [
                  {
                    key: "tiktok-post",
                    label: "TikTok Gönderisi",
                    icon: <PanelRight className="h - 5 w- 5" />,
                  },
                ]
              : []),
            // { key: "collab-portfolio", label: "Collab Portfolio", icon: <Grid3X3 className="h-5 w-5" /> },
            {
              key: "partnerships",
              label: "Ortaklıklar",
              icon: <MapPin className="h-5 w-5" />,
            },
          ].map((item) => (
            <button
              key={item.key}
              className={`flex items-center w-full rounded-full p-2.5 transition-colors ${
                activeTab === item.key
                  ? "bg-white text-primary"
                  : "hover:bg-white/10"
              }`}
              onClick={() => {
                setActiveTab(item.key);
                handleClose?.();
              }}
            >
              <div className="mr-3">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Social Media Section */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-medium text-gray-400">Sosyal Medya Hesabı</h3>
          <div className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            2
          </div>
        </div>
        <div className="space-y-3">
          {/* Instagram */}
          {user?.instagram === 1 ? (
            <button
              className={`w-full rounded-full transition-colors ${
                activeTab === "instagram"
                  ? "bg-white text-primary"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setActiveTab("instagram")}
            >
              <div className="flex items-center justify-between bg-white/10 rounded-full py-2 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Instagram</span>
                </div>
                <span className="text-xs bg-green-600 py-1 px-3 rounded-full">
                  {connect ? "Bağlı" : "Bağlan"}
                </span>
              </div>
            </button>
          ) : (
            <button
              className={`w-full rounded-full transition-colors ${
                activeTab === "instagram"
                  ? "bg-white text-primary"
                  : "hover:bg-white/10"
              }`}
              //onClick={() => setActiveTab("instagram")}
            >
              <div className="flex items-center justify-between bg-white/10 rounded-full py-2 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Instagram</span>
                </div>
                <span className="text-xs bg-green-600 py-1 px-3 rounded-full">
                  Devre Dışı
                </span>
              </div>
            </button>
          )}

          {/* TikTok (Coming Soon) */}
          {user?.tiktok === 1 ? (
            <button
              className={`w-full rounded-full transition-colors ${
                activeTab === "" ? "bg-white text-primary" : "hover:bg-white/10"
              }`}
              onClick={() => setActiveTab("tiktok")}
            >
              <div className="flex items-center justify-between bg-white/10 rounded-full py-2 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </div>
                  <span className="font-medium">TikTok</span>
                </div>
                <span className="text-xs bg-gray-600 py-1 px-3 rounded-full">
                  {tiktokBağlan ? "Bağlı" : "Bağlan"}
                </span>
              </div>
            </button>
          ) : (
            <button
              className={`w-full rounded-full transition-colors ${
                activeTab === "" ? "bg-white text-primary" : "hover:bg-white/10"
              }`}
              // onClick={() => setActiveTab("tiktok")}
            >
              <div className="flex items-center justify-between bg-white/10 rounded-full py-2 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </div>
                  <span className="font-medium">TikTok</span>
                </div>
                <span className="text-xs bg-gray-600 py-1 px-3 rounded-full">
                  Devre Dışı
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="mb-0 sm:mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-lg font-semibold mb-2">
                Erfluencer'a hoş geldin !{" "}
                <span className="text-primary">
                  {/* app.erosmarketing.io/brand-joining/mFTFpbkpjHoh3EsR */}
                </span>
              </h2>
              <p className="mb-4">
                Influencer olarak başarıya ulaşmak için doğru yerdesin.
              </p>

              <p className="mb-4">
                Erfluencer, markalarla kolayca tanışman, iş birlikleri kurman ve
                etkileşimini gerçek kazanca dönüştürmen için tasarlandı.
              </p>
              <p className="mb-4">
                Sosyal medya hesabını/hesaplarını bağla, kampanyalara katıl.
              </p>
              {user?.approved_tiktok !== "accept" &&
                user?.approved_instagram !== "accept" && (
                  <p className="mb-4">
                    3 iş günü içinde profilinin onay durumu hakkında seni
                    bilgilendireceğiz. Bu süreçte profil bilgilerini tamamlamaya
                    devam edebilirsin.
                  </p>
                )}
            </div>
            {/* <NoDataFound /> */}
          </div>
        );
      case "participated-campaigns":
        return (
          <div>
            <Tabs defaultValue="active">
              <TabsList className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                <TabsTrigger
                  value="active"
                  className="bg-white py-2 text-[10px] sm:text-sm rounded-md shadow-sm flex items-center space-x-2 border"
                >
                  <span className="text-primary">Aktif</span>
                  <span className="bg-red-500 text-white rounded-full text-[8px] sm:text-[10px]  h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {active.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="applied"
                  className="bg-white py-2 text-[10px] sm:text-sm rounded-md shadow-sm flex items-center space-x-2 border"
                >
                  <span className="text-primary">Başvurulan</span>
                  <span className="bg-red-500 text-white rounded-full text-[8px] sm:text-[10px]  h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {applied.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="bg-white py-2 text-[10px] sm:text-sm rounded-md shadow-sm flex items-center space-x-2 border"
                >
                  <span className="text-primary">Tamamlandı</span>
                  <span className="bg-red-500 text-white rounded-full text-[8px] sm:text-[10px]  h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {completed.length}
                  </span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <ShimmerCard key={index} />
                      ))}
                  </div>
                ) : active.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {active.map((item) => (
                      <Link
                        key={item.campaign_id}
                        to={`/influencer/campaign/${item.campaign_id}`}
                        className="block bg-white rounded-lg overflow-hidden shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="mb-4">
                            <img
                              src={`${imageUrl}/${item.image}`}
                              alt={`Kampanya: ${item.name}`}
                              className="w-full h-48 object-cover rounded"
                              loading="lazy"
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {item.name.toUpperCase()}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {item.goals}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-green-600">
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NoDataFound />
                )}
              </TabsContent>
              <TabsContent value="applied">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <ShimmerCard key={index} />
                      ))}
                  </div>
                ) : applied.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applied.map((item) => (
                      <Link
                        key={item.campaign_id}
                        to={`/influencer/campaign/${item.campaign_id}`}
                        className="block bg-white rounded-lg overflow-hidden shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="mb-4">
                            <img
                              src={`${imageUrl}/${item.image}`}
                              alt="Kampanya"
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {item.name.toUpperCase()}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {item.goals}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-yellow-600">
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NoDataFound />
                )}
              </TabsContent>
              <TabsContent value="completed">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <ShimmerCard key={index} />
                      ))}
                  </div>
                ) : completed.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completed.map((item) => (
                      <Link
                        key={item.campaign_id}
                        to={`/influencer/campaign/${item.campaign_id}`}
                        className="block bg-white rounded-lg overflow-hidden shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="mb-4">
                            <img
                              src={`${imageUrl}/${item.image}`}
                              alt={`Kampanya: ${item.name}`}
                              className="w-full h-48 object-cover rounded"
                              loading="lazy"
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {item.name.toUpperCase()}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {item.goals}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-green-600">
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NoDataFound />
                )}
              </TabsContent>
            </Tabs>
          </div>
        );
      case "instagram-post":
        return (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <ShimmerCard key={index} />
                  ))}
              </div>
            ) : instaData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {instaData.map((item) => (
                  <Link
                    key={item.id}
                    to={item.permalink}
                    className="block bg-white rounded-lg overflow-hidden shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="mb-4">
                        <img
                          src={
                            item.thumbnail_url
                              ? item.thumbnail_url
                              : item.media_url
                          }
                          alt="Instagram Gönderi
si"
                          className="w-full h-48 object-cover rounded"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.caption
                          ? item.caption.split(" ").slice(0, 20).join(" ") +
                            "..."
                          : ""}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">
                          Like - {item.like_count || 0}
                        </span>
                        <span className="text-green-600">
                          Comment - {item.comment_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        );
      case "tiktok-post":
        return (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <ShimmerCard key={index} />
                  ))}
              </div>
            ) : tiktokData?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiktokData?.map((item) => (
                  <>
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 w-full"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-slate-900">
                          TikTok Video
                        </div>
                        <span className="text-xs text-slate-500">Preview</span>
                      </div>

                      {/* 9:16 responsive container */}
                      <div className="mx-auto w-full max-w-[380px]">
                        <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 aspect-[9/16]">
                          <iframe
                            src={`https://www.tiktok.com/embed/v2/${item.id}`}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
                            allowFullScreen
                            title={`tiktok-${item.id}`}
                            scrolling="no"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="mb-4">
                        <img
                          src={item.cover_image_url ? item.cover_image_url : item.title}
                          alt="Instagram Gönderi
si"
                          className="w-full h-48 object-cover rounded"
                          loading="lazy"
                        />


                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {item?.title
                          ? item?.title?.split(" ")?.slice(0, 20)?.join(" ") + "..."
                          : ""}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">
                          Like - {item.like_count || 0}
                        </span>
                        <span className="text-green-600">
                          Comment - {item.comment_count || 0}
                        </span>
                      </div>
                    </div> */}
                  </>
                ))}
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        );
      case "collab-portfolio":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-semibold mb-2">
                Yüklenen Is Birligi Icerigi: 0 / 4
              </h1>
              <div className="grid grid-cols-2 gap-4 max-w-md mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V8M12 8L9 11M12 8L15 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Görsel Yükle</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V8M12 8L9 11M12 8L15 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Video Yükle</span>
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-4">
                Eros'taki Is Birligi Icerigi: 0
              </h2>
            </div>
            <NoDataFound />
          </div>
        );
      case "partnerships":
        return (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <ShimmerCard key={index} />
                  ))}
              </div>
            ) : data?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((item) => (
                  <>
                    {item.post_status === "accepted" && (
                      <Link
                        key={item.id}
                        to={item.post_link}
                        className="block bg-white rounded-lg overflow-hidden shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="mb-4">
                            <img
                              src={imageURL + "/" + item.post}
                              alt={"image"}
                              className="w-full h-48 object-cover rounded"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </Link>
                    )}
                    {item.story_status === "accepted" && (
                      <Link
                        key={item.id + 1}
                        to={item.story_link}
                        className="block bg-white rounded-lg overflow-hidden shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="mb-4">
                            <video
                              src={imageURL + "/" + item.story}
                              className="w-full h-48 object-cover rounded"
                              controls
                              preload="metadata"
                            />
                          </div>
                        </div>
                      </Link>
                    )}
                  </>
                ))}
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        );

      case "instagram":
        return (
          <div className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Instagram</h1>
              <div className="mb-8 flex justify-end">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-6 mb-10">
                <p className="text-lg font-medium">
                  Instagram hesabını bağla, kampanyalara katıl.
                </p>
                {user?.approved_instagram !== "accept" && (
                  <p className="text-lg font-medium">
                    3 iş günü içinde profilinin onay durumu hakkında seni
                    bilgilendireceğiz. Bu süreçte profil bilgilerini tamamlamaya
                    devam edebilirsin.
                  </p>
                )}

                {connect ? (
                  <>
                    <Button
                      className="bg-green-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                      disabled
                    >
                      Instagram başarıyla bağlandı
                    </Button>

                    <Button
                      onClick={() => {
                        handleInstagramDisconnect();
                      }}
                      className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors ml-2"
                    >
                      Bağlantıyı Kes
                    </Button>
                  </>
                ) : (
                  <div>
                    <p>
                      Instagram hesabını bağlamak için aşağıdaki düğmeye
                      tıklayın.
                    </p>
                    <Button
                      className="bg-gray-900 mt-3 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                      onClick={() => setInstagramConfirm(true)}
                      //disabled={isSubmitting}
                    >
                      {isSubmitting ? "Bağlanıyor..." : "Instagram'a Bağlan"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Dialog open={instagramConfirm} onOpenChange={setInstagramConfirm}>
              <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Instagram Bağlantısını Onayla</DialogTitle>
                </DialogHeader>

                <Card className="w-full">
                  <CardHeader>
                    {/* <CardTitle>Student List</CardTitle> */}
                  </CardHeader>
                  <CardContent>
                    <div className="p-2 space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        Instagram sosyal medya Hesabınızı Erfluencer'a
                        bağlayarak, Platform X ve ilişkili Marka
                        Kullanıcılarının içerik ve kitlenizle ilgili aşağıdaki
                        özel olmayan performans metriklerine ve verilere
                        erişmesine, analiz etmesine ve kullanmasına açıkça izin
                        verirsiniz:
                      </p>

                      {/* Section 1: Metrics List */}
                      <div className="space-y-3 pl-4">
                        <h4 className="text-md font-semibold text-gray-800">
                          1. Toplanan Veri Metrikleri:
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>
                            <strong className="text-gray-900">
                              Beğeniler:
                            </strong>{" "}
                            Performans değerlendirmesi için toplam beğeni
                            sayısı, Gönderi başı ortalama beğeni ve ilgili
                            oranlar.
                          </li>
                          <li>
                            <strong className="text-gray-900">
                              Paylaşımlar:
                            </strong>{" "}
                            İçeriğinizin platformlarda hangi sıklıkla
                            paylaşıldığını gösteren veriler.
                          </li>
                          <li>
                            <strong className="text-gray-900">
                              Etkileşim:
                            </strong>{" "}
                            Gönderi leriniz için toplam izlenme süresi, kaydetme
                            sayısı ve hesaplanan genel etkileşim oranları dahil
                            metrikler.
                          </li>
                          <li>
                            <strong className="text-gray-900">Yorumlar:</strong>{" "}
                            İstatistiksel analiz ve raporlama için Gönderi
                            lerinizdeki yorum sayisi.{" "}
                            <span className="italic text-red-600 font-medium">
                              Ayrıca açık bir izin olmadan yorumların metin
                              içeriği kullanılmaz.
                            </span>
                          </li>
                          <li>
                            <strong className="text-gray-900">
                              Kitle Verisi:
                            </strong>{" "}
                            Takipçiler inizin toplu ve anonim demografik
                            verileri (örnek: cinsiyet dağılımı, yaş aralığı,
                            konum).
                          </li>
                        </ul>
                      </div>

                      {/* Section 2: Purpose of Use */}
                      <div className="space-y-3 pl-4 pt-2">
                        <h4 className="text-md font-semibold text-gray-800">
                          2. Kullanım Amacı:
                        </h4>
                        <p className="text-sm text-gray-700 font-medium">
                          Bu performans verileri sadece şu iş amaçlarıyla
                          kullanılır:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-4">
                          <li>
                            Profilinizin belirli marka kampanyaları için
                            uygunluk ve erişim açısından değerlendirilmesi.
                          </li>
                          <li>
                            Kampanya performansının, **Yatırım Getirisi (ROI)**
                            değerinin hesaplanması ve Marka Kullanıcıları için
                            rapor oluşturulması.
                          </li>
                          <li>
                            Platformun influencer eşleştirme ve önerme
                            algoritmalarının iyileştirilmesi.
                          </li>
                        </ul>
                      </div>

                      {/* Final Acknowledgment */}
                      <p className="pt-2 text-sm font-medium text-gray-800">
                        <span className="font-bold">Paylaşım:</span> Bu
                        performans verilerinin iş birliği fırsatlarını
                        kolaylaştırmak için potansiyel Marka Kullanıcıları ile
                        **toplu ve gerekli formatta** paylaşılabileceğini kabul
                        edersiniz.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 ml-2">
                        <input
                          type="checkbox"
                          id="acceptanceCheck"
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                          required
                          checked={isAccepted}
                          onChange={(e) => setIsAccepted(e.target.checked)}
                        />
                        <label
                          htmlFor="acceptanceCheck"
                          className="text-sm font-medium text-gray-700 select-none cursor-pointer mt-2"
                        >
                          Kabul Ediyorum
                        </label>
                      </div>

                      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setInstagramConfirm(false);
                          }}
                        >
                          İptal
                        </Button>

                        <Button
                          disabled={!isAccepted || isSubmitting}
                          onClick={handleInstagram}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Onayla
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
        );
      case "tiktok":
        return (
          <div className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">TikTok</h1>
              <div className="mb-8 flex justify-end">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-6 mb-10">
                <p className="text-lg font-medium">
                  TikTok hesabını bağla, kampanyalara katıl.
                </p>
                {user?.approved_tiktok !== "accept" && (
                  <p className="text-lg font-medium">
                    3 iş günü içinde profilinin onay durumu hakkında seni
                    bilgilendireceğiz. Bu süreçte profil bilgilerini tamamlamaya
                    devam edebilirsin.
                  </p>
                )}

                {tiktokBağlan ? (
                  <>
                    <Button
                      className="bg-green-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                      disabled

                      //  disabled={isSubmitting || !userName.trim()}
                    >
                      TikTok Bağlandı
                    </Button>
                    <Button
                      onClick={() => {
                        handleTikTokDisconnect();
                      }}
                      className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors ml-2"
                    >
                      Bağlantıyı Kes
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    onClick={() => setTikTokConfirm(true)}
                    //  disabled={isSubmitting || !userName.trim()}
                  >
                    {isSubmitting ? "Bağlanıyor..." : "TikTok'a Bağlan"}
                  </Button>
                )}
              </div>
            </div>

            <Dialog open={tiktokConfirm} onOpenChange={setTikTokConfirm}>
              <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>TikTok Bağlantısını Onayla</DialogTitle>
                </DialogHeader>

                <Card className="w-full">
                  <CardHeader>
                    {/* <CardTitle>Student List</CardTitle> */}
                  </CardHeader>
                  <CardContent>
                    <div className="p-2 space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        TikTok sosyal medya Hesabınızı Erfluencer'a bağlayarak,
                        Platform X ve ilişkili Marka Kullanıcılarının içerik ve
                        kitlenizle ilgili aşağıdaki özel olmayan performans
                        metriklerine ve verilere erişmesine, analiz etmesine ve
                        kullanmasına açıkça izin verirsiniz:
                      </p>

                      {/* Section 1: Metrics List */}
                      <div className="space-y-3 pl-4">
                        <h4 className="text-md font-semibold text-gray-800">
                          1. Toplanan Veri Metrikleri:
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>
                            <strong className="text-gray-900">
                              Beğeniler:
                            </strong>{" "}
                            Performans değerlendirmesi için toplam beğeni
                            sayısı, Gönderi başı ortalama beğeni ve ilgili
                            oranlar.
                          </li>
                          <li>
                            <strong className="text-gray-900">
                              Paylaşımlar:
                            </strong>{" "}
                            İçeriğinizin platformlarda hangi sıklıkla
                            paylaşıldığını gösteren veriler.
                          </li>
                          <li>
                            <strong className="text-gray-900">
                              Etkileşim:
                            </strong>{" "}
                            Gönderi leriniz için toplam izlenme süresi, kaydetme
                            sayısı ve hesaplanan genel etkileşim oranları dahil
                            metrikler.
                          </li>
                          <li>
                            <strong className="text-gray-900">Yorumlar:</strong>{" "}
                            İstatistiksel analiz ve raporlama için Gönderi
                            lerinizdeki yorum sayisi.{" "}
                            <span className="italic text-red-600 font-medium">
                              Ayrıca açık bir izin olmadan yorumların metin
                              içeriği kullanılmaz.
                            </span>
                          </li>
                          <li>
                            <strong className="text-gray-900">
                              Kitle Verisi:
                            </strong>{" "}
                            Takipçiler inizin toplu ve anonim demografik
                            verileri (örnek: cinsiyet dağılımı, yaş aralığı,
                            konum).
                          </li>
                        </ul>
                      </div>

                      {/* Section 2: Purpose of Use */}
                      <div className="space-y-3 pl-4 pt-2">
                        <h4 className="text-md font-semibold text-gray-800">
                          2. Kullanım Amacı:
                        </h4>
                        <p className="text-sm text-gray-700 font-medium">
                          Bu performans verileri sadece şu iş amaçlarıyla
                          kullanılır:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-4">
                          <li>
                            Profilinizin belirli marka kampanyaları için
                            uygunluk ve erişim açısından değerlendirilmesi.
                          </li>
                          <li>
                            Kampanya performansının, **Yatırım Getirisi (ROI)**
                            değerinin hesaplanması ve Marka Kullanıcıları için
                            rapor oluşturulması.
                          </li>
                          <li>
                            Platformun influencer eşleştirme ve önerme
                            algoritmalarının iyileştirilmesi.
                          </li>
                        </ul>
                      </div>

                      {/* Final Acknowledgment */}
                      <p className="pt-2 text-sm font-medium text-gray-800">
                        <span className="font-bold">Paylaşım:</span> Bu
                        performans verilerinin iş birliği fırsatlarını
                        kolaylaştırmak için potansiyel Marka Kullanıcıları ile
                        **toplu ve gerekli formatta** paylaşılabileceğini kabul
                        edersiniz.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 ml-2">
                        <input
                          type="checkbox"
                          id="acceptanceCheck"
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                          required
                          checked={isAccepted}
                          onChange={(e) => setIsAccepted(e.target.checked)}
                        />
                        <label
                          htmlFor="acceptanceCheck"
                          className="text-sm font-medium text-gray-700 select-none cursor-pointer mt-2"
                        >
                          Kabul Ediyorum
                        </label>
                      </div>

                      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setTikTokConfirm(false);
                          }}
                        >
                          İptal
                        </Button>

                        <Button
                          disabled={!isAccepted || isSubmitting}
                          onClick={handleTikTok}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {/* {submit ? "Save Marks..." : "Save Marks"} */}
                          Onayla
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
        );
      default:
        return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getAcceptApplyCampaign"],
    queryFn: getAcceptApplyCampaign,
  });

  // const handleUserName = () => {
  //   setIsSubmitting(true);
  //   const data = JSON.stringify({user_name: userName });
  //   const config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `${baseUrl}/api/get-instagram-data`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  //     },
  //     withCredentials: true,
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       setIsSubmitting(false);
  //       if (response.data.data?.error) {
  //         toast({
  //           title: "Message",
  //           description: response.data.data.error.message,
  //         });
  //         setBağlan(false);
  //       } else {
  //         setBağlan(!!response?.data?.user);
  //         localStorage.removeItem("user");
  //         localStorage.setItem("user", JSON.stringify(response.data.user));
  //       }
  //     })
  //     .catch((error) => {
  //       setIsSubmitting(false);
  //       console.log(error);
  //     });
  // };

  // const getInstagramPost = () => {
  //   setLoading(true)
  //   const config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: `${baseUrl}/api/get-instagram-post`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  //     },
  //     withCredentials: true,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       if (response.data?.mediaData?.business_discovery?.media) {
  //         setInstaData(response.data.mediaData.business_discovery.media.data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  //     .finally(() => setLoading(false)); // Set loading to false after request
  // };

  // useEffect(() => {
  //   setLoading(true); // Set loading to true at the start
  //   if (JSON.parse(localStorage.getItem("user"))) {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     if (user.insta_username) {
  //       setBağlan(true);
  //     }
  //   }
  //   getInstagramPost();

  //
  //   // .finally(() => setLoading(false)); // Set loading to false after request
  // }, []);

  const handleCampaign = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-apply-campaign`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setActive(response.data.active || []);
        setApplied(response.data.applied || []);
        setCompleted(response.data.completed || []);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false); // Set loading to false after request
  };

  /* tiktok */
  const handleTikTok = () => {
    setIsSubmitting(true);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/tiktok/login`,
      params: {
        mobile_app: isNativeApp() ? 1 : 0,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    axios
      .request(config)
      .then(async (response) => {
        await openOAuthUrl(response.data);
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const tiktokProfile = async () => {
    const state = localStorage.getItem("tiktok");

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/tiktok/profile?state=${state}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      // withCredentials: true,
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //   console.log(response.data)
        // setIsSubmitting(false);
        // if (response.data.data?.error) {
        //   toast({
        //     title: "Message",
        //     description: response.data.data.error.message,
        //   });
        //   setBağlan(false);
        // } else {
        //   setBağlan(!!response?.data?.user);
        //   localStorage.removeItem("user");
        //   localStorage.setItem("user", JSON.stringify(response.data.user));
        // }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };
  const tiktokVideo = async () => {
    const state = localStorage.getItem("tiktok");

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/tiktok/videos?state=${state}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      // withCredentials: true,
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data.videos);

        setTikTokData(response.data.data.videos);
        // setIsSubmitting(false);
        // if (response.data.data?.error) {
        //   toast({
        //     title: "Message",
        //     description: response.data.data.error.message,
        //   });
        //   setBağlan(false);
        // } else {
        //   setBağlan(!!response?.data?.user);
        //   localStorage.removeItem("user");
        //   localStorage.setItem("user", JSON.stringify(response.data.user));
        // }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  const handleTikTokDisconnect = async () => {
    setTikTokBağlan(false);
    localStorage.removeItem("tiktok");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/tiktok-disconnect`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      // withCredentials: true,
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //   console.log(response.data)
        // setIsSubmitting(false);
        // if (response.data.data?.error) {
        //   toast({
        //     title: "Message",
        //     description: response.data.data.error.message,
        //   });
        //   setBağlan(false);
        // } else {
        //   setBağlan(!!response?.data?.user);
        //   localStorage.removeItem("user");
        //   localStorage.setItem("user", JSON.stringify(response.data.user));
        // }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  /* instagram */

  const handleInstagram = () => {
    setIsSubmitting(true);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/instagram/login`,
      params: {
        mobile_app: isNativeApp() ? 1 : 0,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    axios
      .request(config)
      .then(async (response) => {
        await openOAuthUrl(response.data);
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const instagramProfile = async () => {
    const state = localStorage.getItem("instagram");

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/instagram/profile?state=${state}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      // withCredentials: true,
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data)
        // setIsSubmitting(false);
        // if (response.data.data?.error) {
        //   toast({
        //     title: "Message",
        //     description: response.data.data.error.message,
        //   });
        //   setBağlan(false);
        // } else {
        //   setBağlan(!!response?.data?.user);
        //   localStorage.removeItem("user");
        //   localStorage.setItem("user", JSON.stringify(response.data.user));
        // }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  const instagramVideo = async () => {
    const state = localStorage.getItem("instagram");

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/instagram/videos?state=${state}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      // withCredentials: true,
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data)
        setInstaData(response.data.data);
        // setTikTokData(response.data.data.videos)
        // setIsSubmitting(false);
        // if (response.data.data?.error) {
        //   toast({
        //     title: "Message",
        //     description: response.data.data.error.message,
        //   });
        //   setBağlan(false);
        // } else {
        //   setBağlan(!!response?.data?.user);
        //   localStorage.removeItem("user");
        //   localStorage.setItem("user", JSON.stringify(response.data.user));
        // }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  const handleInstagramDisconnect = async () => {
    setBağlan(false);
    localStorage.removeItem("instagram");

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/instagram-disconnect`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      // withCredentials: true,
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //   console.log(response.data)
        // setIsSubmitting(false);
        // if (response.data.data?.error) {
        //   toast({
        //     title: "Message",
        //     description: response.data.data.error.message,
        //   });
        //   setBağlan(false);
        // } else {
        //   setBağlan(!!response?.data?.user);
        //   localStorage.removeItem("user");
        //   localStorage.setItem("user", JSON.stringify(response.data.user));
        // }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  useEffect(() => {
    const state = localStorage.getItem("tiktok");
    const instagramState = localStorage.getItem("instagram");
    if (state) {
      setTikTokBağlan(true);
    }
    if (instagramState) {
      setBağlan(true);
    }
    tiktokVideo();
    tiktokProfile();
    instagramProfile();
    instagramVideo();
    handleCampaign();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");

    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    const handleOpenMenu = () => {
      setDrawerOpen(true);
    };

    const handleDashboardTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
        setDrawerOpen(false);
      }
    };

    window.addEventListener("influencer-dashboard-menu-open", handleOpenMenu);
    window.addEventListener(
      "influencer-dashboard-tab-change",
      handleDashboardTabChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "influencer-dashboard-menu-open",
        handleOpenMenu,
      );
      window.removeEventListener(
        "influencer-dashboard-tab-change",
        handleDashboardTabChange as EventListener,
      );
    };
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Top bar for small screens */}
        <div className="sm:hidden flex items-center justify-center px-4 py-3 bg-[hsl(var(--primary-ink))] text-white">
          <span className="text-lg font-bold">Kontrol Paneli</span>
        </div>

        <div className="flex ml-0 sm:ml-24">
          {/* Sidebar / Drawer */}
          {/* Desktop Sidebar */}
          <div className="hidden sm:block w-[400px] bg-[hsl(var(--primary-ink))] text-white p-6 ">
            {/* Sidebar Content */}
            <SidebarContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              connect={connect}
              handleClose={null}
            />
          </div>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent
              side="left"
              className="w-[84%] max-w-xs border-r-0 bg-[hsl(var(--primary-ink))] p-6 text-white sm:hidden"
            >
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-lg font-semibold text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <SidebarContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                connect={connect}
                handleClose={() => setDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <div
            className={`flex-1 p-6 ${
              isOverviewTab ? "pb-8 sm:pb-6" : "pb-24 sm:pb-6"
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InfluencerDashboard;
