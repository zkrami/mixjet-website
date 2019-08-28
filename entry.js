
import $ from 'jquery';
import * as ScrollMagic from "scrollmagic";
import { TweenMax, TimelineMax, Power3, Sine, Bounce, Elastic, Power2, Power0 } from "gsap";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

function _clouds() {
    let cloudsTimeLine1 = new TimelineMax({ repeat: -1 });

    cloudsTimeLine1.to($(".cloud-size-1 image"), 1, {
        bezier: {
            values: [{ y: "+=5" }, { y: "-=15" }, { y: "+=15" }, { y: "-=5" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });
    cloudsTimeLine1.set($(".cloud-size-1 image"), {
        x: "+=3200",
    });
    cloudsTimeLine1.to($(".cloud-size-1 image"), 1, {
        bezier: {
            values: [{ y: "-=5" }, { y: "+=15" }, { y: "-=15" }, { y: "+=5" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });


    let cloudsTimeLine2 = new TimelineMax({ repeat: -1 });

    cloudsTimeLine2.to($(".cloud-size-2 image"), 1, {
        bezier: {
            values: [{ y: "+=20" }, { y: "-=10" }, { y: "+=15" }, { y: "-=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });
    cloudsTimeLine2.set($(".cloud-size-2 image"), {
        x: "+=3200",
    });
    cloudsTimeLine2.to($(".cloud-size-2 image"), 1, {
        bezier: {
            values: [{ y: "-=20" }, { y: "+=10" }, { y: "-=15" }, { y: "+=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });



    let cloudsTimeLine3 = new TimelineMax({ repeat: -1 });

    cloudsTimeLine3.to($(".cloud-size-3 image"), 1, {
        bezier: {
            values: [{ y: "+=20" }, { y: "-=10" }, { y: "+=15" }, { y: "-=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });
    cloudsTimeLine3.set($(".cloud-size-3 image"), {
        x: "+=3200",
    });
    cloudsTimeLine3.to($(".cloud-size-3 image"), 1, {
        bezier: {
            values: [{ y: "-=20" }, { y: "+=10" }, { y: "-=15" }, { y: "+=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });



    let cloudsTimeLine4 = new TimelineMax({ repeat: -1 });

    cloudsTimeLine4.to($(".cloud-size-4 image"), 1, {
        bezier: {
            values: [{ y: "+=20" }, { y: "-=10" }, { y: "+=15" }, { y: "-=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });
    cloudsTimeLine4.set($(".cloud-size-4 image"), {
        x: "+=3200",
    });
    cloudsTimeLine4.to($(".cloud-size-4 image"), 1, {
        bezier: {
            values: [{ y: "-=20" }, { y: "+=10" }, { y: "-=15" }, { y: "+=10" }],

        },
        x: "-=1600",
        ease: Power0.easeNone,
    });





    let cloudsTimeLine5 = new TimelineMax({ repeat: -1 });

    cloudsTimeLine5.to($(".cloud-size-5 image"), 1, {
        bezier: {
            values: [{ y: "+=20" }, { y: "-=10" }, { y: "+=15" }, { y: "-=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });
    cloudsTimeLine5.set($(".cloud-size-5 image"), {
        x: "+=3200",
    });
    cloudsTimeLine5.to($(".cloud-size-5 image"), 1, {
        bezier: {
            values: [{ y: "-=20" }, { y: "+=10" }, { y: "-=15" }, { y: "+=10" }],
        },
        x: "-=1600",
        ease: Power0.easeNone,
    });

    cloudsTimeLine1.timeScale(1);
    cloudsTimeLine2.timeScale(0.9);
    cloudsTimeLine3.timeScale(0.8);
    cloudsTimeLine4.timeScale(0.7);
    cloudsTimeLine5.timeScale(0.6);

    let timelines = [cloudsTimeLine1, cloudsTimeLine2, cloudsTimeLine3, cloudsTimeLine4, cloudsTimeLine5];
    timelines.forEach(e => { e.timeScale(e.timeScale() * 0.3); });

}

let svg = { width: 1365, height: 650 };


function makeCloudsTimeLine() {

    let tl = new TimelineMax({});
    tl.set($(".airport-background"), {
        scale: 1,
        transformOrigin: "center center"
    });

    tl.add("cloud-action");
    let randomBezier = () => new Object({ values: Array(4).fill(0).map((v, i) => new Object({ y: `${(i % 2 == 0 ? "+=" : "-=")}${Math.random() * 20}` })) });
    let xLocation = (i, e) => $(e).position().left + 200 < svg.width / 2 ? "-=200" : "+=200";
    let transformOriginFunc = (i, e) => $(e).position().left + 200 < svg.width / 2 ? "100% 20%" : "0 20%";
    let clouds = [
        { class: ".cloud-size-1", time: 4.6 },
        { class: ".cloud-size-2", time: 4.2 },
        { class: ".cloud-size-3", time: 3.8 },
        { class: ".cloud-size-4", time: 3.4 },
        { class: ".cloud-size-5", time: 3 },
    ];
    tl.to($(".window"), 2, {
        scale: 2,
        transformOrigin: "90% center",
        opacity: 0,

        ease: Power3.easeInOut,

    }, "cloud-action");
    clouds.forEach(cloud => {

        tl.to($(`${cloud.class} image`), cloud.time, {
            bezier: randomBezier,
            scale: "+=2",
            transformOrigin: transformOriginFunc,
            ease: Power3.easeIn,
            x: xLocation,
            opacity: 0
        }, "cloud-action");

    });


    tl.to($(".airport-background"), 8, {
        scale: 3,
        transformOrigin: "center center",
        ease: Power2.easeInOut
    }, "cloud-action");


    return tl; 

}
$(function () {




    makeCloudsTimeLine().play(1000);

    let controller = new ScrollMagic.Controller();

    /*
    var scene = new ScrollMagic.Scene({ offset: 0, duration: 2000 })
        .setPin("#header")
        .addTo(controller);*/


});