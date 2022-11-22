const scriptName = "Fa米家领优惠券";
const getCookieRegex = /^https?:\/\/fmapp\.chinafamilymart\.com\.cn\/api\/app\/market\/member\/(signin\/usersign|sign\/current)/;
const famijiaCookieKey = "famijia_checkin_cookie";
const famijiaRealCookieKey = "famijia_checkin_real_cookie";
const famijiaDeviceIdKey = "famijia_device_id";
const famijiaBlackBoxKey = "famijia_black_box";
let magicJS = MagicJS(scriptName, "INFO");
magicJS.unifiedPushUrl = magicJS.read("famijia_unified_push_url") || magicJS.read("magicjs_unified_push_url");

function GetCouponList(cookie, couponIds) {
  return new Promise((resolve, reject) => {
    let checkinOptions = {
      url: "https://fmapp.chinafamilymart.com.cn/api/app/oms/v2/coupon/service/category/product/list",
      headers: {
        "Accept": "*/*",
        'Origin' : "https://fmapp-activity.chinafamilymart.com.cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "Host": "fmapp.chinafamilymart.com.cn",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "token": cookie,
        "Referer": "https://fmapp-activity.chinafamilymart.com.cn/",
        "Content-Length":"95"
      },
      body: {"couponIds":couponIds,"cityCd":"杭州","couponActivityId":"MjAyMDExMjcwMDE1"},
    };

    magicJS.post(checkinOptions, (err, resp, data) => {
      if (err) {
        magicJS.logError(`获取优惠券列表失败，请求异常：${err}`);
        reject("❌获取优惠券列表失败，请求异常，请查阅日志！");
      } else {
        try {
          magicJS.logDebug(`获取优惠券列表响应结果：${data}`);
          let obj = typeof data === "string" ? JSON.parse(data) : data;
          if (obj.code === "200") {
            resolve([obj.data, ""]);
          } else if (obj.message) {
            resolve([null, obj.message]);
          } else {
            magicJS.logError(`获取优惠券列表失败，响应异常：${data}`);
            reject("❌获取优惠券列表失败，响应异常，请查阅日志！");
          }
        } catch (err) {
          magicJS.logError(`获取优惠券列表失败，执行异常：${err}，接口响应：${data}`);
          reject("❌获取优惠券列表失败，执行异常，请查阅日志！");
        }
      }
    });
  });
}

function GetCoupon(cookie, productCd) {
  return new Promise((resolve, reject) => {
    let checkinOptions = {
      url: "https://fmapp.chinafamilymart.com.cn/api/app/oms/v1/coupon/service/order/submit",
      headers: {
        "Accept": "*/*",
        'Origin' : "https://fmapp-activity.chinafamilymart.com.cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "Host": "fmapp.chinafamilymart.com.cn",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "token": cookie,
        "Referer": "https://fmapp-activity.chinafamilymart.com.cn/"
      },
      body: {"activityNo":"MjAyMDExMjcwMDE1","productCd":productCd,"cityCd":"杭州","channelCd":"APP","anonymousID":"1757eacf63e7c8-03f44e8c5cfa298-734c1351-304704-1757eacf63fba5"},
    };
    magicJS.post(checkinOptions, (err, resp, data) => {
      if (err) {
        magicJS.logError(`获取优惠券失败，请求异常：${err}`);
        reject("❌获取优惠券失败，请求异常，请查阅日志！");
      } else {
        try {
          magicJS.logDebug(`获取优惠券响应结果：${data}`);
          let obj = typeof data === "string" ? JSON.parse(data) : data;
          if (obj.code === "200") {
            resolve([obj.data, ""]);
          } else if (obj.message) {
            resolve([null, obj.message]);
          } else {
            magicJS.logError(`获取优惠券失败，响应异常：${data}`);
            reject("❌获取优惠券失败，响应异常，请查阅日志！");
          }
        } catch (err) {
          magicJS.logError(`获取优惠券失败，执行异常：${err}，接口响应：${data}`);
          reject("❌获取优惠券失败，执行异常，请查阅日志！");
        }
      }
    });
  });
}

(async () => {
  if (magicJS.isRequest && getCookieRegex.test(magicJS.request.url)) {
    let cookie = magicJS.request.headers.token; //token
    let hisCookie = magicJS.read(famijiaCookieKey); //hisToken
    magicJS.write(famijiaDeviceIdKey, magicJS.request.headers.deviceId);
    magicJS.notify("deviceId写入成功!! deviceId:" + magicJS.request.headers.deviceId);
    magicJS.write(famijiaBlackBoxKey, magicJS.request.headers.blackBox);
    magicJS.notify("blackBox写入成功!! blackBox:" + magicJS.request.headers.blackBox);
    if (cookie !== hisCookie) {
      magicJS.write(famijiaCookieKey, cookie);
      magicJS.logInfo(`旧的Token：${hisCookie}\n新的Token：${cookie}\nToken不同，写入新的Token成功！`);
      magicJS.notify("Token写入成功!! token:" + cookie);
    } else {
      magicJS.logInfo("Token没有变化，无需更新");
    }
    let realCookie = magicJS.request.headers.Cookie; //cookie
    let hisRealCookie = magicJS.read(famijiaRealCookieKey); //hisCookie
    if (realCookie !== hisRealCookie) {
      magicJS.write(famijiaRealCookieKey, realCookie);
      magicJS.logInfo(`旧的Cookie：${hisRealCookie}\n新的Cookie：${realCookie}\nCookie不同，写入新的Cookie成功！`);
      magicJS.notify("Cookie写入成功!! realCookie:" + realCookie);
    } else {
      magicJS.logInfo("Cookie没有变化，无需更新! ");
    }
  } else {
    let subTitle = "";
    let content = "";
    let productCd = "";
    let productDes = "";
    let productCdList = [];
    let productDesList = [];
    let couponIds = ["16423","16480","16481","16478","16479"];
    let cookie = magicJS.read(famijiaCookieKey);
    let realCookie = magicJS.read(famijiaRealCookieKey);
    let blackBox = magicJS.read(famijiaBlackBoxKey);
    let deviceId = magicJS.read(famijiaDeviceIdKey);
    if (!!!cookie || !!!deviceId) {
      magicJS.logWarning("没有读取到token|deviceId，请先从App中获取一次!");
      magicJS.notify("❓没有读取到有效token|deviceId，请先从App中获取!!");
    } else { 
      let [checkInErr, [data, message]] = await magicJS.attempt(magicJS.retry(GetCouponList, 1, 2000)(cookie, couponIds), []);
      if (checkInErr) {
        subTitle = checkInErr;
      } else if (data) {
        for(let i=0;i<data.length;i++){
          productCd = data[i].productCd;
          productDes = data[i].name;
          productCdList.push(productCd);
          productDesList.push(productDes);
        }
        magicJS.notify("productCdList:" + productCdList + ",productDesList:" + productDesList);
      }else {
        subTitle = message;
      }
      //let productCdList = ["P166194038929442928","P166211229421873343","P166211242235206247","P166211201263010466","P166211215264762940"];
      //let productDesList = ["尊享满28元立减8元券","满35元立减12元券(自提）","满35元立减10元券(自提）","满50元立减17元券(仅外送）","满50元立减15元券(仅外送）"];
      for(let i=0;i<productCdList.length;i++){
        productCd = productCdList[i];
        let [checkInErr, [data, message]] = await magicJS.attempt(magicJS.retry(GetCoupon, 2, 5000)(cookie, productCd), []);
        if (checkInErr) {
          subTitle = checkInErr;
        }else {
          subTitle = message;
          content = productDesList[i];
        }
        magicJS.notify(scriptName, subTitle, content);// 通知
      }
    }
  }
  magicJS.done();
})();

// prettier-ignore
function MagicJS(scriptName="MagicJS",logLevel="INFO"){return new class{constructor(){if(this.version="2.2.3.3",this.scriptName=scriptName,this.logLevels={DEBUG:5,INFO:4,NOTIFY:3,WARNING:2,ERROR:1,CRITICAL:0,NONE:-1},this.isLoon="undefined"!=typeof $loon,this.isQuanX="undefined"!=typeof $task,this.isJSBox="undefined"!=typeof $drive,this.isNode="undefined"!=typeof module&&!this.isJSBox,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.node={request:void 0,fs:void 0,data:{}},this.iOSUserAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1",this.pcUserAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59",this.logLevel=logLevel,this._barkUrl="",this.isNode){this.node.fs=require("fs"),this.node.request=require("request");try{this.node.fs.accessSync("./magic.json",this.node.fs.constants.R_OK|this.node.fs.constants.W_OK)}catch(err){this.node.fs.writeFileSync("./magic.json","{}",{encoding:"utf8"})}this.node.data=require("./magic.json")}else this.isJSBox&&($file.exists("drive://MagicJS")||$file.mkdir("drive://MagicJS"),$file.exists("drive://MagicJS/magic.json")||$file.write({data:$data({string:"{}"}),path:"drive://MagicJS/magic.json"}))}set barkUrl(url){this._barkUrl=url.replace(/\/+$/g,"")}set logLevel(level){this._logLevel="string"==typeof level?level.toUpperCase():"DEBUG"}get logLevel(){return this._logLevel}get isRequest(){return"undefined"!=typeof $request&&"undefined"==typeof $response}get isResponse(){return"undefined"!=typeof $response}get request(){return"undefined"!=typeof $request?$request:void 0}get response(){return"undefined"!=typeof $response?($response.hasOwnProperty("status")&&($response.statusCode=$response.status),$response.hasOwnProperty("statusCode")&&($response.status=$response.statusCode),$response):void 0}get platform(){return this.isSurge?"Surge":this.isQuanX?"Quantumult X":this.isLoon?"Loon":this.isJSBox?"JSBox":this.isNode?"Node.js":"Unknown"}read(key,session=""){let val="";this.isSurge||this.isLoon?val=$persistentStore.read(key):this.isQuanX?val=$prefs.valueForKey(key):this.isNode?val=this.node.data:this.isJSBox&&(val=$file.read("drive://MagicJS/magic.json").string);try{this.isNode&&(val=val[key]),this.isJSBox&&(val=JSON.parse(val)[key]),session&&("string"==typeof val&&(val=JSON.parse(val)),val=val&&"object"==typeof val?val[session]:null)}catch(err){this.logError(err),val=session?{}:null,this.del(key)}void 0===val&&(val=null);try{val&&"string"==typeof val&&(val=JSON.parse(val))}catch(err){}return this.logDebug(`READ DATA [${key}]${session?`[${session}]`:""}(${typeof val})\n${JSON.stringify(val)}`),val}write(key,val,session=""){let data=session?{}:"";if(session&&(this.isSurge||this.isLoon)?data=$persistentStore.read(key):session&&this.isQuanX?data=$prefs.valueForKey(key):this.isNode?data=this.node.data:this.isJSBox&&(data=JSON.parse($file.read("drive://MagicJS/magic.json").string)),session){try{"string"==typeof data&&(data=JSON.parse(data)),data="object"==typeof data&&data?data:{}}catch(err){this.logError(err),this.del(key),data={}}this.isJSBox||this.isNode?(data[key]&&"object"==typeof data[key]||(data[key]={}),data[key].hasOwnProperty(session)||(data[key][session]=null),void 0===val?delete data[key][session]:data[key][session]=val):void 0===val?delete data[session]:data[session]=val}else this.isNode||this.isJSBox?void 0===val?delete data[key]:data[key]=val:data=void 0===val?null:val;"object"==typeof data&&(data=JSON.stringify(data)),this.isSurge||this.isLoon?$persistentStore.write(data,key):this.isQuanX?$prefs.setValueForKey(data,key):this.isNode?this.node.fs.writeFileSync("./magic.json",data):this.isJSBox&&$file.write({data:$data({string:data}),path:"drive://MagicJS/magic.json"}),this.logDebug(`WRITE DATA [${key}]${session?`[${session}]`:""}(${typeof val})\n${JSON.stringify(val)}`)}del(key,session=""){this.logDebug(`DELETE KEY [${key}]${session?`[${session}]`:""}`),this.write(key,null,session)}notify(title=this.scriptName,subTitle="",body="",opts=""){let convertOptions;if(opts=(_opts=>{let newOpts={};return"string"==typeof _opts?this.isLoon?newOpts={openUrl:_opts}:this.isQuanX&&(newOpts={"open-url":_opts}):"object"==typeof _opts&&(this.isLoon?(newOpts.openUrl=_opts["open-url"]?_opts["open-url"]:"",newOpts.mediaUrl=_opts["media-url"]?_opts["media-url"]:""):this.isQuanX&&(newOpts=_opts["open-url"]||_opts["media-url"]?_opts:{})),newOpts})(opts),1==arguments.length&&(title=this.scriptName,subTitle="",body=arguments[0]),this.logNotify(`title:${title}\nsubTitle:${subTitle}\nbody:${body}\noptions:${"object"==typeof opts?JSON.stringify(opts):opts}`),this.isSurge)$notification.post(title,subTitle,body);else if(this.isLoon)opts?$notification.post(title,subTitle,body,opts):$notification.post(title,subTitle,body);else if(this.isQuanX)$notify(title,subTitle,body,opts);else if(this.isNode){if(this._barkUrl){let content=encodeURI(`${title}/${subTitle}\n${body}`);this.get(`${this._barkUrl}/${content}`,()=>{})}}else if(this.isJSBox){let push={title:title,body:subTitle?`${subTitle}\n${body}`:body};$push.schedule(push)}}notifyDebug(title=this.scriptName,subTitle="",body="",opts=""){"DEBUG"===this.logLevel&&(1==arguments.length&&(title=this.scriptName,subTitle="",body=arguments[0]),this.notify(title=title,subTitle=subTitle,body=body,opts=opts))}log(msg,level="INFO"){this.logLevels[this._logLevel]<this.logLevels[level.toUpperCase()]||console.log(`[${level}] [${this.scriptName}]\n${msg}\n`)}logDebug(msg){this.log(msg,"DEBUG")}logInfo(msg){this.log(msg,"INFO")}logNotify(msg){this.log(msg,"NOTIFY")}logWarning(msg){this.log(msg,"WARNING")}logError(msg){this.log(msg,"ERROR")}logRetry(msg){this.log(msg,"RETRY")}adapterHttpOptions(options,method){let _options="object"==typeof options?Object.assign({},options):{url:options,headers:{}};_options.hasOwnProperty("header")&&!_options.hasOwnProperty("headers")&&(_options.headers=_options.header,delete _options.header);const headersMap={accept:"Accept","accept-ch":"Accept-CH","accept-charset":"Accept-Charset","accept-features":"Accept-Features","accept-encoding":"Accept-Encoding","accept-language":"Accept-Language","accept-ranges":"Accept-Ranges","access-control-allow-credentials":"Access-Control-Allow-Credentials","access-control-allow-origin":"Access-Control-Allow-Origin","access-control-allow-methods":"Access-Control-Allow-Methods","access-control-allow-headers":"Access-Control-Allow-Headers","access-control-max-age":"Access-Control-Max-Age","access-control-expose-headers":"Access-Control-Expose-Headers","access-control-request-method":"Access-Control-Request-Method","access-control-request-headers":"Access-Control-Request-Headers",age:"Age",allow:"Allow",alternates:"Alternates",authorization:"Authorization","cache-control":"Cache-Control",connection:"Connection","content-encoding":"Content-Encoding","content-language":"Content-Language","content-length":"Content-Length","content-location":"Content-Location","content-md5":"Content-MD5","content-range":"Content-Range","content-security-policy":"Content-Security-Policy","content-type":"Content-Type",cookie:"Cookie",dnt:"DNT",date:"Date",etag:"ETag",expect:"Expect",expires:"Expires",from:"From",host:"Host","if-match":"If-Match","if-modified-since":"If-Modified-Since","if-none-match":"If-None-Match","if-range":"If-Range","if-unmodified-since":"If-Unmodified-Since","last-event-id":"Last-Event-ID","last-modified":"Last-Modified",link:"Link",location:"Location","max-forwards":"Max-Forwards",negotiate:"Negotiate",origin:"Origin",pragma:"Pragma","proxy-authenticate":"Proxy-Authenticate","proxy-authorization":"Proxy-Authorization",range:"Range",referer:"Referer","retry-after":"Retry-After","sec-websocket-extensions":"Sec-Websocket-Extensions","sec-websocket-key":"Sec-Websocket-Key","sec-websocket-origin":"Sec-Websocket-Origin","sec-websocket-protocol":"Sec-Websocket-Protocol","sec-websocket-version":"Sec-Websocket-Version",server:"Server","set-cookie":"Set-Cookie","set-cookie2":"Set-Cookie2","strict-transport-security":"Strict-Transport-Security",tcn:"TCN",te:"TE",trailer:"Trailer","transfer-encoding":"Transfer-Encoding",upgrade:"Upgrade","user-agent":"User-Agent","variant-vary":"Variant-Vary",vary:"Vary",via:"Via",warning:"Warning","www-authenticate":"WWW-Authenticate","x-content-duration":"X-Content-Duration","x-content-security-policy":"X-Content-Security-Policy","x-dnsprefetch-control":"X-DNSPrefetch-Control","x-frame-options":"X-Frame-Options","x-requested-with":"X-Requested-With","x-surge-skip-scripting":"X-Surge-Skip-Scripting"};if("object"==typeof _options.headers)for(let key in _options.headers)headersMap[key]&&(_options.headers[headersMap[key]]=_options.headers[key],delete _options.headers[key]);_options.headers&&"object"==typeof _options.headers&&_options.headers["User-Agent"]||(_options.headers&&"object"==typeof _options.headers||(_options.headers={}),this.isNode?_options.headers["User-Agent"]=this.pcUserAgent:_options.headers["User-Agent"]=this.iOSUserAgent);let skipScripting=!1;if(("object"==typeof _options.opts&&(!0===_options.opts.hints||!0===_options.opts["Skip-Scripting"])||"object"==typeof _options.headers&&!0===_options.headers["X-Surge-Skip-Scripting"])&&(skipScripting=!0),skipScripting||(this.isSurge?_options.headers["X-Surge-Skip-Scripting"]=!1:this.isLoon?_options.headers["X-Requested-With"]="XMLHttpRequest":this.isQuanX&&("object"!=typeof _options.opts&&(_options.opts={}),_options.opts.hints=!1)),this.isSurge&&!skipScripting||delete _options.headers["X-Surge-Skip-Scripting"],!this.isQuanX&&_options.hasOwnProperty("opts")&&delete _options.opts,this.isQuanX&&_options.hasOwnProperty("opts")&&delete _options.opts["Skip-Scripting"],"GET"===method&&!this.isNode&&_options.body){let qs=Object.keys(_options.body).map(key=>void 0===_options.body?"":`${encodeURIComponent(key)}=${encodeURIComponent(_options.body[key])}`).join("&");_options.url.indexOf("?")<0&&(_options.url+="?"),_options.url.lastIndexOf("&")+1!=_options.url.length&&_options.url.lastIndexOf("?")+1!=_options.url.length&&(_options.url+="&"),_options.url+=qs,delete _options.body}return this.isQuanX?(_options.hasOwnProperty("body")&&"string"!=typeof _options.body&&(_options.body=JSON.stringify(_options.body)),_options.method=method):this.isNode?(delete _options.headers["Accept-Encoding"],"object"==typeof _options.body&&("GET"===method?(_options.qs=_options.body,delete _options.body):"POST"===method&&(_options.json=!0,_options.body=_options.body))):this.isJSBox&&(_options.header=_options.headers,delete _options.headers),_options}adapterHttpResponse(resp){let _resp={body:resp.body,headers:resp.headers,json:()=>JSON.parse(_resp.body)};return resp.hasOwnProperty("statusCode")&&resp.statusCode&&(_resp.status=resp.statusCode),_resp}get(options,callback){let _options=this.adapterHttpOptions(options,"GET");this.logDebug(`HTTP GET: ${JSON.stringify(_options)}`),this.isSurge||this.isLoon?$httpClient.get(_options,callback):this.isQuanX?$task.fetch(_options).then(resp=>{resp.status=resp.statusCode,callback(null,resp,resp.body)},reason=>callback(reason.error,null,null)):this.isNode?this.node.request.get(_options,(err,resp,data)=>{resp=this.adapterHttpResponse(resp),callback(err,resp,data)}):this.isJSBox&&(_options.handler=resp=>{let err=resp.error?JSON.stringify(resp.error):void 0,data="object"==typeof resp.data?JSON.stringify(resp.data):resp.data;callback(err,resp.response,data)},$http.get(_options))}getPromise(options){return new Promise((resolve,reject)=>{magicJS.get(options,(err,resp)=>{err?reject(err):resolve(resp)})})}post(options,callback){let _options=this.adapterHttpOptions(options,"POST");if(this.logDebug(`HTTP POST: ${JSON.stringify(_options)}`),this.isSurge||this.isLoon)$httpClient.post(_options,callback);else if(this.isQuanX)$task.fetch(_options).then(resp=>{resp.status=resp.statusCode,callback(null,resp,resp.body)},reason=>{callback(reason.error,null,null)});else if(this.isNode){let resp=this.node.request.post(_options,callback);resp.status=resp.statusCode,delete resp.statusCode}else this.isJSBox&&(_options.handler=resp=>{let err=resp.error?JSON.stringify(resp.error):void 0,data="object"==typeof resp.data?JSON.stringify(resp.data):resp.data;callback(err,resp.response,data)},$http.post(_options))}get http(){return{get:this.getPromise,post:this.post}}done(value={}){"undefined"!=typeof $done&&$done(value)}isToday(day){if(null==day)return!1;{let today=new Date;return"string"==typeof day&&(day=new Date(day)),today.getFullYear()==day.getFullYear()&&today.getMonth()==day.getMonth()&&today.getDay()==day.getDay()}}isNumber(val){return"NaN"!==parseFloat(val).toString()}attempt(promise,defaultValue=null){return promise.then(args=>[null,args]).catch(ex=>(this.logError(ex),[ex,defaultValue]))}retry(fn,retries=5,interval=0,callback=null){return(...args)=>new Promise((resolve,reject)=>{function _retry(...args){Promise.resolve().then(()=>fn.apply(this,args)).then(result=>{"function"==typeof callback?Promise.resolve().then(()=>callback(result)).then(()=>{resolve(result)}).catch(ex=>{retries>=1?interval>0?setTimeout(()=>_retry.apply(this,args),interval):_retry.apply(this,args):reject(ex),retries--}):resolve(result)}).catch(ex=>{this.logRetry(ex),retries>=1&&interval>0?setTimeout(()=>_retry.apply(this,args),interval):retries>=1?_retry.apply(this,args):reject(ex),retries--})}_retry.apply(this,args)})}formatTime(time,fmt="yyyy-MM-dd hh:mm:ss"){var o={"M+":time.getMonth()+1,"d+":time.getDate(),"h+":time.getHours(),"m+":time.getMinutes(),"s+":time.getSeconds(),"q+":Math.floor((time.getMonth()+3)/3),S:time.getMilliseconds()};/(y+)/.test(fmt)&&(fmt=fmt.replace(RegExp.$1,(time.getFullYear()+"").substr(4-RegExp.$1.length)));for(let k in o)new RegExp("("+k+")").test(fmt)&&(fmt=fmt.replace(RegExp.$1,1==RegExp.$1.length?o[k]:("00"+o[k]).substr((""+o[k]).length)));return fmt}now(){return this.formatTime(new Date,"yyyy-MM-dd hh:mm:ss")}today(){return this.formatTime(new Date,"yyyy-MM-dd")}sleep(time){return new Promise(resolve=>setTimeout(resolve,time))}}(scriptName)}
