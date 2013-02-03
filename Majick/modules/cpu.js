var cpuUsage = require('cpu-usage'),
    metric = {
        cpu: {
            load: 0
        }
    };

/*cpuUsage(1000, function(load) {
    metric.cpu.load = load;
});*/

setTimeout(function loop() {
    metric.cpu.load = Math.random().toFixed(2);
    setTimeout(loop, 1000);
}, 0);

exports.metric = metric;