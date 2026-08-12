import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";

const ChatInterfaceSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="mb-4 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Marka Operasyonları
            </p>
            <h2 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Markanı bir üst seviyeye taşı.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Erfluencer ile kampanyalarını daha yakından takip et, doğru influencer&apos;larla
              hızlıca bağlantı kur ve iletişimi tek panelde yönet.
            </p>
            <Button
              className="mt-8 rounded-full px-8 py-6 text-base"
              onClick={() => {
                navigate("/demo");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Demo Talep Et
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-morph rounded-3xl p-5 sm:p-8"
          >
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: 0.35 }}
                className="ml-auto max-w-md rounded-2xl border border-primary/20 bg-primary/12 p-4 text-sm text-foreground"
              >
                <p className="mb-2 font-semibold text-primary">Marka</p>
                Merhaba Selin, kampanyamıza katıldığın için teşekkür ederiz. Seni aramızda
                görmekten çok mutluyuz.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: 0.55 }}
                className="max-w-md rounded-2xl border border-primary/30 bg-card p-4 text-sm text-foreground shadow-sm"
              >
                <p className="mb-2 font-semibold text-primary">Influencer</p>
                Ben de çok heyecanlıyım. Markanızla çalışmak uzun zamandır istediğim bir şeydi.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: 0.75 }}
                className="ml-auto max-w-md rounded-2xl border border-primary/20 bg-primary/12 p-4 text-sm text-foreground"
              >
                <p className="mb-2 font-semibold text-primary">Marka</p>
                Harika. Önümüzdeki hafta ürün numunelerini paylaşacağız, süreç boyunca
                platformdan iletişimde kalalım.
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChatInterfaceSection;
