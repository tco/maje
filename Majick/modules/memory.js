var cpuUsage = require('cpu-usage'),
    metric = {
        memory: {
            load: 0
        }
    };

setTimeout(function loop() {
    metric.memory.load = Math.random().toFixed(2);
    setTimeout(loop, 1000);
}, 0);

exports.metric = metric;