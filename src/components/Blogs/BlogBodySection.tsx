import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function BlogBodySections() {
  return (
    <div className="mx-auto   pb-16">
      {/* Intro callout */}
      <div className="mt-6 border-l-4 border-primary bg-orange-50/40 px-4 py-3 text-sm leading-relaxed text-slate-700">
        2025'e yaklaşırken, web erişilebilirliği alanı benzeri görülmemiş bir
        hızla gelişiyor. Yeni teknolojiler, güncellenen standartlar ve artan
        farkındalık; web için nasıl tasarlayıp geliştirdiğimizi yeniden
        şekillendiriyor.
      </div>

      {/* Section: AI-Powered Accessibility Tools */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-black font-space-grotesk">
          Yapay Zeka Destekli Erişilebilirlik Araçları
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-black/80">
          <p>
            Yapay zeka, erişilebilirlik testine ve iyileştirmeye yaklaşımımızı
            kökten değiştiriyor. Modern yapay zeka araçları artık
            erişilebilirlik sorunlarını otomatik olarak tespit edebiliyor,
            düzeltme önerileri sunabiliyor ve görseller için yüksek doğrulukla
            alternatif metin üretebiliyor.
          </p>
          <p>
            DesignA11y eklentisi, tasarımlarınızı analiz etmek ve olası
            erişilebilirlik engelleri hakkında gerçek zamanlı geri bildirim
            sağlamak için makine öğrenimini kullanır. Bu proaktif yaklaşım,
            sorunların geliştirmeye ulaşmadan önce yakalanmasına yardımcı olur.
          </p>
        </div>

        {/* Quote card */}
        <Card className="mt-6 rounded-lg border-slate-200 bg-black text-white shadow-none">
          <CardContent className="p-6">
            <span className="text-2xl text-primary">
              "
            </span>
            <div className="text-md leading-relaxed text-white/90">
              Erişilebilirlik yalnızca bir özellik değildir. Dijital çağda
              temel bir insan hakkıdır.
            </div>
            <div className="mt-3 text-xs font-semibold tracking-wide text-primary">
              — Web Erişilebilirlik Girişimi
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section: WCAG 3.0 */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900 font-space-grotesk">
          WCAG 3.0: Neler Geliyor
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-black/80">
          World Wide Web Consortium (W3C), “Silver” kod adlı WCAG 3.0’ı
          yayımlamaya hazırlanıyor; bu, erişilebilirlik yönergelerinde on yılı
          aşkın süredir yapılan en büyük güncellemeyi temsil ediyor.
        </p>

        <Card className="mt-5 rounded-xl border-2 border-slate-200 shadow-none bg-[#F9FAFB]">
          <CardContent className="p-5">
            <div className="font-space-grotesk text-sm font-semibold text-slate-900">
              WCAG 3.0'daki Temel Değişiklikler
            </div>

            <ul className="mt-3 space-y-2 text-sm text-black/80">
              {[
                "A/AA/AAA seviyelerinden 0–100 puanlama modeline geçiş",
                "Mobil uygulamalar, IoT ve yükselen teknolojileri kapsaması",
                "Teknik uyumdan ziyade gerçek kullanıcı testlerine vurgu",
                "Bilişsel ve öğrenme güçlükleri için geliştirilmiş yönergeler",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Section: Voice and Gesture Interfaces */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-black font-space-grotesk">
          Ses ve Hareket Arayüzleri
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-black/80">
          Sesle kontrol edilen arayüzler ve hareketle gezinme yaygınlaşıyor ve
          erişilebilir etkileşim için yeni fırsatlar sunuyor. Bu teknolojiler,
          motor engeli olan kullanıcılar için oyun değiştirici olabilir.
        </p>

        {/* media placeholder + caption (like your screenshot) */}
        <div className="mt-6 rounded-xl bg-slate-100 py-10" />
        <p className="mt-2 text-center text-xs text-slate-400">
          Modern ses arayüzleri teknolojiyi daha erişilebilir kılıyor
        </p>
      </section>

      {/* Section: Inclusive Design Thinking */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-black font-space-grotesk">
          Kapsayıcı Tasarım Düşüncesi
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-black/80">
          “Erişilebilirlik sonradan düşünülür” yaklaşımından “erişilebilirlik en
          baştan” anlayışına geçiş hız kazanıyor. Kurumlar, kapsayıcı tasarım
          ilkelerini tüm tasarım süreci boyunca benimsiyor.
        </p>

        {/* Stats row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="rounded-xl border-slate-200 bg-orange-500 text-white shadow-none text-center">
            <CardContent className="p-5">
              <div className="text-2xl font-bold">1.3B+</div>
              <div className="mt-1 text-xs text-white/90">
                Engelli bireyler
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-slate-200 bg-slate-950 text-white shadow-none text-center"> 
            <CardContent className="p-5">
              <div className="text-2xl font-bold">71%</div>
              <div className="mt-1 text-xs text-white/90">
                Erişilemeyen siteleri terk ediyor
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-slate-200 bg-orange-500 text-white shadow-none text-center">
            <CardContent className="p-5">
              <div className="text-2xl font-bold">$13T</div>
              <div className="mt-1 text-xs text-white/90">
                Yıllık harcanabilir gelir
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA orange banner */}
        <div className="mt-6 rounded-xl bg-gradient-to-b from-[#FF6900] to-[#F54900] p-6 text-white">
          <div className="text-base font-semibold  font-space-grotesk">
            Erişilebilir Tasarımlar Oluşturmaya Hazır mısınız?
          </div>
          <p className="mt-2 text-sm text-white/90">
            DesignA11y'yi bugün kullanmaya başlayın ve erişilebilirliği iş
            akışınızın temel bir parçası haline getirin.
          </p>

          <Button
            className="mt-4 bg-white text-orange-600 hover:bg-white/90"
            size="sm"
          >
            Başlayın
          </Button>
        </div>
      </section>

      {/* Section: Looking Ahead */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-black font-space-grotesk">Geleceğe Bakış</h2>

        <p className="mt-3 text-sm leading-relaxed text-black/80">
          Web erişilebilirliğinin geleceği parlak; teknolojik yenilikler,
          düzenleyici baskı ve kapsayıcı tasarıma artan bağlılık bunu
          destekliyor. Erişilebilir deneyimler oluşturmak için mevcut araçlar hiç
          olmadığı kadar güçlü.
        </p>

        <p className="mt-4 text-sm leading-relaxed text-black/80">
          Bilgili kalarak ve erişilebilir tasarım uygulamalarını en baştan
          benimseyerek, herkes için gerçekten çalışan bir web inşa edebiliriz.
        </p>

        <Separator className="mt-8" />

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {["Erişilebilirlik", "WCAG", "Tasarım", "Trendler", "İnovasyon", "2025"].map(
            (t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-full bg-slate-100 text-black/80 hover:bg-slate-100"
              >
                #{t}
              </Badge>
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default BlogBodySections;
