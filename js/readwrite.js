// Saving the answers
function saveToFile(){
    answers = JSON.stringify(createJsonAnswers(categoryArray, "save"));
    console.log(answers);
    
    // download answers as a json file. The below is convoluted but 
    // there does not seem to be a simpler way.
    const a = document.createElement("a"); // create an empty link
    file = new Blob([answers],{type: "application/json"});
    //console.log(file);
    a.href = URL.createObjectURL(file);
    a.download = "answers-spcr.json"; //download to answers.json
    a.click();
}

// Loading the answers
async function loadFile() {
    [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    return contents;
};

async function loadFromFile() {
    let fileHandle;
    [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    var answers = await file.text();
    
    if (answers) {
        answers = JSON.parse(answers);
        //console.log(answers);
        console.log("==================================================================")
        console.log("type: " + answers.type + " version: "+ answers.version)
        if (answers && answers.type && answers.type == "SPCR" && answers.version == "1") {
            console.log(answers);
            setQuestionValues(answers);
        }
        else alert("File is not the right kind of file.");
    }
}
