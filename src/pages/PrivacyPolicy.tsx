import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import DashboardNavbar from '@/components/DashboardNavbar';
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  const location = useLocation();
  const isInfluencerPath = location.pathname.includes('/influencer');
  const isSignedIn = location.pathname !== '/privacy';

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
            <h1 className="font-bold text-xl uppercase text-center">GİZLİLİK POLİTİKASI</h1>
            <p className="text-xs text-center mt-1">Son güncelleme tarihi: 06.02.2026</p>
          </div>

          <div className="space-y-6">
            <section>
              <p className="text-sm">
                Erfluencer olarak (“Erfluencer”, “Platform”, “biz”), markalar, ajanslar ve içerik üreticileri arasında güvene dayalı bir
                ekosistem kurmayı önemsiyoruz. Bu Gizlilik Politikası; Erfluencer web sitesi, mobil uygulamaları ve bağlı hizmetleri
                (topluca “Hizmetler”) kapsamında toplanan kişisel verilerin nasıl işlendiğini, korunduğunu ve kullanıldığını açıklar.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">1. Kapsam</h2>
              <p className="text-sm">Bu Gizlilik Politikası;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Markalar</li>
                <li>Ajanslar</li>
                <li>Influencer’lar / İçerik Üreticileri</li>
                <li>Platformu ziyaret eden kullanıcılar</li>
              </ul>
              <p className="text-sm mt-2">için geçerlidir.</p>
              <p className="text-sm mt-2">Platformu kullanarak bu Gizlilik Politikası’nı kabul etmiş sayılırsınız.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">2. Toplanan Veriler</h2>
              <p className="text-sm">
                Erfluencer, sunduğu hizmetleri sağlamak ve geliştirmek amacıyla aşağıdaki verileri toplayabilir:
              </p>

              <h3 className="text-sm font-semibold mt-3">2.1. Kimlik ve İletişim Bilgileri</h3>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Ad, soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Şirket / marka bilgileri</li>
              </ul>

              <h3 className="text-sm font-semibold mt-3">2.2. Hesap ve Profil Bilgileri</h3>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kullanıcı tipi (marka, ajans, influencer)</li>
                <li>Profil açıklamaları</li>
                <li>İlgi alanları ve sektör bilgileri</li>
                <li>Kampanya tercihleri</li>
              </ul>

              <h3 className="text-sm font-semibold mt-3">2.3. Sosyal Medya Verileri</h3>
              <p className="text-sm">
                Kullanıcının açık rızası ile bağlanan sosyal medya hesaplarından:
              </p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kullanıcı adı</li>
                <li>Takipçi sayısı</li>
                <li>Etkileşim oranları</li>
                <li>İçerik türleri</li>
                <li>Performans metrikleri</li>
              </ul>
              <p className="text-sm mt-2">
                Erfluencer özel mesajlara erişmez, içeriklerin kendisini izinsiz olarak kopyalamaz.
              </p>

              <h3 className="text-sm font-semibold mt-3">2.4. Kampanya ve İş Birliği Verileri</h3>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kampanya katılım bilgileri</li>
                <li>İçerik taslakları ve onay durumu</li>
                <li>Kampanya tarihçesi</li>
                <li>Performans sonuçları</li>
              </ul>

              <h3 className="text-sm font-semibold mt-3">2.5. Teknik Veriler</h3>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>IP adresi</li>
                <li>Cihaz ve tarayıcı bilgileri</li>
                <li>Çerezler (cookies)</li>
                <li>Platform içi hareketler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-md font-bold">3. Verilerin Kullanım Amaçları</h2>
              <p className="text-sm">Toplanan veriler aşağıdaki amaçlarla kullanılır:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Platformun çalışmasını sağlamak</li>
                <li>Kullanıcı hesaplarını oluşturmak ve yönetmek</li>
                <li>Kampanya eşleştirmelerini yapmak</li>
                <li>Kişiselleştirilmiş kampanya önerileri sunmak</li>
                <li>Analitik ve performans raporları oluşturmak</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
                <li>Hukuki yükümlülükleri yerine getirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-md font-bold">4. Algoritmik Eşleştirme ve Yapay Zekâ Kullanımı</h2>
              <p className="text-sm">Erfluencer;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kampanya hedefleri</li>
                <li>Influencer ilgi alanları</li>
                <li>İçerik türleri</li>
                <li>Etkileşim verileri</li>
              </ul>
              <p className="text-sm mt-2">gibi unsurları analiz eden algoritmik sistemler kullanır.</p>
              <p className="text-sm mt-2">Bu sistemler:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Otomatik eşleştirme yapar</li>
                <li>Kararları insan müdahalesi olmadan bağlayıcı şekilde almaz</li>
                <li>Yalnızca öneri niteliğindedir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-md font-bold">5. Verilerin Paylaşılması</h2>
              <p className="text-sm">Erfluencer, kişisel verileri üçüncü taraflara satmaz.</p>
              <p className="text-sm mt-2">Veriler yalnızca aşağıdaki durumlarda paylaşılabilir:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Kampanya kapsamında marka–influencer eşleşmesi için</li>
                <li>Yasal zorunluluklar doğrultusunda</li>
                <li>Hizmet sağlayıcılar (sunucu, analiz, güvenlik) ile</li>
              </ul>
              <p className="text-sm mt-2">Tüm üçüncü taraflar gizlilik yükümlülüğü altındadır.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">6. İçerik ve Telif Hakları</h2>
              <ul className="list-disc pl-6 text-sm space-y-1">
                <li>İçerik üreticileri, ürettikleri içeriklerin telif hakkını elinde tutar</li>
                <li>
                  Markalar, kampanya kapsamında üretilen içerikleri süre sınırı olmaksızın, belirtilen kullanım amacı doğrultusunda
                  kullanma lisansına sahip olur
                </li>
                <li>Bu koşullar kampanya başlamadan önce açıkça belirtilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-md font-bold">7. Veri Güvenliği</h2>
              <p className="text-sm">Erfluencer;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>SSL şifreleme</li>
                <li>Güvenli sunucular</li>
                <li>Yetkilendirme kontrolleri</li>
                <li>Erişim kısıtlamaları</li>
              </ul>
              <p className="text-sm mt-2">gibi teknik ve idari önlemlerle verilerinizi korur.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">8. Çerezler (Cookies)</h2>
              <p className="text-sm">Platform, kullanıcı deneyimini geliştirmek için çerezler kullanır.</p>
              <p className="text-sm mt-2">Çerezler;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Oturum yönetimi</li>
                <li>Tercihlerin hatırlanması</li>
                <li>Analitik ölçüm</li>
              </ul>
              <p className="text-sm mt-2">amaçlarıyla kullanılır.</p>
              <p className="text-sm mt-2">Kullanıcılar tarayıcı ayarlarından çerezleri kontrol edebilir.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">9. Kullanıcı Hakları</h2>
              <p className="text-sm">KVKK ve GDPR kapsamında kullanıcılar:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Verilerine erişme</li>
                <li>Düzeltme talep etme</li>
                <li>Silinmesini isteme</li>
                <li>İşlemeye itiraz etme</li>
                <li>Açık rızayı geri çekme</li>
              </ul>
              <p className="text-sm mt-2">haklarına sahiptir.</p>
              <p className="text-sm mt-2">Talepler için: 📩 İletişim@erfluencer.com</p>
            </section>

            <section>
              <h2 className="text-md font-bold">10. Veri Saklama Süresi</h2>
              <p className="text-sm">Kişisel veriler:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Hizmet devam ettiği sürece</li>
                <li>Yasal zorunluluklar kapsamında</li>
                <li>Meşru menfaatler doğrultusunda</li>
              </ul>
              <p className="text-sm mt-2">saklanır, süre sonunda silinir veya anonimleştirilir.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">11. Üçüncü Taraf Bağlantılar</h2>
              <p className="text-sm">
                Platformda üçüncü taraf sitelere bağlantılar bulunabilir. Erfluencer, bu sitelerin gizlilik uygulamalarından sorumlu değildir.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">12. Politika Güncellemeleri</h2>
              <p className="text-sm">
                Erfluencer, bu Gizlilik Politikası’nı zaman zaman güncelleyebilir. Güncellemeler platform üzerinden duyurulur.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">13. İletişim</h2>
              <p className="text-sm">Gizlilik politikası ile ilgili sorularınız için:</p>
              <p className="text-sm mt-2">📧 İletişim@erfluencer.com</p>
              <p className="text-sm mt-2">🌐 www.erfluencer.com</p>
            </section>
          </div>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

