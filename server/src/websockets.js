const { addConnecton, removeConnection, getConnectionList, myPosition } = require("./queue");

function onConnect(io, socket) {
    const id = socket.id;
    try {
        addConnecton(id);
    } catch (err) {
        const connectionList = getConnectionList();
        const length = connectionList.length;
        io.to(id).emit(messageRouter(MessageRoutes.closeConnection, { reason: `Maximum (${length}) connections reached. Please wait!` }))
    }

    sendPositionToClients(io);


    socket.on("disconnect", (reason) => {
        removeConnection(id);
        sendPositionToClients(io);
    });
    // Add the client to the queue and broadcast an update on how many users are in the QUEQUE and what is your position
}

/*
Send the position in the queue to the socket ids
*/
function sendPositionToClients(io) {
    const connectionList = getConnectionList();
    for (let i = 0; i < connectionList.length; i++) {
        const socketId = connectionList[i];
        const pos = myPosition(socketId);
        const length = connectionList.length;
        io.to(socketId).emit(messageRouter(MessageRoutes.position, { pos, length }));

    }
}

function processinQueue() {
    // I get the first one from the queue and send a message with the file's location
    // They can start processing the file

}

const MessageRoutes = {
    position: "position",
    closeConnection: "closeConnection"
}

function messageRouter(type, msg) {
    return JSON.stringify({ type, msg });
}

module.exports = { onConnect }