import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Megaphone, Play, CheckCircle, AlertCircle, MoreHorizontal, Eye, Download, FileDown, ExternalLink, Trash, SquarePen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV, exportToPDF } from '../../utils/tableExport';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '@/utils/constants';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const campaignsData = [
    {
        id: "CAM-001",
        title: "Summer Sports Collection",
        brand: "Nike",
        brandLogo: "/placeholder.svg",
        status: "active",
        influencersCount: 5,
        applicationsCount: 23,
        startDate: "2024-01-10",
        endDate: "2024-02-10",
        category: "Sports & Fitness",
        hashtags: ["#summervibes", "#sportswear", "#nike"],
        campaignImage: "/placeholder.svg",
        contentPieces: [
            {
                id: 1,
                influencer: "Sarah Johnson",
                type: "post",
                status: "approved",
                link: "https://instagram.com/p/sample1",
                preview: "/placeholder.svg"
            },
            {
                id: 2,
                influencer: "Sarah Johnson",
                type: "story",
                status: "pending",
                link: null,
                preview: "/placeholder.svg"
            }
        ]
    },
    {
        id: "CAM-002",
        title: "Marathon Gear",
        brand: "Adidas",
        brandLogo: "/placeholder.svg",
        status: "draft",
        influencersCount: 0,
        applicationsCount: 12,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        category: "Sports & Fitness",
        hashtags: ["#marathon", "#adidas", "#running"],
        campaignImage: "/placeholder.svg",
        contentPieces: []
    },
    {
        id: "CAM-003",
        title: "Winter Fashion",
        brand: "H&M",
        brandLogo: "/placeholder.svg",
        status: "completed",
        influencersCount: 8,
        applicationsCount: 45,
        startDate: "2023-12-01",
        endDate: "2023-12-31",
        category: "Fashion",
        hashtags: ["#winter", "#fashion", "#hm"],
        campaignImage: "/placeholder.svg",
        contentPieces: []
    }
];

const AdminCampaigns = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [showContentDialog, setShowContentDialog] = useState(false);
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Published':
                return <Badge className="bg-green-100 text-green-700"><Play className="h-3 w-3 mr-1" />Aktif</Badge>;
            case 'Draft':
                return <Badge className="bg-gray-100 text-gray-700">Taslak</Badge>;
            case 'Closed':
                return <Badge className="bg-blue-100 text-blue-700"><CheckCircle className="h-3 w-3 mr-1" />Tamamlandı</Badge>;
            default:
                return ''
        }
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        const exportData = filteredCampaigns.map(campaign => ({
            ID: campaign.id,
            Baslik: campaign.title,
            Marka: campaign.brand,
            Durum: campaign.status,
            Kategori: campaign.category,
            Influencerlar: campaign.influencersCount,
            Basvurular: campaign.applicationsCount,
            'Başlangıç Tarihi': campaign.startDate,
            'Bitiş Tarihi': campaign.endDate,
            Hashtags: campaign.hashtags.join(', ')
        }));

        if (format === 'csv') {
            exportToCSV(exportData, 'campaigns');
        } else {
            exportToPDF(exportData, 'campaigns', 'Kampanya Yönetim Raporu');
        }

        toast.success(`Kampanyalar disa aktarildi: ${format.toUpperCase()}`);
    };

    const filteredCampaigns = campaignsData.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 1000); // Delay in ms (500ms = 0.5 second)

        return () => clearTimeout(timer);
    }, [searchTerm]);

    function fetchAllCategory() {
        return axios.get(`${baseUrl}/api/get-category`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }

    const {
        data: allCategory,
        isLoading: isAllLoading,
        isError: isAllError,
        error: allError,
    } = useQuery({
        queryKey: ['all-category'],
        queryFn: fetchAllCategory,
        enabled: !searchTerm // Only run when no search term
    });

    function searchAllCategory() {
        return axios.get(`${baseUrl}/api/get-category?search=${searchTerm}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }

    const {
        data: searchedAllCategory,
        isLoading: isSearchLoading,
        isError: isSearchError,
        error: searchError,
    } = useQuery({
        queryKey: ['search-all-category', searchTerm],
        queryFn: searchAllCategory,
        enabled: !!debouncedTerm // Only run when searchTerm exists
    });

    const data = searchTerm ? searchedAllCategory : allCategory;


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    function createCategory(payload) {
        return axios.post(
            `${baseUrl}/api/create-category`,
            payload, // data
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    "Content-Type": "application/json",
                },
            }
        ).then(res => res.data);
    }

    const {
        mutate: createCategoryMutation,

    } = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            // category list refresh
            queryClient.invalidateQueries({ queryKey: ["all-category"] });
            setOpen(false)
            setFormData({
                title: '',
            });
            setIsSubmit(false)
            toast({
                title: "Kategori basariyla Oluşturuldu",

            });

        },
        onError: (error) => {
            console.error(error);
            setIsSubmit(false)
            if (error?.response?.status === 422) {
                const errors = error.response.data.errors;

                // For example, show the first validation error
                const firstError = Object.values(errors)[0][0];
                toast({
                    title: firstError,

                });

            } else {
                toast({
                    title: error?.response?.data?.message || 'Something went wrong',

                });

            }
        }
    });


    const handleSubmit = () => {
        setIsSubmit(true)
        createCategoryMutation(formData);
    };

    function updateCategory(payload) {
        return axios.post(
            `${baseUrl}/api/update-category`,
            payload, // data
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    "Content-Type": "application/json",
                },
            }
        ).then(res => res.data);
    }

    const {
        mutate: updateCategoryMutation,
    } = useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            // category list refresh
            queryClient.invalidateQueries({ queryKey: ["all-category"] });
            setOpen(false)
            setFormData({
                title: '',
            });
            toast({
                title: "Kategori basariyla Güncellendi",

            });
            setIsSubmit(false)

        },
        onError: (error) => {
            console.error(error);
            setIsSubmit(false)
            if (error?.response?.status === 422) {
                const errors = error.response.data.errors;

                // For example, show the first validation error
                const firstError = Object.values(errors)[0][0];
                toast({
                    title: firstError,

                });

            } else {
                toast({
                    title: error?.response?.data?.message || 'Something went wrong',

                });

            }
        }
    });

    const handleUpdate = () => {
        setIsSubmit(true)
        updateCategoryMutation({ title: formData.title, id: selectedCategory.id });
    };


    function deleteCategory(id) {
        return axios.delete(`${baseUrl}/api/delete-category/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                "Content-Type": "application/json",
            },
        }).then(res => res.data);
    }

    const {
        mutate: deleteCategoryMutation,
    } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            // category list refresh
            queryClient.invalidateQueries({ queryKey: ["all-category"] });

            toast({
                title: "Kategori basariyla silindi",

            });
            setConfirm(false)
            setIsSubmit(false)

        },
        onError: (error) => {
            console.error(error);
            setIsSubmit(false)
            if (error?.response?.status === 422) {
                const errors = error.response.data.errors;

                // For example, show the first validation error
                const firstError = Object.values(errors)[0][0];
                toast({
                    title: firstError,

                });

            } else {
                toast({
                    title: error?.response?.data?.message || 'Something went wrong',

                });

            }
        }
    });


    const handleDelete = () => {
        setIsSubmit(true)
        deleteCategoryMutation(selectedCategory.id);
    };


    return (
        <div className="admin-dashboard">
            <AdminNavbar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Gönderi Kategori önetimi</h1>
                    <p>Tüm platform kategorilerini izleyin ve yönetin</p>
                </div>



                {/* Filters and Search */}
                <Card className="filters-section">
                    <CardHeader>
                        <CardTitle>Tüm Kategoriler</CardTitle>
                        <Button onClick={() => {
                            setOpen(true)
                            setFormData({
                                title: ""
                            })
                        }} variant="outline" className='w-30 ml-auto'>Kategori Ekle</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="filters-row md-flex-row">
                            <div className="search-wrapper">
                                <Search className="search-icon" />
                                <Input
                                    placeholder="Kategorileri ara..."
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

                        {/* Campaigns Table */}
                        <div className="table-container">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Baslik</TableHead>
                                        <TableHead>Oluşturulma</TableHead>
                                        <TableHead>Islemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data && data.length > 0 ? (
                                        data.map((campaign: any) => (
                                            <TableRow key={campaign.id} className="table-row">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 bg-gray-300 text-black">
                                                            {/* AvatarImage commented */}
                                                            <AvatarFallback>
                                                                {campaign?.title ? campaign?.title?.trim()?.slice(0, 1)?.toUpperCase() : ''}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-normal">{campaign?.title}</div>
                                                            {/* <div className="text-sm text-gray-600">{campaign?.brand}</div> */}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>{getStatusBadge(campaign?.status)}</TableCell> */}
                                                {/* <TableCell>
                                                    <div className="font-medium">{campaign?.influencer}</div>
                                                </TableCell> */}


                                                <TableCell>
                                                    <div className="text-sm">
                                                        {/* <div>{campaign?.created_at}</div> */}
                                                        <div className="text-gray-600">
                                                            {campaign?.created_at
                                                                ? new Date(campaign.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })
                                                                : ''}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">


                                                            <DropdownMenuItem onClick={() => {
                                                                setFormData({
                                                                    title: campaign?.title
                                                                })
                                                                setSelectedCategory(campaign);
                                                                setOpen(true)
                                                            }} className="text-gray-600">
                                                                <SquarePen className="h-4 w-4 mr-2" />Düzenle</DropdownMenuItem>

                                                            <DropdownMenuItem onClick={() => {
                                                                setSelectedCategory(campaign);
                                                                setConfirm(true)
                                                            }}>

                                                                <Trash className="h-4 w-4 mr-2" />Sil</DropdownMenuItem>

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            {!(isSearchLoading || isAllLoading) && (
                                                <TableCell colSpan={5} align="center">
                                                    <b>Kategori bulunamadı.</b>
                                                </TableCell>
                                            )}
                                            {(isSearchLoading || isAllLoading) && (

                                                <TableCell colSpan={5} align="center">
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
            {/* add and update */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selectedCategory ? 'Kategoriyi Güncelle' : 'Yeni Kategori Oluştur'}</DialogTitle>
                    </DialogHeader>

                    {/* Modal Body */}
                    <div className="space-y-4">
                        <input
                            name="title"          // zorunlu alan
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Kategori Basligi"
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} variant="outline">İptal</Button>

                        <Button onClick={selectedCategory ? handleUpdate : handleSubmit} disabled={isSubmit}>
                            {isSubmit ? "Kaydediliyor..." : "Gonder"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete */}
            <Dialog open={confirm} onOpenChange={setConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Kategoriyi Sil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        Emin misiniz?
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setConfirm(false)} variant="outline">İptal</Button>

                        <Button onClick={handleDelete} disabled={isSubmit}>
                            {isSubmit ? "Siliniyor..." : "Onayla"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    );
};

export default AdminCampaigns;
