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
const gulp = require("gulp");
const path = require("path");
const sinon = require("sinon");
const wctGulp = require("../../runner/gulp");
const plugin_1 = require("../../runner/plugin");
const steps = require("../../runner/steps");
const expect = chai.expect;
chai.use(require('sinon-chai'));
const FIXTURES = path.resolve(__dirname, '../fixtures/cli');
describe('gulp', function () {
    let pluginsCalled;
    let sandbox;
    let orch;
    let options;
    beforeEach(function () {
        orch = new gulp['Gulp']();
        wctGulp.init(orch);
        sandbox = sinon.sandbox.create();
        sandbox.stub(steps, 'prepare', (_context) => __awaiter(this, void 0, void 0, function* () { return undefined; }));
        sandbox.stub(steps, 'runTests', (context) => __awaiter(this, void 0, void 0, function* () {
            options = context.options;
        }));
        pluginsCalled = [];
        sandbox.stub(plugin_1.Plugin.prototype, 'execute', function (context) {
            return __awaiter(this, void 0, void 0, function* () {
                pluginsCalled.push(this.name);
                context.options.activeBrowsers.push({ browserName: 'fake for ' + this.name });
            });
        });
    });
    afterEach(function () {
        sandbox.restore();
    });
    function runGulpTask(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                orch.start(name, (error) => error ? reject(error) : resolve());
            });
        });
    }
    it('honors wcf.conf.js', () => __awaiter(this, void 0, void 0, function* () {
        process.chdir(path.join(FIXTURES, 'conf'));
        yield runGulpTask('wct:sauce');
        expect(options.plugins['sauce'].username).to.eq('abc123');
    }));
    it('prefers wcf.conf.json', () => __awaiter(this, void 0, void 0, function* () {
        process.chdir(path.join(FIXTURES, 'conf', 'json'));
        yield runGulpTask('wct:sauce');
        expect(options.plugins['sauce'].username).to.eq('jsonconf');
    }));
    describe('wct:local', function () {
        it('kicks off local tests', () => __awaiter(this, void 0, void 0, function* () {
            yield runGulpTask('wct:local');
            expect(steps.runTests).to.have.been.calledOnce;
            expect(pluginsCalled).to.have.members(['local']);
        }));
    });
    describe('wct:sauce', function () {
        it('kicks off sauce tests', () => __awaiter(this, void 0, void 0, function* () {
            yield runGulpTask('wct:sauce');
            expect(steps.runTests).to.have.been.calledOnce;
            expect(pluginsCalled).to.have.members(['sauce']);
        }));
    });
});
