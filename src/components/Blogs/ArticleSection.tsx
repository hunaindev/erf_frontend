import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlogRightSection from "./BlogRightSection";
import { useNavigate } from "react-router-dom";
import { getMostViewPosts, getPostById, getPosts, getCategory, imageURL } from '../../api/ApiRoute';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BlogHeroSection from "./BlogHeroSection";

export const CATEGORIES = [
  "Tümü",
  "Temeller",
  "Tasarım",
  "Geliştirme",
  "Standartlar",
  "Mobil",
  "Test",
  "İnovasyon",
  "Trendler",
];

export const POSTS = [
  {
    id: 1,
    category: "Temeller",
    title: "Web Erişilebilirliğine Başlarken",
    excerpt:
      "Web erişilebilirliğinin temellerini ve kapsayıcı dijital deneyimler oluşturmak için neden önemli olduğunu öğrenin.",
    date: "20 Ara 2024",
    read: "5 dk okuma",
  },
  {
    id: 2,
    category: "Standartlar",
    title: "WCAG 2.1 Rehberi: Kapsamlı Bir Bakış",
    excerpt:
      "Projelerinizde WCAG 2.1 erişilebilirlik yönergelerini anlamak ve uygulamak için kapsamlı bir rehber.",
    date: "18 Ara 2024",
    read: "8 dk okuma",
  },
  {
    id: 3,
    category: "Tasarım",
    title: "Renk Kontrastı ve Görsel Erişilebilirlik",
    excerpt:
      "Erişilebilir renk kombinasyonları seçme ve doğru kontrast oranlarını sağlama konusunda ustalaşın.",
    date: "15 Ara 2024",
    read: "6 dk okuma",
  },
  {
    id: 4,
    category: "Geliştirme",
    title: "Ekran Okuyucu Optimizasyon Teknikleri",
    excerpt:
      "Daha iyi anlamsal yapı ve etiketleme ile ekran okuyucu kullanılabilirliğini artırmak için pratik teknikler.",
    date: "12 Ara 2024",
    read: "7 dk okuma",
  },
];

export const POPULAR = [
  { title: "Kapsamlı Erişilebilirlik Kontrol Listesi", views: "45.2K görüntülenme" },
  { title: "Kaçınılması Gereken Yaygın Erişilebilirlik Hataları", views: "38.7K görüntülenme" },
  { title: "ARIA Nitelikleri Basitçe Açıklandı", views: "32.1K görüntülenme" },
  { title: "Ekran Okuyucular için Tasarım", views: "28.5K görüntülenme" },
];

function Pill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-7 rounded-full px-3 text-[11px] font-medium",
        "border border-slate-200 transition-colors",
        active
          ? "bg-[#000] text-white border-[#000]"
          : "bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CategoryBadge({ children }) {
  return (
    <span className="inline-flex h-5 items-center rounded-[4px] bg-slate-700 px-2 text-[10px] font-medium text-white">
      {children}
    </span>
  );
}

function ArticleCard({ post }) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="grid grid-cols-12 h-full ">

        {/* <div className="flex    h-full "> */}
        {/* Left reserved image space */}
        <div className="block rounded-lg col-span-4 relative">
          <div className="absolute top-2 left-2">
            <CategoryBadge>{post.category.title}</CategoryBadge>
          </div>

          {/* <div className="h-full w-full rounded-lg bg-slate-50 " /> */}
          {/* agar image ho to: */}
          <img src={post?.image ? `${imageURL}/${post.image}` : "/placeholder.svg"} alt="" className="h-[150px] w-full rounded-lg object-cover" />

        </div>

        {/* Right content */}
        <div className="flex-1  sm:py-5 col-span-8  sm:px-6 px-2">

          <h3 className="text-md sm:text-lg font-semibold text-black font-space-grotesk cursor-pointer" onClick={() => navigate(`/blogs/${post.slug}`)} >{post.title}</h3>
          <p className="mt-1 text-xs sm:text-[12px]  text-black/80">{post.short_desc}</p>

          <div className="flex items-center justify-between ">

            <div className="mt-3 flex items-center gap-4 text-[8px] sm:text-[11px] text-slate-500">


              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                {new Date(post.created_at).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                {post.read}
              </span>
            </div>
            {/* Right action */}
            <button
              onClick={() => navigate(`/blogs/${post.slug}`)}
              className="self-center inline-flex items-center gap-2 text-[8px] sm:text-[11px] font-medium text-[#000]"
            >
              Oku <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


export default function LatestArticlesSection() {
  const [active, setActive] = useState("Tümü");
  const [search, setSearch] = useState("");



  const { data, isLoading } = useQuery({
    queryKey: ['getPosts'],
    queryFn: getPosts,
  });


  const categories = [
    "Tümü",
    ...Array.from(
      new Map(
        data
          ?.filter(item => item?.post_category_id && item?.category?.title)
          ?.map(item => [item.post_category_id, item.category.title])
      ).values()
    ),
  ];

  const STEP = 5;
  const [visible, setVisible] = useState(STEP);

  useEffect(() => {
    // jab category/search change ho to again first 5
    setVisible(STEP);
  }, [active, search]);

  const filtered = useMemo(() => {
    const list = Array.isArray(data) ? data : [];

    const byCat =
      active === "Tümü"
        ? list
        : list.filter((p) => p?.category?.title === active);

    const s = search.trim().toLowerCase();
    if (!s) return byCat;

    return byCat.filter((p) => {
      const title = (p?.title || "").toLowerCase();
      const excerpt = (p?.excerpt || "").toLowerCase();
      return title.includes(s) || excerpt.includes(s);
    });
  }, [data, active, search]);

  const visibleItems = filtered?.slice(0, visible);
  const canLoadMore = visible < filtered?.length;



  return (
    <> <BlogHeroSection post={data?.[0]} />
      <section className="w-full ">
        <div className="mx-auto w-full sm:px-4 pb-14">
          <div className="grid gap-6 lg:grid-cols-12 ">
            {/* <div className="grid gap-10 lg:grid-cols-[1fr_280px] "> */}

            {/* LEFT */}
            <div className="col-span-12 lg:col-span-8">
              <h2 className="text-lg font-semibold text-slate-900">
                En Son Makaleler
              </h2>

              {/* pills */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {categories?.map((c, index) => (
                  <Pill key={index} active={active === c} onClick={() => setActive(c)}>
                    {c}
                  </Pill>
                ))}
              </div>

              {/* orange divider */}
              <div className="mt-5 h-[2px] w-full bg-[#000]" />

              {/* list */}
              <div className="mt-5 space-y-4 ">
                {visibleItems?.map((p) => (
                  <ArticleCard key={p.id} post={p} />
                ))}

                <div className="w-full text-center">

                  {canLoadMore && (
                    <Button onClick={() => setVisible((v) => v + STEP)} className="border-2 border-black text-black my-4 mx-auto " variant="outline" >
                      Daha Fazla Makale Yükle
                    </Button>

                  )}
                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6 col-span-12 lg:col-span-4">
              <BlogRightSection search={search} setSearch={setSearch} categories={categories} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
