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
        const Names = ["Vision", "Hearing", "Touch", "Smell", "Taste", "Proprioception", "Balance"];
        return senseIndex === 'all' ? Names : Names[senseIndex];
    }

    static getAnswerNameBy(answerId){
        const names = ["False", "Not Sure", "Was True", "True Now", "Always True"];
        return answerId < 0 ? names : names[answerId];
    }
}


class View {
    constructor(){
        this.aChartRadar = document.getElementById('myChart');
        const aChartLine = document.getElementById('lineChart');
        const aChartPolarArea = document.getElementById('polarAreaChart');
        this.allChartsForSenses = document.getElementById('polar-area-charts');
        this.allChartsForCategories = document.getElementById('categorycharts');

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
    }

    callback = async (mutationsList) => {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const result = await JSON.parse(mutation.target.innerText);
                this.answers = {};

                this.extractAnswersFromLoaded(result);

                this.linearChartsDatasets = this.setDatasetsForChartBy('line', SenseUtils.getName('all'), this.answers);
                this.radarChartsDatasets = this.setDatasetsForChartBy('radar', SenseUtils.getName('all'), this.answers);
                this.lineChartFromClass = new ChartFactory('Line Chart', 'line', labelsForCategories, this.linearChartsDatasets, this.allChartsForCategories);
                this.radarChartFromClass = new ChartFactory('Radar Chart', 'radar', SenseUtils.getAnswerNameBy(-1), this.radarChartsDatasets, this.allChartsForSenses);
                this.canvasSetHeight();
            }
        }
    }

    extractAnswersFromLoaded(result) {
        [...result.answers]
            .map( (category, categoryindex) => {

                category.map( (sense, senseindex) => {
                    const firstTimeInCategory = !(this.answers[senseindex] && this.answers[senseindex].length);

                    if (firstTimeInCategory)
                        this.answers[senseindex] = [];

                    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 5: 0 };
                    if (sense.values.length) {
                        for (const num of sense.values) {
                            counts[num] = counts[num] ? ++counts[num] : 1;
                        }
                    }

                    this.answers[senseindex][categoryindex] = counts;
                })
            });
    }

    calculateNormalizedVectorFrom(sense){
        let normals = sense.map(values => 
            {
                let numberOfQuestions = 0;
                let normalized = 0;
                let sum = Object.entries(values).reduce( (acc, value) => 
                {
                    if(value[1] === 0) return acc + 0;
                    
                    numberOfQuestions += value[1];
                    return acc + (+value[0] * value[1]);
                }, 0);
                return numberOfQuestions > 0 ? normalized = sum/(numberOfQuestions*5) : 0;
            });

        return normals;
    }

    calculateAnswerPopularityFrom(senseAnswers){
        let popularity = senseAnswers.reduce( (acc, values) =>
            Object.fromEntries(
                Object.entries(values)
                    .map(
                        ( [ key, val ] ) =>  [ key, val + acc[key] ]
                    )
            ), { "0": 0, "1": 0, "2": 0, "3": 0, "5": 0} );
        return Object.values(popularity);
    }

    setDatasetsForChartBy(chartType, labels, answers){
        const colours = 'rgba(255, 255, 255, 0.1)';
        const borderColours = SenseUtils.getColour(-1);
        var dataset = [];
        [ ... Object.values(answers) ].map((senseAnswers, index) => {
            let data = chartType === 'radar' 
                        ? this.calculateAnswerPopularityFrom(senseAnswers) 
                        : this.calculateNormalizedVectorFrom(senseAnswers);
            dataset.push({
                order: index,
                label: labels[index],
                data: data,
                fill: true,
                backgroundColor: colours,
                borderColor: borderColours[index],
                tension: 0.1
            });
        });
        
        return dataset;
    }

    // answersFromFile()

    // createRawDataCharts

    // createChartsForSensesFrom

    //TODO: fix
    canvasSetHeight(){
        [ ... document.querySelectorAll('canvas') ].map(chart => chart.style.height = '375px');
    }

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
        this.name = name;
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
                        text: this.name
                    }
                },
                scales: type === 'line' ? verticalCategoryNames : {}
            }
        }
        this.container = container;
        // create chart and container holding it
        
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

    static getColoursByChart(type){
        const Colours = {
            'line': {'backgroundColor' : 'rgba(255, 255, 255, 0.1)', 'borderColor' : SenseUtils.getColour(-1)},
            'polarArea': {'backgroundColor' : 'rgba(255, 255, 255, 0.1)', 'borderColor' : SenseUtils.getColour(-1)},
            'radar': {'backgroundColor' : 'rgba(255, 255, 255, 0.1)', 'borderColor' : SenseUtils.getColour(-1)}
        }

        return Colours[type];
    }

    // TODO: fix
    enlargeChartOnClick(){
        var lastClickedChartNode;
        [ ...polarChartsContainer.querySelectorAll('canvas') ].map(chart => chart.addEventListener('click', (event) => {
            if(event.target.parentNode.classList.contains('selected')) return;
            if(lastClickedChartNode) {
                lastClickedChartNode.classList.toggle('selected');
            }
            lastClickedChartNode = event.target.parentNode;
            lastClickedChartNode.classList.toggle('selected');
        }));
    }
    
}
// Functions that manipulate html elements in some way
/////////////////////////////////////////////////////////////////////

//////////////////////////// END GLOBAL VARIABLES ///////////////////////////////////

const view = new View();
