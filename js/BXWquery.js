; (function (window, document) {


    // 无new调用
    var BXWquery = function (selector) {
        return new BXWquery.prototype.init(selector);
    }

    BXWquery.fn = BXWquery.prototype = {
        // constructor: BXWquery,

        // dom操作
        // css取值与赋值
        css: function (options) {
            if (typeof options === "undefined") {
                throw "参数错误, css必须传递参数";
            }
            //如果是数组就为取出元素   只取第一个元素的值
            var attr_list = {}
            if (options instanceof Array) {
                for (var i = 0; i < options.length; i++) {
                    var attr_value = parseFloat(getComputedStyle(this[0])[options[i]]);
                    switch (options[i]) {
                        case "left":
                            attr_list.left = attr_value ? attr_value : this[0].offsetLeft;
                            break;
                        case "top":
                            attr_list[options[i]] = attr_value ? attr_value : this[0].offsetTop;
                            break;
                        default:
                            attr_list[options[i]] = attr_value;
                    }
                    
                }

                return attr_list;
            }

            //赋值
            for (var i = 0; i < this.length; i++) {
                for (var attr in options) {
                    this[i].style[attr] = options[attr];
                }
            }
            return this;
        },

        // 查找类名
        hasClass: function (className) {
            var className_string = this[0].className;
            if (className_string.indexOf(className) === -1) {
                return false;
            }
            return true;
        },
        // 添加类名
        addClass: function (className) {
            for (var i = 0; i < this.length; i++) {
                if (this.hasClass(className)) {
                    return false;
                }
                this[i].className += " " + className;
            }
        },

        // 删除类名
        removeClass : function (className) {
            for (var i = 0; i < this.length; i++) {
                var dom = this[i];
                var className_string = dom.className;
                dom.className = className_string.split(className).join("");
            }
        },

        // 删除元素
        remove: function () {
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
        },

        // 查找到个元素
        eq : function( index ){
            // eq 找到单个元素使用的;
            // 找到单个元素这个单个元素我们需要原型;
            return { 0 : this[index] , length : 1 , __proto__ : GP4Utils.fn , prev : this}
      },

        // 运动
        animate: function (attr_list, callback = () => { }, timing_function = "buffering") {
            for (let i = 0; i < this.length; i++) {
                let ele = this[i];
                ele.attr_list = JSON.parse(JSON.stringify(attr_list));

                let moving_count = 0;
                for (let attr in ele.attr_list) {
                    // attr 是属性名;
                    // attr_list[attr] 是属性值;
                    if (attr === "opacity") {
                        ele.attr_list[attr] = {
                            start: Math.round(getComputedStyle(ele)[attr] * 100),
                            target: Math.round(attr_list[attr] * 100)
                        }
                    } else {
                        ele.attr_list[attr] = {
                            start: parseInt(getComputedStyle(ele)[attr]),
                            target: attr_list[attr]
                        }
                    }
                    moving_count++;
                }
                ele.attr_list.moving_count = moving_count;

                clearInterval(ele.t);
                // 在定时器里面用for循环;
                ele.t = setInterval(() => {
                    // 算速度 : 
                    for (let attr in ele.attr_list) {
                        if (attr === "moving_count") continue;
                        // 1. target 
                        // 2. start;
                        let distance = ele.attr_list[attr].target - ele.attr_list[attr].start;
                        let speed = distance / 10;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

                        ele.attr_list[attr].start += speed;

                        if (attr === "opacity") {
                            ele.style[attr] = ele.attr_list[attr].start / 100;
                        } else {
                            ele.style[attr] = ele.attr_list[attr].start + "px";
                        }

                        // 每当有一个属性到达了目标点，那么就把moving_count 数量减少一个;
                        if (ele.attr_list[attr].start === ele.attr_list[attr].target) {
                            // 如果已经没有了正在运行的属性，那么我们就关闭定时器;
                            ele.attr_list.moving_count--;
                            if (ele.attr_list.moving_count === 0) {
                                clearInterval(ele.t);
                                callback();
                            }
                            // 删除当前的运动的属性;
                            delete ele.attr_list[attr];
                        }
                    }
                }, 20)
            }
        }
    }

    // 绑定事件
    var on = BXWquery.fn.on = function (type, selector, callback) {
        for (var i = 0; i < this.length; i++) {
            var dom = this[i];
            if (arguments === 3) {
                dom.addEventListner(type, function (evt) {
                    var e = evt || event;
                    var target = e.target || e.srcElement
                    var eles = dom.querySelectorAll(selector);
                    if (eles) {
                        eles = [].slice.call(eles);
                    } else {
                        return false;
                    }
                    while (target != dom && target) {
                        if (eles.indexOf(target) !== -1) {
                            callback.call(target, e);
                            break;
                        }
                        target = target.parentNode;
                    }

                });
                return false;
            }
            callback = selector;
            // 在这之后使用的参数是一致的;
            dom.addEventListener(type, callback);
        }

    }

    // es6渲染页面
    BXWquery.template = ( template_selector , data ) => {
        var template_str = document.querySelector(template_selector).innerHTML;
        // 正则处理字符串;
        // 1. <%=%>
        template_str = template_str.replace(/<%=([\s\S]*?)%>/g , `\`);  print($1); print(\``);
        // 2. <%%>
        template_str = template_str.replace(/<%([\s\S]*?)%>/g,`\`); $1 \n print(\``)
        template_str = `print(\` ${template_str }\`)`;
        let html = "";
        let print = ( str )=>{
              html += str;
        }
        eval(template_str);
        return html;
  }


    // 计算时间
    BXWquery.countDown = function(  arr , fn ){
        // 目标时间 : 
        // target 是一个数组;
        // [2020,08,11,18,30,00];
        // 年月日拼接 : 2020/08/11

        var date_nyr = arr.slice(0, 3).join("/");
        var date_sfm = arr.slice(3).join(":");
        var date_str = date_nyr + " " + date_sfm;
        var date_tar = new Date(date_str);
        var tar = date_tar.getTime();

        var t = setInterval(function () {
            var now = Date.now();
            var chuo = tar - now;
            var day = Math.floor(chuo / 1000 / 3600 / 24);
            var hour = Math.floor(chuo / 1000 / 60 / 60 % 24);
            var min = Math.floor(chuo / 1000 / 60 % 60);
            var sec = Math.round(chuo / 1000 % 60);

            fn({
                "day" : day,
                "hour" : hour,
                "min" : min,
                "sec" : sec
            })
            if ( chuo <= 0 ) {
            clearInterval(t)
            return false ;
        }
        }, 1000)
}

    // 随机颜色
    BXWquery.ranColor = function(){
        var random_color = "#";
        for(var i = 0 ; i < 6 ; i ++){
              random_color += parseInt(Math.random() * 16).toString(16);
        }
        return random_color;
    }



    //真正的构造函数
    var init = BXWquery.prototype.init = function (selector) {
        // 判定selector : 
        if (typeof selector === "string") {
            // 1. 选中所有元素;
            var eles = document.querySelectorAll(selector);
            // 2. 把所有的元素放入到 实例对象之中;
            for (var i = 0; i < eles.length; i++) {
                this[i] = eles[i];
            }
            // 3. 给实例对象添加length属性;
            this.length = eles.length;
        }
        if (selector.nodeType === 1 || selector.nodeType === 9) {
            this[0] = selector;
            this.length = 1;
        }
    }
    init.prototype = BXWquery.prototype;


    window.$ = window.BXWquery = BXWquery;
})(window, document)