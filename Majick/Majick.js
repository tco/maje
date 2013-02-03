var Bacon = require("baconjs").Bacon,
    wrench = require('wrench'),
    io = require('socket.io-client'),

    socket = io.connect('localhost', { port: 1337 }),
    majickBus = new Bacon.Bus(),

    modules = {
        timeouts: {},
        replace: function(name, module) {
            var stream = new Bacon.Bus();

            majickBus.plug(stream);

            clearTimeout(modules.timeouts[name]);
            //TODO: hook this up with Backbone collection change
            (function(name, module, stream) {
                setTimeout(function streamMetric() {
                    stream.push(module.metric);
                    modules.timeouts[name] = setTimeout(streamMetric, 1000);
                }, 0);
            })(name, module, stream);

            modules[name] = module;
        },
        getMetric: function(name) {
            if(this[name]) {
                return this[name].metric;
            }
            return undefined;
        }
    },
    loadModules = function loadModules() {
        var files = wrench.readdirSyncRecursive("modules/");

        files.forEach(function(filename) {
            var extension = filename.substr(-3),
                basename = filename.substr(0, filename.indexOf(extension));
            if(extension === '.js') {
                var module = require('./modules/' + filename);
                modules.replace(basename, module);
            }
        });
    };
//var

loadModules();

majickBus.onValue(function(value) {
    socket.emit('message', value);
});

process.on('SIGHUP', function () {
    loadModules();
});

