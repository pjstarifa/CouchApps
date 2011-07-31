(function(a){function e(b){var a=b.split("/");if(a[0]=="_design")return a.shift(),"_design/"+encodeURIComponent(a.join("/"));return encodeURIComponent(b)}function d(b,i,c,d){i=a.extend({successStatus:200},i);d=a.extend({contentType:"application/json"},d);c=c||"Unknown error";return a.ajax(a.extend(a.extend({type:"GET",dataType:"json",cache:!a.browser.msie,beforeSend:function(b){if(d&&d.headers)for(var a in d.headers)b.setRequestHeader(a,d.headers[a])},complete:function(b){try{var o=a.parseJSON(b.responseText)}catch(d){i.error?
i.error(b.status,b,d):alert(c+": "+d);return}i.ajaxStart&&i.ajaxStart(o);b.status==i.successStatus?(i.beforeSuccess&&i.beforeSuccess(b,o),i.success&&i.success(o)):i.error?i.error(b.status,o&&o.error||c,o&&o.reason||"no response"):alert(c+": "+o.reason)}},b),d))}function c(b){b=b||{};if(typeof b.ensure_full_commit!=="undefined"){var a=b.ensure_full_commit;delete b.ensure_full_commit;return function(b){b.setRequestHeader("Accept","application/json");b.setRequestHeader("X-Couch-Full-Commit",a.toString())}}}
function j(b){var c=[];if(typeof b==="object"&&b!==null)for(var g in b)if(!(a.inArray(g,["error","success","beforeSuccess","ajaxStart"])>=0)){var d=b[g];a.inArray(g,["key","startkey","endkey"])>=0&&(d=h(d));c.push(encodeURIComponent(g)+"="+encodeURIComponent(d))}return c.length?"?"+c.join("&"):""}function h(b){return b!==null?JSON.stringify(b):null}a.couch=a.couch||{};var k=[];a.extend(a.couch,{urlPrefix:"",activeTasks:function(b){d({url:this.urlPrefix+"/_active_tasks"},b,"Active task status could not be retrieved")},
allDbs:function(b){d({url:this.urlPrefix+"/_all_dbs"},b,"An error occurred retrieving the list of all databases")},config:function(b,a,c,j){var l={url:this.urlPrefix+"/_config/"};a&&(l.url+=encodeURIComponent(a)+"/",c&&(l.url+=encodeURIComponent(c)));if(j===null)l.type="DELETE";else if(j!==void 0)l.type="PUT",l.data=h(j),l.contentType="application/json",l.processData=!1;d(l,b,"An error occurred retrieving/updating the server configuration")},session:function(b){b=b||{};a.ajax({type:"GET",url:this.urlPrefix+
"/_session",beforeSend:function(b){b.setRequestHeader("Accept","application/json")},complete:function(c){var g=a.parseJSON(c.responseText);c.status==200?b.success&&b.success(g):b.error?b.error(c.status,g.error,g.reason):alert("An error occurred getting session info: "+g.reason)}})},userDb:function(b){a.couch.session({success:function(c){c=a.couch.db(c.info.authentication_db);b(c)}})},signup:function(b,c,g){g=g||{};b=this.prepareUserDoc(b,c);a.couch.userDb(function(a){a.saveDoc(b,g)})},prepareUserDoc:function(b,
c){if(typeof hex_sha1=="undefined")alert("creating a user doc requires sha1.js to be loaded in the page");else{b._id=b._id||"org.couchdb.user:"+b.name;if(c)b.salt=a.couch.newUUID(),b.password_sha=hex_sha1(c+b.salt);b.type="user";if(!b.roles)b.roles=[];return b}},login:function(b){b=b||{};a.ajax({type:"POST",url:this.urlPrefix+"/_session",dataType:"json",data:{name:b.name,password:b.password},beforeSend:function(b){b.setRequestHeader("Accept","application/json")},complete:function(c){var g=a.parseJSON(c.responseText);
c.status==200?b.success&&b.success(g):b.error?b.error(c.status,g.error,g.reason):alert("An error occurred logging in: "+g.reason)}})},logout:function(b){b=b||{};a.ajax({type:"DELETE",url:this.urlPrefix+"/_session",dataType:"json",username:"_",password:"_",beforeSend:function(b){b.setRequestHeader("Accept","application/json")},complete:function(c){var g=a.parseJSON(c.responseText);c.status==200?b.success&&b.success(g):b.error?b.error(c.status,g.error,g.reason):alert("An error occurred logging out: "+
g.reason)}})},db:function(b,i){function g(b){if(b._id&&b._rev&&k[b._id]&&k[b._id].rev==b._rev)return typeof Base64=="undefined"?(alert("please include /_utils/script/base64.js in the page for base64 support"),!1):(b._attachments=b._attachments||{},b._attachments["rev-"+b._rev.split("-")[0]]={content_type:"application/json",data:Base64.encode(k[b._id].raw)},!0)}i=i||{};var k={};return{name:b,uri:this.urlPrefix+"/"+encodeURIComponent(b)+"/",compact:function(b){a.extend(b,{successStatus:202});d({type:"POST",
url:this.uri+"_compact",data:"",processData:!1},b,"The database could not be compacted")},viewCleanup:function(b){a.extend(b,{successStatus:202});d({type:"POST",url:this.uri+"_view_cleanup",data:"",processData:!1},b,"The views could not be cleaned up")},compactView:function(b,c){a.extend(c,{successStatus:202});d({type:"POST",url:this.uri+"_compact/"+b,data:"",processData:!1},c,"The view could not be compacted")},create:function(b){a.extend(b,{successStatus:201});d({type:"PUT",url:this.uri,contentType:"application/json",
data:"",processData:!1},b,"The database could not be created")},drop:function(b){d({type:"DELETE",url:this.uri},b,"The database could not be deleted")},info:function(b){d({url:this.uri},b,"Database information could not be retrieved")},changes:function(b,c){function g(b){a.each(m,function(){this(b)})}function i(){var g=a.extend({heartbeat:1E4},c,{feed:"longpoll",since:b});r=d({url:k.uri+"_changes"+j(g)},c,"Error connecting to "+k.uri+"/_changes.")}c=c||{};var h=100,k=this,e=!0,m=[],r;c.success=function(a){h=
100;if(e)b=a.last_seq,g(a),i()};c.error=function(){e&&(setTimeout(i,h),h*=2)};b?i():k.info({success:function(a){b=a.update_seq;i()}});return{onChange:function(b){m.push(b)},stop:function(){e=!1;if(r){try{r.abort()}catch(b){}r=null}}}},allDocs:function(b){var a="GET",c=null;if(b.keys)a="POST",c=b.keys,delete b.keys,c=h({keys:c});d({type:a,data:c,url:this.uri+"_all_docs"+j(b)},b,"An error occurred retrieving a list of all documents")},allDesignDocs:function(b){this.allDocs(a.extend({startkey:"_design",
endkey:"_design0"},b))},allApps:function(c){c=c||{};var g=this;c.eachApp?this.allDesignDocs({success:function(i){a.each(i.rows,function(){g.openDoc(this.id,{success:function(a){var g,i,d=a._id.split("/");d.shift();d=d.join("/");(g=a.couchapp&&a.couchapp.index)?i=["",b,a._id,g].join("/"):a._attachments&&a._attachments["index.html"]&&(i=["",b,a._id,"index.html"].join("/"));i&&c.eachApp(d,i,a)}})})}}):alert("Please provide an eachApp function for allApps()")},openDoc:function(b,c,g){c=c||{};i.attachPrevRev||
c.attachPrevRev?a.extend(c,{beforeSuccess:function(b,a){k[a._id]={rev:a._rev,raw:b.responseText}}}):a.extend(c,{beforeSuccess:function(b,a){a["jquery.couch.attachPrevRev"]&&(k[a._id]={rev:a._rev,raw:b.responseText})}});d({url:this.uri+e(b)+j(c)},c,"The document could not be retrieved",g)},saveDoc:function(b,i){i=i||{};var d=this,k=c(i),m=i.update&&i.update.split("/",2),q=m?"_design/"+m[0]+"/_update/"+m[1]+"/":"";delete i.update;b._id===void 0?(m="POST",q=this.uri+q):(m="PUT",q=this.uri+q+e(b._id));
var t=g(b);a.ajax({type:m,url:q+j(i),contentType:"application/json",dataType:"json",data:h(b),beforeSend:k,complete:function(c){var g=a.parseJSON(c.responseText);c.status==200||c.status==201||c.status==202?(b._id=g.id,b._rev=g.rev,t?d.openDoc(b._id,{attachPrevRev:!0,success:function(a){b._attachments=a._attachments;i.success&&i.success(g)}}):i.success&&i.success(g)):i.error?i.error(c.status,g.error,g.reason):alert("The document could not be saved: "+g.reason)}})},bulkSave:function(b,g){var i=c(g);
a.extend(g,{successStatus:201,beforeSend:i});d({type:"POST",url:this.uri+"_bulk_docs"+j(g),contentType:"application/json",data:h(b)},g,"The documents could not be saved")},removeDoc:function(b,a){d({type:"DELETE",url:this.uri+e(b._id)+j({rev:b._rev})},a,"The document could not be deleted")},bulkRemove:function(b,c){b.docs=a.each(b.docs,function(b,a){a._deleted=!0});a.extend(c,{successStatus:201});d({type:"POST",url:this.uri+"_bulk_docs"+j(c),data:h(b)},c,"The documents could not be deleted")},copyDoc:function(b,
c,g){g=a.extend(g,{complete:function(b){var g=a.parseJSON(b.responseText);b.status==201?c.success&&c.success(g):c.error?c.error(b.status,g.error,g.reason):alert("The document could not be copied: "+g.reason)}});d({type:"COPY",url:this.uri+e(b)},c,"The document could not be copied",g)},query:function(b,a,c,g){c=c||"javascript";typeof b!=="string"&&(b=b.toSource?b.toSource():"("+b.toString()+")");b={language:c,map:b};if(a!=null)typeof a!=="string"&&(a=a.toSource?a.toSource():"("+a.toString()+")"),b.reduce=
a;d({type:"POST",url:this.uri+"_temp_view"+j(g),contentType:"application/json",data:h(b)},g,"An error occurred querying the database")},list:function(b,a,c,g){b=b.split("/");c=c||{};var i="GET",k=null;if(c.keys)i="POST",k=c.keys,delete c.keys,k=h({keys:k});d({type:i,data:k,url:this.uri+"_design/"+b[0]+"/_list/"+b[1]+"/"+a+j(c)},g,"An error occured accessing the list")},view:function(b,a){b=b.split("/");a=a||{};var c="GET",g=null;if(a.keys)c="POST",g=a.keys,delete a.keys,g=h({keys:g});d({type:c,data:g,
url:this.uri+"_design/"+b[0]+"/_view/"+b[1]+j(a)},a,"An error occurred accessing the view")},getDbProperty:function(b,a,c){d({url:this.uri+b+j(a)},a,"The property could not be retrieved",c)},setDbProperty:function(b,a,c,g){d({type:"PUT",url:this.uri+b+j(c),data:JSON.stringify(a)},c,"The property could not be updated",g)}}},encodeDocId:e,info:function(b){d({url:this.urlPrefix+"/"},b,"Server information could not be retrieved")},replicate:function(b,c,g,j){j=a.extend({source:b,target:c},j);if(j.continuous&&
!j.cancel)g.successStatus=202;d({type:"POST",url:this.urlPrefix+"/_replicate",data:JSON.stringify(j),contentType:"application/json"},g,"Replication failed")},newUUID:function(b){b===void 0&&(b=1);k.length||d({url:this.urlPrefix+"/_uuids",data:{count:b},async:!1},{success:function(b){k=b.uuids}},"Failed to retrieve UUID batch.");return k.shift()}})})(jQuery);(function(a){function e(a,b,c){this.doc_id="_design/"+b;this.code_path=c?this.doc_id+"/"+c:this.doc_id;this.view=function(c,i){a.view(b+"/"+c,i)};this.list=function(c,i,d){a.list(b+"/"+c,i,d)}}function d(){alert("docForm has been moved to vendor/couchapp/lib/docForm.js, use app.require to load")}function c(a,b,i,g){i=i||[];if(b.length===0){if(typeof g!="string")throw["error","invalid_require_path","Must require a JavaScript string, not: "+typeof g];return[g,i]}var d=b.shift();if(d==".."){i.pop();
g=i.pop();if(!g)throw["error","invalid_require_path",a];return c(a,b,i,g)}else if(d=="."){g=i.pop();if(!g)throw["error","invalid_require_path",a];return c(a,b,i,g)}else i=[];if(!g[d])throw["error","invalid_require_path",a];i.push(g);return c(a,b,i,g[d])}function j(a){function b(b,a){var c,g,d=i.length;for(g=0;g<d;++g)if(c=i[g].key,c[0]===b&&c[1]===a)return i[g].module;return null}var i=[],g=function(d,j){var h=b(d,j);if(h!==null)return h;h={};var e=c(d,d.split("/"),j,a),p=e[0];j=e[1];try{eval("var func = function (exports, require) { "+
p+" };"),func.apply(a,[h,function(b){return g(b,j)}])}catch(s){throw["error","compilation_error","Module require('"+d+"') raised error "+s.toSource()];}i.push({key:[d,j],module:h});return h};return g}function h(){var a=document.location.pathname.split("/"),b={};document.location.search.replace(/^\?/,"").split("&").forEach(function(a){var c=a.split("=");a=decodeURIComponent(c[0]);c=decodeURIComponent(c[1]);b[a]=["startkey","endkey","key"].indexOf(a)!=-1?JSON.parse(c):c});a.shift();return{path:a,query:b}}
a.couch.app=a.couch.app||function(c,b){function i(b){if(b)p.ddoc=b,p.require=j(b);c.apply(p,[p])}b=b||{};var g=b.urlPrefix||"",m=g.split("/").length,l=unescape(document.location.href).split("/"),o=b.db||l[m+2];m=b.design||l[m+4];a.couch.urlPrefix=g;g=a.couch.db(o);var n=new e(g,m,b.load_path),p=a.extend({db:g,design:n,view:n.view,list:n.list,docForm:d,req:h()},a.couch.app.app);if(b.ddoc)a.couch.app.ddocs[n.doc_id]=b.ddoc;a.couch.app.ddocs[n.doc_id]?a(function(){i(a.couch.app.ddocs[n.doc_id])}):a.couch.app.ddoc_handlers[n.doc_id]?
a.couch.app.ddoc_handlers[n.doc_id].push(i):(a.couch.app.ddoc_handlers[n.doc_id]=[i],g.getDbProperty(n.code_path,{success:function(b){a.couch.app.ddocs[n.doc_id]=b;a.couch.app.ddoc_handlers[n.doc_id].forEach(function(c){a(function(){c(b)})});a.couch.app.ddoc_handlers[n.doc_id]=null},error:function(){a.couch.app.ddoc_handlers[n.doc_id].forEach(function(b){a(function(){b()})});a.couch.app.ddoc_handlers[n.doc_id]=null}}))};a.couch.app.ddocs={};a.couch.app.ddoc_handlers={};a.CouchApp=a.couch.app})(jQuery);
if(!Array.prototype.forEach)Array.prototype.forEach=function(a,e){var d=this.length>>>0;if(typeof a!="function")throw new TypeError;for(var c=0;c<d;c++)c in this&&a.call(e,this[c],c,this)};if(!Array.prototype.indexOf)Array.prototype.indexOf=function(a,e){var d=this.length>>>0,c=Number(e)||0;c=c<0?Math.ceil(c):Math.floor(c);for(c<0&&(c+=d);c<d;c++)if(c in this&&this[c]===a)return c;return-1};$.log=function(a){window&&window.console&&window.console.log&&window.console.log(arguments.length==1?a:arguments)};$.fn.serializeObject=function(){var a={},e=this.serializeArray();$.each(e,function(){a[this.name]?(a[this.name].push||(a[this.name]=[a[this.name]]),a[this.name].push(this.value||"")):a[this.name]=this.value||""});return a};function escapeHTML(a){return a&&a.replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}
function safeHTML(a,e){return a?escapeHTML(a.substring(0,e)):""}$.linkify=function(a){return a.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,function(a){return'<a target="_blank" href="'+a+'">'+a+"</a>"}).replace(/\@([\w\-]+)/g,function(a,d){return'<a href="#/mentions/'+encodeURIComponent(d.toLowerCase())+'">'+a+"</a>"}).replace(/\#([\w\-\.]+)/g,function(a,d){return'<a href="#/tags/'+encodeURIComponent(d.toLowerCase())+'">'+a+"</a>"})};
$.fn.prettyDate=function(){$(this).each(function(){var a;a=(a=$(this).attr("title"))?$.prettyDate(a):$.prettyDate($(this).text());$(this).text(a)})};
$.prettyDate=function(a){var e=new Date(a.replace(/-/g,"/").replace("T"," ").replace("Z"," +0000").replace(/(\d*\:\d*:\d*)\.\d*/g,"$1"));e=((new Date).getTime()-e.getTime())/1E3;var d=Math.floor(e/86400);if(isNaN(d))return a;return d<1&&(e<60&&"just now"||e<120&&"1 minute ago"||e<3600&&Math.floor(e/60)+" minutes ago"||e<7200&&"1 hour ago"||e<86400&&Math.floor(e/3600)+" hours ago")||d==1&&"yesterday"||d<21&&d+" days ago"||d<45&&Math.ceil(d/7)+" weeks ago"||a};
$.argsToArray=function(a){if(!a.callee)return a;for(var e=[],d=0;d<a.length;d++)e.push(a[d]);return e};(function(a){var e=function(){var a=function(){};a.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":!0},context:{},render:function(a,d,h,k){if(!k)this.context=d,this.buffer=[];if(!this.includes("",a))if(k)return a;else{this.send(a);return}a=this.render_pragmas(a);a=this.render_section(a,d,h);if(k)return this.render_tags(a,d,h,k);this.render_tags(a,d,h,k)},send:function(a){a!=""&&this.buffer.push(a)},render_pragmas:function(a){if(!this.includes("%",a))return a;
var d=this;return a.replace(RegExp(this.otag+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+this.ctag),function(a,c,b){if(!d.pragmas_implemented[c])throw{message:"This implementation of mustache doesn't understand the '"+c+"' pragma"};d.pragmas[c]={};b&&(a=b.split("="),d.pragmas[c][a[0]]=a[1]);return""})},render_partial:function(a,d,h){a=this.trim(a);if(!h||h[a]===void 0)throw{message:"unknown_partial '"+a+"'"};if(typeof d[a]!="object")return this.render(h[a],d,h,!0);return this.render(h[a],d[a],h,!0)},render_section:function(a,
d,h){if(!this.includes("#",a)&&!this.includes("^",a))return a;var e=this;return a.replace(RegExp(this.otag+"(\\^|\\#)\\s*(.+)\\s*"+this.ctag+"\n*([\\s\\S]+?)"+this.otag+"\\/\\s*\\2\\s*"+this.ctag+"\\s*","mg"),function(b,a,c,m){b=e.find(c,d);if(a=="^")return!b||e.is_array(b)&&b.length===0?e.render(m,d,h,!0):"";else if(a=="#")return e.is_array(b)?e.map(b,function(b){return e.render(m,e.create_context(b),h,!0)}).join(""):e.is_object(b)?e.render(m,e.create_context(b),h,!0):typeof b==="function"?b.call(d,
m,function(b){return e.render(b,d,h,!0)}):b?e.render(m,d,h,!0):""})},render_tags:function(a,d,h,e){var b=this,i=function(){return RegExp(b.otag+"(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"+b.ctag+"+","g")},g=i(),m=function(a,c,e){switch(c){case "!":return"";case "=":return b.set_delimiters(e),g=i(),"";case ">":return b.render_partial(e,d,h);case "{":return b.find(e,d);default:return b.escape(b.find(e,d))}};a=a.split("\n");for(var l=0;l<a.length;l++)a[l]=a[l].replace(g,m,this),e||this.send(a[l]);if(e)return a.join("\n")},
set_delimiters:function(a){a=a.split(" ");this.otag=this.escape_regex(a[0]);this.ctag=this.escape_regex(a[1])},escape_regex:function(a){if(!arguments.callee.sRE)arguments.callee.sRE=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)","g");return a.replace(arguments.callee.sRE,"\\$1")},find:function(a,d){a=this.trim(a);var h;d[a]===!1||d[a]===0||d[a]?h=d[a]:(this.context[a]===!1||this.context[a]===0||this.context[a])&&(h=this.context[a]);if(typeof h==="function")return h.apply(d);if(h!==
void 0)return h;return""},includes:function(a,d){return d.indexOf(this.otag+a)!=-1},escape:function(a){return String(a===null?"":a).replace(/&(?!\w+;)|["<>\\]/g,function(a){switch(a){case "&":return"&amp;";case "\\":return"\\\\";case '"':return'"';case "<":return"&lt;";case ">":return"&gt;";default:return a}})},create_context:function(a){if(this.is_object(a))return a;else{var d=".";if(this.pragmas["IMPLICIT-ITERATOR"])d=this.pragmas["IMPLICIT-ITERATOR"].iterator;var h={};h[d]=a;return h}},is_object:function(a){return a&&
typeof a=="object"},is_array:function(a){return Object.prototype.toString.call(a)==="[object Array]"},trim:function(a){return a.replace(/^\s*|\s*$/g,"")},map:function(a,d){if(typeof a.map=="function")return a.map(d);else{for(var h=[],e=a.length,b=0;b<e;b++)h.push(d(a[b]));return h}}};return{name:"mustache.js",version:"0.3.1-dev",to_html:function(c,e,h,k){var b=new a;if(k)b.send=k;b.render(c,e,h);if(!k)return b.buffer.join("\n")},escape:function(c){return(new a).escape(c)}}}();a.mustache=function(a,
c,j){return e.to_html(a,c,j)};a.mustache.escape=function(a){return e.escape(a)}})(jQuery);(function(a){function e(){l=h();if(o!=l)return o=l,c(l)}function d(b){function c(){l=h();o!=l&&setTimeout(function(){a(window).trigger("hashchange")},1)}c();n=setInterval(c,b);a(window).bind("unload",function(){clearInterval(n)})}function c(b){b=b.replace(/^#/,"");a.pathbinder.changeFuns.forEach(function(a){a(b)});for(var c,g,d={},i,e,h=0;h<a.pathbinder.paths.length;h++)if(c=a.pathbinder.paths[h],(g=c.matcher.exec(b))!==null){g.shift();for(var j=0;j<g.length;j++)if(i=c.param_names[j],e=decodeURIComponent(g[j]),
i)d[i]=e;else{if(!d.splat)d.splat=[];d.splat.push(e)}c.callback(d)}}function j(a){if(a)window.location="#"+a;o=h()}function h(){var a=window.location.toString().match(/^[^#]*(#.+)$/);return a?a[1]:""}function k(a,c){var d=[];for(i.lastIndex=0;(path_match=i.exec(a))!==null;)d.push(path_match[1]);return{param_names:d,matcher:RegExp("^"+a.replace(i,b).replace(g,m)+"/?$"),template:a.replace(i,function(a,b){return"{{"+b+"}}"}).replace(g,"{{splat}}"),callback:c}}var b="([^/]+)",i=/:([\w\d]+)/g,g=/(\*)/,
m="(.+)",l,o,n;a.pathbinder={changeFuns:[],paths:[],begin:function(b){a(function(){var a=h();a?c(a):(j(b),c(b))})},go:function(a){j(a);c(a)},currentPath:function(){return h()},onChange:function(b){a.pathbinder.changeFuns.push(b)}};a(function(){"onhashchange"in window||d(10);a(window).bind("hashchange",e)});a.fn.pathbinder=function(b,c,d){d=d||{};var g=a(this);c=c.split(/\n/);a.each(c,function(){if(this){var c=k(this,function(a){g.trigger(b,[a])});d.bindPath&&g.bind(b,function(b,d){d=d||{};var g=a.mustache(c.template,
d);j(g)});a.pathbinder.paths.push(c)}})}})(jQuery);function $$(a){if(!a){if($$(window).localStorage)return $$(window).localStorage;return $$(window).localStorage={get:function(a){try{var c=JSON.parse(this._storage[a])}catch(e){}return c!==null&&typeof c==="object"?c:{}},set:function(a,c){try{return this._storage[a]=JSON.stringify(c)}catch(e){$.log(e)}},_storage:window.localStorage||{}}}var e=$(a).data("$$");e||(e={},$(a).data("$$",e));return e}
(function(a){function e(b,c){if(b&&b.match&&b.match(/^function/)&&(eval("var f = "+b),typeof f=="function"))return function(){try{var d=f.apply(this,arguments)}catch(e){throw a.log({message:"Error in evently function.",error:e,src:b,hint:c}),e;}if(c==="_init")return!1;return d};return b}function d(b,c){var d=[!0,{}],e=c.evently||{};a.forIn(c.vendor||{},function(a,c){c.evently&&c.evently[b]&&d.push(c.evently[b])});e[b]&&d.push(e[b]);return a.extend.apply(null,d)}function c(b){b._common&&(a.forIn(b,
function(c,d){b[c]=a.extend(!0,{},b._common,d)}),delete b._common);return b}function j(b,c,d,k){if(a.isArray(d))for(var l=0;l<d.length;l++)j(b,c,d[l],k);else{var o=e(d,c);typeof o=="function"?b.bind(c,{args:k},o):typeof o=="string"?b.bind(c,{args:k},function(){a(this).trigger(o);return!1}):b.bind(c,{args:k},function(){h(a(this),d,arguments);return!1});d.path&&b.pathbinder(c,d.path)}}function h(b,c,d,e){e=e||{};var j,k=a.evently.fn.before;for(j in k)if(k.hasOwnProperty(j)&&c[j]&&!e[j]){e[j]=!0;k[j].apply(b,
[c,function(){h(b,c,a.argsToArray(arguments).concat(a.argsToArray(d)),e)},d]);return}var n;a.forIn(a.evently.fn.render,function(a,e){c[a]&&(n=e.apply(b,[c,d]))});a.forIn(a.evently.fn.after,function(a,e){c[a]&&e.apply(b,[c,n,d])})}function k(a,i,g){if(g)$$(a).app=g;typeof i=="string"&&(i=d(i,g.ddoc));i=c(i);$$(a).evently=i;if(g&&g.ddoc)$$(a).partials=d("_partials",g.ddoc);return i}a.log=function(a){window&&window.console&&window.console.log&&window.console.log(arguments.length==1?a:arguments)};a.forIn=
function(a,c){for(var d in a)a.hasOwnProperty(d)&&c(d,a[d])};a.argsToArray=function(a){if(!a.callee)return a;for(var c=[],d=0;d<a.length;d++)c.push(a[d]);return c};a.fn.replace=function(b){a(this).empty().append(b)};a.fn.evently=function(b,c,d){var e=a(this);b=k(e,b,c);a.forIn(b,function(a,b){j(e,a,b,d)});a.forIn(a.evently.fn.setup,function(a,c){b[a]&&c.apply(e,[b[a],d])});return this};a.evently={connect:function(b,c,d){d.forEach(function(d){a(b).bind(d,function(){var b=a.makeArray(arguments),g=b.shift();
b.push(g);a(c).trigger(d,b);return!1})})},paths:[],changesDBs:{},changesOpts:{},utils:{rfun:function(a,c,d){var h=e(c,a);return typeof h=="function"?h.apply(a,d):c},evfun:e},fn:{setup:{},before:{},render:{},after:{}}}})(jQuery);(function(a){a.evently.fn.setup._init=function(a,d){this.trigger("_init",d)}})(jQuery);(function(a){a.evently.fn.before.before=function(e,d,c){a.evently.utils.evfun(e.before,this).apply(this,c);d()}})(jQuery);
(function(a){a.evently.fn.before.async=function(e,d,c){a.evently.utils.evfun(e.async,this).apply(this,[d].concat(a.argsToArray(c)))}})(jQuery);(function(a){var e=a.evently.utils.rfun;a.evently.fn.render.mustache=function(d,c){var j=(d.render||"replace").replace(/\s/g,""),h;h=$$(this).partials;h=a(a.mustache(e(this,d.mustache,c),e(this,d.data,c),e(this,a.extend(!0,h,d.partials),c)));this[j](h);return h}})(jQuery);
(function(a){a.evently.fn.after.selectors=function(e,d,c){var j=(e.render||"replace").replace(/\s/g,""),h=$$(this).app,k=j=="replace"?this:d;e=a.evently.utils.rfun(this,e.selectors,c);a.forIn(e,function(b,d){a(b,k).evently(d,h,c)})}})(jQuery);(function(a){a.evently.fn.after.after=function(e,d,c){a.evently.utils.rfun(this,e.after,c)}})(jQuery);(function(a){function e(c){var e=c.db.name,h=function(c){a("body").trigger("evently-changes-"+e,[c])};if(!a.evently.changesDBs[e]){if(c.db.changes)c.db.changes(null,a.evently.changesOpts).onChange(h);else d(c,h);a.evently.changesDBs[e]=!0}}function d(c,e,h){function k(b){b=c.db.uri+"_changes?heartbeat=10000&feed=longpoll&since="+b;a.evently.changesOpts.include_docs&&(b+="&include_docs=true");a.ajax({url:b,contentType:"application/json",dataType:"json",complete:function(b){b=a.httpData(b,"json");e(b);
d(c,e,b.last_seq)}})}h?k(h):c.db.info({success:function(a){k(a.update_seq)}})}a.evently.fn.setup._changes=function(){var c=this,d=$$(this).app;d&&(a("body").bind("evently-changes-"+d.db.name,function(){c.trigger("_changes")}),e(d),c.trigger("_changes"))};a.evently.followChanges=e})(jQuery);
(function(a){function e(a,c,e,h){var k,b=h.success,i=!1;h.success=function(c){$$(a).inFlight=!1;var e=JSON.stringify($$(a).highKey);c.rows=c.rows.filter(function(a){return JSON.stringify(a.key)!=e});if(c.rows.length>0)h.descending?$$(a).highKey=c.rows[0].key:$$(a).highKey=c.rows[c.rows.length-1].key;b&&b(c,i)};k=h.descending?e+(h.startkey?JSON.stringify(h.startkey):""):e+(h.endkey?JSON.stringify(h.endkey):"");if(k==$$(a).lastViewId){k=$$(a).highKey;if(k!==void 0)h.descending?h.endkey=k:h.startkey=
k;if(!$$(a).inFlight)$$(a).inFlight=!0,c.view(e,h)}else i=!0,$$(a).lastViewId=k,$$(a).highKey=void 0,$$(a).inFlight=!0,c.view(e,h)}a.evently.fn.before.query=function(d,c,j){var h=$$(this).app;d=a.evently.utils.rfun(this,d.query,j);j=d.type;var k=d.view,b=d.success,i={};a.forIn(d,function(a,b){["type","view"].indexOf(a)==-1&&(i[a]=b)});j=="newRows"?(i.success=function(a){a.rows.reverse().forEach(c);b&&b(a)},e(this,h,k,i)):(i.success=function(a){c(a);b&&b(a)},h.view(k,i))}})(jQuery);
