import { WebTon } from "./webton";

const { ccclass, property } = cc._decorator;

export interface Transaction{ amount: string, payload?: string, callBack?: (result: any)=>void}
@ccclass('TonConnectUi')
export class TonConnectUi {
    private static _instance: TonConnectUi;
    private tonWallet: string ;
    private constructor() {

    }
    public static get Instance(): TonConnectUi {
        if (!TonConnectUi._instance) {
            TonConnectUi._instance = new TonConnectUi();
        }
        return TonConnectUi._instance;
    }


    public setWallet(walletAdd: string){
        this.tonWallet = walletAdd;
    }

    public toNano(ton: string) {

        return (parseFloat(ton) * 1000000000).toString();
    }

    public isConnected(): boolean {
        if (!this._tgConnect) {
            console.error("ton ui not inited!");
            return false;
        }
        return this._tgConnect.connected;
    }
  public disconnect() {

    if (!this._tgConnect) {
        console.error("ton ui not inited!");
        return;
    }
    this._tgConnect.disconnect();
    }
    public account() {
        if (!this._tgConnect) {
            console.error("ton ui not inited!");
            return null;
        }

        console.log(this._tgConnect.account,"用户钱包地址")
        return this._tgConnect.account;

    }

    public getUserTonAddress(){
        let add = this._tgConnect.account.address;

        let add1 = WebTon.Instance.parseAddress(add);

        console.log(add1,"用户钱包地址");

        return add1;

    }


    public parseRaw(raw: string) {
        return raw;
    }
    private _tgConnect: any = null;
    public async init(manifestUrl: string, tonWallet: string, language?: string) : Promise<{success: boolean}> {
        this.tonWallet = tonWallet;
        this._tgConnect =  await new Promise<any>((resolve, reject) => {
            // if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.platform === sys.Platform.DESKTOP_BROWSER) {
                // const script = document.createElement("script");
                // script.src = "https://unpkg.com/@tonconnect/ui@2.0.9/dist/tonconnect-ui.min.js";
                // script.async = true;
                // script.onload = () => {
                    const intervalId = setInterval(() => {
                        if ((window as any).TON_CONNECT_UI) {
                            console.log("loading telegram web app sdk success!");
                          const tonConnect =  new window['TON_CONNECT_UI'].TonConnectUI(
                                {
                                    manifestUrl: manifestUrl
                                }
                            )
                            tonConnect.uiOptions = {
                                language: language||'en',
                            };
                            resolve(tonConnect);
                            clearInterval(intervalId);
                        }
                    }, 100);
                // };
                // script.onerror = () => reject(new Error("Unable to load TelegramWebApp SDK, please check logs."));
                // document.head.appendChild(script);
            // }
        });

        if (this._tgConnect ) {
      
            return Promise.resolve({success: true});
        } else {
            return Promise.resolve({success: false});
        }

      

    }
    public  subscribeWallet(updateConnect:()=>void) {
        console.log("subscribe wallet");
        updateConnect();
        if(this._tgConnect) {
        const unsubscribeModal = this._tgConnect.onStatusChange(state => {
            console.log("model state changed! : ", state);

            updateConnect();
        });
        const unsubscribeConnectUI = this._tgConnect.onStatusChange(info => {
            console.log("wallet info status changed : ", info);
    
            updateConnect();
        });
    }



    }

    public isTonConnected(){
        return this._tgConnect.connected;
    }

    public async openModal() {
        if (!this._tgConnect) return;
        console.log("this._tgConnect open modal------>", await this._tgConnect.getWallets());

        if (this._tgConnect.connected) {
            this._tgConnect.disconnect();
        } else {
            this._tgConnect.openModal();
        }
    }

    private createPayload() {

        return '';
    }

    public async sendTransaction(args:Transaction ) {
        if(!this._tgConnect||this._tgConnect.connected==false){
            console.error('ton connect not connected');
            throw new Error('ton connect not connected');
        }
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 120, // 120 sec
        messages: [
            {
                address: "UQDaPQNXeL-uoHqyMNl_HXJ1hq0NBNp3vyctLXbifc7qY2U0" ,
                amount:  this.toNano(args.amount),
                payload: args.payload // just for instance. Replace with your transaction payload or remove

            }
        ]
    }

    console.log(transaction,"ton支付的参数");
    
    try {
        const result = await this._tgConnect.sendTransaction(transaction);
        if(args.callBack) {
            args.callBack({
                success: true,
                result: result
            });
        }
        // you can use signed boc to find the transaction
    } catch (e) {
        console.error(e);
        if(args.callBack) {
            args.callBack({
                success: false,
                result: e.message
            });
        }
    }
}

    
}


