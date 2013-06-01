var SA = (function () {
    'use strict';

    this.sync = function () {

    };

    this.async = function () {

    };

    function ControlFlow() {
        this.after = function (time, _) {

        };
        this.afterEach = function (_) {

        };
        this.complete = function (_) {

        };
    }

    function Context() {
        this.completed = [];
        this.scheduled = [];
        this.runnning = undefined;
        this.destroy = function () {

        };
    }

    function Promise() {
        this.rejct = function (reason) {

        };
        this.resolve = function (result) {

        };
        this.terminate = function (reason) {

        };
        this.done = function (_) {

        };
        this.rejected = function (_) {

        };
        this.terminated = function (_) {

        };
    }
})();
