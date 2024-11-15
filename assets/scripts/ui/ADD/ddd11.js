// // Learn cc.Class:
// //  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// import { _decorator, Component, Node, Button } from 'cc';
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//         button: cc.Button,
//     },

//     // LIFE-CYCLE CALLBACKS:

//     // onLoad () {},

//     start() {
//         let botToken = '7934845024:AAHtTjgAqWluK98YYti0jI8ZnSWROUcYkrA';
//         this.apiUrl = `https://api.telegram.org/bot${botToken}/sendInvoice`;
//         this.invoiceData = {
//             chat_id: '7225077329', // 收款人聊天 ID，前面文章有些如何获取
//             title: 'Product Title', // 商品名称
//             description: 'Product Description', // 商品描述
//             payload: 'UniquePayload', // 唯一的负载
//             provider_token: '1877036958:TEST:aca6068f028a99133b6e4dad78237228db800173', // 支付提供者的 Token，前面文章有写如何获取
//             start_parameter: 'start', // 开始参数
//             currency: 'USD', // 货币
//             prices: JSON.stringify([{ label: 'Product', amount: 1000 }]), // 商品价格
//         };
//     },
//     async openBot() {
//         try {
//             const response = await fetch(this.apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(this.invoiceData),
//             });

//             const data = await response.json();

//             if (data.ok) {
//                 console.log('Invoice sent successfully:', data);
//                 const botUsername = 'ttttpayBot'; // 替换为你的机器人用户名
//                 window.location.href = `https://t.me/${botUsername}`;
//             } else {
//                 console.error('Failed to send invoice:', data);
//             }
//         } catch (error) {
//             console.error('Error sending invoice:', error);
//         }
//     }
//     // update (dt) {},
// });
