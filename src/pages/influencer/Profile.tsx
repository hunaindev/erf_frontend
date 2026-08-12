import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import InfluencerNavbar from "@/components/InfluencerNavbar";
import Footer from "@/components/Footer";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { imageURL } from "@/api/ApiRoute";

// Shimmer Loader Component
const ShimmerProfile = () => (
  <div
    className="min-h-screen flex flex-col"
    style={{ backgroundColor: "#fef7ff" }}
  >
    <InfluencerNavbar />
    <main className="flex-grow flex flex-col items-center justify-center py-8 pb-36 md:pb-8">
      <div style={{ width: "100%", maxWidth: "800px", padding: "0 24px" }}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>

          {/* Kisisel Bilgiler */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Instagram Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-6 bg-gray-200 rounded-full w-24"
                  ></div>
                ))}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="h-12 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    </main>
    {/* <Footer /> */}
  </div>
);

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [approvedTiktok, setApprovedTiktok] = useState("");
  const [approvedInstagram, setApprovedInstagram] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [unit, setUnit] = useState("");
  const [postalCode, setGonderialCode] = useState("");
  const [categories, setKategoriler] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true); // New loading state
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [post, setGonderi] = useState("");
  const [biography, setBiyografi] = useState("");
  const [followers, setFollowers] = useState("");

  const [tiktokPicture, setTiktokPicture] = useState("");
  const [tiktokGonderi, setTiktokGonderi] = useState("");
  const [tiktokBiyografi, setTiktokBiyografi] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState("");
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [img, setImg] = useState("");
  const [image, setImage] = useState("");

  const [deleteReason, setDeleteReason] = useState("");
  const [deleteFeedback, setDeleteFeedback] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImg(file);
  };

  const handleAddCategory = () => {
    setIsSubmitting(true);
    const data = JSON.stringify({ category: newCategory });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/create-category`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setIsSubmitting(false);
        if (response.data.status === false) {
          toast({
            title: "Kategori",
            description: "Kategori basariyla olusturuldu.",
            variant: "destructive",
          });
        } else if (response.data.category) {
          toast({
            title: "Kategori",
            description: "Kategori başarıyla oluşturuldu.",
          });
          getCategory();
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast({
          title: "Hata",
          description: "Kategori eklenemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      });
  };

  const handleRemoveCategory = (id: number) => {
    setIsSubmitting(true);
    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/delete-category?id=${id}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setIsSubmitting(false);
        if (response.data.status === true) {
          toast({
            title: "Kategori",
            description: "Kategori başarıyla silindi.",
          });
          getCategory();
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast({
          title: "Hata",
          description: "Kategori silinemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("image", img);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("unit", unit);
    formData.append("postalCode", postalCode);
    formData.append("contact", contact);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/update-influ-profile`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        // 'Accept': 'application/json',
        //  'Content-Type': 'application/json',
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        setIsSubmitting(false);
        if (response.data.user) {
          toast({
            title: "Kullanici Profili",
            description: "Profilin basariyla Güncellendi.",
          });
          getCategory();
          getProfile();
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast({
          title: "Hata",
          description: "Profil guncellenemedi. Lutfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      });
  };

  const getCategory = useCallback(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-categories`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        if (response.data.category) {
          setKategoriler(response.data.category);
        }
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description: "Kategoriler alınamadı. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      });
  }, [toast]);

  const getProfile = useCallback(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-influ-profile`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        const profile = response.data.user;
        //console.log(profile)
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(profile));
        window.dispatchEvent(new Event("user"));

        const tiktok = response.data.tiktok;
        const instaData = response.data?.instaData;
        if (profile) {
          setFirstName(profile?.name || "");
          setLastName(profile?.last_name || "");
          setEmail(profile?.email || "");
          setContact(profile?.contact || "");
          setApprovedInstagram(profile?.approved_instagram || "");
          setApprovedTiktok(profile?.approved_tiktok || "");
          setCity(profile?.city || "");
          setInstagramUsername(instaData?.username || "");
          setStreet(profile?.address || "");
          setImage(profile?.image || "");
          setCity(profile?.city || "");
          setState(profile?.state || "");
          setCountry(profile?.country || "");
          setUnit(profile?.unit_no || "");
          setGonderialCode(profile?.postal_code || "");
          setProfilePic(instaData?.profile_picture_url || "");
          setGonderi(instaData?.media_count || "");
          setBiyografi(instaData?.biography || "");
          setFollowers(instaData?.followers_count || "");

          setTiktokPicture(tiktok?.profile_picture_url || "");
          setTiktokGonderi(tiktok?.video_count || "0");
          setTiktokBiyografi(tiktok?.biography || "");
          setTiktokFollowers(tiktok?.followers_count || "0");
          setTiktokUsername(tiktok?.username || "");
        }
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description: "Profil bilgileri alınamadı. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      });
  }, [toast]);

  
  const handleDeleteAccount = () => {
    

    if (!deleteFeedback.trim()) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen silme nedeninizi açıklayın.",
        variant: "destructive",
      });

      return;
    }

    setIsDelete(true);

    axios
      .delete(`${baseUrl}/api/delete-user`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || '""',
          )}`,
          Accept: "application/json",
        },
        data: {
          reason: deleteReason,
          feedback: deleteFeedback.trim() || null,
        },
      })
      .then((response) => {
        toast({
          title: "Hesap silme işlemi başlatıldı",
          description:
            "Hesabınız ve ilişkili verileriniz 30 gün sonra kalıcı olarak silinecektir.",
        });

        localStorage.clear();
        navigate("/signin");
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description:
            error.response?.data?.message ||
            "Hesap silme işlemi başlatılamadı.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsDelete(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getProfile(), getCategory()]).finally(() => setLoading(false));
  }, [getProfile, getCategory]);

  if (loading) {
    return <ShimmerProfile />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#fef7ff" }}
    >
      <InfluencerNavbar />
      <main className="flex-grow flex flex-col items-center justify-center py-8">
        <div style={{ width: "100%", maxWidth: "800px", padding: "0 24px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Profil Ayarları
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Kişisel Bilgiler
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Ad
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Soyad
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                className="mt-3"
              >
                <label style={{ fontSize: "14px", fontWeight: "500" }}>
                  E-posta
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-4 mt-3">
                <label
                  htmlFor="uploadImage"
                  className="text-sm font-medium block"
                >
                  Profil görseli yükle
                </label>

                {/* Wrap entire drop zone with a label */}
                <label
                  htmlFor="uploadImage"
                  className="cursor-pointer border border-dashed border-border rounded-lg p-8 text-center block"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <rect
                        width="18"
                        height="18"
                        x="3"
                        y="3"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>

                    <div className="text-sm text-muted-foreground mt-2">
                      Görselinizi buraya sürükleyip bırakın.
                      <br />
                      VEYA herhangi bir yere tıklayarak seçin
                    </div>
                  </div>
                </label>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="uploadImage"
                  name="img"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {img ? (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-full mx-auto"
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    <img
                      src={imageURL + "/" + image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-full mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Instagram Bilgileri
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label style={{ fontSize: "14px", fontWeight: "500" }}>
                  Instagram Görseli
                </label>
                {profilePic ? (
                  <img
                    src={profilePic || "https://placehold.co/400x400"}
                    alt="Profil"
                    width={100}
                    className="rounded"
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: "#f0dff5",
                      borderRadius: "8px",
                    }}
                  ></div>
                )}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    İnstagram Kullanıcısı Adı
                  </label>
                  <Input
                    disabled
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Biyografi
                  </label>
                  <Input
                    disabled
                    value={biography}
                    onChange={(e) => setBiyografi(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Gönderi İnstagram Hesabi{" "}
                  </label>
                  <Input
                    disabled
                    value={post}
                    onChange={(e) => setGonderi(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Takipçiler
                  </label>
                  <Input
                    disabled
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                  />
                </div>

                <div className="py-2 flex items-center justify-between gap-3">
                  <Badge
                    variant={
                      approvedInstagram === "accept" ? "default" : "destructive"
                    }
                    className="text-sm font-medium w-fit whitespace-nowrap px-3 py-1"
                  >
                    {approvedInstagram === "accept"
                      ? "İnstagram Hesap Onaylandı"
                      : approvedInstagram === "reject"
                      ? "Instagram Hesabi Reddedildi"
                      : approvedInstagram === "connect"
                      ? "Instagram Hesabi Beklemede"
                      : "İnstagram Hesabı Bağlı Değil"}
                  </Badge>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                TikTok Bilgileri
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label style={{ fontSize: "14px", fontWeight: "500" }}>
                  TikTok Resmi Hesap
                </label>
                {tiktokPicture ? (
                  <img
                    src={tiktokPicture || "https://placehold.co/400x400"}
                    alt="Profil"
                    width={100}
                    className="rounded"
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: "#f0dff5",
                      borderRadius: "8px",
                    }}
                  ></div>
                )}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    TikTok Kullanici Adı
                  </label>
                  <Input
                    disabled
                    value={tiktokUsername}
                    onChange={(e) => setTiktokUsername(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Biyografi
                  </label>
                  <Input
                    disabled
                    value={tiktokBiyografi}
                    onChange={(e) => setTiktokBiyografi(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Gonderi
                  </label>
                  <Input
                    disabled
                    value={tiktokGonderi}
                    onChange={(e) => setTiktokGonderi(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Takipçiler
                  </label>
                  <Input
                    disabled
                    value={tiktokFollowers}
                    onChange={(e) => setTiktokFollowers(e.target.value)}
                  />
                </div>

                <div className="py-2 flex items-center justify-between gap-3">
                  <Badge
                    variant={
                      approvedTiktok === "accept" ? "default" : "destructive"
                    }
                    className="text-sm font-medium w-fit whitespace-nowrap px-3 py-1"
                  >
                    {approvedTiktok === "accept"
                      ? "TikTok Hesap Onaylandı"
                      : approvedTiktok === "reject"
                      ? "TikTok Hesabi Reddedildi"
                      : approvedTiktok === "connect"
                      ? "TikTok Hesabi Beklemede"
                      : " TikTok Hesabi Bagli Degil"}
                  </Badge>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Kategoriler
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <Select
                    onValueChange={setNewCategory}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori Seç" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moda ve Giyim">
                        Moda ve Giyim
                      </SelectItem>

                      <SelectItem value="Güzellik ve Kişisel Bakım">
                        Güzellik ve Kişisel Bakım
                      </SelectItem>
                      <SelectItem value="Teknoloji ve Elektronik">
                        Teknoloji ve Elektronik
                      </SelectItem>
                      <SelectItem value="Sağlık ve Fitness">
                        Sağlık ve Fitness
                      </SelectItem>
                      <SelectItem value="Yiyecek ve İçecek">
                        Yiyecek ve İçecek
                      </SelectItem>
                      <SelectItem value="Eğitim ve Kariyer">
                        Eğitim ve Kariyer
                      </SelectItem>
                      <SelectItem value="Anne ve Bebek">
                        Anne ve Bebek
                      </SelectItem>
                      <SelectItem value="Evcil Hayvan Bakımı ve Ürünleri">
                        Evcil Hayvan Bakımı ve Ürünleri
                      </SelectItem>
                      <SelectItem value="Yemek Tarifleri ve Restoranlar">
                        Yemek Tarifleri ve Restoranlar
                      </SelectItem>
                      <SelectItem value="Sürdürülebilir Ürünler">
                        Sürdürülebilir Ürünler
                      </SelectItem>
                      <SelectItem value="Spor ve Açık Hava Etkinlikleri">
                        Spor ve Açık Hava Etkinlikleri
                      </SelectItem>
                      <SelectItem value="Lüks ve Premium Ürünler">
                        Lüks ve Premium Ürünler
                      </SelectItem>
                      <SelectItem value="Telekomünikasyon">
                        Telekomünikasyon
                      </SelectItem>
                      <SelectItem value="Takviyeler ve Vitaminler">
                        Takviyeler ve Vitaminler
                      </SelectItem>
                      <SelectItem value="Temizlik ve Hijyen Ürünleri">
                        Temizlik ve Hijyen Ürünleri
                      </SelectItem>
                      <SelectItem value="Gayrimenkul">Gayrimenkul</SelectItem>
                      <SelectItem value="Bireysel ve Mesleki Eğitim">
                        Bireysel ve Mesleki Eğitim
                      </SelectItem>
                      <SelectItem value="Kişisel Gelişim ve Zindelik">
                        Kişisel Gelişim ve Zindelik
                      </SelectItem>
                      <SelectItem value="Sanat ve El Sanatları">
                        Sanat ve El Sanatları
                      </SelectItem>
                      <SelectItem value="Çocuk ve Gençlik Ürünleri">
                        Çocuk ve Gençlik Ürünleri
                      </SelectItem>
                      <SelectItem value="Lunaparklar ve Oyun Alanları">
                        Lunaparklar ve Oyun Alanları
                      </SelectItem>
                      <SelectItem value="Online Eğitim ve Dijital Kurslar">
                        Online Eğitim ve Dijital Kurslar
                      </SelectItem>
                      <SelectItem value="Tarım ve Hayvancılık">
                        Tarım ve Hayvancılık
                      </SelectItem>
                      <SelectItem value="Yeşil Enerji ve Yenilenebilir Çözümler">
                        Yeşil Enerji ve Yenilenebilir Çözümler
                      </SelectItem>
                      <SelectItem value="Çevre Dostu Ürünler ve Geri Dönüşüm">
                        Çevre Dostu Ürünler ve Geri Dönüşüm
                      </SelectItem>
                      <SelectItem value="Mücevher ve Aksesuarlar">
                        Mücevher ve Aksesuarlar
                      </SelectItem>
                      <SelectItem value="İş ve Ofis Ürünleri">
                        İş ve Ofis Ürünleri
                      </SelectItem>

                      <SelectItem value="Yazılım ve Mobil Uygulamalar">
                        Yazılım ve Mobil Uygulamalar
                      </SelectItem>

                      <SelectItem value="Fotoğrafçılık ve Görsel Medya">
                        Fotoğrafçılık ve Görsel Medya
                      </SelectItem>
                      <SelectItem value="Diğer">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="text-white"
                    type="button"
                    onClick={handleAddCategory}
                    disabled={isSubmitting || !newCategory}
                  >
                    Ekle
                  </Button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {categories.length > 0 ? (
                    categories.map((category, key) => (
                      <div
                        key={key}
                        style={{
                          backgroundColor: "#f9edfc",
                          padding: "4px 12px",
                          borderRadius: "16 Angled at 45deg",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {category.title}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(category.id)}
                          style={{
                            border: "none",
                            background: "none",
                            padding: "0",
                            cursor: "pointer",
                          }}
                          disabled={isSubmitting}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Henuz kategori eklenmedi.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Adres
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Sokak Adresi</label>
                  <Input value={street} onChange={(e) => setStreet(e.target.value)} disabled={isSubmitting} />
                </div> */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>
                      Şehir
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Eyalet/Il</label>
                    <Input value={state} onChange={(e) => setState(e.target.value)} disabled={isSubmitting} />
                  </div> */}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>
                      Ülke
                    </label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>
                      İletişim Numarası
                    </label>
                    <Input
                      type="number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Daire Numarasi</label>
                    <Input value={unit} onChange={(e) => setUnit(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Posta Kodu</label>
                    <Input value={postalCode} onChange={(e) => setGonderialCode(e.target.value)} disabled={isSubmitting} />
                  </div>
                </div> */}

                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-white bg-dark"
                  style={{ alignSelf: "end", minWidth: "200px" }}
                  disabled={isDelete}
                >
                  {isDelete ? "Hesabı Sil..." : "Hesabı Sil"}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="text-white bg-dark"
              style={{ alignSelf: "center", minWidth: "200px" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      

            <p className="mt-3 text-sm leading-6 text-gray-600">
             30 gün içinde hesabınıza giriş yapmazsanız, hesabınız ve ilişkili tüm verileriniz kalıcı olarak silinecektir.
            </p>

            <div className="mt-4 space-y-4">
             
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Eklemek istediğiniz başka bir şey var mı?
                </label>

                <textarea
                  value={deleteFeedback}
                  onChange={(event) => setDeleteFeedback(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Deneyiminizi geliştirmemize yardımcı olacak görüşlerinizi paylaşın..."
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  disabled={isDelete}
                />

                <div className="mt-1 text-right text-xs text-gray-500">
                  {deleteFeedback.length}/1000
                </div>
              </div>
            </div>

             <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-100 text-gray-900 hover:bg-gray-200"
              disabled={isDelete}
            >
              Vazgeç
            </Button>

            <Button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDelete}
            >
              {isDelete ? "Hesap siliniyor..." : "Evet, Sil"}
            </Button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
