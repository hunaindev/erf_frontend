import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '@/utils/constants';
import { Checkbox } from '@/components/ui/checkbox';


const InfluencerSignUp: React.FC = () => {

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-500 dark" style={{
            backgroundColor: "white"
        }}
        >
            {/* Background wrapper */}
            <div className="absolute inset-0 -z-10 overflow-hidden" >
                <div className="absolute inset-0 bg-background"></div>
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-primary/5 to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-screen bg-gradient-to-tr from-primary/5 to-transparent opacity-60"></div>
            </div >

            <Header />

            <main className="flex-grow flex flex-col items-center justify-center mt-28">

                <div className="w-full max-w-2xl px-6">
                    <div className="bg-background border border-border rounded-2xl shadow-sm p-8 text-center">

                        <h3 className="text-xl font-bold text-foreground">
                            Congratulations! Your influencer account has been created.
                        </h3>

                        <div className="border-b border-border w-1/4 mx-auto my-6"></div>

                        <p className="text-base font-medium text-muted-foreground">
                            Our team is currently reviewing your account.
                            Approval will be completed within <span className="font-semibold text-foreground">2–3 business days</span>.
                        </p>

                    </div>
                </div>

            </main>

            <Footer />
        </div >
    );
};

export default InfluencerSignUp;
