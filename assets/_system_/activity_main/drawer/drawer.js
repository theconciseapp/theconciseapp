//localStorage.removeItem("schoolRegistered")

var selectedKey = "drawerSelected";
var selectedClass = "selected";
var list = [];
var spec = {items:[]};

function srap(){ 
   // set reload all pages 
  localStorage.setItem('reload_all_pages',randomString(7));
 }


var pagesToPreLoad=[];
var itemsToHide=[];

function isInArray(value, array) {
return array.indexOf(value) > - 1 ;
}

function preLoadPage(idx){
   if (idx===undefined||idx===null) return false;
  if (isInArray( idx, pagesToPreLoad) ) return true;
   return false;
}

function hide(idx){
  if (idx===undefined||idx===null) return false;
  if (isInArray( idx, itemsToHide) ) return true;
   return false;
}


function loadJson() {
  var temp_=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
 // var file = new android.File( TEMPLATES_DIR , temp_ + "/drawer/drawer.json");  
// var file=new android.AssetFile("_system_/activity_main/drawer/drawer.json");
var file=new android.AssetFile("drawer-pages/0.json");
 
  if(!file.isFile() ) { android.toast.show("Missing asset file: drawer.json"); return;}
 try {
    var json = file.read();
    spec = JSON.parse(json);
  }
  catch(e) { android.toast.show("Could not read or parse file: drawer.json"); return; }
}


function switchToPage(idx) {
   var pages = spec.items;
   for(var i=0; i<pages.length; ++i) {
     var id = ""+(100+i);
     
 if(i!=idx) {
  android.activity.hideView(id);
   }
    else { 
 localStorage.setItem("custom_drawer_page",  pages[i].page);
 localStorage.setItem("custom_drawer_title", pages[idx].title);
       
 android.activity.showView(id);
 
if( pages[i].loaded) android.activity.loadUrl("" + id , "javascript:" + pages[i].callFunction );    

if(pages[i].url && !pages[i].loaded) { 
 android.activity.loadUrl("" + id, ASSETS_DOMAIN + '/' + pages[i].url);
 pages[i].loaded = true;     
}
     
 }
   }
 if(spec.setActivityTitle){
   android.activity.setTitle(pages[idx].title);
   }

}

function markSelected(id) {
  for(var i=0; i<list.length; ++i) {
    var li = list[i];
    if(li.id==id) {
      li.className = "menuItem selected " + selectedClass;
      li.style.backgroundColor = (spec.style && spec.style.selected)?spec.style.selected:"";
    }
    else {
      li.className = "menuItem";
      li.style.backgroundColor = "";
    }
  }
}

function selectItem(item) {
    markSelected(item.id);
    var idx = parseInt(item.id);
  if(spec.persistSelection) localStorage.setItem( selectedKey,""+idx);
  switchToPage(idx);
  android.activity.closeDrawer(android.gravity.START); 
}

function restoreSelection() {
   var idx = 0;
   if(spec.persistSelection) {
     var sIdx = localStorage.getItem(selectedKey);
     if(sIdx!=null) {
       idx = parseInt(sIdx);
       if(isNaN(idx)|| idx<0 || idx>=spec.items.length) idx = 0;
     }
   }
   markSelected(""+idx);
   switchToPage(idx);
  }

var countViewsInflated = 0;

function viewInflated(evt) {
  var id = evt.detail.id;
  var pages = spec.items;
 
  if(id<100||id>=100+pages.length) return;
  var idx = id-100;
    
  if (pages[idx].url && preLoadPage( idx ) ){ 
    android.activity.loadUrl(""+id, ASSETS_DOMAIN + '/' + pages[idx].url);  
   pages[idx].loaded = true;
  }

   if(++countViewsInflated==pages.length) restoreSelection();
}

function createViews() {
 
  if(countViewsInflated!=0) return;
  document.addEventListener("viewInflated",viewInflated);
  var pages = spec.items;
  for(var i=0; i<pages.length; ++i) {
    var layout = "page";
    if(pages[i].layout) layout = pages[i].layout;
    android.activity.inflateView(layout,"content", 100+i);
  }
}

function populateMenu() {

  var temp_=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  
  var ul = document.getElementById("menu");
      ul.innerHTML='';
  
  var pages = spec.items;
  for(var i=0; i<pages.length; ++i) {
    var page = pages[i];
   
    var li = document.createElement("li");
    li.className = "menuItem";
    if(spec.style && spec.style.menuItem) li.style.color = spec.style.menuItem;
    li.id = i;
if(hide(i)){
    li.style.display="none";
}
    var imgCont = document.createElement("span");
        imgCont.className = "menuItemIconContainer";
        li.appendChild(imgCont);
   
 var img = document.createElement("img");
     img.className = "menuItemIcon";
     
  if( page.icon) { 
     img.src = "file:///assets/drawer-pages/drawer-icons/" + page.icon;
     imgCont.appendChild(img);
   }
    else{
      img.src = TEMPLATES_DIR + "/" + temp_ + "/drawer/icons/" + i + ".png";  //page.icon;
      imgCont.appendChild(img);
    } 
    
    var span = document.createElement("span");
    span.className = "menuItemTitle";
    span.innerText=page.title
    li.appendChild(span);
    li.onclick = function() { 
     if(this.id=="x") {  
       helpline();
     }
      else selectItem(this);
    }
    ul.appendChild(li);
    list.push(li);
    if(page.separator) {
      var hr = document.createElement("hr");
      ul.appendChild(hr);
    }
    
   
    
  }

 }

function loadCss_(){
  //Load activated template drawer css
  //if available
  var temp_=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  var file=new android.AssetFile(ASSETS_DOMAIN, "_system_/activity_main/drawer/drawer.css");
  
  if(temp_){
  var tfile=new android.File(TEMPLATES_DIR, temp_ + "/drawer/drawer.css");
  
  if( tfile.isFile() ){
    file=tfile;
   }
  }
  file=file.toString() + "?i=" + randomString(4);
  document.head.innerHTML += '<link rel="stylesheet" href="' + miniProtect( file ) + '" type="text/css"/>';
}


function loadLogo(){
  var lfile=new android.File( SCHOOL_DIR, "school-thumb.png");
  var tfile=new android.File( SCHOOL_DIR, "teacher-thumb.png");
  var lCont=document.getElementById("logoContainer");
 lCont.innerHTML="";
  
  var rand_=randomString(4);
  
  if( lfile.isFile()){
   var img = document.createElement("img");
      img.src = lfile.toString() + "?i=" + rand_;
      img.className = "schoolLogoIcon";
      lCont.appendChild(img);
  }
  
  if( tfile.isFile()){
   var img = document.createElement("img");
      img.src = tfile.toString() + "?y=" + rand_;
      img.className = "teacherIcon";
      lCont.appendChild(img);
  }
 }



function onLoad() {
  loadJson();
  if(spec.style && spec.style.background) document.body.style.backgroundColor = spec.style.background;
  if(spec.style && spec.style.header) document.getElementById("header").style.backgroundColor = spec.style.header;
  populateMenu();
  createViews();  
  var appv=document.getElementById('this_version');
   appv.innerText='v' + APP_VERSION;
  var appid=document.getElementById('APP--ID');
   appid.innerText=appId();
  
   loadCss_();
   load_();
 }

function sendAppId(){
   openInBrowser( whatsApp('*AppId: ' + appId() + '*\nHello The Concise App!') );
}


function copyAppId(){
  var aid=document.getElementById("APP--ID");
  android.clipboard.setText(aid.innerText);
  android.toast.show("App ID copied");
}

function menuAppLabel(){
  var nt=document.getElementById("NOTE--TITLE");
   nt.innerText=APP_LABEL__;
}


function load_(){
  populateMenu();
  menuAppLabel();
 
}

function reload(){
  loadCss_();
  populateMenu();
  menuAppLabel();
  loadLogo();
 
}

window.addEventListener("storage",function(e){
 if (e.key=='reload_drawer') {
   reload();
    }else if( e.key=="drawer_select_item"){
     var list_={};
     var item= localStorage.getItem("drawer_select_item")||"e|0";
     
      item=item.split("|")[1];
      list_.id=item;
      selectItem(list_);
    }
});
