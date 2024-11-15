// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import 'regenerator-runtime/runtime';

const i18n = require('LanguageData');
const localConfig = require('localConfig');
const audioManager = require('audioManager');
const configuration = require('configuration');
const clientEvent = require('clientEvent');
const playerData = require('playerData');
const constants = require('constants');
const gameLogic = require('gameLogic');
const guideLogic = require('guideLogic');
const uiManager = require('uiManager');
const updateValueLabel = require('updateValueLabel');

import { TelegramWebApp } from './cocos-telegram-miniapps/telegram-web';
import { WebTon } from './cocos-telegram-miniapps/webton';
import {TonConnectUi} from "./cocos-telegram-miniapps/telegram-ui";

cc.gameSpace = {};
cc.gameSpace.TIME_SCALE = 1;
cc.gameSpace.isStop = false;
cc.gameSpace.SDK = 'open';
i18n.init('zh');
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
        _config:undefined,
        edtAccount: cc.EditBox,
        btnStart: cc.Node,
        nodeAccount: cc.Node,
        nodeProgress: cc.Node,
        lbProgress: updateValueLabel,
        nodeFeedback: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad() {
        let winSize = cc.winSize;
        if (winSize.width > winSize.height || (winSize.height / winSize.width) < 1.4) {
            this.node.getComponent(cc.Canvas).fitHeight = true;
        }

        i18n.init('zh');

        // this.nodeAccount.active = true;
        // this.btnStart.active = true;
        // this.nodeProgress.active = false;
    },
    async loadWallet() {
        if (CC_BUILD) {
            console.log('CC_BUILD', CC_BUILD);

        }
        try {
            const addressConfig = {
                tonAddress: 'EQBVa6SwOkmSV7qHdy-iYW3mq3Br3gOoylJAAOeP0o91BS8K',
                jettonAddress: 'EQD_GZls9HhMJGp26xDmSHBNTk7BXBQ5dUAe7Us20hr_-zuo'
            } ;
            this._config = addressConfig;
            return true;
        } catch (e) {
            console.error('request config failed!', e);
            return false;
        }
    },

    async _initTonUI() {
        TonConnectUi.Instance.init("https://bakes.ltd/tonconnect-manifest.json", this._config.tonAddress, 'en').then(res => {
            console.log("ton connect ui init : ", res.success);
            TonConnectUi.Instance.subscribeWallet(() => {
                console.log("wallet change");
                // EventManager.instance.emit(EventType.CONNECT_COMPLETE, res.success);
            })
        })
    },
    start() {
    //初始化TGSDK
    TelegramWebApp.Instance.init().then(res => {
        console.log("电报SDK初始化成功 : ", res.success,window.TonWeb,"-----",window.Telegram);
        TelegramWebApp.Instance.enableClosingConfirmation();
        // GlobalVar.tgInitData = TelegramWebApp.Instance.getTelegramWebAppInitData()
        WebTon.Instance.init();
        //获取收款地址
        this.loadWallet().then(res => {
            if (!res) {
                console.error('load wallet failed!')
                return;
            }
            //初始化ton钱包
            this._initTonUI();
        }).catch(err => { console.error(err); });
        const initDataUnsafe = TelegramWebApp.Instance.getTelegramWebAppInitDataUnSafe();
        console.log('initDataUnsafe:', initDataUnsafe);

    }).catch(err => {
        console.log("电报SDK初始化失败 : ", err);
    });
        // if (window.location.search){
        //     this.code=window.location.search.split('=')[1];
        // }
  
        this.code=window.location.search.split('=')[1];
        cc.debug.setDisplayStats(false);

        cc.gameSpace.isIphoneX = (cc.game.canvas.height / cc.game.canvas.width) > 2;
        cc.gameSpace.audioManager = audioManager;
        cc.gameSpace.gameLogic = gameLogic;
        cc.gameSpace.uiManager = uiManager;
        cc.gameSpace.showTips = uiManager.showTips.bind(uiManager);
        cc.gameSpace.showLoading = uiManager.showLoading.bind(uiManager);
        cc.gameSpace.hideLoading = uiManager.hideLoading.bind(uiManager);
        cc.gameSpace.clientEvent = clientEvent;
        // cc.gameSpace.isInitFinished = false;
        cc.gameSpace.isConfigLoadFinished = false;

        localConfig.loadConfig(() => {
            cc.gameSpace.isConfigLoadFinished = true;
        });


        let self = this;

        let isTg = false;
        let initDataUnsafe = window?.Telegram?.WebApp?.initDataUnsafe;
        if(initDataUnsafe){
            Object.keys(initDataUnsafe).forEach((key) => {
                if (initDataUnsafe[key] !== undefined && initDataUnsafe[key] !== null) {
                    isTg = true;
                }
            });
        }

        if (isTg) {
            // 发送get请求
            let xhr =  new XMLHttpRequest();
            // let dataStr = JSON.stringify(initDataUnsafe);
        
            const dataStr = initDataUnsafe;
            console.log("dataStr-------------",dataStr);
            console.log("dataStr.user-------------",dataStr["user"]);
            const formatTime = (date) => {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              }
              const now = new Date();
              const senddata = {
                "user_id": (dataStr.user.id).toString(),
                "first_name": dataStr.user.first_name,
                "last_name": dataStr.user.last_name,
                "language_code": dataStr.user.language_code,
                "status":"1",
                "recently_login_time":formatTime(now)
            };
            console.log("senddata-------------",senddata);
            xhr.open("POST", 'https://www.bakes.ltd/api/v1/bake-user', true);
            xhr.send(JSON.stringify(senddata));
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // 发送成功 返回数据
                    console.log(xhr.responseText);
                    // 根据返回的数据进行处理 比如登录
                    let res = dataStr;                    
                    playerData.id = res.user.id;
                    playerData.first_name = res.user.first_name;
                    playerData.last_name = res.user.last_name;
                    playerData.language_code = res.user.language_code;
                    self.refreshUI();
                    if (JSON.parse(xhr.responseText).invitation_code) {
                        self.invit();
                    }
                }
            };
        } else {
            // alert("请在Telegram中打开");
            playerData.id = "7225077329";
            playerData.firs_name = "钟";
            playerData.last_name = "镛";
            playerData.language_code = "zh-hans";
            this.my_userLogin();

        }
    },
    invit()
    {
        let xhr = new XMLHttpRequest();
        let senddata={

            "inviter_id":this.code.toString(),
            "invitee_id": playerData.id.toString(),
        };
        xhr.open("POST", 'https://www.bakes.ltd/api/v1/bake_invitation_records', true);
        xhr.send(JSON.stringify(senddata));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
            }
        };
    },
    /**
     * 用户登录(lqm)
     *
     * @returns 无返回值
     */
    my_userLogin() {
     let self=this;
     let senddata= {
            "id":1,
            "user_id": playerData.id,
            "first_name": playerData.firs_tName,
            "last_name": playerData.last_tName,
            "language_code": playerData.language_code,
        }
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://www.bakes.ltd/api/v1/bake-user', true);
        xhr.send(JSON.stringify(senddata));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 发送成功 返回数据
                // 根据返回的数据进行处理 比如登录
                let res = JSON.parse(xhr.responseText);
                self.refreshUI();
            }
        };
        self.refreshUI();
        
    },
    refreshUI() {
        // var account = configuration.getGlobalData(constants.LOCAL_CACHE.ACCOUNT);
        // if (!account) {
        //     account = playerData.generateRandomAccount();
        // }
        // console.log("account", account);
        this.uid = playerData.id;
        this.playerName = playerData.firs_tName + playerData.last_tName;

        this.userLogin();
    },

    userLogin() {
        //后续考虑wx接入时应该以wx账号为准
        playerData.userId = this.uid;
        playerData.nickName = this.playerName;
        playerData.avatar = this.headIcon;
        configuration.setGlobalData(constants.LOCAL_CACHE.ACCOUNT, this.uid);
        configuration.setUserId(this.uid);
        playerData.loadFromCache();

        clientEvent.dispatchEvent('hideWaiting');
        //api/v1/bake-user
        this.loadMainScene();
        // this.my_userLogin();
    },

    loadMainScene() {
        cc.director.preloadScene('main', function(err) {
            if (!err) {
                cc.director.loadScene('main', function() {
                    guideLogic.start();
                });
            }
        });
    },

    // update (dt) {},
});