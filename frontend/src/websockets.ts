import { io } from "socket.io-client";



export function connectToSocket(onSuccess, onError, routeMessages) {

    let socket;
    try {
        socket = io({ autoConnect: false })
    } catch (err) {
        onError("Unable to connect to websocket!")
        socket.disconnect();
    }
    //TODO: Unable to connect error

    socket.on("connect", () => {
        onSuccess("Successfully Connected to the socket. You have been added to a queue!")
        console.log(socket.id);
    });

    socket.onAny((jsonString) => {
        const msg = JSON.parse(jsonString);
        routeMessages(msg);
    })

    socket.on("disconnect", () => {
        socket.disconnect();
    })

    socket.open();

    return () => socket.disconnect();
}

