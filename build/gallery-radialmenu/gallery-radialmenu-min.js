YUI.add("gallery-radialmenu",function(A){var H=A.Lang,E=function(M,L){return A.bind(M,L);},F=function(L){if(L){L.cancel();L=null;}},C=function(M,L){var N=M[L];if(N){N.detach();M[L]=null;}},K=function(L){K.superclass.constructor.apply(this,arguments);};K.NAME="radialMenuPanel";K.ATTRS={centerpt:{value:null,validator:H.isArray},content:{value:"",validator:H.isString},hoverClass:{value:"yui-radialmenupanel-hover",validator:H.isString},index:{value:0,validator:H.isNumber},radialpt:{value:null,validator:H.isArray},styles:{value:null,validator:H.isObject},tagName:{value:"div",validator:H.isString}};A.extend(K,A.Overlay,{_mouseEnterHandler:null,_mouseLeaveHandler:null,_handleMouseEnter:function(){this.get("boundingBox").addClass(this.get("hoverClass"));},_handleMouseLeave:function(){this.get("boundingBox").removeClass(this.get("hoverClass"));},bindUI:function(){var M=this,L=M.get("boundingBox");M._mouseEnterHandler=L.on("mouseenter",E(M._handleMouseEnter,M));M._mouseLeaveHandler=L.on("mouseleave",E(M._handleMouseLeave,M));},destructor:function(){var M=this,L=M.get("boundingBox")._node;M.hide();K.superclass.destructor.apply(M,arguments);if(L.parentNode){L.parentNode.removeChild(L);}},hide:function(){C(this,"_mouseEnterHandler");C(this,"_mouseLeaveHandler");K.superclass.hide.apply(this,arguments);},initializer:function(L){K.superclass.initializer.apply(this,arguments);},renderUI:function(){this.hide();},show:function(){this.bindUI();K.superclass.show.apply(this,arguments);},syncUI:function(){var L=this.get("content");if(L){this.get("contentBox").set("innerHTML",L);}}});A.RadialMenuPanel=K;var B="yui-"+A.RadialMenuPanel.NAME.toLowerCase(),I=function(L,M){return A.Array.find(L,function(N,O){return N.get("boundingBox").get("id")==M.get("id");});},D=function(L,M,N){return L>M&&L<N;},G=function(L){G.superclass.constructor.apply(this,arguments);};G.ATTRS={closeOnClick:{value:true},diameter:{value:100,validator:function(L){return H.isNumber(L)&&100<L;}},keyHoldTimeout:{value:500,validator:H.isNumber},panels:{value:[],validator:H.isArray},centerPoint:{value:null,validator:H.isArray},useMask:{value:false,validator:H.isBoolean}};G.NAME="radialMenu";A.extend(G,A.Overlay,{_isKeyPressed:false,_selectedPanel:null,_nodeClickHandle:null,_keyDownHandle:null,_keyUpHandle:null,_timerKeyDown:null,_handleClick:function(Q){var M=this.get("panels"),O=Q.target,P=O.hasClass(B)?O:O.ancestor("."+B),L,N;if(P){L=I(M,P);if(L){Q.halt();N=L.get("index");this.fire("panelClicked",L.get("boundingBox"),L);this.fire("panelClicked"+N,L.get("boundingBox"),L);}}if(this.get("closeOnClick")){this.hide();}},_handleKeyDown:function(Q){var N=this.get("panels"),R=this._selectedPanel,O=R?R.get("index"):0,S=N.length,P=false,L,M=S%2;switch(Q.keyCode){case 38:if(0!=O){P=true;if(S/2>O){O-=1;}else{O+=1;}}break;case 39:L=S/4;if(L!=O&&!(M&&D(O,L-1,L+1))){P=true;if(L>=O+1||S-L<=O){O+=1;}else{if(L<=O-1){O-=1;}}}break;case 40:L=S/2;if(L!=O&&!(M&&D(O,L-1,L+1))){P=true;if(L>=O+1){O+=1;}else{if(L<=O-1){O-=1;}}}break;case 37:L=S/4;if(S-L!=O&&!(M&&D(O,S-L-1,S-L+1))){P=true;if(L<O&&S-L>=O+1){O+=1;}else{if(S-L<=O-1||O<=L){O-=1;}}}break;case 13:if(R){Q.target=R.get("boundingBox");this._handleClick(Q);}break;case 27:this.hide();break;}if(P){F(this._timerKeyDown);if(0>O){O=S-1;}else{if(S-1<O){O=0;}}S=this.get("keyHoldTimeout");if(0<S){this._timerKeyDown=A.later(S,this,this._handleKeyDown,Q);}if(R){R._handleMouseLeave();}R=N[O];this._selectedPanel=R;R._handleMouseEnter();this._isKeyPressed=true;}},_handleKeyUp:function(L){F(this._timerKeyDown);this._isKeyPressed=false;},bindUI:function(){var M=this,L=document;if(!M._keyDownHandle){M._keyDownHandle=A.on("keydown",E(M._handleKeyDown,M),L);M._keyUpHandle=A.on("keyup",E(M._handleKeyUp,M),L);M._nodeClickHandle=A.on("click",E(M._handleClick,M),L);}},destructor:function(){this.hide();},hide:function(){var L=this;C(L,"_nodeClickHandle");C(L,"_keyDownHandle");C(L,"_keyUpHandle");F(L._timerKeyDown);if(L._selectedPanel){L._selectedPanel.syncUI();L._selectedPanel=null;}A.each(L.get("panels"),function(M){M.hide();});G.superclass.hide.apply(this,arguments);},initializer:function(L){this.get("boundingBox").setStyle("position","absolute");},show:function(){var O=this,N,M,L;A.later(1,O,O.bindUI);O.syncUI(true);if(O.get("useMask")){N=O.get("boundingBox");L=N.get("docHeight");M=N.get("docWidth");N.setStyle("height",L+"px");N.setStyle("width",M+"px");G.superclass.show.apply(O,arguments);}},syncUI:function(P){var Q=this,T=Q.get("panels"),N=Q.get("panels").length,R=Q.get("diameter")/2,X=Q.get("centerPoint"),O=360/N,W,M,V,U,L,S;if(!X){S=Q.get("boundingBox").get("viewportRegion");X=[S.left+(S.width-5)/2,S.top+(S.height-5)/2];}if(!P){this.hide();}A.each(T,function(Y,Z){L=Y.get("boundingBox").get("region");W=(O*Z-90)*Math.PI/180;V=X[0]+R*Math.cos(W);U=X[1]+R*Math.sin(W);Y.set("xy",[V,U]);Y.set("index",Z);Y.set("centerpt",[X[0]-(L.width/2),X[1]-(L.height/2)]);Y.set("radialpt",[V,U]);Y[Y.get("rendered")?"syncUI":"render"]();Y[P?"show":"hide"]();Y.after(Y._handleMouseEnter,function(){Q._selectedPanel=Y;});Y.after(Y._handleMouseLeave,function(){Q._selectedPanel=null;});},Q);}});A.RadialMenu=G;if(A.Anim&&A.Plugin){var J=function(L){J.superclass.constructor.apply(this,arguments);this._enabled=true;};J.ATTRS={animType:{value:"radiate",validate:function(L){return"rotate"==L||"radiate"==L;}},duration:{value:1,validate:H.isNumber},easingIn:{value:A.Easing.elasticIn},easingOut:{value:A.Easing.elasticOut},rotation:{value:90,validate:H.isNumber}};J.NS="radialMenuAnim";A.extend(J,A.Plugin.Base,{_enabled:null,animClosed:function(){if(!this._enabled){return;}var M=this.get("host"),L=M.get("panels"),Q=this.get("animType")+"In",P=L.length,N=this.get("duration"),O=this.get("easingIn");A.each(L,function(R,S){R.show();var T=new A.Anim({duration:N,easing:O,node:R.get("boundingBox")});this[Q](T,R.get("centerpt"),R.get("radialpt"));T.on("end",A.bind(R.hide,R));T.run();},this);},animOpen:function(){if(!this._enabled){return;}var M=this.get("host"),L=M.get("panels"),P=this.get("animType")+"Out",N=this.get("duration"),O=this.get("easingOut");
A.each(L,function(Q){Q.show();var R=new A.Anim({duration:N,easing:O,node:Q.get("boundingBox")});this[P](R,Q.get("centerpt"),Q.get("radialpt"));R.run();},this);},destructor:function(){},disable:function(){this._enabled=false;},enable:function(){this._enabled=true;},initializer:function(){var M=this,L=M.get("animType");M.doAfter("syncUI",M.syncUI);M.doAfter("hide",M.animClosed);M.doAfter("show",M.animOpen);},radiateIn:function(M,N,L){M.set("to",{left:N[0],top:N[1]});},radiateOut:function(M,N,L){M.set("to",{left:L[0],top:L[1]});},rotateIn:function(M,N,L){M.set("to",{curve:this.rotateInCurve(N,L)});},rotateInCurve:function(L,R){var Q=this.get("host").get("diameter")/2,U=this.get("rotation"),O=((L[0]-R[0])/Q),T=[],P=0,M=10,S=U/M,N=Q/M;for(0;P<M;P+=1){T[P]=[Math.floor(L[0]+Q*Math.cos(O)),Math.floor(L[1]+Q*Math.sin(O))];O-=S;Q-=N;}T[P]=L;return T;},rotateOut:function(M,N,L){M.set("to",{curve:this.rotateOutCurve(N,L)});},rotateOutCurve:function(L,R){var Q=this.get("host").get("diameter")/2,U=this.get("rotation"),O=((R[0]-L[0])/Q)-U,T=[],P=0,M=10,S=U/M,N=Q/M;Q=N;O=S;for(1;P<M;P+=1){T[P]=[Math.floor(L[0]+Q*Math.cos(O)),Math.floor(L[1]+Q*Math.sin(O))];O+=S;Q+=N;}T[P]=R;return T;},syncUI:function(L){if(!this._enabled){return;}A.each(this.get("host").get("panels"),function(M){var N=M.get("boundingBox"),O=M.get("centerpt");N.setStyle("left",O[0]+"px");N.setStyle("top",O[1]+"px");});}});A.RadialMenuAnim=J;}},"@VERSION@",{optional:["anim","plugin"],requires:["overlay","collection","event-mouseenter","node"]});