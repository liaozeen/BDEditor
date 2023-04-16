var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// type DxfReturnDataType = {
//     node: string;
//     attr: any;
//     children: any[];
// }
// declare class Dxf {
//     parser: DxfParser
//     initParser(): void
//     parseSync(fileText: string): any
//     dxfToBd(dxf: string): DxfReturnDataType
//     dxfToPath(dxf: string): DxfReturnDataType
//     isLwpolyline(json: any): boolean
//     hasLwpolyline(entities: any[]): boolean
//     getVertices(json: any): any
//     initBoard(): DxfReturnDataType
//     createNode(node?: string, attr?: any = {}, children: any[] = []): DxfReturnDataType
// }
function JBDCanvas_CompassBitmapUpdate() {
    this.canvasSys.coordinateCanvas.lineWidth = 2;
    this.canvasSys.coordinateCanvas.arrowWidth = 10;
    this.canvasSys.coordinateCanvas.textColor = "#fff";
    this.canvasSys.coordinateCanvas.textInterval = 5;
    this.canvasSys.coordinateCanvas.lineLength = 80;
    if (this.curFace == "L") {
        // this.canvasSys.coordinateCanvas.
        this.canvasSys.coordinateCanvas.moveP = new JPos(-this.canvasSys.coordinateCanvas.width + 125, 0);
        this.canvasSys.coordinateCanvas.yText = "Z";
        this.canvasSys.coordinateCanvas.xText = "Y";
        this.canvasSys.coordinateCanvas.resize(-1, -1);
    }
    else if (this.curFace == "R") {
        this.canvasSys.coordinateCanvas.moveP = new JPos(0, 0);
        this.canvasSys.coordinateCanvas.yText = "Z";
        this.canvasSys.coordinateCanvas.xText = "Y";
        this.canvasSys.coordinateCanvas.resize(1, -1);
    }
    else if (this.curFace == "U") {
        this.canvasSys.coordinateCanvas.moveP = new JPos(-this.canvasSys.coordinateCanvas.width + 125, 0);
        this.canvasSys.coordinateCanvas.yText = "Z";
        this.canvasSys.coordinateCanvas.xText = "X";
        this.canvasSys.coordinateCanvas.resize(-1, -1);
    }
    else if (this.curFace == "D") {
        this.canvasSys.coordinateCanvas.moveP = new JPos(0, 0);
        this.canvasSys.coordinateCanvas.yText = "Z";
        this.canvasSys.coordinateCanvas.xText = "X";
        this.canvasSys.coordinateCanvas.resize(1, -1);
    }
}
class JBDCanvas_CreateBitmap {
    /** 创建标注 */
    createTag(op) {
        if (Math.abs(op.start.x - op.end.x) + Math.abs(op.end.y - op.start.y) < 1) {
            return;
        }
        if (!(op === null || op === void 0 ? void 0 : op.group)) {
            op.group = this.group;
        }
        let tag = op.group.createCustom(HGTagBitmap);
        tag.data = new HGTagDataType();
        tag.data.start = op.isReveser ? op.end : op.start;
        tag.data.end = op.isReveser ? op.start : op.end;
        let d = PosUtil.getDistance(tag.data.start, tag.data.end);
        tag.data.text = d.toFixed(1);
        tag.style.strokeStyle;
        tag.data.lineColor = "#0f0";
        tag.data.textColor = "#0f0";
        tag.data.isScale = false;
        tag.data.textRadian = 0;
        tag.fillColor = this.backGroupColor;
        tag.isTextInLineCenter = true;
        tag.data.distance = ((op.distanceRatio || 0) * this.tagDistance) + (op.distance || 0);
        tag.data.interval = 2;
        tag.data.distance -= tag.data.interval;
        return tag;
    }
    /** 创建文本 */
    createText(op) {
        let text = this.group.createBitmap("text");
        text.data = { pos: op.p, text: op.str, fontSize: op.fontRatio / this.jcanvas.scale };
        text.style.fillStyle = "#0ff";
        text.beforeDraw = () => {
            text.data.fontSize = op.fontRatio / this.jcanvas.scale;
        };
        return text;
    }
    /** 创建侧边槽 */
    createSideHole(op) {
        let rect = this.group.createBitmap("rect");
        rect.data = op.data;
        rect.userData = { guid: op.guid };
        rect.beforeDraw = () => {
            if (rect.userData.guid == this.decode.selectGuid) {
                rect.style.strokeStyle = "#f00";
            }
            else {
                rect.style.strokeStyle = "#fff";
            }
        };
    }
    /** 创建孔 */
    createHole(op) {
        let hole = this.group.createCustom(JBDHoleBitmap);
        hole.data = {
            center: op.cneter,
            radius: op.r
        };
        hole.isStorke = true;
        hole.isFill = true;
        hole.style.fillStyle = "rgba(0,0,0,0)";
        hole.userData = { guid: op.guid };
        hole.updateData();
        let isenter = false;
        hole.on("mouseenter", () => {
            isenter = true;
        });
        hole.on("mouseleave", () => {
            isenter = false;
        });
        hole.beforeDraw = () => {
            if (hole.userData.guid == this.decode.selectGuid || isenter) {
                hole.style.strokeStyle = "#f00";
                hole.updateData();
            }
            else {
                hole.style.strokeStyle = "#fff";
                hole.updateData();
            }
        };
        return hole;
    }
    /** 创建挖槽 */
    createCut(op) {
        let cut = this.group.createCustom(JBDCutBitmap);
        cut.data = op.data;
        cut.userData = { guid: op.guid };
        let isenter = false;
        cut.on("mouseenter", () => {
            isenter = true;
        });
        cut.on("mouseleave", () => {
            isenter = false;
        });
        cut.beforeDraw = () => {
            if (cut.userData.guid == this.decode.selectGuid || isenter) {
                cut.rectStroke = "red";
            }
            else {
                cut.rectStroke = "#ebbb60";
            }
        };
        return cut;
    }
    createExtendsTag(op) {
        let tag = this.group.createCustom(JBDExtendsTagBitmap);
        tag.data = op;
        tag.lineColor = "#fff";
        tag.textColor = "#0ff";
        let a = op.end.x - op.start.x;
        a = Math.abs(a) / a;
        let interval = 20;
        tag.beforeDraw = () => {
            tag.textHalfWidth = interval * a / this.jcanvas.scale;
        };
        return tag;
    }
}
function JBDCanvas_FBBitmapUpdate(op) {
    var _a, _b, _c, _d;
    let w = 0;
    let h = this.decode.size.bh;
    if (this.curFace == "L" || this.curFace == "R") {
        w = this.decode.size.bw;
    }
    else if (this.curFace == "D" || this.curFace == "U") {
        w = this.decode.size.bl;
    }
    else {
        console.warn("当前面数据不对");
        return;
    }
    let cutList = this.decode.getCutDataByCompass(this.curFace);
    let blockTagStart;
    let blockTagEnd;
    let shadowRectList = [];
    let alien = this.decode.jFbViewLabel.cacheFbData.alien[this.curFace];
    let mainGroup = this.group.createBitmap("group");
    let cmdGroup = this.group.createBitmap("group");
    /** 背景板,用来触发其他点击用 */
    let backBit = mainGroup.createBitmap("rect");
    backBit.data = {
        x: -1000000,
        y: -1000000,
        width: 2000000,
        height: 2000000
    };
    backBit.isIgnoreCapture = true;
    let backDownFunc = undefined;
    let backUpFunc = undefined;
    backBit.on("mousedown", () => {
        if (backDownFunc) {
            backDownFunc();
        }
    });
    backBit.on("mouseup", () => {
        if (backUpFunc) {
            backUpFunc();
        }
    });
    if (op === null || op === void 0 ? void 0 : op.selectGuid) {
        backBit.isIgnoreCapture = false;
        backUpFunc = () => {
            backUpFunc = undefined;
            backBit.isIgnoreCapture = true;
            this.group.clear();
            this.canvasSys.inputs.clear();
            this.fbBitmapUpdate({});
            this.canvasSys.quickSetEvent();
        };
    }
    let getTagByGuidObjFunc = (child) => {
        if (child.node == "Arc") {
            return this.decode.outLineLine.find(obj => {
                if (obj.startGuid == child.arc.guid && obj.endGuid == child.arc.guid) {
                    return true;
                }
                return false;
            });
        }
        else if (child.node == "Line") {
            return this.decode.outLineLine.find(obj => {
                if (obj.startGuid != child.p1.guid && obj.startGuid != child.p2.guid) {
                    return false;
                }
                if (obj.endGuid != child.p1.guid && obj.endGuid != child.p2.guid) {
                    return false;
                }
                return true;
            });
        }
    };
    let getShadowRectFunc = (child) => {
        if (child.node == "Arc") {
            let arcObj = getTagByGuidObjFunc(child);
            if (!arcObj) {
                return;
            }
            let hit = PosUtil.getHitBox(arcObj.pList);
            return { data: hit, type: "Arc" };
        }
        else if (child.node == "Line") {
            let lineObj = getTagByGuidObjFunc(child);
            if (!lineObj) {
                return;
            }
            let hit = PosUtil.getHitBox([lineObj.start, lineObj.end]);
            return { data: hit, type: "Line" };
        }
    };
    alien.forEach(child => {
        let rectData = getShadowRectFunc(child);
        if (!rectData) {
            return;
        }
        shadowRectList.push(rectData);
    });
    let coorX = 0;
    let coorY = 0;
    // 调整坐标轴
    if (this.curFace == "L") {
        this.jcanvas.setCoordinate(-1, -1);
        coorY = -1;
    }
    else if (this.curFace == "R") {
        this.jcanvas.setCoordinate(1, -1);
        coorY = 1;
    }
    else if (this.curFace == "U") {
        this.jcanvas.setCoordinate(-1, -1);
        coorX = -1;
    }
    else if (this.curFace == "D") {
        this.jcanvas.setCoordinate(1, -1);
        coorX = 1;
    }
    else {
        this.jcanvas.setCoordinate(1, -1);
    }
    let blockBitmap = mainGroup.createBitmap("rect");
    blockBitmap.data = {
        x: 0, y: 0, width: w, height: h
    };
    // 四周轮廓标注
    // 上
    this.createTag({ start: new JPos(0, h), end: new JPos(w, h), distanceRatio: 2 });
    // 下
    this.createTag({ start: new JPos(0, 0), end: new JPos(w, 0), distanceRatio: 2, isReveser: true });
    // 左
    this.createTag({ start: new JPos(0, 0), end: new JPos(0, h), distanceRatio: 2 });
    // 右
    this.createTag({ start: new JPos(w, 0), end: new JPos(w, h), distanceRatio: 2, isReveser: true });
    // 遮挡绘制
    shadowRectList.forEach(child => {
        if (child.type == "Arc" && (child.data.w == 0 || child.data.h == 0)) {
            return;
        }
        let x = Math.abs(coorX) * child.data.p.x + Math.abs(coorY) * child.data.p.y;
        let w = Math.abs(coorX) * child.data.w + Math.abs(coorY) * child.data.h;
        let rect = mainGroup.createBitmap("rect");
        rect.data = {
            x: x, y: 0, width: w, height: h
        };
        rect.isFill = true;
        let str = "";
        if (child.type == "Arc") {
            rect.style.fillStyle = "rgba(255,0,0,0.5)";
            str += 'R';
        }
        else if (child.type == "Line") {
            rect.style.fillStyle = "rgba(255,100,0,0.5)";
            str += 'L';
        }
        str += Math.round(w);
        let tagStart = new JPos(x + w / 2, h / 2);
        let add = 50;
        let a = 1;
        if (this.curFace == "R" || this.curFace == "D") {
            a = -1;
        }
        let tagEnd = new JPos(tagStart.x - add * a, tagStart.y + add);
        let tag = this.createExtendsTag({ start: tagStart, end: tagEnd, text: str });
    });
    // 绘制侧边槽
    this.decode.jFbViewLabel.cacheFbData.cut[this.curFace].forEach(cut => {
        let x = cut.X.value;
        let y = cut.Y.value;
        let x1 = cut.X1.value;
        let y1 = cut.Y1.value;
        let p;
        let w = cut.Hole_Z.value;
        let h = cut.Cutter.value;
        if (this.curFace == "L") {
            p = new JPos(y, 0);
        }
        else if (this.curFace == "R") {
            p = new JPos(y1, 0);
        }
        else if (this.curFace == "U") {
            p = new JPos(x1, 0);
        }
        else if (this.curFace == "D") {
            p = new JPos(x, 0);
        }
        if (cut.Face == "A") {
            p.y = 0;
        }
        else if (cut.Face == "B") {
            p.y = this.decode.size.bh - h;
        }
        let newP = new JPos(p.x - w / 2, p.y);
        this.createSideHole({ data: { x: newP.x, y: newP.y, width: w, height: h }, guid: cut.guid });
        let str = `c${w}_${h}`;
        let tagStart = new JPos(p.x, p.y + h / 2);
        let add = 50;
        let a = 1;
        if (this.curFace == "R" || this.curFace == "D") {
            a = -1;
        }
        let tagEnd = new JPos(tagStart.x - add * a, tagStart.y + add);
        let tag = this.createExtendsTag({ start: tagStart, end: tagEnd, text: str });
    });
    //通过方向获取槽的图元数据大法
    let getRectDataByCutFunc = (cut) => {
        let tagStart;
        let tagEnd;
        let isReverse = false;
        let data = {
            x: 0, y: 0, width: 0, height: 0
        };
        data.height = cut.cut.attr.Hole_Z.value;
        data.y = cut.cut.attr.Cut_Z.value - data.height / 2;
        if (this.curFace == "L") {
            data.x = cut.cut.attr.Y.value;
            data.width = cut.cut.attr.Y1.value - data.x;
        }
        else if (this.curFace == "R") {
            data.x = cut.cut.attr.Y.value;
            data.width = cut.cut.attr.Y1.value - data.x;
            isReverse = true;
        }
        else if (this.curFace == "U") {
            data.x = cut.cut.attr.X.value;
            data.width = cut.cut.attr.X1.value - data.x;
        }
        else if (this.curFace == "D") {
            data.x = cut.cut.attr.X.value;
            data.width = cut.cut.attr.X1.value - data.x;
            isReverse = true;
        }
        tagStart = new JPos(data.x, data.y + data.height);
        tagEnd = new JPos(data.x + data.width, data.y + data.height);
        let rectStart = new JPos(data.x, data.y);
        let rectEnd = new JPos(data.x + data.width, data.y);
        let center = PosUtil.getCenterPos(new JPos(data.x, data.y), new JPos(data.x + data.width, data.y + data.height));
        let type = "cut";
        return {
            data, rectStart, rectEnd, tagStart, tagEnd, isReverse, cut, center, type
        };
    };
    /** 更新移动后的挖槽数据 */
    let updateMoveCutData = (cut, d) => {
        if (cut.compass == "L" || cut.compass == "R") {
            cut.cut.attr.Y.value += d;
            cut.cut.attr.Y.formula = cut.cut.attr.Y.value;
            cut.cut.attr.Y1.value += d;
            cut.cut.attr.Y1.formula = cut.cut.attr.Y1.value;
            let parent = this.decode.getHoleNodeByCutNode(cut.cut);
            if (parent) {
                parent.attr.Y.value += d;
                parent.attr.Y.formula = parent.attr.Y.value;
                if (parent.attr.NotStandard) {
                    // console.log(parent.attr.NotStandard)
                    let str = parent.attr.NotStandard.formula.split("^").join(`"`);
                    let json = JSON.parse(str);
                    json.Y = cut.cut.attr.Y.formula.toString();
                    json.Y1 = cut.cut.attr.Y1.formula.toString();
                    parent.attr.NotStandard.formula = JSON.stringify(json).split('"').join("^");
                    parent.attr.NotStandard.value = parent.attr.NotStandard.formula;
                }
            }
        }
        else if (cut.compass == "D" || cut.compass == "U") {
            cut.cut.attr.X.value += d;
            cut.cut.attr.X.formula = cut.cut.attr.X.value;
            cut.cut.attr.X1.value += d;
            cut.cut.attr.X1.formula = cut.cut.attr.X1.value;
            let parent = this.decode.getHoleNodeByCutNode(cut.cut);
            if (parent) {
                parent.attr.X.value += d;
                parent.attr.X.formula = parent.attr.X.value;
                if (parent.attr.NotStandard) {
                    // console.log(parent.attr.NotStandard)
                    let str = parent.attr.NotStandard.formula.split("^").join(`"`);
                    let json = JSON.parse(str);
                    json.X = cut.cut.attr.X.formula.toString();
                    json.X1 = cut.cut.attr.X1.formula.toString();
                    parent.attr.NotStandard.formula = JSON.stringify(json).split('"').join("^");
                    parent.attr.NotStandard.value = parent.attr.NotStandard.formula;
                }
            }
        }
    };
    /** 创建挖槽移动用的 */
    let createCutTagFunc = (cut, start, end, delta) => {
        cmdGroup.clear();
        this.canvasSys.inputs.clear();
        let prevTag = this.createTag({ start: new JPos(0, start.y), end: new JPos(start.x + delta, start.y), distance: 10, isReveser: false, group: cmdGroup });
        let prevEndX = start.x;
        let nextTag = this.createTag({ start: new JPos(end.x + delta, end.y), end: new JPos(w, end.y), distance: 10, isReveser: false, group: cmdGroup });
        let nextStartX = end.x;
        let prevCenter = PosUtil.getCenterPos(prevTag.data.start, prevTag.data.end);
        prevCenter.y += this.tagDistance;
        let prevInput = this.canvasSys.inputs.add(prevCenter, prevTag.data.text, (v) => {
            let prevNum = Number(prevTag.data.text);
            let currentNum = Number(v);
            let delta = currentNum - prevNum;
            console.log(delta);
            updateMoveCutData(cut, delta);
            this.group.clear();
            this.canvasSys.inputs.clear();
            this.fbBitmapUpdate({ selectGuid: cut.cut.guid });
            this.canvasSys.quickSetEvent();
            this.bitmapSys.draw();
        });
        let nextCenter = PosUtil.getCenterPos(nextTag.data.start, nextTag.data.end);
        nextCenter.y += this.tagDistance;
        let nextInput = this.canvasSys.inputs.add(nextCenter, nextTag.data.text, (v) => {
            let nextNum = Number(nextTag.data.text);
            let currentNum = Number(v);
            let delta = currentNum - nextNum;
            updateMoveCutData(cut, -delta);
            this.group.clear();
            this.canvasSys.inputs.clear();
            this.fbBitmapUpdate({ selectGuid: cut.cut.guid });
            this.canvasSys.quickSetEvent();
            this.bitmapSys.draw();
        });
        this.canvasSys.inputs.updateDomsTransform();
        this.canvasSys.inputs.openClickSelect(prevInput);
        this.canvasSys.inputs.openClickSelect(nextInput);
        return {
            prevTag, prevEndX, nextStartX, nextTag, prevInput, nextInput
        };
    };
    // 挖槽
    let rectDataList = [];
    let childTagList = [];
    for (let i = 0; i < cutList.length; i++) {
        let cut = cutList[i];
        let rectData = getRectDataByCutFunc(cut);
        rectDataList.push(rectData);
        let cutBitmap = this.createCut({ data: rectData.data, guid: cut.cut.guid });
        let mP = new JPos(0, 0);
        cutBitmap.on("click", () => {
            let data = this.decode.getXmlPosByGuid(cut.cut.guid);
            if (!data.type) {
                return;
            }
            this.decode.event.bitmapClick.emit({ node: cut.cut, index: data.index, type: data.type });
        });
        if (op.selectGuid && cut.cut.guid == op.selectGuid) {
            createCutTagFunc(cut, rectData.tagStart, rectData.tagEnd, mP.x);
        }
        // 操作
        cutBitmap.on("mousedown", (o) => {
            if (!cut.cut.NotStandard) {
                return;
            }
            let delta = mP.x;
            let isFirst = true;
            backBit.isIgnoreCapture = false;
            let isDown = true;
            backUpFunc = () => {
                backUpFunc = undefined;
                backBit.isIgnoreCapture = true;
                this.group.clear();
                this.canvasSys.inputs.clear();
                this.fbBitmapUpdate({});
                this.canvasSys.quickSetEvent();
            };
            let tagData = createCutTagFunc(cut, rectData.tagStart, rectData.tagEnd, delta);
            this.jcanvas.event.mousemove = (p) => {
                if (!isDown) {
                    return;
                }
                if (isFirst) {
                    childTagList.forEach(c => {
                        if (c) {
                            c.destory();
                        }
                    });
                    childTagList = [];
                }
                let deltaP = PosUtil.getSub(p, o.p);
                mP.x = deltaP.x + delta;
                let m = [1, 0, 0, 1, mP.x, mP.y];
                cutBitmap.transform = m;
                isFirst = false;
                tagData.prevTag.data.end.x = tagData.prevEndX + mP.x;
                let d = PosUtil.getDistance(tagData.prevTag.data.start, tagData.prevTag.data.end);
                tagData.prevTag.data.text = d.toFixed(1);
                tagData.nextTag.data.start.x = tagData.nextStartX + mP.x;
                d = PosUtil.getDistance(tagData.nextTag.data.start, tagData.nextTag.data.end);
                tagData.nextTag.data.text = d.toFixed(1);
                tagData.prevInput.dom.value = tagData.prevTag.data.text;
                tagData.nextInput.dom.value = tagData.nextTag.data.text;
                this.canvasSys.inputs.updateDomsTransform();
                let prevCenter = PosUtil.getCenterPos(tagData.prevTag.data.start, tagData.prevTag.data.end);
                prevCenter.y += this.tagDistance;
                this.canvasSys.inputs.transByCanvasP(tagData.prevInput, prevCenter);
                let nextCenter = PosUtil.getCenterPos(tagData.nextTag.data.start, tagData.nextTag.data.end);
                nextCenter.y += this.tagDistance;
                this.canvasSys.inputs.transByCanvasP(tagData.nextInput, nextCenter);
            };
            this.jcanvas.event.mouseup = () => {
                updateMoveCutData(cut, mP.x - delta);
                isDown = false;
                this.group.clear();
                this.canvasSys.inputs.clear();
                this.fbBitmapUpdate({ selectGuid: cut.cut.guid });
                this.canvasSys.quickSetEvent();
            };
        });
        // cutBitmap.on("dblclick", () => {
        //     let data = this.decode.getXmlPosByGuid(cut.cut.guid)
        //     if (!data.type) {
        //         return
        //     }
        //     this.decode.event.bitmapDbclick.emit({ attr: cut.cut, index: data.index, isFB: data.type == "FB" })
        // })
        if (!(op === null || op === void 0 ? void 0 : op.selectGuid)) {
            childTagList.push(this.createTag({ start: rectData.tagStart, end: rectData.tagEnd, distanceRatio: 1, isReveser: rectData.isReverse }));
            let startTag = rectData.tagStart;
            let endTag = rectData.tagEnd;
            let tagIsRvever = rectData.isReverse;
            childTagList.push(this.createTag({ start: new JPos(startTag.x, 0), end: new JPos(startTag.x, cut.cut.attr.Cut_Z.value), isReveser: !tagIsRvever }));
            childTagList.push(this.createTag({ start: new JPos(startTag.x, h), end: new JPos(startTag.x, cut.cut.attr.Cut_Z.value), isReveser: tagIsRvever }));
            childTagList.push(this.createTag({ start: new JPos(endTag.x, cut.cut.attr.Cut_Z.value - cut.cut.attr.Hole_Z.value / 2), end: new JPos(endTag.x, cut.cut.attr.Cut_Z.value + cut.cut.attr.Hole_Z.value / 2), isReveser: tagIsRvever }));
            if (this.isShowHoleInfo) {
                let center = rectData.center;
                let str = `C${cut.cut.attr.Cutter.value}_${cut.cut.attr.Hole_Z.value}`;
                childTagList.push(this.createText({ str: str, p: center, fontRatio: 15 }));
            }
        }
    }
    rectDataList = rectDataList.sort((a, b) => {
        return a.rectStart.x - b.rectStart.x;
    });
    let prevChild;
    if (!(op === null || op === void 0 ? void 0 : op.selectGuid)) {
        for (let i = 0; i < rectDataList.length; i++) {
            let child = rectDataList[i];
            let check = false;
            if (i == 0) {
                check = true;
                let tagStart = new JPos(0, child.tagStart.y);
                let tagEnd = new JPos().copy(!child.isReverse ? child.tagStart : child.tagEnd);
                if (child.isReverse) {
                    let temp = tagStart;
                    tagStart = tagEnd;
                    tagEnd = temp;
                }
                childTagList.push(this.createTag({ start: !child.isReverse ? tagStart : tagEnd, end: !child.isReverse ? tagEnd : tagStart, distanceRatio: 1 }));
                // let tagStart = new JPos(0,ci)
            }
            if (i == rectDataList.length - 1) {
                check = true;
                let tagStart = new JPos().copy(child.isReverse ? child.tagStart : child.tagEnd);
                let tagEnd = new JPos(w, child.tagStart.y);
                if (child.isReverse) {
                    let temp = tagStart;
                    tagStart = tagEnd;
                    tagEnd = temp;
                }
                childTagList.push(this.createTag({ start: tagStart, end: tagEnd, distanceRatio: 1, isReveser: child.isReverse }));
            }
            if (check) {
            }
            prevChild = child;
        }
    }
    // 挖孔
    /**  通过方向获取挖孔数据大法 */
    let getHoleDataByCompassFunc = (hole) => {
        let cneter = new JPos();
        let isReverse = false;
        if (this.curFace == "L") {
            cneter.x = hole.attr.Y.value;
        }
        else if (this.curFace == "R") {
            cneter.x = hole.attr.Y.value;
            isReverse = true;
        }
        else if (this.curFace == "U") {
            cneter.x = hole.attr.X.value;
        }
        else if (this.curFace == "D") {
            cneter.x = hole.attr.X.value;
            isReverse = true;
        }
        if (hole.attr.Face == "B") {
            cneter.y = this.decode.size.bh - hole.attr.Hole_Z.value;
        }
        else {
            cneter.y = hole.attr.Hole_Z.value;
        }
        let r = hole.attr.Rb.value / 2;
        let type = "hole";
        let start = new JPos(cneter.x, 0);
        let end = new JPos(cneter.x, this.decode.size.bh);
        return {
            cneter, type, r, start, end, isReverse
        };
    };
    let holes = ((_d = (_c = (_b = (_a = this.decode) === null || _a === void 0 ? void 0 : _a.jFbViewLabel) === null || _b === void 0 ? void 0 : _b.cacheFbData) === null || _c === void 0 ? void 0 : _c.holes) === null || _d === void 0 ? void 0 : _d[this.curFace]) || [];
    for (let i = 0; i < holes.length; i++) {
        let hole = holes[i];
        let targetHole = this.getFBHole(hole);
        let holeData = getHoleDataByCompassFunc(targetHole);
        let holeBitmap = this.createHole({ cneter: holeData.cneter, r: holeData.r, guid: hole.guid });
        holeBitmap.on("click", () => {
            let data = this.decode.getXmlPosByGuid(hole.guid);
            if (!data.type) {
                return;
            }
            this.decode.event.bitmapClick.emit({ node: hole, index: data.index, type: data.type });
            // this.decode.event.bitmapClick.emit({node:Hole,index:})
        });
        // holeBitmap.on("dblclick", () => {
        //     let data = this.decode.getXmlPosByGuid(hole.guid)
        //     if (!data.type) {
        //         return
        //     }
        //     this.decode.event.bitmapDbclick.emit({ attr: hole, index: data.index, isFB: data.type == "FB" })
        // })
        if (!(op === null || op === void 0 ? void 0 : op.selectGuid)) {
            childTagList.push(this.createTag({ start: holeData.start, end: holeData.cneter, distance: 10, isReveser: !holeData.isReverse }));
            childTagList.push(this.createTag({ start: holeData.end, end: holeData.cneter, distance: 10, isReveser: holeData.isReverse }));
        }
    }
}
class JBDCanvas_Other {
    init(div) {
        this.canvasSys = new HGCanvasSys(div);
        this.jcanvas = this.canvasSys.jcanvas;
        this.jcanvas.fillStyle = "rgb(255,255,255)";
        this.jcanvas.strokeStyle = "rgb(255,255,255)";
        this.jcanvas.backgroupColor = this.backGroupColor;
        this.bitmapSys = this.canvasSys.bitmapSys;
        this.canvasSys.coordinateCanvas.color = "#0f0";
        this.canvasSys.coordinateCanvas.lineWidth = 2;
        this.canvasSys.coordinateCanvas.arrowWidth = 4;
        this.canvasSys.quickSetEvent();
    }
    /** 是否显示孔位信息 */
    showHoleInfo(v) {
        this.isShowHoleInfo = v;
        this.bitmapUpdate(true);
    }
    display(v) {
        this.isDisplay = v;
        if (v) {
            this.canvasSys.bigDiv.style.display = "block";
        }
        else {
            this.canvasSys.bigDiv.style.display = "none";
        }
    }
    test() {
        let circle = this.bitmapSys.createBitmap("circle");
        circle.data = {
            center: new JPos(100, 100),
            radius: 20
        };
        circle.style.fillStyle = "red";
        circle.isFill = true;
        this.bitmapSys.draw();
        this.bitmapSys.setCenter();
    }
    resize(w, h) {
        this.jcanvas.resize(w, h);
        this.bitmapSys.draw();
        this.bitmapSys.setCenter();
        this.bitmapSys.draw();
    }
    draw() {
    }
    /** 图元更新 */
    bitmapUpdate(isNoCenter) {
        if (!this.group) {
            this.group = this.bitmapSys.createBitmap("group");
        }
        this.group.clear();
        let fbKeys = ["L", "R", "U", "D"];
        if (fbKeys.includes(this.curFace)) {
            this.compassBitmapUpdate();
            this.fbBitmapUpdate({});
            this.bitmapSys.draw();
            if (!isNoCenter) {
                this.bitmapSys.setCenter(undefined, 0.1);
            }
        }
    }
    /** 获取封边孔的原始数据 */
    getFBHole(hole) {
        let targetHole;
        this.decode.util.data.children.forEach(child => {
            if (child.node == "FaceA" || child.node == "FaceB") {
                child.children.forEach(childchild => {
                    if (childchild.guid == hole.guid) {
                        targetHole = childchild;
                    }
                });
            }
        });
        return targetHole;
    }
}
/** 圆弧 */
class Arc {
    constructor(ctx, arc) {
        this.node = "Arc";
        /** 线段的颜色 */
        this.color = "#fff"; // 线段的颜色
        /** 圆弧绘制方向,true为逆时针，false为顺时针 */
        this.wise = false; // 圆弧绘制方向,true为逆时针，false为顺时针
        /** 是否显示起始点 */
        this.showStartPoint = false; // 是否显示起始点
        /** 起始点的半径 */
        this.startR = 3; // 起始点的半径
        /** 是否被选中 */
        this.isSelected = false; // 是否被选中
        this.ctx = ctx;
        this.arc = arc;
        this.updateAttr();
        this.initLabel();
        // jeef,增加guid作为识别
        if (!this.guid) {
            this.guid = ObjUtil.guid;
        }
    }
    getRangeByAxisDirection(axisDirection) {
        return getRangeByAxisDirection(this, axisDirection);
    }
    getBox() {
        // 暂时只考虑直角弧的情况
        let { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } } = this;
        let [minx, maxx] = x1 <= x2 ? [x1, x2] : [x2, x1];
        let [miny, maxy] = y1 <= y2 ? [y1, y2] : [y2, y1];
        let width = maxx - minx;
        let height = maxy - miny;
        return {
            minx,
            miny,
            maxx,
            maxy,
            width,
            height
        };
    }
    draw(matrix) {
        this.drawArc(this.ctx, matrix);
        this.drawLabel(matrix);
        this.drawStartPoint(matrix);
    }
    /** 用于绘制导出图片 */
    draw2(ctx, matrix) {
        let color = this.color;
        this.color = "red";
        this.drawArc(ctx, matrix);
        this.color = color;
    }
    /** 计算圆弧的值 */
    updateAttr() {
        let attr = this.arc.attr;
        if (!attr)
            return;
        let arc = HGArcToCanvasArc({
            start: { x: attr.X.value, y: attr.Y.value },
            r: attr.R.value,
            startAngle: attr.StartAngle.value,
            angle: attr.Angle.value,
            type: "arc"
        }, {
            rotation: transform2d ? transform2d.rotation : 0
        });
        this.start = arc.start;
        this.r = arc.radius;
        this.center = arc.center;
        this.sAngle = arc.startAngle;
        this.angle = arc.angle;
        this.eAngle = arc.endAngle;
        this.middle = arc.middle;
        this.end = arc.end;
        this.wise = arc.isCounterClockwise;
    }
    /** 画弧 */
    drawArc(ctx, matrix) {
        ctx.save();
        ctx.strokeStyle = this.color;
        if (this.isSelected)
            ctx.strokeStyle = "#e64072"; // 如果被选中强制修改颜色
        this.createPath(ctx, matrix);
        ctx.stroke();
        ctx.restore();
    }
    /** 画标注 */
    drawLabel(matrix) {
        this.rLabel.draw(this.ctx, matrix);
    }
    /** 画圆弧起始点 */
    drawStartPoint(matrix) {
        if (!this.showStartPoint)
            return;
        let start = mat2d.transformCoord(this.start, matrix);
        canvas2d.drawCircular(this.ctx, start.x, start.y, this.startR);
    }
    /** 初始化圆弧标注 */
    initLabel() {
        this.rLabel = new Label(this.middle.x, this.middle.y, this.center.x, this.center.y, "cross", false);
    }
    /** 是否在起始点上 */
    isInStartPoint(x, y, matrix) {
        let start = mat2d.transformCoord(this.start, matrix);
        let dist = math2d.getLineLength(start.x, start.y, x, y);
        return dist <= this.startR;
    }
    /** 改变起始点的样式 */
    changeStartStyle(isInStart) {
        if (isInStart) {
            this.startR = 5;
            this.color = "#e64072";
        }
        else {
            this.startR = 3;
            this.color = "#fff";
        }
    }
    /** 创建圆弧的路径 */
    createPath(ctx, matrix) {
        let center = mat2d.transformCoord(this.center, matrix);
        let r = this.r * transform2d.scale;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, this.sAngle, this.eAngle, this.wise);
    }
    /** 点是否在圆弧上 */
    isPointInPath(matrix) {
        let [cp, sp, ep] = mat2d.transformCoords([this.center, this.start, this.end], matrix);
        let r = this.r * transform2d.scale;
        let direction = this.angle < 0 ? "顺时针" : "逆时针";
        return isPointInArc(direction, mouse.pos, sp, ep, cp, r);
    }
    /** 设置标注的样式 */
    setLabelStyle(cfg) {
        this.rLabel.setStyle(cfg);
    }
    /** 获取圆弧的离散点 */
    getPoints() {
        return PosUtil.getArcPArrByStep({
            center: this.center,
            radius: this.r,
            startAngle: -this.sAngle,
            endAngle: -this.eAngle,
            isCounterClockwise: !this.wise
        });
    }
}
/** 图纸 */
class Blueprint {
    constructor(attr) {
        /**内框的左下角x坐标 */
        this.x = 60; // 内框的左下角x坐标
        /** 内框的左下角y坐标 */
        this.y = 60; // 内框的左下角y坐标
        /** 两个边框的间距 */
        this.d = 18; // 两个边框的间距
        /** 图纸的宽高比例 */
        this.ratio = 1 / 1.5; // 图纸的宽高比例
        /** 表格属性的单元格的宽度 */
        this.titleWidth = 60; // 表格属性的单元格的宽度
        /** 表格属性值的单元格的宽度 */
        this.valueWidth = 100; // 表格属性值的单元格的宽度
        /** 单元格的高度 */
        this.cellHeight = 30; // 单元格的高度
        this.tableTitles = ['订单号', '封边', '名称', '条码', '类型', '制图', '规格', '日期', '材质'];
        this.tableValues = [];
        this.cells = [];
        if (attr) {
            for (let key in attr) {
                //@ts-ignore
                this[key] = attr[key];
            }
        }
        this.tableValues = this.initTableValue();
        this.setSize(canvas2d.canvas);
    }
    update() {
    }
    draw(transMatrix) {
        let ctx = canvas2d.ctx;
        this.drawFrame(ctx, transMatrix);
        this.drawTable(ctx, transMatrix);
    }
    // 初始化图纸的表格的参数resizeCanvas()
    initTableValue(obj) {
        obj = {
            订单号: '',
            封边: '',
            名称: '',
            条码: '',
            类型: '',
            制图: '',
            规格: '',
            日期: '',
            材质: ''
        };
        let values = [];
        this.tableTitles.forEach((title) => {
            let val = obj[title] || '';
            let value = {
                key: title,
                value: val
            };
            values.push(value);
        });
        return values;
    }
    // 绘制图纸的方框
    drawFrame(ctx, transMatrix) {
        let scale = transMatrix[0];
        let x2 = this.x - this.d;
        let y2 = this.y - this.d;
        let pos1 = mat2d.transformCoord({ x: this.x, y: this.y }, transMatrix);
        let pos2 = mat2d.transformCoord({ x: x2, y: y2 }, transMatrix);
        let w2 = (this.w + this.d * 2) * scale;
        let h2 = (this.h + this.d * 2) * scale;
        ctx.save();
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(pos1.x, pos1.y, this.w * scale, -this.h * scale);
        ctx.strokeRect(pos2.x, pos2.y, w2, -h2);
        ctx.restore();
    }
    drawTable(ctx, transMatrix) {
        let scale = transMatrix[0];
        ctx.save();
        ctx.beginPath();
        this.cells.forEach(cell => {
            let pos = mat2d.transformCoord({ x: cell.x, y: cell.y }, transMatrix);
            let w = cell.w * scale;
            let h = cell.h * scale;
            let fontSize = 14 * scale;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = '#FFF';
            ctx.fillText(cell.text, pos.x + w / 2, pos.y + h / 2);
            ctx.rect(pos.x, pos.y, w, h);
        });
        ctx.stroke();
        ctx.restore();
    }
    // 获取单元格的坐标
    getCellsPos() {
        let cellsPos = []; // 单元格插入点的集合
        let cellX = []; // 表格竖线的x坐标集合
        let cellY = []; // 表格横线的y坐标集合
        let endX = this.x + this.w; // 表格的右下角x坐标
        let endY = this.y; // 表格的右下角y坐标
        let titleNum = this.tableTitles.length + 1; // 属性的个数
        let rows = titleNum % 2 == 1 ? (titleNum + 1) / 2 : titleNum / 2; // 表格的行数
        let beginX = endX - (this.titleWidth + this.valueWidth) * 2; // 表格的左上角x坐标
        let beginY = endY + rows * this.cellHeight; // 表格的左上角y坐标
        let x = beginX;
        for (let i = 0; i < 4; i++) {
            if (i > 0) {
                if (i % 2 === 0) {
                    x += this.valueWidth;
                }
                if (i % 2 === 1) {
                    x += this.titleWidth;
                }
            }
            cellX.push(x);
        }
        for (let i = 0; i < rows; i++) {
            let y = beginY - this.cellHeight * i;
            cellY.push(y);
        }
        for (let i = 0; i < cellY.length; i++) {
            let cellType;
            for (let j = 0; j < cellX.length; j++) {
                let w;
                if (j % 2 === 0) {
                    cellType = 'title';
                    w = this.titleWidth;
                }
                if (j % 2 === 1) {
                    cellType = 'value';
                    w = this.valueWidth;
                }
                cellsPos.push({
                    type: cellType,
                    x: cellX[j],
                    y: cellY[i],
                    w: w,
                    h: this.cellHeight,
                    text: ''
                });
            }
        }
        for (let i = 0; i < this.tableValues.length; i++) {
            cellsPos[i * 2].text = this.tableValues[i].key;
            cellsPos[i * 2 + 1].text = this.tableValues[i].value;
        }
        return cellsPos;
    }
    // 设置尺寸
    setSize(canvas) {
        let height = canvas.clientHeight - 100;
        let width = height / this.ratio;
        let offsetX = (canvas.clientWidth - width) / 2;
        this.h = height;
        this.w = width;
        this.x = offsetX;
        this.cells = this.getCellsPos();
    }
}
/** 槽 */
class Cut {
    constructor(attr, BDUtils) {
        this.node = "Cut";
        /** 孔轮廓的颜色 */
        this.color = "#ebbb60"; // 孔轮廓的颜色
        /** 文字标注的颜色 */
        this.labelTextColor = "#0ff"; // 文字标注的颜色
        /** 是否被选中 */
        this.isSelected = false; // 是否被选中
        /** 是否被修改过 */
        this.isEdit = false; // 是否被修改过
        /** 是否显示坐标 */
        this.isShowCoordinate = false; // 是否显示坐标
        this.BDUtils = null;
        /** 是否显示信息文本 */
        this.isShowInfo = false; // 是否显示信息文本
        /** 孔位错误编码 */
        this.errortags = []; // 孔位错误编码
        let keys = Object.keys(attr);
        this.id = IDCount("Cut");
        keys.forEach(key => {
            //@ts-ignore
            this[key] = attr[key];
        });
        this.BDUtils = BDUtils;
        this.Cut_L = this.addCutLength();
        this.ctx = canvas2d.ctx;
        this.initLabel();
        if (this.NotAuto) {
            this.setNotAuto(this.NotAuto);
        }
        // jeef,增加guid作为识别
        if (!this.guid) {
            this.guid = ObjUtil.guid;
        }
    }
    get showError() {
        return this.errortags.length > 0;
    }
    get errorTxt() {
        return getErrorTxt(this.errortags);
    }
    get(keys) {
        if (typeof keys === "string") {
            keys = [keys];
        }
        //@ts-ignore
        return keys.map(key => { var _a; return (_a = this[key]) === null || _a === void 0 ? void 0 : _a.value; });
    }
    update(attr) {
        if (attr) {
            let noUpadteKeys = [
                "ctx",
                "matrix",
                "isSelected",
                "lengthLabel",
                "hLabel1",
                "hLabel2",
                "vLabel1",
                "vLabel2"
            ];
            for (let key in attr) {
                if (noUpadteKeys.indexOf(key) === -1) {
                    //@ts-ignore
                    this[key] = attr[key];
                }
            }
            this.isEdit = true;
        }
    }
    draw(transMatrix) {
        let scale = transform2d.scale;
        let pos1 = mat2d.transformCoord({ x: this.X.value, y: this.Y.value }, transMatrix);
        let pos2 = mat2d.transformCoord({ x: this.X1.value, y: this.Y1.value }, transMatrix);
        let w = this.Hole_Z.value * scale;
        let ctx = this.ctx;
        this.matrix = transMatrix;
        let points = getLinePointsByWidth(pos1, pos2, w);
        canvas2d.stroke(ctx, () => {
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.lineTo(points[2].x, points[2].y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.closePath();
        }, this.color);
        // 通过一阶贝塞尔公式求直线某段的点
        let t = 1 / 4;
        let x = (1 - t) * pos1.x + t * pos2.x;
        let y = (1 - t) * pos1.y + t * pos2.y;
        if (this.isShowInfo) {
            canvas2d.drawText({
                x,
                y,
                text: this.getShowText(),
                color: this.labelTextColor
            });
        }
        // 画中线虚线
        canvas2d.drawLine(pos1, pos2, "red", true);
    }
    drawLabel(matrix) {
        let w = this.Hole_Z.value;
        let p1 = {
            x: this.X.value,
            y: this.Y.value
        };
        let p2 = {
            x: this.X1.value,
            y: this.Y1.value
        };
        let points = getLinePointsByWidth(p1, p2, w);
        let bound1 = graphUtil.getHCCheckBound(p1, this.Face);
        let bound2 = graphUtil.getHCCheckBound(p2, this.Face);
        // 计算离边界最近的点
        let boundx1 = Math.abs(p1.x - bound1.minx) <= Math.abs(p1.x - bound1.maxx)
            ? bound1.minx
            : bound1.maxx;
        let boundx2 = Math.abs(p2.x - bound2.minx) <= Math.abs(p2.x - bound2.maxx)
            ? bound2.minx
            : bound2.maxx;
        let boundy1 = Math.abs(p1.y - bound1.miny) <= Math.abs(p1.y - bound1.maxy)
            ? bound1.miny
            : bound1.maxy;
        let boundy2 = Math.abs(p2.y - bound2.miny) <= Math.abs(p2.y - bound2.maxy)
            ? bound2.miny
            : bound2.maxy;
        this.hLabel1.update(p1.x, p1.y, boundx1, p1.y);
        if (boundx1 !== boundx2) {
            this.hLabel2.update(p2.x, p2.y, boundx2, p2.y);
        }
        this.vLabel1.update(p1.x, p1.y, p1.x, boundy1);
        if (boundy1 !== boundy2) {
            this.vLabel2.update(p2.x, p2.y, p2.x, boundy2);
        }
        this.lengthLabel.update(points[3].x, points[3].y, points[2].x, points[2].y);
        this.hLabel1.draw(this.ctx, matrix);
        this.hLabel2.draw(this.ctx, matrix);
        this.vLabel1.draw(this.ctx, matrix);
        this.vLabel2.draw(this.ctx, matrix);
        this.lengthLabel.draw(this.ctx, matrix);
    }
    initLabel() {
        // 水平标注
        this.hLabel1 = new Label(0, 0, 0, 0, "");
        this.hLabel2 = new Label(0, 0, 0, 0, "");
        // 垂直标注
        this.vLabel1 = new Label(0, 0, 0, 0, "");
        this.vLabel2 = new Label(0, 0, 0, 0, "");
        // 槽长度标注
        this.lengthLabel = new Label(0, 0, 0, 0, "arrow");
    }
    /** 槽显示的文字 */
    getShowText() {
        var _a, _b;
        let info = `C${(_a = this.Hole_Z) === null || _a === void 0 ? void 0 : _a.value}_${((_b = this.Cutter) === null || _b === void 0 ? void 0 : _b.value) || 0}`;
        if (this.isShowCoordinate) {
            let x = this.X.value;
            let y = this.Y.value;
            info += `(${x},${y})`;
        }
        return info;
    }
    /** 创建孔的绘制路径 */
    createPath(matrix) {
        let ctx = this.ctx;
        ctx.beginPath();
        let scale = transform2d.scale;
        let pos1 = mat2d.transformCoord({ x: this.X.value, y: this.Y.value }, matrix);
        let pos2 = mat2d.transformCoord({ x: this.X1.value, y: this.Y1.value }, matrix);
        let w = this.Hole_Z.value * scale;
        let points = getLinePointsByWidth(pos1, pos2, w);
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);
        ctx.closePath();
    }
    /**  判断点是否在孔的路径内 */
    isPointInPath(matrix, x, y) {
        this.createPath(matrix);
        if (this.ctx.isPointInPath(x, y)) {
            return true;
        }
        else {
            return false;
        }
    }
    /** 转换为bd节点 */
    toBdNode() {
        let keys = [
            "Face",
            "X",
            "Y",
            "X1",
            "Y1",
            "Hole_Z",
            "NotAuto",
            "CutName",
            "Cutter",
            "device"
        ];
        let node = { node: "Cut", attr: {}, children: [] };
        keys.forEach(key => {
            //@ts-ignore
            let value = this[key];
            if (value !== undefined) {
                //@ts-ignore
                node.attr[key] = this[key];
            }
        });
        return node;
    }
    /** 增加槽的宽度 */
    addCutLength() {
        let len = {
            value: 0,
            formula: 0
        };
        if (this.Cut_L && parseFloat(this.Cut_L.value.toString()) > 0)
            return this.Cut_L;
        let x = this.X.value;
        let y = this.Y.value;
        let x1 = this.X1.value;
        let y1 = this.Y1.value;
        if (x === x1 && y !== y1) {
            len.value = Math.abs(y1 - y);
        }
        if (x !== x1 && y === y1) {
            len.value = Math.abs(x1 - x);
        }
        len.formula = len.value;
        return len;
    }
    getBox() {
        let { minx, maxx, miny, maxy } = this.getBound();
        let width = maxx - minx;
        let height = maxy - miny;
        return { minx, maxx, miny, maxy, width, height };
    }
    getBound() {
        let x1 = this.X.value;
        let y1 = this.Y.value;
        let x2 = this.X1.value;
        let y2 = this.Y1.value;
        let d = this.Hole_Z.value / 2;
        let minx, maxx, miny, maxy;
        if (x1 > x2)
            [x1, x2] = [x2, x1];
        if (y1 > y2)
            [y1, y2] = [y2, y1];
        if (x1 != x2 && y1 == y2) {
            minx = x1;
            maxx = x2;
            miny = y1 - d;
            maxy = y2 + d;
        }
        if (x1 == x2 && y1 != y2) {
            miny = y1;
            maxy = y2;
            minx = x1 - d;
            maxx = x1 + d;
        }
        return {
            minx,
            maxx,
            miny,
            maxy
        };
    }
    // 重置颜色
    reColor() {
        if (this.NotAuto && this.NotAuto.value == 1) {
            this.color = 'yellow'; // 蓝色
        }
        else {
            this.color = "#fff";
        }
    }
    setLabelStyle(cfg = {}) {
        this.labelTextColor = (cfg === null || cfg === void 0 ? void 0 : cfg.textColor) || "#0ff";
        this.hLabel1.setStyle(cfg);
        this.hLabel2.setStyle(cfg);
        this.vLabel1.setStyle(cfg);
        this.vLabel2.setStyle(cfg);
        this.lengthLabel.setStyle(cfg);
    }
    // 设置自定义孔属性
    setNotAuto(value) {
        if (value === undefined) {
            this.color = '#fff';
        }
        else {
            if (typeof value === 'object') {
                this.NotAuto = value;
            }
            else {
                this.NotAuto = {
                    formula: value,
                    value: value
                };
            }
        }
        this.reColor();
    }
    // 获取某方向的投影范围
    getRangeByAxisDirection(axisDirection) {
        return getRangeByAxisDirection(this, axisDirection);
    }
    /** 获取开槽方向对应的坐标轴范围  */
    getCutWidthRangeInAxis() {
        let x = this.X.value;
        let y = this.Y.value;
        let x1 = this.X1.value;
        let y1 = this.Y1.value;
        let axis;
        if (x !== x1 && y === y1) {
            // 平行X轴
            let range = this.getRangeByAxisDirection('y');
            axis = "y";
            return {
                axis,
                range
            };
        }
        else if (x === x1 && y !== y1) {
            // 平行Y轴
            let range = this.getRangeByAxisDirection('x');
            axis = "x";
            return {
                axis,
                range
            };
        }
    }
    /** 添加孔位异常编码 */
    addErrortag(tags) {
        if (!Array.isArray(tags)) {
            tags = [tags];
        }
        tags.forEach(tag => {
            if (!this.errortags.includes(tag)) {
                this.errortags.push(tag);
            }
        });
    }
}
// 封边面的相关
class FbViewLabel {
    constructor(ctx, option = {}) {
        /** BD的尺寸 */
        this.size = {
            bl: 0,
            bw: 0,
            bh: 0
        };
        /** 缓存轮廓计算对应封边的节点 */
        this.cacheFbData = {
            graphNodes: null,
            alienRects: null,
            holes: null,
            holeLabels: null,
            cutShapes: null,
            alien: null,
            cut: null
        };
        /** 封边的轮廓 */
        this.fbOutlines = {
            "LR": [],
            "UD": []
        };
        let { bl, bw, bh } = option;
        this.ctx = ctx;
        this.setSize({ bl, bw, bh });
    }
    setSize(size) {
        let oldSize = this.size;
        let { bl = oldSize.bl, bw = oldSize.bw, bh = oldSize.bh } = size;
        this.size = { bl, bw, bh };
    }
    /** 获取BD轮廓的范围 */
    getBox() {
        let { bl, bw } = this.size;
        let minx = 0;
        let miny = 0;
        let maxx = bl;
        let maxy = bw;
        let width = maxx - minx;
        let height = maxy - miny;
        return { minx, miny, maxx, maxy, width, height };
    }
    /** 设置预览数据 */
    setPreviewData(graphNodes, faceANodes, faceBNodes) {
        this.calcuGraph(graphNodes);
        this.calcuHC(faceANodes, faceBNodes);
        bdDecode.updateAllCutCompass(this.cacheFbData.graphNodes);
    }
    draw(matrix, face) {
        this.drawOutline(matrix, face);
        this.drawAlien(matrix, face);
        this.drawHole(matrix, face);
        this.drawHoleLabel(matrix, face);
        this.drawCutSection(matrix, face);
        bdDecode.updateSize(this.size);
        bdDecode.drawFBCutsByCompass(face, matrix);
        bdDecode.isChangeSize = false;
    }
    /** 绘制轮廓 */
    drawOutline(matrix, face) {
        if (["L", "R"].includes(face)) {
            this.fbOutlines.LR.forEach(line => {
                line.draw(matrix);
            });
        }
        else if (["U", "D"].includes(face)) {
            this.fbOutlines.UD.forEach(line => {
                line.draw(matrix);
            });
        }
    }
    /**  绘制水平孔 */
    drawHole(matrix, face) {
        var _a;
        (_a = this.cacheFbData.holes[face]) === null || _a === void 0 ? void 0 : _a.forEach(hole => hole.draw(matrix));
    }
    /** 绘制水平孔标签 */
    drawHoleLabel(matrix, face) {
        var _a;
        (_a = this.cacheFbData.holeLabels[face]) === null || _a === void 0 ? void 0 : _a.forEach(label => label.draw(this.ctx, matrix));
    }
    /** 绘制槽的截面 */
    drawCutSection(matrix, face) {
        var _a;
        (_a = this.cacheFbData.cutShapes[face]) === null || _a === void 0 ? void 0 : _a.forEach(rectShape => rectShape.draw(matrix));
    }
    /** 绘制异形的 */
    drawAlien(matrix, face) {
        let alienRects = this.cacheFbData.alienRects[face];
        if (alienRects) {
            alienRects.forEach(shape => shape.draw(matrix));
        }
    }
    /** 计算轮廓 */
    calcuGraph(list) {
        this.setFbOutline();
        this.setGroupNodes(list);
    }
    /** 计算孔槽 */
    calcuHC(faceAList = [], faceBList = []) {
        let list = [...faceAList, ...faceBList];
        let bholes = list.filter(node => node.node === "BHole");
        let cuts = list.filter(node => node.node === "Cut");
        this.calcuBHoles(bholes);
        this.calcuFbHoleLabels();
        this.calcuCuts(cuts);
    }
    /** 计算孔位 */
    calcuBHoles(holes) {
        let fbHoles = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        let { bh: BH } = this.size;
        holes.forEach(node => {
            let hole = node.getVHoleByBHole({ BH });
            if (hole) {
                hole.FaceV = node.Face;
                fbHoles[hole.Face].push(hole);
                hole.guid = node.guid;
            }
        });
        this.cacheFbData.holes = fbHoles;
    }
    // 计算水平孔的标注
    calcuFbHoleLabels() {
        let holes = this.cacheFbData.holes || {};
        let labels = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        labels.L = this.createHoleLabels(holes.L);
        labels.R = this.createHoleLabels(holes.R);
        labels.U = this.createHoleLabels(holes.U);
        labels.D = this.createHoleLabels(holes.D);
        this.cacheFbData.holeLabels = labels;
    }
    /** 生成水平孔的标注 */
    createHoleLabels(holes) {
        let labels = [];
        holes.forEach(hole => {
            let face = hole.Face;
            let [x, y] = hole.get(["X", "Y"]);
            let [x2, y2] = ["L", "R"].includes(face) ? [0, y] : [x, 0];
            let label = new Label(x, y, x2, y2, "arrow");
            labels.push(label);
        });
        return labels;
    }
    /** 计算槽 */
    calcuCuts(cuts) {
        // 槽侧面显示的矩形图形
        let cutRectShapes = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        let cutList = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        let axisFaces = {
            'x': ["U", "D"],
            'y': ["L", "R"]
        };
        let { bh } = this.size;
        cuts.forEach(cut => {
            let rangeObj = cut.getCutWidthRangeInAxis();
            if (rangeObj) {
                let faces = axisFaces[rangeObj.axis];
                let cutFace = cut.Face;
                let box = cut.getBox();
                let [c_width, c_height] = cut.get(["Hole_Z", "Cutter"]);
                // 字符串转为数字
                c_width *= 1;
                c_height *= 1;
                faces.forEach(face => {
                    let isOver = this.isCutOverOutLine(box, face);
                    let x, y, width, height;
                    if (["L", "R"].includes(face)) {
                        y = box.miny;
                        if (cutFace === "A") {
                            x = 0;
                        }
                        else if (cutFace === "B") {
                            x = bh - c_height;
                        }
                        [width, height] = [c_height, c_width];
                    }
                    else if (["U", "D"].includes(face)) {
                        x = box.minx;
                        if (cutFace === "A") {
                            y = 0;
                        }
                        else if (cutFace === "B") {
                            y = bh - c_height;
                        }
                        [width, height] = [c_width, c_height];
                    }
                    if (width && height) {
                        let data = { x, y, width, height };
                        let option = {
                            isFill: false,
                            isDotted: isOver,
                            style: {
                                strokeStyle: "orange",
                                globalAlpha: 1,
                            },
                            infos: `C${c_width}_${c_height}`,
                            isShowInfo: true
                        };
                        let shape = new RectShape(this.ctx, data, option);
                        cutRectShapes[face].push(shape);
                        // 获取我的数据
                        cutList[face].push(cut);
                    }
                });
            }
        });
        this.cacheFbData.cutShapes = cutRectShapes;
        //整合我的数据
        this.cacheFbData.cut = cutList;
    }
    /** 获取面的尺寸 */
    getFbFaceSize(face) {
        let { bl, bw, bh } = this.size;
        if (["L", "R"].includes(face)) {
            return { w: bh, h: bw };
        }
        else if (["U", "D"].includes(face)) {
            return { w: bl, h: bh };
        }
    }
    /** 设置封边的轮廓 */
    setFbOutline() {
        let that = this;
        let { bl, bw, bh } = this.size;
        let lrPts = [
            { x: 0, y: 0 },
            { x: 0, y: bw },
            { x: bh, y: bw },
            { x: bh, y: 0 },
        ];
        let udPts = [
            { x: 0, y: 0 },
            { x: 0, y: bh },
            { x: bl, y: bh },
            { x: bl, y: 0 },
        ];
        function createFbOutline(pts) {
            let list = pts.map(pt => {
                return {
                    node: "Point",
                    attr: {
                        X: { value: pt.x, formula: pt.x },
                        Y: { value: pt.y, formula: pt.y }
                    }
                };
            });
            return that.createOutlineLines(list);
        }
        this.fbOutlines.LR = createFbOutline(lrPts);
        this.fbOutlines.UD = createFbOutline(udPts);
    }
    /** 按封边分类线条和圆弧 */
    setGroupNodes(nodes) {
        // 对应封边面的Line、Arc、TArc
        let graphNodes = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        // 侧面显示图形
        let alienRects = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        let alien = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        function addNode(directions, node) {
            directions.forEach(d => graphNodes[d].push(node));
        }
        // 初步分类
        nodes.forEach(node => {
            if (node.node === "Line") {
                let type = node.lineType();
                switch (type) {
                    case "横":
                        addNode(["U", "D"], node);
                        break;
                    case "竖":
                        addNode(["L", "R"], node);
                        break;
                    case "斜":
                        addNode(["L", "R", "U", "D"], node);
                        break;
                }
            }
            else if (["Arc", "TArc"].includes(node.node)) {
                addNode(["L", "R", "U", "D"], node);
            }
        });
        // 筛选重叠
        graphNodes.L = this.filterNodeByDirection("L", graphNodes.L);
        graphNodes.R = this.filterNodeByDirection("R", graphNodes.R);
        graphNodes.U = this.filterNodeByDirection("U", graphNodes.U);
        graphNodes.D = this.filterNodeByDirection("D", graphNodes.D);
        for (let face in graphNodes) {
            let targetFace = face;
            let nodes = graphNodes[targetFace];
            let shapes = this.getAlienRects(graphNodes[targetFace], targetFace);
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                let check = this.isAilen(node, targetFace);
                if (check) {
                    alien[targetFace].push(node);
                }
            }
            alienRects[targetFace].push(...shapes);
        }
        this.cacheFbData.alien = alien;
        this.cacheFbData.graphNodes = graphNodes;
        this.cacheFbData.alienRects = alienRects;
    }
    /** 根据方向筛选重叠的节点 */
    filterNodeByDirection(face, nodes) {
        var _a, _b;
        let filterIndexs = []; // 标记过滤掉的节点
        let axisDirection = this.getAxisDirectionByFace(face);
        let length = nodes.length;
        for (let i = 0; i < length; i++) {
            if (filterIndexs.includes(i))
                continue;
            for (let j = i + 1; j < length; j++) {
                if (filterIndexs.includes(j))
                    continue;
                let [min1, max1] = (_a = nodes[i]) === null || _a === void 0 ? void 0 : _a.getRangeByAxisDirection(axisDirection);
                let [min2, max2] = (_b = nodes[j]) === null || _b === void 0 ? void 0 : _b.getRangeByAxisDirection(axisDirection);
                let r = math2d.isRangeOverlap(min1, max1, min2, max2);
                if (r < 0) {
                    let c1 = math2d.getLineCenter(nodes[i].start, nodes[i].end);
                    let c2 = math2d.getLineCenter(nodes[j].start, nodes[j].end);
                    if (face === "L") {
                        if (c1.x <= c2.x) {
                            filterIndexs.push(j);
                        }
                        else {
                            filterIndexs.push(i);
                        }
                    }
                    else if (face === "R") {
                        if (c1.x <= c2.x) {
                            filterIndexs.push(i);
                        }
                        else {
                            filterIndexs.push(j);
                        }
                    }
                    else if (face === "U") {
                        if (c1.y <= c2.y) {
                            filterIndexs.push(i);
                        }
                        else {
                            filterIndexs.push(j);
                        }
                    }
                    else if (face === "D") {
                        if (c1.y <= c2.y) {
                            filterIndexs.push(j);
                        }
                        else {
                            filterIndexs.push(i);
                        }
                    }
                }
            }
        }
        let result = nodes.filter((node, i) => !filterIndexs.includes(i));
        return result;
    }
    /** 创建封边的轮廓的线条 */
    createOutlineLines(pts) {
        let nodes = [];
        for (let i = 0, len = pts.length; i < len; i++) {
            let node = pts[i];
            let nextNode = i === len - 1 ? pts[0] : pts[i + 1];
            nodes.push(new Line(this.ctx, node, nextNode));
        }
        return nodes;
    }
    /** 设置异形的封边截面矩形 */
    getAlienRects(nodes, face) {
        let rectShapes = [];
        nodes.forEach(node => {
            let shape = this.createAlienRectShape(face, node);
            if (shape) {
                rectShapes.push(shape);
            }
        });
        return rectShapes;
    }
    // 获取封边面对应的坐标轴
    getAxisDirectionByFace(face) {
        let posDirectTable = {
            L: "y",
            R: 'y',
            U: 'x',
            D: 'x'
        };
        return posDirectTable[face];
    }
    /** 创建为异形的截面矩形 */
    createAlienRectShape(face, node, attr = {}) {
        let box = node.getBox();
        let { bh } = this.size;
        let x, y, width, height;
        let isAlien = this.isAilen(node, face);
        if (["L", "R"].includes(face)) {
            x = 0;
            y = box.miny;
            width = bh;
            height = box.height;
        }
        else if (["U", "D"].includes(face)) {
            x = box.minx;
            y = 0;
            width = box.width;
            height = bh;
        }
        if (isAlien && width && height) {
            let data = { x, y, width, height };
            let option = {
                style: {
                    fillStyle: node.node === "Line" ? "orange" : "red"
                },
                infos: this.getInfos(node, face),
                isShowInfo: true
            };
            return new RectShape(this.ctx, data, option);
        }
    }
    /** 获取标注信息 */
    getInfos(node, face) {
        let type = node.node;
        let infos = [];
        if (type === "Line") {
            let box = node.getBox();
            let len = 0;
            if (["L", "R"].includes(face)) {
                len = box.height;
            }
            else if (["U", "D"].includes(face)) {
                len = box.width;
            }
            len = math2d.round(len, 2);
            len && infos.push(`L${len}`);
        }
        else if (type === "Arc") {
            infos.push(`R${node.r}`);
        }
        else if (type === "TArc") {
            infos.push(`H${node.h}`);
        }
        return infos;
    }
    /** 判断是否为异形节点 */
    isAilen(node, face) {
        if (['Arc', 'TArc'].includes(node.node)) {
            return true;
        }
        else {
            if (["Line"].includes(node.node) === false)
                return false;
            let { minx: minx1, miny: miny1, maxx: maxx1, maxy: maxy1, type } = node.getBox();
            let { minx: minx2, miny: miny2, maxx: maxx2, maxy: maxy2 } = this.getBox();
            if (type === "斜")
                return true;
            if (face === "L") {
                return !(minx1 === minx2 && miny1 >= miny2 && maxy1 <= maxy2);
            }
            else if (face === "R") {
                return !(maxx1 === maxx2 && miny1 >= miny2 && maxy1 <= maxy2);
            }
            else if (face === "U") {
                return !(maxy1 === maxy2 && minx1 >= minx2 && maxx1 <= maxx2);
            }
            else if (face === "D") {
                return !(miny1 === miny2 && minx1 >= minx2 && maxx1 <= maxx2);
            }
        }
        return false;
    }
    /** 判断槽是否超出范围 */
    isCutOverOutLine(box, face) {
        let { minx, miny, maxx, maxy } = this.getBox();
        if (face === "L") {
            return minx > box.minx;
        }
        else if (face === "R") {
            return maxx < box.maxx;
        }
        else if (face === "U") {
            return maxy < box.maxy;
        }
        else if (face === "D") {
            return miny > box.miny;
        }
    }
    /** 是否显示孔槽的孔位信息 */
    isShowHoleInfo(isShow = false) {
        let faces = ["L", "R", "U", "D"];
        faces.forEach(face => {
            let hcs = this.cacheFbData.holes[face];
            if (hcs) {
                hcs.forEach(hc => {
                    hc.isShowInfo = isShow;
                });
            }
        });
    }
}
/** 板件轮廓 */
class JGraph {
    constructor(ctx, graphObj, bdAttr = {}) {
        this.node = "Graph";
        this.bdAttr = {}; // bd的属性
        this.fbNodesObj = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        this.fbMinAndMaxObj = {
            L: null,
            R: null,
            U: null,
            D: null
        };
        this.ctx = ctx;
        this.children = graphObj.children;
        this.bdAttr = bdAttr;
        this.setNodes(this.children);
        this.getMinAndMax();
    }
    set color(value) {
        this.nodes.forEach(node => {
            node.color = value || "#fff";
        });
    }
    update(curNode) {
        this.changeNearbyNodes(curNode);
        this.setNodes(this.children);
        this.getMinAndMax();
    }
    draw(matrix, face = "AB") {
        function draw(list = []) {
            list.forEach(node => {
                node.draw(matrix);
            });
        }
        switch (face) {
            case "A":
            case "B":
            case "AB":
                draw(this.nodes);
                break;
            default:
                this.fbNodesObj[face];
                break;
        }
    }
    /** 用于绘制导出图片 */
    draw2(ctx, matrix) {
        this.nodes.forEach(node => {
            node.draw2(ctx, matrix);
        });
    }
    /** 绘制纹路 */
    drawGrain(matrix, angle = 0) {
        let middle = mat2d.transformCoord({ x: (this.minx + this.maxx) / 2, y: (this.miny + this.maxy) / 2 }, matrix);
        canvas2d.drawText({
            x: middle.x,
            y: middle.y,
            text: "》》》",
            isCenter: true,
            angle
        });
    }
    getLines(direct) {
        let rules = {
            竖正: "L",
            竖负: "R",
            横正: "U",
            横负: "D"
        };
        let _lines = this.nodes.filter(node => node.node === "Line");
        if (direct) {
            let newLines = _lines.filter(line => {
                let type = line.lineType();
                let direction = graphUtil.getLineDirect(line);
                return direct === rules[type + direction];
            });
            return newLines;
        }
        return _lines;
    }
    /** 创建线段和圆弧对象 */
    createNodes(childs) {
        var _a, _b;
        let nodes = [];
        for (let i = 0, len = childs.length; i < len; i++) {
            let node = childs[i];
            let nextNode = i === len - 1 ? childs[0] : childs[i + 1];
            if (node.node === "Point" && nextNode.node === "Point") {
                nodes.push(new Line(this.ctx, node, nextNode));
            }
            if (node.node == "Arc") {
                nodes.push(new Arc(this.ctx, node));
            }
            if (node.node === "TArc") {
                if ((_b = (_a = node.attr) === null || _a === void 0 ? void 0 : _a.ChordH) === null || _b === void 0 ? void 0 : _b.value) {
                    nodes.push(new TArc(this.ctx, node));
                }
                else if (nextNode.node == "Point") {
                    nodes.push(new Line(this.ctx, node, nextNode));
                }
            }
        }
        return nodes;
    }
    /** 设置线弧实例对象集合 */
    setNodes(childs) {
        this.nodes = this.createNodes(childs);
        this.setFbNodes();
    }
    /** 设置封边的轮廓 */
    setFbNodes() {
        let that = this;
        let { L = 0, W = 0, BH = 0 } = this.bdAttr;
        let l = Number(L);
        let w = Number(W);
        let bh = Number(BH);
        let lrPts = [
            { x: 0, y: 0 },
            { x: 0, y: w },
            { x: bh, y: w },
            { x: bh, y: 0 },
        ];
        let udPts = [
            { x: 0, y: 0 },
            { x: 0, y: bh },
            { x: l, y: bh },
            { x: l, y: 0 },
        ];
        function createFbOutline(pts) {
            let list = pts.map(pt => {
                return {
                    node: "Point",
                    attr: {
                        X: { value: pt.x, formula: pt.x },
                        Y: { value: pt.y, formula: pt.y }
                    }
                };
            });
            return that.createNodes(list);
        }
        this.fbNodesObj.L = createFbOutline(lrPts);
        this.fbNodesObj.R = createFbOutline(lrPts);
        this.fbNodesObj.U = createFbOutline(udPts);
        this.fbNodesObj.D = createFbOutline(udPts);
    }
    /** 获取边界 */
    getRange(nodes = this.children) {
        let minx, maxx, miny, maxy;
        nodes.forEach(node => {
            // 获取轮廓的边界坐标
            if (minx == undefined || minx > node.attr.X.value) {
                minx = node.attr.X.value;
            }
            if (maxx == undefined || maxx < node.attr.X.value) {
                maxx = node.attr.X.value;
            }
            if (miny == undefined || miny > node.attr.Y.value) {
                miny = node.attr.Y.value;
            }
            if (maxy == undefined || maxy < node.attr.Y.value) {
                maxy = node.attr.Y.value;
            }
        });
        return {
            minx,
            maxx,
            miny,
            maxy,
            width: maxx - minx,
            height: maxy - miny
        };
    }
    /** 检测边界是否异常（点超出W和L） */
    checkRangeAbnormal() {
        let { width, height } = this.getRange();
        let { L, W } = this.bdAttr;
        let l = Number(L);
        let w = Number(W);
        return width > l || height > w;
    }
    /** 轮廓 */
    getMinAndMax() {
        let range = this.getRange();
        this.minx = range.minx;
        this.maxx = range.maxx;
        this.miny = range.miny;
        this.maxy = range.maxy;
        // 获取四个封边面的
        for (let face in this.fbNodesObj) {
            let targetFace = face;
            this.fbMinAndMaxObj[targetFace] = this.getFBSideBound(this.fbNodesObj[targetFace]);
        }
    }
    /** 获取边界 */
    getBound(face) {
        if (face) {
            return this.fbMinAndMaxObj[face] || {
                minx: 0,
                maxx: 0,
                miny: 0,
                maxy: 0
            };
        }
        else {
            return {
                minx: this.minx,
                maxx: this.maxx,
                miny: this.miny,
                maxy: this.maxy
            };
        }
    }
    /** 获取封边面的边界 */
    getFBSideBound(lines = []) {
        let minx = null;
        let maxx = null;
        let miny = null;
        let maxy = null;
        lines.forEach(line => {
            let { x1, x2, y1, y2 } = line;
            let [l_minx, l_maxx] = x1 < x2 ? [x1, x2] : [x2, x1];
            let [l_miny, l_maxy] = y1 < y2 ? [y1, y2] : [y2, y1];
            if (minx == null || minx > l_minx) {
                minx = l_minx;
            }
            if (maxx == null || maxx < l_maxx) {
                maxx = l_maxx;
            }
            if (miny == null || miny > l_miny) {
                miny = l_miny;
            }
            if (maxy == null || maxy < l_maxy) {
                maxy = l_maxy;
            }
        });
        return { minx, maxx, miny, maxy };
    }
    /** 重置 */
    reset(children) {
        this.children = children;
        this.setNodes(children);
        this.getMinAndMax();
    }
    /** 缓存当前节点 */
    setCacheNode() {
        this.cacheNode = this.nodes;
    }
    /** 清空缓存 */
    cleanCache() {
        this.cacheNode = null;
    }
    /** 修改相邻的点弧 */
    changeNearbyNodes(curNode) {
        let index = this.children.indexOf(curNode);
        if (index > -1 && this.children.length > 2) {
            let preIndex = index === 0 ? this.children.length - 1 : index - 1;
            let nextIndex = index === this.children.length - 1 ? 0 : index + 1;
            let preNode = this.children[preIndex];
            let nextNode = this.children[nextIndex];
            if (curNode.node === "TArc") {
                if (preNode.node === "Point") {
                    this.syncNodeAttr([
                        ["X", "X"],
                        ["Y", "Y"]
                    ], preNode, curNode);
                }
                if (nextNode.node === "Point" || nextNode.node === "Arc") {
                    this.syncNodeAttr([
                        ["X", "X2"],
                        ["Y", "Y2"]
                    ], nextNode, curNode);
                }
            }
            else if (curNode.node === "Point") {
                if (preNode.node === "TArc") {
                    this.syncNodeAttr([
                        ["X2", "X"],
                        ["Y2", "Y"]
                    ], preNode, curNode);
                }
                if (nextNode.node === "TArc" || nextNode.node === "Arc") {
                    this.syncNodeAttr([
                        ["X", "X"],
                        ["Y", "Y"]
                    ], nextNode, curNode);
                }
            }
            else if (curNode.node === "Arc") {
                if (preNode.node === "TArc" || preNode.node === "Point") {
                    this.syncNodeAttr([
                        ["X", "X"],
                        ["Y", "Y"]
                    ], preNode, curNode);
                }
            }
        }
    }
    /** 同步属性 */
    syncNodeAttr(attrNames, targetNode, sourceNode) {
        attrNames.forEach(names => {
            targetNode.attr[names[0]].formula = sourceNode.attr[names[1]].formula;
            targetNode.attr[names[0]].value = sourceNode.attr[names[1]].value;
        });
    }
    /** 设置标注的样式 */
    setLabelStyle(cfg) {
        this.nodes.forEach(node => node.setLabelStyle(cfg));
    }
    /** 获取轮廓的离散点 */
    getPoints(cfg) {
        let points = [];
        this.nodes.forEach((node, i) => {
            //@ts-ignore
            let pts = node.getPoints(cfg);
            points.push(...pts);
        });
        // points = points.filter((p,i,arr)=>{
        // })
        return points;
    }
}
/** 孔 */
class Hole {
    constructor(attr, faceType, BDUtils) {
        /** 自定义孔类型。1表示普通孔，2表示由孔位规则生成的孔 */
        this.holeType = 1; // 自定义孔类型。1表示普通孔，2表示由孔位规则生成的孔
        /** 孔轮廓的颜色 */
        this.color = "#fff"; // 孔轮廓的颜色
        /** 文字标注的颜色 */
        this.labelTextColor = "#0ff"; // 文字标注的颜色
        /** 是否被编辑过或是新增的 */
        this.isEdit = false; // 是否被编辑过或是新增的
        /** 是否显示坐标 */
        this.isShowCoordinate = false; // 是否显示坐标
        this.BDUtils = null;
        /** 孔是否设置了区间 */
        this.isSetHoleRange = false; // 孔是否设置了区间
        /** 是否显示信息文本 */
        this.isShowInfo = false; // 是否显示信息文本
        /** 满足区间的属性名称，用于禁用属性编辑 */
        this.rangeKeyNames = []; // 满足区间的属性名称，用于禁用属性编辑
        this.FaceType = "";
        this.HoleName = "";
        this.defalutKeys = [
            "Face",
            "HDirect",
            "Hole_Z",
            "R",
            "Rb",
            "X",
            "Y",
            "Hole_Xcap",
            "Holenum_X",
            "Hole_Ycap",
            "Holenum_Y",
            "X1",
            "Hole_D",
            "NotAuto",
            "Rtype",
            "Rdepth",
            "X1depth",
            "Rule",
            "HoleName",
            "FaceType",
            "NotStandard",
            "PKNum",
            "PKCap"
        ];
        /** 是否显示 */
        this.isShow = true; // 是否显示
        /** 关联孔位规则的ID */
        this.holeCfgId = ''; // 关联孔位规则的ID
        /** 孔位错误编码 */
        this.errortags = []; // 孔位错误编码
        let keys = Object.keys(attr);
        this.id = IDCount("Hole");
        this.ctx = canvas2d.ctx;
        this.BDUtils = BDUtils;
        keys.forEach(key => {
            //@ts-ignore
            if (this.defalutKeys.indexOf(key) > -1) {
                let value = attr[key] || '';
                if (typeof value === 'object' || ['Face'].includes(key)) {
                    //@ts-ignore
                    this[key] = attr[key] || "";
                }
                else {
                    let v = this.BDUtils.calcFormula(value, key);
                    //@ts-ignore
                    this[key] = {
                        value: v,
                        formula: value
                    };
                }
            }
        });
        if (!this.Hole_D) {
            this.Hole_D = this.setHoleD();
        }
        this.resetAttrByRule();
        this.drawNodes = this.getDrawNodes();
        this.node = faceType;
        if (!this.Rtype && faceType) {
            this.Rtype = {
                formula: faceType === "VHole" ? "C" : "L",
                value: faceType === "VHole" ? "C" : "L"
            };
        }
        // 补充缺失的属性
        let attrList = nodeAttr[faceType];
        if (attrList) {
            attrList.forEach(item => {
                let key = item[0];
                let defaultValue = item[2] || "";
                //@ts-ignore
                if (!this[key]) {
                    //@ts-ignore
                    this[key] = {
                        formula: defaultValue,
                        value: defaultValue
                    };
                }
            });
        }
        if (this.NotAuto)
            this.setNotAuto(this.NotAuto);
        // jeef,增加guid作为识别
        if (!this.guid) {
            this.guid = ObjUtil.guid;
        }
    }
    get showError() {
        return this.errortags.length > 0;
    }
    get errorTxt() {
        return getErrorTxt(this.errortags);
    }
    get(keys) {
        if (typeof keys === "string") {
            keys = [keys];
        }
        //@ts-ignore
        return keys.map(key => { var _a; return (_a = this[key]) === null || _a === void 0 ? void 0 : _a.value; });
    }
    update(attr) {
        if (attr) {
            for (let key in attr) {
                if (key != "ctx") {
                    //@ts-ignore
                    this[key] = attr[key];
                }
            }
        }
        this.isEdit = true;
        this.resetAttrByRule();
        this.drawNodes = this.getDrawNodes();
    }
    draw(transMatrix) {
        if (this.isShow) {
            if (transMatrix)
                this.matrix = transMatrix;
            this.drawHoles();
        }
    }
    drawLabel() { }
    /** 绘制多个孔 */
    drawHoles() {
        let num_X = parseFloat(this.Holenum_X.value.toString());
        let num_Y = parseFloat(this.Holenum_Y.value.toString());
        let xcap = parseFloat(this.Hole_Xcap.value.toString());
        let ycap = parseFloat(this.Hole_Ycap.value.toString());
        let holePoints = getIntervalHoles(this.X.value, this.Y.value, num_X, xcap, num_Y, ycap, this.HDirect.value);
        holePoints.forEach((p, i) => {
            this.drawHole(p.offsetX, p.offsetY, i === 0 ? true : false);
        });
    }
    /** 绘制孔 */
    drawHole(offsetX, offsetY, isShowText) {
        let scale = transform2d.scale;
        let isMoveTo = true;
        let arc;
        let vm = this;
        canvas2d.stroke(vm.ctx, () => {
            vm.drawNodes.forEach(node => {
                let pos = mat2d.transformCoord({
                    x: node.x + offsetX,
                    y: node.y + offsetY
                }, vm.matrix);
                if (node.type === "Point") {
                    if (isMoveTo) {
                        vm.ctx.moveTo(pos.x, pos.y);
                        isMoveTo = false;
                    }
                    else {
                        vm.ctx.lineTo(pos.x, pos.y);
                    }
                }
                else if (node.type === "Arc") {
                    let r = (node.R * scale) / 2;
                    let offsetX = 1 * scale;
                    arc = {
                        x: pos.x,
                        y: pos.y,
                        r: r
                    };
                    isMoveTo = true;
                    vm.ctx.moveTo(pos.x + r, pos.y);
                    vm.ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
                    if (this.isShowInfo && isShowText) {
                        canvas2d.drawText({
                            x: pos.x + offsetX,
                            y: pos.y,
                            text: this.getShowText(),
                            color: this.labelTextColor
                        });
                    }
                }
                else if (node.type === "center" && this.isShowInfo && isShowText) {
                    canvas2d.drawText({
                        x: pos.x,
                        y: pos.y,
                        text: this.getShowText(),
                        color: this.labelTextColor
                    });
                }
            });
        }, vm.color);
        if (arc) {
            vm.drawDiameterLine(arc.x, arc.y, arc.r);
        }
    }
    /** 根据插入点坐标，水平孔方向和水平孔深度获取绘制的点弧 */
    getDrawNodes() {
        var _a, _b;
        let drawNodes = [];
        let arc;
        let cx = Number(this.X.value);
        let cy = Number(this.Y.value);
        let r;
        let center = {
            type: "center",
            x: cx,
            y: cy
        };
        let HDirect = (_a = this.HDirect) === null || _a === void 0 ? void 0 : _a.value;
        let hole_d = parseFloat(this.Hole_D.value.toString());
        let range = {
            minx: cx - hole_d,
            maxx: cx + hole_d,
            miny: cy - hole_d,
            maxy: cy + hole_d
        };
        let temp = {
            type: "Point",
            x: cx,
            y: cy
        };
        let p1 = copyObject(temp);
        let p2 = copyObject(temp);
        let p3 = copyObject(temp);
        let p4 = copyObject(temp);
        if (this.R.value > 0) {
            r = this.R.value / 2;
            arc = {
                type: "Arc",
                R: this.R.value,
                x: cx,
                y: cy
            };
        }
        else {
            let rb = ((_b = this.Rb) === null || _b === void 0 ? void 0 : _b.value) || 0;
            r = rb / 2;
            center.Rb = rb;
        }
        if (HDirect) {
            if (HDirect === "L" || HDirect === "R") {
                p2.y += r;
                p3.y -= r;
                p1.y = p2.y;
                p4.y = p3.y;
                if (HDirect === "L") {
                    p1.x = p4.x = range.minx;
                }
                else {
                    p1.x = p4.x = range.maxx;
                }
            }
            if (HDirect === "U" || HDirect === "D") {
                p2.x += r;
                p3.x -= r;
                p1.x = p2.x;
                p4.x = p3.x;
                if (HDirect === "U") {
                    p1.y = p4.y = range.maxy;
                }
                else {
                    p1.y = p4.y = range.miny;
                }
            }
            if (arc) {
                drawNodes = [p1, p2, arc, p3, p4];
            }
            else {
                drawNodes = [p1, p2, center, p3, p4];
            }
        }
        else {
            arc && drawNodes.push(arc);
        }
        return drawNodes;
    }
    /** 绘制圆弧内的直线 */
    drawDiameterLine(cx, cy, r) {
        canvas2d.stroke(this.ctx, () => {
            if (this.node === "BHole") {
                this.drawLine(cx, cy, r, -45);
                this.ctx.strokeStyle = "#0f0";
            }
            if (this.node === "VHole") {
                this.drawLine(cx, cy, r, 0);
                this.drawLine(cx, cy, r, 90);
            }
        }, this.color);
    }
    /** 孔显示的文字 */
    getShowText() {
        var _a, _b, _c;
        let info = "";
        if ((_a = this.R) === null || _a === void 0 ? void 0 : _a.value) {
            info = `V${(_b = this.R) === null || _b === void 0 ? void 0 : _b.value}_${((_c = this.Rdepth) === null || _c === void 0 ? void 0 : _c.value) || 0}`;
            if (this.isShowCoordinate) {
                let x = this.X.value;
                let y = this.Y.value;
                info += `(${x},${y})`;
            }
        }
        return info;
    }
    /** 绘制线 */
    drawLine(cx, cy, r, angle) {
        let offsetX = r * Math.cos(math2d.toRads(angle));
        let offsetY = r * Math.sin(math2d.toRads(angle));
        let fromX = cx + offsetX;
        let fromY = cy + offsetY;
        let toX = cx - offsetX;
        let toY = cy - offsetY;
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
    }
    /** 创建孔的绘制路径 */
    createPath(matrix) {
        let ctx = this.ctx;
        ctx.beginPath();
        for (let i = 0; i < this.drawNodes.length; i++) {
            let node = this.drawNodes[i];
            let pos = mat2d.transformCoord({
                x: node.x,
                y: node.y
            }, matrix);
            if (i === 0) {
                ctx.moveTo(pos.x, pos.y);
            }
            if (node.type === "Point") {
                ctx.lineTo(pos.x, pos.y);
            }
            if (node.type === "Arc") {
                let r = (node.R / 2) * transform2d.scale;
                ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
            }
        }
    }
    /** 判断点是否在孔的路径内 */
    isPointInPath(matrix, x, y) {
        this.createPath(matrix);
        if (this.ctx.isPointInPath(x, y)) {
            return true;
        }
        else {
            return false;
        }
    }
    /** 转换为bd节点 */
    toBdNode() {
        let node = {
            node: this.node,
            attr: {},
            children: []
        };
        this.defalutKeys.forEach(key => {
            //@ts-ignore
            let value = this[key];
            if (value) {
                //@ts-ignore
                node.attr[key] = value;
            }
        });
        if (this.Hole_D) {
            //@ts-ignore
            node.attr["Rbdepth"] = this.Hole_D.value;
        }
        return node;
    }
    // 获取孔的边界
    getBound() {
        let xs = [];
        let ys = [];
        this.drawNodes.forEach(node => {
            if (node.type === "Point") {
                xs.push(node.x);
                ys.push(node.y);
            }
            if (node.type === "Arc") {
                let r = node.R / 2;
                xs.push(node.x - r, node.x + r);
                ys.push(node.y - r, node.y + r);
            }
        });
        xs.sort(compareNumbers);
        ys.sort(compareNumbers);
        return {
            minx: xs[0],
            maxx: xs.pop(),
            miny: ys[0],
            maxy: ys.pop()
        };
    }
    // 设置水平孔深度
    setHoleD() {
        var _a;
        let direct = (_a = this.HDirect) === null || _a === void 0 ? void 0 : _a.value;
        let p = {
            x: this.X.value,
            y: this.Y.value
        };
        let lines = graphUtil.getLines(direct);
        let len = 0;
        lines.forEach(line => {
            let res = graphUtil.isPointInLineRange(p, line);
            let p1 = getPoint(line.p1);
            if (res) {
                let dist;
                if (direct === "L")
                    dist = p.x - p1.x;
                if (direct === "R")
                    dist = p1.x - p.x;
                if (direct === "U")
                    dist = p1.y - p.y;
                if (direct === "D")
                    dist = p.y - p1.y;
                if (dist && dist > 0) {
                    if (len === 0 || len > dist)
                        len = dist;
                }
            }
        });
        let holeD = hgBDDefault.holeD; // 默认水平孔深度
        if (len) {
            holeD = len;
        }
        return {
            value: holeD,
            formula: holeD
        };
    }
    // 重置颜色
    reColor() {
        if (this.NotAuto && this.NotAuto.value == 1) {
            this.color = 'yellow'; // 蓝色
        }
        else {
            this.color = "#fff";
        }
    }
    setLabelStyle(cfg = {}) {
        this.labelTextColor = cfg.textColor || "#0ff";
    }
    // 根据孔位区间规则重置孔的属性
    resetAttrByRule() {
        this.isSetHoleRange = false;
        this.rangeKeyNames = [];
        this.isShow = true;
        function getAttr(ranges = [], l = 0, w = 0) {
            let range = ranges.filter(range => {
                let min = Number(range.Min);
                let max = Number(range.Max);
                let align = range.HoleAlign;
                let length = align === "L" ? l : w;
                return min <= length && max >= length;
            })[0];
            if (range) {
                return range;
            }
        }
        let ranges = this.getHoleRanges();
        if (ranges) {
            let l = Number(this.BDUtils.data.attr.L || 0);
            let w = Number(this.BDUtils.data.attr.W || 0);
            let attr = getAttr(ranges, l, w);
            if (attr) {
                let keys = Object.keys(attr);
                for (let key of keys) {
                    //@ts-ignore
                    if (this[key]) {
                        this.rangeKeyNames.push(key);
                        //@ts-ignore
                        this[key] = {
                            formula: attr[key],
                            value: this.BDUtils.calcFormula(attr[key], key)
                        };
                    }
                }
                this.calcuHole(l, w);
                this.isSetHoleRange = true;
            }
            else {
                this.isShow = false;
            }
        }
    }
    // 计算孔间距
    calcuHole(l, w) {
        // X方向孔间距
        this.Hole_Xcap.value = calcHoleCapFormula(this.Hole_Xcap.value, this.Holenum_X.value, l, this.X.value);
        // Y方向孔间距
        this.Hole_Ycap.value = calcHoleCapFormula(this.Hole_Ycap.value, this.Holenum_Y.value, w, this.Y.value);
    }
    // 获取孔位区间属性
    getHoleRanges() {
        var _a, _b;
        return (_a = this.BDUtils) === null || _a === void 0 ? void 0 : _a.getHoleRange((_b = this.Rule) === null || _b === void 0 ? void 0 : _b.value);
    }
    // 设置孔位区间属性
    setHoleRanges(ranges) {
        var _a, _b;
        // 没有Rule属性，同时配置了孔位间距，则自动生成Rule的值
        if (!((_a = this.Rule) === null || _a === void 0 ? void 0 : _a.value) && ranges.length > 0) {
            let guid = ObjUtil.guid;
            this.Rule = {
                formula: guid,
                value: guid
            };
        }
        let ruleId = (_b = this.Rule) === null || _b === void 0 ? void 0 : _b.value;
        if (ruleId) {
            if (!this.BDUtils.holeRules) {
                this.BDUtils.holeRules = {};
            }
            this.BDUtils.holeRules[ruleId] = {
                node: "Rule",
                attr: {
                    Id: ruleId
                },
                children: ranges.map(range => {
                    // 删除空字符的属性
                    for (let key in range) {
                        let value = range[key];
                        if (value === "" || value === undefined) {
                            delete range[key];
                        }
                    }
                    return {
                        node: "Range",
                        children: [],
                        attr: range
                    };
                })
            };
        }
        this.resetAttrByRule();
    }
    // 删除
    delete() {
        var _a;
        let ruleId = (_a = this.Rule) === null || _a === void 0 ? void 0 : _a.value;
        if (ruleId && this.BDUtils && this.BDUtils.holeRules) {
            delete this.BDUtils.holeRules[ruleId];
        }
    }
    // 设置自定义孔属性
    setNotAuto(value) {
        if (value === undefined) {
            this.color = '#fff';
        }
        else {
            if (typeof value === 'object') {
                this.NotAuto = value;
            }
            else {
                this.NotAuto = {
                    formula: value,
                    value: value
                };
            }
        }
        this.reColor();
    }
    // 若为大饼孔，则生成封边面的水平孔（垂直孔）
    getVHoleByBHole(option = {}) {
        let bh = option.BH;
        if (this.node === "BHole") {
            let hole_z = this.Hole_Z.value;
            let face = this.HDirect.value;
            let x = this.X.value;
            let y = this.Y.value;
            if (!face) {
                console.warn(`大饼孔缺失HDirect属性`);
            }
            // 不旋转的情况：
            // let table = {
            //   L: [bh - hole_z, y],
            //   R: [hole_z, y],
            //   U: [x, hole_z],
            //   D: [x, bh - hole_z]
            // }
            // 旋转为水平摆放的情况：
            let table = {
                L: [hole_z, y],
                R: [hole_z, y],
                U: [x, hole_z],
                D: [x, hole_z]
            };
            let pos = table[face];
            let hole = {
                node: "VHole",
                attr: {
                    Face: face,
                    X: pos[0],
                    Y: pos[1],
                    R: this.Rb.value,
                    Rdepth: this.Hole_D.value,
                    Rtype: "C",
                    HDirect: "",
                    Rb: 0
                }
            };
            return new Hole(hole.attr, "VHole", this.BDUtils);
        }
    }
    // 添加孔位异常编码
    addErrortag(tags) {
        if (!Array.isArray(tags)) {
            tags = [tags];
        }
        tags.forEach(tag => {
            if (!this.errortags.includes(tag)) {
                this.errortags.push(tag);
            }
        });
    }
}
/** 标注 */
class Label {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, type, isDrawParallLine = true) {
        /** 线段标注到图形的距离 */
        this.d = 20; // 线段标注到图形的距离
        /** 文本背景的高度 */
        this.textH = 16; // 文本背景的高度
        this.textSize = 12;
        /** 标注文字的背景颜色 */
        this.textBgColor = "#282823"; // 标注文字的背景颜色
        /** 标注代表的长度 */
        this.len = 0; // 标注代表的长度
        /** 标注的颜色 */
        this.color = "#0f0"; // 标注的颜色
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = type;
        this.isDrawParallLine = isDrawParallLine; // 是否绘制两端短线
    }
    update(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw(ctx, transMatrix) {
        if (this.x1 === this.x2 && this.y1 === this.y2)
            return;
        let p1 = mat2d.transformCoord({ x: this.x1, y: this.y1 }, transMatrix);
        let p2 = mat2d.transformCoord({ x: this.x2, y: this.y2 }, transMatrix);
        let len = math2d.getLineLength(this.x1, this.y1, this.x2, this.y2);
        if (this.type === "arrow") {
            let pos = math2d.getParallelLinePoints(p1, p2, this.d);
            let pos1 = { x: pos.x1, y: pos.y1 };
            let pos2 = { x: pos.x2, y: pos.y2 };
            canvas2d.drawCrossLine(pos1, pos2, this.color, this.isDrawParallLine);
            this.drawText(ctx, pos1.x, pos1.y, pos2.x, pos2.y, this.type, len);
        }
        else {
            canvas2d.drawCrossLine(p1, p2, this.color, this.isDrawParallLine);
            this.drawText(ctx, p1.x, p1.y, p2.x, p2.y, this.type, len);
        }
    }
    /** 绘制文本 */
    drawText(ctx, fromX, fromY, toX, toY, type, len) {
        let centerX = (fromX + toX) / 2;
        let centerY = (fromY + toY) / 2;
        let text;
        let showLen = Number.isInteger(len) ? len : len.toFixed(1); // 显示的长度值
        this.len = Number(len.toFixed(4));
        ctx.font = `${this.textSize}px Arial`;
        if (type === "cross") {
            text = "R" + showLen;
        }
        else if (type === "TArc") {
            text = "H" + showLen;
        }
        else {
            text = showLen;
        }
        this.textW = ctx.measureText(text.toString()).width + 6;
        this.textX = centerX - this.textW / 2;
        this.textY = centerY - 8;
        ctx.save();
        // 绘制文字背景
        if (this.textBgColor) {
            ctx.beginPath();
            ctx.rect(this.textX, this.textY, this.textW, this.textH);
            ctx.fillStyle = this.textBgColor;
            ctx.fill();
            ctx.closePath();
        }
        // 绘制文字
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.textColor || "#0ff";
        ctx.fillText(text.toString(), centerX, centerY);
        ctx.restore();
    }
    /** 检测鼠标是否在标注文本上 */
    isPointInText(x, y) {
        if (x >= this.textX && x <= this.textX + this.textW) {
            if (y >= this.textY && y <= this.textY + 16) {
                return true;
            }
        }
        return false;
    }
    drawLineLabel(ctx, matrix, points) {
        this.x1 = points[0];
        this.y1 = points[1];
        this.x2 = points[2];
        this.y2 = points[3];
        this.type = "arrow";
        this.draw(ctx, matrix);
    }
    /** 获取文本的位置和大小 */
    getTextRect() {
        return {
            x: this.textX,
            y: this.textY,
            w: this.textW,
            h: this.textH
        };
    }
    /** 设置标注的样式 */
    setStyle(cfg = {}) {
        let { textBgColor = "#282823", textColor = "#0ff", color = "#0f0" } = cfg;
        this.textBgColor = textBgColor;
        this.textColor = textColor;
        this.color = color;
    }
}
// 线
class Line {
    constructor(ctx, p1, p2) {
        this.node = "Line";
        /** 线段的颜色 */
        this.color = "#fff"; // 线段的颜色
        /** 是否显示线段中心 */
        this.showCenter = false; // 是否显示线段中心
        /** 中心点的半径 */
        this.centerR = 3; // 中心点的半径
        this.showPoint = { p1: false, p2: false };
        /** 长度取小数点位数 */
        this.toFixNum = 1;
        this.ctx = ctx;
        this.p1 = p1;
        this.p2 = p2;
        this.setCoordinate();
        this.angle = this.getAngle();
        // this.len = Number(this.getLineLength().toFixed(this.toFixNum)) * 1
        this.len = this.getLineLength();
        this.label = this.initLabel();
        // jeef,增加guid
        this.guid = ObjUtil.guid;
    }
    get start() {
        return { x: this.x1, y: this.y1 };
    }
    get end() {
        return { x: this.x2, y: this.y2 };
    }
    // 获取某方向的投影范围
    getRangeByAxisDirection(axisDirection) {
        return getRangeByAxisDirection(this, axisDirection);
    }
    draw(matrix) {
        this.beforeDraw();
        this.drawLine(this.ctx, matrix);
        this.drawCenter(matrix);
        this.drawLinePoints(matrix);
        this.label.draw(this.ctx, matrix);
    }
    /** 用于绘制导出图片 */
    draw2(ctx, matrix) {
        let color = this.color;
        this.color = "red";
        this.beforeDraw();
        this.drawLine(ctx, matrix);
        this.color = color;
    }
    beforeDraw() {
        this.updateLabel();
        this.updateLen();
    }
    /** 设置线段两点的坐标 */
    setCoordinate() {
        this.x1 = this.p1.attr.X.value;
        this.y1 = this.p1.attr.Y.value;
        this.x2 = this.p2.attr.X.value;
        this.y2 = this.p2.attr.Y.value;
    }
    /** 获取线的包围盒 */
    getBox() {
        let [minx, maxx] = [this.x1, this.x2];
        let [miny, maxy] = [this.y1, this.y2];
        if (minx > maxx) {
            [minx, maxx] = [this.x2, this.x1];
        }
        if (miny > maxy) {
            [miny, maxy] = [this.y2, this.y1];
        }
        let width = maxx - minx;
        let length = maxy - miny;
        let type = '';
        if (width > 0 && length == 0) {
            type = '竖';
        }
        else if (width === 0 && length > 0) {
            type = '横';
        }
        else if (width > 0 && length > 0) {
            type = '斜';
        }
        return {
            type,
            minx,
            miny,
            maxx,
            maxy,
            width,
            length,
            height: length
        };
    }
    /** 获取线段的角度 */
    getAngle() {
        return math2d.lineAngle(this.x1, this.y1, this.x2, this.y2);
    }
    /** 获取线段的中心点 */
    getCenter() {
        let p1 = getPoint(this.p1);
        let p2 = getPoint(this.p2);
        return math2d.getLineCenter(p1, p2);
    }
    /** 画线 */
    drawLine(ctx, matrix) {
        let p1 = mat2d.transformCoord(getPoint(this.p1), matrix);
        let p2 = mat2d.transformCoord(getPoint(this.p2), matrix);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
    }
    /** 画线段中心 */
    drawCenter(matrix) {
        if (this.showCenter) {
            this.drawPoint(this.getCenter(), this.centerR, matrix);
        }
    }
    /** 画线的两端点 */
    drawLinePoints(matrix) {
        if (this.showPoint.p1)
            this.drawPoint(getPoint(this.p1), 3, matrix);
        if (this.showPoint.p2)
            this.drawPoint(getPoint(this.p2), 3, matrix);
    }
    /** 画点 */
    drawPoint(p, r, matrix) {
        let _p = mat2d.transformCoord(p, matrix);
        canvas2d.drawCircular(this.ctx, _p.x, _p.y, r, '#3b8ce0', '#3b8ce0');
    }
    /** 初始化标注 */
    initLabel() {
        return new Label(this.x2, this.y2, this.x1, this.y1, "arrow");
    }
    /** 更新标注 */
    updateLabel() {
        this.setCoordinate();
        this.label.update(this.x2, this.y2, this.x1, this.y1);
    }
    /** 获取线段边界的顶点 */
    getBoundPoints(matrix) {
        this.setCoordinate();
        let w = 4;
        let points;
        let d = w / 2;
        let p1 = mat2d.transformCoord({ x: this.x1, y: this.y1 }, matrix);
        let p2 = mat2d.transformCoord({ x: this.x2, y: this.y2 }, matrix);
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        // 垂直线段
        if (x1 === x2 && y1 !== y2) {
            points = [
                { x: x1 - d, y: y1 },
                { x: x1 + d, y: y1 },
                { x: x2 + d, y: y2 },
                { x: x2 - d, y: y2 }
            ];
        }
        // 水平线段
        if (y1 === y2 && x1 !== x2) {
            points = [
                { x: x1, y: y1 + d },
                { x: x1, y: y1 - d },
                { x: x2, y: y2 - d },
                { x: x2, y: y2 + d }
            ];
        }
        // 斜线
        if (y1 !== y2 && x1 !== x2) {
            let p1 = { x: x1, y: y1 };
            let p2 = { x: x2, y: y2 };
            let pos = math2d.getParallelLinePoints(p1, p2, 5, 2);
            points = [
                { x: pos.x1, y: pos.y1 },
                { x: pos.x2, y: pos.y2 },
                { x: pos.x3, y: pos.y3 },
                { x: pos.x4, y: pos.y4 }
            ];
        }
        return points;
    }
    /** 改变线段样式 */
    changeLineStyle(inLine) {
        if (inLine) {
            this.color = "#e64072";
        }
        else {
            this.color = "#fff";
        }
    }
    /** 显示中心点 */
    changeCenterStyle(inLine, inCenter) {
        if (inLine) {
            this.showCenter = true;
            if (inCenter) {
                this.centerR = 5;
                canvas2d.setCursor("pointer");
            }
            else {
                this.centerR = 3;
                canvas2d.setCursor("default");
            }
        }
        else {
            this.showCenter = false;
        }
    }
    /** 是否在直线上 */
    isInLine(x, y, matrix) {
        if (this.len <= 1)
            return false; // 线段的长度小于等于1时，就不再新增点
        let points = this.getBoundPoints(matrix);
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        if (this.ctx.isPointInPath(x, y)) {
            return true;
        }
        else {
            return false;
        }
    }
    /** 是否在中心点上 */
    isInCenterPoint(x, y, matrix) {
        if (this.len <= 1)
            return false;
        let center = mat2d.transformCoord(this.getCenter(), matrix);
        let dist = math2d.getLineLength(center.x, center.y, x, y);
        return dist <= this.centerR;
    }
    updateLen() {
        // this.len = Math.round(this.getLineLength());
        // this.len = Number(this.getLineLength().toFixed(this.toFixNum))*1
        this.len = this.getLineLength();
    }
    /** 线段的长 */
    getLineLength() {
        let p1 = getPoint(this.p1);
        let p2 = getPoint(this.p2);
        return math2d.getLineLength(p1.x, p1.y, p2.x, p2.y);
    }
    /** 判断是横线还是竖线 */
    lineType() {
        this.setCoordinate();
        if (this.x1 !== this.x2 && this.y1 === this.y2) {
            return "横";
        }
        else if (this.x1 === this.x2 && this.y1 !== this.y2) {
            return "竖";
        }
        else {
            return "斜";
        }
    }
    /** 设置标注的样式 */
    setLabelStyle(cfg) {
        this.label.setStyle(cfg);
    }
    /** 获取点 */
    getPoints(cfg) {
        if (cfg) {
            let x1 = calcFormula(this.p1.attr.X.formula, cfg);
            let y1 = calcFormula(this.p1.attr.Y.formula, cfg);
            let x2 = calcFormula(this.p2.attr.X.formula, cfg);
            let y2 = calcFormula(this.p2.attr.Y.formula, cfg);
            return [
                { x: x1, y: y1 },
                { x: x2, y: y2 }
            ];
        }
        return [
            { x: this.x1, y: this.y1 },
            { x: this.x2, y: this.y2 }
        ];
    }
}
class Path2DX {
    constructor(attr) {
        this.node = 'Path';
        this.X = { formula: 0, value: 0 };
        this.Y = { formula: 0, value: 0 };
        this.IsFill = { formula: '0', value: '0' };
        this.d = ''; // 路径
        this.ds = null; // 解析d属性得到的数据，用于绘制路径
        this.Face = '';
        this.color = '#fff';
        this.KeyName = '';
        this.filterKeys = ['ds', 'color', 'isShowLabel', 'filterKeys', 'ctx', 'id', 'node'];
        this.ctx = canvas2d.ctx;
        this.id = IDCount('Path');
        this.update(attr);
    }
    setAttr(attr) {
        let filter = ['name', 'd', 'Face', 'color', 'ctx', 'ds', 'filterKeys', 'node', 'id', "KeyName"];
        for (let key in attr) {
            // 做兼容处理
            if (attr[key] && hasProperty(attr[key], 'formula')) {
                if (filter.indexOf(key) > -1) {
                    //@ts-ignore
                    this[key] = attr[key].formula;
                }
                else {
                    //@ts-ignore
                    this[key] = attr[key];
                }
            }
            else {
                if (filter.indexOf(key) > -1) {
                    //@ts-ignore
                    this[key] = attr[key];
                }
                else {
                    //@ts-ignore
                    this[key] = {
                        value: attr[key],
                        formula: attr[key]
                    };
                }
            }
        }
    }
    update(attr) {
        if (attr) {
            this.setAttr(attr);
        }
        this.ds = this.parsePathD(this.d);
    }
    createPath(ctx, matrix) {
        ctx.beginPath();
        for (let list of this.ds) {
            for (let node of list) {
                if (node.type === 'arc') {
                    let center = mat2d.transformCoord({ x: this.X.value + node.center.x, y: this.Y.value + node.center.y }, matrix);
                    let r = node.radius * transform2d.scale;
                    ctx.arc(center.x, center.y, r, node.startAngle, node.endAngle, node.isCounterClockwise);
                }
                else if (node.type === 'point') {
                    let pos = mat2d.transformCoord({ x: this.X.value + node.x, y: this.Y.value + node.y }, matrix);
                    if (node.isFirstPoint)
                        ctx.moveTo(pos.x, pos.y);
                    else
                        ctx.lineTo(pos.x, pos.y);
                }
            }
        }
    }
    // 绘制路径
    draw(transMatrix) {
        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.createPath(this.ctx, transMatrix);
        this.ctx.stroke();
        if (Number(this.IsFill.value) === 1) {
            this.ctx.fillStyle = '#282823';
            this.ctx.fill();
            this.ctx.clip();
            this.drawGrid();
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    draw2(ctx, matrix) {
        ctx.save();
        ctx.strokeStyle = 'red';
        this.createPath(ctx, matrix);
        ctx.stroke();
        if (Number(this.IsFill.value) === 1) {
            ctx.clip();
            this.drawGrid(ctx, 'red');
            ctx.stroke();
        }
        ctx.restore();
    }
    drawLabel() { }
    // 解析路径path的d属性
    parsePathD(d) {
        let gAttr = BDUtils.getBoardAttr();
        let planeAttr = BDUtils.planeAttr;
        let attrs = getSubValue('formula', this);
        d = calcuPathD(d, [gAttr, planeAttr, attrs]);
        return getPointAndArcListByPathD(d, {
            rotation: transform2d ? transform2d.rotation : 0
        });
    }
    isPointInPath(matrix, x, y) {
        this.createPath(this.ctx, matrix);
        if (this.ctx.isPointInPath(x, y)) {
            return true;
        }
        else {
            return false;
        }
    }
    toBdNode() {
        let node = { node: 'Path', attr: {}, children: [] };
        let keys = Object.keys(this);
        keys.forEach(key => {
            //@ts-ignore
            if (this.filterKeys.indexOf(key) === -1) {
                //@ts-ignore
                node.attr[key] = this[key];
            }
        });
        return node;
    }
    drawGrid(ctx = this.ctx, strokeStyle = '#fff') {
        let c = this.ctx.canvas;
        let length = c.width + c.height;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        for (var x = -.5; x < length; x += 6) {
            ctx.moveTo(x, 0);
            ctx.lineTo(0, x);
        }
        ctx.stroke();
    }
    /** 重置颜色 */
    reColor() {
        this.color = '#fff';
    }
    /** 获取路径的离散点 */
    getPoints(isOffset = false, isClose = true) {
        let list = JSON.parse(JSON.stringify(this.ds[0]));
        list = list.map((item) => {
            if (item.type === 'arc') {
                item.angle = -math2d.toDegrees(item.angle);
                item.startAngle = -math2d.toDegrees(item.startAngle);
                item.endAngle = -math2d.toDegrees(item.endAngle);
                item.type = 'Arc';
            }
            else if (item.type === "point") {
                item.type = 'Point';
            }
            return item;
        });
        list = arcUtil.pointAndArcToPts(list, 10);
        if (isOffset) {
            let dx = this.X.value;
            let dy = this.Y.value;
            list.forEach((item) => {
                item.x += dx;
                item.y += dy;
            });
        }
        return list;
    }
}
/** 预览 */
class PreviewLabel {
    constructor(bl, bw, bh) {
        /** 标注间隔 */
        this.dist = 50; // 标注间隔
        this.rectColor = "#fff"; // 板侧面矩形的颜色
        this.labelTextCOlor = "#0ff"; // 文字标注颜色
        this.isShowInfo = false; // 是否显示孔位信息
        this.bl = parseFloat(bl.toString());
        this.bw = parseFloat(bw.toString());
        this.bh = parseFloat((bh || 0).toString());
        this.label = new Label();
        this.setSize();
    }
    setSize() {
        this.x_l = 0;
        this.x_r = this.bl;
        this.y_u = this.bw;
        this.y_d = 0;
    }
    getWidth() {
        return this.x_r - this.x_l;
    }
    getHeight() {
        return this.y_u - this.y_d;
    }
    getPreviewData(nodes, face) {
        this.setSize();
        let holes = this.getHoleCoord(nodes);
        let vLabel = this.getVHoleLabel(holes.v_coord);
        let bLabel = this.getBHoleLabel(holes.b_coord);
        let width = this.getWidth();
        let height = this.getHeight();
        let direct;
        if (width < height) {
            direct = "LR";
        }
        else {
            direct = "UD";
        }
        let range = this.getLabelRange(vLabel, bLabel);
        return {
            faceText: face,
            direct,
            width,
            height,
            bLabel,
            vLabel,
            range
        };
    }
    /** 获取孔的坐标及其他必要的属性 */
    getHoleCoord(nodes) {
        nodes = nodes.filter(node => node.node === "VHole" || node.node === "BHole");
        let v_coord = { L: [], R: [], U: [], D: [] };
        let b_coord = { L: [], R: [], U: [], D: [] };
        let vhole_coord = {
            x: {},
            y: {}
        };
        // 获取孔的必要属性
        nodes.forEach(node => {
            // 如果设置不显示则不需要获取标注信息
            if (node.isShow === false)
                return;
            let x = Number(node.X.value);
            let y = Number(node.Y.value);
            let direct = node.HDirect.value;
            let xCap = node.Hole_Xcap.value;
            let yCap = node.Hole_Ycap.value;
            let xNum = node.Holenum_X.value;
            let yNum = node.Holenum_Y.value;
            let Hole_D = node.Hole_D.value; // 水平孔深度
            let holePoints = getIntervalHoles(x, y, xNum, xCap, yNum, yCap, direct);
            if (node.node === "VHole") {
                if (!vhole_coord.x.hasOwnProperty(y)) {
                    vhole_coord.x[y] = [];
                }
                if (!vhole_coord.y.hasOwnProperty(x)) {
                    vhole_coord.y[x] = [];
                }
                holePoints.forEach((p) => {
                    vhole_coord.x[y].push(p.x);
                    vhole_coord.y[x].push(p.y);
                });
            }
            if (node.node === "BHole") {
                holePoints.forEach((p) => {
                    if (b_coord[direct]) {
                        b_coord[direct].push({
                            x: p.x,
                            y: p.y,
                            Rb: node.Rb.value,
                            Hole_Z: node.Hole_Z.value,
                            Hole_D
                        });
                    }
                    else {
                        console.log("大饼孔缺少正确的HDirect值");
                    }
                });
            }
        });
        v_coord = this.removeRepeatVHoleLabel(vhole_coord);
        return {
            v_coord,
            b_coord
        };
    }
    /** 清理垂直孔重复的标注 */
    removeRepeatVHoleLabel(obj) {
        let bl = this.bl;
        let bw = this.bw;
        let coord = [];
        let result = {
            L: [],
            R: [],
            U: [],
            D: []
        };
        Object.keys(obj).forEach(key => {
            let conain = [];
            Object.keys(obj[key]).forEach(index => {
                let arr = obj[key][index].sort(compareNumbers);
                let arrStr = JSON.stringify(arr);
                let str = `${key}&${index}&${arrStr}`;
                if (conain.indexOf(arrStr) === -1) {
                    conain.push(arrStr);
                    coord.push(str);
                }
            });
        });
        coord.forEach(item => {
            let arr = item.split("&");
            let type = arr[0];
            let position = parseFloat(arr[1]);
            let points = JSON.parse(arr[2]);
            if (type === "x") {
                if (position <= bw / 2) {
                    result.D.push([0, ...points, bl]);
                }
                else {
                    result.U.push([0, ...points, bl]);
                }
            }
            if (type === "y") {
                if (position <= bl / 2) {
                    result.L.push([0, ...points, bw]);
                }
                else {
                    result.R.push([0, ...points, bw]);
                }
            }
        });
        return result;
    }
    /** 获取垂直孔的标注数据 */
    getVHoleLabel(obj) {
        let result = [];
        let that = this;
        Object.keys(obj).forEach(direction => {
            let items = obj[direction];
            items.forEach(item => {
                if (direction === "L") {
                    that.x_l -= that.dist;
                }
                if (direction === "R") {
                    that.x_r += that.dist;
                }
                if (direction === "U") {
                    that.y_u += that.dist;
                }
                if (direction === "D") {
                    that.y_d -= that.dist;
                }
                item.forEach((coord, index) => {
                    if (index !== 0) {
                        let p;
                        if (direction === "L") {
                            p = [that.x_l, coord, that.x_l, item[index - 1]];
                        }
                        if (direction === "R") {
                            p = [that.x_r, item[index - 1], that.x_r, coord];
                        }
                        if (direction === "U") {
                            p = [coord, that.y_u, item[index - 1], that.y_u];
                        }
                        if (direction === "D") {
                            p = [item[index - 1], that.y_d, coord, that.y_d];
                        }
                        if (p) {
                            result.push(p);
                        }
                    }
                });
            });
        });
        return result;
    }
    /** 获取水平孔的标注数据 */
    getBHoleLabel(obj) {
        let result = [];
        Object.keys(obj).forEach(key => {
            let direction = key;
            let holes = obj[direction];
            let item = {
                direct: direction,
                rect: [],
                points: [],
                label: []
            };
            // 排序
            if (direction === "L" || direction === "R") {
                holes.sort((a, b) => {
                    return a.y - b.y;
                });
            }
            if (direction === "U" || direction === "D") {
                holes.sort((a, b) => {
                    return a.x - b.x;
                });
            }
            //** 暂时为了兼容矢量图 */
            let isRun = true;
            if (window["currentBDEnv"] == "矢量图") {
                isRun = holes.length > 0;
            }
            if (isRun) {
                let x, y, w, h;
                let d = this.dist + this.bh;
                if (direction === "L" || direction === "R") {
                    y = 0;
                    w = this.bh;
                    h = this.bw;
                    if (direction === "L") {
                        x = this.x_l - d;
                        this.x_l -= d;
                    }
                    else {
                        x = this.x_r + this.dist;
                        this.x_r += d;
                    }
                }
                if (direction === "U" || direction === "D") {
                    x = 0;
                    w = this.bl;
                    h = this.bh;
                    if (direction === "U") {
                        y = this.y_u + this.dist;
                        this.y_u += d;
                    }
                    if (direction === "D") {
                        y = this.y_d - d;
                        this.y_d -= d;
                    }
                }
                item.rect = [x, y, w, h];
                holes.forEach(hole => {
                    let x, y;
                    let Hole_Z = parseFloat(hole.Hole_Z);
                    if (direction === "L") {
                        x = item.rect[0] + item.rect[2] - Hole_Z;
                        y = hole.y;
                    }
                    if (direction === "R") {
                        x = item.rect[0] + Hole_Z;
                        y = hole.y;
                    }
                    if (direction === "U") {
                        x = hole.x;
                        y = item.rect[1] + Hole_Z;
                    }
                    if (direction === "D") {
                        x = hole.x;
                        y = item.rect[1] + item.rect[3] - Hole_Z;
                    }
                    item.points.push({
                        x: x,
                        y: y,
                        Rb: parseFloat(hole.Rb),
                        Hole_z: parseFloat(hole.Hole_Z),
                        Hole_D: parseFloat(hole.Hole_D)
                    });
                });
                if (item.points.length > 0) {
                    let first_p, last_p;
                    if (direction === "L" || direction === "R") {
                        first_p = {
                            x: item.points[0].x,
                            y: 0
                        };
                        last_p = {
                            x: item.points[0].x,
                            y: this.bw
                        };
                    }
                    if (direction === "U" || direction === "D") {
                        first_p = {
                            x: 0,
                            y: item.points[0].y
                        };
                        last_p = {
                            x: this.bl,
                            y: item.points[0].y
                        };
                    }
                    let points = [first_p, ...item.points, last_p];
                    if (direction === "L" || direction === "U") {
                        points.reverse();
                    }
                    // 获取水平孔距离标注坐标
                    points.forEach((node, index) => {
                        if (index !== 0) {
                            let x1 = points[index - 1].x;
                            let y1 = points[index - 1].y;
                            let x2 = node.x;
                            let y2 = node.y;
                            let dist = 10;
                            if (direction === "L") {
                                x1 = x2 = x1 - dist;
                            }
                            if (direction === "R") {
                                x1 = x2 = x1 + dist;
                            }
                            if (direction === "U") {
                                y1 = y2 = y1 + dist;
                            }
                            if (direction === "D") {
                                y1 = y2 = y1 - dist;
                            }
                            item.label.push([x1, y1, x2, y2]);
                        }
                    });
                    // 封边宽度标注
                    let point = points[1]; // 第一个没有水平孔边界的属性,从第二个开始且只选一个，一般情况所有水平孔的边距都一样
                    let fbDist = 20;
                    if (direction === "L" || direction === "R") {
                        item.label.push([x, y, x + w, y]);
                        if (direction === "L") {
                            item.label.push([
                                x + w - point.Hole_z,
                                y - fbDist,
                                x + w,
                                y - fbDist
                            ]);
                        }
                        else {
                            item.label.push([
                                x,
                                y - fbDist,
                                x + point.Hole_z,
                                y - fbDist
                            ]);
                        }
                    }
                    else {
                        item.label.push([x, y + h, x, y]);
                        if (direction === "D") {
                            item.label.push([x - fbDist, y + h, x - fbDist, y + h - point.Hole_z]);
                        }
                        else {
                            item.label.push([x - fbDist, y + point.Hole_z, x - fbDist, y]);
                        }
                    }
                }
                result.push(item);
            }
        });
        return result;
    }
    /** 绘制孔的标注 */
    drawHoleLabel(obj, matrix) {
        this.drawVHoleLabel(obj.vLabel, matrix);
        this.drawBHoleLabel(obj.bLabel, matrix);
        this.drawFaceText(obj, matrix);
    }
    /** 绘制垂直孔的标注 */
    drawVHoleLabel(vLabel, matrix) {
        vLabel.forEach(arr => {
            this.label.drawLineLabel(canvas2d.ctx, matrix, arr);
        });
    }
    /** 绘制水平孔的标注 */
    drawBHoleLabel(bLabel, matrix) {
        let scale = transform2d.scale;
        bLabel.forEach(item => {
            if (item.label.length == 0 && item.points.length == 0) {
                if (bdDecode.fbCutDataList.findIndex(child => { return child.compass == item.direct; }) == -1) {
                    return;
                }
            }
            let w = item.rect[2] * scale;
            let h = item.rect[3] * scale;
            let pos = mat2d.transformCoord({
                x: item.rect[0],
                y: item.rect[1]
            }, matrix);
            // 根据靠挡方向，重新设置矩形标注的宽高
            let rotation = transform2d.rotation;
            if (rotation % 360 === 0) {
                h = -h;
            }
            else if (rotation === 180) {
                w = -w;
            }
            else if (rotation === 90) {
                [w, h] = [-h, -w];
            }
            else if (rotation === 270) {
                [w, h] = [h, w];
            }
            // 绘制封边矩形
            canvas2d.drawRect2(pos.x, pos.y, w, h, this.rectColor);
            // 绘制水平孔标注
            item.points.forEach((node) => {
                let p = mat2d.transformCoord({
                    x: node.x,
                    y: node.y
                }, matrix);
                // 水平孔的X
                canvas2d.drawCross(p, node.Rb * scale, 45, "red", 90);
                if (this.isShowInfo) {
                    canvas2d.drawText({
                        x: p.x + 10,
                        y: p.y,
                        text: `H${node.Rb}_${node.Hole_D}`,
                        color: this.labelTextCOlor
                    });
                }
            });
            // 绘制水平孔距离标注
            item.label.forEach((arr) => {
                this.label.drawLineLabel(canvas2d.ctx, matrix, arr);
            });
        });
        // 我这边重新绘制封边槽
        bdDecode.updateSize({ bh: this.bh, bl: this.bl, bw: this.bw });
        bdDecode.drawAllFBCutByPreview(bLabel, matrix);
    }
    /** 绘制AB面 */
    drawFaceText(obj, matrix) {
        let range = obj.range;
        if (range.minx === 0 &&
            range.maxx === 0 &&
            range.miny === 0 &&
            range.maxy === 0)
            return;
        let dist = 36;
        let x = (range.minx + range.maxx) / 2;
        let y = range.miny;
        let dist_x = 0;
        let dist_y = 0;
        let rotation = transform2d.rotation;
        if (rotation % 360 === 0) {
            dist_y = dist;
        }
        else if (rotation === 180) {
            dist_y = -dist;
        }
        else if (rotation === 90) {
            dist_x = dist;
        }
        else if (rotation === 270) {
            dist_x = -dist;
        }
        let pos = mat2d.transformCoord({ x, y }, matrix);
        canvas2d.drawText({
            x: pos.x + dist_x,
            y: pos.y + dist_y,
            text: obj.faceText,
            fontSize: 20,
            color: "red"
        });
    }
    // 设置预览数据
    setPreviewData(data, size) {
        if (size) {
            this.bl = parseFloat(size.bl.toString());
            this.bw = parseFloat(size.bw.toString());
            this.bh = parseFloat((size.bh || 0).toString());
        }
        let faceA = this.getPreviewData(data["FaceA"], "A");
        let faceB = this.getPreviewData(data["FaceB"], "B");
        this.data = {
            faceA,
            faceB
        };
    }
    // 获取预览标注的尺寸和孔标注数据
    getFacePreviewData(face) {
        return this.data["face" + face];
    }
    // 获取孔标注在画布上绘制的范围
    getLabelRange(vLabel, bLabel) {
        let range = {
            minx: 0,
            maxx: this.getWidth() + 100,
            miny: 0,
            maxy: this.getHeight()
        };
        function setRange(items) {
            items.forEach((arr) => {
                let x1 = arr[0];
                let y1 = arr[1];
                let x2 = arr[2];
                let y2 = arr[3];
                let mark = arr[4]; // 用于过滤封边宽度的标注
                if (mark == null) {
                    if (range.minx > x1)
                        range.minx = x1;
                    if (range.minx > x2)
                        range.minx = x2;
                    if (range.maxx < x1)
                        range.maxx = x1;
                    if (range.maxx < x2)
                        range.maxx = x2;
                    if (range.miny > y1)
                        range.miny = y1;
                    if (range.miny > y2)
                        range.miny = y2;
                    if (range.maxy < y1)
                        range.maxy = y1;
                    if (range.maxy < y2)
                        range.maxy = y2;
                }
            });
        }
        bLabel.forEach(item => {
            setRange(item.label);
        });
        setRange(vLabel);
        return range;
    }
    setLabelStyle(cfg) {
        this.rectColor = (cfg === null || cfg === void 0 ? void 0 : cfg.color) || "#fff";
        this.labelTextCOlor = (cfg === null || cfg === void 0 ? void 0 : cfg.textColor) || "#0ff";
        this.label.setStyle(cfg);
    }
}
/** 矩形 */
class RectShape {
    constructor(ctx, data, option = {}) {
        this.isFill = true;
        this.isStroke = true;
        /** 是否为虚线 */
        this.isDotted = false; // 是否为虚线
        this.isShowInfo = false;
        this.style = {
            fillStyle: 'red',
            strokeStyle: 'red',
            globalAlpha: 0.3,
            lineDash: [3]
        };
        /** 展示的信息 */
        this.infos = []; // 展示的信息
        let { isFill = true, isStroke = true, style, infos = [], isShowInfo = false, isDotted = false } = option;
        this.ctx = ctx;
        this.data = data || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.infos = typeof infos === "string" ? [infos] : infos;
        this.isFill = isFill;
        this.isStroke = isStroke;
        this.isDotted = isDotted;
        this.isShowInfo = isShowInfo;
        this.setStyle(style);
    }
    getCenter() {
        let { x, y, width, height } = this.data;
        return {
            x: x + width / 2,
            y: y + height / 2
        };
    }
    draw(matrix) {
        let that = this;
        let ctx = this.ctx;
        let { x, y, width, height } = this.calcuDataByMatrix(matrix);
        ctx.save();
        for (let key in that.style) {
            //@ts-ignore
            ctx[key] = that.style[key];
        }
        ctx.beginPath();
        if (this.isDotted) {
            ctx.setLineDash(this.style.lineDash);
        }
        ctx.rect(x, y, width, height);
        that.isStroke && ctx.stroke();
        that.isFill && ctx.fill();
        ctx.restore();
        this.isShowInfo && this.drawLabelText(matrix);
    }
    // 绘制标注信息
    drawLabelText(matrix) {
        if (this.infos.length === 0)
            return;
        let p = this.getCenter();
        p = mat2d.transformCoord(p, matrix);
        canvas2d.drawTextLabel(p, this.infos);
    }
    calcuDataByMatrix(matrix) {
        let { x, y, width, height } = this.data;
        let pt1 = mat2d.transformCoord({ x, y }, matrix);
        let pt2 = mat2d.transformCoord({
            x: x + width,
            y: y + height
        }, matrix);
        return {
            x: pt1.x,
            y: pt1.y,
            width: pt2.x - pt1.x,
            height: pt2.y - pt1.y
        };
    }
    setStyle(style) {
        if (style) {
            for (let key in style) {
                //@ts-ignore
                this.style[key] = style[key];
            }
        }
    }
}
class TArc {
    constructor(ctx, node) {
        this.node = 'TArc';
        this.ctx = ctx;
        this.attr = node.attr;
        this.arc = node;
        this.color = '#fff';
        this.isSelected = false; // 是否被选中
        this.sAngle = null;
        this.eAngle = null;
        this.center = null;
        this.start = null;
        this.middle = null;
        this.end = null;
        this.h = 0;
        this.r = 0;
        this.rLabel = null;
        this.wise = false;
        this.update();
        this.initLabel();
        // jeef,增加guid作为识别
        if (!this.guid) {
            this.guid = ObjUtil.guid;
        }
    }
    update(attr) {
        this.attr = attr || this.attr;
        let start = {
            x: this.attr.X.value,
            y: this.attr.Y.value
        };
        let end = {
            x: this.attr.X2.value,
            y: this.attr.Y2.value
        };
        this.h = this.attr.ChordH.value; // 弦高
        this.start = start;
        this.end = end;
        let otherAttr = getCanvasArcByHGArc({
            type: 'tArc',
            start,
            end,
            h: this.h,
            isBulge: (this.attr.IsBulge.value)
        }, {
            rotation: transform2d ? transform2d.rotation : 0
        });
        this.r = otherAttr.radius;
        this.center = otherAttr.center;
        this.sAngle = otherAttr.startAngle;
        this.eAngle = otherAttr.endAngle;
        this.wise = otherAttr.isCounterClockwise;
        this.middle = otherAttr.middle;
    }
    initLabel() {
        let x = (this.start.x + this.end.x) / 2;
        let y = (this.start.y + this.end.y) / 2;
        this.rLabel = new Label(this.middle.x, this.middle.y, x, y, 'TArc', false);
    }
    draw(matrix) {
        this.update();
        this.drawArc(this.ctx, matrix);
        this.drawLabel(matrix);
    }
    draw2(ctx, matrix) {
        let color = this.color;
        this.color = 'red';
        this.drawArc(ctx, matrix);
        this.color = color;
    }
    /** 画标注 */
    drawLabel(matrix) {
        this.rLabel.draw(this.ctx, matrix);
    }
    /** 画弧 */
    drawArc(ctx, matrix) {
        ctx.save();
        ctx.strokeStyle = this.color;
        if (this.isSelected)
            ctx.strokeStyle = '#e64072'; // 如果被选中强制修改颜色
        this.createPath(ctx, matrix);
        ctx.stroke();
        ctx.restore();
    }
    /** 创建圆弧的路径 */
    createPath(ctx, matrix) {
        if (this.attr.ChordH.value == 0) {
            console.log("xxx");
        }
        else {
            let center = mat2d.transformCoord(this.center, matrix);
            let r = this.r * transform2d.scale;
            ctx.beginPath();
            ctx.arc(center.x, center.y, r, this.sAngle, this.eAngle, this.wise);
        }
    }
    /** 点是否在圆弧上点是否在圆弧上（待完善：在出现右半圆，IsBugle为0时会获取不到） */
    isPointInPath(matrix) {
        if (window.currentBDEnv == "矢量图") {
            let minAngle, maxAngle;
            let cp = mat2d.transformCoord(this.center, matrix);
            let sp = mat2d.transformCoord(this.start, matrix);
            let ep = mat2d.transformCoord(this.end, matrix);
            let len = math2d.getLineLength(mouse.pos.x, mouse.pos.y, cp.x, cp.y);
            let r = this.r * transform2d.scale;
            let sAngle = math2d.toPositiveAngle(math2d.lineAngle(sp.x, sp.y, cp.x, cp.y));
            let eAngle = math2d.toPositiveAngle(math2d.lineAngle(ep.x, ep.y, cp.x, cp.y));
            let mAngle = math2d.toPositiveAngle(math2d.lineAngle(mouse.pos.x, mouse.pos.y, cp.x, cp.y));
            let diff = len - r;
            // 判断是否在圆边界附近上
            if (diff > 2 || diff < -0.2)
                return false;
            // 判断点是否在弧的扇形区域内
            //@ts-ignore
            if (this.wise < 0) { // 逆时针
                if (sAngle >= 270 && math2d.round(eAngle) === 0)
                    eAngle = 360;
                minAngle = sAngle;
                maxAngle = eAngle;
            }
            else { // 顺时针
                if (eAngle >= 270 && math2d.round(sAngle) === 0)
                    sAngle = 360;
                minAngle = eAngle;
                maxAngle = sAngle;
            }
            // console.log(minAngle <= mAngle && mAngle <= maxAngle, minAngle, mAngle, maxAngle)
            if (minAngle > maxAngle) {
                [minAngle, maxAngle] = [maxAngle, minAngle];
            }
            if (minAngle <= mAngle && mAngle <= maxAngle) {
                return true;
            }
            else {
                return false;
            }
        }
        let [cp, sp, ep] = mat2d.transformCoords([this.center, this.start, this.end], matrix);
        let r = this.r * transform2d.scale;
        let direction = this.wise ? "顺时针" : "逆时针";
        return isPointInArc(direction, mouse.pos, sp, ep, cp, r);
    }
    /** 设置标注的样式 */
    setLabelStyle(cfg) {
        this.rLabel.setStyle(cfg);
    }
    getBox() {
        let pts = [this.start, this.middle, this.end];
        let minx, maxx, miny, maxy;
        for (let p of pts) {
            if (p) {
                if (minx === undefined || minx > p.x) {
                    minx = p.x;
                }
                if (maxx === undefined || maxx < p.x) {
                    maxx = p.x;
                }
                if (miny === undefined || miny > p.y) {
                    miny = p.y;
                }
                if (maxy === undefined || maxy < p.y) {
                    maxy = p.y;
                }
            }
        }
        let width = maxx - minx;
        let height = maxy - miny;
        return {
            minx,
            miny,
            maxx,
            maxy,
            width,
            height
        };
    }
    getRangeByAxisDirection(axisDirection) {
        return getRangeByAxisDirection(this, axisDirection);
    }
    /** 获取圆弧的离散点 */
    getPoints() {
        return PosUtil.getArcPArrByStep({
            center: this.center,
            radius: this.r,
            startAngle: -this.sAngle,
            endAngle: -this.eAngle,
            isCounterClockwise: !this.wise
        });
    }
}
class BDDecode_Data {
    /** 获取完全体的gragh */
    getCompleteGragh(graphChilren, op) {
        if (!graphChilren) {
            graphChilren = this.graphChilren;
        }
        let newChildren = [];
        newChildren.push(...graphChilren);
        let newGraphChilren = [];
        for (let i = 0; i < newChildren.length; i++) {
            let child = newChildren[i];
            if ((op === null || op === void 0 ? void 0 : op.isClearOutKC) && child.node == "Cut" && child.isOutKC) {
                continue;
            }
            newGraphChilren.push(child);
        }
        newChildren = newGraphChilren;
        for (let i = 0; i < this.fbCutDataList.length; i++) {
            let cutChild = this.fbCutDataList[i];
            if ((op === null || op === void 0 ? void 0 : op.isClearOutKC) && cutChild.cut.isOutKC) {
                continue;
            }
            for (let j = 0; j < newChildren.length; j++) {
                if (cutChild.pointGuid != newChildren[j].guid || cutChild.cut.fromParant) {
                    continue;
                }
                newChildren.splice(j, 0, cutChild.cut);
                break;
            }
        }
        // let graphChilrenIndex = 0
        // for (let i = 0; i < this.fbCutDataList.length; i++) {
        //     let cutChild = this.fbCutDataList[i]
        //     for (let j = graphChilrenIndex; j < graphChilren.length; j++) {
        //         if (j > cutChild.startIndex) {
        //             break
        //         }
        //         let graphChild = graphChilren[j]
        //         newChildren.push(graphChild)
        //         graphChilrenIndex = j + 1
        //     }
        //     newChildren.push(cutChild.cut)
        // }
        // for (let j = graphChilrenIndex; j < graphChilren.length; j++) {
        //     newChildren.push(graphChilren[j])
        // }
        return newChildren;
    }
    updateSize(data) {
        let check = false;
        for (let key in data) {
            let targetKey = key;
            if (data[targetKey] != this.size[targetKey]) {
                check = true;
            }
            this.size[targetKey] = data[targetKey];
        }
        this.isChangeSize = true;
    }
    /** 更新所有挖槽方向数据 */
    updateAllCutCompass(graphNodes) {
        ["L", "R", "D", "U"].forEach(key => {
            graphNodes[key].forEach(line => {
                this.updateCutCompass(line, key);
            });
        });
    }
    /** 更新挖槽的方向 */
    updateCutCompass(line, compass) {
        let p1Guid;
        let p2Guid;
        let x1;
        let y1;
        let x2;
        let y2;
        if (line.node == "Line") {
            p1Guid = line.p1.guid;
            p2Guid = line.p2.guid;
            x1 = line.x1;
            x2 = line.x2;
            y1 = line.y1;
            y2 = line.y2;
        }
        else if (line.node == "Arc") {
            p1Guid = p2Guid = line.arc.guid;
        }
        let db = this.outLineLine.find(child => {
            if (child.startGuid != p1Guid && child.startGuid != p2Guid) {
                if (child.start.x != x1 || child.start.y != y1) {
                    return false;
                }
            }
            if (child.endGuid != p1Guid && child.endGuid != p2Guid) {
                if (child.end.x != x2 || child.end.y != y2) {
                    return false;
                }
            }
            return true;
        });
        if (!db) {
            return;
        }
        let index = db.index;
        if (index == -1) {
            index = this.outLineLine.length - 1;
        }
        let cutData;
        this.fbCutBitmapDataList.forEach((child, i) => {
            // let targetIndex = this.fbCutDataList[i].startIndex
            // if (targetIndex == -1) {
            //     targetIndex = this.outLineLine.length - 1
            // }
            // if (targetIndex == index) {
            //     cutData = this.fbCutDataList[i]
            //     child.compass = compass
            //     cutData.compass = compass
            //     return true
            // }
            // return false
            let target = this.fbCutDataList[i];
            if (target.pointGuid == p1Guid) {
                cutData = this.fbCutDataList[i];
                child.compass = compass;
                cutData.compass = compass;
                return true;
            }
            return false;
        });
    }
    /** 获取一个方向内所有封边槽数据 */
    getCutDataByCompass(face) {
        let cutDataList = [];
        cutDataList = this.fbCutDataList.filter(child => {
            if (child.compass == face) {
                return true;
            }
            return false;
        });
        return cutDataList;
    }
    changeFBCutData(targetData) {
        let fbCut = this.fbCutDataList.find(child => {
            return child.cut.guid == targetData.guid;
        });
        if (!fbCut) {
            return;
        }
        let keys = ["X", "X1", "Y", "Y1", "Cut_Z", "Hole_Z"];
        keys.forEach(key => {
            var _a, _b;
            if (fbCut.cut.attr[key] == undefined) {
                return;
            }
            //@ts-ignore
            if (targetData[key] == undefined) {
                return;
            }
            //@ts-ignore
            fbCut.cut.attr[key].formula = ((_a = targetData[key]) === null || _a === void 0 ? void 0 : _a.formula) || "0";
            //@ts-ignore
            fbCut.cut.attr[key].value = ((_b = targetData[key]) === null || _b === void 0 ? void 0 : _b.value) || 0;
        });
        // this.init()
        this.jcanvas.bitmapUpdate(true);
    }
    getChildByNode(node, type) {
        if (type == "FB") {
            if (node.node == "Cut") {
                return this.fbCutDataList.find(child => {
                    return child.cut.guid == node.guid;
                });
            }
        }
    }
    getXmlPosByGuid(guid) {
        var _a, _b;
        let type;
        let index = -1;
        let node;
        ((_a = this === null || this === void 0 ? void 0 : this.faceAObj) === null || _a === void 0 ? void 0 : _a.children) && this.faceAObj.children.find((child, i) => {
            if (child.guid != guid) {
                return false;
            }
            type = "FaceA";
            node = child;
            index = i;
            return true;
        });
        !type && ((_b = this === null || this === void 0 ? void 0 : this.faceBObj) === null || _b === void 0 ? void 0 : _b.children) && this.faceBObj.children.find((child, i) => {
            if (child.guid != guid) {
                return false;
            }
            type = "FaceB";
            node = child;
            index = i;
            return true;
        });
        !type && (this === null || this === void 0 ? void 0 : this.fbCutDataList) && this.fbCutDataList.find((child, i) => {
            if (child.cut.guid != guid) {
                return false;
            }
            type = "FaceB";
            node = child;
            index = i;
            return true;
        });
        return { type, index, node };
        // if(BDUtils.data.)
    }
    /** 获取x2d的xml */
    getNewX2dByKeyName(xmlStr) {
        let doc = new DOMParser();
        let xml = doc.parseFromString(xmlStr, "text/xml");
        let startKey = "";
        let num = 1;
        let useKey = [];
        let getKeyFunc = (key) => {
            if (key) {
                if (useKey.includes(key)) {
                    return getKeyFunc("");
                }
                useKey.push(key);
                return key;
            }
            let curKey = startKey + num;
            num++;
            if (useKey.includes(curKey)) {
                return getKeyFunc(key);
            }
            return curKey;
        };
        let faceAList = xml.getElementsByTagName("FaceA");
        let faceBList = xml.getElementsByTagName("FaceB");
        [faceAList, faceBList].forEach(child => {
            for (let i = 0; i < child.length; i++) {
                let childC = child[i];
                for (let j = 0; j < childC.children.length; j++) {
                    let childD = childC.children[j];
                    let target = childD.getAttribute("KeyName");
                    let curKey = getKeyFunc(target);
                    childD.setAttribute("KeyName", curKey);
                }
            }
        });
        return xml.documentElement.outerHTML;
    }
    /** 获取孔默认面朝向 */
    getHoleDefaultFaceType(hdirect) {
        var _a;
        let di = ((_a = this === null || this === void 0 ? void 0 : this.graphObj) === null || _a === void 0 ? void 0 : _a.attr["DI"]) || "";
        let result = "";
        //侧板
        if (di == "4" || di == "6") {
            if (hdirect == "L") {
                result = "Back";
            }
            else if (hdirect == "R") {
                result = "Front";
            }
        }
        //背板
        else if (!di || di == "2" || di == "3") {
            if (hdirect == "L") {
                result = "Left";
            }
            else if (hdirect == "R") {
                result = "Right";
            }
            else if (hdirect == "U") {
                result = "Up";
            }
            else if (hdirect == "D") {
                result = "Down";
            }
        }
        //层板
        else if (di == "1" || di == "5") {
            if (hdirect == "L") {
                result = "Left";
            }
            else if (hdirect == "R") {
                result = "Right";
            }
            else if (hdirect == "U") {
                result = "Front";
            }
            else if (hdirect == "D") {
                result = "Back";
            }
        }
        return result;
    }
    initHoleInfo(data) {
        if (!this.holeInfo) {
            return;
        }
        // console.log(ObjUtil.JsonParse(this.holeInfo))
        if (!data.children) {
            this.holeInfo = undefined;
            return;
        }
        let loopFunc = (child) => {
            if (!this.holeInfo) {
                return;
            }
            if (child.node == "Graph" && child.children && this.holeInfo.KC) {
                this.holeInfo.KC.forEach(kc => {
                    if (["LFB", "RFB", "UFB", "DFB"].indexOf(kc.face) == -1) {
                        return;
                    }
                    let cut = {
                        children: [],
                        node: "Cut",
                        guid: ObjUtil.guid,
                        attr: { X: kc.x0, Y: kc.y0, X1: kc.x1, Y1: kc.y1, Cut_Z: kc.Cut_Z, Hole_Z: kc.Hole_Z, Cutter: kc.Cutter, Face: kc.face, CutName: kc.CutName },
                        isOutKC: true
                    };
                    child.children.push(cut);
                });
                return;
            }
            if (((child.node == "FaceA" && this.holeInfo.A) || (child.node == "FaceB" && this.holeInfo.B)) && child.children) {
                let targetHoleInfo = child.node == "FaceA" ? this.holeInfo.A : this.holeInfo.B;
                child.children.forEach((c, i) => {
                    let target = targetHoleInfo[i];
                    if (!target || !target.notStandard) {
                        return;
                    }
                    c.attr.NotStandard = target.notStandard;
                });
                return;
            }
            if (child.children) {
                child.children.forEach(c => {
                    loopFunc(c);
                });
            }
        };
        loopFunc(data);
        // let newChildren: JBDXmlNodeGraphType<true>["children"] = []
        // let prevChild: JBDXmlNodeGraphType<true>["children"][number]
        // let prevI: number
        // let len = data.children.length
        // let keys = ["LFB", "UFB", "RFB", "DFB"]
        // for (let i = 0; i <= len; i++) {
        //     let index = i % len
        //     let c = data.children[i]
        //     let key = keys[0]
        //     if (!prevChild) {
        //         prevChild = c
        //         prevI = index
        //         newChildren.push(prevChild)
        //         continue
        //     }
        //     if (prevChild.node == "Point" && c.node == "Point") {
        //         for (let j = 0; j < this.holeInfo.KC.length; j++) {
        //             let kc=this.holeInfo.KC[0]
        //             let cut:JBDXmlNodeCutType={
        //                 children:[],
        //                 node:"Cut",
        //                 guid:ObjUtil.guid,
        //                 attr:{X:kc.x0,Y:kc.y0,X1:kc.x1,Y1:kc.y1,Cut_Z:kc.Hole_Z,Hole_Z:kc.Hole_Z,}
        //             }
        //         }
        //     }
        //     prevChild = c
        //     prevI = index
        //     newChildren.push(prevChild)
        // }
        // this.holeInfo = undefined
    }
}
class BDDecode_Draw {
    /** 批量绘制封边数据 */
    drawFBCutsByCompass(compass, transMatrix) {
        this.fbCutBitmapDataList.forEach(child => {
            if (child.compass != compass) {
                return;
            }
            this.drawFBCutByCompass(child, transMatrix);
        });
    }
    /** 绘制封边数据 */
    drawFBCutByCompass(cutBitmap, transMatrix) {
        if (this.isChangeSize || !cutBitmap.compassAttr) {
            cutBitmap.compassAttr = ObjUtil.JsonParse(cutBitmap.attr);
            let attr = cutBitmap.compassAttr;
            if (cutBitmap.compass == "L") {
                attr.X.value = attr.Cut_Z.value;
                attr.X1.value = attr.Cut_Z.value;
                attr.Y.value = this.size.bw - attr.Y.value;
                attr.Y1.value = this.size.bw - attr.Y1.value;
            }
            else if (cutBitmap.compass == "R") {
                attr.X.value = attr.Cut_Z.value;
                attr.X1.value = attr.Cut_Z.value;
                attr.Y.value = this.size.bw - attr.Y.value;
                attr.Y1.value = this.size.bw - attr.Y1.value;
            }
            else if (cutBitmap.compass == "D") {
                attr.X.value = this.size.bl - attr.X.value;
                attr.X1.value = this.size.bl - attr.X1.value;
                attr.Y.value = attr.Cut_Z.value;
                attr.Y1.value = attr.Cut_Z.value;
            }
            else if (cutBitmap.compass == "U") {
                attr.X.value = this.size.bl - attr.X.value;
                attr.X1.value = this.size.bl - attr.X1.value;
                attr.Y.value = attr.Cut_Z.value;
                attr.Y1.value = attr.Cut_Z.value;
            }
            // cutBitmap.newAttr.X.value =
        }
        if (this.isChangeSize || !cutBitmap.compassBitmap) {
            cutBitmap.compassBitmap = new Cut(cutBitmap.compassAttr);
        }
        cutBitmap.compassBitmap.draw(transMatrix);
    }
    /** 绘制所有挖槽数据到预览图(到廖泽恩) */
    drawAllFBCutByPreview(bLabel, transMatrix) {
        bLabel.forEach(childB => {
            this.fbCutBitmapDataList.forEach(child => {
                if (child.compass == childB.direct) {
                    this.drawFBCutByPreview(childB, child, transMatrix);
                }
            });
        });
    }
    /** 绘制封边槽(到廖泽恩) */
    drawFBCutByPreview(bLabel, cutBitmap, transMatrix) {
        cutBitmap.previewAttr = ObjUtil.JsonParse(cutBitmap.attr);
        let attr = cutBitmap.previewAttr;
        if (cutBitmap.compass == "L") {
            let w = bLabel.rect[0] + this.size.bh - attr.Cut_Z.value;
            attr.X.value = attr.X.value + w;
            attr.X1.value = attr.X1.value + w;
        }
        else if (cutBitmap.compass == "R") {
            let w = bLabel.rect[0] - this.size.bl + attr.Cut_Z.value;
            attr.X.value = attr.X.value + w;
            attr.X1.value = attr.X1.value + w;
        }
        else if (cutBitmap.compass == "U") {
            let h = bLabel.rect[1] - this.size.bw + attr.Cut_Z.value;
            attr.Y.value = attr.Y.value + h;
            attr.Y1.value = attr.Y1.value + h;
        }
        else if (cutBitmap.compass == "D") {
            let h = bLabel.rect[1] + this.size.bh - attr.Cut_Z.value;
            attr.Y.value = attr.Y.value + h;
            attr.Y1.value = attr.Y1.value + h;
        }
        cutBitmap.previewBitmap = new Cut(attr);
        cutBitmap.previewBitmap.draw(transMatrix);
    }
}
class BDDecode_Init {
    init() {
        var _a, _b;
        this.initGuid((_a = this === null || this === void 0 ? void 0 : this.util) === null || _a === void 0 ? void 0 : _a.data);
        this.initBoardAttr((_b = this === null || this === void 0 ? void 0 : this.util) === null || _b === void 0 ? void 0 : _b.data);
        this.initFBCutData();
        this.initOutLine();
        this.isChangeSize = true;
        console.log("init");
    }
    initBoardAttr(data) {
        if (this.boardAttr) {
            return;
        }
        this.boardAttr = ObjUtil.JsonParse(data.attr);
    }
    /** 初始化guid */
    initGuid(data) {
        if (!data) {
            return;
        }
        if (!data.guid) {
            data.guid = ObjUtil.guid;
        }
        if (data.children) {
            for (let i = 0; i < data.children.length; i++) {
                let child = data.children[i];
                this.initGuid(child);
            }
        }
    }
    sortFBCutData(graph) {
        // if (!this.holeInfo) {
        //     return
        // }
        let otherChildren = [];
        let cutChildren = [];
        let newChildren = [];
        let x1;
        let x2;
        let y1;
        let y2;
        graph.children.forEach(child => {
            if (child.node == "Cut" && child.attr.Face != "FB") {
                cutChildren.push(child);
            }
            else {
                otherChildren.push(child);
            }
        });
        let getCutFunc = (face) => {
            let list = [];
            cutChildren.forEach(cut => {
                if (cut.node != "Cut") {
                    return;
                }
                if (cut.attr.Face != face) {
                    return;
                }
                if (cut.attr.X1.value == cut.attr.X.value && cut.attr.X1.value == x1) {
                    list.push(cut);
                }
                else if (cut.attr.Y1.value == cut.attr.Y.value && cut.attr.Y1.value == y1) {
                    list.push(cut);
                }
            });
            return list;
        };
        let prevChild;
        let len = otherChildren.length;
        for (let i = 0; i <= len; i++) {
            let index = i % len;
            let child = otherChildren[index];
            if (child.node == "Cut") {
                newChildren.push(child);
                continue;
            }
            if (!prevChild) {
                prevChild = child;
                newChildren.push(child);
                continue;
            }
            if (prevChild.node == "Point" && child.node == "Point") {
                x1 = prevChild.attr.X.value;
                x2 = child.attr.X.value;
                y1 = prevChild.attr.Y.value;
                y2 = child.attr.Y.value;
                // 同点跳过
                if (x1 == x2 && y1 == y2) {
                    prevChild = child;
                    newChildren.push(child);
                    continue;
                }
                // 左右
                if (x1 == x2) {
                    // 左
                    if (y1 - y2 > 0) {
                        newChildren.push(...getCutFunc("RFB"));
                    }
                    else {
                        newChildren.push(...getCutFunc("LFB"));
                    }
                }
                // 上下
                else if (y1 == y2) {
                    if (x1 - x2 > 0) {
                        newChildren.push(...getCutFunc("DFB"));
                    }
                    else {
                        newChildren.push(...getCutFunc("UFB"));
                    }
                }
            }
            newChildren.push(child);
            prevChild = child;
        }
        graph.children = newChildren;
        this.holeInfo = undefined;
    }
    /** 初始化封边挖槽数据 */
    initFBCutData() {
        for (let i = 0; i < this.util.data.children.length; i++) {
            let node = this.util.data.children[i];
            if (node.node != 'Graph') {
                if (node.node == "FaceA") {
                    this.faceAObj = node;
                }
                else if (node.node == "FaceB") {
                    this.faceBObj = node;
                }
                continue;
            }
            let graph = node;
            this.sortFBCutData(graph);
            let children = [];
            let pointIndex = -1;
            let currentPoint;
            this.fbCutDataList = [];
            this.fbCutBitmapDataList = [];
            for (let j = 0; j < graph.children.length; j++) {
                let graphChild = graph.children[j];
                if (graphChild.node == "Point") {
                    children.push(graphChild);
                    currentPoint = graphChild;
                    pointIndex++;
                    continue;
                }
                if (graphChild.node == "Arc") {
                    children.push(graphChild);
                    pointIndex++;
                    continue;
                }
                if (graphChild.node == "TArc") {
                    children.push(graphChild);
                    pointIndex++;
                    continue;
                }
                graphChild = ObjUtil.JsonParse(graphChild);
                // graphChild.attr.X.value = 0
                // graphChild.attr.Y.value = 0
                // graphChild.attr.X1.value = 0
                // graphChild.attr.Y1.value = 382
                this.fbCutDataList.push({ startIndex: pointIndex, cut: graphChild, pointGuid: currentPoint.guid });
                let cutBitmap = new Cut(graphChild.attr);
                let cutData = { type: "cut", start: new JPos(graphChild.attr.X.value, graphChild.attr.Y.value), end: new JPos(graphChild.attr.X1.value, graphChild.attr.Y1.value), index: pointIndex };
                this.fbCutBitmapDataList.push({ bitmap: cutBitmap, data: cutData, attr: graphChild.attr });
            }
            graph.children = children;
            this.graphChilren = children;
            this.graphObj = graph;
        }
    }
    /** 专门用于初始化bd的xml,用途为:追加cut */
    initBDJson(bdJson) {
        let faceA;
        let faceB;
        let graph;
        for (let i = 0; i < bdJson.children.length; i++) {
            let child = bdJson.children[i];
            if (child.node == "FaceA") {
                faceA = child;
                if (!faceA.guid) {
                    faceA.guid = ObjUtil.guid;
                }
                continue;
            }
            if (child.node == "FaceB") {
                faceB = child;
                if (!faceB.guid) {
                    faceB.guid = ObjUtil.guid;
                }
                continue;
            }
            if (child.node == "Graph") {
                graph = child;
                if (!graph.guid) {
                    graph.guid = ObjUtil.guid;
                }
                continue;
            }
        }
        ;
        [{ type: "faceA", data: faceA }, { type: "faceB", data: faceB }].forEach(c => {
            if (!c.data) {
                return;
            }
            let newList = [];
            c.data.children.forEach((cc, i) => {
                if (!cc.guid) {
                    cc.guid = ObjUtil.guid;
                }
                if ((cc.node != "BHole" && cc.node != "VHole") || !cc.attr.NotStandard) {
                    return;
                }
                let str = cc.attr.NotStandard.toString().split("^").join(`"`);
                let json = JSON.parse(str);
                let newCut = {
                    node: "Cut",
                    children: [],
                    attr: {},
                    guid: ObjUtil.guid,
                    fromParant: cc.guid,
                    isOutKC: true,
                    NotStandard: true
                };
                for (let key in json) {
                    //@ts-ignore
                    newCut.attr[key] = json[key];
                }
                newCut.attr.Face = "B";
                newCut.attr.device = "0";
                newCut.attr.CutName = "";
                if (cc.node == "VHole") {
                    newList.push(newCut);
                }
                if (cc.node == "BHole") {
                    let d = "";
                    switch (cc.attr.HDirect) {
                        case "L":
                            d = "L";
                            break;
                        case "R":
                            d = "R";
                            break;
                        default:
                            d = cc.attr.HDirect;
                            break;
                    }
                    newCut.attr.Face = d + "FB";
                    graph.children.push(newCut);
                }
            });
            c.data.children.push(...newList);
        });
    }
}
function BDDecode_InitOutLine() {
    this.outLine = [];
    this.outLineLine = [];
    let getArcDataFunc = (target, index) => {
        let startAngle = PosUtil.getRadianByAngle(-target.attr.StartAngle.value);
        let angle = PosUtil.getRadianByAngle(-target.attr.Angle.value);
        let p = new JPos(target.attr.X.value, target.attr.Y.value);
        let r = target.attr.R.value;
        let arc = {
            type: "arc",
            guid: target.guid,
            startGuid: target.guid,
            endGuid: target.guid,
            radius: r,
            isCounterClockwise: angle < 0 ? true : false,
            startAngle: startAngle,
            endAngle: (startAngle + angle),
            center: PosUtil.getRayPos(p, startAngle + Math.PI, r)
        };
        if (arc.radius == 0) {
            let startIndex = index - 1;
            if (startIndex < 0) {
                startIndex = this.graphChilren.length - 1;
            }
            let endIndex = index + 1;
            if (endIndex >= this.graphChilren.length) {
                endIndex = 0;
            }
            let startPoint = this.graphChilren[startIndex];
            let endPoint = this.graphChilren[endIndex];
            arc.pList = [new JPos(startPoint.attr.X.value, startPoint.attr.Y.value), new JPos(endPoint.attr.X.value, endPoint.attr.Y.value)];
        }
        else {
            let list = PosUtil.getArcPArrByCount(arc, 10);
            arc.pList = list;
            console.log(ObjUtil.JsonParse(target));
            console.log(ObjUtil.JsonParse(arc));
        }
        arc.start = arc.pList[0];
        arc.end = arc.pList[arc.pList.length - 1];
        return arc;
    };
    this.graphChilren.forEach((child, i) => {
        if (child.node == "Point") {
            let x = child.attr.X.value || 0;
            let y = child.attr.Y.value || 0;
            let point = {
                type: "point",
                x, y, guid: child.guid
            };
            this.outLine.push(point);
        }
        if (child.node == "Arc") {
            let arc = getArcDataFunc(child, i);
            this.outLine.push(arc);
        }
    });
    let createLineFunc = (start, end) => {
        let startP;
        let endP;
        if (start.type == "point") {
            startP = new JPos(start.x, start.y);
        }
        else if (start.type == "arc") {
            startP = new JPos().copy(start.start);
        }
        if (end.type == "point") {
            endP = new JPos(end.x, end.y);
        }
        else if (end.type == "arc") {
            endP = new JPos().copy(end.start);
        }
        let line = { start: startP, end: endP, type: "line", startGuid: start.guid, endGuid: end.guid };
        return line;
    };
    for (let i = 0; i < this.outLine.length - 1; i++) {
        let start = this.outLine[i];
        if (start.type == "arc") {
            start.index = i;
            this.outLineLine.push(start);
            // let arc:JBDNewArcType={start:}
        }
        else if (start.type == "point") {
            let end = this.outLine[i + 1];
            let line = createLineFunc(start, end);
            line.index = i;
            this.outLineLine.push(line);
        }
    }
    if (this.outLine.length == 0) {
        console.warn("没有数据,无法初始化");
        return;
    }
    let start = this.outLine[this.outLine.length - 1];
    let end = this.outLine[0];
    let line = createLineFunc(start, end);
    line.index = this.outLine.length - 1;
    this.outLineLine.push(line);
}
/** 连结搜索 */
class BDDecode_Link {
    /** 通过非标准的cut找到hole */
    getHoleNodeByCutNode(cut) {
        let target;
        [{ data: this.faceAObj }, { data: this.faceBObj }].findIndex(cc => {
            return cc.data.children.findIndex(c => {
                if ((c.node == "BHole" || c.node == "VHole") && cut.fromParant == c.guid) {
                    target = c;
                    return true;
                }
                return false;
            }) != -1;
        });
        return target;
    }
}
/** 外扩展修补数据类 */
class BDDecode_repair {
    /** 圆弧数据修复数据修补 */
    tArcRepair(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (data === null || data === void 0 ? void 0 : data.children) {
            let len = data.children.length;
            for (let i = 0; i < len; i++) {
                let c = data.children[i];
                if (c.node != "TArc") {
                    continue;
                }
                let prevIndex = (i - 1 + len) % len;
                let prev = data.children[prevIndex];
                let nextIndex = (i + 1 + len) % len;
                let next = data.children[nextIndex];
                if (!prev || prev.node != "Point" || !next || next.node != "Point") {
                    continue;
                }
                if (((_a = c === null || c === void 0 ? void 0 : c.attr) === null || _a === void 0 ? void 0 : _a.X) && c.attr.X.formula == ((_c = (_b = next === null || next === void 0 ? void 0 : next.attr) === null || _b === void 0 ? void 0 : _b.X) === null || _c === void 0 ? void 0 : _c.formula) && ((_d = c === null || c === void 0 ? void 0 : c.attr) === null || _d === void 0 ? void 0 : _d.Y) && c.attr.Y.formula == ((_f = (_e = next === null || next === void 0 ? void 0 : next.attr) === null || _e === void 0 ? void 0 : _e.Y) === null || _f === void 0 ? void 0 : _f.formula) && ((_g = c === null || c === void 0 ? void 0 : c.attr) === null || _g === void 0 ? void 0 : _g.X2) && c.attr.X2.formula == ((_j = (_h = prev === null || prev === void 0 ? void 0 : prev.attr) === null || _h === void 0 ? void 0 : _h.X) === null || _j === void 0 ? void 0 : _j.formula) && ((_k = c === null || c === void 0 ? void 0 : c.attr) === null || _k === void 0 ? void 0 : _k.Y2) && c.attr.Y2.formula == ((_m = (_l = prev === null || prev === void 0 ? void 0 : prev.attr) === null || _l === void 0 ? void 0 : _l.Y) === null || _m === void 0 ? void 0 : _m.formula)) {
                    c.attr.X = ObjUtil.JsonParse(prev.attr.X);
                    c.attr.Y = ObjUtil.JsonParse(prev.attr.Y);
                    c.attr.X2 = ObjUtil.JsonParse(next.attr.X);
                    c.attr.Y2 = ObjUtil.JsonParse(next.attr.Y);
                    c.attr.IsBulge = {
                        formula: c.attr.IsBulge.formula == 1 ? 0 : 1,
                        value: c.attr.IsBulge.formula == 1 ? 0 : 1
                    };
                }
            }
        }
        return data;
    }
}
class BDDecode_UI {
    /** 获取封边槽数据 */
    getFBCutDataUI() {
        return this.fbCutDataList.map(child => {
            let cut = new Cut(ObjUtil.JsonParse(child.cut.attr), this.util);
            cut.guid = child.cut.guid;
            cut.fromParent = child.cut.fromParant;
            cut.isOutKC = child.cut.isOutKC;
            cut.NotStandard = child.cut.NotStandard;
            return cut;
        });
    }
    /** 选中左侧节点 */
    selectNodeUI(node, type) {
        if (node.node == "Cut") {
            this.selectGuid = node.guid;
        }
        else if (node.node == "BHole" || node.node == "VHole") {
            this.selectGuid = node.guid;
        }
        // console.log(this.selectGuid)
        this.jcanvas.bitmapSys.draw();
        this.jcanvas.bitmapSys.draw();
        // if (node.node == "Cut" && type == "FB") {
        //     let cut = this.getChildByNode(node, type)
        // }
    }
    /** 获取清空用的bd检测数据 */
    getClearCheckAppBDUI() {
        let data = {
            isCurrentNoChangeFace: true,
            isCurrentNoChangeFaceA: true,
            isCurrentNoChangeFaceB: true,
            isCurrentNoChangeGraph: false,
            isNoChangeFace: true,
            isNoChangeFaceA: true,
            isNoChangeFaceB: true,
            isNoChangeGraph: true
        };
        return data;
    }
    /** 获取全局的属性 */
    getGlobalAttr(key) {
        var _a, _b, _c, _d, _e, _f;
        if (key == "holeCfgMark") {
            let userDataStr = (_c = (_b = (_a = this.util) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.attr) === null || _c === void 0 ? void 0 : _c.userData;
            userDataStr = userDataStr || "{}";
            userDataStr = userDataStr.split("^").join('"');
            let userData = JSON.parse(userDataStr);
            return userData[key];
        }
        return (_f = (_e = (_d = this.util) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.attr) === null || _f === void 0 ? void 0 : _f[key];
    }
    /** 设置全局的属性 */
    setGlobalAttr(key, data) {
        var _a, _b, _c, _d, _e;
        if (key == "holeCfgMark") {
            let userDataStr = (_c = (_b = (_a = this.util) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.attr) === null || _c === void 0 ? void 0 : _c.userData;
            userDataStr = userDataStr || "{}";
            userDataStr = userDataStr.split("^").join('"');
            let userData = JSON.parse(userDataStr);
            userData[key] = data;
            console.log(userData);
            userDataStr = JSON.stringify(userData).split(`"`).join("^");
            this.util.data.attr.userData = userDataStr;
            return;
        }
        if (!((_e = (_d = this.util) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.attr)) {
            return;
        }
        this.util.data.attr[key] = data;
    }
    /** 对比从app传来的bd是否一致 */
    checkAppBDUI(bd) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (this.originBlock && this.originBlock.BasicGraphic.indexOf(".bd") != -1 && !((_b = (_a = this.originBlock) === null || _a === void 0 ? void 0 : _a.UserB64) === null || _b === void 0 ? void 0 : _b.bdChangeCheckData)) {
            if (!((_c = this.originBlock) === null || _c === void 0 ? void 0 : _c.UserB64)) {
                this.originBlock.UserB64 = {};
            }
            let data = {
                isNoChangeFace: false,
                isNoChangeFaceA: false,
                isNoChangeFaceB: false,
                isNoChangeGraph: false
            };
            this.originBlock.UserB64.bdChangeCheckData = data;
        }
        let originData = (_e = (_d = this === null || this === void 0 ? void 0 : this.originBlock) === null || _d === void 0 ? void 0 : _d.UserB64) === null || _e === void 0 ? void 0 : _e.bdChangeCheckData;
        let isNoChangeGraph = (originData === null || originData === void 0 ? void 0 : originData.isNoChangeGraph) != undefined ? originData === null || originData === void 0 ? void 0 : originData.isNoChangeGraph : true;
        let isNoChangeFaceA = (originData === null || originData === void 0 ? void 0 : originData.isNoChangeFaceA) != undefined ? originData === null || originData === void 0 ? void 0 : originData.isNoChangeFaceA : true;
        let isNoChangeFaceB = (originData === null || originData === void 0 ? void 0 : originData.isNoChangeFaceB) != undefined ? originData === null || originData === void 0 ? void 0 : originData.isNoChangeFaceB : true;
        let isNoChangeFace = (originData === null || originData === void 0 ? void 0 : originData.isNoChangeFace) != undefined ? originData === null || originData === void 0 ? void 0 : originData.isNoChangeFace : true;
        let isCurrentNoChangeGraph = true;
        let isCurrentNoChangeFaceA = true;
        let isCurrentNoChangeFaceB = true;
        let isCurrentNoChangeFace = true;
        let doc = new DOMParser();
        let originXml = doc.parseFromString(this.originAppBD, "text/xml");
        let curentXml = doc.parseFromString(bd, "text/xml");
        let keys = ["Graph", "FaceA", "FaceB"];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let originDom = (_h = (_g = (_f = originXml === null || originXml === void 0 ? void 0 : originXml.documentElement) === null || _f === void 0 ? void 0 : _f.getElementsByTagName) === null || _g === void 0 ? void 0 : _g.call(_f, key)) === null || _h === void 0 ? void 0 : _h[0];
            let currentDom = (_l = (_k = (_j = curentXml === null || curentXml === void 0 ? void 0 : curentXml.documentElement) === null || _j === void 0 ? void 0 : _j.getElementsByTagName) === null || _k === void 0 ? void 0 : _k.call(_j, key)) === null || _l === void 0 ? void 0 : _l[0];
            let isSame = ((originDom === null || originDom === void 0 ? void 0 : originDom.innerHTML) == (currentDom === null || currentDom === void 0 ? void 0 : currentDom.innerHTML));
            if (key == "Graph") {
                if (isNoChangeGraph) {
                    isNoChangeGraph = isSame;
                }
                isCurrentNoChangeGraph = isSame;
            }
            if (key == "FaceA") {
                if (isNoChangeFaceA) {
                    isNoChangeFaceA = isSame;
                }
                isCurrentNoChangeFaceA = isSame;
            }
            if (key == "FaceB") {
                if (isNoChangeFaceB) {
                    isNoChangeFaceB = isSame;
                }
                isCurrentNoChangeFaceB = isSame;
            }
        }
        isCurrentNoChangeFace = isCurrentNoChangeFaceA && isCurrentNoChangeFaceB;
        isNoChangeFace = isNoChangeFaceA && isNoChangeFaceB;
        return {
            isNoChangeGraph, isNoChangeFaceA, isNoChangeFaceB, isNoChangeFace, isCurrentNoChangeFace, isCurrentNoChangeFaceA, isCurrentNoChangeFaceB, isCurrentNoChangeGraph
        };
    }
    /** (改造lze_vue)将图形对象转变为bd对象 */
    graphObjToBdJson(dataList, boardAttr, op) {
        if (!boardAttr) {
            boardAttr = this.boardAttr;
        }
        let faceA = dataList.FaceA;
        let faceB = dataList.FaceB;
        let bdJson = { node: "Board", attr: boardAttr, children: [] };
        let nodeGraph = {
            node: "Graph",
            attr: {},
            children: copyObject(this.getCompleteGragh(dataList.Graph, op)),
        };
        let nodeFaceA = { node: "FaceA", attr: {}, children: [] };
        let nodeFaceB = { node: "FaceB", attr: {}, children: [] };
        faceA.forEach((node) => {
            // 通过其他字段得来的需要去掉
            if (node.node == "Cut" && (node.fromParent)) {
                return;
            }
            nodeFaceA.children.push(node.toBdNode());
        });
        faceB.forEach((node) => {
            // 通过其他字段得来的需要去掉
            if (node.node == "Cut" && (node.fromParent)) {
                return;
            }
            nodeFaceB.children.push(node.toBdNode());
        });
        bdJson.children = [nodeGraph, nodeFaceA, nodeFaceB];
        // 新增孔位区间规则
        if (this.util.holeRules) {
            //@ts-ignore
            let rules = Object.values(this.util.holeRules);
            if (rules.length) {
                let nodeRuleList = { node: "RuleList", attr: {}, children: rules };
                //@ts-ignore
                bdJson.children.push(nodeRuleList);
            }
        }
        this.util.addBDAttr(bdJson);
        return bdJson;
    }
    getBDXml(bdJson) {
        let json = this.util.setBdAttr(bdJson);
        return XmlUtil.toXml(json, {
            Board: [
                "L",
                "W",
                "BH",
                "CA",
                "CB",
                "CC",
                "CD",
                "CE",
                "CF",
                "CG",
                "CH",
                "CI",
                "CJ",
                "CK",
                "CL",
                "CM",
                "CN",
                "CO",
                "CP",
            ],
            Point: ["X", "Y"],
            Arc: ["X", "Y"],
            TArc: ["X", "Y", "X2", "Y2"],
            Cut: ["X", "Y", "X1", "Y1"],
            BHole: ["X", "Y"],
            VHole: ["X", "Y"],
            Path: ["X", "Y"],
        });
    }
    /** 复制自身 */
    copySelf(obj) {
        return copyObject(obj, ["BDUtils"]);
    }
}
class BDDecode_Util {
    /** 获取bd的离散点 */
    getBDPts(bd, cb, op) {
        let data = x2dXmlPointAndArc(bd, op);
        let pts = [];
        let func = (hgArc) => {
            if (hgArc.originData.node == "TArc") {
                let a = hgArc.originData.attr;
                let jarc = new JArc();
                let start = new JPos(a.X, a.Y);
                let end = new JPos(a.X2, a.Y2);
                jarc.radius = (4 * a.ChordH ** 2 + (start.x - end.x) ** 2 + (start.y - end.y) ** 2) / (8 * a.ChordH);
                let center = PosUtil.getCenterPos(start, end);
                let radian = PosUtil.getRadian(start, end);
                let L = jarc.radius - a.ChordH;
                jarc.center = PosUtil.getRayPos(center, radian + Math.PI / 2, L * (a.IsBulge ? -1 : 1));
                jarc.startAngle = PosUtil.getRadian(jarc.center, start);
                jarc.endAngle = PosUtil.getRadian(jarc.center, end);
                jarc.isCounterClockwise = a.IsBulge ? true : false;
                return jarc;
            }
            else if (hgArc.originData.node == "Arc") {
                let jarc = new JArc();
                let angle = hgArc.originData.attr.Angle;
                let a = angle > 0 ? -1 : 1;
                let startAngle = 360 - hgArc.originData.attr.StartAngle;
                let x = hgArc.originData.attr.X;
                let y = hgArc.originData.attr.Y;
                let r = hgArc.originData.attr.R;
                jarc.center = PosUtil.getRayPos(new JPos(x, y), PosUtil.getRadianByAngle(startAngle), -r);
                let endAngle = startAngle + Math.abs(angle) * a;
                jarc.startAngle = PosUtil.getRadianByAngle(startAngle);
                jarc.endAngle = PosUtil.getRadianByAngle(endAngle);
                jarc.radius = r;
                jarc.isCounterClockwise = a == -1 ? true : false;
                return jarc;
            }
            return;
        };
        data.forEach((child, i) => {
            if (child.type == "Point") {
                let p = new JPos(child.x, child.y);
                pts.push(p);
                if (cb) {
                    cb([p], child, i);
                }
            }
            else if (child.type == "Arc") {
                let jarc = func(child);
                let pArr = PosUtil.getArcPArrByStep(jarc, Math.PI / 180);
                pts.push(...pArr);
                if (cb) {
                    cb(pArr, child, i);
                }
            }
        });
        return pts;
    }
    /** 是否同样的尺寸 */
    isSameSize(bd) {
        let originPts = this.getBDPts(this.originAppBD, undefined, { "BoardAttr": { L: this.size.bl, W: this.size.bw } });
        let currentPts = this.getBDPts(bd, undefined, { "BoardAttr": { L: this.size.bl, W: this.size.bw } });
        let originLimit = PosUtil.getLimitPosArr(...originPts);
        let currentLimit = PosUtil.getLimitPosArr(...currentPts);
        if (!PosUtil.isSamePos(originLimit[0], currentLimit[0], 0.1)) {
            return false;
        }
        if (!PosUtil.isSamePos(originLimit[1], currentLimit[1], 0.1)) {
            return false;
        }
        return true;
    }
}
class BDDecode {
    constructor(util) {
        this.util = util;
        /** 封边挖槽数据 */
        this.fbCutDataList = [];
        /** 封边挖槽图形数据 */
        this.fbCutBitmapDataList = [];
        /** 去掉封边挖槽的子对象集合 */
        this.graphChilren = [];
        /** 轮廓点的数据 */
        this.graphPointList = {};
        /** 轮廓 */
        this.outLine = [];
        /** 索引数组,用来快速寻找数据 */
        this.objList = {};
        /** 事件大法,用于联动监听 */
        this.event = new BDEvent();
        /** vueui关联大法,用于vue上的方法暂时无法改成ts的临时解决办法 */
        this.ui = new JBDUI();
        this.size = {
            bl: 0,
            bw: 0,
            bh: 0
        };
        this.isChangeSize = false;
        this.initOutLine = BDDecode_InitOutLine;
        this.event.bdStrImport.subscribe((data) => {
            console.log(data);
        });
    }
}
((derivedCtor, constructors) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
        });
    });
})(BDDecode, [BDDecode_Init, BDDecode_Data, BDDecode_Draw, BDDecode_UI, BDDecode_repair, BDDecode_Util, BDDecode_Link]);
class BDEvent {
    constructor() {
        this.bitmapClick = new JEventEmit();
        this.bitmapDbclick = new JEventEmit();
        /** 文件导入功能 */
        this.bdImport = new JEventEmit();
        this.bdStrImport = new JEventEmit();
        /** 加载bd功能 */
        this.loadBD = new JEventEmit();
        /** 加载xml数据，可能为bd或x2d，默认为bd */
        this.loadXmlData = new JEventEmit();
        this.loadX2d = new JEventEmit();
        /** 选面操作 */
        this.selectFace = new JEventEmit();
        /** 从主页打开 */
        this.openFromMainApp = new JEventEmit();
        /** 保存到主页 */
        this.saveToHome = new JEventEmit();
        /** 清除还原，并回到主页 */
        this.clearExitToHome = new JEventEmit();
    }
}
class JBDUI {
}
function JBDDebug() {
    if (typeof followerDiv == "undefined" || typeof followerDiv.setMoveDisplay == "undefined") {
        return;
    }
    bdDecode.event.openFromMainApp.subscribe(obj => {
        console.log(obj);
    });
    bdDecode.event.bdStrImport.subscribe(o => {
        console.log(o);
    });
    followerDiv.pushEleFunc({
        func: () => {
            followerDiv.creatTextAreaPlus([
                {
                    name: "快速读取",
                    func: (v, e) => {
                        bdDecode.event.bdStrImport.emit({
                            str: v,
                            fileType: "bd",
                            fileName: "test.bd",
                            cfg: {
                                fileType: "bd",
                                type: "导入"
                            }
                        });
                    }
                }
            ], "outside1", "bd数据:");
            followerDiv.creatTextAreaPlus([
                {
                    name: "孔位避让",
                    func: (v, e) => {
                        if (!v) {
                            return;
                        }
                        let obj = JSON.parse(v);
                        let xml = bdDecode.ui.getBdXml();
                        obj.bdXml = xml;
                        BDCorrect.bdAIErrorCorrect(obj.bdXml, obj.errors, obj.cfg, (data) => {
                            if (data.xml) {
                                // console.log(data)
                                bdDecode.event.bdStrImport.emit({ fileType: "bd", str: data.xml, fileName: "test.bd" });
                            }
                            else {
                                bdDecode.event.bdStrImport.emit({ fileType: "bd", str: obj.bdXml, fileName: "test.bd" });
                            }
                        });
                        console.log(obj);
                    },
                },
                {
                    name: "避让前绘制",
                    func: (v, e) => {
                        if (!v) {
                            return;
                        }
                        let obj = JSON.parse(v);
                        let xml = bdDecode.ui.getBdXml();
                        obj.bdXml = xml;
                        BDCorrect.bdAIErrorCorrect(obj.bdXml, obj.errors, obj.cfg, (data) => {
                            if (data.xml) {
                                // console.log(data)
                                bdDecode.event.bdStrImport.emit({ fileType: "bd", str: data.xml, fileName: "test.bd" });
                            }
                            else {
                                bdDecode.event.bdStrImport.emit({ fileType: "bd", str: obj.bdXml, fileName: "test.bd" });
                            }
                        }, {
                            prevCB: (hcList, op) => {
                                let div = document.createElement("div");
                                let sys = new HGCanvasSys(div, 500, 500, 1, -1);
                                document.body.append(div);
                                let block = sys.bitmapSys.createBitmap("path");
                                block.data = block.getpolyLinePath(PosUtil.getRectByTwoPos(new JPos(), new JPos(op.l, op.w)), true);
                                block.isStorke = true;
                                block.isFill = false;
                                block.style.strokeStyle = "green";
                                hcList.forEach(c => {
                                    let path = sys.bitmapSys.createBitmap("path");
                                    path.data = path.getpolyLinePath(PosUtil.getRectByTwoPos(new JPos(c.range.minx, c.range.miny), new JPos(c.range.maxx, c.range.maxy)), true);
                                    path.isStorke = true;
                                    path.isFill = false;
                                    if (c.node == "BHole") {
                                        path.style.strokeStyle = "red";
                                    }
                                    else if (c.node == "VHole") {
                                        path.style.strokeStyle = "blue";
                                    }
                                    else if (c.node == "Cut") {
                                        path.style.strokeStyle = "black";
                                    }
                                });
                                sys.bitmapSys.draw();
                                sys.bitmapSys.setCenter(0, 0.2);
                                let svg = sys.bitmapSys.toSvg();
                                let mywin = window.open("");
                                mywin.document.write(svg.outerHTML);
                                div.remove();
                            }
                        });
                    }
                }
            ], "outside", "外界数据:");
            followerDiv.createInputPlus([{
                    name: "更新", func: (val) => {
                        localStorage.setItem("jqdsoftid", val);
                    }
                }], "jqdsoftid", "企业号");
            followerDiv.createBtn("decode数据", () => {
                console.log(bdDecode);
                console.log(ObjUtil.JsonParse(bdDecode.graphChilren));
            });
            followerDiv.createBtn("xml数据", () => {
                if (!bdDecode.ui.getBdXml) {
                    console.warn("无法此方法");
                    return;
                }
                console.log(bdDecode.ui.getBdXml());
            });
            followerDiv.createBtn("数据改动对比", () => {
                if (!bdDecode.ui.getBdXml) {
                    console.warn("无法此方法");
                    return;
                }
                let xml = bdDecode.ui.getBdXml();
                let data = bdDecode.checkAppBDUI(xml);
                console.log(data);
            });
            followerDiv.createBtn("尺寸一致", () => {
                if (!bdDecode.ui.getBdXml) {
                    console.warn("无法此方法");
                    return;
                }
                let xml = bdDecode.ui.getBdXml();
                let data = bdDecode.isSameSize(xml);
                console.log("尺寸一致性:", data);
            });
            followerDiv.createBtn("原bd数据", () => {
                console.log(ObjUtil.JsonParse(this.util.data));
            });
            followerDiv.createBtn("原bd数据Graph", () => {
                this.util.data.children.forEach(child => {
                    if (child.node == "Graph") {
                        console.log(ObjUtil.JsonParse(child));
                        console.log(ObjUtil.JsonParse(child.children));
                    }
                });
            });
            followerDiv.createBtn("封边图元", () => {
                if (typeof (bdDecode === null || bdDecode === void 0 ? void 0 : bdDecode.jFbViewLabel) == "undefined") {
                    console.warn("对象还没拉出来");
                    return;
                }
                console.log(bdDecode.jFbViewLabel);
                console.log(bdDecode.jFbViewLabel.fbOutlines);
                console.log(bdDecode.jFbViewLabel.cacheFbData);
            });
            followerDiv.createBtn("保存", () => {
            });
            followerDiv.createBtn("避让规则", () => {
                DomUtil.readFile().then(file => {
                    DomUtil.decodeFile(file.files[0], "text").then(str => {
                        localStorage.setItem("bdbirangtest", str);
                    });
                });
            });
            followerDiv.createBtn("避让", () => {
                let cfgStr = localStorage.getItem("bdbirangtest");
                if (!cfgStr) {
                    console.warn("没有避让规则,无法避让");
                    return;
                }
            });
            followerDiv.createBtn("轮廓图元", () => {
                if (typeof (bdDecode === null || bdDecode === void 0 ? void 0 : bdDecode.jGraph) == "undefined") {
                    console.warn("对象还没拉出来");
                    return;
                }
                console.log(bdDecode.jGraph);
            });
        },
        tag: "bdXml"
    });
    setTimeout(() => {
        followerDiv.setMoveDisplay(0, 0);
        followerDiv.setMaxMin(false);
    }, 2000);
}
class Transform2D {
    constructor() {
        this.position = new JPos();
        this.rotation = 0;
        this.scale = 1;
        this.zoomStep = 1.1;
    }
    /** 初始化 */
    init(cfg = {}) {
        let { bl, bw, rotation = 0 } = cfg;
        this.BL = typeof bl === 'string' ? parseInt(bl) : bl;
        this.BW = typeof bw === 'string' ? parseInt(bw) : bw;
        this.rotation = rotation;
        this.initMatrix();
    }
    /** 重置 */
    reset() {
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
        this.scale = 1;
        this.zoomStep = 1.1;
        this.initMatrix();
    }
    /** 初始化矩阵 */
    initMatrix() {
        let canvas = document.getElementById('canvas');
        this.matrix = this.getMatrix({
            scale: this.scale,
            position: this.position,
            h: canvas.clientHeight
        });
    }
    /** 获取初始矩阵 */
    getMatrix(cfg) {
        let { scale = 1, position = { x: 0, y: 0 }, h = 0, } = cfg;
        let sm = mat2d.makeScale(scale, scale);
        let tm = mat2d.makeTranslation(position.x, -position.y + h);
        // 用于得到与x轴对称的图形
        let inverseY = [
            1, 0, 0,
            0, -1, 0,
            0, 0, 1
        ];
        let matrix = mat2d.multiply(inverseY, mat2d.identity());
        matrix = mat2d.multiply(sm, matrix);
        matrix = mat2d.multiply(tm, matrix);
        return matrix;
    }
    /** 缩放画布 */
    zoomCanvas(deltaY) {
        let wheel = deltaY < 0 ? 1 : -1;
        let step;
        let before = {
            x: mouse.pos.x,
            y: mouse.pos.y
        };
        let pos = mat2d.transformCoord(before, mat2d.invert(this.matrix));
        if (wheel === 1) { // 放大
            // if (this.scale >= 10) return
            step = this.zoomStep;
        }
        else { // 缩小
            // if (this.scale <= 0.05) return
            step = 1 / this.zoomStep;
        }
        this.scale *= step;
        let matrix = mat2d.multiply(mat2d.makeScale(step, step), this.matrix);
        let after = mat2d.transformCoord(pos, matrix);
        let tm = mat2d.makeTranslation(before.x - after.x, before.y - after.y); // 平移矩阵
        this.matrix = mat2d.multiply(tm, matrix);
    }
    /** 平移画布 */
    moveCanvas(before, after) {
        let offsetX = after.x - before.x;
        let offsetY = after.y - before.y;
        let tm = mat2d.makeTranslation(offsetX, offsetY);
        this.tempMatrix = mat2d.multiply(tm, this.matrix);
    }
    /** 将临时矩阵转为变换矩阵 */
    resetTempMatrix() {
        if (this.tempMatrix) {
            this.matrix = this.tempMatrix;
            this.tempMatrix = null;
        }
    }
    /**
     * 获取板件变换矩阵
     * @param {*} matrix
     * @param {*} w 图形宽度
     * @param {*} h 图形高度
     * @param {*} origin 图形位于画布的位置
     * @param {*} viewSize 画布实际宽高
     * @param {*} scale 缩放比例
     * @param {*} rotation 旋转角度
     * @returns
     */
    getViewMatrix(matrix = this.matrix, w = this.BL, h = this.BW, origin = [0, 0], viewSize, scale, rotation) {
        if (!viewSize) {
            viewSize = [canvas2d.canvas.clientWidth, canvas2d.canvas.clientHeight];
        }
        if (!scale) {
            scale = this.getScale(w, h, viewSize[0], viewSize[1]) * 0.8;
        }
        if (!rotation) {
            rotation = this.rotation || 0;
        }
        let bw = w * scale;
        let bh = h * scale;
        let cx = viewSize[0] / 2;
        let cy = viewSize[1] / 2;
        let bx = bw / 2;
        let by = bh / 2;
        let option = {
            0: [cx - bx, cy - by],
            90: [cx + by, cy - bx],
            180: [cx + bx, cy + by],
            270: [cx - by, cy + bx],
            360: [cx - bx, cy - by]
        };
        let offset = option[rotation];
        let invertScale = 1 / scale;
        let originTransMatrix = mat2d.makeTranslation(origin[0], origin[1]);
        let rm = mat2d.makeRotation(rotation);
        let sm = mat2d.makeScale(scale, scale); // 缩放矩阵
        let tm = mat2d.makeTranslation(offset[0] * invertScale, offset[1] * invertScale); // 偏移矩阵
        let temp = mat2d.multiplyMore([matrix, originTransMatrix, sm, tm]);
        this.scale = temp[0];
        return mat2d.multiplyMore([temp, rm]);
    }
    /** 获取板件变换矩阵,矢量专用 */
    getViewMatrixByBoard(matrix = this.matrix, boardRange = {
        minx: 0,
        miny: 0,
        maxx: this.BL,
        maxy: this.BW
    }, origin = [0, 0], viewSize, scale) {
        let w = boardRange.maxx - boardRange.minx;
        let h = boardRange.maxy - boardRange.miny;
        if (!viewSize) {
            viewSize = [canvas2d.canvas.clientWidth, canvas2d.canvas.clientHeight];
        }
        if (!scale) {
            scale = this.getScale(w, h, viewSize[0], viewSize[1]) * 0.8;
        }
        let rotation = this.rotation || 0;
        let cx = viewSize[0] / 2;
        let cy = viewSize[1] / 2;
        let bx = ((boardRange.maxx + boardRange.minx) / 2) * scale; // 真实的中心x坐标
        let by = ((boardRange.maxy + boardRange.miny) / 2) * scale; // 真实的中心y坐标
        let option = {
            0: [cx - bx, cy - by],
            90: [cx + by, cy - bx],
            180: [cx + bx, cy + by],
            270: [cx - by, cy + bx],
            360: [cx - bx, cy - by]
        };
        //@ts-ignore
        let offset = option[rotation];
        let invertScale = 1 / scale;
        let originTransMatrix = mat2d.makeTranslation(origin[0], origin[1]);
        let rm = mat2d.makeRotation(rotation);
        let sm = mat2d.makeScale(scale, scale); // 缩放矩阵
        let tm = mat2d.makeTranslation(offset[0] * invertScale, offset[1] * invertScale); // 偏移矩阵
        let temp = mat2d.multiplyMore([matrix, originTransMatrix, sm, tm]);
        this.scale = temp[0];
        return mat2d.multiplyMore([temp, rm]);
    }
    /** 获取缩放比例 */
    getScale(bw, bh, viewWidth, viewLength, dist = 100) {
        let lenW = bw;
        let lenH = bh;
        let rotation = this.rotation;
        if (rotation === 90 || rotation === 270) {
            [lenW, lenH] = [lenH, lenW];
        }
        let scaleW = (viewWidth - dist) / lenW;
        let scaleH = (viewLength - dist) / lenH;
        let scale = scaleW < scaleH ? scaleW : scaleH;
        return scale;
    }
}
let transform2d = new Transform2D();
/**
 * 存放聊怎一些零散的方法和接口
 */
function getCoordinate(node) {
    return {
        x: node.attr.X.value,
        y: node.attr.Y.value
    };
}
class Mouse {
    constructor() {
        this._pos = new JPos();
    }
    get pos() {
        return this._pos;
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        this._pos = captureMouse(canvas);
    }
}
// 获取相对于canvas的坐标
function captureMouse(element) {
    let mouse = { x: 0, y: 0 };
    element.addEventListener('mousemove', function (event) {
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
        // let x, y;
        // if (event.pageX || event.pageY) {
        //     x = event.pageX;
        //     y = event.pageY;
        // } else {
        //     x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        //     y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        // }
        // x -= element.offsetLeft;
        // y -= element.offsetTop;
        // mouse.x = x;
        // mouse.y = y;
    }, false);
    return mouse;
}
/** x2d转为图元Path的xml */
function x2dToPath(x2d, fileName, noCalcuKeys = [], isClose = true) {
    let json = parseFormulaXml(x2d, noCalcuKeys);
    let plane = getX2dOuterPlane(json);
    if (plane) {
        let attr = Object.assign({}, json.attr, plane.attr);
        attr.name = fileName;
        attr.d = getGraphPathD(plane.children, isClose);
        filterAttr(attr, []);
        return XmlUtil.toXml({
            node: 'Path',
            attr,
            children: []
        });
    }
    else {
        console.error('x2d数据不完整，没有点弧列表轮廓数据');
        return;
    }
}
// 计算图元Path的路径d得到没有带变量的字符串
function calcuPathD(d, attrArray) {
    return d.split(';').filter(d => d).map(d => {
        return d.split(',').map(str => {
            let chars = str.split(' ');
            let newStr = chars[0];
            for (let i = 1; i < chars.length; i++) {
                newStr += ` ${calcFormula(chars[i], attrArray)}`;
            }
            return newStr;
        }).join(',');
    }).join(';');
}
function pathXmlToJSon(pathXml, pAttr = {}) {
    let json = parseFormulaXml(pathXml, []);
    json.attr.d = calcuPathD(json.attr.d, [pAttr, json.attr]);
    return json;
}
/** 获取有外轮廓数据的面 */
function getX2dOuterPlane(x2dJson) {
    for (let plane of x2dJson.children) {
        if (["PlaneXY", "PlaneYZ", "PlaneXZ"].includes(plane.node) && plane.children.length > 0) {
            return plane;
        }
    }
}
/** 过滤掉不需要添加的属性 */
function filterAttr(attr, filterKeys = []) {
    for (let key in attr) {
        // 删除带$开头的字段、空值的字段
        if (key.match(/^\$+/) || (!attr[key] && attr[key] !== 0 && attr[key] !== false)) {
            delete attr[key];
        }
        if (filterKeys.includes(key)) {
            delete attr[key];
        }
    }
}
/** 通过x2dGraph节点得到图元路径 */
function getGraphPathD(list, isClosePath = false) {
    let d = '';
    for (let i = 0; i < list.length; i++) {
        let attr = list[i].attr;
        if (list[i].node === 'Point') {
            if (i === 0)
                d += `m ${attr['$X']} ${attr['$Y']}`;
            else
                d += `,l ${attr['$X']} ${attr['$Y']}`;
        }
        else if (list[i].node === 'Arc') {
            if (i === 0) {
                d += `m ${attr['$X']} ${attr['$Y']}`;
            }
            d += `,a ${attr['$X']} ${attr['$Y']} ${attr['$R']} ${attr['$StartAngle']} ${attr['$Angle']}`;
        }
        else if (list[i].node === 'TArc') {
            if (i === 0) {
                d += `m ${attr['$X']} ${attr['$Y']}`;
            }
            d += `,ta ${attr['$X']} ${attr['$Y']} ${attr['$X2']} ${attr['$Y2']} ${attr['$ChordH']} ${attr['$IsBulge']}`;
        }
        // if (isClosePath && i === list.length - 1) {
        //     // 处理由dxf导入的Arc节点
        //     if(list[0].node === 'Arc' || list[i].node === 'Arc'){
        //         break
        //     }
        //     d += `,l ${list[0].attr['$X']} ${list[0].attr['$Y']}`
        // }
    }
    if (isClosePath) {
        d += ',z;';
    }
    else {
        d += ';'; // 一条路径结束用分号
    }
    // console.log(d);
    return d;
}
let mouse = new Mouse();
class BDCorrect {
    /** BD智能纠错 */
    static bdAIErrorCorrect(bdXml, errors = [], cfg, callback, otherOP) {
        let r = this.isDoAIErrorCorrect(errors, cfg);
        if (!r.isDo) {
            callback && callback(r);
            return;
        }
        // 用于调试用的
        if (typeof localStorage != "undefined" && localStorage.getItem("bdCorrectDebug")) {
            let obj = { bdXml, errors, cfg };
            let str = JSON.stringify(obj);
            console.log(str);
            DomUtil.copyStr(str);
        }
        let safetyDistances = this.getBdSafetyDistance(cfg);
        let bdJson = parseFormulaXml(bdXml, ["HDirect", "X1type", "Rtype"], {
            isSaveAttrOldVal: false
        });
        console.log(errors);
        /** 其他配置数据 */
        let op = { th: bdJson.attr.BH, w: bdJson.attr.W, l: bdJson.attr.L };
        let { range, abnormalBHoles, hcList, otherNodes } = this.preAnalyseBd(bdJson, op, errors);
        if (otherOP === null || otherOP === void 0 ? void 0 : otherOP.prevCB) {
            otherOP.prevCB(hcList, op);
        }
        abnormalBHoles.forEach(hc => {
            this.correctHC(hc, hcList, op, range, safetyDistances);
        });
        /** 碰撞个数 */
        let collisions = this.checkCollision(abnormalBHoles, hcList); // 碰撞的个数
        let bdFaceNodes = {
            A: [],
            B: []
        };
        let list = hcList.concat(otherNodes);
        list.forEach(node => {
            let face = node.attr.Face;
            if (bdFaceNodes[face]) {
                bdFaceNodes[face].push(node);
            }
        });
        bdJson.children.forEach((node) => {
            if (node.node === "FaceA") {
                node.children = bdFaceNodes.A;
            }
            else if (node.node === "FaceB") {
                node.children = bdFaceNodes.B;
            }
        });
        let xml = XmlUtil.toXml(bdJson);
        let noCorrectCodes = this.getNoTCorrectCodes(errors);
        let message = "智能纠错完成";
        let msgType = "success";
        if (noCorrectCodes.length > 0) {
            msgType = "warning";
            message = `智能纠错完成：存在 ${noCorrectCodes.join("、")} 类型错误无法处理，请到板件编辑器手动纠错`;
        }
        else if (collisions > 0) {
            msgType = "warning";
            message = `智能纠错完成：仍存在${collisions}个错误，请重新点击纠错，或到板件编辑器手动纠错`;
        }
        let isCurrentNoChangeFace = false;
        let isCurrentNoChangeFaceA = false;
        let isCurrentNoChangeFaceB = false;
        let isCurrentNoChangeGraph = true;
        let isNoChangeFaceA = false;
        let isNoChangeFaceB = false;
        let isNoChangeFace = false;
        let checkData = { isNoChangeFaceA, isNoChangeFaceB, isNoChangeFace, isCurrentNoChangeFace, isCurrentNoChangeFaceA, isCurrentNoChangeFaceB, isCurrentNoChangeGraph };
        callback && callback({
            state: 1,
            xml,
            msgType,
            message,
            noCorrectCodes,
            collisions, checkData
        });
        return xml;
    }
    /** 判断是否需要纠错 */
    static isDoAIErrorCorrect(errors = [], cfg) {
        if (errors.length === 0) {
            return {
                state: 0,
                isDo: false,
                msgType: "error",
                message: "未获取到检测错误编码"
            };
        }
        else if (!cfg) {
            return {
                state: 0,
                isDo: false,
                msgType: "error",
                message: "未获取到BD安全距离配置"
            };
        }
        return {
            isDo: true,
        };
    }
    /** 判断无法处理的类型 */
    static getNoTCorrectCodes(errors) {
        let arr = [];
        errors.forEach(err => {
            //@ts-ignore
            let code = Number(err.errortag);
            if (!this.canDoErrorCodes.includes(code)) {
                arr.push(code);
            }
        });
        return arr;
    }
    /** xml转为json */
    static bdToJson(bd) {
        return typeof bd === "string" ? XmlUtil.toJson(bd)[0] : bd;
    }
    /** 获取BD安全距离配置 */
    static getBdSafetyDistance(cfg = {}) {
        // 用于转换为错误编码对应安全距离的值
        let table = {
            safetyDistance101: '101',
            safetyDistance102: '102',
            safetyDistance103: '103',
            safetyDistance104: '104',
            safetyDistance109: ['109', '108'],
            safetyDistance112: ['112', '113'],
            safetyDistance121: '121',
        };
        let safetyDistances = {};
        let key;
        for (key in table) {
            let errorCode = table[key];
            let val = Number(cfg[key] || 0);
            if (Array.isArray(errorCode)) {
                errorCode.forEach(code => {
                    safetyDistances[code] = val;
                });
            }
            else {
                safetyDistances[errorCode] = val;
            }
        }
        return safetyDistances;
    }
    /**
     * 生成GUID
     * @return {string}
     */
    static get guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        let guid = "";
        for (let i = 0; i < 8; i++) {
            guid += S4();
        }
        return guid.toUpperCase();
    }
    /** 分析bdJson的异常孔位结果 */
    static preAnalyseBd(bdJson, op, errors) {
        let { L: l, W: w } = bdJson.attr;
        l = Number(l);
        w = Number(w);
        let range = {
            minx: 0,
            miny: 0,
            maxx: l,
            maxy: w
        };
        let abnormalBHoles = []; // 需要操作的异常大饼孔（垂直孔和槽不移动）
        let list = [];
        let otherNodes = []; // 不是孔槽的节点
        // 提取孔槽,并添加额外属性
        bdJson.children.forEach((node) => {
            if (["FaceA", "FaceB"].includes(node.node)) {
                node.children.forEach((node) => {
                    if (["BHole", "VHole", "Cut"].includes(node.node)) {
                        node.id = this.guid;
                        // 添加包围盒
                        node.range = this.getBdHcBox(node.node, node.attr, range);
                        node.rangeZ = this.getHoleZ(node, op);
                        node.errorHcs = {}; // 与之碰撞的其他孔槽
                        list.push(node);
                    }
                    else {
                        otherNodes.push(node);
                    }
                });
            }
        });
        errors.forEach(err => {
            let { errortag, obj1, obj2 } = err;
            let matchHc1 = null;
            let matchHc2 = null;
            for (let i = 0; i < list.length; i++) {
                let hc = list[i];
                if (this.matchErrorObj(obj1, hc) && !matchHc1) {
                    matchHc1 = hc;
                }
                else if (this.matchErrorObj(obj2, hc) && !matchHc2) {
                    matchHc2 = hc;
                }
                if (matchHc1 && matchHc2) {
                    break;
                }
            }
            if (matchHc1 && matchHc2) {
                let abnormalBHole;
                let otherHc;
                if (matchHc1.node === "BHole") {
                    abnormalBHole = matchHc1;
                    otherHc = matchHc2;
                }
                else if (matchHc2.node === "BHole") {
                    abnormalBHole = matchHc2;
                    otherHc = matchHc1;
                }
                if (abnormalBHole && otherHc) {
                    if (!abnormalBHole.errorHcs) {
                        abnormalBHole.errorHcs = {};
                        abnormalBHole.errorHcs[errortag] = [otherHc];
                    }
                    else {
                        if (!abnormalBHole.errorHcs[errortag]) {
                            abnormalBHole.errorHcs[errortag] = [];
                        }
                        abnormalBHole.errorHcs[errortag].push(otherHc);
                    }
                    abnormalBHoles.push(abnormalBHole);
                }
            }
        });
        return {
            range,
            abnormalBHoles,
            hcList: list,
            otherNodes
        };
    }
    /** BD的孔槽是否匹配李涛提供的错误节点 */
    static matchErrorObj(obj, hc) {
        if (!obj)
            return false;
        let { Type, X: x1, Y: y1 } = obj;
        let { X: x2, Y: y2 } = hc.attr;
        let isCheck = false; // 是否需要匹配检测
        if (Type === "Hole" && ["BHole", "VHole"].includes(hc.node)) {
            isCheck = true;
        }
        else if (Type === "Cut" && hc.node === "Cut") {
            isCheck = true;
        }
        if (isCheck && x1 === x2 && y1 === y2) {
            return true;
        }
        return false;
    }
    /** 计算BD的孔槽的包围盒 */
    static getBdHcBox(nodeType, attr, bdRange = {}) {
        let minx = 0;
        let miny = 0;
        let maxx = 0;
        let maxy = 0;
        let { X, Y, R, Rb, HDirect, X1, Y1, Hole_Z: w, Rbdepth } = attr;
        let diameter = R || Rb; // 直径。若是大饼孔，R可能为0
        let r = diameter / 2;
        if (["BHole", "VHole"].includes(nodeType)) {
            // jeef,做法
            if (nodeType == "BHole") {
                if (HDirect === "L") {
                    minx = X - Rbdepth;
                    miny = Y - r;
                    maxx = X;
                    maxy = Y + r;
                }
                else if (HDirect === "R") {
                    minx = X;
                    miny = Y - r;
                    maxx = X + Rbdepth;
                    maxy = Y + r;
                }
                else if (HDirect === "U") {
                    minx = X - r;
                    miny = Y;
                    maxx = X + r;
                    maxy = Y + Rbdepth;
                }
                else if (HDirect === "D") {
                    minx = X - r;
                    miny = Y - Rbdepth;
                    maxx = X + r;
                    maxy = Y;
                }
            }
            else {
                minx = X - r;
                miny = Y - r;
                maxx = X + r;
                maxy = Y + r;
            }
            // 旧做法
            // minx = X - r
            // miny = Y - r
            // maxx = X + r
            // maxy = Y + r
            if (nodeType === "BHole") {
                if (HDirect === "L") {
                    minx = bdRange.minx || minx;
                }
                else if (HDirect === "R") {
                    maxx = bdRange.maxx || maxx;
                }
                else if (HDirect === "U") {
                    maxy = bdRange.maxy || maxy;
                }
                else if (HDirect === "D") {
                    miny = bdRange.miny || miny;
                }
            }
        }
        else if (nodeType === "Cut") {
            let d = w / 2;
            if (X === X1 && Y !== Y1) {
                // 竖槽
                let [y1, y2] = Y < Y1 ? [Y, Y1] : [Y1, Y];
                minx = X - d;
                miny = y1;
                maxx = X + d;
                maxy = y2;
            }
            else if (Y === Y1 && X !== X1) {
                // 横槽
                let [x1, x2] = X < X1 ? [X, X1] : [X1, X];
                minx = x1;
                miny = Y - d;
                maxx = x2;
                maxy = Y + d;
            }
        }
        return {
            minx,
            miny,
            maxx,
            maxy
        };
    }
    /** 纠正错误的孔槽（目前只考虑大饼孔BHole） */
    static correctHC(hc, otherHcs, op, range, safetyDistances) {
        if (hc.errorHcs) {
            for (let code in hc.errorHcs) {
                let hcs = hc.errorHcs[code]; // 与之碰撞的孔槽
                let numCode = Number(code);
                let otherHc = hcs[0];
                let safetyDistance = safetyDistances[numCode];
                let offset = this.getBestShouldMoveD(numCode, hc, otherHc, op, safetyDistance, range, otherHcs);
                if (offset) {
                    hc.attr.X += offset.dx;
                    hc.attr.Y += offset.dy;
                    hc.range = this.getBdHcBox(hc.node, hc.attr, range);
                    return true;
                }
            }
            return false;
        }
    }
    /** 获取移动方向 */
    static getMoveDirect(from, to, isReverse = 1) {
        return (from - to > 0 ? -1 : 1) * isReverse;
    }
    /** 判断包围盒是否碰撞 */
    static boxCollision(box1, box2) {
        // 判断水平方向是否碰撞
        let horizontal = box1.maxx > box2.minx && box1.minx < box2.maxx;
        // 判断垂直方向是否碰撞
        let vertical = box1.miny < box2.maxy && box1.maxy > box2.miny;
        return horizontal && vertical;
    }
    /** 获取最佳移动距离 */
    static getBestShouldMoveD(code, moveHc, otherHc, op, safetyDistance = 0, range, otherHcs = []) {
        let [offset1, offset2] = this.getShouldMoveDs(code, moveHc, otherHc, op, safetyDistance, range);
        if (offset1.dx || offset1.dy) {
            let isCollision1 = this.isCollisionOtherAfterMove(moveHc, otherHcs, op, offset1, range);
            if (isCollision1 == -1) {
                let r1 = this.isBHoleOutBDAfterMove(moveHc, offset1, range);
                if (!r1) {
                    return offset1;
                }
            }
        }
        if (offset2.dx || offset2.dy) {
            let isCollision2 = this.isCollisionOtherAfterMove(moveHc, otherHcs, op, offset2, range);
            if (isCollision2 == -1) {
                let r2 = this.isBHoleOutBDAfterMove(moveHc, offset2, range);
                if (!r2) {
                    return offset2;
                }
            }
        }
        console.warn("超出移动范围,无法移动");
    }
    /** 判断大饼孔移动是否和其他孔槽碰撞
     * @returns -1为没碰到,index为碰到的序号
     */
    static isCollisionOtherAfterMove(hc, otherHcs, op, offset, range) {
        // jeef,增加深度判断
        let z1 = hc.rangeZ;
        let isInterZList = otherHcs.map(c => {
            let z2 = c.rangeZ;
            return this.isInterZ(z1, z2);
        });
        // let {
        //   X,
        //   Y,
        //   HDirect,
        //   R,
        // } = hc.attr
        // let newAttr= {
        //   HDirect,
        //   R,
        //   X: X + offset.dx,
        //   Y: Y + offset.dy
        // }
        // let box = this.getBdHcBox("BHole",newAttr, range)
        let box = this.getBHoleBoxAfterMove(hc, offset, range);
        let targetRect = PosUtil.getRectByTwoPos(new JPos(box.minx, box.miny), new JPos(box.maxx, box.maxy));
        for (let i = 0; i < otherHcs.length; i++) {
            let hc2 = otherHcs[i];
            // 深度不碰撞跳过
            if (!isInterZList[i]) {
                continue;
            }
            if (hc.id == hc2.id) {
                continue;
            }
            let otherRect = PosUtil.getRectByTwoPos(new JPos(hc2.range.minx, hc2.range.miny), new JPos(hc2.range.maxx, hc2.range.maxy));
            let check = PosUtil.getTwoRectRelationship(targetRect, otherRect);
            if (check == "halfInclude" || check == "onlyCut" || check == "inInclude" || check == "outInclude" || check == "same") {
                return i;
            }
            // if (this.boxCollision(box, hc2.range)) {
            //   return i
            // }
        }
        return -1;
    }
    /** 判断大饼孔移动是否超出板件范围 */
    static isBHoleOutBDAfterMove(hc, offset, range) {
        let box = this.getBHoleBoxAfterMove(hc, offset, range);
        // let r = this.boxCollision(box, range)
        if (box.maxx > range.maxx || box.minx < range.minx || box.maxy > range.maxy || box.miny < range.miny) {
            return true;
        }
        return false;
    }
    /** 获取大饼孔移动后的包围盒 */
    static getBHoleBoxAfterMove(bhole, offset, range) {
        let { X, Y, HDirect, R, } = bhole.attr;
        let newAttr = {
            HDirect,
            R,
            X: X + offset.dx,
            Y: Y + offset.dy
        };
        let box = this.getBdHcBox("BHole", newAttr, range);
        return box;
    }
    /** 获得两个相反方向的移动距离 */
    static getShouldMoveDs(code, moveHc, otherHc, op, safetyDistance = 0, range = {}) {
        let offset1 = this.getShouldMoveD(code, moveHc, otherHc, op, safetyDistance, range);
        let offset2 = this.getShouldMoveD(code, moveHc, otherHc, op, safetyDistance, range, -1);
        return [offset1, offset2];
    }
    /** jeef, 获取孔深数据 */
    static getHoleZ(hc, op) {
        let min = 0;
        let max = Infinity;
        let face = hc.attr.Face;
        if (hc.node == "VHole") {
            if (face == "B") {
                min = op.th - hc.attr.Rdepth;
                max = op.th;
            }
            else {
                min = 0;
                max = hc.attr.Rdepth;
            }
        }
        else if (hc.node == "BHole") {
            let d = hc.attr.Hole_Z;
            if (face == "B") {
                d = op.th - hc.attr.Hole_Z;
            }
            min = d - hc.attr.Rb / 2;
            max = d + hc.attr.Rb / 2;
        }
        else if (hc.node == "Cut") {
            if (face == "B") {
                min = op.th - hc.attr.Cutter;
                max = op.th;
            }
            else {
                min = 0;
                max = hc.attr.Cutter;
            }
        }
        return { min, max };
    }
    /** jeef, 深度是否碰撞 */
    static isInterZ(z1, z2) {
        let a1 = z1.max - z1.min;
        let b1 = z2.max - z2.min;
        let max = Math.max(z1.max - z2.min, z2.max - z1.min);
        return max < (a1 + b1);
    }
    /** 获取孔的坐标移动值 */
    static getShouldMoveD(code, moveHc, otherHc, op, safetyDistance = 0, range = {}, isReverse = 1) {
        let dx = 0;
        let dy = 0;
        let cx = (range.minx + range.maxx) / 2;
        let cy = (range.miny + range.maxy) / 2;
        let direct = moveHc.attr.HDirect;
        let x1 = moveHc.attr.X;
        let y1 = moveHc.attr.Y;
        let z1 = moveHc.rangeZ;
        let R1 = moveHc.attr.R || 0;
        let Rb1 = moveHc.attr.Rb || 0;
        // let { HDirect: direct, X: x1, Y: y1, R: R1 = 0, Rb: Rb1 = 0 } = moveHc.attr
        let x2 = otherHc.attr.X;
        let y2 = otherHc.attr.Y;
        let z2 = otherHc.rangeZ;
        let R2 = otherHc.attr.R || 0;
        let Rb2 = otherHc.attr.Rb || 0;
        let w = otherHc.attr.Hole_Z;
        // let { X: x2, Y: y2, R: R2 = 0, Rb: Rb2 = 0, Hole_Z: w } = otherHc.attr
        /** 直径。若是大饼孔，R可能为0 */
        let diameter1 = R1 || Rb1; // 直径。若是大饼孔，R可能为0
        /** 直径。若是大饼孔，R可能为0 */
        let diameter2 = R2 || Rb2; // 直径。若是大饼孔，R可能为0
        let r1 = diameter1 / 2;
        let r2 = diameter2 / 2;
        /** 大饼孔的水平孔半径 */
        let r3 = Rb1 / 2; // 大饼孔的水平孔半径
        /** 最终最小距离 */
        let dist = 0; // 最终最小距离
        /** 1或-1  */
        let moveDirect = 1; // 1或-1 
        // jeef,增加深度碰撞
        if (!this.isInterZ(z1, z2)) {
            return { dx, dy };
        }
        if ([103, 104, 112, 113].includes(code)) {
            // 孔位相交
            dist = r1 + r2 + safetyDistance;
            if (["L", "R"].includes(direct)) {
                // 上下移动
                moveDirect = this.getMoveDirect(y1, cy, isReverse);
                let endy = y2 + (dist * moveDirect);
                dy = endy - y1;
            }
            else {
                // 左右移动
                moveDirect = this.getMoveDirect(x1, cx, isReverse);
                let endx = x2 + (dist * moveDirect);
                dx = endx - x1;
            }
        }
        else if ([101, 102].includes(code)) {
            // 孔位超出板件
            if (["L", "R"].includes(direct)) {
                // 上下移动
                let endy;
                if (y1 > cy) {
                    endy = range.maxy - safetyDistance;
                }
                else {
                    endy = range.miny + safetyDistance;
                }
                dy = endy - y1;
            }
            else {
                // 左右移动
                let endx;
                if (x1 > cx) {
                    endx = range.maxx - safetyDistance;
                }
                else {
                    endx = range.minx + safetyDistance;
                }
                dx = endx - x1;
            }
        }
        else if ([108, 109, 121].includes(code)) {
            // 孔槽相交
            let d = w / 2;
            dist = r1 + d + safetyDistance;
            if (["L", "R"].includes(direct)) {
                // 上下移动
                moveDirect = this.getMoveDirect(y1, cy, isReverse);
                let endy = y2 + (dist * moveDirect);
                dy = endy - y1;
            }
            else {
                // 左右移动
                moveDirect = this.getMoveDirect(x1, cx, isReverse);
                let endx = x2 + (dist * moveDirect);
                dx = endx - x1;
            }
        }
        return {
            dx,
            dy
        };
    }
    /** 检测异常孔移动后是否还存在碰撞 */
    static checkCollision(abnormalBHoles = [], allHcs = []) {
        let collisions = 0;
        for (let i = 0; i < abnormalBHoles.length; i++) {
            let hc1 = abnormalBHoles[i];
            let box1 = hc1.range;
            for (let j = 0; j < allHcs.length; j++) {
                let hc2 = allHcs[j];
                let box2 = hc2.range;
                if (hc1.id !== hc2.id) {
                    let r = this.boxCollision(box1, box2);
                    if (r) {
                        collisions++;
                    }
                }
            }
        }
        return collisions;
    }
}
/** 处理的错误编码 */
BDCorrect.canDoErrorCodes = [101, 102, 103, 104, 108, 109, 112, 113, 121];
// // 本地node环境测试
// module.exports = {
//   BDCorrect
// }
class BDUtilsClass {
    constructor() {
        this.data = {
            attr: { L: 1000, W: 1000, BH: 0, CncBack: 1 }
        };
        /**  */
        this.bdJson = null;
        /** 是否获取到数据 */
        this.hasData = false; // 是否获取到数据
        /** 当前板件的版面类型 */
        this.planeType = 'PlaneXY'; // 当前板件的版面类型
        /** 当前面的属性 */
        this.planeAttr = {}; // 当前面的属性
        this.curFileName = null;
        /**  孔位区间规则 */
        this.holeRules = null; // 孔位区间规则
        /** 孔位配置 */
        this.holeCfgs = {
            A: [],
            B: []
        }; // 孔位配置
        /** 保存孔位规则的id */
        this.holeCfgIds = {}; // 保存孔位规则的id（暂时不用）
        /** 不做计算公式的属性 */
        this.noCalcuAttrs = ["HDirect", "CutName", "Cutter", "Rtype", "Hole_Xcap", "Holenum_X", "Hole_Ycap", "Holenum_Y"];
    }
    // constructor() {
    //     this.decode = new BDDecode(this)
    // }
    initData(option, fn) {
        let bdJson;
        this.planeAttr = {};
        this.curFileName = null;
        this.holeRules = null;
        if (option.isJson) {
            bdJson = option.data;
        }
        else {
            let bdxml = option.xml;
            // console.log(bdxml);
            if (!bdxml) {
                console.log('xml为空');
                this.cleanData();
                fn();
                return;
            }
            bdJson = XmlUtil.toJson(bdxml)[0];
        }
        if (!window.currentBDEnv || window.currentBDEnv == "bd编辑器") {
            if (bdJson) {
                this.initDdJsonData(bdJson, option.fileName, fn);
            }
            else {
                this.cleanData();
                fn();
            }
        }
        else if (window.currentBDEnv == "矢量图") {
            //jeef,增加新变量
            if (bdJson.attr["lengthen"] == undefined) {
                bdJson.attr["lengthen"] = "0";
            }
            this.filterNoPlaneNode(bdJson);
            this.planeType = this.getX2dPlane(bdJson).type;
            this.planeAttr = {};
            this.x2dToBd(bdJson);
            this.checkGraphChildren(this.data);
            // 处理非合理属性
            for (let key in this.data.attr) {
                let value = this.data.attr[key];
                if ((value !== 0 && value !== false) &&
                    (!value || value === 'undefined')) {
                    this.data.attr[key] = '';
                }
            }
            this.data.attr.CncBack = this.data.attr.CncBack || 0;
            this.hasData = true;
            fn(this.data);
        }
    }
    /** 加载bd的json数据初始化 */
    initDdJsonData(bdJson, filename, fn) {
        this.curFileName = filename;
        this.planeType = this.getX2dPlane(bdJson).type;
        this.planeAttr = {};
        bdDecode.initHoleInfo(bdJson);
        bdDecode.initBDJson(bdJson);
        this.data = this.calculate(bdJson);
        // jeef,我的解析数据初始化
        bdDecode.init();
        this.transformRuleList(this.data);
        // console.log(bdJson,this.data);
        this.checkGraphChildren(this.data);
        // 处理非合理属性
        for (let key in this.data.attr) {
            let value = this.data.attr[key];
            //@ts-ignore
            if ((value !== 0 && value !== false) &&
                (!value || value === 'undefined')) {
                this.data.attr[key] = '';
            }
        }
        this.data.attr.CncBack = Number(this.data.attr.CncBack) || 0;
        this.hasData = true;
        fn(this.data);
        // @ts-ignore
        transform2d.rotation = cncbacks[this.data.attr.CncBack];
    }
    /** 清空重置数据 */
    clearData() {
        this.curFileName = null;
        this.resetData();
    }
    changeData(data, onlySetGraph) {
        let graph = this.data.children.filter((item) => item.node === 'Graph')[0];
        if (graph) {
            this.planeAttr = graph.attr;
        }
        // 设置全局属性
        for (let key in data.attr) {
            this.data.attr[key] = data.attr[key];
        }
        if (onlySetGraph) {
            graph.children = data.children[0].children;
        }
        else {
            this.data.attr.CncBack = Number(this.data.attr.CncBack) || 0;
            //@ts-ignore
            transform2d.rotation = cncbacks[this.data.attr.CncBack];
            this.data.children = data.children;
        }
        // jeef 修复tarc圆弧
        let lastGraph = this.data.children.filter((item) => item.node === 'Graph')[0];
        if (lastGraph) {
            bdDecode.tArcRepair(lastGraph);
        }
    }
    resetData() {
        this.data = { attr: { L: 1000, W: 1000, BH: 0, CncBack: 1 } };
        this.bdJson = null;
        this.hasData = false;
    }
    checkGraphChildren(board) {
        for (let i = 0; i < board.children.length; i++) {
            if (board.children[i].node === 'Graph') {
                board.children[i].children = this.checkIntegrity(board.children[i].children);
                break;
            }
        }
    }
    // 检测点弧的完整，自动补点
    checkIntegrity(list) {
        // list = this.complementPoints(list) // 补点会出现问题，不能带公式
        list = this.filterPoint(list);
        return list;
    }
    // 根据圆弧补充点
    complementPoints(list) {
        let result = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].node === 'Point') {
                result.push(list[i]);
            }
            else if (list[i].node === 'Arc') {
                let arc = HGArcToCanvasArc({
                    start: { x: list[i].attr.X.value, y: list[i].attr.Y.value },
                    r: list[i].attr.R.value,
                    startAngle: list[i].attr.StartAngle.value,
                    angle: list[i].attr.Angle.value
                });
                let start = this.createPointNode(arc.start.x, arc.start.y);
                let end = this.createPointNode(arc.end.x, arc.end.y);
                start.attr.X.formula = list[i].attr.X.formula;
                start.attr.Y.formula = list[i].attr.Y.formula;
                result.push(start, list[i], end);
            }
        }
        return result;
    }
    /** 过滤重复的点 */
    filterPoint(list) {
        let result = [];
        for (let i = 0; i < list.length; i++) {
            let n = list[i];
            let next = i === list.length - 1 ? list[0] : list[i + 1];
            let isAdd = true;
            if (n.node === 'Point' && next.node === 'Point') {
                let x1 = n.attr.X.value;
                let y1 = n.attr.Y.value;
                let x2 = next.attr.X.value;
                let y2 = next.attr.Y.value;
                let d = math2d.getLineLength(x1, y1, x2, y2);
                if (d < 0.1) {
                    isAdd = false;
                }
            }
            if (isAdd)
                result.push(n);
        }
        return result;
    }
    /** 创建点 */
    createPointNode(x, y) {
        return {
            node: 'Point',
            attr: {
                X: { value: x, formula: x },
                Y: { value: y, formula: y }
            },
            children: []
        };
    }
    /** 获取板件的数据 */
    getBoardData(xml) {
        let json = XmlUtil.toJson(xml)[0];
        this.addHoleCutAttr(json);
        let data = this.calculate(json);
        data = this.cleanData(data);
        return data;
    }
    /** 获取板件的数据 */
    getBoardData2(str) {
        let objJson;
        if (this.mode === 0) {
            let obj = JSON.parse(str);
            objJson = XmlUtil.toJson(obj.xml)[0];
        }
        else {
            if (!str) {
                console.log('没有数据');
                return;
            }
            objJson = XmlUtil.toJson(str)[0];
        }
        this.addHoleCutAttr(objJson);
        let data = this.calculate(objJson);
        data = this.cleanData(data);
        return data;
    }
    /** 获取<Graph>节点数据 */
    getGraphData() {
        return getGraphNode(this.data, 'Graph');
    }
    /** 补充缺失的属性 */
    addHoleCutAttr(obj) {
        let attrs = {
            VHole: ['R', 'X', 'Y', 'Hole_Xcap', 'Holenum_X', 'Holenum_Y', 'Hole_Ycap', 'Holenum_Y'],
            BHole: ['R', 'X', 'Y', 'Rb', 'Hole_Z', 'X1', 'HDirect', 'Hole_Xcap', 'Holenum_X', 'Holenum_Y', 'Hole_Ycap', 'Holenum_Y'],
            Cut: ['X', 'Y', 'X1', 'Y1', 'CutName', 'Hole_Z', 'Cutter']
        };
        obj.children.forEach((item) => {
            if (item.node !== 'Graph') {
                item.children.forEach((child) => {
                    //@ts-ignore
                    let attr = attrs[child.node];
                    if (attr) {
                        attr.forEach((key) => {
                            if (!child.attr.hasOwnProperty(key)) {
                                child.attr[key] = {
                                    formula: '',
                                    value: ''
                                };
                            }
                        });
                    }
                });
            }
        });
    }
    /** 计算节点的属性公式 */
    calculate(obj) {
        let childs = obj.children;
        /** 不计算公式的属性 */
        let noCalculate = ['HDirect', 'Face', 'CutName', 'Cutter', 'd', 'name', 'Id', "userdata"]; // 不计算公式的属性
        /**  需要直接添加公式的属性 */
        let addFormulaAttr = ['HDirect', 'CutName', 'Cutter', 'Rtype', "KeyName"]; // 需要直接添加公式的属性
        let l = Number(obj.attr.L);
        let w = Number(obj.attr.W);
        for (let i = 0; i < childs.length; i++) {
            let items = childs[i].children;
            for (let j = 0; j < items.length; j++) {
                let item = items[j];
                for (let key in item.attr) {
                    if (typeof item.attr[key] === 'object') {
                    }
                    else {
                        let formula = item.attr[key];
                        if (noCalculate.indexOf(key) === -1 && !isChina(formula)) {
                            //  读取同级变量
                            let value = calcFormula(formula, [obj.attr, this.planeAttr]);
                            if (!value && value !== 0) {
                                value = '';
                            }
                            if (isNumber(formula))
                                formula = math2d.round(formula, 3);
                            //@ts-ignore
                            item.attr[key] = {
                                formula,
                                value
                            };
                        }
                        if (addFormulaAttr.indexOf(key) > -1) {
                            //@ts-ignore
                            item.attr[key] = {
                                formula,
                                value: formula
                            };
                        }
                    }
                }
                if (item.node === 'BHole' || item.node === 'VHole') {
                    this.calcuHole(item, l, w);
                }
            }
        }
        return obj;
    }
    /** 获取板件的属性 */
    getBoardAttr() {
        this.data.attr.planeType = this.planeType; // 投影面
        return this.data.attr;
    }
    /** 获取孔槽 */
    getFaceData(type, lines) {
        if (this.data) {
            let items = {
                A: [],
                B: []
            };
            this.data.children.forEach((item) => {
                if (item.node === 'FaceA' || item.node === 'FaceB') {
                    item.children.forEach((Node) => {
                        if (type === 'hole') {
                            if (Node.node === 'VHole' || Node.node === 'BHole') {
                                let hole = new Hole(Node.attr, Node.node, this);
                                hole.guid = Node.guid;
                                if (item.node === 'FaceA') {
                                    hole.FaceV = "A";
                                    items.A.push(hole);
                                }
                                else {
                                    hole.FaceV = "B";
                                    items.B.push(hole);
                                }
                            }
                        }
                        if (type === 'cut') {
                            if (Node.node === 'Cut') {
                                let cut = new Cut(Node.attr);
                                // jeef增加我的guid
                                cut.guid = Node.guid;
                                cut.fromParent = Node.fromParant;
                                cut.isOutKC = Node.isOutKC;
                                cut.NotStandard = Node.NotStandard;
                                if (item.node === 'FaceA') {
                                    items.A.push(cut);
                                }
                                else {
                                    items.B.push(cut);
                                }
                            }
                        }
                        if (type === 'path') {
                            if (Node.node === 'Path') {
                                let path = new Path2DX(Node.attr);
                                if (item.node === 'FaceA') {
                                    items.A.push(path);
                                }
                                else {
                                    items.B.push(path);
                                }
                            }
                        }
                    });
                }
            });
            return items;
        }
    }
    /** 清理无用数据 */
    cleanData(data) {
        if (!data) {
            return data;
        }
        let nodes, lastNode;
        data.children.forEach((child) => {
            if (child.node === 'Graph') {
                nodes = child.children;
            }
        });
        // 清除半径为0的弧
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node === 'Arc') {
                if (nodes[i].attr.R.value === 0) {
                    nodes.splice(i, 1);
                    i--;
                }
            }
        }
        // 清除相邻的两个重合的点
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (lastNode) {
                if (lastNode.node === 'Point' && node.node === 'Point') {
                    let x1 = lastNode.attr.X.value;
                    let y1 = lastNode.attr.Y.value;
                    let x2 = node.attr.X.value;
                    let y2 = node.attr.Y.value;
                    if (x1 === x2 && y1 === y2) {
                        nodes.splice(i, 1);
                        i--;
                    }
                }
            }
            lastNode = node;
        }
        // 如果起始点点跟末点重合，删除末点
        let first = nodes[0];
        let last = nodes[nodes.length - 1];
        if (first.node === 'Point' && last.node === 'Point') {
            let x1 = first.attr.X.value;
            let y1 = first.attr.Y.value;
            let x2 = last.attr.X.value;
            let y2 = last.attr.Y.value;
            if (x1 === x2 && y1 === y2) {
                nodes.splice(nodes.length - 1, 1);
            }
        }
        return data;
    }
    /** 设置节点属性的值 */
    setBdAttr(json) {
        json.children.forEach((node) => {
            node.children.forEach((cNode) => {
                let attr = cNode.attr;
                for (let key in attr) {
                    if (typeof attr[key] === 'object') {
                        attr[key] = attr[key].formula;
                    }
                    else {
                        if (attr[key] == null) {
                            attr[key] = '';
                        }
                    }
                }
            });
        });
        return json;
    }
    /** 获取x2d有数据的一面 */
    getX2dPlane(x2dJson) {
        for (let i = 0; i < x2dJson.children.length; i++) {
            let plane = x2dJson.children[i];
            if (plane.children.length > 0) {
                return {
                    type: plane.node,
                    node: plane
                };
            }
        }
        return { type: '', node: null };
    }
    /** x2d转换成bd */
    x2dToBd(x2dJson) {
        let bdJson = {
            node: 'Board',
            attr: {
                L: 1000,
                W: 1000
            },
            children: [
                { node: 'Graph', attr: {}, children: [] },
                { node: 'FaceA', attr: {}, children: [] },
                { node: 'FaceB', attr: {}, children: [] }
            ]
        };
        for (let key in x2dJson.attr) {
            if (x2dJson.attr[key] !== 'undefined' && x2dJson.attr[key] !== undefined) {
                //@ts-ignore
                bdJson.attr[key] = x2dJson.attr[key];
            }
        }
        let graphChildren = [];
        let faceAChildren = [];
        let faceBChildren = [];
        for (let i = 0; i < x2dJson.children.length; i++) {
            let plane = x2dJson.children[i];
            if (plane.children.length > 0) {
                this.planeAttr = plane.attr;
                for (let node of plane.children) {
                    if (node.node === 'Extra') {
                        for (let item of node.children) {
                            if (item.node === 'FaceA') {
                                faceAChildren = item.children;
                            }
                            else if (item.node === 'FaceB') {
                                faceBChildren = item.children;
                            }
                        }
                    }
                    else {
                        graphChildren.push(node);
                    }
                }
                break;
            }
        }
        if (!window.currentBDEnv || window.currentBDEnv == "bd编辑器") {
            bdJson.children[0].children = graphChildren;
            bdJson.children[1].children = faceAChildren;
            bdJson.children[2].children = faceBChildren;
            return bdJson;
        }
        else if (window.currentBDEnv == "矢量图") {
            bdJson.children[0].children = graphChildren.map(node => this.deleteNodeSurplusAttr(node));
            bdJson.children[1].children = faceAChildren.map(node => this.deleteNodeSurplusAttr(node));
            bdJson.children[2].children = faceBChildren.map(node => this.deleteNodeSurplusAttr(node));
            this.data = this.calculate(bdJson);
            this.hasData = true;
        }
    }
    bdToX2d(bd, type) {
        let bdJson = this.setBdAttr(bd);
        let planes = ['PlaneXY', 'PlaneYZ', 'PlaneXZ']; // x2d的面板名称
        let table = { xy: 'PlaneXY', yz: 'PlaneYZ', xz: 'PlaneXZ' };
        // x2d对象
        let x2dJson = {
            node: 'Graph',
            attr: this.getGraphAttr(bd.attr),
            children: this.createX2dPlanes(planes)
        };
        let children = this.getX2dPlaneChildren(bdJson);
        let index = planes.indexOf(type ? table[type] : this.planeType);
        if (index !== -1) {
            let plane = x2dJson.children[index];
            plane.children.push(...children);
            // 给投影面添加属性
            plane.attr.Type = 'Polygon';
            plane.attr.Flag = 1;
            Object.assign(plane.attr, this.planeAttr);
        }
        else {
            console.log(`不存在${type}的投影面`);
        }
        return x2dJson;
    }
    /** 提取Board上的变量 */
    getGraphAttr(attrs) {
        let graphAttr = { V: 1 };
        //  x2d不需要的属性
        let filter = ['CncBack', 'planeType'];
        for (let key in attrs) {
            if (filter.indexOf(key) === -1) {
                graphAttr[key] = attrs[key];
            }
        }
        return graphAttr;
    }
    /** 获取x2d有数据的投影面的子节点children */
    getX2dPlaneChildren(bdJson) {
        let children = [];
        let extra = null;
        for (let node of bdJson.children) {
            if (node.node === 'Graph') {
                children.push(...node.children);
            }
            else {
                // A面或B面上有图元才添加<Extra>节点
                if (node.children.length > 0 && !extra) {
                    extra = { node: 'Extra', attr: {}, children: [] };
                }
                if (extra) {
                    let index = node.node === 'FaceA' ? 0 : 1;
                    extra.children[index] = node;
                }
            }
        }
        if (extra) {
            children.push(extra);
        }
        return children;
    }
    createX2dPlanes(types) {
        let defaultPlaneAttr = { Repeat: 0, Type: 'Rect', W: 'W', L: 'L', X: '0', Y: '0' }; // x2d的板面的默认属性以及其值
        return types.map(type => {
            return {
                node: type,
                attr: copyObject(defaultPlaneAttr),
                children: []
            };
        });
    }
    /** 暂弃。留作参考 */
    bdToX2d_old(bd, type) {
        let filter = ['CncBack', 'planeType'];
        let x2dAttr = ['L', 'W', 'V', 'BH', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP']; // x2d默认属性
        let planes = ['PlaneXY', 'PlaneYZ', 'PlaneXZ']; // x2d的面板名称
        let defaultPlaneAttr = { Repeat: 0, Type: 'Rect', W: 'W', L: 'L', X: '0', Y: '0' }; // x2d的板面的默认属性以及其值
        let x2dPlaneChildrenNodeAttr = ['X', 'Y', 'XA', 'YA', 'R', 'Rb', 'StartAngle', 'Angle', 'Hotspot', 'IsDim']; // x2d的节点属性
        let json = this.setBdAttr(bd);
        // let DI = parseInt(bd.attr.DI)
        let graphChildren = getGraphNode(json, 'Graph').children;
        // x2d对象
        let x2dJson = {
            node: 'Graph',
            attr: { V: 1 },
            children: []
        };
        for (let key in json.attr) {
            if (filter.indexOf(key) === -1) {
                x2dJson.attr[key] = json.attr[key];
            }
        }
        // 初始化x2d的板面属性
        planes.forEach(plane => {
            x2dJson.children.push({
                node: plane,
                attr: copyObject(defaultPlaneAttr),
                children: []
            });
        });
        // 获取板面的轮廓节点
        let x2dPlaneChildren = [];
        graphChildren.forEach((node) => {
            let x2dNode = {
                node: node.node,
                attr: {}
            };
            x2dPlaneChildrenNodeAttr.forEach(key => {
                //@ts-ignore
                x2dNode.attr[key] = node.attr[key] == null ? '' : node.attr[key];
            });
            x2dPlaneChildren.push(x2dNode);
        });
        let plane;
        if (type === 'PlaneXZ') { // PlaneXZ
            plane = x2dJson.children[0];
        }
        if (type === 'PlaneYZ') { // PlaneYZ
            plane = x2dJson.children[1];
        }
        if (type === 'PlaneXY') { // PlaneXY
            plane = x2dJson.children[2];
        }
        if (plane) {
            plane.attr.Type = 'Polygon';
            plane.attr.Flag = 1;
            plane.children = x2dPlaneChildren;
        }
        else {
            x2dJson.children[0].Type = 'Polygon';
            x2dJson.children[0].Flag = 1;
            x2dJson.children[0].children = x2dPlaneChildren;
        }
        return x2dJson;
    }
    /** 保存文件 */
    saveFile(type, fileText, name) {
        let fileTypeOpt = {
            x2d: ['.x2d', '*.x2d|*.x2d'],
            bd: ['.bd', '*.bd|*.bd'],
            dxf: ['.dxf', '*.dxf|*.dxf']
        };
        let fileType = fileTypeOpt[type][0];
        let fileName = (name || (this.data.attr.Name || '文件')) + fileType;
        exportRaw(fileName, fileText);
        return true;
    }
    /** 导出dxf */
    exportDxf(dxf, nodes, fileName) {
        let dxfText = dxf.toDxf(nodes);
        return this.saveFile('dxf', dxfText, fileName);
    }
    /** 计算孔间距 */
    calcuHole(hole, l, w) {
        let attr = hole.attr;
        // X方向孔间距
        if (attr.Hole_Xcap && attr.Holenum_X) {
            attr.Hole_Xcap.value = calcHoleCapFormula(attr.Hole_Xcap.value, attr.Holenum_X.value, l, attr.X.value);
        }
        // Y方向孔间距
        if (attr.Hole_Ycap && attr.Holenum_Y) {
            attr.Hole_Ycap.value = calcHoleCapFormula(attr.Hole_Ycap.value, attr.Holenum_Y.value, w, attr.Y.value);
        }
    }
    /** 处理RuleList节点 */
    transformRuleList(data) {
        let ruleListNode = data.children.filter((data) => data.node === 'RuleList')[0];
        if (ruleListNode) {
            this.holeRules = {};
            ruleListNode.children.forEach((rule) => {
                if (rule.attr.Id) {
                    this.holeRules[rule.attr.Id] = rule;
                }
            });
        }
    }
    /** 创建矩形的bd的xml */
    createBdXml(attr = {}, holeInfos = {}) {
        let { A = [], B = [] } = holeInfos;
        let attrStr = attrToStr(attr);
        let faceAStr = '';
        let faceBStr = '';
        function attrToStr(attr) {
            let str = '';
            for (let key in attr) {
                str += ` ${key}="${attr[key]}" `;
            }
            return str;
        }
        function nodeToXml(node) {
            return `<${node.node} ${attrToStr(node.attr)}></${node.node}>`;
        }
        // 添加孔位信息
        A.forEach(hole => {
            faceAStr += nodeToXml(hole);
        });
        B.forEach(hole => {
            faceBStr += nodeToXml(hole);
        });
        return `<?xml version="1.0" encoding="utf-8"?>
    <Board ${attrStr} planeType="Graph">
    <Graph>
      <Point IsDim="0" Hotspot="1" Y="0" X="0"></Point>
      <Point IsDim="0" Hotspot="1" Y="W" X="0"></Point>
      <Point IsDim="0" Hotspot="1" Y="W" X="L"></Point>
      <Point IsDim="0" Hotspot="1" Y="0" X="L"></Point>
    </Graph>
    <FaceA>${faceAStr}</FaceA>
    <FaceB>${faceBStr}</FaceB>
    </Board>`;
    }
    /** 重置BD的轮廓为矩形 */
    resetRect(graph) {
        let data = this.getGraphData();
        let l = Number(this.data.attr.L);
        let w = Number(this.data.attr.W);
        let values = [
            [0, 0, 0, 0],
            [0, 0, 'W', w],
            ['L', l, 'W', w],
            ['L', l, 0, 0]
        ];
        data.children = values.map(data => {
            return {
                node: 'Point',
                attr: {
                    X: { formula: data[0], value: Number(data[1]) },
                    Y: { formula: data[2], value: Number(data[3]) }
                },
                children: []
            };
        });
        if (graph) {
            graph.children.splice(0, graph.children.length);
            data.children.forEach((data) => {
                graph.children.push(data);
            });
        }
    }
    /** 匹配区间 */
    getHoleRange(ruleId) {
        if (ruleId && this.holeRules) {
            let rule = this.holeRules[ruleId];
            if (rule) {
                return rule.children.map((range) => range.attr);
            }
        }
    }
    /** 公式计算 */
    calcFormula(formula, key) {
        if (key) {
            if (this.noCalcuAttrs.indexOf(key) > -1) {
                return formula;
            }
        }
        return calcFormula(formula, [this.getBoardAttr(), this.planeAttr]);
    }
    // 给BD添加新的属性
    addBDAttr(bdJson) {
        // 统计开槽标识字段的值，生成KcFlag字段
        let cutnames = [];
        bdJson.children.forEach((node) => {
            if (node.node === 'FaceA' || node.node === 'FaceB') {
                node.children.forEach((kc) => {
                    var _a;
                    if (kc.node === 'Cut') {
                        let cutname = ((_a = kc.attr.CutName) === null || _a === void 0 ? void 0 : _a.formula) || '';
                        if (cutname && cutnames.indexOf(cutname) === -1) {
                            cutnames.push(cutname);
                        }
                    }
                });
            }
        });
        bdJson.attr['KcFlag'] = cutnames.join('|');
    }
    // 添加孔位规则
    addHoleCfgs(cfgs, face = 'A') {
        cfgs = cfgs.map(cfg => {
            cfg.id = ObjUtil.guid;
            cfg.face = face;
            this.holeCfgIds[cfg.id] = true;
            return cfg;
        });
        this.holeCfgs[face].push(...cfgs);
    }
    // 更新孔位规则的孔
    getHoleShapeDataByHoleRule() {
        let that = this;
        let l = Number(this.data.attr.L);
        let w = Number(this.data.attr.W);
        function getHoles(cfg, callback) {
            let fb = cfg.FB;
            let min = Number(cfg.min);
            let max = Number(cfg.max);
            let edgeLength = ['LFB', 'RFB'].includes(fb) ? w : l;
            if (min <= edgeLength && max >= edgeLength) {
                let holes = getHoleInfo(l, w, cfg, cfg.info, cfg.rule);
                holes = holes.map((attr) => {
                    let hole = new Hole(attr, attr.node, that);
                    hole.Face = cfg.face;
                    hole.holeType = 2;
                    hole.holeCfgId = cfg.id;
                    return hole;
                });
                callback(holes);
            }
        }
        let result = {
            A: [],
            B: []
        };
        this.holeCfgs['A'].forEach((cfg) => {
            getHoles(cfg, holes => {
                if (holes) {
                    result['A'].push(...holes);
                }
            });
        });
        this.holeCfgs['B'].forEach(cfg => {
            getHoles(cfg, holes => {
                if (holes) {
                    result['B'].push(...holes);
                }
            });
        });
        return result;
    }
    // 根据孔位规则生成孔
    getHolesByHoleRule(edgeLength, range, holeInfo, holeRule) {
        let that = this;
        let l = Number(this.data.attr.L);
        let w = Number(this.data.attr.W);
        let bh = Number(this.data.attr.BH);
        let isWidthFormula = false;
        // 判断边的类型
        if (range.width === 0 && range.length > 0 && w === range.length) {
            isWidthFormula = true;
        }
        else if (range.width > 0 && range.length == 0 && l === range.width) {
            isWidthFormula = true;
        }
        let holeDatas = getHoleInfo(edgeLength, range, holeInfo, holeRule, isWidthFormula, {
            bh
        });
        console.log(holeDatas);
        let holes = holeDatas.map((attr) => {
            let hole = new Hole(attr, attr.node, that);
            hole.setNotAuto(1);
            // jeef,增加 数据
            hole.HoleName = holeInfo.name;
            hole.FaceType = bdDecode.getHoleDefaultFaceType(hole.HDirect.value);
            return hole;
        });
        return holes;
    }
    // 根据bd的纹路和靠挡计算纹路图形的角度
    getBdGrainAngle(di = '1', cncback = "0", cncback1 = "0") {
        let typeObj = this.getTypeByDI(di);
        let angle = 0;
        if (typeObj.纹路 === '竖纹') {
            angle = Math.PI / 2;
        }
        if (cncback == 2 || cncback == 3) {
            angle = angle === 0 ? Math.PI / 2 : 0;
        }
        return angle;
    }
    // 根据DI判断板件的类型和纹路
    getTypeByDI(di = '1') {
        di = String(di);
        let result = {
            类型: undefined,
            纹路: undefined
        };
        if (['1', '5'].includes(di)) {
            result.类型 = '层板';
        }
        else if (['4', '6'].includes(di)) {
            result.类型 = '侧板';
        }
        else if (['2', '3'].includes(di)) {
            result.类型 = '背板';
        }
        if (['1', '2', '6'].includes(di)) {
            result.纹路 = '横纹';
        }
        else {
            result.纹路 = '竖纹';
        }
        return result;
    }
    /**
     * 根据Cncback转换封边位置
     * @param {Array} fbs 默认为[上,下,左,右]
     */
    transformFbByCncback(fbs = [0,0,0,0], cncback) {
        let [ufb, dfb, lfb, rfb] = fbs;
        cncback = String(cncback);
        switch (cncback) {
            case "1":
                return [dfb, ufb, rfb, lfb];
            case "2":
                return [rfb, lfb, ufb, dfb];
            case "3":
                return [lfb, rfb, dfb, ufb];
        }
        return [ufb, dfb, lfb, rfb];
    }
    /** 过滤掉非Plane平面节点 */
    filterNoPlaneNode(x2dNode) {
        let defalutPlaneNames = ['PlaneXY', 'PlaneYZ', 'PlaneXZ'];
        x2dNode.children = x2dNode.children.filter((node) => defalutPlaneNames.indexOf(node.node) > -1);
    }
    /** 删除非默认字段 */
    deleteNodeSurplusAttr(node) {
        //@ts-ignore
        let defalutAttrs = nodeTemplates[node.node];
        if (defalutAttrs) {
            defalutAttrs.push(...nodeTemplates.commom);
            for (let key in node.attr) {
                if (defalutAttrs.includes(key) === false) {
                    delete node.attr[key];
                }
            }
        }
        return node;
    }
}
let BDUtils = new BDUtilsClass();
let bdDecode = new BDDecode(BDUtils);
if (typeof math2d == "undefined") {
    math2d = Math2d;
}
if (typeof mat2d == "undefined") {
    mat2d = Mat2d;
}
class BDUtilsClassAction {
    constructor() {
        this.viewState = 1;
    }
}
let bdAction = new BDUtilsClassAction();
class Canvas2DUtilAction {
    /** 获取四边文字标识的位置 */
    getLabelTextPoss() {
        let { clientWidth: w, clientHeight: h } = canvas2d.canvas;
        let d = 20; // 距离画布边的距离
        let directs = [
            { x: w / 2 + 30, y: d },
            { x: w / 2 + 30, y: h - d - 10 },
            { x: d + 30, y: h / 2 },
            { x: w - d - 95, y: h / 2 }, // 右
        ];
        return directs;
    }
    /** 画圆点 */
    drawPoint(p, matrix, r = 3) {
        if (!p)
            return;
        let x = p.attr.X.value;
        let y = p.attr.Y.value;
        let pos = mat2d.transformCoord({ x: x, y: y }, matrix);
        canvas2d.drawCircular(canvas2d.ctx, pos.x, pos.y, r);
    }
    /** 绘制板件对应三维主视图的维度 */
    drawDirectLabel() {
        var _a, _b, _c, _d;
        let typeObj = BDUtils.getTypeByDI(((_b = (_a = bdDecode === null || bdDecode === void 0 ? void 0 : bdDecode.graphObj) === null || _a === void 0 ? void 0 : _a.attr) === null || _b === void 0 ? void 0 : _b.DI) || (((_c = bdDecode === null || bdDecode === void 0 ? void 0 : bdDecode.boardAttr) === null || _c === void 0 ? void 0 : _c.DI) || 0).toString());
        let directs = this.getLabelTextPoss();
        // 和directs的一一对应
        let table = {
            层板: ["前", "后", "左", "右"],
            侧板: ["上", "下", "后", "前"],
            背板: ["上", "下", "左", "右"],
        };
        let texts = table[typeObj.类型];
        texts = BDUtils.transformFbByCncback(texts, bdDecode.graphObj.attr.CncBack || ((_d = bdDecode === null || bdDecode === void 0 ? void 0 : bdDecode.boardAttr) === null || _d === void 0 ? void 0 : _d.CncBack));
        directs.forEach((direct, i) => {
            canvas2d.drawText({
                x: direct.x,
                y: direct.y,
                text: texts[i],
                color: "red",
                fontSize: 18,
                isCenter: true,
            });
        });
    }
    /** 绘制封边面的AB标识 */
    drawFbFaceTextLabel() {
        let directs = this.getLabelTextPoss();
        let list = [
            {
                pos: directs[0],
                text: "B",
            },
            {
                pos: directs[1],
                text: "A",
            },
        ];
        list.forEach((item) => {
            canvas2d.drawText({
                x: item.pos.x,
                y: item.pos.y,
                text: item.text,
                color: "red",
                fontSize: 18,
                isCenter: true,
            });
        });
    }
    /** 绘制封边面 */
    drawFbView(matrix) {
        let face = this.curFace;
        let { w = 0, h = 0 } = this.fbView.getFbFaceSize(face);
        let { clientWidth: width, clientHeight: height } = canvas2d.canvas;
        let sacle = transform2d.getScale(w, h, width, height);
        let rotation = 0;
        if (["L", "R"].includes(face)) {
            rotation = 90;
        }
        let m = transform2d.getViewMatrix(matrix, w, h, [0, 0], null, sacle, rotation);
        this.fbView.draw(m, this.curFace);
        this.drawFbFaceTextLabel();
    }
    /** 设置封边面 */
    setCurFace(face) {
        this.curFace = bdDecode.jcanvas.curFace = face;
        let keys = ["D", "L", "R", "U"];
        if (keys.includes(face)) {
            canvas2d.display(false);
            bdDecode.jcanvas.display(true);
        }
        else {
            canvas2d.display(true);
            bdDecode.jcanvas.display(false);
        }
    }
}
let canvas2dAction = new Canvas2DUtilAction();
class Canvas2DUtil {
    constructor() {
        /** 当前画布是否显示 */
        this.isDisplay = true;
        this.canvas = null;
        this.ctx = null;
        // 离屏canvas
        this.canvas2 = document.createElement('canvas');
        this.ctx2 = this.canvas2.getContext('2d');
        let w = 100;
        let h = 100;
        this.canvas2.setAttribute('width', w.toString());
        this.canvas2.setAttribute('height', h.toString());
        this.canvas2.style.width = w + 'px';
        this.canvas2.style.height = h + 'px';
        this.isHideAxis = false;
    }
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.strokeStyle = '#fff';
        this.initEvent();
    }
    display(v) {
        this.isDisplay = v;
        if (v) {
            this.canvas.style.display = "block";
        }
        else {
            this.canvas.style.display = "none";
        }
    }
    /** 绑定监听事件 */
    initEvent() {
    }
    /** 设置画布大小 */
    setSize(w, h) {
        this.canvas.setAttribute('width', w.toString());
        this.canvas.setAttribute('height', h.toString());
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
    }
    /** 清屏 */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /** 离屏清屏 */
    clear2() {
        this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
        this.ctx2.fillStyle = '#fff';
    }
    /** 画坐标轴 */
    drawAxis(cncBack = 0) {
        if (window.currentBDEnv != "矢量图" && this.isHideAxis)
            return;
        let ctx = this.ctx;
        let x = 15;
        let y = this.canvas.height - 15;
        let l = 75;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#0f0';
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        switch (cncBack) {
            case 1:
                // x左 y下 上靠档
                createPolyLinePath(ctx, x + l, y - l, 315, 45, l, true);
                createPolyLinePath(ctx, x + l, y, 90, 30, 10, true);
                ctx.fillText('X', x + l - 15, y - 4);
                createPolyLinePath(ctx, x, y - l, 180, 30, 10, true);
                ctx.fillText('Y', x + 4, y - l + 15);
                break;
            case 2:
                // x上 y左 左靠档
                createPolyLinePath(ctx, x + l, y, 45, 45, l, true);
                createPolyLinePath(ctx, x + l, y - l, 90, 30, 10);
                ctx.fillText('X', x + l - 15, y - l + 6);
                createPolyLinePath(ctx, x, y, 180, 30, 10, true);
                ctx.fillText('Y', x + 4, y - 15);
                break;
            case 3:
                // x下 y右 右靠档
                createPolyLinePath(ctx, x, y - l, 225, 45, l, true);
                createPolyLinePath(ctx, x, y, 90, 30, 10, true);
                ctx.fillText('X', x + 12, y - 2);
                createPolyLinePath(ctx, x + l, y - l, 0, 30, 10, true);
                ctx.fillText('Y', x + l - 8, y - l + 15);
                break;
            case 0:
            default:
                // x右 y上 下靠档
                createPolyLinePath(ctx, x, y, 135, 45, l, true);
                createPolyLinePath(ctx, x + l, y, 0, 30, 10, true);
                ctx.fillText('X', x + l - 6, y - 15);
                createPolyLinePath(ctx, x, y - l, 90, 30, 10);
                ctx.fillText('Y', x + 15, y - l + 6);
        }
        ctx.stroke();
        ctx.restore();
    }
    /** 画鼠标跟随文本 */
    drawCursorText(x, y, text = '点选') {
        this.setCursor('pointer');
        this.ctx.fillStyle = '#0ff';
        this.ctx.fillText(text, x, y);
    }
    /** 设置画布鼠标类型 */
    setCursor(type = 'default') {
        this.canvas.style.cursor = type;
    }
    /** 绘制 */
    draw(ctx, callback) {
        ctx.save();
        callback();
        ctx.restore();
    }
    /** 画圆 */
    drawCircular(ctx, centerX, centerY, r, fillStyle = '#ffff', strokeStyle = '#f09b40') {
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    /** 描边绘制 */
    stroke(ctx, fn, color = '#fff') {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }
    /** 画矩形1 */
    drawRect(p1, p2, strokeColor = '#fff') {
        this.ctx.save();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p1.x, p2.y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
    /** 画矩形2 */
    drawRect2(x, y, w, h, color = '#fff') {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
    /** 画线1 */
    drawLine(p1, p2, color = '#fff', isDash = false) {
        let ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        if (isDash) {
            ctx.setLineDash([10, 10]);
        }
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    /** 画线2 */
    drawLineByCenter(center, len = 10, rotation = 0, color = '#fff') {
        let angle = math2d.toRads(rotation);
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.translate(center.x, center.y);
        this.ctx.rotate(angle);
        this.ctx.beginPath();
        this.ctx.moveTo(-len / 2, 0);
        this.ctx.lineTo(len / 2, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
    /** 画叉 */
    drawCross(center, len = 15, rotation = 0, color = '#fff', angle = 40) {
        this.drawLineByCenter(center, len, 0 + rotation, color);
        this.drawLineByCenter(center, len, angle + rotation, color);
    }
    /** 画箭头 */
    drawArrow(p1, p2, color = '#0f0', theta = 30, headlen = 10) {
        // 计算各角度和对应的P2,P3坐标
        let angle = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI;
        let angle1 = (angle + theta) * Math.PI / 180;
        let angle2 = (angle - theta) * Math.PI / 180;
        let topX = headlen * Math.cos(angle1);
        let topY = headlen * Math.sin(angle1);
        let botX = headlen * Math.cos(angle2);
        let botY = headlen * Math.sin(angle2);
        let ctx = this.ctx;
        // 直线箭头
        // ctx.save();
        // ctx.beginPath();
        // let arrowX = p2.x + topX,
        //     arrowY = p2.y + topY;
        // ctx.moveTo(arrowX,arrowY);
        // ctx.lineTo(p2.x,p2.y);
        // arrowX = p2.x + botX;
        // arrowY = p2.y + botY;
        // ctx.moveTo(arrowX,arrowY);
        // ctx.lineTo(p2.x,p2.y);
        // ctx.strokeStyle = color;
        // ctx.lineWidth = 1;
        // ctx.stroke();
        // ctx.restore();
        // 实体三角箭头
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        let top = {
            x: p2.x + topX,
            y: p2.y + topY
        };
        let bot = {
            x: p2.x + botX,
            y: p2.y + botY
        };
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(bot.x, bot.y);
        ctx.fill();
        ctx.restore();
    }
    /** 画直线标注 */
    drawCrossLine(p1, p2, color = '#0f0', isDrawParallLine = true) {
        this.drawArrow(p1, p2, color, 15, 10);
        this.drawArrow(p2, p1, color, 15, 10);
        this.drawLine(p1, p2, color);
        if (isDrawParallLine) {
            let pos = math2d.getParallelLinePoints(p1, p2, -15);
            this.drawLine(p1, { x: pos.x1, y: pos.y1 }, color);
            this.drawLine(p2, { x: pos.x2, y: pos.y2 }, color);
        }
    }
    /** 绘制文本 */
    drawText(cfg) {
        let { x, y, text, fontSize = 12, isCenter = false, color = '#0ff', angle = 0 } = cfg;
        if (!text)
            return;
        let ctx = this.ctx;
        ctx.save();
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = color;
        if (isCenter) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        }
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
    // 绘制多行文本
    drawTexts(cfg) {
        let { x, y, texts, fontSize = 12, isCenter = false, isMiddle = false, color = '#0ff', angle = 0 } = cfg;
        let num = texts.length;
        let h = fontSize + 2;
        let allH = h * num;
        let items = texts.map((text, i) => {
            return {
                x: x,
                y: y + h * (i + 1),
                text,
                isCenter: false
            };
        });
        // 默认偏左垂直居中
        items.forEach(item => {
            item.y -= (allH / 2);
        });
        items.forEach(item => {
            this.drawText({
                x: item.x,
                y: item.y,
                text: item.text,
                isCenter: item.isCenter,
                color,
                angle
            });
        });
    }
    // 转为图片
    toDataUrl() {
        var imgUrl = this.canvas2.toDataURL('image/png');
        return imgUrl;
    }
    // 绘制封边标注
    drawTriangle(cfg) {
        let { x, y, fillStyle = null, text = '', color = '#fff', side = 35, fontSize = 12, isUp = true } = cfg;
        let ctx = this.ctx;
        let d = side / 2;
        let h = Math.sqrt(side ** 2 - d ** 2); // 三角形的高
        if (!isUp) {
            h = -h;
        }
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        // 画文字
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        // ctx.textBaseline = isUp ? 'buttom' : 'top'
        ctx.textBaseline = isUp ? "bottom" : "top";
        ctx.fillText(text, 0, h / 2);
        // 画三角形
        ctx.beginPath();
        ctx.moveTo(-d, isUp ? d : -d);
        ctx.lineTo(d, isUp ? d : -d);
        ctx.lineTo(0, -h / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    // 绘制标注信息
    drawTextLabel(pos, texts, option = {}) {
        let length1 = 60; // 第一个线段的长度
        let length2 = 20; // 第二个线段的长度
        let angle = -60; //  第一个线段的角度
        let rad = math2d.toRads(angle);
        let width = Math.cos(rad) * length1; // 第一个线段的水平方向的长度
        let height = Math.sin(rad) * length1; // 第一个线段的垂直方向的长度
        let pos2 = { x: pos.x + width, y: pos.y + height }; // 转折点
        let pos3 = { x: pos2.x + length2, y: pos2.y };
        let d = 5; // 第三个点到文字的距离
        let ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.lineTo(pos3.x, pos3.y);
        this.drawTexts({
            x: pos3.x + d,
            y: pos3.y,
            texts
        });
        ctx.stroke();
        ctx.restore();
    }
}
let canvas2d = new Canvas2DUtil();
/** 孔位异常报错编号 */
// 来源（李炎通对接）：https://docs.qq.com/sheet/DVXVGalBZelNrTmFy?tab=gcg4mr&friendUin=zenmIgEwNabDqqx2GYIpvg%253D%253D&tdsourcetag=s_macqq_aiomsg
const ErrorTagCode = {
    '101': '孔位超出板件:孔圆心不在板件区域',
    '102': '孔位超出板件:孔圆心在板件区域，圆孔部分不在板件区域',
    '103': '同面孔位相交:两孔圆心距离-（两孔半径之和）< 阈值',
    '104': '异面孔位相交:圆心不重合，两孔圆心距离-（两孔半径之和）< 阈值',
    '105': '异面孔位相交:圆心重合，两孔半径不相等',
    '106': '槽超出板件:槽中心点不在板件区域',
    '107': '槽超出板件:槽中心点在板件区域，槽两端点之一不在板件区域',
    '108': '同面孔槽相交:孔圆心在槽线段上',
    '109': '同面孔槽相交:孔圆心到槽线段距离-孔圆心板件<阈值',
    '110': '异面槽平行:两平行槽距离<阈值',
    '112': '同面水平孔与垂直孔相交',
    '113': '异面水平孔与垂直孔相交',
    '115': '活层上有其它板件连接',
    '116': 'BD尺寸与图上尺寸不一致',
    '117': '轮廓异常，弧与线段连接出现异常',
    '119': '轮廓异常，轮廓发生自交',
    '120': "孔在槽中心上",
    '121': "异面孔槽相交",
    '122': "活层与其他板件连接"
};
function getErrorTxt(tags) {
    if (Array.isArray(tags)) {
        let txt = '';
        tags.forEach((tag, i, arr) => {
            txt += `${ErrorTagCode[tag]}`;
            if (i !== arr.length) {
                txt += '\n';
            }
        });
        return txt;
    }
    else {
        return ErrorTagCode[tags];
    }
}
/** CncBack与角度的关系 */
let cncbacks = {
    0: 0,
    1: 180,
    2: 90,
    3: 270,
    180: 1,
    90: 2,
    270: 3,
    360: 0
};
/** bd默认的变量 */
const BdAttrs = {
    BH: "",
    BomStd: "",
    CA: "",
    CB: "",
    CBNO: "",
    CC: "",
    CD: "",
    CE: "",
    CF: "",
    CG: "",
    CH: "",
    CI: "",
    CJ: "",
    CK: "",
    CL: "",
    CLIENT: "",
    CLIENTADDR: "",
    CLIENTMOBILEPHONE: "",
    CLIENTPHONE: "",
    CM: "",
    CN: "",
    CO: "",
    CP: "",
    CncBack: 0,
    CncBack1: "",
    Color: "",
    DESNO: "",
    DFB: "",
    DI: "",
    DevCode: "",
    FB: "",
    FBSTR: "",
    GNO: "",
    HoleFlag: "",
    HoleStr: "",
    JXS: "",
    JXSADDR: "",
    JXSPHONE: "",
    KcFlag: "",
    KcStr: "",
    L: "",
    LFB: "",
    MEMO: "",
    Mat: "",
    NAME: "",
    ORDER: "",
    PackNo: "",
    RFB: "",
    SIZE: "",
    TIME: "",
    TYPE: "",
    UFB: "",
    UNIT: "",
    USER: "",
    W: "",
    Workflow: "",
    YHFB: ""
};
// 常规默认值
let hgBDDefault = {
    // holeD: 29
    holeD: 0
};
// 节点属性
let nodeAttr = {
    Point: [
        ["X", "X坐标"],
        ["Y", "Y坐标"],
        ["Hotspot", "是否热点"],
        ["IsDim", "是否标注"]
    ],
    Arc: [
        ["X", "顶点X坐标", "0"],
        ["Y", "顶点Y坐标", "0"],
        ["R", "弧半径R", "0"],
        ["StartAngle", "起点角度", "0"],
        ["Angle", "角度大小", "0"],
        ["Hotspot", "是否热点", "0"],
        ["IsDim", "是否标注", "0"]
    ],
    VHole: [
        ["X", "插入点X坐标", "0"],
        ["Y", "插入点Y坐标", "0"],
        ["R", "垂直孔直径", "15"],
        ["Rdepth", "垂直孔深度", "10"],
        ["Hole_Xcap", "X孔方向间距", "0"],
        ["Holenum_X", "X孔方向孔数量", "0"],
        ["Hole_Ycap", "Y孔方向间距", "0"],
        ["Holenum_Y", "Y孔方向孔数量", "0"],
        ["Rtype", "标识", ""]
        // ["X1depth", "垂直孔深度", "10"],
    ],
    BHole: [
        ["X", "插入点X坐标", "0"],
        ["Y", "插入点Y坐标", "0"],
        ["R", "大饼孔直径", "20"],
        ["Rdepth", "大饼孔深度", "10"],
        ["Rb", "水平孔直径", "8"],
        ["Hole_Z", "水平孔边距", "9"],
        ["Hole_D", "水平孔深度", hgBDDefault.holeD.toString()],
        ["HDirect", "水平孔朝向", "L"],
        ["Hole_Xcap", "X孔方向间距", "0"],
        ["Holenum_X", "X孔方向孔数量", "0"],
        ["Hole_Ycap", "Y孔方向间距", "0"],
        ["Holenum_Y", "Y孔方向孔数量", "0"],
        ["Rtype", "标识", ""],
        ["X1", "输出的胶粒孔直径", "0"],
        ["X1depth", "输出的胶粒孔深度", "0"],
        ["PKNum", "排孔数量", "1"],
        ["PKCap", "排孔间距", "0"]
    ],
    Cut: [
        ["X", "X坐标", "0"],
        ["Y", "Y坐标", "0"],
        ["X1", "X1坐标", "0"],
        ["Y1", "Y1坐标", "0"],
        ["CutName", "开槽标识", "0"],
        ["Hole_Z", "开槽宽度", "10"],
        ["Cut_Z", "开槽边距", "0"],
        ["Cutter", "槽深", "0"],
        ["Cut_L", "开槽长度", "400"],
        ["CDirect", "槽的方向", "水平"],
        ["device", "开槽设备", "0"],
    ],
    Path: [
        ["X", "X坐标", "0"],
        ["Y", "Y坐标", "0"],
        ["L", "宽", "0"],
        ["W", "高", "0"],
        ["IsFill", "是否填充", "0"]
        // ["name", "名称", ""],
    ],
    TArc: [
        ["X", "起点X坐标", "0"],
        ["Y", "起点Y坐标", "0"],
        ["X2", "终点X坐标", "0"],
        ["Y2", "终点Y坐标", "0"],
        ["ChordH", "弦高", "0"],
        ["IsBulge", "是否外凸", "1"],
        ["Hotspot", "是否热点", "0"],
        ["IsDim", "是否标注", "0"]
    ]
};
/**
 *  x2d模版字段
 * 注：要保证字段的完整，可多写，但不能缺必要字段，缺了必要字段会导致报错
 */
const nodeTemplates = {
    commom: ['Name', 'V', 'L', 'W', 'BH', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', "tagPoint", "userdata"],
    Point: ['X', 'Y', 'Hotspot', 'IsDim', 'Modelling', "isTagPoint"],
    Arc: ['X', 'Y', 'R', 'StartAngle', 'Angle', 'Hotspot', 'IsDim', 'Modelling'],
    TArc: ['X', 'Y', 'X2', 'Y2', 'ChordH', 'IsBulge', 'Hotspot', 'IsDim', 'Modelling'],
    VHole: ['X', 'Y', 'R', 'Rdepth', 'Hole_Z', 'Hole_Xcap', 'Holenum_X', 'Hole_Ycap', 'Holenum_Y', 'Rtype', 'Face'],
    BHole: ['X', 'Y', 'R', 'Rdepth', 'Rb', 'Hole_Z', 'Hole_D', 'HDirect', 'Hole_Xcap', 'Holenum_X', 'Hole_Ycap', 'Holenum_Y', 'Rtype', 'X1', 'X1depth', 'Face', "PKNum", "PKCap"],
    Cut: ['X', 'Y', 'X1', 'Y1', 'L', 'W', , 'Hole_Z', 'IsFill', 'Draw', 'Face'],
    Path: ['X', 'Y', 'L', 'W', 'IsFill', 'Draw', 'd', 'Face', 'name', 'KeyName', "tagPoint"]
};
/** 平面的下拉框选项 */
const planeOptions = {
    默认: [
        { label: "XY平面", value: "XY" },
        { label: "YZ平面", value: "YZ" },
        { label: "XZ平面", value: "XZ" }
    ],
    XY平面: [{ label: "XY平面", value: "XY" }],
    YZ平面: [{ label: "YZ平面", value: "YZ" }],
    XZ平面: [{ label: "XZ平面", value: "XZ" }],
    板件: [
        { label: "层板类(XY平面)", value: "XY" },
        { label: "侧板类(YZ平面)", value: "YZ" },
        { label: "背板类(XZ平面)", value: "XZ" }
    ],
    截面: [
        { label: "竖框(XY平面)", value: "XY" },
        { label: "横框(YZ平面)", value: "YZ" },
        { label: "其他(XZ平面)", value: "XZ" }
    ],
    百叶: [{ label: "横放(YZ平面)", value: "YZ" }]
};
const x2dCatalogCfg = [
    {
        name: "基础图形",
        level: 1,
        children: [
            {
                name: "板件",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["板件"],
                info: "切角、圆弧等异形板件图形放置该目录下调用",
                children: []
            },
            {
                name: "百叶",
                level: 2,
                dataType: "二类",
                planeOption: planeOptions["百叶"],
                info: "横放百叶、竖放百叶图形放置该目录下调用",
                children: []
            },
            {
                name: "型材截面",
                level: 2,
                dataType: "三类",
                planeOption: planeOptions["截面"],
                info: "趟门掩门的铝材、木材边框截面放置该目录下调用",
                children: []
            },
            {
                name: "线条截面",
                level: 2,
                dataType: "三类",
                planeOption: planeOptions["截面"],
                info: "顶线脚线截面放置该目录下调用",
                children: []
            },
            {
                name: "拉手截面",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "拉手截面类型的放置该目录下",
                children: []
            },
            {
                name: "吸塑门",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XZ平面"],
                info: "吸塑造型门的视图放置该目录下",
                children: []
            },
            {
                name: "铣刀",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "铣刀类型的放置该目录下",
                children: []
            },
            {
                name: "吸塑扣线",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "吸塑扣线类型的放置该目录下",
                children: []
            },
            {
                name: "欧式组件",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["默认"],
                info: "欧式组件类型的放置该目录下",
                children: []
            },
            {
                name: "板件参数",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["板件"],
                info: "板件参数的可替换图形放置该目录下调用",
                children: []
            },
            {
                name: "CAD匹配库",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["默认"],
                info: "导入的cad模型匹配数据库",
                children: []
            },
            {
                name: "@USER_DATA",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["默认"],
                children: [],
                noButton: true // 是否有上传，下载等按钮
            }
        ]
    },
    {
        name: "模型三视图",
        level: 1,
        children: [
            {
                name: "正视图",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XZ平面"],
                info: "3D模型对应的正视图放置该目录下进行调用",
                children: []
            },
            {
                name: "俯视图",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "3D模型对应的俯视图放置该目录下进行调用",
                children: []
            },
            {
                name: "侧视图",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["YZ平面"],
                info: "3D模型对应的侧视图放置该目录下进行调用",
                children: []
            }
        ]
    },
    {
        name: "图元",
        level: 1,
        children: [
            {
                name: "板件图元",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "板件上的挖洞、雕刻图元在该目录下绘制",
                children: []
            },
            {
                name: "门型图元",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "造型门的雕刻图元在该目录绘制",
                children: []
            },
            {
                name: "模型图元",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "3D模型的三视图图元在该目录下绘制",
                children: []
            },
            {
                name: "板件参数图元",
                level: 2,
                dataType: "一类",
                planeOption: planeOptions["XY平面"],
                info: "板件参数的图元在该目录下绘制",
                children: []
            }
        ]
    }
];
class JBDHoleBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "jbdHole";
        this.group = new JGroupBitmap(this.sys);
        this.circle = this.group.createBitmap("circle");
        this.hLine = this.group.createBitmap("line");
        this.vLine = this.group.createBitmap("line");
        this._init = () => {
            this.hLine.isIgnoreCapture = true;
            this.vLine.isIgnoreCapture = true;
        };
        this.checkData = () => {
            if (!this.data) {
                return false;
            }
            return true;
        };
        this._mainDraw = () => {
            this.group._draw();
        };
        this._mainHit = (p) => {
            return this.circle.getHit(p);
        };
        this.getHitBox = (isNoTrans) => {
            return this.circle.getHitBox(isNoTrans);
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            return this.circle.boxCheck(minP, maxP, isAbsInclude);
        };
    }
    updateData() {
        this.circle.data = this.data;
        this.circle.isFill = this.isFill;
        this.circle.style = this.style;
        this.hLine.data = { start: new JPos(this.data.center.x - this.data.radius, this.data.center.y), end: new JPos(this.data.center.x + this.data.radius, this.data.center.y) };
        this.hLine.isStorke = this.isStorke;
        this.hLine.style = this.style;
        this.vLine.data = { start: new JPos(this.data.center.x, this.data.center.y + this.data.radius), end: new JPos(this.data.center.x, this.data.center.y - this.data.radius) };
        this.vLine.isStorke = this.isStorke;
        this.vLine.style = this.style;
    }
}
class JBDCanvas {
    constructor(decode) {
        this.decode = decode;
        /** 当前画布是否显示 */
        this.isDisplay = true;
        this.backGroupColor = "rgb(40, 40, 35)";
        /** 标注距离长度 */
        this.tagDistance = 10;
        this.fbBitmapUpdate = JBDCanvas_FBBitmapUpdate;
        this.compassBitmapUpdate = JBDCanvas_CompassBitmapUpdate;
    }
}
((derivedCtor, constructors) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
        });
    });
})(JBDCanvas, [JBDCanvas_CreateBitmap, JBDCanvas_Other]);
class JBDCutBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "jbdCut";
        this.rect = new JRectBitmap(this.sys);
        this.line = new JLineBitmap(this.sys);
        this.centerLineDash = [10, 10];
        this.rectStroke = "#ebbb60";
        this.centerLineStroke = "red";
        this.checkData = () => {
            if (!this.data) {
                return false;
            }
            return true;
        };
        this._mainDraw = () => {
            this.rect.data = this.data;
            this.rect._draw();
            this.rect.style.strokeStyle = this.rectStroke;
            let start = new JPos(this.data.x, this.data.y + this.data.height / 2);
            let end = new JPos(this.data.x + this.data.width, this.data.y + this.data.height / 2);
            this.line.data = { start, end };
            this.line.lineDash = this.centerLineDash;
            this.line.style.strokeStyle = this.centerLineStroke;
            this.line._draw();
        };
        this._mainHit = (p) => {
            return this.rect.getHit(p);
        };
        this.getHitBox = (isNoTrans) => {
            return this.rect.getHitBox(isNoTrans);
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            return this.rect.boxCheck(minP, maxP, isAbsInclude);
        };
    }
}
class JBDExtendsTagBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "jbdExtendsTag";
        this.lineA = new JLineBitmap(this.sys);
        this.lineB = new JLineBitmap(this.sys);
        this.text = new JTextBitmap(this.sys);
        this.textHalfWidth = 0;
        this.checkData = () => {
            if (!this.data) {
                return false;
            }
            return true;
        };
        this._mainDraw = () => {
            if (this.lineColor) {
                this.lineA.style.strokeStyle = this.lineColor;
                this.lineB.style.strokeStyle = this.lineColor;
            }
            let center = new JPos((this.data.start.x + this.data.end.x) / 2, this.data.end.y);
            this.lineA.data = {
                start: this.data.start,
                end: center
            };
            this.lineA._draw();
            this.lineB.data = {
                start: center,
                end: this.data.end
            };
            this.lineB._draw();
            this.text.data = {
                text: this.data.text,
                pos: new JPos(this.data.end.x + this.textHalfWidth, this.data.end.y)
            };
            if (this.textColor) {
                this.text.style.fillStyle = this.textColor;
            }
            if (this.fontSize) {
                this.text.data.fontSize = this.fontSize;
            }
            this.text._draw();
        };
        this._mainHit = (p) => {
            return this.text.getHit(p);
        };
        this.getHitBox = (isNoTrans) => {
            return this.text.getHitBox(isNoTrans);
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            return this.text.boxCheck(minP, maxP, isAbsInclude);
        };
    }
}
/** 基础图形的数据模型 */
class GraphModel {
    constructor() {
        this.orginX2dXml = ''; // 源xml数据
        this.data = null;
        this.gAttr = {}; // 全局属性
        this.planeType = 'PlaneXY'; // 当前板件的版面类型
        this.curPlaneData = null; // 当前投影面
    }
    // 加载x2d数据
    loadX2d(x2d, callback) {
        this.orginX2dXml = x2d || '';
        if (!x2d) {
            console.log('x2d为空');
            this.clearData();
            callback();
        }
        else {
            x2d = this.correctXML(x2d);
            let x2dJson = XmlUtil.toJson(x2d)[0];
            this.gAttr = x2dJson.attr;
            x2dJson.children = this.transformPlanes(x2dJson.children);
        }
    }
    // 处理投影面数据
    transformPlanes(planes) {
        return planes.map(plane => this.transformToBd(plane));
    }
    // 修正XML错误，替换无效字段
    correctXML(xml) {
        xml = xml.replace(/undefined/g, '');
        xml = xml.replace(/NaN/g, '0');
        return xml;
    }
    // 清空数据
    clearData() {
        this.data = null;
    }
    // 转换投影面数据
    transformToBd(plane) {
        let result = {
            node: plane.node,
            attr: plane.attr,
            children: [
                { node: 'Graph', attr: {}, children: [] },
                { node: 'FaceA', attr: {}, children: [] },
                { node: 'FaceB', attr: {}, children: [] }
            ]
        };
        let graphChildren = [];
        let faceAChildren = [];
        let faceBChildren = [];
        for (let node of plane.children) {
            if (node.node === 'Extra') {
                for (let item of node.children) {
                    if (item.node === 'FaceA') {
                        faceAChildren = item.children;
                    }
                    else if (item.node === 'FaceB') {
                        faceBChildren = item.children;
                    }
                }
            }
            else {
                graphChildren.push(node);
            }
        }
        result.children[0].children = graphChildren;
        result.children[1].children = faceAChildren;
        result.children[2].children = faceBChildren;
        this.calculateNodeAttr(result, this.gAttr);
        return result;
    }
    // 计算xml节点的属性，将公式转为数值
    calculateNodeAttr(node, pAttr = {}) {
        //  计算自身节点属性。需要
    }
}
let graphModel = new GraphModel();
/** 批量操作bd */
function downloadZip(files, zipFileName) {
    let zip = new JSZip();
    files.forEach(file => {
        let { filename, content, option = {} } = file;
        zip.file(filename, content, option);
    });
    // 下载压缩包
    zip.generateAsync({ type: "blob" })
        .then(function (content) {
        saveAs(content, zipFileName);
    });
    zip = null;
}
function bdToDxfs(list) {
    BatchBdUtil.bdToDxfs(list, files => {
        downloadZip(files, "dxf.zip");
    });
}
function bdToImgs(list) {
    BatchBdUtil.bdToImgs(list, {
        callback(files) {
            downloadZip(files, "BD图片.zip");
        }
    });
}
function oldBdToNews(list) {
    BatchBdUtil.oldBdToNew(list, files => {
        downloadZip(files, "bd.zip");
    });
}
// 操作轮廓的点线弧
class GraphUtil {
    constructor() {
        this.adsorbDr = 3; // 移动线启用吸附的距离
    }
    init(graph, l = 0, w = 0, bh = 0) {
        this.graph = graph;
        this.children = graph.children;
        this.setSize(l, w, bh);
    }
    setSize(l, w, bh) {
        this.l = Number(l);
        this.w = Number(w);
        this.bh = Number(this.bh || bh);
    }
    reset() {
        this.graph = null;
        this.children = null;
        this.tempChilds = null;
    }
    /** 设置轮廓节点的值 */
    setAttr(node, option) {
        let keys = Object.keys(option);
        keys.forEach((key) => {
            if (node.attr[key]) {
                let value = option[key];
                if (typeof value === 'object') {
                    node.attr[key].value = value.value;
                    node.attr[key].formula = value.formula;
                }
                else {
                    node.attr[key].value = node.attr[key].formula = value;
                }
            }
        });
    }
    /** 更新轮廓节点 */
    updateGraph() {
        this.graph.update();
    }
    /** 是否获取到点 */
    isInPoint() {
        let items = this.graph.children; // 点和圆弧源数据的集合
        let matrix;
        if (window.currentBDEnv == "矢量图") {
            matrix = transform2d.getViewMatrixByBoard(transform2d.matrix, this.graph.getBound());
        }
        else {
            matrix = transform2d.getViewMatrix();
        }
        let result = {
            isIn: false,
            item: null
        };
        for (let i = 0; i < items.length; i++) {
            let o = items[i];
            if (o.node === 'Point') {
                let x = o.attr.X.value;
                let y = o.attr.Y.value;
                let pos = mat2d.transformCoord({ x: x, y: y }, matrix);
                if (math2d.isInCircle(mouse.pos, pos, 3)) {
                    result.isIn = true;
                    result.item = {
                        type: 'Point',
                        index: i,
                        node: o
                    };
                }
            }
        }
        if (window.currentBDEnv == "矢量图") {
            if (result.isIn) {
                canvas2d.setCursor('pointer');
            }
            else {
                canvas2d.setCursor('default');
            }
        }
        return result;
    }
    /** 捕获线 */
    isInLine() {
        // let matrix = transform2d.getViewMatrix()
        let matrix;
        if (window.currentBDEnv == "矢量图") {
            matrix = transform2d.getViewMatrixByBoard(transform2d.matrix, this.graph.getBound());
        }
        else {
            matrix = transform2d.getViewMatrix();
        }
        let nodes = this.graph.nodes;
        let result = {
            isIn: false,
            item: null,
            isInLineCenter: false
        };
        let isInLineCenter = false;
        for (let i = 0; i < nodes.length; i++) {
            let o = nodes[i];
            if (o.node === 'Line') {
                let r1 = o.isInLine(mouse.pos.x, mouse.pos.y, matrix);
                let r2 = o.isInCenterPoint(mouse.pos.x, mouse.pos.y, matrix);
                if (window.currentBDEnv == "矢量图") {
                    o.changeLineStyle(r1);
                    o.changeCenterStyle(r1, r2);
                }
                else {
                    o.changeLineStyle(false);
                    o.changeCenterStyle(false, false);
                }
                if (r1) {
                    result.isIn = true;
                    result.item = {
                        type: 'Line',
                        index: i,
                        node: o
                    };
                }
                if (r1 && r2) {
                    result.isInLineCenter = true;
                    result.item.isInCenter = true;
                }
            }
        }
        if (window.currentBDEnv == "矢量图") {
            if (result.isIn) {
                if (isInLineCenter) {
                    canvas2d.setCursor('pointer');
                }
                else {
                    let type = result.item.node.lineType();
                    if (type === '竖') {
                        canvas2d.setCursor('w-resize');
                    }
                    else if (type === '横') {
                        canvas2d.setCursor('s-resize');
                    }
                }
            }
            else {
                canvas2d.setCursor('default');
            }
        }
        return result;
    }
    /**  捕获圆弧 */
    isInArc() {
        let matrix;
        if (window.currentBDEnv == "矢量图") {
            matrix = transform2d.getViewMatrixByBoard(transform2d.matrix, this.graph.getBound());
        }
        else {
            matrix = transform2d.getViewMatrix();
        }
        let nodes = this.graph.nodes;
        let result = {
            isIn: false,
            item: null
        };
        for (let i = 0; i < nodes.length; i++) {
            let o = nodes[i];
            if (o.node === 'Arc' || o.node === 'TArc') {
                let r = o.isPointInPath(matrix);
                if (r) {
                    o.color = '#e64072';
                    result.isIn = true;
                    result.item = {
                        type: 'Arc',
                        index: this.getPointArcIndex(o.arc),
                        node: o
                    };
                }
                else {
                    o.color = '#fff';
                }
            }
        }
        if (window.currentBDEnv == "矢量图") {
            if (result.isIn) {
                canvas2d.setCursor('pointer');
            }
            else {
                canvas2d.setCursor('default');
            }
        }
        return result;
    }
    /** 是否在板件轮廓上 */
    isIn() {
        let result = this.isInPoint();
        if (!result.isIn) {
            result = this.isInLine();
            if (!result.isIn) {
                result = this.isInArc();
            }
        }
        return result;
    }
    /** 移动线前 */
    preMoveLine(item) {
        let line = item.node;
        let children = copyObject(this.graph.children);
        let lineIndex = this.graph.nodes.indexOf(line);
        let lineType = line.lineType();
        if (lineType === '斜')
            return item;
        let nearby = this.getNearNode(line);
        let p1Index = this.getPointIndex(line.p1);
        let p2Index = this.getPointIndex(line.p2);
        let preAdd = false;
        let nextAdd = false;
        if (nearby.pre.type === lineType || nearby.pre.type === 'Arc') {
            preAdd = true;
        }
        if (nearby.next.type === lineType || nearby.next.type === 'Arc') {
            nextAdd = true;
        }
        if (nextAdd) {
            let p2 = {
                node: 'Point',
                attr: {
                    X: { formula: line.x2, value: line.x2 },
                    Y: { formula: line.y2, value: line.y2 }
                }
            };
            if (p2Index === 0) {
                children.push(p2);
            }
            else {
                children.splice(p2Index, 0, p2);
            }
        }
        if (preAdd) {
            let p1 = {
                node: 'Point',
                attr: {
                    X: { formula: line.x1, value: line.x1 },
                    Y: { formula: line.y1, value: line.y1 }
                }
            };
            lineIndex++;
            children.splice(p1Index, 0, p1);
        }
        this.setCache();
        this.tempChilds = children;
        this.graph.setNodes(children);
        item.node = this.graph.nodes[lineIndex];
        return item;
    }
    /** 获取index前后的线或弧实例 */
    getNearNode(node) {
        let preNode, nextNode;
        let nodes = this.graph.nodes;
        if (node.node === 'Arc' && !(node instanceof Arc)) {
            node = this.getArcNode(node);
        }
        let index = nodes.indexOf(node);
        if (index === 0) {
            preNode = nodes[nodes.length - 1];
        }
        else {
            preNode = nodes[index - 1];
        }
        if (index === nodes.length - 1) {
            nextNode = nodes[0];
        }
        else {
            nextNode = nodes[index + 1];
        }
        let preType = preNode.node !== 'Line' ? preNode.node : preNode.lineType();
        let nextType = nextNode.node !== 'Line' ? nextNode.node : nextNode.lineType();
        return {
            pre: {
                type: preType,
                node: preNode
            },
            next: {
                type: nextType,
                node: nextNode
            },
            current: node
        };
    }
    /** 由圆弧的源数据获取对应的Arc实例 */
    getArcNode(arcAttr) {
        let nodes = this.graph.nodes;
        let node;
        nodes.forEach(item => {
            if (item.node === 'Arc') {
                if (item.arc === arcAttr) {
                    node = item;
                }
            }
        });
        return node;
    }
    /** 移动线 */
    moveLine(line, downP1, downP2, d) {
        let angle = line.angle;
        let p1 = line.p1;
        let p2 = line.p2;
        d = this.adsorbDistCalculate(line, downP1, downP2, d);
        if (window.currentBDEnv == "矢量图") {
            if (angle === 90 || angle === -90) { // 左右平移
                p1.attr.X.value = p1.attr.X.formula = downP1.x + d.dx;
                p2.attr.X.value = p2.attr.X.formula = downP2.x + d.dx;
            }
            else if (angle === 180 || angle === 0) { // 上下平移
                p1.attr.Y.value = p1.attr.Y.formula = downP1.y + d.dy;
                p2.attr.Y.value = p2.attr.Y.formula = downP2.y + d.dy;
            }
        }
        else {
            /**
                    * 获取点的最终值
                    * @param {*} cur 当前点的位置
                    * @param {*} moveD 需要移动的距离
                    * @param {*} min 移动范围的最小值
                    * @param {*} max 移动范围的最大值
                    * @returns
                    */
            function getMoveEndPos(cur, moveD, min, max) {
                let end = cur + moveD;
                // 以下细化时为了适应BD的L和W被修改后
                if (cur < min) {
                    // 当当前点的位置小于最小值时，只允许往最小值偏移
                    if (moveD > 0)
                        return end;
                }
                else if (cur > max) {
                    // 当当前点的位置大于最大值时，只允许往最大值偏移
                    if (moveD < 0)
                        return end;
                }
                else {
                    // 当前点在最小最大范围内移动
                    if (end >= min && end <= max) {
                        return end;
                    }
                    else if (end < min) {
                        return min;
                    }
                    else if (end > max) {
                        return max;
                    }
                }
                return cur;
            }
            if (angle === 90 || angle === -90) { // 左右平移
                p1.attr.X.value = p1.attr.X.formula = p2.attr.X.value = p2.attr.X.formula = getMoveEndPos(downP1.x, d.dx, 0, this.l);
            }
            else if (angle === 180 || angle === 0) { // 上下平移
                p1.attr.Y.value = p1.attr.Y.formula = p2.attr.Y.value = p2.attr.Y.formula = getMoveEndPos(downP1.y, d.dy, 0, this.w);
            }
        }
    }
    /** 获取点的索引 */
    getPointIndex(p) {
        return this.graph.children.indexOf(p);
    }
    /** 清理相邻的相同的点 */
    cleanSamePoint(children) {
        let nodes = children;
        let lastPoint = nodes[0];
        for (let i = 1; i < nodes.length; i++) {
            let n = nodes[i];
            if (n.node === 'Arc') {
                lastPoint = null;
            }
            if (n.node === 'Point') {
                if (lastPoint) {
                    let x1 = lastPoint.attr.X.value;
                    let y1 = lastPoint.attr.Y.value;
                    let x2 = n.attr.X.value;
                    let y2 = n.attr.Y.value;
                    if (x1 === x2 && y1 === y2) {
                        nodes.splice(i, 1);
                        i--;
                    }
                }
                lastPoint = n;
            }
        }
    }
    /** 保存当前节点的缓存 */
    setCache() {
        this.graph.setCacheNode();
    }
    /** 清空缓存 */
    cleanCache() {
        this.graph.cleanCache();
    }
    /** 设置点弧 */
    setGraphChild() {
        if (this.tempChilds) {
            this.cleanSamePoint(this.tempChilds);
            this.updateGraphChildren(this.tempChilds);
            this.updateGraph();
            this.tempChilds = null;
        }
    }
    /** 更新板件的点弧集合，不覆盖原数组指针 */
    updateGraphChildren(newChilds) {
        this.graph.children.length = 0;
        newChilds.forEach(node => {
            this.graph.children.push(node);
        });
        this.children = this.graph.children;
    }
    /** 计算吸附需要的偏移值 */
    adsorbDistCalculate(line, downP1, downP2, d) {
        let nearby = this.getNearNode(line);
        let dx = d.dx;
        let dy = d.dy;
        let pre = nearby.pre.node;
        let next = nearby.next.node;
        let lineType = line.lineType();
        if (lineType === '横') {
            let preLen = getPoint(pre.p1).y - (downP1.y + dy);
            let nextLen = getPoint(next.p2).y - (downP2.y + dy);
            let leny = Math.abs(preLen) < Math.abs(nextLen) ? preLen : nextLen;
            if (leny <= this.adsorbD && leny >= -this.adsorbD) {
                dy += leny;
            }
        }
        if (lineType === '竖') {
            let preLen = getPoint(pre.p1).x - (downP1.x + dx);
            let nextLen = getPoint(next.p2).x - (downP2.x + dx);
            let lenx = Math.abs(preLen) < Math.abs(nextLen) ? preLen : nextLen;
            if (lenx <= this.adsorbD && lenx >= -this.adsorbD) {
                dx += lenx;
            }
        }
        return {
            dx,
            dy
        };
    }
    /** 设置点的属性值 */
    setPointAttr(p, attrObj) {
        let keys = Object.keys(attrObj);
        keys.forEach(key => {
            let isAdd = attrObj[key].isAdd;
            if (isAdd) {
                let value = p.attr[key].value + attrObj[key].value;
                p.attr[key].value = value;
                p.attr[key].formula = value;
            }
            else {
                p.attr[key].value = attrObj[key].value;
                p.attr[key].formula = attrObj[key].value;
            }
        });
    }
    /** 判断线的方向 */
    getLineDirect(line) {
        let p1 = getPoint(line.p1);
        let p2 = getPoint(line.p2);
        if (line.lineType() === '横') {
            return p2.x - p1.x >= 0 ? '正' : '负';
        }
        else {
            return p2.y - p1.y >= 0 ? '正' : '负';
        }
    }
    /** 设置线的长度 */
    setLineLen(inputItem) {
        let diff = inputItem.value - inputItem.oldValue;
        let node = inputItem.node;
        let selectNode = inputItem.selectNode;
        let selectLineType = selectNode.lineType();
        let position = inputItem.position;
        let lineType = inputItem.lineType;
        let direct = this.getLineDirect(node);
        let editPointName;
        let editPoint1; // 编辑的点
        let editPoint2; // 编辑的点
        let param1 = {}; // 编辑的值
        let param2 = {}; // 编辑的值
        let editCoord = lineType === '横' ? 'X' : 'Y';
        // 设置需要修改的点
        if (position === 'pre') {
            editPointName = 'p2';
        }
        else {
            editPointName = 'p1';
        }
        editPoint1 = node[editPointName];
        editPoint2 = selectNode[editPointName];
        // 求增减的值
        if ((direct === '正' && position === 'next') ||
            (direct === '负' && position === 'pre')) {
            diff *= -1;
        }
        param1[editCoord] = { value: diff, isAdd: true };
        // 设置的顺序不能变
        this.setPointAttr(editPoint1, param1);
        if (selectLineType !== '斜') {
            param2[editCoord] = {
                value: editPoint1.attr[editCoord].value
            };
            this.setPointAttr(editPoint2, param2);
        }
        if (inputItem.value === 0) {
            this.cleanSamePoint(this.graph.children);
        }
        if (window.currentBDEnv == "矢量图") {
            this.updateGraph();
        }
    }
    /** 通过点设置线的长度 */
    setLineLenByPoint(item) {
        let diff = item.value - item.oldValue;
        let direct = this.getLineDirect(item.node);
        if (direct === '负')
            diff *= -1;
        if (item.lineType === '横') {
            this.setPointAttr(item.node.p2, {
                X: { value: diff, isAdd: true }
            });
        }
        if (item.lineType === '竖') {
            this.setPointAttr(item.node.p2, {
                Y: { value: diff, isAdd: true }
            });
        }
        if (window.currentBDEnv == "矢量图") {
            this.updateGraph();
        }
    }
    /** 点所在的线 */
    getLine(p, type) {
        for (let i = 0; i < this.graph.nodes.length; i++) {
            let n = this.graph.nodes[i];
            if (n.node === 'Line') {
                //@ts-ignore
                let lineP = n[type];
                if (p === lineP) {
                    return n;
                }
            }
        }
    }
    /** 设置圆弧的半径 */
    setArcR(item) {
        let diff = item.value - item.oldValue;
        let arcAttr = item.node.arc.attr;
        let value = math2d.round(arcAttr.R.value + diff);
        let arcDiff = this.getArcDiff(item.node, diff);
        let pre = arcDiff.pre.node;
        let next = arcDiff.next.node;
        let preDiff = arcDiff.pre.diffCfg;
        let nextDiff = arcDiff.next.diffCfg;
        if (!preDiff.key || !nextDiff.key)
            return 0;
        if (!preDiff.canEdit || !nextDiff.canEdit) {
            return -1;
        }
        let prePointAttr = pre.p2.attr;
        let nextPointAttr = next.p1.attr;
        //@ts-ignore
        let preValue = prePointAttr[preDiff.key].value + preDiff.diff;
        //@ts-ignore
        let nextValue = nextPointAttr[nextDiff.key].value + nextDiff.diff;
        let preAttr = {};
        let nextAttr = {};
        preAttr[preDiff.key] = { value: preValue };
        nextAttr[nextDiff.key] = { value: nextValue };
        this.setPointAttr(pre.p2, preAttr);
        this.setPointAttr(next.p1, nextAttr);
        if (item.attr) {
            pre.p2.attr.X = JSON.parse(JSON.stringify(item.attr.X));
            pre.p2.attr.Y = JSON.parse(JSON.stringify(item.attr.Y));
            this.setAttr(item.node.arc, item.attr);
        }
        else {
            this.setAttr(item.node.arc, {
                X: pre.p2.attr.X.value,
                Y: pre.p2.attr.Y.value,
                R: value
            });
        }
        if (window.currentBDEnv == "矢量图") {
            this.graph.update();
        }
        return 1;
    }
    /** 获取设置圆弧的差值 */
    getArcDiff(node, diff) {
        let nearby = this.getNearNode(node);
        let pre = nearby.pre.node;
        let next = nearby.next.node;
        let sAngle = math2d.toDegrees(node.sAngle);
        let eAngle = math2d.toDegrees(node.eAngle);
        let preDiff = this.getArcRadiusRule('pre', pre, sAngle, diff);
        let nextDiff = this.getArcRadiusRule('next', next, eAngle, diff);
        return {
            pre: {
                node: pre,
                diffCfg: preDiff
            },
            next: {
                node: next,
                diffCfg: nextDiff
            }
        };
    }
    // 获取修改圆弧半径后，相邻的线段的顶点的偏移值
    getArcRadiusRule(position, line, angler, rDiff) {
        let result = {
            key: '',
            diff: rDiff,
            canEdit: true // 是否可修改
        };
        let direct = this.getLineDirect(line);
        let lineLen = line.getLineLength();
        result.key = line.lineType() === '横' ? 'X' : 'Y';
        if (result.key === 'X') {
            if ((position === 'next' && direct === '负') ||
                (position === 'pre' && direct === '正')) {
                result.diff *= -1;
            }
        }
        if (result.key === 'Y') {
            if ((position === 'pre' && direct === '正') ||
                (position === 'next' && direct === '负')) {
                result.diff *= -1;
            }
        }
        // 圆弧边界检测
        if (position === 'pre') {
            if (direct === '正') {
                if (lineLen + result.diff < 0) {
                    result.canEdit = false;
                }
            }
            else {
                if (lineLen - result.diff < 0) {
                    result.canEdit = false;
                }
            }
        }
        else {
            if (direct === '正') {
                if (lineLen - result.diff < 0) {
                    result.canEdit = false;
                }
            }
            else {
                if (lineLen + result.diff < 0) {
                    result.canEdit = false;
                }
            }
        }
        return result;
    }
    /** 判断连线的方向是顺时针还是逆时针,
     * 正为逆，负为顺，0为直线
     */
    isClockwise(p1, p2, p3) {
        return math2d.threePointsClockwise(p1, p2, p3);
    }
    /** 判断圆弧前后线的类型组合 */
    arcNearLineType(arc) {
        let nearby = this.getNearNode(arc);
        let preType;
        let nextType;
        let result = {
            type: 0,
            preType: preType,
            preNode: nearby.pre.node,
            nextType: nextType,
            nextNode: nearby.next.node
        };
        if (!(nearby.pre.node instanceof Line && nearby.next.node instanceof Line)) {
            return result;
        }
        preType = nearby.pre.node.lineType();
        nextType = nearby.next.node.lineType();
        // 横和竖
        if (preType !== nextType && preType !== '斜' && nextType !== '斜')
            result.type = 1;
        // 均为横
        if (preType === '横' && nextType === '横')
            result.type = 2;
        // 均为竖
        if (preType === '竖' && nextType === '竖')
            result.type = 3;
        return result;
    }
    /** 检测是否选中点或弧 */
    checkPointAndArc(node) {
        let nodes = this.graph.nodes;
        let isSelected = false;
        nodes.forEach(item => {
            if (item.node === 'Line') {
                let p1 = item.p1;
                let p2 = item.p2;
                item.showPoint.p1 = false;
                item.showPoint.p2 = false;
                if (p1 === node) {
                    item.showPoint.p1 = isSelected = true;
                }
                if (p2 === node) {
                    item.showPoint.p2 = isSelected = true;
                }
            }
            if (item.node === 'Arc' || item.node === 'TArc') {
                item.color = '#fff';
                item.isSelected = false;
                if (item.arc === node) {
                    item.isSelected = true;
                    isSelected = true;
                }
            }
        });
        return isSelected;
    }
    /** 检测点弧在集合的索引位置 */
    getPointArcIndex(item) {
        let children = this.graph.children;
        for (let i = 0; i < children.length; i++) {
            let n = children[i];
            if (item === n) {
                return i;
            }
        }
    }
    /** 圆弧转直角 */
    arcToRightAngle(arc) {
        let nearby = this.getNearNode(arc);
        let pre = nearby.pre.node;
        let next = nearby.next.node;
        let x, y;
        let preType = pre.lineType();
        let nextType = next.lineType();
        let index = this.graph.children.indexOf(arc.arc) - 1;
        if (index === -1)
            return false;
        if (preType === nextType)
            return false;
        if (preType === '横' && nextType === '竖') {
            x = next.p1.attr.X.value;
            y = pre.p2.attr.Y.value;
        }
        if (preType === '竖' && nextType === '横') {
            x = pre.p1.attr.X.value;
            y = next.p2.attr.Y.value;
        }
        if (x == null || y == null)
            return false;
        let newPoint = {
            node: 'Point',
            attr: {
                X: { formula: x, value: x },
                Y: { formula: y, value: y }
            }
        };
        this.graph.children.splice(index, 3, newPoint);
        return true;
    }
    /** 获取轮廓的直线 */
    getLines(direct) {
        return this.graph.getLines(direct);
    }
    /** 改变线的颜色 */
    setLinesColor(lines, color = '#fff') {
        lines.forEach(line => {
            line.color = color;
        });
    }
    /** 判断点是否在线段（水平线或垂直线）范围内 */
    isPointInLineRange(p, line) {
        let result = false;
        let p1 = getPoint(line.p1);
        let p2 = getPoint(line.p2);
        let type = line.lineType();
        if (type === '横') {
            if ((p.x > p1.x) !== (p.x > p2.x))
                result = true;
        }
        if (type === '竖') {
            if ((p.y > p1.y) !== (p.y > p2.y))
                result = true;
        }
        return result;
    }
    /** 获取移动新增大饼孔的插入点坐标 */
    getAddBholeXY(hole, p) {
        let range = 20; // 吸附距离
        let direct = hole.HDirect.formula.toString();
        let holeDeth = hole.Hole_D ? parseInt(hole.Hole_D.value.toString()) : hgBDDefault.holeD;
        let lines = this.getLines(direct); // 优化：移动过程中重复拿值
        let coord = direct === 'L' || direct === 'R' ? 'x' : 'y';
        let dx = 0;
        let dy = 0;
        this.setLinesColor(lines, 'red');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let coordNum = getPoint(line.p1)[coord];
            let centerNum = p[coord];
            let diff = Math.abs(centerNum - coordNum);
            let dist = holeDeth - diff;
            let isIn = this.isPointInLineRange(p, line);
            if (isIn && diff - range < holeDeth) {
                if (direct === 'L')
                    dx = dist;
                if (direct === 'R')
                    dx = -dist;
                if (direct === 'U')
                    dy = -dist;
                if (direct === 'D')
                    dy = dist;
                break;
            }
        }
        return {
            x: math2d.round(p.x + dx),
            y: math2d.round(p.y + dy)
        };
    }
    /** 获取离点最近的四边形成的矩形 */
    getHCCheckBound(p, face) {
        let directs = ['L', 'R', 'U', 'D'];
        let ranges = ['minx', 'maxx', 'miny', 'maxy'];
        let graphBound = this.graph.getBound(face); // 轮廓最初的边界
        let bound = {
            minx: null,
            maxx: null,
            miny: null,
            maxy: null
        };
        directs.forEach(direct => {
            let _lines = this.getLines(direct).filter(line => this.isPointInLineRange(p, line));
            let coord = direct === 'L' || direct === 'R' ? 'x' : 'y';
            // let reverse = direct === 'R' || direct === 'U' ? -1 : 1
            let coordNums = _lines.map(line => {
                return getPoint(line.p1)[coord];
            });
            let dists = coordNums.map(lineCoord => {
                let dist = p[coord] - lineCoord;
                // return dist * reverse
                return Math.abs(dist);
            });
            let min = Math.min(...dists);
            let index = dists.indexOf(min);
            let rangeNum = coordNums[index];
            if (direct === 'L')
                bound.minx = rangeNum;
            if (direct === 'R')
                bound.maxx = rangeNum;
            if (direct === 'U')
                bound.maxy = rangeNum;
            if (direct === 'D')
                bound.miny = rangeNum;
        });
        // 如果有的边界没有值，则用轮廓的对应边界的值
        ranges.forEach(range => {
            if (bound[range] == null) {
                bound[range] = graphBound[range];
            }
        });
        return bound;
    }
    // 获取移动大饼孔的范围
    getMoveBHoleRange(direct, p, r, holeDeth) {
        //   let ranges = ['minx', 'maxx', 'miny', 'maxy']
        let bound = {
            minx: null,
            maxx: null,
            miny: null,
            maxy: null
        };
        let isAttachLine = true;
        let _lines = this.getLines(direct).filter(line => this.isPointInLineRange(p, line));
        let reverse = direct === 'R' || direct === 'U' ? -1 : 1;
        let coord = direct === 'L' || direct === 'R' ? 'x' : 'y';
        let coordNums = _lines.map(line => {
            //@ts-ignore
            return getPoint(line.p1)[coord];
        });
        let dists = coordNums.map(lineCoord => {
            let dist = p[coord] - lineCoord;
            return dist * reverse;
        });
        let min;
        let result = math2d.isPositiveOrNegative(dists);
        if (result === 1)
            min = Math.min(...dists);
        else if (result === -1)
            min = Math.max(...dists);
        else {
            min = Math.min(...dists.filter(dist => {
                return dist >= 0;
            }));
        }
        let index = dists.indexOf(min);
        if (index !== -1) {
            let line = _lines[index];
            let p1 = getPoint(line.p1);
            let p2 = getPoint(line.p2);
            if (direct === 'L' || direct === 'R') {
                [bound.miny, bound.maxy] = p1.y < p2.y ? [p1.y + r, p2.y - r] : [p2.y + r, p1.y - r];
                if (direct === 'L' && p.x - p1.x !== holeDeth) {
                    isAttachLine = false;
                }
                if (direct === 'R' && p1.x - p.x !== holeDeth) {
                    isAttachLine = false;
                }
            }
            else {
                [bound.minx, bound.maxx] = p1.x < p2.x ? [p1.x + r, p2.x - r] : [p2.x + r, p1.x - r];
                if (direct === 'D' && p.y - p1.y !== holeDeth) {
                    isAttachLine = false;
                }
                if (direct === 'U' && p1.y - p.y !== holeDeth) {
                    isAttachLine = false;
                }
            }
        }
        else {
            isAttachLine = false;
        }
        return {
            isAttachLine,
            bound
        };
    }
    // 编辑圆弧的属性
    editArcAttr(arc, key, value) {
        let result = {};
        if (key === 'R') {
            let near = this.getNearNode(arc);
            let pre = near.pre.node;
            let next = near.next.node;
            let p1 = getPoint(pre.p2); // 圆弧的起始点
            let p2 = getPoint(next.p1); // 圆弧的终止点
            let r = value;
            let angle = arc.attr.Angle.value;
            let direction = angle >= 0 ? 2 : 3; // 圆弧的顺逆
            let center = math2d.getArcCenter2(p1, p2, r, direction, true);
            // let centers = math2d.getCircleCenter(p1, p2, r)
            // let c1 = centers[0]
            // let c2 = centers[1]
            // let oldCenter = near.current.middle
            // let len1 = math2d.getLineLength(c1.x, c1.y, oldCenter.x, oldCenter.y)
            // let len2 = math2d.getLineLength(c1.x, c1.y, oldCenter.x, oldCenter.y)
            let sAngle = math2d.lineAngle(p1.x, p1.y, center.x, center.y);
            let eAngle = math2d.lineAngle(p2.x, p2.y, center.x, center.y);
            let rAngle = sAngle - eAngle;
            if (isNaN(sAngle)) {
                return result;
            }
            result = {
                R: value,
                StartAngle: -sAngle,
                Angle: rAngle
            };
        }
        else {
            result[key] = value;
        }
        return result;
    }
    /** 检测轮廓是否超过范围 */
    checkRangeAbnormal() {
        return this.graph.checkRangeAbnormal();
    }
}
let graphUtil = new GraphUtil();
/** 可编辑的标注 */
class HCEditLabel {
    constructor() {
        this.init();
    }
    init() {
        this.hDist = 0; // 水平距离
        this.vDist = 0; // 垂直距离
        this.hP1 = { x: 0, y: 0 }; // 水平标注的起点
        this.hP2 = { x: 0, y: 0 }; // 水平标注的终点
        this.vP1 = { x: 0, y: 0 }; // 垂直标注的起点
        this.vP2 = { x: 0, y: 0 }; // 垂直标注的终点
        this.checkDist = 30; // 检测距离
        this.isShow = false;
        this.tempHC = null; // 临时孔槽，用于设置孔槽位置
        this.dragging = false;
        this.dragBox = { x: 0, y: 0, w: 0, h: 0 };
        this.holeGroupBound = { minx: 0, miny: 0, maxx: 0, maxy: 0 }; // 选中的多个孔的边界
        this.labelColor = "red"; // 标注的颜色
        this.curGroup = null; // 当前选中,可能未成组或成组
        this.tempGroup = null; // 临时组合孔，用于移动
        this.groups = []; // 已成组的孔
        this.selectedType = 0; // 0表示没有选中，1表示选中单个孔槽，2表示选中组合孔
        this.copyHoleGroup = null; // 保存需要粘贴的组合孔
        this.hLabel = null; // 水平标注
        this.vLabel = null; // 垂直标注
        this.bound = null; // 检验的边界
        this.tempHoleGroupBound = null; // 初始的组合孔的框边界
        this.matrix = null; // 变换矩阵
        this.initLabel();
    }
    draw(matrix = this.matrix, curFace) {
        this.matrix = matrix;
        this.drawTempHC();
        // this.drawTempHoleGroup()
        this.drawLabel();
        this.drawDraggingBox();
        this.drawHoleGroupBound(matrix, curFace);
    }
    initLabel() {
        this.hLabel = new Label(this.hP1.x, this.hP1.y, this.hP2.x, this.hP2.y, "");
        this.vLabel = new Label(this.vP1.x, this.vP1.y, this.vP2.x, this.vP2.y, "");
        this.hLabel.color = this.vLabel.color = this.labelColor;
    }
    setBound(bound) {
        this.bound = bound;
    }
    /** 设置标注 */
    checkBound(hcs, bound = this.bound, face) {
        let hDist1;
        let vDist1;
        let hDist2;
        let vDist2;
        this.hDist = 0;
        this.vDist = 0;
        if (hcs.length === 1) {
            let hole = hcs[0];
            let origin = { x: Number(hole.X.value), y: Number(hole.Y.value) };
            bound = graphUtil.getHCCheckBound(origin, face);
            hDist1 = origin.x - bound.minx;
            vDist1 = origin.y - bound.miny;
            hDist2 = bound.maxx - origin.x;
            vDist2 = bound.maxy - origin.y;
            if (hDist1 < hDist2) {
                this.hDist = -hDist1;
            }
            else {
                this.hDist = hDist2;
            }
            if (vDist1 < vDist2) {
                this.vDist = -vDist1;
            }
            else {
                this.vDist = vDist2;
            }
            if (hole.node == "BHole") {
                let direction = hole.HDirect.value;
                if (direction === "L" || direction === "R") {
                    this.hDist = 0;
                }
                if (direction === "U" || direction === "D") {
                    this.vDist = 0;
                }
            }
            this.hP1 = this.vP1 = origin;
            this.hP2 = { x: origin.x + this.hDist, y: origin.y };
            this.vP2 = { x: origin.x, y: origin.y + this.vDist };
        }
        else {
            // 方案一：标注以组合框顶点为起始点
            // let holesBound = this.getHolesBound(hcs)
            // hDist1 = holesBound.minx - bound.minx
            // vDist1 = holesBound.miny - bound.miny
            // hDist2 = bound.maxx - holesBound.maxx
            // vDist2 = bound.maxy - holesBound.maxy
            // if (hDist1 < hDist2) {
            //     this.hDist = -hDist1;
            //     this.hP1.x = holesBound.minx
            //     this.hP2.x = bound.minx
            // } else {
            //     this.hDist = hDist2;
            //     this.hP1.x = holesBound.maxx
            //     this.hP2.x = bound.maxx
            // }
            // if (vDist1 < vDist2) {
            //     this.vDist = - vDist1;
            //     this.vP1.y = holesBound.miny
            //     this.vP2.y = bound.miny
            // } else {
            //     this.vDist = vDist2
            //     this.vP1.y = holesBound.maxy
            //     this.vP2.y = bound.maxy
            // }
            // this.hP1.y = this.hP2.y = this.vP1.y
            // this.vP1.x = this.vP2.x = this.hP1.x
            // 方案二：标注以孔的中心为起始点
            let holeItem = this.getRecentHole(hcs, bound);
            let point = { x: holeItem.hole.X.value, y: holeItem.hole.Y.value };
            bound = graphUtil.getHCCheckBound(point, face);
            this.hDist = holeItem.hDirect === "L" ? -holeItem.hDist : holeItem.hDist;
            this.vDist = holeItem.vDirect === "D" ? -holeItem.vDist : holeItem.vDist;
            this.hP1.x = this.vP2.x = point.x;
            this.hP1.y = this.hP2.y = point.y;
            this.vP1 = this.hP1;
            if (holeItem.hDirect === "L") {
                this.hP2.x = bound.minx;
            }
            else {
                this.hP2.x = bound.maxx;
            }
            if (holeItem.vDirect === "U") {
                this.vP2.y = bound.maxy;
            }
            else {
                this.vP2.y = bound.miny;
            }
        }
    }
    /** 鼠标是否在标注的文字上 */
    isPointInText(x, y) {
        let r = {
            isInHLabel: false,
            isInVLabel: false
        };
        r.isInHLabel = this.hLabel.isPointInText(x, y);
        r.isInVLabel = this.vLabel.isPointInText(x, y);
        return r;
    }
    addTempHC(type, attr, lines) {
        if (type === "hole") {
            this.tempHC = new Hole(attr, attr.node);
            // this.tempHC.FaceV=attr.
            this.tempHC.setNotAuto(1);
        }
        if (type === "cut") {
            this.tempHC = new Cut(attr);
            this.tempHC.setNotAuto(1);
        }
        if (type === "path") {
            this.tempHC = new Path2DX(attr);
        }
        this.isShow = true;
    }
    clearTempHC() {
        this.tempHC = null;
        this.isShow = false;
    }
    /** 设置选择框的位置和大小 */
    setDragBox(downPos, movePos) {
        let w = Math.abs(downPos.x - movePos.x);
        let h = Math.abs(downPos.y - movePos.y);
        this.dragBox.w = w;
        this.dragBox.h = h;
        if (movePos.x <= downPos.x && movePos.y <= downPos.y) {
            this.dragBox.x = movePos.x;
            this.dragBox.y = movePos.y;
        }
        if (movePos.x > downPos.x && movePos.y <= downPos.y) {
            this.dragBox.x = downPos.x;
            this.dragBox.y = movePos.y;
        }
        if (movePos.x > downPos.x && movePos.y > downPos.y) {
            this.dragBox.x = downPos.x;
            this.dragBox.y = downPos.y;
        }
        if (movePos.x <= downPos.x && movePos.y > downPos.y) {
            this.dragBox.x = movePos.x;
            this.dragBox.y = downPos.y;
        }
        this.dragging = true;
    }
    /** 绘制新增的孔槽 */
    drawTempHC() {
        if (this.tempHC) {
            this.tempHC.draw(this.matrix);
        }
    }
    drawLabel() {
        if (this.isShow && this.selectedType !== 0) {
            this.hLabel.update(this.hP1.x, this.hP1.y, this.hP2.x, this.hP2.y);
            this.vLabel.update(this.vP1.x, this.vP1.y, this.vP2.x, this.vP2.y);
            this.hLabel.draw(canvas2d.ctx, this.matrix);
            this.vLabel.draw(canvas2d.ctx, this.matrix);
        }
    }
    /** 绘制移动中的选择框 */
    drawDraggingBox() {
        if (this.dragging) {
            let ctx = canvas2d.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "#1196EE";
            ctx.fillStyle = "#1196EE";
            ctx.globalAlpha = 0.5;
            ctx.rect(this.dragBox.x, this.dragBox.y, this.dragBox.w, this.dragBox.h);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }
    }
    /** 孔是否在选择框内 */
    selectHoleInRect(nodes, face) {
        if (!this.dragging)
            return;
        let holeGroup = [];
        //   let cutGroup = []
        let dragBox = {
            minx: this.dragBox.x,
            miny: this.dragBox.y,
            maxx: this.dragBox.x + this.dragBox.w,
            maxy: this.dragBox.y + this.dragBox.h
        };
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let bound = node.getBound();
            let result = isHCInSelectBox(dragBox, bound, this.matrix);
            if (result) {
                if (node.node === "VHole" || node.node === "BHole") {
                    holeGroup.push(node);
                }
                if (node.node === "Cut") {
                    // 槽成组暂时不做
                    // cutGroup.push(node)
                }
            }
        }
        this.dragging = false;
        if (!this.isSelectHoles(holeGroup))
            return;
        if (this.iscontainSameHole(holeGroup))
            return;
        this.holeGroupBound = this.getHolesBound(holeGroup);
        this.tempHoleGroupBound = copyObject(this.holeGroupBound);
        this.selectedType = 2;
        this.curGroup = {
            face: face,
            bound: this.holeGroupBound,
            holes: holeGroup
        };
    }
    /** 画选中多个孔的整体框 */
    drawHoleGroupBound(matrix, curFace) {
        // if(this.selectedType !== 2) return
        this.groups.forEach(group => {
            if (curFace === group.face) {
                this.drawGroupBound(group, matrix, true);
            }
        });
        if (this.curGroup && curFace === this.curGroup.face) {
            this.drawGroupBound(this.curGroup, matrix);
        }
    }
    /** 绘制组合框 */
    drawGroupBound(group, matrix, isSetLineDash = false) {
        let ctx = canvas2d.ctx;
        let n = this.getHolesBound(group.holes);
        let p1 = mat2d.transformCoord({ x: n.minx, y: n.miny }, matrix);
        let p2 = mat2d.transformCoord({ x: n.maxx, y: n.maxy }, matrix);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#fc961f";
        ctx.lineWidth = 1.5;
        if (isSetLineDash)
            ctx.setLineDash([5, 5]);
        ctx.moveTo(p1.x - 1, p1.y + 1);
        ctx.lineTo(p1.x - 1, p2.y - 1);
        ctx.lineTo(p2.x + 1, p2.y - 1);
        ctx.lineTo(p2.x + 1, p1.y + 1);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    /** 点是否在组合孔框内 */
    isPointInHoleGroupBound(x, y, n = this.holeGroupBound) {
        let mouse = mat2d.transformCoord({ x: x, y: y }, mat2d.invert(this.matrix));
        if (n.minx <= mouse.x &&
            n.maxx >= mouse.x &&
            n.miny <= mouse.y &&
            n.maxy >= mouse.y) {
            return true;
        }
        return false;
    }
    /** 设置孔选框 */
    setHoleGroupBound(dx, dy) {
        let n = this.getHolesBound(this.curGroup.holes);
        let minx = n.minx + dx;
        let maxx = n.maxx + dx;
        let miny = n.miny + dy;
        let maxy = n.maxy + dy;
        this.holeGroupBound = {
            minx,
            maxx,
            miny,
            maxy
        };
    }
    /** 设置孔选框2 */
    setHoleGroupBound2(dx, dy) {
        let box = this.holeGroupBound;
        box.minx += dx;
        box.maxx += dx;
        box.miny += dy;
        box.maxy += dy;
    }
    /** 关闭组合孔选择框 */
    closeHoleGroup() {
        this.selectedType = 0;
        this.tempHoleGroupBound = null;
        this.holeGroupBound = { minx: 0, miny: 0, maxx: 0, maxy: 0 };
        this.curGroup = null;
        this.isShow = false;
    }
    /** 是否是同类型的孔 */
    isSelectHoles(holes) {
        let type;
        // 只选中一个孔不显示选择框
        if (holes.length <= 1)
            return false;
        /** 选中多种孔不显示选择框 */
        for (let i = 0; i < holes.length; i++) {
            let hole = holes[i];
            if (hole.node === "VHole" || hole.node === "BHole") {
                let _type = hole.node + "-" + hole.HDirect.value;
                if (i === 0) {
                    type = _type;
                }
                else {
                    if (type !== _type) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /** 获取多个孔的边界 */
    getHolesBound(holes) {
        let xs = [];
        let ys = [];
        let center = {
            L: { x: null, y: null },
            R: { x: null, y: null },
            U: { x: null, y: null },
            D: { x: null, y: null }
        };
        holes.forEach(hole => {
            let x = hole.X.value;
            let y = hole.Y.value;
            let bound = hole.getBound();
            xs.push(bound.minx, bound.maxx);
            ys.push(bound.miny, bound.maxy);
            if (center.L.x == null || center.L.x > x) {
                center.L.x = x;
                center.L.y = y;
            }
            if (center.R.x == null || center.R.x < x) {
                center.R.x = x;
                center.R.y = y;
            }
            if (center.D.y == null || center.D.y > y) {
                center.D.x = x;
                center.D.y = y;
            }
            if (center.U.y == null || center.U.y < y) {
                center.U.x = x;
                center.U.y = y;
            }
        });
        xs.sort(compareNumbers);
        ys.sort(compareNumbers);
        return {
            minx: xs[0],
            maxx: xs.pop(),
            miny: ys[0],
            maxy: ys.pop(),
            center
        };
    }
    /** 点是否在孔组内 */
    isPointInGroup(p, group = this.curGroup) {
        if (!group)
            return false;
        let bound = this.getHolesBound(group.holes);
        let result = this.isPointInHoleGroupBound(p.x, p.y, bound);
        return result;
    }
    /** 设置选中的成组孔到当前组里 */
    setSelectedToCurGroup() {
        let isInGroup = false;
        if (!this.curGroup) {
            for (let i = 0; i < this.groups.length; i++) {
                let r = this.isPointInGroup(mouse.pos, this.groups[i]);
                if (r) {
                    this.curGroup = this.groups[i];
                    this.tempGroup = copyObject(this.curGroup);
                    isInGroup = true;
                    break;
                }
            }
        }
        else {
            let r = this.isPointInGroup(mouse.pos, this.curGroup);
            if (r) {
                this.tempGroup = copyObject(this.curGroup);
                isInGroup = true;
            }
        }
        return isInGroup;
    }
    /** 成组/解组 */
    setGroup(type) {
        if (this.curGroup) {
            let index = this.groups.indexOf(this.curGroup);
            if (type === "group" && index === -1) {
                this.groups.push(this.curGroup);
            }
            if (type === "ungroup" && index !== -1) {
                this.groups.splice(index, 1);
            }
            this.curGroup = null;
        }
    }
    /** 是否含有相同的孔 */
    iscontainSameHole(holes) {
        let holeIds = [];
        let result = false;
        // 获取已成组的孔的id
        this.groups.forEach(group => {
            let ids = this.getGroupHoleId(group);
            holeIds.push(...ids);
        });
        for (let i = 0; i < holes.length; i++) {
            let id = holes[i].id;
            if (holeIds.indexOf(id) > -1) {
                result = true;
            }
        }
        return result;
    }
    /** 获取组合孔的id */
    getGroupHoleId(group = this.curGroup) {
        let ids = [];
        group.holes.forEach((hole) => {
            ids.push(hole.id);
        });
        ids.sort(compareNumbers).reverse();
        return ids;
    }
    /** 删除当前选中的组合孔 */
    deleteHoleGroup(group = this.curGroup) {
        if (group) {
            let index = this.groups.indexOf(group);
            this.groups.splice(index, 1);
        }
    }
    /** 复制当前选中的组合孔 */
    copyCurGroup(lines) {
        if (this.curGroup) {
            this.copyHoleGroup = copyObject(this.curGroup);
            this.moveHoleGroup(this.copyHoleGroup, 20, -20);
            // this.newHoleGroup(lines)
        }
        else {
            this.copyHoleGroup = null;
        }
    }
    /** 整体移动组合孔 */
    moveHoleGroup(group, dx, dy) {
        let holes = group.holes;
        holes.forEach((hole) => {
            hole.X.value += dx;
            hole.Y.value += dy;
            hole.X.formula = hole.X.value;
            hole.Y.formula = hole.Y.value;
        });
    }
    /** 新增组合孔 */
    addHoleGroup(face, holes) {
        let bound = this.getHolesBound(holes);
        let group = {
            face,
            bound,
            holes
        };
        this.groups.push(group);
    }
    /** 实例化复制的孔 */
    newHoleGroup(lines) {
        let holes = this.copyHoleGroup.holes;
        let newHoles = [];
        holes.forEach((hole) => {
            let newHole = new Hole(hole, hole.node);
            newHole.setNotAuto(1);
            newHoles.push(newHole);
        });
        this.copyHoleGroup.holes = newHoles;
    }
    /** 获取离板件便捷最近的一个孔 */
    getRecentHole(holes, bound) {
        let newHoles = [];
        holes.forEach(hole => {
            let holeObj = {
                hole: hole,
                hDirect: "",
                vDirect: "",
                hDist: 0,
                vDist: 0,
                len: 0 // 横标注+竖标注的总长
            };
            let x = hole.X.value;
            let y = hole.Y.value;
            let d_l = x - bound.minx; // 孔心离板件最左边的距离
            let d_r = bound.maxx - x; // 孔心离板件最右边的距离
            let d_u = bound.maxy - y; // 孔心离板件最上边的距离
            let d_d = y - bound.miny; // 孔心离板件最下边的距离
            if (d_l < d_r) {
                holeObj.hDirect = "L";
                holeObj.hDist = d_l;
            }
            else {
                holeObj.hDirect = "R";
                holeObj.hDist = d_r;
            }
            if (d_u < d_d) {
                holeObj.vDirect = "U";
                holeObj.vDist = d_u;
            }
            else {
                holeObj.vDirect = "D";
                holeObj.vDist = d_d;
            }
            holeObj.len = holeObj.hDist + holeObj.vDist;
            newHoles.push(holeObj);
        });
        newHoles.sort(function (a, b) {
            return a.len - b.len;
        });
        return newHoles[0];
    }
}
let hcEditLabel = new HCEditLabel();
/**
 * 根据孔槽配置得到每个孔的某个方向的位置
 * @param {*} cfg 孔槽配置
 * @param {*} edgeLength 边长，一般为BD的长或宽
 * @param fb 封边
 * @param isWidthFormula 是否带公式(如果是完整的封边的边，就默认带公式)
 * @return {Number[]} 每个孔的位置（水平或垂直方向）
 */
function getHolesPos(cfg, edgeLength, fb, isWidthFormula = false) {
    let { calType, // 计算方式
    behindBlank = 0, // 后留空（固定）
    minBehindBlank = 0, // 最小后留空
    frontBlank = 0, // 前留空（固定）
    minFrontBlank = 0, // 最小前留空
    fixedHoleDistance = 0, // 两孔间距（固定）
    holeDistanceMagnification = 1, // 两孔间距（倍率）
    holeNum = 1 // 孔数量
     } = cfg;
    let spaceNum = holeNum - 1;
    let poss = [];
    let length = ['LFB', 'RFB'].includes(fb) ? 'W' : 'L';
    if (!isWidthFormula) {
        length = edgeLength;
    }
    if (calType === '前后端等距') {
        // 计算方式：前后端等距
        if (holeNum === 1) {
            return [frontBlank];
        }
        else if (holeNum === 2) {
            let pos = `${length}-${behindBlank}`;
            if (!isWidthFormula)
                pos = eval(pos);
            return [frontBlank, pos];
        }
        else if (holeNum % 2 === 0) {
            // 偶数数量
            let half = holeNum / 2;
            for (let i = 0; i < holeNum; i++) {
                let pos;
                if (i < half) {
                    pos = `${frontBlank}+${fixedHoleDistance}*${i}`;
                }
                else {
                    pos = `${length}-${behindBlank}-${fixedHoleDistance}*(${spaceNum}-${i})`;
                }
                if (pos !== undefined) {
                    if (!isWidthFormula)
                        pos = eval(pos);
                    poss.push(pos);
                }
            }
            return poss;
        }
    }
    else if (calType === '中心孔') {
        let offset = `(${length}-${spaceNum}*${fixedHoleDistance})/2`;
        for (let i = 0; i < holeNum; i++) {
            let pos = `${fixedHoleDistance}*${i}+(${offset})`;
            if (!isWidthFormula)
                pos = eval(pos);
            poss.push(pos);
        }
        return poss;
    }
    else if (calType === '均分孔') {
        let average = `(${length}-${behindBlank + frontBlank})/(${holeNum}+1)`;
        for (let i = 0; i < holeNum; i++) {
            let pos = `${behindBlank}+(${average})*(${i}+1)`;
            if (!isWidthFormula)
                pos = eval(pos);
            poss.push(pos);
        }
        return poss;
    }
    else if (calType === '靠背对齐') {
        let average = fixedHoleDistance;
        if (holeDistanceMagnification != 0) {
            let remainder = `(${length}-${behindBlank + minFrontBlank})`;
            let offset = `(((${remainder}/${spaceNum})%${holeDistanceMagnification})*${spaceNum}+${minFrontBlank})`;
            average = `(${length}-(${offset}+${behindBlank}))/${spaceNum}`;
        }
        for (let i = 0; i < holeNum; i++) {
            let pos = `${behindBlank}+(${average})*${i}`;
            if (!isWidthFormula)
                pos = eval(pos);
            poss.push(pos);
        }
        return poss;
    }
    else if (calType === '靠前对齐') {
        if (holeDistanceMagnification == 0) {
            for (let i = 0; i < holeNum; i++) {
                let pos = `${length}-${frontBlank}-(${fixedHoleDistance}*${i})`;
                poss.push(pos);
            }
            poss = poss.reverse();
        }
        else {
            let remainder = `(${length}-${frontBlank}-${minBehindBlank})`;
            let offset = `(((${remainder}/${spaceNum})%${holeDistanceMagnification})*${spaceNum}+${minBehindBlank})`;
            let average = `(${length}-(${offset}+${frontBlank}))/${spaceNum}`;
            for (let i = 0; i < holeNum; i++) {
                let pos = `${offset}+(${average})*${i}`;
                if (!isWidthFormula)
                    pos = eval(pos);
                poss.push(pos);
            }
        }
        return poss;
    }
}
/**
 * 获取孔信息
 */
function getHoleInfo(edgeLength, range, holeInfo, holeRule, isWidthFormula, cfg = {}) {
    let { FB, gap = 0, // 边距
    holeType, // 孔类型
    holeDiameter = 0, // 孔直径R
    holeDepth = 0, // 孔深度Rdepth
    smallHoleDiameter = 0, // 小孔直径Rb
    smallHoleDepth = 0, // 小孔孔深
    matchHoleDiameter = 0, // 配对孔的孔直径X1
    matchHoleDepth = 0, // 配对孔的孔深度X1depth
    associatedMxHole, // 关联的孔
    smallHoleMargin = 9, // 小孔孔边距
     } = holeInfo;
    let { bh } = cfg;
    // 重置水平孔边距
    if (smallHoleMargin === 0 || smallHoleMargin === 9999) {
        smallHoleMargin = bh / 2;
    }
    let poss = getHolesPos(holeRule, edgeLength, FB, isWidthFormula);
    let mxHoleInfo = holeInfo['木肖孔'];
    let dist = Number(gap || smallHoleDepth);
    if (poss) {
        let holes = [];
        let mxHoles = [];
        poss.forEach((value, i, arr) => {
            let x = `(${value})+${range.minx}`;
            let y = `(${value})+${range.miny}`;
            let hdirect = "";
            if (FB === "LFB") {
                x = range.minx + dist;
                hdirect = "L";
            }
            else if (FB === "RFB") {
                if (isWidthFormula) {
                    x = `L-${dist}`;
                }
                else {
                    x = range.maxx - dist;
                }
                hdirect = "R";
            }
            else if (FB === "UFB") {
                if (isWidthFormula) {
                    y = `W-${dist}`;
                }
                else {
                    y = range.maxy - dist;
                }
                hdirect = "U";
            }
            else if (FB === "DFB") {
                y = range.miny + dist;
                hdirect = "D";
            }
            // 兼容公式输入.dist为NaN表示输入值为公式
            if (holeType === '垂直孔' && isNaN(dist)) {
                if (hdirect === 'L' || hdirect === 'R') {
                    x = gap;
                }
                else {
                    y = gap;
                }
            }
            if (!isWidthFormula) {
                x = eval(x.toString());
                y = eval(y.toString());
            }
            let hole = {
                node: holeType === "垂直孔" ? 'VHole' : 'BHole',
                X: x,
                Y: y,
                R: holeDiameter,
                Rdepth: holeDepth,
                HDirect: ''
            };
            if (holeType === "大饼孔") {
                hole['HDirect'] = hdirect;
                hole['Rb'] = smallHoleDiameter;
                hole['X1'] = matchHoleDiameter;
                hole['X1depth'] = matchHoleDepth;
                hole['Hole_Z'] = smallHoleMargin;
            }
            holes.push(hole);
            if (mxHoleInfo) {
                // 最多添加两个木肖孔
                let mxx = x;
                let mxy = y;
                let isAdd = false;
                let dist = mxHoleInfo['mxHoleDistance'] || 0;
                if (hdirect === 'L' || hdirect === 'R') {
                    if (i === 0) {
                        mxy = `${mxy}+${dist}`;
                        isAdd = true;
                    }
                    else if (i === arr.length - 1) {
                        mxy = `${mxy}-${dist}`;
                        isAdd = true;
                    }
                }
                else if (hdirect === 'U' || hdirect === 'D') {
                    if (i === 0) {
                        mxx = `${mxx}+${dist}`;
                        isAdd = true;
                    }
                    else if (i === arr.length - 1) {
                        mxx = `${mxx}-${dist}`;
                        isAdd = true;
                    }
                }
                if (isAdd) {
                    if (!isWidthFormula) {
                        mxx = eval(mxx.toString());
                        mxy = eval(mxy.toString());
                    }
                    mxHoles.push({
                        node: 'BHole',
                        X: mxx,
                        Y: mxy,
                        R: 0,
                        Rdepth: 0,
                        HDirect: hdirect,
                        Rb: smallHoleDiameter,
                        X1: matchHoleDiameter,
                        X1depth: matchHoleDepth,
                        Hole_Z: smallHoleMargin,
                        PKNum: 1,
                        PKCap: 0
                    });
                }
            }
        });
        mxHoles.forEach(hole => {
            holes.push(hole);
        });
        return holes;
    }
}
/** 图元工具类 */
/**  xml默认<Graph>节点属性 */
let defaultGraphAttr = {
    '变量异形': [
        ['type', '变量异形'], ['V', '1'], ['L', '1000'], ['W', '1000'], ['BH', '18'], ['CA', ''],
        ['CB', ''], ['CC', ''], ['CD', ''], ['CE', ''], ['CF', ''], ['CG', ''], ['CH', ''],
        ['CI', ''], ['CJ', ''], ['CK', ''], ['CL', ''], ['CM', ''], ['CN', ''],
        ['CO', ''], ['CP', '']
    ],
    '百叶': [['type', '百叶'], ['Name', ''], ['Param', '']],
    '型材截面': [['type', '型材截面'], ['Name', ''], ['L', '1000'], ['W', '1000']],
    '默认': [['type', ''], ['L', '1000'], ['W', '1000']],
    /**  一类数据：包含CA-CP等14个变量 */
    '一类': [
        ['type', ''], ['V', '1'], ['L', '1000'], ['W', '1000'], ['BH', '18'], ['CA', ''],
        ['CB', ''], ['CC', ''], ['CD', ''], ['CE', ''], ['CF', ''], ['CG', ''], ['CH', ''],
        ['CI', ''], ['CJ', ''], ['CK', ''], ['CL', ''], ['CM', ''], ['CN', ''],
        ['CO', ''], ['CP', '']
    ],
    /** 二类数据：包含param的百叶属性字段 */
    '二类': [['type', ''], ['Name', ''], ['Param', '']],
    /** 三类数据：无CA-CP，也无param字段 */
    '三类': [['type', ''], ['Name', ''], ['L', '1000'], ['W', '1000']]
};
/** 默认<Plane>节点属性。0表示有children的面，1表示没有children的面 */
let defaultPlaneAttr = {
    '变量异形': {
        0: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0'], ['Flag', '1']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    },
    '百叶': {
        0: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    },
    '型材截面': {
        0: [['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    },
    '默认': {
        0: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    },
    '一类': {
        0: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0'], ['Flag', '1']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    },
    '二类': {
        0: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    },
    '三类': {
        0: [['L', 'L'], ['W', 'W'], ['Type', 'Polygon'], ['Repeat', '0']],
        1: [['X', '0'], ['Y', '0'], ['L', 'L'], ['W', 'W'], ['Type', 'Rect'], ['Repeat', '0']]
    }
};
/** 默认图形的点集。 */
let defaultPoints = {
    '变量异形': {
        default: [['Hotspot', '1'], ['IsDim', '0']],
        keyNames: ['X', 'Y'],
        points: [
            [0, 0],
            [0, 'W'],
            ['L', 'W'],
            ['L', 0]
        ]
    },
    '百叶': {
        default: [],
        keyNames: ['X', 'Y'],
        points: [
            [0, 0],
            [0, 'W'],
            ['L', 'W'],
            ['L', 0]
        ]
    },
    '型材截面': {
        default: [],
        keyNames: ['X', 'Y'],
        points: [
            ['0*L/1000', '0*W/1000'],
            ['0*L/1000', 'W*W/1000'],
            ['L*L/1000', 'W*W/1000'],
            ['L*L/1000', '0*W/1000']
        ]
    },
    '默认': {
        default: [],
        keyNames: ['X', 'Y'],
        points: [
            [0, 0],
            [0, 'W'],
            ['L', 'W'],
            ['L', 0]
        ]
    },
    '一类': {
        default: [['Hotspot', '1'], ['IsDim', '0'], ['Modelling', '1']],
        keyNames: ['X', 'Y'],
        points: [
            [0, 0],
            [0, 'W'],
            ['L', 'W'],
            ['L', 0]
        ]
    },
    '二类': {
        default: [],
        keyNames: ['X', 'Y'],
        points: [
            [0, 0],
            [0, 'W'],
            ['L', 'W'],
            ['L', 0]
        ]
    },
    '三类': {
        default: [],
        keyNames: ['X', 'Y'],
        points: [
            ['0*L/1000', '0*W/1000'],
            ['0*L/1000', '1000*W/1000'],
            ['1000*L/1000', '1000*W/1000'],
            ['1000*L/1000', '0*W/1000']
        ]
    }
};
/** 百叶的Param参数 */
let byParams = {
    // 竖放
    'PlaneXY': {
        'PL': 1,
        'DJ': 1
    },
    // 横放
    'PlaneYZ': {
        'PL': 3,
        'DJ': 2
    }
};
/**  默认标签 */
let defalutLabels = {
    '板件参数': {
        'PlaneXY': '层板类1',
        'PlaneYZ': '侧板类1',
        'PlaneXZ': '背板类1'
    }
};
class ModelUtil {
    constructor() {
        this.planeNames = ['PlaneXY', 'PlaneXZ', 'PlaneYZ'];
    }
    createNode(name) {
        return {
            node: name,
            attr: {},
            children: []
        };
    }
    getXMLTemplate(option) {
        let graph;
        if (window["currentBDEnv"] == "矢量图") {
            graph = this.getGraphNode(option.directory, option.planeType);
            graph.children = this.getPlanes(option.directory, option.planeType);
            // 设置type属性
            graph.attr.type = option.directory.name || "";
        }
        else {
            graph = this.getGraphNode(option.x2dType, option.planeType);
            graph.children = this.getPlanes(option.x2dType, option.planeType);
        }
        return XmlUtil.toXml(graph);
    }
    getGraphNode(x2dType, planeType) {
        let node = this.createNode('Graph');
        let type;
        let name;
        if (typeof x2dType == 'string') {
            type = x2dType || window["JDBModelCommonType"];
            name = type;
        }
        else {
            type = (x2dType === null || x2dType === void 0 ? void 0 : x2dType.dataType) || window["JDBModelCommonType"];
            name = x2dType === null || x2dType === void 0 ? void 0 : x2dType.name;
        }
        for (let item of defaultGraphAttr[type]) {
            node.attr[item[0]] = item[1];
        }
        if (name === '百叶' && planeType) {
            node.attr['Param'] = this.getBYParam(planeType);
        }
        return node;
    }
    // 设置百叶的Param参数
    getBYParam(planeType) {
        let attr = byParams[planeType];
        let pl = attr['PL'] || '';
        let dj = attr['DJ'] || '';
        return `{^PL^:^${pl}^,^Cut^:^0^,^DJ^:^${dj}^,^JX^:^0^,^CutA^:^0.0000^,^CutB^:^0.0000^,^BarH^:^24.0000^,^Points^:^^}`;
    }
    getPlanes(x2dType, planeType) {
        let type;
        if (typeof x2dType == 'string') {
            type = x2dType || window["JDBModelCommonType"];
        }
        else {
            type = (x2dType === null || x2dType === void 0 ? void 0 : x2dType.dataType) || window["JDBModelCommonType"];
        }
        let cfgs = defaultPlaneAttr[type];
        return this.planeNames.map(name => {
            let index = name === planeType ? 0 : 1;
            let attrs = cfgs[index];
            let node = this.createNode(name);
            for (let item of attrs) {
                node.attr[item[0]] = item[1];
            }
            // 添加默认点
            if (index === 0) {
                let points = this.getPoints(x2dType);
                node.children = points;
            }
            return node;
        });
    }
    getPoints(x2dType) {
        let type;
        if (typeof x2dType == 'string') {
            type = x2dType || window["JDBModelCommonType"];
        }
        else {
            type = (x2dType === null || x2dType === void 0 ? void 0 : x2dType.dataType) || window["JDBModelCommonType"];
        }
        let cfg = defaultPoints[type];
        return cfg.points.map(point => {
            let node = this.createNode('Point');
            // 添加动态属性
            for (let i = 0; i < cfg.keyNames.length; i++) {
                let key = cfg.keyNames[i];
                node.attr[key] = point[i];
            }
            // 添加默认属性
            for (let item of cfg.default) {
                node.attr[item[0]] = item[1];
            }
            return node;
        });
    }
    getDefalutLabel(directory, planeType) {
        let defalut = defalutLabels[directory];
        if (defalut) {
            return defalut[planeType] || "";
        }
        return "";
    }
}
let modeUtil = new ModelUtil();
/**
 * 图形的工具方法
 */
/** 获取孔的间距孔 */
function getIntervalHoles(x, y, xNum, xCap, yNum, yCap, direct) {
    let drawX = false;
    let drawY = false;
    let offsetX = 0;
    let offsetY = 0;
    let result = [{ x, y, offsetX, offsetY }];
    // 判断绘制的方向
    if (direct) {
        if (yNum && (direct === 'L' || direct === 'R')) {
            drawY = true;
        }
        if (xNum && (direct === 'U' || direct === 'D')) {
            drawX = true;
        }
    }
    else {
        if (xNum)
            drawX = true;
        if (yNum)
            drawY = true;
    }
    if (drawX) {
        while (xNum > 1) {
            offsetX += Number(xCap);
            result.push({
                x: x + offsetX,
                y: y,
                offsetX,
                offsetY: 0
            });
            xNum--;
        }
    }
    if (drawY) {
        while (yNum > 1) {
            offsetY += Number(yCap);
            result.push({
                x: x,
                y: y + offsetY,
                offsetX: 0,
                offsetY
            });
            yNum--;
        }
    }
    return result;
}
/** 转换为画布的弧的属性 */
function getCanvasArcByHGArc(hgArc, cfg) {
    if (hgArc.type === 'arc') {
        return HGArcToCanvasArc(hgArc, cfg);
    }
    else if (hgArc.type === 'tArc') {
        let tArc = getTArcOtherAttr(hgArc, cfg);
        // 因坐标系已设置原点为左下角，需对角度和绘图方向进行反向赋值
        tArc.startAngle = -tArc.startAngle;
        tArc.endAngle = -tArc.endAngle;
        tArc.isCounterClockwise = !tArc.isCounterClockwise;
        return tArc;
    }
}
/** 将华广的弧转为画布的弧 */
function HGArcToCanvasArc(hgarcAttr, cfg = {}) {
    let isCounterClockwise = false;
    let { start, r, startAngle, angle } = hgarcAttr;
    let center = math2d.getArcCenter(start.x, start.y, r, startAngle);
    // 兼容特殊处理，一般不用cfg的.为解决画布旋转导致圆弧偏离问题
    startAngle = math2d.toRads(startAngle - (cfg.rotation || 0));
    angle = math2d.toRads(angle);
    let endAngle = startAngle + angle;
    let middle = rotationPoint(center.x, center.y, start.x, start.y, -angle / 2);
    let end = rotationPoint(center.x, center.y, start.x, start.y, -angle);
    if (angle < 0) {
        isCounterClockwise = true;
    }
    return {
        start,
        middle,
        center,
        end,
        startAngle,
        angle,
        endAngle,
        radius: r,
        isCounterClockwise
    };
}
// 计算TArc圆弧得到新属性
function getTArcOtherAttr(arcAttr, cfg = {}) {
    let { start, end, h, isBulge } = arcAttr;
    let rotation = (cfg.rotation || 0); // 旋转角度
    let direction = isBulge == 1 ? 2 : 3;
    let radius = (4 * h * h + (start.x - end.x) ** 2 + (start.y - end.y) ** 2) / (8 * h); // 很重要的公式
    let center = math2d.getArcCenter2(start, end, radius, direction, h <= radius);
    let startAngle = math2d.lineAngle(start.x, start.y, center.x, center.y);
    let endAngle = math2d.lineAngle(end.x, end.y, center.x, center.y);
    let isCounterClockwise = isBulge == 1;
    let angle = math2d.toRads(endAngle - startAngle);
    startAngle = math2d.toRads(math2d.toPositiveDegree(startAngle + rotation));
    endAngle = math2d.toRads(math2d.toPositiveDegree(endAngle + rotation));
    let middleAngle = (startAngle + endAngle) / 2 - math2d.toRads(rotation);
    if ((isCounterClockwise && startAngle < endAngle) ||
        (!isCounterClockwise && startAngle > endAngle)) {
        // 取反方向的角度
        middleAngle = middleAngle - math2d.toRads(180);
    }
    let middle = math2d.getPointByRad(center, radius, middleAngle);
    return {
        start,
        end,
        h,
        center,
        radius,
        middle,
        startAngle,
        endAngle,
        middleAngle,
        angle,
        isCounterClockwise
    };
}
/** 解析图元Path的路径d得到点弧列表 */
function getPointAndArcListByPathD(d, option = {}) {
    let paths = d.split(';').filter(path => path);
    let { rotation = 0 } = option;
    return paths.map(path => {
        let strs = path.split(',');
        let list = [];
        let isClosePath = false;
        for (let str of strs) {
            let item = str.split(' ').map((string, i) => {
                if (i !== 0) {
                    return Number(string);
                }
                return string;
            });
            if (item[0] !== 'z') {
                let node = {
                    x: Number(item[1]),
                    y: Number(item[2])
                };
                if (item[0] === 'a') {
                    let arc = getCanvasArcByHGArc({
                        type: 'arc',
                        start: { x: node.x, y: node.y },
                        r: Number(item[3]),
                        startAngle: Number(item[4]),
                        angle: Number(item[5])
                    }, {
                        rotation
                    });
                    node.type = 'arc';
                    Object.assign(node, arc);
                }
                else if (item[0] === 'ta') {
                    let start = { x: node.x, y: node.y };
                    let end = { x: Number(item[3]), y: Number(item[4]) };
                    let h = Number(item[5]);
                    let arc = getCanvasArcByHGArc({
                        type: 'tArc',
                        start,
                        end,
                        h: h,
                        isBulge: (Number(item[6]))
                    }, {
                        rotation
                    });
                    node.type = 'arc';
                    Object.assign(node, arc);
                }
                else if (item[0] === 'm' || item[0] === 'l') {
                    node.type = 'point';
                    if (item[0] === 'm') {
                        node.isFirstPoint = true;
                    }
                    else {
                        node.isFirstPoint = false;
                    }
                }
                list.push(node);
            }
            else if (item[0] === 'z') {
                isClosePath = true;
            }
        }
        if (isClosePath) {
            list.push({
                type: "point",
                x: list[0].x,
                y: list[0].y
            });
        }
        return list;
    });
}
/** 获取宽度为w的直线的四个顶点 */
function getLinePointsByWidth(p1, p2, w) {
    let d = w / 2;
    let x1 = p1.x;
    let y1 = p1.y;
    let x2 = p2.x;
    let y2 = p2.y;
    // 只是一个点
    if (x1 === x2 && y1 === y2) {
        return [p1, p1, p1, p1];
    }
    // 垂直线
    if (p1.x === p2.x && p1.y !== p2.y) {
        return [
            { x: p1.x + d, y: p1.y },
            { x: p1.x + d, y: p2.y },
            { x: p2.x - d, y: p2.y },
            { x: p2.x - d, y: p1.y }
        ];
    }
    // 水平线
    if (p1.x !== p2.x && p1.y === p2.y) {
        return [
            { x: p1.x, y: p1.y + d },
            { x: p2.x, y: p1.y + d },
            { x: p2.x, y: p2.y - d },
            { x: p1.x, y: p2.y - d }
        ];
    }
    // 斜线
    if (p1.x !== p2.x && p1.y !== p2.y) {
        let pts = math2d.getParallelLinePoints(p1, p2, d, 2);
        return [
            { x: pts.x1, y: pts.y1 },
            { x: pts.x2, y: pts.y2 },
            { x: pts.x4, y: pts.y4 },
            { x: pts.x3, y: pts.y3 }
        ];
    }
}
/**
 * 圆弧拆分成点
 * @param {*} center 圆心
 * @param {*} start 起始点
 * @param {Number} angle 旋转角度（弧度值）
 * @param {Boolean} counterclockwise 是否为逆时圆
 */
function arcToPoints(center, start, angle, counterclockwise) {
    let points = [];
    let dAngle = math2d.toRads(3);
    let n = Math.abs((angle) / dAngle);
    dAngle = counterclockwise ? dAngle : -dAngle;
    for (let i = 0; i < n; i++) {
        let p = rotationPoint(center.x, center.y, start.x, start.y, dAngle * i);
        p.type = 'Point';
        points.push(p);
    }
    return points;
}
/**
 * 计算孔间距
 * @l 所处边的长度
 * @firstDist 第一个孔距离板件边缘的距离
 * @minDist 最后一个孔距离板件边缘的距离
 * @multiple 孔间距的倍数
 * @num 孔的数量
 */
function calcuHoleCap(l, firstDist, minDist, multiple, num) {
    if (num == 1)
        return 0;
    // 参数可能为字符串，将数字字符串类型转为数字类型
    l = Number(l);
    firstDist = Number(firstDist);
    minDist = Number(minDist);
    multiple = Number(multiple);
    num = Number(num);
    let tempDist = (l - firstDist - minDist) / (num - 1);
    let remainder = tempDist % multiple;
    let cap = tempDist - remainder;
    return cap;
}
/**
 * 计算孔间距的公式
 * @formula 孔间距的公式
 * @num 孔的数量
 * @l 所处边的长度
 * @firstDist 第一个孔距离边缘的距离。水平排列的孔取X值，垂直排列的孔取Y值
 */
function calcHoleCapFormula(formula, num, l, firstDist) {
    let formulaNum = Number(formula);
    // 如果是数值，则直接返回
    if (!isNaN(formulaNum)) {
        return formulaNum;
    }
    // 数量为0时，孔间距也设置为0
    if (Number(num) === 0)
        return 0;
    let values = formula.toString().split('#');
    let minDist = Number(values[0]);
    let multiple = Number(values[1]);
    return calcuHoleCap(l, firstDist, minDist, multiple, num);
}
/** 判断目标鼠标到圆弧圆心的角度是否在圆弧内(角度值) */
function isInArcByAngle(direction, sAngle, eAngle, targetAngle) {
    sAngle = math2d.toPositiveAngle(sAngle);
    eAngle = math2d.toPositiveAngle(eAngle);
    targetAngle = math2d.toPositiveAngle(targetAngle);
    if (direction === "逆时针") {
        if (sAngle >= 270 && math2d.round(eAngle) === 0)
            eAngle = 360;
        if (sAngle >= eAngle) {
            return eAngle <= targetAngle && targetAngle <= sAngle;
        }
        else {
            return !(sAngle < targetAngle && targetAngle < eAngle);
        }
    }
    else {
        // 顺时针
        if (eAngle >= 270 && math2d.round(sAngle) === 0)
            sAngle = 360;
        if (sAngle >= eAngle) {
            return !(eAngle < targetAngle && targetAngle < sAngle);
        }
        else {
            return sAngle <= targetAngle && targetAngle <= eAngle;
        }
    }
}
/** 判断点是否在圆弧上 */
function isPointInArc(direction, targetP, sp, ep, cp, r) {
    let len = math2d.getLineLength(targetP.x, targetP.y, cp.x, cp.y);
    let diff = len - r;
    // 判断是否在圆边界附近上
    if (diff > 2 || diff < -0.2)
        return false;
    let sAngle = math2d.lineAngle(sp.x, sp.y, cp.x, cp.y);
    let eAngle = math2d.lineAngle(ep.x, ep.y, cp.x, cp.y);
    let mAngle = math2d.lineAngle(targetP.x, targetP.y, cp.x, cp.y);
    return isInArcByAngle(direction, sAngle, eAngle, mAngle);
}
/** 获取某方向的投影范围(Line,Arc,TArc、Cut类才可用) */
function getRangeByAxisDirection(that, axisDirection) {
    if (that.getBox) {
        let { minx, miny, maxx, maxy } = that.getBox();
        let p1 = { x: minx, y: miny };
        let p2 = { x: maxx, y: maxy };
        return math2d.getLineProjectionRange(p1, p2, axisDirection);
    }
    return [];
}
/** 获取图形的子集 */
function getGraphNode(graph, type) {
    let childs = graph.children;
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].node === type) {
            return childs[i];
        }
    }
}
/**
 *  创建折线（箭头）的路径
 * @param {*} ctx 2d绘图上下文
 * @param {*} turnX 转折点x坐标
 * @param {*} turnY 转折点x坐标
 * @param {*} lAngle 箭头指向的角度
 * @param {*} theta 箭头短边到中线的角度
 * @param {*} len 箭头短边的长度
 * @param {*} direct 方向
 */
function createPolyLinePath(ctx, turnX, turnY, lAngle, theta, len, direct = false) {
    // 计算各个角度
    let angle1 = (lAngle + theta) * Math.PI / 180;
    let angle2 = (lAngle - theta) * Math.PI / 180;
    let topX = len * Math.cos(angle1);
    let topY = len * Math.sin(angle1);
    let botX = len * Math.cos(angle2);
    let botY = len * Math.sin(angle2);
    if (direct) { // 控制折线的方向
        topX = -topX;
        topY = -topY;
        botX = -botX;
        botY = -botY;
    }
    let arrowX = turnX + topX;
    let arrowY = turnY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(turnX, turnY);
    arrowX = turnX + botX;
    arrowY = turnY + botY;
    ctx.lineTo(arrowX, arrowY);
}
/** 判断是否含有中文字符,包含中文返回 true，不包含中文返回 false */
function isChina(s) {
    if (typeof s == "number") {
        return false;
    }
    let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(s)) {
        return false;
    }
    else {
        return true;
    }
}
/** 字符串转为html节点 */
function parseDom(arg) {
    let objE = document.createElement('div');
    objE.innerHTML = arg;
    return objE.childNodes;
}
/** 判断字符串是否为数字 */
function isNumber(str) {
    if (typeof str === 'number')
        return true;
    let re = /^\d+$/;
    let arr = str.split('.');
    if (arr.length === 1)
        return re.test(arr[0]);
    if (arr.length === 2)
        return re.test(arr[0]) && re.test(arr[1]);
    if (arr.length > 2)
        return false;
}
/** 是否含有指定的类 */
function hasClass(el, clsName) {
    return el.classList.contains(clsName);
}
/** 计算以线段为中心线，向两边分别延伸形成宽度为w，长度为线段的长的矩形，返回矩形的四个顶点 */
function getLine4Points(p1, p2, w) {
    let points;
    let d = w / 2;
    // 垂直线段
    if (p1.x === p2.x && p1.y !== p2.y) {
        points = [{
                x: p1.x - d,
                y: p1.y
            },
            {
                x: p1.x + d,
                y: p1.y
            },
            {
                x: p2.x + d,
                y: p2.y
            },
            {
                x: p2.x - d,
                y: p2.y
            }
        ];
    }
    // 水平线段
    if (p1.y === p2.y && p1.x !== p2.x) {
        points = [{
                x: p1.x,
                y: p1.y + d
            },
            {
                x: p1.x,
                y: p1.y - d
            },
            {
                x: p2.x,
                y: p2.y - d
            },
            {
                x: p2.x,
                y: p2.y + d
            }
        ];
    }
    // 斜线
    if (p1.y !== p2.y && p1.x !== p2.x) {
        let pos = math2d.getParallelLinePoints(p1, p2, 5, 2);
        points = [{
                x: pos.x1,
                y: pos.y1
            },
            {
                x: pos.x2,
                y: pos.y2
            },
            {
                x: pos.x3,
                y: pos.y3
            },
            {
                x: pos.x4,
                y: pos.y4
            }
        ];
    }
    return points;
}
function copyArray(arr, filterKeyList) {
    let result = [];
    arr.forEach(val => {
        if (isPlainObject(val)) {
            result.push(copyObject(val, filterKeyList));
        }
        else if (Array.isArray(val)) {
            result.push(copyArray(val, filterKeyList));
        }
        else {
            result.push(val);
        }
    });
    return result;
}
/** 浅拷贝 */
function copyObject(obj, filterKeyList) {
    if (isPlainObject(obj)) {
        const result = Object.create(null);
        Object.keys(obj).forEach(key => {
            if (filterKeyList && filterKeyList.includes(key)) {
                return;
            }
            //@ts-ignore
            let value = obj[key];
            if (isPlainObject(value)) {
                result[key] = copyObject(value, filterKeyList);
            }
            else if (Array.isArray(value)) {
                result[key] = copyArray(value, filterKeyList);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
    else if (Array.isArray(obj)) {
        //@ts-ignore
        return copyArray(obj, filterKeyList);
    }
    else {
    }
}
/** 是否为普通对象 */
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
/** 导入文件 */
function importFile(id, callback) {
    let selectedFile = document.getElementById(id).files[0]; // 获取读取的File对象
    //   let name = selectedFile.name// 读取选中文件的文件名
    //   let size = selectedFile.size// 读取选中文件的大小
    let reader = new FileReader(); // 这里是核心！！！读取操作就是由它完成的。
    reader.readAsText(selectedFile); // 读取文件的内容
    reader.onload = function () {
        callback(this.result); // 当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
    };
}
/** 获取元素的css属性值 */
function getStyle(el, styleName) {
    return window.getComputedStyle(el)[styleName];
}
/** 显示/隐藏切换 */
function changeDisplay(id, value) {
    let el = document.getElementById(id);
    if (!el)
        return;
    if (value) {
        el.style.display = value;
    }
    else {
        // 显示或隐藏菜单
        if (getStyle(el, 'display') === 'block') {
            el.style.display = 'none';
        }
        else {
            el.style.display = 'block';
        }
    }
}
/** 设置DOM位置 */
function setDomPosition(dom, x, y) {
    dom.style.left = x + 'px';
    dom.style.top = y + 'px';
}
function compareNumbers(a, b) {
    return a - b;
}
function getHoleCoords(obj, max) {
    let arr = [];
    Object.keys(obj).forEach(key => {
        let arrStr = JSON.stringify(obj[key]);
        if (arr.indexOf(arrStr) === -1) {
            arr.push(arrStr);
        }
    });
    return arr.map((item) => {
        let itemArr = JSON.parse(item);
        itemArr = itemArr.sort();
        itemArr.unshift(0);
        itemArr.push(max);
        return itemArr;
    });
}
/** 判断孔是否在选择框内 */
function isHCInSelectBox(box, bound, matrix) {
    let newPoints = [];
    let p1 = {
        x: bound.minx,
        y: bound.miny
    };
    let p2 = {
        x: bound.minx,
        y: bound.maxy
    };
    let p3 = {
        x: bound.maxx,
        y: bound.maxy
    };
    let p4 = {
        x: bound.maxx,
        y: bound.miny
    };
    let points = [p1, p2, p3, p4];
    points.forEach(p => {
        let _p = mat2d.transformCoord(p, matrix);
        newPoints.push(_p);
    });
    for (let i = 0; i < newPoints.length; i++) {
        let p = newPoints[i];
        let result = box.minx <= p.x &&
            box.maxx >= p.x &&
            box.miny <= p.y &&
            box.maxy >= p.y;
        if (!result)
            return false;
    }
    return true;
}
/** 计算鼠标按下移动位置 */
function getMoveD(downPot) {
    let scale = 1 / transform2d.scale;
    let dx = Math.round((mouse.pos.x - downPot.x) * scale);
    let dy = Math.round(-(mouse.pos.y - downPot.y) * scale);
    if (transform2d.rotation === 90) {
        [dx, dy] = [dy, -dx];
    }
    if (transform2d.rotation === 180) {
        [dx, dy] = [-dx, -dy];
    }
    if (transform2d.rotation === 270) {
        [dx, dy] = [-dy, dx];
    }
    return {
        dx,
        dy
    };
}
/** 获取点的坐标 */
function getPoint(node) {
    if (node.node === 'Point' || node.node == "TArc") {
        return {
            x: node.attr.X.value,
            y: node.attr.Y.value
        };
    }
}
function swap(a, b) {
    a ^= b;
    b ^= a;
    a ^= b;
}
/** 两线段的相交检测 */
function IsLSIntersection(a1, b1, a2, b2) {
    if (a1 === undefined || b1 === undefined || a2 === undefined || b2 === undefined) {
        return 0;
    }
    let Result = 1;
    if (b1 < a1) {
        swap(a1, b1);
    }
    if (b2 < a2) {
        swap(a2, b2);
    }
    if ((a2 <= a1) && (b2 >= b1)) {
        return Result;
    }
    if ((a2 >= a1) && (a2 >= b1)) {
        if ((b2 > a1) && (b2 > b1)) {
            Result = 0;
        }
    }
    if ((b2 <= a1) && (b2 <= b1)) {
        if ((a2 < a1) && (b2 < b1)) {
            Result = 0;
        }
    }
    return Result;
}
/** ID添加器 */
function idCount() {
    let ids = {
        Point: 0,
        Arc: 0,
        Hole: 0,
        Cut: 0,
        Path: 0
    };
    let prefix = {
        Point: 'p-',
        Arc: 'a-',
        Hole: 'h-',
        Cut: 'c-',
        Path: 'path-'
    };
    return function (type) {
        let id = `${prefix[type]}${ids[type]}`;
        ids[type]++;
        return id;
    };
}
/** 导出文本 */
function exportRaw(name, data) {
    let urlObject = window.URL || window.webkitURL || window;
    let exportBlob = new Blob([data]);
    let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    function fakeClick(obj) {
        let ev = document.createEvent('MouseEvents');
        ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        obj.dispatchEvent(ev);
    }
    saveLink.href = urlObject.createObjectURL(exportBlob);
    saveLink.download = name;
    fakeClick(saveLink);
}
let IDCount = idCount();
/** 读取文本文件 */
function readFileText() {
}
/** 根据文件名获取文件后缀 */
function getFileType(filename = '') {
    let arr = filename.split('.');
    return arr.pop();
}
/** 读取文件 */
function readFile(fileType, isMultiple = false) {
    return new Promise((resolve, reject) => {
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('multiple', isMultiple);
        if (fileType) {
            input.setAttribute('accept', '.' + fileType);
        }
        input.onchange = (e) => {
            let data = {
                files: e.target.files,
                value: e.target.value
            };
            resolve(data);
        };
        input.click();
    });
}
/**
 * @description: 二进制形式读取txt文件 并判断其是否为utf-8
 * @param {type}
 * @return:
 */
function readFile2(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (evt) {
            resolve(evt.target.result);
        };
        reader.readAsArrayBuffer(file);
    });
}
function isUtf8(file) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield readFile2(file);
        return isUtf8Npm(new Uint8Array(res));
    });
}
// 解析文件
function decodeFile(file, type = 'text', encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        if (!file) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject();
            return;
        }
        let fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        switch (type) {
            case 'binary':
                fileReader.readAsBinaryString(file);
                break;
            case 'dataUrl':
                fileReader.readAsDataURL(file);
                break;
            case 'text':
            default:
                fileReader.readAsText(file, encoding);
                break;
        }
    });
}
// 读取文本文件
function readTextFiles(option) {
    let { fileType = '', isMultiple = true, encoding = 'utf-8' } = option;
    return new Promise((resolve, reject) => {
        readFile(fileType, isMultiple).then(data => {
            function readFiles(files) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = [];
                    for (let file of files) {
                        let value = yield decodeFile(file, 'text', encoding);
                        result.push({
                            name: file.name,
                            value: value || ''
                        });
                    }
                    return result;
                });
            }
            resolve(readFiles(data.files));
        });
    });
}
/** 反转数组，改变原数组 */
function reverse(list) {
    let temp = list.splice(0, list.length);
    for (let i = temp.length - 1; i >= 0; i--) {
        let node = temp[i];
        if (node.node === 'TArc') {
            let x1 = node.attr.X;
            let y1 = node.attr.Y;
            let isBulge = Number(node.attr.IsBulge.value) == 1 ? 0 : 1;
            node.attr.X = node.attr.X2;
            node.attr.Y = node.attr.Y2;
            node.attr.X2 = x1;
            node.attr.Y2 = y1;
            node.attr.IsBulge = {
                formula: isBulge,
                value: isBulge
            };
        }
        list.push(temp[i]);
    }
}
/** 获取子属性的值 */
function getSubValue(keyName, obj) {
    let attr = {};
    for (let key in obj) {
        if (obj[key] && hasProperty(obj[key], keyName)) {
            attr[key] = obj[key][keyName];
        }
    }
    return attr;
}
/** 获取点围绕中心点旋转后的坐标 */
function rotationPoint(cx, cy, x, y, rotation) {
    let sin = math2d.round(Math.sin(rotation), 10);
    let cos = math2d.round(Math.cos(rotation), 10);
    let x1 = x - cx;
    let y1 = y - cy;
    let x2 = x1 * cos - y1 * sin;
    let y2 = y1 * cos + x1 * sin;
    return {
        x: cx + x2,
        y: cy + y2
    };
}
/** 判断是否有某个属性 */
function hasProperty(target, keyName) {
    if (typeof target !== 'object')
        return false;
    if (target instanceof Array)
        return false;
    if (target.hasOwnProperty) {
        return target.hasOwnProperty(keyName);
    }
    else {
        let keys = Object.keys(target);
        return keys.indexOf(keyName) !== -1;
    }
}
function promiseAllSettled(promises) {
    // if(Promise.allSettled) return Promise.allSettled(promises)
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("arguments must be an array"));
        }
        const promiseNum = promises.length;
        let results = new Array(promiseNum);
        let counter = 0;
        for (let i = 0; i < promiseNum; i++) {
            promises[i].then(data => {
                results[i] = {
                    status: 'fulfilled',
                    value: data
                };
                counter++;
                if (counter === promiseNum) {
                    return resolve(results);
                }
            }).catch(err => {
                results[i] = {
                    status: 'rejected',
                    value: err
                };
                counter++;
                if (counter === promiseNum) {
                    return resolve(results);
                }
            });
        }
    });
}
/** 解析对象字符串 */
function parseObjectString(str, reg) {
    if (!str)
        return {};
    str = str.replace(reg, '\"');
    return JSON.parse(str);
}
// 将BD数据转为可绘制图形的数据
function transformToCanvasData(list) {
    let result = list.map(data => {
        let newData = {
            type: "",
            x: data.X,
            y: data.Y
        };
        if (data.node === "Point") {
            newData.type = "Point";
        }
        else if (data.node === "Arc") {
            let arc = getCanvasArcByHGArc({
                type: "arc",
                start: { x: data.X, y: data.Y },
                r: data.R,
                startAngle: data.StartAngle,
                angle: data.Angle,
            });
            arc.type = "Arc";
            arc.startAngle = -arc.startAngle;
            arc.endAngle = -arc.endAngle;
            arc.isCounterClockwise = !arc.isCounterClockwise;
            Object.assign(newData, arc);
        }
        else if (data.node === "TArc") {
            let tarc = getCanvasArcByHGArc({
                type: "tArc",
                start: { x: data.X, y: data.Y },
                end: { x: data.X2, y: data.Y2 },
                h: data.ChordH,
                isBulge: data.IsBulge,
            });
            tarc.type = "Arc";
            tarc.startAngle = -tarc.startAngle;
            tarc.endAngle = -tarc.endAngle;
            tarc.isCounterClockwise = !tarc.isCounterClockwise;
            Object.assign(newData, tarc);
        }
        return newData;
    });
    return result;
}
/**  图形尺寸转为BD尺寸 */
function graphSizeToBDSize(l, d, h, di) {
    let bl = l;
    let bw = d;
    let bh = h;
    di = Number(di);
    switch (di) {
        // 层板
        case 0:
        case 1:
        case 5:
            break;
        // 背板
        case 2:
        case 3:
            bl = l;
            bw = h;
            bh = d;
            break;
        // 侧板
        case 4:
        case 6:
            bl = d;
            bw = h;
            bh = l;
            break;
    }
    // if(di === '1'){
    //   bl = l
    //   bw = d
    //   bh = h
    // }
    // else if(di == '2'){
    //   bw = h
    //   bh = d
    // }else if( di == '3'){
    //   bl = h
    //   bw = l
    //   bh = d
    // }else if( di == '4'){
    //   bl = h
    //   bw = d
    //   bh = l
    // }else if( di == '5'){
    //   bl = d
    //   bw = l
    //   bh = h
    // }else if( di == '6'){
    //   bl = d
    //   bw = h
    //   bh = l
    // }
    return {
        bl,
        bw,
        bh
    };
}
/** 解析拉伸字段Stretch */
function parseStretch(stretch = '') {
    let strs = stretch.split(',');
    let result = {};
    strs.forEach(str => {
        let values = str.split(':');
        let keyName = values[0];
        let range = values[1];
        if (keyName && range) {
            let ranges = range.split('#');
            result[keyName] = {
                start: ranges[0] || 0,
                end: ranges[1] || 0,
            };
        }
    });
    // 默认有轮廓的拉伸值
    if (!result['Graph']) {
        result['Graph'] = {
            start: 0,
            end: 0
        };
    }
    return result;
}
