console.log("running script");

let fs = require('fs');
let filename = process.argv[2];

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}

// Read the file and print its contents.
fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    console.log('OK: ' + filename);
    console.log(data);
    writeFile(data);
});


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