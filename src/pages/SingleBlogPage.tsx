import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Tag,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import RelatedArticlesSection from "@/components/Blogs/RelatedArticleSection";
import BlogRightSection from "@/components/Blogs/BlogRightSection";
import { getPostById, imageURL } from '../api/ApiRoute';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Header from "@/components/Header";
import Footer from "@/components/Footer";

// import ShareButton from "@/components/ShareButton";


const DUMMY_BLOG = {
  slug: "future-of-web-accessibility",
  title: "The Future of Web Accessibility: Trends and Innovations for 2025",
  category: "TRENDS",
  published_at: "December 26, 2024",
  reading_time: "12 min read",
  html: `
    <p>
      As we approach <strong>2025</strong>, the landscape of web accessibility is
      evolving at an unprecedented pace.
    </p>

    <h2>AI-Powered Accessibility Tools</h2>
    <p>
      Artificial Intelligence is revolutionizing accessibility testing and
      remediation.
    </p>

    <blockquote>
      Accessibility is not just a feature. It is a responsibility.
    </blockquote>

    <h2>Inclusive Design Thinking</h2>
    <p>
      Inclusive design shifts accessibility from an afterthought to a core
      principle.
    </p>
  `,
};

function SingleBlogPage() {
  //const blog = DUMMY_BLOG;

  const { slug } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["getPostById", slug],
    queryFn: () => getPostById(slug),
    enabled: !!slug, // jab id available ho tab hi call ho
  });
  const sanitizedHtml = DOMPurify.sanitize(blog?.post?.desc);
  // const sanitizedHtml = DOMPurify.sanitize(blog?.post?.desc, {
  //   ALLOWED_ATTR: ['class', 'style', 'target', 'href'], // Ye attributes allow karein
  //   ALLOWED_TAGS: ['h1', 'h2', 'p', 'span', 'strong', 'em', 'u', 'a', 'br']
  // });
  //  console.log(sanitizedHtml)
  useEffect(() => {

    const RECENT_KEY = "recent_blogs";
    const MAX_RECENT = 4;

    if (!blog?.post?.id) return;

    // sirf necessary fields store karo
    const payload = {
      id: blog?.post?.id,
      title: blog?.post?.title,
      category: blog?.post?.category?.title,
      read: blog?.post?.read,
      slug: blog?.post?.slug,
      image: blog?.post?.image,      // optional
      date: blog?.post?.created_at,  // optional
    };

    const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");

    // unique by id, newest first
    const next = [payload, ...prev.filter((b) => b?.id !== payload.id)].slice(
      0,
      MAX_RECENT
    );

    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }, [blog]);


  return (
    <>

      <Header color={"text-black"} />
      <div className="mx-auto py-3">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6 bg-[#F9FAFB] px-4 py-3 ">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Ana sayfa</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blogs">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{blog?.post?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="container mx-auto grid grid-cols-12 gap-6 px-2 sm:px-8">
          {/* Main */}
          <div className="col-span-12 lg:col-span-8 px-4">
            <Link
              to="/blogs"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Bloga Dön
            </Link>

            {/* Category */}
            <div className="mt-6">
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-[#000]">
                <Tag size={14} />
                {blog?.post?.category?.title}
              </span>
            </div>


            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl font-space-grotesk">
              {blog?.post?.title}
            </h1>
            <div className="block rounded-lg col-span-4 relative mt-2">
              <img src={blog?.post?.image ? `${imageURL}/${blog.post?.image}` : "/placeholder.svg"} alt="" className="h-[500px] w-full rounded-lg object-cover" />
            </div>

            <h6 className="mt-4 text-xl  leading-tigh font-space-grotesk">
              {blog?.post?.short_desc}
            </h6>
            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 text-sm text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(blog?.post?.created_at).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {blog?.post?.read}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* <button aria-label="Share" >
                  <Share2 size={18} />
                </button> */}
                {/* <ShareButton post={blog?.post} /> */}
                <button aria-label="Save">
                  <Bookmark size={18} />
                </button>
              </div>
            </div>

            {/* Blog HTML */}


            <article
              className="prose prose-slate max-w-none mt-6 ql-editor"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <BlogRightSection categories={blog?.categories} showSearch={false} />
          </div>
        </div>

        <div className="container my-6">
          <RelatedArticlesSection />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SingleBlogPage;



// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Tag } from "lucide-react";

// // shadcn/ui breadcrumb
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import RelatedArticlesSection from "@/components/Blogs/RelatedArticleSection";
// import BlogBodySections from "@/components/Blogs/BlogBodySection";
// import BlogRightSection from "@/components/Blogs/BlogRightSection";

// function SingleBlogPage() {
//     return (
//         <div className="mx-auto   py-3">
//             {/* Shadcn Breadcrumb */}
//             <Breadcrumb className=" mb-6 bg-[#F9FAFB] px-4  py-3">
//                 <BreadcrumbList >
//                     <BreadcrumbItem>
//                         <BreadcrumbLink asChild>
//                             <Link to="/">Ana sayfa</Link>
//                         </BreadcrumbLink>
//                     </BreadcrumbItem>

//                     <BreadcrumbSeparator />

//                     <BreadcrumbItem>
//                         <BreadcrumbLink asChild>
//                             <Link to="/blogs">Blog</Link>
//                         </BreadcrumbLink>
//                     </BreadcrumbItem>

//                     <BreadcrumbSeparator />

//                     <BreadcrumbItem>
//                         <BreadcrumbPage>The Future of Web Accessibility</BreadcrumbPage>
//                     </BreadcrumbItem>
//                 </BreadcrumbList>
//             </Breadcrumb>

//             <div className="container mx-auto w-full grid grid-cols-12 gap-6 px-2 sm:px-8 ">
//                 <div className="col-span-12 lg:col-span-8 px-4">
//                     {/* Back link */}
//                     <Link
//                         to="/blogs"
//                         className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
//                     >
//                         <ArrowLeft size={16} />
//                         Back to Blog
//                     </Link>

//                     {/* Category */}
//                     <div className="mt-6">
//                         <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs  text-orange-600">
//                             <Tag size={14} />
//                             TRENDS
//                         </span>
//                     </div>

//                     {/* Title */}
//                     <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl font-space-grotesk">
//                         The Future of Web Accessibility:
//                         <br />
//                         Trends and Innovations for 2025
//                     </h1>

//                     {/* Meta + Actions */}
//                     <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 text-sm text-slate-500">
//                         <div className="flex items-center gap-4">
//                             <div className="flex items-center gap-1">
//                                 <Calendar size={16} />
//                                 December 26, 2024
//                             </div>

//                             <div className="flex items-center gap-1">
//                                 <Clock size={16} />
//                                 12 min read
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4 text-slate-600">
//                             <button className="hover:text-slate-900" aria-label="Share">
//                                 <Share2 size={18} />
//                             </button>
//                             <button className="hover:text-slate-900" aria-label="Save">
//                                 <Bookmark size={18} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Content placeholder */}
//                     <div className="my-5 prose prose-slate max-w-none h-[300px] bg-slate-200">
//                         <img src="" alt="" />
//                     </div>

//                     <BlogBodySections />

//                 </div>
//                 <div className="col-span-12 lg:col-span-4 ">
//                     <BlogRightSection />
//                 </div>
//             </div>


//             <div className="container my-4 p-0 ">
//                 <RelatedArticlesSection />
//             </div>

//         </div>
//     );
// }

// export default SingleBlogPage;
