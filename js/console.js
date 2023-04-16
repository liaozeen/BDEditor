const Format = function (time) { // author: meizz
  try{
    return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
  } catch(err){}
}
console.log(`%c船新版本: ${Format(window.hgVersion)}`, "color: #409eff;font-size: 20px")
console.log(`%c版本环境: ${navigator.userAgent=='QDBrowser' ? '测试环境' : '正式环境'}`, "color: #409eff;font-size: 20px")
