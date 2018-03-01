console.log("Script Started");

let fs = require('fs');
let filename = process.argv[2];

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}

fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    console.log('File success: ' + filename);
    console.log(data);

    writeFile(jsonToRaw(run(rawToJSON(data))));
    console.log("Script Finished");
});

function rawToJSON(data) {
    let lines = data.split("\r\n");
    let rules = lines[0].split(" ");

    let res = {
        rows: rules[0],
        cols: rules[1],
        min: rules[2],
        max: rules[3],
        map: []
    };

    for (let i = 1; i < lines.length - 1; i++) {
        res.map.push(lines[i].split(""));
    }

    return res;
}

function jsonToRaw(data) {
    let res = data.length.toString() + "\n";
    for (let i = 0; i < data.length; i++) {
        res += data[i] + "\n";
    }
    return res;
}

function writeFile(data) {
    if (process.argv[3] != "print") {
        return;
    }

    console.log("writing file..");
    fs.appendFile(new Date().getTime() + '.out', data, (err) => {
        if (err) {
            console.error("failed!")
        } else {
            console.log("done!");
        }
    });
}

/******************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 */

function run(data) {
    console.log("RUNNING");
    //console.log(data);
    let res = [];


    buildMap(data);


    console.log("RUNNING FINISHED");
    return ["0 0 2 1", "8 12 631 2", "4 3 2 1"];
}

function buildMap(data) {
    let res = {
        min: data.min,
        max: data.max,
        map: []
    };
    for (let i = 0; i < data.map.length; i++) {
        let row = [];
        for (let j = 0; j < data.map[i].length; j++) {
            // t = type
            // u = used
            // s = score
            // p = possible uses
            let obj = {
                t: data.map[i][j],
                u: false,
                s: 0,
                p: []
            };
            row.push(obj);
        }
        res.map.push(row);
    }
    calcScore(res, calcShapes(data.max));
}

function calcShapes(max) {
    let sizes = [];
    for (let i = 1; i <= max; i++) {
        for (let j = 1; j <= max; j++) {
            let block = {w: i, h: j};
            if (block.w * block.h <= max && !(i == 1 && j == 1)) sizes.push(block);
        }
    }
    let res = [];
    for (let h = 0; h < sizes.length; h++) {
        let size = sizes[h];
        for (let i = 0; i < size.w; i++) {
            for (let j = 0; j < size.h; j++) {
                res.push({
                    w: size.w,
                    h: size.h,
                    x: i,
                    y: j
                });
            }
        }
    }
    return res;
}

function calcScore(data, shapes) {
    let total = data.map.length * data.map[0].length;
    let current = 0;
    for (let i = 0; i < data.map.length; i++) {
        for (let j = 0; j < data.map[i].length; j++) {
            scoreThis(data.map[i][j], j, i, data.min, shapes, data.map[i].length, data.map.length, data.map);
        }
        current = data.map.length * (i + 1);
        console.log(current + " / " + total);
    }
    console.log(total + " / " + total);
    console.log("Dataset Finished Building");

    slicePizza(data.map);
}

function scoreThis(cell, x, y, minT, shapes, width, height, map) {
    // t = type             string
    // u = used             bool
    // s = score            int
    // p = possible uses    array
    for (let i = 0; i < shapes.length; i++) {
        //let shape = shapes[i];
        if (insideArray(x, y, width, height, shapes[i])) {
            let types = contains(x, y, shapes[i], map);
            if (types.T >= minT && types.M >= minT) {
                // s = shape index
                // a = T + M
                // c = cells
                cell.p.push({
                    s: i,
                    a: types.T + types.M,
                    //c: types.cells
                });
            }
        }
    }
    cell.s = cell.p.length;
}

function contains(x, y, shape, map) {
    let types = {T: 0, M: 0, cells: []};
    let nx = x - shape.x;
    let ny = y - shape.y;
    for (let i = 0; i < shape.w; i++) {
        for (let j = 0; j < shape.h; j++) {
            if (map[ny + j][nx + i].t == "T") {
                types.T++;
            } else {
                types.M++;
            }
            //types.cells.push({x: nx + i, y: ny + j});
        }
    }
    return types;
}

function insideArray(x, y, w, h, shape) {
    //console.log(x, y, w, h, shape);
    if (x < 0 || y < 0) return false;
    if (x >= w || y >= h) return false;
    if (x < shape.x || y < shape.y) return false;
    if (x > w - shape.w + shape.x || y > h - shape.h + shape.y) return false;
    return true;
}

function slicePizza(data) {
    console.log(data);
    slicePiece(data, getWorstUnusedPiece(data));
    slicePiece(data, getWorstUnusedPiece(data));
    slicePiece(data, getWorstUnusedPiece(data));
}

function slicePiece(data, cell) {
    console.log(data[cell.y][cell.x]);
    data[cell.y][cell.x].u = true;
}

function getWorstUnusedPiece(data) {
    // find first unused
    let search = true;
    let unPos = {x: -1, y: -1};
    for (let i = 0; i < data.length; i++) {
        if (search) {
            for (let j = 0; j < data[i].length; j++) {
                if (search) {
                    if (!data[i][j].u) {
                        console.log(data[i][j].u);
                        unPos.x = j;
                        unPos.y = i;
                        search = false;
                        console.log("ONE FOUND");
                    }
                }
            }
        }
    }
    console.log(unPos);






    let least = data[0][0].s;
    let pos = {x: 0, y: 0};
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            let testLeast = data[i][j].s;
            if (testLeast < least) {
                least = testLeast;
                pos.x = j;
                pos.y = i;
            }
        }
    }
    return pos;
}
