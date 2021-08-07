 // Generic Functions
////////////////////////////////////////////////////////////////////////////////////////
// create array script copied from internet
// usage:
//      createArray() creates empty 1D array
//      createArray(2) creates 1D array of length 2
//      createArray(3, 2) creates 2D array, first dimension length 3, second dimension length 2
//      createArray(3,3,3,3) creates a 4D array where all dimensions have length 3
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// function to fetch a resourse on the internet.
//  filename should be the complete path. 
//      Can be a URL for a file or can be relative to the webpage.
async function fetchJson(filename){
    console.log('fetching ' + filename);
    const response = await fetch(filename);
    const result = await response.json();
    console.log('returning');
    
    return result;
}

// create a function to console log every element in an array
Array.prototype.consolelog = function() {
    this.forEach(item => console.log(item));
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