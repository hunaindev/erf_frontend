import LatestArticlesSection from '@/components/Blogs/ArticleSection'
import BlogHeroSection from '@/components/Blogs/BlogHeroSection'
import { TrendingUp } from 'lucide-react'
import React from 'react'

import Header from "@/components/Header";
import Footer from '@/components/Footer';
// import FooterSection from '@/components/index/FooterSection';

function BlogPage() {
    return (
        <>

            <div className='bg-[#F9FAFB]'>
                {/* <Header color={"text-black"} /> */}
                <Header />

                {/* <div className="mb-6 ">
                    <div className="w-full  rounded-[2px] bg-[#FF6604] text-[10px] font-medium    flex items-center justify-center gap-2 leading-[14px] text-white">

                        <div>
                            <TrendingUp size={20} />
                        </div>
                        <div className="flex  items-center justify-center gap-2">

                            <span className='text-[14px]'>
                                BREAKING: New WCAG 3.0 Draft Released -
                            </span>
                            <a href="#" className="underline underline-offset-2 opacity-95 text-[14px]">
                                Devamini Oku
                            </a>
                        </div>
                    </div>
                </div> */}

                <div className="container">

                    <LatestArticlesSection />
                </div>

            </div>
            <Footer />
            {/* <FooterSection /> */}
        </>
    )
}

export default BlogPage
