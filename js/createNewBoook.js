import Utils from "./Utils.js";
export default class createNewBoook {
    data; RotationChart2_ele; ul_ele;
    constructor(data) {
        this.data = data;
        this.RotationChart2_ele = document.querySelector(".RotationChart2");
        this.ul_ele = document.querySelector(".banner-con .banner-right .hot .hot-list .hot-con ul");
        this.init();
    }
    init() {
        this.createRotationChart2();
        this.creategeneral();
    }
    createRotationChart2() {

        var RotationChart2 = `<ul>`
        for (let i = 0; i < 8; i++) {
            RotationChart2 += `<li>
            <a href="./details.html?id=${this.data[i].id}" class="imga">
                <img src="${this.data[i].img[0]}" alt="">
            </a>
            <p class="name">
                <a href="">${this.data[i].title}</a>
            </p>
            <p class="author">
                <span>${this.data[i].author}</span>
            </p>
            <p class="price">
                <span>${this.data[i].price}</span>
                <del>${this.data[i].fixedPrice}</del>
            </p>
        </li>`
        }
        RotationChart2 += `
        </ul>
        `;
        this.RotationChart2_ele.innerHTML = RotationChart2;
    }
    creategeneral() {
        let ul = ``;
        for(let i = 0 ; i < 10 ; i ++){
            console.log(this.data);
            ul += `
            <a href="./details.html?id=${this.data[i].id}">
            <li>
            <span class="num">${i+1}</span>
            <img src="${this.data[i].img[0]}" alt="">
            <p class="name">${this.data[i].title}</p>
            <p class="price">
                <span>${this.data[i].price}</span>
                <del>${this.data[i].fixedPrice}</del>
            </p>
                <p class="link">${this.data[i].comment}</p>
        </li>
        </a>
            `;
            
        }
        this.ul_ele.innerHTML = ul;
        this.accordion();
    }
    accordion() {
        var li = document.querySelectorAll(".banner-con .banner-right .hot .hot-list .hot-con ul li");
        var imgs = document.querySelectorAll(".banner-con .banner-right .hot .hot-list .hot-con ul li img")
        li = Array.from(li);
        imgs = Array.from(imgs);
        for (let i = 0; i < li.length; i++) {
            imgs[i].style.display = "none";
            li[i].onmouseover = function () {
                for (let j = 0; j < li.length; j++) {
                    if (j === i) {
                        li[j].style.height = "151px"
                        imgs[i].style.display = "block";
                    } else {
                        li[j].style.height = "36px"
                    }
                }
            }
        }
    }
}