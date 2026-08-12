import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { baseUrl } from '@/utils/constants';

const Shimmer = () => (
  <div className="animate-pulse">
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  </div>
);

const plans = {
  standardMonthly: 1,
  standardYearly: 2,
  agencyMonthly: 3,
  agencyYearly: 4,
  corporate: 5,
  trial: 6,
};

const getPlanLabel = (planId) => {
  if (planId === plans.standardMonthly) return 'Standart Aylik';
  if (planId === plans.standardYearly) return 'Standart Yillik';
  if (planId === plans.agencyMonthly) return 'Ajans Aylik';
  if (planId === plans.agencyYearly) return 'Ajans Yillik';
  if (planId === plans.corporate) return 'Kurumsal Aylik';
  if (planId === plans.trial) return 'Deneme';
  return '-';
};

const getAmountLabel = (planId) => {
  if (planId === plans.standardMonthly) return '999 TL';
  if (planId === plans.standardYearly) return '11,988 TL';
  if (planId === plans.agencyMonthly) return '3,999 TL';
  if (planId === plans.agencyYearly) return '35,988 TL';
  if (planId === plans.corporate) return '2,999 TL';
  if (planId === plans.trial) return 'Deneme';
  return '0 TL';
};

const getStatusClasses = (status) => {
  if (status === 'active') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (status === 'cancelled' || status === 'failed') {
    return 'bg-red-100 text-red-700';
  }

  return 'bg-slate-100 text-slate-700';
};

const Financials = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetSubscription = async () => {
    setIsLoading(true);

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-paytr-row-subscription`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setSubscriptionDetails(response.data?.paytr);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleGetSubscription();
  }, []);

  const hasTransaction = !subscriptionDetails?.message && subscriptionDetails;
  const paymentDate = hasTransaction ? new Date(subscriptionDetails.created_at).toLocaleString() : '';
  const planLabel = hasTransaction ? getPlanLabel(subscriptionDetails.plan_id) : '';
  const amountLabel = hasTransaction ? getAmountLabel(subscriptionDetails.plan_id) : '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />

      <main className="flex-1 p-4 pb-44 sm:p-6 sm:pb-8 md:p-12">
        <div className="mx-auto w-full max-w-5xl">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="mb-6 w-full justify-start rounded-2xl border border-slate-100 bg-fuchsia-50/60 p-1">
              <TabsTrigger
                value="transactions"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900"
              >
                Islemler
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-0">
              <div className="sm:hidden">
                {isLoading ? (
                  <Shimmer />
                ) : hasTransaction ? (
                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Plan</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">{planLabel}</h3>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(subscriptionDetails.status)}`}>
                        {subscriptionDetails.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Ödeme Tarihi</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-900 break-words">{paymentDate}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tutar</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">{amountLabel}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Gösterilecek işlem bulunamadı
                  </div>
                )}
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium">Plan</TableHead>
                      <TableHead className="font-medium">Durum</TableHead>
                      <TableHead className="font-medium">Ödeme Tarihi</TableHead>
                      <TableHead className="font-medium">Tutar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Shimmer />
                        </TableCell>
                      </TableRow>
                    ) : hasTransaction ? (
                      <TableRow key={1} className="border-b">
                        <TableCell>{planLabel}</TableCell>
                        <TableCell>{subscriptionDetails.status}</TableCell>
                        <TableCell>{paymentDate}</TableCell>
                        <TableCell>{amountLabel}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                          Gösterilecek işlem bulunamadı
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          <div className="h-36 sm:hidden" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Financials;
