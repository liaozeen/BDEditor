var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * 本文件主要用来区分张建的dts,防止冲突
 */
class HGJUtil_Block {
    /** 获取blockBase64 */
    getBlockB64(block, softid, imgW, imgH) {
        return new Promise((res, rej) => {
            /** 创建一个临时的div，因为截图要用到。 */
            let tempDiv = document.createElement("div");
            /** 创建用来截图的对象 */
            let gSnapshot = new CSnapshot(softid, tempDiv, 'snapshotCanvas', imgW, imgH);
            // 重新计算数据里的MemData，因为截图需要
            gMainApp.PreComputeProduct(block, undefined, false, true);
            // 开始截图
            gSnapshot.BuildModelFromJson(block, () => {
                let snagImgBase64 = gSnapshot.GetImageData("image/png");
                res(snagImgBase64);
            });
        });
    }
    /** 设置板件的自定义参数,会耗一定的性能 */
    setBlockArg(arg, val) {
        let num = Number(val);
        /** 只能字符串 */
        if (isNaN(num)) {
            arg.SV = val;
        }
        // 可以是数字
        else {
            arg.V = num;
            delete arg.SV;
        }
    }
    /** 往上寻找板件
     * @param func 不写则取最高顶点
     */
    upLoopFindBlock(blockid, func) {
        let block;
        if (typeof blockid == "string") {
            block = gMainApp.GetBlockByGuid(blockid);
        }
        else {
            block = blockid;
        }
        if (!block) {
            return;
        }
        if (!func) {
            func = (c) => {
                var _a;
                if (!((_a = c === null || c === void 0 ? void 0 : c.MemData) === null || _a === void 0 ? void 0 : _a.Parent)) {
                    return true;
                }
                return false;
            };
        }
        let targetBlock;
        let loopFunc = () => {
            var _a;
            if (!block) {
                return;
            }
            let check = func(block);
            if (check) {
                targetBlock = block;
                return;
            }
            if (!((_a = block === null || block === void 0 ? void 0 : block.MemData) === null || _a === void 0 ? void 0 : _a.Parent)) {
                return;
            }
            block = gMainApp.GetBlockByGuid(block.MemData.Parent);
            loopFunc();
        };
        loopFunc();
        return targetBlock;
    }
    /** 往下寻找板件 */
    downLoopFindBlock(blockid, func, op) {
        let block;
        if (typeof blockid == "string") {
            block = gMainApp.GetBlockByGuid(blockid);
        }
        else {
            block = blockid;
        }
        if (!block) {
            return;
        }
        if ((op === null || op === void 0 ? void 0 : op.checkSize) && block.MemData.Size) {
            if (block.MemData.Size.L <= 0 || block.MemData.Size.H <= 0 || block.MemData.Size.D <= 0) {
                return;
            }
        }
        let targetBlock;
        let loopFunc = (childBlock) => {
            var _a;
            if (!childBlock) {
                return;
            }
            if ((op === null || op === void 0 ? void 0 : op.checkSize) && childBlock.MemData.Size) {
                if (childBlock.MemData.Size.L <= 0 || childBlock.MemData.Size.H <= 0 || childBlock.MemData.Size.D <= 0) {
                    return;
                }
            }
            let check = func(childBlock);
            if (check) {
                targetBlock = childBlock;
                return;
            }
            if (!((_a = childBlock === null || childBlock === void 0 ? void 0 : childBlock.Product) === null || _a === void 0 ? void 0 : _a.BlockList)) {
                return;
            }
            for (let i = 0; i < childBlock.Product.BlockList.length; i++) {
                let newChildBlock = childBlock.Product.BlockList[i];
                if (!newChildBlock) {
                    continue;
                }
                loopFunc(newChildBlock);
                if (targetBlock) {
                    return;
                }
            }
        };
        loopFunc(block);
        return targetBlock;
    }
    /** 张建获取2d坐标大法 */
    GetBox3DataIn2DSpace(boardGuid, viewType) {
        // let boardModel: Model;
        // if (this.view2D.currentProduct2D != undefined) {
        //     boardModel = <Model>this.view2D.currentProduct2D.wireModel.GetObj3DByGUID(boardGuid);
        // }
        // console.log(boardModel)
        let boardBox3 = new Box3();
        // /**如果我这边可以找到，那就用Model对象产生Box3对象。------------------------- */
        // if (boardModel != undefined) {
        //     boardBox3.ExpandByModel(boardModel);
        // }
        // /**如果我这边都找不到，那么估计是胡敏没有让我画出来。------------------------- */
        // /**我直接用胡敏的HGJSON来产生Box3对象。 */
        // else {
        boardBox3.ExpandByBlockData(gMainApp.GetBlockByGuid(boardGuid));
        // }
        let rootHgJson = this.upLoopFindBlock(boardGuid);
        let outSpaceBox = new Box3();
        outSpaceBox.ExpandByBlockData(rootHgJson);
        let minValue;
        let maxValue;
        switch (viewType) {
            case ViewType.frontView:
                minValue = new THREE.Vector3(boardBox3.minX, boardBox3.minY, boardBox3.minZ);
                maxValue = new THREE.Vector3(boardBox3.maxX, boardBox3.maxY, boardBox3.maxZ);
                break;
            case ViewType.backView:
                minValue = new THREE.Vector3(outSpaceBox.maxX - boardBox3.maxX, boardBox3.minY - outSpaceBox.minY, outSpaceBox.maxZ - boardBox3.maxZ);
                maxValue = new THREE.Vector3(outSpaceBox.maxX - boardBox3.minX, boardBox3.maxY - outSpaceBox.minY, outSpaceBox.maxZ - boardBox3.minZ);
                break;
            case ViewType.leftView:
                minValue = new THREE.Vector3(boardBox3.minZ - outSpaceBox.minZ, boardBox3.minY - outSpaceBox.minY, outSpaceBox.maxX - boardBox3.maxX);
                maxValue = new THREE.Vector3(boardBox3.maxZ - outSpaceBox.minZ, boardBox3.maxY - outSpaceBox.minY, outSpaceBox.maxX - boardBox3.minX);
                break;
            case ViewType.rightView:
                minValue = new THREE.Vector3(outSpaceBox.maxZ - boardBox3.maxZ, boardBox3.minY - outSpaceBox.minY, boardBox3.minX - outSpaceBox.minX);
                maxValue = new THREE.Vector3(outSpaceBox.maxZ - boardBox3.minZ, boardBox3.maxY - outSpaceBox.minY, boardBox3.maxX - outSpaceBox.minX);
                break;
            case ViewType.topView:
                minValue = new THREE.Vector3(boardBox3.minX - outSpaceBox.minX, outSpaceBox.maxZ - boardBox3.maxZ, boardBox3.minY - outSpaceBox.minY);
                maxValue = new THREE.Vector3(boardBox3.maxX - outSpaceBox.minX, outSpaceBox.maxZ - boardBox3.minZ, boardBox3.maxY - outSpaceBox.minY);
                break;
            case ViewType.bottomView:
                minValue = new THREE.Vector3(outSpaceBox.maxX - boardBox3.maxX, outSpaceBox.maxZ - boardBox3.maxZ, outSpaceBox.maxY - boardBox3.maxY);
                maxValue = new THREE.Vector3(outSpaceBox.maxX - boardBox3.minX, outSpaceBox.maxZ - boardBox3.minZ, outSpaceBox.maxY - boardBox3.minY);
                break;
        }
        let returnData = {
            min: minValue,
            max: maxValue
        };
        return returnData;
    }
    /** 张建获取板件朝向大法  */
    BoardIsFacing(theBoardBlock) {
        var _a;
        let block;
        if (typeof theBoardBlock == "string") {
            block = gMainApp.GetBlockByGuid(theBoardBlock);
        }
        else {
            block = theBoardBlock;
        }
        let boardWorldMatrix = new THREE.Matrix4();
        if (((_a = block === null || block === void 0 ? void 0 : block.MemData) === null || _a === void 0 ? void 0 : _a.Matrix) != undefined) {
            boardWorldMatrix.fromArray(block.MemData.Matrix.elements);
        }
        let rotateMatrix = new THREE.Matrix4();
        rotateMatrix.extractRotation(boardWorldMatrix);
        let forwardDir = new THREE.Vector3(0, 0, 1);
        forwardDir.applyMatrix4(rotateMatrix);
        let faceViewType;
        /**x朝向。---------------------------  */
        if (Math.abs(forwardDir.x) > Math.abs(forwardDir.y) && Math.abs(forwardDir.x) > Math.abs(forwardDir.z)) {
            if (forwardDir.x > 0) {
                faceViewType = ViewType.rightView;
            }
            else {
                faceViewType = ViewType.leftView;
            }
        }
        /**y朝向。---------------------------  */
        else if (Math.abs(forwardDir.y) > Math.abs(forwardDir.x) && Math.abs(forwardDir.y) > Math.abs(forwardDir.z)) {
            if (forwardDir.y > 0) {
                faceViewType = ViewType.topView;
            }
            else {
                faceViewType = ViewType.bottomView;
            }
        }
        /**z朝向。--------------------------- */
        else {
            if (forwardDir.z > 0) {
                faceViewType = ViewType.frontView;
            }
            else {
                faceViewType = ViewType.backView;
            }
        }
        let returnString = "";
        for (let key in ViewType) {
            if (isNaN(Number(key))) {
                if (faceViewType & ViewType[key]) {
                    if (key != "all") {
                        returnString += (key + " ");
                    }
                }
            }
        }
        return returnString.trim();
    }
}
class HGJUtil_K3D {
    /** k3d转2d图形 */
    k3dTo2DImage(json, list, other) {
        return __awaiter(this, void 0, void 0, function* () {
            let haveOut = false;
            let x = other.x || 0;
            let y = other.y || 0;
            json.width = other.w;
            json.height = other.h;
            json.deep = other.d || 18;
            let decode = yield this.decodeK3DPath(json);
            let xmljson = XmlUtil.toJson(decode);
            let decodeXml = this.decodeK3DXml(xmljson[0]);
            let data = yield gMainView.mView2D_F.mViewer.K3dTo2DImage(json);
            if (!data.isRectangleDoor && data.outProfileV2List && data.outProfileV2List.length > 0) {
                haveOut = true;
                let numList = [];
                data.outProfileV2List.forEach(p => {
                    numList.push(p.x, p.y);
                });
                // let color="rgba(110,110,110,0.3)"
                let color = "black";
                list.push({ X: x, Y: y, TYPE: "POLYGON", Name: "k3d外轮廓", Points: numList, isClose: true, strokeStyle: color, isIgnore: true });
            }
            if (data.internalPathList) {
                data.internalPathList.forEach(data => {
                    let numList = [];
                    data.pathV2List.forEach(p => {
                        numList.push(p.x, p.y);
                    });
                    let obj = { X: x, Y: y, TYPE: "POLYGON", Name: "k3d内轮廓轮廓", Points: numList, isClose: data.isClose, strokeStyle: "rgba(110,110,110,0.3)", isIgnore: true };
                    if (!data.isFill) {
                        obj.fillStyle = "rgba(0,0,0,0)";
                    }
                    list.push(obj);
                });
            }
            return { haveOut, decodeXml };
        });
    }
    // async loadK3dByUrl(this:)
    /** jeef,获取k3d的数据 */
    getK3DData(url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_a = HgHttpTool === null || HgHttpTool === void 0 ? void 0 : HgHttpTool.prototype) === null || _a === void 0 ? void 0 : _a.PostHttpDataForm) == "undefined") {
                return;
            }
            let func = HgHttpTool.prototype.PostHttpDataForm;
            var resPathUrl = self.location.origin + '/hgsoft_base/K3d/getK3dByPath.action';
            let softid;
            if (typeof gMainApp != "undefined" && gMainApp != undefined) {
                softid = gMainView.mQdSoftid;
            }
            else {
                softid = JSON.parse(localStorage.getItem("loginCorpInfo")).qdSoftId;
            }
            return new Promise((reslove, _reject) => __awaiter(this, void 0, void 0, function* () {
                if (!url || !(url.lastIndexOf('.k3d') > 0)) {
                    reslove(undefined);
                    // console.warn("不是合法k3d")
                    return;
                }
                let newUrl = resPathUrl + url;
                /** 查看数据库是否已经存储了 */
                if (g2DList[newUrl]) {
                    reslove(g2DList[newUrl]);
                }
                else {
                    try {
                        let res = yield func(resPathUrl, { 'qdsoft': softid, 'path': url });
                        if (res) {
                            g2DList[newUrl] = res;
                            reslove(res);
                        }
                        else {
                            console.warn("不是合法k3d");
                            reslove(undefined);
                        }
                    }
                    catch (_b) {
                        console.warn("不是合法k3d");
                        reslove(undefined);
                    }
                }
            }));
        });
    }
    /** 获取k3d用的xml字符串数据 */
    getK3dParamXmlStr(params) {
        let json = {};
        ObjUtil.forEach(params, param => {
            json[param.variableParam] = param.value == undefined ? (param.defaultValue.toString()) : (param.value.toString());
        });
        let obj = this.getXmlParamsStr(json);
        return obj;
    }
    /** k3d图元数据转换 */
    K3dPrimitivesDBTranspathParamData(k3dPrimitivesDB) {
        let data = {
            PlaneXY: [],
            PlaneXZ: [],
            PlaneYZ: []
        };
        let key;
        for (let i = 0; i < k3dPrimitivesDB.length; i++) {
            let db = k3dPrimitivesDB[i];
            switch (db.plane) {
                case "XY":
                    key = "PlaneXY";
                    break;
                case "XZ":
                    key = "PlaneXZ";
                    break;
                case "YZ":
                    key = "PlaneYZ";
                    break;
                default:
                    key = undefined;
                    break;
            }
            if (!key) {
                continue;
            }
            data[key].push({});
            let m = data[key].length - 1;
            for (let j = 0; j < db.data.length; j++) {
                data[key][m][db.data[j].variableParam] = db.data[j].value != undefined ? db.data[j].value : db.data[j].defaultValue;
            }
        }
        return data;
    }
    /** 获取k3d的数据 */
    getK3dOPData(op) {
        var _a, _b, _c;
        let k3dInfo = op.k3dInfo;
        let k3dInfoDB = op.k3dInfoDB ? ObjUtil.JsonParse(op.k3dInfoDB) : undefined;
        if (!k3dInfoDB && k3dInfo) {
            k3dInfoDB = JSON.parse(k3dInfo);
        }
        if (k3dInfoDB) {
            if ((_a = op === null || op === void 0 ? void 0 : op.k3dData) === null || _a === void 0 ? void 0 : _a.k3dParam) {
                let panelK3dParam = op.k3dData.k3dParam;
                for (let key in k3dInfoDB) {
                    if (!panelK3dParam[key]) {
                        continue;
                    }
                    k3dInfoDB[key].value = panelK3dParam[key].value;
                }
            }
        }
        let k3dPrimitives = op.k3dPrimitives ? ObjUtil.JsonParse(op.k3dPrimitives) : undefined;
        let k3dPrimitivesDB;
        if (!k3dPrimitivesDB && k3dPrimitives) {
            k3dPrimitivesDB = JSON.parse(k3dPrimitives);
        }
        if (k3dPrimitivesDB) {
            if ((_b = op === null || op === void 0 ? void 0 : op.k3dData) === null || _b === void 0 ? void 0 : _b.k3dPrimitives) {
                let panelK3dPrimitives = op.k3dData.k3dPrimitives;
                for (let i = 0; i < k3dPrimitivesDB.length; i++) {
                    if (!panelK3dPrimitives[i]) {
                        continue;
                    }
                    for (let j = 0; j < k3dPrimitivesDB[i].data.length; j++) {
                        if (!((_c = panelK3dPrimitives[i].data) === null || _c === void 0 ? void 0 : _c[j])) {
                            continue;
                        }
                        k3dPrimitivesDB[i].data[j].value = panelK3dPrimitives[i].data[j].value;
                    }
                }
            }
        }
        if (op.isInit) {
            let int = 0;
            op.k3dData = {};
            if (k3dInfoDB) {
                int++;
                op.k3dData.k3dParam = {};
                for (let key in k3dInfoDB) {
                    op.k3dData.k3dParam[key] = {};
                    op.k3dData.k3dParam[key].variableParam = k3dInfoDB[key].variableParam;
                    op.k3dData.k3dParam[key].value = k3dInfoDB[key].value != undefined ? k3dInfoDB[key].value : k3dInfoDB[key].defaultValue;
                }
            }
            if (k3dPrimitivesDB) {
                int++;
                op.k3dData.k3dPrimitives = [];
                for (let i = 0; i < k3dPrimitivesDB.length; i++) {
                    let db = k3dPrimitivesDB[i];
                    let data = { data: [], plane: db.plane };
                    for (let j = 0; j < db.data.length; j++) {
                        let child = db.data[j];
                        data.data.push({
                            value: child.value != undefined ? child.value : child.defaultValue,
                            variableParam: child.variableParam
                        });
                    }
                    op.k3dData.k3dPrimitives.push(data);
                }
            }
            if (int == 0) {
                op.k3dData = undefined;
            }
        }
        return {
            k3dInfoDB,
            k3dPrimitivesDB,
            k3dData: op.k3dData
        };
    }
    /** 获取k3dbase64的数据 */
    getXmlK3DUserB64(k3dPrimitivesDB, otherData) {
        if (!otherData) {
            otherData = {};
        }
        if (k3dPrimitivesDB) {
            let data = this.K3dPrimitivesDBTranspathParamData(k3dPrimitivesDB);
            otherData["K3dExtraParams"] = data;
        }
        let str = JSON.stringify(otherData);
        // 对编码的字符串转化base64
        let b64Func = new CBase64();
        let base64 = b64Func.encode(str);
        return base64;
    }
}
function HGJUtil_decodeK3DPath(urlOrJson) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let json;
        if (typeof urlOrJson == "undefined") {
            console.warn("找不到k3d的数据");
            return;
        }
        else if (typeof urlOrJson == "string") {
            let data = yield this.getK3DData(urlOrJson);
            let bigJson = JSON.parse(data);
            if (!bigJson.data) {
                console.warn("找不到k3d的数据");
                return;
            }
            json = JSON.parse(bigJson.data);
        }
        else {
            json = urlOrJson;
        }
        let randomList = [{}, {}];
        let randomKeyList = ["L", "W", "CA", 'CB', 'CC', 'CD', 'CE', "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "BH"];
        randomList.forEach(child => {
            randomKeyList.forEach(key => {
                child[key] = Math.random();
            });
        });
        let checkSameValFunc = (a, b) => {
            if (a == b) {
                return true;
            }
            let evalA = this.hgEval(randomList[0], a);
            let evalB = this.hgEval(randomList[0], b);
            if (!evalA.status || !evalB.status || evalA.value != evalB.value) {
                return false;
            }
            evalA = this.hgEval(randomList[1], a);
            evalB = this.hgEval(randomList[1], b);
            if (!evalA.status || !evalB.status || evalA.value != evalB.value) {
                return false;
            }
            return true;
        };
        /** 解析path大法 */
        let decodePathFunc = (d, param, outStartP) => {
            let lines = [];
            let newLines = [];
            if (!d) {
                return lines;
            }
            let list = [];
            let arr = d.split(/,|;/);
            arr.forEach(child => {
                if (!child) {
                    return;
                }
                let childList = child.split(" ");
                list.push({ type: childList[0], data: childList.slice(1) });
            });
            let start;
            let prev;
            list.forEach(child => {
                switch (child.type) {
                    case "m":
                        start = new JPos(child.data[0], child.data[1]);
                        prev = new JPos(child.data[0], child.data[1]);
                        break;
                    case "l":
                        let pos = new JPos(child.data[0], child.data[1]);
                        lines.push({ type: "l", start: prev.clone(), end: pos });
                        prev = pos.clone();
                        break;
                    case "ta":
                        let tarc = {
                            startX: child.data[0],
                            startY: child.data[1],
                            endX: child.data[2],
                            endY: child.data[3],
                            chordH: child.data[4],
                            IsBulge: child.data[5]
                        };
                        if (!start) {
                            start = new JPos(tarc.startX, tarc.startY);
                            prev = new JPos(tarc.startX, tarc.startY);
                        }
                        lines.push({ start: prev.clone(), end: new JPos(tarc.startX, tarc.startY), type: "l" });
                        prev = new JPos(tarc.endX, tarc.endY);
                        lines.push({ start: new JPos(tarc.startX, tarc.startY), end: new JPos(tarc.endX, tarc.endY), type: "ta" });
                        break;
                    case "z":
                        lines.push({ start: prev.clone(), end: start.clone(), type: "z" });
                        break;
                }
            });
            newLines = decodeLinesFunc(lines, param, outStartP);
            return newLines;
        };
        /** 解析线段集合大法 */
        let decodeLinesFunc = (lines, param, outStartP) => {
            let newLines = [];
            lines.forEach(line => {
                if (line.type == "ta") {
                    return;
                }
                let xCheck = checkSameValFunc(line.start.x, line.end.x);
                let yCheck = checkSameValFunc(line.start.y, line.end.y);
                // 重叠了
                if (xCheck && yCheck) {
                    return;
                }
                let startStrP = outStartP ? new JPos(`(${outStartP.x})+${line.start.x}`, `(${outStartP.y})+${line.start.y}`) : line.start.clone();
                let endStrP = outStartP ? new JPos(`(${outStartP.x})+${line.end.x}`, `(${outStartP.y})+${line.end.y}`) : line.end.clone();
                // 斜线
                if (!xCheck && !yCheck) {
                    newLines.push({ start: startStrP, end: endStrP, type: "l" });
                    return;
                }
                // 直角
                let endP = new JPos(this.hgParamX2dEval(param, line.end.x), this.hgParamX2dEval(param, line.end.y));
                let startP = new JPos(this.hgParamX2dEval(param, line.start.x), this.hgParamX2dEval(param, line.start.y));
                let len;
                let deltaX = (endP.x - startP.x);
                let deltaY = (endP.y - startP.y);
                if (deltaX + deltaY > 0) {
                    if (!xCheck) {
                        len = `(${line.end.x})-(${line.start.x})`;
                    }
                    else {
                        len = `(${line.end.y})-(${line.start.y})`;
                    }
                }
                else {
                    if (!xCheck) {
                        len = `(${line.start.x})-(${line.end.x})`;
                    }
                    else {
                        len = `(${line.start.y})-(${line.end.y})`;
                    }
                }
                newLines.push({ start: startStrP, end: endStrP, type: "l", len: len });
            });
            return newLines;
        };
        /** 解析轮廓大法 */
        let decodePlaneFunc = (dom, param) => {
            let lines = [];
            let start;
            let prev;
            let type = "l";
            let len = dom.children.length;
            for (let i = 0; i <= len; i++) {
                let child = dom.children[i % len];
                if (child.tagName != "Point" && child.tagName != "Arc" && child.tagName != "TArc") {
                    continue;
                }
                if (child.tagName == "Arc" || child.tagName == "TArc") {
                    type = "ta";
                    continue;
                }
                if (!start) {
                    start = new JPos(child.getAttribute("X"), child.getAttribute("Y"));
                    prev = start.clone();
                    type = "l";
                    continue;
                }
                else {
                    let p = new JPos(child.getAttribute("X"), child.getAttribute("Y"));
                    lines.push({ start: prev, end: p.clone(), type: type });
                    prev = p.clone();
                }
                type = "l";
            }
            let newLines = decodeLinesFunc(lines, param);
            return newLines;
        };
        let appendLinesFunc = (dom, lines) => {
            lines.forEach(line => {
                let lineDom = xml.createElement("Line");
                lineDom.setAttribute("startX", line.start.x);
                lineDom.setAttribute("startY", line.start.y);
                lineDom.setAttribute("endX", line.end.x);
                lineDom.setAttribute("endY", line.end.y);
                if (line.len != undefined) {
                    lineDom.setAttribute("len", line.len.toString());
                }
                dom.append(lineDom);
            });
        };
        let doc = new DOMParser();
        let xml = doc.parseFromString(json.doorXml, "text/xml");
        let keys = ["PlaneXY", "PlaneXZ", "PlaneYZ"];
        let graph = (_a = xml.getElementsByTagName("Graph")) === null || _a === void 0 ? void 0 : _a[0];
        graph.setAttribute("materialLabel", json.materialLabel || "");
        let graphParam = this.getX2DParam(graph);
        for (let k = 0; k < keys.length; k++) {
            let plane = (_b = xml.getElementsByTagName(keys[k])) === null || _b === void 0 ? void 0 : _b[0];
            if (!plane || plane.children.length == 0) {
                continue;
            }
            let planeLines = decodePlaneFunc(plane, graphParam);
            let poly = xml.createElement("Poly");
            plane.append(poly);
            appendLinesFunc(poly, planeLines);
            let faceA = (_c = plane.getElementsByTagName("FaceA")) === null || _c === void 0 ? void 0 : _c[0];
            let faceB = (_d = plane.getElementsByTagName("FaceB")) === null || _d === void 0 ? void 0 : _d[0];
            let pathList = [];
            [{ type: "FaceA", data: faceA }, { type: "FaceB", data: faceB }].forEach(child => {
                var _a, _b;
                if (!child.data) {
                    return;
                }
                let list = child.data.getElementsByTagName("Path");
                for (let i = 0; i < list.length; i++) {
                    let childB = list[i];
                    childB.setAttribute("materialLabel", ((_b = (_a = json === null || json === void 0 ? void 0 : json.pathSaveDataList) === null || _a === void 0 ? void 0 : _a[i]) === null || _b === void 0 ? void 0 : _b.materialLabel) || "");
                    let start = { x: childB.getAttribute("X") || "0", y: childB.getAttribute("Y") || "0" };
                    let childParam = this.getX2DParam(childB);
                    let decodeChildParm = this.decodeX2dParam(graphParam, childParam);
                    let lines = decodePathFunc(childB.getAttribute("d"), decodeChildParm, start);
                    appendLinesFunc(childB, lines);
                }
            });
        }
        return xml.documentElement.outerHTML;
    });
}
function HGJUtil_decodeK3DXml(data) {
    let globalPointList = [];
    let globalLineList = [];
    let pathList = [];
    /** 解析轮廓 */
    let setPolyFunc = (child, list) => {
        child.children.forEach(c => {
            if (c.node == "Line") {
                list.push(c);
            }
        });
    };
    /** 设置path */
    let setPathFunc = (child) => {
        let path = { pointList: [], lineList: [], path: child };
        setPolyFunc(child, path.lineList);
        pathList.push(path);
        let pointList = {};
        path.lineList.forEach(c => {
            let pStartAttr = { X: c.attr["startX"], Y: c.attr["startY"] };
            let pEndAttr = { X: c.attr["endX"], Y: c.attr["endY"] };
            [pStartAttr, pEndAttr].forEach(ca => {
                let str = ca.X + "_" + ca.Y;
                if (!pointList[str]) {
                    pointList[str] = { attr: ca };
                }
            });
        });
        for (let key in pointList) {
            let c = pointList[key];
            path.pointList.push({ node: "Point", children: [], attr: c.attr });
        }
    };
    /** 循环方法 */
    let loopFunc = (child) => {
        if (child.node == "Graph") {
            child.children.forEach(c => {
                loopFunc(c);
            });
            return;
        }
        if (["PlaneXY", "PlaneYZ", "PlaneXZ"].indexOf(child.node) != -1 && child.children.length > 0) {
            child.children.forEach(c => {
                if (c.node == "Point") {
                    globalPointList.push(c);
                    return;
                }
                if (c.node == "Extra") {
                    c.children.forEach(ca => {
                        loopFunc(ca);
                    });
                    return;
                }
                if (c.node == "Poly") {
                    setPolyFunc(c, globalLineList);
                    return;
                }
            });
            return;
        }
        if (['FaceA', "FaceB"].indexOf(child.node) != -1) {
            child.children.forEach(c => {
                if (c.node == "Path") {
                    setPathFunc(c);
                    return;
                }
            });
            return;
        }
    };
    // console.log(data)
    loopFunc(data);
    let cKeyList = ["CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP"];
    let sKeyList = ["L", "W"];
    let lKeyList = ["len", "endX", "endY", "startX", "startY"];
    let pKeyList = ["X", "Y"];
    let replaceFunc = (c, replaceKeyList, targetKey, replaceStr) => {
        replaceKeyList.forEach(rKey => {
            if (c.attr[rKey] == undefined) {
                return;
            }
            c.attr[rKey] = ObjUtil.replaceAll(c.attr[rKey], targetKey, replaceStr);
        });
    };
    pathList.forEach(c => {
        cKeyList.forEach(ckey => {
            if (c.path.attr[ckey] == undefined) {
                return;
            }
            c.lineList.forEach(ca => {
                replaceFunc(ca, lKeyList, ckey, `${ckey}${c.path.attr["KeyName"]}`);
            });
            c.pointList.forEach(ca => {
                replaceFunc(ca, pKeyList, ckey, `${ckey}${c.path.attr["KeyName"]}`);
            });
        });
        sKeyList.forEach(sKey => {
            if (c.path.attr[sKey] == undefined) {
                return;
            }
            c.lineList.forEach(ca => {
                replaceFunc(ca, lKeyList, sKey, `(${c.path.attr[sKey]})`);
            });
            c.pointList.forEach(ca => {
                replaceFunc(ca, pKeyList, sKey, `(${c.path.attr[sKey]})`);
            });
        });
    });
    return {
        globalPointList,
        globalLineList,
        pathList
    };
}
class HGJUtil_Mat {
    getMaterialObjKey(name) {
        let keyList = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"];
        let nameList = ["门芯主色", "皮革软包", "装饰条", "玻璃", "金属", "边框", "其他"];
        return keyList.find((child, i) => {
            return nameList[i] == name;
        });
    }
    getMaterialObjName(key) {
        let keyList = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"];
        let nameList = ["门芯主色", "皮革软包", "装饰条", "玻璃", "金属", "边框", "其他"];
        return nameList.find((child, i) => {
            return keyList[i] == key;
        });
    }
}
class HGJUtil_Other {
    /** 方向循环大法 */
    compassForeach(cb) {
        let keys = ["d", "l", "r", "u"];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            cb(key);
        }
    }
    /** 查找错误的数据,暂时只有门,抽屉 */
    checkSpaceMissingData(blockid) {
        let block;
        if (typeof blockid == "string") {
            block = gMainApp.GetBlockByGuid(blockid);
        }
        else {
            block = blockid;
        }
        if (!block) {
            return false;
        }
        let checkBlock = this.downLoopFindBlock(block, (child) => {
            if (!child.Tag) {
                return false;
            }
            if (child.Tag.indexOf("门") != -1) {
                if (child.MyClass == "掩门,掩门") {
                    let errData = gDoorObj.CheckMissingDataError(child);
                    if (errData.length > 0) {
                        return true;
                    }
                }
                else if (child.MyClass == "趟门,趟门") {
                    let errData = gSlidingObj.CheckMissingDataError(child);
                    if (errData.length > 0) {
                        return true;
                    }
                }
            }
            else if (child.Tag.indexOf("抽屉") != -1) {
                let errData = gDrawerObj.checkMissingDataError(child);
                if (errData.length > 0) {
                    return true;
                }
            }
            else if (child.Tag.indexOf("酒格") != -1) {
                let errData = wineRackData.model.errorMissing(child);
                if (errData.length > 0) {
                    return true;
                }
            }
            return false;
        }, { checkSize: true });
        if (checkBlock) {
            return true;
        }
        else {
            return false;
        }
    }
    /** 通过板件获取板件的所在的柜体 */
    getClosetByGuid(blockid) {
        let block;
        if (typeof blockid == "string") {
            block = gMainApp.GetBlockByGuid(blockid);
        }
        else {
            block = blockid;
        }
        if (!block) {
            return;
        }
        let returnData = { parent: undefined, closet: undefined };
        let loopFunc = () => {
            if (block.Tag && block.Tag.indexOf("柜体") != -1) {
                returnData.closet = block;
                return;
            }
            if (!block.MemData.Parent) {
                return;
            }
            returnData.parent = block = gMainApp.GetBlockByGuid(block.MemData.Parent);
            loopFunc();
        };
        loopFunc();
        return returnData;
    }
    /** 华广tarc转JArc */
    hgTArcToJArc(hgTArc) {
        let arc = new JArc();
        let start = new JPos(hgTArc.startX, hgTArc.startY);
        let end = new JPos(hgTArc.endX, hgTArc.endY);
        arc.radius = (4 * Math.pow(hgTArc.chordH, 2) + Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2)) / (8 * hgTArc.chordH);
        let center = PosUtil.getCenterPos(start, end);
        let radian = PosUtil.getRadian(start, end);
        let L = arc.radius - hgTArc.chordH;
        arc.center = PosUtil.getRayPos(center, radian + Math.PI / 2, L * (hgTArc.IsBulge ? -1 : 1));
        arc.startAngle = PosUtil.getRadian(arc.center, start);
        arc.endAngle = PosUtil.getRadian(arc.center, end);
        arc.isCounterClockwise = hgTArc.IsBulge;
        return arc;
    }
    /** 公式去掉0 */
    hgSubZeroFromFormula(formula) {
        let arr = [];
        let prev = "";
        let ex = ['(', ")", "+", "-", "*", "/"];
        /** 是否出现小数点 */
        let isHavePoint = false;
        /** 前面是否没有非0数 */
        let isPrevNonZero = false;
        for (let i = 0; i < formula.length; i++) {
            let a = formula[i];
            if (prev == "0" && !isHavePoint && ex.indexOf(a) == -1 && a != "." && !isPrevNonZero) {
                arr[arr.length - 1] = a;
                prev = a;
                continue;
            }
            if (a == ".") {
                isHavePoint = true;
            }
            else if (ex.indexOf(a) != -1) {
                isHavePoint = false;
                isPrevNonZero = false;
            }
            else if (a != "0") {
                isPrevNonZero = true;
            }
            arr.push(a);
            prev = a;
        }
        let newFormular = arr.join("");
        return newFormular;
    }
    /**
     * 华广用的解析公式大法
     * @param vals 变量列表
     * @param formula 公式
     * @returns value为解析后的值,status为:-1,公式为字符串,0,公式解析失败,1公式解析成功
     */
    hgEval(vals, formula) {
        let status = 0;
        let value;
        if (typeof formula == "number") {
            value = formula;
            status = -1;
            return { value, status };
        }
        let funcStr = "";
        for (let key in vals) {
            funcStr += `var ${key}=${vals[key]}; `;
        }
        let str = `(()=>{${funcStr}return ${formula};})()`;
        try {
            value = eval(str);
            status = 1;
        }
        catch (_a) {
            value = 0;
            status;
        }
        return { value, status };
    }
}
class HGJUtil_X2D {
    /** 华广x2d变量解析大法 */
    hgParamX2dEval(prop, str) {
        if (typeof str == "number")
            return str;
        let L = prop["L"] || 0;
        let W = prop["W"] || 0;
        let X = prop["X"] || 0;
        let Y = prop["Y"] || 0;
        let BH = prop["BH"] || 0;
        let CA = prop["CA"] || 0;
        let CB = prop["CB"] || 0;
        let CC = prop["CC"] || 0;
        let CD = prop["CD"] || 0;
        let CE = prop["CE"] || 0;
        let CF = prop["CF"] || 0;
        let CG = prop["CG"] || 0;
        let CH = prop["CH"] || 0;
        let CI = prop["CI"] || 0;
        let CJ = prop["CJ"] || 0;
        let CK = prop["CK"] || 0;
        let CL = prop["CL"] || 0;
        let CM = prop["CA"] || 0;
        let CN = prop["CN"] || 0;
        let CO = prop["CO"] || 0;
        let CP = prop["CP"] || 0;
        try {
            let data = eval(str);
            return data;
        }
        catch (_a) {
            console.warn(`无法解析 ${str},应该是缺少字段了`);
            return 0;
        }
    }
    /** 获取x2d参数 */
    getX2DParam(dom) {
        let keys = ["L", "W", "X", "Y", "BH", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP"];
        let prop = {};
        if (!dom) {
            return prop;
        }
        keys.forEach(key => {
            let data = dom.getAttribute(key);
            prop[key] = data;
        });
        return prop;
    }
    /** 覆盖x2d参数 */
    overX2DParam(orginParam, currentParam) {
        for (let key in currentParam) {
            if (currentParam[key] == "" || currentParam[key] == undefined) {
                currentParam[key] = orginParam[key];
            }
        }
    }
    /**解析x2d */
    decodeX2dParam(prevParam, currentParam) {
        let newCurrentParam = {};
        for (let key in currentParam) {
            if (currentParam[key] != undefined && currentParam[key] != "") {
                newCurrentParam[key] = this.hgParamX2dEval(prevParam, currentParam[key]);
            }
        }
        return newCurrentParam;
    }
    /** 解析x2d的arc,一般都经过x2dXmlPointAndArc转换后的数据 */
    decodeX2dArc(hgArc) {
        if (hgArc.originData.node == "TArc") {
            let a = hgArc.originData.attr;
            let jarc = new JArc();
            let start = new JPos(a.X, a.Y);
            let end = new JPos(a.X2, a.Y2);
            jarc.radius = (4 * Math.pow(a.ChordH, 2) + Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2)) / (8 * a.ChordH);
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
        return undefined;
    }
}
class HGJUtil_XML {
    /** 快速设置华广xml */
    quickHgXml(obj, data) {
        if (!obj) {
            obj = {};
        }
        if (!data) {
            return obj;
        }
        for (let key in data) {
            if (data[key] == undefined) {
                delete obj[key];
                continue;
            }
            obj[key] = data[key];
        }
        return obj;
    }
    /** 获取xml参数字符串 */
    getXmlParamsStr(params) {
        if (!params) {
            return;
        }
        let str = "";
        ObjUtil.forEach(params, (param, key) => {
            if (key[0] != "C") {
                return;
            }
            if (key[1] == undefined) {
                return;
            }
            let index = key[1].charCodeAt(0);
            index -= 65;
            str += ` 参数${index}="${key}:${param}"`;
        });
        return str;
    }
    /** 获取华广xm的user64 */
    getHGXmlUser64(str) {
        // 对编码的字符串转化base64
        let b64Func = new CBase64();
        let base64 = b64Func.encode(str);
        return base64;
    }
}
class HGJUtil {
    constructor() {
        this.decodeK3DPath = HGJUtil_decodeK3DPath;
        this.decodeK3DXml = HGJUtil_decodeK3DXml;
    }
}
((derivedCtor, constructors) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
        });
    });
})(HGJUtil, [HGJUtil_K3D, HGJUtil_XML, HGJUtil_Other, HGJUtil_Block, HGJUtil_Mat, HGJUtil_X2D]);
var ghgjUtil = new HGJUtil();
if (typeof g2DList == "undefined") {
    g2DList = {};
}
