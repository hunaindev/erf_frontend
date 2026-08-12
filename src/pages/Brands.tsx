import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandLevel from "@/components/brand-level";
import Price from "@/components/pricing";
import SSS from "@/components/FAQSection";
import { Button } from "@/components/ui/button";

type SlideItem = {
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
  height: string;
  zIndex: number;
};

const phoneSlides: SlideItem[][] = [
  [
    {
      src: "/slider/1.png",
      alt: "Campaign screen 1",
      left: "0%",
      top: "0%",
      width: "220px",
      height: "350px",
      zIndex: 1,
    },
    {
      src: "/slider/2.png",
      alt: "Campaign screen 2",
      left: "30%",
      top: "20%",
      width: "220px",
      height: "350px",
      zIndex: 2,
    },
    {
      src: "/slider/3.png",
      alt: "Campaign screen 3",
      left: "55%",
      top: "0%",
      width: "220px",
      height: "350px",
      zIndex: 3,
    },
    {
      src: "/slider/4.png",
      alt: "Campaign screen 4",
      left: "80%",
      top: "20%",
      width: "220px",
      height: "350px",
      zIndex: 4,
    },
  ],
  [
    {
      src: "/slider/5.png",
      alt: "Campaign screen 5",
      left: "0%",
      top: "0%",
      width: "230px",
      height: "350px",
      zIndex: 1,
    },
    {
      src: "/slider/6.png",
      alt: "Campaign screen 6",
      left: "30%",
      top: "20%",
      width: "200px",
      height: "350px",
      zIndex: 2,
    },
    {
      src: "/slider/7.png",
      alt: "Campaign screen 7",
      left: "55%",
      top: "0%",
      width: "220px",
      height: "350px",
      zIndex: 3,
    },
    {
      src: "/slider/8.png",
      alt: "Campaign screen 8",
      left: "80%",
      top: "20%",
      width: "220px",
      height: "350px",
      zIndex: 4,
    },
  ],
];

const proofCards = [
  {
    title: "10K+",
    subtitle: "Influencer",
    description:
      "Türkiye genelinde farklı kategorilerde ve hedef kitlelerde içerik üreticisi ağı.",
  },
  {
    title: "Aylık",
    subtitle: "Sözleşmesiz",
    description:
      "Uzun vadeli taahhüt yok. İhtiyacın olduğu kadar kampanya yürütebilirsin.",
  },
  {
    title: "Tam",
    subtitle: "Hesap Yönetimi",
    description:
      "Günlük operasyonları ve kampanya süreçlerini yöneten özel hesap yöneticisi.",
  },
  {
    title: "25+",
    subtitle: "Sektör ve İlgi Alanı",
    description:
      "Yiyecekten fitnese kadar birden fazla sektörde doğru influencer eşleşmesi.",
  },
];

const features = [
  {
    title: "İçerik üreticilerinin severek katıldığı kampanyalar kur",
    description:
      "Ürün ve hizmetinle gerçekten ilgilenen profilleri hedefle, tek seferlik paylaşım yerine uzun vadeli iş birlikleri oluştur.",
    image: "/3.jpeg",
  },
  {
    title: "Kampanya ve etkileşim yönetimi tek ekranda",
    description:
      "Mevcut ve geçmiş kampanya performansını aynı panelde izle, veriye dayalı kararlarla bütçeni daha verimli yönet.",
    image: "/11.jpeg",
  },
  {
    title: "Uçtan uca kampanya operasyonu",
    description:
      "Akıllı eşleştirme altyapısı ile markan için en uygun üreticilere hızlı ulaş, operasyonu daha planlı yürüt.",
    image: "/17.jpeg",
  },
];

const Brands: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 1024);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }
    const id = location.hash.replace("#", "");
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "start" }), 90);
  }, [location]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === phoneSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? phoneSlides.length - 1 : prev - 1));

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10">
        <section className="container px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-sm font-medium text-primary"
              >
                Markalar ve Ajanslar için Erfluencer
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl font-bold leading-tight text-foreground sm:text-5xl"
              >
                Influencer odaklı içerik pazarlaması artık daha hızlı ve ölçülebilir.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
              >
                Erfluencer ile markan doğru içerik üreticileriyle buluşur, kampanyaların tek
                panelden yönetilir, performansın net raporlanır.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button
                  className="rounded-full px-8 py-6 text-base"
                  onClick={() => {
                    navigate("/demo");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Ürün Demosu Talep Et
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/30 px-8 py-6 text-base"
                  onClick={() => {
                    navigate("/brand-signup");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Ücretsiz Başla
                </Button>
              </motion.div>

              <motion.div
                id="platform-video"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 rounded-2xl border border-primary/20 bg-background/80 p-4"
              >
                <p className="text-sm text-muted-foreground">Kısa tanıtım videosu</p>
                <div className="mt-3 overflow-hidden rounded-xl">
                  <iframe
                    width="100%"
                    height="380"
                    src="https://www.youtube.com/embed/VEmM4tJHvgo?start=28"
                    title="Erfluencer tanıtım videosu"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="glass-morph rounded-[2rem] p-4 sm:p-6"
            >
              <div className="overflow-hidden rounded-2xl border border-primary/15">
                <img
                  src="/1.png"
                  alt="Brand dashboard visual"
                  className="h-full w-full object-cover"
                />
              </div>

            </motion.div>
          </div>
        </section>

        <section className="container px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {proofCards.map((card, index) => (
              <motion.article
                key={card.subtitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.35 }}
                className="glass-morph rounded-3xl p-6"
              >
                <h2 className="text-2xl font-bold text-foreground">{card.title}</h2>
                <p className="mt-1 text-sm font-semibold text-primary">{card.subtitle}</p>
                <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="container px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.25 }}
                className="glass-morph grid items-center gap-6 rounded-[2rem] p-5 sm:p-8 lg:grid-cols-2"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={`h-full max-h-[380px] w-full rounded-2xl object-cover ${
                    index % 2 === 1 ? "lg:order-2" : ""
                  }`}
                />
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{feature.title}</h3>
                  <p className="mt-4 text-muted-foreground">{feature.description}</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-foreground/90">
                      <CheckCircle2 size={18} className="text-primary" />
                      Doğru influencer eşleştirmesi
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground/90">
                      <CheckCircle2 size={18} className="text-primary" />
                      Kolay operasyon takibi
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground/90">
                      <CheckCircle2 size={18} className="text-primary" />
                      Ölçülebilir performans raporları
                    </li>
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="Infulencer" className="mt-16 bg-black/95 py-20 text-white">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                  Influencer Ağı
                </p>
                <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
                  Büyüyen influencer ekosisteminde markan için doğru iş birliklerini keşfet.
                </h2>
                <p className="mt-5 max-w-2xl text-white/75">
                  Platform içinde onay süreci, kampanya iletişimi ve yayın takibi tek bir
                  operasyon akışıyla ilerler. Boyutu ne olursa olsun her marka için uygun bir
                  içerik üreticisi bulunur.
                </p>
                <Button
                  className="mt-8 rounded-full bg-white px-8 py-6 text-base font-semibold text-[hsl(var(--primary-deep))] hover:bg-white/90"
                  onClick={() => {
                    navigate("/influencer-signup");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Bekleme Listesine Katıl
                </Button>
              </div>

              <div className="flex justify-end gap-3 lg:-mt-10">
                <button
                  type="button"
                  aria-label="Previous influencer slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-colors hover:bg-white/10"
                  onClick={prevSlide}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next influencer slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-colors hover:bg-white/10"
                  onClick={nextSlide}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className="relative mt-8 h-[500px] overflow-hidden">
              {phoneSlides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    currentSlide === slideIndex ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  style={{
                    display: isMobile ? "flex" : undefined,
                    alignItems: isMobile ? "center" : undefined,
                    justifyContent: isMobile ? "center" : undefined,
                  }}
                >
                  {(isMobile ? [slide[0]] : slide).map((phone) => (
                    <div
                      key={phone.src}
                      className="absolute"
                      style={{
                        position: isMobile ? "relative" : "absolute",
                        left: isMobile ? undefined : phone.left,
                        top: isMobile ? undefined : phone.top,
                        zIndex: phone.zIndex,
                        width: isMobile ? "100%" : undefined,
                        display: isMobile ? "flex" : undefined,
                        justifyContent: isMobile ? "center" : undefined,
                      }}
                    >
                      <div
                        className="rounded-3xl p-1"
                        style={{
                          width: isMobile ? "min(340px, calc(100vw - 64px))" : phone.width,
                          textAlign: "center",
                          margin: isMobile ? "0 auto" : undefined,
                        }}
                      >
                        <img
                          src={phone.src}
                          alt={phone.alt}
                          className="h-auto w-full rounded-3xl object-contain"
                          style={{
                            height: isMobile ? "auto" : phone.height,
                            maxHeight: isMobile ? "420px" : undefined,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BrandLevel />
      <Price />
      <SSS />
      <Footer />
    </div>
  );
};

export default Brands;
