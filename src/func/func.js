import axios from "axios";
import geolib from "geolib";
import {
  Alert
} from 'react-native';
export var publishableKey = 'pk_live_hfQNhSL01CKCB6z1OsRckTgh';//'pk_test_lJDUOPwIUlVgELqqLMJN96zd';//stripe
// export var client_id = "2";
// export var client_secret = "Ovi7qgwxKAiNk02I1xcG88JHNH9MnnWl1d8tFK6E";
// export var image_url = "http://localhost:8000";
// var api_url = "http://localhost:8000/";
export var client_id = "5";
export var client_secret = "6dBU9yEd7r4PnWPBFZuIgIYE3IpYugd1bV3Dxktc";
export var image_url = "http://www.qookadelivery.com.au";
var api_url = "http://www.qookadelivery.com.au/";

export var screen_width_offset = 200;


export var callApi = (method, action, params, access_token = "") => {
  //console.log("Called " + action);
  let key = {
    method: method,
    url: api_url + action,
    //url: "http://wangcai.com.au/" + action,
    //url: 'http://facebook.github.io/react-native/movies.json',
    headers: {
      Authorization: "Bearer " + access_token
    }
  };
  key[method === "get" ? "params" : "data"] = params;
  return axios(key);
};

// export function debounce(callback, wait, context = this) {
//   let timeout = null;
//   let callbackArgs = null;

//   const later = () => callback.apply(context, callbackArgs);

//   return function() {
//     callbackArgs = arguments;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }
export function debounce(func, wait=500, immediate=true) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export var errAlert = (err,msg="") => {
  let message = "";
  try{
    message = err.response.data.message;
  } catch (error) {
    message = err.message;
  }
  setTimeout(() => {
    Alert.alert(msg+message);
  }, 100);
}

export var cartLength = function (carts) {
  let no_carts = 0;
  for(let i=0; i<carts.length;i++){
    if(carts[i].total_price>0)
      no_carts++;
  }
  return no_carts;
}

export var timeBetween = function (start,end,start2,end2) {
  // if(start2)
  //   console.warn(start,end,start2,end2);
  // else
  //   console.warn(start,end);
  var offset = 10;
  var d = new Date();
  //console.warn("a:"+("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2));
  d.setTime(d.getTime() + (d.getTimezoneOffset())*60*1000 + offset*60*60*1000);
  //console.warn("b:"+("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2));
  var current = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
  var result = (end>start)?(current>=start&&current<=end):(current>=start||current<=end);
  if(start2)
    result = result||((end2>start2)?(current>=start2&&current<=end2):(current>=start2||current<=end2));
  return result;
}

// export var sortShops = async function (items,current_position) {
//   let result = items.map((v,i)=> {
//       return Object.assign({},v);
//   });
//   for(var i=0;i<result.length;i++){
//     let v = result[i];
//     result[i]['distance'] = await driveDistance({latitude:v.latitude,longitude:v.longitude},current_position);
//     result[i]['invalidTime'] = timeBetween(v.open_time,v.close_time)?0:1;
//   }
//   return result.sort((a, b) => {
//       if(a.invalidTime != b.invalidTime)
//         return (a.invalidTime > b.invalidTime)?1:-1;
//       else if(a.popularity != b.popularity)
//         return (a.popularity < b.popularity)?1:-1;
//       else
//         return (a.distance > b.distance)?1:-1;
//     });
//  }

export var driveDistance = async function (p1, p2) {
  if(!p1||!p2)
    return -1;
  let res = await axios({
      method: "get",
      url: "https://maps.googleapis.com/maps/api/distancematrix/json",
      params: {
        origins:p1.latitude+','+p1.longitude,
        destinations:p2.latitude+','+p2.longitude,
        mode: "driving",
        key:"AIzaSyAQBzo-wrK4aSkvLXQVifq2PxmMtiej9J0"
      }
    });
    if(res.data.rows[0].elements[0].status=="ZERO_RESULTS")
      return -1;
    else
      return (res.data.rows[0].elements[0].distance.value/1000).toFixed(1);
  //return geolib.convertUnit('km',geolib.getDistanceSimple(p1,p2),1);
}

export var straightDistance = function (p1, p2) {
  if(!p1||!p2)
    return -1;
  return geolib.convertUnit('km',geolib.getDistanceSimple(p1,p2),1);
}

export var showDistance = function (dst) {
  if(dst === -1)
    return " -- ";
  if (dst > 1000)
    return (dst/1000).toFixed(1)+'k ';
  return dst;
}
export var price = function (price) {
  return price.toFixed(2);
}
export var status = function (status) {
  return status;
  switch (status){
    case 'pending':
      return "等待中";
    case 'paid':
      return "已付款";
    case 'completed':
      return "已完成";
    case 'cancelled':
      return "已取消";
  }
}
export var payment_type = function (payment_type) {
  return payment_type;
  switch (payment_type){
    case 'online':
      return "在线支付";
    case 'cash':
      return "货到付款";
  }
}
export var array_intersection = function (a, b) {
  // 交集
  var result = [];
  for (var i = 0; i < b.length; i++) {
    var temp = b[i];
    for (var j = 0; j < a.length; j++) {
      if (temp === a[j]) {
        result.push(temp);
        break;
      }
    }
  }
  return result;
};

export var myIncludes = function (array, val) {
  for (let i = 0; i < array.length; i++) {
    let tmp = array[i];
    if (val.id == tmp.id) return true;
  }
  return false;
};