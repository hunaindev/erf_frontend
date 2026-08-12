import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import Logo from '../components/Logo';
import axios from 'axios'; // Or use native fetch API
import { baseUrl } from '@/utils/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';



const Contact: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [instagram, setInstagram] = useState('');
    const [city, setCity] = useState('');
    const [userType, setUserType] = useState('');
    const [interests, setInterests] = useState('');
    const [message, setMessage] = useState('');
    const [brandPreference, setBrandPreference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const queryClient = useQueryClient();



    // console.log(isSubmitting)
    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
            <Header />

            <main className="flex-grow py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                        <div className="bg-white p-8 rounded-lg shadow-sm">

                            {/* <div style={{ width: "100%", height: "130vh" }}>
                                <iframe
                                    src={'https://calendar.app.google/RRwJqy7JmAoHCUtZ6'}
                                    style={{ border: 0, width: "100%", height: "100%" }}
                                    allow="camera; microphone; fullscreen; speaker; display-capture"
                                    loading="lazy"
                                    title="Book a Discovery Call"
                                />
                            </div> */}

                            <div style={{ width: "100%", height: "800px" }}>
                                <iframe
                                    src="https://cal.com/erfluencer/30min"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                ></iframe>
                            </div>

                        </div>


                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;


