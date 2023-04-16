var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** 图元基类
 * @author Jeef
 */
class BitmapBase {
    constructor(sys, _data) {
        /** 是否画线,默认为true,需要继承类支持才有效 */
        this.isStorke = true;
        /** 加粗,需要文本类型图元才能生效 */
        this.isBold = false;
        /** 斜体,需要文本类型图元才能生效 */
        this.isItalic = false;
        /** 是否忽略 */
        // isIgnoreCapture?: boolean
        /** 忽略触发监听大法 */
        this.isIgnoreCaptureDispatchFunc = undefined;
        /** 矩阵 */
        this.transform = [1, 0, 0, 1, 0, 0];
        /** 样式 */
        this.style = {};
        /** 自定义的数据 */
        this.userData = {};
        /** 是否碰撞 */
        this._isHit = false;
        /** 原始线宽倍数 */
        this.lineWidthMultiple = 1;
        /** 原始字体大小倍数 */
        this.fontSizeMultiple = 1;
        /** 隐藏需要触发的方法,为了保证数据正确处理,需要外部填充,给设计框架人员使用,请不要直接调用 */
        this._hideFunc = undefined;
        /** 改变排位的方法,需要外部填充,给设计框架人员使用,请不要直接调用 */
        this._zIndexFunc = undefined;
        /** 样式的排位,非框架修改者,不能碰 */
        this._zIndex = 0;
        /** 碰撞系数 */
        this._hitCoefficient = 0;
        /** 是否阻止冒泡 */
        this._isStopPropagation = false;
        /** 填充图片,满足svg导出才这样设计 */
        this.fillImg = undefined;
        /** 填充图元,满足svg导出才这样设计的 */
        this.fillBitmap = undefined;
        /** 检查数据是否正确,可由各个继承类来实现 */
        this.checkData = () => { return true; };
        /** 转svg */
        this.toSvg = () => { return undefined; };
        /** svg二额外属性数据 */
        this.svgAttrData = undefined;
        /** 框选,默认不选中,各个继承类来实现,实现需要考虑矩阵问题,默认情况,先有图形才能框选
         */
        this.boxCheck = () => { return false; };
        /**
         * 获取包围检测盒,各个继承类来实现,实现需要考虑矩阵问题,默认情况,先有图形才能产生包围盒
         * @returns 返回起点,宽高
         */
        this.getHitBox = (isNoTrans) => { return undefined; };
        /** 是否已经开始监听 */
        this._isStartSubscribe = false;
        /** 监听订阅,事件开始监听时触发 */
        this._listenSubscribe = () => {
            /** 打开开始碰撞开关 */
            this._isStartCapture = true;
            this._isStartSubscribe = true;
        };
        /** 是否开始捕捉 */
        this._isStartCapture = true;
        /** 事件大全 */
        this.mouseenter = new JEventEmit(this._listenSubscribe);
        this.mouseleave = new JEventEmit(this._listenSubscribe);
        this.mousedown = new JEventEmit(this._listenSubscribe);
        this.contextmenu = new JEventEmit(this._listenSubscribe);
        this.mousemove = new JEventEmit(this._listenSubscribe);
        this.wheel = new JEventEmit(this._listenSubscribe);
        this.mouseup = new JEventEmit(this._listenSubscribe);
        this.click = new JEventEmit(this._listenSubscribe);
        this.dblclick = new JEventEmit(this._listenSubscribe);
        /** 改变画布,只给画布系统使用,任何人不能乱用 */
        this._changeJCanvas = BitmapBase_Util.prototype._changeJCanvas;
        /** 获取碰撞功能,需要考虑矩阵问题 */
        this.getHit = BitmapBase_Util.prototype.getHit;
        /** 赋予样式,除了本开发者,其他人不能调用 */
        this._doStyle = BitmapBase_Util.prototype._doStyle;
        /** 绘图,由图元系统或者自定义图元使用,其他情况请勿使用 */
        this._draw = BitmapBase_Util.prototype._draw;
        /**
        * 碰撞 由图元系统或者自定义图元使用,其他情况请勿使用
        * @param p 需要碰撞的坐标点,指的是画布的坐标
        */
        this._hit = BitmapBase_Util.prototype._hit;
        /** 销毁 */
        this.destory = BitmapBase_Util.prototype.destory;
        /**
            * 设置取消碰撞
            */
        this.setNoHit = BitmapBase_Util.prototype.setNoHit;
        /**
             * 触发相应的事件
             * @param eventID 事件id
             * @param p 画布坐标
             * @param e 鼠标事件
             * @returns 返回是否阻止冒泡
             */
        this.dispatchEvent = BitmapBase_Util.prototype.dispatchEvent;
        /**
         * 触发外溢相应的事件
         * @param eventID 事件id
         * @param p 画布坐标
         * @param e 鼠标事件
         * @returns 返回是否阻止冒泡
         */
        this.dispatchOutEvent = BitmapBase_Util.prototype.dispatchOutEvent;
        /** 循环大法,先大后小 */
        this.forearch = BitmapBase_Util.prototype.forearch;
        /** 获取屏幕坐标
             * @param p 画布坐标,不掺杂矩阵
             */
        this.getWinPos = BitmapBase_Util.prototype.getWinPos;
        /**
           * 设置居中
           * @param marginDistance  间隔边框距离
           * @param marginRatio  间隔边框距离比例
           * @tutorial — marginDistance和marginRatio可以一起用,效果叠加
           */
        this.setCenter = BitmapBase_Util.prototype.setCenter;
        /** 填充图片更新 */
        this.fillImgUpdate = BitmapBase_Util.prototype.fillImgUpdate;
        /** 创建填充图元 */
        this.createFillBitmap = BitmapBase_Util.prototype.createFillBitmap;
        this.sys = sys;
        if (_data)
            this.data = _data;
    }
    /** 是否忽略 */
    get isIgnoreCapture() { return this._isIgnoreCapture; }
    set isIgnoreCapture(data) {
        this._isIgnoreCapture = data;
        this.isIgnoreCaptureDispatchFunc && this.isIgnoreCaptureDispatchFunc(data);
    }
    /** 画布系统对象 */
    get _jCanvas() {
        return this.sys.jcanvas;
    }
    /** 渲染对象 */
    get ctx() {
        return this._jCanvas.ctx;
    }
    /** 父对象 */
    get parent() { return this._parent; }
    set parent(data) {
        if (data instanceof BitmapBase) {
            this._isStartCapture = true;
            this._isStartSubscribe = true;
        }
        else if (!this._isStartSubscribe) {
            this._isStartCapture = false;
        }
        this._parent = data;
    }
    /** 是否碰撞 */
    get isHit() { return this._isHit; }
    set isHit(data) {
        if (!this._isHit && data) {
            this.mouseenter.emit({ o: this, e: this._jCanvas.mouseE, p: this._jCanvas.canvasPos });
        }
        if (this._isHit && !data) {
            this.mouseleave.emit({ o: this, e: this._jCanvas.mouseE, p: this._jCanvas.canvasPos });
        }
        this._isHit = data;
    }
    /** 获取最终的线宽,图元如果有线宽就取,没有就默认乘倍数 */
    get finalLineWidth() {
        if (this.style.lineWidth) {
            return this.style.lineWidth;
        }
        return this.lineWidthMultiple * this._jCanvas.lineWidth;
    }
    /** 样式的排位 */
    get zIndex() { return this._zIndex; }
    set zIndex(data) {
        this._zIndex = data;
        if (this._zIndexFunc)
            this._zIndexFunc();
    }
    /** 碰撞系数 提高碰撞的命中的概率,需要在碰撞方法支持才能生效 */
    get hitCoefficient() { return this._hitCoefficient; }
    set hitCoefficient(data) {
        this._hitCoefficient = data;
    }
    /** 获取最终的碰撞系数,图元如果有乘倍数就取乘倍数,没有就取碰撞系数实数 */
    get finalHitCoefficient() {
        if (!this.hitCoefficientMultiple) {
            return this.hitCoefficient;
        }
        return this.hitCoefficientMultiple * this._jCanvas.lineWidth;
    }
    /** 是否阻止冒泡 */
    get isStopPropagation() {
        if (this._isStopPropagation) {
            this._isStopPropagation = false;
            return true;
        }
        return false;
    }
    /** 绘制顺序id,表达绘制先后顺序 */
    get sortID() {
        return this._sortID;
    }
    /** 阻止冒泡 */
    stopPropagation() {
        this._isStopPropagation = true;
    }
    /** 外溢事件初始化 */
    outEventInit() {
        this.outEvent = {
            mouseenter: new JEventEmit(this._listenSubscribe),
            mouseleave: new JEventEmit(this._listenSubscribe),
            mousedown: new JEventEmit(this._listenSubscribe),
            contextmenu: new JEventEmit(this._listenSubscribe),
            mousemove: new JEventEmit(this._listenSubscribe),
            wheel: new JEventEmit(this._listenSubscribe),
            mouseup: new JEventEmit(this._listenSubscribe),
            click: new JEventEmit(this._listenSubscribe),
            dblclick: new JEventEmit(this._listenSubscribe),
        };
    }
    /** 通用绑定事件 */
    // on<T extends keyof EventType, K extends EventType[T]>(eventID: T, func: (obj?: {p?:Pos,e?:MouseEvent,o?:any,i?:number}) => void): void
    on(eventID, func) {
        this[eventID].subscribe(func);
    }
    /** 通用销毁事件 */
    off(eventID, func) {
        this[eventID].unsubscribe(func);
    }
    /** 外溢绑定事件 */
    out(eventID, func) {
        this.outEvent && this.outEvent[eventID].subscribe(func);
    }
    /** 外溢销毁事件 */
    outoff(eventID, func) {
        this.outEvent && this.outEvent[eventID].unsubscribe(func);
    }
    /** 获取当前矩阵,方便获取 */
    getCurrentTransform() {
        // 要和sys通用,不能用索引大法
        if (this.currentTransform)
            return this.currentTransform;
        return [1, 0, 0, 1, 0, 0];
    }
}
class BitmapBase_Util {
    /** 改变画布,只给画布系统使用,任何人不能乱用 */
    _changeJCanvas(newJca, oldJca) {
        if (this._changeJCanvasFunc) {
            this._changeJCanvasFunc(newJca, oldJca);
        }
        if (this.children) {
            this.children.forEach(obj => {
                obj._changeJCanvas(newJca, oldJca);
            });
        }
    }
    /** 获取碰撞功能,需要考虑矩阵问题 */
    getHit(p) {
        if (this._mainHit)
            return this._mainHit(p);
        if (!this.children)
            return false;
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].getHit(p))
                return true;
        }
        return false;
    }
    /** 赋予样式 */
    _doStyle() {
        for (let key in this.style) {
            let data = this.style[key];
            if (data) {
                this.ctx[key] = data;
            }
        }
        /** 线条宽度倍化 */
        if (!this.style.lineWidth && this.lineWidthMultiple != 1) {
            this.ctx.lineWidth = this.finalLineWidth;
        }
        /** 字体大小倍数化 */
        if (!this.style.font && this.fontSizeMultiple != 1) {
            this.ctx.font = `${this._jCanvas.fontSize * this.fontSizeMultiple}px ${this._jCanvas.fontFamily}`;
        }
        /** 额外的样式 */
        /** 虚线 */
        if (this.lineDash)
            this.ctx.setLineDash(this.lineDash);
        if (this.styleReady)
            this.styleReady(this.ctx);
    }
    /** 绘图,由图元系统或者自定义图元使用,其他情况请勿使用 */
    _draw() {
        /** 隐藏就不会绘制了 */
        if (this.isHide) {
            if (this._hideFunc) {
                this._hideFunc();
            }
            return false;
        }
        /** 如果是svg且不导出svg,不需要绘制,节约性能 */
        if (this.sys.drawMode == "svg" && this.isNoToSvg) {
            return false;
        }
        /** 如果是图片且不导出图片,不需要绘制,节约性能 */
        if (this.sys.drawMode == "img" && this.isNoToImg) {
            return false;
        }
        /** 数据不对就不绘制了,以防报错 */
        if (!this.checkData())
            return false;
        /** 堆栈 */
        this.ctx.save();
        /** 设置样式 */
        this._doStyle();
        /** 设置当前矩阵 */
        /** 用ifelse,考虑了自定义图元 */
        if (this.parent)
            this.currentTransform = this.parent.currentTransform;
        else
            this.currentTransform = [1, 0, 0, 1, 0, 0];
        /** 如果叠加矩阵,修改矩阵 */
        if (this.transform) {
            this.currentTransform = MatrixUtil.multiply([], this.currentTransform, this.transform);
            this.ctx.transform(this.transform[0], this.transform[1], this.transform[2], this.transform[3], this.transform[4], this.transform[5]);
        }
        /** group情况下 */
        if (this.children && !this._mainDraw) {
            this.children.forEach(data => {
                if (data.beforeDraw)
                    data.beforeDraw();
                data._draw();
            });
        }
        else if (this._mainDraw) {
            this._mainDraw();
        }
        this.ctx.restore();
        /** 额外样式修正 */
        if (this.lineDash)
            this.ctx.setLineDash([]);
    }
    /**
     * 碰撞 由图元系统或者自定义图元使用,其他情况请勿使用
     * @param p 需要碰撞的坐标点,指的是画布的坐标
     */
    _hit(p) {
        /** 是否开始捕捉 */
        if (!this._isStartCapture) {
            this.isHit = false;
            return;
        }
        /** 忽略捕捉 */
        if (this.isIgnoreCapture) {
            this.isHit = false;
            return;
        }
        /** 数据不对就不捕捉了,以防报错 */
        if (!this.checkData()) {
            this.isHit = false;
            return;
        }
        /** 如果叠加矩阵,需要通过矩阵修改坐标 */
        if (this.transform)
            p = PosUtil.getInvertPos(p, this.transform);
        /** 判断碰撞 */
        /** 组碰撞 */
        if (this.children && !this._mainHit) {
            let hitCheck = false;
            for (let i = this.children.length - 1; i >= 0; i--) {
                if (hitCheck) {
                    this.children[i].setNoHit();
                    continue;
                }
                this.children[i]._hit(p);
                if (this.children[i].isHit) {
                    hitCheck = true;
                }
            }
            this.isHit = hitCheck;
        }
        /** 个体碰撞 */
        else {
            if (this._mainHit) {
                this.isHit = this._mainHit(p);
            }
        }
    }
    /** 销毁 */
    destory() {
        /** 如果有子对象,需要先对子对象删除 */
        if (this.children) {
            this.children.forEach(data => {
                if (data._mainDestory)
                    data._mainDestory();
                if (data._parentDestroy)
                    data._parentDestroy();
            });
        }
        if (this._mainDestory)
            this._mainDestory();
        if (this._parentDestroy)
            this._parentDestroy();
    }
    /**
    * 设置取消碰撞
    */
    setNoHit(eventID, p, e) {
        if (this.children)
            this.children.forEach(data => {
                data.setNoHit(eventID, p, e);
            });
        this.isHit = false;
    }
    /**
     * 触发相应的事件
     * @param eventID 事件id
     * @param p 画布坐标
     * @param e 鼠标事件
     * @returns 返回是否阻止冒泡
     */
    dispatchEvent(eventID, p, e, index) {
        let stopPropagationCheck = false;
        if (this.children) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i].isHit) {
                    if (this.children[i].dispatchEvent(eventID, p, e, i) || (this.children[i] && this.children[i].isStopPropagation))
                        stopPropagationCheck = true;
                    break;
                }
            }
        }
        if (!stopPropagationCheck)
            this[eventID].emit({ p: p, e: e, o: this, i: index });
        return stopPropagationCheck;
    }
    /**
     * 触发外溢相应的事件
     * @param eventID 事件id
     * @param p 画布坐标
     * @param e 鼠标事件
     * @returns 返回是否阻止冒泡
     */
    dispatchOutEvent(eventID, p, e, index) {
        if (this.children) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                if (!this.children[i].isHit) {
                    this.children[i].dispatchOutEvent(eventID, p, e, i);
                }
            }
        }
        this.outEvent && this.outEvent[eventID] && this.outEvent[eventID].emit({ p: p, e: e, o: this, i: index });
    }
    /** 循环大法,先大后小 */
    forearch(cb) {
        if (!this.children) {
            return;
        }
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            cb(child);
            child.forearch(cb);
        }
    }
    /** 获取屏幕坐标
     * @param p 画布坐标,不掺杂矩阵
     */
    getWinPos(p) {
        return this._jCanvas.getWinPos(p);
    }
    /**
    * 设置居中
    * @param marginDistance  间隔边框距离
    * @param marginRatio  间隔边框距离比例
    * @tutorial — marginDistance和marginRatio可以一起用,效果叠加
    */
    setCenter(marginDistance, marginRatio) {
        let data = this.getHitBox();
        if (!data)
            return undefined;
        this._jCanvas.setCenter({ x: data.p.x + data.w, y: data.p.y + data.h }, data.p, marginDistance, marginRatio);
        return data;
    }
    /** 填充图片更新 */
    fillImgUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fillImg)
                return;
            yield BitmapService.updateRepeat(this.fillImg);
            this.style.fillStyle = this.fillImg.pat;
            return;
        });
    }
    /** 创建填充图元 */
    createFillBitmap(width, height) {
        let jcanvas = new JCanvas();
        let div = document.createElement("div");
        jcanvas.init(div, width, height);
        let jbitmap = new CanvasBitmapSys(jcanvas);
        this.fillBitmap = jbitmap;
        let pat = this.ctx.createPattern(jcanvas.canvas, "repeat");
        this.style.fillStyle = pat;
        return jbitmap;
    }
}
/** 图元基础接口 */
class BitmapService {
    /**
     * 自动将图元插入另外图元后面,仅限同级且zIndex一样的图元
     * @param parent 对应的父对象
     * @param currentObj 例外的图元
     * @param backObj 需要插入的图元
     * @returns
     */
    static sortBack(parent, currentObj, backObj) {
        var _a, _b;
        if (currentObj.zIndex != backObj.zIndex) {
            return;
        }
        let backIndex = (_a = parent === null || parent === void 0 ? void 0 : parent.children) === null || _a === void 0 ? void 0 : _a.findIndex(obj => { return obj == backObj; });
        if (backIndex == undefined || backIndex == -1) {
            return;
        }
        parent.children.splice(backIndex, 1);
        let currentIndex = (_b = parent === null || parent === void 0 ? void 0 : parent.children) === null || _b === void 0 ? void 0 : _b.findIndex(obj => { return obj == currentObj; });
        if (currentIndex == undefined || currentIndex == -1) {
            parent.children.splice(backIndex, 0, backObj);
            return;
        }
        parent.children.splice(currentIndex + 1, 0, backObj);
    }
    /**
     * 改变zIndex的位置
     * @param parent 对应的父对象
     * @param obj 目标对象
     * @param isFirst 是否为第一次改变,如果是则一开始不用销毁旧的位置
     */
    static changeZIndex(parent, obj, isFirst = false) {
        /** 是否新加,如果不是新加就不用先销毁 */
        if (!isFirst)
            /** 销毁旧的位置 */
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i] === obj) {
                    parent.children.splice(i, 1);
                    break;
                }
            }
        /** 找到对应的位置插进去 */
        for (let i = parent.children.length - 1; i >= 0; i--) {
            if (parent.children[i].zIndex <= obj.zIndex) {
                parent.children.splice(i + 1, 0, obj);
                return false;
            }
        }
        /** 没有符合,直接推 */
        parent.children.splice(0, 0, obj);
    }
    /**
     * 通过id查找对应的对象
     * @param parent 母体
     * @param id 查找的id
     * @param isDepth 是否深入挖掘,默认为true
     */
    static selectByID(parent, id, isDepth = true) {
        if (!parent.children)
            return undefined;
        if (!isDepth)
            return parent.children.find((data) => {
                if (data.id == id)
                    return true;
                return false;
            });
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].id == id)
                return parent.children[i];
            let obj = parent.children[i];
            if (obj instanceof JGroupBitmap) {
                let a = this.selectByID(obj, id, true);
                if (a)
                    return a;
            }
        }
        return undefined;
    }
    /**
     * 修改销毁的代码
     * @param parent 需要绑定的父对象
     * @param obj 目标对象
     */
    static setDestroy(parent, obj) {
        obj._parentDestroy = () => {
            let newArr = [];
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i] == obj) {
                    continue;
                }
                newArr.push(parent.children[i]);
            }
            parent.children = newArr;
        };
    }
    /**
     * 绑定系统
     * @param parent 需要绑定的父对象
     * @param obj 目标对象
     */
    static bindSys(parent, obj) {
        if (parent instanceof CanvasBitmapSys) {
            obj.sys = parent;
        }
        else {
            obj.sys = parent.sys;
        }
        if (obj instanceof JGroupBitmap) {
            obj.children.forEach(child => {
                this.bindSys(obj, child);
            });
        }
    }
    /**
     * 绑定对象
     * @param parent 需要绑定的父对象
     * @param obj 目标对象
     */
    static bindObj(parent, obj) {
        this.changeZIndex(parent, obj, true);
        obj._zIndexFunc = () => {
            this.changeZIndex(parent, obj);
        };
        this.setDestroy(parent, obj);
        obj.parent = parent;
        this.bindSys(parent, obj);
    }
    /**
     * 创建图元(常用的基础的)
     * @param parent 父对象
     * @param _sys 图元系统
     * @param _util 工具类
     * @param type 对应的类型
     * @param data 加载的数据
     * @param isNoBind 是否绑定
     */
    static createBitmap(parent, _sys, type, data, isNoBind, projectType) {
        return this.createCustom(parent, _sys, BitmapBaseClass[type], isNoBind, data, projectType);
    }
    /**
     * 清空子对象组
     * @param parent 目标对象
     */
    static clearChildren(parent) {
        for (let i = parent.children.length - 1; i >= 0; i--) {
            parent.children[i] && parent.children[i].destory();
            // parent.children.splice(i, 1)
        }
    }
    /**
     * 创建自定义的图元
     * @param parent
     * @param _jcanvas
     * @param customClass 自定义图元类,一定是bitmapBase继承类,否则会报错,且参数是
     * _jcanvas, _util,不能有其他的
     * @param _util
     * @param isNoBind
     * @param data
     */
    static createCustom(parent, _sys, customClass, isNoBind, data, projectType) {
        let obj;
        try {
            obj = new customClass(_sys);
        }
        catch (e) {
            console.error("类导入不对");
            return undefined;
        }
        obj.id = ObjUtil.guid;
        if (data)
            obj.data = data;
        if (!isNoBind)
            this.bindObj(parent, obj);
        obj.projectType = projectType;
        if (obj._init)
            obj._init();
        return obj;
    }
    /**
     * 展示开关
     * @param parent
     * @param children
     */
    static showBitmaps(parent, ...children) {
        parent.children.forEach(child => {
            child.isHide = true;
            child.isIgnoreCapture = true;
        });
        children.forEach(child => {
            child.isHide = false;
            child.isIgnoreCapture = false;
        });
    }
    static bigToSvg(parent, svgTag) {
        parent.children.forEach(child => {
            if (child.isHide || child.isNoToSvg || !child.checkData())
                return;
            let node = child.toSvg();
            if (node) {
                if (child.svgAttrData) {
                    for (let key in child.svgAttrData) {
                        node.setAttribute(key, child.svgAttrData[key]);
                    }
                }
                svgTag.appendChild(node);
            }
        });
    }
    static SetSvgcommonAttr(obj, svgTag) {
        svgTag.setAttribute('transform', DomUtil.getMatrix(obj.transform));
        if (obj instanceof BitmapBase) {
            if (obj.isStorke && obj.lineDash)
                svgTag.setAttribute("stroke-dasharray", obj.lineDash.join(","));
        }
    }
    /** */
    static setSvgStroke(obj, svgTag, isStroke = 0, strokeColor, strokeWidth) {
        if (isStroke == -1 || (isStroke == 0 && !obj.isStorke))
            return svgTag.setAttribute('stroke', 'none');
        svgTag.setAttribute("stroke", strokeColor ? strokeColor : obj.style.strokeStyle ? obj.style.strokeStyle : obj.sys.jcanvas.strokeStyle);
        strokeWidth = strokeWidth || obj.finalLineWidth;
        svgTag.setAttribute("stroke-width", strokeWidth.toString());
    }
    static setSvgFill(obj, svgTag, isFill = 0, fillColor) {
        if (isFill == -1 || (isFill == 0 && !obj.isFill))
            return svgTag.setAttribute('fill', 'none');
        if (obj.sys && obj.fillImg) {
            let pat;
            let img;
            let defs = (obj.sys.svg.getElementsByTagNameNS("http://www.w3.org/2000/svg", "defs")[0]);
            // console.log(defs)
            for (let i = 0; i < defs.childNodes.length; i++) {
                let child = (defs.childNodes[i]);
                if (child.id == obj.fillImg.url) {
                    pat = child;
                    img = (pat.getElementsByTagNameNS("http://www.w3.org/2000/svg", 'image')[0]);
                    break;
                }
            }
            if (!pat) {
                pat = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
                pat.setAttribute('id', obj.fillImg.url);
                img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                pat.appendChild(img);
                defs.appendChild(pat);
            }
            pat.setAttribute("x", "0");
            pat.setAttribute("y", "0");
            pat.setAttribute("width", obj.fillImg.width.toString());
            pat.setAttribute("height", obj.fillImg.height.toString());
            pat.setAttribute('patternUnits', "userSpaceOnUse");
            img.setAttribute("x", "0");
            img.setAttribute("y", "0");
            img.setAttribute("width", obj.fillImg.width.toString());
            img.setAttribute("height", obj.fillImg.height.toString());
            img.href.baseVal = obj.fillImg.url;
            svgTag.setAttribute('fill', `url(#${obj.fillImg.url})`);
            return;
        }
        svgTag.setAttribute("fill", fillColor ? fillColor : obj.style.fillStyle ? obj.style.fillStyle : obj.sys.jcanvas.fillStyle);
    }
    static toSvgText(str, fontHeight, fontSize, fontFamily, side, positon, isBold, isItalic, blankW = 0) {
        let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let m = [1, 0, 0, 1, 0, 0];
        if (positon.m) {
            m = positon.m;
        }
        else {
            MatrixUtil.scale(m, m, [positon.coorX, positon.coorY]);
            MatrixUtil.translate(m, m, [positon.p.x * positon.coorX, positon.p.y * positon.coorY]);
        }
        g.setAttribute('transform', DomUtil.getMatrix(m));
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);
        text.setAttribute('x', "0");
        let allBlankW = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] != " ") {
                break;
            }
            allBlankW += blankW || 0;
        }
        text.setAttribute("dx", allBlankW.toString());
        text.setAttribute('y', (fontHeight / 2).toString());
        // text.setAttribute('y', "0")
        // text.setAttribute("dominant-baseline", "middle")
        text.setAttribute("text-anchor", side);
        text.innerHTML = str;
        text.setAttribute('font-size', fontSize.toString());
        text.setAttribute("font-family", fontFamily.toString());
        if (isBold)
            text.setAttribute("font-weight", "bold");
        if (isItalic)
            text.setAttribute("font-style", "italic");
        return { g, text };
    }
    static updateRepeat(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let func = () => {
                if (!data.canvas)
                    data.canvas = document.createElement('canvas');
                if (!data.ctx)
                    data.ctx = data.canvas.getContext('2d');
                if (data.imgWidthRatio)
                    data.width = data.imgWidth * data.imgWidthRatio;
                else if (data.canvasWidth)
                    data.width = data.canvasWidth;
                else
                    data.width = data.imgWidth;
                if (data.imgHeightRatio)
                    data.height = data.imgHeight * data.imgHeightRatio;
                else if (data.canvasHeight)
                    data.height = data.canvasHeight;
                else
                    data.height = data.imgHeight;
                data.canvas.width = data.width;
                data.canvas.height = data.height;
                data.ctx.drawImage(data.img, 0, 0, data.img.width, data.img.height, 0, 0, data.canvas.width, data.canvas.height);
                data.pat = data.ctx.createPattern(data.canvas, "repeat");
            };
            return new Promise((resolve, _reject) => {
                if (!data.img || data.url != data.oldUrl) {
                    data.img = new Image();
                    data.img.onload = () => {
                        data.imgWidth = data.img.width;
                        data.imgHeight = data.img.height;
                        func();
                        resolve();
                    };
                    data.oldUrl = data.url;
                    data.img.src = data.url;
                }
                else {
                    func();
                    resolve();
                }
            });
        });
    }
    static getHitBox(parent, checkFunc) {
        let maxX = undefined;
        let maxY = undefined;
        let minX = undefined;
        let minY = undefined;
        /** 通过循环遍历得出最大最小值 */
        parent.children.forEach(bitmap => {
            if (checkFunc(bitmap))
                return undefined;
            let data = bitmap.getHitBox();
            if (!data)
                return undefined;
            if (minX == undefined || minX > data.p.x)
                minX = data.p.x;
            if (minY == undefined || minY > data.p.y)
                minY = data.p.y;
            let w = data.p.x + data.w;
            if (maxX == undefined || maxX < w)
                maxX = w;
            let h = data.p.y + data.h;
            if (maxY == undefined || maxY < h)
                maxY = h;
        });
        if (maxX == undefined)
            return undefined;
        return PosUtil.getHitBox(PosUtil.getTransformPosArr([{ x: minX, y: minY }, { x: maxX, y: maxY }], parent.getCurrentTransform()));
    }
}
/**
 * 画布图元系统类
 * @author Jeef
 */
class CanvasBitmapSys {
    constructor(jcanvas) {
        /** 图元数组 */
        this.children = [];
        /** 是否已经初始化 */
        this._isInit = false;
        /** 是否自动绘制 */
        this._isAutoDraw = true;
        /** 是否自动碰撞 */
        this._isAutoHit = true;
        this.transform = [1, 0, 0, 1, 0, 0];
        /** 当前矩阵,记录绘画时的矩阵状况,配合transform用来计算,此处不允许修改 */
        this.currentTransform = [1, 0, 0, 1, 0, 0];
        /** 居中判断是否包括隐藏 */
        this.isGetCenterIncludeHide = false;
        /** 居中判断是否包括忽略 */
        this.isGetCenterIncludeIgnore = false;
        /** 居中判断是否包括不转换svg的元素 */
        this.isGetCenterIncludeNoToSvg = false;
        /** 居中判断是否包含不转换图片的元素 */
        this.isGetCenterIncludeNoToImg = false;
        /** 是否监听外溢事件 */
        this.isListenOutEvent = false;
        /** 绘制模式 */
        this.drawMode = "normal";
        /** 顺序id,记录绘制先后顺序,不是本开发者,不能调用 */
        this._sortID = 0;
        this._jcanvas = jcanvas;
    }
    get isInit() { return this._isInit; }
    /** 是否自动绘制 */
    get isAutoDraw() { return this._isAutoDraw; }
    set isAutoDraw(data) {
        this._isAutoDraw = data;
    }
    /** 是否自动碰撞 */
    get isAutoHit() { return this._isAutoHit; }
    set isAutoHit(data) {
        this._isAutoHit = data;
    }
    /** 兼容 */
    getCurrentTransform() { return this.currentTransform; }
    /**  */
    get jcanvas() { return this._jcanvas; }
    set jcanvas(data) {
        let old = this._jcanvas;
        this._jcanvas = data;
        if (!this.children) {
            return;
        }
        this.children.forEach(obj => {
            obj._changeJCanvas(this._jcanvas, old);
        });
    }
    /** 顺序id,记录绘制先后顺序,不是本开发者,不能调用 */
    get sortID() {
        this._sortID++;
        return this._sortID;
    }
    /** 初始化,仅此一次 */
    init() {
        if (this._isInit)
            return false;
        this._isInit = true;
        this.jcanvas.render = () => {
            this.draw();
        };
        this.jcanvas.beforeEvent = {
            mousedown: (p, e) => {
                this._commonBeforeEvent(p, e, "mousedown");
            },
            mousemove: (p, e) => {
                this._commonBeforeEvent(p, e, "mousemove");
            },
            mouseup: (p, e) => {
                this._commonBeforeEvent(p, e, "mouseup");
            },
            wheel: (p, e) => {
                this._commonBeforeEvent(p, e, "wheel");
            },
            click: (p, e) => {
                this._commonBeforeEvent(p, e, "click");
            },
            dblclick: (p, e) => {
                this._commonBeforeEvent(p, e, "dblclick");
            },
            contextmenu: (p, e) => {
                this._commonBeforeEvent(p, e, "contextmenu");
            }
        };
        this.jcanvas.afterEvent = {
            mousedown: (p, e) => {
                this._dispatchDraw();
            },
            mousemove: (p, e) => {
                this._dispatchDraw();
            },
            mouseup: (p, e) => {
                this._dispatchDraw();
            },
            wheel: (p, e) => {
                this._dispatchDraw();
            },
            click: (p, e) => {
                this._dispatchDraw();
            },
            dblclick: (p, e) => {
                this._dispatchDraw();
            }
        };
    }
    /** 触发事件 */
    dispatchEvent(p, e, eventID) {
        let hitCheck = false;
        let hitChild;
        let hitI;
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (hitCheck) {
                this.children[i].setNoHit(eventID, p, e);
                continue;
            }
            this.children[i]._hit(p);
            if (this.children[i].isHit) {
                hitChild = this.children[i];
                hitI = i;
                hitCheck = true;
            }
        }
        if (hitChild) {
            hitChild.dispatchEvent(eventID, p, e, hitI);
        }
        if (this.isListenOutEvent) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                if (!this.children[i].isHit) {
                    this.children[i].dispatchOutEvent(eventID, p, e);
                }
            }
        }
    }
    /** 循环大法,先大后小 */
    foreach(cb) {
        if (!this.children) {
            return;
        }
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            cb(child);
        }
    }
    /** 触发事件 */
    _commonBeforeEvent(p, e, eventID) {
        if (!this.isAutoHit)
            return false;
        this.dispatchEvent(p, e, eventID);
    }
    /** 碰撞 */
    hit(p) {
        this.children.forEach(data => {
            data._hit(p);
        });
    }
    _dispatchDraw() {
        this._sortID = 0;
        if (!this.isAutoDraw)
            return false;
        this.draw();
    }
    /** 绘图 */
    draw() {
        this.jcanvas.clear();
        this.children.forEach((data, i) => {
            if (data.beforeDraw) {
                data.beforeDraw();
            }
            data._sortID = this.sortID;
            data._draw();
        });
    }
    /**
     * 清空子图元数据
     */
    clear() {
        BitmapService.clearChildren(this);
    }
    /** 绑定对象 */
    bindObj(obj) {
        BitmapService.bindObj(this, obj);
    }
    /**
     * 创建图元(常用的基础的)
     * @param type 图元类型
     * @param data 需要加载的数据
     * @param isNoBind 是否绑定
     */
    createBitmap(type, data, isNoBind, projectType) {
        return BitmapService.createBitmap(this, this, type, data, isNoBind, projectType);
    }
    /**
     * 创建自定义图元
     * @param customClass 需要实例化的自定义图元类(注意是类,不是对象)
     * @param data 需要加载的数据
     * @param isNoBind 是否绑定
     */
    createCustom(customClass, data, isNoBind, projectType) {
        return BitmapService.createCustom(this, this, customClass, isNoBind, data, projectType);
    }
    /**
     * 展示开关
     * @param children
     */
    showBitmaps(...children) {
        BitmapService.showBitmaps(this, ...children);
    }
    /** 实时转svg */
    toSvg() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.svg.setAttribute("width", this.jcanvas.width.toString());
        this.svg.setAttribute("height", this.jcanvas.height.toString());
        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.svg.appendChild(defs);
        let g = document.createElementNS('http://www.w3.org/2000/svg', "g");
        this.svg.appendChild(g);
        BitmapService.bigToSvg(this, g);
        this.svg.setAttribute("viewBox", `0,0,${this.jcanvas.width},${this.jcanvas.height}`);
        g.setAttribute("transform", DomUtil.getMatrix(this.jcanvas.worldTransform));
        // svg.style.transform = 
        return this.svg;
    }
    /** 公共转svg或者转图片的方法 */
    toFullCommon(obj, drawMode) {
        let oldMode = this.drawMode;
        this.drawMode = drawMode;
        let div = document.createElement('div');
        let jcanvas = new JCanvas();
        let svg;
        let base64;
        /** 返回方法 */
        let returnFunc = () => {
            /** 切换回去原来后台框架 */
            this.jcanvas = oldJCanvas;
            this.drawMode = oldMode;
            jcanvas.transformEvent = undefined;
            /** 重绘一遍以免有问题 */
            this.draw();
            if (drawMode == "svg") {
                // @ts-ignore
                return svg;
            }
            else {
                // @ts-ignore
                return base64;
            }
        };
        if (obj.jCanvasLineWidth) {
            jcanvas.originLineWidth = obj.jCanvasLineWidth;
        }
        jcanvas.transformEvent = this.jcanvas.transformEvent;
        jcanvas.init(div, obj.w, obj.h);
        let oldJCanvas = this.jcanvas;
        /** 切换后台框架 */
        this.jcanvas = jcanvas;
        let box;
        if (obj.resizeRatio != undefined) {
            jcanvas.moveAndScale(undefined, undefined, obj.resizeRatio);
            this.draw();
            box = this.getModeHitBox(drawMode);
            // 如果啥都没画直接返回
            if (!box) {
                // @ts-ignore
                return returnFunc();
            }
            obj.w = box.w * obj.resizeRatio;
            obj.h = box.h * obj.resizeRatio;
            jcanvas.resize(obj.w, obj.h);
        }
        else if (obj.isAutoResize) {
            box = this.getModeHitBox(drawMode);
            // 如果啥都没画直接返回
            if (!box) {
                // @ts-ignore
                return returnFunc();
            }
            let ratioW = obj.w / box.w;
            let ratioH = obj.h / box.h;
            if (ratioH > ratioW) {
                obj.h = obj.w * box.h / box.w;
            }
            else {
                obj.w = obj.h * box.w / box.h;
            }
            jcanvas.resize(obj.w, obj.h);
        }
        else {
            box = this.getModeHitBox(drawMode);
            // 如果啥都没画直接返回
            if (!box) {
                // @ts-ignore
                return returnFunc();
            }
        }
        /** 全尺寸 */
        if (obj.isFullSize) {
            /** 绘制一遍以获取数据 */
            this.draw();
            if (drawMode == "svg") {
                svg = this.toSvg();
            }
            if (box && obj.isCenter) {
                if (obj.centerFunc)
                    obj.centerFunc();
                else {
                    this.jcanvas.setCenter({ x: box.p.x + box.w, y: box.p.y + box.h }, box.p, obj.marginDistance != undefined ? obj.marginDistance : 0, obj.marginRatio != undefined ? obj.marginRatio : 0);
                }
                if (drawMode == "svg") {
                    let g = svg.getElementsByTagNameNS("http://www.w3.org/2000/svg", "g")[0];
                    g.setAttribute("transform", DomUtil.getMatrix(this.jcanvas.worldTransform));
                }
            }
        }
        /** 居中尺寸 */
        else {
            this.draw();
            if (obj.centerFunc)
                obj.centerFunc();
            else {
                this.jcanvas.setCenter({ x: box.p.x + box.w, y: box.p.y + box.h }, box.p, obj.marginDistance != undefined ? obj.marginDistance : 0, obj.marginRatio != undefined ? obj.marginRatio : 0);
            }
            this.draw();
            if (drawMode == "svg") {
                svg = this.toSvg();
            }
        }
        if (drawMode == "img") {
            base64 = jcanvas.canvas.toDataURL(obj.type, obj.quality);
        }
        // @ts-ignore
        return returnFunc();
    }
    /** 后台全尺寸转base64 */
    toFullBase64(obj) {
        return this.toFullCommon(obj, "img");
    }
    /** 后台全尺寸转svg */
    toFullSvg(obj) {
        return this.toFullCommon(obj, "svg");
    }
    /** 获取svg专用的碰撞盒子 */
    getModeHitBox(type) {
        let maxX = undefined;
        let maxY = undefined;
        let minX = undefined;
        let minY = undefined;
        let func = (bitmap) => {
            if ((!this.isGetCenterIncludeIgnore && bitmap.isIgnoreCapture) || (!this.isGetCenterIncludeHide && bitmap.isHide) || (type == "svg" && !this.isGetCenterIncludeNoToSvg && bitmap.isNoToSvg) || (type == "img" && !this.isGetCenterIncludeNoToImg && bitmap.isNoToImg))
                return undefined;
            if (bitmap instanceof JGroupBitmap) {
                bitmap.children.forEach((newBit) => {
                    func(newBit);
                });
                return undefined;
            }
            let data = bitmap.checkData() ? bitmap.getHitBox() : undefined;
            if (!data)
                return undefined;
            if (minX == undefined || minX > data.p.x)
                minX = data.p.x;
            if (minY == undefined || minY > data.p.y)
                minY = data.p.y;
            let w = data.p.x + data.w;
            if (maxX == undefined || maxX < w)
                maxX = w;
            let h = data.p.y + data.h;
            if (maxY == undefined || maxY < h)
                maxY = h;
        };
        this.children.forEach(bitmap => { func(bitmap); });
        if (maxX == undefined)
            return undefined;
        return PosUtil.getHitBox([{ x: minX, y: minY }, { x: maxX, y: maxY }]);
    }
    /**
     * 设置居中
     * @param marginDistance  间隔边框距离
     * @param marginRatio  间隔边框距离比例
     * @tutorial — marginDistance和marginRatio可以一起用,效果叠加
     */
    setCenter(marginDistance, marginRatio) {
        let maxX = undefined;
        let maxY = undefined;
        let minX = undefined;
        let minY = undefined;
        this.children.forEach(bitmap => {
            if ((!this.isGetCenterIncludeIgnore && bitmap.isIgnoreCapture) || (!this.isGetCenterIncludeHide && bitmap.isHide) || (!this.isGetCenterIncludeNoToSvg && bitmap.isNoToSvg) || (!this.isGetCenterIncludeNoToImg && bitmap.isNoToImg))
                return undefined;
            let data = bitmap.getHitBox();
            if (data) {
                if (maxX == undefined || maxX < data.p.x + data.w) {
                    maxX = data.p.x + data.w;
                }
                if (minX == undefined || minX > data.p.x)
                    minX = data.p.x;
                if (maxY == undefined || maxY < data.p.y + data.h) {
                    maxY = data.p.y + data.h;
                }
                if (minY == undefined || minY > data.p.y)
                    minY = data.p.y;
            }
        });
        if (!maxX)
            return undefined;
        this.jcanvas.setCenter(new JPos(maxX, maxY), new JPos(minX, minY), marginDistance, marginRatio);
        return { p: new JPos(minX, minY), w: maxX - minX, h: maxY - minY };
    }
    /** 查找功能 */
    find(checkFunc, children) {
        if (!children) {
            children = this.children;
        }
        if (!children) {
            return undefined;
        }
        for (let i = 0; i < children.length; i++) {
            let check = checkFunc(children[i]);
            if (check) {
                return children[i];
            }
            if (children[i].children) {
                let data = this.find(checkFunc, children[i].children);
                if (data) {
                    return data;
                }
            }
        }
        return undefined;
    }
    /** 自动将图元插入另外图元后面,仅限同级且zIndex一样的图元 */
    sortBack(currentObj, backObj) {
        BitmapService.sortBack(this, currentObj, backObj);
    }
    /** 快速获取填充图片数据,用来重复使用 */
    getFillImage(op) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = new JFillimg();
            data.url = op.url;
            data.oldUrl = op.url;
            data.imgWidthRatio = op.imgWidthRatio;
            data.imgHeightRatio = op.imgHeightRatio;
            data.canvas = document.createElement("canvas");
            data.ctx = data.canvas.getContext("2d");
            data.img = new Image();
            return new Promise((res, rej) => {
                data.img.onload = () => {
                    data.imgWidth = data.img.width;
                    data.imgHeight = data.img.height;
                    if (data.imgWidthRatio) {
                        data.width = data.imgWidth * data.imgWidthRatio;
                    }
                    else if (data.canvasWidth) {
                        data.width = data.canvasWidth;
                    }
                    else {
                        data.width = data.imgWidth;
                    }
                    if (data.imgHeightRatio) {
                        data.height = data.imgHeight * data.imgHeightRatio;
                    }
                    else if (data.canvasHeight) {
                        data.height = data.canvasHeight;
                    }
                    else {
                        data.height = data.imgHeight;
                    }
                    data.canvas.width = data.width;
                    data.canvas.height = data.height;
                    data.ctx.drawImage(data.img, 0, 0, data.img.width, data.img.height, 0, 0, data.canvas.width, data.canvas.height);
                    data.pat = data.ctx.createPattern(data.canvas, "repeat");
                    res(data);
                };
                data.img.src = data.url;
            });
        });
    }
}
class JFillimg {
}
class JRectBaseBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this._mainHit = (p) => {
            if (!this.absPosArr)
                return false;
            return PosUtil.isPosInGeo(p, this.absPosArr) == 0 ? false : true;
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            if (!this.absPosArr || !this.checkData())
                return false;
            /** 获取点集合 */
            let transPosArr = PosUtil.getTransformPosArr(this.absPosArr, this.getCurrentTransform());
            let rect = PosUtil.getRectByTwoPos(minP, maxP);
            return PosUtil.isGeoInGeo(transPosArr, rect, isAbsInclude, true);
            // /** 如果不完全包围,优先判断点集合是否在图形里面 */
            // if (!isAbsInclude && posUtil.isPosArrInGeo(rect, transPosArr, true))
            //     return true
            // /** 不行再判断图形与图形包围 */
            // return posUtil.isGeoInGeo(transPosArr, rect, isAbsInclude)
        };
        this.getHitBox = (isNoTrans) => {
            if (!this.absPosArr)
                return undefined;
            if (isNoTrans) {
                return PosUtil.getHitBox(this.absPosArr);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr(this.absPosArr, this.getCurrentTransform()));
        };
    }
    /**
     * 计算旋转矩阵(绕文字旋转)
     * @param rad 旋转弧度
     * @param pos 文字坐标,没有默认data.pos
     * @returns 返回矩阵
     */
    _calRotateTransform(rad, pos) {
        let a = MatrixUtil.translate([], [1, 0, 0, 1, 0, 0], [pos.x, pos.y]);
        MatrixUtil.rotate(a, a, rad);
        MatrixUtil.translate(a, a, [-pos.x, -pos.y]);
        return a;
    }
}
class JTextBitmapBase extends JRectBaseBitmap {
    constructor() {
        super(...arguments);
        this.isStorke = false;
        this.isFill = true;
        /** 文字高度比例 */
        this.fontHeightRatio = 1.2;
        /** 文字高度 */
        this.fontHeight = 0;
        /** 坐标高度偏移,用来实现文字基线问题 */
        this.posFontHeightDelta = 0;
        /** 一个文字的宽度 */
        this.oneFontW = 0;
        /** 空格相对一个文字的宽度的比例 */
        this.blankWRatio = 0.5;
        this.textData = [];
        this.checkData = () => {
            if (!this.data || this.data.text == undefined || !this.pos)
                return false;
            return true;
        };
        this._getSize = () => {
            let data = this.style.font ? Number(this.style.font.split('px')[0]) : this._jCanvas.fontSize;
            return data;
        };
        this.updateRect = () => { };
        this.toSvg = () => {
            let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.updateRect();
            this.currentScale = this._getSize();
            this.currentFamily = this._getFamily();
            this.textData.forEach(data => {
                let p = new JPos(this.pos.x + data.p.x, this.pos.y - data.p.y + this.fontHeight / 2);
                let side = "middle";
                if (this.style.textAlign == "center") {
                    side = "middle";
                }
                else if (this.style.textAlign == "left") {
                    side = "start";
                }
                else if (this.style.textAlign == "right") {
                    side = "end";
                }
                if (this.isStorke) {
                    let textData = BitmapService.toSvgText(data.content, this.fontHeight, this.currentScale, this.currentFamily, side, { coorX: this._jCanvas.coordinateX, coorY: this._jCanvas.coordinateY, p: p }, data.isBold != undefined ? data.isBold : this.isBold, this.isItalic, this.oneFontW * this.blankWRatio);
                    BitmapService.setSvgStroke(this, textData.text);
                    g.appendChild(textData.g);
                }
                if (this.isFill) {
                    let textData = BitmapService.toSvgText(data.content, this.fontHeight, this.currentScale, this.currentFamily, side, { coorX: this._jCanvas.coordinateX, coorY: this._jCanvas.coordinateY, p: p }, data.isBold != undefined ? data.isBold : this.isBold, this.isItalic, this.oneFontW * this.blankWRatio);
                    BitmapService.setSvgFill(this, textData.text);
                    g.appendChild(textData.g);
                }
            });
            BitmapService.SetSvgcommonAttr(this, g);
            return g;
        };
    }
    get maxHeight() {
        if (!this.checkData())
            return undefined;
        return this._maxHeight;
    }
    get maxWidth() {
        if (!this.checkData())
            return undefined;
        return this._maxWidth;
    }
    _getFamily() {
        return this.data.fontFamily ? this.data.fontFamily : this.style.font ? this.style.font.split(" ")[1] : this._jCanvas.fontFamily;
    }
    get pos() {
        if (!this.data) {
            return undefined;
        }
        if (!this.posFontHeightDelta) {
            return this.data.pos;
        }
        if (!this.data.pos) {
            return undefined;
        }
        return new JPos(this.data.pos.x, this.data.pos.y + (this.posFontHeightDelta * this.fontHeight * this.fontHeightRatio));
    }
    /**
     * 计算旋转矩阵(绕文字旋转)
     * @param rad 旋转弧度
     * @param pos 文字坐标,没有默认data.pos
     * @returns 返回矩阵
     */
    calRotateTransform(rad, pos) {
        if (!pos)
            pos = this.pos;
        if (!pos)
            return undefined;
        return this._calRotateTransform(rad, pos);
    }
}
/**
 * 弧形图元
 * @维护 lze
 */
class JArcBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "arc";
        /** 主要碰撞 */
        this._mainHit = (p) => {
            /** 获取线宽 */
            let distance = this.finalLineWidth / 2;
            distance += this.finalHitCoefficient;
            /* 判断点是否在弧线上 */
            let a = PosUtil.isInArcLine(this.data.center, this.data.radius, this.data.startAngle, this.data.endAngle, p, this.data.isCounterClockwise, distance);
            return a == undefined ? false : true;
        };
        this.checkData = () => {
            /** 判断弧线的数据是否齐全 */
            if (this.data && this.data.center && this.data.startAngle != undefined && this.data.endAngle != undefined)
                return true;
            return false;
        };
        /* 主要绘图 */
        this._mainDraw = () => {
            /** 通过canvas自带算法绘制 */
            let { center, radius, startAngle, endAngle, isCounterClockwise = true } = this.data;
            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, radius, startAngle, endAngle, isCounterClockwise);
            this.ctx.stroke();
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            if (!this.checkData())
                return false;
            let posArr = this.getPosArr();
            posArr = PosUtil.getTransformPosArr(posArr, this.getCurrentTransform());
            let boxArr = PosUtil.getRectByTwoPos(minP, maxP);
            return PosUtil.isPosArrInGeo(posArr, boxArr, isAbsInclude);
        };
        this.getHitBox = (isNoTrans) => {
            if (isNoTrans) {
                return PosUtil.getHitBox(this.getPosArr());
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr(this.getPosArr(), this.getCurrentTransform()));
        };
        this.toSvg = () => {
            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            let d = PosUtil.canvasArcTransSvgArc(this.data);
            let dArr = ["M", d.sx, d.sy, "A", d.rx, d.ry, 0, d.largeArcFlag, d.sweepFlag, d.ex, d.ey];
            path.setAttribute('d', dArr.join(" "));
            path.setAttribute('fill', "none");
            BitmapService.setSvgStroke(this, path);
            // let radian =PosUtil
            return path;
        };
    }
    getStart() {
        return PosUtil.getRayPos(this.data.center, this.data.startAngle, this.data.radius);
    }
    getEnd() {
        return PosUtil.getRayPos(this.data.center, this.data.endAngle, this.data.radius);
    }
    /** 获取点集合,不带矩阵 */
    getPosArr() {
        return PosUtil.getArcPosArr(this.data.center, this.data.radius, this.data.startAngle, this.data.endAngle, this.data.isCounterClockwise);
    }
}
class JCircle {
}
/** 圆形基础图元类 */
class JCircleBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        /** 填充,默认为true */
        this.isFill = true;
        this.type = 'circle';
        this.checkData = () => {
            if (!this.data || !this.data.center || this.data.radius == undefined)
                return false;
            return true;
        };
        this._mainDraw = () => {
            this.ctx.beginPath();
            this.ctx.arc(this.data.center.x, this.data.center.y, this.data.radius, Math.PI * 2, 0, true);
            this.ctx.closePath();
            if (this.isFill)
                this.ctx.fill();
            if (this.isStorke)
                this.ctx.stroke();
        };
        this._mainHit = (p) => {
            /** 判断点与圆心距离是否小于半径 */
            let distance = this.data.radius;
            distance += this.isStorke ? this.finalLineWidth : 0;
            return PosUtil.getDistance(this.data.center, p) < distance;
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            if (!this.checkData())
                return false;
            /** 先算出矩阵转换的数据先 */
            let transCenter = PosUtil.getTransformPos(this.data.center, this.getCurrentTransform());
            let transX = PosUtil.getTransformPos({ x: this.data.center.x + this.data.radius, y: this.data.center.y }, this.getCurrentTransform());
            let radius = PosUtil.getDistance(transCenter, transX);
            let limit = PosUtil.getLimitPosArr(minP, maxP);
            maxP = limit[0];
            minP = limit[1];
            let newMinP = isAbsInclude ? { x: minP.x + radius, y: minP.y + radius } : { x: minP.x - radius, y: minP.y - radius };
            let newMaxP = isAbsInclude ? { x: maxP.x - radius, y: maxP.y - radius } : { x: maxP.x + radius, y: maxP.y + radius };
            let boxArr = PosUtil.getRectByTwoPos(newMinP, newMaxP);
            return PosUtil.isPosInGeo(transCenter, boxArr) == 0 ? false : true;
        };
        this.getHitBox = (isNoTrans) => {
            let width = this.isStorke ? ((this.finalLineWidth) / 2) : 0;
            let start = new JPos(this.data.center.x - this.data.radius - width, this.data.center.y - this.data.radius - width);
            let end = new JPos(this.data.center.x + this.data.radius + width, this.data.center.y + this.data.radius + width);
            if (isNoTrans) {
                return PosUtil.getHitBox([start, end]);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr([start, end], this.getCurrentTransform()));
        };
        this.toSvg = () => {
            let circle = JCircleBitmap.toSvg({ center: this.data.center, radius: this.data.radius, isFill: this.isFill, fillStyle: this.style.fillStyle, obj: this });
            return circle;
        };
    }
    /** 静态转换svg方法 */
    static toSvg(op) {
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.r;
        circle.setAttribute("cx", op.center.x.toString());
        circle.setAttribute("cy", op.center.y.toString());
        circle.setAttribute("r", op.radius.toString());
        if (op.isFill) {
            let fillStyle = op.fillStyle;
            if (fillStyle == undefined)
                fillStyle = op.fillStyle;
            circle.setAttribute("fill", fillStyle);
        }
        else {
            circle.setAttribute("fill", "none");
        }
        BitmapService.setSvgStroke(op.obj, circle);
        BitmapService.SetSvgcommonAttr(op.obj, circle);
        return circle;
    }
}
/** 椭圆基础图元类 */
class JEllipseBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "ellipse";
        this.xRatio = 0.5;
        this.yRatio = 0.6;
        this.kRatio = .5522848;
        this.checKData = () => {
            if (this.data && this.data.center && this.data.rx != undefined)
                return true;
            return false;
        };
        this._mainDraw = () => {
            this._BezierEllipse1ToCtx(this.data.center.x, this.data.center.y, this.data.rx, this.data.ry == undefined ? this.data.rx : this.data.ry);
            if (this.isStorke)
                this.ctx.stroke();
            if (this.isFill)
                this.ctx.fill();
        };
        this._mainHit = (p) => {
            let newP = new JPos(p.x - this.data.center.x, p.y - this.data.center.y);
            let a = (Math.pow(newP.x, 2) / Math.pow(this.data.rx, 2)) + (Math.pow(newP.y, 2) / Math.pow(this.data.ry == undefined ? this.data.rx : this.data.ry, 2));
            return a <= 1;
        };
        this.getHitBox = (isNoTrans) => {
            let rx = this.data.rx;
            let ry = this.data.ry == undefined ? rx : this.data.ry;
            let start = new JPos(this.data.center.x - rx, this.data.center.y - ry);
            let end = new JPos(this.data.center.x + rx, this.data.center.y + ry);
            if (isNoTrans) {
                return PosUtil.getHitBox([start, end]);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr([start, end], this.getCurrentTransform()));
        };
        this.toSvg = () => {
            // console.log(this.data)
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", this._getPathDByBezierEllipse1(this.data.center.x, this.data.center.y, this.data.rx, this.data.ry == undefined ? this.data.rx : this.data.ry));
            if (this.isFill) {
                let fillStyle = this.style.fillStyle;
                if (fillStyle == undefined)
                    fillStyle = this._jCanvas.fillStyle;
                path.setAttribute("fill", fillStyle);
            }
            else {
                path.setAttribute("fill", "none");
            }
            BitmapService.setSvgStroke(this, path, 1);
            BitmapService.SetSvgcommonAttr(this, path);
            return path;
            // let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            // circle.r
            // circle.setAttribute("cx", this.data.center.x.toString())
            // circle.setAttribute("cy", this.data.center.y.toString())
            // circle.setAttribute("r", this.data.rx.toString())
            // if (this.isFill) {
            //     let fillStyle = this.style.fillStyle
            //     if (fillStyle == undefined)
            //         fillStyle = this._jCanvas.fillStyle
            //     circle.setAttribute("fill", <string>fillStyle)
            // }
            // else {
            //     circle.setAttribute("fill", "none")
            // }
            // BitmapService.setSvgStroke(this, circle)
            // BitmapService.SetSvgcommonAttr(this, circle)
            // return circle
        };
    }
    _BezierEllipse1ToCtx(x, y, rx, ry) {
        //关键是bezierCurveTo中两个控制点的设置
        //0.5和0.6是两个关键系数（在本函数中为试验而得）
        let ox = this.xRatio * rx, oy = this.yRatio * ry;
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        //从椭圆纵轴下端开始逆时针方向绘制
        this.ctx.moveTo(0, ry);
        this.ctx.bezierCurveTo(ox, ry, rx, oy, rx, 0);
        this.ctx.bezierCurveTo(rx, -oy, ox, -ry, 0, -ry);
        this.ctx.bezierCurveTo(-ox, -ry, -rx, -oy, -rx, 0);
        this.ctx.bezierCurveTo(-rx, oy, -ox, ry, 0, ry);
        this.ctx.closePath();
    }
    ;
    _getPathDByBezierEllipse1(x, y, rx, ry) {
        //关键是bezierCurveTo中两个控制点的设置
        //0.5和0.6是两个关键系数（在本函数中为试验而得）
        let ox = this.xRatio * rx, oy = this.yRatio * ry;
        let d = "";
        //从椭圆纵轴下端开始逆时针方向绘制
        // d += "M" + [0, ry].join(",") + ' '
        // d += 'C' + [ox, ry, rx, oy, rx, 0].join(",") + ' '
        // d += 'C' + [rx, -oy, ox, -ry, 0, -ry].join(",") + ' '
        // d += 'C' + [-ox, -ry, -rx, -oy, -rx, 0].join(",") + ' '
        // d += 'C' + [-rx, oy, -ox, ry, 0, ry].join(",") + ' '
        d += "M" + [x, y + ry].join(",") + ' ';
        d += 'C' + [x + ox, y + ry, x + rx, y + oy, x + rx, y].join(",") + ' ';
        d += 'C' + [x + rx, y - oy, x + ox, y - ry, x, y - ry].join(",") + ' ';
        d += 'C' + [x - ox, y - ry, x - rx, y - oy, x - rx, y].join(",") + ' ';
        d += 'C' + [x - rx, y + oy, x - ox, y + ry, x, y + ry].join(",") + ' ';
        // if (this.isFill)
        d += "Z";
        return d;
    }
    _BezierEllipse2Ctx(x, y, rx, ry) {
        let ox = rx * this.kRatio, // 水平控制点偏移量
        oy = ry * this.kRatio; // 垂直控制点偏移量
        this.ctx.beginPath();
        //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
        this.ctx.moveTo(x - rx, y);
        this.ctx.bezierCurveTo(x - rx, y - oy, x - ox, y - ry, x, y - ry);
        this.ctx.bezierCurveTo(x + ox, y - ry, x + rx, y - oy, x + rx, y);
        this.ctx.bezierCurveTo(x + rx, y + oy, x + ox, y + ry, x, y + ry);
        this.ctx.bezierCurveTo(x - ox, y + ry, x - rx, y + oy, x - rx, y);
        this.ctx.closePath();
    }
    ;
}
/** 网格图元 */
class JGridBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "grid";
        this.checkData = () => {
            if (this.data)
                return true;
            return false;
        };
        this._mainDraw = () => {
            if (!this.data.p)
                this.data.p = new JPos();
            let big = this.data.row * this.data.interval;
            this.ctx.strokeStyle = this.data.smallColor;
            this.ctx.beginPath();
            for (let i = 0; i < this.data.row; i++) {
                /** y,+ */
                /** i,m */
                this.ctx.moveTo(this.data.interval * i + this.data.p.x, big + this.data.p.y);
                /** i,-m */
                this.ctx.lineTo(this.data.interval * i + this.data.p.x, -big + this.data.p.y);
                /** y,- */
                /** -i,m */
                this.ctx.moveTo(-this.data.interval * i + this.data.p.x, big + this.data.p.y);
                /** -i,-m */
                this.ctx.lineTo(-this.data.interval * i + this.data.p.x, -big + this.data.p.y);
                /** x,+ */
                /** -m,i */
                this.ctx.moveTo(-big + this.data.p.x, i * this.data.interval + this.data.p.y);
                /** m,i */
                this.ctx.lineTo(big + this.data.p.x, i * this.data.interval + this.data.p.y);
                /** x,- */
                /** -m,-i */
                this.ctx.moveTo(-big + this.data.p.x, -i * this.data.interval + this.data.p.y);
                /** m,-i */
                this.ctx.lineTo(big + this.data.p.x, -i * this.data.interval + this.data.p.y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        };
    }
}
/** 图元组类 */
class JGroupBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "group";
        this.children = [];
        this._init = () => {
            this._isStartCapture = true;
            this._isStartSubscribe = true;
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            /** 完全包围 */
            if (isAbsInclude) {
                let check = false;
                for (let i = 0; i < this.children.length; i++) {
                    check = true;
                    if (!this.children[i].boxCheck(minP, maxP, isAbsInclude))
                        return false;
                }
                return check;
            }
            /** 不完全包围 */
            else {
                for (let i = 0; i < this.children.length; i++) {
                    if (this.children[i].boxCheck(minP, maxP, isAbsInclude))
                        return true;
                }
                return false;
            }
        };
        this.getHitBox = () => {
            let maxX = undefined;
            let maxY = undefined;
            let minX = undefined;
            let minY = undefined;
            /** 通过循环遍历得出最大最小值 */
            this.children.forEach(bitmap => {
                if ((this.sys &&
                    ((!this.sys.isGetCenterIncludeIgnore && bitmap.isIgnoreCapture) ||
                        (!this.sys.isGetCenterIncludeHide && bitmap.isHide) || (!this.sys.isGetCenterIncludeNoToSvg && bitmap.isNoToSvg)))
                    ||
                        !bitmap.checkData())
                    return;
                let data = bitmap.getHitBox();
                if (!data)
                    return;
                if (minX == undefined || minX > data.p.x)
                    minX = data.p.x;
                if (minY == undefined || minY > data.p.y)
                    minY = data.p.y;
                let w = data.p.x + data.w;
                if (maxX == undefined || maxX < w)
                    maxX = w;
                let h = data.p.y + data.h;
                if (maxY == undefined || maxY < h)
                    maxY = h;
            });
            if (maxX == undefined)
                return undefined;
            return PosUtil.getHitBox([{ x: minX, y: minY }, { x: maxX, y: maxY }]);
            // return PosUtil.getHitBox(PosUtil.getTransformPosArr([{ x: minX, y: minY }, { x: maxX, y: maxY }], this.getCurrentTransform()))
            // return BitmapService.getHitBox(this, (bitmap) => { return !bitmap.isIgnoreCapture })
        };
        this.toSvg = () => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            BitmapService.bigToSvg(this, group);
            BitmapService.SetSvgcommonAttr(this, group);
            return group;
        };
    }
    /**
     * 清空子图元数据
     */
    clear() {
        BitmapService.clearChildren(this);
    }
    /** 绑定对象 */
    bindObj(obj) {
        BitmapService.bindObj(this, obj);
    }
    /**
     * 创建图元(常用的基础的)
     * @param type 图元类型
     * @param data 需要加载的数据
     * @param isNoBind 是否绑定
     */
    createBitmap(type, data, isNoBind, projectType) {
        return BitmapService.createBitmap(this, this.sys, type, data, isNoBind, projectType);
    }
    /** 自动将图元插入另外图元后面,仅限同级且zIndex一样的图元 */
    sortBack(currentObj, backObj) {
        BitmapService.sortBack(this, currentObj, backObj);
    }
    /**
     * 创建自定义图元
     * @param customClass 需要实例化的自定义图元类(注意是类,不是对象)
     * @param data 需要加载的数据
     * @param isNoBind 是否绑定
     */
    createCustom(customClass, data, isNoBind, projectType) {
        return BitmapService.createCustom(this, this.sys, customClass, isNoBind, data, projectType);
    }
    /**
     * 展示开关
     * @param children
     */
    showBitmaps(...children) {
        BitmapService.showBitmaps(this, ...children);
    }
}
/** 图片基础图元类 */
class JImgBitmap extends JRectBaseBitmap {
    constructor() {
        super(...arguments);
        this.type = "img";
        this.checkData = () => {
            if (!this.data || !this.data.img || !this.data.p || !this.data.w || !this.data.h)
                return false;
            return true;
        };
        this._mainDraw = () => {
            this.ctx.scale(1, -1);
            this.ctx.translate(this.data.p.x, -this.data.p.y - this.data.h);
            this.ctx.drawImage(this.data.img, 0, 0, this.data.w, this.data.h);
            /** 图片 */
            // if (this.data.img instanceof HTMLImageElement)
            //     this.ctx.drawImage(this.data.img, 0, 0, this.data.w, this.data.h)
            // else
            //     this.ctx.drawImage(this.data.img, 0, 0)
        };
    }
    get absPosArr() {
        return PosUtil.getRectByTwoPos(this.data.p, { x: this.data.p.x + this.data.w, y: this.data.p.y + this.data.h });
    }
    get relPosArr() {
        return PosUtil.getRectByTwoPos(new JPos(), { x: this.data.w, y: this.data.h });
    }
    /**
     * 通过路径获取图片数据
     * @param url
     *
     */
    getImgDataByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => {
                    resolve({
                        img: img,
                        w: img.width,
                        h: img.height
                    });
                };
                img.src = url;
            });
        });
    }
}
/** 线基础图元类 */
class JLineBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "line";
        this.checkData = () => {
            if (!this.data || !this.data.start || !this.data.end)
                return false;
            return true;
        };
        this._mainDraw = () => {
            this.ctx.beginPath();
            this.ctx.moveTo(this.data.start.x, this.data.start.y);
            this.ctx.lineTo(this.data.end.x, this.data.end.y);
            // this.ctx.closePath()
            this.ctx.stroke();
        };
        this._mainHit = (p) => {
            /** 获取线宽 */
            let distance = this.finalLineWidth / 2;
            distance += this.finalHitCoefficient;
            let a = PosUtil.isInLine(this.data.start, this.data.end, p, distance);
            return a ? true : false;
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            if (!this.checkData())
                return false;
            let transPosArr = PosUtil.getTransformPosArr([this.data.start, this.data.end], this.getCurrentTransform());
            let boxArr = PosUtil.getRectByTwoPos(minP, maxP);
            let startCheck = PosUtil.isPosInGeo(transPosArr[0], boxArr);
            let endCheck = PosUtil.isPosInGeo(transPosArr[1], boxArr);
            /** 完全包围 */
            if (isAbsInclude) {
                if (startCheck && endCheck)
                    return true;
                return false;
            }
            /** 不完全包围 */
            if (startCheck || endCheck)
                return true;
            /** 与线段相切情况 */
            for (let i = 0; i < boxArr.length - 1; i++) {
                if (PosUtil.getIntersect(boxArr[i], boxArr[i + 1], transPosArr[0], transPosArr[1], false))
                    return true;
            }
            if (PosUtil.getIntersect(boxArr[0], boxArr[boxArr.length - 1], transPosArr[0], transPosArr[1], false))
                return true;
            return false;
        };
        this.getHitBox = (isNoTrans) => {
            if (isNoTrans) {
                return PosUtil.getHitBox([this.data.start, this.data.end]);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr([this.data.start, this.data.end], this.getCurrentTransform()));
        };
        this.toSvg = () => {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", this.data.start.x.toString());
            line.setAttribute("x2", this.data.end.x.toString());
            line.setAttribute("y1", this.data.start.y.toString());
            line.setAttribute("y2", this.data.end.y.toString());
            BitmapService.setSvgStroke(this, line, 1);
            BitmapService.SetSvgcommonAttr(this, line);
            return line;
        };
    }
    /**
    * 获取弧度
    * @param num 保留小数点
    */
    getRadian(num) {
        if (!this.checkData())
            return undefined;
        let data = PosUtil.getRadian(this.data.start, this.data.end);
        return !data ? data : num ? parseFloat(data.toFixed(num)) : data;
    }
    /**
    * 获取距离
    * @param num 保留小数点
    */
    getDistance(num) {
        if (!this.checkData())
            return undefined;
        let data = PosUtil.getDistance(this.data.start, this.data.end);
        return !data ? data : num ? parseFloat(data.toFixed(num)) : data;
    }
    /**
    * 获取角度
    * @param num 保留小数点
    */
    getRotate(num) {
        if (!this.checkData())
            return undefined;
        let data = PosUtil.getAngle(this.data.start, this.data.end);
        return !data ? data : num ? parseFloat(data.toFixed(num)) : data;
    }
    /** 获取中心点 */
    getCenter() {
        if (!this.checkData())
            return undefined;
        return PosUtil.getCenterPos(this.data.start, this.data.end);
    }
    /** 获取向量 */
    getVector() {
        if (!this.checkData())
            return undefined;
        return new JPos(this.data.end.x - this.data.start.x, this.data.end.y - this.data.start.y);
    }
}
class CacheDataType {
}
/** 路径基础图元类 */
class JPathBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "path";
        /** 计算用的缓存数据 */
        /** 保存缓存数据作为对比,如相同则不计算新的数据,减少不必要计算 */
        this._oldData = undefined;
        /** 保存计算用的缓存数据,具有可复用性,提高性能 */
        this._cacheDatas = [];
        this._dCache = [];
        /** 是否快速启动,如果不熟悉框架,请不要使用 */
        this.isQuick = false;
        /** 是否包围框碰撞 */
        this.isBoxHit = false;
        this.checkData = () => {
            if (this.isQuick)
                return true;
            if (this.data && this.data != "")
                return true;
            return false;
        };
        this._hideFunc = () => {
            if (!this.checkData())
                return;
            this._collectData();
        };
        this._mainDraw = () => {
            if (!this.checkData())
                return;
            this._collectData();
            this._cacheDatas.forEach(drawData => {
                this.ctx.beginPath();
                this.ctx.moveTo(drawData.start.x, drawData.start.y);
                for (let i = 0; i < drawData.data.length; i++) {
                    let data = drawData.data[i];
                    if (data instanceof JArc) {
                        this.ctx.arc(data.center.x, data.center.y, data.radius, data.startAngle, data.endAngle, data.isCounterClockwise);
                    }
                    else {
                        this.ctx.lineTo(data.x, data.y);
                    }
                }
                if (drawData.isClose) {
                    this.ctx.closePath();
                    if (this.isFill) {
                        this.ctx.fill();
                    }
                }
                if (this.isStorke)
                    this.ctx.stroke();
            });
        };
        this._mainHit = (p) => {
            if (!this.checkData())
                return false;
            this._collectData();
            if (this.isBoxHit) {
                if (!this.boxHit)
                    return false;
                return PosUtil.isPosInGeo(p, this.boxHit) == 0 ? false : true;
            }
            let lineWidth = (this.finalLineWidth) / 2;
            for (let i = 0; i < this._cacheDatas.length; i++) {
                /* 如果闭合,则需要收集点的数据,判断多边形碰撞 */
                if (this._cacheDatas[i].isClose) {
                    if (!this._cacheDatas[i].posArr)
                        this._cacheDatas[i].posArr = this._getPosArr(this._cacheDatas[i]);
                    if (PosUtil.isPosInGeo(p, this._cacheDatas[i].posArr)) {
                        this._hitBitmapNum = i;
                        return true;
                    }
                    if (!this.finalHitCoefficient)
                        continue;
                }
                /** 如果非闭合,则按照种类判断线的碰撞 */
                let drawData = this._cacheDatas[i].data;
                let startP = this._cacheDatas[i].start;
                for (let j = 0; j < drawData.length; j++) {
                    let bitmapData = drawData[j];
                    /* 判断弧形 */
                    if (bitmapData instanceof JArc) {
                        if (this._arcHit(p, bitmapData, lineWidth)) {
                            this._hitBitmapNum = i;
                            return true;
                        }
                        startP = PosUtil.getRayPos(bitmapData.center, bitmapData.endAngle, bitmapData.radius);
                    }
                    /* 判断直线 */
                    else {
                        if (!startP) {
                            startP = bitmapData;
                            continue;
                        }
                        if (PosUtil.isInLine(startP, bitmapData, p, lineWidth + this.finalHitCoefficient)) {
                            this._hitBitmapNum = i;
                            return true;
                        }
                        startP = bitmapData;
                    }
                }
            }
            this._hitBitmapNum = -1;
            return false;
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            this._collectData();
            let isPolygon = false;
            let rect = PosUtil.getRectByTwoPos(minP, maxP);
            rect = PosUtil.getInvertPosArr(rect, this.getCurrentTransform());
            /* 全包围 */
            if (isAbsInclude) {
                let index = this._cacheDatas.findIndex(cacheData => {
                    return !this._setBitmapBoxCheck(cacheData, rect, isAbsInclude);
                });
                return index == -1 ? true : false;
            }
            /* 不完全包围================== */
            let index = this._cacheDatas.findIndex(cacheData => {
                return this._setBitmapBoxCheck(cacheData, rect, isAbsInclude);
            });
            return index == -1 ? false : true;
        };
        this.getHitBox = (isNoTrans) => {
            let maxX = undefined;
            let minX = undefined;
            let maxY = undefined;
            let minY = undefined;
            this._cacheDatas.forEach(cacheData => {
                if (!cacheData.posArr)
                    cacheData.posArr = this._getPosArr(cacheData);
                let posArr = isNoTrans ? cacheData.posArr : PosUtil.getTransformPosArr(cacheData.posArr, this.getCurrentTransform());
                posArr.forEach(p => {
                    if (maxX == undefined || maxX < p.x)
                        maxX = p.x;
                    if (minX == undefined || minX > p.x)
                        minX = p.x;
                    if (maxY == undefined || maxY < p.y)
                        maxY = p.y;
                    if (minY == undefined || minY > p.y)
                        minY = p.y;
                });
            });
            if (maxX == undefined || minY == undefined)
                return undefined;
            return { p: { x: minX, y: minY }, w: maxX - minX, h: maxY - minY };
        };
        this.toSvg = (option) => {
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let newD = this._dCache.map(str => str);
            for (let i = 0; i < newD.length; i++) {
                if (newD[i] == "A") {
                    let d = PosUtil.canvasArcTransSvgArc(this._getArc(newD, i + 1));
                    let newArr = [];
                    if (i == 0 || newD[i - 1] == "Z")
                        newArr.push("M");
                    else
                        newArr.push('L');
                    newArr.push(d.sx, d.sy, "A", d.rx, d.ry, 0, d.largeArcFlag, d.sweepFlag, d.ex, d.ey);
                    newD.splice(i, 7, ...newArr);
                    i += 3;
                }
            }
            path.setAttribute("d", newD.join(" "));
            if (option && option.strokeColor)
                BitmapService.setSvgStroke(this, path, 1, option.strokeColor);
            else
                BitmapService.setSvgStroke(this, path);
            if (option && option.fillColor)
                BitmapService.setSvgFill(this, path, 1, option.fillColor);
            else
                BitmapService.setSvgFill(this, path);
            BitmapService.SetSvgcommonAttr(this, path);
            return path;
        };
    }
    /** 是否快速计算,如果开启,可以直接操作cacheDatas,但是同时_checkData也会失效 */
    /** 保存计算用的缓存数据,具有可复用性,提高性能,没启动isQiuck,不可用 */
    get cacheDatas() { return this._cacheDatas; }
    set cacheDatas(data) {
        if (this.isQuick)
            this._cacheDatas = data;
    }
    /** 碰撞的第几个图元,-1为没碰撞 */
    get hitBitmapNum() { return this._hitBitmapNum; }
    /** 解码 */
    decode() {
        if (!this.checkData())
            return [];
        return this.data.split(/[, ]/);
    }
    /** 获取圆弧数据 */
    _getArc(dArr, i) {
        //x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise: number,
        let arc = new JArc();
        arc.center = { x: parseFloat(dArr[i]), y: parseFloat(dArr[i + 1]) };
        arc.radius = parseFloat(dArr[i + 2]);
        arc.startAngle = parseFloat(dArr[i + 3]);
        arc.endAngle = parseFloat(dArr[i + 4]);
        arc.isCounterClockwise = parseFloat(dArr[i + 5]) == 1 ? true : false;
        return arc;
    }
    /** 收集数据 */
    _collectData() {
        if (this.isQuick)
            return;
        if (this.data === this._oldData)
            return;
        this._cacheDatas = [];
        if (!this.checkData())
            return;
        this._oldData = this.data;
        this._dCache = this.decode();
        this._lastPos = undefined;
        this._startPos = undefined;
        let currentCacheData = undefined;
        let p;
        for (let i = 0; i < this._dCache.length; i++) {
            switch (this._dCache[i]) {
                case "M":
                    i += 2;
                    p = { x: parseFloat(this._dCache[i - 1]), y: parseFloat(this._dCache[i]) };
                    currentCacheData = { data: [], isClose: false, start: p };
                    this._cacheDatas.push(currentCacheData);
                    this._lastPos = p;
                    this._startPos = p;
                    break;
                case "L":
                    i += 2;
                    p = { x: parseFloat(this._dCache[i - 1]), y: parseFloat(this._dCache[i]) };
                    currentCacheData.data.push(p);
                    break;
                case "A":
                    let arc = this._getArc(this._dCache, i + 1);
                    i += 6;
                    let ray = PosUtil.getRayPos(arc.center, arc.startAngle, arc.radius);
                    if (currentCacheData == undefined) {
                        currentCacheData = { data: [], isClose: false, start: ray };
                    }
                    else {
                        currentCacheData.data.push(ray);
                    }
                    currentCacheData.data.push(arc);
                    currentCacheData.data.push(PosUtil.getRayPos(arc.center, arc.endAngle, arc.radius));
                    break;
                case "z":
                case "Z":
                    currentCacheData.isClose = true;
                    currentCacheData = undefined;
                    break;
                case "":
                case ",":
                    break;
                default:
                    i = this._dCache.length + 1;
                    break;
            }
        }
        if (this.isBoxHit) {
            let box = this.getHitBox(true);
            this.boxHit = PosUtil.getRectByTwoPos(box.p, new JPos(box.p.x + box.w, box.p.y + box.h));
        }
    }
    /** 用来解析并更新更新data(在不绘制的情况下) */
    updateData() {
        if (!this.checkData())
            return;
        this._collectData();
        this.cacheDatas.forEach(data => {
            if (!data.posArr) {
                data.posArr = this._getPosArr(data);
            }
        });
    }
    /**
     * 获取多段线路径
     * @param pArr
     * @param isClose
     */
    getpolyLinePath(pArr, isClose) {
        if (!pArr || pArr.length == 0)
            return "";
        let str = "";
        pArr.forEach(p => {
            if (!str)
                str = `M ${p.x},${p.y} `;
            else
                str += `L ${p.x},${p.y} `;
        });
        if (isClose)
            str += " Z ";
        return str;
    }
    /**
     * 获取多组多段线路径(不会闭合)
     * @param pArrList 点数组的集合
     */
    getPolyLinePathArr(pArrList) {
        if (!pArrList || pArrList.length == 0)
            return "";
        let str = "";
        pArrList.forEach(pArr => {
            str += this.getpolyLinePath(pArr, false);
        });
        return str;
    }
    /**
     * 获取弧形路径
     * @param center
     * @param radius
     * @param startAngle
     * @param endAngle
     * @param anticlockwise
     * @param isClose
     * @param isStart
     */
    getArcPath(center, radius, startAngle, endAngle, anticlockwise, isClose, isStart) {
        let str = "";
        if (isStart) {
            let startPos = PosUtil.getRayPos(center, startAngle, radius);
            str += `M ${startPos.x},${startPos.y} `;
        }
        str += `A ${center.x},${center.y},${radius},${startAngle},${endAngle},${anticlockwise} `;
        if (isClose)
            str += " Z ";
        return str;
    }
    /** 获取点集合(主要是弧转点) */
    _getPosArr(data) {
        let posArr = [data.start];
        data.data.forEach(bitmap => {
            /* 弧线转化点 */
            if (bitmap instanceof JArc) {
                let step = bitmap.radius / 100;
                step = step < 0.1 ? 0.1 : step;
                let data = PosUtil.getArcPosArr(bitmap.center, bitmap.radius, bitmap.startAngle, bitmap.endAngle, bitmap.isCounterClockwise, step);
                bitmap["cacheData"] = data;
                return posArr.push(...data);
            }
            /* 点的话直接拿 */
            else {
                return posArr.push(bitmap);
            }
        });
        return posArr;
    }
    /**
    * 弧形碰撞
    * @param p 碰撞点
    * @param target 目标弧
    * @param lineWidth 线宽
    */
    _arcHit(p, target, lineWidth) {
        let a = PosUtil.isInArcLine(target.center, target.radius, target.startAngle, target.endAngle, p, target.isCounterClockwise, lineWidth);
        return a ? true : false;
    }
    /** 设置单图元矩形碰撞 */
    _setBitmapBoxCheck(data, rect, isAbsInclude) {
        if (!data.posArr)
            data.posArr = this._getPosArr(data);
        /* 全包围 */
        if (isAbsInclude) {
            return PosUtil.isPosArrInGeo(data.posArr, rect, isAbsInclude);
        }
        /* 不完全包围================== */
        /* 闭合 */
        if (data.isClose) {
            return PosUtil.isPosArrInGeo(data.posArr, rect, isAbsInclude) || PosUtil.isPosArrInGeo(rect, data.posArr, isAbsInclude) || PosUtil.isLinesCrossLines(data.posArr, true, rect, true);
        }
        /* 非闭合 */
        let startP = data.start;
        let index = data.data.findIndex(bitmap => {
            if (bitmap instanceof JArc) {
                startP = undefined;
                return PosUtil.isPosArrInGeo(bitmap["cacheData"], rect, isAbsInclude);
            }
            if (!startP) {
                startP = bitmap;
                return false;
            }
            let a = startP;
            startP = bitmap;
            return PosUtil.isLinesCrossLines([a, startP], false, rect, true) || PosUtil.isPosArrInGeo([a, startP], rect, isAbsInclude);
        });
        if (index != -1)
            return true;
        return false;
    }
    /**
     * 获取矩形的path字符串
     * @param rect 矩形对象,p,w,h
     * @param isClose 是否闭合,默认false
     */
    getRectPath(rect, isClose) {
        let posArr = PosUtil.getRectByTwoPos(rect.p, { x: rect.p.x + rect.w, y: rect.p.y + rect.h });
        return this.getpolyLinePath(posArr, isClose);
    }
    /**
     *  克隆数据
     * @param target 复制此目标的数据
     * @param isPrase 是否序列化
     */
    cloneData(target, isPrase) {
        if (isPrase) {
            this._cacheDatas = ObjUtil.JsonParse(target.cacheDatas);
        }
        else {
            this._cacheDatas = target.cacheDatas;
        }
        this.data = this._oldData = target.data;
    }
}
/** 矩形基础图形类 */
class JRectBitmap extends JRectBaseBitmap {
    constructor() {
        super(...arguments);
        this.type = "rect";
        this.checkData = () => {
            if (!this.data)
                return false;
            return true;
        };
        this._mainDraw = () => {
            this.relPosArr = [
                new JPos(0, this.data.height),
                new JPos(this.data.width, this.data.height),
                new JPos(this.data.width, 0),
                new JPos(0, 0),
            ];
            this.absPosArr = PosUtil.translate(new JPos(this.data.x, this.data.y), this.relPosArr);
            /** 非圆角 */
            if (!this.data.r) {
                if (this.isStorke)
                    this.ctx.strokeRect(this.data.x, this.data.y, this.data.width, this.data.height);
                if (this.isFill)
                    this.ctx.fillRect(this.data.x, this.data.y, this.data.width, this.data.height);
                return;
            }
            /** 圆角 */
            let datas = [
                this._getArc(this.absPosArr[0], -1, 1),
                this._getArc(this.absPosArr[1], 1, 1),
                this._getArc(this.absPosArr[2], 1, -1),
                this._getArc(this.absPosArr[3], -1, -1),
            ];
            this.ctx.beginPath();
            datas.forEach((data, i) => {
                this.ctx.arc(data.center.x, data.center.y, this.data.r, data.startAngle, data.endAngle, true);
            });
            this.ctx.closePath();
            if (this.isStorke)
                this.ctx.stroke();
            if (this.isFill)
                this.ctx.fill();
        };
        this.toSvg = () => {
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", this.data.x.toString());
            rect.setAttribute("y", this.data.y.toString());
            if (this.data.r) {
                rect.setAttribute("rx", this.data.r.toString());
                rect.setAttribute("ry", this.data.r.toString());
            }
            rect.setAttribute("width", this.data.width.toString());
            rect.setAttribute('height', this.data.height.toString());
            BitmapService.setSvgStroke(this, rect);
            BitmapService.setSvgFill(this, rect);
            BitmapService.SetSvgcommonAttr(this, rect);
            return rect;
        };
    }
    getPosArr() {
        let posBL = { x: this.data.x, y: this.data.y };
        let posBR = { x: this.data.x + this.data.width, y: this.data.y };
        let posTL = { x: this.data.x, y: this.data.y + this.data.height };
        let posTR = { x: this.data.x + this.data.width, y: this.data.y + this.data.height };
        return [posTL, posTR, posBR, posBL];
    }
    _getArc(p, coorX, coorY) {
        let center = new JPos(p.x - this.data.r * coorX, p.y - this.data.r * coorY);
        let a = coorX * coorY;
        let start = a == 1 ? new JPos(center.x, p.y) : new JPos(p.x, center.y);
        let end = a == 1 ? new JPos(p.x, center.y) : new JPos(center.x, p.y);
        let startAngle = a == 1 ? Math.PI / 2 * coorX : coorX == 1 ? 0 : -Math.PI;
        let endAngle = a == 1 ? (coorX == 1 ? 0 : -Math.PI) : Math.PI / 2 * coorY;
        return {
            center, start, end, startAngle, endAngle
        };
    }
}
/** 文字基础图形数据类型 */
class JTextBitmapDataType {
}
/** 文字基础图形类 */
class JTextBitmap extends JTextBitmapBase {
    constructor() {
        super(...arguments);
        this.type = "text";
        this.updateRect = () => {
            if (this.currentScale == undefined) {
                this.currentScale = this._getSize();
            }
            this.ctx.font = `${this.isBold ? "bold" : ""}20px ${this.currentFamily}`;
            let XdataW = this.ctx.measureText("O").width * (this.currentScale / 20);
            this.oneFontW = XdataW;
            this.fontHeight = XdataW * this.fontHeightRatio;
            if (this.wrapInterval != undefined) {
                let arr = this.data.text.split("\r\n");
                this.textData = [];
                arr.forEach(text => {
                    this.textData.push({ content: text });
                });
            }
            else {
                this.textData = [{ content: this.data.text }];
            }
            let p = new JPos(0, this.fontHeight / 2);
            this._maxWidth = 0;
            this._maxHeight = 0;
            this.textData.forEach(data => {
                data.p = new JPos(p.x, p.y);
                p.y += (this.wrapInterval ? this.wrapInterval : 0) + this.fontHeight;
                data.width = this.ctx.measureText(data.content).width * (this.currentScale / 20);
                if (this._maxWidth < data.width)
                    this._maxWidth = data.width;
                this._maxHeight += (this.wrapInterval ? this.wrapInterval : 0) + this.fontHeight;
            });
            /** 文字矩形宽高坐标集合,未经过任何偏移的,中心点为0,0 */
            let halfWidth = this._maxWidth / 2;
            let halfHeight = this._maxHeight / 2;
            let heightInterval = this.wrapInterval ? (this.textData.length - 1) * (this.fontHeight + this.wrapInterval) / 2 : 0;
            this.relPosArr = [
                { x: -halfWidth, y: halfHeight - heightInterval },
                { x: halfWidth, y: halfHeight - heightInterval },
                { x: halfWidth, y: -halfHeight - heightInterval },
                { x: -halfWidth, y: -halfHeight - heightInterval }
            ];
            if (this.style.textAlign == "left") {
                this.relPosArr.forEach(child => {
                    child.x += halfWidth;
                });
            }
            else if (this.style.textAlign == "right") {
                this.relPosArr.forEach(child => {
                    child.x -= halfWidth;
                });
            }
            this.ctx.font = `${this.isBold ? "bold" : ""}${this.currentScale}px ${this.currentFamily}`;
        };
        this._getSize = () => {
            return this.data.fontSize ? this.data.fontSize : this.style.font ? Number(this.style.font.split('px')[0]) : this._jCanvas.fontSize * this.fontSizeMultiple;
        };
        this._mainDraw = () => {
            // if (this.currentSize == undefined || this.currentFamily == undefined || this.data.fontSize || this.data.fontFamily) {
            this.currentScale = this._getSize();
            this.currentFamily = this._getFamily();
            this.ctx.font = `${this.isBold ? "bold" : ""}${this.currentScale}px ${this.currentFamily}`;
            // }
            let newDataChangeStr = this._getOldChangeStr();
            if (this.oldDataChangeStr == undefined || this.oldDataChangeStr != newDataChangeStr) {
                this.updateRect();
                this.oldDataChangeStr = newDataChangeStr;
            }
            this.absPosArr = PosUtil.translate(this.pos, this.relPosArr);
            /** 由于画布设置左下角为原点,一开始已经是y轴镜像了,直接显示文字是不行的,需要反过来镜像才能正确显示 */
            this.ctx.scale(this._jCanvas.coordinateX, this._jCanvas.coordinateY);
            this.ctx.translate(this.pos.x * this._jCanvas.coordinateX, this.pos.y * this._jCanvas.coordinateY);
            if (this.isStorke) {
                this.textData.forEach(data => {
                    this.ctx.strokeText(data.content, data.p.x, data.p.y);
                });
            }
            if (this.isFill) {
                this.textData.forEach(data => {
                    this.ctx.fillText(data.content, data.p.x, data.p.y);
                });
            }
        };
    }
    /** 获取文字宽度 */
    getWidth(text) {
        // if (text == undefined && this.maxWidth) {
        //     return this.maxWidth
        // }
        // if (text == undefined) {
        //     this.updateRect()
        //     console.log(this._maxWidth)
        //     return this._maxWidth
        // }
        let size = this._getSize();
        let family = this._getFamily();
        this.ctx.font = `20px ${family}`;
        if (text == undefined) {
            text = this.data.text;
        }
        let w = this.ctx.measureText(text).width * (size / 20);
        this.ctx.font = `${size}px ${family}`;
        return w;
    }
    _getOldChangeStr() {
        return `${this.pos.x},${this.pos.y},${this.currentScale},${this.currentFamily},${this.style.textAlign ? this.style.textAlign : this._jCanvas.style.textAlign},${this.wrapInterval},${this.data.text},${this._jCanvas.scale}`;
    }
}
const BitmapBaseClass = {
    /** 线 */
    "line": JLineBitmap,
    /** 文本 */
    "text": JTextBitmap,
    /** 圆弧 */
    "arc": JArcBitmap,
    /** 组 */
    "group": JGroupBitmap,
    /** 圆 */
    "circle": JCircleBitmap,
    /** 矩形 */
    "rect": JRectBitmap,
    /** 路径 */
    "path": JPathBitmap,
    /** 图片 */
    "img": JImgBitmap,
    /** 椭圆 */
    "ellipse": JEllipseBitmap
};
class CoordinateCanvas {
    constructor(bigDiv, jcanvas) {
        this.bigDiv = bigDiv;
        this.jcanvas = jcanvas;
        /** x轴文本 */
        this.xText = "X";
        /** y轴文本 */
        this.yText = "Y";
        /** 字体大小 */
        this.textSize = 20;
        /** 线宽 */
        this.lineWidth = 8;
        /** 线长 */
        this.lineLength = 100;
        /**箭头宽 */
        this.arrowWidth = 20;
        /** 总体宽 */
        this.width = 200;
        /** 总体高 */
        this.height = 200;
        /** 间距 */
        this.interval = 20;
        /** 颜色 */
        this.color = "#000";
        this.moveP = new JPos();
        this.transform = [1, 0, 0, 1, 0, 0];
        /** 文本间距 */
        this.textInterval = 20;
        /** 坐标轴X */
        this._coorX = 1;
        /** 坐标轴Y */
        this._coorY = 1;
        this.canvas = document.createElement("canvas");
        this.bigDiv.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.position = "absolute";
    }
    /** 起点x */
    get startX() { return this._startX; }
    /** 起点y */
    get startY() { return this._startY; }
    /** 坐标轴X */
    get coorX() { return this._coorX; }
    /** 坐标轴Y */
    get coorY() { return this._coorY; }
    /** 调整位置 */
    resize(coorX, coorY) {
        if (coorX == undefined) {
            coorX = this.coorX;
        }
        if (coorY == undefined) {
            coorY = this.coorY;
        }
        this._coorX = coorX;
        this._coorY = coorY;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.save();
        if (this.firstDraw)
            this.firstDraw(this.ctx, this);
        this.ctx.restore();
        this.ctx.save();
        let m = this.transform;
        this.ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        this.ctx.translate(this.moveP.x, this.moveP.y);
        this.canvas.style.top = `${(1 - coorY) / 2 * (this.jcanvas.height - this.height)}px`;
        this.canvas.style.left = `${(1 - coorX) / 2 * (this.jcanvas.width - this.width)}px`;
        this._startX = (1 - coorX) / 2 * this.width + (coorX * this.interval);
        this._startY = (1 - coorY) / 2 * this.height + (coorY * this.interval);
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.font = `${this.textSize}px Airal`;
        this.ctx.textAlign = "center";
        this.ctx.beginPath();
        this.ctx.moveTo(this._startX, this._startY);
        this.ctx.lineTo(this._startX + (this.lineLength - this.arrowWidth) * coorX, this._startY);
        this.ctx.moveTo(this._startX, this._startY);
        this.ctx.lineTo(this._startX, this._startY + (this.lineLength - this.arrowWidth) * coorY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this._startX + (this.lineLength - this.arrowWidth) * coorX, this._startY + this.arrowWidth / 2);
        this.ctx.lineTo(this._startX + (this.lineLength - this.arrowWidth) * coorX, this._startY - this.arrowWidth / 2);
        this.ctx.lineTo(this._startX + this.lineLength * coorX, this._startY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(this._startX + this.arrowWidth / 2, this._startY + (this.lineLength - this.arrowWidth) * coorY);
        this.ctx.lineTo(this._startX - this.arrowWidth / 2, this._startY + (this.lineLength - this.arrowWidth) * coorY);
        this.ctx.lineTo(this._startX, this._startY + this.lineLength * coorY);
        this.ctx.closePath();
        this.ctx.fill();
        let commonData = this.ctx.measureText("O");
        let xData = this.ctx.measureText(this.xText);
        let xTextHeight = commonData.width;
        let xTextWidth = xData.width;
        // let yData = this.ctx.measureText(this.yText)
        let yTextHeight = commonData.width;
        // let yTextWidth = yData.width
        if (this.textColor) {
            this.ctx.fillStyle = this.textColor;
            this.ctx.strokeStyle = this.textColor;
        }
        this.ctx.fillText(this.xText, this._startX + (this.lineLength + this.textInterval + xTextWidth / 2) * coorX, this._startY + xTextHeight / 2);
        this.ctx.fillText(this.yText, this._startX, this._startY + (this.lineLength + this.textInterval) * coorY + (1 + coorY) / 2 * yTextHeight);
        this.ctx.restore();
        if (this.finalDraw)
            this.finalDraw(this.ctx, this);
    }
}
class HGArrowDataType {
    constructor() {
        this.arrowRatio = 10;
        this.plane = 2;
        this.lineWidthRatio = 1;
    }
}
class HGArrowBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgArrow";
        this.arrowPArr = [];
        this._mainHit = (p) => {
            let distance = this.lineWidth / 2 + this.finalHitCoefficient;
            /** 判断起点 */
            if (PosUtil.isSamePos(p, this.data.start, distance)) {
                this.hitType = 1;
                return true;
            }
            /** 判断终点 */
            if (PosUtil.isSamePos(p, this.arrowCenter ? this.arrowCenter : this.data.end, distance)) {
                this.hitType = 2;
                return true;
            }
            /** 判断线 */
            let a = PosUtil.isInLine(this.data.start, this.data.end, p, distance);
            if (a) {
                this.hitType = 3;
                return true;
            }
            this.hitType = undefined;
            return false;
        };
        this._mainDraw = () => {
            this.ctx.strokeStyle = this.data.color;
            this.ctx.fillStyle = this.data.color;
            this.lineWidth = this.ctx.lineWidth = this.data.lineWidthRatio * this.finalLineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(this.data.start.x, this.data.start.y);
            this.ctx.lineTo(this.data.end.x, this.data.end.y);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            let distance = this.finalLineWidth / 2;
            this.radian = PosUtil.getRadian(this.data.start, this.data.end);
            this.arrowWidth = this.data.arrowRatio * this.finalLineWidth;
            let centerP = PosUtil.getRayPos(this.data.end, this.radian, -this.arrowWidth);
            this.arrowCenter = PosUtil.getCenterPos(centerP, this.data.end);
            let startP = PosUtil.getRayPos(centerP, this.radian + Math.PI / 2, this.arrowWidth);
            let endP = PosUtil.getRayPos(centerP, this.radian + Math.PI / 2, -this.arrowWidth);
            this.arrowPArr = [startP, endP, this.data.end];
            this.ctx.beginPath();
            this.ctx.moveTo(this.data.end.x, this.data.end.y);
            this.ctx.lineTo(startP.x, startP.y);
            this.ctx.lineTo(endP.x, endP.y);
            this.ctx.closePath();
            this.ctx.fill();
            // this.ctx.arc(this.data.end.x, this.data.end.y, distance * this.data.arrowRadio, Math.PI * 2, 0, true)
            // this.ctx.closePath()
            // this.ctx.fill()
        };
        this.toSvg = () => {
            let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            g.appendChild(line);
            line.setAttribute("x1", this.data.start.x.toString());
            line.setAttribute("x2", this.data.end.x.toString());
            line.setAttribute("y1", this.data.start.y.toString());
            line.setAttribute("y2", this.data.end.y.toString());
            BitmapService.setSvgStroke(this, line, 1, this.data.color);
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            g.appendChild(path);
            if (this.arrowPArr.length == 3) {
                path.setAttribute("d", `M${this.arrowPArr[0].x} ${this.arrowPArr[0].y},${this.arrowPArr[1].x} ${this.arrowPArr[1].y},L${this.arrowPArr[2].x} ${this.arrowPArr[2].y} Z`);
            }
            BitmapService.setSvgFill(this, path, 1, this.data.color);
            BitmapService.SetSvgcommonAttr(this, g);
            return g;
        };
    }
    toHGJson() {
        let data = new HGArrowData();
        data.Start = this.data.start;
        data.End = this.data.end;
        data.guid = this.id;
        data.Color = this.data.color;
        data.Plane = this.data.plane;
        return data;
    }
    fromHGJson(data) {
        this.data.start = data.Start;
        this.data.end = data.End;
        this.id = data.guid;
        this.data.color = data.Color;
        this.data.plane = data.Plane;
    }
}
class HGArrowData {
}
class HGCanvasSys {
    constructor(bigDiv, w, h, coorX = 1, coorY = -1) {
        this.bigDiv = bigDiv;
        /** 调试工具 */
        this.debug = HGCanvasSysDebug;
        this.jcanvas = new JCanvas();
        this.canvasDiv = document.createElement("div");
        this.canvasDiv.className = "jcanvasDiv";
        bigDiv.appendChild(this.canvasDiv);
        this.coordinateCanvas = new CoordinateCanvas(bigDiv, this.jcanvas);
        this.displayDiv = document.createElement('div');
        this.displayDiv.className = "jdisplayDiv";
        bigDiv.appendChild(this.displayDiv);
        this.layerDiv = document.createElement('div');
        this.layerDiv.className = "jlayerDiv";
        bigDiv.appendChild(this.layerDiv);
        this.inputsDiv = document.createElement("div");
        this.inputsDiv.className = "jinputsDiv";
        bigDiv.appendChild(this.inputsDiv);
        this.otherDomsDiv = document.createElement("div");
        this.otherDomsDiv.className = "jotherDomsDiv";
        bigDiv.appendChild(this.otherDomsDiv);
        this.domsDiv = document.createElement("div");
        this.domsDiv.className = "jdomsDiv";
        bigDiv.appendChild(this.domsDiv);
        this.testDomsDiv = document.createElement("div");
        this.testDomsDiv.className = "jtestDomsDIV";
        bigDiv.appendChild(this.testDomsDiv);
        let doms = [this.domsDiv, this.inputsDiv, , this.displayDiv, this.canvasDiv, this.layerDiv, this.otherDomsDiv, this.testDomsDiv];
        doms.forEach(div => {
            div.style.position = "absolute";
            div.style.top = "0px";
            div.style.left = "0px";
        });
        this.jcanvas.setCoordinate(coorX, coorY);
        this.jcanvas.resizeEvent.subscribe((data) => {
            bigDiv.style.width = this.layerDiv.style.width = `${data.w}px`;
            bigDiv.style.height = this.layerDiv.style.height = `${data.h}px`;
            this.coordinateCanvas.width = data.w;
            this.coordinateCanvas.height = data.h;
        });
        if (w == undefined) {
            w = this.bigDiv.clientWidth;
        }
        if (h == undefined) {
            h = this.bigDiv.clientHeight;
        }
        this.jcanvas.init(this.canvasDiv, w, h, this.layerDiv);
        this.bitmapSys = new CanvasBitmapSys(this.jcanvas);
        this.inputs = new JCanvasInputs(this.jcanvas, this.inputsDiv, 50, 20);
        this.doms = new JCanvasDoms(this.jcanvas, this.domsDiv);
        this.bitmapSys.init();
    }
    /** 快速设置通用的事件,一般用在测试环境,不要用在正式开发环境 */
    quickSetEvent() {
        let lastP;
        this.jcanvas.event = {
            mousedown: (_p, e) => {
                lastP = new JPos(e.clientX, e.clientY);
            },
            mousemove: (_p, e) => {
                if (lastP) {
                    let p = new JPos(e.clientX, e.clientY);
                    let d = PosUtil.getSub(p, lastP);
                    this.jcanvas.setOffest(d, true);
                    lastP = p;
                }
            },
            mouseup: () => {
                lastP = undefined;
            },
            wheel: (p, e) => {
                this.jcanvas.pointScale(p, e.deltaY > 0 ? -this.jcanvas.scaleStep : this.jcanvas.scaleStep);
            }
        };
    }
}
function HGCanvasSysDebug(op) {
    this.testDomsDiv.innerHTML = "";
    this.isDebug = op.on || false;
    // 关闭
    if (!op.on) {
        return;
    }
    if (!op.fillStyle) {
        op.fillStyle = "rgba(0,255,0,0.5)";
    }
    /** 测试用的画布div */
    let canvasDiv = document.createElement("div");
    canvasDiv.className = "canvasDiv_test";
    [canvasDiv].forEach(div => {
        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.left = "0px";
        this.testDomsDiv.append(div);
    });
    /** 测试用的画布对象 */
    let jcanvas = new JCanvas();
    jcanvas.setCoordinate(this.jcanvas.coordinateX, this.jcanvas.coordinateY);
    jcanvas.init(canvasDiv, this.jcanvas.width, this.jcanvas.height);
    jcanvas.moveAndScale(this.jcanvas.x, this.jcanvas.y, this.jcanvas.scale);
    jcanvas.backgroupColor = "rgba(0,0,0,0)";
    /** 测试用的画布图元对象 */
    let jbitmapSys = new CanvasBitmapSys(jcanvas);
    jbitmapSys.init();
    // 克隆数据
    this.bitmapSys.foreach(child => {
        if (op.fillterFunc) {
            let check = op.fillterFunc(child);
            if (!check) {
                return;
            }
        }
        if (!child.checkData()) {
            return;
        }
        let data = child.getHitBox();
        if (!data) {
            return;
        }
        let bitmap = jbitmapSys.createBitmap("rect");
        bitmap.data = {
            x: data.p.x,
            y: data.p.y,
            width: data.w,
            height: data.h
        };
        bitmap.isFill = true;
        bitmap.style.fillStyle = "rgba(0,0,0,0)";
        bitmap.style.strokeStyle = "rgba(0,0,0,0)";
        bitmap.on("mouseenter", () => {
            bitmap.style.fillStyle = op.fillStyle;
            if (op.enterFunc) {
                op.enterFunc(bitmap, child);
            }
        });
        bitmap.on("mouseleave", () => {
            bitmap.style.fillStyle = "rgba(0,0,0,0)";
            if (op.leaveFunc) {
                op.enterFunc(bitmap, child);
            }
        });
        bitmap.on("click", () => {
            if (op.clickFunc) {
                op.clickFunc(bitmap, child);
            }
            else {
                console.log(child);
            }
            if (op.isClickDestroy) {
                bitmap.destory();
            }
        });
    });
    jbitmapSys.draw();
}
class HGCompassBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgCompass";
        this.path = new JPathBitmap(this.sys);
        this.circle = new JCircleBitmap(this.sys);
        this.text = new JTextBitmap(this.sys);
        this.circleR = 0;
        this.arrowPArr = [];
        this._init = () => {
            this.path.sys = this.sys;
            this.text.sys = this.sys;
            this.circle.sys = this.sys;
            this.path.isFill = true;
            this.circle.style.fillStyle = this.path.style.fillStyle = "#fff";
            this.circle.isFill = true;
            this.setColor("#000");
        };
        this.checkData = () => {
            if (!this.data)
                return false;
            return true;
        };
        this._mainHit = (p) => {
            let w = this.data.width / 2;
            let pArr = [
                new JPos(-w, -w),
                new JPos(w, -w),
                new JPos(w, w),
                new JPos(-w, w)
            ];
            pArr = PosUtil.getTransformPosArr(pArr, [1, 0, 0, 1, this.data.center.x, this.data.center.y]);
            return PosUtil.isPosInGeo(p, pArr) == 0 ? false : true;
        };
        this._mainDraw = () => {
            this.path._draw();
            this.circle._draw();
            this.text._draw();
        };
        this.toSvg = () => {
            let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            let path = this.path.toSvg();
            g.appendChild(path);
            let circle = this.circle.toSvg();
            g.appendChild(circle);
            let text = this.text.toSvg();
            g.appendChild(text);
            BitmapService.SetSvgcommonAttr(this, g);
            return g;
        };
    }
    setColor(color) {
        this.text.style.fillStyle = this.path.style.strokeStyle = this.circle.style.strokeStyle = color;
    }
    update() {
        let w = this.data.width / 2;
        this.arrowPArr = this._getArrowPArr();
        this.arrowPArr.splice(this.data.compass - 1, 1);
        this.arrowPArr = PosUtil.getTransformPosArr(this.arrowPArr, [1, 0, 0, 1, this.data.center.x, this.data.center.y]);
        this.path.data = this.path.getpolyLinePath(this.arrowPArr, true);
        this.circleR = Math.sqrt(2) / 4 * this.data.width;
        this.circle.data = {
            center: this.data.center,
            radius: this.circleR
        };
        this.text.data = {
            text: this.data.content,
            pos: this.data.center,
            fontSize: this.data.fontSize
        };
        this.text.fontHeightRatio = this.data.textHeightRatio;
        // this.text.style.font = `${this.data.fontSize}px,Arial`
    }
    _getArrowPArr() {
        let w = this.data.width / 2;
        return [new JPos(-w, 0), new JPos(0, w), new JPos(w, 0), new JPos(0, -w)];
    }
}
class HGCompassData {
    constructor() {
        this.textHeightRatio = 1.2;
        this.compass = 1;
    }
}
class HGJDimData {
}
class HGRectTextDataType {
    constructor() {
        /** 上下间距 */
        this.vInterval = 10;
        /** 类型 */
        this.plane = 2;
        /** 文字高度相对与宽度的比例,兼容字体重叠问题 */
        this.fontHeightRatio = 1.2;
        this.hAlign = "Left";
        this.vAlign = "Top";
        /** 左右间隔 */
        this.hInterval = 10;
    }
}
class HGRectTextBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "HGRectText";
        /** 文字高度 */
        this.fontHeight = 0;
        this.checkData = () => {
            if (!this.data)
                return false;
            if (this.data.w - this.data.hInterval * 2 < 0) {
                return false;
            }
            return true;
        };
        this._mainHit = (p) => {
            let rect = PosUtil.getRectByTwoPos(this.data.p, new JPos(this.data.p.x + this.data.w * this._jCanvas.coordinateX, this.data.p.y + this.data.h * this._jCanvas.coordinateY));
            /** 判断点 */
            for (let i = 0; i < rect.length; i++) {
                if (PosUtil.isSamePos(p, rect[i], this.finalHitCoefficient)) {
                    this.hitType = [i];
                    return true;
                }
            }
            /** 判断线 */
            for (let i = 0; i < rect.length - 1; i++) {
                if (PosUtil.isInLine(rect[i], rect[i + 1], p, this.finalHitCoefficient)) {
                    this.hitType = [i, i + 1];
                    return true;
                }
            }
            if (PosUtil.isInLine(rect[3], rect[0], p, this.finalHitCoefficient)) {
                this.hitType = [3, 0];
                return true;
            }
            /** 判断矩形 */
            if (PosUtil.isPosInGeo(p, rect)) {
                this.hitType = [5];
                return true;
            }
            this.hitType = undefined;
            return false;
        };
        this._mainDraw = () => {
            this._collectData();
            /** 调整位置 */
            this.ctx.scale(this._jCanvas.coordinateX, this._jCanvas.coordinateY);
            this.ctx.translate(this.data.p.x * this._jCanvas.coordinateX, this.data.p.y * this._jCanvas.coordinateY);
            /** 画框 */
            if (this.isFill) {
                this.ctx.fillRect(0, 0, this.data.w, this.data.h);
            }
            if (this.isStorke) {
                this.ctx.strokeRect(0, 0, this.data.w, this.data.h);
            }
            /** 画文字 */
            this._setFontSize(undefined, true);
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = this.data.fontColor;
            this.cacheData.contents.forEach((content, i) => {
                let p = content.p ? content.p : new JPos(this.data.hInterval, i * this.cacheData.height + this.cacheData.startHeight + this.fontHeight / 2);
                this._setFontStyle(content.S);
                this.ctx.fillText(content.text, p.x, p.y);
            });
            // 测试代码
            // this._testBox()
        };
        this._collectData = (fontSize) => {
            /** 判断是否有变化 */
            let check = [JSON.stringify(this.data.contents), this.data.fontFamily, this.data.fontSize, this.data.w, this.data.h, this.data.vInterval, this.isBold, this.data.hInterval, this.isItalic].join(",");
            if (fontSize == undefined && check == this.oldCheckData)
                return;
            this.oldCheckData = check;
            this._setFontSize(fontSize);
            if (fontSize == undefined)
                fontSize = this.data.fontSize;
            this._setFontStyle("B");
            this.ctx.textAlign = "left";
            let xData = this.ctx.measureText("O");
            this.fontHeight = xData.width * this.data.fontHeightRatio;
            let height = this.fontHeight + this.currentVInterval;
            this.cacheData = { contents: [], height: height, startHeight: this.fontHeight / 2 + this.currentVInterval };
            let rowStr = "";
            let row = 0;
            let w = 0;
            let S;
            let maxW = this.data.w - this.data.hInterval * 2;
            if (maxW <= 0) {
                this._setVAlign(fontSize);
                this._setHAlign();
                return;
            }
            let rowW = 0;
            let pushFunc = () => {
                if (rowStr == "")
                    return;
                this.cacheData.contents.push({ text: rowStr, width: w, S: S, row: row, startX: rowW, startY: row * (this.fontHeight + this.currentVInterval) });
                rowW += w;
            };
            // 循环遍历方法
            let loopFunc = (T, newS) => {
                if (S == newS) {
                    this._setFontStyle(newS);
                }
                S = newS;
                rowStr = "";
                for (let i = 0; i < T.length; i++) {
                    let t = T[i];
                    /** 字符串换行 */
                    if (t == "\n" || t == "\r") {
                        pushFunc();
                        row++;
                        rowStr = "";
                        rowW = 0;
                        continue;
                    }
                    else {
                        let newW = this.ctx.measureText(rowStr + t).width;
                        /** 不超出边界继续累加 */
                        if (newW + rowW < maxW) {
                            rowStr += t;
                            w = newW;
                            continue;
                        }
                        /** 连一个值都无法塞进去的话 */
                        else if (rowStr.length == 0) {
                            fontSize = fontSize * 0.8;
                            this._setFontSize(fontSize);
                            this._setFontStyle(newS);
                        }
                    }
                    pushFunc();
                    /** 换行 */
                    rowStr = "";
                    rowW = 0;
                    row++;
                    i--;
                }
                /** 如果文字不空,推送进去 */
                if (rowStr != "") {
                    pushFunc();
                }
            };
            let contents = this.data.contents;
            if (Array.isArray(contents)) {
                for (let j = 0; j < contents.length; j++) {
                    let T = contents[j].T;
                    let newS = contents[j].S;
                    loopFunc(T, newS);
                }
            }
            else {
                let newS = this.isBold ? "B" : "N";
                loopFunc(contents, newS);
            }
            this._setVAlign(fontSize);
            this._setHAlign();
        };
        this.getHitBox = (isNoTrans) => {
            let rect = PosUtil.getRectByTwoPos(this.data.p, new JPos(this.data.p.x + this.data.w * this._jCanvas.coordinateX, this.data.p.y + this.data.h * this._jCanvas.coordinateY));
            if (isNoTrans) {
                return PosUtil.getHitBox(rect);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr(rect, this.getCurrentTransform()));
        };
        this.toSvg = () => {
            /** 大的包裹框 */
            let bigG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            /** 需要镜像的包裹 */
            let mirrorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            bigG.appendChild(mirrorG);
            let m = [1, 0, 0, 1, 0, 0];
            MatrixUtil.scale(m, m, [this._jCanvas.coordinateX, this._jCanvas.coordinateY]);
            MatrixUtil.translate(m, m, [this.data.p.x * this._jCanvas.coordinateX, this.data.p.y * this._jCanvas.coordinateY]);
            mirrorG.setAttribute("transform", DomUtil.getMatrix(m));
            /** 矩形框 */
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            mirrorG.appendChild(rect);
            rect.setAttribute("x", "0");
            rect.setAttribute("y", "0");
            rect.setAttribute("width", this.data.w.toString());
            rect.setAttribute('height', this.data.h.toString());
            BitmapService.setSvgStroke(this, rect);
            BitmapService.setSvgFill(this, rect);
            /** 文字 */
            let size = this.currentFontSize ? this.currentFontSize : this.data.fontSize ? this.data.fontSize : this._jCanvas.fontSize;
            let family = this.data.fontFamily ? this.data.fontFamily : this._jCanvas.fontFamily;
            this.cacheData.contents.forEach((content) => {
                let p = new JPos(content.p.x, content.p.y);
                p.x += content.width / 2;
                p.y -= this.fontHeight / 2;
                let data = BitmapService.toSvgText(content.text, this.fontHeight, size, family, "middle", { coorX: 1, coorY: 1, p: p }, content.S == "B" ? true : false, this.isItalic);
                data.text.setAttribute('fill', this.data.fontColor || "#000000");
                mirrorG.appendChild(data.g);
            });
            BitmapService.SetSvgcommonAttr(this, bigG);
            return bigG;
        };
    }
    /** 测试包围框的代码 */
    _testBox() {
        this.ctx.restore();
        this.ctx.save();
        let rect = PosUtil.getRectByTwoPos(this.data.p, new JPos(this.data.p.x + this.data.w * this._jCanvas.coordinateX, this.data.p.y + this.data.h * this._jCanvas.coordinateY));
        // console.log(rect)
        this.ctx.strokeStyle = "#000";
        this.ctx.beginPath();
        this.ctx.moveTo(rect[0].x, rect[0].y);
        this.ctx.lineTo(rect[1].x, rect[1].y);
        this.ctx.lineTo(rect[2].x, rect[2].y);
        this.ctx.lineTo(rect[3].x, rect[3].y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    _setFontSize(fontSize, isCurrent = false) {
        if (fontSize == undefined)
            fontSize = isCurrent ? this.currentFontSize : this.data.fontSize;
        this.currentFontSize = fontSize;
        this.currentHInterval = fontSize / this.data.fontSize * this.data.hInterval;
        this.currentVInterval = fontSize / this.data.fontSize * this.data.vInterval;
        this.ctx.font = `${this.isItalic ? "italic " : ""}${this.isBold ? "bold " : ""}${this.currentFontSize}px ${this.data.fontFamily}`;
    }
    _setFontStyle(S) {
        this.ctx.font = `${this.isItalic ? "italic " : ""}${S == "B" ? "bold " : ""}${this.currentFontSize}px ${this.data.fontFamily}`;
    }
    /** 更新数据
     * @returns 会额外返回尺寸数据
     */
    updateData() {
        var _a, _b;
        this._collectData();
        let w = 0;
        let h = this.data.h;
        if ((_b = (_a = this.cacheData) === null || _a === void 0 ? void 0 : _a.contents) === null || _b === void 0 ? void 0 : _b.length) {
            this.cacheData.contents.forEach(data => {
                if (w < data.width) {
                    w = data.width;
                }
            });
            w += this.data.hInterval * 2;
        }
        else {
            w = this.data.w;
        }
        return { w, h };
    }
    _setHAlign() {
        let leftFunc = (_content) => {
            return this.data.hInterval;
        };
        let centerFunc = (content) => {
            return (this.data.w - content.width) / 2;
        };
        let rightFunc = (content) => {
            return this.data.w - this.data.hInterval - content.width;
        };
        let func;
        switch (this.data.hAlign) {
            case "Left":
            default:
                func = leftFunc;
                break;
            case "Right":
                func = rightFunc;
                break;
            case "Center":
                func = centerFunc;
                break;
        }
        this.cacheData.contents.forEach((content, i) => {
            let p = content.p ? content.p : new JPos(content.startX, content.startY + this.cacheData.startHeight + this.fontHeight / 2);
            p.x = content.startX + func(content);
            content.p = p;
        });
    }
    _setVAlign(oldFontSize) {
        let len = this.cacheData.contents.length == 0 ? 0 : this.cacheData.contents[this.cacheData.contents.length - 1].row + 1;
        let maxHeight = (this.fontHeight + this.currentVInterval) * len + this.currentVInterval;
        /** 超出高度 */
        if (maxHeight > this.data.h) {
            let newFontHeight = ((this.data.h - this.currentVInterval) / len) - this.currentVInterval;
            let fontSize = newFontHeight / (this.fontHeight + this.currentVInterval) * this.data.fontSize;
            if (!oldFontSize || oldFontSize > fontSize) {
                this._setFontSize(fontSize);
                this._collectData(fontSize);
                return;
            }
            else if (oldFontSize < fontSize) {
                fontSize = oldFontSize;
            }
        }
        let topFunc = (_content) => {
            return _content.startY + this.fontHeight + this.currentVInterval;
        };
        let bottomFunc = (_content) => {
            return this.data.h - maxHeight + _content.startY + this.fontHeight + this.currentVInterval;
        };
        let centerFunc = (_content) => {
            return (this.data.h - maxHeight) / 2 + _content.startY + this.fontHeight + this.currentVInterval;
        };
        let func;
        switch (this.data.vAlign) {
            case "Top":
            default:
                func = topFunc;
                break;
            case "Bottom":
                func = bottomFunc;
                break;
            case "Center":
                func = centerFunc;
                break;
        }
        this.cacheData.contents.forEach((content, i) => {
            let p = content.p ? content.p : new JPos(this.data.hInterval + content.startX, 0);
            p.y = func(content);
            content.p = p;
        });
    }
}
class HGRemarkDataType {
    constructor() {
        /** 上下间距 */
        this.vInterval = 10;
        /** 类型 */
        this.plane = 2;
        /** 文字高度相对与宽度的比例,兼容字体重叠问题 */
        this.fontHeightRatio = 1.2;
        this.hAlign = "Left";
        this.vAlign = "Top";
        /** 左右间隔 */
        this.hInterval = 10;
    }
}
class HGRemarkBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgRemark";
        /** 文字高度 */
        this.fontHeight = 0;
        /** 文字是否可以超出边界 */
        this.isOver = false;
        /** 文字超出边界是否需要缩放 */
        this.isOverScale = false;
        /** 外发光散发距离比例 */
        this.shadowBorderRatio = 20;
        /** 是否开启外发光功能 */
        this.isShadow = false;
        this.checkData = () => {
            if (!this.data)
                return false;
            return true;
        };
        this._mainHit = (p) => {
            let rect = PosUtil.getRectByTwoPos(this.data.p, new JPos(this.data.p.x + this.data.w * this._jCanvas.coordinateX, this.data.p.y + this.data.h * this._jCanvas.coordinateY));
            /** 判断点 */
            for (let i = 0; i < rect.length; i++) {
                if (PosUtil.isSamePos(p, rect[i], this.finalHitCoefficient)) {
                    this.hitType = [i];
                    return true;
                }
            }
            /** 判断线 */
            for (let i = 0; i < rect.length - 1; i++) {
                if (PosUtil.isInLine(rect[i], rect[i + 1], p, this.finalHitCoefficient)) {
                    this.hitType = [i, i + 1];
                    return true;
                }
            }
            if (PosUtil.isInLine(rect[3], rect[0], p, this.finalHitCoefficient)) {
                this.hitType = [3, 0];
                return true;
            }
            /** 判断矩形 */
            if (PosUtil.isPosInGeo(p, rect)) {
                this.hitType = [5];
                return true;
            }
            this.hitType = undefined;
            return false;
        };
        this._mainDraw = () => {
            this._collectData();
            /** 调整位置 */
            this.ctx.scale(this._jCanvas.coordinateX, this._jCanvas.coordinateY);
            this.ctx.translate(this.data.p.x * this._jCanvas.coordinateX, this.data.p.y * this._jCanvas.coordinateY);
            /** 画框 */
            if (this.isFill) {
                this.ctx.fillRect(0, 0, this.data.w, this.data.h);
            }
            if (this.isShadow && this.shadowColor) {
                this.ctx.save();
                let border = this.finalLineWidth * this.shadowBorderRatio;
                this.ctx.lineWidth = border;
                let fillFunc = (gradient, fillRect) => {
                    // this.ctx.fillStyle = "red"
                    var lineargradient = this.ctx.createLinearGradient(gradient[0], gradient[1], gradient[2], gradient[3]);
                    lineargradient.addColorStop(0, this.shadowColor);
                    lineargradient.addColorStop(1, "rgba(255,255,255,0)");
                    this.ctx.fillStyle = lineargradient;
                    this.ctx.beginPath();
                    this.ctx.moveTo(fillRect[0].x, fillRect[0].y);
                    for (let i = 1; i < fillRect.length; i++) {
                        this.ctx.lineTo(fillRect[i].x, fillRect[i].y);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                };
                fillFunc([0, 0, 0, -border], [new JPos(0, 0), new JPos(this.data.w, 0), new JPos(this.data.w + border, -border), new JPos(-border, -border)]);
                fillFunc([0, this.data.h, 0, this.data.h + border], [new JPos(0, this.data.h), new JPos(this.data.w, this.data.h), new JPos(this.data.w + border, this.data.h + border), new JPos(-border, this.data.h + border)]);
                fillFunc([0, 0, -border, 0], [new JPos(0, 0), new JPos(0, this.data.h), new JPos(-border, this.data.h + border), new JPos(-border, -border)]);
                fillFunc([this.data.w, 0, this.data.w + border, 0], [new JPos(this.data.w, 0), new JPos(this.data.w, this.data.h), new JPos(this.data.w + border, this.data.h + border), new JPos(this.data.w + border, -border)]);
                this.ctx.restore();
            }
            if (this.isStorke) {
                this.ctx.strokeRect(0, 0, this.data.w, this.data.h);
            }
            /** 画文字 */
            this._setFontStyle(undefined, true);
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = this.data.fontColor;
            this.cacheData.contents.forEach((content, i) => {
                let p = content.p ? content.p : new JPos(this.data.hInterval, i * this.cacheData.height + this.cacheData.startHeight + this.fontHeight / 2);
                this.ctx.fillText(content.text, p.x, p.y);
            });
        };
        this._collectData = (fontSize) => {
            /** 判断是否有变化 */
            let check = [this.data.content, this.data.fontFamily, this.data.fontSize, this.data.w, this.data.h, this.data.vInterval, this.isBold, this.data.hInterval, this.isItalic].join(",");
            if (fontSize == undefined && check == this.oldCheckData)
                return;
            this.oldCheckData = check;
            this._setFontStyle(fontSize);
            this.ctx.textAlign = "left";
            let xData = this.ctx.measureText("O");
            this.fontHeight = xData.width * this.data.fontHeightRatio;
            let height = this.fontHeight + this.currentVInterval;
            this.cacheData = { contents: [], height: height, startHeight: this.fontHeight / 2 + this.currentVInterval };
            let rowStr = "";
            let row = 1;
            let w = 0;
            let maxW = this.data.w - this.data.hInterval * 2;
            for (let i = 0; i < this.data.content.length; i++) {
                /** 如果超高就不加了 */
                if (!this.isOver && row * height > this.data.h)
                    break;
                if (this.data.content[i] == "\n" || this.data.content[i] == "\r") {
                    i += 1;
                }
                /** 没铺满就继续加 */
                else {
                    let newW = this.ctx.measureText(rowStr + this.data.content[i]).width;
                    if (newW < maxW) {
                        rowStr += this.data.content[i];
                        w = newW;
                        continue;
                    }
                }
                this.cacheData.contents.push({ text: rowStr, width: w });
                row++;
                rowStr = "";
                i--;
            }
            if (rowStr != "")
                this.cacheData.contents.push({ text: rowStr, width: w });
            this._setVAlign();
            this._setHAlign();
        };
        this.getHitBox = (isNoTrans) => {
            let rect = PosUtil.getRectByTwoPos(this.data.p, new JPos(this.data.p.x + this.data.w * this._jCanvas.coordinateX, this.data.p.y + this.data.h * this._jCanvas.coordinateY));
            if (isNoTrans) {
                return PosUtil.getHitBox(rect);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr(rect, this.getCurrentTransform()));
        };
        this.toSvg = () => {
            /** 大的包裹框 */
            let bigG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            /** 需要镜像的包裹 */
            let mirrorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            bigG.appendChild(mirrorG);
            let m = [1, 0, 0, 1, 0, 0];
            MatrixUtil.scale(m, m, [this._jCanvas.coordinateX, this._jCanvas.coordinateY]);
            MatrixUtil.translate(m, m, [this.data.p.x * this._jCanvas.coordinateX, this.data.p.y * this._jCanvas.coordinateY]);
            mirrorG.setAttribute("transform", DomUtil.getMatrix(m));
            /** 矩形框 */
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            mirrorG.appendChild(rect);
            rect.setAttribute("x", "0");
            rect.setAttribute("y", "0");
            rect.setAttribute("width", this.data.w.toString());
            rect.setAttribute('height', this.data.h.toString());
            BitmapService.setSvgStroke(this, rect);
            BitmapService.setSvgFill(this, rect);
            /** 文字 */
            let size = this.currentFontSize ? this.currentFontSize : this.data.fontSize ? this.data.fontSize : this._jCanvas.fontSize;
            let family = this.data.fontFamily ? this.data.fontFamily : this._jCanvas.fontFamily;
            this.cacheData.contents.forEach((content, i) => {
                let p = content.p ? new JPos(content.p.x, content.p.y) : new JPos(this.data.hInterval, i * this.cacheData.height + this.cacheData.startHeight);
                p.x += content.width / 2;
                p.y -= this.fontHeight / 2;
                let data = BitmapService.toSvgText(content.text, this.fontHeight, size, family, "middle", { coorX: 1, coorY: 1, p: p }, this.isBold, this.isItalic);
                data.text.setAttribute('fill', this.data.fontColor);
                mirrorG.appendChild(data.g);
            });
            BitmapService.SetSvgcommonAttr(this, bigG);
            return bigG;
        };
    }
    _setFontStyle(fontSize, isCurrent = false) {
        if (fontSize == undefined)
            fontSize = isCurrent ? this.currentFontSize : this.data.fontSize;
        this.currentFontSize = fontSize;
        this.currentHInterval = fontSize / this.data.fontSize * this.data.hInterval;
        this.currentVInterval = fontSize / this.data.fontSize * this.data.vInterval;
        this.ctx.font = `${this.isItalic ? "italic " : ""}${this.isBold ? "bold " : ""}${this.currentFontSize}px ${this.data.fontFamily}`;
    }
    _setHAlign() {
        let leftFunc = (_content, _i) => {
            return this.data.hInterval;
        };
        let centerFunc = (content, _i) => {
            return (this.data.w - content.width) / 2;
        };
        let rightFunc = (content, _i) => {
            return this.data.w - this.data.hInterval - content.width;
        };
        let func;
        switch (this.data.hAlign) {
            case "Left":
            default:
                func = leftFunc;
                break;
            case "Right":
                func = rightFunc;
                break;
            case "Center":
                func = centerFunc;
                break;
        }
        this.cacheData.contents.forEach((content, i) => {
            let p = content.p ? content.p : new JPos(0, i * this.cacheData.height + this.cacheData.startHeight + this.fontHeight / 2);
            p.x = func(content, i);
            content.p = p;
        });
    }
    _setVAlign() {
        let len = this.cacheData.contents.length;
        let maxHeight = (this.fontHeight + this.currentVInterval) * len + this.currentVInterval;
        if (this.isOverScale && maxHeight > this.data.h) {
            let newFontHeight = (this.data.h - this.currentVInterval) / len;
            let fontSize = newFontHeight / (this.fontHeight + this.currentVInterval) * this.data.fontSize;
            this._setFontStyle(fontSize);
            this._collectData(fontSize);
            return;
        }
        let topFunc = (_content, i) => {
            return (this.fontHeight + this.currentVInterval) * i + this.fontHeight + this.currentVInterval;
        };
        let bottomFunc = (_content, i) => {
            return this.data.h - maxHeight + (this.fontHeight + this.currentVInterval) * i + this.fontHeight + this.currentVInterval;
        };
        let centerFunc = (_content, i) => {
            return (this.data.h - maxHeight) / 2 + (this.fontHeight + this.currentVInterval) * i + this.fontHeight + this.currentVInterval;
        };
        let func;
        switch (this.data.vAlign) {
            case "Top":
            default:
                func = topFunc;
                break;
            case "Bottom":
                func = bottomFunc;
                break;
            case "Center":
                func = centerFunc;
                break;
        }
        this.cacheData.contents.forEach((content, i) => {
            let p = content.p ? content.p : new JPos(this.data.hInterval, 0);
            p.y = func(content, i);
            content.p = p;
        });
    }
    toHGJson() {
        if (!this.checkData())
            return undefined;
        let data = {};
        data = JSON.parse(JSON.stringify(data));
        data.Font = this.data.fontFamily;
        data.FontColor = this.data.fontColor;
        data.FontSize = this.data.fontSize.toString();
        data.H = this.data.h.toFixed(1);
        data.W = this.data.w.toFixed(1);
        data.X = this.data.p.x.toFixed(1);
        data.Y = this.data.p.y.toFixed(1);
        data.guid = this.id;
        data.Text = this.data.content;
        data.Plane = this.data.plane.toString();
        data.IsBackGround = this.isFill ? "1" : "0";
        data.IsBold = this.isBold ? "1" : "0";
        data.IsItalic = this.isItalic ? "1" : "0";
        data.FontHeightRatio = this.data.fontHeightRatio;
        data.IsStroke = this.isStorke ? "1" : "0";
        // console.log(data)
        return data;
    }
    fromHGJson(data) {
        // this.data = new HGRemarkDataType()
        this.data.fontFamily = data.Font;
        this.data.fontColor = data.FontColor;
        this.data.fontHeightRatio = data.FontHeightRatio;
        this.data.fontSize = parseFloat(data.FontSize);
        this.data.h = parseFloat(data.H);
        this.data.w = parseFloat(data.W);
        this.data.p = { x: parseFloat(data.X), y: parseFloat(data.Y) };
        this.id = data.guid;
        this.data.content = data.Text;
        this.data.plane = parseFloat(data.Plane);
        if (data.IsBackGround == "1") {
            this.isFill = true;
        }
        else {
            this.isFill = false;
        }
        if (data.IsStroke == "1")
            this.isStorke = true;
        else
            this.isStorke = false;
        if (data.IsBold == "1")
            this.isBold = true;
        else
            this.isBold = false;
        if (data.IsItalic == "1")
            this.isItalic = true;
        else
            this.isItalic = false;
    }
}
class HGSizeTextBitmap extends JTextBitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgSizeText";
        /** 留空字体 */
        this.leftEmptyFont = "O";
        /** 右留空字体 */
        this.rightEmptyFont = "O";
        this._getSize = () => {
            return this.currentScale;
        };
        this.updateRect = () => {
            if (!this.currentFamily)
                this.currentFamily = this._getFamily();
            // 初始化标准大小
            this.ctx.font = `20px ${this.currentFamily}`;
            // 设置宽度
            let maxWidth = 0;
            this._maxWidth = this.data.maxW;
            if (this.wrapInterval != undefined) {
                let arr = this.data.text.split("\r\n");
                this.textData = [];
                arr.forEach(text => {
                    let w = this.ctx.measureText(this.leftEmptyFont + text + this.rightEmptyFont).width;
                    if (w > maxWidth) {
                        maxWidth = w;
                    }
                    this.textData.push({ content: text, standardWidth: w });
                });
            }
            else {
                let w = this.ctx.measureText(this.leftEmptyFont + this.data.text + this.rightEmptyFont).width;
                maxWidth = w;
                this.textData = [{ content: this.data.text, standardWidth: w }];
            }
            this.currentScale = this.data.maxW / maxWidth * 20;
            // 设置居中用的高度
            let XdataW = this.ctx.measureText("O").width * (this.currentScale / 20);
            let startW = this.data.maxW / 2;
            this.fontHeight = XdataW * this.fontHeightRatio;
            let len = this.textData.length;
            this._maxHeight = this.fontHeight * len + (this.wrapInterval ? this.wrapInterval : 0) * (len + 1);
            let startH = this.data.maxH - (this.data.maxH - this._maxHeight) / 2;
            // 开始设置数据
            let p = new JPos(startW, -startH + this.fontHeight / 2);
            let textLen = this.textData.length - 1;
            this.textData.forEach((data, i) => {
                // y轴坐标需要额外处理
                if (this._jCanvas.coordinateY != -1) {
                    data = this.textData[textLen - i];
                }
                data.p = new JPos(p.x, p.y);
                p.y += (this.wrapInterval ? this.wrapInterval : 0) + this.fontHeight;
                data.width = this.ctx.measureText(data.content).width * (this.currentScale / 20);
                if (this.data.align) {
                    switch (this.data.align) {
                        case "Center":
                            break;
                        case "Left":
                            data.p.x -= (this.data.maxW - data.width) / 2;
                            break;
                        case "Right":
                            data.p.x += (this.data.maxW - data.width) / 2;
                            break;
                    }
                }
                if (this._maxWidth < data.width)
                    this._maxWidth = data.width;
            });
            /** 文字矩形宽高坐标集合,未经过任何偏移的,中心点为0,0 */
            let halfWidth = this._maxWidth / 2;
            let halfHeight = this._maxHeight / 2;
            let heightInterval = this.wrapInterval ? (this.textData.length - 1) * (this.fontHeight + this.wrapInterval) / 2 : 0;
            this.relPosArr = [
                { x: -halfWidth + startW, y: halfHeight - heightInterval + startH },
                { x: halfWidth + startW, y: halfHeight - heightInterval + startH },
                { x: halfWidth + startW, y: -halfHeight - heightInterval + startH },
                { x: -halfWidth + startW, y: -halfHeight - heightInterval + startH }
            ];
            this.ctx.font = `${this.currentScale}px ${this.currentFamily}`;
        };
        this._mainDraw = () => {
            // this.updateRect()
            this.currentFamily = this._getFamily();
            let newDataChangeStr = this._getOldChangeStr();
            if (this.currentScale == undefined || this.oldDataChangeStr == undefined || this.oldDataChangeStr != newDataChangeStr) {
                this.updateRect();
                this.oldDataChangeStr = newDataChangeStr;
            }
            this.ctx.font = `${this.currentScale}px ${this.currentFamily}`;
            this.absPosArr = PosUtil.translate(this.data.pos, this.relPosArr);
            /** 由于画布设置左下角为原点,一开始已经是y轴镜像了,直接显示文字是不行的,需要反过来镜像才能正确显示 */
            this.ctx.scale(this._jCanvas.coordinateX, this._jCanvas.coordinateY);
            this.ctx.translate(this.data.pos.x * this._jCanvas.coordinateX, this.data.pos.y * this._jCanvas.coordinateY);
            // 为了处理y轴向下的问题
            let a = this._jCanvas.coordinateY * -1;
            let deltaHeight = (1 - a) / 2 * this.fontHeight;
            if (this.isStorke) {
                this.textData.forEach(data => {
                    this.ctx.strokeText(data.content, data.p.x, data.p.y * a + deltaHeight);
                });
            }
            if (this.isFill) {
                this.textData.forEach(data => {
                    this.ctx.fillText(data.content, data.p.x, data.p.y * a + deltaHeight);
                });
            }
        };
    }
    _getOldChangeStr() {
        return `${this.data.pos.x},${this.data.pos.y},${this.currentFamily},${this.wrapInterval},${this.data.text},${this._jCanvas.scale}`;
    }
}
class HGSizeTextData {
    constructor() {
        this.align = "Center";
    }
}
/** 华广标注图元数据类型 */
class HGTagDataType {
    constructor() {
        /** 线段的颜色 */
        this.lineColor = "#000";
        /** 偏移 */
        this.distance = 0;
        /** 长度比例尺,如果text为空才起效 */
        this.lineLenRatio = 1;
        /** 缺口,方向为偏移的方向 */
        this.interval = 0;
        /** 文本字体 */
        this.textFont = "Arial";
        /** 文本位置 */
        this.textSite = "center";
        /** 文本弧度是否修正,当没用到文本弧度才会触发 */
        this.isTextRadianReFix = false;
        /** 线粗比例 */
        this.lineWidthratio = 1;
        /** 文本尺寸比例 */
        this.fontSizeRatio = 12;
        /** 文本与线段间距 */
        this.textLineInterval = 0;
        /** 文本与线段间距比例 */
        this.textLineIntervalRatio = 4;
        /** 箭头宽比例 */
        this.arrowWidthRatio = 5;
        /** 文字高度相对与宽度的比例,兼容字体重叠问题 */
        this.fontHeightRatio = 1.1;
        /** 弧度纠正 */
        this.isRadianFix = true;
        this.plane = 5;
        this.flag = 0;
        /** 是否开启缩放,应对svg缩放问题 */
        this.isScale = true;
    }
}
/** 华广标注图元 */
class HGTagBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgTag";
        /** 记录文字高度 */
        this.fontHeight = 0;
        /** 记录文本包围坐标集合,已经经过矩阵变换了 */
        this.textPosArr = [];
        /** 记录文本矩阵 */
        this.textM = [];
        /** 碰撞比例 */
        this.hitCoefficientRatio = 0;
        /** 标注的基础图元 */
        this.path = new JPathBitmap(this.sys);
        this.closePath = new JPathBitmap(this.sys);
        /** 左线 */
        this.leftLine = [];
        /** 右线 */
        this.rightLine = [];
        /** 左箭头 */
        this.leftArrowPs = [];
        /** 右箭头 */
        this.rightArrowPs = [];
        /** 是否碰撞到文本 */
        this.isHitText = false;
        /** 暂时作个默认缩放值,对应data.isScale,减少张建修改的去修改 */
        this.originScale = 6;
        /** 是否隐藏左箭头  */
        this.isHideLeftArrow = false;
        /** 是否隐藏右箭头 */
        this.isHideRightArrow = false;
        /** 为0的距离判断 */
        this.zeroDistance = 0;
        /** 精确小数点位数 */
        this.toFixNum = 0;
        /** 文字是否在线中间 */
        this.isTextInLineCenter = false;
        /** 文字是否强制一边 */
        this.isSideText = 0;
        this._init = () => {
            this.path.sys = this.sys;
            this.closePath.sys = this.sys;
        };
        this.checkData = () => {
            if (!this.data || !this.data.start || !this.data.end)
                return false;
            return true;
        };
        this._changeJCanvasFunc = () => {
            this.path._changeJCanvas(this._jCanvas);
            this.closePath._changeJCanvas(this._jCanvas);
        };
        this._mainDraw = () => {
            this.path.hitCoefficient = this.closePath.hitCoefficient = this.finalLineWidth * this.hitCoefficientRatio;
            this.path.style.lineWidth = this.closePath.style.lineWidth = this.lineWdith = this.finalLineWidth * this.data.lineWidthratio;
            if (this.data.isScale) {
                this.fontSize = this.data.fontSizeRatio * this.originScale;
            }
            else {
                this.fontSize = 1 / this._jCanvas.scale * this.data.fontSizeRatio;
            }
            this.arrowWidth = this.finalLineWidth * this.data.arrowWidthRatio;
            this._setTextFont();
            this.ctx.textAlign = "center";
            this.closePath.style.fillStyle = this.path.style.strokeStyle = this.style.strokeStyle = this.ctx.strokeStyle = this.data.lineColor;
            this.path.isFill = false;
            this.path.isStorke = true;
            this.closePath.isFill = true;
            this.closePath.isStorke = false;
            this.distance = PosUtil.getDistance(this.data.start, this.data.end);
            // 距离为0时候的判断
            if (this.checkZeroCircle()) {
                this.ctx.beginPath();
                this.ctx.arc(this.data.start.x, this.data.start.y, this.zeroCircleR, Math.PI * 2, 0, true);
                this.ctx.closePath();
                if (this.zeroCircleFill) {
                    this.ctx.fillStyle = this.zeroCircleFill;
                }
                this.ctx.fill();
                if (this.isStorke) {
                    this.ctx.lineWidth = this.finalLineWidth;
                    this.ctx.stroke();
                }
            }
            else {
                this._drawArrow();
                this._drawText();
            }
        };
        this._mainHit = (p) => {
            if (this.checkZeroCircle()) {
                let distance = this.zeroCircleR;
                distance += this.isStorke ? this.finalLineWidth : 0;
                return PosUtil.getDistance(this.data.start, p) < distance;
            }
            if (PosUtil.isPosInGeo(p, this.textPosArr)) {
                this.isHitText = true;
                return true;
            }
            this.isHitText = false;
            return this.closePath.getHit(p) || this.path.getHit(p);
        };
        this.toSvg = () => {
            this.setSvgAttr();
            let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            // if (this.data.arrowWidthRatio == 5) {
            //     console.log(this.arrowWidth)
            //     console.log(this._jCanvas.lineWidth)
            //     console.log(this.finalLineWidth)
            //     console.log(this.lineWidthMultiple)
            //     console.log("=========")
            // }
            if (this.checkZeroCircle()) {
                let fillStyle = this.zeroCircleFill || this._jCanvas.style.fill;
                let circle = JCircleBitmap.toSvg({ center: this.data.start, radius: this.zeroCircleR, isFill: true, fillStyle, obj: this });
                g.appendChild(circle);
                return g;
            }
            let path = this.path.toSvg({ strokeColor: this.data.lineColor });
            g.appendChild(path);
            let closePath = this.closePath.toSvg({ fillColor: this.data.lineColor });
            g.appendChild(closePath);
            // 额外增加描边
            if (this.data.isTextStroke) {
                let strokeText = BitmapService.toSvgText(this.textContent, this.fontHeight, this.fontSize, this.data.textFont, 'middle', { m: this.textM }, this.isBold, this.isItalic);
                strokeText.text.setAttribute("stroke", this.data.textStrokeColor || "#fff");
                strokeText.text.setAttribute("stroke-width", ((this.data.textStrokeWidth || 1) * this.finalLineWidth).toString());
                g.appendChild(strokeText.g);
            }
            let textData = BitmapService.toSvgText(this.textContent, this.fontHeight, this.fontSize, this.data.textFont, 'middle', { m: this.textM }, this.isBold, this.isItalic);
            textData.text.setAttribute('fill', this.data.textColor ? this.data.textColor : this.data.lineColor);
            g.appendChild(textData.g);
            BitmapService.SetSvgcommonAttr(this, g);
            return g;
        };
        this.boxCheck = (minP, maxP, isAbsInclude) => {
            if (!this.checkData())
                return false;
            let pathData = this.path.boxCheck(minP, maxP, isAbsInclude);
            let closePathData = this.closePath.boxCheck(minP, maxP, isAbsInclude);
            if (isAbsInclude) {
                return (pathData || closePathData) && PosUtil.isGeoInGeo(this.textPosArr, PosUtil.getRectByTwoPos(minP, maxP), isAbsInclude, true);
            }
            return (pathData || closePathData) || PosUtil.isGeoInGeo(this.textPosArr, PosUtil.getRectByTwoPos(minP, maxP), isAbsInclude, true);
        };
        this.getHitBox = (isNoTrans) => {
            if (!this.checkData())
                return undefined;
            if (this.checkZeroCircle()) {
                let p = new JPos().copy(this.data.start);
                if (!isNoTrans) {
                    p = PosUtil.getTransformPos(p, this.getCurrentTransform());
                }
                let data = {
                    p: new JPos(p.x - this.zeroCircleR, p.y - this.zeroCircleR),
                    w: this.zeroCircleR * 2,
                    h: this.zeroCircleR * 2,
                    maxP: new JPos(p.x + this.zeroCircleR, p.y + this.zeroCircleR)
                };
                return data;
            }
            let pArr = [...this.textPosArr];
            pArr.push(this.tagStart, this.tagEnd, ...this.leftLine, ...this.rightLine);
            if (isNoTrans) {
                return PosUtil.getHitBox(pArr);
            }
            return PosUtil.getHitBox(PosUtil.getTransformPosArr(pArr, this.getCurrentTransform()));
        };
    }
    /** 标注的起点 */
    get tagStart() { return this._tagStart; }
    /** 标注的终点 */
    get tagEnd() { return this._tagEnd; }
    /** 判断是圆 */
    checkZeroCircle() {
        return this.zeroCircleR && this.distance <= this.zeroDistance;
    }
    /** 设置文本字体 */
    _setTextFont(size) {
        this.ctx.font = `${size || this.fontSize}px ${this.data.textFont ? this.data.textFont : "arial"}`;
    }
    /** 获取左右线条 */
    getLeftRightLines() {
        let interval = this.data.interval * (this.data.distance < 0 ? -1 : 1);
        // this.path.data = ""
        let radian = PosUtil.getRadian(this.data.start, this.data.end);
        if (this.data.isRadianFix) {
            /** 转角度 */
            radian = Math.round(PosUtil.getAngleByRadian(radian));
            /** 转回弧度 */
            radian = PosUtil.getRadianByAngle(radian);
        }
        // this.textRadian = this.radian = radian
        let triangleRadian = radian + Math.PI / 2;
        /** 测试 */
        // this.path.data += this.path.getpolyLinePath([this.data.start, this.data.end], false)
        /** 左线 */
        let leftLine = [
            PosUtil.getRayPos(this.data.start, triangleRadian, interval),
            PosUtil.getRayPos(this.data.start, triangleRadian, interval + this.data.distance)
        ];
        /** 右线 */
        let rightLine = [
            PosUtil.getRayPos(this.data.end, triangleRadian, interval),
            PosUtil.getRayPos(this.data.end, triangleRadian, interval + this.data.distance)
        ];
        return {
            /** 左线条 */
            leftLine,
            /** 右线条 */
            rightLine,
            /** 弧度 */
            radian,
            /** 直角弧度 */
            triangleRadian
        };
    }
    /** 绘画箭头 */
    _drawArrow() {
        this.path.data = "";
        this.closePath.data = "";
        let data = this.getLeftRightLines();
        this.textRadian = this.radian = data.radian || 0;
        /** 测试 */
        // this.path.data += this.path.getpolyLinePath([this.data.start, this.data.end], false)
        /** 左线 */
        this.leftLine = data.leftLine;
        this.path.data += this.path.getpolyLinePath(this.leftLine, false);
        /** 右线 */
        this.rightLine = data.rightLine;
        this.path.data += this.path.getpolyLinePath(this.rightLine, false);
        /** 偏移的线 */
        this.path.data += this.path.getpolyLinePath([this.leftLine[1], this.rightLine[1]], false);
        let halfArrowWidth = this.arrowWidth / 2;
        /** 左箭头 */
        if (!this.isHideLeftArrow) {
            let leftArrowStart = PosUtil.getRayPos(this.leftLine[1], this.radian, this.arrowWidth);
            let leftArrowStartLeft = PosUtil.getRayPos(leftArrowStart, data.triangleRadian, halfArrowWidth);
            let leftArrowStartRight = PosUtil.getRayPos(leftArrowStart, data.triangleRadian, -halfArrowWidth);
            this.leftArrowPs = [this.leftLine[1], leftArrowStartLeft, leftArrowStartRight];
            this.closePath.data += this.path.getpolyLinePath(this.leftArrowPs, true);
        }
        else {
            this.leftArrowPs = [];
        }
        /** 右箭头 */
        if (!this.isHideRightArrow) {
            let rightArrowStart = PosUtil.getRayPos(this.rightLine[1], this.radian, -this.arrowWidth);
            let rightArrowStartLeft = PosUtil.getRayPos(rightArrowStart, data.triangleRadian, -halfArrowWidth);
            let rightArrowStartRight = PosUtil.getRayPos(rightArrowStart, data.triangleRadian, halfArrowWidth);
            this.rightArrowPs = [this.rightLine[1], rightArrowStartLeft, rightArrowStartRight];
            this.closePath.data += this.path.getpolyLinePath(this.rightArrowPs, true);
        }
        else {
            this.rightArrowPs = [];
        }
        this.path._draw();
        this.closePath._draw();
        this._tagStart = this.leftLine[1];
        this._tagEnd = this.rightLine[1];
    }
    static getTextData() {
    }
    /** 创建文本 */
    _drawText() {
        if (this.data.text != undefined) {
            this.textContent = this.data.text;
        }
        else {
            // let num=(this.distance * this.data.lineLenRatio)
            // num=Math.round(num*Math.pow(10,this.toFixNum+2))
            // num=Math.round(num*Math.pow(0.1,this.toFixNum))
            let num = (this.distance * this.data.lineLenRatio).toFixed(this.toFixNum + 2);
            let str = parseFloat(num).toFixed(this.toFixNum);
            this.textContent = parseFloat(str).toString();
        }
        /** 正负距离标记 */
        let d = this.data.distance > 0 ? 1 : -1;
        /** 正负弧度标记 */
        let r = 1;
        let mirror = 1;
        if (this.data.textRadian == undefined && this.data.isTextRadianReFix && this.data.distance != 0) {
            let angle = Math.round(PosUtil.getAbsAngle(PosUtil.getAngleByRadian(PosUtil.getRadian(this.leftLine[0], this.leftLine[1])))) || 0;
            let textAngle;
            if (angle < 0 || angle == 180 || angle == -180) {
                textAngle = angle + 90;
                mirror = -1;
            }
            else {
                textAngle = angle - 90;
                mirror = -1;
            }
            let realAngle = Math.round(PosUtil.getAbsAngle(PosUtil.getAngleByRadian(this.radian)));
            let a = Math.abs(realAngle - textAngle);
            if (a <= 181 && a >= 179) {
                r = -1;
            }
            this.textRadian = PosUtil.getRadianByAngle(textAngle);
        }
        this.ctx.fillStyle = this.data.textColor ? this.data.textColor : this.data.lineColor;
        this._setTextFont(20);
        // console.log(this.ctx.measureText(this.textContent).width)
        let textWidth = this.ctx.measureText(this.textContent).width * (this.fontSize / 20);
        let leftw, rightW, upH, downH;
        // console.log(textData)
        /** 由于缩放问题,暂时不启用这个 */
        // if (textData.actualBoundingBoxAscent != undefined) {
        //     let XData = this.ctx.measureText("O")
        //     leftw = rightW = textData.width / 2
        //     upH = downH = XData.width / 2
        // }
        // else {
        //     leftw = textData.actualBoundingBoxLeft
        //     rightW = textData.actualBoundingBoxRight
        //     upH = textData.actualBoundingBoxAscent
        //     downH = textData.actualBoundingBoxDescent
        // }
        /** 兼容大部分情况 */
        let XDataWidth = this.ctx.measureText("O").width * (this.fontSize / 20);
        leftw = rightW = textWidth / 2;
        this.fontHeight = XDataWidth * this.data.fontHeightRatio;
        this._setTextFont();
        upH = downH = this.fontHeight / 2;
        let left = PosUtil.getRayPos(this.tagStart, this.textRadian, leftw * (1 - this._jCanvas.coordinateX) / 2 * r + rightW * (1 + this._jCanvas.coordinateX) / 2 * r);
        let right = PosUtil.getRayPos(this.tagEnd, this.textRadian, -leftw * (1 - this._jCanvas.coordinateX) / 2 * r - rightW * (1 + this._jCanvas.coordinateX) / 2 * r);
        /** 调整位置 */
        switch (this.data.textSite) {
            case "center":
                this.realTextCenterP = PosUtil.getCenterPos(this.tagStart, this.tagEnd);
                break;
            case "left":
                this.realTextCenterP = r == 1 ? left : right;
                break;
            case "right":
                this.realTextCenterP = r == -1 ? left : right;
                break;
        }
        // 文本间距
        let textInterval = this.data.textLineInterval + this.data.textLineIntervalRatio * (this.data.isScale ? (this.originScale * 0.5) : this.finalLineWidth);
        if (!this.isTextInLineCenter) {
            let side = 1;
            if (this.isSideText) {
                side = d != this.isSideText ? -1 : 1;
            }
            d = d * side;
            /** 向上偏移以防挡住线 */
            this.realTextCenterP = PosUtil.getRayPos(this.realTextCenterP, this.textRadian + Math.PI / 2, (d == 1 ? upH : -downH) * r + ((1 + this._jCanvas.coordinateY) / 2 * d * r * (upH - downH)) + textInterval * d * r);
        }
        /** 修改矩阵 */
        let m = [1, 0, 0, 1, 0, 0];
        this.realTextRadian = this.data.textRadian == undefined ? this.textRadian : this.data.textRadian;
        MatrixUtil.translate(m, m, [this.realTextCenterP.x, this.realTextCenterP.y]);
        MatrixUtil.scale(m, m, [this._jCanvas.coordinateX, this._jCanvas.coordinateY]);
        MatrixUtil.rotate(m, m, this._jCanvas.coordinateX * this._jCanvas.coordinateY * this.realTextRadian);
        this.textM = m;
        /** 收集点集合,用于做碰撞 */
        this.textPosArr = [
            { x: -leftw, y: -upH },
            { x: rightW, y: -upH },
            { x: rightW, y: downH },
            { x: -leftw, y: downH }
        ];
        this.ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        if (this.fillColor != undefined) {
            this.ctx.save();
            this.ctx.fillStyle = this.fillColor;
            this.ctx.beginPath();
            this.textPosArr.forEach((p, i) => {
                if (i == 0) {
                    this.ctx.moveTo(p.x, p.y);
                }
                else {
                    this.ctx.lineTo(p.x, p.y);
                }
            });
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }
        /** 测试 */
        // this.ctx.beginPath()
        // this.ctx.moveTo(this.textPosArr[0].x, this.textPosArr[0].y)
        // this.ctx.lineTo(this.textPosArr[1].x, this.textPosArr[1].y)
        // this.ctx.lineTo(this.textPosArr[2].x, this.textPosArr[2].y)
        // this.ctx.lineTo(this.textPosArr[3].x, this.textPosArr[3].y)
        // this.ctx.closePath()
        // this.ctx.stroke()
        this.textPosArr = PosUtil.getTransformPosArr(this.textPosArr, m);
        // 额外增加描边
        if (this.data.isTextStroke) {
            this.ctx.save();
            this.ctx.strokeStyle = this.data.textStrokeColor || "#fff";
            if (this.data.textStrokeWidth) {
                this.ctx.lineWidth = this.data.textStrokeWidth * this.finalLineWidth;
            }
            this.ctx.strokeText(this.textContent, 0, this.fontHeight / 2);
            this.ctx.restore();
        }
        this.ctx.fillText(this.textContent, 0, this.fontHeight / 2);
    }
    /** 获取文字中心点 */
    getTextCenter() {
        if (this.textPosArr) {
            return PosUtil.getCenterPos(this.textPosArr[0], this.textPosArr[2]);
        }
        return undefined;
    }
    /**
     * 通过三点逆推坐标
     * @param tagStart  标注起点坐标
     * @param tagEnd 标注终点坐标
     * @param distancePos 距离坐标
     * @param interval 缺口
     */
    getInverseDataByThreePoint(tagStart, tagEnd, distancePos, interval = 0) {
        let radian = PosUtil.getRadian(tagStart, tagEnd);
        let vectorA = { x: tagEnd.x - tagStart.x, y: tagEnd.y - tagStart.y };
        let vectorB = { x: distancePos.x - tagStart.x, y: distancePos.y - tagStart.y };
        let s = vectorA.x * vectorB.y - vectorB.x * vectorA.y;
        let start;
        let end;
        let distance = 0;
        if (s == 0) {
            start = PosUtil.getRayPos(tagStart, radian + Math.PI / 2, interval);
            end = PosUtil.getRayPos(tagEnd, radian + Math.PI / 2, interval);
            distance = 0;
        }
        else {
            let a = (s > 0 ? 1 : -1);
            distance = PosUtil.getRightAngleDistance(distancePos, tagStart, tagEnd);
            start = PosUtil.getRayPos(tagStart, radian + Math.PI / 2, (distance + interval) * a);
            end = PosUtil.getRayPos(tagEnd, radian + Math.PI / 2, (distance + interval) * a);
            distance *= -a;
        }
        return { start, end, distance };
    }
    setSvgAttr() {
        let data = {
            lineWidth: this.finalLineWidth,
            fontSize: this.fontSize,
            leftArrowPs: this.leftArrowPs,
            rightArrowPs: this.rightArrowPs,
            realTextCenterP: this.realTextCenterP,
            realTextRadian: this.realTextRadian
        };
        this.svgAttrData = {
            "jtag": this.type,
            "jdata": JSON.stringify(data),
        };
    }
    /** 转华广json */
    toHGJson() {
        if (!this.checkData())
            return undefined;
        let data = new HGJDimData();
        data = JSON.parse(JSON.stringify(data));
        switch (this.data.textSite) {
            case "center":
                data.Align = "2";
                break;
            case "left":
                data.Align = "1";
                break;
            case "right":
                data.Align = "3";
                break;
        }
        switch (this.data.plane) {
            case 1:
            case 2:
                data.X0 = this.data.start.x.toFixed(1);
                data.X1 = this.data.end.x.toFixed(1);
                data.Z0 = this.data.start.y.toFixed(1);
                data.Z1 = this.data.end.y.toFixed(1);
                data.Y0 = "0.0";
                data.Y1 = "0.0";
                break;
            case 3:
            case 4:
                data.Y0 = this.data.start.x.toFixed(1);
                data.Y1 = this.data.end.x.toFixed(1);
                data.Z0 = this.data.start.y.toFixed(1);
                data.Z1 = this.data.end.y.toFixed(1);
                data.X0 = "0.0";
                data.X1 = "0.0";
                break;
            case 5:
            case 6:
                data.X0 = this.data.start.x.toFixed(1);
                data.X1 = this.data.end.x.toFixed(1);
                data.Y0 = this.data.start.y.toFixed(1);
                data.Y1 = this.data.end.y.toFixed(1);
                data.Z0 = "0.0";
                data.Z1 = "0.0";
                break;
        }
        data.Flag = this.data.flag.toString();
        data.DT = "0";
        data.Type = "Line";
        data.FontColor = this.data.textColor ? this.data.textColor : this.data.lineColor;
        data.FontSize = this.data.fontSizeRatio.toString();
        data.Font = this.data.textFont;
        data.OFFSET = this.data.distance.toFixed(1);
        data.OFFSET2 = this.data.interval.toFixed(1);
        data.guid = this.id;
        data.LineColor = this.data.lineColor;
        data.Plane = this.data.plane.toString();
        return data;
    }
    /** 通过华广json加载数据 */
    fromHGJson(data) {
        // if (!this.checkData()) return;
        // this.data = new HGTagDataType()
        switch (data.Align) {
            case "2":
                this.data.textSite = "center";
                break;
            case "1":
                this.data.textSite = "left";
                break;
            case "3":
                this.data.textSite = "right";
                break;
        }
        // this.data.textFont = data.Font
        this.data.flag = parseInt(data.Flag);
        this.data.textColor = data.FontColor;
        this.data.fontSizeRatio = parseFloat(data.FontSize);
        this.data.distance = parseFloat(data.OFFSET);
        this.data.interval = parseFloat(data.OFFSET2);
        this.data.plane = parseInt(data.Plane);
        this.data.lineColor = data.LineColor;
        this.id = data.guid;
        switch (this.data.plane) {
            case 1:
            case 2:
                this.data.start = new JPos(parseFloat(data.X0), parseFloat(data.Z0));
                this.data.end = new JPos(parseFloat(data.X1), parseFloat(data.Z1));
                break;
            case 3:
            case 4:
                this.data.start = new JPos(parseFloat(data.Y0), parseFloat(data.Z0));
                this.data.end = new JPos(parseFloat(data.Y1), parseFloat(data.Z1));
                break;
            case 5:
            case 6:
            default:
                this.data.start = new JPos(parseFloat(data.X0), parseFloat(data.Y0));
                this.data.end = new JPos(parseFloat(data.X1), parseFloat(data.Y1));
                break;
        }
    }
}
class HGTextBitmap extends JTextBitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgText";
        this.downHeight = 0.1;
        this.updateRect = () => {
            // 初始化标准大小
            this.textData = [];
            this._maxWidth = 0;
            this.ctx.font = `bold 20px ${this.currentFamily}`;
            let XdataW = this.ctx.measureText("O").width * (this.currentScale / 20);
            this.fontHeight = this._maxHeight = XdataW * this.fontHeightRatio;
            let startP = new JPos();
            startP.y += this.fontHeight / 2 - this.fontHeight * this.downHeight;
            this.data.contents.forEach(content => {
                this.ctx.font = `${content.isBold ? "bold " : ""}20px ${this.currentFamily}`;
                let data = this.textData[this.textData.push({ content: content.text, isBold: content.isBold }) - 1];
                data.p = new JPos(startP.x, startP.y);
                data.width = this.ctx.measureText(content.text).width * (this.currentScale / 20);
                this._maxWidth += data.width;
                // startP = new JPos(startP.x + data.width, startP.y)
            });
            let halfWidth = this._maxWidth / 2;
            let startX = -halfWidth;
            this.textData.forEach(data => {
                data.p.x = startX + data.width / 2;
                startX += data.width;
            });
            let halfHeight = this._maxHeight / 2;
            this.relPosArr = [
                { x: -halfWidth, y: halfHeight },
                { x: halfWidth, y: halfHeight },
                { x: halfWidth, y: -halfHeight },
                { x: -halfWidth, y: -halfHeight }
            ];
        };
        this._getSize = () => {
            return this.data.fontSize;
        };
        this._mainDraw = () => {
            this.currentScale = this._getSize();
            this.currentFamily = this._getFamily();
            this.updateRect();
            this.absPosArr = PosUtil.translate(this.data.pos, this.relPosArr);
            this.currentScale = this._getSize();
            this.ctx.scale(this._jCanvas.coordinateX, this._jCanvas.coordinateY);
            this.ctx.translate(this.data.pos.x * this._jCanvas.coordinateX, this.data.pos.y * this._jCanvas.coordinateY);
            this.textData.forEach(data => {
                let a = `${data.isBold ? "bold " : ""}${this.currentScale.toFixed(2)}px ${this.currentFamily}`;
                this.ctx.font = a;
                if (this.isStorke) {
                    this.ctx.strokeText(data.content, data.p.x, data.p.y);
                }
                if (this.isFill) {
                    this.ctx.fillText(data.content, data.p.x, data.p.y);
                }
            });
        };
    }
}
class HGTextData {
    constructor() {
        this.contents = [];
        this.fontSize = 10;
    }
}
class HGTextLineBitmap extends JTextBitmapBase {
    constructor() {
        super(...arguments);
        this.type = "hgTextLine";
        this.group = new JGroupBitmap(this.sys);
        this.text = this.group.createBitmap("text");
        this.line = this.group.createBitmap("line");
        this.lineMuiltiDelta = 0;
        this._init = () => {
        };
        this.checkData = () => {
            this.text.data = this.data;
            return this.text.checkData();
        };
        this._mainDraw = () => {
            this.text.data = this.data;
            this.text.updateRect();
            let h = Math.abs(this.text.relPosArr[1].y - this.text.relPosArr[2].y);
            let start = PosUtil.getAdd(this.text.relPosArr[2], this.data.pos);
            let end = PosUtil.getAdd(this.text.relPosArr[3], this.data.pos);
            let delta = new JPos(0, this.lineMuiltiDelta * h);
            start = PosUtil.getSub(start, delta);
            end = PosUtil.getSub(end, delta);
            this.line.data = {
                start: start,
                end: end
            };
            this.group._draw();
        };
        this._mainHit = (p) => {
            return this.text.getHit(p);
        };
        this.toSvg = () => {
            this.setSvgAttr();
            return this.group.toSvg();
        };
        this.getHitBox = (isNoTrans) => {
            return this.group.getHitBox();
        };
    }
    setSvgAttr() {
        let data = {
            h: Math.abs(this.text.relPosArr[1].y - this.text.relPosArr[2].y),
            w: Math.abs(this.text.relPosArr[0].x - this.text.relPosArr[1].x),
            x: this.data.pos.x,
            y: this.data.pos.y
        };
        this.svgAttrData = {
            "jtag": this.type,
            "jdata": JSON.stringify(data),
        };
    }
}
class RoomLineTagBitmapType {
}
class RoomLineTagBitmap extends BitmapBase {
    constructor() {
        super(...arguments);
        this.type = "roomLineTag";
        this.arrowPath = new JPathBitmap(this.sys);
        this.text = new JTextBitmap(this.sys);
        /** 箭头圆圈 */
        this.arrowCircle = new JCircleBitmap(this.sys);
        /** 单独圆 */
        this._AloneCircle = new JCircleBitmap(this.sys);
        /** 是否为箭头形式 */
        this.isArrow = false;
        /** 标记样式 */
        this.tagStyle = "x";
        /** svg图纸缩放系数 */
        this.svgTuzhiScale = 1;
        this._changeJCanvasFunc = (jca) => {
            this.arrowCircle._changeJCanvas(jca);
            this.arrowPath._changeJCanvas(jca);
            this.text._changeJCanvas(jca);
            this._AloneCircle._changeJCanvas(jca);
        };
        this._init = () => {
            this._AloneCircle.sys = this._AloneCircle.sys = this.text.sys = this.arrowPath.sys = this.sys;
            this.arrowCircle.isFill = true;
            this.arrowCircle.isStorke = false;
            this.text.style.textAlign = "center";
            this.arrowPath.isFill = true;
            this.arrowCircle.style.fillStyle = "#0f0";
            this.arrowPath.style.fillStyle = "#0f0";
            this.arrowPath.style.strokeStyle = "rgb(128,128,128)";
            this.text.isStorke = true;
            this._AloneCircle.data = new JCircle();
            this._AloneCircle.data.radius = undefined;
            this.setTextStyle("rgb(40,40,40)", "#fff");
            // this.text.styleReady = () => {
            //     this.text.ctx.lineWidth = this.finalLineWidth * 2
            //     console.log( this.text.ctx.lineWidth)
            //     // this.text.style.font = `${this._jCanvas.fontSize}px arial drop-shadow(4px 8px 8px #fff)`
            // }
        };
        /** 两边箭头拉伸长度 */
        this.arrowSkewLimit = 70;
        /** 箭头宽度,仅限于方向箭头 */
        this.arrowWidth = 30;
        /** 方向箭头圆圈的半径 */
        this.arrowCircleR = 20;
        /** 原始起始坐标,不带矩阵 */
        this.originStartP = new JPos();
        /** 原始终点坐标,不带矩阵 */
        this.originEndP = new JPos();
        /** 起始坐标,带矩阵 */
        this.startP = new JPos();
        /** 终点坐标,带矩阵 */
        this.endP = new JPos();
        /** 是否颠倒,仅限于方向箭头 */
        this.isReverse = false;
        this.checkData = () => {
            if (!this.data)
                return false;
            return true;
        };
        this._mainDraw = () => {
            if (!this.isDrawCircle()) {
                this.text.style.lineWidth = this.finalLineWidth * 2;
                // console.log("xx")
                this.arrowPath._draw();
                this.arrowCircle._draw();
                this.text._draw();
                return;
            }
            this._AloneCircle._draw();
        };
        this._mainHit = (p) => {
            if (!this.isDrawCircle()) {
                return (PosUtil.isInLine(this.startP, this.endP, p, this.finalHitCoefficient / 2) == undefined ? false : true) || this.text.getHit(PosUtil.getInvertPos(p, this.text.transform));
            }
            else {
                return this._AloneCircle.getHit(p);
            }
        };
        this.toSvg = () => {
            if (!this.isDrawCircle()) {
                this.setSvgAttr();
                let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                let arrow = this.arrowPath.toSvg();
                g.appendChild(arrow);
                if (this.arrowCircle.checkData()) {
                    let circle = this.arrowCircle.toSvg();
                    g.appendChild(circle);
                }
                if (this.text.checkData()) {
                    let text = this.text.toSvg();
                    g.appendChild(text);
                }
                return g;
            }
            else {
                this.svgAttrData = undefined;
                return this._AloneCircle.toSvg();
            }
            // return undefined
        };
        this.getHitBox = (isNoTrans) => {
            if (this.data.distance == 0 && this.isDrawCircle)
                return undefined;
            return PosUtil.getHitBoxByHitBoxes(this.text.getHitBox(isNoTrans), this.arrowPath.getHitBox(isNoTrans));
        };
    }
    /** 单独圆的半径 */
    get circleR() { return this._AloneCircle.data.radius; }
    set circleR(data) {
        this._AloneCircle.data.radius = data;
    }
    /** 单独圆的样式 */
    get circleStyle() {
        return this._AloneCircle.style;
    }
    /** 单独圆的是否填充 */
    get isCircleFill() { return this._AloneCircle.isFill; }
    set isCircleFill(data) {
        this._AloneCircle.isFill = data;
    }
    /** 单独圆的是否画线 */
    get isCirleStroke() { return this._AloneCircle.isStorke; }
    set isCirleStroke(data) {
        this._AloneCircle.isStorke = data;
    }
    /** 设置文字样式 */
    setTextStyle(fill, stroke) {
        if (fill)
            this.text.style.fillStyle = fill;
        if (stroke)
            this.text.style.strokeStyle = stroke;
    }
    /** 箭头标注数据更新 */
    arrowPathDataUpdate() {
        let halfD = this.data.distance / 2;
        /** 直线 */
        this.originStartP = new JPos(-halfD);
        this.originEndP = new JPos(halfD);
        this.arrowPath.data = this.arrowPath.getpolyLinePath([this.originStartP, this.originEndP], false);
        if (!this.isArrow) {
            /** ×形式标记 */
            if (this.tagStyle == "x") {
                this.arrowPath.data += this.arrowPath.getPolyLinePathArr([
                    /** 左边 */
                    [new JPos(this.originStartP.x, -this.arrowSkewLimit), new JPos(this.originStartP.x, this.arrowSkewLimit)],
                    [new JPos(this.originStartP.x - this.arrowSkewLimit, -this.arrowSkewLimit), new JPos(this.originStartP.x + this.arrowSkewLimit, this.arrowSkewLimit)],
                    /** 右边 */
                    [new JPos(this.originEndP.x, -this.arrowSkewLimit), new JPos(this.originEndP.x, this.arrowSkewLimit)],
                    [new JPos(this.originEndP.x - this.arrowSkewLimit, -this.arrowSkewLimit), new JPos(this.originEndP.x + this.arrowSkewLimit, this.arrowSkewLimit)]
                ]);
                this.arrowCircle.data = undefined;
            }
            /** l形式标记 */
            else if (this.tagStyle == "l") {
                this.arrowPath.data += this.arrowPath.getpolyLinePath([this.originStartP, new JPos(this.originStartP.x, this.originStartP.y + this.arrowSkewLimit)], false);
                this.arrowPath.data += this.arrowPath.getpolyLinePath([this.originEndP, new JPos(this.originEndP.x, this.originEndP.y + this.arrowSkewLimit)], false);
            }
            return;
        }
        /** 箭头形式 */
        let startP = this.isReverse ? this.originEndP : this.originStartP;
        let endP = this.isReverse ? this.originStartP : this.originEndP;
        this.arrowPath.data += this.arrowPath.getpolyLinePath([endP, new JPos(endP.x - this.arrowWidth / 2 * (this.isReverse ? -1 : 1), this.arrowWidth / 4), new JPos(endP.x - this.arrowWidth / 2 * (this.isReverse ? -1 : 1), -this.arrowWidth / 4)], true);
        this.arrowCircle.data = { center: startP, radius: this.arrowCircleR };
        return;
    }
    /** 文本数据更新 */
    textDataUpdate() {
        this.text.data = {
            text: this.data.text,
            pos: { x: 0, y: this.data.textMove == undefined ? 0 : this.data.textMove },
        };
    }
    changeArrowStorkeColor(color) {
        this.arrowPath.style.strokeStyle = this.arrowCircle.style.strokeStyle = color;
    }
    changeArrowFillColor(color) {
        this.arrowPath.style.fillStyle = this.arrowCircle.style.fillStyle = color;
    }
    /** 是否只绘画圆圈 */
    isDrawCircle() {
        return this.data.distance == 0 && this._AloneCircle.data.radius != undefined;
    }
    /** 数据更新 */
    dataUpdate() {
        if (!this.checkData())
            return;
        if (!this.isDrawCircle()) {
            this.arrowPathDataUpdate();
            this.textDataUpdate();
            return;
        }
        this._AloneCircle.data.center = this.data.center;
    }
    /** 设置矩阵,千万不要直接设 */
    setTransform() {
        if (!this.checkData())
            return;
        if (!this.isDrawCircle()) {
            let m = MatrixUtil.translate([], [1, 0, 0, 1, 0, 0], [this.data.center.x, this.data.center.y]);
            if (this.data.textRadian == undefined)
                this.data.textRadian = 0;
            this.text.transform = MatrixUtil.rotate([1, 0, 0, 1, 0, 0], m, this.data.textRadian);
            let arrowM = [1, 0, 0, 1, 0, 0];
            MatrixUtil.rotate(arrowM, m, this.data.radian);
            this.arrowCircle.transform = this.arrowPath.transform = arrowM;
            this.startP = PosUtil.getTransformPos(this.originStartP, arrowM);
            this.endP = PosUtil.getTransformPos(this.originEndP, arrowM);
        }
    }
    setSvgAttr() {
        let data = {
            lineWidth: this.finalLineWidth,
            svgTuzhiScale: this.svgTuzhiScale
        };
        this.svgAttrData = {
            "jtag": this.type,
            "jdata": JSON.stringify(data),
        };
    }
    /** 获取快速的数据 */
    getQuickData(startP, endP) {
        let data = new RoomLineTagBitmapType();
        data.center = PosUtil.getCenterPos(startP, endP);
        data.distance = PosUtil.getDistance(startP, endP);
        data.radian = PosUtil.getRadian(startP, endP);
        data.text = Math.round(data.distance).toString();
        data.textRadian = data.radian;
        return data;
    }
    /** 快速设置数据 */
    setQuickData(startP, endP, text, textRadian = 0) {
        if (!this.data)
            this.data = new RoomLineTagBitmapType();
        this.data = this.getQuickData(startP, endP);
        if (text != undefined) {
            this.data.text = text;
        }
        this.data.textRadian = textRadian;
        this.dataUpdate();
        this.setTransform();
    }
}
