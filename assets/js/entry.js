
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



function round2(x) {
    return Math.round(x * 100) / 100;
}


function getOffsetTop(elem) {
    var offsetTop = 0;

    do {
        if (!isNaN(elem.offsetTop)) {
            offsetTop += elem.offsetTop;
        }
    } while (elem = elem.offsetParent);

    offsetTop -= document.getElementById("scroll-container").offsetTop;
    return offsetTop;
}


function getOffsetBottom(elem) {
    var offsetBottom = getOffsetTop(elem);
    offsetBottom = -document.getElementById("scroll-container").offsetTop - offsetBottom;
    return offsetBottom;
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
        let { x, y } = point;
        x += this.pathOffset.x;
        y += this.pathOffset.y;

        x = round2(x);
        y = round2(y);

        return { x, y };

    }

    constructor({ path, plane, pathOffset }) {
        this.path = path;
        this.pathLength = this.path.getTotalLength();
        this.plane = plane;
        this.pathOffset = pathOffset;
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



class ScrollController {

    get totalScroll() {
        return -this.iscroll.maxScrollY;
    }

    get planeOffset() {

        let y = getOffsetTop(document.getElementById("plane-2-location")) - document.getElementById("svg-plane-path").clientHeight;//+ document.getElementById("plane-2-location").clientHeight / 4;

        // debug

        $("#svg-plane-path").css("top", y);

        let x = 0;
        return { x, y };

    }

    get planeTimeLineOffset() {

        return getOffsetBottom(document.getElementById("plane-2-location")) + $(window).height() / 2;
    }
    get antonovTimeLineOffset() {
        return getOffsetBottom(document.getElementById("antonov-marker"));

    }

    resize() {

        let height = this.scrollCotainer.height();
        let total = height + this.totalPinDuration - 0;
        this.scrolLHeightElement.height(total);
        this.total = total;
        this.maxScrollY = height - window.innerHeight;



        window.dispatchEvent(new Event("resize"));



    }

    init() {


        this.iscroll.off("scroll", this.onScroll.bind(this));

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
            offset: this.antonovTimeLineOffset + 105,
            tag: 'antonov', // for debug purposes 
            pin: false
        });


        let path = $("#svg-plane-path path")[0];
        let plane = new Plane({
            plane: $("#plane"), path: path
            , pathOffset: this.planeOffset
        });

        let [planeTimeLine1, planeTimeLine2] = plane.makeTimeLine();

        console.log(this.antonovTimeLineOffset);

        scenes.push({
            timeline: planeTimeLine1,
            duration: 1000,
            offset: this.planeTimeLineOffset,
            pin: true
        });

        scenes.push({
            timeline: planeTimeLine2,
            duration: "100%",
            offset: this.planeTimeLineOffset + 200,
            tag: 'debug',
            pin: false
        });

        this.pin = document.getElementById("airfield");
        this.totalPinDuration = scenes.reduce((pre, cur, i) => pre + (cur.pin ? cur.duration : 0), 0);

        this.scenes = scenes.sort((a, b) => a.offset - b.offset);

        this.resize();

        this.iscroll.on("scroll", this.onScroll.bind(this));

    }
    constructor() {



        this.scrollCotainer = $("#scroll-container");
        this.scrolLHeightElement = $("#scroller-height");
        this.planeLocation = document.getElementById("plane-2-location");


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


        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, {
            capture: false,
            passive: false
        });


        this.init();




    }
    onScroll() {


        let y = -this.iscroll.y;

        let pinDuration = 0;
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
                        //scene.timeline.progress(progress); 
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

        //console.log({ yAbsolute });



    }
}
window.onload = function () {






    setTimeout(() => {

        let controller = new ScrollController();


        // TweenMax.to($("#scroll-container"), 0.0, {
        //     y: 1032
        // });


        $("body").removeClass("loading");


    }, 500);









};




