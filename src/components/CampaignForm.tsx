import React, { useState, useEffect, useCallback,useRef  } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { baseUrl } from "@/utils/constants";

interface CampaignFormProps {
  onClose: () => void;
  open: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose, open }) => {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState("");
  const [productType, setProductType] = useState("");
  const [promotionalCode, setPromotionalCode] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState("");
  const [brand, setBrand] = useState("");
  const [getBrand, setGetBrand] = useState("");
  const [contentType, setContentType] = useState<string[]>(["Post"]);
  const [requirements, setRequirements] = useState(
    "Kampanya gereksinimlerini buraya yazın.",
  );
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"online" | "physical">("online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const touchFieldClass =
    "h-12 rounded-xl border-slate-200 bg-white px-4 text-base";
  const touchSelectClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base";

  const handleContentTypeChange = (type: string) => {
    setContentType((prev) => {
      if (prev.includes(type)) {
        // agar sirf 1 hi item hai, to unselect na hone do
        if (prev.length === 1) return prev;

        // otherwise remove selected type
        return prev.filter((t) => t !== type);
      } else {
        // add new type
        return [...prev, type];
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setImage(file);
    } else {
      toast({
        title: "Geçersiz dosya türü",
        description: "Lütfen JPG veya PNG görsel yükleyin",
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file && ["image/jpeg", "image/png"].includes(file.type)) {
        setImage(file);
      } else {
        toast({
          title: "Geçersiz dosya türü",
          description: "Lütfen JPG veya PNG görsel yükleyin",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleGetMarkalar = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-brands`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("token") || "",
        )}`,
      },
      withCredentials: true,
    };

    try {
      const response = await axios.request(config);
      setGetBrand(response.data.brand);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = JSON.stringify({
      name: campaignName,
      codes: promotionalCode,
      goal,
      start_date: startDate,
      end_date: endDate,
      category,
      hashtags,
      requirements,
      brand,
      content_type: contentType,
      product_type: productType,
      mode: mode,
    });

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("data", data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/create-campaigns`,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("token") || "",
        )}`,
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
      if (response.data.msg === "error") {
        toast({
          title:
            "Görsel alanı zorunludur. Yalnızca JPG veya PNG formatlarına izin verilir.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      } else {
        if (response?.data?.user?.mode === 'physical') {
           setTimeout(() => {
          onClose();
        }, 1500);
        navigate(
          `/campaign-scheduling?data=${encodeURIComponent(
            JSON.stringify(response.data.user),
          )}`,
        );
        }else{
          onClose();
        }
       
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraft = async () => {
    const data = JSON.stringify({
      name: campaignName,
      codes: promotionalCode,
      goal,
      start_date: startDate,
      end_date: endDate,
      category,
      brand,
      hashtags,
      product_type: productType,
      mode: mode,
    });

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("data", data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/create-draft`,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("token") || "",
        )}`,
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
    } catch (error) {
      console.error(error);
    }
  };

  const wasOpenRef = useRef(false);

useEffect(() => {
  if (open) {
    wasOpenRef.current = true;
    return;
  }

  if (!wasOpenRef.current) return;

  wasOpenRef.current = false;
  handleDraft();
}, [open]);


  useEffect(() => {
    handleGetMarkalar();
  }, []);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border-0 bg-white px-4 pt-4 pb-0 shadow-2xl sm:max-h-[90vh] sm:p-6">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            Yeni Kampanya Oluştur
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 pt-1 pb-0 sm:space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="space-y-2">
                <label
                  htmlFor="campaignName"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Kampanya Adı
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </label>
                <Input
                  required
                  id="campaignName"
                  placeholder="Lezzet Şöleni"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className={touchFieldClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="promotionalCode"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Promosyon Kodları
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </label>
                <Input
                  required
                  id="promotionalCode"
                  placeholder="Promosyon kodu bilgilerinizi buraya girin..."
                  value={promotionalCode}
                  onChange={(e) => setPromotionalCode(e.target.value)}
                  className={touchFieldClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="goal"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Gerekli Hedefler
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </label>
                <Input
                  required
                  id="goal"
                  placeholder="Hedefleri girin..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={touchFieldClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hashtags"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Gerekli Etiketler
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </label>
                <Input
                  required
                  id="hashtags"
                  placeholder="Hashtag girin..."
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className={touchFieldClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium block">
                  Kategori Seç
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className={touchSelectClass}
                >
                  <option value="">Kategori seçin</option>
                  <option value="Moda ve Giyim">Moda ve Giyim</option>
                  <option value="Güzellik ve Kişisel Bakım">
                    Güzellik ve Kişisel Bakım
                  </option>
                  <option value="Teknoloji ve Elektronik">
                    Teknoloji ve Elektronik
                  </option>
                  <option value="Sağlık ve Fitness">Sağlık ve Fitness</option>
                  <option value="Yiyecek ve İçecek">Yiyecek ve İçecek</option>
                  <option value="Eğitim ve Kariyer">Eğitim ve Kariyer</option>
                  <option value="Anne ve Bebek">Anne ve Bebek</option>
                  <option value="Evcil Hayvan Bakımı ve Ürünleri">
                    Evcil Hayvan Bakımı ve Ürünleri
                  </option>
                  <option value="Yemek Tarifleri ve Restoranlar">
                    Yemek Tarifleri ve Restoranlar
                  </option>
                  <option value="Sürdürülebilir Ürünler">
                    Sürdürülebilir Ürünler
                  </option>
                  <option value="Spor ve Açık Hava Etkinlikleri">
                    Spor ve Açık Hava Etkinlikleri
                  </option>
                  <option value="Lüks ve Premium Ürünler">
                    Lüks ve Premium Ürünler
                  </option>
                  <option value="Telekomünikasyon">Telekomünikasyon</option>
                  <option value="Takviyeler ve Vitaminler">
                    Takviyeler ve Vitaminler
                  </option>
                  <option value="Temizlik ve Hijyen Ürünleri">
                    Temizlik ve Hijyen Ürünleri
                  </option>
                  <option value="Gayrimenkul">Gayrimenkul</option>
                  <option value="Bireysel ve Mesleki Eğitim">
                    Bireysel ve Mesleki Eğitim
                  </option>
                  <option value="Kişisel Gelişim ve Zindelik">
                    Kişisel Gelişim ve Zindelik
                  </option>
                  <option value="Sanat ve El Sanatları">
                    Sanat ve El Sanatları
                  </option>
                  <option value="Çocuk ve Gençlik Ürünleri">
                    Çocuk ve Gençlik Ürünleri
                  </option>
                  <option value="Lunaparklar ve Oyun Alanları">
                    Lunaparklar ve Oyun Alanları
                  </option>
                  <option value="Online Eğitim ve Dijital Kurslar">
                    Online Eğitim ve Dijital Kurslar
                  </option>
                  <option value="Tarım ve Hayvancılık">
                    Tarım ve Hayvancılık
                  </option>
                  <option value="Yeşil Enerji ve Yenilenebilir Çözümler">
                    Yeşil Enerji ve Yenilenebilir Çözümler
                  </option>
                  <option value="Çevre Dostu Ürünler ve Geri Dönüşüm">
                    Çevre Dostu Ürünler ve Geri Dönüşüm
                  </option>
                  <option value="Mücevher ve Aksesuarlar">
                    Mücevher ve Aksesuarlar
                  </option>
                  <option value="İş ve Ofis Ürünleri">
                    İş ve Ofis Ürünleri
                  </option>
                  <option value="Yazılım ve Mobil Uygulamalar">
                    Yazılım ve Mobil Uygulamalar
                  </option>
                  <option value="Fotoğrafçılık ve Görsel Medya">
                    Fotoğrafçılık ve Görsel Medya
                  </option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-medium block">
                  Marka Seç
                </label>

                <select
                  name="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className={touchSelectClass}
                >
                  <option value="">Bir Marka Seçin</option>
                  {Array.isArray(getBrand) &&
                    getBrand.map((item) => (
                      <option key={item.id} value={String(item.id)}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="start-date"
                  className="text-sm font-medium block"
                >
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  id="start-date"
                  className={touchSelectClass}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <label htmlFor="end-date" className="text-sm font-medium block">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  id="end-date"
                  className={touchSelectClass}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="productType"
                  className="text-sm font-medium block"
                >
                  Ürün Tipi *
                </label>

                <select
                  name="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  required
                  className={touchSelectClass}
                >
                  <option value="">Kampanya için ürün türünü seçiniz</option>

                  <option value="Fiziksel Ürün">Fiziksel Ürün</option>
                  <option value="Dijital Ürün">Dijital Ürün</option>
                  <option value="Mekan Tanıtımı">Mekan Tanıtımı</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">İçerik Türü</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="form-check rounded-xl border border-slate-200 px-4 py-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="post"
                      checked={contentType.includes("Post")}
                      onChange={() => handleContentTypeChange("Post")}
                    />
                    <label className="form-check-label" htmlFor="post">
                      Gönderi
                    </label>
                  </div>
                  <div className="form-check rounded-xl border border-slate-200 px-4 py-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="story"
                      checked={contentType.includes("Story")}
                      onChange={() => handleContentTypeChange("Story")}
                    />
                    <label className="form-check-label" htmlFor="story">
                      Hikaye
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  Toplantı Türü
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    htmlFor="online"
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                      mode === "online"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      id="online"
                      name="mode"
                      value="online"
                      checked={mode === "online"}
                      onChange={() => setMode("online")}
                    />

                    <span className="text-sm font-medium">Online</span>
                  </label>

                  <label
                    htmlFor="physical"
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                      mode === "physical"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      id="physical"
                      name="mode"
                      value="physical"
                      checked={mode === "physical"}
                      onChange={() => setMode("physical")}
                    />

                    <span className="text-sm font-medium">Fiziksel</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <label
                htmlFor="campaignImage"
                className="text-sm font-medium block"
              >
                Kampanya Görseli Ekle
              </label>
              <div
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-8 ${
                  isDragging ? "border-primary bg-primary/10" : "border-border"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
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
                  <div className="text-sm text-muted-foreground">
                    {image ? (
                      <p className="text-primary font-medium">{image.name}</p>
                    ) : (
                      <>
                        Görselinizi buraya sürükleyip bırakın
                        <br />
                        VEYA
                        <br />
                        <label className="text-primary cursor-pointer hover:underline inline-block mt-2">
                          Gözat
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Kabul edilen görsel türleri: yalnızca JPG ve PNG
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <label
              htmlFor="requirements"
              className="text-sm font-medium flex items-center gap-2"
            >
              Erfluencer Gereksinimleri
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </label>
            <div className="rounded-2xl border border-border p-2">
              <div className="flex flex-wrap items-center gap-2 p-1 border-b border-border">
                <button className="p-1 hover:bg-muted rounded">
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="p-1 hover:bg-muted rounded">
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
                    <path d="M6 3h12"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                <div className="h-4 border-r border-border mx-1"></div>
                <button className="p-1 hover:bg-muted rounded">
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
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
                <button className="p-1 hover:bg-muted rounded">
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
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3" y2="6"></line>
                    <line x1="3" y1="12" x2="3" y2="12"></line>
                    <line x1="3" y1="18" x2="3" y2="18"></line>
                  </svg>
                </button>
              </div>
              <Textarea
                required
                id="requirements"
                className="min-h-40 border-0 px-2 pt-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Karakter sayısı: {requirements.length} / 2000
              </span>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 mb-0 -mr-4 -ml-4 space-y-4 border-t border-slate-100 bg-white px-4 pt-4 pb-4 shadow-[0_-12px_24px_-20px_rgba(15,23,42,0.28)] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:shadow-none">
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[hsl(var(--primary-ink))] text-sm font-semibold text-white hover:bg-[hsl(var(--primary-deep))]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kampanya başlatılıyor..." : "Kampanyayı Başlat"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              * Kampanyayı başlatarak aşağıdaki
              <span className="text-primary cursor-pointer hover:underline ml-1">
                İçerik Şartları ve Koşullarını
              </span>
              kabul etmiş olursunuz.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignForm;
