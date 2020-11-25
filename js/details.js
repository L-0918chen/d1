export default class Details {
    data;
    constructor(data) {
        this.data = data;
        this.init();
    }
    init() {
        this.createLeft();
        this.createRight();
    }
    createLeft() {
        let magnifier_ele = document.querySelector(".magnifier");
        let magnifier = `<div class="big">
            <img src="${this.data.img[0]}" alt="">
            <div class="focus"></div>
        </div>
        <div class="small">
        <ul>`;
        for (let i = 0; i < this.data.imgList.length; i++) {
            magnifier += `<li><img src="${this.data.imgList[i]}" alt=""></li>`;
        }
        magnifier += `</ul>
        </div>
        <div class="scale">
            <img src="${this.data.img[0]}" alt="">
        </div>
        `
        magnifier_ele.innerHTML = magnifier
    }
    createRight() {
        // title元素
        let title_ele = document.querySelector(".title");
        let title = `
        <h1>
            <img src="./imgs/icon_ddzy.png" alt="">
            <span>${this.data.title}</span>
            <br>
            <span>${this.data.phone}</span>
        </h1>
        <h2>
            <span>${this.data.summary1}</span>
            <span>${this.data.summary2}</span>
        </h2>`;
        title_ele.innerHTML = title;

        // information元素
        let information_ele = document.querySelector(".information");
        let information = `
        <span>${this.data.author}</span>
        <span>${this.data.press}</span>
        <span>${this.data.date}</span>
        <br>
        <span>${this.data.leaderboard}</span>
        <span>
            <i style="width: 67px;height: 12px;;background: url(http://product.dangdang.com/images/icon_star.png) repeat-x 0 0;display: inline-block;"></i>
            ${this.data.comment}
        </span>`;
        information_ele.innerHTML = information;

        // price元素
        let price_ele = document.querySelector(".price");
        let price = `
        <div class="price-l">
            <div class="discount">
                <div class="box1">
                    <p>${this.data.discount}</p>
                    <p>${this.data.price}</p>
                </div>
                <div class="box2">
                    (5折)
                </div>
            </div>
            <div class="original">
                定价
                <del>${this.data.fixedPrice}</del>
            </div>
        </div>
        <div class="price-r">
            <div class="box">
                <div>
                    <img src="http://img7x1.ddimg.cn/imgother121/43/8/29114161_1.jpg" alt="">
                </div>
            </div>
        </div>`;
        price_ele.innerHTML = price;
    }
}