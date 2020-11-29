var default_semester='1st_semester';
var default_session='2020_2021';

function reverse(s){ return s.split("").reverse().join(""); 
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

function en(c){
var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")
}

function de(b){
var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")
}


var _supportsLocalStorage = !!window.localStorage
    && typeof localStorage.getItem === 'function'
    && typeof localStorage.setItem === 'function'
    && typeof localStorage.removeItem === 'function';
//by ovi triff


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


var mark_fail_icon='data:image/png;base64,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';


var mark_success_icon='data:image/png;base64,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';



