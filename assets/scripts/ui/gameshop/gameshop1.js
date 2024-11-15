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
// import { TonConnect } from "@tonconnect/sdk";
import {TonConnectUi} from "../../cocos-telegram-miniapps/telegram-ui";


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
        lbusdt:cc.Label,
        lbton:cc.Label,
        username:cc.Label,
        address:cc.Label,
        btnbindlabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 初始化钱包连接
        // this.tonConnect = new TonConnect(
        //     {
        //         manifestUrl: "https://bakes.ltd/tonconnect-manifest.json" // 替换为有效的 manifest URL
        //     }
          
        // );
        //     if (window.Telegram && window.Telegram.WebApp) {
        //     console.log("Running inside Telegram environment.");
       
        //     this.tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI(
        //         {
        //           manifestUrl: 'https://bakes.ltd/tonconnect-manifest.json',
        //           buttonRootId: 'ton-connect', // confirm this ID is the same as above div
        //           chain: 'testnet',
        //           network: 'testnet', // mainnet
        //         });
        //         this.tonConnectUI.uiOptions = {
        //             twaReturnUrl: 'https://t.me/cocos_bake_bot',
        //           };
        //         this.initializeTonConnect();  
        // } else {
        //     console.log("Not running inside Telegram environment.");
        // }
        if (TonConnectUi.Instance.isTonConnected()) 
        {
            this.btnbindlabel.string = "解绑"
            this.username.string = playerData.last_name
            let s = TonConnectUi.Instance.getUserTonAddress()
            this.address.string = s[0]+s[1]+s[2]+s[3]+"*****"+s[s.length-4]+s[s.length-3]+s[s.length-2]+s[s.length-1]
        }
        else
        {
            this.btnbindlabel.string = "去绑定"
            this.address.string = ""
        }

        TonConnectUi.Instance.subscribeWallet(() => {
            if (TonConnectUi.Instance.isTonConnected()) 
                {
                    this.btnbindlabel.string = "解绑"
                    this.username.string = playerData.last_name
                    let s = TonConnectUi.Instance.getUserTonAddress()
                    this.address.string = s[0]+s[1]+s[2]+s[3]+"*****"+s[s.length-4]+s[s.length-3]+s[s.length-2]+s[s.length-1]
                }
                else
                {
                    this.btnbindlabel.string = "去绑定"
                    this.address.string = ""
                }
        })
        console.log("初始化完成")
    },
    initializeTonConnect() {
        try {
            // 初始化 TonConnect
            this.tonConnect = new TonConnect({
                manifestUrl: "https://bakes.ltd/tonconnect-manifest.json" // 替换为你的实际 manifest URL
            });
            console.log("TonConnect initialized:", this.tonConnect);
        } catch (error) {
            console.error("Error initializing TonConnect:", error);
        }
    },
    // show () {
    //     resourceUtil.updateNodeRenderers(this.node);
    //     gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.DAILY_TASK_SHOW, {});
    // },

    onEnable () {
        this.lbton.string = playerData.getTON();
        this.lbusdt.string = playerData.getUSDT();
    },
    onBtnWallet1Click() {

        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.wallet_BTN_CLICK1, {});

        cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshop2', 'gameshop2', []);
    },
    onBtnWallet2Click() {

        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.wallet_BTN_CLICK2, {});

        cc.gameSpace.uiManager.showSharedDialog('gameshop/gameshop3', 'gameshop3', []);
    },


    onBtnCloseClick () {
        cc.gameSpace.audioManager.playSound('click', false);
        
        // this.node.active = false;
        cc.gameSpace.uiManager.hideSharedDialog('gameshop/gameshop1');
    },
    async bangding(){
        // console.log("点击链接钱包按钮1")
        // console.log("点击链接钱包按钮2",TonConnectUi)
        // console.log("点击链接钱包按钮3",!TonConnectUi.Instance.isTonConnected())
        // TonConnectUi.Instance.openModal();
        if (!TonConnectUi.Instance.isTonConnected()) {
            TonConnectUi.Instance.openModal();
        } else {
            const walletAddr = TonConnectUi.Instance.getUserTonAddress()
            console.log("walletAddr----",walletAddr);
            TonConnectUi.Instance.disconnect()
            // HttpCom.tonWallet(TonConnectUi.Instance.getUserTonAddress(), () => {
            //     EventManager.instance.emit(EventType.UPDATE_TASK_PANEL);
            // });
            // StaticInstance.uiManager.toggle(ENUM_UI_TYPE.TOAST, true, null, { name: 'The wallet has been successfully connected' });
        }




        // if (window.Telegram && window.Telegram.WebApp) {
        //     console.log("Running inside Telegram environment.");
        //     try {
        //         // 检查是否已经连接到钱包
        //         if (this.tonConnect.wallet) {
        //             console.log("Wallet already connected:", this.tonConnect.wallet.account.address);
        //             return;  // 如果钱包已连接，直接返回
        //         }
        
        //         // 如果钱包未连接，则执行连接流程
        //         // await this.tonConnect.connect({jsBridgeKey : 'tonkeeper' });
        //          await this.tonConnect.connect({ universalLink: true });
          
        //         const walletInfo = this.tonConnect.wallet;
        
        //         if (walletInfo) {
        //             console.log("Connected wallet address:", walletInfo.account.address);
        //             // 在这里处理钱包连接后的逻辑，比如显示钱包地址
        //         }
        //     } catch (error) {
        //         if (error.message.includes("WalletAlreadyConnectedError")) {
        //             console.log("Wallet is already connected.");
        //         } else {
        //             console.error("Error connecting wallet:", error);
        //         }
        //     }
        // } else {
        //     console.log("Not running inside Telegram environment.");
        // }
        
            // console.log('绑定.....')
            // console.log('this.tonConnect.....',this.tonConnect)
            // console.log('this.tonConnect.connect',this.tonConnect.connect({ universalLink: true }));
            // console.log('this.tonConnect.connect',this.tonConnect.connect({ universalLink: true }));
            // console.log('绑定.....',this.tonConnect.connected)
            // const self = this;
            // return new Promise(async ()=>{
            //         try {
            //             console.log('绑定.....',self.tonConnect)
            //             // console.log('绑定.....',self.tonConnect.getWallets());
            //             const walletsList = await self.tonConnect.getWallets();
            //             console.log('walletsList.....',walletsList);
            //             console.log('绑定.....',self.tonConnect.connect({jsBridgeKey : 'telegram-wallet' }))
            //             console.log('绑定.....',self.tonConnect.connected)
            //                 // await self.tonConnect?.connect();
            //                 console.log("Connected to TON Wallet");
            //             } catch (error) {
            //                 console.error("Error connecting to wallet:", error);
            //             }
            // }).then( res=>{
            //     console.log("res ->>>>>>>>>>>>>>>>",res);
            // })
        
            // // 监听钱包连接状态变化
            // try{
            //     this.tonConnect.onStatusChange(async (status) => {
            //         if (status === "connected") {
            //             console.log("Wallet connected", this.tonConnect.getWallet());
    
            //             // try {
            //             //     await this.tonConnect.connect();
            //             //     console.log("Connected to TON Wallet");
            //             // } catch (error) {
            //             //     console.error("Error connecting to wallet:", error);
            //             // }
            //         } else {
            //             console.log("Wallet disconnected");
                        
            //         }
            //     });
            // }catch(error){
            //     console.error("Error connecting to wallet---->:", error);
            // }
    
    
    
        }
});
