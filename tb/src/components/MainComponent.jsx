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
            T_NODE_ROW: 0,
            T_NODE_COL: 0,
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
            isStart: row === this.state.S_NODE_ROW && col === this.state.S_NODE_COL,
            isFinish: row === this.state.F_NODE_ROW && col === this.state.F_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    };

    getInitialGrid(){
        const grid = [];
        for (let row = 0; row < 24; row++) {
            const currentRow = [];
            for (let col = 0; col < 55; col++) {
                currentRow.push(this.createNode(row, col));
            }
            grid.push(currentRow);
        }
        return grid;
    };

    getNewGridWithWallToggled(grid, row, col){
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    resetOnlyVisited() {
        const { toChange } = this.state;
        if (toChange !== null) {
            for (let i = 0; i < toChange.length; i++) {
                const node = toChange[i];
                node.isVisited = false;
                if (node.row === this.state.S_NODE_ROW && node.col === this.state.S_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                }
                else if (node.row === this.state.F_NODE_ROW && node.col === this.state.F_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                }
                else if(this.state.grid[node.row][node.col].isWall){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
                }
                else {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                }
            }
        }
    }


    resetGrid() {
        const grid = this.getInitialGrid();
        this.setState({ grid: grid, disabled: false });
        const toChange = this.state.toChange;
        if (toChange !== null) {
            for (let i = 0; i < toChange.length; i++) {
                const node = toChange[i];
                if (node.row === this.state.S_NODE_ROW && node.col === this.state.S_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                }
                else if (node.row === this.state.F_NODE_ROW && node.col === this.state.F_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                }
                else if(!node.isWall){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                }
            }
        }
    }

    componentDidMount() {
        this.resetGrid();
    }

    handleStart(grid,row, col) {
        const newGrid = grid.slice();
        newGrid[this.state.S_NODE_ROW][this.state.S_NODE_COL].isStart = false;
        const node = grid[row][col];
        const newNode = {
            ...node,
            isStart: true,
        };
        this.setState({ S_NODE_ROW: row, S_NODE_COL: col });
        newGrid[row][col] = newNode;
        return newGrid;
    }

    handleFinish(grid, row, col) {
        const newGrid = grid.slice();
        newGrid[this.state.F_NODE_ROW][this.state.F_NODE_COL].isFinish = false;
        const node = grid[row][col];
        const newNode = {
            ...node,
            isFinish: true,
        };
        this.setState({ F_NODE_ROW: row, F_NODE_COL: col });
        newGrid[row][col] = newNode;
        return newGrid;
    }

    handleMouseDown(row, col) {
        if (row === this.state.S_NODE_ROW && col === this.state.S_NODE_COL) {
            this.setState({ start: true });
        }
        if (row === this.state.F_NODE_ROW && col === this.state.F_NODE_COL) {
            this.setState({ finish: true });
        }
        const newGrid = this.state.start?this.handleStart(this.state.grid,row,col):this.state.finish?this.handleFinish(this.state.grid,row,col):this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mousePressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mousePressed) return;
        const newGrid = this.state.start ? this.handleStart(this.state.grid, row, col) : this.state.finish ? this.handleFinish(this.state.grid, row, col) : this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mousePressed: false,start:false,finish:false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
            if (i === nodesInShortestPathOrder.length) {
                setTimeout(() => {
                    this.setState({ disabled: !this.state.disabled });
                }, 50 * i);
                return;
            }
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 50 * i);
        }
    }

    animateDfs(visitedNodesInOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(visitedNodesInOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }

    visualizeDijkstra() {
        this.resetOnlyVisited();
        const { grid } = this.state;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.setState({ disabled: !this.state.disabled, mousePressed: false });

    }

    visualizeDfs() {
        this.resetOnlyVisited();
        const { grid } = this.state;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        console.log(startNode, finishNode);
        const visitedNodesInOrder = Dfs(grid, startNode, finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.animateDfs(visitedNodesInOrder);
        this.setState({ disabled: !this.state.disabled, mousePressed: false });
    }

    animateBfs(visitedNodesInOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(visitedNodesInOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }

    visualizeBfs() {
        this.resetOnlyVisited();
        const grid = this.state.grid;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        const visitedNodesInOrder = Bfs(grid, startNode, finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.setState({ disabled: !this.state.disabled, mousePressed: false });
        this.animateBfs(visitedNodesInOrder);
    }

    animateAstar(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }


    visualizeAstar(heuristic) {
        this.resetOnlyVisited();
        const grid = this.state.grid;
        const startNode = grid[this.state.S_NODE_ROW][this.state.S_NODE_COL];
        const finishNode = grid[this.state.F_NODE_ROW][this.state.F_NODE_COL];
        const visitedNodesInOrder = Astar(grid, startNode, finishNode,heuristic);
        const nodesInShortestPathOrder = shortestPathInOrder();
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.setState({ disabled: !this.state.disabled, mousePressed: false });
        this.animateAstar(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    render() {
        const { grid, mousePressed } = this.state;
        return (
            <>
                <Header Reset={this.resetGrid} Dijkstra={() => this.visualizeDijkstra()} Dfs={this.visualizeDfs} Bfs={this.visualizeBfs} Astar={(heuristic)=>this.visualizeAstar(heuristic)} disabled={this.state.disabled} />
                <div className="grid" disabled={this.state.disabled}>
                    {
                        grid.map((row, rowIdx) => {
                            return (
                                <div key={rowIdx} className="row">
                                    {
                                        row.map((node, nodeIdx) => {
                                            const { row, col, isFinish, isStart, isWall } = node;
                                            return (
                                                <Node
                                                    key={nodeIdx}
                                                    col={col}
                                                    isFinish={isFinish}
                                                    isStart={isStart}
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