import PopupBase from "../components/popups/PopupBase";

enum CacheMode {
    Once = 1,
    Normal,
    Frequent
}

enum ShowResult {
    Done = 1,
    Failed,
    Waiting
}

/**
 * @author (ifaswind)
 * @version 20210918
 * @see PopupManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/PopupManager.ts
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popups/PopupBase.ts
 */
export default class PopupManager {

    public static get prefabCache() { return this._prefabCache; }
    private static _prefabCache: Map<string, cc.Prefab> = new Map<string, cc.Prefab>();

    public static get nodeCache() { return this._nodeCache; }
    private static _nodeCache: Map<string, cc.Node> = new Map<string, cc.Node>();

    public static get current() { return this._current; }
    private static _current: PopupRequestType = null;

    public static get queue() { return this._queue; }
    private static _queue: PopupRequestType[] = [];

    public static get suspended() { return this._suspended; }
    private static _suspended: PopupRequestType[] = [];

    private static locked: boolean = false;

    public static container: cc.Node = null;

    public static interval: number = 0.05;

    public static get CacheMode() {
        return CacheMode;
    }

    public static get ShowResult() {
        return ShowResult;
    }

    /**
     * 
     * @example
     * PopupManager.loadStartCallback = () => {
     *     LoadingTip.show();
     * };
     */
    public static loadStartCallback: () => void = null;

    /**
     * 
     * @example
     * PopupManager.loadFinishCallback = () => {
     *     LoadingTip.hide();
     * };
     */
    public static loadFinishCallback: () => void = null;

    /**
     * const options = {
     *     title: 'Hello',
     *     content: 'This is a popup!'
     * };
     * const params = {
     *     mode: PopupCacheMode.Normal
     * };
     * PopupManager.show('prefabs/MyPopup', options, params);
     */
    public static show<Options>(path: string, options?: Options, params?: PopupParamsType): Promise<ShowResult> {
        return new Promise(async res => {
            // Analytic processing parameters
            params = this.parseParams(params);
            // The current pop-up window is added to the waiting queue in the show.
            if (this._current || this.locked) {
                // Whether to force display immediately
                if (params && params.immediately) {
                    this.locked = false;
                    // Hang up the current pop-up window
                    await this.suspend();
                } else {
                    // Push the request into the waiting queue
                    this.push(path, options, params);
                    res(ShowResult.Waiting);
                    return;
                }
            }
            // Save as current pop-up window to prevent new pop-up requests
            this._current = {
                path,
                options,
                params
            };
            // Get pop-up nodes in the cache
            let node = this.getNodeFromCache(path);
            // No, dynamically load prefamped resources in the cache
            if (!cc.isValid(node)) {
                // Start callback
                this.loadStartCallback && this.loadStartCallback();
                // Waiting for loading
                const prefab = await this.load(path);
                // Complete callback
                this.loadFinishCallback && this.loadFinishCallback();
                // Loading failure (usually caused by path errors)
                if (!cc.isValid(prefab)) {
                    cc.warn('[PopupManager]', '弹窗加载失败', path);
                    this._current = null;
                    res(ShowResult.Failed);
                    return;
                }
                // Instantiated node
                node = cc.instantiate(prefab);
            }
            // Get the popup component inherited from PopupBase
            const popup = node.getComponent(PopupBase);
            if (!popup) {
                cc.warn('[PopupManager]', 'No pop-up module', path);
                this._current = null;
                res(ShowResult.Failed);
                return;
            }
            // Save component reference
            this._current.popup = popup;
            // Save node reference
            this._current.node = node;
            // Add to the scene
            node.setParent(this.container || cc.Canvas.instance.node);
            // Displayed in the top
            node.setSiblingIndex(cc.macro.MAX_ZINDEX);
            // Set the completion of the callback
            const finishCallback = async (suspended: boolean) => {
                if (suspended) {
                    return;
                }
                // Do you need to lock
                this.locked = (this._suspended.length > 0 || this._queue.length > 0);
                // Recycle
                this.recycle(path, node, params.mode);
                this._current = null;
                res(ShowResult.Done);
                // Latency
                await new Promise(_res => {
                    cc.Canvas.instance.scheduleOnce(_res, this.interval);
                });
                // Next pop-up window
                this.next();
            }
            popup.setFinishCallback(finishCallback);
            popup.show(options);
        });
    }

    public static hide() {
        if (this._current.popup) {
            this._current.popup.hide();
        }
    }

    private static getNodeFromCache(path: string): cc.Node {
        // Get from node cache
        const nodeCache = this._nodeCache;
        if (nodeCache.has(path)) {
            const node = nodeCache.get(path);
            if (cc.isValid(node)) {
                return node;
            }
            // Delete invalid reference
            nodeCache.delete(path);
        }
        // Get it from the pre-created cache
        const prefabCache = this._prefabCache;
        if (prefabCache.has(path)) {
            const prefab = prefabCache.get(path);
            if (cc.isValid(prefab)) {
                // Increase the reference count
                prefab.addRef();
                // Instantiate and return
                return cc.instantiate(prefab);
            }
            // Delete invalid reference
            prefabCache.delete(path);
        }
        return null;
    }

    /**
     * Show hangs or waiting for the next pop-up window in the queue
     */
    private static next() {
        if (this._current || (this._suspended.length === 0 && this._queue.length === 0)) {
            return;
        }
        // Take out a request
        let request: PopupRequestType = null;
        if (this._suspended.length > 0) {
            // Suspend queue
            request = this._suspended.shift();
        } else {
            // Waiting for the queue
            request = this._queue.shift();
        }
        // unlock
        this.locked = false;
        if (cc.isValid(request.popup)) {
            this._current = request;
            request.node.setParent(this.container);
            request.popup.show(request.options);
            return;
        }
        this.show(request.path, request.options, request.params);
    }

    /**
     * Add a pop-up request to the waiting queue, if the pop-up without the presentation is not shown, the pop-up is shown.
     * @param path Playing the window prefabrication relative path (such as prefabs / mypopup)
     * @param options 
     * @param params 
     */
    private static push<Options>(path: string, options?: Options, params?: PopupParamsType) {
        if (!this._current && !this.locked) {
            this.show(path, options, params);
            return;
        }
        this._queue.push({ path, options, params });
        this._queue.sort((a, b) => (a.params.priority - b.params.priority));
    }

    private static async suspend() {
        if (!this._current) {
            return;
        }
        const request = this._current;
        this._suspended.push(request);
        await request.popup.hide(true);
        this._current = null;
    }

    private static recycle(path: string, node: cc.Node, mode: CacheMode) {
        switch (mode) {
            // One time
            case CacheMode.Once: {
                this._nodeCache.delete(path);
                node.destroy();
                this.release(path);
                break;
            }
            // normal
            case CacheMode.Normal: {
                this._nodeCache.delete(path);
                node.destroy();
                break;
            }
            // Frequent
            case CacheMode.Frequent: {
                node.removeFromParent(false);
                this._nodeCache.set(path, node);
                break;
            }
        }
    }

    public static load(path: string): Promise<cc.Prefab> {
        return new Promise(res => {
            const prefabMap = this._prefabCache;
            if (prefabMap.has(path)) {
                const prefab = prefabMap.get(path);
                if (cc.isValid(prefab)) {
                    res(prefab);
                    return;
                } else {
                    prefabMap.delete(path);
                }
            }
            // 动态加载
            cc.resources.load(path, (error: Error, prefab: cc.Prefab) => {
                if (error) {
                    res(null);
                    return;
                }
                prefabMap.set(path, prefab);
                res(prefab);
            });
        });
    }

    public static release(path: string) {
        const nodeCache = this._nodeCache;
        let node = nodeCache.get(path);
        if (node) {
            nodeCache.delete(path);
            if (cc.isValid(node)) {
                node.destroy();
            }
            node = null;
        }
        const prefabCache = this._prefabCache;
        let prefab = prefabCache.get(path);
        if (prefab) {
            if (prefab.refCount <= 1) {
                prefabCache.delete(path);
            }
            prefab.decRef();
            prefab = null;
        }
    }

    private static parseParams(params: PopupParamsType) {
        if (params == undefined) {
            return new PopupParamsType();
        }
        // Whether it is an object
        if (Object.prototype.toString.call(params) !== '[object Object]') {
            cc.warn('[PopupManager]', 'The pop-up parameters are invalid, use the default parameters');
            return new PopupParamsType();
        }

        if (params.mode == undefined) {
            params.mode = CacheMode.Normal;
        }

        if (params.priority == undefined) {
            params.priority = 0;
        }

        if (params.immediately == undefined) {
            params.immediately = false;
        }
        return params;
    }

}

class PopupParamsType {
    mode?: CacheMode = CacheMode.Normal;
    priority?: number = 0;
    immediately?: boolean = false;
}

class PopupRequestType {
    path: string;
    options: any;
    params: PopupParamsType;
    popup?: PopupBase;
    node?: cc.Node;
}
