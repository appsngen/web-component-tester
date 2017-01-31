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
const chai_1 = require("chai");
const path = require("path");
const paths = require("../../runner/paths");
describe('paths', function () {
    describe('.expand', function () {
        const baseDir = path.resolve(__dirname, '../fixtures/paths');
        function expectExpands(patterns, expected) {
            return __awaiter(this, void 0, void 0, function* () {
                const actual = yield paths.expand(baseDir, patterns);
                // for non-POSIX support
                expected = expected.map((str) => str.replace(/\//g, path.sep));
                chai_1.expect(actual).to.have.members(expected);
            });
        }
        it('is ok with an empty list', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands([], []);
        }));
        it('ignores explicit files that are missing', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['404.js'], []);
            yield expectExpands(['404.js', 'foo.html'], ['foo.html']);
        }));
        it('does not expand explicit files', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['foo.js'], ['foo.js']);
            yield expectExpands(['foo.html'], ['foo.html']);
            yield expectExpands(['foo.js', 'foo.html'], ['foo.js', 'foo.html']);
        }));
        it('expands directories into their files', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['foo'], ['foo/one.js', 'foo/two.html']);
            yield expectExpands(['foo/'], ['foo/one.js', 'foo/two.html']);
        }));
        it('expands directories into index.html when present', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['bar'], ['bar/index.html']);
            yield expectExpands(['bar/'], ['bar/index.html']);
        }));
        it('expands directories recursively, honoring all rules', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['baz'], [
                'baz/a/fizz.html',
                'baz/b/index.html',
                'baz/a.html',
                'baz/b.js',
            ]);
        }));
        it('accepts globs for explicit file matches', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['baz/*.js'], ['baz/b.js']);
            yield expectExpands(['baz/*.html'], ['baz/a.html']);
            yield expectExpands(['baz/**/*.js'], [
                'baz/b/deep/stuff.js',
                'baz/b/one.js',
                'baz/b.js',
            ]);
            yield expectExpands(['baz/**/*.html'], [
                'baz/a/fizz.html',
                'baz/b/deep/index.html',
                'baz/b/deep/stuff.html',
                'baz/b/index.html',
                'baz/a.html',
            ]);
        }));
        it('accepts globs for directories, honoring directory behavior', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['*'], [
                'bar/index.html',
                'baz/a/fizz.html',
                'baz/b/index.html',
                'baz/a.html',
                'baz/b.js',
                'foo/one.js',
                'foo/two.html',
                'foo.html',
                'foo.js',
            ]);
            yield expectExpands(['baz/*'], [
                'baz/a/fizz.html',
                'baz/b/index.html',
                'baz/a.html',
                'baz/b.js',
            ]);
        }));
        it('deduplicates', () => __awaiter(this, void 0, void 0, function* () {
            yield expectExpands(['bar/a.js', 'bar/*.js', 'bar', 'bar/*.html'], [
                'bar/a.js',
                'bar/index.html',
                'bar/index.js',
            ]);
        }));
    });
});
