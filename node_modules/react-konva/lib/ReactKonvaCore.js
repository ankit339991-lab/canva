/**
 * Based on ReactArt.js
 * Copyright (c) 2017-present Lavrenov Anton.
 * All rights reserved.
 *
 * MIT
 */
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContextBridge = exports.useStrictMode = exports.Stage = exports.KonvaRenderer = exports.version = exports.Transformer = exports.Shape = exports.Arrow = exports.RegularPolygon = exports.Path = exports.Tag = exports.Arc = exports.Ring = exports.Star = exports.TextPath = exports.Text = exports.Image = exports.Sprite = exports.Line = exports.Wedge = exports.Ellipse = exports.Circle = exports.Rect = exports.Label = exports.Group = exports.FastLayer = exports.Layer = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const [reactMajor, reactMinor] = react_1.default.version.split('.').map(Number);
if (reactMajor !== 19 || reactMinor < 3) {
    throw new Error('react-konva requires React 19.3 or later within React 19. ' +
        'Install matching versions of react and react-dom. ' +
        'For React 19.2, use react-konva 19.2. For React 18, use react-konva 18.');
}
const Core_js_1 = __importDefault(require("konva/lib/Core.js"));
const react_reconciler_1 = __importDefault(require("react-reconciler"));
const constants_js_1 = require("react-reconciler/constants.js");
const HostConfig = __importStar(require("./ReactKonvaHostConfig.js"));
const EventBatch_js_1 = require("./EventBatch.js");
const makeUpdates_js_1 = require("./makeUpdates.js");
const its_fine_1 = require("its-fine");
Object.defineProperty(exports, "useContextBridge", { enumerable: true, get: function () { return its_fine_1.useContextBridge; } });
function SuspendCanvas({ promise }) {
    throw promise;
}
const StageWrap = (props) => {
    const container = react_1.default.useRef(null);
    const stage = react_1.default.useRef(null);
    const fiberRef = react_1.default.useRef(null);
    const children = react_1.default.useRef(null);
    const suspension = react_1.default.useRef(null);
    // DOM and Konva reconcilers have separate useId counters.
    const identifierPrefix = react_1.default.useId();
    const formStatus = (0, react_dom_1.useFormStatus)();
    const previousProps = react_1.default.useRef({});
    // Keep the render-time snapshot when React replays layout effects.
    const oldProps = previousProps.current;
    const Bridge = (0, its_fine_1.useContextBridge)();
    const fiber = (0, its_fine_1.useFiber)();
    const isStrictMode = !!(0, its_fine_1.traverseFiber)(fiber, true, (node) => node.type === react_1.default.StrictMode);
    const effectsDisconnected = react_1.default.useRef(false);
    const isUnmounting = react_1.default.useRef(false);
    const cancelUnmount = react_1.default.useRef(null);
    // Insertion effects stay mounted during hiding and StrictMode replay.
    // Activity has already disconnected layout and passive effects when hidden.
    // Its remaining insertion cleanups must still run inside a DOM commit.
    react_1.default.useInsertionEffect(() => {
        isUnmounting.current = false;
        return () => {
            isUnmounting.current = true;
            if (effectsDisconnected.current && stage.current)
                destroyStage();
        };
    }, []);
    const destroyStage = () => {
        cancelUnmount.current?.();
        cancelUnmount.current = null;
        (0, EventBatch_js_1.prepareUnmounts)();
        // Discard queued child work before destroying the Stage, including updates
        // from external stores whose objects are no longer alive.
        exports.KonvaRenderer.flushSyncFromReconciler(() => {
            exports.KonvaRenderer.updateContainer(null, fiberRef.current, null);
        });
        stage.current?.destroy();
        stage.current?.off(makeUpdates_js_1.EVENTS_NAMESPACE);
        stage.current = null;
        suspension.current?.resolve();
        suspension.current = null;
    };
    const setCanvasVisibility = (mode) => {
        if (mode === 'suspended') {
            if (!suspension.current) {
                let resolve;
                const promise = new Promise((done) => {
                    resolve = done;
                });
                suspension.current = { promise, resolve };
            }
        }
        else {
            suspension.current?.resolve();
            suspension.current = null;
        }
        exports.KonvaRenderer.updateContainer(react_1.default.createElement(react_1.default.Activity, {
            mode: mode === 'hidden' ? 'hidden' : 'visible',
            children: react_1.default.createElement(react_1.default.Suspense, { fallback: null }, children.current, suspension.current &&
                react_1.default.createElement(SuspendCanvas, {
                    promise: suspension.current.promise,
                })),
        }), fiberRef.current, null);
        (0, EventBatch_js_1.prepareUnmounts)();
        // Parent layout effects must see the committed canvas nodes and refs.
        exports.KonvaRenderer.flushSyncWork();
    };
    react_1.default.useLayoutEffect(() => {
        cancelUnmount.current?.();
        cancelUnmount.current = null;
        // Reconnecting layout effects reuses the existing Stage.
        if (!stage.current) {
            stage.current = new Core_js_1.default.Stage({
                width: props.width,
                height: props.height,
                container: container.current,
            });
            fiberRef.current = exports.KonvaRenderer.createContainer(stage.current, constants_js_1.ConcurrentRoot, null, isStrictMode, null, identifierPrefix, console.error, console.error, console.error, null, null);
        }
        return () => {
            if (!isUnmounting.current) {
                // If this hidden Stage is deleted, discard queued child work before
                // another root or the scheduler flushes it.
                const unmount = () => {
                    if (!isUnmounting.current)
                        return;
                    cancelUnmount.current?.();
                    cancelUnmount.current = null;
                    exports.KonvaRenderer.updateContainer(null, fiberRef.current, null);
                };
                cancelUnmount.current = (0, EventBatch_js_1.addPendingUnmount)(unmount);
                // Suspense disconnects layout effects but keeps passive effects.
                setCanvasVisibility('suspended');
            }
            else {
                destroyStage();
            }
        };
    }, []);
    react_1.default.useEffect(() => {
        effectsDisconnected.current = false;
        return () => {
            effectsDisconnected.current = true;
            // Activity and StrictMode also disconnect the DOM passive effects.
            if (!stage.current)
                return;
            if (isUnmounting.current)
                destroyStage();
            else
                setCanvasVisibility('hidden');
        };
    }, []);
    react_1.default.useLayoutEffect(() => {
        // Older Konva versions use the normal asynchronous React scheduler.
        if (typeof stage.current.eventBatchFunc === 'function') {
            stage.current.eventBatchFunc((0, EventBatch_js_1.getEventBatch)(props.eventBatchFunc));
        }
    }, [props.eventBatchFunc]);
    react_1.default.useImperativeHandle(props.forwardedRef, () => stage.current, []);
    react_1.default.useLayoutEffect(() => {
        previousProps.current = props;
        (0, makeUpdates_js_1.applyNodeProps)(stage.current, props, oldProps);
        // updateContainer schedules sync-lane work; with async scheduleMicrotask
        // the work is queued, so flushSyncWork() drains it inline here so that
        // a parent useLayoutEffect can read Konva nodes added by subscribing
        // children. (Lighter than flushSyncFromReconciler — no callback wrapper.)
        children.current = react_1.default.createElement(HostConfig.HostTransitionContext.Provider, { value: formStatus }, react_1.default.createElement(Bridge, {}, props.children));
        setCanvasVisibility('visible');
    });
    return react_1.default.createElement('div', {
        ref: container,
        id: props.id,
        accessKey: props.accessKey,
        className: props.className,
        role: props.role,
        style: props.style,
        tabIndex: props.tabIndex,
        title: props.title,
    });
};
exports.Layer = 'Layer';
exports.FastLayer = 'FastLayer';
exports.Group = 'Group';
exports.Label = 'Label';
exports.Rect = 'Rect';
exports.Circle = 'Circle';
exports.Ellipse = 'Ellipse';
exports.Wedge = 'Wedge';
exports.Line = 'Line';
exports.Sprite = 'Sprite';
exports.Image = 'Image';
exports.Text = 'Text';
exports.TextPath = 'TextPath';
exports.Star = 'Star';
exports.Ring = 'Ring';
exports.Arc = 'Arc';
exports.Tag = 'Tag';
exports.Path = 'Path';
exports.RegularPolygon = 'RegularPolygon';
exports.Arrow = 'Arrow';
exports.Shape = 'Shape';
exports.Transformer = 'Transformer';
exports.version = '19.3.2';
const rendererConfig = {
    ...HostConfig,
    // React's public context type omits fields used by the reconciler.
    HostTransitionContext: HostConfig.HostTransitionContext,
    rendererVersion: exports.version,
    rendererPackageName: 'react-konva',
    extraDevToolsConfig: null,
};
exports.KonvaRenderer = (0, react_reconciler_1.default)(rendererConfig);
exports.KonvaRenderer.injectIntoDevTools();
exports.Stage = react_1.default.forwardRef((props, ref) => {
    return react_1.default.createElement(its_fine_1.FiberProvider, {}, react_1.default.createElement(StageWrap, { ...props, forwardedRef: ref }));
});
exports.useStrictMode = makeUpdates_js_1.toggleStrictMode;
