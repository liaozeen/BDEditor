class CanvasMouseEvent {
    constructor() {
        /** 鼠标按下 */
        this.mousedown = undefined;
        /** 点击事件 */
        this.click = undefined;
        /** 双击事件 */
        this.dblclick = undefined;
        /** 鼠标移动 */
        this.mousemove = undefined;
        /** 鼠标放开 */
        this.mouseup = undefined;
        /** 鼠标滚动 */
        this.wheel = undefined;
        /** 右键菜单 */
        this.contextmenu = undefined;
        /** 鼠标进入 */
        this.mouseenter = undefined;
        /** 鼠标离开 */
        this.mouseleave = undefined;
    }
}
class CanvasLayerEvent extends CanvasMouseEvent {
    constructor() {
        super(...arguments);
        // /** 视图缩放 */
        // resize?: (w: number, h: number) => void = undefined
        /** 事件销毁,整个事件对象替换时触发 */
        this.destroy = undefined;
    }
}
/**
 * 画布框架类
 * @author Jeef
 */
class JCanvas {
    constructor() {
        /** 第一触发事件 */
        this._firstEvent = new CanvasLayerEvent();
        /** 正常事件之前触发的动作事件 */
        this._beforeEvent = new CanvasLayerEvent();
        /** 动作事件 */
        this._event = new CanvasLayerEvent();
        /** 正常事件之后触发的动作事件 */
        this._afterEvent = new CanvasLayerEvent();
        /** 最后触发的事件 */
        this._lastEvent = new CanvasLayerEvent();
        /**
         * 事件数组,方便事件扩展
         */
        this._eventList = [this._firstEvent, this._beforeEvent, this._event, this._afterEvent, this._lastEvent];
        /** 左边向右偏移 */
        this._x = 0;
        /** 底部向上偏移 */
        this._y = 0;
        /** 坐标系X ,1为左边,-1为右边 */
        this._coordinateX = 1;
        /** 坐标系Y 1为上边,-1为下边 */
        this._coordinateY = -1;
        /** 最大尺寸,undefined时无效 */
        this.maxScale = undefined;
        /** 最小尺寸,undefined时无效 */
        this.minScale = undefined;
        /** 旧的缩放,可用来判断是否已经缩放 */
        this._oldScale = 1;
        /** 缩放 */
        this._scale = 1;
        /** 是否缩放 */
        this._isScale = false;
        /** 缩放间隔,可用来做无限级缩放 */
        this._scaleStep = this.scale / 10;
        /** 原始线宽 */
        this.originLineWidth = 1;
        /** 默认线宽 */
        this._lineWidth = 1;
        /** 原始字体大小 */
        this.originFontSize = 12;
        /** 默认字体大小 */
        this._fontSize = 12;
        /** 默认字体样式 */
        this._fontFamily = "arial";
        /** 原始字体距离 */
        this.originFontDistance = 15;
        /** 默认字体距离 */
        this._fontDistance = 15;
        /** 时间戳,监控事件同步 */
        this.timestamp = new Date().getTime();
        /** 默认的画线样式 */
        this.strokeStyle = "#fff";
        /** 默认的填充样式 */
        this.fillStyle = "#fff";
        /** 默认的文字水平排列样式(默认居中) */
        this.textAlign = "center";
        /** 默认的文字垂直排列样式(默认居中) */
        this.textBaseline = "middle";
        /** 背景色 */
        this._backgroupColor = "#000";
        /** 是否初始化 */
        this._isInit = false;
        /** 矩阵变换事件,当矩阵变换就会触发 */
        this.transformEvent = new JEventEmit();
        /** 世界矩阵 */
        this._worldTransform = [1, 0, 0, 1, 0, 0];
        /** 是否阻止冒泡 */
        this._isStopPropagation = false;
        /** 尺寸修改触发的事件 */
        this.resizeEvent = new JEventEmit();
    }
    /** 第一触发事件 */
    get firstEvent() { return this._firstEvent; }
    set firstEvent(data) {
        if (this._firstEvent && this._firstEvent.destroy)
            this._firstEvent.destroy();
        this._changeEventList(this._firstEvent, data);
        this._firstEvent = data;
    }
    /** 正常事件之前触发的动作事件 */
    get beforeEvent() { return this._beforeEvent; }
    set beforeEvent(data) {
        if (this._beforeEvent && this._beforeEvent.destroy)
            this._beforeEvent.destroy();
        this._changeEventList(this._beforeEvent, data);
        this._beforeEvent = data;
    }
    /** 动作事件 */
    get event() { return this._event; }
    set event(data) {
        if (this._event && this._event.destroy)
            this._event.destroy();
        this._changeEventList(this._event, data);
        this._event = data;
    }
    get afterEvent() { return this._afterEvent; }
    /** 正常事件之后触发的动作事件 */
    set afterEvent(data) {
        if (this._afterEvent && this._afterEvent.destroy)
            this._afterEvent.destroy();
        this._changeEventList(this._afterEvent, data);
        this._afterEvent = data;
    }
    /** 最后触发的事件 */
    get lastEvent() { return this._lastEvent; }
    set lastEvent(data) {
        if (this._lastEvent && this._lastEvent.destroy)
            this._lastEvent.destroy();
        this._changeEventList(this._lastEvent, data);
        this._lastEvent = data;
    }
    /**
     * 事件数组,方便事件扩展
     */
    get eventList() { return this._eventList; }
    set eventList(data) {
        this._eventList = data;
    }
    /** 改变事件位置方法 */
    _changeEventList(oldObj, newObj) {
        let index = this._eventList.findIndex(e => oldObj == e);
        if (index == -1) {
            this._eventList.push(newObj);
            return;
        }
        this._eventList.splice(index, 1, newObj);
    }
    /** 左边向右偏移 */
    get x() { return this._x; }
    /** 底部向上偏移 */
    get y() { return this._y; }
    /** 坐标系X ,1为左边,-1为右边 */
    get coordinateX() { return this._coordinateX; }
    /** 坐标系Y 1为上边,-1为下边 */
    get coordinateY() { return this._coordinateY; }
    /** 旧的缩放,可用来判断是否已经缩放 */
    get oldScale() { return this._oldScale; }
    /** 缩放 */
    get scale() { return this._scale; }
    /** 是否缩放 */
    get isScale() { return this._isScale; }
    /** 缩放间隔,可用来做无限级缩放 */
    get scaleStep() { return this._scaleStep; }
    /** 线宽 */
    get lineWidth() { return this._lineWidth; }
    /** 默认字体大小 */
    get fontSize() { return this._fontSize; }
    /** 默认字体样式 */
    get fontFamily() { return this._fontFamily; }
    /** 默认字体样式 */
    set fontFamily(data) {
        this._fontFamily = data;
    }
    /** 默认字体距离 */
    get fontDistance() { return this._fontDistance; }
    /** 画布宽度 */
    get width() { return this._width; }
    /** 画布高度 */
    get height() { return this._height; }
    /** 背景色 */
    get backgroupColor() { return this._backgroupColor; }
    set backgroupColor(data) {
        this._backgroupColor = data;
        this.canvas.style.backgroundColor = data;
    }
    get isInit() { return this._isInit; }
    /** 世界矩阵 */
    get worldTransform() { return this._worldTransform; }
    /** 阻止冒泡 */
    stopPropagation() {
        this._isStopPropagation = true;
    }
    /**
     * 初始化(只触发一次)
     * @param width
     * @param height
     */
    init(canvasDiv, width, height, layerDiv) {
        if (this._isInit)
            return false;
        this.transformEvent.foremostSubcribe(() => {
            this._isScale = this.oldScale !== this._scale;
            this._oldScale = this._scale;
        });
        this._isInit = true;
        /** 绑定画布 */
        this.canvas = document.createElement('canvas');
        this.canvas.className = "jcanvas";
        this.canvas.style.background = "#000";
        this.canvas.style.zIndex = "0";
        canvasDiv.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.style = this.canvas.style;
        this.layerDiv = layerDiv ? layerDiv : this.canvas;
        if (width == undefined) {
            width = canvasDiv.clientWidth;
        }
        if (height == undefined) {
            height = canvasDiv.clientHeight;
        }
        this.resize(width, height);
        this._initEvent(layerDiv ? layerDiv : this.canvas);
        this.clear();
        this.transformEvent.emit();
        // this.animation()
    }
    /**
     * 设置缩放值
     * @param zoom
     */
    _setScale(zoom) {
        this._lineWidth = this.originLineWidth / zoom;
        this._fontSize = this.originFontSize / zoom;
        this._fontDistance = this.originFontDistance / zoom;
        this._scaleStep = zoom / 10;
        this._scale = zoom;
    }
    /**
     * 设置居中
     * @param maxPos 图形最大坐标
     * @param minPos 图形最小坐标
     * @param marginDistance 间隔边框距离
     * @param marginRatio  间隔边框距离比例
     * @tutorial marginDistance和marginRatio可以一起用,效果叠加
     */
    setCenter(maxPos, minPos, marginDistance, marginRatio) {
        if (!maxPos)
            maxPos = { x: this.width, y: this.height };
        if (!minPos)
            minPos = { x: 0, y: 0 };
        let drawH = maxPos.y - minPos.y + (marginDistance ? marginDistance : 0);
        let drawW = maxPos.x - minPos.x + (marginDistance ? marginDistance : 0);
        let ratioW = this.width / drawW;
        let ratioH = this.height / drawH;
        let newRatio = ratioW > ratioH ? ratioH : ratioW;
        let center = { x: (maxPos.x + minPos.x) / 2, y: (maxPos.y + minPos.y) / 2 };
        let newLeft = (this.width / 2) - center.x;
        let newBottom = (this.height / 2) - center.y;
        this._x = newLeft;
        this._y = newBottom;
        this._setScale(1);
        this.pointScale(center, newRatio - 1 - (newRatio * (marginRatio ? marginRatio : 0)), true);
    }
    /** 画布包围盒 */
    get bound() { return this._bound; }
    /** 调整坐标 */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this._bound = this.canvas.getBoundingClientRect();
        this._width = width;
        this._height = height;
        this.resizeEvent.emit({ w: width, h: height });
    }
    /** 更新画布包围盒 */
    updateBound() {
        this._bound = this.canvas.getBoundingClientRect();
    }
    /** 清除,会自动改变矩阵 */
    clear() {
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvas.height = this.canvas.height;
        if (this.beforeTranform)
            this.beforeTranform();
        this._initTransform();
        this._initStyle();
        if (this.afterClear)
            this.afterClear();
    }
    /** 初始化坐标系 */
    _initTransform() {
        let m = [1, 0, 0, 1, 0, 0];
        MatrixUtil.translate(m, m, [this.width * (this._coordinateX == -1 ? 1 : 0), this.height * (this.coordinateY == -1 ? 1 : 0)]);
        MatrixUtil.scale(m, m, [this.coordinateX, this.coordinateY]);
        MatrixUtil.translate(m, m, [this.x, this.y]);
        MatrixUtil.scale(m, m, [this.scale, this.scale]);
        this._worldTransform = m;
        this.ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    /** 设置坐标系 */
    setCoordinate(x, y) {
        this._coordinateX = x;
        this._coordinateY = y;
        if (this.render)
            this.render();
        this.transformEvent.emit();
    }
    /**
     * 初始化样式
     */
    _initStyle() {
        this.ctx.lineWidth = this._lineWidth;
        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.textAlign = this.textAlign;
        /** 由于pdf不兼容,暂不开放 */
        // this.ctx.textBaseline = this.textBaseline
    }
    /**
     * 获取画布坐标
     * @param e 鼠标事件
     */
    getCanvasPos(e, isClient) {
        if (!e)
            e = this._currentEvent;
        if (e instanceof UIEvent) {
            if (!isClient)
                e = { x: e.offsetX, y: e.offsetY };
            else
                e = { x: e.clientX - this.bound.left, y: e.clientY - this.bound.top };
        }
        return {
            x: (this.coordinateX == 1 ? (e.x - this.x) : (this.width - e.x - this.x)) / this.scale,
            y: (this.coordinateY == 1 ? (e.y - this.y) : (this.height - e.y - this.y)) / this.scale
        };
    }
    /**
     * 获取窗口坐标
     * @description 由于是通过反推的坐标,可能会有问题,慎用
     * @param pos
     */
    getWinPos(pos) {
        let X = pos.x * this.scale + this.x;
        if (this.coordinateX == 1)
            X += +this.bound.left;
        else
            X = this.width - X + this.bound.left;
        let Y = (pos.y * this.scale) + this.y;
        if (this.coordinateY == 1)
            Y += this.bound.top;
        else
            Y = this.height - Y + this.bound.top;
        return { x: X, y: Y };
    }
    /**
     * 事件初始化
     */
    _initEvent(dom) {
        if (!dom)
            return;
        dom.oncontextmenu = () => { return false; };
        let a = new CanvasMouseEvent();
        for (let key in a) {
            dom.addEventListener(key, (e) => {
                // this.timestamp = new Date().getTime()
                this.mouseE = e;
                this._isStopPropagation = false;
                this.canvasPos = this.getCanvasPos(e);
                /** 生命事件依次触发 */
                this._eventList.forEach(eventData => {
                    if (!this._isStopPropagation && eventData && eventData[key])
                        eventData[key](this.canvasPos, e);
                });
            }, { passive: false });
        }
    }
    /**
     * 先移动再缩放
     * @param x 左向右偏移 undfined时,默认原来值
     * @param y 底部向上偏移 undefined时,默认原来值
     * @param scale 缩放 undefined时,默认原来值
     * @tutorial 一切矩阵变化都基于这个
     */
    moveAndScale(x, y, scale) {
        this._y = y != undefined ? y : this.y;
        this._x = x != undefined ? x : this.x;
        this._setScale(scale != undefined ? scale : this.scale);
        this.clear();
        if (this.render)
            this.render();
        this.transformEvent.emit();
    }
    /**
      * 设置偏移
      * @param offsetPos 偏移坐标
      * @param isAuto 是否自动纠正(可以支持任意坐标系)
      */
    setOffest(offsetPos, isAuto = false) {
        let x = this.x + (offsetPos.x * (isAuto ? this.coordinateX : 1));
        let y = this.y + (offsetPos.y * (isAuto ? this.coordinateY : 1));
        this.moveAndScale(x, y, this.scale);
    }
    /**
     * 定点缩放
     * @param pos 真实数据坐标
     * @param plusScale 追加的缩放
     * @param isNoLimit 是否添加界限
     */
    pointScale(pos, plusScale, isNoLimit) {
        let scale = this._scale + plusScale;
        if (!isNoLimit && this.minScale != undefined)
            scale = Math.max(scale, this.minScale);
        if (!isNoLimit && this.maxScale != undefined)
            scale = Math.min(this.maxScale, scale);
        plusScale = scale - this._scale;
        let left = this.x - (pos.x * plusScale);
        let bottom = this.y - (pos.y * plusScale);
        this.moveAndScale(left, bottom, scale);
    }
    /** 动画帧,(暂时不用) */
    animation() {
        requestAnimationFrame(() => {
            if (this.render)
                this.render();
            this.animation();
        });
    }
    /** 触发渲染 */
    dispatchRender() {
        if (this.beforeRender)
            this.beforeRender();
        if (this.render)
            this.render();
        if (this.afterRender)
            this.afterRender();
    }
    /**
    * 修改尺寸居中
    * @param maxPos 图形最大坐标,没有默认屏幕坐标
    * @param minPos 图形最小坐标,没有默认0,0
    * @param marginDistance 间隔边框距离
    * @param marginRatio  间隔边框距离比例
    * @param canvasH 画布高度
    * @param canvasW 画布高度
    * @tutorial marginDistance和marginRatio可以一起用,效果叠加
    */
    resizeCenter(canvasW, canvasH, maxPos, minPos, marginDistance, marginRatio) {
        this.resize(canvasW, canvasH);
        this.setCenter(maxPos, minPos, marginDistance, marginRatio);
    }
}
class JCanvasElementType {
}
class JCanvasDoms {
    constructor(Jca, parentDiv) {
        this.Jca = Jca;
        this.parentDiv = parentDiv;
        /** 元素数据集合 */
        this.doms = [];
        /** 是否触发一个矩阵方法 */
        this.isOnlyOneTransFunc = false;
        /** 是否打开遮挡层 */
        this._isShowLayer = false;
        this._init();
    }
    /** 是否打开遮挡层 */
    get isShowLayer() { return this._isShowLayer; }
    /** 初始化 */
    _init() {
        this.layerDiv = document.createElement("div");
        this.layerDiv.setAttribute("class", "domLayerDiv");
        this.parentDiv.appendChild(this.layerDiv);
        this.domsDiv = document.createElement('div');
        this.domsDiv.setAttribute("class", "domsDiv");
        this.parentDiv.appendChild(this.domsDiv);
        this.domsDiv.style.position = this.layerDiv.style.position = "absolute";
        this.domsDiv.style.top = this.layerDiv.style.top = this.domsDiv.style.left = this.layerDiv.style.left = "0px";
        this.Jca.transformEvent.subscribe(() => {
            for (let i = 0; i < this.doms.length; i++) {
                /** 节约性能 */
                if (this.doms[i].dom.style.display != "none")
                    this.updateDomTransform(this.doms[i]);
            }
        });
        this.Jca.resizeEvent.subscribe(() => {
            this.layerDiv.style.width = `${this.Jca.width}px`;
            this.layerDiv.style.height = `${this.Jca.height}px`;
        });
        this.layerDiv.style.width = `${this.Jca.width}px`;
        this.layerDiv.style.height = `${this.Jca.height}px`;
        this.layerDiv.addEventListener("mousedown", (e) => {
            if (this.layerDownFunc)
                this.layerDownFunc(e);
        });
        this.layerDiv.addEventListener("mousemove", (e) => {
            if (this.layerMoveFunc)
                this.layerMoveFunc(e);
        });
        this.layerDiv.addEventListener("mouseup", (e) => {
            if (this.layerUpFunc)
                this.layerUpFunc(e);
        });
        this.layerDiv.addEventListener("click", (e) => {
            if (this.layerClickFunc)
                this.layerClickFunc(e);
        });
        this.setShowLayer(false);
    }
    /** 设置开关遮挡层 */
    setShowLayer(v) {
        this._isShowLayer = v;
        this.layerDiv.style.display = !v ? "none" : "block";
    }
    /** 更新所有元素矩阵 */
    updateDomsTransform() {
        this.Jca.updateBound();
        this.doms.forEach(dom => {
            this.updateDomTransform(dom);
        });
    }
    /** 更新元素矩阵 */
    updateDomTransform(obj) {
        obj.wp = this.Jca.getWinPos(obj.cp);
        /** 只触发一个方法 */
        if (this.isOnlyOneTransFunc) {
            if (obj.transFunc)
                obj.transFunc(obj.wp, this.Jca.scale);
            else
                obj.dom.style.transform = `${DomUtil.getMatrix([1, 0, 0, 1, obj.wp.x, obj.wp.y])}`;
        }
        /** 可触发两个方法 */
        else {
            obj.dom.style.transform = `${DomUtil.getMatrix([1, 0, 0, 1, obj.wp.x, obj.wp.y])}`;
            if (obj.transFunc)
                obj.transFunc(obj.wp, this.Jca.scale);
        }
    }
    /** 隐藏元素 */
    setHide(obj, v) {
        obj.dom.style.display = v ? "none" : "block";
    }
    /** 删除元素 */
    del(obj) {
        let isDel = false;
        for (let i = 0; i < this.doms.length; i++) {
            if (this.doms[i] == obj) {
                this.doms.splice(i, 1);
                isDel = true;
                break;
            }
        }
        if (isDel)
            obj.dom.remove();
    }
    /** 清空所有元素 */
    clear() {
        for (let i = this.doms.length - 1; i >= 0; i--) {
            if (this.doms[i].dom.parentElement) {
                let dom = this.doms[i].dom;
                this.doms.splice(i, 1);
                dom.remove();
            }
        }
        this.doms = [];
    }
    /** 按照画布坐标移动 */
    transByCanvasP(obj, p) {
        obj.cp = p;
        this.updateDomTransform(obj);
    }
    /** 按照屏幕坐标移动 */
    transByWinP(obj, p) {
        p = this.Jca.getCanvasPos(p);
        obj.cp = p;
        this.updateDomTransform(obj);
    }
    /** 通过坐标添加dom */
    addByP(dom, p) {
        let a = new JCanvasElementType();
        a.cp = p;
        a.dom = dom;
        this.doms.push(a);
        this.updateDomTransform(a);
        this.domsDiv.appendChild(dom);
        return a;
    }
}
/**
 * 画布输入框图元
 */
class JCanvasInputs extends JCanvasDoms {
    constructor(Jca, parentDiv, inputW, inputH, fontSize) {
        super(Jca, parentDiv);
        this.Jca = Jca;
        this.parentDiv = parentDiv;
        this.inputW = inputW;
        this.inputH = inputH;
        this.fontSize = fontSize;
        this.layerDiv.setAttribute("class", "inputsLayerDiv");
        this.domsDiv.setAttribute("class", "inputsDiv");
    }
    /** 添加输入框 */
    add(p, value, func) {
        let input = document.createElement("input");
        input.style.position = "fixed";
        input.style.textAlign = "center";
        input.style.width = `${this.inputW}px`;
        input.style.height = `${this.inputH}px`;
        input.style.left = `${-this.inputW / 2}px`;
        input.style.top = `${-this.inputH / 2}px`;
        if (this.fontSize)
            input.style.fontSize = this.fontSize + 'px';
        input.value = value;
        input.onchange = (e) => {
            func((e.target).value);
        };
        let obj = this.addByP(input, p);
        obj.w = this.inputW;
        obj.h = this.inputH;
        return obj;
    }
    /** 开启点击默认选中的功能,一旦启动,无法关闭.需要销毁重建 */
    openClickSelect(obj) {
        obj.dom.addEventListener("click", () => {
            obj.dom.select();
        });
    }
}
