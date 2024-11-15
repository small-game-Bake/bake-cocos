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

        content: cc.Node,
        pfbTaskItem: cc.Prefab,
        pfbTaskItem2: cc.Prefab,
        renwu1: cc.Toggle,
        renwu2: cc.Toggle,
        node1: cc.Node,
        node2: cc.Node,
        Diamond: cc.Label,
        singnode: [cc.Node],
        signTimes: cc.Label,
        xflabel: cc.Label,
        xfnode: cc.Node,
        qianed:0,
        redata:[],
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
},
    start() {
        console.log("进来了")
                // 顺序：【消费钱，奖励砖石】
                this.redata = [
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
    },

    show() {
        resourceUtil.updateNodeRenderers(this.node);
        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.DAILY_TASK_SHOW, {});
    },

    onEnable() {

        this.initList();
    },
    // initListt1 () {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("GET", 'https://www.bakes.ltd/api/v1/bake_tasks?pageIndex=1&pageSize=10', true);
    //     xhr.send();
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState == 4 && xhr.status == 200) {
    //             // 发送成功 返回数据
    //             console.log(JSON.parse(xhr.responseText));
    //             console.log(xhr.responseText.list);
    //         }
    //     };

    // },
    initList() {

        this.node1.active = true;
        this.node2.active = false;
        this.renwu1.isChecked = true;
        
        const list1 = this.content.getChildByName('list1')
        this.removeAllChildren(this.list1);
        const list2 = this.content.getChildByName('list2')
        this.removeAllChildren(this.list2);
        this.Diamond.string = playerData.getDiamond();

        console.log("initList");
        let arrTask = [];
        let tbTask = localConfig.getTable('dailyTask');


        console.log(tbTask);
        // console.log(playerData.getTaskStatus());
        for (var taskId in tbTask) {
            let task = tbTask[taskId];
            task.taskId = taskId;

            task.taskStatus = playerData.getTaskStatusById(taskId);
            arrTask.push(task);
        }
        console.log(arrTask)

        arrTask.sort((taskA, taskB) => {
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

        const list1data = [
            {
                "ID": 1,
                "name": "绑定钱包",
                "type": 1,
                "number": 1,
                "rewardType": 1,
                "rewardValue": 10,
                "desc": "绑定钱包",
                "taskId": "9",
                "taskStatus": null
            },
            {
                "ID": 2,
                "name": "订阅频道",
                "type": 1,
                "number": 1,
                "rewardType": 1,
                "rewardValue": 5,
                "desc": "订阅频道",
                "taskId": "10",
                "taskStatus": null
            },
            {
                "ID": 3,
                "name": "订阅推特",
                "type": 2,
                "number": 1,
                "rewardType": 1,
                "rewardValue": 5,
                "desc": "订阅推特",
                "taskId": "11",
                "taskStatus": null
            }
        ]

        for (let index = 0; index < arrTask.length; index++) {
            let task = arrTask[index];

            let node = null;
            if (list2.children.length > index) {
                node = list2.children[index];
            } else {
                node = cc.instantiate(this.pfbTaskItem);
                node.parent = list2;
            }

            let taskItem = node.getComponent('dailyTaskItem');
            taskItem.setInfo(task);
        }
        for (let index = 0; index < list1data.length; index++) {
            let task = list1data[index];

            let node = null;
            if (list1.children.length > index) {
                node = list1.children[index];
            } else {
                node = cc.instantiate(this.pfbTaskItem);
                node.parent = list1;
            }

            let taskItem = node.getComponent('dailyTaskItem');
            taskItem.setInfo(task);
        }
    },
    removeAllChildren(node) {
        // 确保传入的参数是一个节点对象
        if (!(node instanceof cc.Node)) {
            return;
        }

        // 遍历子节点并删除
        for (let i = node.childrenCount - 1; i >= 0; i--) {
            let child = node.children[i];
            child.removeFromParent(); // 或者使用 node.removeChild(child);
            // 如果需要将子节点置空，可以选择调用 child.destroy();
        }
    },
        //商店
        onBtnShopClick() {

    
            cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshop', 'gameshop');
          
           
        },
    initList2: function () {
        this.xfaw()
        this.initializeQianed()
        // this.renwu2.isChecked = true;
        this.node1.active = false;
        this.node2.active = true;
        // let xhr = new XMLHttpRequest();
        // xhr.open("GET", 'https://www.bakes.ltd/api/v1/bake-user-cakes/synthesis', true);
        // xhr.send();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         // 发送成功 返回数据
        //         console.log(xhr.responseText);
        //     }
        // };
        // this.removeAllChildren(this.content);
        let today = utils.getDay();
        console.log("initList2", today);
        let signInfo = playerData.getDailySignInfo();
        console.log("playerData", playerData.playerInfo);
        console.log("signInfo", signInfo);
        let signTimes=0;
        if (signInfo) {
            signTimes=signInfo.signTimes;
        }
        this.signTimes.string = signTimes;

        let arrdaily = [];
        let tbdaily = localConfig.getTable('dailySign');
        for (var taskId in tbdaily) {
            let task = tbdaily[taskId];
            task.taskId = taskId;

            task.taskStatus = playerData.getTaskStatusById(taskId);
            arrdaily.push(task);
        }
        console.log(arrdaily)
        let idToFind = 1;
        let result = arrdaily.find(item => item.xxx === idToFind);
        console.log("找到的对象:", result.amount);

        for (let index = 0; index < this.singnode.length; index++) {
            const A  = cc.find('reward/value',this.singnode[index]).getComponent(cc.Label)
            const B  = cc.find('btnGet/desc',this.singnode[index]).getComponent(cc.Label)
            idToFind = index+1;
            let result = arrdaily.find(item => item.xxx === idToFind);
            if (result) {
                A.string = result.amount.toString(); // 将 amount 转为字符串
                B.string = '第' + result.ID + '天';
            }
            
            let taskItem = this.singnode[index].getComponent('signItem');

            if ( signTimes > index) {
                
                //已签到
                // this.singnode[index].active = true;
                taskItem.setInfo(0);
            }else if ( signTimes == index) {
                //今天未签到
                // this.singnode[index].active = false;
                if (signInfo) {
                    if (signInfo.lastSignDay > today)
                        {
                            taskItem.setInfo(0);
                        }
                        else if (signInfo.lastSignDay < today)
                        {
                            taskItem.setInfo(2);
                        }else
                        {
                            taskItem.setInfo(1);
        
                        }
                }else
                {
                    taskItem.setInfo(2);
                }
                
                

            }
            else {
                //未签到
                // this.singnode[index].active = false;
                let taskItem = this.singnode[index].getComponent('signItem');
                taskItem.setInfo(1);
            }
        }
        // if (signInfo) {
        //     if (signInfo.lastSignDay >= today) {
        //         //今天已签到
        //         //this.btnExNormal.interactable = false;

        //         this.refreshGet(true);

        //         //TODO 所有光效都需要关闭
        //         for (let idxGet = 0; idxGet < 7; idxGet++) {
        //             this.arrHalo[idxGet].active = false;
        //             this.arrParticle[idxGet].active = false;
        //         }
        //     } else {
        //         //判断下哪天被签到了，剩余多少天
        //         let signTimes = signInfo.signTimes;
        //         if (signTimes >= 7) { //超过7天，今天来就是第1天啦
        //             signTimes = 0;
        //         }

        //         this.refreshGet(false);

        //         //TODO 下一个签到加光效？
        //         this.arrHalo[signTimes].active = true;
        //         this.arrParticle[signTimes].active = true;
        //     }
        // } else {
        //     //证明是第一天or 新手
        //     // this.arrHalo[0].active = true;
        //     // this.arrParticle[0].active = true;
        // }

        // for (let index = 0; index < 7; index++) {

        //     let node = null;
        //     if (this.content.children.length > index) {
        //         node = this.content.children[index];
        //     } else {
        //         node = cc.instantiate(this.pfbTaskItem2);
        //         node.parent = this.content;
        //     }

        //     let taskItem = node.getComponent('signItem');
        //     taskItem.setInfo(index+1,signInfo);
        // }
        this.node1.active = false;
        this.node2.active = true;

    },
    xfaw() {
        let storedValue = localStorage.getItem('qian');
        if (storedValue === null) {
            storedValue = 0 
        }
        this.xflabel.string = storedValue+'';

        const xfNodes = [];
        for (let i = 0; i < this.xfnode.childrenCount; i++) {
            xfNodes.push(this.xfnode.children[i]);
        }
        // 遍历 this.xfnode 中的每个子节点
        for (let index = 0; index < xfNodes.length; index++) {
            // 获取当前子节点
            const node = xfNodes[index];
    
            // 查找子节点中的 A 和 B 标签
            const A = cc.find('reward/value', node).getComponent(cc.Label);
            const B = cc.find('btnGet/desc', node).getComponent(cc.Label);
            // 从 data 数组中获取相应的数据
            const [cost, reward] = this.redata[index];
    
            // 设置 A 和 B 的字符串
            A.string = '' + reward;       // 显示消费金额
            B.string = cost + '美元'; // 显示奖励砖石数量

            let taskItem = xfNodes[index].getComponent('signItem');
            console.log(storedValue,cost)
            if(storedValue>=cost){//可以l
                if(this.qianed > index){//已经零了
                    taskItem.setInfo(0)
                }else{
                    taskItem.setInfo(2) //不能零
                }
            }else{///不能零
                taskItem.setInfo(1);
            }

            // if ( this.qianed > index) {
                
            //     //已签到
            //     // this.singnode[index].active = true;
            //     taskItem.setInfo(0);
            // }else if ( this.qianed == index) {
            //     taskItem.setInfo(0);
            //     //今天未签到
            //     // this.singnode[index].active = false;
            // }
            // else {
            //     //未签到
            //     // this.singnode[index].active = false;
            //     let taskItem = xfNodes[index].getComponent('signItem');
            //     taskItem.setInfo(1);
            // }
        }
    },
    getData(event, string) {
        const e = string;
        playerData.addDiamond(+this.redata[e][1]); 
        localStorage.setItem('qianed', Number(e)+1); 
        this.xfaw() 
    }
    ,
    onBtnCloseClick() {
        cc.gameSpace.audioManager.playSound('click', false);

        // this.node.active = false;
        cc.gameSpace.uiManager.hideSharedDialog('task/dailyTask');
    },

    update(dt) {
        this.Diamond.string = playerData.getDiamond();
    },
    initializeQianed () {
        var storedValue = localStorage.getItem('qianed');
        if (storedValue === null) {
            this.qianed = 0;
            localStorage.setItem('qianed', this.qianed);
        } else {
            this.qianed = parseInt(storedValue, 10);
        }
    },
});
