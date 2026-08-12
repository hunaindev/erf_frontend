import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Users, Eye, Heart, DollarSign, Download, Share2 } from 'lucide-react';

const SingleCaseStudy: React.FC = () => {
  const { id } = useParams();

  const caseStudy = {
    id: parseInt(id || '1'),
    title: "'Taste of Italy' Rezervasyonlarını %45 Artırdı",
    subtitle: 'Yerel bir restoranın 60 günlük influencer kampanyası ile dönüşüm hikayesi',
    content: `
      <h2 class="text-xl font-semibold mt-8 mb-4">Zorluk</h2>
      <p class="mb-4">Toronto merkezindeki aile restoranı Taste of Italy, kaliteli ürün ve hizmete rağmen rezervasyonlarda düşüş yaşıyordu. İşletme, daha genç bir kitleye ulaşarak büyümeyi sürdürmeyi hedefliyordu.</p>
      <p class="mb-4">Temel sorunlar şu şekildeydi:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Sınırlı sosyal medya görünürlüğü</li>
        <li>Genç kitlede eski moda algısı</li>
        <li>Bölgedeki güçlü rekabet</li>
        <li>Ölçülebilir sonuç bekleyen sınırlı pazarlama bütçesi</li>
      </ul>

      <h2 class="text-xl font-semibold mt-8 mb-4">Yöntemimiz</h2>
      <p class="mb-4">Gerçek deneyim odaklı 60 günlük bir influencer kampanyası tasarlandı.</p>

      <h3 class="text-lg font-medium mt-6 mb-3">1. Influencer Seçimi</h3>
      <p class="mb-4">Makro hesaplar yerine hedef kitleyle uyumlu, etkileşimi yüksek 12 mikro influencer seçildi.</p>

      <h3 class="text-lg font-medium mt-6 mb-3">2. Deneyim Tasarımı</h3>
      <p class="mb-4">Her influencer için restoran deneyimini öne çıkaracak özel bir menü ve içerik akışı hazırlandı.</p>

      <h3 class="text-lg font-medium mt-6 mb-3">3. İçerik Stratejisi</h3>
      <p class="mb-4">Her katılımcıdan şu formatlarda içerik beklendi:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>1 detaylı Instagram gönderisi</li>
        <li>3-5 Instagram hikayesi</li>
        <li>1 kısa video (Reels veya TikTok)</li>
      </ul>

      <h2 class="text-xl font-semibold mt-8 mb-4">Sonuçlar</h2>
      <p class="mb-4">60 gün sonunda kampanya hedefleri aşılarak hem erişim hem de rezervasyonlarda belirgin artış elde edildi.</p>
    `,
    image: 'https://placehold.co/1200x600/e2e8f0/64748b?text=Vaka+Calismasi+Kapak',
    date: '5 Eyl 2023',
    company: 'Taste of Italy',
    location: 'Toronto, Kanada',
    duration: '60 gün',
    stats: {
      reach: '120K+',
      engagement: '8.7%',
      influencers: 12,
      reservationsIncrease: '45%',
      revenue: '$24,500',
      roi: '387%',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />

      <main className="flex-1">
        <div className="w-full h-64 md:h-96 bg-gray-200 relative">
          <img
            src={caseStudy.image}
            alt={caseStudy.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
            <div className="max-w-4xl mx-auto">
              <Link to="/blogs" className="inline-flex items-center text-white/80 hover:text-white mb-4">
                <ChevronLeft size={16} className="mr-1" />
                Vaka Çalışmalarına Dön
              </Link>
              <div className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4">
                Vaka Çalışması
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{caseStudy.title}</h1>
              <p className="text-xl text-white/90 mb-4">{caseStudy.subtitle}</p>
              <div className="flex items-center text-sm">
                <span>{caseStudy.date}</span>
                <span className="mx-2">•</span>
                <span>{caseStudy.company}</span>
                <span className="mx-2">•</span>
                <span>{caseStudy.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Kampanya Özeti</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share2 size={16} className="mr-2" />
                Paylaş
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                PDF İndir
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Users className="mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Toplam erişim</p>
                    <p className="text-xl font-bold">{caseStudy.stats.reach}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Heart className="mr-3 text-pink-500" />
                  <div>
                    <p className="text-sm text-gray-500">Etkilesim Orani</p>
                    <p className="text-xl font-bold">{caseStudy.stats.engagement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Eye className="mr-3 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Rezervasyon Artisi</p>
                    <p className="text-xl font-bold">{caseStudy.stats.reservationsIncrease}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <DollarSign className="mr-3 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">ROI</p>
                    <p className="text-xl font-bold">{caseStudy.stats.roi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: caseStudy.content }}></div>

          <div className="mt-10 pt-6 border-t flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Vaka calismasi sahibi</p>
              <p className="font-medium">Eros Pazarlama Ekibi</p>
            </div>
            <Button>
              Benzer Kampanya Talep Et
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleCaseStudy;
