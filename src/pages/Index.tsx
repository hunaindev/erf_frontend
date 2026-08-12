import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToggleSwitch from '../components/ToggleSwitch';
import Hero from '../components/Hero';
import NeuralNetwork3D from '../components/NeuralNetwork3D';
import { updateExpiredTrials,updateNextBilling } from "./../api/ApiRoute";
import { useQuery, } from '@tanstack/react-query';

const Index: React.FC = () => {
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shouldRenderNeuralNetwork = !Capacitor.isNativePlatform();
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
        data: expiredTrials,
    } = useQuery({
        queryKey: ['updateExpiredTrials'],
        queryFn: updateExpiredTrials,

    });
    const {
        data: nextBilling,
    } = useQuery({
        queryKey: ['updateNextBilling'],
        queryFn: updateNextBilling,

    });

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleModeChange = (value: boolean) => {
    setIsLoading(true);

    if (transitionTimeoutRef.current !== null) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsInfluencer(value);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div
      className={`relative isolate flex min-h-screen flex-col bg-[#060010] py-4 text-white transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {shouldRenderNeuralNetwork ? <NeuralNetwork3D /> : null}

      <div className="relative z-10">
        <Header isInfluencer={isInfluencer} />
      </div>

      <main className="relative z-10 flex flex-grow flex-col py-5">
        <div className="mx-auto w-full max-w-5xl py-5 md:px-0">
          <ToggleSwitch isInfluencer={isInfluencer} setIsInfluencer={handleModeChange} />
          <Hero isInfluencer={isInfluencer} />
        </div>
      </main>

      <div className="relative z-10 hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
