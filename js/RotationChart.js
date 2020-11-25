
// 轮播图的封装
// 用法 new RotationChart(轮播图宽，轮播图高，轮播图数组，间隔时间，切换速度，父级节点，箭头左右距离，ul类名，li类名，当前li颜色,其他li颜色)
import Utils from "./Utils.js";

export default class RotationChart {
    bnList;
    list;
    imgCon;
    dotUl;
    prev;
    _time;
    pos = 0;
    bool = false;
    autoBool = false;
    x = 0;
    direction = "left";
    WIDTH; HEIGHT; arr; time; parent; speed; bnDistance; liName; ulName;color1;color2;
    constructor(WIDTH, HEIGHT, arr, time, speed, par, bnDistance, ulName,liName,color1,color2) {
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.arr = arr;
        this.time = time;
        this.speed = speed;
        this.bnDistance = bnDistance + "px";
        this.ulName = ulName;
        this.liName = liName;
        this.color1 = color1;
        this.color2 = color2;
        this.parent = document.querySelector(par);
        this.init();
    }
    init() {
        this._time = this.time;
        Utils.loadImage(this.arr, this.finishHandler.bind(this));
    }
    finishHandler(arr) {
        this.bnList = arr.splice(0, 2);
        this.list = arr.map(item => {
            item.style.width = this.WIDTH + "px";
            item.style.height = this.HEIGHT + "px";
            return item;
        });
        this.createCarousel();
        this.animation();
    }
    createCarousel() {
        let carousel = Utils.ce("div", {
            width: this.WIDTH + "px",
            height: this.HEIGHT + "px",
            position: "relative",
            margin: "auto",
            overflow: "hidden"
        });
        this.createImgCon(carousel);
        this.createDot(carousel);
        this.creatBn(carousel);
        this.parent.appendChild(carousel);
        carousel.addEventListener("mouseenter", e => this.mouseHandler(e));
        carousel.addEventListener("mouseleave", e => this.mouseHandler(e));
        this.changeDot();
    }
    mouseHandler(e) {
        if (e.type === "mouseenter") {
            this.autoBool = false;
            this.time = this._time;
        } else {
            this.autoBool = true;
        }
    }
    changeDot() {
        if (this.prev) {
            this.prev.style.backgroundColor = this.color2;
        }
        this.prev = this.dotUl.children[this.pos];
        this.prev.style.backgroundColor = this.color1;
    }
    createImgCon(parent) {
        this.imgCon = Utils.ce("div", {
            width: this.WIDTH * 2 + "px",
            height: this.HEIGHT,
            position: "absolute",
            left: 0
        }, parent)
        this.imgCon.appendChild(this.list[0]);
    }
    creatBn(parent) {
        this.bnList.forEach((item, index) => {
            Object.assign(item.style, {
                position: "absolute",
                top: (this.HEIGHT - item.height) / 2 + "px",
                left: index === 0 ? this.bnDistance : "none",
                right: index === 0 ? "none" : this.bnDistance,
                cursor: "pointer"
            });
            item.addEventListener("click", this.bnClickHandler.bind(this));
            parent.appendChild(item);
        });
    }
    bnClickHandler(e) {
        if (this.bool) return;
        if (this.bnList.indexOf(e.currentTarget) === 0) {
            this.direction = "right";
            this.pos--;
            if (this.pos < 0) {
                this.pos = this.list.length - 1;
            }
        } else {
            this.direction = "left";
            this.pos++;
            if (this.pos > this.list.length - 1) {
                this.pos = 0;
            }
        }
        this.createNextImg();
    }
    createNextImg() {
        if (this.direction === "left") {
            this.imgCon.appendChild(this.list[this.pos]);
            this.x = 0;
        } else {
            this.imgCon.insertBefore(this.list[this.pos], this.imgCon.firstElementChild);
            this.imgCon.style.left = -this.WIDTH + "px";
            this.x = -this.WIDTH;
        }
        this.changeDot();
        this.bool = true;
    }
    createDot(parent) {
        this.dotUl = Utils.ce("ul");
        parent.appendChild(this.dotUl);
        Utils.addClass(this.dotUl,this.ulName)
        this.list.forEach(() => {
            let li = Utils.ce("li");
            this.dotUl.appendChild(li);
            Utils.addClass(li, this.liName);
            li.style.backgroundColor = this.color2;
        });
        this.dotUl.addEventListener("mouseover", e => this.dotMouseoverHandler(e));
    }
    dotMouseoverHandler(e) {
        if (this.bool) return;
        if (e.target.constructor !== HTMLLIElement) return;
        let index = Array.from(this.dotUl.children).indexOf(e.target);
        if (index === this.pos) return;
        if (index > this.pos) {
            this.direction = "left";
        } else {
            this.direction = "right";
        }
        this.pos = index;
        this.createNextImg();
    }
    animation() {
        window.requestAnimationFrame(this.animation.bind(this));
        this.imgMove();
        this.autoPlay();
    }
    imgMove() {
        if (!this.bool) return;
        if (this.direction === "left") {
            this.x -= this.speed;
            if (this.x < -this.WIDTH) {
                this.bool = false;
                this.imgCon.firstElementChild.remove();
                this.x = 0;
            }
        } else {
            this.x += this.speed;
            if (this.x > 0) {
                this.bool = false;
                this.imgCon.lastElementChild.remove();
                this.x = 0;
            }
        }
        this.imgCon.style.left = this.x + "px";
    }
    autoPlay() {
        if (!this.autoBool) return;
        this.time--;
        if (this.time > 0) return;
        this.time = 150;
        var evt = new MouseEvent("click");
        this.bnList[1].dispatchEvent(evt);
    }
}