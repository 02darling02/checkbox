 let st = ""
 let authkey = ""
 let headers = {
     "access_token": "",
     "acPlatform": "ANDROID_PHONE",
     "deviceType": 1,
     "Content-Type": "application/x-www-form-urlencoded",
     "User-Agent": "acvideo core/6.11.1.822",
     "cookie": ""
 }
 const $http = require("axios")
 function get(options) {
     return new Promise((resolve, reject) => {
         $http
             .post("https://api-new.acfunchina.com/rest/app" + options.url, options.para, {
                 headers
             })
             .then(response => {
                 //  console.log(response)
                 resolve(response.data);
             })
             .catch(err => {
                 //console.log(err.response)
                 resolve(err.response.data);
             });
     });
 }



 var signIn = async function() {
     return await get({
         url: `/user/signIn`,
         para: {}
     }).then(res => {
         //console.log(res)
         if (res.result == 0) {
             console.log("签到成功")
         } else if (res.result == 122) {
             console.log("今天已经签到过啦(/ω＼)害羞")
         }
         return res;
     });
 };
 var ThrowBanana = async function(id) {
     return await get({
         url: "/banana/throwBanana",
         para: `resourceId=${id}&count=1&resourceType=2`
     }).then(async (res) => {
         //console.log(res)
         console.log(id)
         if (res.result == 0) {
             console.log("🍌易已达成(/ω＼)害羞")
         } else if (res.error_msg == "内容未找到" || res.error_msg == "被投蕉用户id不能小于0") {
             await ThrowBanana(Math.round(Math.random() * 10000) + 14431808)

         } else {
             console.log(res)
         }
         return res;
     });
 };
 var NewDanmu = async function() {
     return await get({
         url: `/new-danmaku/add`,
         para: "mode=1&color=16777215&size=25&body=%E5%A5%BD%E8%80%B6&videoId=21772556&position=0&type=douga&id=26084622&subChannelId=60&subChannelName=%E5%A8%B1%E4%B9%90&roleId="
     }).then(res => {
         //console.log(res)
         if (res.result == 0) {
             console.log("发送弹幕成功(/ω＼)害羞")
         } else {
             console.log(res)
         }
         return res;
     });
 };


 function getoken() {
     return new Promise(async resolve => {
         try {
             let res = await $http.post("https://id.app.acfun.cn/rest/web/token/get", "sid=acfun.midground.api", {
                 headers
             })
             if (res.data.result == 0 && res.data["acfun.midground.api_st"]) {
                 st = res.data["acfun.midground.api_st"]
                 console.log("获取token成功：%s", st)
                 await interact("delete")
                 await interact("add")
             } else {
                 console.log("获取token失败")
                 console.log(res.data)
             }
         } catch (err) {
             console.log(err.response.data)
             console.log("token获取出错")
         }
         resolve()
     })
 }

 function interact(option) {
     return new Promise(async resolve => {
         try {
             let data = `kpn=ACFUN_APP&kpf=PC_WEB&subBiz=mainApp&interactType=1&objectType=2&objectId=26030726&acfun.midground.api_st=${st}&userId=${authkey}&extParams%5BisPlaying%5D=false&extParams%5BshowCount%5D=1&extParams%5BotherBtnClickedCount%5D=10&extParams%5BplayBtnClickedCount%5D=0`
             let res = await $http.post(`https://kuaishouzt.com/rest/zt/interact/${option}`, data, {
                 headers
             })
             if (res.data.result == 1) {
                 console.log("点赞成功")
             } else {
                 console.log(res.data)
             }
         } catch (err) {
             console.log(err.response.data)
             console.log("点赞接口请求出错")
         }
         resolve()
     })
 }

 function acfun(account,password) {
     return new Promise(async resolve => {
         try {
              const account = require("../config.json").acfun.phone
              const password = require("../config.json").acfun.password
             let res = await $http.post("https://id.app.acfun.cn/rest/app/login/signin", `username=${account}&password=${password}`, {
                 headers
             })
             if (res.data.result == 0 && res.data.acPassToken) {
                 console.log("%s 登陆成功", res.data.username)
                 authkey = res.data.auth_key                 
                 headers["access_token"] = res.data.token
                 headers["cookie"] = `auth_key=${res.data.auth_key};acPasstoken=${res.data.acPassToken};`
                 await signIn()
                 await ThrowBanana(Math.round(Math.random() * 10000) + 14431808)
                 await NewDanmu()
                 await getoken()
             } else {
                 console.log("登陆失败 %s", res.data.error_msg)
             }
         } catch (err) {
             console.log(err.response.data)
             console.log("登陆失败")
         }
         resolve()
     })
 }

//acfun()

module.exports=acfun