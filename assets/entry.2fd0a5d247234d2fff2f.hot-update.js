webpackHotUpdate("entry",{

/***/ "./entry.js":
/*!******************!*\
  !*** ./entry.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gsap */ \"./node_modules/gsap/index.js\");\n\n\n\n\n\nfunction makeCloudsTimeLine() {\n\n    let tl = new gsap__WEBPACK_IMPORTED_MODULE_1__[\"TimelineMax\"]({ paused: true });\n\n\n    tl.add(\"cloud-action\");\n\n    tl.to(\".viewport\", 7, {\n        perspective: 250,\n        ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power3\"].easeOut\n    });\n\n\n\n    return tl;\n\n}\nfunction makeAntonovTimeLine() {\n    let tl = new gsap__WEBPACK_IMPORTED_MODULE_1__[\"TimelineMax\"]({ paused: true });\n    tl.to(\".antonov-wrapper\", 1, {\n        y: 0,\n        z: 0,\n        scale: 1,\n        ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power3\"].easeOut\n    });\n    return tl;\n}\n\nfunction XYtoTopLeftPercent({ x, y }) {\n    return { left: `${x}px`, top: `${y}px` };\n}\n\nfunction XYtoSecreenPercent({ x, y }) {\n    x = Math.round(x * 100) / 100;\n    y = Math.round(y * 100) / 100;\n    return { x, y };\n    let width = jquery__WEBPACK_IMPORTED_MODULE_0___default()('html').width();\n    let height = jquery__WEBPACK_IMPORTED_MODULE_0___default()('html').height();\n    x = Math.round(x * 1000 / width) / 10;\n    y = Math.round(y * 1000 / height) / 10;\n    return { x, y };\n}\n\n\n\nclass Plane {\n\n\n\n    getPointAtPercent(percent) {\n        percent = percent * this.pathLength / 100;\n        let point = this.path.getPointAtLength(percent);\n        let matrix = this.path.getCTM();\n        let position = point.matrixTransform(matrix);\n        return position;\n    }\n\n    getPointAtScreen(percent) {\n        let point = this.getPointAtPercent(percent);\n        return (XYtoSecreenPercent(point));\n    }\n\n    constructor({ path, plane }) {\n        this.path = path;\n        this.pathLength = this.path.getTotalLength();\n        this.plane = plane;\n    }\n    makePath() {\n\n        let values = [];\n        let frames = 200;\n        for (let i = 0; i <= frames; i++) {\n            let precent = i * 100 / frames;\n            let p = this.getPointAtScreen(precent);\n            values.push(p);\n        }\n        return values;\n    }\n    makeTimeLine() {\n\n        let planePath = this.makePath();\n\n        //let values = planePath.map(e => XYtoTopLeftPercent(e));\n        let tl1 = new gsap__WEBPACK_IMPORTED_MODULE_1__[\"TimelineMax\"]({ paused: true });\n\n        let tl2 = new gsap__WEBPACK_IMPORTED_MODULE_1__[\"TimelineMax\"]({ paused: true });\n\n        let part2 = planePath.splice(Math.ceil(0.15 * planePath.length));\n\n        gsap__WEBPACK_IMPORTED_MODULE_1__[\"TweenMax\"].set(this.plane, {\n            ...planePath[0],\n            rotation: \"30deg\",\n        })\n        tl1.to(this.plane, 1.5, { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power3\"].easeInOut, bezier: { curviness: 2, values: planePath, autoRotate: [\"x\", \"y\", \"rotation\", 90, false] } });\n\n        tl1.to(\".plane-location-wrapper .background\", 1., { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power2\"].easeInOut, opacity: 1 }, 0);\n\n\n\n        tl2.to(this.plane, 15, { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power0\"].easeNone, bezier: { curviness: 2, values: part2, autoRotate: [\"x\", \"y\", \"rotation\", 90, false] } });\n\n        tl2.to(jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#arrows-2\"), 1.5, { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power2\"].easeOut, top: \"10%\" }, 10.0275);\n        tl2.to(jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#arrows-1\"), 2, { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power0\"].easeNone, top: \"5%\" }, 10.4);\n        tl2.to(jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#clock-1\"), 1.5, { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power3\"].easeInOut, rotation: \"+=30deg\" }, 12.9);\n        tl2.to(jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#clock-2\"), 1.5, { ease: gsap__WEBPACK_IMPORTED_MODULE_1__[\"Power3\"].easeInOut, rotation: \"-=30deg\" }, 12.9);\n        return [tl1, tl2];\n\n\n    }\n\n\n}\n\n\nfunction makeTruckTimeLine() {\n\n    let truck = jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#truck\");\n    let tl = new gsap__WEBPACK_IMPORTED_MODULE_1__[\"TimelineMax\"]({ paused: true });\n    tl.to(truck, 1, {\n        left: \"50%\",\n    });\n    return tl;\n}\n\nclass ScrollController {\n\n    totalScroll() {\n        return -this.iscroll.maxScrollY;\n    }\n\n\n\n    resize() {\n\n        let height = this.scrollCotainer.height();\n        let total = height + this.totalPinDuration;\n        this.scrolLHeightElement.height(total);\n        this.total = total;\n        window.dispatchEvent(new Event(\"resize\"));\n\n    }\n    constructor() {\n\n        this.scrollCotainer = jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#scroll-container\");\n        this.scrolLHeightElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#scroller-height\");\n        this.iscroll = new IScroll('#scroller-wrapper', {\n            scrollX: false,\n            scrollY: true,\n            scrollbars: true,\n            useTransform: true,\n            useTransition: true,\n            keyBindings: true,\n            bounce: false,\n            probeType: 3,\n            click: true,\n            mouseWheel: true,\n            mouseWheelSpeed: 20,\n            eventListener: document.getElementById(\"scroll-container\")\n        });\n        let scenes = [];\n\n\n        scenes.push({\n            timeline: makeCloudsTimeLine(),\n            duration: 1000,\n            offset: 0,\n            pin: true\n        });\n        scenes.push({\n            timeline: makeAntonovTimeLine(),\n            duration: 700,\n            offset: 2650,\n            pin: false\n        });\n        /*    scenes.push({\n                timeline: makeTruckTimeLine(),\n                duration: 1000,\n                offset: 100,\n                pin: true\n            });*/\n\n\n\n        let plane = new Plane({ plane: jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#plane\"), path: document.getElementById(\"plane-path\") });\n        let [planeTimeLine1, planeTimeLine2] = plane.makeTimeLine();\n        scenes.push({\n            timeline: planeTimeLine1,\n            duration: 500,\n            offset: 800,\n            pin: true\n        });\n\n        scenes.push({\n            timeline: planeTimeLine2,\n            duration: \"100%\",\n            offset: 1000,\n            tag: 'debug',\n            pin: false\n        });\n        this.pin = document.getElementById(\"airfield\");\n        this.totalPinDuration = scenes.reduce((pre, cur, i) => pre + (cur.pin ? cur.duration : 0), 0);\n        let topPin = this.pin.getClientRects()[0].top;\n        this.resize();\n        this.scenes = scenes;\n\n        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, {\n            capture: false,\n            passive: false\n        });\n\n        this.iscroll.on(\"scroll\", this.onScroll.bind(this));\n\n\n\n    }\n    onScroll() {\n\n\n        let y = -this.iscroll.y;\n\n        let pinDuration = 0;\n        let pinned = false;\n        for (let scene of this.scenes) {\n            let yAbsolute = y - pinDuration; // y according to docuemnt \n            if (scene.pin) {\n\n                if (yAbsolute > scene.offset) {\n\n                    let yScene = yAbsolute - scene.offset;\n\n                    if (yScene < scene.duration) {\n                        let progress = (scene.duration - yScene) / scene.duration;\n                        progress = Math.min(progress, 1);\n                        progress = Math.max(progress, 0);\n                        progress = 1 - progress;\n                        scene.timeline.progress(progress);\n                        //  scene.timeline.tweenTo(progress * scene.timeline.duration());\n\n\n                        pinDuration += yScene;\n                        pinned = true;\n\n                    } else {\n                        pinDuration += scene.duration;\n                        scene.timeline.progress(1);\n                        // scene.timeline.tweenTo(1 * scene.timeline.duration());\n                    }\n                } else {\n                    scene.timeline.progress(0);\n                    // scene.timeline.tweenTo(0 * scene.timeline.duration());\n                }\n\n            } else {\n\n                if (yAbsolute > scene.offset) {\n\n                    let yScene = yAbsolute - scene.offset;\n                    let totalSceneScroll = scene.duration;\n                    if (scene.duration == \"100%\") {\n                        totalSceneScroll = this.totalScroll() - pinDuration - scene.offset;\n                    }\n\n                    let progress = yScene;\n                    progress /= totalSceneScroll;\n                    progress = Math.min(progress, 1);\n                    progress = Math.max(progress, 0);\n                    let toDuration = progress * scene.timeline.duration();\n                    let cur = scene.timeline.time();\n                    if (scene.tag == 'debug') {\n                        console.log(toDuration);\n                    }\n\n                    if (Math.abs(cur - toDuration) > 1) {\n                        scene.timeline.tweenTo(toDuration).duration(0.8);\n                    } else {\n                        scene.timeline.tweenTo(toDuration);\n                    }\n\n                } else {\n                    scene.timeline.tweenTo(0);\n                }\n            }\n        }\n        let yAbsolute = Math.max(0, y - pinDuration);\n\n        //this.scrollCotainer.css(\"transform\", `translateY(${yAbsolute}px)`);\n        gsap__WEBPACK_IMPORTED_MODULE_1__[\"TweenMax\"].to(this.scrollCotainer, 0.1, {\n            y: yAbsolute\n        });\n        //   console.log(yAbsolute);\n\n\n    }\n}\njquery__WEBPACK_IMPORTED_MODULE_0___default()(function () {\n\n\n\n    let controller = new ScrollController();\n    let truckTimeLine = makeTruckTimeLine();\n    // setTimeout(() => {\n    jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"body\").removeClass(\"loading\");\n    //   }, 500);\n    /*\n        TweenMax.to($(\"#scroll-container\"), 0.0, {\n            y: 1032\n        });\n    */\n\n});\n\n\n\n\n\n\n//# sourceURL=webpack:///./entry.js?");

/***/ })

})