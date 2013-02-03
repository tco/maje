var Backbone = require('backbone'),
    Bacon = require("baconjs").Bacon,
    cpuUsage = require('cpu-usage'),

    interval = 1000,
    Metric = Backbone.Model.extend({
        initialize: function(name) {
            this.set('interval', interval);
            this.set('name', name);
            this.set('stream', new Bacon.Bus());
            this.bind("remove", function() {
                this.destroy();
            });
        },

        plugIn: function(stream) {
            stream.plug(this.get('stream'));
        }
    }),
    metric = new Metric('memory');
//var

(function setMetric(metric) {
    metric.set(metric.get('name'), { load: Math.random().toFixed(2) });
    setTimeout(function() {
        setMetric(metric);
    }, metric.get('interval'));
})(metric);

exports.metric = metric;