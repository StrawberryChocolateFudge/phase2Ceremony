async function contribute(oldFileName, newFileName, name) {
    console.log("contribute starts")
    //@ts-ignore
    const contributionHash = await snarkjs.zKey.contribute(oldFileName, newFileName, name);
    return contributionHash;
}

function getFileFullPath(fileName) {
    return window.location.href + "files/" + fileName;
}

export async function contributeWithMemfile(fileName, name) {
    const memFile = { type: "mem" };
    const oldFileName = getFileFullPath(fileName);

    const contributionHash = await contribute(oldFileName, memFile, name);

    return { newFile: memFile, contributionHash };

}
