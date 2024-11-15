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

        content: cc.Node,

        pfbTaskItem: cc.Prefab,
        count:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    
    start () {

    },

    show () {
        resourceUtil.updateNodeRenderers(this.node);
        gameLogic.customEventStatistics(constants.STAT_EVENT_TYPE.INVITE_SHOW, {});
    },

    onEnable () {
        let self = this;
        let xhr = new XMLHttpRequest();
        xhr.open("Get", 'https://www.bakes.ltd/api/v1/bake_invitation_records?pageIndex=1&pageSize=10&inviter_id='+playerData.id, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 发送成功 返回数据
                console.log(JSON.parse( xhr.responseText));
                self.initList(JSON.parse( xhr.responseText).data.list);
                self.count.string="（已邀请："+JSON.parse( xhr.responseText).data.count+"人）";
            }
        };
    },
     shareGame() {
      window.open("https://t.me/cocos_bake_bot?start="+playerData.id);

      },
    initList (list) {
        this.removeAllChildren(this.content);
        for (let i = 0; i < list.length; i++) {
            let item = cc.instantiate(this.pfbTaskItem);
            item.parent = this.content;
            item.active = true;
           let llnode= item.getChildByName("idNumber");
           llnode.getComponent(cc.Label).string="ID"+list[i].invitee_id;
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
    // 创建一个临时的 textarea 元素来包含要复制的文本
 copyToClipboardUsingExecCommand(text) {
    let textarea = document.createElement('textarea');
    textarea.value = "https://t.me/cocos_bake_bot?start="+playerData.id;
    document.body.appendChild(textarea);
    textarea.select();
    let successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (successful) {
        console.log('复制成功！');
        cc.gameSpace.showTips(i18n.t('showTips.copySuccess'));

    } else {
        console.error('复制失败');
    }
},

// 调用函数，复制文本
    onBtnCloseClick () {
        cc.gameSpace.audioManager.playSound('click', false);
        
        // this.node.active = false;
        cc.gameSpace.uiManager.hideSharedDialog('invite/invite');
    },
});
    // update (dt) {},
