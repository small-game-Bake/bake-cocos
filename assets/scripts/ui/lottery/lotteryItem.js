// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const constants = require('constants');
const playerData = require('playerData');
const localConfig = require('localConfig');
const utils = require('utils');
const resourceUtil = require('resourceUtil');
const clientEvent = require('clientEvent');
const gameLogic = require('gameLogic');
const i18n = require('LanguageData');
const configuration = require('configuration');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        spSelect: cc.Sprite,
        lbValue: cc.Label,
        spItem: cc.Sprite,

        imgGold: cc.SpriteFrame,
        imgDiamond: cc.SpriteFrame,
        imgAccelerate: cc.SpriteFrame,
        imgAccelerateEn: cc.SpriteFrame,
        imgCombineAuto: cc.SpriteFrame,
        imgbox: cc.SpriteFrame,
        imgTON: cc.SpriteFrame,
        imgUSDT: cc.SpriteFrame,

        colorNormal: new cc.Color(),
        colorSelect: new cc.Color()
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setInfo(parent, info) {
        this.rewardType = info.type;
        this._parent = parent;
        let unlockLevel = playerData.getUnlockLevel();
        switch (info.type) {
            case constants.REWARD_TYPE.DIAMOND:
                this.rewardValue = info.amount;
                this.spItem.spriteFrame = this.imgDiamond;
                //由于尺寸不同，导致每一种都需要专门设置对应的大小
                this.spItem.node.width = 88.8;
                this.spItem.node.height = 88.8;
                this.lbValue.string =  i18n.t('title.Diamonds');
                break;
            case constants.REWARD_TYPE.GOLD:
                //金币为 每秒收入 * amount
                let value = playerData.getMakeMoneySpeed();

                let itemInfo = localConfig.queryByID('cake', unlockLevel.toString());
                if (itemInfo) {
                    if (value < itemInfo.sellingPrice) {
                        value = itemInfo.sellingPrice;
                    }
                }

                this.rewardValue = value * info.amount;

                this.spItem.spriteFrame = this.imgGold;
                //由于尺寸不同，导致每一种都需要专门设置对应的大小
                this.spItem.node.width = 93;
                this.spItem.node.height = 62;

                // this.lbValue.string = utils.formatMoney(this.rewardValue);
                this.lbValue.string = "$BAKE";

                break;
            case constants.REWARD_TYPE.CAKE:
                // 解锁蛋糕最高等级。（5%）
                let cakeId = unlockLevel - 4;
                if (info.amount === 1) {
                    //解锁蛋糕最高等级*0.6（向下取整，最小为1）。（15%）
                    cakeId = Math.floor(unlockLevel * 0.6);
                }

                cakeId = cakeId > 1 ? cakeId : 1;

                let cake = localConfig.queryByID('cake', cakeId.toString());
                if (cake) {
                    resourceUtil.setCakeIcon(cake.img, this.spItem, () => {

                    });

                    //由于尺寸不同，导致每一种都需要专门设置对应的大小
                    this.spItem.node.width = 100;
                    this.spItem.node.height = 100;
                }

                this.rewardValue = cakeId;
                this.lbValue.string = 'X1';
                break;
            case constants.REWARD_TYPE.ACCELERATE:
                if (configuration.jsonData.lang === 'en') {
                    this.spItem.spriteFrame = this.imgAccelerateEn;
                } else {
                    this.spItem.spriteFrame = this.imgAccelerate;
                }
                this.rewardValue = info.amount;
                this.lbValue.string = this.rewardValue + i18n.t('lotteryItem.second');

                //由于尺寸不同，导致每一种都需要专门设置对应的大小
                this.spItem.node.width = 77;
                this.spItem.node.height = 77;
                break;
            case constants.REWARD_TYPE.COMBINE:
                this.spItem.spriteFrame = this.imgCombineAuto;
                this.rewardValue = info.amount;
                this.lbValue.string = this.rewardValue + i18n.t('lotteryItem.second');
                break;
            case constants.REWARD_TYPE.GIFTBOX:
                this.spItem.spriteFrame = this.imgbox;
                this.rewardValue = info.amount;
                this.spItem.node.width = 77;
                this.spItem.node.height = 77;
                this.lbValue.string = i18n.t('title.oven');;
                

                break;
            case constants.REWARD_TYPE.TON:
                this.spItem.node.width = 73;
                this.spItem.node.height = 74;
                this.spItem.spriteFrame = this.imgTON;
                this.rewardValue = info.amount;
                this.lbValue.string = "TON";

                break;
            case constants.REWARD_TYPE.USDT:
                this.spItem.node.width = 73;
                this.spItem.node.height = 74;
                this.spItem.spriteFrame = this.imgUSDT;
                this.rewardValue = info.amount;
                this.lbValue.string = "USDT";

                break;
        }
    },

    setSelect(isSelect) {
        this.spSelect.enabled = isSelect;
        this.lbValue.node.color = isSelect ? this.colorSelect : this.colorNormal;
    },

    showReward(callback) {
        if (this.rewardType === constants.REWARD_TYPE.DIAMOND ) {
            // clientEvent.dispatchEvent('showFlyReward', this.rewardType, function () {
            //     this.reward();
            // }, this);
            clientEvent.dispatchEvent('showItemReward', this.imgDiamond, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            }, this);
        } else if (this.rewardType === constants.REWARD_TYPE.CAKE) {
            // //现在缺乏表现，先直接加数据
            // if (!playerData.hasPosAtWorkbench()) {
            //     callback('cakeFull', this.rewardValue);
            //     return;
            // }

            // // this.reward();
            // //播放特效，然后奖励
            // clientEvent.dispatchEvent('showItemReward', this.spItem.spriteFrame, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
            //     this.reward();
            // }, this);

        } else if (this.rewardType === constants.REWARD_TYPE.GOLD) {
            clientEvent.dispatchEvent('showItemReward', this.imgGold, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            }, this);
        }else if (this.rewardType === constants.REWARD_TYPE.ACCELERATE) {
            clientEvent.dispatchEvent('showItemReward', this.imgAccelerate, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            }, this);
        }
        else if (this.rewardType === constants.REWARD_TYPE.GIFTBOX) {
            clientEvent.dispatchEvent('showItemReward', this.imgbox, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            }, this);
        }
        else if (this.rewardType === constants.REWARD_TYPE.TON) {
            clientEvent.dispatchEvent('showItemReward', this.imgTON, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            }, this);
        }
        else if (this.rewardType === constants.REWARD_TYPE.USDT) {
            clientEvent.dispatchEvent('showItemReward', this.imgUSDT, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            }, this);
        } else {
            clientEvent.dispatchEvent('showItemReward', this.imgCombineAuto, this.spItem.node.convertToWorldSpaceAR(cc.v2(0, 0)), () => {
                this.reward(this.rewardType );
            })
        }

        callback(null);
    },

    reward(rewardType) {
        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.GIFT_CHOICE_OPEN, {});

        // cakeBox.btnOpen.interactable = false;
        cc.gameSpace.uiManager.showSharedDialog('lottery/choice2', 'choice2', [rewardType]);
        // switch (this.rewardType) {
        //     case constants.REWARD_TYPE.DIAMOND:
        //         gameLogic.addDiamond(this.rewardValue);
        //         break;
        //     case constants.REWARD_TYPE.GOLD:
        //         gameLogic.addGold(this.rewardValue);
        //         break;
        //     case constants.REWARD_TYPE.CAKE:
        //         gameLogic.buyCakeFree(this.rewardValue);
        //         break;
        //     case constants.REWARD_TYPE.ACCELERATE:
        //         playerData.saveLotteryAccelerateTime(playerData.getLotteryAccelerateTime() + this.rewardValue); //加速N秒
        //         break;
        //     case constants.REWARD_TYPE.COMBINE:
        //         playerData.saveCombineAutoTime(playerData.getCombineAutoTime() + this.rewardValue);
        //     case constants.REWARD_TYPE.GIFTBOX:
        //         gameLogic.addGiftBox(this.rewardValue);
        //         break;
        //     case constants.REWARD_TYPE.TON:
        //         break;
        //     case constants.REWARD_TYPE.USDT:
        //         break;
        // }

        this._parent.ndBtnClose.getComponent('buttonEx').interactable = true;
    },
    
    // update (dt) {},
});
