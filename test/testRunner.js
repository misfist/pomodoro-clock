/*jslint white: true */

require.config({
  baseUrl: '/pomodoro-clock/',
  paths: {
    'jquery'        : 'assets/vendor/jquery/dist/jquery',
    'mocha'         : 'node_modules/mocha/mocha',
    'chai'          : 'node_modules/chai/chai',
    'chai-jquery'   : 'node_modules/chai-jquery/chai-jquery',
    'test'          : 'test/main.test'
  },
    shim: {
        'chai-jquery': ['jquery', 'chai'],
        'mocha': {
        init: function () {
            this.mocha.setup('bdd');
                return this.mocha;
            }
        }
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

define([
    'chai',
    'chai-jquery',
    'mocha'
],

function (chai, chaiJquery, mocha) {

    // Chai
    var should = chai.should();
    chai.use(chaiJquery);

    require([
        'main.test.js',
    ], function(require) {
        mocha.run();
    });
});



