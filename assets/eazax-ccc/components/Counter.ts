const { ccclass, property, requireComponent } = cc._decorator;

/**
 * Digital scrolling (cc.Label）
 * @see Counter.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/Counter.ts
 * @version 20210521
 */
@ccclass
@requireComponent(cc.Label)
export default class Counter extends cc.Component {
    protected actualValue: number = 0;

    private format: string = "";
    private get label() {
        return this.getComponent(cc.Label);
    }
    public get value() {
        return this.actualValue;
    }

    public set value(value: number) {
        value = Math.floor(value);
        this.curValue = this.actualValue = value;
    }

    protected _curValue: number = 0;

    public get curValue() {
        return this._curValue;
    }

    public set curValue(value: number) {
        value = Math.floor(value);
        this._curValue = value;
        this.label.string = this.formatTime(value, this.format);
    }

    protected tweenRes: Function = null;

    protected onLoad() {
        this.init(50, "mmss").to(100, (value: number) => {
            console.log("value : ", value);
        });
    }

    /**
     * initialization
     */
    public init(startValue: number, format?: string) {
        this.value = startValue;
        if (format) this.format = format;
        return this;
    }

    /**
     * Set the value
     * @param value
     */
    public set(value: number) {
        this.value = value;
    }

    /**
     * Rolling value
     * @param value target value
     * @param duration animation time
     * @param callback completes the callback
     */
    public to(
        value: number,
        callback?: (value: number) => void,
        duration?: number
    ): Promise<void> {
        return new Promise<void>((res) => {
            // Stop the current animation
            if (this.tweenRes) {
                cc.Tween.stopAllByTarget(this);
                this.tweenRes();
            }
            this.tweenRes = res;
            // Save the actual value
            this.actualValue = value;
            // Animation time
            if (duration == undefined) {
                duration = Math.abs(this.actualValue - this.curValue);
            }
            console.log("duration : ", duration);
            // GO
            cc.tween<Counter>(this)
                .to(
                    duration,
                    { curValue: value }
                    // {
                    //     onUpdate: () => {
                    //         console.log("this.curValue : ", this.curValue);
                    //     },
                    // }
                )
                .call(() => {
                    this.tweenRes = null;
                    callback && callback(this.curValue);
                    res();
                })
                .start();
        });
    }

    /**
     * Relatively rolling value
     * @param diff Difference
     * @param duration Animation time
     * @param callback Complete the callback
     */
    public by(
        diff: number,
        callback?: () => void,
        duration?: number
    ): Promise<void> {
        const value = this.actualValue + diff;
        return this.to(value, callback, duration);
    }

    private formatTime(duration: number, format: string) {
        let seconds = Math.floor(duration % 60),
            minutes = Math.floor((duration / 60) % 60),
            hours = Math.floor((duration / (60 * 60)) % 24),
            days = Math.floor(duration / (60 * 60) / 24);
        let _days = days < 10 ? "0" + days : days;
        let _hours = hours < 10 ? "0" + hours : hours;
        let _minutes = minutes < 10 ? "0" + minutes : minutes;
        let _seconds = seconds < 10 ? "0" + seconds : seconds;
        switch (format) {
            case "ddhhmmss":
                if (days > 0) {
                    return _days + "d:" + _hours + "h:" + _minutes + "m";
                }
                return _hours + "h:" + _minutes + "m:" + _seconds + "s";
            case "hhmmss":
                if (hours <= 0) {
                    return `${_minutes} : ${_seconds}`;
                }
                return `${_hours}:${_minutes}:${_seconds}`;
            case "mmss":
                if (minutes <= 0) {
                    return `${_seconds}`;
                }
                return `${_minutes}:${_seconds}`;
            case "ss":
                return `${_seconds}`;
            default:
                return `${duration}`;
        }
    }
}
