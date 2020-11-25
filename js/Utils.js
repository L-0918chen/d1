export default class Utils {

    // 创建元素   Utils.ce(类型，css，父级节点)
    static ce(type, style, parent) {
        let elem = document.createElement(type);
        if (style)
            Object.assign(elem.style, style);
        if (parent) {
            if (typeof parent === "string") parent = document.querySelector(parent);
            parent.appendChild(elem);
        }
        return elem;
    }
    //    添加类名   Utils.addClass（元素，要添加的类名）
    static addClass(elem, className) {
        if (!className) return;
        let classArr = elem.className.split(/\s+/).concat(className.split(/\s+/));
        classArr = Array.from(new Set(classArr));
        elem.className = classArr.join(" ");
    }
    //    删除类名   Utils.addClass（元素，要删除的类名）
    static removeClass(elem, className) {
        let classArr = elem.className.split(/\s+/);
        let arr = className.split(/\s+/);
        classArr = classArr.reduce((value, item) => {
            if (arr.indexOf(item) < 0) value.push(item);
            return value;
        }, []);
        elem.className = classArr.join(" ");
    }
    //  设置css样式   Utils.setCss（元素，css样式）
    static setCss(selector, styleObject) {
        if (document.styleSheets.length === 0) {
            Utils.ce("style", undefined, document.head);
        }
        let styleSheet = document.styleSheets[document.styleSheets.length - 1];
        let css = "";
        for (let prop in styleObject) {
            let value = styleObject[prop]
            prop = prop.replace(/[A-Z]/g, function (s) {
                return "-" + s.toLowerCase();
            })
            css += prop + ":" + value + ";";
        }
        if (styleSheet.insertRule) {
            styleSheet.insertRule(selector + "{" + css + "}", styleSheet.cssRules.length);
        } else {
            styleSheet.addRule(selector, css, styleSheet.cssRules.length);
        }
    }
    // 预加载图片 Utils.loadImage(图片地址数组，回调函数)
    static loadImage(arr, callBack) {
        let img = new Image();
        img.arr = arr;
        img.callBack = callBack;
        img.src = arr.shift();
        img.list = [];
        img.addEventListener("load", e => Utils.loadHandler(e));
    }
    static loadHandler(e) {
        let img = e.currentTarget;
        img.list.push(img.cloneNode(false));
        if (img.arr.length === 0) {
            img.callBack(img.list);
            return;
        }
        img.src = img.arr.shift();
    }
    // 随机颜色
    static ranColor() {
        let random_color = "#";
        for (let i = 0; i < 6; i++) {
            random_color += parseInt(Math.random() * 16).toString(16);
        }
        return random_color;
    }

}