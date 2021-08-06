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

    // function to add the same event listener to every element in an array. 
    Array.prototype.addEventListener = function(eventname, eventfunction) {
        for (i=0 ; i<this.length ; i++)
            this[i].addEventListener(eventname, eventfunction);
    };

    // create a function to console log every element in an array
    Array.prototype.consolelog = function() {
        for (i=0 ; i<this.length ; i++)
            console.log(this[i]);
    };

    // convert Nodelists and HTLMCollections (and any other array like objects to an array.
    function convertToArray(arrayLikeObject) {
        var newArray = createArray(arrayLikeObject.length)
        for (var i=0 ; i<newArray.length; i++)
            newArray[i] = arrayLikeObject[i];

        return newArray;
    }