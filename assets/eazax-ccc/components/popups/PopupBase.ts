const { ccclass, property } = cc._decorator;

/**
 * @author (ifaswind)
 * @version 20211011
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popups/PopupBase.ts
 * @see PopupManager.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/core/PopupManager.ts
 */
@ccclass
export default class PopupBase<Options = any> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && 'Background mask' })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && 'The main body of the pop-up window' })
    public main: cc.Node = null;

    public animDuration: number = 0.3;

    protected blocker: cc.Node = null;

    protected options: Options = null;

    public async show(options?: Options, duration?: number) {
        this.options = options;
        this.init(this.options);
        this.updateDisplay(this.options);
        if (duration == undefined || duration < 0) {
            duration = this.animDuration;
        }
        await this.playShowAnim(duration);
        this.onShow && this.onShow();
    }

    public async hide(suspended: boolean = false, duration?: number) {
        const node = this.node;
        if (duration !== 0) {
            let blocker = this.blocker;
            if (!blocker) {
                blocker = this.blocker = new cc.Node('blocker');
                blocker.addComponent(cc.BlockInputEvents);
                blocker.setParent(node);
                blocker.setContentSize(node.getContentSize());
            }
            blocker.active = true;
        }
        if (duration == undefined || duration < 0) {
            duration = this.animDuration;
        }
        await this.playHideAnim(duration);
        this.blocker && (this.blocker.active = false);
        node.active = false;
        this.onHide && this.onHide(suspended);
        this.finishCallback && this.finishCallback(suspended);
    }

    protected playShowAnim(duration: number): Promise<void> {
        return new Promise<void>(res => {
            const background = this.background,
                main = this.main;
            this.node.active = true;
            background.active = true;
            background.opacity = 0;
            main.active = true;
            main.scale = 0.5;
            main.opacity = 0;

            cc.tween(background)
                .to(duration * 0.5, { opacity: 150 })
                .start();
            cc.tween(main)
                .to(duration, { scale: 1, opacity: 255 }, { easing: 'backOut' })
                .call(res)
                .start();
        });
    }

    protected playHideAnim(duration: number): Promise<void> {
        return new Promise<void>(res => {
            cc.tween(this.background)
                .delay(duration * 0.5)
                .to(duration * 0.5, { opacity: 0 })
                .start();
            cc.tween(this.main)
                .to(duration, { scale: 0.5, opacity: 0 }, { easing: 'backIn' })
                .call(res)
                .start();
        });
    }

    protected init(options: Options) { }

    protected updateDisplay(options: Options) { }

    protected onShow() { }

    protected onHide(suspended: boolean) { }

    protected finishCallback: (suspended: boolean) => void = null;

    public setFinishCallback(callback: (suspended: boolean) => void) {
        this.finishCallback = callback;
    }

}
