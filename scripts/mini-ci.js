const ci = require('miniprogram-ci');
const fs = require('fs');
const path = require('path');

const appid = 'wx8cdf925321d45960';
const privateKey = 'private.key';
const version = '1.0.0';
const desc = '自动上传';

// 检查私钥文件是否存在
function checkPrivateKey() {
  const privateKeyPath = path.resolve(privateKey);
  if (!fs.existsSync(privateKeyPath)) {
    console.error('❌ 私钥文件不存在:', privateKeyPath);
    process.exit(1);
  }
  console.log('✅ 私钥文件检查通过:', privateKeyPath);
}

(async () => {
  try {
    // 检查私钥文件
    checkPrivateKey();
    
    console.log('🚀 开始上传小程序...');
    console.log('📱 AppID:', appid);
    console.log('📦 版本:', version);
    console.log('📝 描述:', desc);
    
    const project = new ci.Project({
      appid: appid,
      type: 'miniProgram',
      projectPath: 'dist',
      privateKeyPath: privateKey,
      ignores: ['node_modules/**/*'],
    });
    
    const uploadResult = await ci.upload({
      project,
      version: version,
      desc: desc,
      setting: {
        es6: true,
      },
    });
    
    console.log('✅ 上传成功!');
    console.log('📊 上传结果:', uploadResult);
  } catch (e) {
    console.error('❌ 上传失败:', e.message);
    if (e.code) {
      console.error('错误代码:', e.code);
    }
    process.exitCode = 1;
    throw e;
  }
})();
