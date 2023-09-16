var lastTop;

var rights="android.permission.WRITE_EXTERNAL_STORAGE";
var recordPermission="android.permission.RECORD_AUDIO";
var cameraPermission="android.permission.CAMERA";
var rstoragePermission="android.permission.READ_EXTERNAL_STORAGE";


function hasPermission(r) {
 r=r?r:rights;
 return android.system.checkRuntimePermission(r);
 }

function requestPermission(r){
  r=r?r:rights;
  //r=r.split(",");
 android.system.requestPermissions(r);
}

function loginRequired(){
  return localStorage.getItem('login_required');
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

function randomString(len,charSet) {
    charSet = charSet || 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    var randomString='';
    for (var i=0; i<len;i++) {
        var randomPoz=Math.floor(Math.random()*charSet.length);
        randomString+=charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

function randomNumber(len,charSet) {
    charSet = charSet || '023456789';
    var randomString='';
    for (var i=0; i<len;i++) {
        var randomPoz=Math.floor(Math.random()*charSet.length);
        randomString+=charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

function randomNumbers(len,charSet) {
    charSet = charSet || '023456789';
    var randomString='';
    for (var i=0; i<len;i++) {
        var randomPoz=Math.floor(Math.random()*charSet.length);
        randomString+=charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

var imgcache= function(set_){
  var ic=localStorage.getItem("image-cache");
 if(!ic||set_){
   ic=randomString(6);
    localStorage.setItem("image-cache", ic);
   return ic;
 }
  return ic;
}


function parseJson( string_){
  try{
    return JSON.parse( string_);
  } catch(e){
   return {};
  }
}

function substring_( text,start_,end_){
return Array.from(text).slice(start_, end_).join('');
}

function logcat(loc, t){
  var lfile=new android.File( PUBLIC_FOLDER,'logcat.txt');
  lfile.append( moment().format("DD-MM-YYYY") + "-" + t + ' at ' + loc + '\n');
}

function imageScale(imgW,imgH,maxW,maxH){
    return(Math.min((maxW/imgW),(maxH/imgH,1)));
}



function sanitizeMessage(data, direct){
  if(direct) return data;
  return (data||"")
    .replace(/[\r\n]{2,}/g,'<br><br>')
    .replace(/[\r\n]+/g,'<br>')
    .replace(/\s/g,' ');
}

function sanitizeLocalText( text, direct){
  if( direct) return text;
     return text.replace(/&/g, '&amp;')
     .replace(/</g,'&lt;')
     .replace(/>/g,'&gt;')
     .replace(/[\r\n]{2,}/g,'<br><br>')
     .replace(/[\r\n]+/g,'<br>')
     .replace(/\s/g,' ');
  }


function buttonSpinner(node,done){
  node.find('.button-spinner').remove();
if(done ) return;
node.append(' <img class="button-spinner" src="file:///android_asset/loading-indicator/loading2.png" style="width:16px; height: 16px;">');
}

function ftoUpperCase(str){
 if(str) return str[0].toUpperCase() + str.slice(1);
 else return str;
}

function str_ireplace(str, find_, replaceWith_) {
 if(!str) return "";
  //e.g find_ & replaceWith_ must be array ['a','b']
  //replaceWith_ ['1','2'];
    for (var i = 0; i < find_.length; i++) {
        str = str.replace(new RegExp(find_[i], 'gi'), replaceWith_[i]);
    }
    return str;
}

function startsWith(str, word) {
 // alert('startwith')
    return ("" +str).lastIndexOf(word, 0) === 0;
}


function checkVerified(fuser, name){
  name=name||fuser;
 var obj=new Object();
     obj.name=name.substring(name.indexOf("_") + 1);
     obj.icon='';
 if( userVerified( fuser) ){
   obj.icon='<img class="verified-icon" src="file:///android_asset/chat-icons/verified_icon.png"> ';
   }
    
 return obj;
}

function siteAdmin( fuser){
  var str=strtolower( fuser ).substring(0,3);
 return str=="av_"?true: false;
}


function userVerified( fuser ){
  return fuser.indexOf('v_')!== -1;
}

function isPage(gpin ){
 var str=strtolower( gpin ).substring(0, 4);
 return $.inArray( str, ["gu_p","gv_p"] )>-1;
}

function isGroup( gpin){
 var str=strtolower( gpin).substring(0,4);
 return $.inArray( str, ["gu_g","gv_g"] )>-1;
}

function isGroupPage( gpin){
  var str=strtolower( gpin).substring(0,4);
 return $.inArray( str, ["gu_g","gu_p","gv_p","gv_g"] )>-1;
}

function goPage( fuser){
  var str=strtolower( fuser).substring(0,3);
 return $.inArray( str, ["pv_","sv_","cv_"] )>-1;
}

function goStaticPage( fuser){
  var str=strtolower( fuser).substring(0,3);
 return $.inArray( str, ["sv_","cv_"] )>-1;
}


function goAdmin( fuser){
  var str=strtolower( fuser ).substring(0,3);
 return str=="av_"?true: false;
}


function getParameterByName(  name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function sortListFiles( dir, asc){
var list = dir.listFiles();
  list.sort( function(a,b){
  var ta = a.lastModified();
  var tb = b.lastModified();
 if(!asc){ 
   if( ta<tb ) return 1;
  if(ta>tb ) return -1;
    }
  else{ 
   if(tb<ta ) return 1;
  if(tb>ta ) return -1;
    }    
  return 0;
   
 });
return list;
}


function sortFilesAsc( dir){
var list = dir.listFiles();
  if( !list.length) return [];
  list.sort( function(a,b){
 
  var ta = a.lastModified();
  var tb = b.lastModified();
  
  if(tb<ta ) return 1;
   else if(tb>ta ) return -1;
    else return 0;
    });
return list;
}


function sortDirFiles( dir, asc){
var list = dir.listFiles();
  if( !list.length) return [];
  list.sort( function(a,b){
 
  var ta = a.lastModified();
  var tb = b.lastModified();
 if(!asc){ 
   if( ta<tb ) return 1;
  if(ta>tb ) return -1;
    }
  else{ 
   if(tb<ta ) return 1;
  if(tb>ta ) return -1;
    }    
  return 0;
   
 });
return list;
}

function sortNumbers( arr,order){
 return arr.sort(function(a, b) {
  if( order ) return b - a;
   return a-b;
  });
}


function file_ext(file) {
    var extension = file.substr( (file.lastIndexOf('.') +1) );
    switch(extension) {
        case 'jpg':
        case 'png':
        case 'gif':
        case 'jpeg':
            return 'jpg';  // There's was a typo in the example where
        break;                         // the alert ended with pdf instead of gif.
        default:
        return extension;
    }
}

function extractDomain( path){
  var url = document.createElement('a');
//  Set href to any path
 url.setAttribute('href', path);
 return url.protocol + '//' + url.hostname + ( url.port?':'+ url.port:'');
}

function uniqueInArray(arr){
var uniq=arr.filter(function(itm, i, a) {
    return i == a.indexOf(itm);
 });
  return uniq;
}

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}



function sortElementsById(el,container,order){

 $(el).sort(function(a, b) {
  if(order){
   var a_=$(a).attr('id').toUpperCase();
   var b_=$(b).attr('id').toUpperCase();
    return (a_ < b_) ? -1 : (a_ > b_) ? 1 : 0;

  }
  else return parseInt(b.id) - parseInt(a.id);
   }).each(function() {
  var elem = $(this);
  elem.remove();
  $(elem).appendTo(container);
 });
 
}

function sortDiv(a, b) {
   return a.className < b.className;
  }

function sortByName(a, b){
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase(); 
  return ( ( aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function rtcomma(data){
  //remove trailing comma
  return $.trim(data).replace(/(^[,\s]+)|([,\s]+$)/g,'');
}


function readableFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes.toFixed(dp) + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}


var escape = function (str) {
  return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};


function toDate(UNIX_timestamp,time_){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month=a.getMonth();
  var month_ = months[month];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time= formatTime(hour,min);
  var date_= month_ + ' ' + date + ', ' + year;
  var today=moment().format('MMMM D, YYYY');
  var isToday=false;
 if(strtolower(date_)==strtolower(today) ) isToday=true;

  var result="";
 if(time_ && time_=='last_seen'){
   result='Last seen ' + (isToday?'today ':date_) + ' at ' + time;
 }else if(time_=='chat_date') {
    result= (isToday?'TODAY':date_.toUpperCase() ); 
 } else if(time_=='chat_list_date') {
    result= (isToday?time: date + '/' + ( month +1)+ '/' + year ); 
   }
 else if(time_=='comment_date') {
    result= (isToday?time: date_ )
   //date + '/' + ( month +1)+ '/' + year + '&bull; ' + time); 
   }
  else if(time_) { result= time;  }
  else{ result= date_; }
  return result;
}

function formatTime(hours,minutes) {
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


function timeSince( date) {
  date=new Date( +date * 1000);
  var seconds = Math.floor( ( new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
 
 return "Just now";
 // return Math.floor(seconds) + " seconds";
}



function rtchar(data, charToTrim) {
  var regExp = new RegExp(charToTrim + "+$");
  var result = data.replace(regExp, "");
  return result;
}

function strtolower(data){
 return data.toString().toLowerCase();
 
}

function strtoupper(data){
  return data.toString().toUpperCase();
}


function randomNumbers(length) {
 return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}


function replaceLast(str,word,replacement){
  var n = str.lastIndexOf(word);
// slice the string in 2, one from the start to the lastIndexOf
// and then replace the word in the rest
return str.slice(0, n) + str.slice(n).replace(word, replacement);
}

function validPassword(password){
  if(!password) return false;
  else if(password.match(/^[a-zA-Z0-9~@#%_+*?-]{6,50}$/) ) return true;
  else return false;
}

function validName(fullname){
 if(!fullname) return false;
else if(fullname.match(/^[a-zàáèöïÿŕëäśĺžźżçćčñńôêėřûîéìíòóùú]([.'-]?[0-9a-z àáèöïÿŕëäśĺžźżçćčñńôêėřûîéìíòóùú]+)*$/i) )return true;
else return false;
}

function validUsername(username){
 if(!username) return false;
else if (username.match(/^([a-z]+)_?[a-z0-9]{3,29}$/i) ) return true;
else return false;
}

function validPhone(phone){
 if(!phone) return false;
else if (phone.match(/^[0-9][0-9.() -]{5,19}$/) ) return true;
else return false;
}


function upgradeRequired( data_, t){
 //t: Trigger also in goSocial
  
 var ldata=$.trim( localStorage.getItem('upgrade_required'));
 var data=[];
  if(ldata){
  try{  
     data=JSON.parse(ldata);
   }catch(e){}
 }

  if(data_ && data_.version_code){    
    data=data_
    localStorage.setItem('upgrade_required', JSON.stringify(data_) );
  }
      
  if(  !data ) return;
  
 var vcode=+data.version_code;
 
  if( !vcode ) return;
 if( vcode<=(+config_.APP_VERSION) ) return;
  var vinfo=data.version_info;
  var vurl=data.version_url;
   
   var data='<div class="text-center" style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; padding: 15px; width: 90%; font-weight: bold; font-size: 15px;">';
        data+='Update required</div>';
      data+'<div class="center_text_div text-left;">';
     data+='<div class="container-fluid text-left" style="padding: 0 15px 15px 15px;">';
    data+='<div>' + vinfo.replace(/:nl::/g,'<br>') +'</div>';
    data+='<div class="mt-2 text-center"><a class="btn btn-sm btn-success" href="' + vurl + '">Update now</a></div>';
   data+='<img class="d-none w-40" src="file:///android_asset/loading-indicator/loading2.png">';
   data+='</div></div>';
     displayData(data,{ no_cancel:true, data_class:'.update-requred'});

  if( t ){
    android.activity.loadUrl("go_social","javascript: upgradeRequired();");
  }
}



function flashe(elements) {
  var opacity = 100;
  var color = "255, 255, 20";
 // has to be in this format since we use rgba
  var interval = setInterval(function() {
    opacity -= 3;
    if (opacity <= 0) clearInterval(interval);
    $(elements).css({background: "rgba("+color+", "+opacity/100+")"});
  }, 500)
};

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}


function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = "rgba(0,0,0);", // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

// ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return "rgba(" + (rgb.r + ',' + rgb.g + ',' + rgb.b) + ");";
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function hideOptions(){
  $('.absent_reason,.sT,.esc,.mass_print_info,.original_photo,#datepicker,.multi_options,.individual_options,.select_class,.create_class,.delete_class,.rename_class').hide();
 $('.overshadow').removeAttr('onclick');
  applyScroll();
 }


function isInArray(value, array) {
return array.indexOf(value) > - 1 ;
}

function foundInArray(txt,arr){
  if($.inArray(txt,arr)>-1){ return true; }
  return false;
}
    
function sortSpecial(priorities,liveData){

  /*var priorities=['jim','steve','david'];
    var liveData=['bob','david','steve','darrel','jim'];
  */

var output=[],temp=[];  
for ( i=0; i<liveData.length; i++){
    if( $.inArray( liveData[i], priorities) ==-1){
        output.push( liveData[i]);
    }else{
        temp.push( liveData[i]);
    }
}
var temp2=$.grep( priorities, function(name,i){
        return $.inArray( name, temp) >-1;                             
});
   return $.merge( temp2, output);
}

function sortInputFirst(data, input, input2, input3) {
    var first = [];
    var others = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].indexOf(input) == 0) {
            first.push(data[i] );
        } 
     else if (input2 && data[i].indexOf(input2) == 0) {
            first.push(data[i] );
        } 
      else if (input3 && data[i].indexOf(input3) == 0) {
            first.push(data[i] );
        } 
      else {
     others.push(data[i]);
     }
  }
    first.sort();
    others.sort();
    return ( first.concat(others));
}

 
function sendSms(phone,message){
  if (phone.length<3) {
  alert('No valid phone number specified. Update ' + member + ' data first');
  return false;
}
 
var intent={ 
  action:"android.intent.action.VIEW",
  data:"sms:" + phone,
  extras:{"sms_body":message}};
 //startActivityFix(intent);
 
android.activity.startActivity(intent);
}


function animateCSS(element, animationName, callback) {
  var node=$(element);
      node.addClass('animated ' + animationName);

    function handleAnimationEnd() {
        
      node.removeClass('animated ' + animationName);
      node.unbind('webkitAnimationEnd oanimationend msAnimationEnd animationend');       
     if (typeof callback==='function') callback();
   
}

   node.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',handleAnimationEnd);
 
 }


/*

And use it like this:

animateCSS('.my-element', 'bounce')

// or
animateCSS('.my-element', 'bounce', function() {
  // Do something after animation
})


*/


function remOsAttr(){
 $('.overshadow').removeAttr('onclick');
 }

function addOsAttr(func){
  if(func) $('.overshadow').attr('onclick',func);
 }

function stopScroll(elem,elem2){
  var v=0;
   if (elem2){
  if( elem2.search('.')!=-1 ) v=$(elem2).visibleHeight()-10;
    else v=+elem2;
 }

  elem=elem||'.main-container';
   lastTop =$(window).scrollTop();
  sessionStorage.setItem('lastTop',lastTop);
   $(elem).addClass('noscroll').css({top:-(lastTop-v)}); //lastTop-118
  }

function continueScroll(elem) {  
  elem=elem||'.main-container';                  
    $(elem).removeClass( 'noscroll' );

  var lastTo=+sessionStorage.getItem('lastTop')||lastTop;
      
      $(window).scrollTop( lastTo );       
 }          

 sessionStorage.setItem('gscid', randomString(4));
 
function getScroll(noScroll,oS,elem,elem2){
   var c=sessionStorage.getItem('gsccc');
  setTimeout(function(){
    sessionStorage.removeItem('gsccc'); },400);
   
 if(!c){
  var gscid=sessionStorage.getItem('gscid');  
  var gsc=+sessionStorage.getItem('gsc' + gscid);
     gsc=gsc<0?0:gsc;
  sessionStorage.setItem('gsc' + gscid, gsc+1); 
    sessionStorage.setItem('gsccc','1');
    }
if (noScroll) { stopScroll(elem,elem2); if (oS) { overshadow(); }  return false; }
   if (oS) overshadow(); 
   lastTop = $(window).scrollTop();
 }


 $(window).scroll(function(){
   lastTop = $(window).scrollTop();
   // sessionStorage.setItem('lastTop',lastTop);
 });



function applyScroll(oS,elem){
  var co=true;
  var cs=true;
   var gscid=sessionStorage.getItem('gscid');
   var gsc=+sessionStorage.getItem('gsc' + gscid);

    remOsAttr();
 if(gsc<2 ){
  if (!oS && co ) close_overshadow();
   if (cs) continueScroll(elem);
   sessionStorage.removeItem('gsc' + gscid);
  }
   sessionStorage.setItem('gsc' + gscid,gsc-1);
 
  }



var toastTimer;
function toast(data,c,callback){
  if(toastTimer) clearTimeout(toastTimer);
  var config=$.extend({
  pos:80,
  custom_class:'',
  hide: 3000,
  type: 'danger',
  align: 'center',
  font_size: '13px',
  width: '100px',
  color:'#ffffff',
  border: '0',
  background:'',
  manual_close: false
},c);
   
   var bg={
           danger: '#d9534f',
           success: 'seagreen',
           info: '#4b6cb7',
           warning:'orange',
           light:'#f5f5f5',
           primary:'#0079c6'
          };

 if(toastTimer) clearTimeout(toastTimer);
   $('.android_toast').hide();
    var mc="";
  if(config.manual_close){
   mc='<img onclick="' + (callback?'callback();':'') + 'clearTimeout(toastTimer);$(\'.android_toast\').fadeOut();" src="file:///android_asset/images/bg/close.png" style="width: 17px; position: absolute; top:-5px; left:-5px;">'; 
  }

  var zi=600;
 var zindex=+$("#z-index").val()||0;
  if( zindex>zi){
     zi=zindex;
  } 
  
  var div='<div class="android_toast ' + config.custom_class + '" style="background: ' + ( config.background||bg[config.type] ) +
       '; position: fixed;  z-index: ' + zi + '; left: 50%; top: ' + config.pos + '%; opacity:.95; color:#fff; border: ' + config.border + '; border-radius: 20px; padding: 15px 16px; max-width: 600px; ' + 
       ' min-widt: ' + config.width + '; -webkit-transform: translate(-50%,-' + config.pos + '%); text-align: ' + config.align + 
        '; font-size: ' + config.font_size + '; color: ' + config.color + '">' + mc + data + '</div>';
  
  $('body').append(div);
 toastTimer=setTimeout(function(){
    $('.android_toast').fadeOut();
   clearTimeout(toastTimer);
   if(callback) callback();
  },config.hide);
}


function displayData(data,arr){
  var osclass='dd_' + randomString(10);
  var a=$.extend({
    ddclass:'body',
    pos: 50,
    gs:true,
    os:true,
    osc: osclass,
    oszindex: 150,
    bground:'#fff',
    data_class:'.nothing',
    osclose: false,
    on_close: '',
    type:0,
    title:'',
    opacity:'0.5',
    dummy: false,
    append: true,
    max_width: '550px',
    width: '90%',
    no_cancel: false, //i.e cannot be cancelled by back button
  }, arr);
  
  var zindex=+$("#z-index").val()||0;
  if( zindex>a.oszindex ){
     a.oszindex=zindex;
  }
 
  if($(a.data_class).length) return;

  //osclose if set to true, then user can also close div on overshadow click
  var osclose='';
   if(a.osclose) osclose=' onclick="closeDisplayData(\'' + a.data_class + '\',\'' + a.on_close + '\');"';
  var no_cancel=a.no_cancel?'no-cancel':'';
  
  var div='';
  if(a.dummy){
     div+='<div class="display--data d-none ' + no_cancel + ' ' + a.data_class.replace('.','') + '" data-class="' + a.data_class + '"></div>';
  }else if(a.type){
    
    div='<div class="display--data center_div ' + no_cancel + ' center-div ' + a.data_class.replace('.','') + '" data-class="' + a.data_class + '" style="background: ' + a.bground + '; width: ' + a.width + '; max-width: ' + a.max_width + ';">';
   //  div='<i class="text-danger fa fa-lg fa-close" style="position: absolute; top: 5px; right: 2%;">Close</i>';
    div+='<div class="center_header">' + (a.title?a.title:'') + '</div>';
    div+='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';
    div+=data;
    div+='</div></div>';
  }
  else {
    div='<div class="display--data center_div ' + no_cancel + ' center-div ' + a.data_class.replace('.','') + '" data-class="' + a.data_class + '" style="background: ' + a.bground + '; width: ' + a.width + '; max-width: ' + a.max_width + ';">';
    div+= data;
    div+='</div>';
  }
  
  if(a.append){
    $(a.ddclass).append(div);
  }else{
   $(a.ddclass).prepend(div);
  }
  
  var pos_=a.pos + '%';
 /* var pos_=(100-(+a.pos) ) + "%"; */
  var trans='translate(-50%,-' + pos_ + ')';
 
  $(a.data_class).css({'z-index':( a.oszindex + 15), 'top': pos_, '-webkit-transform': trans} ).attr('data-overshadow','.' + a.osc).after('<div class="DONT_PRINT dont_print ' + a.osc + '" style="background: #000; position: fixed; z-index: ' + a.oszindex + '; top:0; left:0; right:0;  bottom:0; opacity: ' + a.opacity + '; display:none;"' + osclose + '></div>');
  
   if (a.gs) getScroll(true);
   if(a.os) $('.' + a.osc).show();
}

 function closeDisplayData(elem,callback){
  var el=$(elem);
   var os=el.data('overshadow');
   el.remove();
   $(os).remove();
  applyScroll(1);
   if(callback){
  if(typeof callback==='string' ||callback instanceof String){ window[callback](); } 
      else callback();
   }
 }



function cropImage(url,id,w,h,type){
 var image = new Image();
 // When the image has loaded, draw it to the canvas
    image.onload = function(){
  var canvas=document.getElementById(id);
  if (type) {
   canvas=document.getElementsByClassName(id);
   for(i=0; i<canvas.length; i++){
 var cv=canvas[i];
 var context =cv.getContext("2d");
    context.drawImage(image,0, 0 , w, h);
  } 
 } else{
    var context = canvas.getContext("2d");
    context.drawImage(image,0, 0 , w, h);
  }
 }

  image.src=url;
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


(function( $ ) {
	
	$.fn.imageResize = function( options ) {

        var settings = {
            width: 150,
            height: 150
        };
        
        options = $.extend( settings, options );
     
        return this.each(function() {
			var $element = $( this );
            var maxWidth = options.width;
            var maxHeight = options.height;
            var ratio = 0;
            var width = $element.width();
            var height = $element.height();

            if ( width > maxWidth ) {
                ratio = maxWidth / width;
                
                $element.css( "width", maxWidth );
                $element.css( "height", height * ratio );

            }

            if ( height > maxHeight ) {
                ratio = maxHeight / height;
                
                $element.css( "height", maxHeight );
                $element.css( "width", width * ratio );

            }

        });

    };
})( jQuery );


var _getAllFilesFromFolder = function(dir,dir2) {
 
      var file_ = new android.File(dir);
     var list = file_.list();
     // var filesystem = require("fs");
    var results = [];

   // filesystem.readdirSync(dir).forEach(function(file) {

     $.each(list,function(i,file){
      //  file = dir+'/'+file;
       file=dir+'/'+file;
      //  var stat = filesystem.statSync(file);
     var stat=new android.File(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file,dir2))
        } else results.push(file.replace(dir2,''));
    });

    return results;
};
    

$.extend({
    distinct : function(anArray) {
       var result = [];
       $.each(anArray, function(i,v){
           if ($.inArray(v, result) == -1) result.push(v);
       });
       return result;
    }
});


$.fn.extend({
  autoHeight: function () {
    function autoHeight_(element) {
      return jQuery(element)
        .css({ "height": "28px", "overflow-y": "hidden" })
        .height(element.scrollHeight).css("overflow-y","auto");
    }
    return this.each(function() {
      autoHeight_(this).on("input", function() {
        autoHeight_(this);
      });
    });
  }
});
  

$.fn.flash = function(duration, iterations) {
    duration = duration || 1000; // Default to 1 second
    iterations = iterations || 1; // Default to 1 iteration
    var iterationDuration = Math.floor(duration / iterations);
  for (var i = 0; i < iterations; i++) {
   this.fadeOut(iterationDuration).fadeIn(iterationDuration);
    }
  return this;
}






function checkDownload(id) {
  var dm = android.java.activity.getSystemService("download");
  var uri = dm.getUriForDownloadedFile(id);
  return uri!=null;
}


function getDownloadStatus(id) {
  var dm = android.java.activity.getSystemService("download");
  var queryClass = new android.JavaObject("android.app.DownloadManager$Query");
  var query = queryClass._newInstance([]);
  var cursor = dm.query(query);
  if(!cursor) return null;
  cursor.moveToFirst();
  var idIdx = cursor.getColumnIndex("_id");
  var statusIdx = cursor.getColumnIndex("status");
  var reasonIdx = cursor.getColumnIndex("reason");
  var bytesIdx = cursor.getColumnIndex("total_size");
  var bytesIdxx = cursor.getColumnIndex("bytes_so_far");
  var status = -1;
  
  while(!cursor.isAfterLast()) {
    var cId = cursor.getLong(idIdx);
    if(cId==id) {
       var result = {};
       result.status = cursor.getInt(statusIdx);
       result.reason = cursor.getInt(reasonIdx);
       result.bytes = cursor.getLong(bytesIdx);
       result.bytes_so_far = cursor.getLong(bytesIdxx);
      cursor.close();
       return result;
    }
    else cursor.moveToNext();
  }
  cursor.close();
  return null;
}







/*
Split object into chunks
var values = Object.values(NEWCHATS__);
var final = [];
var counter = 0;
var portion = {};

for (var key in object) {
  if (counter !== 0 && counter % 50 === 0) {
    final.push(portion);
    portion = {};
  }
  portion[key] = values[counter];
  counter++
}
final.push(portion);
 */ 

   