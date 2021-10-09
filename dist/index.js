"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
/**
 * @package Fetcher
 * @fixme FormData only exists on clint-side, so using this on server-side will give a ReferenceError.
 */
class Fetcher {
    constructor(baseUrl, defArgs = undefined) {
        this.baseUrl = baseUrl;
        this.defArgs = defArgs !== null && defArgs !== void 0 ? defArgs : {};
    }
    request(url, args = undefined) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const parsedUrl = `${this.baseUrl}/${url}`;
            const _c = args !== null && args !== void 0 ? args : {}, { body: requestBody } = _c, requestArgs = __rest(_c, ["body"]);
            const parsedArgs = Object.assign(Object.assign({ headers: Object.assign(Object.assign({}, ((_a = args === null || args === void 0 ? void 0 : args.headers) !== null && _a !== void 0 ? _a : {})), { Accept: 'application/json' }), credentials: 'include' }, ((_b = this.defArgs) !== null && _b !== void 0 ? _b : {})), requestArgs);
            if (requestBody instanceof URLSearchParams ||
                requestBody instanceof FormData) {
                parsedArgs.body = requestBody;
            }
            else {
                parsedArgs.body = JSON.stringify(requestBody);
            }
            // If body is not FormData, set content-type.
            // When using FormData to submit POST/PUT requests, do not explicitly set the
            // Content-Type header on the request. Doing so will prevent the browser
            // from being able to set the Content-Type header with the boundary
            // expression it will use to delimit form fields in the request body.
            if (parsedArgs.body instanceof FormData === false) {
                parsedArgs.headers = Object.assign(Object.assign({}, parsedArgs.headers), { 'Content-Type': 'application/json' });
            }
            const output = cross_fetch_1.default(parsedUrl, parsedArgs)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                return response.text();
            }))
                .then((responseText) => {
                try {
                    const jsonData = JSON.parse(responseText);
                    return jsonData;
                }
                catch (_a) {
                    throw new Error('Invalid response received.');
                }
            });
            return output;
        });
    }
    static serializeQueryArgs(query = undefined) {
        const entries = typeof query === 'undefined' ? [] : Object.entries(query);
        if (entries.length === 0) {
            return '';
        }
        return entries
            .filter(([, value]) => value !== null) // Remove null values.
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Encode values.
            .join('&');
    }
    static buildUrl(url, query = undefined) {
        const qs = Fetcher.serializeQueryArgs(query);
        if (qs === '') {
            return url;
        }
        return `${url}?${qs}`;
    }
    get(url, query = undefined, args = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedArgs = Object.assign(Object.assign({}, args), { method: 'GET' });
            const parsedUrl = Fetcher.buildUrl(url, query);
            return this.request(parsedUrl, parsedArgs);
        });
    }
    post(url, body = undefined, args = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedArgs = Object.assign(Object.assign({}, args), { method: 'POST', body });
            return this.request(url, parsedArgs);
        });
    }
    put(url, body = undefined, args = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedArgs = Object.assign(Object.assign({}, args), { method: 'PUT', body });
            return this.request(url, parsedArgs);
        });
    }
    delete(url, args = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedArgs = Object.assign(Object.assign({}, args), { method: 'DELETE' });
            return this.request(url, parsedArgs);
        });
    }
}
exports.default = Fetcher;
