YUI.add("gallery-aui-chart",function(Y){var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="chart",X=S(L),G=Y.config.base+"gallery-aui-chart/assets/chart.swf";YUI.AUI.namespace("_CHART");YUI.AUI.namespace("defaults.chart");var d=Y.Component.create({NAME:L,ATTRS:{type:{value:"pie"},dataSource:{value:null},altText:{getter:"_getAltText",setter:"_setAltText"},swfURL:{valueFn:function(){return YUI.AUI.defaults.chart.swfURL||G;}},swfCfg:{value:{}},request:{value:"*"},dataSource:{value:null},series:{value:null},categoryNames:{getter:"_getCategoryNames",setter:"_setCategoryNames"},dataTipFunction:{setter:"_setDataTipFunction"},legendLabelFunction:{setter:"_setLegendLabelFunction"},style:{value:null},pollingInterval:{value:0}},proxyFunctionCount:0,createProxyFunction:function(i,h){var A=d.proxyFunctionCount;var j="proxyFunction"+A;YUI.AUI._CHART[j]=Y.bind(i,h);d.proxyFunctionCount++;return"YUI.AUI._CHART."+j;},getFunctionReference:function(i){var A=this;if(H.isFunction(i)){i=d.createProxyFunction(i);}else{if(i.fn&&H.isFunction(i.fn)){var h=[i.fn];if(i.context&&H.isObject(context)){h.push(i.context);}i=d.createProxyFunction(A,h);}}return i;},removeProxyFunction:function(A){if(A&&A.indexOf("YUI.AUI._CHART.proxyFunction")>-1){A=A.substr(12);YUI.AUI._CHART[A]=null;}},prototype:{renderUI:function(){var o=this;var A={align:"",allowNetworking:"",allowScriptAccess:"",base:"",bgcolor:"",menu:"",name:"",quality:"",salign:"",scale:"",tabindex:"",wmode:""};var n=o.get("contentBox");var j={boundingBox:n,fixedAttributes:{allowScriptAccess:"always"},flashVars:{allowedDomain:document.location.hostname},backgroundColor:n.getStyle("backgroundColor"),url:o.get("swfURL"),height:o.get("height"),width:o.get("width"),version:9.045};var p=o.get("swfCfg");for(var l in p){if(A.hasOwnProperty(l)){j.fixedAttributes[l]=p[l];}else{j[l]=p[l];}}var m=j.version;if(m&&H.isValue(m)&&m!="undefined"){var k=(/\w*.\w*/.exec(((m).toString()).replace(/.0./g,"."))).toString();var h=k.split(".");m=h[0]+".";switch((h[1].toString()).length){case 1:m+="00";break;case 2:m+="0";break;}m+=h[1];j.version=parseFloat(m);}o._swfWidget=new Y.SWF(j);o._swfNode=o._swfWidget._swf;o._swf=o._swfNode.getDOM();o._swfWidget.on("swfReady",o._eventHandler,o);o.set("swfCfg",j);},bindUI:function(){var A=this;A.publish("itemMouseOver");A.publish("itemMouseOut");A.publish("itemClick");A.publish("itemDblClick");A.publish("itemDragStart");A.publish("itemDragEnd");A.publish("itemDrag");A.after("seriesChange",A.refreshData);A.after("dataSourceChange",A.refreshData);A.after("pollingIntervalChange",A.refreshData);var h=A.get("dataSource");h.after("response",A._loadDataHandler,A);},setStyle:function(h,i){var A=this;i=Y.JSON.stringify(i);A._swf.setStyle(h,i);},setStyles:function(h){var A=this;h=Y.JSON.stringify(h);A._swf.setStyles(h);},setSeriesStyles:function(j){var A=this;for(var h=0;h<j.length;h++){j[h]=Y.JSON.stringify(j[h]);}A._swf.setSeriesStyles(j);},_eventHandler:function(h){var A=this;if(h.type=="swfReady"){A._swfNode=A._swfWidget._swf;A._swf=A._swfNode.getDOM();A._loadHandler();A.fire("contentReady");}},_loadHandler:function(){var A=this;if(A._swf&&A._swf.setType){A._swf.setType(A.get("type"));var h=A.get("style");if(h){A.setStyles(h);}A._syncChartAttrs();A._initialized=true;A.refreshData();}},_syncChartAttrs:function(){var A=this;var h=A._originalConfig;if(h.categoryNames){A.set("categoryNames",h.categoryNames);}if(h.dataTipFunction){A.set("dataTipFunction",h.dataTipFunction);}if(h.legendLabelFunction){A.set("legendLabelFunction",h.legendLabelFunction);}if(h.series){A.set("series",h.series);}},refreshData:function(){var A=this;if(A._initialized){var k=A.get("dataSource");if(k){var h=A._pollingID;if(h!==null){k.clearInterval(h);A._pollingID=null;}var j=A.get("pollingInterval");var i=A.get("request");if(j>0){A._pollingID=k.setInterval(j,i);}k.sendRequest(i);}}},_loadDataHandler:function(h){var t=this;if(t._swf&&!h.error){var r=t._seriesFunctions;if(r){for(var o=0;o<r.length;o++){d.removeProxyFunction(r[o]);}t._seriesFunctions=null;}t._seriesFunctions=[];var l=[];var k=0;var u=null;var A=t.get("series");if(A!==null){k=A.length;for(var o=0;o<k;o++){u=A[o];var j={};for(var s in u){if(s=="style"){if(u.style!==null){j.style=Y.JSON.stringify(u.style);}}else{if(s=="labelFunction"){if(u.labelFunction!==null){j.labelFunction=d.getFunctionReference(u.labelFunction);t._seriesFunctions.push(j.labelFunction);}}else{if(s=="dataTipFunction"){if(u.dataTipFunction!==null){j.dataTipFunction=d.getFunctionReference(u.dataTipFunction);t._seriesFunctions.push(j.dataTipFunction);}}else{if(s=="legendLabelFunction"){if(u.legendLabelFunction!==null){j.legendLabelFunction=d.getFunctionReference(u.legendLabelFunction);t._seriesFunctions.push(j.legendLabelFunction);}}else{j[s]=u[s];}}}}}l.push(j);}}var q=t.get("type");var n=h.response.results;if(k>0){for(var o=0;o<k;o++){u=l[o];if(!u.type){u.type=q;}u.dataProvider=n;}}else{var m={type:q,dataProvider:n};l.push(m);}try{if(t._swf.setDataProvider){t._swf.setDataProvider(l);}}catch(p){t._swf.setDataProvider(l);}}},_getCategoryNames:function(){var A=this;return A._swf.getCategoryNames();},_setCategoryNames:function(h){var A=this;A._swf.setCategoryNames(h);return h;},_setDataTipFunction:function(h){var A=this;if(A._dataTipFunction){d.removeProxyFunction(A._dataTipFunction);}if(h){A._dataTipFunction=h=d.getFunctionReference(h);}A._swf.setDataTipFunction(h);return h;},_setLegendLabelFunction:function(h){var A=this;if(A._legendLabelFunction){d.removeProxyFunction(A._legendLabelFunction);}if(h){A._legendLabelFunction=h=d.getFunctionReference(h);}A._swf.setLegendLabelFunction(h);return h;},_getAltText:function(){var A=this;return A._swf.getAltText();},_setAltText:function(){var A=this;A._swf.setAltText(value);return value;},_pollingID:null}});Y.Chart=d;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="piechart";var Q=Y.Component.create({NAME:L,ATTRS:{dataField:{getter:"_getDataField",setter:"_setDataField",validator:H.isString},categoryField:{getter:"_getCategoryField",setter:"_setCategoryField",validator:H.isString}},EXTENDS:Y.Chart,prototype:{_syncChartAttrs:function(){var A=this;
Q.superclass._syncChartAttrs.apply(A,arguments);var h=A._originalConfig;if(h.dataField){A.set("dataField",h.dataField);}if(h.categoryField){A.set("categoryField",h.categoryField);}},_getDataField:function(){var A=this;return A._swf.getDataField();},_setDataField:function(h){var A=this;A._swf.setDataField(h);return h;},_getCategoryField:function(){var A=this;return A._swf.getCategoryField();},_setCategoryField:function(h){var A=this;A._swf.setCategoryField(h);return h;}}});Y.PieChart=Q;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="cartesianchart",K=S(L);var E=Y.Component.create({NAME:L,ATTRS:{xField:{getter:"_getXField",setter:"_setXField",validator:H.isString},yField:{getter:"_getYField",setter:"_setYField",validator:H.isString},xAxis:{setter:"_setXAxis"},xAxes:{setter:"_setXAxes"},yAxis:{setter:"_setYAxis"},yAxes:{setter:"_setYAxes"},constrain2view:{setter:"_setConstrain2view"}},EXTENDS:Y.Chart,prototype:{initializer:function(){var A=this;A._xAxisLabelFunctions=[];A._yAxisLabelFunctions=[];},destructor:function(){var A=this;A._removeAxisFunctions(A._xAxisLabelFunctions);A._removeAxisFunctions(A._yAxisLabelFunctions);},_syncChartAttrs:function(){var A=this;E.superclass._syncChartAttrs.apply(A,arguments);var h=A._originalConfig;if(h.xField){A.set("xField",h.xField);}if(h.yField){A.set("yField",h.yField);}if(h.xAxis){A.set("xAxis",h.xAxis);}if(h.yAxis){A.set("yAxis",h.yAxis);}if(h.xAxes){A.set("xAxes",h.xAxes);}if(h.yAxes){A.set("yAxes",h.yAxes);}if(h.constrain2view){A.set("constrain2view",h.constrain2view);}},_getXField:function(){var A=this;return A._swf.getHorizontalField();},_setXField:function(h){var A=this;A._swf.setHorizontalField(h);return h;},_getYField:function(){var A=this;return A._swf.getVerticalField();},_setYField:function(h){var A=this;A._swf.setVerticalField(h);return h;},_getClonedAxis:function(j){var A=this;var k={};for(var h in j){if(h=="labelFunction"){if(j.labelFunction&&j.labelFunction!==null){k.labelFunction=d.getFunctionReference(j.labelFunction);}}else{k[h]=j[h];}}return k;},_setXAxis:function(h){var A=this;if(h.position!="bottom"&&h.position!="top"){h.position="bottom";}A._removeAxisFunctions(A._xAxisLabelFunctions);h=A._getClonedAxis(h);A._xAxisLabelFunctions.push(h.labelFunction);A._swf.setHorizontalAxis(h);return h;},_setXAxes:function(j){var A=this;A._removeAxisFunctions(A._xAxisLabelFunctions);for(var h=0;h<j.length;h++){var k=j[h];if(k.position=="left"){k.position="bottom";}j[h]=A._getClonedAxis(k);k=j[h];if(k.labelFunction){A._xAxisLabelFunctions.push(k.labelFunction);}A._swf.setHorizontalAxis(k);}},_setYAxis:function(h){var A=this;A._removeAxisFunctions(A._yAxisLabelFunctions);h=A._getClonedAxis(h);A._yAxisLabelFunctions.push(h.labelFunction);A._swf.setVerticalAxis(h);},_setYAxes:function(j){var A=this;A._removeAxisFunctions(A._yAxisLabelFunctions);for(var h=0;h<j.length;h++){j[h]=A._getClonedAxis(j[h]);var k=j[h];if(k.labelFunction){A._yAxisLabelFunctions.push(k.labelFunction);}A._swf.setVerticalAxis(k);}},_setConstrain2view:function(h){var A=this;A._swf.setConstrainViewport(h);},setSeriesStylesByIndex:function(h,i){var A=this;if(A._swf&&A._swf.setSeriesStylesByIndex){i=Y.JSON.stringify(i);A._swf.setSeriesStylesByIndex(h,i);}},_removeAxisFunctions:function(k){var h=this;if(k&&k.length){for(var j=0;j<k.length;j++){var A=k[j];if(A){Y.Chart.removeProxyFunction(A);}}k=[];}}}});Y.CartesianChart=E;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="linechart",Z=S(L);var B=Y.Component.create({NAME:L,ATTRS:{type:{value:"line"}},EXTENDS:Y.CartesianChart});Y.LineChart=B;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="columnchart",N=S(L);var c=Y.Component.create({NAME:L,ATTRS:{type:{value:"column"}},EXTENDS:Y.CartesianChart});Y.ColumnChart=c;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="barchart",R=S(L);var V=Y.Component.create({NAME:L,ATTRS:{type:{value:"bar"}},EXTENDS:Y.CartesianChart});Y.BarChart=V;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="stackedcolumnchart",g=S(L);var f=Y.Component.create({NAME:L,ATTRS:{type:{value:"stackcolumn"}},EXTENDS:Y.CartesianChart});Y.StackedColumnChart=f;var H=Y.Lang,S=Y.ClassNameManager.getClassName,L="stackedbarchart",J=S(L);var M=Y.Component.create({NAME:L,ATTRS:{type:{value:"stackbar"}},EXTENDS:Y.CartesianChart});Y.StackedBarChart=M;var P=function(){};P.prototype={type:null,reverse:false,labelFunction:null,labelSpacing:2,title:null};Y.Chart.Axis=P;var U=function(){U.superclass.constructor.apply(this,arguments);};Y.extend(U,P,{type:"numeric",minimum:NaN,maximum:NaN,majorUnit:NaN,minorUnit:NaN,snapToUnits:true,stackingEnabled:false,alwaysShowZero:true,scale:"linear",roundMajorUnit:true,calculateByLabelSize:true,position:"left",adjustMaximumByMajorUnit:true,adjustMinimumByMajorUnit:true});Y.Chart.NumericAxis=U;var D=function(){D.superclass.constructor.apply(this,arguments);};Y.extend(D,P,{type:"time",minimum:null,maximum:null,majorUnit:NaN,majorTimeUnit:null,minorUnit:NaN,minorTimeUnit:null,snapToUnits:true,stackingEnabled:false,calculateByLabelSize:true});Y.Chart.TimeAxis=D;var F=function(){F.superclass.constructor.apply(this,arguments);};Y.extend(F,P,{type:"category",categoryNames:null,calculateCategoryCount:false});Y.Chart.CategoryAxis=F;var O=function(){};O.prototype={type:null,displayName:null};Y.Chart.Series=O;var e=function(){e.superclass.constructor.apply(this,arguments);};Y.extend(e,O,{xField:null,yField:null,axis:"primary",showInLegend:true});Y.Chart.CartesianSeries=e;var C=function(){C.superclass.constructor.apply(this,arguments);};Y.extend(C,e,{type:"column"});Y.Chart.ColumnSeries=C;var T=function(){T.superclass.constructor.apply(this,arguments);};Y.extend(T,e,{type:"line"});Y.Chart.LineSeries=T;var a=function(){a.superclass.constructor.apply(this,arguments);};Y.extend(a,e,{type:"bar"});Y.Chart.BarSeries=a;var b=function(){b.superclass.constructor.apply(this,arguments);};Y.extend(b,O,{type:"pie",dataField:null,categoryField:null,labelFunction:null});Y.Chart.PieSeries=b;var I=function(){I.superclass.constructor.apply(this,arguments);
};Y.extend(I,e,{type:"stackbar"});Y.Chart.StackedBarSeries=I;var W=function(){W.superclass.constructor.apply(this,arguments);};Y.extend(W,e,{type:"stackcolumn"});Y.Chart.StackedColumnSeries=W;},"gallery-2010.08.18-17-12",{skinnable:false,requires:["datasource","gallery-aui-swf","json"]});