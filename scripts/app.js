(function() {
    const maze = document.querySelector('.grid');
    const squares = []
    // for testing add 51, 92, 93 (blocking intersections)
    const walls = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 
        11, 12,
        21, 22, 24, 25, 26, 27, 28, 29,
        31, 32, 39,
        41, 42, 43, 44, 45, 46, 47, 49,
        51, 55, 59,
        61, 63, 65, 67, 68, 69,
        70, 71, 73, 77, 79,
        83, 84, 85, 86, 87, 89,
        90, 91, 92, 93, 99]
    const START = 80;
    const END = 19;

    // build the maze
    for(let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        squares.push(square);
        if(walls.includes(i)) {
            square.classList.add('wall');
        }
        if(i === START) {
            square.classList.add('start');
        }
        if(i === END) {
            square.classList.add('end');
        }
        maze.appendChild(square);
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

    // solve the maze
    function solve(start, end) {
        const directions = {
            // upleft: (x)=> x - 10 - 1,
            up: (x)=> x - 10,
            // upright: (x)=> x - 10 + 1,
            right: (x)=> x + 1,
            // downright: (x)=> x + 10 + 1,
            down: (x)=> x + 10,
            // downleft: (x)=> x + 10 - 1,
            left: (x)=> x - 1
        };

        let current = start;
        let counter = 0;
        const used = []
        while(counter < 35) {
            console.log("current: ", current);
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
            availableSquares = [];
            keys.forEach((key)=> availableSquares.push(directions[key](current)));
            availableSquares = availableSquares.filter((position)=> {
                return !squares[position].classList.contains('wall') && !used.includes(position);
            });
            console.log(availableSquares);
            if(availableSquares.length === 1) {
                if(current !== start && current !== end) {
                    squares[current].classList.add('path');
                }
                used.push(current);
                current = availableSquares[0];
            }
            counter += 1;
            if(current === end) {
                break;
            }
        }
        console.log(used);
    }

    //solve(START, END)
    window.solve = solve;
})();