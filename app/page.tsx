"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import loginImage from "@/public/LoginImage.svg";

const Page = () => {
    const [username, setUsername] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("username", username);
        router.push("/chat");
    };

    return (
        <main className="flex items-center h-screen bg-secondary-95">
            {/* Imagem */}
            <section className="flex-1 flex justify-center items-center">
                <Image 
                    src={loginImage}
                    alt="Login Image" 
                    className="max-w-full h-auto rounded-lg"
                />
            </section>
            <div className="w-0.5 h-4/6 bg-secondary-90"></div>
            {/* Login */}
            <section className="flex-1 flex w-full justify-center items-center">
                <form onSubmit={handleLogin} className="flex flex-col w-full items-center p-8 rounded-lg bg-secondary-95">
                    <h1 className="text-2xl text-primary-40 font-medium mb-8">Bem-vindo ao Chat!</h1>
                    <label htmlFor="username" className="text-secondary-10 w-3/6 left-0 text-sm">Nome de usuário</label>
                    <input
                        type="text"
                        placeholder="Digite seu nome"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-3/6 p-2 mb-4 border rounded-md shadow-md bg-secondary-90 focus:outline-none"
                        required
                    />
                    <button 
                        type="submit" 
                        className="bg-primary-50 text-secondary-99 py-2 w-3/6 px-4 rounded-md border-none cursor-pointer hover:bg-primary-30"
                    >
                        Entrar
                    </button>
                </form>
            </section>
        </main>
    );
};

export default Page;
