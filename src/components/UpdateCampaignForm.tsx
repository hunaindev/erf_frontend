import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baseUrl, imageUrl } from '@/utils/constants';

interface CampaignFormProps {

    onClose: () => void;
    open: boolean;
    data: [];
}

const UpdateCampaignForm: React.FC<CampaignFormProps> = ({ onClose, open, data }) => {

    const navigate = useNavigate();
    const [campaignName, setCampaignName] = useState('');
    const [promotionalCode, setPromotionalCode] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [image, setImage] = useState('');
    const [productType, setProductType] = useState('');
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [goal, setGoal] = useState('');
    const [brand, setBrand] = useState('');
    const [getBrand, setGetBrand] = useState('');
    const [createCampaignDialogOpen, setCreateCampaignDialogOpen] = useState(false);
    const [requirements, setRequirements] = useState('Kampanya gereksinimlerini buraya yazın.');
    const [id, setId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [contentType, setContentType] = useState<string[]>(["Post"]);
    const [mode, setMode] = useState<"online" | "physical">("online");
    const touchFieldClass = "h-12 rounded-xl border-slate-200 bg-white px-4 text-base";
    const touchSelectClass = "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base";

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

    useEffect(() => {
        if (data?.content_type) {
            try {

                const parsed = JSON.parse(data?.content_type);
                setContentType(Array.isArray(parsed) ? parsed : []);
            } catch {
                setContentType([]);
            }
        }
    }, [data?.content_type]);

    useEffect(() => {
        if (data) {
            setCategory(data?.category || "");
            setCampaignName(data?.name || "");
            setPromotionalCode(data?.codes || "");
            setHashtags(data?.hashtags || "");
            setGoal(data?.goals || "");
            setRequirements(data?.requirements || "");
            setBrand(data?.brand_id || "");
            setProductType(data?.product_type || "");
            setMode(data?.mode || "");
            setId(data?.id || "");

            const start = data?.start_date || "";
            const end = data?.end_date || "";

            setStartDate(convertToInputDate(start));
            setEndDate(convertToInputDate(end));

    
        }
    }, [data]);

    function convertToInputDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date guard
        return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };
    const handleGetMarkalar = async () => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/get-brands`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },
            withCredentials: true
        };

        axios.request(config)
            .then((response) => {

                setGetBrand(response.data.brand)

            }).catch((error) => {

                console.log(error);

            });
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // prevent page reload
        setIsSubmitting(true);


        const data = JSON.stringify({
            "name": campaignName,
            "codes": promotionalCode,
            "goal": goal,
            "start_date": startDate,
            "end_date": endDate,
            "category": category,
            "hashtags": hashtags,
            "requirements": requirements,
            "brand_id": brand,
            "image": image,
            "id": id,
            "content_type": contentType,
            "product_type": productType,
            "mode": mode

        });
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", data);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/update-campaigns`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,

            },
            data: formData
        };

        axios.request(config)
            .then((response) => {
                if (response.data.msg == 'error') {
                    toast({
                        title: 'Görsel alanı zorunludur. Yalnızca JPG veya PNG formatlarına izin verilir.',
                        variant: "destructive",
                    });
                    setIsSubmitting(false);
                } else {
                    setIsSubmitting(false);
                    setTimeout(() => {

                        onClose();
                        toast({
                            title: "Kampanya güncellendi",

                        });
                    }, 1500);
                }

            })
            .catch((error) => {
                console.log(error);
                setIsSubmitting(false);
            });

    };
    useEffect(() => {
        handleGetMarkalar()
    }, [])
    

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[calc(100%-1rem)] max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border-0 bg-white px-4 pt-4 pb-0 shadow-2xl sm:max-h-[90vh] sm:p-6">
                <DialogHeader className="border-b border-slate-100 pb-4">
                    <DialogTitle className="text-xl">KAMPANYAYI DÜZENLE </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-1 pb-0 sm:space-y-6">
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="campaignName" className="text-sm font-medium">Kampanya Adı</label>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                </div>
                                <Input
                                    required
                                    id="id"
                                    type='hidden'
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
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
                                <div className="flex items-center gap-2">
                                    <label htmlFor="promotionalCode" className="text-sm font-medium">Promosyon Kodları</label>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                </div>
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
                                <div className="flex items-center gap-2">
                                    <label htmlFor="hashtags" className="text-sm font-medium">Gerekli Hedefler</label>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                </div>
                                <Input
                                    required
                                    id="goal"
                                    placeholder="Hedefleri girin ve Enter'a basın..."
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className={touchFieldClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="hashtags" className="text-sm font-medium">Gerekli Hashtag'ler</label>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                </div>
                                <Input
                                    required
                                    id="hashtags"
                                    placeholder="Hashtag'i girin ve Enter'a basın..."
                                    value={hashtags}
                                    onChange={(e) => setHashtags(e.target.value)}
                                    className={touchFieldClass}
                                />

                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium block">Kategori Seç</label>

                                   

                                    <select
                                        name="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        className={touchSelectClass}
                                    >
                                        <option value="">Kategori seçin</option>
                  <option value="Moda ve Giyim">Moda ve Giyim</option>
                  <option value="Güzellik ve Kişisel Bakım">Güzellik ve Kişisel Bakım</option>
                  <option value="Teknoloji ve Elektronik">Teknoloji ve Elektronik</option>
                  <option value="Sağlık ve Fitness">Sağlık ve Fitness</option>
                  <option value="Yiyecek ve İçecek">Yiyecek ve İçecek</option>
                  <option value="Eğitim ve Kariyer">Eğitim ve Kariyer</option>
                  <option value="Anne ve Bebek">Anne ve Bebek</option>
                  <option value="Evcil Hayvan Bakımı ve Ürünleri">Evcil Hayvan Bakımı ve Ürünleri</option>
                  <option value="Yemek Tarifleri ve Restoranlar">Yemek Tarifleri ve Restoranlar</option>
                  <option value="Sürdürülebilir Ürünler">Sürdürülebilir Ürünler</option>
                  <option value="Spor ve Açık Hava Etkinlikleri">Spor ve Açık Hava Etkinlikleri</option>
                  <option value="Lüks ve Premium Ürünler">Lüks ve Premium Ürünler</option>
                  <option value="Telekomünikasyon">Telekomünikasyon</option>
                  <option value="Takviyeler ve Vitaminler">Takviyeler ve Vitaminler</option>
                  <option value="Temizlik ve Hijyen Ürünleri">Temizlik ve Hijyen Ürünleri</option>
                  <option value="Gayrimenkul">Gayrimenkul</option>
                  <option value="Bireysel ve Mesleki Eğitim">Bireysel ve Mesleki Eğitim</option>
                  <option value="Kişisel Gelişim ve Zindelik">Kişisel Gelişim ve Zindelik</option>
                  <option value="Sanat ve El Sanatları">Sanat ve El Sanatları</option>
                  <option value="Çocuk ve Gençlik Ürünleri">Çocuk ve Gençlik Ürünleri</option>
                  <option value="Lunaparklar ve Oyun Alanları">Lunaparklar ve Oyun Alanları</option>
                  <option value="Online Eğitim ve Dijital Kurslar">Online Eğitim ve Dijital Kurslar</option>
                  <option value="Tarım ve Hayvancılık">Tarım ve Hayvancılık</option>
                  <option value="Yeşil Enerji ve Yenilenebilir Çözümler">Yeşil Enerji ve Yenilenebilir Çözümler</option>
                  <option value="Çevre Dostu Ürünler ve Geri Dönüşüm">Çevre Dostu Ürünler ve Geri Dönüşüm</option>
                  <option value="Mücevher ve Aksesuarlar">Mücevher ve Aksesuarlar</option>
                  <option value="İş ve Ofis Ürünleri">İş ve Ofis Ürünleri</option>
                  <option value="Yazılım ve Mobil Uygulamalar">Yazılım ve Mobil Uygulamalar</option>
                  <option value="Fotoğrafçılık ve Görsel Medya">Fotoğrafçılık ve Görsel Medya</option>
                  <option value="Diğer">Diğer</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium block">Marka Seç</label>
                                   

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
                                    <label htmlFor="start-date" className="text-sm font-medium block">Başlangıç Tarihi</label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        name='start-date'
                                        className={touchSelectClass}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />

                                    <label htmlFor="end-date" className="text-sm font-medium block">Bitiş Tarihi</label>
                                    <input
                                        value={endDate}
                                        type="date"
                                        id="end-date"
                                        className={touchSelectClass}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="productType" className="text-sm font-medium block">Ürün Tipi *</label>

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
                        </div>

                        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                            <label htmlFor="campaignImage" className="text-sm font-medium block">Kampanya Görseli Ekle</label>
                                    <div className="rounded-2xl border border-dashed border-border p-6 text-center sm:p-8">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                        <circle cx="9" cy="9" r="2"></circle>
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                    </svg>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        Görselinizi buraya sürükleyip bırakın.
                                        <br />
                                        VEYA
                                        <br />
                                        <span className="text-primary cursor-pointer hover:underline">Gözat <input type="file" name="img" id="img" required={true}

                                            onChange={handleFileChange} accept="image/*" /></span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Kabul edilen görsel türleri: yalnızca JPG ve PNG</p>

                            <img src={`${imageUrl}/${data?.image}`} alt="" width={200} />
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-center gap-2">
                            <label htmlFor="requirements" className="text-sm font-medium">Kampanya Gereksinimleri</label>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                        </div>

                        <div className="rounded-2xl border border-border p-2">
                            <div className="flex flex-wrap items-center gap-2 p-1 border-b border-border">
                                <button className="p-1 hover:bg-muted rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button className="p-1 hover:bg-muted rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 3h12"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                                <div className="h-4 border-r border-border mx-1"></div>
                                <button className="p-1 hover:bg-muted rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                </button>
                                <button className="p-1 hover:bg-muted rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            <span className="text-xs text-muted-foreground">Karakter sayısı: {requirements.length} / 2000</span>
                        </div>
                    </div>

                    <div className="sticky bottom-0 z-10 -mx-4 mt-6 mb-0 -mr-4 -ml-4 space-y-4 border-t border-slate-100 bg-white px-4 pt-4 pb-4 shadow-[0_-12px_24px_-20px_rgba(15,23,42,0.28)] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:shadow-none">

                        <Button className="h-12 w-full rounded-xl bg-[hsl(var(--primary-ink))] text-sm font-semibold text-white hover:bg-[hsl(var(--primary-deep))]" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Kampanya güncelleniyor..." : "Kampanyayı Güncelle"}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            * Kampanyayı başlatarak
                            <span className="text-primary cursor-pointer hover:underline ml-1">İçerik Kuralları ve Şartlarını</span>
                            kabul etmiş olursunuz.
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateCampaignForm;
