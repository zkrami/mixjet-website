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

    let resources = { "cloud": "./assets/imgs/cloud-base-1.png", airport: "./assets/imgs/airport-scene-3-Recovered.jpg" };

    resources.cloud = await loadImage(resources.cloud);
    resources.airport = await loadImage(resources.airport);


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

    function project({ x, y, z }) {
        let x0 = PERSPECTIVE.x;
        let y0 = PERSPECTIVE.y;
        let d = PERSPECTIVE.d;
        let sf = d / (z + d - PERSPECTIVE.offsetZ);
        // let px = x0 + (x - x0) * sf;
        // let py = PERSPECTIVE.offsetY + y0 + (y - y0) * sf;
        let px = x0 + x * sf;
        let py = y0 + y * sf;

        return { x: px, y: py, sf };
    }
    class Airport {
        constructor(ctx) {

            this.z = 1300;
            this.ctx = ctx;
            this.img = resources.airport;
            this.width = this.ctx.canvas.width ;
            this.height = this.ctx.canvas.height  ;
            this.x = -this.width/2;
            this.y = -this.height/2 - offsetY/2;
            this.s = 1.33;
        }
        render() {

            let projection = project(this);

            let ctx = this.ctx;
            ctx.save();
            ctx.drawImage(this.img, projection.x, projection.y, this.width * projection.sf, this.height * projection.sf);

            ctx.restore();


        }
    }
    class Cloud {

        constructor(ctx, img) {
            this.width = 700;
            this.height = 700;
            this.x = (Math.random() - 0.5) * ctx.canvas.width * 1.0;
            this.y = (Math.random() - 0.5) * windowCanvasHeight * 1.0;
            this.z = (Math.random() - 0.5) * PERSPECTIVE.d; // -500 500 
            
            this.s = 1 + 0.3 * Math.random();
            this.img = img;
            this.ctx = ctx;
            this.teta = 360 * Math.random();
        }

        update() {

        }
        render() {

            if (this.z - PERSPECTIVE.offsetZ <= -PERSPECTIVE.d) return;


            let ctx = this.ctx;
            ctx.save();
            let projection = project(this);

            ctx.translate(projection.x, projection.y);

            ctx.scale(projection.sf, projection.sf);
            ctx.scale(this.s, this.s);

            ctx.rotate(this.teta * Math.PI / 180);

            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            // ctx.drawImage(this.img, 0, 0, this.width, this.height);
            ctx.restore();
        }

    }




    const CLOUDS_COUNT = 100;
    let clouds = [];
    for (let i = 0; i < CLOUDS_COUNT; i++) {
        let c = new Cloud(ctx, resources.cloud);
        clouds.push(c);
    }
    let airport = new Airport(ctx);
    
    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);



        airport.render();

        for (let cloud of clouds) {
            //   cloud.z -= 10;
            cloud.render();
        }
        if (PERSPECTIVE.offsetZ <= 1500) {               
            PERSPECTIVE.offsetZ  += 10 ; 
            requestAnimationFrame(draw);
      }


    }
    let tl = new TimelineMax({paused:true}); 

    tl.to(PERSPECTIVE , 3 , { offsetZ : 1500 }  , 1 );
    
    //tl.play(0);
    setTimeout( () =>{
        requestAnimationFrame(draw);

    },3000);






}

$(function(){

    main();


});




