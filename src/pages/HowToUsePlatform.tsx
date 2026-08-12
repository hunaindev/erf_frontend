import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, MessageSquareText, PlayCircle, Rocket, Video } from "lucide-react";

import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const platformSteps = [
  {
    title: "Marka profilinizi hazırlayın",
    description: "Logo, sektör, hedef kitle ve marka detaylarınızı tamamlayarak kampanya eşleşmelerini güçlendirin.",
    icon: ClipboardList,
  },
  {
    title: "Kampanyanızı oluşturun",
    description: "Brief, içerik beklentileri, platform seçimi ve teslim tarihlerini net şekilde ekleyin.",
    icon: Rocket,
  },
  {
    title: "İçerik üreticileriyle iletişim kurun",
    description: "Başvuruları inceleyin, mesajlaşın ve kampanya sürecini tek panelden takip edin.",
    icon: MessageSquareText,
  },
  {
    title: "Onay ve yayın sürecini yönetin",
    description: "Taslakları kontrol edin, geri bildirim verin ve yayına alınan içerikleri takip edin.",
    icon: CheckCircle2,
  },
];

const HowToUsePlatform: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="mb-8 overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm">
            <div className="grid gap-8 p-6 lg:grid-cols-[0.95fr_1.4fr] lg:p-8">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <Video size={16} />
                  Platform Rehberi
                </div>

                <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                  Platformu nasıl kullanırsınız?
                </h1>

                <p className="mt-4 text-base leading-7 text-gray-600">
                  Erfluencer panelinde kampanya oluşturma, influencer seçimi, mesajlaşma ve yayın
                  takip sürecini bu sayfadaki video ile adım adım izleyebilirsiniz.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="rounded-lg">
                    <Link to="/campaigns">Kampanyalara Git</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg">
                    <Link to="/add-brands">Marka Ekle</Link>
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-black shadow-sm">
                <div className="aspect-video w-full">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/VEmM4tJHvgo?start=28"
                    title="Erfluencer platform kullanım videosu"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {platformSteps.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 rounded-lg border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <PlayCircle size={18} />
                  Hızlı başlangıç
                </div>
                <h2 className="text-2xl font-bold text-gray-900">İlk kampanyanızı hazırlamaya başlayın</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                  Videoyu izledikten sonra kampanya sayfasına geçerek briefinizi oluşturabilir ve
                  uygun içerik üreticileriyle süreci başlatabilirsiniz.
                </p>
              </div>

              <Button asChild className="w-full rounded-lg md:w-auto">
                <Link to="/campaigns">Kampanya Oluştur</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowToUsePlatform;
