class FollowerDiv {
    constructor() {
        this._moveDivW = 30;
        this._moveDivH = 30;
        this._closeDivW = 30;
        this._closeDivH = 30;
        this._displayDivY = 40;
        this._isDisplay = false;
        this._els = {};
        this._eleFuncList = [];
        this._isMax = true;
        this._temp = {
            programMainTag: "",
            inputList: {},
            divW: 300,
            divH: 300
        };
        this._saveTempKey = "FollowerDivTempKey";
        this._readTemp();
        hgJDebugDiv = document.createElement("div");
        document.body.appendChild(hgJDebugDiv);
        this._createCloseDiv();
        this._createMoveDiv();
        this._createScaleDiv();
        this._createDisplayDiv();
        this.display(this._isDisplay);
    }
    /** 读取数据 */
    _readTemp() {
        let str = localStorage.getItem(this._saveTempKey);
        if (!str) {
            return;
        }
        let data = JSON.parse(str);
        this._temp = data;
        if (!this._temp.divW) {
            this._temp.divW = 300;
        }
        if (!this._temp.divH) {
            this._temp.divH = 300;
        }
    }
    /** 保存数据 */
    _saveTemp() {
        let str = JSON.stringify(this._temp);
        localStorage.setItem(this._saveTempKey, str);
    }
    /** 获取模板数据(经过反序列后的数据) */
    getTemp() {
        let str = localStorage.getItem(this._saveTempKey);
        if (!str) {
            return;
        }
        return JSON.parse(str);
    }
    /** 创建移动的div */
    _createMoveDiv() {
        this._moveDiv = document.createElement("div");
        hgJDebugDiv.appendChild(this._moveDiv);
        this._moveDiv.style.position = "absolute";
        this._moveDiv.style.background = "blue";
        this._moveDiv.style.width = this._moveDivW.toString() + "px";
        this._moveDiv.style.height = this._moveDivH.toString() + "px";
        this._moveDiv.addEventListener("mousedown", (e) => {
            this._movePrevP = new JPos(e.clientX, e.clientY);
            this._downStartP = new JPos().copy(this._movePrevP);
            this._setDivMove();
        });
    }
    /** 创建内容的div */
    _createDisplayDiv() {
        this._displayDiv = document.createElement("div");
        hgJDebugDiv.appendChild(this._displayDiv);
        this._displayDiv.style.position = "absolute";
        this._displayDiv.style.background = "#777777";
        this._displayDiv.style.width = (this._temp.divW).toString() + "px";
        this._displayDiv.style.height = (this._temp.divH - this._displayDivY).toString() + "px";
        this._displayDiv.style.top = this._displayDivY.toString() + 'px';
        this._displayDiv.style.overflow = "auto";
    }
    /** 创建缩放的div */
    _createScaleDiv() {
        this._scaleDiv = document.createElement("div");
        hgJDebugDiv.append(this._scaleDiv);
        this._scaleDiv.style.position = "absolute";
        this._scaleDiv.style.background = "#777777";
        this._scaleDiv.style.width = this._moveDivW.toString() + "px";
        this._scaleDiv.style.height = this._moveDivH.toString() + "px";
        this._scaleDiv.style.right = (-this._moveDivW) + "px";
        this._scaleDiv.style.bottom = (-this._moveDivH) + "px";
        this._scaleDiv.addEventListener("mousedown", (e) => {
            this._movePrevP = new JPos(e.clientX, e.clientY);
            this._downStartP = new JPos().copy(this._movePrevP);
            this._setDivScale();
        });
    }
    /** 创建关闭显示的div */
    _createCloseDiv() {
        this._closeDiv = document.createElement("div");
        hgJDebugDiv.appendChild(this._closeDiv);
        this._closeDiv.style.position = "absolute";
        this._closeDiv.style.background = "green";
        this._closeDiv.style.width = this._closeDivW.toString() + "px";
        this._closeDiv.style.height = this._closeDivH.toString() + "px";
        this._closeDiv.style.right = "0px";
        this._closeDiv.addEventListener("click", () => {
            this.display(false);
        });
    }
    /** 设置最大最小 */
    setMaxMin(isMax) {
        if (isMax == undefined) {
            isMax = !this._isMax;
        }
        this._isMax = isMax;
        this._displayDiv.hidden = !isMax;
        this._closeDiv.hidden = !isMax;
        this._scaleDiv.hidden = !isMax;
        this.display(true);
    }
    /** 设置移动的方法 */
    _setDivMove() {
        let moveFunc = (e) => {
            let lastP = new JPos(e.clientX, e.clientY);
            let p = PosUtil.getSub(this._movePrevP, lastP);
            this._x -= p.x;
            this._y -= p.y;
            hgJDebugDiv.style.left = this._x.toString() + 'px';
            hgJDebugDiv.style.top = this._y.toString() + 'px';
            this._movePrevP = lastP;
        };
        let upFunc = (e) => {
            let upP = new JPos(e.clientX, e.clientY);
            let delta = Math.abs(upP.x - this._downStartP.x) + Math.abs(upP.y - this._downStartP.y);
            if (delta < 3) {
                this.setMaxMin();
            }
            document.body.removeEventListener('mousemove', moveFunc);
            document.body.removeEventListener("mouseup", upFunc);
        };
        document.body.addEventListener("mousemove", moveFunc);
        document.body.addEventListener("mouseup", upFunc);
    }
    /** 设置缩放的方法 */
    _setDivScale() {
        let moveFunc = (e) => {
            let lastP = new JPos(e.clientX, e.clientY);
            let p = PosUtil.getSub(lastP, this._movePrevP);
            this._temp.divW += p.x;
            this._temp.divH += p.y;
            hgJDebugDiv.style.width = (parseFloat(hgJDebugDiv.style.width) + p.x) + "px";
            hgJDebugDiv.style.height = (parseFloat(hgJDebugDiv.style.height) + p.y) + "px";
            this._displayDiv.style.width = (parseFloat(this._displayDiv.style.width) + p.x) + "px";
            this._displayDiv.style.height = (parseFloat(this._displayDiv.style.height) + p.y) + "px";
            this._movePrevP = lastP;
        };
        let upFunc = (e) => {
            this._saveTemp();
            document.body.removeEventListener('mousemove', moveFunc);
            document.body.removeEventListener("mouseup", upFunc);
        };
        document.body.addEventListener("mousemove", moveFunc);
        document.body.addEventListener("mouseup", upFunc);
    }
    display(v, tag) {
        if (tag != undefined) {
            this._temp.programMainTag = tag;
            this._saveTemp();
        }
        tag = this._temp.programMainTag;
        if (v == undefined) {
            v = !this._isDisplay;
        }
        this._isDisplay = v;
        if (!v) {
            hgJDebugDiv.hidden = true;
            return;
        }
        if (this._isMax && this._eleFuncList.length > 0) {
            this._displayDiv.innerHTML = "";
            this._els = {};
            let btnList = [];
            let mainBtn = document.createElement("button");
            mainBtn.innerHTML = "所有";
            mainBtn.onclick = () => {
                this._temp.programMainTag = "";
                this._saveTemp();
                this.display(true);
            };
            btnList = [mainBtn];
            this._eleFuncList.forEach(obj => {
                if (obj.tag) {
                    let btn = document.createElement("button");
                    btn.innerHTML = obj.tag;
                    btn.onclick = () => {
                        this._temp.programMainTag = obj.tag;
                        this._saveTemp();
                        this.display(true);
                    };
                    if (obj.tag == tag) {
                        btn.style.background = "green";
                    }
                    btnList.push(btn);
                }
            });
            this._displayDiv.append(...btnList, document.createElement("br"));
            let noFirstCheck = false;
            this._eleFuncList.forEach((obj) => {
                if (!tag || tag == obj.tag) {
                    let label = document.createElement("label");
                    label.style.color = "yellow";
                    label.innerHTML = `$$${obj.tag}$$`;
                    noFirstCheck && this._displayDiv.append(document.createElement("br"));
                    noFirstCheck = true;
                    this._displayDiv.append(label, document.createElement("br"));
                    obj.func();
                }
            });
        }
        hgJDebugDiv.hidden = false;
        hgJDebugDiv.style.position = "fixed";
        hgJDebugDiv.style.zIndex = "9999999";
        hgJDebugDiv.style.background = "red";
        let divW = this._isMax ? this._temp.divW : this._moveDivW;
        let divH = this._isMax ? this._temp.divH : this._moveDivH;
        hgJDebugDiv.style.width = divW.toString() + 'px';
        hgJDebugDiv.style.height = divH.toString() + "px";
        if (this._x == undefined && this._y == undefined) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            this._x = (w - divW) / 2;
            this._y = (h - divH) / 2;
        }
        hgJDebugDiv.style.left = this._x.toString() + 'px';
        hgJDebugDiv.style.top = this._y.toString() + 'px';
    }
    /** 设置移动后显示 */
    setMoveDisplay(x, y) {
        this._x = x;
        this._y = y;
        this._saveTemp();
        this.display(true);
    }
    /** 获取对应的按钮 */
    getBtn(targetID) {
        return this._els[targetID];
    }
    /**
     * 创建对应的按钮
     * @param name 按钮名字
     * @param btnFunc 触发方法
     * @param targetID 可以保持元素唯一性,如果已经存在,将删除旧的
     * @param title 按钮的提示,提供提示信息
     * @returns
     */
    createBtn(name, btnFunc, targetID, title) {
        if (!targetID) {
            targetID = ObjUtil.guid;
        }
        let btn;
        btn = document.createElement("button");
        if (this._els[targetID]) {
            this._els[targetID].remove();
        }
        this._els[targetID] = btn;
        this._displayDiv.appendChild(btn);
        btn.innerHTML = name;
        btn.onclick = (e) => {
            btnFunc(e, btn);
        };
        if (title) {
            btn.title = title;
        }
        return btn;
    }
    /**
     * 创建输入框
     * @param name 按钮名字
     * @param btnFunc 触发方法
     * @param targetID 可以保持元素唯一性,如果已经存在,将删除旧的
     * @param initCB 初始化回调
     * @returns
     */
    createInput(name, btnFunc, targetID, initCB) {
        if (!targetID) {
            targetID = ObjUtil.guid;
        }
        let div = document.createElement("div");
        let input = document.createElement("input");
        let btn = document.createElement("button");
        this._els[targetID] = div;
        div.append(input, btn);
        this._displayDiv.appendChild(div);
        btn.innerHTML = name;
        btn.onclick = (e) => {
            btnFunc(input.value, e, btn, input);
        };
        if (initCB) {
            initCB(btn, input);
        }
        return input;
    }
    /**
     * 公用输入文本类型元素的加强版
     * @param btnList 按钮组
     * @param tag 类型
     * @param saveTag 保存关键字
     * @param labelStr 前缀字符
     * @param initCB 初始化回调
     * @returns
     */
    createCommonInputPlus(btnList, tag, saveTag, labelStr, initCB) {
        let div = document.createElement("div");
        if (labelStr) {
            let label = document.createElement("label");
            label.style.color = "white";
            label.innerHTML = labelStr;
            div.append(label);
        }
        let input = document.createElement(tag);
        if (saveTag) {
            if (tag == "input") {
                input.value = this._temp.inputList[saveTag] || "";
            }
            else if (tag == "textarea") {
                input.value = this._temp.inputList[saveTag] || "";
            }
            input.addEventListener("change", () => {
                if (tag == "input") {
                    this._temp.inputList[saveTag] = input.value;
                }
                else if (tag == "textarea") {
                    this._temp.inputList[saveTag] = input.value;
                }
                this._saveTemp();
            });
        }
        div.append(input);
        let list = [];
        btnList.forEach(child => {
            let btn = document.createElement("button");
            btn.innerHTML = child.name;
            btn.onclick = (e) => {
                if (tag == "input") {
                    child.func(input.value, e, btn);
                }
                else if (tag == "textarea") {
                    child.func(input.value, e, btn);
                }
            };
            if (child.title) {
                btn.title = child.title;
            }
            div.append(btn);
            list.push(btn);
        });
        if (initCB) {
            initCB(list, input);
        }
        this._displayDiv.appendChild(div);
        return input;
    }
    /**
     * 创建文本框加强版
     * @param btnList 按钮组
     * @param saveTag 保存关键字
     * @param labelStr 前缀字符
     * @param initCB 初始化回调
     * @returns
     */
    creatTextAreaPlus(btnList, saveTag, labelStr, initCB) {
        return this.createCommonInputPlus(btnList, "textarea", saveTag, labelStr, initCB);
    }
    /**
     * 创建输入框加强版
     * @param btnList 按钮组
     * @param saveTag 保存关键字
     * @param labelStr 前缀字符
     * @param initCB 初始化回调
     * @returns
     */
    createInputPlus(btnList, saveTag, labelStr, initCB) {
        return this.createCommonInputPlus(btnList, "input", saveTag, labelStr, initCB);
    }
    /** 添加方法 */
    pushEleFunc(obj) {
        let index = this._eleFuncList.findIndex(child => { return child.tag == obj.tag; });
        if (index != -1) {
            return;
        }
        this._eleFuncList.push(obj);
    }
}
let hgJDebugDiv;
let followerDiv;
// 调试模式才开启
if (Number(localStorage.getItem("jdebug") || 0) || DomUtil.getQueryString("debug")) {
    followerDiv = new FollowerDiv();
    window["jdebug"] = (tag) => {
        followerDiv.display(undefined, tag);
    };
    // document.body.addEventListener("keyup", (e) => {
    //     if (e.altKey && e.key == "j") {
    //         followerDiv.display()
    //     }
    // })
}
else {
    followerDiv = ({
        createBtn: () => { },
        display: () => { },
        getBtn: () => { return false; },
        createInput: () => { },
        pushEleFunc: () => { },
        createInputPlus: () => { }
    });
}
