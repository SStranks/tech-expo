"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var PATH_IGNORE_PATTERN = '.map$';
/**
 * Filter webpack stats data
 */
exports.default = (function (source, options) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    var pathIgnorePattern = new RegExp(options.pathIgnorePattern || PATH_IGNORE_PATTERN);
    // meta
    var builtAt = source.builtAt, hash = source.hash;
    // rawData
    var assets = ((_a = source.assets) === null || _a === void 0 ? void 0 : _a.reduce(function (agg, asset) {
        var _a;
        // Skip assets with empty name or ignore pattern
        if (!asset.name || pathIgnorePattern.test(asset.name)) {
            return agg;
        }
        agg.push({
            name: asset.name,
            size: asset.size,
        });
        if (Array.isArray(asset.related)) {
            (_a = asset.related) === null || _a === void 0 ? void 0 : _a.forEach(function (asset) {
                if (!asset.name || pathIgnorePattern.test(asset.name))
                    return;
                agg.push({
                    name: asset.name,
                    size: asset.size,
                });
            });
        }
        return agg;
    }, [])) || [];
    var chunks = ((_b = source.chunks) === null || _b === void 0 ? void 0 : _b.reduce(function (agg, chunk) {
        // Skip chunks with empty ids
        if (typeof chunk.id === 'undefined' || chunk.id === null) {
            return agg;
        }
        agg.push({
            id: chunk.id,
            entry: chunk.entry,
            initial: chunk.initial,
            files: chunk.files,
            names: chunk.names,
        });
        return agg;
    }, [])) || [];
    var modules = ((_c = source.modules) === null || _c === void 0 ? void 0 : _c.reduce(function (agg, moduleStats) {
        var _a, _b;
        // Skip modules without name
        if (!moduleStats.name) {
            return agg;
        }
        var moduleChunks = ((_a = moduleStats.chunks) === null || _a === void 0 ? void 0 : _a.filter(function (chunkId) { return chunkId !== null && typeof chunkId !== 'undefined'; })) || [];
        // Skip modules that do not belong to any chunk
        if (moduleChunks.length === 0) {
            return agg;
        }
        var concatenatedModules = (_b = moduleStats.modules) === null || _b === void 0 ? void 0 : _b.reduce(function (aggConcatenatedModules, concatenatedModule) {
            if (!concatenatedModule.name) {
                return aggConcatenatedModules;
            }
            aggConcatenatedModules.push({
                name: concatenatedModule.name,
                size: concatenatedModule.size,
            });
            return aggConcatenatedModules;
        }, []);
        agg.push(__assign({ name: moduleStats.name, size: moduleStats.size, chunks: moduleChunks }, (concatenatedModules && { modules: concatenatedModules })));
        return agg;
    }, [])) || [];
    return {
        builtAt: builtAt,
        hash: hash,
        assets: assets,
        chunks: chunks,
        modules: modules,
    };
});
