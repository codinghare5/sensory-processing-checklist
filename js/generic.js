// Generic Functions
////////////////////////////////////////////////////////////////////////////////////////

// create array script copied from internet
// usage:
//      createArray() creates empty 1D array
//      createArray(2) creates 1D array of length 2
//      createArray(3, 2) creates 2D array, first dimension length 3, second dimension length 2
//      createArray(3,3,3,3) creates a 4D array where all dimensions have length 3
function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


// function to add the same event listener to every element in an array. 
Array.prototype.addEventListener = function(eventname, eventfunction) {
    for (let i=0 ; i<this.length ; i++)
        this[i].addEventListener(eventname, eventfunction);
};


// create a function to console log every element in an array
Array.prototype.consolelog = function() {
    for (let i=0 ; i<this.length ; i++)
        console.log(this[i]);
};


// convert Nodelists and HTLMCollections (and any other array like objects to an array.
function convertToArray(arrayLikeObject) {
    let newArray = createArray(arrayLikeObject.length)
    for (let i=0 ; i<newArray.length; i++)
        newArray[i] = arrayLikeObject[i];

    return newArray;
}
