import React, { Component } from 'react';
import Node from './Node.jsx';
import '../App.css';
import { Dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { Dfs } from '../algorithms/dfs';
import { Bfs } from '../algorithms/bfs';
import Header from './HeaderComponent.jsx';

const S_NODE_ROW = 10;
const S_NODE_COL = 15;
const F_NODE_ROW = 10;
const F_NODE_COL = 35;


const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 24; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (row, col) => {
    return {
        col,
        row,
        isStart: row === S_NODE_ROW && col === S_NODE_COL,
        isFinish: row === F_NODE_ROW && col === F_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

export default class Trailblazer extends Component{
    constructor() {
        super();
        this.state = {
            grid: [],
            mousePressed: false,
            toChange: null,
            disabled:false,
        };
        this.resetGrid = this.resetGrid.bind(this);
        this.visualizeDfs = this.visualizeDfs.bind(this);
        this.visualizeBfs = this.visualizeBfs.bind(this);
    }

    resetGrid() {
        const grid = getInitialGrid();
        this.setState({ grid:grid,disabled: false });
        const toChange = this.state.toChange;
        if (toChange !== null) {
            for (let i = 0; i < toChange.length; i++) {
                const node = toChange[i];
                if (node.row === S_NODE_ROW && node.col === S_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                }
                else if (node.row === F_NODE_ROW && node.col === F_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                }
                else {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                }
            }
        }
        
    }

    componentDidMount() {
        this.resetGrid();
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mousePressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mousePressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid});
    }

    handleMouseUp() {
        this.setState({ mousePressed: false });
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++){
            if (i === visitedNodesInOrder.length) {
                setTimeout(() =>{
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
        for (let i = 0; i <= nodesInShortestPathOrder.length; i++){
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
        const { grid } = this.state;
        const startNode = grid[S_NODE_ROW][S_NODE_COL];
        const finishNode = grid[F_NODE_ROW][F_NODE_COL];
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.setState({ disabled: !this.state.disabled });

    }

    visualizeDfs() {
        const grid = this.state.grid;
        const startNode = grid[S_NODE_ROW][S_NODE_COL];
        const finishNode = grid[F_NODE_ROW][F_NODE_COL];
        const visitedNodesInOrder = Dfs(grid, startNode, finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.animateDfs(visitedNodesInOrder);
        this.setState({ disabled: !this.state.disabled });
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
        const grid = this.state.grid;
        const startNode = grid[S_NODE_ROW][S_NODE_COL];
        const finishNode = grid[F_NODE_ROW][F_NODE_COL];
        const visitedNodesInOrder = Bfs(grid, startNode, finishNode);
        this.setState({ ...this.state, toChange: visitedNodesInOrder });
        this.animateBfs(visitedNodesInOrder);
        this.setState({ disabled: !this.state.disabled });   
    }

    render() {
        const { grid, mousePressed } = this.state;
        return (
            <>
                <Header Reset={this.resetGrid} Dijkstra={()=>this.visualizeDijkstra()} Dfs={this.visualizeDfs} Bfs={this.visualizeBfs} disabled={this.state.disabled} />
                <div className="grid" disabled={this.state.disabled}>
                    {
                        grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}className="row">
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