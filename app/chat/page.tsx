"use client";

import useSignalR from "@/hooks/useSignalR";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FiSend, FiLogOut } from "react-icons/fi";

const ChatCliente = () => {
    const { messages, newMessage, setNewMessage, sendMessage, username, queueStatus } = useSignalR();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const isInQueue = queueStatus?.position != null && queueStatus.position >= 0;

    return (
        <main className="flex h-screen gap-3 p-3 bg-secondary-95 relative">
            {/* Fila de espera */}
            {isInQueue && (
                <div className="fixed inset-0 bg-secondary-10 bg-opacity-99 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg text-white text-center">
                        <button
                            onClick={handleLogout}
                            className="text-secondary-99 fixed left-3 top-3 flex items-center gap-2 py-2 px-4 rounded-lg border text-sm border-secondary-99 cursor-pointer hover:bg-warning-30 hover:text-primary-70 hover:border-primary-70"
                        >
                            <FiLogOut />
                            Sair da fila
                        </button>
                            {queueStatus?.message}
                        <div className="w-10 h-10 border-2 border-primary-80 rounded-full border-t-primary-30 animate-spin"></div>
                    </div>
                </div>
            )}
            {/* Chat */}
            <section className="flex flex-col h-full w-full">
                <div className="flex justify-between items-center w-full mb-3">
                    <h1 className="text-xl text-primary-40 font-medium">Bem-vindo, {username}</h1>
                    {isInQueue ? (
                        <></>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-primary-40 flex items-center gap-2 text-xl py-2 px-4 rounded-lg border-none cursor-pointer hover:bg-primary-30 hover:text-secondary-99"
                        >
                            Sair
                            <FiLogOut />
                        </button>
                    )}
                </div>
                <div className="flex-grow overflow-y-auto w-full flex flex-col">
                    {messages.length > 0 ? (
                        <>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 mb-2 rounded-lg ${msg.type === 'sent'
                                        ? 'bg-primary-70 self-end text-left ml-80'
                                        : 'bg-secondary-90 self-start text-left mr-80'
                                        }`}
                                >
                                    <p className="break-words text-sm text-primary-30">{msg.sender}</p>
                                    <p className="break-words">{msg.content}</p>
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
                        disabled={isInQueue}
                    />
                    <button
                        type="submit"
                        disabled={newMessage.trim() === "" || isInQueue}
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
