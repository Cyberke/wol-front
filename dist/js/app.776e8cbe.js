(function(){var e={9419:function(e,t){function r(e){if(void 0==e)return;const t=document.getElementsByClassName("username-roles");for(let r=0;r<t.length;r++){const n=t[r];for(let t=0;t<e.length;t++)1==e[t]&&(n.innerHTML+='<i class="fas fa-check-circle" data-title="V.I.P."></i>'),2==e[t]&&(n.innerHTML+='<i class="fas fa-user-shield" data-title="Moderátor"></i>'),3==e[t]&&(n.innerHTML+='<i class="fas fa-hammer" data-title="Adminisztátor"></i>'),4==e[t]&&(n.innerHTML+='<i class="fas fa-pencil-paintbrush" data-title="Dizájner"></i>'),5==e[t]&&(n.innerHTML+='<i class="fas fa-code" data-title="Fejlesztő"></i>'),6==e[t]&&(n.innerHTML+='<i class="fas fa-crown" data-title="Tulajdonos"></i>')}}function n(e,t,r){let n=new Date;n.setTime(n.getTime()+24*r*60*60*1e3);const s="expires="+n.toUTCString();document.cookie=e+"="+t+"; "+s+"; path=/; domain=wolimby.wol"}function s(e){const t=e+"=",r=decodeURIComponent(document.cookie),n=r.split("; ");let s;return n.forEach((e=>{0===e.indexOf(t)&&(s=e.substring(t.length))})),s}function o(e){document.cookie=e+"=; path=/; expires=thu, 01 jan 1970 00:00:01 GMT; domain=wolimby.wol"}t.IT=r,t.d8=n,t.ej=s,t.kT=o},9863:function(e,t,r){"use strict";var n=r(9242),s=r(3396);function o(e,t,r,n,o,a){const i=(0,s.up)("router-view"),c=(0,s.up)("Notifications");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s.Wm)(i),(0,s.Wm)(c)],64)}r(7658);var a=r(65),i=r(7139);const c={class:"before-icons"},u={key:0,class:"fas fa-check-circle"},l={key:1,class:"fas fa-times-circle"},d={key:2,class:"fas fa-info-circle"},f={key:3,class:"fas fa-exclamation-circle"},m=["onClick"],h=(0,s._)("i",{class:"fas fa-times"},null,-1),p=[h];function g(e,t,r,o,a,h){return(0,s.wg)(),(0,s.j4)(n.W3,{name:"list",tag:"div",class:"notifications-list"},{default:(0,s.w5)((()=>[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.notifications,(e=>((0,s.wg)(),(0,s.iD)("div",{key:e.id},[(0,s._)("div",{class:(0,i.C_)("notification "+e.type)},[(0,s._)("div",c,["success"==e.type?((0,s.wg)(),(0,s.iD)("i",u)):(0,s.kq)("",!0),"error"==e.type?((0,s.wg)(),(0,s.iD)("i",l)):(0,s.kq)("",!0),"information"==e.type?((0,s.wg)(),(0,s.iD)("i",d)):(0,s.kq)("",!0),"warning"==e.type?((0,s.wg)(),(0,s.iD)("i",f)):(0,s.kq)("",!0)]),(0,s._)("div",{onClick:t=>h.close(e.id),class:"close-btn"},p,8,m),(0,s._)("h2",null,(0,i.zw)(h.notificationTitle(e.type)),1),(0,s._)("h3",null,(0,i.zw)(e.message),1)],2)])))),128))])),_:1})}var v={name:"Notifications",data(){return{}},computed:{...(0,a.Se)(["notifications"])},methods:{...(0,a.nv)(["removeNotification"]),notificationTitle(e){switch(e){case"success":return"Siker";case"error":return"Hiba";case"information":return"Információ";case"warning":return"Figyelmeztetés"}},close(e){this.removeNotification(e)}}},y=r(89);const k=(0,y.Z)(v,[["render",g]]);var b=k,w={name:"App",components:{Notifications:b},computed:{...(0,a.Se)(["testError"])},methods:{...(0,a.nv)(["testAPI","checkBan","addNotification"]),console(){console.log("%cVárj!","color: blue; font-size: 100px;"),console.log("%cHa valaki azt mondta, másolj be ide valamit, akkor lehet, hogy át akar verni.","font-size: 20px;"),console.log("%cBemásolva ide bármit is, hozzáférést adhatsz a hackereknek a Wolimby fiókodhoz!","color: red; font-size: 20px;"),setInterval(this.console,3e5)}},mounted(){this.testAPI().then((e=>{if(void 0==e){const e={message:"A Wolimby Account szerverei alszanak. (500)",type:"information"};this.addNotification(e)}})),this.checkBan().then((e=>{e.data.banned&&this.$router.push("/banned")})),this.console()},created(){document.documentElement.setAttribute("data-theme","theme1")}};const S=(0,y.Z)(w,[["render",o]]);var T=S,U=r(2483),E=r(70),q=r(9419);const P={token:(0,q.ej)("token")||"",currentUser:{},user:{},status:"",error:null,loading:!1},A={isLoggedIn:e=>!!e.token,currentUser:e=>e.currentUser,user:e=>e.user,userError:e=>e.error,loading:e=>e.loading};E.ZP.defaults.headers.common.Authorization=P.token;const N={async login({commit:e},[t,r]){try{e("loginRequest");const n=await E.ZP.post("http://localhost:5001/users/login",t);if(n.data.success){const t=n.data.token,s=n.data.user;1==r?(0,q.d8)("token",t,365):(0,q.d8)("token",t),E.ZP.defaults.headers.common.Authorization=t,e("loginSuccess",t,s)}return n}catch(n){e("loginError",n)}},async register({commit:e},t){try{e("registerRequest");const r=await E.ZP.post("http://localhost:5001/users/register",t);return r.data.success&&e("registerSuccess",t),r}catch(r){e("registerError",r)}},async patchUser({commit:e},[t,r,n]){e("patchUserRequest");try{const s=await E.ZP.patch(`http://localhost:5001/users/patch/${t}?patching=${r}`,n);return s.data.success&&e("patchUserSuccess"),s}catch(s){e("patchUserError",s)}},async uploadImage({commit:e},t){e("uploadImageRequest");try{const e=await E.ZP.post("https://api.imgur.com/3/image/",t,{headers:{Authorization:"Client-ID 5dd1a25ab8e16c3"}});return e}catch(r){e("uploadImageError",r)}},async deleteNotifications({commit:e},t){try{e("notificationsRequest");const r=await E.ZP["delete"](`http://localhost:5001/users/notifications/delete/${t}`);return r.data.success&&e("notificationsSuccess"),r}catch(r){e("notificationsError",r)}},async getCurrentUser({commit:e}){try{e("currentUserRequest");const t=await E.ZP.get("http://localhost:5001/users/currentuser");return t.data.success&&e("currentUserSuccess",t.data.user),t}catch(t){e("currentUserError",t)}},async getUser({commit:e},t){try{e("userRequest");const r=await E.ZP.get(`http://localhost:5001/users/user/${t}`),n=r.data.user;return r.data.success&&e("userSuccess",n),r}catch(r){e("userError",r)}},async logout({commit:e}){(0,q.kT)("token"),e("logout"),delete E.ZP.defaults.headers.common.Authorization},async checkBan({commit:e}){try{e("checkBanRequest");const t=await E.ZP.get("http://localhost:5001/users/checkban");return t.data.banned&&((0,q.kT)("token"),e("logout"),delete E.ZP.defaults.headers.common.Authorization),t}catch(t){e("checkBanError",t)}},async deleteUser({commit:e},t){try{e("deleteUserRequest");const r=await E.ZP["delete"](`http://localhost:5001/users/delete/${t}`),n=r.data.user;return e("deleteUserSuccess",n),(0,q.kT)("token"),e("logout"),delete E.ZP.defaults.headers.common.Authorization,r}catch(r){e("deleteUserError",r)}}},R={loginRequest(e){e.error=null,e.status="Töltés.",e.loading=!0},loginSuccess(e,t,r){e.error=null,e.token=t,e.currentUser=r,e.status="Siker."},loginError(e,t){e.error=t.response.data.message,e.loading=!1},registerRequest(e){e.error=null,e.status="Töltés."},registerSuccess(e){e.error=null,e.status="Siker."},registerError(e,t){e.error=t.response.data.message},patchUserRequest(e){e.error=null,e.status="Töltés"},patchUserSuccess(e){e.status="Siker."},patchUserError(e,t){e.error=t.response.data.message},patchUserPrivacyRequest(e){e.error=null,e.status="Töltés"},patchUserPrivacySuccess(e){e.status="Siker."},patchUserPrivacyError(e,t){e.error=t.response.data.message},patchUserSiteRequest(e){e.error=null,e.status="Töltés"},patchUserSiteSuccess(e){e.status="Siker."},patchUserSiteError(e,t){e.error=t.response.data.message},uploadImageRequest(e){e.error=null,e.status="Töltés"},uploadImageSuccess(e){e.status="Siker."},uploadImageError(e,t){e.error=t.response.data.message},notificationsRequest(e){e.status="Töltés",e.loading=!0},notificationsSuccess(e){e.loading=!1},notificationsError(e,t){e.error=t.response.data.message},currentUserRequest(e){e.status="Töltés",e.loading=!0},currentUserSuccess(e,t){e.currentUser=t,e.loading=!1},currentUserError(e,t){e.error=t.response.data.message,429!=t.response.status&&(0,q.kT)("token")},userRequest(e){e.status="Töltés",e.loading=!0},userSuccess(e,t){e.user=t,e.loading=!1},userError(e,t){e.error=t.response.data.message,e.loading=!1},logout(e){e.error=null,e.status="",e.token="",e.currentUser=""},checkBanRequest(e){e.error=null,e.status="Töltés"},checkBanError(e,t){e.error=t.response.data.message},deleteUserRequest(e){e.error=null,e.status="Töltés"},deleteUserSuccess(e,t){e.currentUser=t},deleteUserError(e,t){e.error=t.response.data.message}};var z={state:P,actions:N,mutations:R,getters:A};const C={notifications:[]},j={notifications:e=>e.notifications},I={addNotification({commit:e},t){e("pushNotification",t);const r=new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");r.play(),setTimeout((function(){const t=Math.min(...C.notifications.map((e=>e.id)));e("deleteNotification",t)}),5e3)},removeNotification({commit:e},t){e("deleteNotification",t)}};let O=1;const Z={pushNotification(e,t){e.notifications.push({...t,id:O++})},deleteNotification(e,t){e.notifications.splice(e.notifications.map((e=>e.id)).indexOf(t),1)}};var L={state:C,actions:I,mutations:Z,getters:j};const _={error:null},x={testError:e=>e.error},B={async testAPI({commit:e}){try{e("testRequest");const t=await E.ZP.get("http://localhost:5001/testing/testrequest");return t.data.success&&e("testSuccess"),t}catch(t){e("testError",t)}}},D={testRequest(e){e.error=null},testSuccess(e){e.error=null},testError(e,t){e.error=t.name}};var M={state:_,actions:B,mutations:D,getters:x},H=(0,a.MT)({state:{},getters:{},mutations:{},actions:{},modules:{UserWarehouseCRUD:z,NotificationWarehouse:L,TestWarehouse:M}});const W=[{path:"/",name:"NoURL",component:()=>r.e(653).then(r.bind(r,2653)),meta:{requiresGuest:!0}},{path:"/auth",name:"Auth",component:()=>r.e(653).then(r.bind(r,2653)),meta:{requiresGuest:!0}},{path:"/access",name:"Access",component:()=>r.e(106).then(r.bind(r,106)),meta:{requiresAuth:!0}},{path:"/user/:username",name:"Profile",component:()=>r.e(255).then(r.bind(r,255)),meta:{requiresAuth:!0}},{path:"/iframe/user/:username",name:"ProfileIframe",component:()=>r.e(421).then(r.bind(r,9421)),meta:{requiresAuth:!0}},{path:"/settings",name:"ProfileSettings",component:()=>r.e(769).then(r.bind(r,3769)),meta:{requiresAuth:!0}},{path:"/banned",name:"Banned",component:()=>r.e(985).then(r.bind(r,7985))},{path:"/:catchAll(.*)",name:"NotFound",component:()=>r.e(805).then(r.bind(r,1805))}],F=(0,U.p7)({history:(0,U.PO)("/"),routes:W});F.beforeEach(((e,t,r)=>{e.matched.some((e=>e.meta.requiresAuth))?H.getters.isLoggedIn?r():r("/auth"):e.matched.some((e=>e.meta.requiresGuest))&&H.getters.isLoggedIn?r("/access"):r()}));var $=F;(0,n.ri)(T).use(H).use($).mount("#app")}},t={};function r(n){var s=t[n];if(void 0!==s)return s.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,r),o.exports}r.m=e,function(){var e=[];r.O=function(t,n,s,o){if(!n){var a=1/0;for(l=0;l<e.length;l++){n=e[l][0],s=e[l][1],o=e[l][2];for(var i=!0,c=0;c<n.length;c++)(!1&o||a>=o)&&Object.keys(r.O).every((function(e){return r.O[e](n[c])}))?n.splice(c--,1):(i=!1,o<a&&(a=o));if(i){e.splice(l--,1);var u=s();void 0!==u&&(t=u)}}return t}o=o||0;for(var l=e.length;l>0&&e[l-1][2]>o;l--)e[l]=e[l-1];e[l]=[n,s,o]}}(),function(){r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,{a:t}),t}}(),function(){r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){r.f={},r.e=function(e){return Promise.all(Object.keys(r.f).reduce((function(t,n){return r.f[n](e,t),t}),[]))}}(),function(){r.u=function(e){return"js/"+e+"."+{106:"66d89c60",255:"d547f9de",421:"4df540b8",653:"f80bd4dc",769:"d2df7f78",805:"7fb78734",985:"506720f9"}[e]+".js"}}(),function(){r.miniCssF=function(e){return"css/"+e+"."+{106:"35df1756",255:"90420c19",653:"608d1b80",769:"8faaccab"}[e]+".css"}}(),function(){r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="client:";r.l=function(n,s,o,a){if(e[n])e[n].push(s);else{var i,c;if(void 0!==o)for(var u=document.getElementsByTagName("script"),l=0;l<u.length;l++){var d=u[l];if(d.getAttribute("src")==n||d.getAttribute("data-webpack")==t+o){i=d;break}}i||(c=!0,i=document.createElement("script"),i.charset="utf-8",i.timeout=120,r.nc&&i.setAttribute("nonce",r.nc),i.setAttribute("data-webpack",t+o),i.src=n),e[n]=[s];var f=function(t,r){i.onerror=i.onload=null,clearTimeout(m);var s=e[n];if(delete e[n],i.parentNode&&i.parentNode.removeChild(i),s&&s.forEach((function(e){return e(r)})),t)return t(r)},m=setTimeout(f.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=f.bind(null,i.onerror),i.onload=f.bind(null,i.onload),c&&document.head.appendChild(i)}}}(),function(){r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){r.p="/"}(),function(){var e=function(e,t,r,n){var s=document.createElement("link");s.rel="stylesheet",s.type="text/css";var o=function(o){if(s.onerror=s.onload=null,"load"===o.type)r();else{var a=o&&("load"===o.type?"missing":o.type),i=o&&o.target&&o.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+i+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=a,c.request=i,s.parentNode.removeChild(s),n(c)}};return s.onerror=s.onload=o,s.href=t,document.head.appendChild(s),s},t=function(e,t){for(var r=document.getElementsByTagName("link"),n=0;n<r.length;n++){var s=r[n],o=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(o===e||o===t))return s}var a=document.getElementsByTagName("style");for(n=0;n<a.length;n++){s=a[n],o=s.getAttribute("data-href");if(o===e||o===t)return s}},n=function(n){return new Promise((function(s,o){var a=r.miniCssF(n),i=r.p+a;if(t(a,i))return s();e(n,i,s,o)}))},s={143:0};r.f.miniCss=function(e,t){var r={106:1,255:1,653:1,769:1};s[e]?t.push(s[e]):0!==s[e]&&r[e]&&t.push(s[e]=n(e).then((function(){s[e]=0}),(function(t){throw delete s[e],t})))}}(),function(){var e={143:0};r.f.j=function(t,n){var s=r.o(e,t)?e[t]:void 0;if(0!==s)if(s)n.push(s[2]);else{var o=new Promise((function(r,n){s=e[t]=[r,n]}));n.push(s[2]=o);var a=r.p+r.u(t),i=new Error,c=function(n){if(r.o(e,t)&&(s=e[t],0!==s&&(e[t]=void 0),s)){var o=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;i.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",i.name="ChunkLoadError",i.type=o,i.request=a,s[1](i)}};r.l(a,c,"chunk-"+t,t)}},r.O.j=function(t){return 0===e[t]};var t=function(t,n){var s,o,a=n[0],i=n[1],c=n[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(s in i)r.o(i,s)&&(r.m[s]=i[s]);if(c)var l=c(r)}for(t&&t(n);u<a.length;u++)o=a[u],r.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return r.O(l)},n=self["webpackChunkclient"]=self["webpackChunkclient"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=r.O(void 0,[998],(function(){return r(9863)}));n=r.O(n)})();
//# sourceMappingURL=app.776e8cbe.js.map