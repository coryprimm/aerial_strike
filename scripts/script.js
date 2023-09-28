document.addEventListener("DOMContentLoaded", function () {
    // Initialize game boards
    let userscore = 0;
    let machinescore = 0;
    let userturn = true; 
    
    let outerspace = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
    ];

    let mirrorouterspace = [...outerspace];

    let machineouterspace = Array(5).fill(Array(5).fill(0));
    let bravenewouterspace = Array(5).fill(Array(5).fill(0));

    let spaceship = { x: 2, y: 2 };

    const outerspaceDict = {
        0: 'blank',
        1: 'wall',
        2: 'usermissile',
        3: 'machinemissile',
        5: 'userplane',
        6: 'machineplane',
        8: 'explosion_image',
    };

    drawSpace(outerspace, 'outerspace');
    drawSpace(bravenewouterspace, 'bravenewouterspace');

    /**
     * Counts and returns the number of specific cells in the game board.
     *
     * @param {Array} outerspace - The game board represented as a 2D array.
     * @returns {number} The count of specific cells (based on userturn).
     */
    function countEm(outerspace) {
        let countSquares = 0;

        outerspace.forEach(row => {
            row.forEach(cell => {
                countSquares += userturn ? (cell === 2) : (cell === 5) ? 1 : 0;
            });
        });

        return countSquares;
    }

    /**
     * Renders the game board represented by a 2D array as HTML elements inside a specified container.
     *
     * @param {Array} spaceArray - The game board represented as a 2D array.
     * @param {string} containerId - The ID of the HTML container where the board should be rendered.
     */
    function drawSpace(spaceArray, containerId) {
        const output = spaceArray.map(row =>
            `<div class='row'>
                ${row.map(cell => `<div class='${outerspaceDict[cell]}'></div>`).join('')}
            </div>`
        ).join('');
        document.getElementById(containerId).innerHTML = output;
    }

    /**
     * Updates the positions on the game board with a new value based on the specified positions array.
     *
     * @param {Array} outerspace - The game board represented as a 2D array.
     * @param {Array} positions - An array of positions to be updated with the new value.
     * @param {number} newValue - The new value to set at the specified positions.
     */
    function updatePositions(outerspace, positions, newValue) {
        positions.filter((pos) => {
            return outerspace[pos.y][pos.x] !== 2 && outerspace[pos.y][pos.x] !== 5;
        }).forEach((pos) => {
            outerspace[pos.y][pos.x] = newValue;
        });
    }

    /**
     * Generates a random machine-controlled pattern on the game board.
     * The pattern consists of missiles or planes controlled by the machine.
     *
     * @returns {Array} The machine-controlled pattern represented as a 2D array.
     */
    function makemachinew() {
        let machinecount = 0, machinedict = {};
        for (var i = 0; i < 5; i++) {
            machineouterspace[i] = [];
            for (var j = 0; j < 5; j++) {
                machineouterspace[i][j] = 0;
            }
        }
        while (machinecount < 5) {
            const x = Math.floor(Math.random() * 5);
            const y = Math.floor(Math.random() * 5);
            const strxy = `${x}${y}`;
            if (!machinedict[strxy]) {
                machinedict[strxy] = true;
                machineouterspace[x][y] = !userturn ? 6 : 3;
                machinecount++;
            }
        }
        drawSpace(bravenewouterspace, 'bravenewouterspace');
        return machineouterspace;
    }

    /**
     * Computes the element-wise summation of two 2D arrays.
     *
     * @param {Array} mA - The first 2D array.
     * @param {Array} mB - The second 2D array.
     * @returns {Array} The result of element-wise summation as a new 2D array.
     * * Each cell in the resulting array is the sum of the corresponding cells in mA and mB.
     */
    function sumation(mA, mB) {
        return mA.map((row, i) =>
            row.map((cell, j) =>
                cell + mB[i][j]
            )
        );
    }

    //Handle keyboard inputs
    document.onkeydown = function (e) {
        if (e.keyCode === 37 && spaceship.x > 0) {
            spaceship.x--;
            updatePositions(outerspace, [
                { y: spaceship.y, x: spaceship.x + 1 },
                { y: spaceship.y, x: spaceship.x - 1 },
                { y: spaceship.y + 1, x: spaceship.x - 1 },
                { y: spaceship.y - 1, x: spaceship.x - 1 },
                { y: spaceship.y + 1, x: spaceship.x + 1 },
                { y: spaceship.y - 1, x: spaceship.x + 1 },
            ], 1);
            updatePositions(outerspace, [
                { y: spaceship.y, x: spaceship.x + 2 },
                { y: spaceship.y + 1, x: spaceship.x + 2 },
                { y: spaceship.y - 1, x: spaceship.x + 2 },
            ], 0);

            drawSpace(outerspace, 'outerspace');
        }
        if (e.keyCode === 39 && spaceship.x + 1 !== 4) {
            spaceship.x++;
            updatePositions(outerspace, [
                { y: spaceship.y, x: spaceship.x - 1 },
                { y: spaceship.y, x: spaceship.x + 1 },
                { y: spaceship.y - 1, x: spaceship.x - 1 },
                { y: spaceship.y + 1, x: spaceship.x - 1 },
                { y: spaceship.y - 1, x: spaceship.x + 1 },
                { y: spaceship.y + 1, x: spaceship.x + 1 },
            ], 1);

            updatePositions(outerspace, [
                { y: spaceship.y, x: spaceship.x - 2 },
                { y: spaceship.y + 1, x: spaceship.x - 2 },
                { y: spaceship.y - 1, x: spaceship.x - 2 },
            ], 0);

            drawSpace(outerspace, 'outerspace');
        }
        if (e.keyCode === 38 && spaceship.y - 1 !== 0) {
            spaceship.y--;
            updatePositions(outerspace, [
                { y: spaceship.y + 1, x: spaceship.x },
                { y: spaceship.y - 1, x: spaceship.x },
                { y: spaceship.y + 1, x: spaceship.x - 1 },
                { y: spaceship.y - 1, x: spaceship.x - 1 },
                { y: spaceship.y - 1, x: spaceship.x + 1 },
                { y: spaceship.y + 1, x: spaceship.x + 1 },
            ], 1);

            updatePositions(outerspace, [
                { y: spaceship.y + 2, x: spaceship.x },
                { y: spaceship.y + 2, x: spaceship.x - 1 },
                { y: spaceship.y + 2, x: spaceship.x + 1 },
            ], 0);

            drawSpace(outerspace, 'outerspace');
        }

        if (e.keyCode == 40 && spaceship.y + 1 !== 4) {
            spaceship.y++;
            updatePositions(outerspace, [
                { y: spaceship.y + 1, x: spaceship.x },
                { y: spaceship.y - 1, x: spaceship.x },
                { y: spaceship.y + 1, x: spaceship.x - 1 },
                { y: spaceship.y - 1, x: spaceship.x - 1 },
                { y: spaceship.y + 1, x: spaceship.x + 1 },
                { y: spaceship.y + 1, x: spaceship.x + 1 },
            ], 1);

            updatePositions(outerspace, [
                { y: spaceship.y - 2, x: spaceship.x },
                { y: spaceship.y - 2, x: spaceship.x - 1 },
                { y: spaceship.y - 2, x: spaceship.x + 1 },
            ], 0);

            drawSpace(outerspace, 'outerspace');
        }

        const keyCodeToPosition = {
            81: [-1, -1], // Q
            87: [-1, 0],  // W
            69: [-1, 1],  // E
            65: [0, -1],  // A
            83: [0, 0],   // S
            68: [0, 1],   // D
            90: [1, -1],  // Z
            88: [1, 0],   // X
            67: [1, 1],   // C
        };

        let valCounted = countEm(outerspace);
        if (valCounted < 5) {
            const positionOffset = keyCodeToPosition[e.keyCode];
            if (positionOffset) {
                const [dy, dx] = positionOffset;
                outerspace[spaceship.y + dy][spaceship.x + dx] = userturn ? 2 : 5;
            }
        }
        if (e.keyCode == 82) { //Reset button
            outerspace = [
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0],
            ];
            spaceship = { x: 2, y: 2 };
        }
        drawSpace(outerspace, 'outerspace');
    };

    window.onload = function () {

        if (machinescore < 10 && userscore < 10) {
            document.getElementById('all-in-one').addEventListener('click', function (event) {
                if (countEm(outerspace) < 5) return;
                
                userturn = !userturn;

                if (
                    document.getElementById('attackmode').style.visibility == 'visible' ||
                    document.getElementById('attackmode').style.visibility == 0
                ) {
                    document.getElementById('attackmode').style.visibility = 'hidden';
                    document.getElementById('defensemode').style.visibility = 'visible';
                    makemachinew();
                    mirrorouterspace = outerspace;

                    mirrorouterspace.forEach((row, i) => row.forEach((cell, j) => (cell === 1 ? (mirrorouterspace[i][j] = 0) : cell)));

                    var bravenewouterspace = sumation(machineouterspace, mirrorouterspace);

                    bravenewouterspace.forEach(row => row.forEach(cell => cell === 1 ? 0 : cell === 8 && userscore++));

                    drawSpace(bravenewouterspace, 'bravenewouterspace');
                }
                else {
                    document.getElementById('attackmode').style.visibility = 'visible';
                    document.getElementById('defensemode').style.visibility = 'hidden';
                    makemachinew();
                    mirrorouterspace = [...outerspace];

                    mirrorouterspace.forEach((row, c) => row.forEach((cell, d) => cell === 1 && (mirrorouterspace[c][d] = 0)));

                    var bravenewouterspace = sumation(machineouterspace, mirrorouterspace);

                    bravenewouterspace.forEach((row) => row.forEach((cell) => cell === 1 ? 0 : cell === 8 && machinescore++));

                    drawSpace(bravenewouterspace, 'bravenewouterspace');
                }
                document.getElementById("theirscore").innerHTML = machinescore;
                document.getElementById("yourscore").innerHTML = userscore;
                if (userscore > 9) {
                    document.getElementById('you-win').style.visibility = 'visible';
                    document.getElementById('play-again').style.visibility = 'visible';
                }
                if (machinescore > 9) {
                    document.getElementById('you-lose').style.visibility = 'visible';
                    document.getElementById('play-again').style.visibility = 'visible';
                }
                drawSpace(bravenewouterspace, 'bravenewouterspace');
            });
        }
        //End logic
        document.getElementById('play-again').addEventListener('click', function (event) {
            userscore = 0;
            machinescore = 0;
            outerspace = [
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0],
            ];
            spaceship = { x: 2, y: 2 };
            bravenewouterspace = Array(5).fill(Array(5).fill(0));
            document.getElementById('play-again').style.visibility = 'hidden';
            document.getElementById('you-win').style.visibility = 'hidden';
            document.getElementById('you-lose').style.visibility = 'hidden';
            drawSpace(bravenewouterspace, 'bravenewouterspace'), drawSpace(outerspace, 'outerspace');
            document.getElementById("theirscore").innerHTML = "Machine Score: " + machinescore;
            document.getElementById("yourscore").innerHTML = "Your Score: " + userscore;
        });
    };
});