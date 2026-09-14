import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, User, Mail, Phone, Link, Building, MapPin, Instagram, Image, Eye, Plus, Globe, Edit2Icon } from 'lucide-react';
import Footer from '@/components/Footer';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from 'axios';
import { baseUrl } from '@/utils/constants';

const BrandsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
    const [isUpdateBrandOpen, setIsUpdateBrandOpen] = useState(false);

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [subscriptionDetails, setSubscriptionDetails] = useState();
    const [image, setImage] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [brands, setBrands] = useState();

    // Form states for new brand
    const [newBrand, setNewBrand] = useState({
        companyName: '',
        companyUrl: '',
        brandName: '',
        city: '',
        country: '',
        location: '',
        about: '',

    });
    const [updateBrand, setUpdateBrand] = useState({
        id: '',
        companyName: '',
        companyUrl: '',
        brandName: '',
        city: '',
        country: '',
        location: '',
        about: '',
        logo: '',

    });


    const handleAddInputChange = (e) => {

        const { name, value } = e.target;
        setNewBrand({
            ...newBrand,
            [name]: value
        });
    };

    const plans = {
        'standardMonthly': 1,
        'standardYearly': 2,
        'agencyMonthly': 3,
        'agencyYearly': 4,
        'corporate': 5,
        'trial': 6,
    };
    // const brands = [
    //     {
    //         id: 1,
    //         contactName: "John Smith",
    //         email: "john@example.com",
    //         phone: "+1 (555) 123-4567",
    //         companyUrl: "https://example.com",
    //         companyName: "Example Corp",
    //         city: "Toronto",
    //         country: "Canada",
    //         instagram: "@examplecorp",
    //         image: "/lovable-uploads/ee7ee2c4-fc98-4b0f-a176-d8a255e02858.png",
    //         description: "Example Corp is a leading technology company specializing in innovative software solutions for businesses of all sizes.",
    //         industry: "Technology",
    //         foundedYear: "2010",
    //         employeeCount: "50-100",
    //         campaigns: 12,
    //         revenueGenerated: "$250,000",
    //     },
    //     {
    //         id: 2,
    //         contactName: "Emma Johnson",
    //         email: "emma@brandco.com",
    //         phone: "+1 (555) 987-6543",
    //         companyUrl: "https://brandco.com",
    //         companyName: "Brand Co.",
    //         city: "Vancouver",
    //         country: "Canada",
    //         instagram: "@brandco",
    //         image: "/lovable-uploads/82afba02-8bbc-4ede-aafe-2e3878e8ebfd.png",
    //         description: "Brand Co. creates memorable brand identities and marketing strategies for startups and established businesses.",
    //         industry: "Marketing & Branding",
    //         foundedYear: "2015",
    //         employeeCount: "10-50",
    //         campaigns: 8,
    //         revenueGenerated: "$120,000",
    //     },
    //     {
    //         id: 3,
    //         contactName: "Michael Chen",
    //         email: "michael@techinnovate.com",
    //         phone: "+1 (555) 456-7890",
    //         companyUrl: "https://techinnovate.com",
    //         companyName: "Tech Innovate",
    //         city: "Montreal",
    //         country: "Canada",
    //         instagram: "@techinnovate",
    //         image: "/lovable-uploads/1 (2).jpg",
    //         description: "Tech Innovate develops cutting-edge mobile applications and web platforms for the healthcare and finance sectors.",
    //         industry: "Software Development",
    //         foundedYear: "2018",
    //         employeeCount: "20-50",
    //         campaigns: 5,
    //         revenueGenerated: "$85,000",
    //     }
    // ];

    // const filteredMarkalar = brands.filter(brand =>
    //     brand.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     brand.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     brand.city.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const handleViewProfile = (brand) => {
        setSelectedBrand(brand);
        setIsProfileOpen(true);
    };

    const handleViewEdit = (brand) => {

        setUpdateBrand({
            id: brand?.id,
            companyName: brand?.company_name ?? "companyName",
            brandName: brand?.name,
            city: brand?.city ?? "city",
            country: brand?.country ?? "country",
            companyUrl: brand?.company_url ?? "companyUrl",
            location: brand?.location ?? "Konum",
            about: brand?.about ?? "Hakkında",
            logo: brand?.image,
        });
        setIsUpdateBrandOpen(true)

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateBrand({
            ...updateBrand,
            [name]: value
        });
    };

    const handleGetSubscription = async () => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/get-paytr-subscription`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },
            withCredentials: true
        };

        axios.request(config)
            .then((response) => {
                //console.log(response.data)
                setSubscriptionDetails(response.data?.paytr)
                // console.log(subscriptionDetails?.price_id)
            }).catch((error) => {

                console.log(error);

            });
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        // console.log(image)
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = JSON.stringify(
            updateBrand
        );

        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", data);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/update-brand`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },
            data: formData
        };

        axios.request(config)
            .then((response) => {
                if (response.data.message) {
                    toast.success(response.data.message);
                    handleGetMarkalar()
                    setIsUpdateBrandOpen(false)
                }

            })
            .catch((error) => {
                console.log(error);
            });
        setIsSubmitting(false);


    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = JSON.stringify({
            "brand": newBrand,
        });
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", data);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/add-brand`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,

            },
            data: formData
        };

        axios.request(config)
            .then((response) => {
                // console.log('sdfesf')
                // if (response.data.msg == 'error') {
                //     toast({
                //         title: response.data.validator.email[0],
                //         variant: "destructive",
                //     });
                // }
                // localStorage.removeItem("user");
                // localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success("Marka başarıyla eklendi!");
                setIsAddBrandOpen(false);
                handleGetMarkalar()
            })
            .catch((error) => {
                console.log(error);
            });
        setIsSubmitting(false);

        // Simulate API call
        // setTimeout(() => {
        //     setIsSubmitting(false);
        //     onOpenChange(false);
        //     toast({
        //         title: "Profile updated",
        //         description: "Your profile has been successfully updated.",
        //     });
        // }, 1000);
    };
    const handleGetMarkalar = async () => {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/get-brands`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            },
            withCredentials: true
        };

        axios.request(config)
            .then((response) => {
                // console.log(response.data)
                setBrands(response.data.brand)
                // console.log(subscriptionDetails?.price_id)
            }).catch((error) => {

                console.log(error);

            });
    }
    useEffect(() => {
        handleGetSubscription()
        handleGetMarkalar()
    }, [])

    return (


        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
            <DashboardNavbar />

            <main style={{ flex: 1, padding: '24px 32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Marka Ortaklari</h1>
                        {subscriptionDetails?.status === 'active' && (subscriptionDetails?.plan_id === plans.agencyMonthly || subscriptionDetails?.plan_id === plans.agencyYearly) && (
                            <Button
                                onClick={() => setIsAddBrandOpen(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: '#cc53ec',
                                    color: 'white',
                                    padding: '10px 16px',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                <Plus size={16} />
                                Marka Ekle
                            </Button>
                        )}
                    </div>

                    {/* <Card>
                        <CardContent style={{ padding: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#6b7280' }} />
                                <Input
                                    placeholder="Search brands..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </CardContent>
                    </Card> */}

                    <Card style={{ marginTop: '24px' }}>
                        <CardContent style={{ padding: '0' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead style={{ padding: '16px' }}>Logo</TableHead>
                                        <TableHead style={{ padding: '16px' }}>Marka Adi</TableHead>
                                        <TableHead style={{ padding: '16px' }}>Sirket</TableHead>
                                        <TableHead style={{ padding: '16px' }}>Konum</TableHead>

                                        <TableHead style={{ padding: '16px' }}>Ülke</TableHead>

                                        <TableHead style={{ padding: '16px' }}>Islemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {brands && brands?.map((brand) => (
                                        <TableRow key={brand.id}>
                                            <TableCell style={{ padding: '16px', fontWeight: '500' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                                                        <img src={brand.image ? brand.image : 'https://placehold.co/400x400'} alt={'image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>

                                                </div>
                                            </TableCell>

                                            <TableCell style={{ padding: '16px' }}>{brand.name}</TableCell>
                                            <TableCell style={{ padding: '16px' }}>{brand.company_name}</TableCell>
                                            <TableCell style={{ padding: '16px' }}>{brand.location}</TableCell>
                                            <TableCell style={{ padding: '16px' }}>{`${brand.city}, ${brand.country}`}</TableCell>

                                            <TableCell style={{ padding: '16px' }}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewProfile(brand)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', padding: '8px 16px' }}
                                                >
                                                    <Eye size={16} />

                                                </Button>


                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewEdit(brand)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', padding: '8px 16px' }}
                                                >
                                                    <Edit2Icon size={16} />

                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Brand Profile Dialog - Made more compact */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Marka Detayları</DialogTitle>
                        <DialogDescription>Hakkında bilgi {selectedBrand?.companyName}</DialogDescription>
                    </DialogHeader>

                    {selectedBrand && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full overflow-hidden">
                                    <img
                                        src={selectedBrand.image ? selectedBrand.image : 'https://placehold.co/400x400'}
                                        alt={selectedBrand.companyName}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">{selectedBrand.name}</h3>
                                    <p className="text-sm text-muted-foreground">{`${selectedBrand.city}, ${selectedBrand.country}`}</p>

                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">İletişim Kişisi</p>
                                    <p className="text-sm font-medium">{selectedBrand.name}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Web Sitesi</p>
                                    <a
                                        href={selectedBrand.company_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {selectedBrand.company_url.replace('https://', '')}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Konum</p>
                                    <p className="text-sm">{selectedBrand.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Hakkında</p>
                                    <p className="text-sm">{selectedBrand.about}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Brand Dialog - Simplified */}
            <Dialog open={isAddBrandOpen} onOpenChange={setIsAddBrandOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Yeni Marka Ekle</DialogTitle>
                        <DialogDescription>Ortaklar listenize eklemek icin marka detaylarini girin</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                                    Sirket Adi*
                                </label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    value={newBrand.companyName}
                                    onChange={handleAddInputChange}
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="brandName" className="block text-sm font-medium mb-1">
                                    Marka Adi
                                </label>
                                <Input
                                    id="brandName"
                                    name="brandName"
                                    value={newBrand.brandName}
                                    onChange={handleAddInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium mb-1">
                                    Şehir
                                </label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={newBrand.city}
                                    onChange={handleAddInputChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium mb-1">
                                    Ülke
                                </label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={newBrand.country}
                                    onChange={handleAddInputChange}
                                />
                            </div>

                            {/* <div>
            <label htmlFor="instagram" className="block text-sm font-medium mb-1">
                Instagram Kullanıcı Adı
            </label>
            <Input
                id="instagram"
                name="instagram"
                value={newBrand.instagram}
                onChange={handleInputChange}
            />
        </div> */}

                            <div>
                                <label htmlFor="companyUrl" className="block text-sm font-medium mb-1">
                                    Sirket Web Sitesi
                                </label>
                                <Input
                                    id="companyUrl"
                                    name="companyUrl"
                                    value={newBrand.companyUrl}
                                    onChange={handleAddInputChange}
                                    placeholder="https://"
                                />
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium mb-1">
                                    Konum
                                </label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={newBrand.location}
                                    onChange={handleAddInputChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="about" className="block text-sm font-medium mb-1">
                                    Hakkında
                                </label>
                                <Input
                                    id="about"
                                    name="about"
                                    value={newBrand.about}
                                    onChange={handleAddInputChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="logo" className="block text-sm font-medium mb-1">
                                    Marka Logosu
                                </label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setIsAddBrandOpen(false)}
                                className="mr-2"
                            >
                                İptal
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">Marka Ekle</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* update Brand Dialog - Simplified */}
            <Dialog open={isUpdateBrandOpen} onOpenChange={setIsUpdateBrandOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-black text-xl font-semibold">Markayı Düzenle</DialogTitle>
                        <DialogDescription>Ortaklar listenizi Güncellemek icin marka detaylarini girin</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Hidden ID */}
                            <input
                                id="id"
                                name="id"
                                type="hidden"
                                value={updateBrand?.id}
                                onChange={handleInputChange}
                                required
                            />

                            {/* Company Name - full width */}
                            <div className="md:col-span-2">
                                <label htmlFor="companyName" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Sirket Adi
                                </label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    value={updateBrand.companyName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Brand Name - full width */}
                            <div className="md:col-span-2">
                                <label htmlFor="brandName" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Marka Adi
                                </label>
                                <Input
                                    id="brandName"
                                    name="brandName"
                                    value={updateBrand?.brandName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Şehir
                                </label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={updateBrand?.city}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label htmlFor="country" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Ülke
                                </label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={updateBrand?.country}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Company Website */}
                            <div>
                                <label htmlFor="companyUrl" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Sirket Web Sitesi
                                </label>
                                <Input
                                    id="companyUrl"
                                    name="companyUrl"
                                    value={updateBrand?.companyUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Konum
                                </label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={updateBrand?.location}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Brand Logo */}
                            <div className="md:col-span-2">
                                <label htmlFor="logo" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Marka Logosu
                                </label>

                                {/* Custom file input wrapper */}
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="logo"
                                        className="cursor-pointer inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                                    >
                                        Görsel Seç
                                    </label>

                                    {/* Image preview */}
                                    <div className="w-24 h-24 border rounded overflow-hidden">
                                        {updateBrand?.logo ? (
                                            <img
                                                src={updateBrand.logo}
                                                alt="Marka Logosu"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <img
                                                src="https://placehold.co/400x400"
                                                alt="Yer Tutucu"
                                                className="object-cover w-full h-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div className="md:col-span-2">
                                <label htmlFor="about" className="block text-sm font-semibold mb-1 text-gray-700">
                                    Hakkında
                                </label>
                                <Input
                                    id="about"
                                    name="about"
                                    value={updateBrand?.about}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setIsUpdateBrandOpen(false)}
                                className="px-5 py-2"
                            >
                                İptal
                            </Button>
                            <Button type="submit" className="px-6 py-2">
                                Markayi Güncelle
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
            <Footer />
        </div>

    );
};

export default BrandsPage;
