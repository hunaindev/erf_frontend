import React from "react";
import { Link } from "react-router-dom";

type SignupHeroBackgroundProps = {
  badge: string;
  title: string;
  subtitle: string;
};

const nodes = [
  { left: "8%", top: "18%", size: 12, delay: "0s" },
  { left: "16%", top: "35%", size: 8, delay: "0.8s" },
  { left: "24%", top: "22%", size: 10, delay: "1.5s" },
  { left: "34%", top: "14%", size: 14, delay: "2.2s" },
  { left: "42%", top: "42%", size: 9, delay: "0.6s" },
  { left: "56%", top: "18%", size: 11, delay: "1.1s" },
  { left: "64%", top: "34%", size: 9, delay: "2.8s" },
  { left: "74%", top: "20%", size: 10, delay: "0.3s" },
  { left: "86%", top: "28%", size: 13, delay: "2s" },
  { left: "90%", top: "48%", size: 7, delay: "1.3s" },
  { left: "68%", top: "58%", size: 12, delay: "2.4s" },
  { left: "48%", top: "64%", size: 10, delay: "0.9s" },
  { left: "28%", top: "56%", size: 9, delay: "1.9s" },
];

const beams = [
  { left: "10%", top: "22%", width: "16rem", rotate: "16deg", delay: "0s" },
  { left: "20%", top: "36%", width: "20rem", rotate: "-12deg", delay: "1.2s" },
  { left: "38%", top: "20%", width: "18rem", rotate: "14deg", delay: "0.6s" },
  { left: "52%", top: "36%", width: "22rem", rotate: "-9deg", delay: "1.8s" },
  { left: "62%", top: "23%", width: "14rem", rotate: "18deg", delay: "2.4s" },
  { left: "44%", top: "56%", width: "20rem", rotate: "7deg", delay: "2.8s" },
];

const SignupHeroBackground: React.FC<SignupHeroBackgroundProps> = ({
  badge,
  title,
  subtitle,
}) => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070014] px-5 py-14 text-white shadow-[0_30px_80px_-45px_rgba(27,8,60,0.9)] sm:px-8">
      <style>
        {`
          @keyframes signupNodePulse {
            0%, 100% { opacity: 0.25; transform: scale(0.9); }
            50% { opacity: 0.9; transform: scale(1.15); }
          }
          @keyframes signupBeamPulse {
            0%, 100% { opacity: 0.08; transform: scaleX(0.94); }
            50% { opacity: 0.34; transform: scaleX(1.06); }
          }
          @keyframes signupGlowDrift {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(12px, -10px, 0); }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(187,119,255,0.12)_0%,rgba(7,0,20,0)_62%)]" />
        <div
          className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-3xl"
          style={{ animation: "signupGlowDrift 13s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
          style={{ animation: "signupGlowDrift 16s ease-in-out infinite reverse" }}
        />

        {beams.map((beam) => (
          <div
            key={`${beam.left}-${beam.top}-${beam.width}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"
            style={{
              left: beam.left,
              top: beam.top,
              width: beam.width,
              transform: `rotate(${beam.rotate})`,
              animation: `signupBeamPulse 6.5s ease-in-out ${beam.delay} infinite`,
            }}
          />
        ))}

        {nodes.map((node) => (
          <div
            key={`${node.left}-${node.top}`}
            className="absolute rounded-full bg-violet-300/80 shadow-[0_0_24px_rgba(165,95,255,0.45)]"
            style={{
              left: node.left,
              top: node.top,
              width: `${node.size}px`,
              height: `${node.size}px`,
              animation: `signupNodePulse 4.8s ease-in-out ${node.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
          {badge}
        </p>
        <h1 className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-400 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/demo"
            className="rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
          >
            Get Early Access
          </Link>
          <Link
            to="/brands"
            className="rounded-full border border-violet-300/40 bg-black/25 px-6 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-black/35"
          >
            Watch Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignupHeroBackground;
