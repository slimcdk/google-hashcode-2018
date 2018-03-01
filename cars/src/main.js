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

    //writeFile(jsonToRaw(run(rawToJSON(data))));
    run(rawToJSON(data));
    console.log("Script Finished");
});

function rawToJSON(data) {
    let lines = data.split("\r\n");
    let rules = lines[0].split(" ");

    let res = {
        rows: rules[0],
        cols: rules[1],
        fleet: rules[2],
        rides: rules[3],
        bonus: rules[4],
        steps: rules[5],
        map: []
    };

    for (let i = 1; i < lines.length - 1; i++) {
        if (lines[i].length) {
            let data = lines[i].split(" ");
            res.map.push({
                index: i - 1,
                occupied: false,
                start: {x: data[1], y: data[0]},
                stop: {x: data[3], y: data[2]},
                begin: data[4],
                end: data[5]
            });
        }
    }

    return res;
}


function jsonToRaw(data) {
    let res = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i].length > 0) {
            res += data[i].length;
            for (let j = 0; j < data[i].length; j++) {
                res += " " + data[i][j];
            }
            res += "\n";
        }
    }
    writeFile(res);
}


function writeFile(data) {
    if (process.argv[3] !== "print") {
        return;
    }

    let output_name = filename.split('/');
    output_name = output_name[output_name.length - 1].split('.')[0] + '.out'

    console.log("writing file..");


    fs.unlink(output_name, function (err) {
        if (err && err.code === 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`Removed and created file`);
        }
    });

    fs.appendFile(output_name, data, (err) => {
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

/*
    let a = [
        { name: "Robin Van Persie", age: 28 },
        { name: "Theo Walcott", age: 22 },
        { name: "Bacary Sagna", age: 26  }
    ].sort(function(obj1, obj2) {
        // Ascending: first age less than the previous
        return obj1.age - obj2.age;
    });
    console.log(a);
*/

function run(data) {
    console.log("RUNNING");
    //console.log(data);

    let cars = [];
    for (let i = 0; i < data.fleet; i++) {
        cars.push({
            active: true,
            steps: 0,
            finished: [],
            possible: [],
            pos: {x: 0, y: 0}
        });
    }

    for (let step = 0; step < data.steps; step++) {
        for (let i = 0; i < cars.length; i++) {
            let car = cars[i];
            if (car.active && car.steps <= step) {
                getRoutes(car, data, step);
                sortRoutes(car);
                if (car.possible.length > 0) {
                    pickRoute(car, data);
                } else {
                    car.active = false;
                }
            }
        }
    }
    console.log(cars);

    let res = [];
    for (let i = 0; i < cars.length; i++) {
        res.push(cars[i].finished);
    }
    jsonToRaw(res);

    console.log("RUNNING FINISHED");
}

function pickRoute(car, data) {
    let route = data.map[car.possible[0].index];
    car.finished.push(route.index);
    car.pos = data.map[route.index].stop;
    route.occupied = true;
    car.steps += car.possible[0].totSteps;
    console.log(car);
}

function getRoutes(car, data, step) {
    car.possible = [];
    for (let i = 0; i < data.map.length; i++) {
        // all routes
        if (!data.map[i].occupied) {

            // all available routes
            let distStart = Math.abs(car.pos.x - data.map[i].start.x) + Math.abs(car.pos.y - data.map[i].start.y);
            let routeLength = Math.abs(data.map[i].stop.x - data.map[i].start.x) + Math.abs(data.map[i].stop.y - data.map[i].start.y);
            console.log(distStart, routeLength);

            if (distStart + routeLength + step < data.map[i].end) {
                // routes possible before deadline
                let totalSteps = distStart + routeLength;
                if (step + distStart < data.map[i].begin) {
                    totalSteps += data.map[i].begin - (step + distStart);
                }

                car.possible.push({
                    totSteps: totalSteps,
                    index: data.map[i].index,
                    start: data.map[i].begin - step + distStart,
                    abs: Math.abs(data.map[i].begin - step + distStart)
                });
            }
        }
    }
    //console.log(car);
}

function sortRoutes(car) {
    car.possible.sort(function(obj1, obj2) {
        return obj1.abs - obj2.abs;
    });
}
