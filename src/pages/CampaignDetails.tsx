import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Eye } from 'lucide-react';
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';

const CampaignDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [campaign, setCampaign] = useState<any>(null);

    const getCampaign = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/get-campaign-details/${id}`,
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },
        };

        axios
            .request(config)
            .then((response) => {
                setCampaign(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getCampaign();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const formatDate = (value?: string) => {
        if (!value) return '-';
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return '-';
        }

        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getFullYear()}`;
    };

    const campaignInfoSections = useMemo(
        () =>
            [
                { title: 'Kampanya Amacı', value: campaign?.goals },
                { title: 'Ürün Tipi', value: campaign?.product_type },
                {
                    title: 'İçerik Türü',
                    value: campaign?.content_type ? JSON.parse(campaign.content_type).join(', ') : '',
                },
                { title: 'Kategori', value: campaign?.category },
                { title: 'Gereksinimler', value: campaign?.requirements },
                {
                    title: 'Gerekli Konum Etiketi',
                    value: `${campaign?.user?.company_name || ''}${campaign?.user?.location ? ` - ${campaign.user.location}` : ''}`,
                },
                { title: 'Promosyon Kodları', value: campaign?.codes },
                { title: 'Gerekli Hashtagler', value: campaign?.hashtags },
            ].filter((section) => section.value),
        [campaign]
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <DashboardNavbar />

            <main className="flex-1 px-4 pb-36 pt-4 sm:p-6 sm:pb-32 lg:px-8 lg:pb-10">
                <div className="mx-auto max-w-6xl">
                    <button
                        onClick={handleBack}
                        className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white p-3 text-gray-600 shadow-sm transition-colors hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div className="min-w-0">
                            <h1 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">
                                {campaign?.name || 'Kampanya Detayı'}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                {campaign?.user?.company_name || 'Marka kampanya detayı'}
                            </p>
                        </div>

                        <span className="inline-flex w-full items-center justify-center rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary sm:w-auto">
                            Kampanya Detayı
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                        <div className="col-span-1">
                            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                                <div className="relative aspect-[4/3] bg-slate-100">
                                    <img
                                        src={`${imageUrl}/${campaign?.image}`}
                                        alt={campaign?.name || 'Kampanya'}
                                        className="h-full w-full object-cover"
                                    />

                                    <div className="absolute bottom-3 right-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
                                        <Eye className="mr-1 h-4 w-4" />
                                        {campaign?.count ? campaign.count : 0}
                                    </div>
                                </div>

                                <div className="space-y-2 p-4 sm:p-5">
                                    <h3 className="font-medium text-slate-900">Hakkında</h3>
                                    <p className="break-words text-sm leading-6 text-slate-600">
                                        {campaign?.user?.about || 'Marka hakkında bilgi bulunmuyor.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <div className="grid grid-cols-1 gap-4 border-b border-gray-200 pb-4 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                        <p className="text-sm text-slate-500">Katılım Tarihi</p>
                                        <p className="mt-2 text-lg font-semibold text-slate-900">
                                            {formatDate(campaign?.start_date)}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                        <p className="text-sm text-slate-500">Kampanya Süresi</p>
                                        <p className="mt-2 text-lg font-semibold text-slate-900">
                                            {formatDate(campaign?.end_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-0">
                                    {campaignInfoSections.map((section, index) => (
                                        <div
                                            key={`${section.title}-${index}`}
                                            className={`${index !== 0 ? 'border-t border-gray-200' : ''} py-4`}
                                        >
                                            <h3 className="mb-3 text-sm font-medium text-slate-900">{section.title}</h3>
                                            <p className="break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                {section.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CampaignDetail;
