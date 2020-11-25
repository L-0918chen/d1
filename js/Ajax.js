import QueryString from "./QueryString.js";

export  default  class Ajax{
    static get(url,data){
        Ajax.ajax(url,data,"get");
    }
    static  post(url,data){
        Ajax.ajax(url,data);
    }
    static  ajax(url,data,method="post"){
        let type=url.split("/").slice(-1)[0];
        if(method==="get"){
            url=url+"?"+(data ? QueryString.stringify(data) : "");
            data="";
        }
        if(data===undefined) data="";
         let xhr=new XMLHttpRequest();
         xhr.type=type;
         xhr.addEventListener("readystatechange",Ajax.readystateHandler);
         xhr.open(method,url);
         xhr.send(JSON.stringify(data));

    }
    static  readystateHandler(e){
        if(e.currentTarget.readyState===4 && e.currentTarget.status===200){
            var evt=new Event(e.currentTarget.type);
            // console.log(e.currentTarget.response);
            evt.data=JSON.parse(e.currentTarget.response);
            document.dispatchEvent(evt)
        }
    }
}