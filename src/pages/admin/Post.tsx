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
import { Search, Megaphone, Play, CheckCircle, AlertCircle, MoreHorizontal, Download, FileDown, ExternalLink, Trash, SquarePen, CircleCheck, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV, exportToPDF } from '../../utils/tableExport';
import { useQuery } from '@tanstack/react-query';
import { baseUrl, imageUrl } from '@/utils/constants';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
        category_id: "",
        desc: "",
        image: "",
        read: "",
        short_desc: "",
        status: "",
    });

    const modules = {
        toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'], // Headers & block
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'], // Image button
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
        ],
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value, // File object olarak sakla
        }));
    };

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



    function fetchAllPostDash() {
        return axios.get(`${baseUrl}/api/get-post-dash`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }

    const {
        data: postDash,
        isLoading: isLoading,
        isError: isError,
        error: Error,
    } = useQuery({
        queryKey: ['post-dash'],
        queryFn: fetchAllPostDash,

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
    } = useQuery({
        queryKey: ['all-category'],
        queryFn: fetchAllCategory,
        enabled: !searchTerm // Only run when no search term
    });



    function fetchAllPost() {
        return axios.get(`${baseUrl}/api/get-post`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }

    const {
        data: allPost,
        isLoading: isAllLoading,
        isError: isAllError,
        error: allError,
    } = useQuery({
        queryKey: ['all-post'],
        queryFn: fetchAllPost,
        enabled: !searchTerm // Only run when no search term
    });

    function searchAllPost() {
        return axios.get(`${baseUrl}/api/get-post?search=${searchTerm}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.data);
    }

    const {
        data: searchedAllPost,
        isLoading: isSearchLoading,
        isError: isSearchError,
        error: searchError,
    } = useQuery({
        queryKey: ['search-all-post', searchTerm],
        queryFn: searchAllPost,
        enabled: !!debouncedTerm // Only run when searchTerm exists
    });
    const data = searchTerm ? searchedAllPost : allPost;

    console.log(data)

    function createPost(payload) {
        return axios.post(
            `${baseUrl}/api/create-post`,
            payload, // data
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    // "Content-Type": "application/json",
                    'Content-Type': 'multipart/form-data',
                },
            }
        ).then(res => res.data);
    }

    const {
        mutate: createPostMutation,

    } = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            // category list refresh
            queryClient.invalidateQueries({ queryKey: ["all-post"] });
            setOpen(false)
            setFormData({
                title: '',
                category_id: "",
                desc: "",
                image: "",
                read: "",
                short_desc: "",
                status: "",
            });
            setIsSubmit(false)
            toast({
                title: "Post created successfully",

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


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmit(true);

        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('desc', formData.desc);
        formDataToSend.append('short_desc', formData.short_desc);
        formDataToSend.append('read', formData.read);
        formDataToSend.append('status', formData.status);

        // Append image file only if selected
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        // Call mutation or axios
        createPostMutation(formDataToSend);
    };

    function updatePost(payload) {
        return axios.post(
            `${baseUrl}/api/update-post`,
            payload, // data
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    //  "Content-Type": "application/json",
                    'Content-Type': 'multipart/form-data',
                },
            }
        ).then(res => res.data);
    }

    const {
        mutate: updatePostMutation,
    } = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            // category list refresh
            queryClient.invalidateQueries({ queryKey: ["all-post"] });
            setOpen(false)
            setFormData({
                title: '',
                category_id: "",
                desc: "",
                image: "",
                read: "",
                short_desc: "",
                status: "",
            });
            toast({
                title: "Post updated successfully",

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

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsSubmit(true)

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('desc', formData.desc);
        formDataToSend.append('short_desc', formData.short_desc);
        formDataToSend.append('read', formData.read);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('id', selectedCategory.id);

        // Append image file only if selected
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        updatePostMutation(formDataToSend);
    };


    function deletePost(id) {
        return axios.delete(`${baseUrl}/api/delete-post/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                "Content-Type": "application/json",
            },
        }).then(res => res.data);
    }

    const {
        mutate: deletePostMutation,
    } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            // category list refresh
            queryClient.invalidateQueries({ queryKey: ["all-post"] });

            toast({
                title: "Post delete successfully",

            });
            setConfirm(false)
            setIsSubmit(false)
            setSelectedCategory(null)
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
        deletePostMutation(selectedCategory.id);
    };


    return (
        <div className="admin-dashboard">
            <AdminNavbar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Gönderi Yonetimi</h1>
                    <p>Tüm Gönderi
                        leri izleyin ve yonetin</p>
                </div>

                {/* Campaign Stats */}
                <div className="stats-grid md-cols-2 lg-cols-4">
                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam Gönderi</CardTitle>
                            <CircleCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{postDash?.totalCount}</div>
                            <p className="text-xs text-muted-foreground">Tüm Gönderi
                                ler</p>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                            <Play className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{postDash?.publishCount}</div>
                            <p className="text-xs text-muted-foreground">Su anda devam ediyor</p>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taslak</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{postDash?.draftCount}</div>
                            <p className="text-xs text-muted-foreground">Hazirlaniyor</p>
                        </CardContent>
                    </Card>


                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Görüntülenme</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {postDash?.viewCount}
                            </div>
                            <p className="text-xs text-muted-foreground">Toplam Görüntülenme</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="filters-section">
                    <CardHeader>
                        <CardTitle>Tüm Gönderi
                            ler</CardTitle>
                        <Button onClick={() => {
                            setOpen(true)
                            setSelectedCategory(null)
                            setFormData({
                                title: "",
                                category_id: "",
                                desc: "",
                                image: "",
                                read: "",
                                short_desc: "",
                                status: "",
                            })
                        }} variant="outline" className='w-30 ml-auto'>Gönderi Ekle</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="filters-row md-flex-row">
                            <div className="search-wrapper">
                                <Search className="search-icon" />
                                <Input
                                    placeholder="Gönderi
leri ara..."
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
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Okunma</TableHead>
                                        <TableHead>Durum</TableHead>
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
                                                        <Avatar className="h-8 w-8 bg-gray-300 text-black flex items-center justify-center font-bold">
                                                            {campaign?.image ? (
                                                                <AvatarImage src={imageUrl + '/' + campaign.image} alt={campaign.title} />
                                                            ) : (
                                                                <AvatarFallback>
                                                                    {campaign?.title ? campaign.title.trim().slice(0, 2).toUpperCase() : ''}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-normal">{campaign?.title}</div>
                                                            {/* <div className="text-sm text-gray-600">{campaign?.brand}</div> */}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="font-medium">{campaign?.category}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{campaign?.read}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={campaign?.status == 0 ? 'destructive' : 'outline'} className="font-medium">
                                                        {campaign?.status == 0 ? 'Draft' : 'Published'}
                                                    </Badge>
                                                </TableCell>

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
                                                                    title: campaign?.title,
                                                                    category_id: campaign?.post_category_id,
                                                                    desc: campaign?.desc,
                                                                    image: "",
                                                                    read: campaign?.read,
                                                                    short_desc: campaign?.short_desc,
                                                                    status: campaign?.status,
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
                                                <TableCell colSpan={7} align="center">
                                                    <b>Gönderi
                                                        bulunamadı.</b>
                                                </TableCell>
                                            )}
                                            {(isSearchLoading || isAllLoading) && (

                                                <TableCell colSpan={7} align="center">
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
                <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-4xl overflow-x-auto max-h-[90vh]">
                    <form onSubmit={selectedCategory ? handleUpdate : handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{selectedCategory ? 'Gönderiyi Güncelle' : 'Yeni GönderiOluştur'}</DialogTitle>
                        </DialogHeader>

                        {/* Modal Body */}

                        <div className="space-y-4 ">

                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter Post Title"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                                                outline-none transition
                                                focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       outline-none transition
                       focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                                >
                                    <option value="">Kategori Seç</option>
                                    {allCategory?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Short Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Short Description
                                </label>
                                <textarea
                                    name="short_desc"
                                    value={formData.short_desc}
                                    onChange={handleInputChange}
                                    rows={2}
                                    required
                                    placeholder="Short description"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       outline-none transition resize-none
                       focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <ReactQuill
                                    theme="snow"

                                    value={formData.desc || ''}
                                    onChange={(value) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            desc: value
                                        }))
                                    }
                                    placeholder="Full description"
                                    className="w-full rounded-lg"
                                    modules={modules}

                                />
                            </div>



                            {/* Image */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleInputChange}
                                    accept="image/*"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       file:mr-4 file:rounded-md file:border-0
                       file:bg-[#2563EB] file:px-4 file:py-1.5
                       file:text-sm file:font-medium file:text-white
                       hover:file:bg-[#2563EB]/50"
                                />

                                {selectedCategory && (
                                    <img
                                        src={imageUrl + '/' + selectedCategory?.image}
                                        alt="Preview"
                                        className="mt-2  w-40 rounded-md border object-cover"
                                    />
                                )}
                            </div>

                            {/* Read Time */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Okuma Suresi
                                </label>
                                <input
                                    name="read"
                                    value={formData.read}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="ornek: 10 dk okuma"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       outline-none transition
                       focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Durum
                                </label>
                                <select
                                    required
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       outline-none transition
                       focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                                >
                                    <option value="">Durum Sec</option>
                                    <option value="1">Yayinla</option>
                                    <option value="0">Taslak</option>
                                </select>
                            </div>

                        </div>


                        <DialogFooter className='mt-4'>
                            <Button onClick={() => setOpen(false)} variant="outline">İptal</Button>

                            <Button type="submit" disabled={isSubmit}>
                                {isSubmit ? "Kaydediliyor..." : "Gonder"}
                            </Button>

                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


            {/* Confirm Delete */}
            <Dialog open={confirm} onOpenChange={setConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Gönderi
                            yi Sil</DialogTitle>
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
