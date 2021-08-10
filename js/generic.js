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

// Random number rnd(num)
const rnd = num => Math.floor(Math.random() * num);

// Random count pool of 59 answers (was true, true now etc)
class RandomAnswers{
    constructor(){
        this.random = [];
        for(let i = 0; i < data2.labels.length; i++){
            this.random[i] = [0];
            for(let j = 0; j < 59; j++){
                let ans = 4;
                while(ans == 4) ans = rnd(6);
                this.random[i][ans] >= 0 ? ++this.random[i][ans] : this.random[i][ans] = 0;
            }
        }
    }
}

// Random pool of normalised vectors (0 - 1) for senses -> categories
class RandomCategoryAnswers{
    constructor(){
        this.random = [];
        for(let s=0; s < 7 ; s++){
            this.random[s] = [];
            for(let i = 0; i < 21; i++){
                this.random[s][i] = 0;
                for(let j = 0; j < 3; j++){
                    let ans = 4;
                    while(ans == 4) ans = rnd(6);
                    this.random[s][i] += ans;
                }
                this.random[s][i] = (this.random[s][i]/15).toFixed(3);
            }
        }
    }
}
