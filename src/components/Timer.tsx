import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const CountdownTimer = ({ endDate }) => {
    const calculateTimeLeft = () => {
        const difference = + new Date(endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = null; // time expired
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer); // Cleanup
    }, []);

    if (!timeLeft) {
        return <p>Süre doldu</p>;
    }

    return (

        <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-center">
                <div className="text-center">
                    <h3 className="font-medium mb-2">Kampanyaya başvurmak için kalan süre</h3>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{timeLeft.days}</div>
                            <div className="text-xs text-gray-500">Gün</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold"> {String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className="text-xs text-gray-500">Saat</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className="text-xs text-gray-500">Dakika</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold"> {String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className="text-xs text-gray-500">Saniye</div>
                        </div>
                    </div>
                    {/* <Button className="bg-black hover:bg-gray-800 text-white w-full"
                    // onClick={handleApply}
                    >
                        Kampanyaya Başvur
                    </Button> */}

                </div>
            </div>
        </div>


    );
};

export default CountdownTimer;
