import React from "react";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { baseUrl } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [isSubmittingFree, setIsSubmittingFree] = useState(false);
  const [isSubmittingStandardMonthly, setIsSubmittingStandardMonthly] =
    useState(false);
  const [isSubmittingStandardYearly, setIsSubmittingStandardYearly] =
    useState(false);
  const [isSubmittingAgencyMonthly, setIsSubmittingAgencyMonthly] =
    useState(false);
  const [isSubmittingAgencyYearly, setIsSubmittingAgencyYearly] =
    useState(false);
  const { toast } = useToast();
  const [subscriptionDetails, setSubscriptionDetails] = useState();
  const [plan, setPlan] = useState();
  const [iframeUrl, setIframeUrl] = useState("");
  const [submittingPlans, setSubmittingPlans] = useState({});
  const [isCancelling, setIsCancelling] = useState(false);

  const plans = {
    standardMonthly: 1,
    standardYearly: 2,
    agencyMonthly: 3,
    agencyYearly: 4,
    corporate: 5,
    trial: 6,
  };

  const navigate = useNavigate();

  function getPlans() {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-plans`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(response.data);
        setPlan(response.data.plans);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getToken = async (id) => {
    setSubmittingPlans((prev) => ({ ...prev, [id]: true }));
    // setIsSubmittingFree(true);
    const data = JSON.stringify({ plan_id: id });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-token`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      withCredentials: true,
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        handlePaytrSubscription();
        if (response.data.status === "success") {
          // window.location.href = response.data.url;
          window.open(response.data.url, "_blank");
        }

        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePaytrSubscription = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-paytr-subscription`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data?.paytr);
        setSubscriptionDetails(response.data?.paytr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/cancel-subscription`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      withCredentials: true,
    };

    try {
      const response = await axios.request(config);
      if (response.data.status === "success") {
        toast({
          title: "Başarılı",
          description: "Aboneliğiniz başarıyla iptal edildi.",
        });
        handlePaytrSubscription();
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: response.data.message || "İptal işlemi başarısız oldu.",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Hata",
        description:
          error?.response?.data?.message ||
          "Abonelik iptal edilirken bir hata oluştu.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    getPlans();
    // handleGetSubscription();
    handlePaytrSubscription();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1 p-4 pb-44 sm:p-6 sm:pb-8 md:p-8">
        <Tabs defaultValue="standard" className="w-full max-w-5xl mx-auto">
          <TabsList className="w-full bg-transparent flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger
              value="standard"
              className="flex-1 py-3 px-2 sm:px-4 text-sm sm:text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Standart Hesap
            </TabsTrigger>
            <TabsTrigger
              value="agency"
              className="flex-1 py-3 px-2 sm:px-4 text-sm sm:text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Ajans Hesabı
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-6">
            <p className="text-center text-sm sm:text-base mb-6">
              Erfluencer Standart hesabı, tek bir markayı yönetmenize olanak
              tanır.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-200 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Başlangıç
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold">
                      ₺0{" "}
                      <span className="text-base sm:text-lg font-normal">
                        / Aylık{" "}
                      </span>{" "}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* <div className="flex items-center gap-2">
                      <div className="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">IG</span>
                      </div>
                      <p className="text-sm sm:text-base">25k - 100k erisim</p>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Erken katılan markalar için
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sınırsız Kampanya Oluşturma
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Influencer & Kampanya Yönetimi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Temel Kampanya Takibi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        {" "}
                        Platforma Tam Erişim
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        {" "}
                        Kendi Kendine Yönetim
                      </p>
                    </div>
                  </div>
                  {subscriptionDetails?.plan_id === plans.trial &&
                  subscriptionDetails.status === "active" ? (
                    <Button
                      disabled={isCancelling}
                      onClick={handleCancelSubscription}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                    >
                      {isCancelling
                        ? "İptal Ediliyor..."
                        : "Aboneliği İptal Et"}
                    </Button>
                  ) : subscriptionDetails?.trial_status === 1 ? (
                    <Button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                    >
                      Deneme Kullanilamiyor
                    </Button>
                  ) : (
                    <Button
                      disabled={submittingPlans[6]}
                      onClick={() => getToken(6)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[6]
                        ? "Aktiflestiriliyor..."
                        : "Aktiflestir"}
                    </Button>
                  )}

                  {/* {(subscriptionDetails?.plan_id === plans.trial) && (subscriptionDetails.status === 'active') ? (

                    <Button disabled={true} className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base">

                      Aktif
                    </Button>
                  ) : (


                    <Button

                      disabled={submittingPlans[6]}
                      onClick={() => getToken(6)}
                      // onClick={() => handleFree(plans.standardMonthly)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[6] ? "Aktiflestiriliyor..." : "Aktiflestir"}
                    </Button>
                  )} */}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-200 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Aylık Profesyonel Plan{" "}
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold">
                      1,999 TL{" "}
                      <span className="text-base sm:text-lg font-normal">
                        / Aylık
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">IG</span>
                      </div>
                      <p className="text-sm sm:text-base">25k - 100k erisim</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sinirsiz Kampanya Oluşturun
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sinirsiz Influencer Basvurusu
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Kampanya Performans Raporlari
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Kampanya Performans Raporlari
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">Standart Destek</p>
                    </div>
                  </div>

                  {subscriptionDetails?.plan_id === plans.standardMonthly &&
                  subscriptionDetails.status === "active" ? (
                    <Button
                      disabled={isCancelling}
                      onClick={handleCancelSubscription}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                    >
                      {isCancelling
                        ? "İptal Ediliyor..."
                        : "Aboneliği İptal Et"}
                    </Button>
                  ) : (
                    <Button
                      disabled={submittingPlans[1]}
                      onClick={() => getToken(1)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[1]
                        ? "Aktiflestiriliyor..."
                        : "Aktiflestir"}
                    </Button>
                  )}
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-200 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Avantajlı Yıllık Profesyonel Plan
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold">
                      999 TL{" "}
                      <span className="text-base sm:text-lg font-normal">
                        / Aylık
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm">Toplam: 11,988 TL</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">IG</span>
                      </div>
                      <p className="text-sm sm:text-base">750k - 1.5m erisim</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sinirsiz Kampanya Oluşturun
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sinirsiz Influencer Basvurusu
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Kampanya Performans Raporlari
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Platform İçi Sözleşme ve İletişim Yönetimi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Size ozel Musteri Temsilcisi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        {" "}
                        Anahtar Teslim Kampanya Yönetim Hizmeti
                      </p>
                    </div>
                  </div>
                  {subscriptionDetails?.plan_id === plans.standardYearly &&
                  subscriptionDetails.status === "active" ? (
                    <Button
                      disabled={isCancelling}
                      onClick={handleCancelSubscription}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                    >
                      {isCancelling
                        ? "İptal Ediliyor..."
                        : "Aboneliği İptal Et"}
                    </Button>
                  ) : (
                    <Button
                      disabled={submittingPlans[2]}
                      onClick={() => getToken(2)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[2]
                        ? "Aktiflestiriliyor..."
                        : "Aktiflestir"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-200 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Aylık Kurumsal Paket
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold">
                      2,999 TL{" "}
                      <span className="text-base sm:text-lg font-normal">
                        / Aylık
                      </span>
                    </p>
                    {/* <p className="text-xs sm:text-sm">Toplam: 11,988 TL</p> */}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">IG</span>
                      </div>
                      <p className="text-sm sm:text-base">25k - 100k erisim</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sinirsiz Kampanya Oluşturun
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Sinirsiz Influencer Basvurusu
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        {" "}
                        Kampanya Performans Raporlari
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Platform İçi Sözleşme ve İletişim Yönetimi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Size ozel Musteri Temsilcisi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        {" "}
                        Anahtar Teslim Kampanya Yönetim Hizmeti
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Stratejik Danismanlik ve Planlama
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Detayli Analitik ve Sektor Raporlari
                      </p>
                    </div>
                  </div>
                  {subscriptionDetails?.plan_id === plans.corporate &&
                  subscriptionDetails.status === "active" ? (
                    <Button
                      disabled={isCancelling}
                      onClick={handleCancelSubscription}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                    >
                      {isCancelling
                        ? "İptal Ediliyor..."
                        : "Aboneliği İptal Et"}
                    </Button>
                  ) : (
                    <Button
                      disabled={submittingPlans[5]}
                      onClick={() => getToken(5)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[5]
                        ? "Aktiflestiriliyor..."
                        : "Aktiflestir"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agency" className="mt-6">
            <p className="text-center text-sm sm:text-base mb-6">
              Erfluencer Ajans Hesabı , tek bir hesapla birden fazla markayı
              yönetmenize olanak tanır.
              {/* An Eros Agency account allows you to manage multiple brands with a single account. */}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-200 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Aylık Standart Paket
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold">
                      3,999 TL{" "}
                      <span className="text-base sm:text-lg font-normal">
                        / Aylık
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">IG</span>
                      </div>
                      <p className="text-sm sm:text-base">Ajans</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">Özel Fiyatlandırma</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Birden fazla markayı yöneten ajanslar için
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Profesyonel Paketteki Tüm Özellikler
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Ajans ihtiyaçlarına göre genişletilmiş Profesyonel plan.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Çoklu Marka Yönetimi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">Kampanya Önceliği</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Ajansa Özel Dashboard & Yapı
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Esnek ve Ölçeklenebilir Fiyatlandırma
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Randevu & İhtiyaç Analizi
                      </p>
                    </div>
                  </div>
                  {subscriptionDetails?.plan_id === plans.agencyMonthly &&
                  subscriptionDetails?.status === "active" ? (
                    <Button
                      disabled={isCancelling}
                      onClick={handleCancelSubscription}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                    >
                      {isCancelling
                        ? "İptal Ediliyor..."
                        : "Aboneliği İptal Et"}
                    </Button>
                  ) : (
                    <Button
                      disabled={submittingPlans[3]}
                      onClick={() => getToken(3)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[3]
                        ? "Aktiflestiriliyor..."
                        : "Aktiflestir"}
                    </Button>
                  )}
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to pink-200 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">
                    Avantajlı Yıllık Paket
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold">
                      2,999 TL{" "}
                      <span className="text-base sm:text-lg font-normal">
                        / Aylık
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm">Toplam: 35,988</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">IG</span>
                      </div>
                      <p className="text-sm sm:text-base">Ajans</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">Özel Fiyatlandırma</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Birden fazla markayı yöneten ajanslar için
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Profesyonel Paketteki Tüm Özellikler
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Ajans ihtiyaçlarına göre genişletilmiş Profesyonel plan.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Çoklu Marka Yönetimi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">Kampanya Önceliği</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Ajansa Özel Dashboard & Yapı
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Esnek ve Ölçeklenebilir Fiyatlandırma
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Randevu & İhtiyaç Analizi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-sm sm:text-base">
                        Size Özel Müşteri Temsilcisi
                      </p>
                    </div>
                  </div>
                  {subscriptionDetails?.plan_id === plans.agencyYearly &&
                  subscriptionDetails?.status === "active" ? (
                    <Button
                      disabled={isCancelling}
                      onClick={handleCancelSubscription}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                    >
                      {isCancelling
                        ? "İptal Ediliyor..."
                        : "Aboneliği İptal Et"}
                    </Button>
                  ) : (
                    <Button
                      disabled={submittingPlans[4]}
                      onClick={() => getToken(4)}
                      className="w-full bg-gradient-to-r from-yellow-300 to-pink-300 hover:from-yellow-400 hover:to-pink-400 text-black text-sm sm:text-base"
                    >
                      {submittingPlans[4]
                        ? "Aktiflestiriliyor..."
                        : "Aktiflestir"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <div className="h-36 sm:hidden" />
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription;
