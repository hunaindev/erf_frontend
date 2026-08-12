
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

const AdminInfluencers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [influencers, setInfluencers] = useState(influencersData);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [approvedLoadingId, setOnaylandıLoadingId] = useState(null);


  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Rising Talent':
        return <Badge className="bg-emerald-100 text-emerald-700 font-medium">Yükselen Yetenek</Badge>;
      case 'Level 1':
        return <Badge className="bg-blue-100 text-blue-700 font-medium">Seviye 1</Badge>;
      case 'Level 2':
        return <Badge className="bg-purple-100 text-purple-700 font-medium">Seviye 2</Badge>;
      case 'Top Rated':
        return <Badge className="bg-orange-100 text-orange-700 font-medium">En İyi</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getFollowersBadge = (followers: string) => {
    const numFollowers = parseInt(followers.replace('K', '000'));

    if (numFollowers >= 100000) {
      return <span className="text-red-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    } else if (numFollowers >= 50000) {
      return <span className="text-orange-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    } else if (numFollowers >= 25000) {
      return <span className="text-blue-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    } else {
      return <span className="text-green-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    }
  };

  const handleUpgradeLevel = (influencer: any, newLevel: string) => {
    setInfluencers(prev => prev.map(inf =>
      inf.id === influencer.id ? { ...inf, level: newLevel } : inf
    ));
    toast.success(`${influencer.name} upgraded to ${newLevel}`);
  };

  const handleDowngradeLevel = (influencer: any, newLevel: string) => {
    setInfluencers(prev => prev.map(inf =>
      inf.id === influencer.id ? { ...inf, level: newLevel } : inf
    ));
    toast.success(`${influencer.name} downgraded to ${newLevel}`);
  };

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

  const totalInfluencers = influencers.length;
  const newInfluencers = influencers.filter(i => i.status === 'active').length;
  const activeInfluencers = influencers.filter(i => i.status === 'active').length;

  // Fix the totalEarnings calculation by properly parsing the earnings string
  const totalEarnings = influencers
    .filter(i => i.status === 'active')
    .reduce((sum, i) => {
      // Parse the earnings string by removing $ and , then converting to number
      const earningsNum = typeof i.earnings === 'string'
        ? parseFloat(i.earnings.replace(/[$,]/g, ''))
        : i.earnings;
      return sum + (earningsNum || 0);
    }, 0);

  function fetchAllInfluencerDash() {
    return axios.get(`${baseUrl}/api/get-all-influencer-dash`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data);
  }

  const {
    data: influencerDash,
    isLoading: isLoading,
    isError: isError,
    error: Error,
  } = useQuery({
    queryKey: ['influencer-dash'],
    queryFn: fetchAllInfluencerDash,

  });


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Delay in ms (500ms = 0.5 second)

    return () => clearTimeout(timer);
  }, [searchTerm]);

  function fetchInfluencers() {
    return axios.get(`${baseUrl}/api/get-all-influencer`, {
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
    queryKey: ['all-influencer'],
    queryFn: fetchInfluencers,
    enabled: !searchTerm // Only run when no search term
  });

  function searchInfluencer() {
    return axios.get(`${baseUrl}/api/get-all-influencer?search=${searchTerm}`, {
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




  const useStatusUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id) =>
        axios.put(`${baseUrl}/api/user-status-changed/${id}`, {}, {
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

  const { mutate: updateStatus, isPending } = useStatusUpdate();

  const handleStatusChange = (id) => {
    setLoadingId(id);
    updateStatus(id, {
      onSettled: () => {
        setLoadingId(null);
      },
    });
  };


  const useOnaylandı = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id) =>
        axios.put(`${baseUrl}/api/user-approved/${id}`, {}, {
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

  const handleOnaylandı = (id) => {
    setOnaylandıLoadingId(id)
    updateOnaylandı(id, {
      onSettled: () => {
        setOnaylandıLoadingId(null);
      },
    });
  };



  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Influencer Yonetimi</h1>
          <p>Kayıtli tum influencerlari yonetin ve izleyin</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid md-cols-2 lg-cols-2">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Influencer</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{influencerDash?.influencer}</div>
              <p className="text-xs text-muted-foreground">
                {/* <span className="text-green-600">+8</span> new this month */}
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
              {/* <p className="text-xs text-muted-foreground">Tüm influencerlar genelinde</p> */}
            </CardContent>
          </Card>

          {/* <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Yuksek Puanli</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">En iyi performans gosterenler</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kazanc</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Bu ay</p>
            </CardContent>
          </Card> */}
        </div>

        {/* Filters and Search */}
        <Card className="filters-section">
          <CardHeader>
            <CardTitle>Tüm Influencerlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="filters-row md-flex-row">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <Input
                  placeholder="Influencerlari isme gore ara"
                  className="search-input pl-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="filter-select">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Seviyeye gore filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="Rising Talent">Yukselen Yetenek</SelectItem>
                  <SelectItem value="Level 1">Seviye 1</SelectItem>
                  <SelectItem value="Level 2">Seviye 2</SelectItem>
                  <SelectItem value="Top Rated">En Yuksek Puanli</SelectItem>
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

                    <TableHead>Takipçiler
                    </TableHead>
                    <TableHead>Etkilesim</TableHead>
                    {/* <TableHead>Seviye</TableHead> */}
                    <TableHead>Kampanyalar</TableHead>
                    {/* <TableHead>Hesap</TableHead> */}
                    <TableHead>Durum</TableHead>
                    <TableHead>Islemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data?.data.length > 0 ? (
                    data?.data.map((influencer: any) => (
                      <TableRow key={influencer.id} className="table-row">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={influencer?.details?.profile_picture_url
                                ? influencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                              alt={influencer.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{influencer.name}</div>
                              <div className="text-sm text-gray-500">{influencer.insta_username}</div>
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={influencer?.tiktok_details?.profile_picture_url
                                ? influencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                              alt={influencer.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{influencer.name}</div>
                              <div className="text-sm text-gray-500">{influencer.username}</div>
                            </div>
                          </div>
                        </TableCell> */}
                        <TableCell>
                          {getFollowersBadge(String(influencer?.details?.followers_count))}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{influencer?.details?.engagement ?? 0}</span>
                        </TableCell>
                        {/* <TableCell>
                        <div className="flex items-center gap-2">
                          {getLevelBadge(influencer.level)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleUpgradeLevel(influencer, 'Top Rated')}>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Upgrade to Top Rated
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpgradeLevel(influencer, 'Level 2')}>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Upgrade to Level 2
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDowngradeLevel(influencer, 'Level 1')}>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Downgrade to Level 1
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDowngradeLevel(influencer, 'Rising Talent')}>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Downgrade to Rising Talent
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell> */}

                        <TableCell>
                          <span className="font-medium">{influencer.campaign}</span>
                        </TableCell>


                        {/* <TableCell>{influencer.is_approved == true ?
                          <Button onClick={() => handleOnaylandı(influencer.id)} size="sm" className="bg-green-100 text-green-700 view-button border rounded hover:bg-green-200 ">{approvedLoadingId === influencer.id ? 'Yükleniyor...' : 'Onaylandı'}</Button> :
                          <Button onClick={() => handleOnaylandı(influencer.id)} size="sm" className="bg-red-100 text-red-700 view-button border rounded hover:bg-red-200">{approvedLoadingId === influencer.id ? 'Yükleniyor...' : 'Onaylanmadı'}</Button>}
                        </TableCell> */}



                        <TableCell>{influencer.status == true ? <Badge className="bg-green-100  text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}</TableCell>
                        <TableCell>



                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(influencer.id)}
                            className={`view-button border rounded 
                            ${influencer.status ? 'border-green-800 text-green-800 hover:bg-green-200 hover:border-green-900' : 'border-red-600 text-red-600 hover:bg-red-200 hover:border-red-700'}`}
                          >

                            {loadingId === influencer.id ? 'Yükleniyor...' :

                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="toggle-on">
                                  <path fill="none" d="M0 0h24v24H0z"></path>
                                  <path d="M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4zm0-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                                </svg>
                                Durum
                              </>}
                          </Button>


                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInfluencer(influencer)}
                            className="view-button ml-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Görüntüle
                          </Button>


                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      {!(isSearchLoading || isAllLoading) && (
                        <TableCell colSpan={7} align="center">
                          <b>Influencer bulunamadı.</b>
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

        {/* Influencer Details Dialog */}
        <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)} >
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


                {/* tiktok */}
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


                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Toplam Kazanc</label>
                    <div className="mt-1 font-medium text-green-600">{selectedInfluencer.earnings}</div>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Katılım Tarihi</label>
                    <div className="mt-1 font-medium">{new Date(selectedInfluencer.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    
                    <label className="text-sm font-medium text-gray-600">Durum</label>
                    <div className="mt-1">{selectedInfluencer.status == true ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}</div>
                  </div>

                     <div>
                    <label className="text-sm font-medium text-gray-600">Telefon</label>
                    <div className="mt-1 font-medium">{selectedInfluencer.contact}</div>
                  </div>

                </div>
              </div>

            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminInfluencers;
