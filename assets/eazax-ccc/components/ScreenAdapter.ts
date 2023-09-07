import EventManager from "../core/EventManager";

const { ccclass, executionOrder, help, menu } = cc._decorator;

/**
 * Screen adaptation component
 * @author Chenpi (ifaswind)
 * @version 20210504
 * @see ScreenAdapter.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/ScreenAdapter.ts
 */
@ccclass
@executionOrder(-1)
@help(
    "https://gitee.com/ifaswind/eazax-ccc/blob/master/components/ScreenAdapter.ts"
)
@menu("eazax/Other components/ScreenAdapter")
export default class ScreenAdapter extends cc.Component {
    /**
     * Life cycle: load
     */
    protected onLoad() {
        this.init();
    }

    /**
     * Life cycle: component enabled
     */
    protected onEnable() {
        this.adapt();
    }

    /**
     * initialization
     */
    protected init() {
        // Set the callback of changes in the game window (only the web platform is valid)
        cc.view.setResizeCallback(() => this.onResize());
    }

    /**
     * Window change callback
     */
    protected onResize() {
        // Because SetResizeCallBack can only set up a callbackback
        // Use the event system to send a specific event, so that other components can also monitor the window change
        EventManager.emit("view-resize");
        // adaptation
        this.adapt();
    }

    /**
     * adaptation
     */
    protected adapt() {
        // Actual screen ratio
        const winSize = cc.winSize,
            screenRatio = winSize.width / winSize.height;
        // Design ratio
        const designResolution = cc.Canvas.instance.designResolution,
            designRatio = designResolution.width / designResolution.height;
        // Determine the actual screen width and height ratio
        if (screenRatio <= 1) {
            // At this time, the screen height is greater than width
            if (screenRatio <= designRatio) {
                this.setFitWidth();
            } else {
                // At this time, the actual screen ratio is greater than the design ratio
                // In order to ensure that the content of the vertical game is not affected, the Fitheight mode should be used
                this.setFitHeight();
            }
        } else {
            // At this time, the screen height is less than width
            this.setFitHeight();
        }
    }

    /**
     * Adaptation high mode
     */
    protected setFitHeight() {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = true;
        canvas.fitWidth = false;
    }

    /**
     * Adaptive width mode
     */
    protected setFitWidth() {
        const canvas = cc.Canvas.instance;
        canvas.fitHeight = false;
        canvas.fitWidth = true;
    }
}
