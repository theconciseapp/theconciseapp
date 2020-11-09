var default_semester='1st_semester';
var default_session='2020_2021';
alert('ok');
function reverse(s){ return s.split("").reverse().join(""); 
}

function en(c){
var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")
}

function de(b){
var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")
}


function formatUrl(scheme,url,param){
  if(__INAPP){
if(!scheme) scheme='tca://';
  url=scheme + 'localhost?url=' + url + '?inApp=1'+(param?'&' + param:'');
return url;
  }
else return url;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function schoolName(){
 return localStorage.getItem('school_name')||"";
}

function schoolAddress(){
 return localStorage.getItem('school_address');
}


function schoolMotto(){
return localStorage.getItem('school_motto');
}


function __(data){
if(!data) return "";
return data.replace(/</g,'&lt;').replace(/>/g,'&gt;');
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

function validEmail(email){
 if(email.match(/^\S+@\S+[\.][0-9a-z]+$/i)) return true;
else return false;
}

function strtolower(data){
if(!data) return '';
return data.toLowerCase();
}


function split_(str,dm,ret,firstOccur){
 
 if(!str) return '';

  del=dm?dm:'/';
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

function divSorter(id,elem){
elem=elem||'div';
var mylist = $(''+ id);
var listitems = mylist.children(elem).get();
listitems.sort(function(a, b) {
   return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
});

$.each(listitems,function(index, item) {
   mylist.append(item); 
});
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


function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


function capitalise(string){
  if(!string) return "";
 return string.replace(/^./, string[0].toUpperCase()); 
 }



var psychoMotors={'handwriting':'Handwriting',
   'games':'Games & Sports',
   'fluency':'Fluency',
   'toolshandling':'Handling of tools',
   'labourworkshop':'Labour & workshop performance'};

var affectiveDomains={
      'punctuality':'punctuality',
      'reliability':'Reliability',
      'neatness':'Neatness',
      'politeness':'Politeness',
      'relwithothers':'Rel. with others',
      'selfcontrol':'Self control',
      'leadership':'Leadership',
      'spiritofcoop':'Spirit of cooperation',
      'attentiveness':'Attentiveness',
'nonaggressiveness':'Non-aggressiveness'
   };

var EXAMSETTINGS__={"test_pass_mark":"15","max_test_score":"30","exam_pass_mark":"35","max_exam_score":"70","max_total_score":"100","isA1":"75","isB2":"70","isB3":"70","isC4":"60","isC5":"55","isC6":"50","isD7":"45","isE8":"40","isF9":"0","showGrade":"YES","showAge":"YES","showPosition":"YES","showSubjectTeacherSign":"YES","showAttendanceReport":"YES","showPreviousResult":"NO","previousResultPosition":"2","hideTestScore":"NO","reportFontSize":"16","appendSignature":"YES"};

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


function array_diff(a1, a2) {
  var result = [];
  for (var i = 0; i < a1.length; i++) {
    if (a2.indexOf(a1[i]) === -1) {
      result.push(a1[i]);
    }
  }
  return result;
}

function arrayDiff(a1, a2) {
  var result = [];
  for (var i = 0; i < a1.length; i++) {
    if (a2.indexOf(a1[i]) === -1) {
      result.push(a1[i]);
    }
  }
  for (i = 0; i < a2.length; i++) {
    if (a1.indexOf(a2[i]) === -1) {
      result.push(a2[i]);
    }
  }
  return result;

}
