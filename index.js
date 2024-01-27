function _defineProperty(e,t,i){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function _toPropertyKey(e){var t=_toPrimitive(e,"string");return"symbol"==typeof t?t:String(t)}function _toPrimitive(e,t){if("object"!=typeof e||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var r=i.call(e,t||"default");if("object"!=typeof r)return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}import Axios from"axios";import AIODate from"aio-date";import AIOStorage from"aio-storage";import AIOPopup from"aio-popup";import"./index.css";import $ from"jquery";export let helper={showAlert(e={}){new AIOPopup().addAlert(e)},getDateAndTime(e){try{let t=AIODate().toJalali({date:e}),i=AIODate().getTime({date:e}),[r,n,o,s,a]=t,l=`${r}/${n}/${o}`,c=`${s}:${a}`,d=AIODate().getDelta({date:e}),h="passed"===d.type?{day:0,hour:0,minute:0,second:0}:d,p="remaining"===d.type?{day:0,hour:0,minute:0,second:0}:d;return{date:l,time:c,dateAndTime:`${l} ${c}`,remainingTime:h,passedTime:p,miliseconds:i}}catch{return{date:"",time:"",dateAndTime:"",remainingTime:0,passedTime:0,miliseconds:0}}},arabicToFarsi(e){try{return e.replace(/ك/g,"ک").replace(/ي/g,"ی")}catch{return e}}};export default class AIOservice{constructor(e){_defineProperty(this,"handleCacheVersions",e=>{let t={};for(let i in e)t[i]=0;let r=this.getCache("storedCacheVersions",t),n={};for(let o in e)void 0!==r[o]&&(r[o]!==e[o]?(n[o]=!0,this.removeCache(o)):n[o]=!1);return this.setCache("storedCacheVersions",e),n}),_defineProperty(this,"removeCache",e=>this.storage.remove({name:e})),_defineProperty(this,"setCache",(e,t)=>this.storage.save({name:e,value:t})),_defineProperty(this,"getCache",(e,t)=>e?this.storage.load({name:e,def:t}):this.storage.getModel()),_defineProperty(this,"setProperty",(e,t)=>{-1!==["getState","loader","baseUrl"].indexOf(e)&&(this[e]=t)}),_defineProperty(this,"getLoading",e=>(console.log(`aio-service show loading by ${e}`),`
      <div class="aio-service-loading" id="${e}">
        <div class="aio-service-loading-0">
          <div class="aio-service-loading-1">
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.0s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.1s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.2s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.3s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.4s infinite normal none running aioserviceloading;"></div>
          </div>
        </div>
      </div>
    `)),_defineProperty(this,"handleLoading",(e,t)=>{let{loading:i=!0,loadingParent:r="body",api:n}=e;if(i){if(t)$(r).append("function"==typeof this.loader?this.loader():this.getLoading(n));else{let o=$("#"+n);o.length||(o=$(".aio-service-loading")),o.remove()}}}),_defineProperty(this,"getFromCache",e=>{let{cache:t}=e;if(t)return this.storage.load({name:t.name,time:t.time})}),_defineProperty(this,"handleError",(e,t)=>{let i=this.id;if("request"===e){let r=["token","api","def","description","message","cache","onError","onSuccess","onCatch","getError","apiFunction","parameter","loading","loadingParent"];for(let n in t)if(-1===r.indexOf(n)){let o=`aio-service with id:${i} error => ${n} is not a valid property for request object. valid proprties for request object is ${r.join(" | ")}`;return helper.showAlert({type:"error",text:o}),o}let s;if(t.api?t.cache&&("object"!=typeof t.cache||"string"!=typeof t.cache.name||"number"!=typeof t.cache.time)&&(s=`
          aio-service with id:${i} error => cache property request parameter object should be an object contain name:string and time:number.
          api is ${t.api}
        `):s=`aio-service with id:${i} in apiFunction with name (${t.api}) error => missing api property in call request. request object is ${t}`,s)return helper.showAlert({type:"error",text:s}),s}if("apiFunction"===e){let a=`aio-service with id:${i} error => cannot find apiFunction ${t.api}. apiFunction should define in getApiFunctions result  or request object`;return helper.showAlert({type:"error",text:a}),a}if("apiFunctionReturn"===e){let{res:l,service:c}=t;if(Array.isArray(l)||"object"!=typeof l||void 0===l.response&&void 0===l.result){let d=`
          aio-service with id:${i} error => apiFunction (by name '${c.api}') should return an object contain response and result.
          apiFunction name is ${c.api}
        `;return helper.showAlert({type:"error",text:d}),d}for(let h in l)if(-1===["response","result"].indexOf(h)){let p=`
            aio-service with id:${i} error => apiFunction returned an object contain invalid property. 
            invalid property is : ${h}
            apiFunction name is ${c.api}
          `;return helper.showAlert({type:"error",text:p}),p}}}),_defineProperty(this,"getResult",async e=>{let{api:t,parameter:i,onCatch:r=this.onCatch,getError:n=this.getError}=e;try{let o=this.getApisFunction(e);if(!o)return this.handleError("apiFunction",e);let s=await o(i,this.getState()),a=this.handleError("apiFunctionReturn",{res:s,service:e});if(a)return a;let{response:l,result:c}=s;if(l){let d=n(l,e);if("string"==typeof d)return d}return c}catch(h){let p;try{p=r(h,e)}catch(u){p=u.message||u.Message}return void 0===p&&(p=h.message||h.Message),console.log(h),p}}),_defineProperty(this,"fetchData",async e=>{let t=this.getFromCache(e);if(void 0!==t)return t;this.handleLoading(e,!0),this.setToken(e.token);let i;try{i=await this.getResult(e)}catch(r){i=r.message}return this.handleLoading(e,!1),i}),_defineProperty(this,"validate",(e,t)=>{let{api:i,description:r,message:n={}}=t;if(r=("function"==typeof r?r():r)||i,"string"==typeof e){if(!1!==n.error){let o=n.error;void 0===o&&(o=`${r} با خطا روبرو شد`),helper.showAlert({type:"error",text:o,subtext:e})}}else if(n.success){let s="function"==typeof n.success?n.success(e):n.success;!0===s&&(s=""),helper.showAlert({type:"success",text:`${r} با موفقیت انجام شد`,subtext:s,time:n.time})}return e}),_defineProperty(this,"request",async e=>{let{onSuccess:t,cache:i,onError:r,def:n}=e;if(this.handleError("request",e))return;let o=await this.fetchData(e);return"string"==typeof(o=this.validate(o,e))?(r&&r(o),n):(void 0===o&&(o=n),i&&this.storage.save({name:i.name,value:o}),t&&t(o),o)}),AIOServiceValidate(e),this.Axios=Axios,this.helper=helper;let{id:t,loader:i,baseUrl:r,token:n,getState:o=()=>({}),getApiFunctions:s=()=>({}),onCatch:a=()=>{},getError:l=()=>{}}=e;this.id=t,this.baseUrl=r,this.storage=AIOStorage("-AIOService-"+this.id),this.loader=i,this.getState=o,this.token=n,this.onCatch=a,this.getError=l,this.setToken=e=>{let t=e||this.token;t&&(this.token=t,Axios.defaults.headers.common.Authorization=`Bearer ${t}`)};let c={helper,storage:this.storage,baseUrl:this.baseUrl,id:this.id,Axios:this.Axios,setToken:this.setToken.bind(this)};this.apiFunctions=s(c)}getApisFunction(service){if(service.apiFunction)return service.apiFunction;let res;return eval(`res = this.apiFunctions.${service.api}`),res}};function AIOServiceValidate({id:e,loader:t,getApiFunctions:i,cacheVersions:r}){let n;"string"!=typeof e?n=`
      aio-service with id:${e} error => id props should be an string
    `:"function"!=typeof i?n=`
      aio-service with id:${e} error => missing getApiFunctions props. getAPiFunctions is a function that returns an object contain apiFunctions.
    `:t&&"function"!=typeof t&&(n=`
      aio-service with id:${e} error => loader props should be a function
    `),n&&(alert(n),console.log(n))}function ValidateApi(e,t,i){return({varTypes:{object:!0,array:!0,string:!0,number:!0,boolean:!0,undefined:!0,any:!0,function:!0,null:!0},checkTypes(e,t){if("any"===t)return;t=t.split("|");let i,r=!1;for(let n=0;n<t.length;n++){let o=t[n],s=this.checkType(e,o,t);s?i=s:r=!0}if(!r)return i},checkType(e,t,i){let r=!1,n=this.getType(e);if(this.varTypes[t])n===t&&(r=!0);else{let o;try{o=JSON.parse(t)}catch{o=t}e===o&&(r=!0)}if(!1===r){let s;try{s=JSON.stringify(e)}catch{s=e}return`should be ${i.join("|")} but is ${s}`}},getType:e=>Array.isArray(e)?"array":null===e?"undefined":typeof e,validate(){if(e&&t)for(let r in t){if(!e[r])return`${i} error, ${r} is invalid props`;let n=this.checkTypes(t[r],e[r]);if(n)return`${i}, ${r} props ${n}`}}}).validate()}