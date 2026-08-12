import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const faqItems = [
  {
    question: "Erfluencer'ı diğer influencer marketing platformlarından ayıran nedir?",
    answer:
      "Platformumuz, marka hedefleriyle uyumlu içerik üreticilerini akıllı eşleştirme sistemiyle önerir. Amaç, hem marka hem influencer için adil kazanç ve sürdürülebilir iş birliği kurmaktır.",
  },
  {
    question: "Ücretler nasıl belirleniyor?",
    answer:
      "Her bütçeye uygun kampanya kurgusu oluşturabilirsiniz. Marka ölçeği ne olursa olsun, hedef kitlenize uygun bir influencer yapısı ile planlama yapılabilir.",
  },
  {
    question: "Kampanyalarda üretilen içeriklerin sahibi kimdir?",
    answer:
      "İçerik sahipliği her kampanya sözleşmesinde net olarak belirtilir. Genel akışta içerik üreticisi telif hakkını korur, marka ise mutabık kalınan kullanım haklarına sahip olur.",
  },
  {
    question: "İçerik onay süreci nasıl işliyor?",
    answer:
      "İçerik üreticisi taslağını platforma yükler, marka geri bildirim verir ve onay sonrası içerik planlanan takvime göre yayına alınır. Süreç şeffaf şekilde panelden izlenir.",
  },
  {
    question: "Marka kampanya başarısını nasıl ölçer?",
    answer:
      "Erişim, etkileşim, tıklanma, dönüşüm ve ROI metrikleri tek panelde takip edilir. Raporlar sayesinde kampanya performansı net şekilde karşılaştırılabilir.",
  },
];

const CollapsibleFAQSection = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute left-0 top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="pr-0 md:pr-12"
          >
            <p className="mb-4 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Sıkça Sorulan Sorular
            </p>
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
              Tüm soruların için net cevaplar.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Platform, kampanya süreci ve işleyiş hakkında en çok merak edilenler burada.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-morph rounded-2xl p-6"
              >
                <Collapsible
                  open={openItems[index] || false}
                  onOpenChange={() => toggleItem(index)}
                  className="w-full"
                >
                  <div className="flex justify-between">
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-left font-semibold text-foreground">
                      <span className="pr-6">{item.question}</span>
                      {openItems[index] ? (
                        <Minus className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      ) : (
                        <Plus className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      )}
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pt-4 text-sm leading-6 text-muted-foreground">
                    {item.answer}
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollapsibleFAQSection;
