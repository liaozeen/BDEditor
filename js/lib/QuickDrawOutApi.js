"use strict";

function GetQueryStringArgs()
{
	var qs = (location.search.length > 0 ? location.search.substring(1) : "");
	var args = {};

	var items = qs.length ? qs.split("&") : [];
	var item = null, name = null, value = null;
	
	var i = 0;
	var len = items.length;
	for (i=0; i < len; i++)
	{
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	}
	return args;
}

function SetServerVariable(vname, value)
{
	var ret = 0;
	var host = QDLocalApi.GetLocalServer();
	if (!host)
	{
		host = 'http://' + location.host;
	}
	var s = host + '/SetServerVariable/';
	$.ajax({
		url:s,
		type:'post',
		data:{'vname':vname,'value':value},
		cache:false,  
		async: false,
		success: function (data) {				
			var o  = JSON.parse(data);
			if(o.result == 1)ret = 1;							
		},
		error:function(info){
			console.log("Error:"+info);
		}
	})
	return ret;
}

function GetServerVariable(vname)
{
	var ret = '';
	var host = QDLocalApi.GetLocalServer();
	if (!host)
	{
		host = 'http://' + location.host;
	}
	var s = host + '/GetServerVariable/';
	$.ajax({
		url:s,
		type:'post',
		data:{'vname':vname},
		cache:false,  
		async: false,
		success: function (data) {				
			var o  = JSON.parse(data);
			if(o.result == 1)ret = o.value;							
		},
		error:function(info){
			console.log("Error:"+info);
		}
	})
	return ret;
}

function GetQdSoftPath()
{
	var path = GetServerVariable('qdsoft_path');
	if (path=='')
	{
		path = QDLocalApi.GetQuickDrawPath();
	}
	return path;
}

function GetOrderPath()
{
	var s = QDLocalApi.GetUid();
	if (s=='')
	{
		return QDLocalApi.GetQuickDrawPath() + 'Orders';
	}else{
		return QDLocalApi.GetQuickDrawPath() + 'Orders\\' + QDLocalApi.GetUid();
	}
}

function ToQdServerPath(url)
{
	var s = window.GetQdSoftPath();
	var path = QDLocalApi.GetQuickDrawPath();
	path = s.replace(path, '');
	path = path.replace(/\\/g, '/');
	return url + path;
}

function ReadValueFromIniFile(ini, section, key, value)
{
	var s = QDLocalApi.ReadStringFromIniFile(ini, section, key, '');
	if(!s || s=='')return value;
	return s;
}

function GetQdSoftTextData(qdsoftid, key)
{
	var s = '';
	var url = 'http://qdsoft.huaguangsoft.com/Price/GetTextData/';
	$.ajax({
		url:url,
		type:'post',
		data : {group:"qd_textdata_list_head",qdsoft:qdsoftid,key:key,data:""},
		dataType:'json',
		cache:false,  
		async: false,
		success: function (data) {
			if (data.result==1)
			{
				s = data.configdata;
			}
		},
		error:function(info){
			console.log("Error:"+info);
		}
	});
	return s;
}

function LoadQuickDrawGlobalVariants(page)
{
	var qdsoftid = GetServerVariable('qdsoft_id');
	if (qdsoftid=='')
	{
		var o = GetQueryStringArgs();
		qdsoftid = o.qdsoft;
	}
	var s = '';
	var url = 'http://qdsoft.huaguangsoft.com/Price/GetTextData/';
	$.ajax({
		url:url,
		type:'post',
		data : {group:"qd_textdata_list_head",qdsoft:qdsoftid,key:"QuickDrawGlobalVariants.js",data:""},
		dataType:'json',
		cache:false,  
		async: false,
		success: function (data) {
			if (data.result==1)
			{
				s = data.configdata;
			}
		},
		error:function(info){
			console.log("Error:"+info);
		}
	});
	eval(s);
}

function OpenQdSoftIni(qdsoftid, key)
{
	var s = GetQdSoftTextData(qdsoftid, key);
	if (s!='')
	{
		var filename = QDLocalApi.GetQuickDrawPath() + 'Temp\\' + qdsoftid + key;
		QDLocalApi.WriteStringToFile(filename, s);
		var ini = QDLocalApi.OpenIniFile(filename);
		return ini;
	}
}

function CloseQdSoftIni(ini, qdsoftid, key)
{
	var filename = QDLocalApi.GetQuickDrawPath() + 'Temp\\' + qdsoftid + key;
	QDLocalApi.DeleteFile(filename);
	QDLocalApi.CloseIniFile(ini);
}

if (window.top === window.self)			//判断是否iframe页面
{
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("qdexploerproxy") > -1 || ua.indexOf("quickdrawexploer") > -1)
	{
		window.gIsQuickDrawOutApi = 1;
		//console.log(ua);
	}else{
		var a = GetQueryStringArgs();
		window.gIsQuickDrawOutApi = (a['IsQuickDrawOutApi'])?a['IsQuickDrawOutApi']:window.gIsQuickDrawOutApi;
	}
	
	window.gIsQuickDrawOutApi = (window.gIsQuickDrawOutApi)?window.gIsQuickDrawOutApi:0;
	window.QuickDrawOutApi = {
		
		//发送消息到渲染器
		SendRenderControlMessage:function(msg)
		{
			if (gIsQuickDrawOutApi==1)
			{
				if (msg=='close')
				{
					$("#RenderConfig").css("display","none");
					window.gXRconfig = 0;
					GetXrenderObject().DoCloudRender('false', '');
				}else{
					GetXrenderObject().CloudRenderControl(msg);
				}
			}else{
				console.log('SendRenderControlMessage(' + msg + ')');
			}
		},

		//获取渲染器配置
		GetCloudRenderConfig:function()
		{
			if (gIsQuickDrawOutApi==1)
			{
				return GetXrenderObject().GetCloudRenderConfig();
			}else{
				console.log('GetCloudRenderConfig()');
			}
		},

		//设置渲染器配置
		SetCloudRenderConfig:function(config, start)
		{
			if (gIsQuickDrawOutApi==1)
			{
				//OnRenderCofigChange(config, start);
				if (start=='true')
				{
					GetXrenderObject().DoCloudRender(start, config);
				}else{
					GetXrenderObject().CloudRenderConfigChange(config);
				}
			}else{
				console.log('SetCloudRenderConfig(' + config + ',' + start + ')');
			}
		},

		//保存视角
		SaveCloudRenderView:function()
		{
			if (gIsQuickDrawOutApi==1)
			{
				GetQuickDrawObject().InvokeXrenderMenuItem('ADDSCENE');
			}else{
				console.log('SaveCloudRenderView()');
			}
		},

		//旋转相机
		CloudRenderRotateCamera:function(angle)
		{
			if (gIsQuickDrawOutApi==1)
			{
				GetXrenderObject().RotateCamera(angle);
			}else{
				console.log('CloudRenderRotateCamera(' + angle + ')');
			}
		},

		//获取工具栏复选框状态
		GetToolbarCheckBoxState:function(id)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return GetXrenderObject().GetCheckBoxState(id);
			}else{
				console.log('GetToolbarCheckBoxState(' + id + ')');
			}
		},

		//获取工具栏滑动条数值
		GetToolbarSliderValue:function(id)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return GetXrenderObject().XR_GetSliderValue(id);
			}else{
				console.log('GetToolbarSliderValue(' + id + ')');
			}
		},

		//设置工具栏滑动条数值
		SetToolbarSliderValue:function(id, value)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return GetXrenderObject().XR_SetSliderValue(id, value);
			}else{
				console.log('SetToolbarSliderValue(' + id + ',' + value + ')');
			}
		},

		//发送消息到工具栏, value="click"
		SendToolbarMessage:function(id, value)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return OnToolbarMessage(id, value);
			}else{
				console.log('SendToolbarMessage(' + id + ',' + value + ')');
			}
		},

		//控制渲染器显示隐藏天花地板脚线
		ShowGroundCeilLine:function(s1, s2)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return GetXrenderObject().ShowGroundCeilLine(s1, s2);
			}else{
				console.log('ShowGroundCeilLine(' + s1 + ',' + s2 + ')');
			}
		},

		//设置渲染器自定义材质
		SetCustomMatIni:function(ini)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return GetXrenderObject().XR_SetCustomMatIni(ini);
			}else{
				console.log('SetCustomMatIni(' + ini + ')');
			}
		},

		//显示效果图页面
		ShowRenderImagePage:function()
		{
			if (gIsQuickDrawOutApi==1)
			{
				return OnToolbarMessage("IDR_XrenderImage", "click");
			}else{
				console.log('ShowRenderImagePage');
			}
		},

		//Ini文件转json对象
		IniFile2JsonObject:function(ini)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var s = GetQuickDrawObject().IniFile2JsonObject(ini);
				var obj = eval("(" + s + ")");
				return obj;
			}else{
				console.log('IniFile2JsonObject(' + ini + ')');
				var obj = {
					"全局":{
						"总类型数":1
					},
					"类型0":{
						"材质数":2,
						"类型名":"木材质",
						"材质文件名0":"板材深色.ini",
						"材质文件名1":"板材浅色.ini"
					}
				}
				return obj;
			}
		},
		
		//json对象转Ini文件
		JsonObject2IniFile:function(obj)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var s = GetQuickDrawObject().JsonObject2IniFile(ini);
				var obj = eval("(" + s + ")");
				return obj;
			}else{
				console.log('JsonObject2IniFile(' + JSON.stringify(obj) + ')');
				var obj = {
					"result":1
				}
				return obj;
			}
		},
		
		PostMessage2RightPanelExploer:function(s)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var qd = GetQuickDrawObject();
				if (qd.PostMessage2RightPanelExploer)
				{
					qd.PostMessage2RightPanelExploer(s);
				}
			}else{
				console.log('PostMessage2RightPanelExploer(' + s + ')');
			}
		},
		
		PostMessage2Parent:function(s)
		{
			if (gIsQuickDrawOutApi==1)
			{
				if (window.PostMessage2Parent)
				{
					window.PostMessage2Parent(s);
				}
			}else{
				console.log('PostMessage2Parent(' + s + ')');
			}
		},

		//获取订单信息
		GetOrderInfo:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetOrderInfo",
					args:{
					}
				};
	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, function(result){
					var o = eval("(" + result + ")");
					
					var s = '{}';
					if (typeof o.data.Extra == "object")s = JSON.stringify(o.data.Extra);
					if (typeof o.data.Extra == "string")s = o.data.Extra;
					s = s.replace(/\^/g, '"');
					var extra = eval("(" + s + ")");
					if (extra['designName'])extra['设计师名字'] = extra['designName'];
					if (extra['designPhone'])extra['设计师电话'] = extra['designPhone'];
					if (extra['designQQ'])extra['设计师QQ'] = extra['designQQ'];
					if (extra['designTime'])extra['交货日期'] = extra['designTime'];
					if (extra['designType'])extra['订单类型'] = extra['designType'];
					o.data.Extra = extra;
					if (callback)callback(JSON.stringify(o));
				});
			}else{
				console.log('GetOrderInfo()');
				var obj = {
					"result":1,
					"data":{						
						OrderName:'text123',	//订单号						
						Distributor:'广州经销商',	//经销商						
						Fax:'传真',	//传真						
						DateTime:43718,	//订单时间						
						Phone:'12345678912',	//订单电话						
						Address:'广州',		//订单地址						
						roomxml:"data\Rooms\L-1型房间.xml",	//房户门型				
						CustomerName:'阿里',	//客户名称						
						CustomerPhone:'55555555',	//客户电话						
						CustomerCellPhone:'13612345678',	//客户手机						
						CustomerAddress:'广西',	//客户安装住址						
						OrderType:'1',	//订单类型						
						fangxing:'当前户型',	//房型选择						
						SoftVer:"2018-08-01",	//软件版本						
						DataVer:"2018-08-012018-08-012018-08-01",	//图库版本						
						Extra:{'设计师名字':'555','设计师电话':'444','设计师QQ':'111','交货日期':'2019-09-12','订单类型':'3'}	//其他
				    }
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//设置订单信息
		SetOrderInfo:function(s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var o = eval("(" + s + ")");
				var s1 = '{}';
				if (typeof o.Extra == "object")s1 = JSON.stringify(o.Extra);
				if (typeof o.Extra == "string")s1 = o.Extra;
				s1 = s1.replace(/"/g, '^');
				o.Extra = s1;
				s = JSON.stringify(o);
					
				var obj = {
					method:"Qd_SetOrderInfo",
					args:{
						"data":s
					}
				};
	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, function(result){
					var o = eval("(" + result + ")");
					if (typeof o.data.Extra == "undefined" || o.data.Extra=="")o.data.Extra = "{}";

					var s = o.data.Extra;
					if (s)s = s.replace(/\^/g, '"');
					var extra = eval("(" + s + ")");
					if (extra['designName'])extra['设计师名字'] = extra['designName'];
					if (extra['designPhone'])extra['设计师电话'] = extra['designPhone'];
					if (extra['designQQ'])extra['设计师QQ'] = extra['designQQ'];
					if (extra['designTime'])extra['交货日期'] = extra['designTime'];
					if (extra['designType'])extra['订单类型'] = extra['designType'];
					o.data.Extra = extra;
					if (callback)callback(JSON.stringify(o));
				});
			}else{
				console.log('SetOrderInfo(' + s + ')');
				var obj = {
					"result":1,
					"data":{						
						OrderName:'text123',	//订单号						
						Distributor:'广州经销商',	//经销商						
						Fax:'传真',	//传真						
						DateTime:43718,	//订单时间						
						Phone:'12345678912',	//订单电话						
						Address:'广州',		//订单地址						
						roomxml:"data\Rooms\L-1型房间.xml",	//房户门型				
						CustomerName:'阿里',	//客户名称						
						CustomerPhone:'55555555',	//客户电话						
						CustomerCellPhone:'13612345678',	//客户手机						
						CustomerAddress:'广西',	//客户安装住址						
						OrderType:'1',	//订单类型						
						fangxing:'当前户型',	//房型选择						
						SoftVer:"2018-08-01",	//软件版本						
						DataVer:"2018-08-012018-08-012018-08-01",	//图库版本						
						Extra:{'设计师名字':'555','设计师电话':'444','设计师QQ':'111','交货日期':'2019-09-12','订单类型':'3'}	//其他
				    }
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},


		GetQueryStringArgs:function(){
			var qs = (location.search.length > 0 ? location.search.substring(1) : "");
			var args = {};

			var items = qs.length ? qs.split("&") : [];
			var item = null, name = null, value = null;
			
			var i = 0;
			var len = items.length;
			for (i=0; i < len; i++)
			{
				item = items[i].split("=");
				name = decodeURIComponent(item[0]);
				value = decodeURIComponent(item[1]);
				if (name.length) {
					args[name] = value;
				}
			}
			return args;
		},
		
		GetQuickDrawPath:function()	//获取QD目录
		{
			alert("QuickDrawOutApi.GetQuickDrawPath 接口已经取消");
			return (window.GetQuickDrawPath)?window.GetQuickDrawPath():"";
		},
		
		//本地文件对话框
		ShowFileDialog:function(t, filename, filter)
		{
			alert("QuickDrawOutApi.ShowFileDialog 接口已经取消");
			return (window.ShowFileDialog)?window.ShowFileDialog(t, filename, filter):"";
		},

		//获取本地服务器url
		GetLocalServer:function()
		{
			return (window.LocalServer)?window.LocalServer():"http://127.0.0.1:9000";
		},
		
		//获取加密锁ID
		GetDogID:function()
		{
			alert("QuickDrawOutApi.GetDogID 接口已经取消");
			return (window.GetDogID)?window.GetDogID():"163855505";
		},
		
		//ShellExecute
		ShellExecute:function(op, filename)
		{
			alert("QuickDrawOutApi.ShellExecute 接口已经取消");
			return (window.QdMethod)?window.QdMethod('ShellExecute', op, filename, '', '', 1):"no ShellExecute";
		},
		
		GetModalInput:function()
		{
			if (gIsQuickDrawOutApi==1)
			{
				var result = GetServerVariable('qd_server_global_modalinput');
				return result;
			}else{
				console.log('GetModalInput()');
			}
		},
		
		SetModalResult:function(s)
		{
			if (gIsQuickDrawOutApi==1)
			{
				return SetServerVariable('qd_server_global_modalresult', s);
			}else{
				console.log('SetModalResult()');
			}
		},

		//获取审图列表
		GetBlockListTree:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetBlockListTree",
					args:{
					}
				};				
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetBlockListTree()');
				var obj = {
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//获取文本文件内容
		ReadStringFromFile:function(f, callback)
		{
			alert("QuickDrawOutApi.ReadStringFromFile 接口已经取消");
			if (gIsQuickDrawOutApi==1)
			{
				if (window.ReadStringFromFile)
				{
					var obj = {
						result:""
					}
					obj.result = window.ReadStringFromFile(f);
					if (callback){
						callback(JSON.stringify(obj));
					}else return obj.result;
				}else{
					var obj = {
						method:"Qd_ReadStringFromFile",
						args:{
							filename:f
						}
					};
					$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, function(result){
						if (callback){
							callback(result);
						}else{
							var o = eval("(" + result + ")");
							return o.result;
						}
					});
				}
			}else{
				console.log('ReadStringFromFile(' + f + ')');
				var obj = {
					result:""
				}
				if (callback){
					callback(JSON.stringify(obj));
				}else return obj.result;
			}
		},
		
		//写入文本文件内容
		WriteStringToFile:function(f, s, callback)
		{
			alert("QuickDrawOutApi.WriteStringToFile 接口已经取消");
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_WriteStringToFile",
					args:{
						filename:f,
						data:s
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('WriteStringToFile(' + f + ',' + s + ')');
				var obj = {
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//删除文件
		DeleteFile:function(f, callback)
		{
			alert("QuickDrawOutApi.DeleteFile 接口已经取消");
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_DeleteFile",
					args:{
						filename:f
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('DeleteFile(' + f + ')');
				var obj = {
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//建立文件夹
		CreateDirectory:function(p, callback)
		{
			alert("QuickDrawOutApi.CreateDirectory 接口已经取消");
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_CreateDirectory",
					args:{
						path:p
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('CreateDirectory(' + p + ')');
				var obj = {
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//删除文件夹
		DeleteDirectory:function(p, callback)
		{
			alert("QuickDrawOutApi.DeleteDirectory 接口已经取消");
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_DeleteDirectory",
					args:{
						path:p
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('DeleteDirectory(' + p + ')');
				var obj = {
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//选中模块
		SelectXmlBlock:function(id, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_SelectXmlBlock",
					args:{
						blockid:id
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SelectXmlBlock(' + id + ')');
				var obj = {
					GUID:id
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//修改模块位置尺寸
		DoXmlBlockTransform:function(o, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_DoXmlBlockTransform",
					args:o
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('DoXmlBlockTransform(' + JSON.stringify(o) + ')');
			}
		},

		//获取QD状态
		GetQdObjectState:function(o, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetQdObjectState",
					args:{
						list:o
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetQdObjectState(' + JSON.stringify(o) + ')');
				var obj = {
					list:{
						IsLock3D:'false',
						CheckMemo:'0',
						IsShowHole:{A:true,B:true}
					}
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//设置QD状态
		SetQdObjectState:function(o, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_SetQdObjectState",
					args:{
						list:o
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SetQdObjectState(' + JSON.stringify(o) + ')');
			}
		},
		
		//获取QD对象
		GetQdObject:function(s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetQdObject",
					args:{
						objname:s,
						data:""
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetQdObject(' + JSON.stringify(o) + ')');
				var obj = {
					objname:s,
					data:""
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//设置QD对象
		SetQdObject:function(s, d, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_SetQdObject",
					args:{
						objname:s,
						data:d
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SetQdObject(' + s + ',' + data + ')');
			}
		},

		//获取模块属性
		GetXmlBlockAttribute:function(id, o, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetXmlBlockAttribute",
					args:{
						blockid:id,
						list:o
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetXmlBlockAttribute(' + id + ',' + JSON.stringify(o) + ')');
				if (callback)callback(JSON.stringify(o));
			}
		},

		//设置模块属性
		SetXmlBlockAttribute:function(ids, o, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_SetXmlBlockAttribute",
					args:{
						blockid:ids,
						list:o
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SetXmlBlockAttribute(' + JSON.stringify(ids) + ',' + JSON.stringify(o) + ')');
				if (callback)callback(JSON.stringify(o));
			}
		},

		//删除模块
		RemoveXmlBlock:function(ids, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_RemoveXmlBlock",
					args:{
						blockid:ids
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('RemoveXmlBlock(' + JSON.stringify(ids) + ')');
				var obj = {
					blockid:ids
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//编辑板件BD
		DoEditBD:function(id, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
			}else{
				console.log('DoEditBD(' + id + ')');
				var obj = {
					result:-1,
					blockid:id,
					error:'不可编辑'
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取板件BD
		GetXmlBlockBD:function(ids, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetXmlBlockBD",
					args:{
						ids:ids
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetXmlBlockBD(' + JSON.stringify(ids) + ')');
				var obj = {
					result:-1,
					list:[],
					error:'无BD数据'
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//保存板件BD
		SaveXmlBlockBD:function(id, s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_SaveXmlBlockBD",
					args:{
						blockid:id,
						data:s
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SaveXmlBlockBD(' + id + ',' + s + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//孔槽判断计算
		CheckHoleAndCut:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
			}else{
				console.log('CheckHoleAndCut()');
				var obj = {
					result:1,
					error:'',
					data:[]
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//显示子页面（孔位配置页面，封边信息页面，自定义修改板件页面，修改备注）
		ShowModalPage:function(pid, p, id, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_ShowModalPage",
					args:{
						pageid:pid,
						page:p,
						blockid:id
					}
				};
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('ShowModalPage(' + pid + ',' + JSON.stringify(p) + ',' + id + ')');
			}
		},

		//获取房型模板
		GetRoomTemplates:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetRoomTemplates",
					args:{
					}
				};

				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetRoomTemplates()');
				var obj = {
					result:1,
					data:[{name:"L-1型房间",xml:"data\\Rooms\\L-1型房间.xml",image:"data\\Rooms\\L-1型房间.bmp"}]
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//建立新订单
		CreateNewOrder:function(p, s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var o = eval("(" + s + ")");
				var s1 = '{}';
				if (typeof o.Extra == "object")s1 = JSON.stringify(o.Extra);
				if (typeof o.Extra == "string")s1 = o.Extra;
				s1 = s1.replace(/"/g, '^');
				o.Extra = s1;
					
				var obj = {
					method:"Qd_CreateNewOrder",
					args:{
						path:p,
						orderinfo:o
					}
				};
				
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('CreateNewOrder(' + p + ',' + JSON.stringify(info) + ')');
				var obj = {
					result:1,
					error:''
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},

		//获取经销商列表
		GetDistributorList:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					result:-1,
					list:{}
				}
				if (callback)callback(JSON.stringify(obj));
			}else{
				console.log('GetDistributorList()');
				var obj = {
					result:1,
					list:{
						"广东省":[{name:"广州经销商",no:"001"},{name:"中山经销商",no:"002"}],
						"湖南省":[{name:"长沙经销商",no:"003"}]
					}
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取创建线条台面的轮廓数据
		GetOutlineDataForPolyline:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetOutlineDataForPolyline",
					args:{
					}
				};
				
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetOutlineDataForPolyline()');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//更新台面线条数据
		UpdatePolylineData:function(s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_UpdatePolylineData",
					args:{
						data:s
					}
				};	
				
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('UpdatePolylineData(' + s + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取台面线条数据
		GetPolylineData:function(s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetPolylineData",
					args:{
						editstate:s
					}
				};
				
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetPolylineData(' + s + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取线条配置数据
		GetPolylineConfigData:function(qdsoftid, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				//var s = ToQdServerPath('http://qdsoft.huaguangsoft.com/') + 'data2/PolylineConfigData.txt';
				var s = 'http://qdsoft.huaguangsoft.com/BlockGrph/FindItemEx/';
				$.ajax({
					url:s,
					type:'post',
					data : {
						pid:-1,
						showall:1,
						qdsoftid:qdsoftid,
						sName:'@线条'
					},
					dataType:'text', 
					async: false,
					success: function (data) {
						var o  = JSON.parse(data);
						if (o.result==1)
						{
							for(var i=0; i<o.datalist.length; i++)
							{
								o.datalist[i]['isfile'] = '目录';
								if (o.datalist[i]['type']==1)o.datalist[i]['isfile'] = '模板';
								if (o.datalist[i]['type']==1)
								{
									var path = o.datalist[i]['path'];
									if (path.indexOf("@线条\\雕花贴面\\")==0)
									{
										o.datalist[i]['Extend'] = '雕花贴面';
									}else{
										o.datalist[i]['Extend'] = '线条';
									}
								}
							}
							callback(o.datalist);
						}				
					},
					error:function(info){
						console.log("Error:"+info);
					}
				});
			}
		},
		
		//获取台面配置数据
		GetTabletopConfigData:function(qdsoftid, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				//var s = ToQdServerPath('http://qdsoft.huaguangsoft.com/') + 'data2/TabletopConfigData.txt';
				var s = 'http://qdsoft.huaguangsoft.com/BlockGrph/GetDirFormatData/';
				$.ajax({
					url:s,
					type:'post',
					data : {
						pid:-1,
						qdsoftid:qdsoftid,
						sName:'["@台面"]'
					},
					dataType:'text', 
					async: false,
					success: function (data) {
						var o  = JSON.parse(data);
						if (o.result==1)
						{
							for(var i=0; i<o.datalist.length; i++)
							{
								if (o.datalist[i]['isfile']=='模板')
								{
									var path = o.datalist[i]['path'];
									if (path.indexOf("@台面\\前挡水\\")==0)
									{
										o.datalist[i]['Extend'] = '前挡水';
									}else if (path.indexOf("@台面\\后挡水\\")==0)
									{
										o.datalist[i]['Extend'] = '后挡水';
									}else{
										o.datalist[i]['Extend'] = '台面';
									}
								}
							}
							callback(o.datalist);
						}				
					},
					error:function(info){
						console.log("Error:"+info);
					}
				});
			}
		},
		
		//获取台面五金配件配置数据
		GetTabletopWjpjConfigData:function(qdsoftid, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				//var s = ToQdServerPath('http://qdsoft.huaguangsoft.com/') + 'data2/TabletopWjpjConfigData.txt';
				var s = 'http://qdsoft.huaguangsoft.com/BlockGrph/GetDirFormatData/';
				$.ajax({
					url:s,
					type:'post',
					data : {
						pid:-1,
						qdsoftid:qdsoftid,
						sName:'["@台面五金配件"]'
					},
					dataType:'text', 
					async: false,
					success: function (data) {
						var o  = JSON.parse(data);
						if (o.result==1)
						{
							for(var i=0; i<o.datalist.length; i++)
							{
								if (o.datalist[i]['isfile']=='模板')
								{
									o.datalist[i]['Extend'] = '台面五金配件';
								}
							}
							callback(o.datalist);
						}				
					},
					error:function(info){
						console.log("Error:"+info);
					}
				});
			}
		},
		
		//获取子空间目录树
		GetSubspaceXmlBlockTree:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{
				var obj = {
					method:"Qd_GetSubspaceXmlBlockTree",
					args:{
					}
				};
							
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetSubspaceXmlBlockTree()');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//添加子空间
		AddSubspaceXmlBlock:function(id, s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_AddSubspaceXmlBlock",
					args:{
						blockid:id,
						block:s
					}
				};
	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('AddSubspaceXmlBlock(' + id + ',' + s + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//删除子空间
		RemoveSubspaceXmlBlock:function(id, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_RemoveSubspaceXmlBlock",
					args:{
						blockid:id
					}
				};		
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('RemoveSubspaceXmlBlock(' + id + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//更新子空间
		UpdateSubspaceXmlBlock:function(id, s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{		
				var obj = {
					method:"Qd_UpdateSubspaceXmlBlock",
					args:{
						blockid:id,
						block:s
					}
				};		
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('UpdateSubspaceXmlBlock(' + id + ',' + s + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//清空子空间
		ClearSubspaceXmlBlock:function(id, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{		
				var obj = {
					method:"Qd_ClearSubspaceXmlBlock",
					args:{
						blockid:id
					}
				};		
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('ClearSubspaceXmlBlock(' + id + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//选择子空间
		SelectSubspaceXmlBlock:function(id, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{		
				var obj = {
					method:"Qd_SelectSubspaceXmlBlock",
					args:{
						blockid:id
					}
				};		
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SelectSubspaceXmlBlock(' + id + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//显示子空间线框
		ShowSubspaceXmlBlockFrame:function(a, s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_ShowSubspaceXmlBlockFrame",
					args:{
						blockid_array:a,
						state:s
					}
				};		
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('ShowSubspaceXmlBlockFrame(' + JSON.stringify(a) + ',' + s + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取图纸布局数据
		GetGraphLayout:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_GetGraphLayout",
					args:{
					}
				};	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetGraphLayout()');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//更新图纸布局数据
		SetGraphLayout:function(o, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_SetGraphLayout",
					args:{
						data:o
					}
				};	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SetGraphLayout(' + JSON.stringify(o) + ')');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取服务器数据
		GetLocalData:function(s, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_GetLocalData",
					args:{
						name:s
					}
				};					
				$.ajax({
					url:this.GetLocalServer() + "/QuickDrawApi/",
					type:"post",
					data:{data:JSON.stringify(obj),CycleTimes:200},
					cache:false,  
					async: false,
					success: function (result) {	
						if (callback)callback(result);	
					},
					error:function(info){
					}
				});
			}else{
				console.log('GetLocalData()');
				var obj = {
					result:-1,
					name:s,
					data:""
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//设置服务器数据
		SetLocalData:function(s, ds, callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_SetLocalData",
					args:{
						name:s,
						data:ds
					}
				};	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('SetLocalData(' + s + ')');
				var obj = {
					result:-1,
					name:s,
					data:""
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取订单列表
		GetOrderList:function(callback)
		{
			if (gIsQuickDrawOutApi==1)
			{	
				var obj = {
					method:"Qd_GetOrderList",
					args:{
					}
				};	
				$.post(this.GetLocalServer() + "/QuickDrawApi/", {data:JSON.stringify(obj)}, callback);
			}else{
				console.log('GetOrderList()');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		},
		
		//获取子目录列表
		SearchDir:function(s, s1, callback)
		{
			alert("QuickDrawOutApi.SearchDir 接口已经取消");
			if (gIsQuickDrawOutApi==1)
			{	
				return (window.SearchDir)?window.SearchDir(s, s1):"[]";
			}else{
				console.log('SearchDir()');
				var obj = {
					result:-1
				}
				if (callback)callback(JSON.stringify(obj));
			}
		}
	}
}else{
	window.gIsQuickDrawOutApi = window.parent.gIsQuickDrawOutApi;
	window.QuickDrawOutApi = window.parent.QuickDrawOutApi;
}