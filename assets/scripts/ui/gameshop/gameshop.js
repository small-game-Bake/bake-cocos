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
const localConfig = require('localConfig');
const clientEvent = require('clientEvent');
const constants = require('constants');
const resourceUtil = require('resourceUtil');
const gameLogic = require('gameLogic');
const {ccclass, property} = cc._decorator;


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

        content: cc.Node,
        contentTH: cc.Node,

        pfbTaskItem: cc.Prefab,
        Diamond: cc.Label,

        edimg: cc.Button,
        edimg2: cc.Button,
        freeBtn: cc.Button,
        freeBtn2: cc.Button,

        thon:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.apiUrl = `https://api.telegram.org/bot${你机器人的token}/sendInvoice`;
        // this.invoiceData = {
        //     chat_id: '', // 收款人聊天 ID，前面文章有些如何获取
        //     title: 'Product Title', // 商品名称
        //     description: 'Product Description', // 商品描述
        //     payload: 'UniquePayload', // 唯一的负载
        //     provider_token: '', // 支付提供者的 Token，前面文章有写如何获取
        //     start_parameter: 'start', // 开始参数
        //     currency: 'USD', // 货币
        //     prices: JSON.stringify([{ label: 'Product', amount: 1000 }]), // 商品价格
        // };
        this.thbreak();
        this.ed();
    },
    ed(){
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const lastExecutionDate = localStorage.getItem('buy1_lastExecutionDate');
        this.edimg.node.active = (lastExecutionDate === todayDateString);
        this.freeBtn.node.active = !this.edimg.node.active;

        const lastExecutionDate2 = localStorage.getItem('buy2_lastExecutionDate');
        this.edimg2.node.active = (lastExecutionDate2 === todayDateString);
        this.freeBtn2.node.active = !this.edimg2.node.active;



    },
    async openBot () {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.invoiceData),
            });
    
            const data = await response.json();
    
            if (data.ok) {
                console.log('Invoice sent successfully:', data);
                const botUsername = ''; // 替换为你的机器人用户名
                window.location.href = `https://t.me/${botUsername}`;
            } else {
                console.error('Failed to send invoice:', data);
            }
        } catch (error) {
            console.error('Error sending invoice:', error);
        }
    },
    // show () {
    //     resourceUtil.updateNodeRenderers(this.node);
    //     gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.DAILY_TASK_SHOW, {});
    // },

    onEnable () {
        this.Diamond.string = playerData.getDiamond();

        // let sales = {
        //     "user_id": this.userId,
        //     "cake_level":itemId,
        //     "remove_num": 1
        // };
        // let xhr = new XMLHttpRequest();
        // console.log("售卖蛋糕--------------------------------------------");
        // xhr.open("POST", 'https://www.bakes.ltd/api/v1/bake-user-cakes/sales', true);
        // xhr.send(JSON.stringify(sales));
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         // 发送成功 返回数据
        //     }
        // };
        // this.initList();
    },

    initList () {
        let arrTask = [];
        let tbTask = localConfig.getTable('dailyTask');

        console.log(tbTask);
        let shoplist=[];
        let gold={gold:1000,cost:10,costtype:1}
        let gold1={gold:10000,cost:50,costtype:1}
        let gold2={gold:50000,cost:100,costtype:1}
        let gold3={gold:100000,cost:500,costtype:1}
        let gold4={gold:500000,cost:1000,costtype:1}
        let gold5={gold:1000000,cost:5000,costtype:1}
        let gold6={gold:5000000,cost:10000,costtype:1}



        shoplist.push(gold,gold1,gold2,gold3,gold4);
        for (var taskId in tbTask) {
            let task = tbTask[taskId];
            task.taskId = taskId;

            task.taskStatus = playerData.getTaskStatusById(taskId);
            arrTask.push(task);
        }

        arrTask.sort((taskA, taskB)=>{
            let isAFinish = taskA.taskStatus && taskA.taskStatus.finishNumber >= taskA.number;
            let isAGet = taskA.taskStatus && taskA.taskStatus.isGet;
            let isBFinish = taskB.taskStatus && taskB.taskStatus.finishNumber >= taskB.number;
            let isBGet = taskB.taskStatus && taskB.taskStatus.isGet;

            if (isAFinish && isBFinish) { //A跟B都完成了，但都未领取奖励
                if (!isAGet && isBGet) {
                    return -1;
                } else if (isAGet && !isBGet) {
                    return 1;
                } else {
                    return taskA.taskId - taskB.taskId;
                }
            } else if (isAFinish && !isBFinish) {
                if (!isAGet) {
                    return -1;
                }

                return 1;
            } else if (!isAFinish && isBFinish) {
                if (!isBGet) {
                    return 1;
                }

                return -1;
            } else {
                //A跟B都未完成
                return taskA.taskId - taskB.taskId;
            }

        });

        
        // for (let index = 0; index < arrTask.length; index++) {
        //     let task = arrTask[index];
        
        //     let node = null;
        //     if (this.content.children.length > index) {
        //         node = this.content.children[index];
        //     } else {
        //         node = cc.instantiate(this.pfbTaskItem);
        //         node.parent = this.content;
        //     }

        //     let taskItem = node.getComponent('gameshopItem');
        //     taskItem.setInfo(task);
        // }
        for (let index = 0; index < shoplist.length; index++) {
            let task = shoplist[index];
        
            let node = null;
            if (this.content.children.length > index) {
                node = this.content.children[index];
            } else {
                node = cc.instantiate(this.pfbTaskItem);
                node.parent = this.content;
            }

            let taskItem = node.getComponent('gameshopItem');
            taskItem.setInfo(task);
        }
    },

    onBtnCloseClick () {
        cc.gameSpace.audioManager.playSound('click', false);
        
        // this.node.active = false;
        cc.gameSpace.uiManager.hideSharedDialog('gameshop/gameshop');
    },

    update (dt) {
        this.Diamond.string = playerData.getDiamond();

        
    },
    buy1() {
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const lastExecutionDate = localStorage.getItem('buy1_lastExecutionDate');
        if (lastExecutionDate === todayDateString) {
            // 如果今天已经触发过，提醒用户
            console.log("今天已领，请明天再来！");
            return;
        }
    
        localStorage.setItem('buy1_lastExecutionDate', todayDateString);

        playerData.addGiftBox(3);
        clientEvent.dispatchEvent('updategiftBox');
        this.ed();
        console.log("领取成功");
    }
    ,
    buy2(){
        // playerData.addDiamond(100);
        // playerData.addGiftBox(3);
        // clientEvent.dispatchEvent('updategiftBox');
        // clientEvent.dispatchEvent('updateDiamond');
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const lastExecutionDate = localStorage.getItem('buy2_lastExecutionDate');
        if (lastExecutionDate === todayDateString) {
            // 如果今天已经触发过，提醒用户
            console.log("今天已领，请明天再来！");
            return;
        }
        
        cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshopTip', 'gameshopTip',[1,1]);
        this.schedule(() => {
            this.ed();
        }, 0.1);

        console.log("订单约定成功");
    },
    buy3(){
        // playerData.addDiamond(100);
        // clientEvent.dispatchEvent('updateDiamond');
        cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshopTip', 'gameshopTip',[1,2]);

    },
    buy4(){
        // playerData.addGiftBox(10);
        // clientEvent.dispatchEvent('updategiftBox');
        cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshopTip', 'gameshopTip',[1,3]);
    },//特惠商店
    buy5(){
        // playerData.addGiftBox(10);
        // clientEvent.dispatchEvent('updategiftBox');
        cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshopTip', 'gameshopTip',[1,5]);
        this.thon = true;
    },
    thbreak(){
        var storedValue = localStorage.getItem('qian');
        const off = storedValue === null || storedValue ==='0'
            this.content.active = !off;
            this.contentTH.active = off;
    },
    update(){
        if(this.thon){
            this.thbreak();
        }
    }
});
