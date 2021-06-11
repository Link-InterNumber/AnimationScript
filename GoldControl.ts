import GameData from "../../core/GameData";
import GoldPool from "./GoldPool";
var commonData = require('./commonData');

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({type:cc.Integer})
    GoldValue: number = 0;
    
    private angle:number = 0;
    private speed:number = 18;
    private bg_gold:cc.Node = null!;
    private selfPos:cc.Vec2 = null!;
    private bg_gold_Pos:cc.Vec2 = null!;
    private gold_text:cc.Node = null!;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(GoldNum: number,type:string)  {
        this.GoldValue = GoldNum;
        this.angle = Math.random()*2*Math.PI;

        this.gold_text = cc.find("Canvas/btn/info_gold/text");
        this.bg_gold = cc.find("Canvas/btn/info_gold/bg_gold");
        
        let bg_gold_p = this.bg_gold.parent.convertToWorldSpaceAR(this.bg_gold.position);
        this.bg_gold_Pos = new cc.Vec2(bg_gold_p.x, bg_gold_p.y);

        // console.log(this.bg_gold_Pos)
    }

    start () {

    }

    update (dt) {
        this.selfPos = this.node.parent.convertToWorldSpaceAR(new cc.Vec2(this.node.x,this.node.y));
        let dirVec = cc.v2(this.bg_gold_Pos.x-this.selfPos.x,this.bg_gold_Pos.y-this.selfPos.y);
        let angleVec = cc.v2(Math.cos(this.angle),Math.sin(this.angle));
        let delta_angle = angleVec.signAngle(dirVec);
        let distance = this.selfPos.sub(this.bg_gold_Pos).mag();
        
        this.angle = this.angle+delta_angle*(65/distance);

        this.selfPos.x += this.speed*Math.cos(this.angle);
        this.selfPos.y += this.speed*Math.sin(this.angle);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(this.selfPos));

        if(distance<20){
            this.recircle();
        }
    }

    recircle(){
        GameData.instance().userData.GoldValue += this.GoldValue;
        this.gold_text.getComponent(cc.Label).string = commonData.unitConverter(GameData.instance().userData.GoldValue).toString();
        GoldPool.instance().putGoldItem(this.node);
    }

    onDestroy(){
        GameData.instance().userData.GoldValue += this.GoldValue;
        GoldPool.instance().putGoldItem(this.node);
    }
}
