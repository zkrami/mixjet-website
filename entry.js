
import $ from 'jquery';
import { TweenMax, TimelineMax, Power3, Power0 } from 'gsap';
import { relative } from 'path';



function makeCloudsTimeLine() {

    let tl = new TimelineMax({ paused: true });


    tl.add("cloud-action");

    tl.to(".viewport", 7, {
        perspective: 250,
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
        let tl = new TimelineMax({ paused: true });

        TweenMax.set(this.plane, {
            ...planePath[0],
            rotation: "30deg",
        })

        tl.to(this.plane, 10, { ease: Power0.easeNone, bezier: { curviness: 2, values: planePath, autoRotate: ["x", "y", "rotation", 90, false] } });

        return tl;


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

    totalScroll() {
        return -this.iscroll.maxScrollY;
    }


    resize() {

        let height = this.scrollCotainer.height();
        let total = height + this.cloudsTimeLineDuration;
        this.scrolLHeightElement.height(total);
        this.total = total;
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
            mouseWheelSpeed: 20
        });
        this.iscroll.on("scroll", this.onScroll.bind(this));

        this.cloudsTimeLine = makeCloudsTimeLine();
        this.cloudsTimeLineDuration = 1000;

        this.pin = $("#clouds-world")[0];
        let plane = new Plane({ plane: $("#plane"), path: document.getElementById("plane-path") });


        this.planeTimeLine = plane.makeTimeLine();


        this.resize();


    }
    onScroll() {


        let y = -this.iscroll.y;

        let offset = this.cloudsTimeLineDuration + 600;
        let topPin = this.pin.getClientRects()[0].top;
        let cloudsTimeLineDuration = this.cloudsTimeLineDuration;
        if (topPin <= 0 && y < cloudsTimeLineDuration) {
            // clouds time line 
            let relativeY = y;
            let progress = (cloudsTimeLineDuration - relativeY) / cloudsTimeLineDuration;
            progress = Math.min(progress, 1);
            progress = Math.max(progress, 0);
            progress = 1 - progress;
            this.cloudsTimeLine.progress(progress);

            // this.cloudsTimeLine.tweenTo(progress * this.cloudsTimeLine.duration());
        } else {
            let t = y - cloudsTimeLineDuration;
            t = Math.max(t, 0);
            this.scrollCotainer.css("transform", `translateY(${t}px)`);
            if (y > offset) {
                let totalPlaneScroll = this.totalScroll() - offset;
                let progress = y - offset;
                progress /= totalPlaneScroll;
                progress = Math.min(progress, 1);
                progress = Math.max(progress, 0);

                this.planeTimeLine.tweenTo(progress * this.planeTimeLine.duration());


            }
        }
    }
}
$(function () {





    let controller = new ScrollController();

    let truckTimeLine = makeTruckTimeLine();





});




