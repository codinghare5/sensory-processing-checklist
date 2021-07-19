// Functions 
///////////////////////////////////////////////////////////////////////////////////////

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


// Functions that manipulate html elements in some way
/////////////////////////////////////////////////////////////////////

function setAccordionBodiesData(newData){
    for (let i=0; i<accordionBodies.length; i++){
        theBody = accordionBodies[i];
        theBody.replaceChild(newData.questions[i],theBody.children[0]); // newnode THEN oldnode
    }
}


function setCategoryData(newIndex){
    // set category header and description
    const newItem = categoryArray[+newIndex];
    categoryTitle.innerText = newItem.name;
    categoryButton.innerText =  'About ' + newItem.name;
    categoryBody.innerText = newItem.description;

    progressGrid[+currentIndex].highlight("LightGrey");
    progressGrid[+newIndex].highlight("Black");
    // inject data into accordion bodies
    setAccordionBodiesData(newItem);
}


function setNavigationButtons(currentIndex){
    if(+currentIndex == (categoryArray.length -1)){
        nextButton.innerText = 'Show results';
        nextButton.setAttribute('nextevent', 'show');
    }
    else {
        if(nextButton.innerText === 'Show results') {
            nextButton.innerText = 'Next';
            nextButton.setAttribute('nextevent', 'next');
        }
    }

    prevButton.style.color = +currentIndex == 0 ? "LightGray" : "Black";
}


function changeCurrentDisplay(newIndex){
    setCategoryData(newIndex);
    setNavigationButtons(newIndex);
    currentIndex = +newIndex;
}


// setQuestionValues(answers) answers is a JSON structure.
// fills in appropriate values in categoryArray
// colours in the progress grid appropriately
function setQuestionValues(answers){
    for (let i=0; i<progressGrid.length; i++) progressGrid[i].clear();

    questionStatus = answers.questionStatus;
    for (let i=0; i<questionStatus.length; i++){
        item = questionStatus[i];
        catindex = item.categoryindex;
        categoryArray[+catindex].setValues(item.senseindex, item.values);
    }

    // change the display if necessary
    newIndex = +answers.currentIndex;
    if (currentIndex != newIndex) 
        changeCurrentDisplay(newIndex);
}


// getQuestionValues(node, "max"|"array")
//  Gets the fieldsets from node (accordion body or collapse)
//  Then iterates through the fieldsets to create an array of values
//      if "max" set then returns the max value of the array of values
//      if "array" set (or neither set) then return the array of values
// returns 0 in both cases if all questions values are 0
function getQuestionValues(node, returnType){
    var questions = node.getElementsByTagName("fieldset");

    let values = [];
    let sum = 0;
    let max = 0;
    for (let k=0 ; k<questions.length ; k++){
        let val = questions[k].getAttribute("value");
        values[k] = +val;
        sum += +val;
        if (+max < +val)
            max = val;
    }

    return sum == 0 ? 0 : returnType == "max" ? max : values;
}


// Event function to control behaviour of checkbox buttons for the questions
function addEventListenerToQuestionButtons() {
    const questionButtons = document.querySelectorAll(".form-check-input");
    for (let i=0 ; i<questionButtons.length ; i++) {
        questionButtons[i].addEventListener('change', function(event) {
            const formwrapper = event.path.find(element => element.tagName == 'FIELDSET');
            let currentvalue = formwrapper.getAttribute("value");
            const thisvalue = this.getAttribute("value");
            const buttons = formwrapper.getElementsByTagName("input");
            
            let option = 0;
            this.checked 
                ? +thisvalue <= 1
                    ? option = +thisvalue 
                    : +thisvalue == 2 && +currentvalue == 3 || +thisvalue == 3 && +currentvalue == 2 
                        ? option = 5 
                        : option = +thisvalue
                : +thisvalue == 2 && +currentvalue == 5 || +thisvalue == 3 && +currentvalue == 5
                    ? option = 5 - +thisvalue 
                    : option = 0;
            checkAnswerBoxesByOption(buttons, option);
            formwrapper.setAttribute("value", option);

        }); // end event function definition
    } // end loop through buttons
} // end function


// displayCategory
// changes html inner of
//      category-name
//      category-description-header
//      category-description-body
// also highlights the correct column in the progress grid
//
// Assumes currentindex is declared somewhere and has an appropriate value
function displayCategory(newIndex) {
    if (+newIndex == +currentIndex)
        return; // nothing to do

    // colour in appropriate parts of progressGrid (will catch unclosed accordions)
    questionsArray = categoryArray[+currentIndex].questions;
    for (let i=0; i<questionsArray.length ; i++) {
        let val = getQuestionValues(questionsArray[i], "max");
        progressGrid[+currentIndex].colourCell(i, val);
    }

    changeCurrentDisplay(newIndex);
}


// like displayCategory but sets currentIndex=0
//  and does not do the stuff to ensure the colours for the previous category
//  are displayed correctly.
function initialDisplayCategory(categoryArray) {
    currentIndex = 0;
    progressGrid[currentIndex].highlight("Black");

    // set body accordion bodies (there is a dummy child to replace)
    const initialItem = categoryArray[currentIndex];
    setAccordionBodiesData(initialItem);

    // gray out preButton there is no need to do anything for nextButton
    prevButton.style.color = "LightGray";
}


function checkAnswerBoxesByOption(buttons, option){ // There should be 4 buttons, so there is 4 values per option
    const OPTIONS = {
        '0' : [0, 0, 0, 1],
        '1' : [0, 0, 1, 0],
        '2' : [1, 0, 0, 0],
        '3' : [0, 1, 0, 0],
        '5' : [1, 1, 0, 0]
    }
    for(let i=0; i < buttons.length; i++) buttons[i].checked = OPTIONS[option][i];
}


// create an array of information to do with each category:
//      - name (for the header)
//      - description (for the category description)
// This will be used to set html inners for the elements with ids
//      - category-name and 
//      - category-description-body
function createCategoryArray() {

    function Category(header, index, description, questionSets){
        this.name = header.innerText;
        this.description = description.innerText;
        this.index = index;
        this.questions = convertToArray(questionSets);
    }

    Category.prototype.setFalse = function(senseindex){
        this.setValues(senseindex, 0);
    }

    // Function to set all questions depending on an array of values.
    // if values is 0 then set all answers to false
    // Otherwise go through the array setting answers and then setting the 
    //  appropriate colour in the progress grid.
    Category.prototype.setValues = function(senseindex, values){
        let item = this.questions[+senseindex];
        let fieldsets = item.getElementsByTagName("fieldset");
        let maxval = 0; // need to calculate the max of the list of values to set the colour in progressGrid correctly
        for(let i=0; i < fieldsets.length; i++){
            let buttons = fieldsets[i].getElementsByTagName("input");
            let val = +values == 0 ? 0 : +values[i];
            if(val > 5) val = 0;
            checkAnswerBoxesByOption(buttons, val);
            
            fieldsets[i].setAttribute("value", val);
            if (+maxval < +val)
                maxval = val;
        }
        if(+values !== 0) progressGrid[this.index].colourCell(senseindex, maxval);
    };

    // Grab the categoryContainer and create (DOM) arrays of headers and descriptions
    const categoryContainer = document.getElementById("category-container")
    const headers = categoryContainer.getElementsByTagName("h2");
    const descriptions = categoryContainer.getElementsByTagName("p");

    // Grab the questionset container and create a DOM array of category questionsets
    const categoryQuestionsets = document.querySelectorAll('#questionset-container .category-questionset');

    // create and fill an array of Category
    catArray = createArray(headers.length);
    for (let i=0 ; i<headers.length ; i++) {
        senseQSets = categoryQuestionsets[i].querySelectorAll('.category-sense-questions');
        catArray[i] = new Category(headers[i], i, descriptions[i], senseQSets);
    }
    return catArray;
}


// create a structure for question answers
function createJsonAnswers(categoryArray) {
    jsonstruct = {"type": "SPCR", 
                    "version": 1, 
                    "currentIndex": currentIndex,
                    "questionStatus": []};

    function Status(senseindex,catindex,values){
        this.senseindex = senseindex;
        this.categoryindex = catindex;
        this.values = values;
    }

    for (let i=0 ; i<categoryArray.length ; i++){
        let category = categoryArray[i];
        let questionsArray = category.questions;

        for (let j=0 ; j<questionsArray.length ; j++){
            let qset = questionsArray[j];
            let values = getQuestionValues(qset,"array");
            let qstatus = new Status(j,i,values);
            jsonstruct.questionStatus.push(qstatus);
        }
    }

    return jsonstruct;
}


// Create progress grid column array
//  This is a list of the columns of the grid where each item contains
//      a progress-column
//      an array of progress-item
// An array of ProgressGrid is returned
function createProgressGrid() {
    // column is a DOM object with class progress-column
    function ProgressGrid(column, catindex){
        this.column = column;

        items = column.querySelectorAll(".progress-item");
        itemsArray = createArray(items, length);
        for (let i=0 ; i<items.length ; i++) {
            let item = items[i];
            itemsArray[+item.getAttribute("senseindex")] = item;

            item.addEventListener("click", function(){ 
                displayCategory(catindex);
            });
        }

        this.senseboxes = itemsArray;
    }

    ProgressGrid.prototype.clear = function(){
        for (let i=0; i<this.senseboxes.length; i++){
            let item = this.senseboxes[i];
            item.style.background = "White";
        }   
    };

    ProgressGrid.prototype.highlight = function(colour){
        let item = this.column;
        item.style.borderColor = colour;
    }
    
    // TODO: how can I do this?
    ProgressGrid.prototype.switchHighlight = function(catIndexes, colours){
        catIndexes.map(index => {
            let item = this[+index].column;
            item.style.borderColor = colours[catIndexes.indexOf(index)];
        });
    }
    
    function getSenseColour(senseIndex){
        var senseColours = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
        return senseColours[+senseIndex];
    }

    ProgressGrid.prototype.colourCell = function (senseindex, value) {
        cell = this.senseboxes[senseindex];
        cell.style.background = 
            +value == 0 ? "WhiteSmoke" : +value == 1 ? "AntiqueWhite" : getSenseColour(senseindex);
    }

    const pGrid = document.getElementById("progress-grid");
    const progressColumnList = pGrid.querySelectorAll(".progress-column");
    const progressArray = createArray(progressColumnList.length);
    for (let catindex=0 ; catindex<progressArray.length ; catindex++){
        let item = progressColumnList[catindex];
        progressArray[catindex] = new ProgressGrid(item, catindex);
    }

    return progressArray;
}


/////////////////////////////// Functions for Event Listeners //////////////////////////////////

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

/////////////////////////////////   End Functions  /////////////////////////////////////////////
