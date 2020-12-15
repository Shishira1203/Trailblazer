var shortestPathInOrderArray;
export function Astar(grid, startNode, finishNode,selectedheuristic) {
    shortestPathInOrderArray = [startNode];
    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            grid[x][y].f = 0;
            grid[x][y].g = 0;
            grid[x][y].h = 0;
        }
    }
    const visitedNodesInOrder = [];
    const openList = [], closedList = [];
    openList.push(startNode);
    visitedNodesInOrder.push(startNode);
    while (openList.length) {
        var lowInd = 0;
        for (var k = 0; k < openList.length; k++){
            if (openList[k].f < openList[lowInd].f) {
                lowInd = k;
            }
        }
        var currentNode = openList[lowInd];
        if (currentNode.row === finishNode.row&&currentNode.col===finishNode.col) {
            var curr = currentNode;
            shortestPathInOrderArray.splice(0, shortestPathInOrderArray.length);
            while (curr.previousNode) {
                shortestPathInOrderArray.push(curr);
                curr = curr.previousNode;
            }
            shortestPathInOrderArray.reverse();
            shortestPathInOrderArray.unshift(startNode);
            return visitedNodesInOrder;
        }
        openList.splice(lowInd, 1);
        closedList.push(currentNode);
        var neighbors = neighborss(grid, currentNode);

        for (var i =0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (findGraphNode(closedList,neighbor) || neighbor.isWall) {
                continue;
            }
            var gScore = currentNode.g + 1;
            var gScoreIsBest = false;

            if (!findGraphNode(openList,neighbor)) {
                gScoreIsBest = true;
                if (selectedheuristic === "Euclidean") {
                    neighbor.h = heuristicEuclidean(neighbor, finishNode);
                }
                else if (selectedheuristic === "Manhattan") {
                    neighbor.h = heuristicManhattan(neighbor, finishNode);
                }
                else {
                    neighbor.h = heuristicDiagonal(neighbor, finishNode);
                }
                openList.push(neighbor);
                visitedNodesInOrder.push(neighbor);
            }

            else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighbor.previousNode = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }
    return [startNode];
}
export function shortestPathInOrder() {
    return shortestPathInOrderArray;
}
function findGraphNode(list, node) {
    for (var i = 0; i < list.length; i++){
        if (list[i] === node) return true;
    }
    return false;
}

function heuristicEuclidean(node1, node2) {
    var d1 = Math.abs(node1.row - node2.row);
    var d2 = Math.abs(node1.col - node2.col);
    return Math.sqrt(d1*d1 + d2*d2);
}

function heuristicDiagonal(node1, node2) {
    var d1 = Math.abs(node1.row - node2.row);
    var d2 = Math.abs(node1.col - node2.col);
    return Math.max(d1,d2);
}

function heuristicManhattan(node1, node2) {
    var d1 = Math.abs(node1.row - node2.row);
    var d2 = Math.abs(node1.col - node2.col);
    return d1 + d2;
}

function neighborss(grid, node) {
    var ret = [];
    var x = node.row;
    var y = node.col;

    if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
    }
    if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
    }
    if (grid[x][y - 1] && grid[x][y - 1]) {
        ret.push(grid[x][y - 1]);
    }
    if (grid[x][y + 1] && grid[x][y + 1]) {
        ret.push(grid[x][y + 1]);
    }
    return ret;
}