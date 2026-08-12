import React, { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Search, TrendingUp } from 'lucide-react'
import { Input } from '../ui/input'
import { CATEGORIES, POPULAR, POSTS } from './ArticleSection'
import { useToast } from '@/hooks/use-toast';
import { getMostViewPosts, createNewsLetter, imageURL } from '../../api/ApiRoute';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function BlogRightSection({ search, setSearch, categories, showSearch = true }) {

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")

    const { data } = useQuery({
        queryKey: ['getMostViewPosts'],
        queryFn: getMostViewPosts,
    });

    const mutation = useMutation({
        mutationFn: createNewsLetter,
        onSuccess: (data) => {

            toast({
                title: "Abonelik başarılı.",
            });
            setIsLoading(false);
            setEmail('')
        },
        onError: (error) => {
            setIsLoading(false);
            console.log(error)

            toast({
                title: "Bültene Abone Ol",
                description: error?.response?.data?.errors?.email?.[0]
                    || error?.response?.data?.message || "Kayıt sırasında bir hata oluştu",
                // variant: "destructive",
            });

        }

    });


    const handleNewLetter = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        mutation.mutate({ email });



    };

    return (
        <div>
            <aside className="space-y-6 col-span-4">
                {/* Search */}
                {showSearch &&
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                        <div className="text-md font-semibold text-slate-900 font-space-grotesk">
                            Makalelerde Ara
                        </div>

                        <div className="mt-3 relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Ara..."
                                className="h-10 pl-5 rounded-lg"
                            />
                        </div>
                    </div>
                }

                {/* Popular */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <div className="text-md font-semibold text-slate-900 font-space-grotesk">
                        Popüler Yazılar
                    </div>

                    <div className="mt-3 h-[2px] w-full bg-[#000]" />

                    <div className="mt-4 space-y-4">
                        {data?.map((p, index) => (
                            <div key={index} className="space-y-1">
                                <div className="text-[11px] font-semibold text-slate-900 font-space-grotesk">
                                    {p.title}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center "><TrendingUp size={12} />
                                    <span className='mx-1'>
                                        {p.view}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscribe */}

                <div className="overflow-hidden rounded-xl border bg-white p-5">
                    <div className="text-md font-semibold ">
                        Bültene Abone Ol
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                        En güncel erişilebilirlik içgörüleri haftalık olarak gelen kutunuza gelsin.
                    </p>

                    <div className="mt-4">

                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-posta adresiniz"
                            type='email'
                            required
                            className="h-10 rounded-lg border  bg-white/5 placeholder:ml-5  placeholder:text-slate-500"
                        />

                    </div>

                    <Button type='submit' onClick={handleNewLetter} disabled={isLoading} className="mt-3 h-10 w-full rounded-lg bg-[#000] text-[12px] font-semibold text-white hover:bg-[#000]/90">
                        Abone Ol
                    </Button>
                </div>


                {/* Categories */}
                <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                    <div className="text-md font-semibold text-slate-900">
                        Kategoriler
                    </div>
                    <div className="mt-3 h-[2px] w-full bg-[#000]" />

                    <div className="mt-4 space-y-4">
                        {categories?.map((p) => (
                            <div key={p} className="space-y-1">
                                <div className="text-xs font-semibold text-black/80">
                                    {p}
                                </div>
                                {/* <div className="text-[10px] text-slate-500">{p.views}</div> */}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Try DesignA11y Plugin */}
                {/* <div className="overflow-hidden rounded-xl bg-[#c86dff] p-5">
                    <h1 className="text-md font-semibold text-white">
                        Try DesignA11y Plugin
                    </h1>
                    <p className="mt-2 text-[11px] leading-5 text-white">
                        Start creating accessible designs today with our Figma plugin.
                    </p>


                    <Button onClick={() => window.open(
                        "https://www.figma.com/@Designa11y",
                        "_blank"
                    )} className="mt-3 h-10 w-full  bg-white text-[12px] font-semibold text-primary ">
                        Daha Fazla
                    </Button>
                </div> */}
            </aside>
        </div>
    )
}

export default BlogRightSection
