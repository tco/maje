var Backbone = require('backbone'),
    _ = require('underscore'),
    Bacon = require("baconjs").Bacon,
    wrench = require('wrench'),
    io = require('socket.io-client'),

    Metrics = Backbone.Collection.extend(),

    socket = io.connect('localhost', { port: 1337 }),
    majickBus = new Bacon.Bus(),
    metrics = new Metrics(),

    loadModules = function loadModules() {

        var files = wrench.readdirSyncRecursive("metrics/");

        files.forEach(function(filename) {

            var extension = filename.substr(-3),
                basename = filename.substr(0, filename.indexOf(extension));

            if(extension === '.js') {

                var metric = require('./metrics/' + filename).metric,
                    old = _.first(metrics.where(function(m) { return m.get('name') == basename; }));
                //var

                if(old !== undefined) {
                    metrics.remove(old);
                }

                metrics.add(metric);
                metric.plugIn(majickBus);

            }

        });

    };
//var

loadModules();

metrics.on('change', function(metric) {
    var stream = metric.get('stream'),
        name = metric.get('name'),
        streamEvent = {};
    streamEvent[name] = metric.get(name);
    stream.push(streamEvent);
});

majickBus.onValue(function(value) {
    socket.emit('message', value);
});

process.on('SIGHUP', function () {
    loadModules();
});

