//以对象池保存金币，使用该模块需要import，在onloard()中使用initGoldPool()生成对象池。
//在生成金币的位置，使用 SpwanGold (parentNode:cc.Node, goldNumber:number) ，开发人员无需关注动画播放和后续玩家数据处理。
//每个金币到达指定位置后由对象池回收，
//注意，使用本方法需要在场景添加两个节点("Canvas/btn/info_gold/text")：用于显示玩家金币量；
//("Canvas/btn/info_gold/bg_gold")：用于金币飞行的终点位置。


const { ccclass, property } = cc._decorator;

@ccclass
export default class GoldPool extends cc.Component{
    static _instance: GoldPool = null;
    private _goldPool: cc.NodePool = null;
    private _goldItem: cc.Prefab = null;

    public static instance() {
        if (!this._instance) {
            this._instance = new GoldPool();
        }
        return this._instance;
    }

    private constructor() {
        super();
        this._goldPool = new cc.NodePool();
    }

    public initGoldPool(gold:cc.Prefab) {
        if(this._goldPool.size()==40){
            return
        }
        this._goldItem = gold;
        for (let i = 0; i < 40; i++) {
            let item = cc.instantiate(gold);
            item.addComponent("GoldControl");
            this._goldPool.put(item);
        }
    }

    public getGoldItem(): cc.Node {
        if (this._goldPool.size() > 0) {
            return this._goldPool.get();
        }else{
            let item = cc.instantiate(this._goldItem);
            item.addComponent("GoldControl");
            return item;
        }
    }

    public putGoldItem(gold: cc.Node) {
        this._goldPool.put(gold);
    }

    public SpwanGold(parentNode:cc.Node,goldNumber:number) {
        if(goldNumber<=1000){
            let G_num = goldNumber;
            let initNum = Math.ceil(goldNumber/50);
            let GoldList = [];

            for (let i = 0; i < initNum ; i++) {
                if(G_num > 50){
                    G_num -= 50;
                    GoldList.push(50);
                }else{
                    GoldList.push(G_num);
                }

                this.scheduleOnce(() => {
                    let item = GoldPool.instance().getGoldItem();
                    parentNode.addChild(item);
                    item.setPosition(cc.v3(0,0,0));
                    item.getComponent("GoldControl").init(GoldList[i]);
                }, i * 0.05);
            };
        }
        if(goldNumber>1000 && goldNumber <= 2000){
            goldNumber = goldNumber - 1000;
            this.SpwanGold(parentNode,1000)

            this.scheduleOnce(()=>{
                this.SpwanGold(parentNode,goldNumber)
            },0.1)
        }
        if(goldNumber>2000){
            let times = Math.ceil(goldNumber/1000);
            let timesNum = [];
            for(let i=0 ; i<times; i++){
                if(goldNumber>1000){
                    timesNum.push(1000);
                    goldNumber -= 1000;
                }else{
                    timesNum.push(goldNumber);
                }
            }
            for(let i=0 ; i<times; i++){
                this.scheduleOnce(()=>{
                    this.SpwanGold(parentNode,timesNum[i])
                },0.1)
            }
        }
        
        // else(goldNumber <= 2000){
            // let G_num = goldNumber - 1000;
            // this.SpwanGold(parentNode,1000)

            // this.scheduleOnce(()=>{
            //     this.SpwanGold(parentNode,G_num)
            // },0.5)
        // }
    }
}

