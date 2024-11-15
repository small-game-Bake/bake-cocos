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
const clientEvent = require('clientEvent');
const i18n = require('LanguageData');
const localConfig = require('localConfig');
const utils = require('utils');
const dailTask = require('dailyTask');

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

        spReward: cc.Sprite,
        lbReward: cc.Label,

        imgGold: cc.SpriteFrame,
        imgDiamond: cc.SpriteFrame,

        progress: cc.ProgressBar,
        lbProgress: cc.Label,

        nodeBtnGet: cc.Node,

        lbDesc: cc.Label,

        nodeGetted: cc.Node,

        imgBlueBg: cc.SpriteFrame,
        imgYellowBg: cc.SpriteFrame,
        spBg: cc.Sprite,

        spbglist: [cc.Node],
        btnbg:[cc.Node],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.day=0;
    },

    start() {

    },
    onEnable() {
       // clientEvent.on('updateTask', this.updateTask, this);
    },

    onDisable() {
        //clientEvent.off('updateTask', this.updateTask, this);
    },
    setInfo(type)
    {
        for (let index = 0; index < this.spbglist.length; index++) {
            const element = this.spbglist[index];
            const element2 = this.btnbg[index];

            element2.active = false;
            element.active = false;
        }
        this.btnbg[type].active = true;
        this.spbglist[type].active = true;
        if (type==0) {
            this.nodeGetted.active = true;
            this.nodeBtnGet.getComponent(cc.Button).interactable=false;
        }else {
            this.nodeGetted.active = false;
        }
        if (type==1) {
            this.nodeBtnGet.getComponent(cc.Button).interactable=false;
        }
        if (type==2) {
            this.nodeBtnGet.getComponent(cc.Button).interactable=true;
            
        }
    },
    setInfo2(myday,signInfo) {
        //this._taskTemplate = taskTemplate;
        let today = utils.getDay();
        this.day=myday;
        let tbSign = localConfig.getTable('dailySign');
        this.lbReward.string = tbSign[myday].amount;
        this.nodeBtnGet.active=false;
        this.spBg.spriteFrame = this.imgYellowBg;

        // this.refreshUI();
        if (signInfo) {
            this.lbDesc.string = i18n.t('signReward.第 %{value} 天', {value: myday});
    
            if (myday<=signInfo.signTimes) {
            this.spBg.spriteFrame = this.imgBlueBg;
            this.nodeBtnGet.active = false;

            this.nodeGetted.active = true;
            }
            if (myday===signInfo.signTimes) {
                
                if (signInfo.lastSignDay === today){
                    this.spBg.spriteFrame = this.imgBlueBg;
                    this.nodeBtnGet.active = false;

                    this.nodeGetted.active = true;
               }else{
                this.nodeGetted.active = false;
                this.nodeBtnGet.active = true;
                //this.nodeBtnGet.interactable=true;


               }
            }
           
        }else
        {
            
            this.lbDesc.string = i18n.t('signReward.第 %{value} 天', {value: myday});
            this.spBg.spriteFrame = this.imgYellowBg;
            if (myday==1) {
            this.nodeBtnGet.active = true;
                
            }
            this.nodeGetted.active = false;
        }
       
            
    },

    // refreshUI() {
    //     if (this._taskTemplate.rewardType === constants.REWARD_TYPE.DIAMOND) {
    //         this.spReward.spriteFrame = this.imgDiamond;
    //     } else {
    //         this.spReward.spriteFrame = this.imgGold;
    //     }

    //     this.lbReward.string = this._taskTemplate.rewardValue;

    //     this.lbDesc.string = i18n.t('taskData.' + this._taskTemplate.desc);

    //     let current = 0;
    //     let taskStatus = playerData.getTaskStatusById(this._taskTemplate.taskId);
    //     if (taskStatus) {
    //         current = taskStatus.finishNumber;
    //         current = current > this._taskTemplate.number ? this._taskTemplate.number : current;
    //         this.progress.progress = current / this._taskTemplate.number;
    //         this.lbProgress.string = current + '/' + this._taskTemplate.number;
    //     } else {
    //         this.progress.progress = 0;
    //         this.lbProgress.string = '0/' + this._taskTemplate.number;
    //     }

    //     this.spBg.spriteFrame = this.imgYellowBg;
    //     if (taskStatus && taskStatus.isGet) {
    //         this.nodeBtnGet.active = false;

    //         // this.lbTaskStatus.node.active = true;
    //         // this.lbTaskStatus.string = '已领取';
    //         this.nodeGetted.active = true;
    //         this.spBg.spriteFrame = this.imgBlueBg;
    //     } else if (current < this._taskTemplate.number) {
    //         //未完成
    //         this.nodeBtnGet.active = true;


    //         this.nodeBtnGet.getComponent(cc.Button).interactable = false;
    //         // this.lbTaskStatus.node.active = true;
    //         // this.lbTaskStatus.string = '未完成';
    //         this.nodeGetted.active = false;
    //     } else {
    //         this.nodeBtnGet.active = true;
    //         this.nodeBtnGet.getComponent(cc.Button).interactable = true;
    //         // this.lbTaskStatus.node.active = false;
    //         this.nodeGetted.active = false;
    //     }
    // },
    onBtnGetClick1() {
        this.onBtnGetClick(1);
    },
    onBtnGetClick2() {
        this.onBtnGetClick(2);
    },
    onBtnGetClick3() {
        this.onBtnGetClick(3);
    },
    onBtnGetClick4() {
        this.onBtnGetClick(4);
    },
    onBtnGetClick5() {
        this.onBtnGetClick(5);
    },
    onBtnGetClick6() {
        this.onBtnGetClick(6);
    },
    onBtnGetClick7() {
        this.onBtnGetClick(7);
    },
    onBtnGetClick8() {
        this.onBtnGetClick(8);
    },
    onBtnGetClick9() {
        this.onBtnGetClick(9);
    },
    onBtnGetClick10(event,e) {

        this.showSignRewardPanel(e,false);
    },
    onBtnGetClick(day) {
        // gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.DAILY_TASK_REWARD_CLICK, {taskId: this._taskTemplate.taskId});
        // this.reward(false);

        if (Math.random() <= constants.DISABLE_RATIO && this.openRewardType !== constants.OPEN_REWARD_TYPE.NULL) return;

        let data={
            "id":1,
            "user_id":playerData.id.toString(),
            "current_day":day,
            "last_login_at":utils.getDay(),
            "reward_claimed":1,
            "completed_at":utils.getDay()
        }
            let xhr = new XMLHttpRequest();
            xhr.open("POST", 'https://www.bakes.ltd/api/v1/bake_user_login_rewards/update', true);
            xhr.send(JSON.stringify(data));
            xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 发送成功 返回数据
                console.log(JSON.parse(xhr.responseText));
                console.log(xhr.responseText.list);
            }
        }
        this.showSignRewardPanel2(false);

    },
    showSignRewardPanel(e,isDouble) {
        const redata = [
            [0.01, 100],
            [10, 100],
            [20, 150],
            [50, 300],
            [100, 500],
            [200, 800],
            [500, 1500],
            [1000, 2500],
            [2000, 5000],
            [5000, 10000]
        ];
        let reward ={
            "xxx": 1,
            "ID": 1,
            "type": 1,
            "amount": redata[e][1],
            "taskId": "1",
            "taskStatus": null
        };
        if (reward) {
            if (isDouble && reward.amount) {
                reward.amount *= 2;
            }
            // this.refreshGet(true);
            cc.gameSpace.uiManager.showSharedDialog('sign/signReward', 'signReward', [reward]);
        }
        // this.spBg.spriteFrame = this.imgBlueBg;
        // this.nodeBtnGet.active = false;
        for (let index = 0; index < this.spbglist.length; index++) {
            const element = this.spbglist[index];
            const element2 = this.btnbg[index];

            element2.active = false;
            element.active = false;
        }
        this.spbglist[0].active=true;
        this.btnbg[0].active = true;
        this.nodeGetted.active = true;
    },

    showSignRewardPanel2(isDouble) {
        let reward = gameLogic.sign();

        if (reward) {
            if (isDouble && reward.amount) {
                reward.amount *= 2;
            }
            // this.refreshGet(true);
            cc.gameSpace.uiManager.showSharedDialog('sign/signReward', 'signReward', [reward]);
        }
        // this.spBg.spriteFrame = this.imgBlueBg;
        // this.nodeBtnGet.active = false;
        for (let index = 0; index < this.spbglist.length; index++) {
            const element = this.spbglist[index];
            const element2 = this.btnbg[index];

            element2.active = false;
            element.active = false;
        }
        this.spbglist[0].active=true;
        this.btnbg[0].active = true;
        this.nodeGetted.active = true;
    },
    /**
     * 是否发放奖励
     * @param {Boolean} isDouble 是否双倍 
     */
    reward(isDouble) {
        //领取奖励
        if (gameLogic.getTaskReward(this._taskTemplate.taskId, isDouble)) {
            this.refreshUI();
            clientEvent.dispatchEvent('taskFinished');
        }
    },

    updateTask(arrTask) {
        let isFind = false;
        for (var idx = 0; idx < arrTask.length; idx++) {
            if (arrTask[idx] === this._taskTemplate.taskId) {
                isFind = true;
                break;
            }
        }

        if (isFind) {
            this.refreshUI();
        }
    },

    // update (dt) {},
});