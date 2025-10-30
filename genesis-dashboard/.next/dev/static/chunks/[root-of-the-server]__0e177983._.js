(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/_app\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/node_modules/next/app.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
"[project]/node_modules/next/dist/compiled/@next/react-refresh-utils/dist/runtime.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const runtime_1 = __importDefault((()=>{
    const e = new Error("Cannot find module 'next/dist/compiled/react-refresh/runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const helpers_1 = __importDefault((()=>{
    const e = new Error("Cannot find module './internal/helpers'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
// Hook into ReactDOM initialization
runtime_1.default.injectIntoGlobalHook(self);
// Register global helpers
self.$RefreshHelpers$ = helpers_1.default;
// Register a helper for module execution interception
self.$RefreshInterceptModuleExecution$ = function(webpackModuleId) {
    var prevRefreshReg = self.$RefreshReg$;
    var prevRefreshSig = self.$RefreshSig$;
    self.$RefreshReg$ = function(type, id) {
        runtime_1.default.register(type, webpackModuleId + ' ' + id);
    };
    self.$RefreshSig$ = runtime_1.default.createSignatureFunctionForTransform;
    // Modeled after `useEffect` cleanup pattern:
    // https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
    return function() {
        self.$RefreshReg$ = prevRefreshReg;
        self.$RefreshSig$ = prevRefreshSig;
    };
}; //# sourceMappingURL=runtime.js.map
}),
"[project]/node_modules/next/dist/client/set-attributes-from-props.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setAttributesFromProps", {
    enumerable: true,
    get: function() {
        return setAttributesFromProps;
    }
});
const DOMAttributeNames = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule'
};
const ignoreProps = [
    'onLoad',
    'onReady',
    'dangerouslySetInnerHTML',
    'children',
    'onError',
    'strategy',
    'stylesheets'
];
function isBooleanScriptAttribute(attr) {
    return [
        'async',
        'defer',
        'noModule'
    ].includes(attr);
}
function setAttributesFromProps(el, props) {
    for (const [p, value] of Object.entries(props)){
        if (!props.hasOwnProperty(p)) continue;
        if (ignoreProps.includes(p)) continue;
        // we don't render undefined props to the DOM
        if (value === undefined) {
            continue;
        }
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr)) {
            // Correctly assign boolean script attributes
            // https://github.com/vercel/next.js/pull/20748
            ;
            el[attr] = !!value;
        } else {
            el.setAttribute(attr, String(value));
        }
        // Remove falsy non-zero boolean attributes so they are correctly interpreted
        // (e.g. if we set them to false, this coerces to the string "false", which the browser interprets as true)
        if (value === false || el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr) && (!value || value === 'false')) {
            // Call setAttribute before, as we need to set and unset the attribute to override force async:
            // https://html.spec.whatwg.org/multipage/scripting.html#script-force-async
            el.setAttribute(attr, '');
            el.removeAttribute(attr);
        }
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=set-attributes-from-props.js.map
}),
"[project]/node_modules/next/dist/client/head-manager.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    isEqualNode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return initHeadManager;
    },
    isEqualNode: function() {
        return isEqualNode;
    }
});
const _setattributesfromprops = __turbopack_context__.r("[project]/node_modules/next/dist/client/set-attributes-from-props.js [client] (ecmascript)");
function reactElementToDOM({ type, props }) {
    const el = document.createElement(type);
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    const { children, dangerouslySetInnerHTML } = props;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
        const nonce = newTag.getAttribute('nonce');
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute('nonce')) {
            const cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute('nonce', '');
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    const headEl = document.querySelector('head');
    if (!headEl) return;
    const oldTags = new Set(headEl.querySelectorAll(`${type}[data-next-head]`));
    if (type === 'meta') {
        const metaCharset = headEl.querySelector('meta[charset]');
        if (metaCharset !== null) {
            oldTags.add(metaCharset);
        }
    }
    const newTags = [];
    for(let i = 0; i < components.length; i++){
        const component = components[i];
        const newTag = reactElementToDOM(component);
        newTag.setAttribute('data-next-head', '');
        let isNew = true;
        for (const oldTag of oldTags){
            if (isEqualNode(oldTag, newTag)) {
                oldTags.delete(oldTag);
                isNew = false;
                break;
            }
        }
        if (isNew) {
            newTags.push(newTag);
        }
    }
    for (const oldTag of oldTags){
        oldTag.parentNode?.removeChild(oldTag);
    }
    for (const newTag of newTags){
        // meta[charset] must be first element so special case
        if (newTag.tagName.toLowerCase() === 'meta' && newTag.getAttribute('charset') !== null) {
            headEl.prepend(newTag);
        }
        headEl.appendChild(newTag);
    }
}
function initHeadManager() {
    return {
        mountedInstances: new Set(),
        updateHead: (head)=>{
            const tags = {};
            head.forEach((h)=>{
                if (// it won't be inlined. In this case revert to the original behavior
                h.type === 'link' && h.props['data-optimized-fonts']) {
                    if (document.querySelector(`style[data-href="${h.props['data-href']}"]`)) {
                        return;
                    } else {
                        h.props.href = h.props['data-href'];
                        h.props['data-href'] = undefined;
                    }
                }
                const components = tags[h.type] || [];
                components.push(h);
                tags[h.type] = components;
            });
            const titleComponent = tags.title ? tags.title[0] : null;
            let title = '';
            if (titleComponent) {
                const { children } = titleComponent.props;
                title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
            }
            if (title !== document.title) document.title = title;
            [
                'meta',
                'base',
                'link',
                'style',
                'script'
            ].forEach((type)=>{
                updateElements(type, tags[type] || []);
            });
        }
    };
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head-manager.js.map
}),
"[project]/node_modules/next/dist/client/normalize-trailing-slash.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathTrailingSlash", {
    enumerable: true,
    get: function() {
        return normalizePathTrailingSlash;
    }
});
const _removetrailingslash = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/remove-trailing-slash'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _parsepath = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/parse-path'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const normalizePathTrailingSlash = (path)=>{
    if (!path.startsWith('/') || ("TURBOPACK compile-time value", void 0)) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `${(0, _removetrailingslash.removeTrailingSlash)(pathname)}${query}${hash}`;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=normalize-trailing-slash.js.map
}),
"[project]/node_modules/next/dist/client/add-base-path.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addBasePath", {
    enumerable: true,
    get: function() {
        return addBasePath;
    }
});
const _addpathprefix = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/add-path-prefix'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _normalizetrailingslash = __turbopack_context__.r("[project]/node_modules/next/dist/client/normalize-trailing-slash.js [client] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function addBasePath(path, required) {
    return (0, _normalizetrailingslash.normalizePathTrailingSlash)(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, _addpathprefix.addPathPrefix)(path, basePath));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-base-path.js.map
}),
"[project]/node_modules/next/dist/client/add-locale.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addLocale", {
    enumerable: true,
    get: function() {
        return addLocale;
    }
});
const _normalizetrailingslash = __turbopack_context__.r("[project]/node_modules/next/dist/client/normalize-trailing-slash.js [client] (ecmascript)");
const addLocale = (path, ...args)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return path;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-locale.js.map
}),
"[project]/node_modules/next/dist/client/trusted-types.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Stores the Trusted Types Policy. Starts as undefined and can be set to null
 * if Trusted Types is not supported in the browser.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "__unsafeCreateTrustedScriptURL", {
    enumerable: true,
    get: function() {
        return __unsafeCreateTrustedScriptURL;
    }
});
let policy;
/**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function getPolicy() {
    if (typeof policy === 'undefined' && typeof window !== 'undefined') {
        policy = window.trustedTypes?.createPolicy('nextjs', {
            createHTML: (input)=>input,
            createScript: (input)=>input,
            createScriptURL: (input)=>input
        }) || null;
    }
    return policy;
}
function __unsafeCreateTrustedScriptURL(url) {
    return getPolicy()?.createScriptURL(url) || url;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=trusted-types.js.map
}),
"[project]/node_modules/next/dist/client/request-idle-callback.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelIdleCallback: null,
    requestIdleCallback: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelIdleCallback: function() {
        return cancelIdleCallback;
    },
    requestIdleCallback: function() {
        return requestIdleCallback;
    }
});
const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map
}),
"[project]/node_modules/next/dist/client/route-loader.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createRouteLoader: null,
    getClientBuildManifest: null,
    isAssetError: null,
    markAssetError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createRouteLoader: function() {
        return createRouteLoader;
    },
    getClientBuildManifest: function() {
        return getClientBuildManifest;
    },
    isAssetError: function() {
        return isAssetError;
    },
    markAssetError: function() {
        return markAssetError;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _getassetpathfromroute = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/get-asset-path-from-route'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _trustedtypes = __turbopack_context__.r("[project]/node_modules/next/dist/client/trusted-types.js [client] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/node_modules/next/dist/client/request-idle-callback.js [client] (ecmascript)");
const _deploymentid = (()=>{
    const e = new Error("Cannot find module '../build/deployment-id'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _encodeuripath = (()=>{
    const e = new Error("Cannot find module '../shared/lib/encode-uri-path'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
const MS_MAX_IDLE_DELAY = 3800;
function withFuture(key, map, generator) {
    let entry = map.get(key);
    if (entry) {
        if ('future' in entry) {
            return entry.future;
        }
        return Promise.resolve(entry);
    }
    let resolver;
    const prom = new Promise((resolve)=>{
        resolver = resolve;
    });
    map.set(key, {
        resolve: resolver,
        future: prom
    });
    return generator ? generator().then((value)=>{
        resolver(value);
        return value;
    }).catch((err)=>{
        map.delete(key);
        throw err;
    }) : prom;
}
const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR');
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function hasPrefetch(link) {
    try {
        link = document.createElement('link');
        return(// with relList.support
        !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch'));
    } catch  {
        return false;
    }
}
const canPrefetch = hasPrefetch();
const getAssetQueryString = ()=>{
    return (0, _deploymentid.getDeploymentIdQueryOrEmptyString)();
};
function prefetchViaDom(href, as, link) {
    return new Promise((resolve, reject)=>{
        const selector = `
      link[rel="prefetch"][href^="${href}"],
      link[rel="preload"][href^="${href}"],
      script[src^="${href}"]`;
        if (document.querySelector(selector)) {
            return resolve();
        }
        link = document.createElement('link');
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = `prefetch`;
        link.crossOrigin = ("TURBOPACK compile-time value", void 0);
        link.onload = resolve;
        link.onerror = ()=>reject(markAssetError(Object.defineProperty(new Error(`Failed to prefetch: ${href}`), "__NEXT_ERROR_CODE", {
                value: "E268",
                enumerable: false,
                configurable: true
            })));
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
function appendScript(src, script) {
    return new Promise((resolve, reject)=>{
        script = document.createElement('script');
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = ()=>reject(markAssetError(Object.defineProperty(new Error(`Failed to load script: ${src}`), "__NEXT_ERROR_CODE", {
                value: "E74",
                enumerable: false,
                configurable: true
            })));
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = ("TURBOPACK compile-time value", void 0);
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
let devBuildPromise;
// Resolve a promise that times out after given amount of milliseconds.
function resolvePromiseWithTimeout(p, ms, err) {
    return new Promise((resolve, reject)=>{
        let cancelled = false;
        p.then((r)=>{
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if ("TURBOPACK compile-time truthy", 1) {
            ;
            (devBuildPromise || Promise.resolve()).then(()=>{
                (0, _requestidlecallback.requestIdleCallback)(()=>setTimeout(()=>{
                        if (!cancelled) {
                            reject(err);
                        }
                    }, ms));
            });
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    });
}
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    const onBuildManifest = new Promise((resolve)=>{
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = ()=>{
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(Object.defineProperty(new Error('Failed to load client build manifest'), "__NEXT_ERROR_CODE", {
        value: "E273",
        enumerable: false,
        configurable: true
    })));
}
function getFilesForRoute(assetPrefix, route) {
    if ("TURBOPACK compile-time truthy", 1) {
        const scriptUrl = assetPrefix + '/_next/static/chunks/pages' + (0, _encodeuripath.encodeURIPath)((0, _getassetpathfromroute.default)(route, '.js')) + getAssetQueryString();
        return Promise.resolve({
            scripts: [
                (0, _trustedtypes.__unsafeCreateTrustedScriptURL)(scriptUrl)
            ],
            // Styles are handled by `style-loader` in development:
            css: []
        });
    }
    //TURBOPACK unreachable
    ;
}
function createRouteLoader(assetPrefix) {
    const entrypoints = new Map();
    const loadedScripts = new Map();
    const styleSheets = new Map();
    const routes = new Map();
    function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            return appendScript(src);
        }
    }
    function fetchStyleSheet(href) {
        let prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href, {
            credentials: 'same-origin'
        }).then((res)=>{
            if (!res.ok) {
                throw Object.defineProperty(new Error(`Failed to load stylesheet: ${href}`), "__NEXT_ERROR_CODE", {
                    value: "E189",
                    enumerable: false,
                    configurable: true
                });
            }
            return res.text().then((text)=>({
                    href: href,
                    content: text
                }));
        }).catch((err)=>{
            throw markAssetError(err);
        }));
        return prom;
    }
    return {
        whenEntrypoint (route) {
            return withFuture(route, entrypoints);
        },
        onEntrypoint (route, execute) {
            ;
            (execute ? Promise.resolve().then(()=>execute()).then((exports1)=>({
                    component: exports1 && exports1.default || exports1,
                    exports: exports1
                }), (err)=>({
                    error: err
                })) : Promise.resolve(undefined)).then((input)=>{
                const old = entrypoints.get(route);
                if (old && 'resolve' in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute (route, prefetch) {
            return withFuture(route, routes, ()=>{
                let devBuildPromiseResolve;
                if ("TURBOPACK compile-time truthy", 1) {
                    devBuildPromise = new Promise((resolve)=>{
                        devBuildPromiseResolve = resolve;
                    });
                }
                return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(({ scripts, css })=>{
                    return Promise.all([
                        entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)),
                        Promise.all(css.map(fetchStyleSheet))
                    ]);
                }).then((res)=>{
                    return this.whenEntrypoint(route).then((entrypoint)=>({
                            entrypoint,
                            styles: res[1]
                        }));
                }), MS_MAX_IDLE_DELAY, markAssetError(Object.defineProperty(new Error(`Route did not complete loading: ${route}`), "__NEXT_ERROR_CODE", {
                    value: "E12",
                    enumerable: false,
                    configurable: true
                }))).then(({ entrypoint, styles })=>{
                    const res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return 'error' in entrypoint ? entrypoint : res;
                }).catch((err)=>{
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(()=>devBuildPromiseResolve?.());
            });
        },
        prefetch (route) {
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            let cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>prefetchViaDom(script.toString(), 'script')) : [])).then(()=>{
                (0, _requestidlecallback.requestIdleCallback)(()=>this.loadRoute(route, true).catch(()=>{}));
            }).catch(()=>{});
        }
    };
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-loader.js.map
}),
"[project]/node_modules/next/dist/client/page-loader.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return PageLoader;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _addbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/add-base-path.js [client] (ecmascript)");
const _interpolateas = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/interpolate-as'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _getassetpathfromroute = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/get-asset-path-from-route'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _addlocale = __turbopack_context__.r("[project]/node_modules/next/dist/client/add-locale.js [client] (ecmascript)");
const _isdynamic = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/is-dynamic'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _parserelativeurl = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/parse-relative-url'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _removetrailingslash = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/remove-trailing-slash'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _routeloader = __turbopack_context__.r("[project]/node_modules/next/dist/client/route-loader.js [client] (ecmascript)");
const _constants = (()=>{
    const e = new Error("Cannot find module '../shared/lib/constants'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
class PageLoader {
    constructor(buildId, assetPrefix){
        this.routeLoader = (0, _routeloader.createRouteLoader)(assetPrefix);
        this.buildId = buildId;
        this.assetPrefix = assetPrefix;
        this.promisedSsgManifest = new Promise((resolve)=>{
            if (window.__SSG_MANIFEST) {
                resolve(window.__SSG_MANIFEST);
            } else {
                window.__SSG_MANIFEST_CB = ()=>{
                    resolve(window.__SSG_MANIFEST);
                };
            }
        });
    }
    getPageList() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            if (window.__DEV_PAGES_MANIFEST) {
                return window.__DEV_PAGES_MANIFEST.pages;
            } else {
                this.promisedDevPagesManifest ||= fetch(`${this.assetPrefix}/_next/static/development/${_constants.DEV_CLIENT_PAGES_MANIFEST}`, {
                    credentials: 'same-origin'
                }).then((res)=>res.json()).then((manifest)=>{
                    window.__DEV_PAGES_MANIFEST = manifest;
                    return manifest.pages;
                }).catch((err)=>{
                    console.log(`Failed to fetch devPagesManifest:`, err);
                    throw Object.defineProperty(new Error(`Failed to fetch _devPagesManifest.json. Is something blocking that network request?\n` + 'Read more: https://nextjs.org/docs/messages/failed-to-fetch-devpagesmanifest'), "__NEXT_ERROR_CODE", {
                        value: "E423",
                        enumerable: false,
                        configurable: true
                    });
                });
                return this.promisedDevPagesManifest;
            }
        }
    }
    getMiddleware() {
        // Webpack production
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            if (window.__DEV_MIDDLEWARE_MATCHERS) {
                return window.__DEV_MIDDLEWARE_MATCHERS;
            } else {
                if (!this.promisedMiddlewareMatchers) {
                    // TODO: Decide what should happen when fetching fails instead of asserting
                    // @ts-ignore
                    this.promisedMiddlewareMatchers = fetch(`${this.assetPrefix}/_next/static/${this.buildId}/${_constants.DEV_CLIENT_MIDDLEWARE_MANIFEST}`, {
                        credentials: 'same-origin'
                    }).then((res)=>res.json()).then((matchers)=>{
                        window.__DEV_MIDDLEWARE_MATCHERS = matchers;
                        return matchers;
                    }).catch((err)=>{
                        console.log(`Failed to fetch _devMiddlewareManifest`, err);
                    });
                }
                // TODO Remove this assertion as this could be undefined
                return this.promisedMiddlewareMatchers;
            }
        }
    }
    getDataHref(params) {
        const { asPath, href, locale } = params;
        const { pathname: hrefPathname, query, search } = (0, _parserelativeurl.parseRelativeUrl)(href);
        const { pathname: asPathname } = (0, _parserelativeurl.parseRelativeUrl)(asPath);
        const route = (0, _removetrailingslash.removeTrailingSlash)(hrefPathname);
        if (route[0] !== '/') {
            throw Object.defineProperty(new Error(`Route name should start with a "/", got "${route}"`), "__NEXT_ERROR_CODE", {
                value: "E303",
                enumerable: false,
                configurable: true
            });
        }
        const getHrefForSlug = (path)=>{
            const dataRoute = (0, _getassetpathfromroute.default)((0, _removetrailingslash.removeTrailingSlash)((0, _addlocale.addLocale)(path, locale)), '.json');
            return (0, _addbasepath.addBasePath)(`/_next/data/${this.buildId}${dataRoute}${search}`, true);
        };
        return getHrefForSlug(params.skipInterpolation ? asPathname : (0, _isdynamic.isDynamicRoute)(route) ? (0, _interpolateas.interpolateAs)(hrefPathname, asPathname, query).result : route);
    }
    _isSsg(/** the route (file-system path) */ route) {
        return this.promisedSsgManifest.then((manifest)=>manifest.has(route));
    }
    loadPage(route) {
        return this.routeLoader.loadRoute(route).then((res)=>{
            if ('component' in res) {
                return {
                    page: res.component,
                    mod: res.exports,
                    styleSheets: res.styles.map((o)=>({
                            href: o.href,
                            text: o.content
                        }))
                };
            }
            throw res.error;
        });
    }
    prefetch(route) {
        return this.routeLoader.prefetch(route);
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=page-loader.js.map
}),
"[project]/node_modules/next/dist/lib/is-error.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getProperError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * Checks whether the given value is a NextError.
 * This can be used to print a more detailed error message with properties like `code` & `digest`.
 */ default: function() {
        return isError;
    },
    getProperError: function() {
        return getProperError;
    }
});
const _isplainobject = (()=>{
    const e = new Error("Cannot find module '../shared/lib/is-plain-object'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _safestablestringify = /*#__PURE__*/ _interop_require_default((()=>{
    const e = new Error("Cannot find module 'next/dist/compiled/safe-stable-stringify'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isError(err) {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        // provide better error for case where `throw undefined`
        // is called in development
        if (typeof err === 'undefined') {
            return Object.defineProperty(new Error('An undefined error was thrown, ' + 'see here for more info: https://nextjs.org/docs/messages/threw-undefined'), "__NEXT_ERROR_CODE", {
                value: "E98",
                enumerable: false,
                configurable: true
            });
        }
        if (err === null) {
            return Object.defineProperty(new Error('A null error was thrown, ' + 'see here for more info: https://nextjs.org/docs/messages/threw-undefined'), "__NEXT_ERROR_CODE", {
                value: "E336",
                enumerable: false,
                configurable: true
            });
        }
    }
    return Object.defineProperty(new Error((0, _isplainobject.isPlainObject)(err) ? (0, _safestablestringify.default)(err) : err + ''), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=is-error.js.map
}),
"[project]/node_modules/next/dist/client/with-router.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return withRouter;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _jsxruntime = (()=>{
    const e = new Error("Cannot find module 'react/jsx-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _react = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module 'react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _router = __turbopack_context__.r("[project]/node_modules/next/dist/client/router.js [client] (ecmascript)");
function withRouter(ComposedComponent) {
    function WithRouterWrapper(props) {
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(ComposedComponent, {
            router: (0, _router.useRouter)(),
            ...props
        });
    }
    WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
    WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;
    if ("TURBOPACK compile-time truthy", 1) {
        const name = ComposedComponent.displayName || ComposedComponent.name || 'Unknown';
        WithRouterWrapper.displayName = `withRouter(${name})`;
    }
    return WithRouterWrapper;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=with-router.js.map
}),
"[project]/node_modules/next/dist/client/router.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* global window */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Router: null,
    createRouter: null,
    default: null,
    makePublicRouterInstance: null,
    useRouter: null,
    withRouter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Router: function() {
        return _router.default;
    },
    createRouter: function() {
        return createRouter;
    },
    // Export the singletonRouter and this is the public API.
    default: function() {
        return _default;
    },
    makePublicRouterInstance: function() {
        return makePublicRouterInstance;
    },
    useRouter: function() {
        return useRouter;
    },
    withRouter: function() {
        return _withrouter.default;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _react = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module 'react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _router = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module '../shared/lib/router/router'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _routercontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _iserror = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/lib/is-error.js [client] (ecmascript)"));
const _withrouter = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/client/with-router.js [client] (ecmascript)"));
const singletonRouter = {
    router: null,
    readyCallbacks: [],
    ready (callback) {
        if (this.router) return callback();
        if (typeof window !== 'undefined') {
            this.readyCallbacks.push(callback);
        }
    }
};
// Create public properties and methods of the router in the singletonRouter
const urlPropertyFields = [
    'pathname',
    'route',
    'query',
    'asPath',
    'components',
    'isFallback',
    'basePath',
    'locale',
    'locales',
    'defaultLocale',
    'isReady',
    'isPreview',
    'isLocaleDomain',
    'domainLocales'
];
const routerEvents = [
    'routeChangeStart',
    'beforeHistoryChange',
    'routeChangeComplete',
    'routeChangeError',
    'hashChangeStart',
    'hashChangeComplete'
];
const coreMethodFields = [
    'push',
    'replace',
    'reload',
    'back',
    'prefetch',
    'beforePopState'
];
// Events is a static property on the router, the router doesn't have to be initialized to use it
Object.defineProperty(singletonRouter, 'events', {
    get () {
        return _router.default.events;
    }
});
function getRouter() {
    if (!singletonRouter.router) {
        const message = 'No router instance found.\n' + 'You should only use "next/router" on the client side of your app.\n';
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return singletonRouter.router;
}
urlPropertyFields.forEach((field)=>{
    // Here we need to use Object.defineProperty because we need to return
    // the property assigned to the actual router
    // The value might get changed as we change routes and this is the
    // proper way to access it
    Object.defineProperty(singletonRouter, field, {
        get () {
            const router = getRouter();
            return router[field];
        }
    });
});
coreMethodFields.forEach((field)=>{
    // We don't really know the types here, so we add them later instead
    ;
    singletonRouter[field] = (...args)=>{
        const router = getRouter();
        return router[field](...args);
    };
});
routerEvents.forEach((event)=>{
    singletonRouter.ready(()=>{
        _router.default.events.on(event, (...args)=>{
            const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(1)}`;
            const _singletonRouter = singletonRouter;
            if (_singletonRouter[eventField]) {
                try {
                    _singletonRouter[eventField](...args);
                } catch (err) {
                    console.error(`Error when running the Router event: ${eventField}`);
                    console.error((0, _iserror.default)(err) ? `${err.message}\n${err.stack}` : err + '');
                }
            }
        });
    });
});
const _default = singletonRouter;
function useRouter() {
    const router = _react.default.useContext(_routercontextsharedruntime.RouterContext);
    if (!router) {
        throw Object.defineProperty(new Error('NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted'), "__NEXT_ERROR_CODE", {
            value: "E509",
            enumerable: false,
            configurable: true
        });
    }
    return router;
}
function createRouter(...args) {
    singletonRouter.router = new _router.default(...args);
    singletonRouter.readyCallbacks.forEach((cb)=>cb());
    singletonRouter.readyCallbacks = [];
    return singletonRouter.router;
}
function makePublicRouterInstance(router) {
    const scopedRouter = router;
    const instance = {};
    for (const property of urlPropertyFields){
        if (typeof scopedRouter[property] === 'object') {
            instance[property] = Object.assign(Array.isArray(scopedRouter[property]) ? [] : {}, scopedRouter[property]) // makes sure query is not stateful
            ;
            continue;
        }
        instance[property] = scopedRouter[property];
    }
    // Events is a static property on the router, the router doesn't have to be initialized to use it
    instance.events = _router.default.events;
    coreMethodFields.forEach((field)=>{
        instance[field] = (...args)=>{
            return scopedRouter[field](...args);
        };
    });
    return instance;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=router.js.map
}),
"[project]/node_modules/next/dist/client/route-announcer.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RouteAnnouncer: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RouteAnnouncer: function() {
        return RouteAnnouncer;
    },
    default: function() {
        return _default;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _jsxruntime = (()=>{
    const e = new Error("Cannot find module 'react/jsx-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _react = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module 'react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _router = __turbopack_context__.r("[project]/node_modules/next/dist/client/router.js [client] (ecmascript)");
const nextjsRouteAnnouncerStyles = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 0,
    width: '1px',
    // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
    whiteSpace: 'nowrap',
    wordWrap: 'normal'
};
const RouteAnnouncer = ()=>{
    const { asPath } = (0, _router.useRouter)();
    const [routeAnnouncement, setRouteAnnouncement] = _react.default.useState('');
    // Only announce the path change, but not for the first load because screen
    // reader will do that automatically.
    const previouslyLoadedPath = _react.default.useRef(asPath);
    // Every time the path changes, announce the new page’s title following this
    // priority: first the document title (from head), otherwise the first h1, or
    // if none of these exist, then the pathname from the URL. This methodology is
    // inspired by Marcy Sutton’s accessible client routing user testing. More
    // information can be found here:
    // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
    _react.default.useEffect({
        "RouteAnnouncer.useEffect": ()=>{
            // If the path hasn't change, we do nothing.
            if (previouslyLoadedPath.current === asPath) return;
            previouslyLoadedPath.current = asPath;
            if (document.title) {
                setRouteAnnouncement(document.title);
            } else {
                const pageHeader = document.querySelector('h1');
                const content = pageHeader?.innerText ?? pageHeader?.textContent;
                setRouteAnnouncement(content || asPath);
            }
        }
    }["RouteAnnouncer.useEffect"], [
        asPath
    ]);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("p", {
        "aria-live": "assertive" // Make the announcement immediately.
        ,
        id: "__next-route-announcer__",
        role: "alert",
        style: nextjsRouteAnnouncerStyles,
        children: routeAnnouncement
    });
};
const _default = RouteAnnouncer;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-announcer.js.map
}),
"[project]/node_modules/next/dist/client/has-base-path.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasBasePath", {
    enumerable: true,
    get: function() {
        return hasBasePath;
    }
});
const _pathhasprefix = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/path-has-prefix'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const basePath = ("TURBOPACK compile-time value", "") || '';
function hasBasePath(path) {
    return (0, _pathhasprefix.pathHasPrefix)(path, basePath);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=has-base-path.js.map
}),
"[project]/node_modules/next/dist/client/remove-base-path.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeBasePath", {
    enumerable: true,
    get: function() {
        return removeBasePath;
    }
});
const _hasbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/has-base-path.js [client] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function removeBasePath(path) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Can't trim the basePath if it has zero length!
    if (basePath.length === 0) return path;
    path = path.slice(basePath.length);
    if (!path.startsWith('/')) path = `/${path}`;
    return path;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-base-path.js.map
}),
"[project]/node_modules/next/dist/client/components/redirect-status-code.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RedirectStatusCode", {
    enumerable: true,
    get: function() {
        return RedirectStatusCode;
    }
});
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-status-code.js.map
}),
"[project]/node_modules/next/dist/client/components/redirect-error.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    REDIRECT_ERROR_CODE: null,
    RedirectType: null,
    isRedirectError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    REDIRECT_ERROR_CODE: function() {
        return REDIRECT_ERROR_CODE;
    },
    RedirectType: function() {
        return RedirectType;
    },
    isRedirectError: function() {
        return isRedirectError;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/redirect-status-code.js [client] (ecmascript)");
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
var RedirectType = /*#__PURE__*/ function(RedirectType) {
    RedirectType["push"] = "push";
    RedirectType["replace"] = "replace";
    return RedirectType;
}({});
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in _redirectstatuscode.RedirectStatusCode;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-error.js.map
}),
"[project]/node_modules/next/dist/client/components/is-next-router-error.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNextRouterError", {
    enumerable: true,
    get: function() {
        return isNextRouterError;
    }
});
const _httpaccessfallback = (()=>{
    const e = new Error("Cannot find module './http-access-fallback/http-access-fallback'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _redirecterror = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/redirect-error.js [client] (ecmascript)");
function isNextRouterError(error) {
    return (0, _redirecterror.isRedirectError)(error) || (0, _httpaccessfallback.isHTTPAccessFallbackError)(error);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=is-next-router-error.js.map
}),
"[project]/node_modules/next/dist/client/script.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    handleClientScriptLoad: null,
    initScriptLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    handleClientScriptLoad: function() {
        return handleClientScriptLoad;
    },
    initScriptLoader: function() {
        return initScriptLoader;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _interop_require_wildcard = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_wildcard'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _jsxruntime = (()=>{
    const e = new Error("Cannot find module 'react/jsx-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _reactdom = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module 'react-dom'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _react = /*#__PURE__*/ _interop_require_wildcard._((()=>{
    const e = new Error("Cannot find module 'react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _headmanagercontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/head-manager-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _setattributesfromprops = __turbopack_context__.r("[project]/node_modules/next/dist/client/set-attributes-from-props.js [client] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/node_modules/next/dist/client/request-idle-callback.js [client] (ecmascript)");
const ScriptCache = new Map();
const LoadCache = new Set();
const insertStylesheets = (stylesheets)=>{
    // Case 1: Styles for afterInteractive/lazyOnload with appDir injected via handleClientScriptLoad
    //
    // Using ReactDOM.preinit to feature detect appDir and inject styles
    // Stylesheets might have already been loaded if initialized with Script component
    // Re-inject styles here to handle scripts loaded via handleClientScriptLoad
    // ReactDOM.preinit handles dedup and ensures the styles are loaded only once
    if (_reactdom.default.preinit) {
        stylesheets.forEach((stylesheet)=>{
            _reactdom.default.preinit(stylesheet, {
                as: 'style'
            });
        });
        return;
    }
    // Case 2: Styles for afterInteractive/lazyOnload with pages injected via handleClientScriptLoad
    //
    // We use this function to load styles when appdir is not detected
    // TODO: Use React float APIs to load styles once available for pages dir
    if (typeof window !== 'undefined') {
        let head = document.head;
        stylesheets.forEach((stylesheet)=>{
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = stylesheet;
            head.appendChild(link);
        });
    }
};
const loadScript = (props)=>{
    const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = '', strategy = 'afterInteractive', onError, stylesheets } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement('script');
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener('load', function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener('error', function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    if (strategy === 'worker') {
        el.setAttribute('type', 'text/partytown');
    }
    el.setAttribute('data-nscript', strategy);
    // Load styles associated with this script
    if (stylesheets) {
        insertStylesheets(stylesheets);
    }
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy = 'afterInteractive' } = props;
    if (strategy === 'lazyOnload') {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === 'complete') {
        (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
    } else {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute('src');
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
/**
 * Load a third-party scripts in an optimized way.
 *
 * Read more: [Next.js Docs: `next/script`](https://nextjs.org/docs/app/api-reference/components/script)
 */ function Script(props) {
    const { id, src = '', onLoad = ()=>{}, onReady = null, strategy = 'afterInteractive', onError, stylesheets, ...restProps } = props;
    // Context is available only during SSR
    let { updateScripts, scripts, getIsSsr, appDir, nonce } = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    // if a nonce is explicitly passed to the script tag, favor that over the automatic handling
    nonce = restProps.nonce || nonce;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === 'afterInteractive') {
                loadScript(props);
            } else if (strategy === 'lazyOnload') {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === 'beforeInteractive' || strategy === 'worker') {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                {
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError,
                    ...restProps,
                    nonce
                }
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript({
                ...props,
                nonce
            });
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Injecting stylesheets here handles beforeInteractive and worker scripts correctly
        // For other strategies injecting here ensures correct stylesheet order
        // ReactDOM.preinit handles loading the styles in the correct order,
        // also ensures the stylesheet is loaded only once and in a consistent manner
        //
        // Case 1: Styles for beforeInteractive/worker with appDir - handled here
        // Case 2: Styles for beforeInteractive/worker with pages dir - Not handled yet
        // Case 3: Styles for afterInteractive/lazyOnload with appDir - handled here
        // Case 4: Styles for afterInteractive/lazyOnload with pages dir - handled in insertStylesheets function
        if (stylesheets) {
            stylesheets.forEach((styleSrc)=>{
                _reactdom.default.preinit(styleSrc, {
                    as: 'style'
                });
            });
        }
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === 'beforeInteractive') {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            0,
                            {
                                ...restProps,
                                id
                            }
                        ])})`
                    }
                });
            } else {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            src,
                            {
                                ...restProps,
                                id
                            }
                        ])})`
                    }
                });
            }
        } else if (strategy === 'afterInteractive') {
            if (src) {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, '__nextScript', {
    value: true
});
const _default = Script;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map
}),
"[project]/node_modules/next/dist/client/index.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* global location */ // imports polyfill from `@next/polyfill-module` after build.
(()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    emitter: null,
    hydrate: null,
    initialize: null,
    router: null,
    version: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    emitter: function() {
        return emitter;
    },
    hydrate: function() {
        return hydrate;
    },
    initialize: function() {
        return initialize;
    },
    router: function() {
        return router;
    },
    version: function() {
        return version;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _jsxruntime = (()=>{
    const e = new Error("Cannot find module 'react/jsx-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../build/polyfills/polyfill-module'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _react = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module 'react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _client = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module 'react-dom/client'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _headmanagercontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/head-manager-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _mitt = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module '../shared/lib/mitt'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _routercontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _disablesmoothscroll = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/disable-smooth-scroll'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _isdynamic = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/is-dynamic'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _querystring = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/querystring'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _utils = (()=>{
    const e = new Error("Cannot find module '../shared/lib/utils'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _portal = (()=>{
    const e = new Error("Cannot find module './portal'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _headmanager = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/client/head-manager.js [client] (ecmascript)"));
const _pageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/client/page-loader.js [client] (ecmascript)"));
const _routeannouncer = __turbopack_context__.r("[project]/node_modules/next/dist/client/route-announcer.js [client] (ecmascript)");
const _router = __turbopack_context__.r("[project]/node_modules/next/dist/client/router.js [client] (ecmascript)");
const _iserror = __turbopack_context__.r("[project]/node_modules/next/dist/lib/is-error.js [client] (ecmascript)");
const _imageconfigcontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/image-config-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _removebasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/remove-base-path.js [client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/has-base-path.js [client] (ecmascript)");
const _approutercontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/app-router-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _adapters = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/adapters'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _hooksclientcontextsharedruntime = (()=>{
    const e = new Error("Cannot find module '../shared/lib/hooks-client-context.shared-runtime'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _onrecoverableerror = (()=>{
    const e = new Error("Cannot find module './react-client-callbacks/on-recoverable-error'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _tracer = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module './tracing/tracer'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _isnextroutererror = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/is-next-router-error.js [client] (ecmascript)");
const version = "16.0.1";
let router;
const emitter = (0, _mitt.default)();
const looseToArray = (input)=>[].slice.call(input);
let initialData;
let defaultLocale = undefined;
let asPath;
let pageLoader;
let appElement;
let headManager;
let initialMatchesMiddleware = false;
let lastAppProps;
let lastRenderReject;
let devClient;
let CachedApp, onPerfEntry;
let CachedComponent;
class Container extends _react.default.Component {
    componentDidCatch(componentErr, info) {
        this.props.fn(componentErr, info);
    }
    componentDidMount() {
        this.scrollToHash();
        // We need to replace the router state if:
        // - the page was (auto) exported and has a query string or search (hash)
        // - it was auto exported and is a dynamic route (to provide params)
        // - if it is a client-side skeleton (fallback render)
        // - if middleware matches the current page (may have rewrite params)
        // - if rewrites in next.config.js match (may have rewrite params)
        if (router.isSsr && (initialData.isFallback || initialData.nextExport && ((0, _isdynamic.isDynamicRoute)(router.pathname) || location.search || ("TURBOPACK compile-time value", false) || initialMatchesMiddleware) || initialData.props && initialData.props.__N_SSG && (location.search || ("TURBOPACK compile-time value", false) || initialMatchesMiddleware))) {
            // update query on mount for exported pages
            router.replace(router.pathname + '?' + String((0, _querystring.assign)((0, _querystring.urlQueryToSearchParams)(router.query), new URLSearchParams(location.search))), asPath, {
                // @ts-ignore
                // WARNING: `_h` is an internal option for handing Next.js
                // client-side hydration. Your app should _never_ use this property.
                // It may change at any time without notice.
                _h: 1,
                // Fallback pages must trigger the data fetch, so the transition is
                // not shallow.
                // Other pages (strictly updating query) happens shallowly, as data
                // requirements would already be present.
                shallow: !initialData.isFallback && !initialMatchesMiddleware
            }).catch((err)=>{
                if (!err.cancelled) throw err;
            });
        }
    }
    componentDidUpdate() {
        this.scrollToHash();
    }
    scrollToHash() {
        let { hash } = location;
        hash = hash && hash.substring(1);
        if (!hash) return;
        const el = document.getElementById(hash);
        if (!el) return;
        // If we call scrollIntoView() in here without a setTimeout
        // it won't scroll properly.
        setTimeout(()=>el.scrollIntoView(), 0);
    }
    render() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            const { PagesDevOverlayBridge } = (()=>{
                const e = new Error("Cannot find module '../next-devtools/userspace/pages/pages-dev-overlay-setup'");
                e.code = 'MODULE_NOT_FOUND';
                throw e;
            })();
            return /*#__PURE__*/ (0, _jsxruntime.jsx)(PagesDevOverlayBridge, {
                children: this.props.children
            });
        }
    }
}
async function initialize(opts = {}) {
    // This makes sure this specific lines are removed in production
    if ("TURBOPACK compile-time truthy", 1) {
        _tracer.default.onSpanEnd((()=>{
            const e = new Error("Cannot find module './tracing/report-to-socket'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        })().default);
        devClient = opts.devClient;
    }
    initialData = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
    window.__NEXT_DATA__ = initialData;
    defaultLocale = initialData.defaultLocale;
    const prefix = initialData.assetPrefix || '';
    self.__next_set_public_path__(`${prefix}/_next/`);
    asPath = (0, _utils.getURL)();
    // make sure not to attempt stripping basePath for 404s
    if ((0, _hasbasepath.hasBasePath)(asPath)) {
        asPath = (0, _removebasepath.removeBasePath)(asPath);
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (initialData.scriptLoader) {
        const { initScriptLoader } = __turbopack_context__.r("[project]/node_modules/next/dist/client/script.js [client] (ecmascript)");
        initScriptLoader(initialData.scriptLoader);
    }
    pageLoader = new _pageloader.default(initialData.buildId, prefix);
    const register = ([r, f])=>pageLoader.routeLoader.onEntrypoint(r, f);
    if (window.__NEXT_P) {
        // Defer page registration for another tick. This will increase the overall
        // latency in hydrating the page, but reduce the total blocking time.
        window.__NEXT_P.map((p)=>setTimeout(()=>register(p), 0));
    }
    window.__NEXT_P = [];
    window.__NEXT_P.push = register;
    headManager = (0, _headmanager.default)();
    headManager.getIsSsr = ()=>{
        return router.isSsr;
    };
    appElement = document.getElementById('__next');
    return {
        assetPrefix: prefix
    };
}
function renderApp(App, appProps) {
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(App, {
        ...appProps
    });
}
function AppContainer({ children }) {
    // Create a memoized value for next/navigation router context.
    const adaptedForAppRouter = _react.default.useMemo({
        "AppContainer.useMemo[adaptedForAppRouter]": ()=>{
            return (0, _adapters.adaptForAppRouterInstance)(router);
        }
    }["AppContainer.useMemo[adaptedForAppRouter]"], []);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(Container, {
        fn: (error)=>renderError({
                App: CachedApp,
                err: error
            }).catch((err)=>console.error('Error rendering page: ', err)),
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.AppRouterContext.Provider, {
            value: adaptedForAppRouter,
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.SearchParamsContext.Provider, {
                value: (0, _adapters.adaptForSearchParams)(router),
                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_adapters.PathnameContextProviderAdapter, {
                    router: router,
                    isAutoExport: self.__NEXT_DATA__.autoExport ?? false,
                    children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.PathParamsContext.Provider, {
                        value: (0, _adapters.adaptForPathParams)(router),
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_routercontextsharedruntime.RouterContext.Provider, {
                            value: (0, _router.makePublicRouterInstance)(router),
                            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_headmanagercontextsharedruntime.HeadManagerContext.Provider, {
                                value: headManager,
                                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_imageconfigcontextsharedruntime.ImageConfigContext.Provider, {
                                    value: ("TURBOPACK compile-time value", {
                                        "deviceSizes": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", 640),
                                            ("TURBOPACK compile-time value", 750),
                                            ("TURBOPACK compile-time value", 828),
                                            ("TURBOPACK compile-time value", 1080),
                                            ("TURBOPACK compile-time value", 1200),
                                            ("TURBOPACK compile-time value", 1920),
                                            ("TURBOPACK compile-time value", 2048),
                                            ("TURBOPACK compile-time value", 3840)
                                        ]),
                                        "imageSizes": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", 32),
                                            ("TURBOPACK compile-time value", 48),
                                            ("TURBOPACK compile-time value", 64),
                                            ("TURBOPACK compile-time value", 96),
                                            ("TURBOPACK compile-time value", 128),
                                            ("TURBOPACK compile-time value", 256),
                                            ("TURBOPACK compile-time value", 384)
                                        ]),
                                        "qualities": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", 75)
                                        ]),
                                        "path": ("TURBOPACK compile-time value", "/_next/image"),
                                        "loader": ("TURBOPACK compile-time value", "default"),
                                        "dangerouslyAllowSVG": ("TURBOPACK compile-time value", false),
                                        "unoptimized": ("TURBOPACK compile-time value", false),
                                        "domains": ("TURBOPACK compile-time value", []),
                                        "remotePatterns": ("TURBOPACK compile-time value", []),
                                        "localPatterns": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", {
                                                "pathname": ("TURBOPACK compile-time value", "**"),
                                                "search": ("TURBOPACK compile-time value", "")
                                            })
                                        ])
                                    }),
                                    children: children
                                })
                            })
                        })
                    })
                })
            })
        })
    });
}
const wrapApp = (App)=>(wrappedAppProps)=>{
        const appProps = {
            ...wrappedAppProps,
            Component: CachedComponent,
            err: initialData.err,
            router
        };
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(AppContainer, {
            children: renderApp(App, appProps)
        });
    };
// This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.
function renderError(renderErrorProps) {
    let { App, err } = renderErrorProps;
    // In development runtime errors are caught by our overlay
    // In production we catch runtime errors using componentDidCatch which will trigger renderError
    if ("TURBOPACK compile-time truthy", 1) {
        // A Next.js rendering runtime error is always unrecoverable
        // FIXME: let's make this recoverable (error in GIP client-transition)
        devClient.onUnrecoverableError();
        // We need to render an empty <App> so that the `<ReactDevOverlay>` can
        // render itself.
        return doRender({
            App: ()=>null,
            props: {},
            Component: ()=>null,
            styleSheets: []
        });
    }
    //TURBOPACK unreachable
    ;
}
// Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.
function Head({ callback }) {
    // We use `useLayoutEffect` to guarantee the callback is executed
    // as soon as React flushes the update.
    _react.default.useLayoutEffect({
        "Head.useLayoutEffect": ()=>callback()
    }["Head.useLayoutEffect"], [
        callback
    ]);
    return null;
}
const performanceMarks = {
    navigationStart: 'navigationStart',
    beforeRender: 'beforeRender',
    afterRender: 'afterRender',
    afterHydrate: 'afterHydrate',
    routeChange: 'routeChange'
};
const performanceMeasures = {
    hydration: 'Next.js-hydration',
    beforeHydration: 'Next.js-before-hydration',
    routeChangeToRender: 'Next.js-route-change-to-render',
    render: 'Next.js-render'
};
let reactRoot = null;
// On initial render a hydrate should always happen
let shouldHydrate = true;
function clearMarks() {
    ;
    [
        performanceMarks.beforeRender,
        performanceMarks.afterHydrate,
        performanceMarks.afterRender,
        performanceMarks.routeChange
    ].forEach((mark)=>performance.clearMarks(mark));
}
function markHydrateComplete() {
    if (!_utils.ST) return;
    performance.mark(performanceMarks.afterHydrate) // mark end of hydration
    ;
    const hasBeforeRenderMark = performance.getEntriesByName(performanceMarks.beforeRender, 'mark').length;
    if (hasBeforeRenderMark) {
        const beforeHydrationMeasure = performance.measure(performanceMeasures.beforeHydration, performanceMarks.navigationStart, performanceMarks.beforeRender);
        const hydrationMeasure = performance.measure(performanceMeasures.hydration, performanceMarks.beforeRender, performanceMarks.afterHydrate);
        if (("TURBOPACK compile-time value", "development") === 'development' && // Old versions of Safari don't return `PerformanceMeasure`s from `performance.measure()`
        beforeHydrationMeasure && hydrationMeasure) {
            _tracer.default.startSpan('navigation-to-hydration', {
                startTime: performance.timeOrigin + beforeHydrationMeasure.startTime,
                attributes: {
                    pathname: location.pathname,
                    query: location.search
                }
            }).end(performance.timeOrigin + hydrationMeasure.startTime + hydrationMeasure.duration);
        }
    }
    if (onPerfEntry) {
        performance.getEntriesByName(performanceMeasures.hydration).forEach(onPerfEntry);
    }
    clearMarks();
}
function markRenderComplete() {
    if (!_utils.ST) return;
    performance.mark(performanceMarks.afterRender) // mark end of render
    ;
    const navStartEntries = performance.getEntriesByName(performanceMarks.routeChange, 'mark');
    if (!navStartEntries.length) return;
    const hasBeforeRenderMark = performance.getEntriesByName(performanceMarks.beforeRender, 'mark').length;
    if (hasBeforeRenderMark) {
        performance.measure(performanceMeasures.routeChangeToRender, navStartEntries[0].name, performanceMarks.beforeRender);
        performance.measure(performanceMeasures.render, performanceMarks.beforeRender, performanceMarks.afterRender);
        if (onPerfEntry) {
            performance.getEntriesByName(performanceMeasures.render).forEach(onPerfEntry);
            performance.getEntriesByName(performanceMeasures.routeChangeToRender).forEach(onPerfEntry);
        }
    }
    clearMarks();
    [
        performanceMeasures.routeChangeToRender,
        performanceMeasures.render
    ].forEach((measure)=>performance.clearMeasures(measure));
}
function renderReactElement(domEl, fn) {
    // mark start of hydrate/render
    if (_utils.ST) {
        performance.mark(performanceMarks.beforeRender);
    }
    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
    if (!reactRoot) {
        // Unlike with createRoot, you don't need a separate root.render() call here
        reactRoot = _client.default.hydrateRoot(domEl, reactEl, {
            onRecoverableError: _onrecoverableerror.onRecoverableError
        });
        // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
        shouldHydrate = false;
    } else {
        const startTransition = _react.default.startTransition;
        startTransition(()=>{
            reactRoot.render(reactEl);
        });
    }
}
function Root({ callbacks, children }) {
    // We use `useLayoutEffect` to guarantee the callbacks are executed
    // as soon as React flushes the update
    _react.default.useLayoutEffect({
        "Root.useLayoutEffect": ()=>callbacks.forEach({
                "Root.useLayoutEffect": (callback)=>callback()
            }["Root.useLayoutEffect"])
    }["Root.useLayoutEffect"], [
        callbacks
    ]);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return children;
}
function doRender(input) {
    let { App, Component, props, err } = input;
    let styleSheets = 'initial' in input ? undefined : input.styleSheets;
    Component = Component || lastAppProps.Component;
    props = props || lastAppProps.props;
    const appProps = {
        ...props,
        Component,
        err,
        router
    };
    // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
    lastAppProps = appProps;
    let canceled = false;
    let resolvePromise;
    const renderPromise = new Promise((resolve, reject)=>{
        if (lastRenderReject) {
            lastRenderReject();
        }
        resolvePromise = ()=>{
            lastRenderReject = null;
            resolve();
        };
        lastRenderReject = ()=>{
            canceled = true;
            lastRenderReject = null;
            const error = Object.defineProperty(new Error('Cancel rendering route'), "__NEXT_ERROR_CODE", {
                value: "E503",
                enumerable: false,
                configurable: true
            });
            error.cancelled = true;
            reject(error);
        };
    });
    // This function has a return type to ensure it doesn't start returning a
    // Promise. It should remain synchronous.
    function onStart() {
        if ("TURBOPACK compile-time truthy", 1) {
            return false;
        }
        //TURBOPACK unreachable
        ;
        const currentStyleTags = undefined;
        const currentHrefs = undefined;
        const noscript = undefined;
        const nonce = undefined;
    }
    function onHeadCommit() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (input.scroll) {
            const { x, y } = input.scroll;
            (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
                window.scrollTo(x, y);
            });
        }
    }
    function onRootCommit() {
        resolvePromise();
    }
    onStart();
    const elem = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)(Head, {
                callback: onHeadCommit
            }),
            /*#__PURE__*/ (0, _jsxruntime.jsxs)(AppContainer, {
                children: [
                    renderApp(App, appProps),
                    /*#__PURE__*/ (0, _jsxruntime.jsx)(_portal.Portal, {
                        type: "next-route-announcer",
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_routeannouncer.RouteAnnouncer, {})
                    })
                ]
            })
        ]
    });
    // We catch runtime errors using componentDidCatch which will trigger renderError
    renderReactElement(appElement, (callback)=>/*#__PURE__*/ (0, _jsxruntime.jsx)(Root, {
            callbacks: [
                callback,
                onRootCommit
            ],
            children: ("TURBOPACK compile-time truthy", 1) ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.default.StrictMode, {
                children: elem
            }) : "TURBOPACK unreachable"
        }));
    return renderPromise;
}
async function render(renderingProps) {
    // if an error occurs in a server-side page (e.g. in getInitialProps),
    // skip re-rendering the error page client-side as data-fetching operations
    // will already have been done on the server and NEXT_DATA contains the correct
    // data for straight-forward hydration of the error page
    if (renderingProps.err && // renderingProps.Component might be undefined if there is a top/module-level error
    (typeof renderingProps.Component === 'undefined' || !renderingProps.isHydratePass)) {
        await renderError(renderingProps);
        return;
    }
    try {
        await doRender(renderingProps);
    } catch (err) {
        const renderErr = (0, _iserror.getProperError)(err);
        // bubble up cancelation errors
        if (renderErr.cancelled) {
            throw renderErr;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            // Ensure this error is displayed in the overlay in development
            setTimeout(()=>{
                throw renderErr;
            });
        }
        await renderError({
            ...renderingProps,
            err: renderErr
        });
    }
}
async function hydrate(opts) {
    let initialErr = initialData.err;
    try {
        const appEntrypoint = await pageLoader.routeLoader.whenEntrypoint('/_app');
        if ('error' in appEntrypoint) {
            throw appEntrypoint.error;
        }
        const { component: app, exports: mod } = appEntrypoint;
        CachedApp = app;
        if (mod && mod.reportWebVitals) {
            onPerfEntry = ({ id, name, startTime, value, duration, entryType, entries, attribution })=>{
                // Combines timestamp with random number for unique ID
                const uniqueID = `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
                let perfStartEntry;
                if (entries && entries.length) {
                    perfStartEntry = entries[0].startTime;
                }
                const webVitals = {
                    id: id || uniqueID,
                    name,
                    startTime: startTime || perfStartEntry,
                    value: value == null ? duration : value,
                    label: entryType === 'mark' || entryType === 'measure' ? 'custom' : 'web-vital'
                };
                if (attribution) {
                    webVitals.attribution = attribution;
                }
                mod.reportWebVitals(webVitals);
            };
        }
        const pageEntrypoint = // error, so we need to skip waiting for the entrypoint.
        ("TURBOPACK compile-time value", "development") === 'development' && initialData.err ? {
            error: initialData.err
        } : await pageLoader.routeLoader.whenEntrypoint(initialData.page);
        if ('error' in pageEntrypoint) {
            throw pageEntrypoint.error;
        }
        CachedComponent = pageEntrypoint.component;
        if ("TURBOPACK compile-time truthy", 1) {
            const { isValidElementType } = (()=>{
                const e = new Error("Cannot find module 'next/dist/compiled/react-is'");
                e.code = 'MODULE_NOT_FOUND';
                throw e;
            })();
            if (!isValidElementType(CachedComponent)) {
                throw Object.defineProperty(new Error(`The default export is not a React Component in page: "${initialData.page}"`), "__NEXT_ERROR_CODE", {
                    value: "E286",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    } catch (error) {
        // This catches errors like throwing in the top level of a module
        initialErr = (0, _iserror.getProperError)(error);
    }
    if ("TURBOPACK compile-time truthy", 1) {
        const getServerError = (()=>{
            const e = new Error("Cannot find module '../server/dev/node-stack-frames'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        })().getServerError;
        // Server-side runtime errors need to be re-thrown on the client-side so
        // that the overlay is rendered.
        if (initialErr) {
            if (initialErr === initialData.err) {
                setTimeout(()=>{
                    let error;
                    try {
                        // Generate a new error object. We `throw` it because some browsers
                        // will set the `stack` when thrown, and we want to ensure ours is
                        // not overridden when we re-throw it below.
                        throw Object.defineProperty(new Error(initialErr.message), "__NEXT_ERROR_CODE", {
                            value: "E394",
                            enumerable: false,
                            configurable: true
                        });
                    } catch (e) {
                        error = e;
                    }
                    error.name = initialErr.name;
                    error.stack = initialErr.stack;
                    const errSource = initialErr.source;
                    // In development, error the navigation API usage in runtime,
                    // since it's not allowed to be used in pages router as it doesn't contain error boundary like app router.
                    if ((0, _isnextroutererror.isNextRouterError)(initialErr)) {
                        error.message = 'Next.js navigation API is not allowed to be used in Pages Router.';
                    }
                    throw getServerError(error, errSource);
                });
            } else {
                setTimeout(()=>{
                    throw initialErr;
                });
            }
        }
    }
    if (window.__NEXT_PRELOADREADY) {
        await window.__NEXT_PRELOADREADY(initialData.dynamicIds);
    }
    router = (0, _router.createRouter)(initialData.page, initialData.query, asPath, {
        initialProps: initialData.props,
        pageLoader,
        App: CachedApp,
        Component: CachedComponent,
        wrapApp,
        err: initialErr,
        isFallback: Boolean(initialData.isFallback),
        subscription: (info, App, scroll)=>render(Object.assign({}, info, {
                App,
                scroll
            })),
        locale: initialData.locale,
        locales: initialData.locales,
        defaultLocale,
        domainLocales: initialData.domainLocales,
        isPreview: initialData.isPreview
    });
    initialMatchesMiddleware = await router._initialMatchesMiddlewarePromise;
    const renderCtx = {
        App: CachedApp,
        initial: true,
        Component: CachedComponent,
        props: initialData.props,
        err: initialErr,
        isHydratePass: true
    };
    if (opts?.beforeRender) {
        await opts.beforeRender();
    }
    render(renderCtx);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/next/dist/lib/require-instrumentation-client.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * This module imports the client instrumentation hook from the project root.
 *
 * The `private-next-instrumentation-client` module is automatically aliased to
 * the `instrumentation-client.ts` file in the project root by webpack or turbopack.
 */ (()=>{
    const e = new Error("Cannot find module 'node:process'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use strict";
if ("TURBOPACK compile-time truthy", 1) {
    const measureName = 'Client Instrumentation Hook';
    const startTime = performance.now();
    // eslint-disable-next-line @next/internal/typechecked-require -- Not a module.
    module.exports = {};
    const endTime = performance.now();
    const duration = endTime - startTime;
    // Using 16ms threshold as it represents one frame (1000ms/60fps)
    // This helps identify if the instrumentation hook initialization
    // could potentially cause frame drops during development.
    const THRESHOLD = 16;
    if (duration > THRESHOLD) {
        console.log(`[${measureName}] Slow execution detected: ${duration.toFixed(0)}ms (Note: Code download overhead is not included in this measurement)`);
    }
} else //TURBOPACK unreachable
;
 //# sourceMappingURL=require-instrumentation-client.js.map
}),
"[project]/node_modules/next/dist/client/page-bootstrap.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pageBootstrap", {
    enumerable: true,
    get: function() {
        return pageBootstrap;
    }
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
__turbopack_context__.r("[project]/node_modules/next/dist/lib/require-instrumentation-client.js [client] (ecmascript)");
const _ = __turbopack_context__.r("[project]/node_modules/next/dist/client/index.js [client] (ecmascript)");
const _ondemandentriesclient = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module './dev/on-demand-entries-client'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _fouc = (()=>{
    const e = new Error("Cannot find module './dev/fouc'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _websocket = (()=>{
    const e = new Error("Cannot find module './dev/hot-reloader/pages/websocket'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _querystring = (()=>{
    const e = new Error("Cannot find module '../shared/lib/router/utils/querystring'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _hotreloadertypes = (()=>{
    const e = new Error("Cannot find module '../server/dev/hot-reloader-types'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _runtimeerrorhandler = (()=>{
    const e = new Error("Cannot find module './dev/runtime-error-handler'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _shared = (()=>{
    const e = new Error("Cannot find module './dev/hot-reloader/shared'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _hotreloaderpages = (()=>{
    const e = new Error("Cannot find module './dev/hot-reloader/pages/hot-reloader-pages'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _nextdevtools = (()=>{
    const e = new Error("Cannot find module 'next/dist/compiled/next-devtools'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
function pageBootstrap(assetPrefix) {
    (0, _websocket.connectHMR)({
        assetPrefix,
        path: '/_next/webpack-hmr'
    });
    return (0, _.hydrate)({
        beforeRender: _fouc.displayContent
    }).then(()=>{
        (0, _ondemandentriesclient.default)();
        let reloading = false;
        (0, _websocket.addMessageListener)((message)=>{
            if (reloading) return;
            switch(message.type){
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.SERVER_ERROR:
                    {
                        const errorObject = JSON.parse(message.errorJSON);
                        const error = Object.defineProperty(new Error(errorObject.message), "__NEXT_ERROR_CODE", {
                            value: "E394",
                            enumerable: false,
                            configurable: true
                        });
                        error.stack = errorObject.stack;
                        throw error;
                    }
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.RELOAD_PAGE:
                    {
                        reloading = true;
                        window.location.reload();
                        break;
                    }
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.DEV_PAGES_MANIFEST_UPDATE:
                    {
                        fetch(`${assetPrefix}/_next/static/development/_devPagesManifest.json`).then((res)=>res.json()).then((manifest)=>{
                            window.__DEV_PAGES_MANIFEST = manifest;
                        }).catch((err)=>{
                            console.log(`Failed to fetch devPagesManifest`, err);
                        });
                        break;
                    }
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.MIDDLEWARE_CHANGES:
                    {
                        return window.location.reload();
                    }
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.CLIENT_CHANGES:
                    {
                        // This is used in `../server/dev/turbopack-utils.ts`.
                        const isOnErrorPage = window.next.router.pathname === '/_error';
                        // On the error page we want to reload the page when a page was changed
                        if (isOnErrorPage) {
                            if (_runtimeerrorhandler.RuntimeErrorHandler.hadRuntimeError) {
                                console.warn(_shared.REACT_REFRESH_FULL_RELOAD_FROM_ERROR);
                            }
                            reloading = true;
                            (0, _hotreloaderpages.performFullReload)(null);
                        }
                        break;
                    }
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.SERVER_ONLY_CHANGES:
                    {
                        if (_runtimeerrorhandler.RuntimeErrorHandler.hadRuntimeError) {
                            console.warn(_shared.REACT_REFRESH_FULL_RELOAD_FROM_ERROR);
                            (0, _hotreloaderpages.performFullReload)(null);
                        }
                        const { pages } = message;
                        // Make sure to reload when the dev-overlay is showing for an
                        // API route
                        // TODO: Fix `__NEXT_PAGE` type
                        if (pages.includes(_.router.query.__NEXT_PAGE)) {
                            return window.location.reload();
                        }
                        if (!_.router.clc && pages.includes(_.router.pathname)) {
                            console.log('Refreshing page data due to server-side change');
                            _nextdevtools.dispatcher.buildingIndicatorShow();
                            const clearIndicator = _nextdevtools.dispatcher.buildingIndicatorHide;
                            _.router.replace(_.router.pathname + '?' + String((0, _querystring.assign)((0, _querystring.urlQueryToSearchParams)(_.router.query), new URLSearchParams(location.search))), _.router.asPath, {
                                scroll: false
                            }).catch(()=>{
                                // trigger hard reload when failing to refresh data
                                // to show error overlay properly
                                location.reload();
                            }).finally(clearIndicator);
                        }
                        break;
                    }
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.ADDED_PAGE:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.REMOVED_PAGE:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.SERVER_COMPONENT_CHANGES:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.SYNC:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.BUILT:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.BUILDING:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.TURBOPACK_MESSAGE:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.TURBOPACK_CONNECTED:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.ISR_MANIFEST:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.DEVTOOLS_CONFIG:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.REACT_DEBUG_CHUNK:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.REQUEST_CURRENT_ERROR_STATE:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.REQUEST_PAGE_METADATA:
                case _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.CACHE_INDICATOR:
                    break;
                default:
                    message;
            }
        });
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=page-bootstrap.js.map
}),
"[project]/node_modules/next/dist/client/next-dev-turbopack.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// TODO: Remove use of `any` type.
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = (()=>{
    const e = new Error("Cannot find module '@swc/helpers/_/_interop_require_default'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const _ = __turbopack_context__.r("[project]/node_modules/next/dist/client/index.js [client] (ecmascript)");
const _hotmiddlewareclient = /*#__PURE__*/ _interop_require_default._((()=>{
    const e = new Error("Cannot find module './dev/hot-middleware-client'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})());
const _pagebootstrap = __turbopack_context__.r("[project]/node_modules/next/dist/client/page-bootstrap.js [client] (ecmascript)");
const _hmrclientts = __turbopack_context__.r("[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)");
window.next = {
    version: _.version,
    turbopack: true,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
self.__next_set_public_path__ = ()=>{};
self.__webpack_hash__ = '';
const devClient = (0, _hotmiddlewareclient.default)();
(0, _.initialize)({
    devClient
}).then(({ assetPrefix })=>{
    // for the page loader
    ;
    self.__turbopack_load_page_chunks__ = (page, chunksData)=>{
        const chunkPromises = chunksData.map((c)=>/*TURBOPACK member replacement*/ __turbopack_context__.l(c));
        Promise.all(chunkPromises).catch((err)=>console.error('failed to load chunks for page ' + page, err));
    };
    (0, _hmrclientts.connect)({
        addMessageListener (cb) {
            devClient.addTurbopackMessageListener(cb);
        },
        sendMessage: devClient.sendTurbopackMessage,
        onUpdateError: devClient.handleUpdateError
    });
    return (0, _pagebootstrap.pageBootstrap)(assetPrefix);
}).catch((err)=>{
    console.error('Error was not caught', err);
});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=next-dev-turbopack.js.map
}),
"[project]/node_modules/next/app.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = (()=>{
    const e = new Error("Cannot find module './dist/pages/_app'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/node_modules/next/app.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/_app";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/node_modules/next/app.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0e177983._.js.map