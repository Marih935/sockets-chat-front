import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

type Message = {
    sender: string;
    content: string;
    type: 'sent' | 'received';
};

const useSignalR = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [username, setUsername] = useState("");
    const [queueStatus, setQueueStatus] = useState<{ message: string; position: number } | null>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const connect = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5151/chat")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connect.start()
            .then(() => {
                console.log("Conectado ao SignalR Hub");
                setConnection(connect);

                connect.on("ReceiveMessage", (sender, content, sentTime) => {
                    console.log("Mensagem recebida:", sender, content, sentTime);
                    if (sender !== username) {
                        setMessages(prevMessages => {
                            const messageExists = prevMessages.some(
                                msg => msg.sender === sender && msg.content === content
                            );
                            if (!messageExists) {
                                return [...prevMessages, { sender, content, sentTime, type: 'received' }];
                            }
                            return prevMessages;
                        });
                    }
                });

                connect.on("QueueUpdate", (message: string, position: number) => {
                    console.log("Atualização da Fila:", message, position);
                    setQueueStatus({ message, position: position + 1 });
                });

            })
            .catch((err) => {
                console.error("Erro ao conectar com SignalR Hub:", err);
            });

        return () => {
            connect.stop().then(() => console.log("Conexão encerrada"));
        };
    }, [username]);

    const sendMessage = async () => {
        if (connection && newMessage.trim()) {
            try {
                const messageToSend: Message = {
                    sender: username,
                    content: newMessage,
                    type: 'sent'
                };
                console.log("Enviando mensagem:", messageToSend);
                await connection.send("SendMessage", username, newMessage);
                setMessages(prevMessages => {
                    const messageExists = prevMessages.some(
                        msg => msg.sender === username && msg.content === newMessage
                    );
                    if (!messageExists) {
                        return [...prevMessages, messageToSend];
                    }
                    return prevMessages;
                });
                setNewMessage("");
            } catch (err) {
                console.error("Falha ao enviar mensagem:", err);
            }
        }
    };

    return { messages, newMessage, setNewMessage, sendMessage, username, queueStatus };
};

export default useSignalR;
