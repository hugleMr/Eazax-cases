const { ccclass, property, executionOrder, help, menu } = cc._decorator;

/**
 * Keep running in the background of the browser
 * @author Chenpi (ifaswind)
 * @version 20220207
 * @see RunInBackground.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/RunInBackground.ts
 */
@ccclass
@executionOrder(-1)
@help(
    "https://gitee.com/ifaswind/eazax-ccc/blob/master/components/RunInBackground.ts"
)
@menu("eazax/Other components/RunInBackground")
export default class RunInBackground extends cc.Component {
    @property({
        displayName: CC_DEV && "Script address",
        tooltip: CC_DEV && "Worker Script address",
    })
    private url: string = "/worker.js";

    /** Worker Instance */
    private worker: Worker = null;

    /**
     * Life cycle: load
     */
    protected onLoad() {
        this.init();
        this.registerEvent();
    }

    /**
     * Life cycle: destruction
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * Registration issue
     */
    protected registerEvent() {
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        document.addEventListener("visibilitychange", this.onVisibilityChange);
    }

    /**
     * Anti -registration
     */
    protected unregisterEvent() {
        document.removeEventListener(
            "visibilitychange",
            this.onVisibilityChange
        );
    }

    /**
     * initialization
     */
    private init() {
        // The webpage debug needs to place a part of worker.js in the preview template directory
        // If you use the preview template that comes with the editor, you need to modify the script address
        // if (CC_DEBUG) {
        //     this.url = '/app/editor/static/preview-templates/worker.js';
        // }
    }

    /**
     * Page switchback
     */
    private onVisibilityChange() {
        // Switch to the background
        if (document.visibilityState === "hidden") {
            // Make sure the engine is in running state
            if (cc.game.isPaused()) {
                cc.game.resume();
            }
            // Create a working thread
            this.worker = new Worker(this.url);
            this.worker.onmessage = () => {
                // CICOS engine main loop
                cc.director["mainLoop"]();
            };
        }
        // Switch to the front desk
        else if (document.visibilityState === "visible") {
            if (this.worker) {
                this.worker.terminate();
                this.worker = null;
            }
        }
    }
}

/*

The following is worker.js script content:

function call(){
    postMessage(1);
    setTimeout('call()', 1000 / 60);
}
call();

*/
