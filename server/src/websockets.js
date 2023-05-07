const { getLatest } = require("./files");
const { addConnecton, removeConnection, getConnectionList, myPosition, getFirst, getProcessingCurrently, setProcessingCurrently } = require("./queue");

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
    processinQueue(io);

    socket.on("disconnect", (reason) => {
        removeConnection(id);
        sendPositionToClients(io);
        processinQueue(io);
    });
    // Add the client to the queue and broadcast an update on how many users are in the QUEQUE and what is your position
}

/*
Send the position in the queue to the socket ids
*/
function sendPositionToClients(io) {
    const connectionList = getConnectionList();
    const currentlyProcessing = getProcessingCurrently();
    for (let i = 0; i < connectionList.length; i++) {
        const socketId = connectionList[i];

        if (currentlyProcessing !== socketId) {
            const pos = myPosition(socketId);
            const length = connectionList.length;
            io.to(socketId).emit(messageRouter(MessageRoutes.position, { pos, length }));
        }
    }
}

function processinQueue(io) {
    const firstInQueue = getFirst();

    const currentlyProcessing = getProcessingCurrently();

    // if the current connection is processing the contribution already do nothing!
    if (firstInQueue === currentlyProcessing) {
        return;
    }

    setProcessingCurrently(firstInQueue);
    getLatest((filename) => io.to(firstInQueue).emit(messageRouter(MessageRoutes.startContribution, { filename })));
}

const MessageRoutes = {
    position: "position",
    closeConnection: "closeConnection",
    startContribution: "startContribution"
}

function messageRouter(type, msg) {
    return JSON.stringify({ type, msg });
}

module.exports = { onConnect }