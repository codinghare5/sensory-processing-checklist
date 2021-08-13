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


class Static{
    static getColour(senseIndex){
        const senseColours = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
        const senseColoursHex = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#EE82EE"];
        const senseColoursBorderHex = ["#FF5555", "#555555", "#555555", "#558055", "#5555FF", "#4B5582", "#EEBBEE"];
        const senseColoursRGBA = senseColoursHex.map(hex => hexToRgbA(hex));
        const senseColoursBorderRGBA = senseColoursBorderHex.map(hex => hexToRgbA(hex));
        return +senseIndex < -1 ? senseColoursBorderRGBA 
                : +senseIndex < 0 ?  senseColoursRGBA 
                : senseIndex === 'all' ? senseColours 
                : senseColours[+senseIndex];
    }

    static getName(senseIndex){
        const Names = ["Vision", "Hearing", "Touch", "Smell", "Taste", "Proprioception", "Balance"];
        return senseIndex === 'all' ? Names : Names[senseIndex];
    }

    static getAnswerNameBy(answerId){
        const names = ["False", "Not Sure", "Was True", "True Now", "Always True"];
        return answerId < 0 ? names : names[answerId];
    }

    static get(what){
        const senseNames = () => this.getName('all');
        const answerNames = () => this.getAnswerNameBy(-1);
        const senseColours = () => this.getColour('all');
        const senseRGBA = () => this.getColour(-1);
        if(what === 'all'){
            return {senseNames: senseNames(), answerNames: answerNames(), senseColours: senseColours(), senseRGBA: senseRGBA()}
        }
    }
}


class View {
    constructor(){
        this.lastClickedChartNode;
        this.answers = {};
        this.rawDataCharts = document.getElementById('raw-data-charts');
        this.allChartsForSenses = document.getElementById('polar-area-charts');
        this.allChartsForCategories = document.getElementById('categorycharts');

        this.createTextAreaObserver();

        // this.loadButton = document.getElementById('readbutton');
        // this.loadButton.addEventListener('click', async () => {
        //     await loadFile()
        //         .then( async (result) => {
        //             this.textArea.innerText = await result;
        //         })
        //         .catch(error => console.error(error));
        // });

    }

    callback = async (mutationsList) => {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const result = await JSON.parse(mutation.target.innerText);
                this.answers = this.extractAnswersFromLoaded(result);

                this.lineChartFromClass = new ChartFactory('line', this.answers, this.allChartsForCategories);
                this.barChartFromClass = new ChartFactory('bar', this.answers, this.rawDataCharts);
                this.radarChartFromClass = new ChartFactory('radar', this.answers, this.allChartsForSenses);
                
                this.enlargeChartOnClickEvent();
            }
        }
    }

    createTextAreaObserver() {
        this.parentContainer = document.createElement('div');
        this.textArea = document.createElement("textarea");

        this.parentContainer.style.display = 'none';
        this.parentContainer.appendChild(this.textArea);

        this.body = document.body;
        this.body.appendChild(this.parentContainer);
        this.textArea.value = '';

        const observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };
        this.textAreaObserver = new MutationObserver(this.callback);
        this.textAreaObserver.observe(this.parentContainer, observerConfig);
    }

    extractAnswersFromLoaded(result) {
        let _answers = {};
        [...result.answers]
            .map( (category, categoryindex) => 
                {
                    category.map( (sense, senseindex) => 
                    {
                        const firstTimeInCategory = !(_answers[senseindex] && _answers[senseindex].length);

                        if (firstTimeInCategory)
                            _answers[senseindex] = [];

                        const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 5: 0 };
                        if (sense.values.length) {
                            for (const num of sense.values) {
                                counts[num] = counts[num] ? ++counts[num] : 1;
                            }
                        }

                        _answers[senseindex][categoryindex] = counts;
                    })
                });
        
        return _answers;
    }

    enlargeChartOnClickEvent(){
        [ ...document.querySelectorAll('canvas') ]
            .map(chart => chart.addEventListener('click', 
                (event) => {
                    if (event.target.parentNode.classList.contains('selected')) 
                        return;
                    
                    if (this.lastClickedChartNode) {
                        this.lastClickedChartNode.classList.toggle('selected');
                        this.lastClickedChartNode.firstChild.style.height = '39vh';
                    }

                    this.lastClickedChartNode = event.target.parentNode;
                    this.lastClickedChartNode.classList.toggle('selected');
                }
            ));
    }

}


class ChartFactory{
    constructor(type, answers, container) {
        this.type= type;
        this.name = this.type ==='line' ? 'Line Chart' : this.type ==='radar' ? 'Radar Chart' : `${this.type} Chart`;
        this.data = {
            labels: this.type === 'radar' ? Static.get('all').answerNames : labelsForCategories,
            datasets : this.prepareDatasetsForChart(answers)
        }
        this.config = {
            type: this.type,
            data: this.data,
            options: {
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: this.name
                    }
                },
                scales: this.type === 'radar' ? {} : verticalCategoryNames
            }
        }
        this.container = container;
        
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
        if(this.container.firstChild){
            this.container.firstChild.remove()
        }
        this.container.appendChild(this.parentDiv);

        return new Chart(
            this.canvas,
            this.config
        );
    }

    calculateNormalizedVectorFrom(senseAnswers){
        let normals = senseAnswers.map(values => 
            {
                let numberOfAnsweredQuestions = 0;

                const sumOfValues = 
                    Object.entries(values)
                        .reduce( (acc, value) =>
                            {
                                if (value[1] === 0)
                                    return acc + 0;

                                numberOfAnsweredQuestions += value[1];
                                return acc + (+value[0] * value[1]);
                            }, 0);
                
                let sum = sumOfValues;
                        
                return numberOfAnsweredQuestions > 0 ? sum/(numberOfAnsweredQuestions*5) : 0;
            });

        return normals;
    }

    calculateAnswerPopularityFrom(senseAnswers){
        let popularity = 
            senseAnswers.reduce( (accumulator, values) =>

                Object.fromEntries(

                    Object.entries(values)
                        .map(
                            ( [ key, val ] ) =>  [ key, val + accumulator[key] ]
                        )

                ),
                { "0": 0, "1": 0, "2": 0, "3": 0, "5": 0}
            );

        return Object.values(popularity);
    }

    prepareDatasetsForChart(answers){
        const borderColours = Static.get('all').senseColours;
        const labels = Static.get('all').senseNames;
        var dataset = [];

        [ ... Object.values(answers) ]
            .map( (senseAnswers, index) => 
                {
                    let data = 
                        this.type === 'radar' 
                                ? this.calculateAnswerPopularityFrom(senseAnswers) 
                                : this.calculateNormalizedVectorFrom(senseAnswers);

                    dataset.push({
                        order: index,
                        label: labels[index],
                        data: data,
                        fill: false,
                        backgroundColor: borderColours[index],
                        borderColor: borderColours[index],
                        tension: 0.1
                    });
                });
        
        return dataset;
    }
    
}
