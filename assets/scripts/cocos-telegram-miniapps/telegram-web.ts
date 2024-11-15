const { ccclass, property } = cc._decorator;
export interface WebAppUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
}
export interface WebAppChat {
    id: number;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
}
export interface WebAppInitData {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    chat?: WebAppChat;
    chat_type?: 'private' | 'group' | 'supergroup' | 'channel';
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_data: number;
    hash: string;
}

@ccclass('TelegramWebApp')
export class TelegramWebApp {
    private static _instance: TelegramWebApp;
    private constructor() {

    }
    public static get Instance(): TelegramWebApp {
        if (!TelegramWebApp._instance) {
            TelegramWebApp._instance = new TelegramWebApp();
        }
        return TelegramWebApp._instance;
    }

    private _tgWebAppJS: any = null;
    public async init() : Promise<{success: boolean}> {
        this._tgWebAppJS = await new Promise<any>((resolve, reject) => {
            // if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.platform === sys.Platform.DESKTOP_BROWSER) {
                const script = document.createElement("script");
                script.src = "https://telegram.org/js/telegram-web-app.js";
                script.async = true;
                script.onload = () => {
                    const intervalId = setInterval(() => {
                        if ((window as any).Telegram && (window as any).Telegram.WebApp) {
                            console.log("loading telegram web app sdk success!");
                            resolve((window as any).Telegram.WebApp);
                            clearInterval(intervalId);
                        }
                    }, 100);
                };
                script.onerror = () => reject(new Error("Unable to load TelegramWebApp SDK, please check logs."));
                document.head.appendChild(script);
            // };
        });

        if (this._tgWebAppJS) {
            return Promise.resolve({success: true});
        } else {
            return Promise.resolve({success: false});
        }
    }


    public openLink(url: string) {

        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return;
        }
        this._tgWebAppJS.openLink(url);
    }


    public expand(){
        try{

            console.log("扩展到最大显示");
            this._tgWebAppJS.expand();
            
        }
        catch(e){
            console.log(e)
        }

    }
    public closeApp(){
        this._tgWebAppJS.close();
    }
    public openTelegramLink(url: string) {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return;
        }
        console.log(url);
        this._tgWebAppJS.openTelegramLink(url);
    }

    public share(url: string, text?: string) {
        const shareUrl = 'https://t.me/share/url?url=' + url + '&' + new URLSearchParams({ text: text || '' }).toString();
        this.openTelegramLink(shareUrl);
    }

    public getTelegramWebApp() {
        return this._tgWebAppJS;
    }

    public getTelegramWebAppInitDataUnSafe(): WebAppInitData {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this._tgWebAppJS.initDataUnsafe;
    }
    public getTelegramWebAppInitData(): WebAppInitData {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this._tgWebAppJS.initData;
    }

    public enableClosingConfirmation(){

        console.log("启用小程序关闭提示")
        this._tgWebAppJS.enableClosingConfirmation()
    }



    public isTGAvailable(){
        return this._tgWebAppJS;
    }


    public getTelegramUser(): WebAppUser {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this._tgWebAppJS.initDataUnsafe.user;
    }

    public getTelegramInitData(): string {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        return this._tgWebAppJS.initData;
    }

    public openInvoice(url: string, callback: any) {
        if (!this._tgWebAppJS) {
            console.error("telegram web app is not inited!");
            return null;
        } 
        this._tgWebAppJS.openInvoice(url, callback);
    }

    public alert(message: string) {
        this._tgWebAppJS.showAlert(message);
    }
}


