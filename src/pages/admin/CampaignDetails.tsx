
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Instagram, User, Eye, ExternalLink, Hash } from 'lucide-react';
import { baseUrl, imageUrl } from '@/utils/constants';

// Mock campaign data
const campaignData = {
  id: "CAM-001",
  name: "Summer Sports Collection",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  description: "Promote Nike's latest summer sports collection featuring innovative athletic wear designed for peak performance in hot weather conditions. This campaign focuses on showcasing the versatility and style of our new line through authentic lifestyle content.",
  requirements: [
    "Must have 50K+ followers",
    "Focus on fitness and sports content",
    "Post 1 Instagram post/reel and 1 story",
    "Include campaign hashtags",
    "Tag @nike in all posts"
  ],
  hashtags: ["#NikeSummer", "#SportsWear", "#FitnessMotivation", "#SummerVibes", "#NikePartner"],
  brand: "Nike",
  category: "Sports & Fitness",
  startDate: "2024-01-10",
  endDate: "2024-02-10",
  status: "active"
};

const influencersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "fitness_sarah",
    instagramUrl: "https://instagram.com/fitness_sarah",
    avatar: "/lovable-uploads/7b7b4cb9-4965-4241-9825-b6be1ae9bd52.png",
    followers: "125K",
    level: "Top Rated",
    content: [
      {
        id: 1,
        type: "image",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        approved: true,
        postLink: "https://instagram.com/p/example1",
        storyLink: "https://instagram.com/stories/example1"
      },
      {
        id: 2,
        type: "video",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        approved: false,
        postLink: "",
        storyLink: ""
      }
    ]
  },
  {
    id: 2,
    name: "Mike Runner",
    username: "runner_mike",
    instagramUrl: "https://instagram.com/runner_mike",
    avatar: "/placeholder.svg",
    followers: "89K",
    level: "Level 2",
    content: [
      {
        id: 3,
        type: "image",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        approved: true,
        postLink: "https://instagram.com/p/example2",
        storyLink: "https://instagram.com/stories/example2"
      }
    ]
  }
];

const AdminCampaignDetails = () => {
  const { id } = useParams();
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [contentPreviewOpen, setContentPreviewOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Rising Talent':
        return <Badge className="bg-green-100 text-green-700">Yukselen Yetenek</Badge>;
      case 'Level 1':
        return <Badge className="bg-blue-100 text-blue-700">Seviye 1</Badge>;
      case 'Level 2':
        return <Badge className="bg-purple-100 text-purple-700">Seviye 2</Badge>;
      case 'Top Rated':
        return <Badge className="bg-orange-100 text-orange-700">En Yuksek Puanli</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const handleViewContent = (influencer: any) => {
    setSelectedInfluencer(influencer);
    setContentPreviewOpen(true);
  };

  const handleContentPreview = (content: any) => {
    setSelectedContent(content);
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-header">
          <Link to="/admin/campaigns" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kampanyalara Dön
          </Link>
          <h1>{campaignData.name}</h1>
          <p>Kampanya Detayları - {campaignData.brand}</p>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Kampanya Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <img
                  src={`${imageUrl}/${campaignData.image}`}

                  alt="Kampanya"
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Açıklama</h4>
                <p className="text-gray-600">{campaignData.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Kampanya Hashtagleri
                </h4>
                <div className="flex flex-wrap gap-2">
                  {campaignData.hashtags.map((hashtag, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Gereksinimler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {campaignData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kampanya Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Marka</label>
                <div className="mt-1 font-medium">{campaignData.brand}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Kategori</label>
                <div className="mt-1 font-medium">{campaignData.category}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</label>
                <div className="mt-1 font-medium">{campaignData.startDate}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Bitiş Tarihi</label>
                <div className="mt-1 font-medium">{campaignData.endDate}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Influencerlar</label>
                <div className="mt-1 font-medium">{influencersData.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Influencers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kampanya Influencerlari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Takipçiler
                    </TableHead>
                    <TableHead>Seviye</TableHead>
                    <TableHead>Instagram</TableHead>
                    <TableHead>Profil</TableHead>
                    <TableHead>İçerik</TableHead>
                    <TableHead>Gönderi
                      Linki</TableHead>
                    <TableHead>Hikaye Linki</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencersData.map((influencer) => (
                    <TableRow key={influencer.id} className="table-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={influencer.avatar}
                            alt={influencer.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{influencer.name}</div>
                            <div className="text-sm text-gray-500">@{influencer.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{influencer.followers}</span>
                      </TableCell>
                      <TableCell>
                        {getLevelBadge(influencer.level)}
                      </TableCell>
                      <TableCell>
                        <a
                          href={influencer.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-700"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewContent(influencer)}
                        >
                          Icerigi Görüntüle
                        </Button>
                      </TableCell>
                      <TableCell>
                        {influencer.content.some(c => c.postLink) ? (
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {influencer.content.some(c => c.storyLink) ? (
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Content Preview Dialog */}
        <Dialog open={contentPreviewOpen} onOpenChange={setContentPreviewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Content Preview - {selectedInfluencer?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedInfluencer && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedInfluencer.content.map((content: any) => (
                    <div key={content.id} className="border rounded-lg p-4">
                      <div className="aspect-square mb-3 relative">
                        <img
                          src={content.url}
                          alt="İçerik Önizlemesi"
                          className="w-full h-full object-cover rounded cursor-pointer"
                          onClick={() => handleContentPreview(content)}
                        />
                        {content.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-3">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant={content.type === 'image' ? 'default' : 'secondary'}>
                            {content.type}
                          </Badge>
                          <Badge
                            className={content.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          >
                            {content.approved ? 'Onaylandı' : 'Beklemede'}
                          </Badge>
                        </div>
                        {!content.approved && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                              Onayla
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 text-xs">
                              Reddet
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCampaignDetails;
