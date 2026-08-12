
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Instagram, User, Eye, ExternalLink, Hash, Calendar, Users, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { baseUrl, imageUrl } from '@/utils/constants';
import axios from 'axios';

// Mock campaign data - in real app this would come from API
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
  },
  {
    id: 3,
    name: "Emma Fitness",
    username: "emma_fit",
    instagramUrl: "https://instagram.com/emma_fit",
    avatar: "/placeholder.svg",
    followers: "67K",
    level: "Level 1",
    content: []
  },
  {
    id: 4,
    name: "John Active",
    username: "john_active",
    instagramUrl: "https://instagram.com/john_active",
    avatar: "/placeholder.svg",
    followers: "45K",
    level: "Rising Talent",
    content: []
  }
];

const AdminCampaignDetailsView = () => {
  const { id } = useParams();
  const [contentPreviewOpen, setContentPreviewOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Rising Talent':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Yukselen Yetenek</Badge>;
      case 'Level 1':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Seviye 1</Badge>;
      case 'Level 2':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-300">Seviye 2</Badge>;
      case 'Top Rated':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-300">En Yuksek Puanli</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const handleContentPreview = (content: any) => {
    setSelectedContent(content);
    setContentPreviewOpen(true);
  };
  const getType = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext)) return 'video';
    return 'unknown';
  };


  function fetchCampaignDetails(id) {
    return axios.get(`${baseUrl}/api/get-campaign-details/${id}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data.data);
  }

  const {
    data: campaignData,
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError,
  } = useQuery({
    queryKey: ['campaign-details'],
    queryFn: () => fetchCampaignDetails(id),
    //  enabled: !searchTerm // Only run when no search term
  });

  console.log(campaignData);

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-header">
          <Link to="/admin/campaigns" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kampanyalara Dön
          </Link>
          <h1>{campaignData?.name}</h1>
          <p>Kampanya Detayları - {campaignData?.brand}</p>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Kampanya Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Kampanya Görseli</h4>
                <img
                  src={campaignData?.image ? `${imageUrl}/${campaignData?.image}` : ''}
                  alt="Kampanya"
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>

              <div>
                {/* <h4 className="font-medium mb-2">Açıklama</h4> */}
                {/* <p className="text-gray-600">{campaignData.description}</p> */}
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Kampanya Hashtagleri
                </h4>
                <div className="flex flex-wrap gap-2">
                  {campaignData?.hashtags}
                  {/* {campaignData.hashtags.map((hashtag, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {hashtag}
                    </Badge>
                  ))} */}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Gereksinimler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {campaignData?.requirements}
                  {/* {campaignData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))} */}
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
                <div className="mt-1 font-medium">{campaignData?.brand}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Kategori</label>
                <div className="mt-1 font-medium">{campaignData?.category}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</label>
                <div className="mt-1 font-medium">{campaignData?.start_date}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Bitiş Tarihi</label>
                <div className="mt-1 font-medium">{campaignData?.end_date}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Influencerlar</label>
                <div className="mt-1 font-medium">{campaignData?.applies?.length > 0 ? campaignData?.applies?.length : 0}</div>
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
                    <TableHead>TikTok</TableHead>
                    <TableHead>Takipçiler
                    </TableHead>
                    <TableHead>TikTok Takipçiler
                      i</TableHead>

                    {/* <TableHead>Seviye</TableHead> */}
                    <TableHead>Instagram ve TikTok</TableHead>

                    <TableHead>İçerik</TableHead>
                    <TableHead>Gönderi Linki</TableHead>
                    <TableHead>Hikaye Linki</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignData?.applies.map((influencer) => (
                    <TableRow key={influencer?.id} className="table-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={influencer?.influencer_image ? influencer?.influencer_image : 'https://placehold.co/400x400'}
                            alt={influencer?.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{influencer?.name}</div>
                            <div className="text-sm text-gray-500">@{influencer?.username}</div>
                          </div>
                        </div>


                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={influencer?.tiktok_image ? influencer?.tiktok_image : 'https://placehold.co/400x400'}
                            alt={influencer?.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{influencer?.name}</div>
                            <div className="text-sm text-gray-500">@{influencer?.tiktok_username}</div>
                          </div>
                        </div>


                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-blue-600">{influencer?.followers_count}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-blue-600">{influencer?.tiktok_followers_count ?? 0}</span>
                      </TableCell>
                      {/* <TableCell>
                        {getLevelBadge(influencer.level)}
                      </TableCell> */}
                      <TableCell>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-pink-500 hover:text-pink-700 dispa"
                          onClick={() => window.open(`https://www.instagram.com/${influencer?.username}/`, '_blank')}
                        >
                          <Instagram className="h-6 w-6" />
                        </Button>

                        <a
                          href={influencer?.tiktok_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <div className="w-5 h-5 mr-2 bg-black rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                          </div>
                        </a> */}


                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-500 hover:text-pink-700"
                            onClick={() =>
                              window.open(`https://www.instagram.com/${influencer?.username}/`, "_blank")
                            }
                          >
                            <Instagram className="h-6 w-6" />
                          </Button>

                          <a
                            href={influencer?.tiktok_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="white"
                              >
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                              </svg>
                            </div>
                          </a>
                        </div>

                      </TableCell>

                      <TableCell>
                        {influencer?.story && influencer?.post ? (
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentPreview(influencer)}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400">İçerik yok</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {influencer?.post_link ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(influencer?.post_link, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}


                      </TableCell>
                      <TableCell>
                        {influencer?.story_link ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(influencer?.story_link, '_blank')}
                          >
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>İçerik Önizleme</DialogTitle>
            </DialogHeader>
            {selectedContent && (

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Story Block */}
                {selectedContent?.story && (() => {
                  const type = getType(selectedContent?.story);
                  return (
                    <div className="rounded-xl border p-4 shadow-sm bg-white">
                      <div className="aspect-square overflow-hidden rounded-lg mb-4">
                        {type === 'image' && (
                          <img
                            src={`${imageUrl}/${selectedContent?.story}`}
                            alt="Hikaye Medyasi"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {type === 'video' && (
                          <video
                            src={`${imageUrl}/${selectedContent?.story}`}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <Badge variant="secondary">Hikaye</Badge>
                        <Badge
                          className={
                            selectedContent?.story_status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : selectedContent?.story_status === 'rejected'
                                ? 'bg-yellow-100 text-red-700' : 'bg-yellow-100 text-yellow-700'

                          }
                        >
                          {selectedContent?.story_status === 'accepted'
                            ? 'Onaylandı'
                            : selectedContent?.story_status === 'rejected'
                              ? 'Reddedildi'
                              : 'Inceleme Bekliyor'}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}

                {/* Post Block */}
                {selectedContent?.post && (() => {
                  const type = getType(selectedContent?.post);
                  return (
                    <div className="rounded-xl border p-4 shadow-sm bg-white">
                      <div className="aspect-square overflow-hidden rounded-lg mb-4">
                        {type === 'image' && (
                          <img
                            src={`${imageUrl}/${selectedContent?.post}`}
                            alt="Gönderi
 Medyasi"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {type === 'video' && (
                          <video
                            src={`${imageUrl}/${selectedContent?.post}`}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <Badge variant="secondary">Gönderi</Badge>
                        <Badge
                          className={
                            selectedContent?.post_status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : selectedContent?.post_status === 'rejected'
                                ? 'bg-yellow-100 text-red-700' : 'bg-yellow-100 text-yellow-700'

                          }
                        >
                          {selectedContent?.post_status === 'accepted'
                            ? 'Onaylandı'
                            : selectedContent?.post_status === 'rejected'
                              ? 'Reddedildi'
                              : 'Inceleme Bekliyor'}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>

            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCampaignDetailsView;
