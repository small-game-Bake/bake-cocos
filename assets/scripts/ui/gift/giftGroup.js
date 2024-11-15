// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const playerData = require('playerData');
const clientEvent = require('clientEvent');
const resourceUtil = require('resourceUtil');
const guideLogic = require('guideLogic');
const constants = require('constants');
const gameLogic = require('gameLogic');

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
        pfGift: cc.Prefab
    },

    ctor () {
        this.isGiftRunning = false;
        this.dictChoice = {};
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.updateWorkbench();
        this.registEvent();
       //this.scheduleOnce(this.checkHasGiftUnOpen, 1);
        // this.checkHasGiftUnOpen();
    },

    /**
     * 检查是否还有宝箱未开启的
     */
    checkHasGiftUnOpen () {
        for (let idx = 0; idx < playerData.workbench.length; idx++) {
            if (playerData.workbench[idx] === 'gift') {
                let worldPos = this.mainScene.workbench.getItemWorldPosByIdx(idx);
                let pos = this.node.convertToNodeSpaceAR(worldPos);
                this.rewardGift(idx, pos);
            }
        }
    },

    /**
     * 设置MainScene
     * @param {cc.Class} mainScene 
     */
    setMainScene (mainScene) {
        this.mainScene = mainScene;
    },

    registEvent () {
        clientEvent.on('updateWorkbench', this.updateWorkbench, this);
        clientEvent.on('choiceOver', this.choiceOver, this);
    },

    onDestroy () {
        clientEvent.off('updateWorkbench', this.updateWorkbench, this);
        clientEvent.off('choiceOver', this.choiceOver, this);
    },

    getWorkbenchEmptyPos () {
        let workbenchCount = constants.WORKBENCH_MAX_POS;

        let idxEmptyPos = -1;
        for (let idx = 0; idx < playerData.workbench.length; idx++) {
            let item = playerData.workbench[idx];
            if (!item) {
                idxEmptyPos = idx;
                break;
            }
        }

        if (idxEmptyPos === -1 && playerData.workbench.length < workbenchCount) {
            idxEmptyPos = playerData.workbench.length;
        }

        return idxEmptyPos;
    },

    updateWorkbench () {
        if (guideLogic.isPlayingGuide()) {
            return;//
        }

        let idxEmptyPos = this.getWorkbenchEmptyPos();

        //检查是否有礼盒没打开，如果有，则不再掉落
        let isUnOpenGift = false;
        for (let idx = 0; idx < playerData.workbench.length; idx++) {
            if (playerData.workbench[idx] === 'gift') {
                isUnOpenGift = true;
                break;
            }
        }

        if (idxEmptyPos === -1 || isUnOpenGift) {
            //位置已经满了，这时候如果有计时器，则需要暂停
            // if (this.timerGift) {
            //     clearTimeout(this.timerGift);
            //     this.timerGift = null;
            // }

            this.unschedule(this.onGiftTimeUp);

            this.isGiftRunning = false;

            return;
        }

        if (this.isGiftRunning) {
            return; //本身就有在计时
        }

        //30-45
        let min = 30;
        let max = 45;

        // let giftBuff = gameLogic.getBuff(constants.BUFF_TYPE.GIFT);
        // if (giftBuff) {
        //     let arrValue = giftBuff.buff.addValue.split('-');
        //     if (arrValue.length >= 2) {
        //         min = Number(arrValue[0]);
        //         max = Number(arrValue[1]);
        //     }
        // }

        //随机时间
        let time = (min + Math.floor(Math.random()*(max - min))); 


        // this.timerGift = setTimeout(()=>{
        //     this.onGiftTimeUp();
        // }, time);
        //禁止自动掉落
        //this.scheduleOnce(this.onGiftTimeUp, time);

        this.isGiftRunning = true;
    },

    /**
     * 送礼物的时间到啦
     */
    onGiftTimeUp () {
        // this.timerGift = null;
        this.isGiftRunning = false;

        if (cc.gameSpace.isStop) {
            return;
        }

        //检查是否有礼盒没打开，如果有，则不再掉落
        for (let idx = 0; idx < playerData.workbench.length; idx++) {
            if (playerData.workbench[idx] === 'gift') {
                return;
            }
        }

        if (guideLogic.isPlayingGuide()) {
            return;//
        }

        let idxEmptyPos = this.getWorkbenchEmptyPos();
        if (idxEmptyPos === -1) {
            return;
        }

        let cakeNode = this.mainScene.workbench.getCakeNodeForGuide(idxEmptyPos);
        if (cakeNode) {
            let cakeItem = cakeNode.getComponent('cakeItem');
            cakeItem.isUsed = true;
        }
        

        //掉落礼物到该位置
        let worldPos = this.mainScene.workbench.getItemWorldPosByIdx(idxEmptyPos);
        let pos = this.node.convertToNodeSpaceAR(worldPos);

        let randValue = Math.floor(Math.random() * 100);
        this.rewardCake(idxEmptyPos, pos);
        console.log('禁止自动掉落')
        // if (randValue < 0) { //70%概率奖励蛋糕
        //     this.rewardCake(idxEmptyPos, pos);
        // } else { //另外奖励三选一的物品
        //     this.rewardGift(idxEmptyPos, pos);
        // }
    },

    rewardCake (idxEmptyPos, giftPos) {
        //随机蛋糕
        let unlockLevel = playerData.getUnlockLevel();
        console.log('最高等级',unlockLevel)
        // 计算目标蛋糕等级，基于 unlockLevel - 9
        let levelMinusNine = unlockLevel - 9;
        let levelMinusTen = unlockLevel - 10;

        // 如果 levelMinusNine 小于 1，将其设置为 1
        if (levelMinusNine < 1) {
            levelMinusNine = 1;
            levelMinusTen = 1;
        } else if (levelMinusTen < 1) {
            levelMinusTen = 1;
        }

        // 生成随机值以确定蛋糕等级的概率
        let randomValue;
        let probability = Math.random();

        // 30% 的概率选择 levelMinusNine，70% 的概率选择 levelMinusTen
        if (probability < 0.3) {
            randomValue = levelMinusNine;
        } else {
            randomValue = levelMinusTen;
        }
            console.log('生成的等级',randomValue)
        //将蛋糕直接加到工作台里头，将位置站住，避免数据冲突 // 将蛋糕信息添加到玩家的数据中
        playerData.addCakeToTargetIndex(idxEmptyPos, randomValue.toString());

        resourceUtil.createEffect('ui/giftBox/giftBox', (err, giftNode) => {
            gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.GIFT_CAKE_SHOW, {});

            //将礼物丢到 pos位置
            giftNode.position = cc.v2(giftPos.x-2, giftPos.y - 58);
            let giftBox = giftNode.getComponent('giftBox');
            giftBox.setInfo(idxEmptyPos);
        }, this.node);
    },

    rewardGift (idxEmptyPos, giftPos) {
        console.log('rewardGift',idxEmptyPos);
        //将位置站住，避免数据冲突
        playerData.addCakeToTargetIndex(idxEmptyPos, 'gift');

        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.GIFT_CHOICE_SHOW, {});

        resourceUtil.createEffect('ui/cakeBox/cakeBox', (err, giftNode) => {
            //将礼物丢到 pos位置
            giftNode.position = cc.v2(giftPos.x-2, giftPos.y);
            giftNode.setScale(0.7);
            giftNode.zIndex += idxEmptyPos;
            let cakeBox = giftNode.getComponent('cakeBox');
            cakeBox.setInfo(idxEmptyPos);
            cakeBox.playStart();
            cakeBox.setOpenBoxListener(()=>{
                gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.GIFT_CHOICE_OPEN, {});

                cakeBox.btnOpen.interactable = false;
                cc.gameSpace.uiManager.showSharedDialog('lottery/choice', 'choice', [idxEmptyPos]);
            });

            this.dictChoice[idxEmptyPos] = giftNode;

            //由于礼物盒子非自动打开，所以需要触发下一次的时间
            // this.scheduleOnce(()=>{
            //     this.updateWorkbench ();
            // }, 5);
        }, this.node);
    },

    choiceOver (idxEmptyPos) {
        let choiceNode = this.dictChoice[idxEmptyPos];
        if (choiceNode && cc.isValid(choiceNode)) {
            // choiceNode.getComponent('cakeBox').playOver(()=>{
            //     choiceNode.destroy();
            // });
            
            choiceNode.destroy();
        }

        delete this.dictChoice[idxEmptyPos];
    },

    // update (dt) {},
});
