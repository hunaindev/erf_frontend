import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingTiers = [
  {
    name: "Başlangıç",
    price: "₺0",
    period: "/ aylık",
    popular: false,
    features: [
      "Erken katılan markalar için",
      "Sınırsız kampanya oluşturma",
      "Influencer ve kampanya yönetimi",
      "Temel performans takibi",
      "Platforma tam erişim",
      "Kendi kendine yönetim",
    ],
  },
  {
    name: "Profesyonel",
    price: "₺1,999",
    period: "/ aylık",
    popular: true,
    features: [
      "Başlangıç paketindeki tüm özellikler",
      "Influencer seçimi ve onay süreci",
      "Özel 'All Star' influencer erişimi",
      "Marka hesap yöneticisi",
      "Uçtan uca kampanya kurulumu ve yönetimi",
      "Kampanya iletişimi ve süreç takibi",
      "Performans optimizasyonu",
      "Öncelikli müşteri desteği",
    ],
  },
  {
    name: "Ajans",
    price: "Özel fiyat",
    period: "",
    popular: false,
    features: [
      "Birden fazla marka yöneten ajanslar için",
      "Profesyonel paketteki tüm özellikler",
      "Çoklu marka yönetimi",
      "Ajansa özel panel yapısı",
      "Kampanya önceliği",
      "Esnek ve ölçeklenebilir fiyatlandırma",
      "Randevu ve ihtiyaç analizi",
    ],
  },
];

const PricingSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-4 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Fiyatlandırma
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Uygun fiyata güçlü bir pazarlama altyapısı.
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => {
            const isFeatured = tier.popular;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  className={`h-full rounded-3xl border transition-transform ${
                    isFeatured
                      ? "border-primary/30 bg-[hsl(var(--primary-ink))] text-white shadow-[0_22px_60px_-28px_hsl(var(--primary-ink)/0.6)]"
                      : "border-primary/20 bg-card text-card-foreground"
                  }`}
                >
                  <CardHeader className="pb-0 pt-7 text-center">
                    {isFeatured && (
                      <div className="mb-3">
                        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-white">
                          Popüler
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                  </CardHeader>

                  <CardContent className="pt-5">
                    <div className="mb-6 text-center">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className={`text-sm ${isFeatured ? "text-white/70" : "text-muted-foreground"}`}>
                        {tier.period}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span className={isFeatured ? "text-white/90" : "text-foreground/90"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-7 pt-6">
                    <Button
                      variant={isFeatured ? "default" : "outline"}
                      className={`w-full rounded-full py-6 text-sm font-semibold ${
                        isFeatured
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-primary/30 bg-background hover:bg-primary/10"
                      }`}
                      onClick={() => {
                        navigate("/demo");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Demo Talep Et
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
