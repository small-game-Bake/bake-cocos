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
        spBg: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onEnable() {
       // clientEvent.on('updateTask', this.updateTask, this);
    },

    onDisable() {
        //clientEvent.off('updateTask', this.updateTask, this);
    },

    setInfo(taskTemplate) {
        this._taskTemplate = taskTemplate;

        this.refreshUI();
    },

    refreshUI() {
       
    },

    onBtnGetClick() {
        
    },

  
});