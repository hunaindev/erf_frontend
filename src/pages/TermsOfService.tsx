import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import DashboardNavbar from '@/components/DashboardNavbar';
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';

const TermsOfService: React.FC = () => {
  const location = useLocation();
  const isInfluencerPath = location.pathname.includes('/influencer');
  const isSignedIn = location.pathname !== '/terms';

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
            <h1 className="font-bold text-xl uppercase text-center">
              ERFLUENCER PLATFORMU KULLANICI SÖZLEŞMESİ
            </h1>
            <p className="text-xs text-center mt-1">Son Güncelleme Tarihi: 06.02.2026</p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-md font-bold">1. Taraflar, Genel Bakış ve Tanımlar</h2>

              <h3 className="text-sm font-semibold mt-3">1.1. Genel Bakış</h3>
              <p className="text-sm">
                Erfluencer (“Şirket”, “Erfluencer”, “biz” veya “bize”), markalar ve reklam verenler ile influencer’ları bir araya
                getirmek amacıyla kurulmuş, internet tabanlı bir aracı platformdur.
              </p>
              <p className="text-sm mt-2">
                Erfluencer, bu amaç doğrultusunda; İnternet sitesi, Mobil, bilgisayar veya tablet tabanlı uygulamalar, İnternet
                sitesi üzerinden sunulan mevcut veya gelecekte geliştirilecek diğer tüm hizmetler vasıtasıyla faaliyet
                göstermektedir.
              </p>
              <p className="text-sm mt-2">
                Şirket tarafından hâlihazırda veya gelecekte kullanıcılarla iletişim kurmak amacıyla kullanılan; www.erfluencer.com
                adresinde yer alan ana sayfa ve bağlı tüm alt alan adları, Şirket tarafından sunulan veya geliştirilecek olan tüm
                dijital uygulamalar, İnternet sitesi üzerinden açıklanan tüm hizmetler birlikte “İnternet Sitesi” olarak
                anılacaktır.
              </p>

              <h3 className="text-sm font-semibold mt-3">1.2. Tanımlar</h3>
              <p className="text-sm">
                İşbu Kullanıcı Sözleşmesi (“Sözleşme”), Erfluencer adlı dijital aracı platformun sahibi ve işleticisi ile Platform’a
                üye olan ve/veya Platform’u kullanan gerçek veya tüzel kişiler (“Kullanıcı”) arasında akdedilmiştir.
              </p>
              <p className="text-sm mt-2">Kullanıcılar iki gruptur:</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>
                  <span className="font-semibold">Influencer:</span> Sosyal medya hesapları üzerinden içerik üreten ve markalarla
                  iş birliği yapan kullanıcılar
                </li>
                <li>
                  <span className="font-semibold">Marka:</span> Influencer’lar ile reklam, tanıtım ve iş birliği yapmak isteyen
                  gerçek veya tüzel kişiler
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-md font-bold">2. Sözleşmenin Konusu ve Platformun Niteliği</h2>
              <p className="text-sm">
                İşbu Sözleşme’nin konusu, Erfluencer tarafından işletilen dijital platformun kullanım koşullarının belirlenmesidir.
              </p>
              <p className="text-sm mt-2">
                Erfluencer, Influencer’lar ile Markalar arasında yalnızca aracı platform olarak faaliyet göstermekte olup; taraflar
                arasında kurulan ticari, hukuki veya fiili ilişkilerin hiçbirine taraf değildir.
              </p>
              <p className="text-sm mt-2">
                Platform üzerinden kurulan iş birlikleri kapsamında doğacak her türlü sorumluluk, doğrudan ilgili Influencer ve/veya
                Marka’ya aittir.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">3. Üyelik ve Hesap Güvenliği</h2>
              <p className="text-sm">
                3.1. Platform’a üye olan Kullanıcı, verdiği bilgilerin doğru, güncel ve eksiksiz olduğunu kabul eder.
              </p>
              <p className="text-sm mt-2">
                3.2. Kullanıcı, hesap bilgelerinin gizliliğinden ve hesabı üzerinden gerçekleştirilen tüm işlemlerden münhasıran
                sorumludur.
              </p>
              <p className="text-sm mt-2">
                3.3. Erfluencer, gerekli gördüğü hâllerde üyelik başvurularını reddetme, üyeliği askıya alma veya sona erdirme hakkını
                saklı tutar.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">4. Platformun Kullanımı</h2>
              <p className="text-sm">
                4.1. Kullanıcılar, Platform’u hukuka, ahlaka, yürürlükteki mevzuata ve işbu Sözleşme’ye uygun şekilde kullanmayı kabul
                eder.
              </p>
              <p className="text-sm mt-2">
                4.2. Erfluencer, Platform üzerinden sunulan içerikleri, kampanyaları veya kullanıcı beyanlarını denetlemekle yükümlü
                değildir.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">5. Influencer’ların Hak ve Yükümlülükleri</h2>
              <p className="text-sm">Influencer’lar;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Marka ile kararlaştırılan içerik, paylaşım, zamanlama ve format şartlarına uymakla,</li>
                <li>
                  Ürettikleri ve paylaştıkları tüm içeriklerin yürürlükteki mevzuata, reklam ve tüketici hukukuna, sosyal medya
                  platformlarının kurallarına ve etik ilkelere uygun olmasını sağlamakla,
                </li>
                <li>Üçüncü kişilerin fikri ve sınai mülkiyet haklarını, kişilik ve gizlilik haklarını ihlal etmemekle,</li>
                <li>Yanıltıcı, aldatıcı, hukuka aykırı, ayrımcı veya kamu düzenine aykırı içerik paylaşmamayı,</li>
                <li>
                  Kendi kusur, ihmal veya aykırı davranışlarından doğabilecek tüm iddia, talep, zarar ve yaptırımlardan münhasıran
                  sorumlu olmayı
                </li>
              </ul>
              <p className="text-sm mt-2">kabul eder.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">6. Markaların Hak ve Yükümlülükleri</h2>
              <p className="text-sm">Markalar;</p>
              <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                <li>Platform üzerinden sundukları kampanya, brief ve taleplerin hukuka uygunluğundan,</li>
                <li>Influencer ile kararlaştırılan bedellerin zamanında ve eksiksiz ödenmesinden,</li>
                <li>Influencer tarafından üretilen içeriklerin yalnızca taraflar arasında kararlaştırılan kapsamda kullanılmasından</li>
              </ul>
              <p className="text-sm mt-2">münhasıran sorumludur.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">7. Sorumluluğun Sınırlandırılması ve Tazmin</h2>
              <p className="text-sm">
                7.1. Erfluencer, Influencer ve Marka arasında meydana gelebilecek; sözleşme ihlali, hizmetin eksik veya hiç ifa
                edilmemesi, içeriklerin paylaşılmaması, iletişim sorunları, itibar kaybı, üçüncü kişi talepleri veya benzeri hiçbir
                durumdan sorumlu tutulamaz.
              </p>
              <p className="text-sm mt-2">
                7.2. Taraflar arasında doğabilecek uyuşmazlıklarda, uyuşmazlığa sebep olan taraf, ilgili fiil veya ihlalin hukuki,
                idari ve cezai sonuçlarının tamamından münhasıran sorumlu olduğunu kabul eder.
              </p>
              <p className="text-sm mt-2">
                7.3. Influencer ve/veya Marka, kendi fiil ve işlemleri nedeniyle Erfluencer’in herhangi bir zarar, dava, idari
                yaptırım veya tazminat talebi ile karşı karşıya kalması hâlinde, Erfluencer’i derhâl tazmin etmeyi ve her türlü
                talepten ari tutmayı kabul eder.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">8. Fikri Mülkiyet Hakları</h2>
              <p className="text-sm">Platform’a ait yazılım, tasarım, marka, logo ve tüm içerikler Erfluencer’e aittir.</p>
              <p className="text-sm mt-2">
                Influencer tarafından üretilen içeriklerin fikri mülkiyet hakları, aksi ilgili kampanya sözleşmesinde açıkça
                kararlaştırılmadıkça Influencer’a aittir.
              </p>
              <p className="text-sm mt-2">
                Her bir kampanya kapsamında içerik sahipliği ve kullanım hakları ayrıca ve açıkça belirlenir. Genel uygulama olarak;
                Influencer, ürettiği içeriğin telif hakkını muhafaza ederken, Marka’ya söz konusu içeriği kampanya ve kullanım amacı
                doğrultusunda süre sınırı olmaksızın kullanma lisansı tanınabilir. Bu kapsam ve şartlar, kampanyaya katılım öncesinde
                Erfluencer tarafından Kullanıcılara şeffaf biçimde sunulur.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">9. Gizlilik ve Kişisel Veriler</h2>
              <p className="text-sm">
                Kullanıcıların kişisel verileri, Erfluencer Gizlilik Politikası ve yürürlükteki mevzuata uygun olarak işlenir. Gizlilik
                Politikası işbu Sözleşme’nin ayrılmaz bir parçasıdır.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">10. Sözleşmenin Feshi</h2>
              <p className="text-sm">Kullanıcı, dilediği zaman üyeliğini sonlandırabilir.</p>
              <p className="text-sm mt-2">Erfluencer, işbu Sözleşme’ye aykırılık hâlinde üyeliği tek taraflı olarak sona erdirebilir.</p>
            </section>

            <section>
              <h2 className="text-md font-bold">11. Değişiklikler</h2>
              <p className="text-sm">
                Erfluencer, işbu Sözleşme’de dilediği zaman değişiklik yapma hakkını saklı tutar. Değişiklikler Platform’da yayımlandığı
                tarihte yürürlüğe girer.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">12. Uygulanacak Hukuk ve Yetki</h2>
              <p className="text-sm">
                İşbu Sözleşme Türk Hukuku’na tabidir. Taraflar arasında doğabilecek uyuşmazlıklarda İstanbul Merkez Mahkemeleri ve İcra
                Daireleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-md font-bold">13. Yürürlük</h2>
              <p className="text-sm">İşbu Sözleşme, Kullanıcı’nın Platform’a üye olmasıyla birlikte yürürlüğe girer.</p>
              <p className="text-sm mt-2">
                Bu platforma erişim sağlamanız ve/veya platformu kullanmanız hâlinde, işbu Kullanım Şartları’nı okuduğunuzu,
                anladığınızı ve tüm hükümleriyle kabul ettiğinizi beyan etmiş sayılırsınız.
              </p>
            </section>
          </div>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default TermsOfService;

