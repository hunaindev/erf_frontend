
import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, Users, TrendingUp, Star, Award, Eye, FileDown, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { exportToCSV, exportToPDF } from '../../utils/tableExport';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baseUrl } from '@/utils/constants';

const influencersData = [
    {
        id: "INF-001",
        name: "Sarah Johnson",
        username: "@fitness_sarah",
        email: "sarah@example.com",
        followers: "125K",
        engagementRate: "4.2%",
        level: "Top Rated",
        category: "Fitness",
        campaigns: 12,
        earnings: "$15,750",
        joinDate: "2023-01-15",
        status: "active",
        avatar: "/lovable-uploads/7b7b4cb9-4965-4241-9825-b6be1ae9bd52.png"
    },
    {
        id: "INF-002",
        name: "Mike Runner",
        username: "@runner_mike",
        email: "mike@example.com",
        followers: "89K",
        engagementRate: "3.8%",
        level: "Level 2",
        category: "Sports",
        campaigns: 8,
        earnings: "$9,200",
        joinDate: "2023-03-22",
        status: "active",
        avatar: "/placeholder.svg"
    },
    {
        id: "INF-003",
        name: "Emma Style",
        username: "@emma_fashion",
        email: "emma@example.com",
        followers: "67K",
        engagementRate: "5.1%",
        level: "Level 1",
        category: "Fashion",
        campaigns: 15,
        earnings: "$12,400",
        joinDate: "2023-02-10",
        status: "active",
        avatar: "/placeholder.svg"
    },
    {
        id: "INF-004",
        name: "Alex Tech",
        username: "@alex_reviews",
        email: "alex@example.com",
        followers: "25K",
        engagementRate: "6.3%",
        level: "Rising Talent",
        category: "Technology",
        campaigns: 5,
        earnings: "$3,800",
        joinDate: "2023-06-18",
        status: "pending",
        avatar: "/placeholder.svg"
    }
];

const NotOnaylandı = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [influencers, setInfluencers] = useState(influencersData);
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [loadingId, setLoadingId] = useState(null);
    const [approvedLoadingId, setOnaylandıLoadingId] = useState(null);
    const [rejectedLoadingId, setReddedildiLoadingId] = useState(null);

    const handleExport = (format: 'csv' | 'pdf') => {
        const exportData = filteredInfluencers.map(influencer => ({
            'Influencer ID': influencer.id,
            'Name': influencer.name,
            'Username': influencer.username,
            'Email': influencer.email,
            'Followers': influencer.followers,
            'Etkilesim Orani': influencer.engagementRate,
            'Level': influencer.level,
            'Category': influencer.category,
            'Campaigns': influencer.campaigns,
            'Earnings': influencer.earnings,
            'Join Date': influencer.joinDate,
            'Durum': influencer.status
        }));

        if (format === 'csv') {
            exportToCSV(exportData, 'influencers');
        } else {
            exportToPDF(exportData, 'influencers', 'Influencer Raporu');
        }

        toast.success(`Influencerlar disa aktarildi: ${format.toUpperCase()}`);
    };

    const filteredInfluencers = influencers.filter(influencer => {
        const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            influencer.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === "all" || influencer.level === levelFilter;
        return matchesSearch && matchesLevel;
    });


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500); // Delay in ms (500ms = 0.5 second)

        return () => clearTimeout(timer);
    }, [searchTerm]);

    function fetchInfluencers() {
        return axios.get(`${baseUrl}/api/get-influencer-not-approved`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }

    const {
        data: allInfluencer,
        isLoading: isAllLoading,
        isError: isAllError,
        error: allError,
    } = useQuery({
        queryKey: ['all-influencer-not-approved'],
        queryFn: fetchInfluencers,
        enabled: !searchTerm // Only run when no search term
    });

    function searchInfluencer() {
        return axios.get(`${baseUrl}/api/get-influencer-not-approved?search=${searchTerm}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }
    const {
        data: searchedInfluencer,
        isLoading: isSearchLoading,
        isError: isSearchError,
        error: searchError,
    } = useQuery({
        queryKey: ['search-influencer', searchTerm],
        queryFn: searchInfluencer,
        enabled: !!debouncedTerm // Only run when searchTerm exists
    });
    const data = searchTerm ? searchedInfluencer : allInfluencer;



    const useOnaylandı = () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({ url, id }) =>
                axios.put(`${baseUrl}/api/${url}/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                        'Content-Type': 'application/json',
                    }
                }),
            onSuccess: () => {
                // Refetch influencers after status change
                queryClient.invalidateQueries(['all-influencer', 'search-influencer']);
            }
        });
    };

    const { mutate: updateOnaylandı, isPending: isPendingOnaylandı } = useOnaylandı();

    const handleInstagramOnaylandı = (url, id) => {
        setOnaylandıLoadingId(id)

        updateOnaylandı(
            { url, id },
            {
                onSettled: () => {
                    setOnaylandıLoadingId(null);
                },
            });
    };
    const handleInstagramReddedildi = (url, id) => {
        setReddedildiLoadingId(id)
        updateOnaylandı({ url, id }, {
            onSettled: () => {
                setReddedildiLoadingId(null);
            },
        });
    };

 //   console.log(selectedInfluencer)

    return (
        <div className="admin-dashboard">
            <AdminNavbar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Influencer Hesap Onay Yönetimi</h1>
                    <p>Kayıtli tum influencer hesap onaylarini yonetin ve izleyin</p>
                </div>

                {/* Stats Grid */}
                {/* <div className="stats-grid md-cols-2 lg-cols-2">
                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam Influencer</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{influencerDash?.influencer}</div>
                            <p className="text-xs text-muted-foreground">

                            </p>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktif Kampanyalar</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{influencerDash?.campaign}</div>

                        </CardContent>
                    </Card>


                </div> */}

                <Tabs defaultValue="instagram">
                    <Card className="p-2 mb-4 shadow-none">
                        <CardContent className="p-0">
                            <TabsList className="w-full grid grid-cols-5 bg-white p-1 rounded-lg">
                                <TabsTrigger
                                    value="instagram"
                                    className="rounded-md border data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    Instagram
                                </TabsTrigger>

                                <TabsTrigger
                                    value="tiktok"
                                    className="ml-2 rounded-md border data-[state=active]:bg-background data-[state=active]:shadow-sm" >
                                    TikTok
                                </TabsTrigger>
                            </TabsList>
                        </CardContent>
                    </Card>

                    <TabsContent value="instagram" className="grid grid-cols-1 gap-2">
                        {/* Filters and Search  */}
                        <Card className="filters-section">
                            <CardHeader>
                                <CardTitle>Instagram Hesap Onayi Gerekli</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="filters-row md-flex-row">
                                    <div className="search-wrapper">
                                        <Search className="search-icon" />
                                        <Input
                                            placeholder="Instagram'i isme gore ara"
                                            className="search-input pl-5"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="export-button">
                                                <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                                <FileDown className="h-4 w-4 mr-2" />
                                                CSV olarak disa aktar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                                <FileDown className="h-4 w-4 mr-2" />
                                                PDF olarak disa aktar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Influencers Table */}
                                <div className="table-container">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Influencer</TableHead>
                                                <TableHead>Onay</TableHead>
                                                <TableHead>Islemler</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.instagram && data?.instagram.length > 0 ? (
                                                data?.instagram?.filter((influencer: any) => influencer.approved_instagram
                                                    === 'connect')?.map((influencer: any) => (
                                                        <TableRow key={influencer.id} className="table-row">
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        onClick={() => window.open(`https://www.instagram.com/${influencer.insta_username}`, '_blank')}
                                                                        src={influencer?.details?.profile_picture_url
                                                                            ? influencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                                        alt={influencer.name}
                                                                        className="h-10 w-10 rounded-full cursor-pointer"
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{influencer.name}</div>
                                                                        <div className="text-sm text-gray-500">{influencer.insta_username}</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>




                                                            <TableCell>

                                                                <Button onClick={() => handleInstagramOnaylandı('instagram-approved', influencer.id)} size="sm" className="bg-green-100 text-green-700 view-button border rounded hover:bg-green-200 ">{approvedLoadingId === influencer.id ? 'Yükleniyor...' : 'Kabul Edildi'}</Button>

                                                                <Button onClick={() => handleInstagramReddedildi('instagram-rejected', influencer.id)} size="sm" className="ml-2 bg-red-100 text-red-700 view-button border rounded hover:bg-red-200">{rejectedLoadingId === influencer.id ? 'Yükleniyor...' : 'Reddedildi'}</Button>


                                                            </TableCell>


                                                            <TableCell>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedInfluencer(influencer)}
                                                                    className="view-button ml-2"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>


                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                            ) : (
                                                <TableRow>
                                                    {!(isSearchLoading || isAllLoading) && (
                                                        <TableCell colSpan={8} align="center">
                                                            <b>Influencer bulunamadı.</b>
                                                        </TableCell>
                                                    )}
                                                    {(isSearchLoading || isAllLoading) && (

                                                        <TableCell colSpan={8} align="center">
                                                            <b>Yükleniyor...</b>
                                                        </TableCell>

                                                    )}
                                                </TableRow>
                                            )}

                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Filters and Search accepted*/}
                            <Card className="filters-section">
                                <CardHeader>
                                    <CardTitle>Instagram Hesap Onayi Kabul Edildi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* <div className="filters-row md-flex-row">
                                        <div className="search-wrapper">
                                            <Search className="search-icon" />
                                            <Input
                                                placeholder="Instagram'i isme gore ara"
                                                className="search-input pl-5"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="export-button">
                                                    <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleExport('csv')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    CSV olarak disa aktar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    PDF olarak disa aktar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div> */}

                                    {/* Influencers Table */}
                                    <div className="table-container">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Influencer</TableHead>
                                                    <TableHead>Hesap</TableHead>
                                                    <TableHead>Islemler</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data?.instagram && data?.instagram.length > 0 ? (
                                                    data?.instagram?.filter((influencer: any) => influencer.approved_instagram
                                                        === 'accept')?.map((influencer: any) => (
                                                            <TableRow key={influencer.id} className="table-row">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <img
                                                                            onClick={() => window.open(`https://www.instagram.com/${influencer.insta_username}`, '_blank')}
                                                                            src={influencer?.details?.profile_picture_url
                                                                                ? influencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                                            alt={influencer.name}
                                                                            className="h-10 w-10 rounded-full cursor-pointer"
                                                                        />
                                                                        <div>
                                                                            <div className="font-medium">{influencer.name}</div>
                                                                            <div className="text-sm text-gray-500">{influencer.insta_username}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>



                                                                <TableCell>

                                                                    <Button onClick={() => handleInstagramReddedildi('instagram-rejected', influencer.id)} size="sm" className="bg-green-100 text-green-700 view-button border rounded hover:bg-green-200 ">{rejectedLoadingId === influencer.id ? 'Yükleniyor...' : 'Kabul Edildi'}</Button>

                                                                </TableCell>


                                                                <TableCell>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSelectedInfluencer(influencer)}
                                                                        className="view-button ml-2"
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>


                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        {!(isSearchLoading || isAllLoading) && (
                                                            <TableCell colSpan={8} align="center">
                                                                <b>Influencer bulunamadı.</b>
                                                            </TableCell>
                                                        )}
                                                        {(isSearchLoading || isAllLoading) && (

                                                            <TableCell colSpan={8} align="center">
                                                                <b>Yükleniyor...</b>
                                                            </TableCell>

                                                        )}
                                                    </TableRow>
                                                )}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Filters and Search rejected */}
                            <Card className="filters-section">
                                <CardHeader>
                                    <CardTitle>Instagram Hesap Onayi Reddedildi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* <div className="filters-row md-flex-row">
                                        <div className="search-wrapper">
                                            <Search className="search-icon" />
                                            <Input
                                                placeholder="Instagram'i isme gore ara"
                                                className="search-input pl-5"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="export-button">
                                                    <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleExport('csv')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    CSV olarak disa aktar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    PDF olarak disa aktar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div> */}

                                    {/* Influencers Table */}
                                    <div className="table-container">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Influencer</TableHead>
                                                    <TableHead>Hesap</TableHead>
                                                    <TableHead>Islemler</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data?.instagram && data?.instagram.length > 0 ? (
                                                    data?.instagram?.filter((influencer: any) => influencer.approved_instagram
                                                        === 'reject')?.map((influencer: any) => (
                                                            <TableRow key={influencer.id} className="table-row">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <img

                                                                            src={influencer?.details?.profile_picture_url
                                                                                ? influencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                                            alt={influencer.name}
                                                                            className="h-10 w-10 rounded-full "
                                                                        />
                                                                        <div>
                                                                            <div className="font-medium">{influencer.name}</div>
                                                                            <div className="text-sm text-gray-500">{influencer.insta_username}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>



                                                                <TableCell>

                                                                    <Button onClick={() => handleInstagramOnaylandı('instagram-approved', influencer.id)} size="sm" className="bg-red-100 text-red-700 view-button border rounded hover:bg-red-200 ">{approvedLoadingId === influencer.id ? 'Yükleniyor...' : 'Reddedildi'}</Button>

                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSelectedInfluencer(influencer)}
                                                                        className="view-button ml-2"
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>


                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        {!(isSearchLoading || isAllLoading) && (
                                                            <TableCell colSpan={8} align="center">
                                                                <b>Influencer bulunamadı.</b>
                                                            </TableCell>
                                                        )}
                                                        {(isSearchLoading || isAllLoading) && (

                                                            <TableCell colSpan={8} align="center">
                                                                <b>Yükleniyor...</b>
                                                            </TableCell>

                                                        )}
                                                    </TableRow>
                                                )}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </TabsContent>

                    <TabsContent value="tiktok">
                        {/* Filters and Search  */}
                        <Card className="filters-section">
                            <CardHeader>
                                <CardTitle>TikTok Hesap Onayi Gerekli</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="filters-row md-flex-row">
                                    <div className="search-wrapper">
                                        <Search className="search-icon" />
                                        <Input
                                            placeholder="Instagram'i isme gore ara"
                                            className="search-input pl-5"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="export-button">
                                                <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                                <FileDown className="h-4 w-4 mr-2" />
                                                CSV olarak disa aktar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                                <FileDown className="h-4 w-4 mr-2" />
                                                PDF olarak disa aktar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Influencers Table */}
                                <div className="table-container">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Influencer</TableHead>
                                                <TableHead>Onay</TableHead>
                                                <TableHead>Islemler</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.tiktok && data?.tiktok.length > 0 ? (
                                                data?.tiktok?.filter((influencer: any) => influencer.approved_tiktok
                                                    === 'connect')?.map((influencer: any) => (
                                                        <TableRow key={influencer.id} className="table-row">
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        onClick={() =>
                                                                            window.open(
                                                                                `https://www.tiktok.com/@${influencer.tiktok_details?.username}`,
                                                                                '_blank'
                                                                            )
                                                                        }
                                                                        src={influencer?.tiktok_details?.profile_picture_url
                                                                            ? influencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                                        alt={influencer.name}
                                                                        className="h-10 w-10 rounded-full cursor-pointer"
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{influencer.name}</div>
                                                                        <div className="text-sm text-gray-500">{influencer.tiktok_details?.username}</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>




                                                            <TableCell>

                                                                <Button onClick={() => handleInstagramOnaylandı('tiktok-approved', influencer.id)} size="sm" className="bg-green-100 text-green-700 view-button border rounded hover:bg-green-200 ">{approvedLoadingId === influencer.id ? 'Yükleniyor...' : 'Kabul Edildi'}</Button>

                                                                <Button onClick={() => handleInstagramReddedildi('tiktok-rejected', influencer.id)} size="sm" className="ml-2 bg-red-100 text-red-700 view-button border rounded hover:bg-red-200">{rejectedLoadingId === influencer.id ? 'Yükleniyor...' : 'Reddedildi'}</Button>


                                                            </TableCell>




                                                            <TableCell>



                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedInfluencer(influencer)}
                                                                    className="view-button ml-2"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>


                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                            ) : (
                                                <TableRow>
                                                    {!(isSearchLoading || isAllLoading) && (
                                                        <TableCell colSpan={8} align="center">
                                                            <b>Influencer bulunamadı.</b>
                                                        </TableCell>
                                                    )}
                                                    {(isSearchLoading || isAllLoading) && (

                                                        <TableCell colSpan={8} align="center">
                                                            <b>Yükleniyor...</b>
                                                        </TableCell>

                                                    )}
                                                </TableRow>
                                            )}

                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Filters and Search accepted*/}
                            <Card className="filters-section">
                                <CardHeader>
                                    <CardTitle>TikTok Hesap Onayi Kabul Edildi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* <div className="filters-row md-flex-row">
                                        <div className="search-wrapper">
                                            <Search className="search-icon" />
                                            <Input
                                                placeholder="Instagram'i isme gore ara"
                                                className="search-input pl-5"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="export-button">
                                                    <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleExport('csv')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    CSV olarak disa aktar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    PDF olarak disa aktar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div> */}

                                    {/* Influencers Table */}
                                    <div className="table-container">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Influencer</TableHead>
                                                    <TableHead>Hesap</TableHead>
                                                    <TableHead>Islemler</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data?.tiktok && data?.tiktok.length > 0 ? (
                                                    data?.tiktok?.filter((influencer: any) => influencer.approved_tiktok
                                                        === 'accept')?.map((influencer: any) => (
                                                            <TableRow key={influencer.id} className="table-row">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <img
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    `https://www.tiktok.com/@${influencer.tiktok_details?.username}`,
                                                                                    '_blank'
                                                                                )
                                                                            }
                                                                            src={influencer?.tiktok_details?.profile_picture_url
                                                                                ? influencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                                            alt={influencer.name}
                                                                            className="h-10 w-10 rounded-full cursor-pointer"
                                                                        />
                                                                        <div>
                                                                            <div className="font-medium">{influencer.name}</div>
                                                                            <div className="text-sm text-gray-500">{influencer.tiktok_details?.username}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>



                                                                <TableCell>

                                                                    <Button onClick={() => handleInstagramReddedildi('tiktok-rejected', influencer.id)} size="sm" className="bg-green-100 text-green-700 view-button border rounded hover:bg-green-200 ">{rejectedLoadingId === influencer.id ? 'Yükleniyor...' : 'Kabul Edildi'}</Button>

                                                                </TableCell>


                                                                <TableCell>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSelectedInfluencer(influencer)}
                                                                        className="view-button ml-2"
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>


                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        {!(isSearchLoading || isAllLoading) && (
                                                            <TableCell colSpan={8} align="center">
                                                                <b>Influencer bulunamadı.</b>
                                                            </TableCell>
                                                        )}
                                                        {(isSearchLoading || isAllLoading) && (

                                                            <TableCell colSpan={8} align="center">
                                                                <b>Yükleniyor...</b>
                                                            </TableCell>

                                                        )}
                                                    </TableRow>
                                                )}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Filters and Search rejected */}
                            <Card className="filters-section">
                                <CardHeader>
                                    <CardTitle>TikTok Hesap Onayi Reddedildi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* <div className="filters-row md-flex-row">
                                        <div className="search-wrapper">
                                            <Search className="search-icon" />
                                            <Input
                                                placeholder="Instagram'i isme gore ara"
                                                className="search-input pl-5"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="export-button">
                                                    <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleExport('csv')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    CSV olarak disa aktar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    PDF olarak disa aktar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div> */}

                                    {/* Influencers Table */}
                                    <div className="table-container">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Influencer</TableHead>
                                                    <TableHead>Hesap</TableHead>
                                                    <TableHead>Islemler</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data?.tiktok && data?.tiktok.length > 0 ? (
                                                    data?.tiktok?.filter((influencer: any) => influencer.approved_tiktok
                                                        === 'reject')?.map((influencer: any) => (
                                                            <TableRow key={influencer.id} className="table-row">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <img

                                                                            src={influencer?.tiktok_details?.profile_picture_url
                                                                                ? influencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                                            alt={influencer.name}
                                                                            className="h-10 w-10 rounded-full"
                                                                        />
                                                                        <div>
                                                                            <div className="font-medium">{influencer.name}</div>
                                                                            <div className="text-sm text-gray-500">{influencer.tiktok_details?.username}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>



                                                                <TableCell>

                                                                    <Button onClick={() => handleInstagramOnaylandı('tiktok-approved', influencer.id)} size="sm" className="bg-red-100 text-red-700 view-button border rounded hover:bg-red-200 ">{approvedLoadingId === influencer.id ? 'Yükleniyor...' : 'Reddedildi'}</Button>

                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSelectedInfluencer(influencer)}
                                                                        className="view-button ml-2"
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>


                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        {!(isSearchLoading || isAllLoading) && (
                                                            <TableCell colSpan={8} align="center">
                                                                <b>Influencer bulunamadı.</b>
                                                            </TableCell>
                                                        )}
                                                        {(isSearchLoading || isAllLoading) && (

                                                            <TableCell colSpan={8} align="center">
                                                                <b>Yükleniyor...</b>
                                                            </TableCell>

                                                        )}
                                                    </TableRow>
                                                )}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

            </div>


            {/* Influencer Details Dialog */}
            {/* <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)} >
                <DialogContent className="dialog-content max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="dialog-header">
                        <DialogTitle className="dialog-title">Influencer Detaylari</DialogTitle>
                    </DialogHeader>
                    {selectedInfluencer && (
                        <div className="space-y-6">
                            <h6 className="font-bold">Instagram</h6>
                            <div className="flex items-center gap-4">

                                <img
                                    src={selectedInfluencer?.details?.profile_picture_url
                                        ? selectedInfluencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                                    alt={selectedInfluencer.name}
                                    className="h-16 w-16 rounded-full"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{selectedInfluencer?.name}</h3>
                                    <p className="text-gray-600">{selectedInfluencer?.insta_username}</p>
                                    <p className="text-sm text-gray-500">{selectedInfluencer?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                instagram
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Takipçiler
</label>
                                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.details?.followers_count}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Etkilesim Orani</label>
                                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.details?.engagement}</div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Seviye</label>
                                    <div className="mt-1">{getLevelBadge(selectedInfluencer.level)}</div>
                                </div>
                            </div>


                            tiktok
                            <h6 className="font-bold">TikTok</h6>
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedInfluencer?.tiktok_details?.profile_picture_url
                                        ? selectedInfluencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                                    alt={selectedInfluencer.name}
                                    className="h-16 w-16 rounded-full"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{selectedInfluencer?.name}</h3>
                                    <p className="text-gray-600">{selectedInfluencer?.tiktok_details?.username}</p>
                                    <p className="text-sm text-gray-500">{selectedInfluencer?.email}</p>
                                </div>
                            </div>


                            <div className="grid grid-cols-2 gap-4">


                                <div>
                                    <label className="text-sm font-medium text-gray-600">Takipçiler
</label>
                                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.tiktok_details?.followers_count ?? 0}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Etkilesim Orani</label>
                                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.tiktok_details?.engagement ?? 0}</div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Kategori</label>
                                    {data &&
                                        selectedInfluencer.category.map((item: any) => (
                                            <div className="mt-1 font-medium">{item}</div>
                                        )
                                        )
                                    }
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Toplam Kampanya</label>
                                    <div className="mt-1 font-medium">{selectedInfluencer.campaign}</div>
                                </div>



                                <div>
                                    <label className="text-sm font-medium text-gray-600">Katılım Tarihi</label>
                                    <div className="mt-1 font-medium">{new Date(selectedInfluencer.created_at).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Durum</label>
                                    <div className="mt-1">{selectedInfluencer.status == true ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}</div>
                                </div>

                            </div>
                        </div>

                    )}
                </DialogContent>
            </Dialog> */}


            {/* Influencer Details Dialog */}
            <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)} >
                <DialogContent className="dialog-content max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="dialog-header">
                        <DialogTitle className="dialog-title">Influencer Detaylari</DialogTitle>
                    </DialogHeader>
                    {selectedInfluencer && (
                        <div className="space-y-6">
                            {
                                selectedInfluencer.details ?
                                    <>
                                        <h6 className="font-bold">Instagram</h6>
                                        <div className="flex items-center gap-4">

                                            <img
                                                onClick={() => window.open(`https://www.instagram.com/${selectedInfluencer?.insta_username}`, '_blank')}
                                                src={selectedInfluencer?.details?.profile_picture_url
                                                    ? selectedInfluencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                alt={selectedInfluencer.name}
                                                className="h-16 w-16 rounded-full cursor-pointer"
                                            />
                                            <div>
                                                <h3 className="font-bold text-lg">{selectedInfluencer?.name}</h3>
                                                <p className="text-gray-600">{selectedInfluencer?.insta_username}</p>
                                                <p className="text-sm text-gray-500">{selectedInfluencer?.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">

                                            {/* instagram */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Takipçiler
                                                </label>
                                                <div className="mt-1 font-medium text-lg">{selectedInfluencer?.details?.followers_count}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Etkilesim Orani</label>
                                                <div className="mt-1 font-medium text-lg">{selectedInfluencer?.details?.engagement}</div>
                                            </div>

                                            {/* <div> */}
                                            {/* <label className="text-sm font-medium text-gray-600">Seviye</label> */}
                                            {/* <div className="mt-1">{getLevelBadge(selectedInfluencer.level)}</div> */}
                                            {/* </div> */}
                                        </div>
                                    </>
                                    : selectedInfluencer.tiktok_details ?
                                        <>
                                            {/* tiktok */}
                                            <h6 className="font-bold">TikTok</h6>
                                            <div className="flex items-center gap-4">
                                                <img
                                                    onClick={() =>
                                                        window.open(
                                                            `https://www.tiktok.com/@${selectedInfluencer?.tiktok_details?.username}`,
                                                            '_blank'
                                                        )
                                                    }
                                                    src={selectedInfluencer?.tiktok_details?.profile_picture_url
                                                        ? selectedInfluencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                                                    alt={selectedInfluencer.name}
                                                    className="h-16 w-16 rounded-full cursor-pointer"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-lg">{selectedInfluencer?.name}</h3>
                                                    <p className="text-gray-600">{selectedInfluencer?.tiktok_details?.username}</p>
                                                    <p className="text-sm text-gray-500">{selectedInfluencer?.email}</p>
                                                </div>
                                            </div>


                                            <div className="grid grid-cols-2 gap-4">


                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Takipçiler
                                                    </label>
                                                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.tiktok_details?.followers_count ?? 0}</div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Etkilesim Orani</label>
                                                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.tiktok_details?.engagement ?? 0}</div>
                                                </div>


                                            </div>
                                        </>
                                        : ''
                            }




                        </div>

                    )}
                </DialogContent>
            </Dialog>
        </div >

    );
};

export default NotOnaylandı;
