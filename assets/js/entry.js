
import $ from 'jquery';
import * as IScroll from './iscroll-probe';
import { TweenMax, TimelineMax, Power3, Power0, Power2 } from 'gsap';


function makeCloudsTimeLine() {

    let tl = new TimelineMax({ paused: true });


    tl.add("cloud-action");

    tl.to(".viewport", 7, {
        perspective: 250,
        ease: Power3.easeOut
    });



    return tl;

}
function makeAntonovTimeLine() {
    let tl = new TimelineMax({ paused: true });
    tl.to(".antonov-wrapper", 1, {
        y: 0,
        z: 0,
        scale: 1,
        ease: Power3.easeOut
    });
    return tl;
}

function XYtoTopLeftPercent({ x, y }) {
    return { left: `${x}px`, top: `${y}px` };
}

function XYtoSecreenPercent({ x, y }) {
    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;
    return { x, y };
    let width = $('html').width();
    let height = $('html').height();
    x = Math.round(x * 1000 / width) / 10;
    y = Math.round(y * 1000 / height) / 10;
    return { x, y };
}



class Plane {



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

    constructor({ path, plane }) {
        this.path = path;
        this.pathLength = this.path.getTotalLength();
        this.plane = plane;
    }
    makePath() {

        let values = [];
        let frames = 200;
        for (let i = 0; i <= frames; i++) {
            let precent = i * 100 / frames;
            let p = this.getPointAtScreen(precent);
            values.push(p);
        }
        return values;
    }
    makeTimeLine() {

        let planePath = this.makePath();

        //let values = planePath.map(e => XYtoTopLeftPercent(e));
        let tl1 = new TimelineMax({ paused: true });

        let tl2 = new TimelineMax({ paused: true });

        let part2 = planePath.splice(Math.ceil(0.15 * planePath.length));

        TweenMax.set(this.plane, {
            ...planePath[0],
            rotation: "57.5deg",
        })
        tl1.to(this.plane, 1.5, { ease: Power3.easeInOut, bezier: { curviness: 2, values: planePath, autoRotate: ["x", "y", "rotation", 90, false] } });

        tl1.to(".plane-location-wrapper .background", 1., { ease: Power2.easeInOut, opacity: 1 }, 0);



        tl2.to(this.plane, 15, { ease: Power0.easeNone, bezier: { curviness: 2, values: part2, autoRotate: ["x", "y", "rotation", 90, false] } });

        tl2.to($("#arrows-2"), 1.5, { ease: Power2.easeOut, top: "10%" }, 10.4);
        tl2.to($("#arrows-1"), 2, { ease: Power0.easeNone, top: "5%" }, 10.6);
        tl2.to($("#clock-1"), 2, { ease: Power2.easeInOut, rotation: "+=50deg" }, 12.7);
        tl2.to($("#clock-2"), 2, { ease: Power2.easeInOut, rotation: "-=50deg" }, 12.7);
        return [tl1, tl2];


    }


}


function makeTruckTimeLine() {

    let truck = $("#truck");
    let tl = new TimelineMax({ paused: true });
    tl.to(truck, 1, {
        left: "50%",
    });
    return tl;
}

class ScrollController {

    get totalScroll() {
        return -this.iscroll.maxScrollY;
    }



    resize() {

        let height = this.scrollCotainer.height();
        let total = height + this.totalPinDuration - 0;
        this.scrolLHeightElement.height(total);
        this.total = total;
        this.maxScrollY = height - window.innerHeight;
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
            keyBindings: true,
            bounce: false,
            probeType: 3,
            click: true,
            mouseWheel: true,
            mouseWheelSpeed: 20,
            eventListener: document.getElementById("scroll-container")
        });
        let scenes = [];


        scenes.push({
            timeline: makeCloudsTimeLine(),
            duration: 1000,
            offset: 0,
            pin: true
        });
        scenes.push({
            timeline: makeAntonovTimeLine(),
            duration: 700,
            offset: 2150,
            tag: 'antonov', // for debug purposes 
            pin: false
        });


        let plane = new Plane({ plane: $("#plane"), path: document.getElementById("plane-path") });
        let [planeTimeLine1, planeTimeLine2] = plane.makeTimeLine();
        scenes.push({
            timeline: planeTimeLine1,
            duration: 1000,
            offset: 800,
            pin: true
        });

        scenes.push({
            timeline: planeTimeLine2,
            duration: "100%",
            offset: 1000,
            tag: 'debug',
            pin: false
        });
        this.pin = document.getElementById("airfield");
        this.totalPinDuration = scenes.reduce((pre, cur, i) => pre + (cur.pin ? cur.duration : 0), 0);
        let topPin = this.pin.getClientRects()[0].top;

        this.scenes = scenes.sort((a, b) => a.offset - b.offset);

        this.resize();
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, {
            capture: false,
            passive: false
        });

        this.iscroll.on("scroll", this.onScroll.bind(this));



    }
    onScroll() {


        let y = -this.iscroll.y;

        let pinDuration = 0;
        let pinned = false;
        for (let scene of this.scenes) {
            let yAbsolute = y - pinDuration; // y according to docuemnt 
            if (scene.pin) {

                if (yAbsolute > scene.offset) {

                    let yScene = yAbsolute - scene.offset;

                    if (yScene < scene.duration) {
                        let progress = (scene.duration - yScene) / scene.duration;
                        progress = Math.min(progress, 1);
                        progress = Math.max(progress, 0);
                        progress = 1 - progress;
                        scene.timeline.progress(progress);
                        //  scene.timeline.tweenTo(progress * scene.timeline.duration());


                        pinDuration += yScene;
                        pinned = true;

                    } else {
                        pinDuration += scene.duration;
                        scene.timeline.progress(1);
                        // scene.timeline.tweenTo(1 * scene.timeline.duration());
                    }
                } else {
                    scene.timeline.progress(0);
                    // scene.timeline.tweenTo(0 * scene.timeline.duration());
                }

            } else {
                if (yAbsolute > scene.offset) {


                    let yScene = yAbsolute - scene.offset;
                    let totalSceneScroll = scene.duration;
                    if (scene.duration == "100%") {
                        totalSceneScroll = this.totalScroll - pinDuration - scene.offset;
                    }

                    let progress = yScene;
                    progress /= totalSceneScroll;
                    progress = Math.min(progress, 1);
                    progress = Math.max(progress, 0);
                    let toDuration = progress * scene.timeline.duration();
                    let cur = scene.timeline.time();

                    if (Math.abs(cur - toDuration) > 1) {
                        scene.timeline.tweenTo(toDuration).duration(0.8);
                    } else {
                        scene.timeline.tweenTo(toDuration);
                    }

                } else {
                    scene.timeline.tweenTo(0);
                }
            }
        }
        let yAbsolute = Math.max(0, y - pinDuration);

        //this.scrollCotainer.css("transform", `translateY(${yAbsolute}px)`);


        TweenMax.to(this.scrollCotainer, 0.1, {
            y: yAbsolute
        });


    }
}
window.onload = function () {




    setTimeout(() => {
        let controller = new ScrollController();
        let truckTimeLine = makeTruckTimeLine();
    }, 500);
    $("body").removeClass("loading");


    /*
        TweenMax.to($("#scroll-container"), 0.0, {
            y: 1032
        });
    */

};




