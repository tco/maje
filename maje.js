#!/usr/bin/env node

var fs = require('fs'),
    request = require('request'),
    filed = require('filed'),
    mkdirp = require('mkdirp');

var majeDescriptor = fs.readFileSync('maje.maje', 'utf8'),
    maje = JSON.parse(majeDescriptor),
    basePath = maje.paths.development,
    buildTarget = 'development';

mkdirp(basePath, 0777, function(err) {
    if(!err) {
        for(m in maje.majics) {
            castMajic(maje.majics[m])
        }
    } else {
        console.log(err);
        process.exit(1);
    }
});

function castMajic(m) {
    var majicDescriptor = fs.readFileSync(m),
        majic = JSON.parse(majicDescriptor),
        path = [basePath,majic.paths.local].join(""),
        source = majic.source[buildTarget],
        filename = source.split("/").pop();
    mkdirp(path, 0777, function(err) {
        if(!err) {
            request({ uri: source }).pipe(filed([path,filename].join("")));
        } else {
            console.log(err);
            process.exit(1);
        }
    });
}


