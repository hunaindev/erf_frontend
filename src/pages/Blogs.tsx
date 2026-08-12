
import React, { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from 'react-router-dom';
import { Eye, Heart, Users, DollarSign } from 'lucide-react';

const Blogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  
  const blogs = [
    {
      id: 1,
      title: "10 Ways to Maximize Your Restaurant's Social Media Presence",
      excerpt: "Learn the most effective strategies to boost your restaurant's visibility online.",
      image: "https://placehold.co/800x450/e2e8f0/64748b?text=Blog+Image+1",
      date: "Aug 15, 2023",
      author: "Jennifer Lawrence",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Food Photography for Restaurants",
      excerpt: "Master the art of food photography to make your dishes look irresistible on social media.",
      image: "https://placehold.co/800x450/e2e8f0/64748b?text=Blog+Image+2",
      date: "Jul 27, 2023",
      author: "Michael Rodriguez",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "How to Create a Successful Influencer Marketing Campaign",
      excerpt: "Step-by-step guide to launching an effective influencer campaign for your restaurant.",
      image: "https://placehold.co/800x450/e2e8f0/64748b?text=Blog+Image+3",
      date: "Jun 12, 2023",
      author: "Sarah Johnson",
      readTime: "6 min read"
    }
  ];
  
  const caseStudies = [
    {
      id: 1,
      title: "How 'Taste of Italy' Increased Reservations by 45%",
      excerpt: "A comprehensive case study on how a local Italian restaurant leveraged influencer marketing to boost reservations.",
      image: "https://placehold.co/800x450/e2e8f0/64748b?text=Case+Study+1",
      date: "Sep 5, 2023",
      author: "Marketing Team",
      stats: {
        reach: "120K+",
        engagement: "8.7%",
        influencers: 12,
        revenue: "$24,500"
      }
    },
    {
      id: 2,
      title: "Sushi Bar 'Nori' Launch Campaign Success Story",
      excerpt: "How a new sushi restaurant created buzz and attracted a loyal customer base in just 30 days.",
      image: "https://placehold.co/800x450/e2e8f0/64748b?text=Case+Study+2",
      date: "Aug 18, 2023",
      author: "Marketing Team",
      stats: {
        reach: "85K+",
        engagement: "7.2%",
        influencers: 8,
        revenue: "$18,700"
      }
    },
    {
      id: 3,
      title: "'Spice Garden' Rebrand: From Struggling to Thriving",
      excerpt: "How a strategic rebrand and influencer campaign transformed a struggling restaurant into a local hotspot.",
      image: "https://placehold.co/800x450/e2e8f0/64748b?text=Case+Study+3",
      date: "Jul 3, 2023",
      author: "Marketing Team",
      stats: {
        reach: "65K+",
        engagement: "9.1%",
        influencers: 6,
        revenue: "$15,300"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />
      
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Resources</h2>
          
          <Tabs defaultValue="blogs" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="blogs">Bloglar</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blogs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Link to={`/blogs/${blog.id}`} key={blog.id}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span>{blog.date}</span>
                            <span className="mx-2">•</span>
                            <span>{blog.readTime}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">{blog.author}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="case-studies">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {caseStudies.map((caseStudy) => (
                  <Link to={`/case-studies/${caseStudy.id}`} key={caseStudy.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <img 
                              src={caseStudy.image} 
                              alt={caseStudy.title} 
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <span>{caseStudy.date}</span>
                              </div>
                              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{caseStudy.title}</h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{caseStudy.excerpt}</p>
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                                <span className="text-sm font-medium">{caseStudy.author}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverCardTrigger>
                      <HoverCardContent side="top" className="w-80 p-0">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                          <h4 className="font-semibold mb-2">Kampanya Sonuclari</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Users size={16} className="mr-2" />
                              <div>
                                <p className="text-xs opacity-80">Reach</p>
                                <p className="font-medium">{caseStudy.stats.reach}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Heart size={16} className="mr-2" />
                              <div>
                                <p className="text-xs opacity-80">Engagement</p>
                                <p className="font-medium">{caseStudy.stats.engagement}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Eye size={16} className="mr-2" />
                              <div>
                                <p className="text-xs opacity-80">Influencers</p>
                                <p className="font-medium">{caseStudy.stats.influencers}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <DollarSign size={16} className="mr-2" />
                              <div>
                                <p className="text-xs opacity-80">Revenue</p>
                                <p className="font-medium">{caseStudy.stats.revenue}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blogs;
