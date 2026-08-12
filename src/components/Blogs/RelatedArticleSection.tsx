import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { imageURL } from '../../api/ApiRoute';

function RelatedArticlesSection({ items = [] }) {
  const data =
    items.length > 0
      ? items
      : [
        {
          id: "1",
          category: "Temeller",
          title: "Web Erişilebilirliğine Başlarken",
          date: "20 Ara 2024",
          readTime: "5 dk okuma",
          href: "/blog/getting-started-with-web-accessibility",
        },
        {
          id: "2",
          category: "Standartlar",
          title: "WCAG 2.1 Rehberi: Kapsamlı Bir Bakış",
          date: "18 Ara 2024",
          readTime: "8 dk okuma",
          href: "/blog/wcag-2-1-guidelines-complete-overview",
        },
        {
          id: "3",
          category: "Tasarım",
          title: "Renk Kontrastı ve Görsel Erişilebilirlik",
          date: "15 Ara 2024",
          readTime: "6 dk okuma",
          href: "/blog/color-contrast-and-visual-accessibility",
        },
        {
          id: "4",
          category: "Geliştirme",
          title: "Ekran Okuyucu Optimizasyon Teknikleri",
          date: "12 Ara 2024",
          readTime: "7 dk okuma",
          href: "/blog/screen-reader-optimization-techniques",
        },
      ];

  const recentBlogs = JSON.parse(localStorage.getItem("recent_blogs") || "[]");

  return (
    <section className="w-full  bg-white py-10">
      <div className="mx-auto  px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black font-space-grotesk">İlgili Makaleler</h2>

          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-orange-700"
          >
            Tümünü Gör <ChevronRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!recentBlogs?.length ? (
            <p className="text-sm text-slate-500">Yakın zamanda blog yok</p>
          ) : (recentBlogs?.map((post) => (
            <Link key={post.id} to={`/blogs/${post?.slug}`} className="block">
              <Card className="h-full rounded-xl border-slate-200 shadow-none transition hover:border-slate-300">
                {/* <CardContent className="flex h-full flex-col p-5">
                  <div>
                    <Badge className="rounded-md bg-slate-700 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-700">
                      {post?.category}
                    </Badge>
                    <img src={post?.image ? `${imageURL}/${post?.image}` : "/placeholder.svg"} alt="" className="h-[100px] w-full rounded-lg object-cover" />
                  </div>

                  <h3 className="mt-28 text-md font-semibold leading-snug text-slate-900 font-space-grotesk">
                    {post?.title}
                  </h3>

                  <div className="mt-auto pt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post?.date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {post.read}
                      </span>
                    </div>
                  </div>
                </CardContent> */}

                <CardContent className="flex h-full flex-col p-5">
                  {/* Media section takes all top space */}
                  <div className="relative flex-1 overflow-hidden rounded-lg">
                    <img
                      src={post?.image ? `${imageURL}/${post.image}` : "/placeholder.svg"}
                      alt={post?.title || "Blog kapağı"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    <Badge className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm hover:bg-slate-900/80">
                      {post?.category?.title || post?.category || "Kategorisiz"}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-md font-semibold leading-snug text-slate-900 font-space-grotesk">
                    {post?.title}
                  </h3>

                  {/* Meta */}
                  <div className="mt-auto pt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={14} />
                        {post?.date
                          ? new Date(post.date).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "—"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {post?.read || "5 dk okuma"}
                      </span>
                    </div>
                  </div>
                </CardContent>

              </Card>
            </Link>
          ))
          )}
        </div>
      </div>
    </section>
  );
}

export default RelatedArticlesSection;
