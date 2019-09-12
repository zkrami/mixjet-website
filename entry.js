
import $ from 'jquery';
import { TweenMax, TimelineMax, Power3, Sine, Bounce, Elastic, Power2, Power0 } from "gsap";
import { relative } from 'path';



function makeCloudsTimeLine() {

    let tl = new TimelineMax({ paused: true });


    tl.add("cloud-action");
   
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
            /*
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


            airplanePathScenes.push(scene);*/
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

class ScrollController {



    resize() {

        let height = this.scrollCotainer.height();
        let total = height + 0 ;
        this.scrolLHeightElement.height(total);
        this.total = total ;
        window.dispatchEvent(new Event("resize"));
    }
    constructor() {

        this.scrollCotainer = $("#scroll-container");
        this.scrolLHeightElement = $("#scroller-height");
        this.iscroll = new IScroll('#scroller-wrapper', {
            scrollX: false,
            scrollY: true,
            scrollbars: true,
            useTransform: true,
            useTransition: true,
            probeType: 3,
            click: true,
            mouseWheel: true,
            mouseWheelSpeed : 20 
        });
        this.iscroll.on("scroll", this.onScroll.bind(this));
        this.resize();

        this.cloudsTimeLine = makeCloudsTimeLine();
        this.pin = $("#clouds-world")[0];


    }
    onScroll() {
        
            
        let y = -this.iscroll.y;
        this.scrollCotainer.css("transform", `translateY(${y}px)`);

        return ; 
        let topPin = this.pin.getClientRects()[0].top; 
        let duration = 1000 ;         
        if(topPin <= 0 && y < duration){
            
            let relativeY = y ; 
            let progress = ( duration - relativeY) /  duration  ;
            progress = Math.min(progress , 1); 
            progress = Math.max(progress , 0); 
            progress = 1 - progress ; 
            //this.cloudsTimeLine.progress(progress);
            console.log(this.cloudsTimeLine); 
            console.log(this.cloudsTimeLine.duration());
            this.cloudsTimeLine.tweenTo( progress * this.cloudsTimeLine.duration()); 
        }else{
            let t = y - duration ; 
            t = Math.max(t , 0 ); 
            this.scrollCotainer.css("transform", `translateY(${t}px)`);
        }
    }
}
$(function () {





    let controller = new ScrollController();

    let airplane = new Airplane({ airplane: $("#airplane"), path: document.getElementById("airplane-path"), controller, airplaneReplacement: $("#airport-airplane") });

    let truckTimeLine = makeTruckTimeLine();

    airplane.makeScene();





});




