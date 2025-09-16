class RNApp {
  callbacks: any;
  callbackId: number;

  constructor() {
    this.callbacks = {};
    this.callbackId = 0;
    this.init()
  }

  init() {
    // 使用 message 事件监听 RN 返回
    const handler = (event: any) => {
      let msgData = event.data || event.nativeEvent?.data;
      if (!msgData) return;
      console.log('msgData', msgData)
      try {
        const msg = JSON.parse(msgData);
        if (msg.callbackId && this.callbacks[msg.callbackId]) {
          this.callbacks[msg.callbackId](msg.data);
          delete this.callbacks[msg.callbackId];
        }
      } catch (err) {
        console.error('解析 RN 消息失败', err);
      }
    };

    // RN WebView iOS & Android 通用
    document.addEventListener('message', handler); // 安卓旧版兼容
  }

  /**
   * 调用 App 方法
   * @param {string} action - 方法名
   * @param {object} params - 参数对象
   * @param {function} callback - 可选回调函数
   */
  callApp(type, params = {}) {
    const message = { type, params };
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      console.warn('当前环境不是 React Native WebView');
    }
  }

  /**
   * 查询登录状态
   * @param {function} callback - 返回 { loggedIn: boolean, userInfo: {...} }
   */
  checkLogin(callback: (data: any) => void) {
    this.callbackId += 1;
    const id = this.callbackId;
    this.callbacks[id] = callback;

    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'checkLogin', callbackId: id })
    );
  }
}

export default new RNApp();
