import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

type Message = {
    sender: string;
    content: string;
    sentTime: Date;
};

const useSignalR = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [username, setUsername] = useState("");

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

        connect
            .start()
            .then(() => {
                console.log("Conectado ao SignalR Hub");
                setConnection(connect);

                connect.on("ReceiveMessage", (sender, content, sentTime) => {
                    console.log("Mensagem recebida:", sender, content, sentTime);
                    setMessages(prevMessages => [...prevMessages, { sender, content, sentTime }]);
                });
            })
            .catch((err) => {
                console.error("Erro ao conectar com SignalR Hub:", err);
            });

        return () => {
            connect.stop().then(() => console.log("Conexão encerrada"));
        };
    }, []);

    const sendMessage = async () => {
        if (connection && newMessage.trim()) {
            try {
                const messageToSend = { sender: username, content: newMessage, sentTime: new Date() };
                console.log("Enviando mensagem:", messageToSend);
                await connection.send("PostMessage", username, newMessage);
                setMessages(prevMessages => [...prevMessages, messageToSend]);
                setNewMessage("");
            } catch (err) {
                console.error("Falha ao enviar mensagem:", err);
            }
        }
    };

    return { messages, newMessage, setNewMessage, sendMessage, username };
};

export default useSignalR;
