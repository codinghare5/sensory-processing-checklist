const labelsForCategories = [
    " Gestalt Percepion",
    " Inability to stop feeling a change",
    " Fragmented",
    " Distorted",
    " Delayed",
    " Intensity: hyper",
    " Intensity: hypo",
    " Sensory Intolerance",
    " Fascination",
    " Fluctuation",
    " Vulnerability to Overload",
    " Systems Shutdown",
    " Sensory Agnosia",
    " Mono-processing",
    " Peripheral Perception",
    " Compensating",
    " Merging with Stimuli",
    " Daydreaming",
    " Synaethesia",
    " Perceptual Memory",
    " Perceptual Thinking"
];


function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.7)';
    }
    throw new Error('Bad Hex');
}

const verticalCategoryNames = {
    x: {
        ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90
        }
    }
}


const rnd = num => Math.floor(Math.random() * num);


class Answers{
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


class CategoryAnswers{
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


class SenseUtils{
    static getColour(senseIndex){
        const senseColours = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
        const senseColoursHex = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#EE82EE"];
        const senseColoursBorderHex = ["#FF5555", "#555555", "#555555", "#558055", "#5555FF", "#4B5582", "#EEBBEE"];
        const senseColoursRGBA = senseColoursHex.map(hex => hexToRgbA(hex));
        const senseColoursBorderRGBA = senseColoursBorderHex.map(hex => hexToRgbA(hex));
        return +senseIndex < 0 ? +senseIndex < -1 ? senseColoursBorderRGBA : senseColoursRGBA : senseColours[+senseIndex];
    }

    static getName(senseIndex){
        const Names = [
            "Vision",
            "Hearing",
            "Touch",
            "Smell",
            "Taste",
            "Proprioception",
            "Balance"
        ]

        return senseIndex === 'all' ? Names : Names[senseIndex];
    }

    static getAnswerNameBy(answerId){
        const names = ["False", "Not Sure", "Was True", "True Now", '', "Always True"];
        return answerId < 0 ? names : names[answerId];
    }
}


class View {
    constructor(){
        this.aChartRadar = document.getElementById('myChart');
        const aChartLine = document.getElementById('lineChart');
        const aChartPolarArea = document.getElementById('polarAreaChart');
        const allChartsForSenses = document.getElementById('polar-area-charts');
        const allChartsForCategories = document.getElementById('categorycharts');

        this.container = document.createElement('div');
        this.textArea = document.createElement("textarea");
        this.container.style.display = 'none';
        this.container.appendChild(this.textArea);
        this.body = document.body;
        this.body.appendChild(this.container);

        const config = { attributes: true, childList: true, subtree: true, characterData: true };
        this.observer = new MutationObserver(this.callback);
        this.observer.observe(this.container, config);
        this.textArea.value = '';
        this.loadButton = document.getElementById('readbutton');
        this.textArea.addEventListener('change', async () => new Promise(this.callback).then(result => console.log(result)));
        this.loadButton.addEventListener('click', async () => {
            await loadFile()
                .then( async (result) => {
                    this.textArea.innerText = await result;
                })
                .catch(error => console.error(error));
        });
        // lastClickedChartNode
        // answers
        // resultTab[]
        // containerForChartsInsideTab
        // const defaultChartContainerHeight
        //this.addDummyCharts();
    }

    callback = async (mutationsList) => {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const result = await JSON.parse(mutation.target.innerText);
                this.answers = {};
                //TODO: start here
                [ ...result.questionStatus ]
                    .map(res => {
                        const firstTimeInCategory = !(this.answers[res.categoryindex]&&this.answers[res.categoryindex].length);

                        if (firstTimeInCategory) this.answers[res.categoryindex] = [];
                        const counts = {0: 0, 1: 0, 2: 0, 3: 0, 5: 0};

                        if(res.values.length) {
                            for(const num of res.values){
                                counts[num] = counts[num] ? ++counts[num] : 1;
                            }
                        }

                        this.answers[res.categoryindex][res.senseindex] = counts;   
                    });
                console.log(this.answers);
            }
        }
    }

    setDatasetsForChart(labels, answers){
        const colours = 'rgba(255, 255, 255, 0.1)';
        const borderColours = SenseUtils.getColour(-1);
        var dataset = [];
        [ ...answers ].map((sense, index) => {
            dataset.push({
                order: index,
                label: labels[index],
                data: sense.filter(answer => answer >= 0),
                fill: true,
                backgroundColor: colours,
                borderColor: borderColours[index],
                tension: 0.1
            });
        });
        
        console.log(dataset);
        return dataset;
    }

    addDummyCharts(){
        var myChart = new Chart(
            this.aChartRadar,
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
    }

    // answersFromFile()

    // createRawDataCharts

    // createChartsForSensesFrom

    // createChartsForCategoriesFrom

    // createDatasets()

    // canvasSetHeight()

    // addEventListenersToCharts

}


class ResultTab {
    constructor(tabHeader, parentNode){
        this.header = tabHeader;
        this.parentNode = parentNode;
        this.navTabsContainerNode = this.parentNode.querySelector(".nav-tabs");
        this.charts = [];
    }

    // createChart()
    // prepareCharts()
    // selectChart()

}


class ChartFactory{
    constructor(name, type, labels, datasets, container) {
        this.data = {
            labels: labels,
            datasets : datasets
        }
        this.config = {
            type: type,
            data: this.data,
            options: {
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Line Chart'
                    }
                },
                scales: verticalCategoryNames
            }
        }
        this.container = container;
        // create chart and container holding it
        this.name = `${type}${name}`;
        this.parentDiv = document.createElement('div');
        this.canvas = document.createElement('canvas');

        this.canvas.id = this.name;
        this.canvas.classList.add('generated');
    
        this.parentDiv.classList.add('col-xl-4', 'col-lg-6', 'col-md-6', 'col-sm-12');
        this.parentDiv.appendChild(this.canvas);
    
        // append chart
        this.chartBody = this.appendChart();
    }

    appendChart() {
        this.container.appendChild(this.parentDiv);

        return new Chart(
            this.canvas,
            this.config
        );
    }

    setDatasetsForChart(labels, answers){
        const colours = 'rgba(255, 255, 255, 0.1)';
        const borderColours = SenseUtils.getColour(-1);
        var dataset = [];
        [ ...answers.random ].map((sense, index) => {
            dataset.push({
                order: index,
                label: labels[index],
                data: sense.filter(answer => answer >= 0),
                fill: true,
                backgroundColor: colours,
                borderColor: borderColours[index],
                tension: 0.1
            });
        });
        
        console.log(dataset);
        return dataset;
    }

    getColoursByChart(type){
        const Colours = {
            'line': {'backgroundColor' : 'rgba(255, 255, 255, 0.1)', 'borderColor' : SenseUtils.getColour(-1)},
            'polarArea': {'backgroundColor' : 'rgba(255, 255, 255, 0.1)', 'borderColor' : SenseUtils.getColour(-1)},
            'radar': {'backgroundColor' : 'rgba(255, 255, 255, 0.1)', 'borderColor' : SenseUtils.getColour(-1)}
        }

        return Colours[type];
    }
    
}
// Functions that manipulate html elements in some way
/////////////////////////////////////////////////////////////////////


function setDatasetsForChart(labels, answers){
    const colours = 'rgba(255, 255, 255, 0.1)';
    const borderColours = SenseUtils.getColour(-1);
    var dataset = [];
    [ ...answers.random ].map((sense, index) => {
        dataset.push({
            order: index,
            label: labels[index],
            data: sense.filter(answer => answer >= 0),
            fill: true,
            backgroundColor: colours,
            borderColor: borderColours[index],
            tension: 0.1
        });
    });
    
    console.log(dataset);
    return dataset;
}

var lastClickedChartNode;
// setQuestionValues(answers) answers is a JSON structure.
// fills in appropriate values in categoryArray
// colours in the progress grid appropriately
function drawCharts(answers){
    // initialize document model
    const aChartRadar = document.getElementById('myChart');
    const aChartLine = document.getElementById('lineChart');
    const aChartPolarArea = document.getElementById('polarAreaChart');
    const allChartsForCategories = document.getElementById('categorycharts');
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
    const newCategoryAnswers = new CategoryAnswers();
    //console.log(newCategoryAnswers);
    //console.log(labelsForCategories);
    
    var polarChartsDatasets = setDatasetsForChart(SenseUtils.getName('all'), newAnswers);
    let polarChartsContainer = document.getElementById('polar-area-charts');
    var linearChartsDatasets = setDatasetsForChart(SenseUtils.getName('all'), newCategoryAnswers);
    let linearChartsContainer = document.getElementById('categorycharts');

    prepareChart('polarArea', SenseUtils.getAnswerNameBy(-1), polarChartsDatasets, polarChartsContainer);
    const polarAreaCharts = [ ...polarChartsDatasets ].map(dataset => console.log(dataset));
    const lineChartFromClass = new ChartFactory('Line Chart', 'line', labelsForCategories, linearChartsDatasets, allChartsForCategories);
    // adjust charts height
    [ ...linearChartsContainer.querySelectorAll('canvas') ].map(chart => chart.style.height = '375px');
    [ ...polarChartsContainer.querySelectorAll('canvas') ].map(chart => chart.style.height = '375px');
    
    // enlargeChartsOnClick
    var lastClickedChartNode;
    [ ...polarChartsContainer.querySelectorAll('canvas') ].map(chart => chart.addEventListener('click', (event) => {
        if(event.target.parentNode.classList.contains('selected')) return;
        if(lastClickedChartNode) {
            lastClickedChartNode.classList.toggle('selected');
        }
        lastClickedChartNode = event.target.parentNode;
        lastClickedChartNode.classList.toggle('selected');
    }));
        
    return newAnswers;
}

function prepareChart(chartType, labels, datasets, container) {
    let configs = [];
    // prepare charts from datasets
    [...datasets].map((dataset, index) => {
        // set chart data
        let data = setChartData(labels, dataset);
        // set chart configs
        configs.push(setChartConfigs(chartType, chartType, data, dataset));

        // create container holding a chart and chart itself
        var currentName = `${chartType}${dataset.label}`;
        let newDiv = document.createElement('div');
        let newCanvas = document.createElement('canvas');
        newCanvas.id = currentName;

        // set appropriate class
        newCanvas.classList.add('generated');
        newDiv.classList.add('col-xl-4', 'col-lg-6', 'col-md-6', 'col-sm-12');
        // add canvas to div container
        newDiv.appendChild(newCanvas);

        displayChart(container, newDiv, currentName, configs, index);

    });
}

function displayChart(container, newDiv, currentName, configs, index) {
    // fill in container
    container.appendChild(newDiv);
    
    // get container node for chart
    let newCanvasNode = document.getElementById(`${currentName}`);
    
    // append chart to a list
    let names = [];
    names[currentName] = new Chart(
        newCanvasNode,
        configs[index]
    );
}

function setChartConfigs(chartName, chartType, data, dataset) {
    return {
        type: chartType,
        data: data,
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartName
                }
            },
            scales: chartType === 'line' ? verticalCategoryNames : {}
        }
    };
}

function setChartData(labels, dataset) {
    return {
        labels: labels.filter(label => label.length),
        datasets: [dataset]
    };
}

/////////////////////////////////   End Functions  /////////////////////////////////////////////

// Variables
////////////////////////////////////////////////
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
        data: [50, 50, 50, 50, 50, 50, 50],
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
        data: [65, 59, 80, 81, 56, 55, 60],
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
        data: [65, 59, 80, 81, 56, 55, 60],
        fill: true,
        backgroundColor: SenseUtils.getColour(-1),
        borderColor: SenseUtils.getColour(-2),
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

const view = new View();
