"use client";

import React, { useMemo, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function VerifyEmailPage() {
    const { id } = useParams();
    const router = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = useMemo(() => id || "", [id]);
    //   const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

    async function resend() {
        try {
            setLoading(true);

            // Call your resend endpoint
            // await fetch("/api/auth/resend-verification", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ email }),
            // });

            alert("Doğrulama e-postası tekrar gönderildi (demo).");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main id="main-content" className="min-h-screen w-full bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900 font-space-grotesk text-center">
                    E-postanızı doğrulayın
                </h1>


                <p className="mt-2 text-sm text-slate-500 text-center">
                    Doğrulama bağlantısını{" "}
                    <span className="font-medium text-slate-700">{email || "e-posta adresinize "} </span>
                    gönderdik. Gelen kutunuzu açın ve hesabınızı etkinleştirmek için bağlantıya tıklayın.
                </p>


                <div className="mt-6 space-y-3">
                    <Button className="w-full" onClick={() => router("/signin")}>
                        Giriş sayfasına git
                    </Button>




                    {/* <Button
                        variant="outline"
                        className="w-full"
                        onClick={resend}
                        disabled={loading || !email}
                    >
                        {loading ? "Tekrar Gönderi
liyor..." : "Doğrulama e-postasını tekrar gönder"}
                    </Button> */}

                    {/* <button
                        type="button"
                        className="w-full text-center text-sm text-[#FF6604] hover:underline hover:underline-offset-4"
                        onClick={() => router("/signup")}
                    >
                        E-posta adresini Değiştir
                    </button> */}
                </div>
            </div>
        </main>
    );
}
