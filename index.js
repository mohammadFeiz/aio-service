import Axios from "axios";
import AIODate from "aio-date";
import $ from "jquery";
export default function services({getState,apis}) {
  function getDateAndTime(value){
    let dateCalculator = AIODate();
    let adate,atime;
    try {
      if (value.indexOf("T") !== -1) {atime = value.split("T")[1].split(".")[0];} 
      else {atime = value.split(" ")[1];}
    } 
    catch {atime = undefined;}
    try {adate = dateCalculator.gregorianToJalali(value).join("/");
    } 
    catch {adate = "";}
    return {date:adate,time:atime}
  }
  function arabicToFarsi(value){
    try{return value.replace(/ك/g, "ک").replace(/ي/g, "ی");}
    catch{return value}
  }
  return Service(apis({Axios,getState,getDateAndTime,arabicToFarsi}))
}



function Service(services) {
  function getFromCache(key, minutes) {
    if (minutes === true) { minutes = Infinity }
    let storage = localStorage.getItem(key);
    if (storage === undefined || storage === null) { return false }
    let { time, data } = JSON.parse(storage);
    if ((new Date().getTime() / 60000) - (time / 60000) > minutes) { return false }
    return data;
  }
  function setToCache(key, data) {
    let time = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ time, data }))
  }
  return async ({ type, parameter, loading = true, cache, cacheName }) => {
    if (loading) {$(".loading").css("display", "flex"); }
    if (cache) {
      let a = getFromCache(cacheName ? 'storage-' + cacheName : 'storage-' + type, cache);
      if (a !== false) {
        $(".loading").css("display", "none");
        return a
      }
      if (!services[type]) {debugger;}
      let result = await services[type](parameter);
      $(".loading").css("display", "none");
      setToCache(cacheName ? 'storage-' + cacheName : 'storage-' + type, result);
      return result;
    }
    if (!services[type]) {alert('services.' + type + ' is not define')}
    let result = await services[type](parameter);
    $(".loading").css("display", "none");
    return result;
  }
}

