"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const chai = require("chai");
const grunt = require("grunt");
const _ = require("lodash");
const path = require("path");
const sinon = require("sinon");
const steps = require("../../runner/steps");
const wctLocalBrowsers = require('wct-local/lib/browsers');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const LOCAL_BROWSERS = {
    aurora: { browserName: 'aurora', version: '1' },
    canary: { browserName: 'canary', version: '2' },
    chrome: { browserName: 'chrome', version: '3' },
    firefox: { browserName: 'firefox', version: '4' },
};
describe('grunt', function () {
    // Sinon doesn't stub process.env very well.
    let origEnv, origArgv;
    beforeEach(function () {
        origEnv = _.clone(process.env);
        origArgv = process.argv;
    });
    afterEach(function () {
        _.assign(process.env, origEnv);
        _.difference(_.keys(process.env), _.keys(origEnv)).forEach(function (key) {
            delete process.env[key];
        });
        process.argv = origArgv;
    });
    before(function () {
        grunt.initConfig({
            'wct-test': {
                'passthrough': {
                    options: { foo: 1, bar: 'asdf' },
                },
                'override': {
                    options: { sauce: { username: '--real-sauce--' } },
                },
            },
        });
        grunt.loadTasks(path.resolve(__dirname, '../../tasks'));
    });
    function runTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                grunt.task['options']({ error: reject, done: resolve });
                grunt.task.run('wct-test:' + task)['start']();
            });
            // We shouldn't error before hitting it.
            expect(steps.runTests).to.have.been.calledOnce;
            return steps.runTests['getCall'](0);
        });
    }
    describe('wct-test', function () {
        let sandbox;
        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            sandbox.stub(steps, 'prepare', (_context) => __awaiter(this, void 0, void 0, function* () { return undefined; }));
            sandbox.stub(wctLocalBrowsers, 'detect', () => __awaiter(this, void 0, void 0, function* () { return LOCAL_BROWSERS; }));
            sandbox.stub(wctLocalBrowsers, 'supported', () => _.keys(LOCAL_BROWSERS));
            process.chdir(path.resolve(__dirname, '../fixtures/cli/standard'));
        });
        afterEach(function () {
            sandbox.restore();
        });
        describe('with a passing suite', function () {
            beforeEach(function () {
                sandbox.stub(steps, 'runTests', () => __awaiter(this, void 0, void 0, function* () { return undefined; }));
            });
            it('passes configuration through', () => __awaiter(this, void 0, void 0, function* () {
                const call = yield runTask('passthrough');
                expect(call.args[0].options).to.include({ foo: 1, bar: 'asdf' });
            }));
        });
        describe('with a failing suite', function () {
            beforeEach(function () {
                sandbox.stub(steps, 'runTests', () => __awaiter(this, void 0, void 0, function* () {
                    throw 'failures';
                }));
            });
            it('passes errors out', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield runTask('passthrough');
                }
                catch (error) {
                    return; // All's well!
                }
                throw new Error('Expected runTask to fail!');
            }));
        });
    });
});
