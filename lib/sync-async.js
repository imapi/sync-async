var SA = (function () {
    'use strict';

    function Runner(args, type) {
        var listeners = {}, context = {scheduled: [], completed: []};
        this.start = function () {
            var run = function (pos, and) {
                    var promise = args[pos].call(undefined),
                        methods = ["resolved", "terminated", "resolved"],
                        j,
                        resolver = function () {
                            context.completed.push(context.scheduled.splice(pos, 1));
                            if (listeners.each) {
                                listeners.each.call(this, promise);
                            }
                            if (args.length === context.completed && listeners.then) {
                                listeners.then.call(undefined, context);
                            } else {
                                and.call(undefined);
                            }
                        };
                    context.scheduled.push(promise);
                    for (j = 0; j < methods.length; j += 1) {
                        promise[methods[j]] = resolver;
                    }
                },
                async = function () {
                    var resolver = function (pos) {
                            setTimeout(function () {
                                run(pos);
                            }, 0);
                        },
                        i;
                    for (i = 0; i < args.length; i += 1) {
                        resolver(i);
                    }
                },
                sync = function () {
                    var next = 0,
                        resolver = function () {
                            run(next += 1, resolver);
                        };
                    resolver();
                };
            if (type.async) {
                async();
            } else {
                sync();
            }
        };
        this.stop = function () {
            var i;
            for (i = 0; i < context.scheduled; i += 1) {
                context.scheduled[i].terminate();
            }
        };
        this.listener = function (callback, conf) {
            var name = conf && conf.each ? "each" : "then";
            listeners[name] = callback;
        };
        this.context = function () {
            return {scheduled: context.scheduled.slice(0), completed: context.completed.slice(0)};
        };
    }

    function ControlFlow(runner) {
        this.after = function (time, callback) {
            setTimeout(function () {
                callback.call(undefined, runner.context());
            }, time);
            return this;
        };
        this.afterEach = function (callback) {
            runner.listener(callback, {each: true});
            return this;
        };
        this.then = function (callback) {
            runner.listener(callback);
            return SA;
        };
    }

    function Promise() {
        var methods = {reject: "rejected", resolve: "resolved", terminate: "terminated"}, then, queue = [],
            resolver = function (mapped) {
                return function () {
                    if (then && then[methods[mapped]]) {
                        then[methods[mapped]].apply(undefined, arguments);
                    } else {
                        queue.push({name: methods[mapped], args: arguments});
                    }
                };
            },
            method;
        for (method in methods) {
            if (methods.hasOwnProperty(method)) {
                this[method] = resolver(method);
            }
        }

        this.then = function (callback) {
            if (queue) {
                var i;
                for (i = 0; i < queue.length; i += 1) {
                    callback[queue[i].name].apply(undefined, queue[i].args);
                }
                queue = [];
            }
            then = callback;
        };

    }


    this.sync = function () {
        return new ControlFlow(new Runner(arguments));
    };

    this.async = function () {
        return new ControlFlow(new Runner(arguments, {async: true}));
    };

    this.promise = function () {
        return new Promise();
    };

}());
