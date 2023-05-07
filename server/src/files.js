
const fs = require("fs");

function getLatest(onSuccess) {
    let fileNameIdArray = [];
    fs.readdir("./files", (err, files) => {
        files.forEach(file => {
            const getId = parseFileName(file);
            fileNameIdArray.push(getId);
        })
        findLatestFile(fileNameIdArray, onSuccess);
    })
}


function findLatestFile(array, onSuccess) {
    let latestId = 0;
    let latestName = "";

    for (let i = 0; i < array.length; i++) {
        const id = array[i].id;
        if (parseInt(id) > latestId) {
            latestId = id;
            latestName = array[i].fileName;
        }
    }

    onSuccess(latestName);
}


function parseFileName(fileName) {
    const filenameRegex = /withdraw_(?<id>[\d.]+).zkey/g;
    const match = filenameRegex.exec(fileName);
    if (!match) {
        throw new Error("Invalid FileName");
    }

    return { id: match.groups.id, fileName }
}

// TODO : pad file name so it's at least 4 digits long, use zeros if it's shorter
// save the file to the files directory
function writeFile() {

}

function writeLog() {
    // Write to a log file the name,contribution hash and the fileName
}

module.exports = { getLatest };