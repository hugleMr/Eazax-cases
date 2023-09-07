const { ccclass, property } = cc._decorator;

/**
 * Popcop
 * @author ifaswind
 * @version 20220122
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popups/PopupBase.ts
 * @see PopupManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/PopupManager.ts
 */
@ccclass
export default class PopupBase<Options = any> extends cc.Component {
    @property({ type: cc.Node, tooltip: CC_DEV && "背景遮罩" })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && "弹窗主体" })
    public main: cc.Node = null;

    /**
     * Display/Hidden animation duration
     */
    public animationDuration: number = 0.3;

    /**
     * Nodes used to intercept clicks
     */
    protected blocker: cc.Node = null;

    /**
     * Pop -up option
     */
    protected options: Options = null;

    /**
     * Show the pop -up window
     * @param options Pop -up option
     * @param duration Animation time
     */
    public async show(options?: Options, duration?: number) {
        // Storage option
        this.options = options;
        // initialization
        this.init(options);
        // Update style
        this.updateDisplay(options);
        // Pop -up
        this.onBeforeShow && (await this.onBeforeShow());
        // Display animation
        if (duration == undefined) {
            duration = duration < 0 ? 0 : this.animationDuration;
        }
        await this.playShowAnimation(duration);
        // Pop -up
        this.onAfterShow && this.onAfterShow();
    }

    /**
     * Hidden pop -up
     * @param suspended Whether
     * @param duration Animation time
     */
    public async hide(suspended: boolean = false, duration?: number) {
        const node = this.node;
        // When the animation duration is not 0, the click event is intercepted (avoid misunderstanding)
        if (duration !== 0) {
            let blocker = this.blocker;
            if (!blocker) {
                blocker = this.blocker = new cc.Node("blocker");
                blocker.addComponent(cc.BlockInputEvents);
                blocker.setParent(node);
                blocker.setContentSize(node.getContentSize());
            }
            blocker.active = true;
        }
        // Pop -up
        this.onBeforeHide && (await this.onBeforeHide(suspended));
        // Play hidden animation
        if (duration == undefined) {
            duration = duration < 0 ? 0 : this.animationDuration;
        }
        await this.playHideAnimation(duration);
        // Turn off and intercept
        this.blocker && (this.blocker.active = false);
        // Closure node
        node.active = false;
        // Pop -up
        this.onAfterHide && this.onAfterHide(suspended);
        // Popchen window completion recovery
        this.finishCallback && this.finishCallback(suspended);
    }

    /**
     * Play pop -up display animation (please rewrite this function to achieve custom logic)
     * @param duration animation time
     */
    protected playShowAnimation(duration: number): Promise<void> {
        return new Promise<void>((res) => {
            // Initialization node
            const background = this.background,
                main = this.main;
            this.node.active = true;
            background.active = true;
            background.opacity = 0;
            main.active = true;
            main.scale = 0.5;
            main.opacity = 0;
            // Background mask
            cc.tween(background)
                .to(duration * 0.5, { opacity: 150 })
                .start();
            // Pop -up
            cc.tween(main)
                .to(duration, { scale: 1, opacity: 255 }, { easing: "backOut" })
                .call(res)
                .start();
        });
    }

    /**
     * Play the pop -up hidden animation (please rewrite this function to achieve custom logic)
     * @param duration animation time
     */
    protected playHideAnimation(duration: number): Promise<void> {
        return new Promise<void>((res) => {
            // Background mask
            cc.tween(this.background)
                .delay(duration * 0.5)
                .to(duration * 0.5, { opacity: 0 })
                .start();
            // Pop -up
            cc.tween(this.main)
                .to(duration, { scale: 0.5, opacity: 0 }, { easing: "backIn" })
                .call(res)
                .start();
        });
    }

    /**
     * Initialization (please rewrite this function to achieve custom logic)
     * @param Options pop -up window options
     */
    protected init(options: Options) {}

    /**
     * Update style (please rewrite this function to achieve custom logic)
     * @param Options pop -up window options
     */
    protected updateDisplay(options: Options) {}

    /**
     * Before the pop -up display (please rewrite this function to achieve custom logic)
     */
    protected onBeforeShow(): Promise<void> {
        return new Promise((res) => res());
    }

    /**
     * After the pop -up display, please rewrite this function to achieve custom logic)
     */
    protected onAfterShow() {}

    /**
     *Before the pop -up window is hidden (please rewrite this function to achieve custom logic)
     * @param Suspended Whether it is hung
     */
    protected onBeforeHide(suspended: boolean): Promise<void> {
        return new Promise((res) => res());
    }

    /**
     *After the pop -up window is hidden (please rewrite this function to achieve custom logic)
     * @param Suspended Whether it is hung
     */
    protected onAfterHide(suspended: boolean) {}

    /**
     * The pop -up window is hung (please rewrite this function to achieve custom logic)
     */
    protected onSuspended(): Promise<void> {
        return new Promise((res) => res());
    }

    /**
     * The pop -up process ends the callback (note: the callback is dedicated to PopupManager, remember to call the callback when rewriting the HIDE function)
     */
    protected finishCallback: (suspended: boolean) => void = null;
}
