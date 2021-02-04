export function Dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    helper(grid, startNode, finishNode, visitedNodesInOrder);
    return visitedNodesInOrder;
}
function isSafe(grid,srow,scol) {
    return srow >= 0 && srow < grid.length && scol >= 0 && scol < grid[0].length && !grid[srow][scol].isVisited&&!grid[srow][scol].isWall;
}
function helper(grid, startNode, finishNode, visitedNodesInOrder) {
    const stack = [];
    stack.push(grid[startNode.row][startNode.col]);
    while (stack.length) {
        const x = stack.pop();
        if (x.row===finishNode.row&&x.col===finishNode.col) {
            visitedNodesInOrder.push(x);
            break;
        }
        x.isVisited = true;
        visitedNodesInOrder.push(x);
        if (isSafe(grid, x.row+1, x.col)) {
            stack.push(grid[x.row+1][x.col]);
        }
        if (isSafe(grid, x.row, x.col - 1)) {
            stack.push(grid[x.row][x.col - 1]);
        }
        if (isSafe(grid, x.row, x.col+1)) {
            stack.push(grid[x.row][x.col+1]);
        }
        if (isSafe(grid, x.row-1, x.col)) {
            stack.push(grid[x.row-1][x.col]);
        }
    }
}