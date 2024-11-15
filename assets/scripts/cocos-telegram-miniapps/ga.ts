// MainScene.js
const { ccclass, property } = cc._decorator;

@ccclass
export class GoogleAnalytics  {
    private static _instance: GoogleAnalytics;
    private _ga: any = null;

    private constructor() {

    }
    public static get Instance(): GoogleAnalytics {
        if (!GoogleAnalytics._instance) {
            GoogleAnalytics._instance = new GoogleAnalytics();
        }
        return GoogleAnalytics._instance;
    }
    public async initGoogleAnalytics() {
       this._ga = await new Promise<any>((resolve, reject) => {

          const script = document.createElement("script");
                script.src = "https://www.googletagmanager.com/gtag/js?id=G-RKHJYZ98Q1";
                script.async = true;
                script.onload = () => {
            const intervalId = setInterval(() => {
                // debugger
                if ((window as any).dataLayer) {
                    console.log("loading ga sdk success!");
                    const dataLayer = (window as any).dataLayer || [];
                   const gtag = function(...args) {
                        dataLayer.push(arguments);
                      }
                      gtag('js', new Date());
                      gtag('config', 'G-RKHJYZ98Q1');
                    resolve(gtag);
                    clearInterval(intervalId);
                }else{
                    console.log("loading ga sdk fail!");
                }
            }, 100);
        }
            script.onerror = () => reject(new Error("Unable to load ga SDK, please check logs."));
            document.head.appendChild(script);

        });
        if (this._ga) {
            return Promise.resolve({success: true});
        } else {
            return Promise.resolve({success: false});
        }
    }
    
    // 在游戏中某个事件发生时发送 GA 事件
    sendEvent(action, category = 'Game', label = '', value = 0) {
        if (this._ga) {
            this._ga('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
          });
        } else {
          console.error('GA is not initialized');
        }
      }
    

}