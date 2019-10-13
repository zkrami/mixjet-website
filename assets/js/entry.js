import "../sass/index.scss"; // main style
import "swiper/css/swiper.min.css";
import $ from 'jquery';
import Swiper from 'swiper';

//import * as IScroll from './iscroll-probe';
import { TweenMax, TimelineMax, Power3, Power0, Power2 } from 'gsap';

import Scrollbar from 'smooth-scrollbar';

function makeCloudsTimeLine() {

    let tl = new TimelineMax({ paused: true });

    tl.add("cloud-action");
    tl.to(".mouse-scroll", 1, { display: "none" });
    tl.to(".viewport", 7, {
        perspective: 250,
        ease: Power3.easeOut
    }, 0);



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
    set offset(value) {
        this.pathOffset = value;
    }
    constructor({ path, plane, planeLocation, pathOffset }) {
        this.path = $("#svg-plane-path path")[0];
        this.pathLength = this.path.getTotalLength();
        this.plane = plane;
        this.planeLocation = planeLocation;
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


        let y = getOffsetTop(this.planeLocation);
        $("#svg-plane-path").css("height", y);


        let planePath = this.makePath();

        //let values = planePath.map(e => XYtoTopLeftPercent(e));
        let tl1 = new TimelineMax({ paused: true });

        let tl2 = new TimelineMax({ paused: true });

        let part2 = planePath.splice(Math.ceil(0.1 * planePath.length));

        TweenMax.set(this.plane, {
            ...planePath[0],
            rotation: "57.5deg",
            scale: 0.7,
        })
        tl1.to(this.plane, 1.5, { ease: Power3.easeInOut, bezier: { curviness: 2, values: planePath, autoRotate: ["x", "y", "rotation", 90, false] } });
        tl1.to(this.plane, 1.5, { ease: Power3.easeInOut, scale: 1 }, 0);

        tl1.to(".plane-location-wrapper .background", 1., { ease: Power2.easeInOut, opacity: 1 }, 0);



        tl2.to(this.plane, 15, { ease: Power0.easeNone, bezier: { curviness: 2, values: part2, autoRotate: ["x", "y", "rotation", 90, false] } });

        tl2.to($("#arrows-2"), 1.5, { ease: Power2.easeOut, top: "10%" }, 10.4);
        tl2.to($("#arrows-1"), 2, { ease: Power0.easeNone, top: "5%" }, 10.6);

        tl2.to($("#arrows-4"), 1.5, { ease: Power2.easeOut, left: "10%" }, 11.7);

        tl2.to($("#clock-1"), 2, { ease: Power2.easeInOut, rotation: "+=50deg" }, 12.7);
        tl2.to($("#clock-2"), 2, { ease: Power2.easeInOut, rotation: "-=50deg" }, 12.7);
        return [tl1, tl2];


    }

    makePortraitTimeLine() {
        // todo portrait timeline

        let y = getOffsetTop(this.planeLocation);
        $("#svg-plane-path").css("height", y);


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

        tl2.to($("#arrows-4"), 1.5, { ease: Power2.easeOut, left: "10%" }, 11.7);

        tl2.to($("#clock-1"), 2, { ease: Power2.easeInOut, rotation: "+=50deg" }, 12.7);
        tl2.to($("#clock-2"), 2, { ease: Power2.easeInOut, rotation: "-=50deg" }, 12.7);
        return [tl1, tl2];


    }


}



class ScrollController {

    get totalScroll() {
        return this.scrollbar.limit.y;
    }


    get planeOffset() {

        return { x: 0, y: 0 };

    }

    get planeTimeLineOffset() {

        return getOffsetBottom(document.getElementById("plane-2-location")) + $(window).height() / 2;
    }
    get antonovTimeLineOffset() {
        return getOffsetBottom(document.getElementById("antonov-marker"));

    }

    resize() {

        let height = this.scrollCotainer.height();

        let total = height + this.totalPinDuration;
        this.scrolLHeightElement.height(total);
        this.total = total;
        this.maxScrollY = height - window.innerHeight;

    }

    dispose() {

        for (let { timeline } of this.scenes) {
            timeline.progress(0);
            timeline.kill();
            timeline.clear();
        }
    }
    init() {
        // todo make scene class 
        this.dispose();
        this.scrollbar.removeListener(this.onScroll.bind(this));

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



        let plane = this.plane;


        if (0 && window.matchMedia("(orientation: portrait)")) { // todo fix
            // portrait 
            console.log("portrait");
            plane.offset = { x: -100, y: 0 };
            let [planeTimeLine1, planeTimeLine2] = plane.makePortraitTimeLine();

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

        } else {


            let [planeTimeLine1, planeTimeLine2] = plane.makeTimeLine();


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
                pin: false,
                onStart: function () {
                    let audio = document.getElementById("airplane_mp3");
                    audio.play();
                }
            });
        }




        this.totalPinDuration = scenes.reduce((pre, cur, i) => pre + (cur.pin ? cur.duration : 0), 0);

        this.scenes = scenes.sort((a, b) => a.offset - b.offset);

        this.resize();

        this.scrollbar.addListener(this.onScroll.bind(this));

    }
    constructor() {



        this.scrollCotainer = $("#scroll-container");
        this.scrolLHeightElement = $("#scroller-height");
        this.planeLocation = document.getElementById("plane-2-location");

        this.plane = new Plane({
            plane: $("#plane"),
            pathOffset: this.planeOffset,
            planeLocation: document.getElementById("plane-2-location")
        });

        this.scrollbar = new Scrollbar(document.getElementById("scroller"), {
            delegateTo: document.getElementById("scroll-container")
        });


        this.scenes = [];
        this.init();

        $(window).on("resize", this.windowResize.bind(this));



    }
    windowResize() {
        this.init();
        this.onScroll({ offset: this.scrollbar.offset });
    }
    onScroll(e) {
        let deferer = [];

        let y = e.offset.y;

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

            } else { // not pin 
                if (yAbsolute > scene.offset) {

                    if (!scene.started) {
                        scene.started = true;
                        if (scene.onStart) scene.onStart();
                    }

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

                    scene.timeline.seek(toDuration);


                } else {
                    scene.started = false;
                    scene.timeline.seek(0);
                }
            }
        }
        let yAbsolute = Math.max(0, y - pinDuration);

        //this.scrollCotainer.css("transform", `translateY(${yAbsolute}px)`);


        TweenMax.set(this.scrollCotainer, {
            y: yAbsolute
        });







    }
}

class PageNavigator {

    end() {
        TweenMax.set(this.destinationPage, { zIndex: -1, display: "none" });
        TweenMax.set("#clouds-navigation", { zIndex: -1, display: "none" });
        this.navigating = false;
    }
    get destinationPagePart() {
        return `${this.destinationPage} .part2`;
    }

    back() {


        TweenMax.to("#home-page", this.navigationTime, {
            z: 0,
            ease: Power0.easeNone
        });
        TweenMax.to("#body", this.navigationTime, {
            perspective: 200,
            ease: Power0.easeNone,
            onComplete: this.end.bind(this, this.destinationPage),
        });

        this.destinationOut();



    }
    constructor() {

        this.navigating = false;
        this.current = "#home-page";
        this.navigationTime = 2;
        this.pageTime = 0.5;
        $("a[data-page]").on("click", this.anchorClick.bind(this));
        $(".back-button").on("click", this.back.bind(this));
    }
    anchorClick(e) {
        let page = $(e.target).data("page");
        this.navigateTo(page);
    }

    navigated(destinationPage) {
        $(this.destinationPage).addClass("active");
    }
    destinationOut() {
        $(this.destinationPage).removeClass("active");
        TweenMax.to(this.destinationPage, this.pageTime, {
            opacity: 0,
            y: 200,
        });
        TweenMax.to(this.destinationPagePart, this.pageTime, {
            y: -400,
        });

    }

    destinationIn() {


        TweenMax.set(this.destinationPage, {
            opacity: 0,
            y: 200,
            zIndex: 20,
            display: "block"
        });
        TweenMax.set(this.destinationPagePart, {
            y: -400,
        });

        TweenMax.to(this.destinationPage, this.pageTime, {
            opacity: 1,
            y: 0,
            delay: this.navigationTime - 0.5
        });
        TweenMax.to(this.destinationPagePart, this.pageTime, {
            y: 0,
            delay: this.navigationTime - 0.5
        });

    }
    navigateTo(destinationPage) {

        if (this.navigating) return;
        this.navigating = true;
        this.destinationPage = destinationPage;

        TweenMax.set("#clouds-navigation", { zIndex: 10, display: "block" });

        TweenMax.to("#home-page", this.navigationTime, {
            z: -1000,
            ease: Power0.easeNone,
        });

        TweenMax.to("#body", this.navigationTime, {
            perspective: 2000,
            ease: Power0.easeNone,
            onComplete: this.navigated.bind(this, destinationPage)
        });

        this.destinationIn();
    }
}

window.onload = function () {

    function initSwiper() {

        var mySwiper = new Swiper('.swiper-container', {
            // Optional parameters
            loop: true,

            slidesPerView: 2,
            spaceBetween: 10,
            centeredSlides: true,
            breakpoints: {

                1024: {
                    slidesPerView: 3,
                    spaceBetween: 0,
                }
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next-mixjet',
                prevEl: '.swiper-button-prev-mixjet',
            },

        })
    }

    setTimeout(() => {

        let controller = new ScrollController();
        let navigator = new PageNavigator();
        initSwiper();




        $("body").removeClass("loading");
        this.setTimeout( ()=> {
            $(".loader").remove();
        } , 2000 ); 


    }, 0);








};







