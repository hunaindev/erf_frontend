import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  FileDown,
  Download,
  Trash,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { exportToCSV, exportToPDF } from "../../utils/tableExport";
import axios from "axios";
import { baseUrl, imageUrl } from "@/utils/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const brandsData = [
  {
    id: "BRD-001",
    name: "Nike",
    email: "marketing@nike.com",
    website: "https://nike.com",
    category: "Sports & Fitness",
    activeCampaigns: 5,
    totalSpent: "$45,750",
    joinDate: "2023-01-15",
    status: "active",
    subscriptionPlan: "Premium",
    trialStatus: "active",
    trialDaysLeft: 14,
    contactPerson: "Sarah Johnson",
    phone: "+1-555-0123",
    logo: "/placeholder.svg",
  },
  {
    id: "BRD-002",
    name: "Adidas",
    email: "campaigns@adidas.com",
    website: "https://adidas.com",
    category: "Sports & Fitness",
    activeCampaigns: 3,
    totalSpent: "$32,200",
    joinDate: "2023-02-20",
    status: "active",
    subscriptionPlan: "Enterprise",
    trialStatus: "warning",
    trialDaysLeft: 3,
    contactPerson: "Mike Wilson",
    phone: "+1-555-0124",
    logo: "/placeholder.svg",
  },
  {
    id: "BRD-003",
    name: "Apple",
    email: "marketing@apple.com",
    website: "https://apple.com",
    category: "Technology",
    activeCampaigns: 8,
    totalSpent: "$78,900",
    joinDate: "2023-01-10",
    status: "active",
    subscriptionPlan: "Premium",
    trialStatus: "expired",
    trialDaysLeft: 0,
    contactPerson: "Emma Davis",
    phone: "+1-555-0125",
    logo: "/placeholder.svg",
  },
  {
    id: "BRD-004",
    name: "Spotify",
    email: "partnerships@spotify.com",
    website: "https://spotify.com",
    category: "Entertainment",
    activeCampaigns: 2,
    totalSpent: "$18,500",
    joinDate: "2023-03-05",
    status: "pending",
    subscriptionPlan: "Basic",
    trialStatus: "active",
    trialDaysLeft: 28,
    contactPerson: "Alex Thompson",
    phone: "+1-555-0126",
    logo: "/placeholder.svg",
  },
];

const AdminBrands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [brands, setBrands] = useState(brandsData);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const [deleteBrandId, setDeleteBrandId] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Aktif</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Beklemede</Badge>
        );
      case "suspended":
        return <Badge className="bg-red-100 text-red-700">Askida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTrialBadge = (trialStatus: string, daysLeft: number) => {
    if (trialStatus === "expired") {
      return (
        <Badge className="bg-red-100 text-red-700 font-medium">
          Süresi Doldu
        </Badge>
      );
    } else if (daysLeft <= 3) {
      return (
        <Badge className="bg-orange-100 text-orange-700 font-medium">
          {daysLeft} gün kaldı
        </Badge>
      );
    } else if (daysLeft <= 7) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 font-medium">
          {daysLeft} gün kaldı
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-700 font-medium">
          {daysLeft} gün kaldı
        </Badge>
      );
    }
  };

  const handleExport = (format: "csv" | "pdf") => {
    const exportData = filteredMarkalar.map((brand) => ({
      "Brand ID": brand.id,
      Name: brand.name,
      Email: brand.email,
      Website: brand.website,
      Kategori: brand.category,
      "Aktif Kampanyalar": brand.activeCampaigns,
      "Total Spent": brand.totalSpent,
      "Join Date": brand.joinDate,
      Durum: brand.status,
      "Subscription Plan": brand.subscriptionPlan,
      "Deneme Durumu": brand.trialStatus,
      "Trial Days Left": brand.trialDaysLeft,
      "Contact Person": brand.contactPerson,
      Phone: brand.phone,
    }));

    if (format === "csv") {
      exportToCSV(exportData, "brands");
    } else {
      exportToPDF(exportData, "brands", "Marka Raporu");
    }

    toast.success(`Markalar disa aktarildi: ${format.toUpperCase()}`);
  };

  const filteredMarkalar = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || brand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMarkalar = brands.length;
  const activeMarkalar = brands.filter((b) => b.status === "active").length;
  const pendingMarkalar = brands.filter((b) => b.status === "pending").length;
  const suspendedMarkalar = brands.filter(
    (b) => b.status === "suspended",
  ).length;
  const totalRevenue = brands.reduce(
    (sum, b) => sum + parseInt(b.totalSpent.replace(/[$,]/g, "")),
    0,
  );

  function fetchAllBrandDash() {
    return axios
      .get(`${baseUrl}/api/get-all-brand-dash`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token"),
          )}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data);
  }

  const {
    data: brandDash,
    isLoading: isLoading,
    isError: isError,
    error: Error,
  } = useQuery({
    queryKey: ["brand-dash"],
    queryFn: fetchAllBrandDash,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Delay in ms (500ms = 0.5 second)

    return () => clearTimeout(timer);
  }, [searchTerm]);

  function fetchBrand() {
    return axios
      .get(`${baseUrl}/api/get-all-brand`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token"),
          )}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data.data);
  }

  const {
    data: allMarkalar,
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError,
  } = useQuery({
    queryKey: ["all-brand"],
    queryFn: fetchBrand,
    enabled: !searchTerm, // Only run when no search term
  });

  function searchBrand() {
    return axios
      .get(`${baseUrl}/api/get-all-brand?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token"),
          )}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data.data);
  }
  const {
    data: searchedMarkalar,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useQuery({
    queryKey: ["search-brand", searchTerm],
    queryFn: searchBrand,
    enabled: !!debouncedTerm, // Only run when searchTerm exists
  });
  const data = searchTerm ? searchedMarkalar : allMarkalar;

  const useStatusUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id) =>
        axios.put(
          `${baseUrl}/api/user-status-changed/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token"),
              )}`,
              "Content-Type": "application/json",
            },
          },
        ),
      onSuccess: () => {
        // Refetch influencers after status change
        queryClient.invalidateQueries(["all-brand", "search-brand"]);
      },
    });
  };

  const { mutate: updateStatus, isPending } = useStatusUpdate();

  const handleStatusChange = (id) => {
    setLoadingId(id);
    updateStatus(id, {
      onSettled: () => {
        setLoadingId(null);
      },
    });
  };

  const useDeleteBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) =>
        axios.put(
          `${baseUrl}/api/delete-brand/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || '""',
              )}`,
              "Content-Type": "application/json",
            },
          },
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["all-brand"],
        });

        queryClient.invalidateQueries({
          queryKey: ["search-brand"],
        });
      },
    });
  };

  const { mutate: deleteBrand } = useDeleteBrand();

  const handleDeleteBrand = () => {
    if (!deleteBrandId) return;

    setLoadingId(deleteBrandId);

    deleteBrand(deleteBrandId, {
      onSuccess: () => {
        setDeleteBrandId(null);
      },

      onSettled: () => {
        setLoadingId(null);
      },
    });
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Marka Yönetimi</h1>
          <p>Kayıtli tum markalari ve kampanyalarini yonetin ve izleyin</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid md-cols-2 lg-cols-2">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Marka
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandDash?.brand}</div>
              <p className="text-xs text-muted-foreground">
                {/* <span className="text-green-600">+3</span> new this month */}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktif Kampanyalar
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandDash?.campaign}</div>
              {/* <p className="text-xs text-muted-foreground">Tum markalar genelinde</p> */}
            </CardContent>
          </Card>

          {/* <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$175,350</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
        </p>
      </CardContent>
    </Card>  */}

          {/* <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deneme Markaları</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Su anda denemede</p>
            </CardContent>
          </Card> */}
        </div>

        {/* Filters and Search */}
        <Card className="filters-section">
          <CardHeader>
            <CardTitle>Tüm Markalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="filters-row md-flex-row">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <Input
                  placeholder="Markaları isme göre ara"
                  className="search-input pl-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="filter-select">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Duruma gore filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="suspended">Askida</SelectItem>
                </SelectContent>
              </Select> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="export-button">
                    <Download className="h-4 w-4 mr-2" />
                    Disa Aktar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    <FileDown className="h-4 w-4 mr-2" />
                    CSV olarak disa aktar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF olarak disa aktar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Markalar Table */}
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marka</TableHead>
                    {/* <TableHead>Kategori</TableHead> */}
                    <TableHead>Aktif Kampanyalar</TableHead>
                    {/* <TableHead>Toplam Harcama</TableHead> */}
                    {/* <TableHead>Deneme Durumu</TableHead> */}
                    {/* <TableHead>Abonelik</TableHead> */}
                    <TableHead>Durum</TableHead>
                    <TableHead>Islemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((brand: any) => (
                      <TableRow key={brand.id} className="table-row">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                brand?.image
                                  ? `${imageUrl}/${brand?.image}`
                                  : "https://placehold.co/400x400"
                              }
                              alt={brand?.name}
                              className="h-10 w-10 rounded-full"
                            />

                            <div>
                              <div className="font-medium">{brand?.name}</div>
                              <div className="text-sm text-gray-500">
                                {brand?.username}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium">{brand.campaign}</span>
                        </TableCell>
                        {/* <TableCell>
                          <span className="font-medium text-green-600">{brand.totalSpent}</span>
                        </TableCell> */}
                        {/* <TableCell>
                          {getTrialBadge(brand.trialStatus, brand.trialDaysLeft)}
                        </TableCell> */}
                        {/* <TableCell>
                          <Badge variant="outline">{brand.subscriptionPlan}</Badge>
                        </TableCell> */}
                        <TableCell>
                          {brand.status == true ? (
                            <Badge className="bg-green-100 text-green-700">
                              Aktif
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">
                              Askida
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(brand.user_id)}
                            className={`view-button border rounded 
                            ${
                              brand.status
                                ? "border-green-800 text-green-800 hover:bg-green-200 hover:border-green-900"
                                : "border-red-600 text-red-600 hover:bg-red-200 hover:border-red-700"
                            }`}
                          >
                            {loadingId === brand.user_id ? (
                              "Yükleniyor..."
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  id="toggle-on"
                                >
                                  <path fill="none" d="M0 0h24v24H0z"></path>
                                  <path d="M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4zm0-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                                </svg>
                                Durum
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBrand(brand)}
                            className="view-button ml-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Görüntüle
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteBrandId(brand.id)}
                            disabled={loadingId === brand.id}
                            className="view-button ml-2"
                          >
                            {loadingId === brand.id ? (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="mr-1 h-4 w-4" />
                            )}
                            Silmek
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      {!(isSearchLoading || isAllLoading) && (
                        <TableCell colSpan={5} align="center">
                          <b>Marka bulunamadı.</b>
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

        {/* Brand Details Dialog */}
        <Dialog
          open={!!selectedBrand}
          onOpenChange={() => setSelectedBrand(null)}
        >
          <DialogContent className="dialog-content">
            <DialogHeader className="dialog-header">
              <DialogTitle className="dialog-title">
                Marka Detayları
              </DialogTitle>
            </DialogHeader>
            {selectedBrand && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedBrand?.image
                        ? `${imageUrl}/${selectedBrand?.image}`
                        : "https://placehold.co/400x400"
                    }
                    alt={selectedBrand?.name}
                    className="h-10 w-10 rounded-full"
                  />

                  <div>
                    <h3 className="font-bold text-lg">{selectedBrand?.name}</h3>
                    <p className="text-gray-600">{selectedBrand?.email}</p>
                    <a
                      href={selectedBrand?.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedBrand?.company_url}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      İletişim Kişisi
                    </label>
                    <div className="mt-1 font-medium">
                      {selectedBrand?.username}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Telefon
                    </label>
                    <div className="mt-1 font-medium">
                      {selectedBrand?.phone}
                    </div>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Kategori</label>
                    <div className="mt-1">{selectedBrand.category}</div>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Katılım Tarihi
                    </label>
                    <div className="mt-1 font-medium">
                      {new Date(selectedBrand.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Aktif Kampanyalar
                    </label>
                    <div className="mt-1 font-medium">
                      {selectedBrand.campaign}
                    </div>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Toplam Harcama</label>
                    <div className="mt-1 font-medium text-green-600">{selectedBrand.totalSpent}</div>
                  </div> */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Deneme Durumu</label>
                    <div className="mt-1">{getTrialBadge(selectedBrand.trialStatus, selectedBrand.trialDaysLeft)}</div>
                  </div> */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Abonelik Plani</label>
                    <div className="mt-1 font-medium">{selectedBrand.subscriptionPlan}</div>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Durum
                    </label>
                    <div className="mt-1">
                      {selectedBrand.status == true ? (
                        <Badge className="bg-green-100 text-green-700">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">
                          Askida
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
          open={deleteBrandId !== null}
        onOpenChange={(open) => {
          if (!open && loadingId === null) {
            setDeleteBrandId(null);
          }
        }}
>
  <DialogContent className="dialog-content">
    <DialogHeader className="dialog-header">
      <DialogTitle className="dialog-title">
        Markayı Sil
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">
          {deleteBrand?.name}
        </span>{" "}
        markasını silmek istediğinizden emin misiniz?
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setDeleteBrandId(null)}
          disabled={loadingId !== null}
        >
          İptal
        </Button>

        <Button
          onClick={handleDeleteBrand}
          disabled={loadingId !== null}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {loadingId !== null && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}

          Sil
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

    
    </div>
  );
};

export default AdminBrands;
