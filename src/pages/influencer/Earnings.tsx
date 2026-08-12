
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Earnings: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfluencerNavbar />

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Earnings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-medium text-gray-700 mb-4 flex items-center">
                  Available
                  <button className="ml-2 bg-gray-200 rounded-full p-1 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                </h2>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-600 mb-1 flex items-center">
                    Withdrawal to date
                    <button className="ml-2 bg-gray-200 rounded-full p-1 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </button>
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">$0.00</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 mb-1 flex items-center">
                    Available to Withdraw
                    <button className="ml-2 bg-gray-200 rounded-full p-1 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </button>
                  </h3>
                  <p className="text-2xl font-bold text-yellow-500">$0.00</p>
                  <Link to="/influencer/bank-account" className="text-sm text-primary hover:underline">Manage payout methods</Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-medium text-gray-700 mb-4 flex items-center">
                  Future Ödemeler
                  <button className="ml-2 bg-gray-200 rounded-full p-1 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                </h2>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-600 mb-1 flex items-center">
                    Earnings being cleared
                    <button className="ml-2 bg-gray-200 rounded-full p-1 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </button>
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">$0.00</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 mb-1 flex items-center">
                    Aktif Kampanyalardan Potansiyel Kazanc
                    <button className="ml-2 bg-gray-200 rounded-full p-1 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </button>
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">$0.00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setCalendarOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MM/dd/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Kampanyasi</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Instagram Kampanyasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tum Kampanyalar</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border bg-white rounded-md shadow-sm mb-8">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="font-semibold">Date</div>
              <div className="font-semibold">Type</div>
              <div className="font-semibold">Kampanya Adi</div>
              <div className="font-semibold">Individual Activities</div>
              <div className="font-semibold">Amount</div>
            </div>

            <div className="text-center py-12">
              <img src="/lovable-uploads/b92294ac-17cf-4e67-b828-f6f3e4bc7bb9.png" alt="No data" className="w-16 h-16 mx-auto mb-4" />
              <p className="text-gray-500">Veri Yok</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Earnings;



