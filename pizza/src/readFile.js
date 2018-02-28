console.log("running script");

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

    rawToJSON(data);
});

function rawToJSON(data) {
    let lines = data.split("\r\n");
    let rules = lines[0].split(" ");
    console.log("Rules: " + rules);

    let res = {
        rows: rules[0],
        cols: rules[1],
        min: rules[2],
        max: rules[3],
        map: []
    };

    for (let i = 1; i < lines.length - 1; i++) {
        //console.log(lines[i]);
        res.map.push(lines[i].split(""));
    }

    console.log(res);

    writeFile(data);
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
