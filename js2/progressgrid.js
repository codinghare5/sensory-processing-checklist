// class ProgressGrid
// column is an html column of the progress grid
// catindex is the category index
// senseboxes is an array of the cells that make the up the column
// eventListener is a function defined in the application. 
//         It has one argument: the column that was clicked.
class ProgressGrid {
    constructor(column, index, eventListener) {
        this.column = column;
        this.catindex = index;
        this.senseboxes = [...column.querySelectorAll(".progress-item")];
        column.addEventListener('click', () => {eventListener(this)});
    }

    //function to set or remove the progress grid highlight:
    //  just set the color
    //      - LightGray for no highlight
    //      - Black for highlight
    // or change colours to suit
    setProgressGridHighlight(colour){
        this.column.style.borderColor = colour;
    }

    clear(){
        this.senseboxes.forEach(item => item.style.background = "White");   
    }

    // Function to colour in a cell of the progress grid
    //  colours a cell according to senseindex
    //  if value==0, the colour is whitesmoke irrespective of the sense
    //  if value==1, the colour is HoneyDew
    //  Otherwise colours are according to sense:
    //      0   vision          Red
    //      1   hearing         orange
    //      2   touch           Yellow
    //      3   smell           Green
    //      4   taste           blue
    //      5   proprioception  Indigo
    //      6   balance         violet
    // Change all these colours here so they are all in one place.
    colourCell(senseindex, value) {
        let box = this.senseboxes[senseindex];
        if (+value == 0)
            box.style.background = "WhiteSmoke";
        else if (+value == 1)
            box.style.background = "AntiqueWhite"; 
        else {
            switch(+senseindex) {
                case 0: box.style.background = "Red";
                        break;
                case 1: box.style.background = "Orange";
                        break;
                case 2: box.style.background = "Yellow";
                        break;
                case 3: box.style.background = "Green";
                        break;
                case 4: box.style.background = "Blue";
                        break;
                case 5: box.style.background = "Indigo";
                        break;
                case 6: box.style.background = "Violet";
                        break;                
            }
        }
    }
}

// Create progress grid column array
//  This is a list of the columns of the grid where each item contains
//      a progress-column
//      an array of progress-item
// An array of ProgressGrid is returned
function createProgressGrid(eventListener) {
    const pGrid = document.getElementById("progress-grid");
    const progressColumnList = [...pGrid.querySelectorAll(".progress-column")];

    return progressColumnList.map((item, index) => new ProgressGrid(item,index,eventListener));
}
