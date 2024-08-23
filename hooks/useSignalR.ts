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
            .configureLogging(signalR.LogLevel.Information)
            .build();


        // Receber mensagens do SignalR
                connect.on("ReceiveMessage", (response) => {
                    const { userName, message } = response;
                    setMessages(prevMessages => [...prevMessages, { sender: userName, content: message, type: 'received' }]);
                });

                // Atualizações da fila de espera
                connect.on("QueueUpdate", (response) => {
                    const { message, queuePosition, exitQueue, queueSize, isConnected } = response;
                    if(queuePosition == 0){
                        if(queuePosition == 0 && queueSize == 0 || isConnected){
                            setQueueStatus(null);
                            setMessages(prevMessages => [...prevMessages, { sender: 'Sistema', content: "Você está conectado.", type: 'received' }]);
                        }else{
                            setQueueStatus({ message: "Você é o primeiro da fila. Aguarde... ", position: queuePosition });
                        }
                    }else if (queuePosition > 0) {
                        setQueueStatus({ message: message + " Posição na Fila: " + queuePosition, position: queuePosition });
                    }else if(exitQueue){
                        setQueueStatus({message: message + " Posição na Fila: " + queuePosition, position: queuePosition});
                    }
                });

                // Notificação de conexão
                connect.on("connected", (response) => {
                    const { message } = response;
                    setMessages(prevMessages => [...prevMessages, { sender: 'Sistema', content: message, type: 'received' }]);
                });

        connect.start()
            .then(() => {
                console.log("Conectado ao SignalR Hub");
                setConnection(connect);
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
                await connection.invoke("SendMessage", username, newMessage);
                setMessages(prevMessages => [...prevMessages, messageToSend]);
                setNewMessage("");
            } catch (err) {
                console.error("Falha ao enviar mensagem:", err);
            }
        }
    };

    return { messages, newMessage, setNewMessage, sendMessage, username, queueStatus };
};

export default useSignalR;
