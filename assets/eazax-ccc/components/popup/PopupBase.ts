const { ccclass, property } = cc._decorator;

/** 弹窗基类 */
@ccclass
export default class PopupBase<T> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩' })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '弹窗主体' })
    public main: cc.Node = null;

    /** 弹窗动画时间 */
    public animTime: number = 0.3;

    /** 弹窗选项 */
    protected options: T = null;

    /** 弹窗关闭回调 */
    protected closedCallback: Function = null;

    /** 完成回调 */
    private finishedCallback: Function = null;

    /**
     * 展示弹窗
     * @param options 弹窗选项
     */
    public show(options?: T) {
        // 储存选项参数
        this.options = options;
        // 更新弹窗样式
        this.updateDisplay();
        // 初始化节点
        this.background.opacity = 0;
        this.main.scale = 0;
        this.node.active = true;
        // 背景
        this.background.active = true;
        cc.tween(this.background)
            .to(this.animTime * 0.95, { opacity: 200 })
            .start();
        // 主体
        this.main.active = true;
        cc.tween(this.main)
            .to(this.animTime, { scale: 1 }, { easing: 'backOut' })
            .start();
    }

    /**
     * 隐藏弹窗
     */
    public hide() {
        // 背景
        cc.tween(this.background)
            .to(this.animTime, { opacity: 0 })
            .call(() => {
                this.background.active = false;
            })
            .start();
        // 主体
        cc.tween(this.main)
            .to(this.animTime, { scale: 0 }, { easing: 'backIn' })
            .call(() => {
                // 关闭节点
                this.main.active = false;
                this.node.active = false;
                // 弹窗关闭回调
                if (this.closedCallback) {
                    this.closedCallback();
                    this.closedCallback = null;
                }
                // 完成回调
                if (this.finishedCallback) {
                    this.finishedCallback();
                    this.finishedCallback = null;
                }
            })
            .start();
    }

    /**
     * 更新弹窗样式（子类请重写此函数以实现自定义样式）
     */
    protected updateDisplay() {

    }

    /**
     * 设置完成回调（该回调为 PopupManager 专用）
     * @param callback 回调
     */
    public setFinishedCallback(callback: Function) {
        if (this.finishedCallback)
            return cc.warn('[PopupBase]', '无法重复指定完成回调');;
        this.finishedCallback = callback;
    }

}
