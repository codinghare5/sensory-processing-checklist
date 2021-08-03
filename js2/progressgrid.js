//function to set or remove the progress grid highlight:
    //  just set the color
    //      - LightGray for no highlight
    //      - Black for highlight
    // or change colours to suit
    function setProgressGridHighlight(catindex, colour){
        var item = progressGrid[+catindex].column;
        item.style.borderColor = colour;
    }

    // Create progress grid column array
    //  This is a list of the columns of the grid where each item contains
    //      a progress-column
    //      an array of progress-item
    // An array of ProgressGrid is returned
    function createProgressGrid() {

        // (local) constructor for ProgressGrid
        // column is a DOM object with class progress-column
        class ProgressGrid {
            constructor(column, catindex) {
                this.column = column;

                const items = column.querySelectorAll(".progress-item");
                const itemsArray = createArray(items, length);
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    itemsArray[+item.getAttribute("senseindex")] = item;
                    item.addEventListener("click", function () {
                        if (catindex != +currentCategoryIndex) {
                            display(catindex, currentSenseIndex);
                        }
                    });
                }

                this.senseboxes = itemsArray;
            }
        }

        const pGrid = document.getElementById("progress-grid");
        const progressColumnList = pGrid.querySelectorAll(".progress-column");
        const progressArray = createArray(progressColumnList.length);
        for (j=0 ; j<progressArray.length ; j++){
            item = progressColumnList[j];
            catindex = item.getAttribute("catindex");
            progressArray[+catindex] = new ProgressGrid(item, catindex);
        }

        return progressArray;
    }
