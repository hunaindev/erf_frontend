import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import DashboardNavbar from '@/components/DashboardNavbar';
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';

const InfluencerAgreement: React.FC = () => {
  const location = useLocation();
  const isInfluencerPath = location.pathname.includes('/influencer');
  const isSignedIn = location.pathname !== '/agreement';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isSignedIn ? (
        isInfluencerPath ? <InfluencerNavbar /> : <DashboardNavbar />
      ) : (
        <Header />
      )}

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="font-bold text-xl uppercase">ERFLUENCER INFLUENCER KATILIM VE İÇERİK ÜRETİM SÖZLEŞMESİ</h1>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold">1. Taraflar</h2>
              <p className="text-sm">
                İşbu sözleşme; Erfluencer Platformu (“Platform” veya “Erfluencer” olarak anılacaktır) ile Platforma kayıt olan ve influencer/ içerik üreticisi olarak faaliyet gösteren gerçek kişi (“Influencer” olarak anılacaktır) arasında, aşağıda belirtilen şartlar çerçevesinde elektronik ortamda akdedilmiştir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">2. Sözleşmenin Konusu</h2>
              <p className="text-sm">
                Bu sözleşmenin konusu; Influencer’ın Erfluencer platformuna katılımı, markalarla yürütülecek kampanyalar kapsamında içerik üretmesi, bu içeriklerin kullanımı, tarafların hak ve yükümlülükleri ile gizlilik, ödeme ve fesih şartlarının düzenlenmesidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">3. Influencer’ın Statüsü</h2>
              <p className="text-sm">Influencer, Erfluencer’ın çalışanı değildir.</p>
              <p className="text-sm mt-2">Taraflar arasında işçi–işveren, acentelik, ortaklık veya franchise ilişkisi yoktur.</p>
              <p className="text-sm mt-2">Influencer, faaliyetlerini bağımsız olarak yürütür.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">4. Platforma Katılım ve Profil Bilgileri</h2>
              <p className="text-sm">4.1 Influencer, platforma kayıt olurken verdiği tüm bilgilerin doğru, güncel ve kendisine ait olduğunu kabul eder.</p>
              <p className="text-sm mt-2">4.2 Influencer, sosyal medya hesaplarının kendisine ait olduğunu ve üçüncü kişilerin haklarını ihlal etmediğini taahhüt eder.</p>
              <p className="text-sm mt-2">4.3 Yanıltıcı bilgi tespiti halinde Erfluencer, hesabı askıya alma veya kapatma hakkına sahiptir.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">5. Kampanyalar ve İçerik Üretimi</h2>
              <p className="text-sm">5.1 Influencer, kampanyalara isteğe bağlı olarak katılır.</p>
              <p className="text-sm mt-2">5.2 Kampanya detayları (içerik türü, tarih, platform, yayın süresi vb.) kampanya bazında ayrıca belirtilir.</p>

              <p className="text-sm mt-2">5.3 Influencer;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Markanın itibarına zarar verecek,</li>
                <li>Nefret söylemi, yasa dışı içerik, yanıltıcı reklam,</li>
                <li>KVKK ve reklam mevzuatına aykırı</li>
              </ul>
              <p className="text-sm mt-2">içerikler üretemez.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">6. İçerik Üzerindeki Haklar</h2>
              <p className="text-sm">6.1 Üretilen içeriklerin telif hakkı Influencer’a aittir.</p>

              <p className="text-sm mt-2">6.2 Influencer, ürettiği içeriği;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kampanya süresi boyunca</li>
                <li>Kampanya şartlarında belirtilen mecralarda</li>
              </ul>
              <p className="text-sm mt-2">markaya kullanım lisansı verdiğini kabul eder.</p>

              <p className="text-sm mt-2">6.3 Aksi belirtilmedikçe bu lisans:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Süreli</li>
                <li>Ticari kullanım amaçlı</li>
                <li>Devredilemez</li>
              </ul>
              <p className="text-sm mt-2">niteliktedir.</p>

              <p className="text-sm mt-2">
                6.4 Markanın, içeriği reklam, yeniden paylaşım, web sitesi veya sosyal medya reklamlarında kullanabilmesi kampanya detaylarında açıkça belirtilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">7. Ödeme ve Kazanç Modeli</h2>
              <p className="text-sm">7.1 Erfluencer, influencerlara doğrudan ödeme yapan taraf değildir.</p>

              <p className="text-sm mt-2">7.2 Ödeme modeli kampanyaya göre:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Ürün karşılığı</li>
                <li>Sabit ücret</li>
                <li>Performans bazlı</li>
              </ul>
              <p className="text-sm mt-2">olabilir.</p>

              <p className="text-sm mt-2">7.3 Ödeme yükümlülüğü, kampanya şartlarında aksi belirtilmedikçe markaya aittir.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">8. Vergi ve Yasal Yükümlülükler</h2>
              <p className="text-sm">8.1 Influencer, elde ettiği kazançlara ilişkin:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Vergi,</li>
                <li>Stopaj,</li>
                <li>SGK vb.</li>
              </ul>
              <p className="text-sm mt-2">yükümlülüklerden kendisi sorumludur.</p>

              <p className="text-sm mt-2">8.2 Erfluencer, bu yükümlülüklerden dolayı sorumlu tutulamaz.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">9. Gizlilik</h2>
              <p className="text-sm">9.1 Influencer;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kampanya detaylarını,</li>
                <li>Marka stratejilerini,</li>
                <li>Platforma ait teknik ve ticari bilgileri</li>
              </ul>
              <p className="text-sm mt-2">üçüncü kişilerle paylaşamaz.</p>

              <p className="text-sm mt-2">9.2 Bu yükümlülük sözleşme sona erdikten sonra da devam eder.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">10. Kişisel Verilerin Korunması (KVKK)</h2>
              <p className="text-sm">10.1 Influencer’a ait kişisel veriler, KVKK ve ilgili mevzuata uygun olarak işlenir.</p>
              <p className="text-sm mt-2">10.2 Influencer, platforma kayıt olarak Aydınlatma Metni ve Açık Rıza Metnini kabul etmiş sayılır.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">11. Sözleşmenin Süresi ve Feshi</h2>
              <p className="text-sm">11.1 İşbu sözleşme, Influencer’ın platforma kaydı ile yürürlüğe girer.</p>
              <p className="text-sm mt-2">11.2 Taraflardan her biri, dilediği zaman platform hesabını kapatarak sözleşmeyi feshedebilir.</p>

              <p className="text-sm mt-2">11.3 Aşağıdaki durumlarda Erfluencer derhal fesih hakkına sahiptir:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Sahte takipçi / etkileşim,</li>
                <li>Marka itibarını zedeleyici davranış,</li>
                <li>Hukuka aykırı içerik üretimi.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold">12. Sorumluluğun Sınırlandırılması</h2>
              <p className="text-sm">Erfluencer;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kampanyanın başarısından,</li>
                <li>Markanın ödeme yapmamasından,</li>
                <li>Influencer’ın içerik performansından</li>
              </ul>
              <p className="text-sm mt-2">sorumlu tutulamaz.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">13. Mücbir Sebepler</h2>
              <p className="text-sm">
                Tarafların kontrolü dışında gelişen; doğal afet, savaş, pandemi, sosyal medya platformlarının erişim kısıtlamaları mücbir sebep sayılır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">14. Uygulanacak Hukuk ve Yetki</h2>
              <p className="text-sm">İşbu sözleşmede Türkiye Cumhuriyeti Hukuku uygulanır.</p>
              <p className="text-sm mt-2">Uyuşmazlıklarda İstanbul Merkez Mahkemeleri ve İcra Daireleri yetkilidir.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold">15. Yürürlük</h2>
              <p className="text-sm">
                Influencer, platforma kayıt olurken bu sözleşmenin tamamını okuduğunu, anladığını ve elektronik ortamda kabul ettiğini beyan eder.
              </p>
            </section>
          </div>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default InfluencerAgreement;
