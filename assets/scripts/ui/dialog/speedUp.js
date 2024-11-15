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
const gameLogic = require('gameLogic');
const constants = require('constants');
const i18n = require('LanguageData');
const resourceUtil = require('resourceUtil');
const utils = require('utils');

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


        nodeBtnShare: cc.Node,
        sprite:cc.SpriteFrame,
        process:cc.ProgressBar,
        lbDiamond: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.updateCountdown()
        this.schedule(this.updateCountdown, 1);
    },

    show(successCb) {
        this.successCb = successCb;

        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.CELEBRATION_SHOW, {});
        this.lbDiamond.string = utils.formatMoney(playerData.getDiamond());

        // this.checkButton();

        // if (!this.effectNode) {
        //     this.effectNode = cc.instantiate(this.pfEffect);
        //     this.effectNode.parent = this.node;
        //     this.effectNode.position = cc.v2(0, 0);
        // }

        // let ani = this.effectNode.getComponent(cc.Animation);
        // ani.play('celebrationStart');
        // ani.once('finished', () => {
        //     ani.play('celebrationIdle');
        // }, this);

        resourceUtil.updateNodeRenderers(this.node);
    },

    resetAdSwitch() {
        this.isLoadingAd = false;
    },

    onBtnAdClick() {
        cc.gameSpace.audioManager.playSound('click', false);

        this.accelerate();
    },

    onBtnShareClick() {
        this.accelerate();
            // 标记当前时间并存储在本地浏览器中
        localStorage.setItem('speed', Date.now());

        // 将按钮节点变成灰色
        let buttonSprite = this.nodeBtnShare.getComponent(cc.Sprite);
        if (buttonSprite) {
            buttonSprite.spriteFrame = this.sprite;
        }

        // 禁用按钮
        this.nodeBtnShare.getComponent(cc.Button).interactable = false;

    },
    accelerate() {

       let costMoney=0;//金币加速  免费
        if (playerData.getGold() < costMoney) {
            // cc.gameSpace.showTips(i18n.t('showTips.lackGold'));
            cc.gameSpace.uiManager.showSharedDialog('ADD/coinShop1', 'coinShop1');

            return;
        } else {
            playerData.addGold(-costMoney);
        }
        //设置剩余时间
        let spareTime = playerData.getAccelerateTime();
        let accelerateTime = 600 + spareTime;
        localStorage.setItem('accelerateTime',accelerateTime);
        let accelerateBuff = gameLogic.getBuff(constants.BUFF_TYPE.ACCELERATE);
        if (accelerateBuff) {
            accelerateTime += Number(accelerateBuff.buff.addValue);
        }


        playerData.saveAccelerateTime(accelerateTime);
        if (this.successCb) {
            this.successCb();
        }

        this.onBtnCloseClick();
    },
    accelerate2() {
       let costMoney=50;//钻石加速
        if (playerData.getDiamond() < costMoney) {
            // cc.gameSpace.showTips(i18n.t('showTips.lackDiamonds'));
            cc.gameSpace.uiManager.showSharedDialog('ADD/coinShop2', 'coinShop2');

            return false;
        }

        gameLogic.finishTask(constants.DAILY_TASK_TYPE.CONSUME_DIAMOND, costMoney);

        playerData.addDiamond(-costMoney);
        //clientEvent.dispatchEvent('updateDiamond');
        //设置剩余时间
        let spareTime = playerData.getAccelerateTime();
        let accelerateTime = 14400 + spareTime;
        localStorage.setItem('accelerateTime',accelerateTime);
        let accelerateBuff = gameLogic.getBuff(constants.BUFF_TYPE.ACCELERATE);
        if (accelerateBuff) {
            accelerateTime += Number(accelerateBuff.buff.addValue);
        }


        playerData.saveAccelerateTime(accelerateTime);
        if (this.successCb) {
            this.successCb();
        }

        this.onBtnCloseClick();
    },
    accelerate10() {
        let costMoney=0.008;//t加速
         if (playerData.getTON() < costMoney) {
             // cc.gameSpace.showTips(i18n.t('showTips.lackDiamonds'));
             //cc.gameSpace.uiManager.showSharedDialog('ADD/coinShop2', 'coinShop2');
            console.log("需要充值，api插入此处")
             return false;
         }
 
         gameLogic.finishTask(constants.DAILY_TASK_TYPE.CONSUME_DIAMOND, costMoney);
 
         playerData.addTON(-costMoney);
         //clientEvent.dispatchEvent('updateDiamond');
         //设置剩余时间
        let spareTime = playerData.getAccelerateTime();
         let accelerateTime = 6000 + spareTime;
         localStorage.setItem('accelerateTime',accelerateTime);
         let accelerateBuff = gameLogic.getBuff(constants.BUFF_TYPE.ACCELERATE);
         if (accelerateBuff) {
             accelerateTime += Number(accelerateBuff.buff.addValue);
         }
 
 
         playerData.saveAccelerateTime(accelerateTime);
         if (this.successCb) {
             this.successCb();
         }
 
         this.onBtnCloseClick();
     },
    onBtnCloseClick() {
        cc.gameSpace.uiManager.hideSharedDialog('dialog/speedUp');
    },
    initializeQian () {
        var storedValue = localStorage.getItem('speed');
        if (storedValue === null) {
            localStorage.setItem('speed', 0);
            return 0
        } else {
            return storedValue
        }
    },
    
    updateCountdown() {
        //console.log(utils.formatTimeForSecond(playerData.getAccelerateTime()))
        // 获取本地存储的时间戳
        let savedTime = this.initializeQian();
        if (!savedTime) return;
    
        // 计算时间差（以毫秒为单位）
        let currentTime = Date.now();
        let timeDifference = currentTime - parseInt(savedTime);
        const txt = cc.find('10MinPrice/text',this.nodeBtnShare).getComponent(cc.Label)
        // 如果时间差小于2小时（7200000毫秒）
        let twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
        if (timeDifference < twoHoursInMilliseconds) {
            // 计算剩余时间并格式化为 00:00:00
            let remainingTime = twoHoursInMilliseconds - timeDifference;

            let formattedTime = this.timegeshi(remainingTime);
    
            // 显示倒计时，例如将倒计时显示在按钮上
            txt.string = formattedTime;
    
            // 禁用按钮
            this.nodeBtnShare.getComponent(cc.Button).interactable = false;

            let buttonSprite = this.nodeBtnShare.getComponent(cc.Sprite);
            if (buttonSprite) {
                buttonSprite.spriteFrame = this.sprite;
            }
    

        } else {
            // 超过2小时后，恢复按钮
            this.nodeBtnShare.getComponent(cc.Button).interactable = true;
            txt.string = "免费";
            //localStorage.removeItem('speed'); // 清除存储的时间
        }

                // 将时间格式 "00:00:00" 转换为总秒数
        function timeStringToSeconds(timeString) {
            let parts = timeString.split(':');
            if (parts.length === 3) {
                // 格式为 "00:00:00"
                let hours = parseInt(parts[0]) || 0;
                let minutes = parseInt(parts[1]) || 0;
                let seconds = parseInt(parts[2]) || 0;
                return hours * 3600 + minutes * 60 + seconds;
            } else if (parts.length === 2) {
                // 格式为 "00:00"
                let minutes = parseInt(parts[0]) || 0;
                let seconds = parseInt(parts[1]) || 0;
                return minutes * 60 + seconds;
            } else {
                console.warn("Unexpected time format:", timeString);
                return 0;
            }
        }

        // 计算倒置比例 (b - a) / b
        function calculateInverseTimeRatio(a, b) {
            let secondsA = timeStringToSeconds(a);
            let secondsB = parseInt(b);
            if (secondsB === 0) {
                return "Infinity";  // 避免除以 0
            }
            
            // 计算倒置比例
            let inverseRatio = (secondsB - secondsA) / secondsB;
            return inverseRatio.toFixed(2); // 返回保留两位小数的比值
        }

        // 示例
        let a = utils.formatTimeForSecond(playerData.getAccelerateTime()); // 45 分钟
        let b = localStorage.getItem('accelerateTime'); // 1 小时
        let Labels = this.process.node.getChildByName('Label').getComponent(cc.Label);
        Labels.string = '剩余时间:'+a;
        let inverseRatio = calculateInverseTimeRatio(a, b);
        //console.log(`倒置比例比值为: ${inverseRatio}`);
        this.process.progress = inverseRatio;
        let barNode = this.process.node;
        let icoNode = barNode.getChildByName('bar').getChildByName('ico');
        let barWidth = barNode.width;
        let icoPositionX = barWidth * inverseRatio; // 居中调整位置
        icoNode.x = icoPositionX;

    },
    timegeshi(t){
        let hours = Math.floor(t / (1000 * 60 * 60)).toString().padStart(2, '0');
        let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        let seconds = Math.floor((t % (1000 * 60)) / 1000).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },
    // update (dt) {},
});