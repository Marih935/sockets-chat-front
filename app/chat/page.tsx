"use client";

import useSignalR from "@/hooks/useSignalR";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FiSend, FiLogOut } from "react-icons/fi";

const ChatCliente = () => {
    const { messages, newMessage, setNewMessage, sendMessage, username } = useSignalR();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isMyMessage = (sender: string) => sender === username;

    const handleLogout = () => {
        localStorage.removeItem("username");
        router.push("/");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() !== "") {
            sendMessage();
            setNewMessage("");
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <main className="flex h-screen gap-3 p-3 bg-secondary-95">
            {/* Chat */}
            <section className="flex flex-col h-full w-full">
                <div className="flex justify-between items-center w-full mb-3">
                    <h1 className="text-xl text-primary-40 font-medium">Bem-vindo, {username}</h1>
                    {/* botão de sair */}
                    <button
                        onClick={handleLogout}
                        className="text-primary-40 flex items-center gap-2 text-xl py-2 px-4 rounded-lg border-none cursor-pointer hover:bg-primary-30 hover:text-secondary-99"
                    >
                        Sair
                        <FiLogOut />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto w-full flex flex-col">
                    {messages.length > 0 ? (
                        <>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 mb-2 rounded-lg ${isMyMessage(msg.sender)
                                            ? 'bg-primary-70 self-end text-left ml-80'
                                            : 'bg-secondary-90 text-left mr-80'
                                        }`}
                                >
                                    <p className="break-words">{msg.content}</p>
                                    <p className="text-xs text-right text-secondary-40">
                                        {new Date(msg.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <p>Sem mensagens ainda.</p>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="flex items-center w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="border border-neutral-50 p-2 mr-2 rounded-lg w-full focus:outline-none"
                        placeholder="Digite sua mensagem"
                    />
                    <button
                        type="submit"
                        disabled={newMessage.trim() === ""}
                        className={`text-lg h-full py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center ${newMessage.trim() === "" ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'bg-primary-70 text-secondary-10 hover:bg-primary-30 hover:text-secondary-90'}`}
                    >
                        <FiSend />
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ChatCliente;
