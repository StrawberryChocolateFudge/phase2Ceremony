import { io } from "socket.io-client";



export function connectToSocket(onSuccess, onError, routeMessages) {

    let socket;
    try {
        socket = io({ autoConnect: false })
    } catch (err) {
        onError("Unable to connect to websocket!")
        socket.disconnect();
    }

    socket.on("connect", () => {
        onSuccess("Successfully Connected to the socket. You have been added to a queue!")
        console.log(socket.id);
    });

    socket.onAny(async (jsonString) => {
        const msg = JSON.parse(jsonString);
        await routeMessages(msg);
    })

    socket.on("disconnect", () => {
        socket.disconnect();
        onError("Connection disconnected!")
    })

    socket.open();

    return () => socket.disconnect();
}

