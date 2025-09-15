/**
 * vConsole 工具类
 * 使用 CDN 方式异步加载，不影响页面加载性能
 */

interface VConsoleInstance {
  destroy(): void;
}

declare global {
  interface Window {
    VConsole: new () => VConsoleInstance;
  }
}

class VConsoleManager {
  private static instance: VConsoleManager;
  private vConsole: VConsoleInstance | null = null;
  private isLoaded = false;
  private isLoading = false;

  private constructor() {}

  public static getInstance(): VConsoleManager {
    if (!VConsoleManager.instance) {
      VConsoleManager.instance = new VConsoleManager();
    }
    return VConsoleManager.instance;
  }

  /**
   * 异步加载 vConsole
   * @param version vConsole 版本，默认使用最新稳定版
   */
  private async loadVConsole(): Promise<void> {
    if (this.isLoaded || this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      // 使用 jsDelivr CDN 加载 vConsole
      const script = document.createElement('script');
      script.src = `https://unpkg.com/vconsole@latest/dist/vconsole.min.js`;
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          this.isLoaded = true;
          this.isLoading = false;
          resolve();
        };
        
        script.onerror = () => {
          this.isLoading = false;
          console.warn('vConsole 加载失败，请检查网络连接');
          reject(new Error('vConsole 加载失败'));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  }

  /**
   * 初始化 vConsole
   * @param options 配置选项
   */
  public async init(options?: {
    version?: string;
    theme?: 'light' | 'dark';
    defaultPlugins?: string[];
    onReady?: () => void;
  }): Promise<void> {
    try {
      await this.loadVConsole();
      if (window.VConsole) {
        this.vConsole = new window.VConsole();
        options?.onReady?.();
        console.log('vConsole 已启用');
      }
    } catch (error) {
      console.error('vConsole 初始化失败:', error);
    }
  }

  /**
   * 销毁 vConsole
   */
  public destroy(): void {
    if (this.vConsole) {
      this.vConsole.destroy();
      this.vConsole = null;
    }
  }

  /**
   * 检查 vConsole 是否已加载
   */
  public isVConsoleLoaded(): boolean {
    return this.isLoaded && this.vConsole !== null;
  }
}

// 导出单例实例
export const vConsoleManager = VConsoleManager.getInstance();

// 便捷方法
export const initVConsole = (options?: Parameters<typeof vConsoleManager.init>[0]) => {
  return vConsoleManager.init(options);
};

export const destroyVConsole = () => {
  vConsoleManager.destroy();
};

export const isVConsoleReady = () => {
  return vConsoleManager.isVConsoleLoaded();
};
