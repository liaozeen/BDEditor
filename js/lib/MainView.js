var gMainView = null;
var gResList = [];
//////////////////////////////////////////////////////////////////////////
var CMainView = function(parent_wnd, w, h) {
	var o = GetQueryStringArgs();
	if (o && o['qdsoft'])
	{
		this.mQdSoftid = o['qdsoft'];
	}else{
		var s = localStorage.getItem("loginCorpInfo");
		if (s!='')
		{
			var o = JSON.parse(s)
			this.mQdSoftid = o.qdSoftId;
		}
	}
	this.mUserId = localStorage.getItem("logName");
	
	this.FuncSaveData = null;
	
	this.mParentWnd = parent_wnd;
	this.mWidth = w;
	this.mHeight = h;	
	this.mWnd = document.createElement('div');
	this.mWnd.width = w;
	this.mWnd.height = h;
	this.mWnd.setAttribute('class', "window");
	this.mWnd['Owner'] = this;
	parent_wnd.appendChild( this.mWnd );
	
	this.mToolBar = document.createElement('div');
	this.mToolBar.style.width = w.toString() + 'px';
	this.mToolBar.style.height = '25px';
	this.mWnd.appendChild( this.mToolBar );
	
	var t = h - 25;
	this.mTextEditor = document.createElement('textarea');
	this.mTextEditor.style.position = 'absolute';
	this.mTextEditor.style.top = '25px';
	this.mTextEditor.style.width = w.toString() + 'px';
	this.mTextEditor.style.height = t.toString() + 'px';
	this.mTextEditor['Owner'] = this;
	this.mWnd.appendChild( this.mTextEditor );
	
	this.mEditor = CodeMirror.fromTextArea(this.mTextEditor, {
		lineNumbers: true,
		lineWrapping:true,
		mode: "text/html",
	});
	
	var editor = this.mEditor.getWrapperElement();
	editor.style.position = 'absolute';
	
	this.mSvgEditor = document.createElement('iframe');
	this.mSvgEditor.src = 'http://qdsoft.huaguangsoft.com/Method-Draw/editor/index.html';
	this.mSvgEditor.style.position = 'absolute';
	this.mSvgEditor.style.visibility = 'hidden';
	this.mSvgEditor.top = '25px';
	this.mSvgEditor.width = w.toString() + 'px';
	this.mSvgEditor.height = t.toString() + 'px';
	this.mSvgEditor['Owner'] = this;
	this.mWnd.appendChild( this.mSvgEditor );
	this.mSvgEditor.onload = function(){
		this['Owner'].mSvgCanvas = new embedded_svg_edit(this);
		
		var doc = this.contentDocument;
		if (!doc)doc = this.contentWindow.document;
		var btn = doc.getElementById('main_button');
		if (btn)btn.style.display = 'none';   
	};
	
	var list = [];
	list.push( {id:"tb_save", title:"保存", func:this.OnBtnClick, background:"save24.png"} );
	list.push( {id:"tb_exportpdf", title:"导出PDF", func:this.OnBtnClick, background:"pdf24.png"} );
	list.push( {id:"tb_texteditor", title:"文本编辑", func:this.OnBtnClick, background:"editor24.png"} );
	
	this.mBtn = [];
	for(var i=0; i<list.length; i++)
	{
		this.mBtn.push(document.createElement('a'));
		this.mBtn[i].setAttribute('href', "javascript:void(0)");	
		this.mBtn[i]['Owner'] = this;
		
		this.mBtn[i].setAttribute('class', "button24");
		this.mBtn[i].setAttribute('title', list[i].title);
		this.mBtn[i].onclick = list[i].func;
		
		this.mBtn[i].id = list[i].id;
		//this.mBtn[i].innerText = list[i].title;
		
		this.mBtn[i]['check'] = 0;
		this.mBtn[i].style.background = "url('http://qdsoft.huaguangsoft.com/htmloutput/App/res/" + list[i].background + "')";
		this.mToolBar.appendChild( this.mBtn[i] );
	}
};

CMainView.prototype.ResizeView = function(w, h)
{
	this.mWidth = w;
	this.mHeight = h;	
	this.mWnd.style.width = w.toString() + 'px';
	this.mWnd.style.height = h.toString() + 'px';
	this.UpdateViewLayout(w, h);
}

CMainView.prototype.UpdateViewLayout = function(w, h)
{
	this.mToolBar.style.width = w.toString() + 'px';
	h = h-25;
	this.mEditor.setSize(w.toString() + 'px', h.toString() + 'px');
	
	this.mSvgEditor.width = w.toString() + 'px';
	this.mSvgEditor.height = h.toString() + 'px';
	
	var x = 2;
	var y = 1;
	for(var i=0; i<this.mBtn.length; i++)
	{
		x = 2 + i*25;
		this.mBtn[i].style.left = x.toString() + 'px';
		this.mBtn[i].style.top = y.toString() + 'px';
	}	
}

CMainView.prototype.OnBtnClick = function ()
{
	var view = this['Owner'];
	if (!view)return;
	
	if (this.id=='tb_save')
	{
		if (view.FuncSaveData)
		{
			if (view.mSvgEditor.style.visibility == 'visible')
			{
				var func = view.mSvgCanvas.getSvgString();
				func(function(data, error){
					if (!error)
					{
						view.mEditor.setValue(data);
						view.FuncSaveData(data);
					}
				});
			}else{
				var s = view.mEditor.getValue();
				view.FuncSaveData(s);
			}
		}
	}
	if (this.id=='tb_exportpdf')
	{
		var url = 'http://qdsoft.huaguangsoft.com/SvgToPdf/produce/';
		var s = view.mEditor.getValue();
		var data = 'svg=' + encodeURIComponent(s);
		PostHttpData(url, data, function (response) {
			var o = JSON.parse(response);
			if (o.result==1)
			{
				window.open("http://qdsoft.huaguangsoft.com/pdf_viewer/web/viewer.html?file=" + encodeURIComponent(o.downurl));
			}
		});
	}
	if (this.id=='tb_texteditor')
	{
		var editor = gMainView.mEditor.getWrapperElement();
		if (editor.style.visibility!='visible')
		{
			editor.style.visibility = 'visible';
			view.mSvgEditor.style.visibility = 'hidden';
		}else{
			editor.style.visibility = 'hidden';
			view.mSvgEditor.style.visibility = 'visible';
		}
	}
}

//////////////////////////////////////////////////////////////////////////
function GetQueryStringArgs() {
    var qs = (location.search.length > 0 ? location.search.substring(1) : "");
    var args = {};

    var items = qs.length ? qs.split("&") : [];
    var item = null,
        name = null,
        value = null;

    var i = 0;
    var len = items.length;
    for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

function GenGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function AddResourceList(url) {
    for (var i = 0; i < gResList.length; i++) {
        if (gResList[i] == url) {
            return;
        }
    }
    gResList.push(url);
}

function LoadResourceList(i, callback) {
    var url = gResList[i];
    var ext = '';
    var j = url.lastIndexOf(".");
    if (j > 0) {
        ext = url.substr(j + 1);
    }
    if (ext == 'js') {
        var list = document.getElementsByTagName("script");
        for (var j = 0; j < list.length; j++) {
            if (list[j].src == url) {
                if (i == (gResList.length - 1)) {
                    callback();
                } else {
                    LoadResourceList(i + 1, callback);
                }
                return;
            }
        }

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            if (!script.readyState || 'loaded' === script.readyState || 'complete' === script.readyState) {
                if (i == (gResList.length - 1)) {
                    callback();
                } else {
                    LoadResourceList(i + 1, callback);
                }
            }
        };
        script.src = url;
        document.head.appendChild(script);
    }
    if (ext == 'css') {
        var list = document.getElementsByTagName("link");
        for (var j = 0; j < list.length; j++) {
            if (list[j].href == url) {
                if (i == (gResList.length - 1)) {
                    callback();
                } else {
                    LoadResourceList(i + 1, callback);
                }
                return;
            }
        }

        var csslink = document.createElement("link");
        csslink.rel = "stylesheet";
        csslink.type = "text/css";
        csslink.href = url;
        csslink.onload = csslink.onreadystatechange = function() {
            if (!csslink.readyState || 'loaded' === csslink.readyState || 'complete' === csslink.readyState) {
                if (i == (gResList.length - 1)) {
                    callback();
                } else {
                    LoadResourceList(i + 1, callback);
                }
            }
        };
        csslink.href = url;
        document.head.appendChild(csslink);
    }
}

function SendHttpRequest(method, url, data, DoResolve, responseType, mime) {
    responseType = responseType || 'text';
    mime = mime || 'text/xml';

    var client = new XMLHttpRequest();
    client.open(method, encodeURI(url));
    client.onreadystatechange = handler;
    client.responseType = responseType;
    client.overrideMimeType(mime);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    client.send(data);

    function handler() {
        if (client.readyState !== 4) {
            return;
        }
        if (client.status === 200) {
            DoResolve(client.response);
        } else {
            console.log("GetHttpDataSync:" + client.status);
        }
    };
}

function PostHttpData(url, data, DoResolve, responseType, mime) {
    responseType = responseType || 'text';
    mime = mime || 'text/xml';

    var client = new XMLHttpRequest();
    client.open("POST", encodeURI(url));
    client.onreadystatechange = handler;
    client.responseType = responseType;
    client.overrideMimeType(mime);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    client.send(data);

    function handler() {
        if (client.readyState !== 4) {
            return;
        }
        if (client.status === 200) {
            DoResolve(client.response);
        } else {
            console.log("GetHttpDataSync:" + client.status);
        }
    };
}

function MainView_Init(win, w, h)
{
	AddResourceList("http://qdsoft.huaguangsoft.com/htmloutput/3DViewer/css/MainViewer.css");
	
	AddResourceList("http://qdsoft.huaguangsoft.com/htmloutput/common/CodeMirror/lib/codemirror.css");
	AddResourceList("http://qdsoft.huaguangsoft.com/htmloutput/common/CodeMirror/lib/codemirror.js");
	AddResourceList("http://qdsoft.huaguangsoft.com/htmloutput/common/CodeMirror/mode/xml/xml.js");
	
	AddResourceList("http://qdsoft.huaguangsoft.com/Method-Draw/editor/src/embedapi.js");
	
    LoadResourceList(0, function() {
        gMainView = new CMainView(win, w, h);
        gMainView.UpdateViewLayout(w, h);
    });
}

function MainView_LoadData(data, saveDataFunc)
{
	gMainView.mEditor.setValue(data);
	
	if (data.indexOf('<svg')==0)
	{
		gMainView.mSvgCanvas.setSvgString(data);
	}
	gMainView.FuncSaveData = saveDataFunc;
}

function MainView_Resize(w, h)
{
    if (gMainView) {
        gMainView.ResizeView(w, h);
    }
}