import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import React, { useId, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "../api/ApiRoute";
import { useMutation } from "@tanstack/react-query";

export default function ResetPassowrdPage() {
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const passwordId = useId();
    const confirmId = useId();

    const strength = useMemo(() => getPasswordStrength(password), [password]);
    const passwordsMatch = confirm.length === 0 ? true : password === confirm;

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast({
                title: "Şifre başarıyla yenilendi",
                description: "Şifreniz güncellendi. Giriş yapabilirsiniz.",
            });
            navigate("/signin");
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
            toast({
                title: "İşlem başarısız",
                description: error.response.data.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        mutation.mutate({ password, confirmPassword: confirm, token, email });
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate("/signin");
    };

    return (
        <main
            id="main-content"
            className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,210,255,0.7),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(245,223,255,0.8),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#fffafc_100%)]"
        >
            <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-6 sm:px-6 sm:py-10">
                <div className="w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_24px_60px_-32px_rgba(76,29,149,0.35)] backdrop-blur">
                    <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Geri dön
                        </button>
                    </div>

                    <div className="px-5 py-6 sm:px-6 sm:py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 font-space-grotesk">
                                Şifrenizi yenileyin
                            </h1>
                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Güçlü bir şifre için harf, rakam ve özel karakter kullanın.
                                Lütfen aşağıya yeni şifrenizi girin.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Field label="Yeni Şifre" htmlFor={passwordId}>
                                <div className="relative">
                                    <Input
                                        id={passwordId}
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-xl border-slate-200 pr-11"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                                        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {password.length > 0 && (
                                    <div className="mt-3">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-fuchsia-300 transition-all"
                                                style={{ width: `${strength.percent}%` }}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Field>

                            <Field label="Yeni Şifre Tekrar" htmlFor={confirmId}>
                                <div className="relative">
                                    <Input
                                        id={confirmId}
                                        name="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className={`h-12 rounded-xl border-slate-200 pr-11 ${passwordsMatch ? "" : "border-red-400 focus:border-red-400 focus:ring-red-200"}`}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                                        aria-label={showConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
                                    >
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {!passwordsMatch && (
                                    <p className="mt-2 text-sm text-red-500">Şifreler eşleşmiyor.</p>
                                )}
                            </Field>

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                                disabled={isLoading || password.length < 8 || confirm.length < 8 || password !== confirm}
                            >
                                Şifreyi Yenile
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <Button
                            variant="outline"
                            className="mt-4 h-12 w-full rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                            onClick={() => navigate("/signin")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Giriş ekranına dön
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Field({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
        </div>
    );
}

function getPasswordStrength(value: string) {
    if (!value) return { score: 0, percent: 0 };

    let score = 0;

    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    const percent = Math.min(100, Math.round((score / 6) * 100));
    return { score, percent };
}
