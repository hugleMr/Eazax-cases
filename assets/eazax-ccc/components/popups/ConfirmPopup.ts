import PopupBase from "./PopupBase";

const { ccclass, property } = cc._decorator;

/**
 * Confirm the popping window (example of PopupBase)
 */
@ccclass
export default class ConfirmPopup extends PopupBase<ConfirmPopupOptions> {
    @property(cc.Label)
    private titleLabel: cc.Label = null;

    @property(cc.Label)
    private contentLabel: cc.Label = null;

    @property(cc.Node)
    private confirmBtn: cc.Node = null;

    protected onLoad() {
        this.registerEvent();
    }

    protected onDestroy() {
        this.unregisterEvent();
    }

    private registerEvent() {
        this.confirmBtn.on(
            cc.Node.EventType.TOUCH_END,
            this.onConfirmBtnClick,
            this
        );
    }

    private unregisterEvent() {
        this.confirmBtn.targetOff(this);
    }

    protected init() {}

    protected updateDisplay(options: ConfirmPopupOptions): void {
        this.titleLabel.string = options.title;
        this.contentLabel.string = options.content;
    }

    protected onConfirmBtnClick() {
        this.options.confirmCallback && this.options.confirmCallback();
        this.hide();
    }
}

/** Confirm the pop -up option */
export interface ConfirmPopupOptions {
    title: string;
    content: string;
    confirmCallback: Function;
}
