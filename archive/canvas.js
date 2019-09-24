import { TweenMax, TimelineMax } from 'gsap';
import * as Complex from 'complex-js';
import * as $ from 'jquery';
async function main() {

    async function loadImage(src) {

        return new Promise((res, rej) => {

            let img = new Image();
            img.src = src;
            img.onload = function () {
                res(img);
            }
        });

    }

    let resources = { "cloud1": "./assets/imgs/cloud-base-1.png", "cloud2": "./assets/imgs/cloud-base-2.png", "cloud3": "./assets/imgs/cloud-base-3.png", "cloud4": "./assets/imgs/cloud-base-4.png", "cloud4": "./assets/imgs/cloud-base-4.png", "cloud5": "./assets/imgs/cloud-base-5.png", airport: "./assets/imgs/airport-scene-3-Recovered.jpg" };
    for (let key in resources) {
        resources[key] = await loadImage(resources[key]);
    }


    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");



    let windowCanvasHeight = ctx.canvas.height * window.innerHeight / ctx.canvas.scrollHeight;
    let offsetY = ctx.canvas.height - windowCanvasHeight;

    // center of clouds scene 
    let PERSPECTIVE = {
        x: canvas.width / 2,
        y: offsetY + windowCanvasHeight / 2,
        //y: canvas.height / 2,
        offsetY,
        offsetZ: 0,
        d: 1000
    };
    function resetTransform() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function round2(x) {

        return Math.round(x);
        return Math.round(x * 100) / 100;
    }

    function project({ x, y, z }) {
        let x0 = PERSPECTIVE.x;
        let y0 = PERSPECTIVE.y;
        let d = PERSPECTIVE.d;
        let sf = d / (z + d - PERSPECTIVE.offsetZ);
        // let px = x0 + (x - x0) * sf;
        // let py = PERSPECTIVE.offsetY + y0 + (y - y0) * sf;
        let px = round2(x0 + x * sf);
        let py = round2(y0 + y * sf);


        return { x: px, y: py, sf };
    }
    class Airport {
        constructor(ctx) {

            this.z = 1300;
            this.ctx = ctx;
            this.img = resources.airport;
            this.width = this.ctx.canvas.width;
            this.height = this.ctx.canvas.height;
            this.x = -this.width / 2;
            this.y = -this.height / 2 - offsetY / 2;
            this.s = 1.33;
        }
        render() {

            let projection = project(this);

            let ctx = this.ctx;
            resetTransform();

            ctx.drawImage(this.img, projection.x, projection.y, this.width * projection.sf, this.height * projection.sf);



        }
    }
    class Cloud {

        selectImage() {

            let imageFactor = [1, 1, 1, 1, 1];
            imageFactor = imageFactor.map(e => Math.random() * e);
            let selectedImage = imageFactor.indexOf(Math.max(...imageFactor));
            return resources[`cloud${selectedImage + 1}`];


        }
        initImage() {
            let can = document.createElement("canvas");
            can.width = 384;
            can.height = 384;
            let width = 256;
            let height = 256;

            let x = (can.width - width) / 2;
            let y = (can.height - height) / 2;

            let ctx = can.getContext("2d");
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(this.teta * Math.PI / 180);
            ctx.fillStyle = "green";
            ctx.drawImage(this.img, - width / 2, - height / 2, width, height);
            this.imgData = can;

        }
        constructor(ctx, img) {
            this.width = 700;
            this.height = 700;
            this.x = (Math.random() - 0.5) * ctx.canvas.width * 0.7;
            this.y = (Math.random() - 0.5) * windowCanvasHeight * 0.7;
            this.z = (Math.random() - 0.5) * PERSPECTIVE.d; // -500 500 

            this.x = round2(this.x);
            this.y = round2(this.y);
            this.z = round2(this.z);

            this.s = 1.1 + 0.4 * Math.random();
            this.img = this.selectImage();
            this.ctx = ctx;
            this.teta = 360 * Math.random();
            this.initImage();
        }


        render() {


            let ctx = this.ctx;

            if (this.z - PERSPECTIVE.offsetZ <= -PERSPECTIVE.d) {
                return;
            }
            let projection = project(this);
            let s = this.s * projection.sf;
            ctx.setTransform(s, 0, 0, s, projection.x, projection.y);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);


        }

    }




    const CLOUDS_COUNT = 30;
    let clouds = [];
    for (let i = 0; i < CLOUDS_COUNT; i++) {
        let c = new Cloud(ctx, resources.cloud);
        clouds.push(c);
    }
    let airport = new Airport(ctx);
    function render() {
        resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        airport.render();

        for (let cloud of clouds) {
            //   cloud.z -= 10;
            cloud.render();
        }
    }
    let last = 0;
    function draw(elapsed) {

        render();

        if (PERSPECTIVE.offsetZ < 1510) {
            //requestAnimationFrame(draw);
        }

    }
    TweenMax.ticker.fps(30);

    TweenMax.ticker.addEventListener("tick", myFunction);

    function myFunction(event) {
        //executes on every tick after the core engine updates
        //render(); 
    }
    render(); 

    setTimeout(() => {
        TweenMax.to(PERSPECTIVE, 7, { offsetZ: 1510, ease: Power3.easeOut  , onUpdate : render });

    }, 3000);






}

$(function () {

    main();


});




