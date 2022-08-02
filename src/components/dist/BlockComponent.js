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
exports.BlockComment = void 0;
var react_1 = require("react");
var react_contenteditable_1 = require("react-contenteditable");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var notion_1 = require("../modules/notion");
var ImageContent_1 = require("./ImageContent");
exports.BlockComment = function (_a) {
    var _b;
    var block = _a.block, onClickCommentBtn = _a.onClickCommentBtn;
    return (react_1["default"].createElement("div", { id: block.id + "_comments", className: "commentsBubble" },
        react_1["default"].createElement("button", { className: 'commentBtn btnIcon', name: block.id, onClick: function () { return onClickCommentBtn(block); } },
            react_1["default"].createElement(io5_1.IoChatboxOutline, null),
            react_1["default"].createElement("span", { className: "commentLength" }, (_b = block.comments) === null || _b === void 0 ? void 0 : _b.length))));
};
var BlockComponent = function (_a) {
    var block = _a.block, page = _a.page, addBlock = _a.addBlock, editBlock = _a.editBlock, changeToSub = _a.changeToSub, raiseBlock = _a.raiseBlock, deleteBlock = _a.deleteBlock, blockComments = _a.blockComments, command = _a.command, setCommand = _a.setCommand, onClickCommentBtn = _a.onClickCommentBtn, setOpenComment = _a.setOpenComment, setTargetPageId = _a.setTargetPageId, setOpenLoader = _a.setOpenLoader, setLoaderTargetBlock = _a.setLoaderTargetBlock;
    var editTime = JSON.stringify(Date.now);
    var contentEditableRef = react_1.useRef(null);
    var findTargetBlock = function (event) {
        var target = event.currentTarget.parentElement;
        var targetId = target.id;
        var end = targetId.indexOf("_contents");
        var blockId = targetId.slice(0, end);
        var targetBlock = notion_1.findBlock(page, blockId).BLOCK;
        return targetBlock;
    };
    var editor = document.getElementsByClassName("editor")[0];
    var showBlockFn = function (event) {
        var _a;
        var currentTarget = event.currentTarget;
        var mainBlock = (_a = currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        var domReact = mainBlock === null || mainBlock === void 0 ? void 0 : mainBlock.getClientRects()[0];
        var frameDomRect = document.getElementsByClassName("frame")[0].getClientRects()[0];
        var editableBlockDomRect = document.getElementsByClassName("editableBlock")[0].getClientRects()[0];
        var blockFn = document.getElementById("blockFn");
        blockFn === null || blockFn === void 0 ? void 0 : blockFn.classList.toggle("on");
        (blockFn === null || blockFn === void 0 ? void 0 : blockFn.classList.contains("on")) ?
            sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
            :
                sessionStorage.removeItem("blockFnTargetBlock");
        if (domReact !== undefined) {
            var top = domReact.top + editor.scrollTop;
            var left = editableBlockDomRect.x - frameDomRect.x - 45;
            var blockFnStyle = "top:" + top + "px; left:" + left + "px";
            blockFn === null || blockFn === void 0 ? void 0 : blockFn.setAttribute("style", blockFnStyle);
        }
    };
    var onChangeContents = function (event) {
        var value = event.target.value;
        var targetBlock = findTargetBlock(event);
        var targetBlockIndex = page.blocksId.indexOf(targetBlock.id);
        var changeBlockContent = function () {
            if (value.includes("<div>")) {
                //enter 시에 새로운 블록 생성 
                var start = value.indexOf("<div>");
                var end = value.indexOf("</div>");
                var editedContents = value.slice(0, start);
                var newBlockContents = value.slice(start + 5, end);
                var newBlock = __assign(__assign({}, notion_1.makeNewBlock(page, targetBlock, newBlockContents)), { firstBlock: targetBlock.firstBlock, subBlocksId: targetBlock.subBlocksId });
                if ((targetBlock.contents !== editedContents) || (targetBlock.subBlocksId !== null)) {
                    var editedBlock = __assign(__assign({}, targetBlock), { contents: block.contents !== editedContents ? editedContents : targetBlock.contents, subBlocksId: targetBlock.subBlocksId !== null ? null : targetBlock.subBlocksId, editTime: editTime });
                    editBlock(page.id, editedBlock);
                }
                if (block.type === notion_1.toggle) {
                    var newSubToggleBlock = __assign(__assign({}, newBlock), { parentBlocksId: [targetBlock.id], firstBlock: false });
                    addBlock(page.id, newSubToggleBlock, targetBlockIndex + 1, targetBlock.id);
                }
                else {
                    addBlock(page.id, newBlock, targetBlockIndex + 1, targetBlock.id);
                }
                ;
            }
            else {
                // edite targetBlock 
                var cursor = document.getSelection();
                var offset = cursor === null || cursor === void 0 ? void 0 : cursor.anchorOffset;
                if (!(targetBlock.contents === "" && offset === 0 && value === "")) {
                    var editedBlock = __assign(__assign({}, targetBlock), { contents: value, editTime: editTime });
                    targetBlock.contents !== value &&
                        sessionStorage.setItem("itemsTobeEdited", JSON.stringify(editedBlock));
                }
                ;
            }
            ;
        };
        if (!value.startsWith("/")) {
            changeBlockContent();
        }
        else {
            setOpenComment(false);
            setCommand({
                boolean: true,
                command: "/",
                targetBlock: targetBlock
            });
        }
    };
    var onKeyDownContents = function (event) {
        var _a, _b, _c;
        var code = event.code.toLowerCase();
        var targetBlock = findTargetBlock(event);
        switch (code) {
            case "tab":
                event.preventDefault();
                var targetEditableDoc = (_b = (_a = document.getElementById("block_" + targetBlock.id)) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
                var previousEditableDoc = targetEditableDoc.previousElementSibling;
                var previousBlockDoc = (_c = previousEditableDoc.firstChild) === null || _c === void 0 ? void 0 : _c.firstChild;
                var previousBlockId = previousBlockDoc.id.slice(6);
                changeToSub(page.id, targetBlock, previousBlockId);
                break;
            case "backspace":
                var text = event.currentTarget.innerText;
                var cursor = document.getSelection();
                var offset = cursor === null || cursor === void 0 ? void 0 : cursor.anchorOffset;
                console.log("offset", offset, text === "", targetBlock.contents);
                if (offset === 0 && text === "") {
                    deleteBlock(page.id, targetBlock, false);
                }
                if (offset === 0 && text !== "") {
                    raiseBlock(page.id, targetBlock);
                }
                break;
            default:
                break;
        }
        ;
    };
    function commandChange(event) {
        var value = event.target.value;
        var trueOrFale = value.startsWith("/");
        if (trueOrFale) {
            setCommand({
                boolean: true,
                command: value.toLowerCase(),
                targetBlock: command.targetBlock
            });
        }
        else {
            setCommand({
                boolean: false,
                command: null,
                targetBlock: null
            });
        }
        ;
    }
    ;
    function commandKeyUp(event) {
        var code = event.code;
        var firstOn = document.querySelector(".command_btn.on.first");
        if (code === "Enter" && command.targetBlock !== null) {
            var name_1 = firstOn === null || firstOn === void 0 ? void 0 : firstOn.getAttribute("name");
            var blockType = notion_1.blockTypes.filter(function (type) { return name_1.includes(type); })[0];
            var newBlock = __assign(__assign({}, command.targetBlock), { type: blockType, editTime: editTime });
            editBlock(page.id, newBlock);
            setCommand({
                boolean: false,
                command: null,
                targetBlock: null
            });
        }
    }
    ;
    var onClickBlockContents = function () {
        block.type === "page" && setTargetPageId(block.id);
    };
    var onClickAddFileBtn = function () {
        setOpenLoader(true);
        setLoaderTargetBlock(block);
    };
    var BlockContentEditable = function () {
        return (react_1["default"].createElement(react_1["default"].Fragment, null, !command.command || (command.targetBlock !== null && command.targetBlock.id !== block.id) ?
            react_1["default"].createElement(react_contenteditable_1["default"], { className: 'contentEditable', placeholder: "type '/' for commmands", html: block.contents, innerRef: contentEditableRef, onChange: function (event) { return onChangeContents(event); }, onKeyDown: function (event) { return onKeyDownContents(event); } })
            :
                react_1["default"].createElement("input", { type: "text", tabIndex: -1, value: command.command, className: 'contentEditable', onChange: commandChange, onKeyUp: commandKeyUp })));
    };
    return (react_1["default"].createElement("div", { onClick: onClickBlockContents, className: block.type + "_blockComponent" }, !blockComments ?
        (block.type === "page" ?
            react_1["default"].createElement("button", { className: "contents pageTitle", id: block.id + "_contents", onMouseOver: showBlockFn },
                react_1["default"].createElement(BlockContentEditable, null))
            :
                (block.type.includes("media") ?
                    (block.contents === "" ?
                        react_1["default"].createElement("button", { className: 'addBlockFile', onClick: onClickAddFileBtn },
                            react_1["default"].createElement("span", { className: "addBlockFileIcon" },
                                block.type === "image media" &&
                                    react_1["default"].createElement(md_1.MdOutlinePhotoSizeSelectActual, null),
                                block.type === "bookmark media" &&
                                    react_1["default"].createElement(md_1.MdOutlineCollectionsBookmark, null)),
                            react_1["default"].createElement("span", null,
                                "Add a ",
                                block.type.slice(0, block.type.indexOf("media"))))
                        :
                            react_1["default"].createElement(react_1["default"].Fragment, null,
                                block.type === "image media" &&
                                    react_1["default"].createElement(ImageContent_1["default"], { pageId: page.id, block: block, editBlock: editBlock, showBlockFn: showBlockFn }),
                                block.type === "bookmark media" &&
                                    react_1["default"].createElement("div", { className: 'bookmark' })))
                    :
                        react_1["default"].createElement("div", { id: block.id + "_contents", className: "contents", onMouseOver: showBlockFn },
                            react_1["default"].createElement(BlockContentEditable, null))))
        :
            react_1["default"].createElement("button", { id: block.id + "_contents", className: "contents commentBtn", onMouseOver: showBlockFn, onClick: function () { !command.boolean && onClickCommentBtn(block); } },
                react_1["default"].createElement(BlockContentEditable, null))));
};
exports["default"] = react_1["default"].memo(BlockComponent);
