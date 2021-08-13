// function to fetch a resourse on the internet.
//  filename should be the complete path. 
//      Can be a URL for a file or can be relative to the webpage.
async function fetchJson(filename){
    const response = await fetch(filename);
    const result = await response.json();
    
    return result;
}

// Generic Read and Write JSON functionality
const options = {
    types: [
        {
            description: 'JSON Files',
            accept: {
            'application/json': ['.json'],
            },
        },
    ],
};

let fileHandle;
async function readJson() { 
    [fileHandle] = await window.showOpenFilePicker(options);
    const file = await fileHandle.getFile();
    const contents = await file.text(); 
    
    return JSON.parse(contents);
}

async function saveJson(jsonStruct) {
    try {
        let savehandle = await window.showSaveFilePicker(options);;
        const writable = await savehandle.createWritable();
        console.log(writable);
        await writable.write(JSON.stringify(jsonStruct, null, 3));
        await writable.close();
    }
    catch(e) {
        console.log(e);
    };
}

// Loading the answers
async function loadFile() {
    [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    return contents;
};
