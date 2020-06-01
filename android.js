// Library for access to the system and device features.
// Date of this file: 2017-11-25 11:01
//

//
// These are some definitions for older versions of Android
//
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}
if(!document.dispatchCustomEvent) {
  document.dispatchCustomEvent = function(event) {
    function visit(elem,event) {
      elem.dispatchEvent(event);
      var child = elem.firstChild;
      while(child) {
        if(child.nodeType==1) visit(child,event);
        child = child.nextSibling;
      }
    }
    document.dispatchEvent(event);
    visit(document.documentElement,event);
  }
}
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

//
// android object incorporates all other objects and functions defined in this file.
//
var android = (function(global) {
  var ifs = {
    files : global._JSFiles_,
    webView : global._JSWebView_,
    activity : global._JSActivity_,
    billing : global._JSBilling_,
    bitmaps : global._JSBitmaps_,
    clipboard : global._JSClipboard_,
    download : global._JSDownload_,
    location : global._JSLocation_,
    log : global._JSLog_,
    sensors : global._JSSensors_,
    toast : global._JSToast_,
    reflect : global._JSReflect_,
    vibrator : global._JSVibrator_,
    fileProvider : global._JSFileProvider_
  };

  function JavaObject(id) {
    this._getId = function() { return id; };

    this._keep = function(value) { ifs.reflect.keep(id,value);}
    this._forget = function() { ifs.reflect.forget(id);}

    var getField = function(name) {
      var result = JSON.parse(ifs.reflect.getField(id,name));
      if(typeof result.id === 'undefined') return result.value;
      else return new JavaObject(result.id);
    };

    var setField = function(name,value) {
      if(value instanceof JavaObject) value = JSON.stringify({id:value._getId()});
      else value = JSON.stringify({value:value});
      ifs.reflect.setField(id,name,value);
    };

    var invoke = function(name,args) {
      var params = [];
      for(var i=0; i<args.length; ++i) {
        var value = args[i];
        if(value instanceof JavaObject) value = {id:value._getId()};
        else value = {value:value};
        params[i] = value;
      }
      var result;
      result = JSON.parse(ifs.reflect.invoke(id,name,JSON.stringify(params)));
      if(result.error) { throw new Error(result.error); }
      else
      if(typeof result.id === 'undefined') return result.value;
      else return new JavaObject(result.id);
    };

    this["class"] = ifs.reflect.getClassName(id);
    if(this["class"]==="java.lang.Class") {
      this._newInstance = function(args) {
        var params = [];
        for(var i=0; i<args.length; ++i) {
          var value = args[i];
          if(value instanceof JavaObject) value = {id:value._getId()};
          else value = {value:value};
          params[i] = value;
        }
        var result = JSON.parse(ifs.reflect.newInstance(id,JSON.stringify(params)));
        if(result.error) { throw new Error(result.error); }
        else
        if(typeof result.id === 'undefined') return result.value;
        else return new JavaObject(result.id);
      }
    }
    var fields = JSON.parse(ifs.reflect.getFieldNames(id));
    for(var i=0; i<fields.length; ++i) {
      var field = fields[i];
      try { this["get_"+field] = (function(name){ return function() { return getField(name); };})(field); } catch(e) {}
      try { this["set_"+field] = (function(name){ return function(value) { setField(name,value); }; })(field); } catch(e) {}
    }
    var methods = JSON.parse(ifs.reflect.getMethodNames(id));
    for(var i=0; i<methods.length; ++i) {
      var method = methods[i];
      try {
        this[method] = (function(name){ return function() { return invoke(name,arguments); }; })(method);
      }
      catch(e) { }
    }
  }

  var Reflect = function Reflect() {
    this.activity = new JavaObject("activity");
    this.webView = new JavaObject("webView");
    this.Class = new JavaObject("Class");

    this.newInstance = function(name,args) {
      var params = [];
      for(var i=0; i<args.length; ++i) {
        var value = args[i];
        if(value instanceof JavaObject) value = {id:value._getId()};
        else value = {value:value};
        params[i] = value;
      }
      var result = JSON.parse(ifs.reflect.newInstance(name,JSON.stringify(params)));
      if(result.error) { throw new Error(result.error); }
      else
      if(typeof result.id === 'undefined') return result.value;
      else return new JavaObject(result.id);
    };

    this.keep = function(obj,value) {
      if(obj instanceof JavaObject) {
        ifs.reflect.keep(obj._getId(),value==true);
      }
    };
  };

  var reflect = {

  };

  var Exception = function(str) {
    var data = JSON.parse(str);

  };

  var toPath = function(obj) {
    return obj?obj.toString():null;
  }

  var extendPath = function(a,b) {
    if(a=="/") return "/"+b;
    else return a+"/"+b;
  }

  var File = function() {
    var path = (arguments.length==1?toPath(arguments[0]):extendPath(toPath(arguments[0]),toPath(arguments[1])));
    this.copyTo = function(file) {
      return ifs.files.copy(path,toPath(file));
    };
    this.createNewFile = function() {
      try { return ifs.files.createNewFile(path); }
      catch(e) { throw new Error("Error when creating new file '"+path+"': "+ifs.files.getLastError()); }
    };
    this.delete = function() { return ifs.files.delete(path); };
    this.deleteFileOrFolder = function() {
      if(!this.exists()) return false;
      if(this.isDirectory()) {
        var list = this.listFiles();
        for(var i=0; i<list.length; ++i) {
          if(!list[i].deleteFileOrFolder()) return false;
        }
      }
      return this.delete();
    };

    this.equals = function(file) { return path==toPath(file); };
    this.exists = function() { return ifs.files.exists(path); };
    this.getName = function() {
      var idx = path.lastIndexOf("/");
      if(idx>=0) return path.substring(idx+1);
      else return path;
    };
    this.getParent = function() {
      var idx = path.lastIndexOf("/");
      if(idx>0) return new File(path.substring(0,idx));
      else
      if(idx==0) return new File("/");
      else return null;
    };
    this.getSuffix = function() {
      var name = this.getName();
      var idx = name.lastIndexOf(".");
      if(idx>0) return name.substring(idx+1);
      else return null;
    };
    this.isDirectory = function() { return path==null?false:ifs.files.isDirectory(path); };
    this.isFile = function() { return path==null?false:ifs.files.isFile(path); };
    this.lastModified = function() { return ifs.files.lastModified(path); };
    this.length = function() { return ifs.files.length(path); };
    this.list = function() { return JSON.parse(ifs.files.list(path)); };
    this.listFiles = function() {
      var list = JSON.parse(ifs.files.list(path));
      for(var i=0; i<list.length; ++i) list[i] = new File(path,list[i]);
      return list;
    };
    this.mkdir = function() { return ifs.files.mkdir(path); };
    this.mkdirs = function() { return ifs.files.mkdirs(path); };
    this.read = function() { return ifs.files.read(path); };
    this.readHex = function(pos,len) { return ifs.files.readHex(path,pos,len); };
    this.renameTo = function(file) {
      if(file instanceof File) file = file.toString();
      return ifs.files.rename(path,file);
    };
    this.setLastModified = function(time) { ifs.files.setLastModified(time); };
    this.toString  = function() { return path; };
    this.unzip = function(dir) { ifs.files.unzip(path,toPath(dir)); }
    this.write = function(str) { return ifs.files.write(path,str); };
    this.getContentUri = function() {
      return ifs.fileProvider.getContentUri(path);
    }
    this.getPathRelativeTo = function(dir) {
       var p = toPath(dir);
       if(p==path) return "";
       if(p.length<path.length && path.startsWith(p+"/")) {
          return path.substring(p.length+1);
       }
       else throw new Error("Invalid dir parameter");
    }
  };

  var AssetFile = function() {
    var path = (arguments.length==1?toPath(arguments[0]):extendPath(toPath(arguments[0]),toPath(arguments[1])));
    this.copyTo = function(file) {
      return ifs.files.copyAssets(path,toPath(file));
    };
    this.equals = function(file) { return path==toPath(file); };
    this.getName = function() {
      var idx = path.lastIndexOf("/");
      if(idx>=0) return path.substring(idx+1);
      else return path;
    };
    this.getParent = function() {
      var idx = path.lastIndexOf("/");
      if(idx>0) return new AssetFile(path.substring(0,idx));
      else return null;
    };
    this.getSuffix = function() {
      var name = this.getName();
      var idx = name.lastIndexOf(".");
      if(idx>0) return name.substring(idx+1);
      else return null;
    };
    this.isFile = function() { return ifs.files.isAssetFile(path); };
    this.isDirectory = function() { return ifs.files.isAssetDir(path); };
    this.list = function() { return JSON.parse(ifs.files.listAssets(path)); };
    this.listFiles = function() {
      var list = JSON.parse(ifs.files.listAssets(path));
      for(var i=0; i<list.length; ++i) list[i] = new AssetFile(path,list[i]);
      return list;
    };
    this.read = function() {
      return ifs.files.readAsset(path);
    };
    this.toString  = function() { return path; }
  };

  var files = {
    cancelCopyInBackground : function() {
      ifs.files.cancelCopyInBackground();
    },
    copyInBackground : function(arr) {
      ifs.files.copyInBackground(JSON.stringify(arr));
    },
    createTempFile : function(prefix,suffix,dir) {
      return new File(ifs.files.createTempFile(prefix,suffix,toPath(dir)));
    },
    getBackgroundStatus : function() {
      return JSON.parse(ifs.files.getBackgroundStatus());
    },
    getFilesDir : function() {
      return new File(ifs.files.getFilesDir());
    },
    getExternalFilesDir : function() {
      return new File(ifs.files.getExternalFilesDir());
    },

    isGoodName : function(name) {
      if(!name||name.length==0) return false;
      if(ifs.webView.getUTF8Length(name)>255) return false;
      if(name.indexOf("/")>=0) return false;
      return  true;
    },

    toFile : function(obj) {
      if(obj instanceof android.File) return obj;
      else return new android.File(obj);
    }

  };

  var gravity = { LEFT:3, RIGHT:5, START:8388611, END:8388613};


  var requestCodeCounter = 1;

  var activity = {
    dismissDialog: function() {
      ifs.activity.dismissDialog();
    },
    finish : function() {
      ifs.activity.finish();
    },
    finishActivity : function(requestCode) {
      ifs.activity.finishActivity(requestCode);
    },
    hideKeyboard : function() {
      ifs.activity.hideKeyboard();
    },
    inflateView : function(layout,parent,id) {
      ifs.activity.inflateView(layout,parent,id);
    },
    isDialogActive: function() {
      return ifs.activity.isDialogActive();
    },
    setBackAction : function(action) {
      ifs.activity.setBackAction(action);
    },
    setTitle : function(title) {
      ifs.activity.setTitle(title);
    },
    showDialog: function(url,obj) {
      ifs.activity.showDialog(url,obj?JSON.stringify(obj):null);
    },
    showView : function(name) {
      ifs.activity.setVisibility(name,0);
    },
    hideView : function(name) {
      ifs.activity.setVisibility(name,8);
    },
    startActivity : function(intent) {
      ifs.activity.startActivity(JSON.stringify(intent));
    },
    startActivityForResult : function(intent,callback,showChooser) {
      var rc = requestCodeCounter++;
      var eventHandler = function(e) {
        if(e.detail.requestCode==rc) {
          document.removeEventListener("activityResult",eventHandler);
          if(callback) callback(e.detail);
        }
      }
      document.addEventListener("activityResult",eventHandler);
      ifs.activity.startActivityForResult(JSON.stringify(intent),rc,showChooser?true:false);
      return rc;
    },
    updateMenu : function(menu) {
      ifs.activity.updateMenu(JSON.stringify(menu));
    },
    loadUrl : function(name,url) {
      ifs.activity.loadUrl(name,url);
    },
    closeDrawer : function(gravity) {
      ifs.activity.closeDrawer(gravity);
    },
    openDrawer : function(gravity) {
      ifs.activity.openDrawer(gravity);
    },
    isDrawerOpen : function(gravity) {
      return ifs.activity.isDrawerOpen(gravity);
    },
    getIntentExtra : function(name) {
      return ifs.activity.getIntentExtra(name);
    },
    shareFile: function(file,mimeType,callback) {
      var contentUri = android.files.toFile(file).getContentUri();
      var intent = {
        action: "android.intent.action.SEND",
        type: mimeType,
        extras: {"android.intent.extra.STREAM":contentUri},
        extras_types: {"android.intent.extra.STREAM":"Uri"}
      };
      android.activity.startActivityForResult(intent,callback,true);
    }

  };

  var bitmaps = {
    decodeBounds: function(file) {
      return JSON.parse(ifs.bitmaps.decodeBounds(file.toString()));
    },
    toThumbnail : function(src,dst,iconSize) {
      return ifs.bitmaps.toThumbnail(toPath(src),toPath(dst),iconSize);
    },
    resize: function(src,dst,sample,maxWidth,maxHeight,quality) {
      return ifs.bitmaps.resize(toPath(src),toPath(dst),sample,maxWidth,maxHeight,quality);
    }
  };

  var toast = {
    show : function(msg) {
      ifs.toast.show(msg);
    },
    showLong : function(msg) {
      ifs.toast.showLong(msg);
    }
  };

  var webView = {
    addInterfaces : function(interfaces,callback) {
      var eventHandler = function() {
        document.removeEventListener("WebViewInterfacesAdded", eventHandler);
        callback();
      };
      document.addEventListener("WebViewInterfacesAdded",eventHandler)
      ifs.webView.addInterfaces(JSON.stringify(interfaces));
    },
    clearCache : function() { ifs.webView.clearCache(); },
    clearHistory : function() { ifs.webView.clearHistory(); },
    enableZoom : function(enable) {
      ifs.webView.enableZoom(enable);
    },
    getArgument : function() {
      return ifs.webView.getArgument();
    },
    getId : function() {
      return ifs.webView.getId();
    },
    registerForBroadcast: function(action) {
      ifs.webView.registerForBroadcast(action);
    },
    unregisterForBroadcast: function(action) {
      ifs.webView.unregisterForBroadcast(action);
    },
    setAllowExternalURLs : function(allow) {
      ifs.webView.setAllowExternalURLs(allow);
    },
    setAlertTitle : function(title) {
      ifs.webView.setAlertTitle(title);
    },
    setArgument : function(arg) {
      ifs.webView.setArgument(arg);
    },
    setBackButtonLogic : function(logic) {
      ifs.webView.setBackButtonLogic(logic);
    },
    setCacheMode : function(value) {
      ifs.webView.setCacheMode(value);
    },
    setConsoleId : function(id) {
      ifs.webView.setConsoleId(id);
    },
    setActionModeType : function(type) {
      ifs.webView.setActionModeType(type);
    },
    startActionMode : function(name) {
      ifs.webView.startActionMode(name);
    }
  };



  var billing = {
    init: function(callback) {
      var eventHandler = function(e) {
        document.removeEventListener("JSBilling.bound",eventHandler);
        callback();
      }
      document.addEventListener("JSBilling.bound",eventHandler);
      ifs.billing.init();
    },
    purchase : function(type,sku,callback) {
      if(type!="inapp" && type!="subs") throw new Error("Invalid type: "+type+", must be 'inapp' or 'subs'");
      var rc = requestCodeCounter++;
      var eventHandler = function(e) {
        if(e.detail.requestCode==rc) {
          document.removeEventListener("activityResult",eventHandler);
          callback(e.detail);
        }
      }
      document.addEventListener("activityResult",eventHandler);
      ifs.billing.requestPurchase(type,sku,rc);
    },
    getOwnedItems : function(type,callback) {
      var rc = requestCodeCounter++;
      var tag = ""+rc;
      var eventHandler = function(e) {
        if(e.detail.tag==tag) {
          document.removeEventListener("JSBilling.purchasedItems",eventHandler);
          if(e.detail.RESPONSE_CODE!=0) throw {src:"billing",info:e.detail};
          var items = e.detail.items;
          for(var i=0; i<items.length; ++i) {
            items[i].data = JSON.parse(items[i].data);
          }
          callback(e.detail);
        }
      }
      document.addEventListener("JSBilling.purchasedItems",eventHandler);
      ifs.billing.requestPurchasedItems(type,tag);
    },
    getItemInfo : function(type,skuList,callback) {
      if(type!="inapp" && type!="subs") throw new Error("Invalid type: "+type+", must be 'inapp' or 'subs'");
      var eventHandler = function(e) {
        document.removeEventListener("JSBilling.itemInfo",eventHandler);
        if(e.detail.RESPONSE_CODE!=0) throw {src:"billing",info:e.detail};
        e.detail.DETAILS_LIST = JSON.parse(e.detail.DETAILS_LIST);
        callback(e.detail);
      }
      document.addEventListener("JSBilling.itemInfo",eventHandler);
      ifs.billing.requestItemInfo(type,JSON.stringify(skuList));
    }
  };

  var location = {
    provider : {gps:"gps",network:"network"},
    getLastKnownLocation : function(provider) {
      var result = ifs.location.getLastKnownLocation(provider);
      if(result==null) return null;
      else return JSON.parse(result);
    },
    requestLocationUpdates : function(provider,minTime,minDistance) {
      var result = ifs.location.requestLocationUpdates(provider,minTime,minDistance);
      if(result==null) return null;
      else return JSON.parse(result);
    },
    stopLocationUpdates : function() {
      ifs.location.stopLocationUpdates();
    },
    isProviderEnabled : function(provider) {
      return ifs.location.isProviderEnabled(provider);
    },
    getProviders : function(enabledOnly) {
      if(typeof enabledOnly ==='undefined'
      || (enabledOnly!==true && enabledOnly!==false)) enabledOnly = false;
      return JSON.parse(ifs.location.getProviders(enabledOnly));
    }
  };

  var clipboard = {
    hasText : function() { return ifs.clipboard.hasText(); },
    getText : function() { return ifs.clipboard.getText(); },
    setText : function(text) { ifs.clipboard.setText(text); }
  };

  var download = {
    start : function(info) {
      if(!info) throw new Error("No info provided for download.start()");
      if(!info.url) throw new Error("No 'url' provided for download.start()");
      if(!info.path) throw new Error("No 'path' provided for download.start()");
      var json = JSON.stringify(info);
      var id = ifs.download.startDownload(json);
      if(id==0) throw new Error(ifs.download.lastError());
      return id;
    },
    checkDownloadStatus: function(id) {
      var json = ifs.download.checkDownloadStatus(id);
      if(json==null) throw new Error("Cannot check download status: "+ifs.download.lastError());
      return JSON.parse(json);
    },
    remove: function(id) {
      ifs.download.remove(id);
    },
    status : { success:8,running:2,pending:1,paused:4,failed:16},
    reason : {waiting_to_retry:1,waiting_for_network:2,waiting_for_wifi:3,unknown:4,},
    visibility : {hidden:2,visible:0,visible_notify_completed:1}
  };

  var log = {
    read : function(thisProcessOnly) { return ifs.log.read(thisProcessOnly); }
  };

  var vibrator = {
    vibrate : function(msec) { ifs.vibrator.vibrate(msec); },
    cancel : function() { ifs.vibrator.cancel(); }
  };

  var resources = {
    getIdForName : function(name) {
      return ifs.activity.getIdForName(name);
    }
  };

  var sensors = {
    typeAmbientTemperature : 13,
    typeGameRotationVector : 15,
    typeGeomagneticRotationVector  : 20,
    typeGravity : 9,
    typeGyroscope : 4,
    typeGyroscopeUncalibrated : 16,
    typeHeartRate : 21,
    typeLight : 5,
    typeLinearAcceleration : 10,
    typeMagneticField : 2,
    typeMagneticFieldUncalibrated : 14,
    typePressure : 6,
    typeProximity : 8,
    typeRelativeHumidity : 12,
    typeRotationVector : 11,
    typeSignificantMotion : 17,
    typeStepCounter : 19,
    typeStepDetector : 18,
    typeTemperature : 7,

    enableSensor : function(type) {
      return ifs.sensors.enableSensor(type);
    },
    disableSensor : function(type) {
      ifs.sensors.disableSensor(type);
    }
  };

  var system = {
    getApiLevel: function() {
      var version = new JavaObject("android.os.Build$VERSION");
      return version.get_SDK_INT();
    },
    checkRuntimePermission: function(name) {
      var ver = android.system.getApiLevel();
      if(ver<23) {
        return true;
      }
      var cc = new JavaObject("android.support.v4.content.ContextCompat");
      var act = new JavaObject("activity");
      return cc.checkSelfPermission(act,name)==0;
    },
    requestPermissions: function(name) {
      var ver = android.system.getApiLevel();
      if(ver<23) return;
      var ac = new JavaObject("android.support.v4.app.ActivityCompat");
      var act = new JavaObject("activity");
      var names;
      if(Array.isArray(name)) names = name;
      else names = [name];
      var rc = requestCodeCounter++;
      ac.requestPermissions(act,names,rc);
    }

  };



  return {
    AssetFile : AssetFile,
    File : File,
    JavaObject : JavaObject,
    Reflect : Reflect,
    activity : activity,
    billing : billing,
    bitmaps : bitmaps,
    clipboard : clipboard,
    download : download,
    files : files,
    gravity : gravity,
    location : location,
    log : log,
    resources : resources,
    sensors : sensors,
    system: system,
    toast : toast,
    vibrator : vibrator,
    webView : webView
  };
})(window);
