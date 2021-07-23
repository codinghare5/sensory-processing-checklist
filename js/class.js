class CheckBox{
    constructor(parentNode, value){
        this.parentNode = parentNode;
        this.value = value;
        this.siblings = this.parentNode.querySelectorAll('input');
    }
}


class Question{
    constructor(parentNode, text, value, buttons){
        this.parentNode = parentNode;
        this.text = text;
        this.value = value;
        this.buttons = buttons;
    }
    
    setValue(senseindex, values){
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
    }

    setAnswerBoxesByValue(){
        const OPTIONS = {
            '0' : [0, 0, 0, 1],
            '1' : [0, 0, 1, 0],
            '2' : [1, 0, 0, 0],
            '3' : [0, 1, 0, 0],
            '5' : [1, 1, 0, 0]
        }
        for(let i=0; i < buttons.length; i++) buttons[i].checked = OPTIONS[option][i];
    }
}


class Sense{
    constructor(categoryIndex, senseIndex, subheading, questionsContainer, aQuestionList){
        this.categoryIndex = categoryIndex;
        this.senseIndex = senseIndex;
        this.subheading = subheading;
        this.questionsNode = questionsContainer;
        this.questions = aQuestionList;
    }

    setFalse(senseindex){
        this.setValue(senseindex, 0);
    }

    setQuestionValues(){

    }

    getQuestionValues(){

    }

}


class Category{
    constructor(header, index, description, senses){
        this.name = header.innerText;
        this.description = description.innerText;
        this.index = index;
        this.senses = senses;
    }
    
}


class Display{
    constructor(){
        // Context menu buttons
        this.resultsButton = document.getElementById('resultsbutton');
        this.saveButton = document.getElementById("savebutton");
        this.loadButton = document.getElementById("readbutton");

        // Category information elements
        this.categoryTitle = document.getElementById('category-name');
        this.categoryButton = document.getElementById('category-description-button');
        this.categoryBody = document.getElementById('category-description-body');

        // Body
        this.accordionBodies = document.querySelectorAll('#bodyaccordion .accordion-body');
        this.accordionCollapses = convertToArray(document.querySelectorAll('#bodyaccordion .accordion-collapse'));
        //console.log(accordionBodies);

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
    }

    initialize(){
        //progressGrid[currentIndex].highlight("Black");

        // set body accordion bodies (there is a dummy child to replace)
        this.setSensesDataToDisplay(this.currentIndex);

        // gray out preButton there is no need to do anything for nextButton
        this.prevButton.style.color = "LightGray";
    }

    createCategoryArray(){
        let catArray = createArray(this.headers.length);
        for (let catIndex=0 ; catIndex<this.headers.length ; catIndex++) {
            let questionsContainer = this.categoryQuestionsets[catIndex].querySelectorAll('.category-sense-questions');
            //questions = [...questions].map((question, index) => new Question(fieldset, text, value, buttons));
            let senses = [ ...questionsContainer ]
                .map((senseDiv, index) => {
                    let subheading = senseDiv.querySelector('p');
                    let questions = senseDiv.querySelectorAll('fieldset');
                    //new Question(question, legend, question.value, buttons)
                    questions = [ ...questions ]
                        .map(question => {
                            let legend = question.querySelectorAll('legend');
                            let buttons = question.querySelectorAll('input');
                            buttons = [ ...buttons ].map(button => new CheckBox(question, button.value));

                            return new Question(question, legend, question.value, buttons);
                        });
                    catIndex == 0 ? console.log(questions) : false;

                    return new Sense(catIndex, index, subheading, senseDiv, questions);
                });
            catArray[catIndex] = new Category(this.headers[catIndex], catIndex, this.descriptions[catIndex], senses);
            catIndex == 0 ? console.log(senses[0].questions) : false;
        }
        this.categoryArray = catArray;
    }
    // setAccordionBodiesData
    setSensesDataToDisplay(newIndex){
        for (let i=0; i<this.accordionBodies.length; i++){
            let currentSenseContainer = this.accordionBodies[i];
            let categorySenseQuestions = this.categoryArray[newIndex].senses[i].questionsNode;
            currentSenseContainer.replaceChild(categorySenseQuestions,currentSenseContainer.children[0]); // newnode THEN oldnode
        }
    }
    // setCategoryData
    setCategoryDataToDisplay(newIndex){}

    setNavigationButtons(newIndex){}

    changeCurrentDisplay(newIndex){}

    getSenseData(){}

    createJsonAnswers(categoryArray){}

    initialDisplayCategory(categoryArray){}

    displayCategory(newIndex){}
}
