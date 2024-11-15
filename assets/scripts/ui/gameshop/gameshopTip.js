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
const { ccclass, property } = cc._decorator;
const i18n = require('LanguageData');


cc.Class({
    extends: cc.Component,

    properties: {

        lbneedPay: cc.Label,
        lbusdt1: cc.Label,
        lbusdt2: cc.Label,
        lbTon1: cc.Label,
        lbTon2: cc.Label,
        lbStar: cc.Label,
        qnum:0,
        qian: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    
    start() {
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

    },//支付系统
    show(number, type) {
        this.initializeQian()
        this.qnum = number-0.01;
        let self = this;
        this.type = type;
        this.lbneedPay.string = "$" + (number - 0.01);
        this.lbusdt1.string = number * 0.8 + " USDT";
        this.lbusdt2.string = number + "USDT";
        // this.lbTon1.string = (number / 5.19 * 0.8).toFixed(2) + " TON";
        // this.lbTon2.string = (number * 5.19).toFixed(2) + " TON";
        this.lbStar.string = number * 50 + " Star";
        let xhr = new XMLHttpRequest();
        xhr.open("Get", 'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd', true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 发送成功 返回数据
                let data = JSON.parse(xhr.responseText);
                let usd = data['the-open-network']['usd'];
                //  n/5.31*0.8  
                self.lbTon1.string = ((number * 0.8) / data['the-open-network']['usd']).toFixed(2) + " TON";
                self.lbTon2.string = (number / data['the-open-network']['usd']).toFixed(2) + " TON";
            }
        };

    },

    onEnable() {

    },

    initList() {

    },

    onBtnCloseClick() {
        cc.gameSpace.audioManager.playSound('click', false);

        // this.node.active = false;
        cc.gameSpace.uiManager.hideSharedDialog('gameshop/gameshopTip');
    },

    update(dt) {
    },
    buy1() {
        //usdt 支付方式
        console.log('usdt 支付方式')
        //支付成功，继续以下代码，如果支付失败 就是return ，不执行以下


        this.qian +=this.qnum;
        localStorage.setItem('qian', this.qian); 
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
          
        if (this.type == 1) {
            playerData.addDiamond(100);
            playerData.addGiftBox(3);
            clientEvent.dispatchEvent('updategiftBox');
            clientEvent.dispatchEvent('updateDiamond');
            localStorage.setItem('buy2_lastExecutionDate', todayDateString);
        } else if (this.type == 2) {
            playerData.addDiamond(100);
            clientEvent.dispatchEvent('updateDiamond');

        } else if (this.type == 3) {
            playerData.addGiftBox(10);
            clientEvent.dispatchEvent('updategiftBox');
        }else if (this.type == 5) {
            playerData.addDiamond(300);
            playerData.addGiftBox(20);
            clientEvent.dispatchEvent('updateDiamond');
        }
        cc.gameSpace.showTips(i18n.t('showTips.Purchasesuccessful'));

    },
    buy2() {
        console.log('ton 支付方式')
        this.qian +=this.qnum;
        localStorage.setItem('qian', this.qian); 
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
          
        if (this.type == 1) {
            playerData.addDiamond(100);
            playerData.addGiftBox(3);
            clientEvent.dispatchEvent('updategiftBox');
            clientEvent.dispatchEvent('updateDiamond');
            localStorage.setItem('buy2_lastExecutionDate', todayDateString);
        } else if (this.type == 2) {
            playerData.addDiamond(100);
            clientEvent.dispatchEvent('updateDiamond');

        } else if (this.type == 3) {
            playerData.addGiftBox(10);
            clientEvent.dispatchEvent('updategiftBox');
        }else if (this.type == 5) {
            playerData.addDiamond(300);
            playerData.addGiftBox(20);
            clientEvent.dispatchEvent('updateDiamond');
        }
        cc.gameSpace.showTips(i18n.t('showTips.Purchasesuccessful'));

    },
    buy3() {
 
        this.qian +=this.qnum;
        localStorage.setItem('qian', this.qian);
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
             
        if (this.type == 1) {
            playerData.addDiamond(100);
            playerData.addGiftBox(3);
            clientEvent.dispatchEvent('updategiftBox');
            clientEvent.dispatchEvent('updateDiamond');
            localStorage.setItem('buy2_lastExecutionDate', todayDateString);
        } else if (this.type == 2) {
            playerData.addDiamond(100);
            clientEvent.dispatchEvent('updateDiamond');

        } else if (this.type == 3) {
            playerData.addGiftBox(10);
            clientEvent.dispatchEvent('updategiftBox');
        }else if (this.type == 5) {
            playerData.addDiamond(300);
            playerData.addGiftBox(20);
            clientEvent.dispatchEvent('updateDiamond');
        }
        cc.gameSpace.showTips(i18n.t('showTips.Purchasesuccessful'));

    },    

    initializeQian () {
        // 尝试从 localStorage 读取 qian 的值
        var storedValue = localStorage.getItem('qian');
        
        if (storedValue === null) {
            // 如果不存在，初始化为 0
            this.qian = 0;
            localStorage.setItem('qian', this.qian); // 存储初始化值
            cc.log("qian 不存在，已初始化为: " + this.qian);
        } else {
            // 如果存在，读取并赋值
            this.qian = parseInt(storedValue, 10); // 将字符串转换为整数
            cc.log("qian 已存在，值为: " + this.qian);
        }
    },
});
