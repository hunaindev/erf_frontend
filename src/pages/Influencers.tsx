
import React, { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Filter, Search } from 'lucide-react';
import Footer from '@/components/Footer';
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

const Influencers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // Placeholder data - replace with your backend integration
  const influencers = [
    {
      id: 1,
      name: "Sarah Johnson",
      category: "Yemek ve Restoran",
      followers: "45K",
      engagement: "3.2%",
      location: "Toronto, Kanada",
      bio: "Surdurulebilir yemek kulturu odakli yemek blog yazari ve tarif ureticisi.",
      email: "sarah@example.com",
      instagram: "@sarahjohnson",
      joinedDate: "Ocak 2023"
    },
    {
      id: 2,
      name: "Mike Peters",
      category: "Yemek ve Restoran",
      followers: "28K",
      engagement: "4.1%",
      location: "Vancouver, Kanada",
      bio: "Restoran degerlendiricisi ve yemek fotografciligi uzmani.",
      email: "mike@example.com",
      instagram: "@mikepeters",
      joinedDate: "Mart 2023"
    },
  ];

  const categories = ["Yemek ve Restoran", "Moda", "Teknoloji", "Yasam Tarzi", "Seyahat"];

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || influencer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewProfile = (influencer) => {
    setSelectedInfluencer(influencer);
    setIsProfileOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      <DashboardNavbar />

      <main style={{ flex: 1, padding: '24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Influencer'lar</h1>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Filter style={{ width: '16px', height: '16px' }} />
              Filtreler
            </Button>
          </div>

          <Card>
            <CardContent style={{ padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#6b7280' }} />
                  <Input
                    placeholder="Influencer ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>

                {showFilters && (
                  <div style={{ marginTop: '16px' }}>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger style={{ width: '200px' }}>
                        <SelectValue placeholder="Kategori Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Kategoriler</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card style={{ marginTop: '24px' }}>
            <CardContent style={{ padding: '0' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ padding: '16px' }}>Ad</TableHead>
                    <TableHead style={{ padding: '16px' }}>Kategori</TableHead>
                    <TableHead style={{ padding: '16px' }}>Takipçiler
                    </TableHead>
                    <TableHead style={{ padding: '16px' }}>Etkilesim Orani</TableHead>
                    <TableHead style={{ padding: '16px' }}>Konum</TableHead>
                    <TableHead style={{ padding: '16px' }}>Islem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInfluencers.map((influencer) => (
                    <TableRow key={influencer.id}>
                      <TableCell style={{ padding: '16px', fontWeight: '500' }}>{influencer.name}</TableCell>
                      <TableCell style={{ padding: '16px' }}>{influencer.category}</TableCell>
                      <TableCell style={{ padding: '16px' }}>{influencer.followers}</TableCell>
                      <TableCell style={{ padding: '16px' }}>{influencer.engagement}</TableCell>
                      <TableCell style={{ padding: '16px' }}>{influencer.location}</TableCell>
                      <TableCell style={{ padding: '16px' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(influencer)}
                          style={{ fontSize: '14px', padding: '8px 16px' }}
                        >
                          Profili Görüntüle
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

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent style={{ maxWidth: '500px' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '20px', fontWeight: '600' }}>Influencer Profili</DialogTitle>
          </DialogHeader>

          {selectedInfluencer && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '24px',
                    fontWeight: '500'
                  }}>
                    {selectedInfluencer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{selectedInfluencer.name}</h3>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{selectedInfluencer.category} • {selectedInfluencer.location}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ textAlign: 'center', flexBasis: '33%' }}>
                    <p style={{ fontSize: '20px', fontWeight: '600' }}>{selectedInfluencer.followers}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Takipçiler
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', flexBasis: '33%' }}>
                    <p style={{ fontSize: '20px', fontWeight: '600' }}>{selectedInfluencer.engagement}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Etkilesim</p>
                  </div>
                  <div style={{ textAlign: 'center', flexBasis: '33%' }}>
                    <p style={{ fontSize: '20px', fontWeight: '600' }}>{selectedInfluencer.joinedDate}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Katilim</p>
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Biyografi</h4>
                  <p style={{ color: '#4b5563', fontSize: '14px' }}>{selectedInfluencer.bio}</p>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>İletişim Bilgileri</h4>
                  <p style={{ color: '#4b5563', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>E-posta: {selectedInfluencer.email}</span>
                    <span>Instagram: {selectedInfluencer.instagram}</span>
                  </p>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outline"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Kapat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Influencers;
