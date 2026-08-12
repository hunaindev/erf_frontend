
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';

const BankAccount: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfluencerNavbar />
      
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Manage Payouts</h1>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-4">Set up Instant Payouts</h2>
                <p className="text-center max-w-2xl mb-6">
                  Get paid to your local bank account automatically. No minimum threshold. If you don't have a 
                  Stripe account, you'll be asked to create one for free.
                </p>
                
                <Button className="px-8 py-2 bg-gray-900 hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  Bağlan Stripe
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium text-gray-600 mb-1">Outstanding Balance</h3>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <Button className="mt-4 md:mt-0 bg-gray-900 hover:bg-gray-800" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
                  </svg>
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BankAccount;

