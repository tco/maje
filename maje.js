#!/usr/bin/env node

var fs = require('fs'),
    request = require('request'),
    filed = require('filed'),
    mkdirp = require('mkdirp');

var majeDescriptor = fs.readFileSync('maje.maje', 'utf8'),
    maje = JSON.parse(majeDescriptor),
    basePath = maje.paths.development,
    buildTarget = 'development',
    supportedProtocols = ['http', 'https'];

mkdirp(basePath, 0777, function(error) {
    if(!error) {
        for(m in maje.majics) {
            var majicSource = maje.majics[m],
                protocol = majicSource.split(":").shift() || undefined;
            //If online source go and fetch
            if(supportedProtocols.indexOf(protocol) >= 0) {
                request({ uri: majicSource}, function(error, response, majicDescriptor) {
                    if(!error && response.statusCode == 200) {
                        castMajic(JSON.parse(majicDescriptor));
                    }
                });
            //Assume local source
            } else {
                var majicDescriptor = fs.readFileSync(majicSource),
                    majic = JSON.parse(majicDescriptor);
                castMajic(majic);
            }
        }
    } else {
        console.log(error);
        process.exit(1);
    }
});

function castMajic(majic) {
    var path = [basePath,majic.paths.local].join(""),
        source = majic.source[buildTarget],
        protocol = source.split(":").shift() || undefined,
        filename = source.split("/").pop();
    mkdirp(path, 0777, function(error) {
        if(!error) {
            request({ uri: source }).pipe(filed([path,filename].join("")));
        } else {
            console.log(error);
            process.exit(1);
        }
    });
}


