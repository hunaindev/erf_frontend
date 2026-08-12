import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  isInfluencer: boolean;
}

const Hero: React.FC<HeroProps> = ({ isInfluencer }) => {
  const title = isInfluencer
    ? "İçerik üreticilerinin en sevdikleri markalarla buluştuğu bir platform"
    : "Influencer pazarlamasını kolaylaştırıyoruz.";

  const subtitle = isInfluencer
    ? "Zor kısmı bize bırakın, sevdiğiniz içeriği üretin."
    : "Markanızı seven içerik üreticileriyle çalışın.";
 
  const signUpUrl = isInfluencer ? "/influencer-signup" : "/brand-signup";

  return (
    <section className="relative overflow-hidden mx-auto w-full max-w-sm overflow-x-hidden md:max-w-4xl md:overflow-x-visible px-3 md:px-6 page-transition">
      <div className="background-shape w-96 h-96 rounded-full -top-48 -right-48"></div>
      <div className="background-shape w-96 h-96 rounded-full -bottom-48 -left-48"></div>

      <div className="relative overflow-hidden rounded-[2rem]  bg-white/5 py-6 shadow-[0_28px_70px_-42px_rgba(0,0,0,0.45)] backdrop-blur-[2px] md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] md:hidden" />
        <div className="pointer-events-none absolute -right-12 top-12 h-24 w-24 rotate-12 rounded-[1.35rem] border border-white/15 bg-white/5 md:hidden" />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-20 w-20 rotate-45 rounded-[1.1rem] border border-white/15 bg-white/5 md:hidden" />

        <div className="relative flex flex-col items-center justify-center pt-1 pb-1 md:py-28 text-center">
          <h2 className="text-[20px] md:text-2xl font-medium leading-[1.45] mb-4 md:mb-6 animate-fade-in max-w-[14rem] md:max-w-none text-white/80">
            {title}
          </h2>

          <h1 className="text-[2rem] md:text-6xl font-black md:font-bold mb-5 md:mb-12 leading-[0.96] md:leading-tight tracking-[-0.03em] md:tracking-normal animate-slide-up max-w-[14rem] md:max-w-none text-white" style={{ animationDelay: "0.2s" }}>
            {subtitle}
          </h1>

          <div className="w-full max-w-[16rem] flex flex-col gap-3 md:max-w-none md:flex-row md:justify-center md:gap-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Link
              to={signUpUrl}
              className="inline-flex items-center justify-center rounded-[1.15rem] md:rounded-full bg-white px-6 py-3.5 md:px-8 md:py-3 text-[0.95rem] md:text-base font-semibold text-[hsl(var(--primary-deep))] shadow-[0_18px_35px_-22px_rgba(255,255,255,0.35)] transition-all duration-300 hover:scale-[1.02] hover:bg-white/90"
            >
              Ücretsiz Başla
            </Link>

            <Link
              to="/signin"
              className="inline-flex items-center justify-center rounded-[1.15rem] md:rounded-full border border-white/25 bg-white/10 px-6 py-3.5 md:px-8 md:py-3 text-[0.95rem] md:text-base font-semibold text-white shadow-[0_12px_30px_-26px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-white/15 md:bg-transparent md:shadow-none md:hover:bg-white/10"
            >
              Giriş Yap
            </Link>

            <Link
              to="/brands#platform-video"
              className="inline-flex items-center justify-center rounded-[1.15rem] md:rounded-full border border-white/25 bg-white/10 px-6 py-3.5 md:px-8 md:py-3 text-[0.95rem] md:text-base font-semibold text-white shadow-[0_12px_30px_-26px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-white/15 md:bg-transparent md:shadow-none md:hover:bg-white/10"
            >
              Demo Videoyu İzle
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
