// Functions 
///////////////////////////////////////////////////////////////////////////////////////

// Generic Functions
////////////////////////////////////////////////////////////////////////////////////////
function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

// Functions that manipulate html elements in some way
/////////////////////////////////////////////////////////////////////

function getSenseColour(senseIndex){
    const senseColours = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
    const senseColoursHex = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#EE82EE"];
    const senseColoursRGBA = senseColoursHex.map(hex => hexToRgbA(hex));
    return +senseIndex < 0 ? senseColoursRGBA : senseColours[+senseIndex];
}

function getAnswerName(answer){
    const names = ["False", "Not Sure", "Was True", "True Now", '', "Always True"];
    return answer < 0 ? names : names[answer];
}

function sortAnswers(answers){
    var dataset = answers.map((sense, index) => {
        dataset.push({
            order: index,
            label: data.lables[index],
            data: sense,
            fill: true,
            backgroundColor: 'rgba(251, 190, 251, 0.3)',
            borderColor: 'rgb(221,160,221)',
            tension: 0.1
        });
    });

    return dataset;
}
// TODO: Create dataset for each type of answer for each sense from random data
// ALSO: Give them Order number
function setDatasetsForPolarChart(labels, answers){
    const colours = getSenseColour(-1);
    var dataset = [];
    console.log(answers);
    [ ...answers.answers ].map((sense, index) => {
        dataset.push({
            order: index,
            label: labels[index],
            data: sense.filter(answer => answer >= 0),
            fill: true,
            backgroundColor: colours[index],
            borderColor: colours[index],
            tension: 0.1
        });
    });

    return dataset;
}


// setQuestionValues(answers) answers is a JSON structure.
// fills in appropriate values in categoryArray
// colours in the progress grid appropriately
function setAnswers(answers){

    function Answers(){
        this.answers = [];
        rnd = num => Math.floor(Math.random() * num);
        for(let i = 0; i < data2.labels.length; i++){
            this.answers[i] = [0];
            for(let j = 0; j < 59; j++){
                let ans = 4;
                while(ans == 4) ans = rnd(6);
                this.answers[i][ans] >= 0 ? ++this.answers[i][ans] : this.answers[i][ans] = 0;
                console.log(ans);
            }
        }
    }
    
    // questionStatus = answers.questionStatus;
    // var sensesPoints = [0,0,0,0,0,0,0];
    // for (var i=0; i<questionStatus.length; i++){
    //     item = questionStatus[i];
    //     //catindex = item.categoryindex;
    //     sense = +item.senseindex;
    //     values = item.values;
    //     for (var k=0 ; k<values.length ; k++){
    //         val = +values[k];
    //         sensesPoints[+sense]+= +val;
    //     }
    // }
    
    // You.data = sensesPoints;
    // data.datasets.push(You);
    // console.log(You);
    // console.log(data);
    const aChartRadar = document.getElementById('myChart');
    const aChartLine = document.getElementById('lineChart');
    const aChartPolarArea = document.getElementById('polarAreaChart');
    var myChart = new Chart(
        aChartRadar,
        config
    );
    
    var lineChart = new Chart(
        aChartLine,
        config2
    );
    
    var polarAreaChart = new Chart(
        aChartPolarArea,
        config3
    );
    
    const newAnswers = new Answers();
    if (data2.labels.length) {

    }
    var polarCharts = setDatasetsForPolarChart(data.labels, newAnswers);
    var configs = [];
    var names = [];
    let labels = getAnswerName(-1);
    [ ...polarCharts ].map((pChart, index) => {
        let data = {
            labels: labels.filter(label => label.length),
            datasets: [pChart]
        };
        console.log(pChart);
        configs.push({
            type: 'polarArea',
            data: data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: pChart.label
                    }
                }
            }
        });

        var currentName = `polarArea${pChart.label}`;
        let newDiv = document.createElement('canvas');
        newDiv.id = currentName;
        aChartPolarArea.parentNode.appendChild(newDiv);
        let newDivNode = document.getElementById(`${newDiv.id}`);
        console.log(newDivNode);
        names[currentName] = new Chart(
            newDivNode,
            configs[index]
            );
            
        console.log(names);
    });
        
    return newAnswers;
}

/////////////////////////////////   End Functions  /////////////////////////////////////////////

// Variables
////////////////////////////////////////////////
var You = {
        order: 0,
        label: 'You',
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(191, 190, 210, 0.3)',
        borderColor: 'rgb(221,160,221)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    };

var data = {
    labels: [
        "Vision",
        "Hearing",
        "Touch",
        "Smell",
        "Taste",
        "Proprioception",
        "Balance"
    ],
    datasets: [{
        order: 2,
        label: 'Average',
        data: [100, 100, 100, 100, 100, 100, 100],
        fill: true,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(54, 162, 235, 0)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
    },{
        order: 1,
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(251, 190, 251, 0.3)',
        borderColor: 'rgb(221,160,221)',
        tension: 0.1
    }]
};

var data2 = {
    labels: [
        "Vision",
        "Hearing",
        "Touch",
        "Smell",
        "Taste",
        "Proprioception",
        "Balance"
    ],
    datasets: [{
        order: 1,
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(251, 190, 251, 0.3)',
        borderColor: 'rgb(221,160,221)',
        tension: 0.1
    }]
};

const config = {
    type: 'radar',
    data: data,
    options: {
        elements: {
            line: {
                borderWidth: 3
            }
        }
    },
};

const config2 = {
    type: 'line',
    data: data,
};

const config3 = {
    type: 'polarArea',
    data: data2,
    options: {}
  };

//////////////////////////// END GLOBAL VARIABLES ///////////////////////////////////

// Loading the answers
// loadButton is an input, so we need 'change' event to fire
loadButton = document.getElementById('readbutton');
loadButton.addEventListener('change',async function(event) {
    // input gives us the fileList object
    var fileList = event.target.files;
    file = fileList[0];

    // we need a FileReader instance
    const reader = new FileReader();
    // we have to add event listener to the instance before we continue
    reader.addEventListener('loadend', () => {
        // after event load ends we get and object reader.result
        var answers = reader.result;
        answers = JSON.parse(answers);
        //console.log(answers);

        Answers = answers;
        temp = setAnswers(answers);
    });
    // let's read the file, as event listener is prepared
    try {
        reader.readAsText(file);
    }
    catch (err){
        return;
        alert('Cannot read file');
    }
});