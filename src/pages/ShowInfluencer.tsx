import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Instagram, MessageSquare, User, } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import echo from "../pages/echo";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';
import CountdownTimer from '../components/AcceptContent';
import { Item } from '@radix-ui/react-select';


const badgeVariants = {
    completed: "bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium",
    waitingForContent: "bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium",
    waitingForPost: "bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium",
    waitingForVisit: "bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-medium",
};

interface Influencer {
    id: number;
    name: string;
    avatar: string;
    followers: string;
    engagementRate: string;
    reach: string;
    timeSlot: string;
    status: 'completed' | 'waitingForContent' | 'waitingForPost' | 'waitingForVisit';
    instagramUrl: string;
}

const influencers: Influencer[] = [
    {
        id: 1,
        name: "Kelly Hoang",
        avatar: "https://i.pravatar.cc/150?img=1",
        followers: "3007",
        engagementRate: "1.47%",
        reach: "359",
        timeSlot: "Already Visited",
        status: "completed",
        instagramUrl: "#"
    },
    {
        id: 2,
        name: "Sumaiya Ahmed",
        avatar: "https://i.pravatar.cc/150?img=2",
        followers: "14250",
        engagementRate: "2.72%",
        reach: "6556",
        timeSlot: "Already Visited",
        status: "waitingForContent",
        instagramUrl: "#"
    },
    {
        id: 3,
        name: "Maggie Hu",
        avatar: "https://i.pravatar.cc/150?img=3",
        followers: "19987",
        engagementRate: "3.84%",
        reach: "20369",
        timeSlot: "Already Visited",
        status: "completed",
        instagramUrl: "#"
    },
    {
        id: 4,
        name: "Lipika Banerjee",
        avatar: "https://i.pravatar.cc/150?img=4",
        followers: "-",
        engagementRate: "0.00%",
        reach: "0",
        timeSlot: "Tuesday, March 18th @ 1 PM",
        status: "completed",
        instagramUrl: "#"
    }
];

interface Post {
    id: number;
    influencerName: string;
    influencerAvatar: string;
    contentType: 'post' | 'document';
    postImage: string;
    status: 'pending' | 'approved' | 'rejected';
    contentTypeLabel: string;
    caption?: string;
    files?: { name: string, type: string, size: string }[];
}

const posts: Post[] = [
    {
        id: 1,
        influencerName: "Kelly Hoang",
        influencerAvatar: "https://i.pravatar.cc/150?img=1",
        contentType: 'post',
        postImage: "https://placehold.co/300x300/png?text=Post+Image",
        status: 'pending',
        contentTypeLabel: 'Instagram Gönderisi',
        caption: "Enjoying the amazing cuisine at Restaurant Name! The flavors are simply divine. #sponsored #foodie"
    },
    {
        id: 2,
        influencerName: "Maggie Hu",
        influencerAvatar: "https://i.pravatar.cc/150?img=3",
        contentType: 'post',
        postImage: "https://placehold.co/300x300/png?text=Post+Image",
        status: 'approved',
        contentTypeLabel: 'Instagram Hikayesi'
    },
    {
        id: 3,
        influencerName: "Sumaiya Ahmed",
        influencerAvatar: "https://i.pravatar.cc/150?img=2",
        contentType: 'document',
        postImage: "https://placehold.co/300x300/png?text=Document",
        status: 'pending',
        contentTypeLabel: 'Contract Documents',
        files: [
            { name: "influencer_agreement.pdf", type: "PDF", size: "1.2 MB" },
            { name: "campaign_brief.docx", type: "DOCX", size: "850 KB" },
            { name: "content_release.pdf", type: "PDF", size: "640 KB" },
        ]
    }
];

const CampaignDetail: React.FC = () => {

    const { ids } = useParams<{ ids: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [selectedTiktok, setSelectedTiktok] = useState<Influencer | null>(null);
    const [viewPostDialogOpen, setViewPostDialogOpen] = useState(false);
    const [viewDocumentsDialogOpen, setViewDocumentsDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [campaign, setCampaign] = useState();
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);


    const { id, role } = JSON.parse(localStorage.getItem('user'));

    // useEffect(() => {
    //     const channel = echo.private(`apply.${id}`)
    //         .listen('ApplyCampaignNotification', (e) => {

    //             getInfluencerToBrand()
    //         });

    //     return () => {
    //         channel.stopListening('ApplyCampaignNotification');
    //         echo.leave(`apply.${id}`);
    //     };
    // }, [id]);

    // useEffect(() => {
    //     const channel = echo.private(`upload-content.${id}`)
    //         .listen('UploadContent', (e) => {

    //             getInfluencerToBrand()
    //         });


    //     return () => {
    //         channel.stopListening('UploadContent');
    //         echo.leave(`upload-content.${id}`);
    //     };
    // }, [id]);
    // useEffect(() => {
    //     const channel = echo.private(`upload-content-link.${id}`)
    //         .listen('UploadContentLink', (e) => {
    //             getInfluencerToBrand()

    //         });

    //     return () => {
    //         channel.stopListening('UploadContentLink');
    //         echo.leave(`upload-content-link.${id}`);
    //     };
    // }, [id]);

    // useEffect(() => {
    //     const channel = echo.channel('user-status')
    //         .listen('.UserStatus', (e) => {
    //             console.log('Event received:', e);

    //             setData(prevData =>
    //                 prevData.map(item =>
    //                     item.influencer_id === e.id
    //                         ? { ...item, online: e.online }
    //                         : item
    //                 )
    //             );
    //         });

    //     return () => {
    //         echo.leave('user-status');
    //     };
    // }, []);

    useEffect(() => {
        const listeners = [
            {
                channel: `apply.${id}`,
                event: 'ApplyCampaignNotification',
                handler: () => getInfluencerToBrand()
            },
            {
                channel: `upload-content.${id}`,
                event: 'UploadContent',
                handler: () => getInfluencerToBrand()
            },
            {
                channel: `upload-content-link.${id}`,
                event: 'UploadContentLink',
                handler: () => getInfluencerToBrand()
            },
            {
                channel: 'user-status',
                event: '.UserStatus',
                isPublic: true,
                handler: (e) => {
                    console.log('Event received:', e);
                    setData(prevData =>
                        prevData.map(item =>
                            item.influencer_id === e.id
                                ? { ...item, online: e.online }
                                : item
                        )
                    );
                }
            }
        ];

        // Register all listeners
        listeners.forEach(({ channel, event, handler, isPublic }) => {
            const echoChannel = isPublic ? echo.channel(channel) : echo.private(channel);
            echoChannel.listen(event, handler);
        });

        // Cleanup
        return () => {
            listeners.forEach(({ channel, event, isPublic }) => {
                const echoChannel = isPublic ? echo.channel(channel) : echo.private(channel);
                echoChannel.stopListening(event);
                echo.leave(channel);
            });
        };
    }, [id]);



    const ExitIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="red"
            className="w-6 h-6"
        >
            <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm4.949 14.536a1 1 0 1 1-1.414 1.414L12 13.414 8.464 16.95a1 1 0 0 1-1.414-1.414L10.586 12 7.05 8.464A1 1 0 1 1 8.464 7.05L12 10.586l3.535-3.536a1 1 0 1 1 1.414 1.414L13.414 12Z" />
        </svg>
    );
    const TickIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="green"
            className="w-6 h-6"
        >
            <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm-32.1 281.7c-2.4 2.4-5.8 4.4-8.8 4.4s-6.4-2.1-8.9-4.5l-56-56 17.8-17.8 47.2 47.2L340 177.3l17.5 18.1-133.6 134.3z" />
        </svg>
    );

    const handleViewContent = (post: Post) => {
        setSelectedPost(post);
        // console.log(selectedPost)
        setViewDocumentsDialogOpen(true);

    };

    const handleViewProfile = (influencer: Influencer) => {
        setSelectedInfluencer(influencer);

    };

    const handleViewProfileTiktok = (influencer: Influencer) => {
        setSelectedTiktok(influencer);

    };

    const handleOpenChat = (influencer) => {
        const chatUserId = influencer?.influencer_id ?? influencer?.id;

        if (!chatUserId) return;

        navigate(`/messages?user=${chatUserId}`, {
            state: {
                chatUser: {
                    id: chatUserId,
                    name: influencer?.name,
                    role: 'Influencer',
                    online: influencer?.online,
                    image: influencer?.image,
                },
            },
        });
    };

    const getInfluencerToBrand = () => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/get-influencer-show-brand/${ids}`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },

        };

        axios.request(config)
            .then((response) => {
                // console.log(response.data)
                setCampaign(response.data.campaign)
                setData(response.data.data)
                setCount(response.data.count)

            }

            )
            .catch((error) => {
                console.log(error);

            });
    }
    useEffect(() => {
        getInfluencerToBrand()


    }, [])

    const handleAccept = (id) => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/accept-campaign/${id}`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
        };

        axios.request(config)
            .then((response) => {

                getInfluencerToBrand()
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleReject = (id) => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/reject-campaign/${id}`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
        };

        axios.request(config)
            .then((response) => {

                getInfluencerToBrand()
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleCancelOngoing = (id) => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/cancel-ongoing/${id}`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
        };

        axios.request(config)
            .then((response) => {

                getInfluencerToBrand()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleRejectAccept = (id, value) => {

        const data = JSON.stringify({
            "status": value,
            "id": id

        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/accept-reject-system`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json',
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                //  console.log(response.data)

                setViewDocumentsDialogOpen(false);
                getInfluencerToBrand()
            }

            )
            .catch((error) => {
                console.log(error);

            });
    }
    const getType = (url) => {
        const ext = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
        if (['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext)) return 'video';
        return 'unknown';
    };

    const getApplyStatusClass = (status) => {
        if (status === 'completed' || status === 'active') {
            return "rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700";
        }

        if (status === 'leave') {
            return "rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700";
        }

        return "rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700";
    };

    const getApplyStatusLabel = (status) => {
        if (status === 'completed') return 'Tamamlandı';
        if (status === 'active') return 'Aktif';
        if (status === 'applied') return 'Başvuruldu';
        if (status === 'leave') return 'Ayrıldı';
        return status;
    };

    const getTimeRangeText = (influencer) => {
        const value = [influencer?.day, influencer?.time].filter(Boolean).join(' ').trim();
        return value || 'Belirtilmedi';
    };

    const showTimeIcon = (influencer) => getTimeRangeText(influencer) !== "Already Visited";

    const getPostTypeLabel = (post) => {
        if (Array.isArray(post.type)) {
            return post.type.join(", ");
        }

        try {
            return JSON.parse(post.type || "[]").join(", ");
        } catch (error) {
            return post.type || "-";
        }
    };

    const renderInfluencerActions = (influencer, mobile = false) => {
        if (!mobile) {
            return (
                <div className="flex space-x-2 sm:space-x-3">
                    <button
                        onClick={() => handleOpenChat(influencer)}
                        className="text-primary hover:text-primary/80"
                        title="Mesaj gonder"
                        aria-label={`${influencer?.name || 'Influencer'} ile sohbet et`}
                    >
                        <MessageSquare size={18} />
                    </button>

                    {influencer?.instagram_name !== "" && influencer?.instagram_name !== null && (
                        <button
                            disabled={influencer?.instagram_name === "" || influencer?.instagram_name === null}
                            onClick={() => handleViewProfile(influencer)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <Instagram size={18} />
                        </button>
                    )}

                    {influencer?.tiktok_username !== "" && influencer?.tiktok_username !== null && (
                        <button
                            onClick={() => handleViewProfileTiktok(influencer)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </div>
                        </button>
                    )}

                    {(influencer.apply_status !== 'leave' && influencer.apply_status !== 'active' && influencer.apply_status !== 'completed') && (
                        <>
                            <button
                                onClick={() => handleAccept(influencer.apply_id)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <TickIcon size={16} />
                            </button>

                            <button
                                onClick={() => handleReject(influencer.apply_id)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ExitIcon size={16} />
                            </button>
                        </>
                    )}
                </div>
            );
        }

        const socialButtonClass = "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors";
        const decisionButtonClass = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-colors";
        const canReview = influencer.apply_status !== 'leave' && influencer.apply_status !== 'active' && influencer.apply_status !== 'completed';

        return (
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => handleOpenChat(influencer)}
                        className={`${socialButtonClass} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
                    >
                        <MessageSquare size={16} />
                        Mesaj Gonder
                    </button>

                    {influencer?.instagram_name !== "" && influencer?.instagram_name !== null && (
                        <button
                            disabled={influencer?.instagram_name === "" || influencer?.instagram_name === null}
                            onClick={() => handleViewProfile(influencer)}
                            className={`${socialButtonClass} border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100`}
                        >
                            <Instagram size={16} />
                            Instagram Profilini Gör
                        </button>
                    )}

                    {influencer?.tiktok_username !== "" && influencer?.tiktok_username !== null && (
                        <button
                            onClick={() => handleViewProfileTiktok(influencer)}
                            className={`${socialButtonClass} border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100`}
                        >
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </div>
                            TikTok Profilini Gör
                        </button>
                    )}
                </div>

                {canReview && (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleAccept(influencer.apply_id)}
                            className={`${decisionButtonClass} bg-green-600 text-white hover:bg-green-700`}
                        >
                            <TickIcon size={16} />
                            Kabul Et
                        </button>

                        <button
                            onClick={() => handleReject(influencer.apply_id)}
                            className={`${decisionButtonClass} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                        >
                            <ExitIcon size={16} />
                            Reddet
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Instagram non-null count
    // const instagramCount = data?.filter(item => item?.instagram_name !== null).length;

    // TikTok non-null count
    // const tiktokCount = data?.filter(item => item?.tiktok_username !== null).length;


    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardNavbar />

            <main className="flex-1 p-4 pb-44 md:p-6 md:pb-8 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs - Responsive Handling */}
                    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-slate-100 bg-white/95 px-4 pb-3 pt-2 backdrop-blur-sm sm:static sm:mx-0 sm:mb-6 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
                            {/* Campaign Header - Responsive Stacking */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4 sm:mb-6">
                                <div className="flex items-center">
                                    <Link to="/campaigns" className="mr-2 sm:mr-4">
                                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                                    </Link>
                                    <h1 className="text-xl sm:text-2xl font-bold mr-2 truncate max-w-[200px] sm:max-w-none">
                                        {campaign?.name}
                                    </h1>
                                </div>
                                <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-0.5 rounded self-start sm:self-auto">
                                    Live
                                </span>
                            </div>

                            <TabsList className="flex items-stretch justify-between gap-1 mb-0 bg-transparent p-0 h-auto border-b border-gray-200 w-full overflow-hidden">
                            <TabsTrigger
                                value="dashboard"
                                className="flex-1 min-w-0 whitespace-normal break-words py-2 px-2 sm:px-4 font-medium text-xs sm:text-base leading-5 text-center text-gray-700 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black rounded-none bg-transparent"
                            >
                                Kontrol Paneli

                            </TabsTrigger>
                            {
                                data?.length > 0 &&
                                <TabsTrigger
                                    value="influencers"
                                    className="flex-1 min-w-0 whitespace-normal break-words py-2 px-2 sm:px-4 font-medium text-xs sm:text-base leading-5 text-center text-gray-700 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black rounded-none bg-transparent"
                                >
                                    Influencer ({data?.length ?? 0})
                                </TabsTrigger>

                            }
                            {/* {
                                tiktokCount > 0 &&
                                <TabsTrigger
                                    value="tiktok"
                                    className="py-2 px-3 sm:px-4 font-medium text-sm sm:text-base text-gray-700 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black rounded-none bg-transparent w-full sm:w-auto text-left"
                                >
                                    Tiktok ({tiktokCount || 0})
                                </TabsTrigger>

                            } */}

                            <TabsTrigger
                                value="content"
                                className="flex-1 min-w-0 whitespace-normal break-words py-2 px-2 sm:px-4 font-medium text-xs sm:text-base leading-5 text-center text-gray-700 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black rounded-none bg-transparent"
                            >Onay için içerik ({(count && count)})

                            </TabsTrigger>
                        </TabsList>
                        </div>

                        {/* Dashboard Tab Content */}
                        <TabsContent value="dashboard" className="space-y-6 pb-8 sm:pb-6 md:pb-0">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <Link to={`/campaign-details/${campaign?.id}`} className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white">
                                        Kampanyayı Görüntüle
                                    </Button>
                                </Link>
                                <Button
                                    disabled={campaign?.status === 'Closed'}
                                    onClick={() => handleCancelOngoing(campaign?.id)}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    Devam Eden Kampanyayı İptal Et
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                {/* Gift Card */}
                                {/* <div className="bg-white p-4 sm:p-6 rounded-lg border flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 12L16 12M20 12L16 16M20 12L16 8M10 19.2857L4 19.2857C3.44772 19.2857 3 18.838 3 18.2857L3 5.71429C3 5.16201 3.44771 4.71429 4 4.71429L10 4.71429" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="text-lg sm:text-xl font-bold">Gift</span>
                                </div> */}

                                {/* Start Date Card */}
                                <Card>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <Clock className="text-purple-500 mr-2" size={16} />
                                            <span className="text-sm sm:text-base text-purple-500">Kampanya başlatıldı</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-semibold"> {campaign?.start_date
                                            ? new Date(campaign.start_date).toLocaleDateString("en-GB")
                                            : ""}</div>
                                    </CardContent>
                                </Card>

                                {/* Deadline Card */}
                                <Card>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="text-red-500 mr-2">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 9V13L14 15M12 5.5C7.30558 5.5 3.5 9.30558 3.5 14C3.5 18.6944 7.30558 22.5 12 22.5C16.6944 22.5 20.5 18.6944 20.5 14C20.5 9.30558 16.6944 5.5 12 5.5ZM12 5.5V1.5M12 1.5L10 3.5M12 1.5L14 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-sm sm:text-base text-red-500">Kampanya Bitiş Tarihi</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-semibold">
                                            {campaign?.end_date
                                                ? new Date(campaign.end_date).toLocaleDateString("en-GB")
                                                : ""}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="h-36 sm:hidden" />
                        </TabsContent>

                        {/* Influencers Tab Content */}
                        <TabsContent value="influencers" className="mt-0 pb-8 sm:pb-6 md:pb-0">
                            <div className="space-y-3 sm:hidden">
                                {data && data?.map((influencer) => (
                                    <div
                                        key={influencer.influencer_id}
                                        className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="relative inline-block shrink-0">
                                                    <div className="rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
                                                        <img
                                                            src={influencer.image || 'https://placehold.co/400x400'}
                                                            alt={influencer.name}
                                                            className="h-12 w-12 rounded-xl object-cover"
                                                        />
                                                    </div>
                                                    {!!influencer.online && (
                                                        <span
                                                            className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 shadow-sm"
                                                            title="Online"
                                                        ></span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-base font-semibold text-slate-900">{influencer.name}</p>
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                                        Influencer
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`${getApplyStatusClass(influencer.apply_status)} shrink-0 shadow-sm`}>
                                                {getApplyStatusLabel(influencer.apply_status)}
                                            </span>
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-4">
                                            <div className="flex items-start gap-3 text-sm text-slate-900">
                                                {showTimeIcon(influencer) ? (
                                                    <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
                                                        <Clock size={15} />
                                                    </div>
                                                ) : null}
                                                <div className="min-w-0">
                                                    <p className="break-words text-base font-semibold leading-6">
                                                        {getTimeRangeText(influencer)}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Ziyaret planı ve başvuru zamanı
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            {renderInfluencerActions(influencer, true)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="hidden overflow-x-auto rounded-lg border bg-white shadow-sm sm:block">
                                <Table className="min-w-[700px] sm:min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[150px]"> Name</TableHead>
                                            {/* <TableHead className="min-w-[100px]"> Takipçiler */}
                                            {/* </TableHead> */}
                                            {/* <TableHead className="min-w-[120px]">Etkilesim Orani</TableHead> */}
                                            <TableHead className="min-w-[150px]">Time Range</TableHead>
                                            <TableHead className="min-w-[120px]">Durum</TableHead>
                                            <TableHead className="min-w-[150px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data && data?.map((influencer) => (
                                            <TableRow key={influencer.influencer_id}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <div className="relative inline-block mr-3">
                                                            <img
                                                               src={imageUrl + '/' +influencer.image || 'https://placehold.co/400x400'}

                                                                alt={influencer.name}
                                                                className="h-8 w-8 rounded-full"
                                                            />
                                                            {!!influencer.online && (
                                                                <span
                                                                    className="absolute bottom-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500 border border-white rounded-full"
                                                                    title="Online"
                                                                ></span>
                                                            )}
                                                        </div>
                                                        <span className="truncate max-w-[100px] sm:max-w-none">{influencer.name}</span>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>{influencer.followers || 0}</TableCell> */}
                                                {/* <TableCell>{influencer.engagement || 0}%</TableCell> */}
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className="truncate max-w-[80px] sm:max-w-none">
                                                            {getTimeRangeText(influencer)}
                                                        </span>
                                                        {showTimeIcon(influencer) && (
                                                            <span className="ml-1 sm:ml-2 inline-block">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={
                                                        influencer.apply_status === 'completed'
                                                            ? "bg-green-100 text-green-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                            : influencer.apply_status === 'leave'
                                                                ? "bg-red-100 text-red-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                                : influencer.apply_status === 'active'
                                                                    ? "bg-green-100 text-green-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                                    : "bg-amber-100 text-amber-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                    }>
                                                        {influencer.apply_status === 'completed' && 'Tamamlandı'}
                                                        {influencer.apply_status === 'active' && 'Aktif'}
                                                        {influencer.apply_status === 'applied' && 'Başvuruldu'}
                                                        {influencer.apply_status === 'leave' && 'Ayrıldı'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2 sm:space-x-3">
                                                        <button
                                                            onClick={() => handleOpenChat(influencer)}
                                                            className="text-primary hover:text-primary/80"
                                                            title="Mesaj gonder"
                                                            aria-label={`${influencer?.name || 'Influencer'} ile sohbet et`}
                                                        >
                                                            <MessageSquare size={18} />
                                                        </button>

                                                        {/* <a
                                                            href={'https://www.instagram.com/' + influencer?.instagram_name}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            <Instagram size={16} />
                                                        </a> */}
                                                        {influencer?.instagram_name !== "" && influencer?.instagram_name !== null && (
                                                            <button
                                                                disabled={influencer?.instagram_name === "" || influencer?.instagram_name === null}
                                                                onClick={() => handleViewProfile(influencer)}
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                {/* <User size={16} /> */}
                                                                <Instagram size={18} />
                                                            </button>)
                                                        }
                                                        {/* {
                                                            influencer?.tiktok_username !== "" || influencer?.tiktok_username !== null ? (
                                                                <button
                                                                    onClick={() => handleViewProfileTiktok(influencer)}
                                                                    className="text-gray-600 hover:text-gray-900"
                                                                >
                                                                    <div className="w-5 h-5 mr-2 bg-black rounded-full flex items-center justify-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                                                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                                        </svg>
                                                                    </div>
                                                                </button>
                                                            ) : ('')
                                                        } */}

                                                        {
                                                            influencer?.tiktok_username !== "" && influencer?.tiktok_username !== null && (
                                                                <button
                                                                    onClick={() => handleViewProfileTiktok(influencer)}
                                                                    className="text-gray-600 hover:text-gray-900"
                                                                >
                                                                    <div className="w-5 h-5 mr-2 bg-black rounded-full flex items-center justify-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                                                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                                        </svg>
                                                                    </div>
                                                                </button>
                                                            )
                                                        }



                                                        {(influencer.apply_status !== 'leave' && influencer.apply_status !== 'active' && influencer.apply_status !== 'completed') && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleAccept(influencer.apply_id)}
                                                                    className="text-gray-600 hover:text-gray-900"
                                                                >
                                                                    <TickIcon size={16} />
                                                                </button>

                                                                <button

                                                                    onClick={() => handleReject(influencer.apply_id)}
                                                                    className="text-gray-600 hover:text-gray-900"
                                                                >
                                                                    <ExitIcon size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="h-36 sm:hidden" />
                        </TabsContent>

                        {/* tiktok Tab Content */}
                        {/* <TabsContent value="tiktok" className="mt-0">
                            <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
                                <Table className="min-w-[700px] sm:min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[150px]"> Name</TableHead>
                                            <TableHead className="min-w-[100px]"> Takipçiler
                                            </TableHead>
                                            <TableHead className="min-w-[120px]">Etkilesim Orani</TableHead>
                                            <TableHead className="min-w-[150px]">Time Range</TableHead>
                                            <TableHead className="min-w-[120px]">Durum</TableHead>
                                            <TableHead className="min-w-[150px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data && data?.filter(influencer => influencer.tiktok_username !== null && influencer.tiktok_username !== "")?.map((influencer, key) => (
                                            <TableRow key={key}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <div className="relative inline-block mr-3">
                                                            <img
                                                                src={influencer.tiktok_picture ? influencer.tiktok_picture : 'https://placehold.co/400x400'}

                                                                alt={influencer.name}
                                                                className="h-8 w-8 rounded-full"
                                                            />
                                                            {!!influencer.online && (
                                                                <span
                                                                    className="absolute bottom-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500 border border-white rounded-full"
                                                                    title="Online"
                                                                ></span>
                                                            )}
                                                        </div>
                                                        <span className="truncate max-w-[100px] sm:max-w-none">{influencer.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{influencer.tittok_followers || 0}</TableCell>
                                                <TableCell>{influencer.tiktok_engagement || 0}%</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className="truncate max-w-[80px] sm:max-w-none">
                                                            {influencer.day} {influencer.time}
                                                        </span>
                                                        {influencer.day + influencer.time !== "Already Visited" && (
                                                            <span className="ml-1 sm:ml-2 inline-block">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={
                                                        influencer.apply_status === 'completed'
                                                            ? "bg-green-100 text-green-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                            : influencer.apply_status === 'leave'
                                                                ? "bg-red-100 text-red-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                                : influencer.apply_status === 'active'
                                                                    ? "bg-green-100 text-green-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                                    : "bg-amber-100 text-amber-600 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full font-medium"
                                                    }>
                                                        {influencer.apply_status === 'completed' && 'Tamamlandı'}
                                                        {influencer.apply_status === 'active' && 'Aktif'}
                                                        {influencer.apply_status === 'applied' && 'Başvuruldu'}
                                                        {influencer.apply_status === 'leave' && 'Ayrıldı'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2 sm:space-x-3">
                                                        <a
                                                            href={influencer?.tiktok_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            <div className="w-6 h-6 mr-2 bg-black rounded-full flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                                                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                                </svg>
                                                            </div>

                                                        </a>
                                                        <button
                                                            disabled={influencer?.tiktok_username === "" || influencer?.tiktok_username === null}
                                                            onClick={() => handleViewProfileTiktok(influencer)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            <User size={16} />
                                                        </button>


                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent> */}

                        {/* Content for Approval Tab Content */}
                        <TabsContent value="content" className="mt-0 pb-8 sm:pb-6 md:pb-0">
                            <div className="space-y-3 sm:hidden">
                                {data && data.map((post) => (
                                    <div
                                        key={post?.apply_id}
                                        className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)]"
                                    >
                                        {post?.auto_accept && (
                                            <div className="mb-4 flex justify-start">
                                                <CountdownTimer endDate={`${post.auto_accept}`} variant="compact" />
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <div className="shrink-0 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
                                                <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                                                    <img
                                                        src={`${imageUrl}/${post.campaign_image}`}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-base font-semibold text-slate-900">
                                                    {post.name || "Influencer"}
                                                </p>
                                                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                    İçerik Türü
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <Badge
                                                        variant={post.contentType === 'post' ? 'default' : 'secondary'}
                                                        className="rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
                                                    >
                                                        {getPostTypeLabel(post)}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <span className={`${getApplyStatusClass(post.apply_status)} shrink-0 shadow-sm`}>
                                                {getApplyStatusLabel(post.apply_status)}
                                            </span>
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                                            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                Linkler
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    className="h-11 rounded-xl border-fuchsia-200 bg-white text-sm font-semibold text-fuchsia-700 hover:bg-fuchsia-50 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                                                    onClick={() => post.story_link && window.open(post.story_link, "_blank")}
                                                    disabled={!post.story_link}
                                                >
                                                    Story
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    className="h-11 rounded-xl border-blue-200 bg-white text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                                                    onClick={() => post.post_link && window.open(post.post_link, "_blank")}
                                                    disabled={!post.post_link}
                                                >
                                                    Post
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            {post.story || post.post ? (
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    className="h-12 w-full rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                                    onClick={() => handleViewContent(post)}
                                                >
                                                    İçeriği Görüntüle
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    className="h-12 w-full rounded-xl border-slate-200 bg-slate-100 text-sm font-semibold text-slate-400"
                                                    disabled
                                                >
                                                    İçerik Yok
                                                </Button>
                                            )}

                                            {post?.auto_accept && (
                                                <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                                    <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                        Otomatik Kabul Sayacı
                                                    </div>
                                                    <div className="text-xs">
                                                        <CountdownTimer endDate={`${post.auto_accept}`} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="hidden overflow-x-auto rounded-lg border bg-white shadow-sm sm:block">
                                <Table className="min-w-[700px] sm:min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">Preview</TableHead>
                                            {/* <TableHead className="min-w-[120px]">Phenomenon</TableHead> */}
                                            <TableHead className="min-w-[100px]">İçerik Türü</TableHead>
                                            <TableHead className="min-w-[100px]">Durum</TableHead>
                                            <TableHead className="min-w-[150px]">İçerik İçin Link</TableHead>
                                            <TableHead className="min-w-[150px] text-center"> İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data && data.map((post) => (
                                            <TableRow key={post?.apply_id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded bg-gray-100 overflow-hidden shrink-0">
                                                            <img
                                                                src={`${imageUrl}/${post.campaign_image}`}

                                                                alt={post.name || "Influencer"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {post.name || "Influencer"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>
                                                    <div className="flex items-center">
                                                        <div className="relative inline-block mr-2">
                                                            <img
                                                                src={post.image || 'https://placehold.co/400x400'}

                                                                alt={post.name}
                                                                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                                                            />
                                                            {!!post.online && (
                                                                <span
                                                                    className="absolute bottom-0 right-0 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 border border-white rounded-full"
                                                                    title="Online"
                                                                ></span>
                                                            )}
                                                        </div>
                                                        <span className="truncate max-w-[80px] sm:max-w-none">{post.name}</span>
                                                    </div>
                                                </TableCell> */}
                                                <TableCell>
                                                    <Badge variant={post.contentType === 'post' ? 'default' : 'secondary'} className="text-xs sm:text-sm">
                                                        {Array.isArray(post.type)
                                                            ? post.type.join(", ")
                                                            : JSON.parse(post.type || "[]").join(", ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={
                                                        post.apply_status === 'completed'
                                                            ? "bg-green-100 text-green-600 px-2 py-0.5 text-xs rounded-full font-medium"
                                                            : post.apply_status === 'leave'
                                                                ? "bg-red-100 text-red-600 px-2 py-0.5 text-xs rounded-full font-medium"
                                                                : post.apply_status === 'active'
                                                                    ? "bg-green-100 text-green-600 px-2 py-0.5 text-xs rounded-full font-medium"
                                                                    : "bg-amber-100 text-amber-600 px-2 py-0.5 text-xs rounded-full font-medium"
                                                    }>
                                                        {post.apply_status === 'completed' && 'Tamamlandı'}
                                                        {post.apply_status === 'active' && 'Aktif'}
                                                        {post.apply_status === 'applied' && 'Başvuruldu'}
                                                        {post.apply_status === 'leave' && 'Ayrıldı'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                                        {post.story_link ? (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                className="text-xs"
                                                                onClick={() => window.open(post.story_link, "_blank")}
                                                            >
                                                                Story
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                className="text-xs"
                                                                disabled
                                                            >
                                                                Story
                                                            </Button>
                                                        )}
                                                        {post.post_link ? (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                className="text-xs"
                                                                onClick={() => window.open(post.post_link, "_blank")}
                                                            >
                                                                Post
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                className="text-xs"
                                                                disabled
                                                            >
                                                                Post
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col items-center">
                                                        {post.story || post.post ? (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                className="text-xs w-full sm:w-auto mb-1"
                                                                onClick={() => handleViewContent(post)}
                                                            >
                                                                İçeriği Görüntüle
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                className="text-xs w-full sm:w-auto mb-1"
                                                                disabled
                                                            >
                                                                İçerik Yok
                                                            </Button>
                                                        )}

                                                        {post?.auto_accept && (
                                                            <div className="text-xs mt-1">
                                                                <CountdownTimer endDate={`${post.auto_accept}`} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="h-36 sm:hidden" />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />

            {/* Dialog components remain the same as before */}

            {/* Influencer Profile Dialog */}
            <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-center">Instagram Profili</DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

                    {selectedInfluencer && (
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <img
                                  src={imageUrl + '/' + selectedInfluencer.image || 'https://placehold.co/400x400'}
                                    alt={selectedInfluencer.instagram_name}
                                    className="w-24 h-24 rounded-full"
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-1">{selectedInfluencer.instagram_name}</h3>
                            <p className="text-gray-500 mb-4">@{selectedInfluencer.instagram_name ? selectedInfluencer.instagram_name.toLowerCase().replace(' ', '') : ''}</p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-4">
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm">Takipçi Sayısı</p>
                                    <p className="font-semibold">{selectedInfluencer.followers}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm">Etkileşim Oranı</p>
                                    {/* <p className="font-semibold">{selectedInfluencer.engagementRate}</p> */}
                                    <p className="font-semibold">{selectedInfluencer.engagement}</p>
                                </div>

                            </div>

                            <div className="flex justify-center gap-3 mt-2">

                                <a
                                    href={'https://www.instagram.com/' + selectedInfluencer?.instagram_name}
                                    className="flex items-center gap-1 text-gray-600 hover:underline"
                                >
                                    <Instagram size={16} />  Instagram
                                </a>


                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* tiktok Profile Dialog */}
            <Dialog open={!!selectedTiktok} onOpenChange={() => setSelectedTiktok(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-center">TikTok Profili</DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

                    {selectedTiktok && (
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <img
                                    src={imageUrl + '/' + selectedTiktok?.image || 'https://placehold.co/400x400'}

                                    alt={selectedTiktok.tiktok_username}
                                    className="w-24 h-24 rounded-full"
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-1">{selectedTiktok.tiktok_username}</h3>
                            <p className="text-gray-500 mb-4">@{selectedTiktok.tiktok_username ? selectedTiktok.tiktok_username.toLowerCase().replace(' ', '') : ''}</p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-4">
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm">Takipçi Sayısı</p>
                                    <p className="font-semibold">{selectedTiktok.tiktok_followers}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm">Etkileşim Oranı</p>
                                    {/* <p className="font-semibold">{selectedTiktok.engagementRate}</p> */}
                                    <p className="font-semibold">{selectedTiktok.tiktok_engagement}</p>
                                </div>

                            </div>

                            <div className="flex justify-center gap-3 mt-2">

                                <a
                                    href={selectedTiktok?.tiktok_url}
                                    className="flex items-center gap-1 text-gray-600 hover:underline"
                                >
                                    <div className="w-6 h-6 mr-2 bg-black rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </div>  TikTok
                                </a>


                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* View Post Dialog */}
            <Dialog open={viewPostDialogOpen} onOpenChange={setViewPostDialogOpen}>
                <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-4 shadow-2xl sm:p-6">
                    <DialogTitle className="text-center text-xl font-semibold text-slate-900">İçerik İncelemesi</DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

                    {selectedPost && selectedPost.contentType === 'post' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        src={selectedPost.influencerAvatar}
                                        alt={selectedPost.influencerName}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <h3 className="font-medium">{selectedPost.influencerName}</h3>
                                        <p className="text-sm text-gray-500">@{selectedPost.influencerName.toLowerCase().replace(' ', '')}</p>
                                    </div>
                                </div>
                                <Badge>{selectedPost.contentTypeLabel}</Badge>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <img
                                    src={`${imageUrl}/${selectedPost.postImage}`}

                                    alt="Post content"
                                    className="w-full h-auto"
                                />
                            </div>

                            {selectedPost.caption && (
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Açıklama</h4>
                                    <p className="text-gray-700">{selectedPost.caption}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-4">
                                {selectedPost.status === 'pending' && (
                                    <>
                                        <Button variant="outline" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                                            Reddet
                                        </Button>
                                        <Button className="bg-green-600 hover:bg-green-700">
                                            Onayla
                                        </Button>
                                    </>
                                )}
                                {selectedPost.status === 'approved' && (
                                    <Button className="bg-green-600" disabled>Onaylandı</Button>
                                )}
                                {selectedPost.status === 'rejected' && (
                                    <Button className="bg-red-600" disabled>Reddedildi</Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* View Documents Dialog */}
            <Dialog open={viewDocumentsDialogOpen} onOpenChange={setViewDocumentsDialogOpen}>
                <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-4 shadow-2xl sm:p-6">
                    <DialogTitle className="text-center text-xl font-semibold text-slate-900">İçerik İncelemesi</DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />


                    <div className="space-y-4">
                        {selectedPost?.story && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">İçerik Turu</p>
                                        <h4 className="mt-1 text-base font-semibold text-slate-900">Story</h4>
                                    </div>
                                    {selectedPost?.story_status === 'accepted' && (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            Kabul Edildi
                                        </span>
                                    )}
                                    {selectedPost?.story_status === 'rejected' && (
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                            Reddedildi
                                        </span>
                                    )}
                                    {selectedPost?.story_status === null && (
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                            İnceleme Bekliyor
                                        </span>
                                    )}
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    {(() => {
                                        const type = getType(selectedPost.story);

                                        if (type === 'image') {
                                            return (
                                                <img
                                                    src={`${imageUrl}/${selectedPost.story}`}
                                                    alt="story media"
                                                    className="h-auto max-h-[300px] w-full object-cover"
                                                />
                                            );
                                        }

                                        if (type === 'video') {
                                            return (
                                                <video
                                                    src={`${imageUrl}/${selectedPost.story}`}
                                                    controls
                                                    className="max-h-[300px] w-full bg-black object-contain"
                                                />
                                            );
                                        }

                                        return (
                                            <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">
                                                Önizleme mevcut değil
                                            </div>
                                        );
                                    })()}
                                </div>

                                {selectedPost?.story_status === null && (
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <Button
                                            className="h-12 rounded-xl bg-green-600 text-sm font-semibold text-white hover:bg-green-700"
                                            onClick={() => handleRejectAccept(selectedPost?.apply_id, 'accepted_story')}
                                        >
                                            Kabul Et
                                        </Button>
                                        <Button
                                            className="h-12 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
                                            onClick={() => handleRejectAccept(selectedPost?.apply_id, 'rejected_story')}
                                        >
                                            Reddet
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedPost?.post && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">İçerik Turu</p>
                                        <h4 className="mt-1 text-base font-semibold text-slate-900">Post</h4>
                                    </div>
                                    {selectedPost?.post_status === 'accepted' && (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            Kabul Edildi
                                        </span>
                                    )}
                                    {selectedPost?.post_status === 'rejected' && (
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                            Reddedildi
                                        </span>
                                    )}
                                    {selectedPost?.post_status === null && (
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                            İnceleme Bekliyor
                                        </span>
                                    )}
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    {(() => {
                                        const type = getType(selectedPost.post);

                                        if (type === 'image') {
                                            return (
                                                <img
                                                    src={`${imageUrl}/${selectedPost.post}`}
                                                    alt="post media"
                                                    className="h-auto max-h-[300px] w-full object-cover"
                                                />
                                            );
                                        }

                                        if (type === 'video') {
                                            return (
                                                <video
                                                    src={`${imageUrl}/${selectedPost.post}`}
                                                    controls
                                                    className="max-h-[300px] w-full bg-black object-contain"
                                                />
                                            );
                                        }

                                        return (
                                            <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">
                                                Önizleme mevcut değil
                                            </div>
                                        );
                                    })()}
                                </div>

                                {selectedPost?.post_status === null && (
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <Button
                                            className="h-12 rounded-xl bg-green-600 text-sm font-semibold text-white hover:bg-green-700"
                                            onClick={() => handleRejectAccept(selectedPost?.apply_id, 'accepted_post')}
                                        >
                                            Kabul Et
                                        </Button>
                                        <Button
                                            className="h-12 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
                                            onClick={() => handleRejectAccept(selectedPost?.apply_id, 'rejected_post')}
                                        >
                                            Reddet
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="hidden border rounded-lg overflow-hidden p-4">
                            <h4 className="font-medium mb-3"></h4>
                            <div className="space-y-3">

                                <div className="flex items-center justify-between py-2 border-b last:border-0">


                                    {selectedPost?.story && (() => {
                                        const type = getType(selectedPost.story);

                                        return (
                                            <div>
                                                {type === 'image' &&

                                                    <img src={`${imageUrl}/${selectedPost.story}`} alt="media" width={200} />}
                                                {type === 'video' &&
                                                    <video src={`${imageUrl}/${selectedPost.story}`} controls width={200} />}
                                            </div>
                                        );
                                    })()}

                                    {selectedPost?.story_status === 'accepted' ?
                                        <Button disabled className="bg-green-600">Kabul Edildi</Button>
                                        : ''}
                                    {selectedPost?.story_status === 'rejected' ?
                                        <Button disabled className="bg-red-600">Reddedildi</Button>

                                        : ''}


                                    {selectedPost?.story_status === null && selectedPost?.story != null && (
                                        <>
                                            <Button className="bg-green-600"
                                                onClick={() => handleRejectAccept(selectedPost?.apply_id, 'accepted_story')}>
                                                Kabul Et
                                            </Button>

                                            <Button className="bg-red-600"
                                                onClick={() => handleRejectAccept(selectedPost?.apply_id, 'rejected_story')}>
                                                Reddet
                                            </Button>
                                        </>
                                    )}

                                </div>

                                <div className="flex items-center justify-between py-2 border-b last:border-0">

                                    {selectedPost?.post && (() => {
                                        const type = getType(selectedPost.post);
                                        return (
                                            <div>
                                                {type === 'image' &&

                                                    <img src={`${imageUrl}/${selectedPost.post}`} alt="media" width={200} />}
                                                {type === 'video' &&

                                                    <video src={`${imageUrl}/${selectedPost.post}`} controls width={200} />}
                                            </div>
                                        );
                                    })()}
                                    {selectedPost?.post_status === 'accepted' ?
                                        <Button disabled className="bg-green-600">Kabul Edildi</Button>
                                        : ''}
                                    {selectedPost?.post_status === 'rejected' ?

                                        <Button disabled className="bg-red-600">Reddedildi</Button>
                                        : ''}



                                    {selectedPost?.post_status === null && selectedPost?.post != null && (
                                        <>
                                            <Button className="bg-green-600" onClick={() => handleRejectAccept(selectedPost?.apply_id, 'accepted_post')}>Kabul Et</Button>

                                            <Button className="bg-red-600" onClick={() => handleRejectAccept(selectedPost?.apply_id, 'rejected_post')}>Reddet</Button>
                                        </>
                                    )}
                                </div>


                                <DialogTitle className="text-center">

                                </DialogTitle>
                            </div>
                        </div>

                        <div className="hidden flex justify-end gap-3 mt-4">
                            {/* {selectedPost.status === 'pending' && (
                          <>
                            <Button variant="outline" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                              Decline
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                          </>
                        )}
                        {selectedPost.status === 'approved' && (
                          <Button className="bg-green-600" disabled>Onaylandı</Button>
                        )}
                        {selectedPost.status === 'rejected' && (
                          <Button className="bg-red-600" disabled>Reddedildi</Button>
                        )} */}
                        </div>
                    </div>
                    {/* )} */}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CampaignDetail;
