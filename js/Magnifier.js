import Utils from "./Utils.js";
export default class Magnifier{
    data;big;big_img;focus;scale;scale_img;ul;li;list;prev;
    constructor(data){
        this.data = data;
        this.init();
    }
    init(){
        this.big = document.querySelector("#item .magnifier .big")
        this.big_img = document.querySelector("#item .magnifier .big img");
        this.focus = document.querySelector("#item .magnifier .big .focus");
        this.scale = document.querySelector("#item .magnifier .scale");
        this.scale_img = document.querySelector("#item .magnifier .scale img")
        this.ul = document.querySelector("#item .magnifier .small ul")
        this.li = document.querySelectorAll("#item .magnifier .small ul li");
        this.list = Array.from(this.li);

        this.calculate()
        this.ul.addEventListener("click",e=>this.clickHandler(e));
        this.big.addEventListener("mouseenter", e => this.mouseHandler(e));
        this.big.addEventListener("mousemove", e => this.mouseHandler(e));
        this.big.addEventListener("mouseleave", e => this.mouseHandler(e));
    }
    clickHandler(e){
        let target = e.target || e.srcElement;
        while (target) {
            if (this.list.indexOf(target) !== -1) {
                let index = this.list.indexOf(target);
                this.changeImg(index);
                break;
            }
            target = target.parentNode;
        }
    }
    changeImg(i){
        let index = i || 0;
        if(this.prev) Utils.removeClass(this.prev,"active");
        this.prev = this.list[index];
        Utils.addClass(this.prev, "active");
        this.big_img.src = this.data.img[index];
        this.scale_img.src = this.data.img[index];
    }
    mouseHandler(e){
        if(e.type === "mouseenter"){
            this.big.addEventListener("mouseleave", e => this.mouseHandler(e));
            this.big.addEventListener("mousemove", e => this.mouseHandler(e));
        }else if(e.type === "mousemove"){
            this.focus.style.display = "block";
            this.scale.style.display = "block";
            let x = e.clientX - this.big_offset.left - this.focus_w / 2;
            let y = e.clientY - this.big_offset.top + document.documentElement.scrollTop - this.focus_h / 2;
            this.follow(x,y)
        }else if(e.type === "mouseleave"){
            this.focus.style.display = "none";
            this.scale.style.display  ="none"
        }
    }
    follow(x,y){
        // 边界检测
        if(x >= this.big_w - this.focus_w) x=this.big_w - this.focus_w;
        if(x <= 0) x=0;
        if(y >= this.big_h - this.focus_h) y = this.big_h - this.focus_h;
        if( y<=0 ) y=0;
        // focus移动
        this.focus.style.left = x + "px";
        this.focus.style.top = y + "px";

        this.scale_img.style.left = - x * (this.scale_img_w-this.scale_w) / (this.big_w - this.focus_w) + "px";
        this.scale_img.style.top = - y * (this.scale_img_h-this.scale_h) / (this.big_h - this.focus_h) + "px";
    }
    // 计算
    getOffset(dom) {
        var res = {
            left: 0,
            top: 0
        }
        while (dom != document.body) {
            res.left += dom.offsetLeft;
            res.top += dom.offsetTop;
            dom = dom.offsetParent;
        }
        return res;
    }
    calculate(){
        this.big_offset = this.getOffset(this.big);
        this.big_w = parseInt(getComputedStyle(this.big).width);
        this.big_h = parseInt(getComputedStyle(this.big).height);
        this.focus_w = parseInt(getComputedStyle(this.focus).width);
        this.focus_h = parseInt(getComputedStyle(this.focus).height);
        this.scale_w = parseInt(getComputedStyle(this.scale).width);
        this.scale_h = parseInt(getComputedStyle(this.scale).height);
        this.scale_img_w = parseInt(getComputedStyle(this.scale_img).width);
        this.scale_img_h = parseInt(getComputedStyle(this.scale_img).height);
    }
}