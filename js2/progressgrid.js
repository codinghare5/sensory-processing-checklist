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
        this.senseboxes.forEach(item => item.addEventListener('click', () => {
                                        eventListener(item)}));
    }

    //function to set or remove the progress grid highlight:
    //  just set the color
    //      - LightGray for no highlight
    //      - Black for highlight
    // or change colours to suit
    setProgressGridHighlight(catindex, colour){
        this.column.style.borderColor = colour;
    }
}

// Create progress grid column array
//  This is a list of the columns of the grid where each item contains
//      a progress-column
//      an array of progress-item
// An array of ProgressGrid is returned
function createProgressGrid() {
    const pGrid = document.getElementById("progress-grid");
    const progressColumnList = pGrid.querySelectorAll(".progress-column");
    const progressArray = createArray(progressColumnList.length);

    return progressArray.map((item, index) => new ProgressGrid(item,index,eventListender));
}
