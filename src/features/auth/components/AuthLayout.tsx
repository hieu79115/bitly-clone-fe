import { Link2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";


interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-slate-50 via-slate-100 to-indigo-50/30 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo & Brand */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Link2 className="size-6" />
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500 text-center">{description}</p>
                </div>

                {/* Form Card Container */}
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}