import React, { Component } from 'react';
import Node from './Node.jsx';
import '../App.css';
import { Dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { Dfs } from '../algorithms/dfs';
import { Bfs } from '../algorithms/bfs';
import { Astar, shortestPathInOrder } from '../algorithms/astar';
import Header from './HeaderComponent.jsx';

export default class Trailblazer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mousePressed: false,
            toChange: null,
            disabled: false,
            S_NODE_ROW: 10,
            S_NODE_COL: 15,
            F_NODE_ROW: 10,
            F_NODE_COL: 36,
            start: false,
            finish: false,
            visitedCount: 0,
            shortestPathCount:0,
            timeComplexity:0,
        };
        this.resetGrid = this.resetGrid.bind(this);
        this.visualizeDfs = this.visualizeDfs.bind(this);
        this.visualizeBfs = this.visualizeBfs.bind(this);
        this.visualizeAstar = this.visualizeAstar.bind(this);
        this.visualizeDijkstra = this.visualizeDijkstra.bind(this);
    }

    createNode(row, col) {
        return {
            col,
            row,
            className:'node',
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    };

    getInitialGrid(){
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 55; col++) {
                currentRow.push(this.createNode(row, col));
            }
            grid.push(currentRow);
        }
        grid[this.state.S_NODE_ROW][this.state.S_NODE_COL].className = 'node node-start';
        grid[this.state.F_NODE_ROW][this.state.F_NODE_COL].className = 'node node-finish';
        return grid;
    };

    getNewGridWithWallToggled(row, col){
        const newGrid = this.state.grid.slice();
        const node = newGrid[row][col];
        if (row === this.state.S_NODE_ROW && col === this.state.S_NODE_COL) return newGrid;
        if (row === this.state.F_NODE_ROW && col === this.state.F_NODE_COL) return newGrid;
        const newNode = {
            ...node,
            isWall: !node.isWall,
            isVisited:false,
            className: node.isWall?'node':'node node-wall',
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    resetOnlyVisited() {
        const { toChange, grid } = this.state;
        const newGrid = grid.slice();
        if (toChange !== null) {
            for (let i = 0; i < toChange.length; i++) {
                const node = toChange[i];
                if (node.row===this.state.S_NODE_ROW&&node.col===this.state.S_NODE_COL) {
                    const nxode = grid[node.row][node.col];
                    const newNode = {
                        ...nxode,
                        isVisited: false,
                        className: 'node node-start'
                    };
                    newGrid[node.row][node.col] = newNode;
                }
                else if (node.row === this.state.F_NODE_ROW && node.col === this.state.F_NODE_COL) {
                    const nxode = grid[node.row][node.col];
                    const newNode = {
                        ...nxode,
                        isVisited: false,
                        className: 'node node-finish'
                    };
                    newGrid[node.row][node.col] = newNode;
                }
                else if (grid[node.row][node.col].isWall){
                    const nxode = grid[node.row][node.col];
                    const newNode = {
                        ...nxode,
                        isVisited: false,
                        isWall: true,
                        className: 'node node-wall'
                    };
                    newGrid[node.row][node.col] = newNode;
                }
                else {
                    const nxode = grid[node.row][node.col];
                    const newNode = {
                        ...nxode,
                        isVisited: false,
                        className: 'node'
                    };
                    newGrid[node.row][node.col] = newNode;
                }
            }
            for (const row of grid) {
                for (const node of row) {
                    node.distance = Infinity;
                }
            }
        }
        this.setState({ grid: newGrid, toChange: null, visitedCount: 0, shortestPathCount: 0,timeComplexity:0 });
    }


    resetGrid() {
        const grid = this.getInitialGrid();
        this.setState({ grid: grid, disabled: false,visitedCount:0,shortestPathCount:0,timeComplexity:0});
    }

    componentDidMount() {
        this.resetGrid();
    }

    handleStart(grid,row, col) {
        const newGrid = grid.slice();
        const change = newGrid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const ChangedNode = {
            ...change,
            isVisited:false,
            isStart: false,
            className:'node'
        }
        newGrid[this.state.S_NODE_ROW][this.state.S_NODE_COL] = ChangedNode;
        const node = grid[row][col];
        const newNode = {
            ...node,
            isVisited:false,
            isStart: true,
            className:'node node-start'
        };
        this.setState({ S_NODE_ROW: row, S_NODE_COL: col });
        newGrid[row][col] = newNode;
        return newGrid;
    }

    handleFinish(grid, row, col) {
        const newGrid = grid.slice();
        const change = newGrid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        const ChangedNode = {
            ...change,
            isVisited:false,
            isFinish: false,
            className: 'node'
        }
        newGrid[this.state.F_NODE_ROW][this.state.F_NODE_COL] = ChangedNode;
        const node = grid[row][col];
        const newNode = {
            ...node,
            isFinish: true,
            className:'node node-finish'
        };
        this.setState({ F_NODE_ROW: row, F_NODE_COL: col });
        newGrid[row][col] = newNode;
        return newGrid;
    }

    handleMouseDown(row, col) {
        if (row===this.state.S_NODE_ROW&&col===this.state.S_NODE_COL) {
            this.setState({ start: true });
        }
        if (row===this.state.F_NODE_ROW&&col===this.state.F_NODE_COL) {
            this.setState({ finish: true });
        }
        const newGrid = this.state.start?this.handleStart(this.state.grid,row,col):this.state.finish?this.handleFinish(this.state.grid,row,col):this.getNewGridWithWallToggled(row, col);
        this.setState({ grid: newGrid, mousePressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mousePressed||(row===this.state.S_NODE_ROW&&col===this.state.S_NODE_COL)||(row===this.state.F_NODE_ROW&&col===this.state.F_NODE_COL)) return;
        const newGrid = this.state.start ? this.handleStart(this.state.grid, row, col) : this.state.finish ? this.handleFinish(this.state.grid, row, col) : this.getNewGridWithWallToggled( row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mousePressed: false, start: false, finish: false });
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder,d,dfinal) {
        const newGrid = this.state.grid.slice();
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder,d,dfinal);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nxode = newGrid[node.row][node.col];
                const newNode = {
                    ...nxode,
                    previousNode: null,
                    distance:Infinity,
                    className: i===0?'node node-start-visited':i===visitedNodesInOrder.length-1?'node node-finish-visited':'node node-visited'
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({ grid: newGrid, visitedCount: this.state.visitedCount + 1 });
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder,d,dfinal) {
        const newGrid = this.state.grid.slice();
        for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
            if (i === nodesInShortestPathOrder.length) {
                setTimeout(() => {
                    this.setState({ disabled: !this.state.disabled,timeComplexity:dfinal-d});
                }, 50 * i);
                return;
            }
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                const nxode = newGrid[node.row][node.col];
                const newNode = {
                    ...nxode,
                    previousNode: null,
                    distance:Infinity,
                    className: i===0?'node node-start-shortest-path':i===nodesInShortestPathOrder.length-1?'node node-finish-shortest-path':'node node-shortest-path'
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({ grid: newGrid,shortestPathCount:this.state.shortestPathCount+1 });
            }, 50 * i);
        }
    }

    animateDfs(visitedNodesInOrder,d,dfinal) {
        const newGrid = this.state.grid.slice();
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(visitedNodesInOrder,d,dfinal);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nxode = newGrid[node.row][node.col];
                const newNode = {
                    ...nxode,
                    className: i === 0 ? 'node node-start-visited' : i === visitedNodesInOrder.length - 1 ? 'node node-finish-visited' : 'node node-visited'
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({ grid: newGrid,visitedCount:this.state.visitedCount+1 });
            }, 10 * i);
        }
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        this.resetOnlyVisited();
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        var d=new Date()/1000;
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        var dfinal=new Date()/1000;
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(startNode,finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder, visitedCount: 0, shortestPathCount: 0, disabled: !this.state.disabled, mousePressed: false,timeComplexity:0});
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder,d,dfinal);
    }

    visualizeDfs() {
        this.resetOnlyVisited();
        this.setState({timeComplexity:0});
        const { grid } = this.state;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        var d=new Date()/1000;
        const visitedNodesInOrder = Dfs(grid, startNode, finishNode);
        var dfinal=new Date()/1000;
        this.setState({ ...this.state, toChange: visitedNodesInOrder, visitedCount: 0, shortestPathCount: 0, disabled: !this.state.disabled, mousePressed: false,timeComplexity:0  });
        this.animateDfs(visitedNodesInOrder,d,dfinal);
    }

    animateBfs(visitedNodesInOrder,d,dfinal) {
        const newGrid = this.state.grid.slice();
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(visitedNodesInOrder,d,dfinal);
                }, 10 * i);
                this.setState({ grid: newGrid });
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nxode = newGrid[node.row][node.col];
                const newNode = {
                    ...nxode,
                    className: i === 0 ? 'node node-start-visited' : i === visitedNodesInOrder.length - 1 ? 'node node-finish-visited' : 'node node-visited'
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({ grid: newGrid, visitedCount: this.state.visitedCount + 1 });
            }, 10 * i);
        }
    }

    visualizeBfs() {
        this.resetOnlyVisited();
        const grid = this.state.grid;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        var d=new Date()/1000;
        const visitedNodesInOrder = Bfs(grid, startNode, finishNode);
        var dfinal=new Date()/1000;
        this.setState({ toChange: visitedNodesInOrder, visitedCount: 0, shortestPathCount: 0, disabled: !this.state.disabled, mousePressed: false });
        this.animateBfs(visitedNodesInOrder,d,dfinal);
    }

    animateAstar(visitedNodesInOrder, nodesInShortestPathOrder,d, dfinal) {
        const newGrid = this.state.grid.slice();
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder,d,dfinal);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nxode = newGrid[node.row][node.col];
                if (node.row === this.state.F_NODE_ROW && node.col === this.state.F_NODE_COL) {
                    const newNode = {
                        ...nxode,
                        className: 'node node-finish-visited'
                    };
                    newGrid[node.row][node.col] = newNode;
                    this.setState({ grid: newGrid, visitedCount: this.state.visitedCount + 1 });
                }
                else {
                    const newNode = {
                        ...nxode,
                        className: i === 0 ? 'node node-start-visited' : 'node node-visited'
                    };
                    newGrid[node.row][node.col] = newNode;
                    this.setState({ grid: newGrid, visitedCount: this.state.visitedCount + 1 });
                }
            }, 10 * i);
        }
    }


    visualizeAstar(heuristic) {
        this.resetOnlyVisited();
        const grid = this.state.grid;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        var d=new Date()/1000;
        const visitedNodesInOrder = Astar(grid, startNode, finishNode,heuristic);
        var dfinal=new Date()/1000;
        const nodesInShortestPathOrder = shortestPathInOrder();
        this.setState({ toChange: visitedNodesInOrder, visitedCount: 0, shortestPathCount: 0, disabled: !this.state.disabled, mousePressed: false  });
        this.animateAstar(visitedNodesInOrder, nodesInShortestPathOrder,d,dfinal);
    }

    render() {
        const { grid, mousePressed,visitedCount,shortestPathCount,disabled,timeComplexity } = this.state;
        return (
            <>
                <Header Reset={this.resetGrid} Dijkstra={() => this.visualizeDijkstra()} Dfs={this.visualizeDfs} Bfs={this.visualizeBfs} Astar={(heuristic)=>this.visualizeAstar(heuristic)} disabled={this.state.disabled} />
                <div className="container">
                    <div>Visited Nodes Count: {visitedCount}</div>
                    <div>Shortest Path Nodes Count: {shortestPathCount}</div>
                    <div>Time Complexity:{timeComplexity}s</div><br/>
                    <div className="row">
                    &nbsp;&nbsp;&nbsp;<div className='node node-start'></div>&nbsp;&nbsp;&nbsp;-Start Node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className='node node-finish'></div>&nbsp;&nbsp;&nbsp;-Finish Node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className='node node-wall'></div>&nbsp;&nbsp;&nbsp;-Wall Node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className='node node-visited'></div>&nbsp;&nbsp;&nbsp;-Visited Node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className='node node-shortest-path'></div>&nbsp;&nbsp;&nbsp;-Shortest Path Node
                    </div>
                </div>
                
                <div className="grid" disabled={disabled}>
                    {
                        grid.map((row, rowIdx) => {
                            return (
                                <div key={rowIdx} className="row">
                                    {
                                        row.map((node, nodeIdx) => {
                                            const { row, col, isWall,className } = node;
                                            return (
                                                <Node
                                                    className={className}
                                                    key={nodeIdx}
                                                    col={col}
                                                    isWall={isWall}
                                                    mousePressed={mousePressed}
                                                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                                    onMouseUp={() => this.handleMouseUp()}
                                                    row={row}>
                                                </Node>
                                            );
                                        })}
                                </div>
                            );
                        })}
                </div>
            </>
        );
    }
}