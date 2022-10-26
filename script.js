class Box{
    constructor (x,y){
        this.x=x; 
        this.y=y ;
    }
    
    getTopBox(){
        if (this.y===0) return null;
        return new Box(this.x,this.y-1)
    }
    getBottomBox(){
        if (this.y===3) return null;
        return new Box(this.x,this.y+1)
    }
    getLeftBox(){
        if (this.x===0) return null;
        return new Box(this.x-1,this.y)
    }
    getRightBox(){
        if (this.x===3) return null;
        return new Box(this.x+1,this.y)
    }
    
    getNextdoorBoxes(){
        return [
            this.getTopBox(),
            this.getRightBox(),
            this.getBottomBox(),
            this.getLeftBox()
        ].filter(box=>box =! null);
    }
    getrandomNextdoorbox(){
        const nextdoorboxes=this.getNextdoorBoxes();
        return nextdoorboxes[Math.floor(Math.random()*nextdoorboxes.length)];
    }
}
const swapBoxes =(grid,box1,box2)=>{
    const temp= grid[box1.y][box1.x];
    grid[box1.y][box1.x]=grid[box2.y][box2.x];
    grid[box2.y][box2.x]=temp;
}

const issolve = grid=>{
    return (
        grid[0][0]== 1 && 
        grid[0][1]== 2 && 
        grid[0][2]== 3 && 
        grid[0][3]== 4 && 
        grid[1][0]== 5 && 
        grid[1][1]== 6 && 
        grid[1][2]== 7 && 
        grid[1][3]== 8 && 
        grid[2][0]== 9 && 
        grid[2][1]== 10 && 
        grid[2][2]== 11 && 
        grid[2][3]== 12 && 
        grid[3][0]== 13 && 
        grid[3][1]== 14 && 
        grid[3][2]== 15 && 
        grid[3][3]== 0  
        
        )
}
const getRandomGrid=()=>{
    let grid=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
    let blankbox =new Box(3,3);
    for (let i=0;i<1000;i++){
        const randomNextdoorbox=blankbox.getrandomNextdoorbox();
        swapBoxes(grid,blankbox,randomNextdoorbox);
        blankbox=randomNextdoorbox;
    }
    if (issolve(grid))return getRandomGrid();
    return grid;
};

class State{
    constructor (grid,move,time,status){
        this.time =time;
        this.grid=grid;
        this.status=status;
        this.move=move;
    }
    static ready(){
        return new State(
            [[0,0,0,0],[0,0,0,0][0,0,0,0][0,0,0,0]],
            0,
            0,
            "ready"
        );
    }
    static start(){
        return new State(getRandomGrid(),0,0,"playing");
    }
}

class Game{
    constructor (state){
        this.state=state;
        this.tickid=null;
        this.tick=this.tick.bind(this);
        this.render();
        this.handleClickBox=this.handleClickBox.bind(this)
    }
    static ready(){
        return new Game(State.ready());
    }
    tick(){
        this.setState({time:this.state.time+1})
    }
    setState(newstate){
        this.state={...this.state,...newstate};
        this.render();
    }
    handleClickBox(box){
        return function(){
            const nextdoorboxes=box.getNextdoorBoxes();
            const blankbox =nextdoorboxes.find(
                nextdoorboxes=>this.state.grid[nextdoorboxes.y][nextdoorboxes.x]===0
            );
            if (blankbox){
                const newGrid=[...this.state.grid];
                swapBoxes(newGrid,box,blankbox);
                if (issolve(newGrid)){
                    clearInterval(this.tickid);
                    this.setState({
                        status:"won",
                        grid:newGrid,
                        move:this.state.move+1

                    });
                    
                }
                else{
                    this.setState({
                        grid:newGrid,
                        move:this.state.move+1
                    })
                }
            }
        }.bind(this.)
    }
    render(){
        const {grid,move,time,status}=this.state;
        //rander grid 
        const newGrid=document.createElement("div");
        newGrid.className="container";
        for (let i=0;i<4;i++){
            for (let j=0;j<4;j++){
                const button=document.createElement("button");
                if (status==="playing"){
                    button.addEventListener("click",this.handleClickBox())
                }
                button.textContent=grid[i][j]===0?'':grid[i][j].toString();
                newGrid.appendChild(button);
            }
        }
        document.querySelector(".container").replaceChild(newGrid);

        const newButton=document.createElement("button");
        if (status==="ready") newButton.textContent='Play';
        if (status==="playing") newButton.textContent='Reset';
        if (status==="won") newButton.textContent='Play';
        newButton.addEventListener("click",()=>{
            clearInterval(this.tickid);
            this.tickid= setInterval(this.tick,1000);
            this.setState(State.start());
        });
        document.querySelector(".gamestart button").replaceWith(newButton);

        document.getElementById("move").textContent=`move ${move}`;
        document.getElementById("time").textContent=`time ${time}`;

    }
}

const GAME=Game.ready();