const { ccclass, executionOrder, menu } = cc._decorator;

@ccclass
@executionOrder(-1)
@menu("eazax/Other components/PersistNode")
export default class PersistNode extends cc.Component {
    /**
     * Life cycle: load
     */
    protected onLoad() {
        this.node.setParent(cc.director.getScene());
        cc.game.addPersistRootNode(this.node);
    }
}
