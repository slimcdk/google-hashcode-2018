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
                index: i,
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
    output_name = output_name[output_name.length-1].split('.')[0] + '.out'

    console.log("writing file..");


    fs.unlink(output_name, function(err) {
        if(err && err.code === 'ENOENT') {
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
    console.log(data);

    let res = [
        [0],
        [2, 1]
    ];

    jsonToRaw(res);

    console.log("RUNNING FINISHED");
}
