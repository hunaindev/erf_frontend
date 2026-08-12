import { useEffect, useState } from 'react';

const CountdownTimer = ({ endDate, variant = 'default' }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = null;
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) {
        if (variant === 'compact') {
            return (
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center text-xs font-semibold text-emerald-700 shadow-sm">
                    Otomatik onay hazır
                </div>
            );
        }

        return (
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-emerald-700">Sure doldu</p>
                <p className="mt-1 text-xs text-emerald-600">İçerik otomatik olarak isleme alinabilir.</p>
            </div>
        );
    }

    const items = [
        { label: 'Gun', value: String(timeLeft.days).padStart(2, '0') },
        { label: 'Saat', value: String(timeLeft.hours).padStart(2, '0') },
        { label: 'Dakika', value: String(timeLeft.minutes).padStart(2, '0') },
        { label: 'Saniye', value: String(timeLeft.seconds).padStart(2, '0') },
    ];

    if (variant === 'compact') {
        return (
            <div className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-4 py-2 text-sm font-semibold text-violet-700 shadow-[0_12px_24px_-16px_rgba(109,40,217,0.45)]">
                <span className="uppercase tracking-[0.12em] text-[11px] font-bold text-violet-600">Otomatik onay</span>
                <span className="text-[15px] font-bold text-slate-900">
                    {items[0].value}g {items[1].value}s {items[2].value}dk {items[3].value}sn
                </span>
            </div>
        );
    }

    return (
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_16px_32px_-24px_rgba(15,23,42,0.35)]">
            <div className="text-center">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Icerigin Otomatik Kabulune Kalan Sure
                </h3>
                <div className="mt-4 grid grid-cols-4 gap-2">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-slate-100 bg-white px-2 py-3 shadow-sm"
                        >
                            <div className="text-lg font-bold leading-none text-slate-900 sm:text-xl">
                                {item.value}
                            </div>
                            <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
