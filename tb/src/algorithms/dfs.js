export function Dfs(grid, startNode) {
    const visitedNodesInOrder = [];
    helper(grid, startNode.row, startNode.col, visitedNodesInOrder);
    return visitedNodesInOrder;
}
function isSafe(grid,srow,scol) {
    return srow >= 0 && srow < grid.length && scol >= 0 && scol < grid[0].length && !grid[srow][scol].isVisited&&!grid[srow][scol].isWall;
}
function helper(grid, srow, scol, visitedNodesInOrder) {
    const stack = [];
    stack.push(grid[srow][scol]);
    console.log(stack);
    while (stack.length) {
        const x = stack.pop();
        if (x.isFinish) {
            visitedNodesInOrder.push(x);
            break;
        }
        visitedNodesInOrder.push(x);
        x.isVisited = true;
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