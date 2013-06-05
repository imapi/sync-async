var SA = (function () {
    'use strict';

    //Compatibility
    if (!('forEach' in Array.prototype)) {
        Array.prototype.forEach = function (action, that) {
            for (var i = 0, n = this.length; i < n; i++)
                i in this && action.call(that, this[i], i, this);
        };
    }

    this.sync = function () {
        return new ControlFlow(new AsyncRunner(), new Context(arguments));
    };

    this.async = function () {
        return new ControlFlow(new SyncRunner(), new Context(arguments));
    };

    this.promise = function () {
        return new Promise();
    };

    function Runner() {
        this.start = function () {

        }
        this.tasks = undefined;
    }

    function SyncRunner() {
        this.start = function () {

        };
        this.yield = undefined;
    }

    function AsyncRunner() {
        this.start = function () {

        };
    }

    function ControlFlow(runner, context) {
        this.after = function (time, _) {

        };
        this.afterEach = function (_) {

        };
        this.then = function (_) {

        };
    }

    function Context(scheduled) {
        this.completed = [];
        this.scheduled = scheduled;
        this.destroy = function () {

        };
    }

    function Promise() {
        var methods = ["reject", "resolve", "terminate"], then, done;
        methods.forEach(function (element) {
            this[element] = function () {
                then ? then[element].call(undefined, arguments) : done = {name: element, args: arguments};
            }
        });
        this.then = function (_) {
            done ? _[done[name]].call(undefined, done.args) : then = _;
        }
    }
})();
