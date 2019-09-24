
import $ from 'jquery';
import * as ScrollMagic from "scrollmagic";
import { TweenMax, TimelineMax, Power3, Sine, Bounce, Elastic, Power2, Power0 } from "gsap";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);


function makeCloudsTimeLine() {

    let tl = new TimelineMax({});


    tl.add("cloud-action");
    let randomBezier = () => new Object({ values: Array(3).fill(0).map((v, i) => new Object({ y: `${(i % 2 == 0 ? "+=" : "-=")}${Math.random() * 20}` })) });
    let xLocation = (i, e) => {
        let { left } = $(e).position();
        left = Math.round(left * 100 / $(window).width()); // percentage left 
        return left < 50 ? "-=70%" : "+=70%";
    };

    /*tl.to($(".window"), 2, {
        scale: 2,
        transformOrigin: "90% center",
        opacity: 0,

        ease: Power3.easeInOut,

    }, "cloud-action");*/
    tl.to("#viewport", 7, {
        perspective: 250,
        ease: Power3.easeOut
    });

    tl.set("#airport-airplane", {
        "display": "none"
    });
    tl.set("#airplane", {
        "display": "block"
    });

    return tl;

}


function XYtoTopLeftPercent({ x, y }) {
    return { left: `${x}px`, top: `${y}px` };
}

function XYtoSecreenPercent({ x, y }) {
    return { x, y };
    let width = $('html').width();
    let height = $('html').height();
    x = Math.round(x * 1000 / width) / 10;
    y = Math.round(y * 1000 / height) / 10;
    return { x, y };
}



class Airplane {



    getPointAtPercent(percent) {
        percent = percent * this.pathLength / 100;
        let point = this.path.getPointAtLength(percent);
        let matrix = this.path.getCTM();
        let position = point.matrixTransform(matrix);
        return position;
    }

    getPointAtScreen(percent) {
        let point = this.getPointAtPercent(percent);

        return (XYtoSecreenPercent(point));
    }

    constructor({ path, airplane, airplaneReplacement, controller }) {
        this.path = path;
        this.pathLength = this.path.getTotalLength();
        this.airplane = airplane;
        this.airplaneReplacement = airplaneReplacement;
        this.controller = controller;
    }
    makePath() {

        let values = [];
        let frames = 30;
        for (let i = 0; i <= frames; i++) {
            let precent = i * 100 / frames;
            let p = this.getPointAtScreen(precent);
            values.push(p);
        }
        return values;
    }

    makeScene() {



        let airplanePath = this.makePath();
        let airplanePathScenes = [];
        let hidden = true;
        airplanePath = airplanePath.splice(22);

        for (let i = 1; i < airplanePath.length; i++) {

            let start = airplanePath[i - 1];
            let end = airplanePath[i];
            let tl = new TimelineMax({ paused: true });
            let d = { x: end.x - start.x, y: end.y - start.y };
            let angle = Math.atan2(d.y, d.x) - Math.PI / 2;
            if (i == 1 || i == airplanePath.length - 1) {
                angle = 0;
            }
            angle = `${angle}rad`;

            let scene = new ScrollMagic.Scene({ offset: - 230 + start.y, reverse: true, loglevel: 2 })
                .addTo(this.controller)
                .on("start", (e) => {
                    if (e.scrollDirection === "FORWARD") { // down 

                        if (i == airplanePath.length - 1) {

                            hidden = true;

                            TweenMax.to(this.airplane, 0.7, {
                                ...XYtoTopLeftPercent(end),
                                rotation: angle,
                                onComplete: () => {
                                    /*
                                                                        TweenMax.set(this.airplaneReplacement, {
                                                                            "display": "block"
                                                                        });
                                                                        TweenMax.set(this.airplane, {
                                                                            "display": "none"
                                                                        });*/
                                }
                            });

                        } else {

                            TweenMax.to(this.airplane, 0.7, {
                                ...XYtoTopLeftPercent(end),
                                rotation: angle
                            });
                        }

                    } else { // up 
                        hidden = false;
                        if (i == airplanePath.length - 1) {

                            /*   TweenMax.set(this.airplaneReplacement, {
                                   "display": "none"
                               });
                               TweenMax.set(this.airplane, {
                                   "display": "block"
                               });*/

                            TweenMax.to(this.airplane, 0.7, {
                                ...XYtoTopLeftPercent(start),
                                rotation: angle,
                            });

                        } else {

                            TweenMax.to(this.airplane, 0.7, {
                                ...XYtoTopLeftPercent(start),
                                rotation: angle,
                            });

                        }
                    }
                });


            airplanePathScenes.push(scene);
        }


    }

}


function makeTruckTimeLine() {

    let truck = $("#truck");
    let tl = new TimelineMax();
    tl.to(truck, 1, {
        left: "20%",
    });
    return tl;
}
$(function () {



    var myScroll = new IScroll('#wrapper', {
        scrollX: false,
        scrollY: true,
        scrollbars: true,
        useTransform: true,
        useTransition: false,
        probeType: 3,
        click: true
    });

    let cloudsTimeLine = makeCloudsTimeLine();
    let controller = new ScrollMagic.Controller({ container: "#wrapper" });

    let isMobile = true;
    if (isMobile) {
        // configure iScroll

        // overwrite scroll position calculation to use child's offset instead of container's scrollTop();
        controller.scrollPos(function () {
            return -myScroll.y;
        });

        // thanks to iScroll 5 we now have a real onScroll event (with some performance drawbacks)
        myScroll.on("scroll", function () {
            controller.update(true);
        });

    }

    let airplane = new Airplane({ airplane: $("#airplane"), path: document.getElementById("airplane-path"), controller, airplaneReplacement: $("#airport-airplane") });

    let truckTimeLine = makeTruckTimeLine();

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, {
        capture: false,
        passive: false
    });


    /*
        let truckScene = new ScrollMagic.Scene({ offset: $("#truck-scene").position().top, duration: 2000 })
            .setPin("#truck-scene")
            .setTween(truckTimeLine.reverse())
            .addTo(controller);
    */

    let cloudScene = new ScrollMagic.Scene({ offset:1005, duration: 1000 })
        .setTween(cloudsTimeLine.reverse())
        .setPin("#header")
        .addTo(controller);



    airplane.makeScene();


});




