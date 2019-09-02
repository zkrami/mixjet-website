
import $ from 'jquery';
import * as ScrollMagic from "scrollmagic";
import { TweenMax, TimelineMax, Power3, Sine, Bounce, Elastic, Power2, Power0 } from "gsap";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);


function makeCloudsTimeLine() {

    let tl = new TimelineMax({});
    tl.set($(".airport-background"), {
        scale: 1,
        transformOrigin: "center center"
    });

    tl.add("cloud-action");
    let randomBezier = () => new Object({ values: Array(3).fill(0).map((v, i) => new Object({ y: `${(i % 2 == 0 ? "+=" : "-=")}${Math.random() * 20}` })) });
    let xLocation = (i, e) => {
        let { left } = $(e).position();
        left = Math.round(left * 100 / $(window).width()); // percentage left 
        console.log(left);
        return left < 50 ? "-=70%" : "+=70%";
    };
    
    /*tl.to($(".window"), 2, {
        scale: 2,
        transformOrigin: "90% center",
        opacity: 0,

        ease: Power3.easeInOut,

    }, "cloud-action");*/
    tl.to("#clouds-viewport" , 7 , {
        perspective : 250 , 
        ease: Power2.easeInOut
    } , 1 ); 

    return tl;

}


function XYtoTopLeftPercent({ x, y }) {
    return { left: `${x}%`, top: `${y}%` };
}

function XYtoSecreenPercent({ x, y }) {

    let width = $('html').width();
    let height = $('html').height();
    x = Math.round(x * 1000 / width) / 10;
    y = Math.round(y * 1000 / height) / 10;
    return { x, y };
}


// function quadraticLine(start, center, end) {
//     let curve = "M" + start.x + " " + start.y + " Q " + center.x + " " + center.y + " " + end.x + " " + end.y;
//     return makeSVG("path", {
//         d: curve, "stroke-width": 7, class: 'trip-line', stroke: '#f00',
//     });

// }
// function drawQuadratic(start, center, end) {
//     $(".test-svg").append(quadraticLine(start, center, end));
// }

class Airplane {



    getPointAtPercent(percent) {
        percent = percent * this.pathLength / 100;
        let point = this.path.getPointAtLength(percent);
        let matrix = this.path.getScreenCTM();
        let position = point.matrixTransform(matrix);
        return position;
    }

    getPointAtScreen(percent) {
        let point = this.getPointAtPercent(percent);

        return XYtoTopLeftPercent(XYtoSecreenPercent(point));
    }

    constructor() {
        let curve = "M1077.9,128.9C1054.1,271.1,927.8,361,883.1,361c-415.7,0-534.4,7.8-534.4,7.8c-50.9,0-195.6,102.7-195.6,224.3";
        //    this.path = makeSVG("path", { d: curve });
        this.path = document.getElementById("airplane-path");
        this.pathLength = this.path.getTotalLength();
        this.airplane = $("#airplane");
    }

    async makeTimeLine() {

        let obj = { position: 0 };

        let tl = new TimelineMax({
        });


        let values = await new Promise((res, rej) => {


            let result = [];
            let frames = 5;

            for (let i = 0; i <= frames; i++) {
                let precent = i * 100 / frames;
                let p = this.getPointAtScreen(100 - precent);
                result.push(p);
            }
            res(result);
        });

        tl.set(this.airplane, { ...values[0] });
        tl.to(this.airplane, 4, {
            bezier: {
                values,
                autoRotate: ["left", "top", "rotation", 90, false]
            },
        });

    }

}
$(function () {

  // let cloudsTimeLine =  makeCloudsTimeLine(); 
    let airplane = new Airplane();
    //airplane.makeTimeLine();

    let controller = new ScrollMagic.Controller();

    /*
    var scene = new ScrollMagic.Scene({ offset: 432, duration: 2000 })
        .setPin("#header")
        .setTween(cloudsTimeLine)
        .addTo(controller);
*/


});




