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
var notion_1 = require("../modules/notion");
var BlockComponent_1 = require("./BlockComponent");
var go_1 = require("react-icons/go");
var gr_1 = require("react-icons/gr");
var md_1 = require("react-icons/md");
var PageIcon_1 = require("./PageIcon");
var EditableBlock = function (_a) {
    var _b;
    var page = _a.page, block = _a.block, editBlock = _a.editBlock, addBlock = _a.addBlock, changeToSub = _a.changeToSub, raiseBlock = _a.raiseBlock, deleteBlock = _a.deleteBlock, smallText = _a.smallText, command = _a.command, setCommand = _a.setCommand, setTargetPageId = _a.setTargetPageId, setOpenComment = _a.setOpenComment, setCommentBlock = _a.setCommentBlock, setOpenLoader = _a.setOpenLoader, setLoaderTargetBlock = _a.setLoaderTargetBlock;
    var className = block.type !== "toggle" ?
        block.type + " block " :
        block.type + " block " + (block.subBlocksId !== null ? 'on' : "");
    var changeFontSizeBySmallText = function (block) {
        var baseSize = smallText ? 14 : 16;
        var ratio = 1;
        switch (block.type) {
            case "h1":
                ratio = 3;
                break;
            case "h2":
                ratio = 2.5;
                break;
            case "h3":
                ratio = 2;
                break;
            default:
                break;
        }
        var style = {
            fontSize: baseSize * ratio + "px"
        };
        return style;
    };
    var blockComments = block.comments == null ?
        false :
        (block.comments.filter(function (comment) { return comment.type === "open"; })[0] === undefined ?
            false :
            true);
    var subBlocks = (_b = block.subBlocksId) === null || _b === void 0 ? void 0 : _b.map(function (id) { return notion_1.findBlock(page, id).BLOCK; });
    var blockContentsStyle = function (block) {
        return ({
            color: block.type !== "todo done" ? block.style.color : "grey",
            backgroundColor: block.style.bgColor,
            fontWeight: block.style.fontWeight,
            fontStyle: block.type !== "todo done" ? block.style.fontStyle : "italic",
            textDecoration: block.type !== "todo done" ? block.style.textDeco : "line-through",
            width: block.style.width === undefined ? "inherit" : block.style.width,
            height: block.style.height === undefined ? "inherit" : block.style.height
        });
    };
    var giveFocusToContent = function (event) {
        var currentTarget = event.currentTarget;
        var contentEditable = currentTarget.getElementsByClassName("contentEditable")[0];
        contentEditable.focus();
    };
    var onClickCommentBtn = function (block) {
        setOpenComment(true);
        setCommentBlock(block);
    };
    var updateBlock = function () {
        var _a, _b, _c;
        var item = sessionStorage.getItem("itemsTobeEdited");
        var cursorElement = (_b = (_a = document.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode) === null || _b === void 0 ? void 0 : _b.parentElement;
        var className = cursorElement === null || cursorElement === void 0 ? void 0 : cursorElement.className;
        if (item !== null) {
            var targetBlock = JSON.parse(item);
            var condition = className === "contentEditable" && cursorElement !== undefined && cursorElement !== null && ((_c = cursorElement.parentElement) === null || _c === void 0 ? void 0 : _c.id) === targetBlock.id + "_contents";
            if (!condition) {
                editBlock(page.id, targetBlock);
                sessionStorage.removeItem("itemsTobeEdited");
            }
        }
    };
    var onClickTodoBtn = function () {
        var editedTobo = __assign(__assign({}, block), { type: block.type === "todo" ? "todo done" : "todo", editTime: JSON.stringify(Date.now()) });
        editBlock(page.id, editedTobo);
    };
    var onClickToggle = function (event) {
        var target = event.currentTarget;
        var blockId = target.getAttribute("name");
        var toggleMainDoc = document.getElementById("block_" + blockId);
        target.classList.toggle("on");
        toggleMainDoc === null || toggleMainDoc === void 0 ? void 0 : toggleMainDoc.classList.toggle("on");
    };
    var inner = document.getElementById("inner");
    inner === null || inner === void 0 ? void 0 : inner.addEventListener("click", updateBlock);
    inner === null || inner === void 0 ? void 0 : inner.addEventListener("keyup", updateBlock);
    react_1.useEffect(function () {
        var newBlockItem = sessionStorage.getItem("newBlock");
        if (newBlockItem !== null) {
            var newBlockContentsDoc = document.getElementById(newBlockItem + "_contents");
            if (newBlockContentsDoc !== null) {
                var newBlockContentEditableDoc = newBlockContentsDoc.firstElementChild;
                newBlockContentEditableDoc.focus();
            }
            ;
            sessionStorage.removeItem("newBlock");
        }
        ;
        if (block.type.includes("media") && block.contents === "") {
            setOpenLoader(true);
            setLoaderTargetBlock(block);
        }
    }, []);
    var ListSub = function () {
        var blockContentsRef = react_1.useRef(null);
        var listStyle = function (block) {
            return ({
                textDecoration: "none",
                fontStyle: "normal",
                fontWeight: "normal",
                backgroundColor: block.style.bgColor,
                color: block.style.color
            });
        };
        return (react_1["default"].createElement(react_1["default"].Fragment, null, subBlocks !== undefined &&
            subBlocks.map(function (block) { return (react_1["default"].createElement("div", { className: 'list mainBlock', key: "listItem_" + subBlocks.indexOf(block) },
                react_1["default"].createElement("div", { className: 'mainBlock_block' },
                    react_1["default"].createElement("div", { id: block.id, className: "blockContents", ref: blockContentsRef, style: listStyle(block) },
                        react_1["default"].createElement("div", { className: 'list_marker' }, className.includes("number") ?
                            subBlocks.indexOf(block) + 1 + "."
                            :
                                react_1["default"].createElement(go_1.GoPrimitiveDot, null)),
                        react_1["default"].createElement(BlockComponent_1["default"], { block: block, page: page, addBlock: addBlock, editBlock: editBlock, changeToSub: changeToSub, raiseBlock: raiseBlock, deleteBlock: deleteBlock, blockComments: blockComments, command: command, setCommand: setCommand, onClickCommentBtn: onClickCommentBtn, setOpenComment: setOpenComment, setTargetPageId: setTargetPageId, setOpenLoader: setOpenLoader, setLoaderTargetBlock: setLoaderTargetBlock }))),
                blockComments &&
                    react_1["default"].createElement(BlockComponent_1.BlockComment, { block: block, onClickCommentBtn: onClickCommentBtn }))); })));
    };
    return (react_1["default"].createElement("div", { className: "editableBlock" },
        react_1["default"].createElement("div", { className: 'editableBlockInner' },
            react_1["default"].createElement("div", { id: "block_" + block.id, className: className, style: changeFontSizeBySmallText(block) },
                block.type.includes("List") ?
                    react_1["default"].createElement(ListSub, null)
                    :
                        react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("div", { className: "mainBlock" },
                                react_1["default"].createElement("div", { className: 'mainBlock_block' },
                                    block.type === "todo" &&
                                        react_1["default"].createElement("button", { className: 'checkbox left blockBtn', name: block.id, onClick: onClickTodoBtn },
                                            react_1["default"].createElement(gr_1.GrCheckbox, { className: 'blockBtnSvg' })),
                                    block.type === "todo done" &&
                                        react_1["default"].createElement("button", { className: 'checkbox done left blockBtn', name: block.id, onClick: onClickTodoBtn },
                                            react_1["default"].createElement(gr_1.GrCheckboxSelected, { className: 'blockBtnSvg ' })),
                                    block.type === "toggle" &&
                                        react_1["default"].createElement("button", { name: block.id, onClick: onClickToggle, className: block.subBlocksId !== null ?
                                                'blockToggleBtn on left blockBtn' :
                                                'blockToggleBtn left blockBtn' },
                                            react_1["default"].createElement(md_1.MdPlayArrow, { className: 'blockBtnSvg' })),
                                    block.type === "page" &&
                                        react_1["default"].createElement("div", { className: 'pageIcon left' },
                                            react_1["default"].createElement(PageIcon_1["default"], { icon: block.icon, iconType: block.iconType })),
                                    react_1["default"].createElement("div", { className: 'blockContents', style: blockContentsStyle(block) },
                                        react_1["default"].createElement(BlockComponent_1["default"], { block: block, page: page, addBlock: addBlock, editBlock: editBlock, changeToSub: changeToSub, raiseBlock: raiseBlock, deleteBlock: deleteBlock, blockComments: blockComments, command: command, setCommand: setCommand, onClickCommentBtn: onClickCommentBtn, setTargetPageId: setTargetPageId, setOpenComment: setOpenComment, setOpenLoader: setOpenLoader, setLoaderTargetBlock: setLoaderTargetBlock }))),
                                blockComments &&
                                    react_1["default"].createElement(BlockComponent_1.BlockComment, { block: block, onClickCommentBtn: onClickCommentBtn }))),
                !block.type.includes("List") &&
                    react_1["default"].createElement("div", { className: 'subBlocks' }, subBlocks !== undefined &&
                        subBlocks.map(function (subBlock) {
                            return react_1["default"].createElement(EditableBlock, { key: subBlocks.indexOf(subBlock), page: page, block: subBlock, addBlock: addBlock, editBlock: editBlock, changeToSub: changeToSub, raiseBlock: raiseBlock, deleteBlock: deleteBlock, smallText: smallText, command: command, setCommand: setCommand, setOpenComment: setOpenComment, setCommentBlock: setCommentBlock, setTargetPageId: setTargetPageId, setOpenLoader: setOpenLoader, setLoaderTargetBlock: setLoaderTargetBlock });
                        }))))));
};
exports["default"] = EditableBlock;
