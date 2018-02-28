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
    console.log('OK: ' + filename);
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
    let res = "";
    for (let i = 0; i < data.map.length; i++) {
        for (let j = 0; j < data.map[i].length; j++) {
            res += data.map[i][j];
        }
        res += "\n";
    }
    return res;
}

function writeFile(data) {
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
    console.log(data);
    console.log("RUNNING FINISHED");

    return data;
}
