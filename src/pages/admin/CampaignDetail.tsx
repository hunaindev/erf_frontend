
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Play, Pause, CheckCircle, Eye, Users, Calendar, Target, Hash, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { baseUrl, imageUrl } from '@/utils/constants';

// Mock data for campaign detail
const campaignData = {
  id: "CAM-001",
  title: "Summer Sports Collection",
  brand: "Nike",
  brandLogo: "/placeholder.svg",
  status: "active",
  description: "Promote Nike's latest summer sports collection featuring innovative athletic wear designed for peak performance in hot weather conditions.",
  startDate: "2024-01-10",
  endDate: "2024-02-10",
  category: "Sports & Fitness",
  priority: "high",
  hashtags: ["#NikeSummer", "#SportsWear", "#FitnessMotivation", "#SummerVibes"],
  campaignImage: "/placeholder.svg",
  requirements: [
    "Must have 50K+ followers",
    "Focus on fitness and sports content",
    "Post 1 Instagram post/reel and 1 story",
    "Include #NikeSummer hashtag"
  ],
  deliverables: [
    "1 Instagram post/reel",
    "1 Instagram story"
  ]
};

const influencersData = [
  {
    id: "INF-001",
    name: "Sarah Johnson",
    username: "@fitness_sarah",
    followers: 125000,
    engagement: 4.2,
    status: "approved",
    content: [
      {
        type: "Instagram Post",
        status: "approved",
        isUploaded: true,
        link: "https://instagram.com/p/example1"
      },
      {
        type: "Instagram Story",
        status: "submitted",
        isUploaded: true,
        link: "https://instagram.com/stories/example1"
      }
    ],
    earnings: 2500,
    avatar: "/lovable-uploads/7b7b4cb9-4965-4241-9825-b6be1ae9bd52.png"
  },
  {
    id: "INF-002",
    name: "Mike Runner",
    username: "@runner_mike",
    followers: 89000,
    engagement: 3.8,
    status: "active",
    content: [
      {
        type: "Instagram Post",
        status: "draft",
        isUploaded: false,
        link: ""
      },
      {
        type: "Instagram Story",
        status: "pending",
        isUploaded: false,
        link: ""
      }
    ],
    earnings: 1800,
    avatar: "/placeholder.svg"
  }
];

const AdminCampaignDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700"><Play className="h-3 w-3 mr-1" />Aktif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Beklemede</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700"><Pause className="h-3 w-3 mr-1" />Askida</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700"><CheckCircle className="h-3 w-3 mr-1" />Tamamlandı</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Onaylandı</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Onaylandı</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700">Onay Bekliyor</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Beklemede</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Taslak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePreviewContent = (content: any) => {
    if (!content.isUploaded) {
      toast({
        title: "Content Not Available",
        description: "This content has not been uploaded yet.",
        variant: "destructive"
      });
      return;
    }
    // Preview functionality would be implemented here
    toast({
      title: "Preview",
      description: `Previewing ${content.type}`,
    });
  };

  const handleGoToLink = (content: any) => {
    if (!content.isUploaded || !content.link) {
      toast({
        title: "Link Not Available",
        description: "This content has not been uploaded yet or link is not available.",
        variant: "destructive"
      });
      return;
    }
    window.open(content.link, '_blank', 'noopener,noreferrer');
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
          <div className="flex justify-between items-start">
            <div>
              <h1>{campaignData.title}</h1>
              <p>Kampanya ID: {campaignData.id}</p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(campaignData.status)}
              <Button variant="outline">Kampanyayı Düzenle</Button>
              <Button variant="destructive">Kampanyayı Askıya Al</Button>
            </div>
          </div>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Kampanya Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={campaignData.brandLogo} />
                  <AvatarFallback>{campaignData.brand.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{campaignData.brand}</h3>
                  <p className="text-sm text-gray-600">{campaignData.category}</p>
                </div>
              </div>

              {/* Campaign Image */}
              <div>
                <h4 className="font-medium mb-2">Kampanya Görseli</h4>
                <img
                  src={`${imageUrl}/${campaignData.campaignImage}`}

                  alt="Kampanya"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Açıklama</h4>
                <p className="text-gray-600">{campaignData.description}</p>
              </div>

              {/* Hashtags */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Hashtags
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

              <div>
                <h4 className="font-medium mb-2">Teslimatlar</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {campaignData.deliverables.map((deliverable, index) => (
                    <li key={index}>{deliverable}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kampanya Istatistikleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Başlangıç Tarihi</span>
                </div>
                <span className="font-semibold">{campaignData.startDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Bitiş Tarihi</span>
                </div>
                <span className="font-semibold">{campaignData.endDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Influencerlar</span>
                </div>
                <span className="font-semibold">{influencersData.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Oncelik</span>
                </div>
                <Badge variant={campaignData.priority === 'high' ? 'destructive' : 'outline'}>
                  {campaignData.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Influencers and Content */}
        <Card>
          <CardHeader>
            <CardTitle>Kampanya Katilimcilari ve İçerik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {influencersData.map((influencer) => (
                <div key={influencer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={influencer.avatar} />
                        <AvatarFallback>{influencer.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{influencer.name}</h4>
                        <p className="text-sm text-gray-600">{influencer.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{influencer.followers.toLocaleString()} followers</div>
                        <div className="text-sm text-gray-600">{influencer.engagement}% engagement</div>
                      </div>
                      {getStatusBadge(influencer.status)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Content Deliverables (Max 2):</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {influencer.content.map((content, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{content.type}</div>
                            {getContentStatusBadge(content.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreviewContent(content)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGoToLink(content)}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            {content.status === 'submitted' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="text-green-600 text-xs">
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

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <span className="text-sm font-medium">
                      Kazanc: ${influencer.earnings.toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      {influencer.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="text-green-600">
                            Onayla
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            Reddet
                          </Button>
                        </>
                      )}
                      {influencer.status === 'active' && (
                        <Button variant="outline" size="sm">
                          Mesaj
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCampaignDetail;
