import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

let events = {};
let height= 10;
let width = 10;
let interval;
let delay = 100;

let boardStyle = {
    margin: "0 auto",
    width: ""+22*height+"px",
    height: ""+22*width+"px  ",
    display: "flex",
    flexWrap: "wrap",
    border: "1px black solid",
    backgroundColor: "#330033",
    marginBottom : "20px"
};

let cells = height*width;
let livings =0;
let matrix= [];
let emptyMatrix= [];
let helpMatrix;
for(let i=0;i<cells;i++)
{
    matrix.push({alive:(Math.random() > .5)});
    emptyMatrix.push({alive:false});
}

function calcul(matrice)
{
    let newmatrice = [];
    for(let i=0;i<cells;i++)
    {
        newmatrice.push({alive : false});
    }
    for(let i=0;i<height;i++)
    {
        for(let j=0;j<width;j++)
        {
            livings = numberOfNeighbours(i,j,matrice);

            if(matrice[i*width+j].alive)
            {
                if((livings===2) || (livings===3))
                {
                    newmatrice[i*width+j].alive=matrice[i*width+j].alive;
                }
                else
                {
                    newmatrice[i*width+j].alive=false;
                }
            }
            else
            {
                newmatrice[i*width+j].alive=(livings===3);
            }
        }
    }
    return newmatrice;
}

function numberOfNeighbours(i,j,matrix) {
    let counter=0;
    counter = (matrix[(mod((i-1),height))*width+(mod((j-1),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i-1),height))*width+(mod((j),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i-1),height))*width+(mod((j+1),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i),height))*width+(mod((j-1),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i),height))*width+(mod((j+1),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i+1),height))*width+(mod((j-1),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i+1),height))*width+(mod((j),width))].alive) ? counter+1:counter;
    counter = (matrix[(mod((i+1),height))*width+(mod((j+1),width))].alive) ? counter+1:counter;
    return counter;
}

function mod(n, m) {
    return (n+m)%m;
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {generationCount : 0 }
    }
    addGen () {
        this.setState({generationCount:this.state.generationCount+1});
    }
    clearGen () {
        this.setState({generationCount : 0});
    }
    changeWidth () {
        if((this.refs.inputWidth.value<10) || (this.refs.inputWidth.value>50))
        {
            width = 10;

        }
        else
        {
            width = this.refs.inputWidth.value;
        }
        cells  = width*height;
        boardStyle = {
            margin: "0 auto",
            width: ""+22*height+"px",
            height: ""+22*width+"px  ",
            display: "flex",
            flexWrap: "wrap",
            border: "1px black solid",
            backgroundColor: "#330033",
            marginBottom : "20px"
        };
        emptyMatrix= [];
        matrix=[];
        for(let i=0;i<cells;i++)
        {
            matrix.push({alive:(Math.random() > .5)});
            emptyMatrix.push({alive:false});
        }

        this.setState({generationCount : 0});
    }
    changeHeight () {
        if((this.refs.inputHeight.value<10) || (this.refs.inputHeight.value>50))
        {
            height = 10;
        }
        else
        {
            height = this.refs.inputHeight.value;
        }
        cells  = width*height;
        boardStyle = {
            margin: "0 auto",
            width: ""+22*height+"px",
            height: ""+22*width+"px  ",
            display: "flex",
            flexWrap: "wrap",
            border: "1px black solid",
            backgroundColor: "#330033",
            marginBottom : "20px"
        };
        emptyMatrix= [];
        matrix=[];
        for(let i=0;i<cells;i++)
        {
            matrix.push({alive:false});
            emptyMatrix.push({alive:false});
        }
        this.setState({generationCount : 0});

    }
    render() {

        return (
            <div>
              <h2>Welcome to game of life</h2>
                Width:&nbsp;&nbsp;
                <input type="number" ref="inputWidth" placeholder="10" onChange={this.changeWidth.bind(this)} />&nbsp;&nbsp;&nbsp;Height:&nbsp;&nbsp;
                <input type="number" ref="inputHeight" placeholder="10" onChange={this.changeHeight.bind(this)}  />
                <p>Generation number : {this.state.generationCount} </p>
                <Board handleInc={this.addGen.bind(this)} clearGeneration={this.clearGen.bind(this)} />
            </div>
        );
      }
    }

class Board extends Component{
    constructor(props) {
        super(props);

        this.realHandleCellClick = this.realHandleCellClick.bind(this);

        this.state = {boardMatrix : matrix};

        $(events).on("onSpacesPress", this.onSpacePress.bind(this));
    }
    componentDidMount () {
        this.setState({boardMatrix : matrix});
        interval = setInterval(function () {
            $(events).trigger("onSpacesPress");
        },delay);
    }
    onSpacePress () {

        this.props.handleInc();
        this.setState({boardMatrix:calcul(this.state.boardMatrix)});
    }
    // Change Cell State Living or Dead

    clearBoard () {
        clearInterval(interval);
        this.props.clearGeneration();
        this.setState({boardMatrix:calcul(emptyMatrix)});
        matrix = emptyMatrix;
        helpMatrix = emptyMatrix;
    }
    runBoard () {
        clearInterval(interval);
        interval = setInterval(function () {
            $(events).trigger("onSpacesPress");
        },delay);
    }
    pauseBoard () {
        clearInterval(interval);
    }
    realHandleCellClick(ClickedId){
        helpMatrix = this.state.boardMatrix;
        helpMatrix[Number(ClickedId)].alive = !helpMatrix[Number(ClickedId)].alive;
        this.setState({boardMatrix:helpMatrix});

    }
    render () {

        let c = [];
        for(let i=0; i<cells; i++) {

            c.push(<Cell key={i} id={i} cells={c} handleCellClick={this.realHandleCellClick} alive={this.state.boardMatrix[i].alive}/>)
        }

        return(
            <div>
                <div style={boardStyle} id="board">
                    {c}
                </div>
                <button onClick={this.clearBoard.bind(this)}>Clear</button>&nbsp;&nbsp;
                <button onClick={this.runBoard} >Run</button>&nbsp;&nbsp;
                <button onClick={this.pauseBoard} >Pause</button>
            </div>
        );
    }
}
class Cell extends Component{
    constructor(props) {
        super(props);
        this.state = {living : false}
    }
    // Change Cell State Living or Dead
    componentWillReceiveProps(nextProps) {
        this.setState({living : nextProps.alive});
    }
    render () {
        let aliveStyle = (this.state.living) ? "alive":"dead";

        return(<div id={this.props.id} className={aliveStyle + " cell"} onClick={() => { this.props.handleCellClick(this.props.id) }} ></div>);
    }
}

$(document).keydown(function(e){

    if( e.which === 32){
        //space
        $(events).trigger("onSpacesPress");
    }
});


export default App;
