import { connectToSocket } from "./src/websockets";
import { contributeWithMemfile } from "./src/contribute";

const nameInput = document.getElementById("nameInput") as HTMLInputElement;

const enterCeremony = document.getElementById("enterCeremony") as HTMLButtonElement;

const messageDisplay = document.getElementById("messageDisplay") as HTMLDivElement;

enterCeremony.onclick = async function () {
    hideMessage();
    if (nameInput.value.length <= 1) {
        showErrorMessage("You need to enter a name! At least 2 characters!")
        return;
    }

    const onSuccess = (msg) => {
        showSuccessMessage(msg)
    }

    const onError = (msg) => {
        showErrorMessage(msg);
    }


    const MessageRoutes = {
        position: "position",
        closeConnection: "closeConnection",
        startContribution: "startContribution"

    }

    let disconnectFN;

    async function routeMessages(route) {
        switch (route.type) {
            case MessageRoutes.position:
                showSuccessMessage(`You are in a queue. You are ${route.msg.pos} out of ${route.msg.length}. The ceremony will automaticly proceed when it's your turn!`)
                break;
            case MessageRoutes.closeConnection:
                disconnectFN();
                enterCeremony.disabled = false;
                nameInput.disabled = false;
                showErrorMessage(`Connection closed: ${route.msg.reason}`)
                break;
            case MessageRoutes.startContribution:
                showSuccessMessage("Starting contribution!");
                console.log("filename: ", route.msg.filename);
                const res = await contributeWithMemfile(route.msg.filename, nameInput.value).catch(err => {
                    console.log(err.message)
                    // showErrorMessage("Contribution Failed. Reload the Page and Try Again!");
                    // disconnectFN();
                });
                console.log(res);
                break;
            default:
                break;
        }
    }

    disconnectFN = connectToSocket(onSuccess, onError, routeMessages);

    enterCeremony.disabled = true;
    nameInput.disabled = true;
}


function showSuccessMessage(msg: string) {
    if (messageDisplay.classList.contains("hide")) {
        messageDisplay.classList.remove("hide");
    }
    if (!messageDisplay.classList.contains("show")) {
        messageDisplay.classList.add("show")
    }

    if (messageDisplay.classList.contains("error")) {
        messageDisplay.classList.remove("error");
    }

    if (!messageDisplay.classList.contains("success")) {
        messageDisplay.classList.add("success")
    }


    messageDisplay.innerHTML = msg;
}

function showErrorMessage(msg: string) {
    if (messageDisplay.classList.contains("hide")) {
        messageDisplay.classList.remove("hide");
    }
    if (!messageDisplay.classList.contains("show")) {
        messageDisplay.classList.add("show")
    }

    if (messageDisplay.classList.contains("success")) {
        messageDisplay.classList.remove("success");
    }

    if (!messageDisplay.classList.contains("error")) {
        messageDisplay.classList.add("error");
    }

    messageDisplay.innerHTML = msg;
}

function hideMessage() {
    if (messageDisplay.classList.contains("show")) {
        messageDisplay.classList.remove("show");
    }
    if (!messageDisplay.classList.contains("hide")) {
        messageDisplay.classList.add("hide");
    }
    if (messageDisplay.classList.contains("success")) {
        messageDisplay.classList.remove("success");
    }
    if (messageDisplay.classList.contains("error")) {
        messageDisplay.classList.remove("error");
    }
}