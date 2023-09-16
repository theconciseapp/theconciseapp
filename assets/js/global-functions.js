
function hasPermission( requestType) {
  if( !requestType){
    requestType="WRITE_EXTERNAL_STORAGE";
  }
  
requestType="android.permission." + requestType;
return android.system.checkRuntimePermission(requestType);
 
}

function requestPermission(requestType){
 if( !requestType){
    requestType="WRITE_EXTERNAL_STORAGE";
  }
  
requestType="android.permission." + requestType;
 android.system.requestPermissions(requestType);
}

function subTopics( sub_topic, page){
  return "";
}

function toggleView(view,action){
  action=action?"hide":"";
  android.control.execute("toggleView('" + view + "','" + action + "');");
 }
 
function startOwnActivity(name) {
  var act = new android.JavaObject("activity");
  var pack = act.getPackageName();
  var intent = {
  action:"android.intent.action.MAIN",
  component:{
   package:pack,
   className: pack + "." + name
  }};
  android.activity.startActivity(intent);
}

function switchThePage(pageId,r){ 
  localStorage.setItem('uMenuReport',randomString(5));
  if(r) android.activity.loadUrl('drawer_webview',"javascript:selectItem(list[" + pageId + "]);");
 else android.activity.loadUrl('drawer_webview',"javascript:selectItem(list[" + pageId + "],'Dont retain');");
  }

function switchToPage(pageId,dr){
  var rand_=randomString(5);
  localStorage.setItem("drawer_select_item", rand_ + "|" + pageId);
  // if(!dr) android.activity.loadUrl('drawer_webview',"javascript:selectItem(list[" + pageId + "]);");
 //else android.activity.loadUrl('drawer_webview',"javascript:selectItem(list[" + pageId + "],'Dont retain');");
  }


function shareApp(){
  var data='Install True Attendance App now to manage students or class attendance.\nGet a well collated Daily, Monthly, Semester/Term, Session, and Yearly attendance report in PDF, JSON, or Excel format.';
  data+='\nYou can record each student\'s daily class or school activities, track students lateness, attendance percentage and lots more. ';
  data+='Get it free from Amazon Appstore ' + amazonFreeLink;
  data+='\n\nYou can also check other apps from the developer at https://theconciseapps.com.ng';
   
  shareHtml( data);
}

function shareDocument(file,mimeType,callback) {
  android.activity.shareFile(file,mimeType,callback);
 }
 
function shareHtml(html) {
  var intent={
  action:"android.intent.action.SEND",
  type:"text/html",
  extras:{
  "android.intent.extra.TEXT" : html
  }
 };
android.activity.startActivity(intent,true);
}



function randomString(len,charSet) {
    charSet = charSet || 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    var randomString='';
    for (var i=0; i<len;i++) {
        var randomPoz=Math.floor(Math.random()*charSet.length);
        randomString+=charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

function miniProtect( data,tname){

  data= data.replace(/script/gi,"&#83;cript")
  .replace(/android\./g,"&#65;ndroid.")
  .replace(/<[^>]+/g, function(match){
    return match.replace(/ ?on\w+="[^"]*"/gi, '');
})
  if( tname) data=data.replace(/truesrc="([a-z0-9.-]+)"/g,'src="' + TEMPLATES_DIR + '/' + tname + '/images/$1"');
  return data;
}


function substring_( text,start_,end_){
return Array.from(text).slice(start_, end_).join('');
}
  
 

function balance(){
 return 0;  
}


function appId(){
  var file=new android.File(INTERNAL_DIR, 'appid.txt');
  if(file.isFile() ){
 return file.read();
  }
  var rand='ai_' + randomString(10);
      rand=rand.toLowerCase();
    file.write(rand);
    return rand;
 }

 var isDonated=+localStorage.getItem('isDonated'); 
 var enableDonate=false;

   
function autoBackUpNow(n){
  var tomorrow=moment(new Date()).add(3,'days').unix();
  var currentTime=moment().unix();

  var uc=+localStorage.getItem('auto_backup_check')||1;
 if(n) uc=1;
 if (currentTime<uc) return false;
  if(localStorage.getItem('master_backup_working') ) return;
  localStorage.setItem('auto_backup_check',tomorrow);
   backUpNow('auto', currentTime);
}


function sendEmail(emailAddr,subject,text,file) {
   var intent = {
        action: "android.intent.action.SENDTO",
        data: "mailto:"+emailAddr,
        extras: {
          "android.intent.extra.SUBJECT" : subject,
          "android.intent.extra.TEXT" : text
    },
   flags: 0x10000000, // new task
   };
   if(file) {
     var key = "android.intent.extra.STREAM";
     intent.extras[key] = "file://"+file.toString();
     intent.extras_types = {};
     intent.extras_types[key] = "Uri";
   }
   android.activity.startActivityForResult(intent,function(){},true);
}


function openInBrowser(url){ 
  var intent = {
        action: "android.intent.action.VIEW",
        data: url
  }
  android.activity.startActivity(intent,true);     
  }

function whatsApp(text,num){
  if(!text) return "";
 num=num||"123456789";
 text=encodeURIComponent(text);
 return whatsappLink + '?text=' + text;
}
 
function triggerWhatsapp(text){
  var app_id=appId();
  text=text||'*AppId: ' + app_id + ', '  + APP_LABEL__ + '_' + APP_VERSION + '*\nHello!';
  openInBrowser( whatsApp( text));
}

function triggerTelegram(text){
  var app_id=appId();
   text=text||'AppId: ' + app_id + ', ' + APP_LABEL__ + '_' + APP_VERSION + '- Hello!';
  openInBrowser( telegramLink + "?text=" + text);  
}

function otherApps(){
  openInBrowser(BLOG_URL);
}

function isInArray(value, array) {
return array.indexOf(value) > - 1 ;
}

function safeHtml(data){
 data=data.replace(/<script/gi,'&lt;script');
 data=data.replace(/<\/script/gi,'&lt;/script');
  return data;
}

function replacer(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"g");
   return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}


function safeToSave(data,reverse){
 if( !data) return data; 
   data=data.replace(/\[/g,'&#91;');
    data=data.replace(/\]/g,'&#93;');

  if (!reverse) {
 var items={ '<':'&lt;','>':'&gt;','%':'&#37;','[':'&#91;',']':'&#93;',"'":'&#39;',',':'&#44;','=':'&#61;','"':'&#34;'}  
    return replacer(data,items);
   }

  var items={ '&lt;':'<','&gt;':'>','&#37;':'%','&#39;':"'",'&#44;':',','&#61;':'=','&#34;':'"'};
  data=data.replace(/&#91;/g,'[');
  data=data.replace(/&#93;/g,']');
return replacer(data,items);
 
}


function removeNewLines(str){
//remove line breaks from str
 
  str = str.replace(/\s{2,}/g,' ');
  str = str.replace(/\t/g,' ');
  return str.toString().trim().replace(/(\r\n|\n|\r)/g," ");
  
}

function split_(str,delimeter,ret,firstOccur){
  if(!str) return '';
  del=delimeter?delimeter:'/';
 ret=ret?ret:1;
   var re=del + '(.*)';
   var reg=new RegExp(re);
 if(firstOccur){
  if(ret==1)  return str.split(reg)[0];
    else return str.split(reg)[1];
  }
 
 var rest = str.substring(0, str.lastIndexOf(del) );
 var last = str.substring(str.lastIndexOf(del) + 1, str.length);
 if(ret==1) return rest;
 return last;
}

/*
if(!RegExp.escape){
    RegExp.escape = function(s){
      return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    };
}
*/

function eRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}



function triggerMenuItem(webViewId,item) {
  var code = 'document.dispatchEvent(new CustomEvent("optionsMenuItemClicked",{detail:{id:"' + item + '"}}));';
  android.activity.loadUrl("" + webViewId,"javascript:" + code);
  }

 function enableAutoRotate(auto){
  var activity=new android.JavaObject("activity");
  activity.setRequestedOrientation(auto?2:5);
 }


function print( save_as ){
 
 save_as=save_as||'Attendance report ' + moment().format('DD-MM-YYYY h:mma');

  var activity = new android.JavaObject("activity");
  var webView = new android.JavaObject("webView");
  var jobName = save_as;
  var pm = activity.getSystemService("print");
  var pa = webView.createPrintDocumentAdapter(jobName);
  var pab = new android.JavaObject("android.print.PrintAttributes$Builder");
  var pattrs = pab._newInstance([]).build();
  pm.print(jobName,pa,pattrs);
 }

function installApp(uri,callback) {
  var intent = {
        action: "android.intent.action.INSTALL_PACKAGE",
        data: uri,
        type: "application/vnd.android.package-archive",
        flags: 1
  };
  android.activity.startActivityForResult(intent,function(res){
    if(callback) callback();
  },true);
}


function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {    
        n = (n * -1).toFixed(2);
    }
    return n;
}
//window.addEventListener("storage",function(e){var key=e.key; var arr=["text-font-weight","text-color","background-color","text-line-gap"]; if ( arr.includes(key) ) {localStorage.setItem( key,"black");}});
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function capitalise(string){
  if(!string) return "";
 return string.replace(/^./, string[0].toUpperCase()); 
 }

function Cap(str){
  if(!str) return '';
  str = str.toString().toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
});
  return str;
}

function checkLocalStorageUsed(){
   var x, xLen, log=[],total=0;
  for (x in localStorage){
     if(!localStorage.hasOwnProperty(x)){
        continue;
      } 
    xLen =  ((localStorage[x].length * 2 + x.length * 2)/1024); 
     log.push(x.substr(0,30) + " = " +  xLen.toFixed(2) + " KB"); 
    total+= xLen}; 
   if (total > 1024){
      log.unshift("Total = " + (total/1024).toFixed(2)+ " MB");}
  else{log.unshift("Total = " + total.toFixed(2)+ " KB");};
  alert(log.join("\n")); 
  
}

var localStorageSpace = function(){
        var allStrings = '';
        for(var key in window.localStorage){
            if(window.localStorage.hasOwnProperty(key)){
                allStrings += window.localStorage[key];
            }
        }
        return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
    };

// alert( localStorageSpace()){for(var key in window.localStorage){;
function subTopics( sub_topics, page, pro){ var list='<div id="SUB--TOPICS--CONTAINER--' + page + '" class="SUB--TOPICS--CONTAINER">';  $.each( sub_topics, function(key, sub_topic_){  var k=key+1; list+='<div class="container SUB--TOPICS--BTN" id="SUB--TOPIC--' + key + '" data-sub-topic="' + k + '" data-page="' + page + '" data-pro="' + pro + '" onclick="loadPage(event, ' + page+ ');">'; list+='<div class="row">';list+='<div class="col w-60"><img class="TITLE--ICON" src="file:///assets/images/button-icons/forward-grey.png"></div>';list+='<div class="col p-0"><div class="TITLE">' + sub_topic_ + '</div></div>';list+='</div>';list+='</div>';});list+='</div>'; return list; }

(function() {
    // base64 character set, plus padding character (=)
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // Regular expression to check formal correctness of base64 encoded strings
        b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

    window.btoa = window.btoa || function(string) {
        string = String(string);
        var bitmap, a, b, c,
            result = "",
            i = 0,
            rest = string.length % 3; // To determine the final padding

        for (; i < string.length;) {
            if ((a = string.charCodeAt(i++)) > 255 ||
                (b = string.charCodeAt(i++)) > 255 ||
                (c = string.charCodeAt(i++)) > 255)
                throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");

            bitmap = (a << 16) | (b << 8) | c;
            result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
                b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
        }

        // If there's need of padding, replace the last 'A's with equal signs
        return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
    };

    window.atob = window.atob || function(string) {
        // atob can work with strings with whitespaces, even inside the encoded part,
        // but only \t, \n, \f, \r and ' ', which can be stripped.
        string = String(string).replace(/[\t\n\f\r ]+/g, "");
        if (!b64re.test(string))
            throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");

        // Adding the padding if missing, for semplicity
        string += "==".slice(2 - (string.length & 3));
        var bitmap, result = "",
            r1, r2, i = 0;
        for (; i < string.length;) {
            bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 |
                (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));

            result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
                r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
                String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
        }
        return result;
    };
})()

function reloadTopics(){ listTopics(); }
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
    var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) { 
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}




 var companyidRegex=/^[a-zA-Z0-9]{4,30}$/;
 var passwordRegex=/^[a-zA-Z0-9]{4,30}$/;
 var companynameRegex=/^[a-zA-Z0-9&, \'\._-]{2,200}$/;
 var surnameRegex=/^[a-zA-Z]{2,50}$/;
 var othernamesRegex=/^[a-zA-z ]{2,50}$/;
 var genderRegex=/^[femal]{4,6}$/;


 //android.webView.setAllowExternalURLs(true);
