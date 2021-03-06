(function() {

    "use strict"

    const maze = document.querySelector('.grid');
    // for testing add 51, 92, 93 (blocking intersections)
    const walls = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 
        11, 12,
        21, 22, 24, 25, 26, 27, 28, 29,
        31, 32, 39,
        41, 42, 43, 44, 45, 46, 47, 49,
        55, 59,
        61, 63, 65, 67, 68, 69,
        70, 71, 73, 77, 79,
        83, 84, 85, 86, 87, 89,
        90, 91, 99
    ];
    const START = 60;
    const END = 19;

    /**
     * Builds a maze with predefined walls and a predefined size
     *
     * @param {Object} {maze, walls, start, end, width, height}
     * @returns
     */
    function manualMazeBuilder({maze, walls, start, end, width, height}) {
        maze.style.gridTemplateRows = `repeat(${height}, 1fr)`;
        maze.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        let size = height * width;
        const squares = [];
        for(let i = 0; i < size; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            squares.push(square);
            if(walls.includes(i)) {
                square.classList.add('wall');
            }
            if(i === start) {
                square.classList.add('start');
            }
            if(i === end) {
                square.classList.add('end');
            }
            maze.appendChild(square);
        }
        return squares;
    }

    const squares = manualMazeBuilder({
        maze,
        walls,
        start: START,
        end: END,
        width: 10,
        height: 10
    });

    // solve the maze
    function solve(start, end) {
        const directions = {
            up: (x)=> x - 10,
            right: (x)=> x + 1,
            down: (x)=> x + 10,
            left: (x)=> x - 1
        };

        function random(max, min=0) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function getColumn(x, width) {
            return x % width;
        }

        function getRow(x, width) {
            return Math.floor(x / width);
        }

        function leftEdge(x, width) {
            return x % width == 0;
        }
    
        function rightEdge(x, width) {
            return (x + 1) % width == 0;
        }
    
        function topEdge(x, width) {
            return x >= 0 && x <= width - 1;
        }
    
        function bottomEdge(x, width, max) {
            return x >= max - width && x < max;
        }

        function applyClass(cssClass, x) {
            if(x !== start && x !== end) {
                squares[x].classList.add(cssClass);
            }
        }

        let current = start;
        const used = []
        const intersections = [];
        while(current !== end) {
            let keys = Object.keys(directions);

            // eliminate directions that go off the maze
            if(topEdge(current, 10)) {
                keys = keys.filter(key => !key.includes('up'))
            }
            if(bottomEdge(current,10, 100)) {
                keys = keys.filter(key => !key.includes('down'))
            }
            if(leftEdge(current, 10)) {
                keys = keys.filter(key => !key.includes('left'))
            }
            if(rightEdge(current, 10)) {
                keys = keys.filter(key => !key.includes('right'))
            }

            //find the available squares from the current square
            let availableSquares = [];
            keys.forEach((key)=> availableSquares.push(directions[key](current)));
            availableSquares = availableSquares.filter((square)=> {
                return !squares[square].classList.contains('wall') && !used.includes(square);
            });

            if(availableSquares.length === 1) {
                applyClass('path', current)
                used.push(current);
                current = availableSquares[0];
            } else if(availableSquares.length > 1) {
                applyClass('path', current);
                intersections.push(current);
                let nextSquare;
                // 1. if end is up and to the left
                if(getRow(current, 10) > getRow(end, 10) && getColumn(current, 10) > getColumn(end, 10)) {
                    console.log('upleft');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === 10 || current - square === 1;
                    });
                // 2. if end is on the same row and to the left
                } else if(getRow(current, 10) === getRow(end, 10) && getColumn(current, 10) > getColumn(end, 10)) {
                    console.log('left');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === 1;
                    });
                // 3. if end is down and to the left
                } else if(getRow(current, 10) < getRow(end, 10) && getColumn(current, 10) > getColumn(end, 10)) {
                    console.log('downleft');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === -10 || current - square === 1;
                    });
                // 4. if end is down and in the same column
                } else if(getRow(current, 10) < getRow(end, 10) && getColumn(current, 10) === getColumn(end, 10)) {
                    console.log('down');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === 10;
                    });
                // 5. if down and to the right
                } else if(getRow(current, 10) < getRow(end, 10) && getColumn(current, 10) < getColumn(end, 10)) {
                    console.log('downright');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === 10 || current - square === -1;
                    });
                // 6. if same row and to the right
                } else if(getRow(current, 10) === getRow(end, 10) && getColumn(current, 10) < getColumn(end, 10)) {
                    console.log('right');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === -1;
                    });
                // 7. if up and to the right
                } else if(getRow(current, 10) > getRow(end, 10) && getColumn(current, 10) < getColumn(end, 10)) {
                    console.log('upright');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === -10 || current - square === -1;
                    });
                // 8. if up and same column
                } else if(getRow(current, 10) > getRow(end, 10) && getColumn(current, 10) === getColumn(end, 10)) {
                    console.log('up');
                    nextSquare = availableSquares.find((square)=> {
                        return current - square === -10;
                    });
                }

                // if an optimal square was found
                console.log(nextSquare)
                if(nextSquare) {
                    used.push(current);
                    applyClass('path', current);
                    current = nextSquare;
                } else {
                    let temp = current;
                    current = availableSquares[random(availableSquares.length)];
                    used.push(temp);
                    applyClass('path', current);
                }
            } else {
                console.log('dead end: ', intersections, current);
                if(intersections === []) {
                    // then there's no solution
                    console.log('no solution')
                    break;
                }
                let intersection = intersections.pop();
                let invalids = used.slice(used.indexOf(intersection - 1));  // minus 1?
                invalids.forEach(invalid => squares[invalid].classList.add('invalid'));
                current = intersection;
                console.log(current);
            }
        }
        return current === end;
    }

    document.getElementById('solve').addEventListener('click', solve.bind(null, START, END));
    document.getElementById('clear').addEventListener('click', ()=> {
        squares.filter(square => !square.classList.contains('wall')).forEach(square=> {
            square.classList.remove('path');
            square.classList.remove('invalid');
        });
    });
    //solve(START, END)
})();