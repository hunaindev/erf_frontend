import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Share2, ChevronLeft } from 'lucide-react';

const SingleBlog: React.FC = () => {
  const { id } = useParams();

  const blog = {
    id: parseInt(id || '1'),
    title: 'Restoranınızın Sosyal Medya Varlığını Büyütmenin 10 Yolu',
    content: `
      <p class="mb-4">Dijital dünyada restoranlar için güçlü bir sosyal medya varlığı, yeni müşteri kazanımı ve mevcut müşteri sadakati için kritik öneme sahiptir. Doğru stratejiyle sosyal medya, marka kimliğinizi, ürün kalitenizi ve deneyiminizi etkili şekilde gösterebilen güçlü bir kanala dönüşür.</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">1. Doğru Platformları Seçin</h2>
      <p class="mb-4">Her platform her restoran için aynı sonucu vermez. Görsel gücü nedeniyle Instagram ve Facebook genellikle daha etkilidir. Gençlere ulaşmak için TikTok da önemli bir kanaldır. Tüm platformlara dağılmak yerine hedef kitlenizin aktif olduğu 2-3 platforma odaklanın.</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">2. Yüksek Kaliteli Görseller Kullanın</h2>
      <p class="mb-4">Profesyonel yemek fotoğrafçılığı etkileşim oranlarını ciddi şekilde artırır. İştah açıcı ve net görseller, hem marka algısını güçlendirir hem de mekâna fiziksel ziyaretleri destekler.</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">3. Sahne Arkası İçerikler Paylaşın</h2>
      <p class="mb-4">Mutfak akışı, şef hazırlıkları ve imza lezzetlerin hikayesi gibi içerikler markayı insanileştirir. Bu tip paylaşımlar güven oluşturur ve takipçiyle duygusal bağ kurar.</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">4. Kullanıcı Üretimli İçerikten Yararlanın</h2>
      <p class="mb-4">Misafirlerinizi içerik oluşturmaya teşvik edin. Etiketlenen paylaşımları izin dahilinde yeniden paylaşarak sosyal kanıt oluşturun ve topluluk bağını güçlendirin.</p>

      <h2 class="text-xl font-semibold mt-8 mb-4">5. Takipçilerle Etkileşimde Kalın</h2>
      <p class="mb-4">Sosyal medya çift yönlü bir iletişimdir. Yorumlara ve mesajlara zamanında dönüş yapmak, olumlu geri bildirimleri takdir etmek ve olumsuz yorumları profesyonel şekilde yönetmek markaya olan güveni artırır.</p>
    `,
    image: 'https://placehold.co/1200x600/e2e8f0/64748b?text=Blog+Kapak+Gorseli',
    date: '15 Ağu 2023',
    author: 'Ayşe Yılmaz',
    authorRole: 'Pazarlama Uzmanı',
    authorAvatar: 'AY',
    readTime: '5 dk okuma',
    tags: ['Sosyal Medya', 'Restoran Pazarlaması', 'Yemek Fotoğrafçılığı'],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />

      <main className="flex-1">
        <div className="w-full h-64 md:h-96 bg-gray-200 relative">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
            <div className="max-w-4xl mx-auto">
              <Link to="/blogs" className="inline-flex items-center text-white/80 hover:text-white mb-4">
                <ChevronLeft size={16} className="mr-1" />
                Bloglara Dön
              </Link>
              <h1 className="text-2xl md:text-4xl font-bold mb-4">{blog.title}</h1>
              <div className="flex items-center text-sm">
                <span>{blog.date}</span>
                <span className="mx-2">•</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback>{blog.authorAvatar}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{blog.author}</h3>
                <p className="text-sm text-gray-500">{blog.authorRole}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-2" />
              Paylaş
            </Button>
          </div>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-semibold mb-6">Ilgili Yazilar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Link to={`/blogs/${i}`} key={i} className="group">
                  <div className="h-40 bg-gray-200 mb-3 overflow-hidden rounded-lg">
                    <img
                      src={`https://placehold.co/400x240/e2e8f0/64748b?text=Ilgili+Yazi+${i}`}
                      alt={`Ilgili Yazi ${i}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {`Ilgili yazi basligi ${i}`}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleBlog;
