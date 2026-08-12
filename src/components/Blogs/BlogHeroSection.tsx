import React from "react";
import { CalendarDays, Clock3, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageURL } from '../../api/ApiRoute';
import { useNavigate } from "react-router-dom";

export default function BlogHeroSection({ post }) {
  const navigate = useNavigate()
  return (
    <section className="w-full ">
      <div className="mx-auto w-full sm:px-4 py-4 sm:py-10">


        {/* Card */}
        <div
          className="overflow-hidden mt-20 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-start ">
          {/* Featured pill */}
          <div className="relative aspect-[16/9] flex-1 w-full overflow-hidden rounded-lg col-span-12 lg:col-span-6  ">
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center rounded-full bg-[#000] px-3 py-1 text-[10px] font-semibold tracking-wide text-white">
                ÖNE ÇIKAN
              </span>
            </div>

            <img src={post?.image ? `${imageURL}/${post?.image}` : "/placeholder.svg"}
              className="h-full w-full object-cover"

            />

          </div>


          <div className="flex-1  ">
            {/* Left visual placeholder */}
            <div className="col-span-6 hidden lg:block" />

            {/* Right content */}
            <div className="col-span-6 px-4 py-4 lg:px-10 lg:py-8">
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-[#000]">
                <Tag className="h-3.5 w-3.5" />
                <span>{post?.category?.title}</span>
              </div>

              <h3 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-slate-900 font-space-grotesk">
                {post?.title}
              </h3>

              <p className="mt-3 text-[12px] leading-[1.65] text-black/80">
                {post?.short_desc}
              </p>

              <div className="mt-4 flex items-center gap-5 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  {new Date(post?.created_at).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  {post?.read}
                </span>
              </div>

              <div className="mt-6">
                <Button onClick={() => navigate(`/blogs/${post?.slug}`)} className="h-10 rounded-md bg-[#000] px-4 text-[12px] font-semibold text-white hover:bg-[#000]/90">
                  Tam Makaleyi Oku <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle inner padding frame like screenshot */}
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/0" />
        </div>
      </div>
    </section>
  );
}
