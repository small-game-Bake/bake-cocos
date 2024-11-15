// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // Httputils.get("https://apioquist.gxnnpckj.cn/api/android/v1.0/pub/about?package_name=com.aiai.fbwy.app&type=2",{}, (data) => {
        //     console.log(data);
        // }, (err) => {
        //     console.log(err);
        // });
        // Httputils.post("http://www.baidu.com",{},{name: "cc"}, (data) => {
        //     console.log(data);
        // }, (err) => {
        //     console.log(err);
        // });
    },

    // update (dt) {},
});
