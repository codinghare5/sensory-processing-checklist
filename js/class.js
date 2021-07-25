/////////////////////////////////////// Button /////////////////////////////////////////
class Button{
    constructor(parentNode, thisNode, value){
        this.parentNode = parentNode;
        this.node = thisNode;
        this.value = value;
        this.siblings = this.parentNode.querySelectorAll('input');
    }
}

/////////////////////////////////////// QUESTION /////////////////////////////////////////
class Question{
    constructor(parentNode, text, value, buttons){
        this.parentNode = parentNode;
        this.text = text;
        this.value = value;
        this.buttons = buttons;

        [...this.buttons].map(button => button.node.addEventListener('change', event =>this.onChangeEvent(event)));
    }
    
    setValue(senseindex, values){
        let item = this.questions[+senseindex];
        let fieldsets = item.getElementsByTagName("fieldset");
        let maxval = 0; // need to calculate the max of the list of values to set the colour in progressGrid correctly
        for(let i=0; i < fieldsets.length; i++){
            let buttons = fieldsets[i].getElementsByTagName("input");
            let val = +values == 0 ? 0 : +values[i];
            if(val > 5) val = 0;
            this.setAnswerBoxesByValue(buttons, val);
            
            fieldsets[i].setAttribute("value", val);
            if (+maxval < +val)
                maxval = val;
        }
        if(+values !== 0) progressGrid[this.index].colourCell(+senseindex, +maxval);
    }

    getValue(){
        return this.value;
    }

    setAnswerBoxesByValue(buttons, option){
        const OPTIONS = {
            '0' : [0, 0, 0, 1],
            '1' : [0, 0, 1, 0],
            '2' : [1, 0, 0, 0],
            '3' : [0, 1, 0, 0],
            '5' : [1, 1, 0, 0]
        }
        for(let i=0; i < buttons.length; i++) buttons[i].node.checked = OPTIONS[option][i];
    }

    onChangeEvent(event){
        const currentValue = this.parentNode.getAttribute('value');
        const buttonValue = +event.target.value;
        const isButtonChecked = event.target.checked;
        const ifCheckedFalseOrNotSure = buttonValue <= 1;
        const elseIfAlwaysTrue = buttonValue == 2 && +currentValue == 3 
                                            || buttonValue == 3 && +currentValue == 2;
        const uncheckedWasTrueOrTrueNow = buttonValue == 2 && +currentValue == 5 
                                                                || buttonValue == 3 && +currentValue == 5;
        
        let option = 0;
        isButtonChecked ? 
            ifCheckedFalseOrNotSure ? option = buttonValue 
                : elseIfAlwaysTrue ? option = 5 : option = buttonValue
            : uncheckedWasTrueOrTrueNow ? option = 5 - buttonValue : option = 0;

        this.setAnswerBoxesByValue(this.buttons, option);
        //TODO: use JS value or HTML one?
        this.parentNode.setAttribute("value", option);
        this.value = option;
    }
}

/////////////////////////////////////// SENSE /////////////////////////////////////////
class Sense{
    constructor(categoryIndex, senseIndex, subheading, senseNode, aQuestionList){
        this.categoryIndex = categoryIndex;
        this.senseIndex = senseIndex;
        this.subheading = subheading;
        this.node = senseNode;
        this.questions = aQuestionList;
    }

    setFalse(senseindex){
        this.setValue(senseindex, 0);
    }

    setQuestionValues(){
        //for (let i=0; i<progressGrid.length; i++) progressGrid[i].clear();

        questionStatus = answers.questionStatus;
        for (let i=0; i<questionStatus.length; i++){
            item = questionStatus[i];
            catindex = item.categoryindex;
            categoryArray[+catindex].setValues(item.senseindex, item.values);
        }
    
        // change the display if necessary
        newIndex = +answers.currentIndex;
        if (currentIndex != newIndex) 
            changeDisplayedDataTo(newIndex);
    }

    getQuestionValues(returnType){
        let values = [];
        let sum = 0;
        let max = 0;
        for (let k=0 ; k<this.questions.length ; k++){
            let val = this.questions[k].value;
            values[k] = +val;
            sum += +val;
            if (+max < +val)
                max = +val;
        }
    
        return sum == 0 ? 0 : returnType == "max" ? max : values;
    }

}

/////////////////////////////////////// CATEGORY /////////////////////////////////////////
class Category{
    constructor(header, index, description, senses){
        this.name = header.innerText;
        this.description = description.innerText;
        this.index = index;
        this.senses = senses;
    }
    
    getQuestionsFor = (senseIndex) => this.senses[+senseIndex].node;
}


/////////////////////////////////////// PROGRESS GRID /////////////////////////////////////////
class ProgressGrid{
    constructor(display, node, catIndex){
        this.display = display;
        this.node = node;
        this.categoryIndex = catIndex;
        this.senseboxes = this.node.querySelectorAll(".progress-item");

        [ ...this.senseboxes ].addEventListener("click", (event) =>
            this.display.displayCategory(this.node.getAttribute('catindex'))
        );
    }

    clear(){
        [ ...this.senseboxes ].map(
            item => item.style.background = "White"
        )   
    };
    
    highlight(colour){
        this.node.style.borderColor = colour;
    }
    
    getSenseColour(senseIndex){
        var senseColours = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
        return senseColours[+senseIndex];
    }
    
    colourCell(senseindex, value) {
        let cell = this.senseboxes[+senseindex];
        cell.style.background =
            +value == 0
                ? "WhiteSmoke" 
                : +value == 1 
                    ? "AntiqueWhite" 
                    : this.getSenseColour(+senseindex);
    }
}

/////////////////////////////////////// DISPLAY /////////////////////////////////////////
class Display{
    constructor(){
        // Context menu buttons
        this.resultsButton = document.getElementById('resultsbutton');
        this.saveButton = document.getElementById("savebutton");
        this.loadButton = document.getElementById("readbutton");

        // Category information elements
        this.categoryTitle = document.getElementById('category-name');
        this.categoryButton = document.getElementById('category-description-button');
        this.catedoryDescription = document.getElementById('category-description-body');

        // Body
        this.sensesDataContainers = document.querySelectorAll('#bodyaccordion .accordion-body');
        this.accordionCollapses = convertToArray(document.querySelectorAll('#bodyaccordion .accordion-collapse'));

        // previous and next buttons
        this.prevButton = document.getElementById('previousbutton');
        this.nextButton = document.getElementById('nextbutton');

        // Grab the categoryContainer and create (DOM) arrays of headers and descriptions
        this.categoryContainer = document.getElementById("category-container")
        this.headers = this.categoryContainer.getElementsByTagName("h2");
        this.descriptions = this.categoryContainer.getElementsByTagName("p");

        // Grab the questionset container and create a DOM array of category questionsets
        this.categoryQuestionsets = document.querySelectorAll('#questionset-container .category-questionset');

        // categoryArray
        this.categoryArray = createArray(this.headers.length);
        this.currentIndex = 0;

        // Progress Grid
        this.progressGrid = this.createProgressGrid();
    }

    createProgressGrid() {
        let pGrid = document.getElementById("progress-grid");
        const progressColumnList = pGrid.querySelectorAll(".progress-column");
        const progressArray = createArray(progressColumnList.length);
        for (let catindex=0 ; catindex<progressArray.length ; catindex++){
            let column = progressColumnList[catindex];
            progressArray[catindex] = new ProgressGrid(this, column, catindex);
        }
    
        return progressArray;
    }

    initializeCategoryNavigationButtons(){
        this.prevButton.addEventListener('click', (event) => {
            if (+this.currentIndex != 0)
                this.displayCategory(+this.currentIndex - 1);
        });
    
        this.nextButton.addEventListener('click', (event) => {
            if (this.nextButton.getAttribute('nextevent') != 'show')
                this.displayCategory(+this.currentIndex + 1);
        });
    }

    initializeReadWriteButtons(){
        this.saveButton.addEventListener('click', saveToFile);
        this.loadButton.addEventListener('click', loadFromFile);
    }

    initializeAccordionCollapses(){
        this.accordionCollapses.addEventListener('hide.bs.collapse', event => {
            let senseIndex = event.target.getAttribute('senseindex');
            let sense = this.getCurrentCategorySenses()[+senseIndex];
            var value = sense.getQuestionValues("max");
            this.getCurrentProgressGridColumn().colourCell(+senseIndex, +value);
        });
    }

    initialize(){
        this.getCurrentProgressGridColumn().highlight("Black");
        this.initializeReadWriteButtons();
        this.initializeCategoryNavigationButtons();
        this.initializeAccordionCollapses();
        this.setSensesDataToDisplay(this.currentIndex);
        this.setPrevButtonStyleColor("LightGray");
    }

    setPrevButtonStyleColor(color) {
        return this.prevButton.style.color = color;
    }

    getCurrentProgressGridColumn() {
        return this.progressGrid[+this.currentIndex];
    }

    createButtonArrayForQuestionFrom(question, buttonNodes){
        return [ ...buttonNodes ].map(button => new Button(question, button, button.value));
    }

    createQuestionArrayForSenseFrom(questionNodes){
        return [ ...questionNodes ]
            .map(question => {
                let legend = question.querySelectorAll('legend');
                let buttonNodes = question.querySelectorAll('input');
                let buttons = this.createButtonArrayForQuestionFrom(question, buttonNodes);

                return new Question(question, legend, +question.getAttribute('value'), buttons);
            });
    }

    createSenseArrayForCategoryFrom(catIndex, categorySenses){
        return [ ...categorySenses ]
            .map((senseNode, index) => {
                let subheading = senseNode.querySelector('p');
                let questionNodes = senseNode.querySelectorAll('fieldset');
                let questions = this.createQuestionArrayForSenseFrom(questionNodes);

                return new Sense(catIndex, index, subheading, senseNode, questions);
            });
    }

    createCategoryArray(){
        let catArray = createArray(this.headers.length);
        for (let catIndex=0 ; catIndex<this.headers.length ; catIndex++) {
            let categorySenses = this.categoryQuestionsets[catIndex].querySelectorAll('.category-sense-questions');
            let senses = this.createSenseArrayForCategoryFrom(catIndex, categorySenses);
            catArray[catIndex] = new Category(this.headers[catIndex], catIndex, this.descriptions[catIndex], senses);
        }
        this.categoryArray = catArray;
    }
    // old name was setAccordionBodiesData
    setSensesDataToDisplay(newIndex){
        for (let sense = 0; sense < this.sensesDataContainers.length; sense++){
            let currentSenseContainer = this.sensesDataContainers[sense];
            let categorySenseQuestions = this.getCategoryDataAt(+newIndex).getQuestionsFor(sense);
            currentSenseContainer.replaceChild(categorySenseQuestions, currentSenseContainer.children[0]); // newnode THEN oldnode
        }
    }
    // old name was setCategoryData
    setCategoryDataToDisplay(newIndex){
        this.setCategoryHeaderAndDescription(+newIndex);
        this.setProgressGridHighlightAt(+newIndex);
        this.setSensesDataToDisplay(+newIndex);
    }

    setProgressGridHighlightAt(newIndex) {
        this.getCurrentProgressGridColumn().highlight("LightGrey");
        this.progressGrid[+newIndex].highlight("Black");
    }

    setCategoryHeaderAndDescription(newIndex) {
        const { name, description } = this.getCategoryDataAt(+newIndex);
        this.categoryTitle.innerText = name;
        this.categoryButton.innerText = 'About ' + name;
        this.catedoryDescription.innerText = description;
    }

    getCategoryDataAt(newIndex) {
        return this.categoryArray[+newIndex];
    }

    setNavigationButtonsTo(newIndex){
        if(this.isLastCategoryIndex(newIndex)){
            this.nextButton.innerText = 'Show results';
            this.nextButton.setAttribute('nextevent', 'show');
        }
        else {
            if(this.nextButton.innerText === 'Show results') {
                this.nextButton.innerText = 'Next';
                this.nextButton.setAttribute('nextevent', 'next');
            }
        }
    
        this.setPrevButtonStyleColor(+newIndex == 0 ? "LightGray" : "Black");
    }

    isLastCategoryIndex(newIndex) {
        return +newIndex == (this.categoryArray.length - 1);
    }

    changeDisplayedDataTo(newIndex){
        this.setCategoryDataToDisplay(+newIndex);
        this.setNavigationButtonsTo(+newIndex);
        this.currentIndex = +newIndex;
    }

    getSenseData(){}

    createJsonAnswers(categoryArray){}

    displayCategory(newIndex){
        this.goThroughCurrentSensesAndColourProgressGrid();
        this.changeDisplayedDataTo(+newIndex);
    }

    getCurrentCategorySenses() {
        return this.categoryArray[+this.currentIndex].senses;
    }

    goThroughCurrentSensesAndColourProgressGrid() {
        let currentCategorySenses = this.getCurrentCategorySenses();
        for (let sense = 0; sense < currentCategorySenses.length; sense++) {
            let maxValue = currentCategorySenses[sense].getQuestionValues("max");
            this.getCurrentProgressGridColumn().colourCell(+sense, +maxValue);
        }
    }
}
