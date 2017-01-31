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
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const context_1 = require("../../runner/context");
const plugin_1 = require("../../runner/plugin");
const expect = chai.expect;
chai.use(sinonChai);
describe('Context', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe('.plugins', () => {
        it('excludes plugins with a falsy config', () => __awaiter(this, void 0, void 0, function* () {
            const context = new context_1.Context({ plugins: { local: false, sauce: {} } });
            const stub = sandbox.stub(plugin_1.Plugin, 'get', (name) => {
                return Promise.resolve(name);
            });
            const plugins = yield context.plugins();
            expect(stub).to.have.been.calledOnce;
            expect(stub).to.have.been.calledWith('sauce');
            expect(plugins).to.have.members(['sauce']);
        }));
        it('excludes plugins disabled: true', () => __awaiter(this, void 0, void 0, function* () {
            const context = new context_1.Context({ plugins: { local: {}, sauce: { disabled: true } } });
            const stub = sandbox.stub(plugin_1.Plugin, 'get', (name) => {
                return Promise.resolve(name);
            });
            const plugins = yield context.plugins();
            expect(stub).to.have.been.calledOnce;
            expect(stub).to.have.been.calledWith('local');
            expect(plugins).to.have.members(['local']);
        }));
        describe('hook handlers with non-callback second argument', () => __awaiter(this, void 0, void 0, function* () {
            it('are passed the "done" callback function instead of the argument passed to emitHook', () => __awaiter(this, void 0, void 0, function* () {
                const context = new context_1.Context();
                context.hook('foo', function (arg1, done) {
                    expect(arg1).to.eq('hookArg');
                    done();
                });
                yield context.emitHook('foo', 'hookArg');
            }));
        }));
        describe('hook handlers written to call callbacks', () => {
            it('passes additional arguments through', () => __awaiter(this, void 0, void 0, function* () {
                const context = new context_1.Context();
                context.hook('foo', (arg1, arg2, hookDone) => {
                    expect(arg1).to.eq('one');
                    expect(arg2).to.eq(2);
                    hookDone();
                });
                // Tests the promise form of emitHook.
                yield context.emitHook('foo', 'one', 2);
                // Tests the callback form of emitHook.
                const error = yield new Promise((resolve) => {
                    context.emitHook('foo', 'one', 2, resolve);
                });
                expect(error).to.not.be.ok;
            }));
            it('halts on error', () => __awaiter(this, void 0, void 0, function* () {
                const context = new context_1.Context();
                context.hook('bar', function (hookDone) {
                    hookDone('nope');
                });
                // Tests the promise form of emitHook.
                try {
                    yield context.emitHook('bar');
                    throw new Error('emitHook should have thrown');
                }
                catch (error) {
                    expect(error).to.eq('nope');
                }
                // Tests the callback form of emitHook.
                const error = yield new Promise((resolve) => {
                    context.emitHook('bar', resolve);
                });
                expect(error).to.eq('nope');
            }));
        });
        describe('hooks handlers written to return promises', () => {
            it('passes additional arguments through', () => __awaiter(this, void 0, void 0, function* () {
                const context = new context_1.Context();
                context.hook('foo', function (arg1, arg2) {
                    return __awaiter(this, void 0, void 0, function* () {
                        expect(arg1).to.eq('one');
                        expect(arg2).to.eq(2);
                    });
                });
                yield context.emitHook('foo', 'one', 2);
                const error = yield new Promise((resolve) => {
                    context.emitHook('foo', 'one', 2, resolve);
                });
                expect(error).to.not.be.ok;
            }));
            it('halts on error', () => __awaiter(this, void 0, void 0, function* () {
                const context = new context_1.Context();
                context.hook('bar', () => __awaiter(this, void 0, void 0, function* () {
                    throw 'nope';
                }));
                // Tests the promise form of emitHook.
                try {
                    yield context.emitHook('bar');
                    throw new Error('emitHook should have thrown');
                }
                catch (error) {
                    expect(error).to.eq('nope');
                }
                // Tests the callback form of emitHook.
                const error = yield new Promise((resolve) => {
                    context.emitHook('bar', resolve);
                });
                expect(error).to.eq('nope');
            }));
        });
    });
});
