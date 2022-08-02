"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var ImageContent = function (_a) {
    var pageId = _a.pageId, block = _a.block, editBlock = _a.editBlock, showBlockFn = _a.showBlockFn;
    var targetImgContent = document.getElementById(block.id + "_contents");
    var previousClientX = react_1.useRef(0);
    var previousClientY = react_1.useRef(0);
    var _b = react_1.useState(false), draging = _b[0], setDraging = _b[1];
    var _c = react_1.useState(), imageStyle = _c[0], setImageStyle = _c[1];
    var onMouseMove = function (event) {
        console.log("move", draging);
        if (draging) {
            var changeX = event.clientX - previousClientX.current;
            var changeY = event.clientX - previousClientX.current;
            previousClientX.current = event.clientX;
            previousClientY.current = event.clientY;
            if (changeX !== 0 || changeY !== 0) {
                var imgDomRect = targetImgContent === null || targetImgContent === void 0 ? void 0 : targetImgContent.getClientRects()[0];
                if (imgDomRect !== undefined) {
                    var imgWidth = imgDomRect.width;
                    var imgHeight = imgDomRect.height;
                    var width = imgWidth - changeX;
                    var height = imgHeight - changeY;
                    var changedStyle = {
                        width: width + "px",
                        height: height + "px"
                    };
                    setImageStyle(changedStyle);
                }
            }
        }
    };
    var onMouseDownSizeBtn = react_1.useCallback(function (event) {
        console.log("click");
        previousClientX.current = event.clientX;
        previousClientY.current = event.clientY;
        setDraging(true);
    }, []);
    var onMouseUp = react_1.useCallback(function (event) {
        previousClientX.current = 0;
        previousClientY.current = 0;
        console.log("up", draging);
        if (imageStyle !== undefined) {
            var editedBlock = __assign(__assign({}, block), { style: __assign(__assign({}, block.style), { width: imageStyle.width, height: imageStyle.height }), editTime: JSON.stringify(Date.now()) });
            editBlock(pageId, editedBlock);
        }
        ;
        setDraging(false);
    }, []);
    window.addEventListener("mousemove", function (event) { return onMouseMove(event); });
    draging && window.addEventListener("mouseup", function (event) { return onMouseUp(event); });
    return (react_1["default"].createElement("div", { className: "imageContent", id: block.id + "_contents", onMouseOver: showBlockFn, style: imageStyle },
        react_1["default"].createElement("button", { className: 'sizeBtn length left', onMouseDown: onMouseDownSizeBtn },
            react_1["default"].createElement("span", null)),
        react_1["default"].createElement("button", { className: 'sizeBtn tranverse top', onMouseDown: onMouseDownSizeBtn },
            react_1["default"].createElement("span", null)),
        react_1["default"].createElement("button", { className: 'sizeBtn length right', onMouseDown: onMouseDownSizeBtn },
            react_1["default"].createElement("span", null)),
        react_1["default"].createElement("button", { className: 'sizeBtn tranverse bottom ', onMouseDown: onMouseDownSizeBtn },
            react_1["default"].createElement("span", null)),
        react_1["default"].createElement("img", { src: block.contents, alt: "block_photo" })));
};
exports["default"] = react_1["default"].memo(ImageContent);
