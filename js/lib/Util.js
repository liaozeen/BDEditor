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
 * 矩阵工具类
 */
class MatrixUtil {
    /**
     * Inverts a mat2d
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the source matrix
     * @returns {mat2d} out
     */
    static invert(out, a) {
        let aa = a[0], ab = a[1], ac = a[2], ad = a[3];
        let atx = a[4], aty = a[5];
        let det = aa * ad - ab * ac;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        out[0] = ad * det;
        out[1] = -ab * det;
        out[2] = -ac * det;
        out[3] = aa * det;
        out[4] = (ac * aty - ad * atx) * det;
        out[5] = (ab * atx - aa * aty) * det;
        return out;
    }
    /**
     * Multiplies two mat2d's
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the first operand
     * @param {mat2d} b the second operand
     * @returns {mat2d} out
     */
    static multiply(out, a, b) {
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
        out[0] = a0 * b0 + a2 * b1;
        out[1] = a1 * b0 + a3 * b1;
        out[2] = a0 * b2 + a2 * b3;
        out[3] = a1 * b2 + a3 * b3;
        out[4] = a0 * b4 + a2 * b5 + a4;
        out[5] = a1 * b4 + a3 * b5 + a5;
        return out;
    }
    /**
     * Rotates a mat2d by the given angle
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat2d} out
    */
    static rotate(out, a, rad) {
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        out[4] = a4;
        out[5] = a5;
        return out;
    }
    /**
    * Scales the mat2d by the dimensions in the given vec2
    *
    * @param {mat2d} out the receiving matrix
    * @param {mat2d} a the matrix to translate
    * @param {vec2} v the vec2 to scale the matrix by
    * @returns {mat2d} out
**/
    static scale(out, a, v) {
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        let v0 = v[0], v1 = v[1];
        out[0] = a0 * v0;
        out[1] = a1 * v0;
        out[2] = a2 * v1;
        out[3] = a3 * v1;
        out[4] = a4;
        out[5] = a5;
        return out;
    }
    /**
     * Translates the mat2d by the dimensions in the given vec2
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the matrix to translate
     * @param {vec2} v the vec2 to translate the matrix by
     * @returns {mat2d} out
     **/
    static translate(out, a, v) {
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        let v0 = v[0], v1 = v[1];
        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = a0 * v0 + a2 * v1 + a4;
        out[5] = a1 * v0 + a3 * v1 + a5;
        return out;
    }
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.rotate(dest, dest, rad);
     *
     * @param {mat2d} out mat2d receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat2d} out
     */
    static fromRotation(out, rad) {
        let s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        out[4] = 0;
        out[5] = 0;
        return out;
    }
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.scale(dest, dest, vec);
     *
     * @param {mat2d} out mat2d receiving operation result
     * @param {vec2} v Scaling vector
     * @returns {mat2d} out
     */
    static fromScaling(out, v) {
        out[0] = v[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = v[1];
        out[4] = 0;
        out[5] = 0;
        return out;
    }
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.translate(dest, dest, vec);
     *
     * @param {mat2d} out mat2d receiving operation result
     * @param {vec2} v Translation vector
     * @returns {mat2d} out
     */
    static fromTranslation(out, v) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = v[0];
        out[5] = v[1];
        return out;
    }
    /**
     * Adds two mat2d's
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the first operand
     * @param {mat2d} b the second operand
     * @returns {mat2d} out
     */
    static add(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        out[3] = a[3] + b[3];
        out[4] = a[4] + b[4];
        out[5] = a[5] + b[5];
        return out;
    }
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the first operand
     * @param {mat2d} b the second operand
     * @returns {mat2d} out
     */
    static subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        out[3] = a[3] - b[3];
        out[4] = a[4] - b[4];
        out[5] = a[5] - b[5];
        return out;
    }
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {mat2d} out the receiving matrix
     * @param {mat2d} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {mat2d} out
     */
    static multiplyScalar(out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        out[2] = a[2] * b;
        out[3] = a[3] * b;
        out[4] = a[4] * b;
        out[5] = a[5] * b;
        return out;
    }
    /**
     * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
     *
     * @param {mat2d} out the receiving vector
     * @param {mat2d} a the first operand
     * @param {mat2d} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {mat2d} out
     */
    static multiplyScalarAndAdd(out, a, b, scale) {
        out[0] = a[0] + (b[0] * scale);
        out[1] = a[1] + (b[1] * scale);
        out[2] = a[2] + (b[2] * scale);
        out[3] = a[3] + (b[3] * scale);
        out[4] = a[4] + (b[4] * scale);
        out[5] = a[5] + (b[5] * scale);
        return out;
    }
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {mat2d} a The first matrix.
     * @param {mat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    static exactEquals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
    }
    /**
     * 分离
     * @param m 矩阵
     * @returns 矩阵先后顺序为 移动,旋转,缩放,scale分为x方向缩放和y方向缩放
     */
    static split(m) {
        /** 移动 */
        let translate = new JPos(m[4], m[5]);
        /** 两者相除得tan */
        let tan = m[1] / m[0];
        /** tan反向得弧度 */
        let radian = Math.atan(tan);
        let scaleX = m[0] / Math.cos(radian);
        let scaleY = m[3] / Math.cos(radian);
        return { translate, radian, scaleX, scaleY };
    }
    /**
     * 快速分离
     * @param m 举证
     * @returns 矩阵先后顺序为 移动,旋转,缩放,scale固定为单值缩放
     */
    static quickSplit(m) {
        /** 移动 */
        let translate = new JPos(m[4], m[5]);
        /** 两者相除得tan */
        let tan = m[1] / m[0];
        /** tan反向得弧度 */
        let radian = Math.atan(tan);
        /** 通过矩阵公式现矩阵/cos得出scale */
        let scale = m[0] / Math.cos(radian);
        return { translate, radian, scale };
    }
}
/**
 * 优化版观察者
 * @author Jeef
 * @tutorial 一般使用subcribe和emit就可以了
 */
class JEventEmit {
    constructor(_listenSubscribe, _listenUnsubscribe) {
        this._listenSubscribe = _listenSubscribe;
        this._listenUnsubscribe = _listenUnsubscribe;
        /**观察触发方法数组 */
        this._subscribers = [];
        /** 排列顺序 */
        this._sortIDList = [];
        /** 下一个id */
        this._nextID = 0;
        /** id列表 */
        this._idList = [];
    }
    /** 监听的事件的长度 */
    get length() {
        return this._subscribers.length;
    }
    /**
     * 获取一个id
     */
    _getNextID() {
        this._nextID++;
        return this._nextID;
    }
    /**
     * 添加订阅事件
     * @param func 订阅用的方法
     * @param sortID 排列用的id
     * @param id   事件的id
     * @param index 数组的位置
     */
    _addSubscribe(func, sortID, id, index) {
        if (index == undefined) {
            this._sortIDList.push(sortID);
            this._subscribers.push(func);
            this._idList.push(id);
            return true;
        }
        this._subscribers.splice(index, 0, func);
        this._sortIDList.splice(index, 0, sortID);
        this._idList.splice(index, 0, id);
        return true;
    }
    /**
     * 删除订阅事件
     * @param num 序号
     */
    _delSubscribe(num) {
        this._sortIDList.splice(num, 1);
        this._subscribers.splice(num, 1);
        this._idList.splice(num, 1);
    }
    /** 订阅观察者事件
     * @param obj 订阅的事件
     * @param sortID 排列顺序,默认为1,可以为小数,根据数值不同,越大放在越后,越小放在越前,正数同值往后推,负数同值往前推
     * @param id 用于寻找
     * @returns 返回订阅的id,用来unsubscribe
     */
    subscribe(obj, sortID, id) {
        /** 触发监听订阅的方法 */
        if (this._listenSubscribe) {
            this._listenSubscribe();
        }
        if (id == undefined) {
            id = this._getNextID();
        }
        if (sortID == undefined) {
            sortID = 1;
        }
        /* 空数组直接添加 */
        if (this._sortIDList.length == 0) {
            this._addSubscribe(obj, sortID, id);
            return id;
        }
        /** 是否已经添加了的标记 */
        let isAdd = false;
        /* 大于0,则从后面开始往前靠 */
        if (sortID >= 0) {
            for (let i = this._sortIDList.length - 1; i >= 0; i--) {
                if (sortID >= this._sortIDList[i]) {
                    this._addSubscribe(obj, sortID, id, i + 1);
                    isAdd = true;
                    break;
                }
            }
            if (!isAdd)
                this._addSubscribe(obj, sortID, id, 0);
        }
        /* 小于0,则从前面开始往后面靠 */
        else {
            for (let i = 0; i < this._sortIDList.length; i++) {
                if (sortID <= this._sortIDList[i]) {
                    this._addSubscribe(obj, sortID, id, i);
                    isAdd = true;
                    break;
                }
            }
            if (!isAdd)
                this._addSubscribe(obj, sortID, id, this._sortIDList.length);
        }
        return id;
    }
    /** 获取监听事件序号 */
    getSubcribeIndexByID(id) {
        return this._idList.findIndex(child => child == id);
    }
    /** 替换监听事件
     * @param id 指定的唯一id
     * @param sortID 排列顺序,默认为1,可以为小数,根据数值不同,越大放在越后,越小放在越前,正数同值往后推,负数同值往前推
     */
    replaceSubcribe(obj, id, sortID) {
        let index = this.getSubcribeIndexByID(id);
        if (index == -1) {
            this.subscribe(obj, sortID, id);
        }
        else {
            this._subscribers[index] = obj;
        }
        return index;
    }
    /** 提前订阅观察者事件
     * @method subscribe(obj,-1)
     * @param obj 订阅的事件
     * @returns 返回订阅的id,用来unsubscribe
     */
    advanceSubcribe(obj) {
        return this.subscribe(obj, -1);
    }
    /** 最前订阅观察者事件
     * @method subscribe(obj,-2)
        * @param obj 订阅的事件
     * @returns 返回订阅的id,用来unsubscribe
     */
    foremostSubcribe(obj) {
        return this.subscribe(obj, -2);
    }
    /** 往后订阅观察者事件
     * @method subscribe(obj,2)
     * @param obj 订阅的事件
     * @returns 返回订阅的id,用来unsubscribe
     */
    backwardSubcribe(obj) {
        return this.subscribe(obj, 2);
    }
    /** 最后订阅观察者事件
     * @method subscribe(obj,3)
     * @param obj 订阅的事件
     * @returns 返回订阅的id,用来unsubscribe
     */
    finalySubcribe(obj) {
        return this.subscribe(obj, 3);
    }
    /**
     * 根据排列数值对事件进行删除,同样数值会批量删除
     * @param sortID 默认数值为1
     */
    delBySortID(sortID = 1) {
        /* 由于数值是按照大小排列,可以通过比较来减少运算量 */
        /* 大于0,则从后面开始往前靠 */
        if (sortID >= 0) {
            for (let i = this._sortIDList.length - 1; i >= 0; i--) {
                /* 如果比当前值都大,则没有往下算的意义 */
                if (sortID > this._sortIDList[i]) {
                    break;
                }
                if (sortID == this._sortIDList[i]) {
                    this._delSubscribe(i);
                }
            }
        }
        /* 小于0,则从前面开始往后面靠 */
        else {
            let len = this._sortIDList.length;
            let current = 0;
            while (current < len) {
                /* 如果比当前值都小,则没有往下算的意义 */
                if (sortID < this._sortIDList[current]) {
                    break;
                }
                /* 删减数组元素,减少数组长度,当前值不变 */
                if (sortID == this._sortIDList[current]) {
                    this._delSubscribe(current);
                    len--;
                }
                else {
                    current++;
                }
            }
        }
    }
    /**
     * 触发事件
     * @param data 传送的数据
     * @param errCB 错误回调
     */
    emit(data, errCB) {
        for (let i = 0; i < this._subscribers.length; i++) {
            try {
                this._subscribers[i](data);
            }
            catch (e) {
                console.error(e);
                console.error(`事件报错`);
                if (errCB)
                    errCB(this._subscribers[i]);
            }
        }
    }
    /**
     * 尝试触发事件
     * @param data 传送的数据
     */
    tryEmit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                for (let i = 0; i < this._subscribers.length; i++) {
                    try {
                        this._subscribers[i](data);
                    }
                    catch (e) {
                        console.error(e);
                        console.error(`事件报错`);
                        reject(this._subscribers[i]);
                    }
                }
                resolve(undefined);
            });
        });
    }
    /**
     * 异步触发事件
     * @param data 传送的数据
     */
    asyncEmit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this._subscribers.length; i++) {
                    try {
                        yield this._subscribers[i](data);
                    }
                    catch (e) {
                        console.error(e);
                        reject(e);
                    }
                }
                resolve(undefined);
            }));
        });
    }
    /**
     * 取消订阅
     * @param idOrFunc 订阅对应的id或者方法,不写则全取消
     * @returns 取消成功返回true,取消失败返回false
     */
    unsubscribe(idOrFunc) {
        /** 触发取消监听订阅的方法 */
        if (this._listenUnsubscribe)
            this._listenUnsubscribe();
        /** 没有值,就全部取消 */
        if (!idOrFunc) {
            this.reset();
            return true;
        }
        /* id */
        if (typeof idOrFunc == "number" || typeof idOrFunc == "string")
            for (let i = this._idList.length - 1; i >= 0; i--) {
                if (this._idList[i] == idOrFunc) {
                    this._delSubscribe(i);
                    return true;
                }
            }
        /* 方法 */
        else
            for (let i = this._subscribers.length - 1; i >= 0; i--) {
                if (this._subscribers[i] == idOrFunc) {
                    this._delSubscribe(i);
                    return true;
                }
            }
        return false;
    }
    /** 重置 */
    reset() {
        this._subscribers = [];
        this._sortIDList = [];
        this._idList = [];
    }
    /** 是否为空 */
    isEmpty() {
        return this._subscribers.length == 0;
    }
}
class PosUtil_Arc {
    /**
        * 判断弧度时候在圆弧范围内
        * @param targetRadian 目标弧度
        * @param startRadian 圆弧开始弧度
        * @param endRadian 圆弧结束弧度
        * @param isCounterClockwise 是否翻转
        */
    isRadianInArc(targetRadian, startRadian, endRadian, isCounterClockwise) {
        if (startRadian == endRadian) {
            return false;
        }
        let target = new JPos(Math.cos(targetRadian), Math.sin(targetRadian));
        let start = new JPos(Math.cos(startRadian), Math.sin(startRadian));
        let end = new JPos(Math.cos(endRadian), Math.sin(endRadian));
        let area = this.getArea(start, end, target);
        if (area == 0) {
            return true;
        }
        return area > 0 == isCounterClockwise;
    }
    /**
     * 获取弧形真正弧度数据
     * @param this
     * @param startRadian 圆弧开始弧度
     * @param endRadian 圆弧结束弧度
     * @param isCounterClockwise 是否翻转
     */
    getArcRealRadian(startRadian, endRadian, isCounterClockwise) {
        let r = Math.PI * 2;
        /** start必须大于end */
        if (isCounterClockwise) {
            if (startRadian < endRadian) {
                startRadian += r;
            }
        }
        /** end必须大于start */
        else {
            if (endRadian < startRadian) {
                endRadian += r;
            }
        }
        return { startRadian, endRadian };
    }
    /**
     * 通过步进获取圆弧的点集合
     * @param this
     * @param arc 圆弧对象
     * @param step 步进
     */
    getArcPArrByStep(arc, step = 0.1) {
        let radianData = this.getArcRealRadian(arc.startAngle, arc.endAngle, arc.isCounterClockwise);
        let radian = radianData.endRadian - radianData.startRadian;
        if (radian < 0) {
            step *= -1;
        }
        let count = Math.floor(radian / step);
        return this._getArcPArrByStepAndCount(arc, { count, step });
    }
    /**
     * 通过个数获取圆弧的点集合
     * @param this
     * @param arc 圆弧对象
     * @param count 个数
     * @returns 返回点数组
     */
    getArcPArrByCount(arc, count) {
        let radianData = this.getArcRealRadian(arc.startAngle, arc.endAngle, arc.isCounterClockwise);
        let radian = radianData.endRadian - radianData.startRadian;
        let step = radian / count;
        return this._getArcPArrByStepAndCount(arc, { count, step });
    }
    /**
     * ! 通过步进和个数获取圆弧的点集合(不能用在开发使用,仅在此工具类内部使用)
     * @param this
     * @param arc 圆弧对象
     * @param data 个数和步进
     * @returns 返回点数组
     */
    _getArcPArrByStepAndCount(arc, data) {
        let pArr = [];
        for (let i = 0; i < data.count; i++) {
            let p = PosUtil.getRayPos(arc.center, arc.startAngle + i * data.step, arc.radius);
            pArr.push(p);
        }
        let p = PosUtil.getRayPos(arc.center, arc.endAngle, arc.radius);
        pArr.push(p);
        return pArr;
    }
    /**
     * 获取圆弧的点集合(旧的,弃用)
     * @param center 中心点
     * @param radius 半径
     * @param startAngle 起始弧度
     * @param endAngle 终止弧度
     * @param isCounterClockwise 是否逆时针(画布框架矩阵有可能会颠倒)
     * @param step 步进长度,默认0.1
     * @returns 圆弧点集合
     * @returns 返回点数组
     */
    getArcPosArr(center, radius, startAngle, endAngle, isCounterClockwise, step = 0.1) {
        let stepRadian = Math.asin(step / radius);
        let posArr = [];
        /** 求出可用的endAngle */
        if (!isCounterClockwise) {
            while (endAngle < startAngle)
                endAngle += Math.PI * 2;
        }
        else {
            while (endAngle > startAngle)
                endAngle -= Math.PI * 2;
        }
        /** 步进求点 */
        let radian = startAngle;
        let stopRadian = endAngle;
        if (!isCounterClockwise) {
            while (endAngle > startAngle) {
                posArr.push(this.getRayPos(center, radian, radius));
                radian = Math.min(stopRadian, radian + stepRadian);
                endAngle -= stepRadian;
            }
        }
        else {
            while (endAngle < startAngle) {
                posArr.push(this.getRayPos(center, radian, radius));
                radian = Math.max(stopRadian, radian - stepRadian);
                endAngle += stepRadian;
            }
        }
        return posArr;
    }
    /**
     * 通过三角点确定一个圆弧,
     * @param startP 三角起点
     * @param endP 三角终点
     * @param centerP 三角夹角点
     * @param radius 圆弧半径,过大,可能切点会脱离三点范围(看成直线)
     * @returns 标准canvas数据
     */
    getArcByTriangle(startP, endP, centerP, radius) {
        /** 夹角的一半 */
        let radian = this.getTriangleRadianByPosArr(startP, centerP, endP) / 2;
        /** 三角定理求线长度 */
        let otherDistance = radius / Math.tan(radian);
        /** 通过长度求出相切点 */
        let newStartP = this.getPosByLineDistance(centerP, startP, otherDistance);
        let newEndP = this.getPosByLineDistance(centerP, endP, otherDistance);
        /** 去起点边求出圆心 */
        let arcP = this.getRayPos(newStartP, this.getRadian(startP, centerP) + Math.PI / 2, radius);
        /** 射线求出弧度 */
        let startAngle = this.getRadian(arcP, newStartP);
        let endAngle = this.getRadian(arcP, newEndP);
        let newArc = new JArc();
        newArc.center = arcP;
        newArc.radius = radius;
        newArc.startAngle = startAngle;
        newArc.endAngle = endAngle;
        newArc.isCounterClockwise = false;
        return newArc;
    }
    /**
    * 获取圆弧夹角
    * @param obj 圆弧数据
    * @returns 夹角弧度
    */
    getArcRadian(obj) {
        let start = this.getAbsRadian(obj.startAngle, false);
        let end = this.getAbsRadian(obj.endAngle, false);
        return this.getAbsRadian(end - start, true);
    }
    /**
     * 获取圆弧的周长
     * @param obj 圆弧数据
     * @returns 圆弧周长
     */
    getArcPerimeter(obj) {
        let d = this.getArcRadian(obj);
        return obj.isCounterClockwise ?
            /* 逆时针反向相减 */
            ((2 * Math.PI) - d) * obj.radius :
            /* 顺时针直接使用 */
            d * obj.radius;
    }
    /**
    * 获取圆弧横截面积
    * @param obj
    */
    getArcCrossArea(obj) {
        /** 夹角 */
        let d = this.getArcRadian(obj);
        let area = (d / 2 - Math.sin(d) / 2) * obj.radius * obj.radius;
        return obj.isCounterClockwise ? -area : area;
    }
    /**
    * 圆弧转直线
    * @param center 圆弧圆心坐标
    * @param radius 圆弧的半径
    * @param startAngle 圆弧的起始角度,用弧度制
    * @param endAngle 圆弧的终止角度,用弧度制
    * @returns 标准线数据{start,end}
    */
    getArcToLine(center, radius, startAngle, endAngle) {
        let start = this.getRayPos(center, startAngle, radius);
        let end = this.getRayPos(center, endAngle, radius);
        return { start, end };
    }
    /**
     * 线转弧
     * @param start 线起点
     * @param end 线终点
     * @param distance 圆弧中心点的距离线的垂直高度,可为负值,圆心会不同,绝对值大于半径为大弧,小于半径为小弧
     * @returns 标准的画布弧数据
     */
    getLineToArc(start, end, distance) {
        /** 距离绝对值,用来判断顺逆时针 */
        let absDistance = Math.abs(distance);
        /** 通过距离绝对值算出半径 */
        let radius = ((this.getPowDistance(start, end) / 4) + Math.pow(distance, 2)) / (2 * absDistance);
        /** 通过两点的中心点延长求出圆心 */
        let center = this.getRayPos(this.getCenterPos(start, end), this.getRadian(start, end) + (Math.PI / 2), (radius - absDistance) * (absDistance / distance));
        /** 通过圆心求出旋转角度 */
        let startAngle = this.getRadian(center, start);
        let endAngle = this.getRadian(center, end);
        /** 第一遍通过距离和半径对比算顺逆时针 */
        let isCounterClockwise = absDistance / distance == 1 ? false : true;
        /** 第二遍通过距离正负算顺逆时针 */
        // isCounterClockwise = absDistance / distance == 1 ? isCounterClockwise : !isCounterClockwise
        // isCounterClockwise=true
        return {
            center, radius, startAngle, endAngle, isCounterClockwise
        };
    }
    /**
     * 圆弧转转角
     * @param this
     * @param arc 圆弧数据
     * @returns 返回起点,转角点,终点三个坐标
     */
    arcTransCorner(arc) {
        let start = PosUtil.getRayPos(arc.center, arc.startAngle, arc.radius);
        let end = PosUtil.getRayPos(arc.center, arc.endAngle, arc.radius);
        let startLine = [start, PosUtil.getRayPos(start, arc.startAngle + Math.PI / 2, 10)];
        let endLine = [end, PosUtil.getRayPos(end, arc.endAngle + Math.PI / 2, 10)];
        let center = PosUtil.getIntersect(startLine[0], startLine[1], endLine[0], endLine[1]);
        return { start, center, end };
    }
    /**
     * 圆弧转终点
     * @param this
     * @param arc 圆弧数据
     * @returns 返回起点,弦高点,终点
     */
    getArc3pts(arc) {
        let startAngle = arc.startAngle;
        let endAngle = arc.endAngle;
        if (endAngle < startAngle) {
            endAngle += Math.PI * 2;
        }
        let start = PosUtil.getRayPos(arc.center, startAngle, arc.radius);
        let end = PosUtil.getRayPos(arc.center, endAngle, arc.radius);
        let radian = (startAngle + endAngle) / 2;
        if (arc.isCounterClockwise) {
            radian += Math.PI;
        }
        let center = PosUtil.getRayPos(arc.center, radian, arc.radius);
        return {
            start, center, end
        };
    }
}
class PosUtil_Base {
    /**
     * 获取中心点
     * @param posArr 点集合
     * @returns 中心坐标
     */
    getCenterPos(...posArr) {
        let x = 0;
        let y = 0;
        let len = posArr.length;
        for (let i = 0; i < len; i++) {
            if (!posArr) {
                return undefined;
            }
            x += posArr[i].x;
            y += posArr[i].y;
        }
        return new JPos(x / len, y / len);
    }
    /**
     * 坐标相加
     * @param vecA 向量坐标A
     * @param vecB 向量坐标B
     * @returns x,y相加后的坐标
     */
    getAdd(vecA, vecB) {
        if (!vecA || !vecB)
            return undefined;
        return new JPos(vecA.x + vecB.x, vecA.y + vecB.y);
    }
    /**
     * 坐标相减(posA-posB)
     * @param vecA 向量坐标A
     * @param vecB 向量坐标B
     * @returns x,y相减后的坐标
     */
    getSub(vecA, vecB) {
        if (!vecA || !vecB)
            return undefined;
        return new JPos(vecA.x - vecB.x, vecA.y - vecB.y);
    }
    /**
    * 获取两点坐标平方距离(一般用来减少距离运算)
    * @param posA 坐标A
    * @param posB 坐标B
    * @returns 平方距离
    */
    getPowDistance(posA, posB) {
        if (!posA || !posB)
            return undefined;
        let powDistance = Math.pow((posB.y - posA.y), 2) + Math.pow((posB.x - posA.x), 2);
        return powDistance;
    }
    /**
    * 获取两点的距离
    * @param posA 坐标A
    * @param posB 坐标B 可为空,为空时看作单位向量
    * @param num 保留的小数位数
    * @returns 距离
    */
    getDistance(posA, posB, num) {
        if (!posA)
            return undefined;
        if (!posB)
            posB = { x: 0, y: 0 };
        let powDistance = this.getPowDistance(posA, posB);
        let distance = Math.sqrt(powDistance);
        return num == undefined ? distance : parseFloat(distance.toFixed(num));
    }
    /**
     * 获取弧度 当点坐标相同时的时候返回null
     * @param posStart 起点
     * @param posEnd 终点,可为空,空为向量
     * @param num 保留的小数位数
     * @returns 弧度值
     */
    getRadian(posStart, posEnd, num) {
        if (!posStart)
            return undefined;
        let Y = posEnd ? posEnd.y - posStart.y : posStart.y;
        let X = posEnd ? posEnd.x - posStart.x : posStart.x;
        if (Y == 0 && X == 0)
            return undefined;
        else {
            let radian = Math.atan2(Y, X);
            return num == undefined ? radian : parseFloat(radian.toFixed(num));
        }
    }
    /**
     * 求两个向量夹角
     * @param _vector1
     * @param _vector2
     * @returns 弧度
     */
    getAngleFrom2Vector(_vector1, _vector2) {
        var up = _vector1.x * _vector2.x + _vector1.y * _vector2.y;
        var down = Math.sqrt(Math.pow(_vector1.x, 2) + Math.pow(_vector1.y, 2)) * Math.sqrt(Math.pow(_vector2.x, 2) + Math.pow(_vector2.y, 2));
        var angle = Math.acos(up / down);
        return angle;
    }
    /**
     * 向量旋转特定的角度的自定义函数
     * @param _vec3 向量
     * @param _radian 旋转的弧度
     * @returns
     */
    vectorTurnRadian(_vec3, _radian) {
        let _x = _vec3.x * Math.cos(_radian) - _vec3.y * Math.sin(_radian);
        let _y = _vec3.x * Math.sin(_radian) + _vec3.y * Math.cos(_radian);
        return new JPos(_x, _y);
    }
    /**
     * 通过弧度返回向量
     * @param radian
     * @return 返回单位向量
     */
    getVectorByRadian(radian) {
        return this.getRayPos(new JPos(), radian, 1);
    }
    /**
     * 获取移动的坐标
     * @param distance 距离
     * @param radian 弧度
     * @param targetPos 需要移动的坐标,默认0,0
     * @returns 移动后的坐标
     */
    getMovePos(distance, radian, targetPos) {
        if (!targetPos)
            targetPos = { x: 0, y: 0 };
        let Y = Math.sin(radian) * distance;
        let X = Math.cos(radian) * distance;
        return new JPos(targetPos.x + X, targetPos.y + Y);
    }
    /**
     * 获取角度 当点坐标相同时的时候返回null
     * @param posStart 起点
     * @param posEnd 终点
     * @param num 保留的小数位数
     * @returns 角度值
     */
    getAngle(posStart, posEnd, isInt) {
        if (!posStart || !posEnd)
            return undefined;
        let radian = this.getRadian(posStart, posEnd);
        if (radian == null)
            return null;
        if (isInt)
            return Math.round(radian * 180 / Math.PI);
        return radian * 180 / Math.PI;
    }
    /**
    * 角度转弧度
    * @param angle 角度
    * @returns 弧度值
    */
    getRadianByAngle(angle) {
        return angle * Math.PI / 180;
    }
    /**
     * 弧度转角度
     * @param radian 弧度
     * @returns 角度值
     */
    getAngleByRadian(radian, isInt) {
        if (isInt)
            return Math.round(radian * 180 / Math.PI);
        return radian * 180 / Math.PI;
    }
    /**
     * 射线算法
     * @param pos 射线的起点
     * @param radian 射线弧度
     * @param distance 射线距离
     * @returns 射点坐标
     */
    getRayPos(pos, radian, distance) {
        return new JPos(pos.x + (distance * Math.cos(radian)), pos.y + (distance * Math.sin(radian)));
    }
    /**
     * 根据方向点和距离获取偏移点
     * @param pos 射线的起点
     * @param radianPos 在偏移方向上的点
     * @param distance 偏移距离
     * @returns 射点坐标
     */
    getOffsetPos(pos, radianPos, distance) {
        let radian = this.getRadian(pos, radianPos);
        return this.getRayPos(pos, radian, distance);
    }
    /**
    * 三角距离确定弧度(弧度为A与B夹角即c角)
    * @param startD 起始边长
    * @param endD  结束边长
    * @param centerD  夹角边长
    * @returns 夹角弧度
    */
    getTriangleRadianByDistance(startD, endD, centerD) {
        /** 获取cosC */
        let cosC = (Math.pow(startD, 2) + Math.pow(endD, 2) - Math.pow(centerD, 2)) / (2 * startD * endD);
        /** 反推cosC */
        return Math.acos(cosC);
    }
    /**
     * 三点确定弧度,只能求三角形内角
     * @param otherPA 起始坐标
     * @param otherPB 结束坐标
     * @param centerP 夹角坐标坐标
     * @returns 夹角弧度
     */
    getTriangleRadianByPosArr(otherPA, centerP, otherPB) {
        let sPow = this.getPowDistance(otherPA, centerP);
        let ePow = this.getPowDistance(otherPB, centerP);
        let cPow = this.getPowDistance(otherPA, otherPB);
        /** 获取cosC */
        let cosC = (sPow + ePow - cPow) / (2 * Math.sqrt(sPow) * Math.sqrt(ePow));
        /** 反推cosC */
        return Math.acos(cosC);
    }
    /**
    * 三线长度确定面积
    * @param distanceA 边长A
    * @param distanceB 边长B
    * @param distanceC 边长C
    * @returns 面积
    */
    getTriangleAreaByDistance(distanceA, distanceB, distanceC) {
        let p = (distanceA + distanceB + distanceC) / 2;
        let area = Math.sqrt(p * (p - distanceA) * (p - distanceB) * (p - distanceC));
        return area;
    }
    /**
     * 获取三角形面积
     * @param posA 坐标A
     * @param posB 坐标B
     * @param posC 坐标C
     * @returns 面积
     */
    getTriangleArea(posA, posB, posC) {
        let area = ((posA.x * (posB.y - posC.y)) + (posB.x * (posC.y - posA.y)) + (posC.x * (posA.y - posB.y))) / 2;
        return area;
    }
    /**
     * 获取三角形重心
     * @param posA 坐标A
     * @param posB 坐标B
     * @param posC 坐标C
     * @returns 重心坐标
     */
    getTriangleGavityPos(posA, posB, posC) {
        let x = (posA.x + posB.x + posC.x) / 3;
        let y = (posA.y + posB.y + posC.y) / 3;
        return { x: x, y: y };
    }
    /**
     * 获取通过矩阵转换的点
     * @param p 坐标
     * @param m 矩阵
     * @returns 坐标点
     */
    getTransformPos(p, m) {
        return new JPos(p.x * m[0] + p.y * m[2] + m[4], p.x * m[1] + p.y * m[3] + m[5]);
    }
    /**
     * 获取通过矩阵转换的点数组
     * @param pArr 坐标组
     * @param m 矩阵
     * @returns 坐标数组
     */
    getTransformPosArr(pArr, m) {
        let newPosArr = [];
        pArr.forEach(p => {
            newPosArr.push(this.getTransformPos(p, m));
        });
        return newPosArr;
    }
    /**
     * 获取通过逆矩阵转换的点
     * @param p 坐标
     * @param m 矩阵
     * @returns 坐标点
     */
    getInvertPos(p, m) {
        let a = [];
        MatrixUtil.invert(a, m);
        return this.getTransformPos(p, a);
    }
    /**
     * 获取通过逆矩阵转换的点
     * @param pArr 坐标组
     * @param m 矩阵
     * @returns 坐标数组
     */
    getInvertPosArr(pArr, m) {
        let newPosArr = [];
        pArr.forEach(p => {
            newPosArr.push(this.getInvertPos(p, m));
        });
        return newPosArr;
    }
    /**
     * 获取夹角,可求任意三点的内外角
     * @param posStart 起始点
     * @param posCenter 两线夹点
     * @param posEnd 结束点
     * @returns 折角弧度值
     */
    getIncludedRadian(posStart, posCenter, posEnd) {
        let start = this.getRadian(posCenter, posStart);
        let end = this.getRadian(posCenter, posEnd);
        return end - start;
    }
    /**
     * 向量标准化
     * @param vector
     */
    getNormalize(vector) {
        let len = this.getDistance(vector);
        return new JPos(vector.x / len, vector.y / len);
    }
    /**
     * 点乘
     * @param vectorA
     * @param vectorB
     */
    getMultiply(vectorA, vectorB) {
        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
    }
    /**
     * 相反
     * @param vector
     */
    getOppsite(vector) {
        return new JPos(-vector.x, -vector.y);
    }
    /**
     * 叉乘
     * @param vectorA
     * @param vectorB
     */
    getCross(vectorA, vectorB) {
        return (vectorA.x * vectorB.y) + (vectorA.x * vectorB.y);
    }
    /**
     * 投影
     * @author 不是Jeef
     * @param targetVec 需要投影的向量
     * @param otherVec 投影用的向量
     */
    getProjection(targetVec, otherVec) {
        //第一个参数是直线上的任意一个点的坐标。
        //第二个参数是直线上不同于第一个点的任意一个点的坐标。
        //第三个参数是直线外的一个点。
        //返回直线外的一个点在线段上的投影。
        var k = otherVec.y / otherVec.x;
        var pProject = { x: 0, y: 0 };
        if (k == 0) //垂线斜率不存在情况 
         {
            pProject.x = targetVec.x;
        }
        //当向量垂直的时候。
        else if (0 == otherVec.x) {
            pProject.y = targetVec.y;
        }
        else {
            pProject.x = (k * 0 + targetVec.x / k + targetVec.y - 0) / (1 / k + k);
            pProject.y = -1 / k * (pProject.x - targetVec.x) + targetVec.y;
        }
        return pProject;
    }
    /**
     *
     * @author 不是Jeef
     * @param pLine
     * @param pLine02
     * @param pOut
     */
    //第一个参数是直线上的任意一个点的坐标。
    //第二个参数是直线上不同于第一个点的任意一个点的坐标。
    //第三个参数是直线外的一个点。
    //返回直线外的一个点在线段上的投影。
    GetProjectivePoint(pLine, pLine02, pOut) {
        var k = (pLine.y - pLine02.y) / (pLine.x - pLine02.x);
        var pProject = { x: 0, y: 0 };
        if (k == 0) //垂线斜率不存在情况 
         {
            pProject.x = pOut.x;
            pProject.y = pLine.y;
        }
        //当向量垂直的时候。
        else if (pLine.x == pLine02.x) {
            pProject.x = pLine.x;
            pProject.y = pOut.y;
        }
        else {
            pProject.x = (k * pLine.x + pOut.x / k + pOut.y - pLine.y) / (1 / k + k);
            pProject.y = -1 / k * (pProject.x - pOut.x) + pOut.y;
        }
        return pProject;
    }
    /**
     * 判断两条由两点形成的直线是否相交
     * @param lineAStart 直线A起点
     * @param lineAEnd 直线A终点
     * @param lineBStart 直线B起点
     * @param lineBEnd 直线B终点
     * @returns 相交不为0, 不相交为0
     */
    isIntersect(lineAStart, lineAEnd, lineBStart, lineBEnd) {
        return (lineAEnd.x - lineAStart.x) * (lineBStart.y - lineBEnd.y) - (lineBStart.x - lineBEnd.x) * (lineAEnd.y - lineAStart.y);
    }
    /**
     * 计算两条由两点形成的线段或直线相交点
     * @param lineAStart 直线A起点
     * @param lineAEnd 直线A终点
     * @param lineBStart 直线B起点
     * @param lineBPosEnd 直线B终点
     * @param isStraight 是否为直线,默认为true
     * @returns 相交坐标 线段不相交为null
     */
    getIntersect(lineAStart, lineAEnd, lineBStart, lineBEnd, isStraight = true) {
        let p;
        let r, u;
        let delta = this.isIntersect(lineAStart, lineAEnd, lineBStart, lineBEnd);
        /** 判断是否平行 */
        if (delta != 0) {
            r = ((lineBStart.x - lineAStart.x) * (lineBStart.y - lineBEnd.y) - (lineBStart.x - lineBEnd.x) * (lineBStart.y - lineAStart.y)) / delta;
            /** 线段 */
            if (!isStraight) {
                u = ((lineAEnd.x - lineAStart.x) * (lineBStart.y - lineAStart.y) - (lineBStart.x - lineAStart.x) * (lineAEnd.y - lineAStart.y)) / delta;
                /** 判断相交点是否在线段内 */
                if ((r >= 0 && r <= 1) && (u >= 0 && u <= 1)) {
                    p = new JPos(lineAStart.x + r * (lineAEnd.x - lineAStart.x), lineAStart.y + r * (lineAEnd.y - lineAStart.y));
                }
            }
            /** 直线 */
            else {
                p = new JPos(lineAStart.x + r * (lineAEnd.x - lineAStart.x), lineAStart.y + r * (lineAEnd.y - lineAStart.y));
            }
        }
        return p;
    }
}
class PosUtil_Bezier {
    /** 1阶贝塞尔曲线公式 */
    _onebsr(t, a1, a2) {
        return a1 + (a2 - a1) * t;
    }
    /** 1阶贝塞尔
     * @param t 当前百分比
     * @param p1 起点
     * @param p2 终点
     */
    _oneBezier(t, p1, p2) {
        let x = this._onebsr(t, p1.x, p2.x);
        let y = this._onebsr(t, p1.y, p2.y);
        return new JPos(x, y);
    }
    /**
     * 2阶贝塞尔转离散点
     * @param p1 起点
     * @param p2 终点
     * @param average 均分的数量
     * @returns
     */
    getPointsByOneBezier(p1, p2, average) {
        let t = 1 / average;
        let pts = [];
        for (let i = 0; i <= average; i++) {
            let p = this._oneBezier(i * t, p1, p2);
            pts.push(p);
        }
        return pts;
    }
    /** 2阶贝塞尔曲线公式 */
    _twobsr(t, a1, a2, a3) {
        return ((1 - t) * (1 - t)) * a1 + 2 * t * (1 - t) * a2 + t * t * a3;
    }
    /**
     * 2阶贝塞尔
     * @param t 当前百分比
     * @param p1 起点
     * @param p2 终点
     * @param p3 控制点
     */
    _twoBezier(t, p1, p2, p3) {
        let x = this._twobsr(t, p1.x, p2.x, p3.x);
        let y = this._twobsr(t, p1.y, p2.y, p3.y);
        return new JPos(x, y);
    }
    /**
     * 2阶贝塞尔转离散点
     * @param p1 起点
     * @param p2 终点
     * @param p3 控制点
     * @param average 均分的数量
     * @returns
     */
    getPointsByTwoBezier(p1, p2, p3, average) {
        let t = 1 / average;
        let pts = [];
        for (let i = 0; i <= average; i++) {
            let p = this._twoBezier(i * t, p1, p2, p3);
            pts.push(p);
        }
        return pts;
    }
    /** 3阶贝塞尔曲线公式 */
    _threebsr(t, a1, a2, a3, a4) {
        return a1 * (1 - t) * (1 - t) * (1 - t) + 3 * a2 * t * (1 - t) * (1 - t) + 3 * a3 * t * t * (1 - t) + a4 * t * t * t;
    }
    /**
     * 3阶贝塞尔
     * @param t 当前百分比
     * @param p1 起点
     * @param p2 终点
     * @param p3 控制点1
     * @param p4 控制点2
     */
    _threeBezier(t, p1, p2, p3, p4) {
        let x = this._threebsr(t, p1.x, p3.x, p4.x, p2.x);
        let y = this._threebsr(t, p1.y, p3.y, p4.y, p2.y);
        return new JPos(x, y);
    }
    /**
     * 3阶贝塞尔转离散点
     * @param p1 起点
     * @param p2 终点
     * @param p3 控制点1
     * @param p4 控制点2
     * @param average 均分的数量
     * @returns
     */
    getPointsByThreeBezier(p1, p2, p3, p4, average) {
        let t = 1 / average;
        let pts = [];
        for (let i = 0; i <= average; i++) {
            let d = i * t;
            let p = this._threeBezier(d, p1, p2, p3, p4);
            pts.push(p);
        }
        return pts;
    }
    /** 圆弧转贝塞尔曲线 */
    arcToBezier(px, py, cx, cy, rx, ry, xAxisRotation = 0, largeArcFlag = 0, sweepFlag = 0) {
        const TAU = Math.PI * 2;
        const mapToEllipse = (obj, rx, ry, cosphi, sinphi, centerx, centery) => {
            let x = obj.x * rx;
            let y = obj.y * ry;
            const xp = cosphi * x - sinphi * y;
            const yp = sinphi * x + cosphi * y;
            return {
                x: xp + centerx,
                y: yp + centery
            };
        };
        const approxUnitArc = (ang1, ang2) => {
            // If 90 degree circular arc, use a constant
            // as derived from http://spencermortensen.com/articles/bezier-circle
            const a = ang2 === 1.5707963267948966
                ? 0.551915024494
                : ang2 === -1.5707963267948966
                    ? -0.551915024494
                    : 4 / 3 * Math.tan(ang2 / 4);
            const x1 = Math.cos(ang1);
            const y1 = Math.sin(ang1);
            const x2 = Math.cos(ang1 + ang2);
            const y2 = Math.sin(ang1 + ang2);
            return [
                {
                    x: x1 - y1 * a,
                    y: y1 + x1 * a
                },
                {
                    x: x2 + y2 * a,
                    y: y2 - x2 * a
                },
                {
                    x: x2,
                    y: y2
                }
            ];
        };
        const vectorAngle = (ux, uy, vx, vy) => {
            const sign = (ux * vy - uy * vx < 0) ? -1 : 1;
            let dot = ux * vx + uy * vy;
            if (dot > 1) {
                dot = 1;
            }
            if (dot < -1) {
                dot = -1;
            }
            return sign * Math.acos(dot);
        };
        const getArcCenter = (px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp) => {
            const rxsq = Math.pow(rx, 2);
            const rysq = Math.pow(ry, 2);
            const pxpsq = Math.pow(pxp, 2);
            const pypsq = Math.pow(pyp, 2);
            let radicant = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq);
            if (radicant < 0) {
                radicant = 0;
            }
            radicant /= (rxsq * pypsq) + (rysq * pxpsq);
            radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);
            const centerxp = radicant * rx / ry * pyp;
            const centeryp = radicant * -ry / rx * pxp;
            const centerx = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
            const centery = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;
            const vx1 = (pxp - centerxp) / rx;
            const vy1 = (pyp - centeryp) / ry;
            const vx2 = (-pxp - centerxp) / rx;
            const vy2 = (-pyp - centeryp) / ry;
            let ang1 = vectorAngle(1, 0, vx1, vy1);
            let ang2 = vectorAngle(vx1, vy1, vx2, vy2);
            if (sweepFlag === 0 && ang2 > 0) {
                ang2 -= TAU;
            }
            if (sweepFlag === 1 && ang2 < 0) {
                ang2 += TAU;
            }
            return [centerx, centery, ang1, ang2];
        };
        const curves = [];
        if (rx === 0 || ry === 0) {
            return [];
        }
        const sinphi = Math.sin(xAxisRotation * TAU / 360);
        const cosphi = Math.cos(xAxisRotation * TAU / 360);
        const pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
        const pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;
        if (pxp === 0 && pyp === 0) {
            return [];
        }
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        const lambda = Math.pow(pxp, 2) / Math.pow(rx, 2) +
            Math.pow(pyp, 2) / Math.pow(ry, 2);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        let [centerx, centery, ang1, ang2] = getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp);
        // If 'ang2' == 90.0000000001, then `ratio` will evaluate to
        // 1.0000000001. This causes `segments` to be greater than one, which is an
        // unecessary split, and adds extra points to the bezier curve. To alleviate
        // this issue, we round to 1.0 when the ratio is close to 1.0.
        let ratio = Math.abs(ang2) / (TAU / 4);
        if (Math.abs(1.0 - ratio) < 0.0000001) {
            ratio = 1.0;
        }
        const segments = Math.max(Math.ceil(ratio), 1);
        ang2 /= segments;
        for (let i = 0; i < segments; i++) {
            curves.push(approxUnitArc(ang1, ang2));
            ang1 += ang2;
        }
        return curves.map(curve => {
            const { x: x1, y: y1 } = mapToEllipse(curve[0], rx, ry, cosphi, sinphi, centerx, centery);
            const { x: x2, y: y2 } = mapToEllipse(curve[1], rx, ry, cosphi, sinphi, centerx, centery);
            const { x, y } = mapToEllipse(curve[2], rx, ry, cosphi, sinphi, centerx, centery);
            return { x1, y1, x2, y2, x, y };
        });
    }
}
class PosUtil_Extends {
    /**
     * 获取圆弧的的中心点
     * @param startPos 起点
     * @param endPos 结束点
     * @param r 半径
     * @returns 中心坐标,起点终点对调,会有不同的中心点,谨记!
     */
    getArcCenterPos(startPos, endPos, r) {
        /** 两点弧度 */
        let radian = this.getRadian(startPos, endPos);
        /** 两点距离 */
        let distance = this.getDistance(startPos, endPos);
        /** 两点中心点 */
        let lineCenterPos = this.getRayPos(startPos, radian, distance / 2);
        /** 垂直两点的弧度 */
        let newRadian = radian + (Math.PI / 2);
        /** 通过勾股定理求出两点的中心点到圆心的距离 */
        let newDistance = Math.sqrt(Math.pow(r, 2) - Math.pow(distance / 2, 2));
        /** 通过射线求出中心点 */
        let centerPos = this.getRayPos(lineCenterPos, newRadian, r > 0 ? newDistance : -newDistance);
        return centerPos;
    }
    /**
     * 已知斜边两点,求等腰直角的点
     * @param leftPos 左腰点
     * @param rightPos 右腰点
     * @returns 等腰直角的顶点
     */
    getIsoscelesRightAngle(leftPos, rightPos) {
        /** 获取两点的弧度 */
        let radian = this.getRadian(leftPos, rightPos);
        /** 获取两点的中点 */
        let centerPos = this.getCenterPos(leftPos, rightPos);
        /** 获取两点的距离 */
        let distance = this.getDistance(leftPos, rightPos);
        /** 中点垂直向上射出获取直角点 */
        let newPos = this.getRayPos(centerPos, radian + (Math.PI / 2), distance);
        return newPos;
    }
    /**
     * 计算两条由两点组成直线平移后相交点 lineBDistance为空时,默认为lineADistance
     * @param lineAStart 直线A的起点
     * @param lineAEnd 直线A的终点
     * @param lineBStart 直线B的起点
     * @param lineBEnd 直线B的终点
     * @param lineADistance 直线A平移距离
     * @param lineBDistance 直线B平移距离,没有将默认和A一样
     * @returns 相交的点,如果直线为相同的点,返回空
     */
    getIntersectPosByMove(lineAStart, lineAEnd, lineBStart, lineBEnd, lineADistance, lineBDistance = lineADistance) {
        /** 坐标一样无法平移,返回null */
        if (this.isSamePos(lineAStart, lineAEnd))
            return undefined;
        if (this.isSamePos(lineBStart, lineBEnd))
            return undefined;
        /** 平移后的线 */
        let moveLineA = this.getLineVerticalOffset(lineAStart, lineAEnd, lineADistance);
        let moveLineB = this.getLineVerticalOffset(lineBStart, lineBEnd, lineBDistance);
        return this.getIntersect(moveLineA[0], moveLineA[1], moveLineB[0], moveLineB[1], true);
    }
    /**
     * 获得圆与直线相交点
     * @param lineStart 直线的开头
     * @param lineEnd  直线的结尾
     * @param r  半径
     * @param centerPos 圆心
     * @returns 数组[正方向坐标,负方向坐标],没相交undefined,相切为[同坐标,同坐标]
     */
    getCircleLineIntersect(lineStart, lineEnd, r, centerPos) {
        /** 直线的弧度 */
        let radian = this.getRadian(lineStart, lineEnd);
        /** 圆心垂直直线的射线 */
        let rayPos = this.getRayPos(centerPos, radian + (Math.PI / 2), 10);
        /** 射线与直线相交 */
        let intersectPos = this.getIntersect(lineStart, lineEnd, rayPos, centerPos);
        /** 圆心与相交点的平方距离(减少运算) */
        let circleIntersectPowDistance = this.getPowDistance(centerPos, intersectPos);
        let powR = Math.pow(r, 2);
        /** 不相交 */
        if (circleIntersectPowDistance > powR)
            return undefined;
        /** 圆切 */
        if (circleIntersectPowDistance == powR)
            return [intersectPos, intersectPos];
        /* 勾股定理求出距离 */
        let distance = Math.sqrt(powR - circleIntersectPowDistance);
        /* 射线求出相应的点 */
        return [this.getRayPos(intersectPos, radian, distance), this.getRayPos(intersectPos, radian, -distance)];
    }
    /**
     * 获得线段与弧线离起最近的相交点，
     * @param lineStart 直线的开头
     * @param lineEnd  直线的结尾
     * @param arcStart  弧点
     * @param startAngle  起始角度
     * @param angle  旋转角度
     * @param r  半径
     * @returns pos
     */
    getLineArcIntersect(lineStart, lineEnd, arcStart, startAngle, r) {
        //圆心
        let centerPos = this.getRayPos(arcStart, Math.PI - this.getRadianByAngle(startAngle), r);
        let [p1, p2] = this.getCircleLineIntersect(lineStart, lineEnd, r, centerPos);
        //离起点最近的交点
        return (this.getDistance(lineStart, p1) < this.getDistance(lineStart, p2) ? p1 : p2);
    }
    /**
     * 根据新的圆上的点和当前弧线获得新的弧线，
     * @param newPoint 圆上的任意点
     * @param arcStart 原弧点
     * @param startAngle  起始角度
     * @param angle  旋转角度
     * @param r  半径
     * @param isStart  是否用任意点当起点
     */
    getArcByNewPoint(newPoint, arcStart, startAngle, angle, r, isStart = true) {
        //圆心
        let centerPos = this.getRayPos(arcStart, Math.PI - this.getRadianByAngle(startAngle), r);
        //和原点的夹角
        let deltaAngle = this.getAngleByRadian(this.getIncludedRadian(arcStart, centerPos, newPoint));
        //新的旋转角度
        let newAngel;
        if (isStart) {
            newAngel = (angle > 0 ? (angle - deltaAngle + 360) : (angle - deltaAngle - 360)) % 360;
        }
        else {
            newAngel = (-deltaAngle + (angle > 0 ? 360 : -360)) % 360;
        }
        //新的起始角度
        let newStartAngle = (isStart ? (startAngle - deltaAngle) : (startAngle)) % 360;
        return { x: isStart ? newPoint.x : arcStart.x, y: isStart ? newPoint.y : arcStart.y, startAngle: newStartAngle, angle: newAngel, radius: r };
    }
    /**
     * 圆圆相交
     * @param mainR 主要圆半径
     * @param mainCenter 主要圆点坐标
     * @param otherR 辅助相切圆半径
     * @param otherCenter 辅助相切圆点坐标
     * @param errValue 误差值
     * @returns 数组[正方向坐标,负方向坐标],没相交undefined,相切为[同坐标,同坐标],重叠为[undefined,undefined]
     */
    getCircleCircleIntersect(mainR, mainCenter, otherR, otherCenter, errValue = 0) {
        /** 俩中心点形成的距离 */
        let distance = this.getDistance(mainCenter, otherCenter);
        /** 重叠 */
        if (distance <= errValue) {
            return [undefined, undefined];
        }
        /** 不相交 */
        if (distance > mainR + otherR)
            return undefined;
        /** 相切 */
        if (distance == mainR + otherR) {
            let interPos = this.getCenterPos(mainCenter, otherCenter);
            return [interPos, interPos];
        }
        /** 俩中心点形成的弧度 */
        let radian = this.getRadian(mainCenter, otherCenter);
        /** 三边确定夹角弧度 */
        let newRadian = this.getTriangleRadianByDistance(mainR, distance, otherR);
        /** 通过射线求出切割点 */
        return [this.getRayPos(mainCenter, radian + newRadian, mainR), this.getRayPos(mainCenter, radian - newRadian, mainR)];
    }
    /**
     * 获取两点的沿同个弧度方向的距离
     * @param posA 点A
     * @param posB 点B
     * @param radian 弧度方向
     * @param isAbs 是否有正负值
     * @returns 距离
     */
    getTwoPosRadianDistance(posA, posB, radian, isAbs = true) {
        /** 公共线 */
        let line = [{ x: 0, y: 0 }];
        line = [line[0], this.getRayPos(line[0], radian, 10)];
        /** 获取点在公共线垂直相交点 */
        let newPosA = this.getRightAngleIntersect(posA, line[0], line[1]);
        let newPosB = this.getRightAngleIntersect(posB, line[0], line[1]);
        /** 两点在公共线上的距离 */
        let distance = this.getDistance(newPosA, newPosB);
        if (isAbs)
            return distance;
        /** 向量点乘判断方向是否一致 */
        return this.isSameDirection(line[0], line[1], newPosA, newPosB) > 0 ? distance : distance * -1;
    }
    /**
     * 判断线段集合和线段集合是否存在相交情况
     * @param targetPosArr 目标线段集合
     * @param isTargetClose 目标线段集合是否闭合(看作多边形)
     * @param otherPosArr 其他线段集合
     * @param isOtherClose 其他线段集合是否闭合(看作多边形)
     * @param isIncludePoint 是否包括点重合也认为相交,默认false
     * @returns 只要有相交就true,否则false
     */
    isLinesCrossLines(targetPosArr, isTargetClose, otherPosArr, isOtherClose, isIncludePoint) {
        if (targetPosArr.length < 2 || otherPosArr.length < 2)
            return false;
        let func = (targetA, targetB) => {
            for (let o = 1; o < otherPosArr.length; o++) {
                let check = this.isLineCrossLine(targetA, targetB, otherPosArr[o - 1], otherPosArr[o]);
                if (isIncludePoint) {
                    if (check)
                        return true;
                }
                else {
                    if (check == 1) {
                        return true;
                    }
                }
            }
            if (isOtherClose && otherPosArr.length > 2) {
                let check = this.isLineCrossLine(targetA, targetB, otherPosArr[0], otherPosArr[otherPosArr.length - 1]);
                if (isIncludePoint) {
                    if (check)
                        return true;
                }
                else {
                    if (check == 1) {
                        return true;
                    }
                }
            }
            return false;
        };
        for (let t = 1; t < targetPosArr.length; t++) {
            if (func(targetPosArr[t], targetPosArr[t - 1]))
                return true;
        }
        if (isTargetClose && targetPosArr.length > 2)
            return func(targetPosArr[0], targetPosArr[targetPosArr.length - 1]);
        return false;
    }
    /**
     * 点集合是否在图形里面
     * @param posArr 点坐标集合
     * @param geo 图形坐标集合
     * @param isAbsInclude 是否完全包括(不完全包括可以理解为只要有个点在里面都为true),默认false
     * @returns 是否在里面
     */
    isPosArrInGeo(posArr, geo, isAbsInclude) {
        if (posArr.length == 0)
            return false;
        /** 不完全包括 */
        if (!isAbsInclude) {
            for (let i = 0; i < posArr.length; i++) {
                if (this.isPosInGeo(posArr[i], geo))
                    return true;
            }
            return false;
        }
        /** 完全包括 */
        for (let i = 0; i < posArr.length; i++) {
            if (!this.isPosInGeo(posArr[i], geo))
                return false;
        }
        return true;
    }
    /**
     * 图形是否在当前图形里
     * @param targetGeo 目标图形
     * @param otherGeo 当前图形
     * @param isAbsInclude 是否完全包括(不完全包括可以理解为允许切割),默认false
     * @param isOppsite 是否需要判断反向框选(不完全包围才有效),默认false
     * @returns 是否在里面
     */
    isGeoInGeo(targetGeo, otherGeo, isAbsInclude, isOppsite) {
        /** 完全包括 */
        if (isAbsInclude) {
            return this.isPosArrInGeo(targetGeo, otherGeo, isAbsInclude);
        }
        else if (this.isPosArrInGeo(targetGeo, otherGeo, false)) {
            return true;
        }
        /** 不完全包括 */
        /** 是否需要判断反向框选 */
        if (isOppsite && this.isPosArrInGeo(otherGeo, targetGeo, false)) {
            return true;
        }
        return this.isLinesCrossLines(targetGeo, true, otherGeo, true);
    }
    /**
     * 获取多边形周长
     * @param objs 多边形数据
     * @param isNoClose 是否闭合
     * @returns 周长
     */
    getPolygonPerimeter(objs, isNoClose) {
        let len = 0;
        let start;
        let last;
        objs.forEach(obj => {
            /* 圆弧 */
            if (obj["center"]) {
                obj = obj;
                let p = this.getRayPos(obj.center, obj.startAngle, obj.radius);
                if (!start) {
                    start = p;
                }
                else {
                    len += this.getDistance(last, p);
                }
                len += this.getArcPerimeter(obj);
                last = this.getRayPos(obj.center, obj.endAngle, obj.radius);
            }
            /* 点 */
            else {
                obj = obj;
                if (!start) {
                    start = obj;
                }
                else {
                    len += this.getDistance(last, obj);
                }
                last = obj;
            }
        });
        if (!isNoClose)
            len += this.getDistance(start, last);
        return len;
    }
    /**
     * 获取多边形面积
     * @param objs 多边形数据
     * @returns 面积
     */
    getPolygonArea(objs) {
        let area = 0;
        let first;
        let last;
        for (let i = 0; i < objs.length; i++) {
            /** 圆弧 */
            if (objs[i]["center"]) {
                let obj = objs[i];
                let startP = this.getRayPos(obj.center, obj.startAngle, obj.radius);
                let endP = this.getRayPos(obj.center, obj.endAngle, obj.radius);
                /* 获取圆弧横截面积 */
                area += this.getArcCrossArea(obj);
                if (!first) {
                    first = startP;
                }
                /* 获取圆弧三角面积 */
                if (last)
                    area += this.getTriangleArea(first, last, endP);
                last = endP;
            }
            else {
                let obj = objs[i];
                if (!first) {
                    first = obj;
                    continue;
                }
                else if (!last) {
                    last = obj;
                    continue;
                }
                /** 一般要到第三个才能开始有面积 */
                area += this.getTriangleArea(first, last, obj);
                last = obj;
            }
        }
        return area;
    }
    /**
     * 未完成,请不要使用
     * @param this
     * @param p
     * @param objs
     */
    isPosInArcLineArr(p, objs) {
        let area = 0;
        let last;
        for (let i = 0; i < objs.length; i++) {
            /** 圆弧 */
            if (objs[i]["center"]) {
                let obj = objs[i];
                let startP = this.getRayPos(obj.center, obj.startAngle, obj.radius);
                let endP = this.getRayPos(obj.center, obj.endAngle, obj.radius);
                /* 获取圆弧横截面积 */
                area += this.getArcCrossArea(obj);
                if (!last) {
                    last = startP;
                }
                area += this.getTriangleArea(p, last, startP);
                /* 获取圆弧三角面积 */
                if (last)
                    area += this.getTriangleArea(p, startP, endP);
                last = endP;
            }
            else {
                let obj = objs[i];
                if (!last) {
                    last = obj;
                    continue;
                }
                /** 一般要到第三个才能开始有面积 */
                area += this.getTriangleArea(p, last, obj);
                last = obj;
            }
        }
        if (area > 0)
            return false;
        return true;
    }
    /**
     * 未完成,请不要使用
     * @param this
     * @param radian
     * @param delta
     */
    getDeltaDistance(radian, delta) {
        /** 模拟的向量点 */
        let p = { x: Math.cos(radian), y: Math.sin(radian) };
        /** 投影 */
        let projection = this.getRightAngleIntersect(delta, { x: 0, y: 0 }, p);
        // let projection = this.getProjection(delta, p)
        // let projection = this.GetProjectivePoint({ x: 0, y: 0 }, p, delta)
        /** 算距离 */
        let distance = this.getDistance(projection);
        /** 点乘判断正负 */
        return this.getMultiply(p, projection) > 0 ? distance : -distance;
    }
    /**
     * 画布圆弧转svg圆弧
     * @param canvasArc 画布圆弧对象
     * @return svg圆弧对象
     */
    canvasArcTransSvgArc(canvasArc) {
        let start = PosUtil.getRayPos(canvasArc.center, canvasArc.startAngle, canvasArc.radius);
        let end = PosUtil.getRayPos(canvasArc.center, canvasArc.endAngle, canvasArc.radius);
        if (canvasArc.endAngle < canvasArc.startAngle)
            canvasArc.endAngle += Math.PI * 2;
        let radian = canvasArc.endAngle - canvasArc.startAngle;
        let largeArc = true;
        if (Math.abs(radian) > Math.PI * 2) {
            largeArc = false;
            end = start;
        }
        else if (Math.abs(radian) > Math.PI) {
            largeArc = false;
        }
        if (!canvasArc.isCounterClockwise)
            largeArc = !largeArc;
        let svgArc = new JSvgArc(start.x, start.y, canvasArc.radius, canvasArc.radius, largeArc ? 1 : 0, canvasArc.isCounterClockwise ? 0 : 1, end.x, end.y);
        return svgArc;
    }
    /**
     * 未完成,请不要使用
     * @param this
     * @param svgArc
     */
    svgArcTransCanvasArc(svgArc) {
        let canvasArc = new JArc();
        canvasArc.isCounterClockwise = svgArc.sweepFlag == 0 ? true : false;
        canvasArc.radius = svgArc.rx;
        let sp = new JPos(svgArc.sx, svgArc.sy);
        let ep = new JPos(svgArc.ex, svgArc.ey);
        let powD = this.getPowDistance(sp, ep);
        let d = Math.sqrt(Math.pow(svgArc.rx, 2) - powD / 4);
        let radian = this.getRadian(sp, ep);
        let a = (canvasArc.isCounterClockwise ? -1 : 1) * Math.PI / 2;
        if (svgArc.largeArcFlag)
            a *= -1;
        canvasArc.center = this.getRayPos(this.getCenterPos(sp, ep), radian + a, d);
        canvasArc.startAngle = this.getRadian(canvasArc.center, sp);
        canvasArc.endAngle = this.getRadian(canvasArc.center, ep);
        return canvasArc;
    }
    /**
     * 通过包围碰撞盒集合获取大的包围碰撞盒
     * @param this
     * @param hitBoxes
     */
    getHitBoxByHitBoxes(...hitBoxes) {
        if (!hitBoxes || hitBoxes.length == 0)
            return undefined;
        let maxX = undefined;
        let maxY = undefined;
        let minX = undefined;
        let minY = undefined;
        hitBoxes.forEach(hitBox => {
            if (!hitBox)
                return;
            if (minX == undefined || minX > hitBox.p.x)
                minX = hitBox.p.x;
            if (minY == undefined || minY > hitBox.p.y)
                minY = hitBox.p.y;
            let w = hitBox.p.x + hitBox.w;
            if (maxX == undefined || maxX < w)
                maxX = w;
            let h = hitBox.p.y + hitBox.h;
            if (maxY == undefined || maxY < h)
                maxY = h;
        });
        if (maxX == undefined)
            return undefined;
        return this.getHitBox([{ x: minX, y: minY }, { x: maxX, y: maxY }]);
    }
    /**
     * 获取居中旋转的矩阵
     * @param obj 旋转所需要的对象
     * @returns 矩阵number[]
     */
    getCenterRotateTransform(obj) {
        let m = [1, 0, 0, 1, obj.orginP.x, obj.orginP.y];
        if (!obj.relateCenter) {
            obj.relateCenter = new JPos((obj.w || 0) / 2, (obj.h || 0) / 2);
        }
        MatrixUtil.translate(m, m, [obj.relateCenter.x, obj.relateCenter.y]);
        MatrixUtil.rotate(m, m, obj.radian);
        MatrixUtil.translate(m, m, [-obj.relateCenter.x, -obj.relateCenter.y]);
        return m;
    }
}
class PosUtil_Geo {
    /**
        * 获取面积(通过三角面积公式)
        * @param posArr 坐标点集合
        * @returns 面积值
        */
    getArea(...posArr) {
        let area = 0;
        /** 至少要构成三角形 */
        if (posArr.length < 3) {
            return 0;
        }
        /** 通过三角面积公式不断累加 */
        else {
            for (let i = 1; i < posArr.length - 1; i++) {
                let newArea = this.getTriangleArea(posArr[0], posArr[i], posArr[i + 1]);
                area += newArea;
            }
            return area;
        }
    }
    /**
     * 获取旋转点坐标 绕中心点旋转
     * @param centerPos 围绕的中心点
     * @param targetPos 目标点
     * @param radian 旋转的弧度
     * @returns 旋转后的点
     */
    getRotatePos(centerPos, targetPos, radian) {
        /** x1=x cosB-y sinB ; y1=x sinB+ y cosB */
        let newPos = {
            x: ((targetPos.x - centerPos.x) * Math.cos(radian)) - ((targetPos.y - centerPos.y) * Math.sin(radian)) + centerPos.x,
            y: ((targetPos.x - centerPos.x) * Math.sin(radian)) + ((targetPos.y - centerPos.y) * Math.cos(radian)) + centerPos.y
        };
        return newPos;
    }
    /**
     * 获取旋转点坐标组 绕中心点旋转
     * @param centerPos 围绕的中心点
     * @param targetPosArr 目标点集合
     * @param radian 旋转的弧度
     * @returns 旋转后的点数组
     */
    getRotatePosArr(centerPos, targetPosArr, radian) {
        let newPosArr = [];
        targetPosArr.forEach(p => {
            newPosArr.push(this.getRotatePos(centerPos, p, radian));
        });
        return newPosArr;
    }
    /**
     * 获取角度拨正值
     * @param angle 角度
     * @param isAbs 绝对正,得到值必为为正,否则一半180,一半180,默认fasle
     * @returns 角度值
     */
    getAbsAngle(angle, isAbs = false, isInt) {
        if (!isAbs) {
            while (angle < -180) {
                angle = angle + 360;
            }
            while (angle > 180) {
                angle = angle - 360;
            }
        }
        else {
            while (angle < 0) {
                angle = angle + 360;
            }
            while (angle > 360) {
                angle = angle - 360;
            }
        }
        if (isInt)
            return Math.round(angle);
        return angle;
    }
    /**
     * 获取弧度拨正值
     * @param radian 弧度
     * @param isAbs 绝对正,得到值必为为正(0~360),否则一半正180,一半负180,默认false
     * @returns 弧度值
     */
    getAbsRadian(radian, isAbs = false) {
        /* 一半正一半负 */
        if (!isAbs) {
            while (radian < -Math.PI) {
                radian = radian + (Math.PI * 2);
            }
            while (radian > Math.PI) {
                radian = radian - (Math.PI * 2);
            }
            return radian;
        }
        /* 绝对正 */
        else {
            while (radian < 0) {
                radian = radian + (Math.PI * 2);
            }
            while (radian > (Math.PI * 2)) {
                radian = radian - (Math.PI * 2);
            }
        }
        return radian;
    }
    /**
     * 获取坐标组中最大最小坐标
     * @param posArr 坐标数组
     * @returns  数组[max,min]
     */
    getLimitPosArr(...posArr) {
        let maxX = posArr[0].x, maxY = posArr[0].y, minX = posArr[0].x, minY = posArr[0].y;
        let pos = null;
        for (pos of posArr) {
            if (pos.x > maxX)
                maxX = pos.x;
            if (pos.x < minX)
                minX = pos.x;
            if (pos.y > maxY)
                maxY = pos.y;
            if (pos.y < minY)
                minY = pos.y;
        }
        return [new JPos(maxX, maxY), new JPos(minX, minY)];
    }
    /**
     * 两点获取矩形 顺序的话如果是左上的坐标轴由左上向右递归
     * @param firstPos 第一个点坐标
     * @param lastPos 对角点坐标
     * @returns 数组[p1,p2,p3,p4]
     */
    getRectByTwoPos(firstPos, lastPos) {
        let posArr = [];
        let maxX = firstPos.x > lastPos.x ? firstPos.x : lastPos.x;
        let minX = firstPos.x > lastPos.x ? lastPos.x : firstPos.x;
        let maxY = firstPos.y > lastPos.y ? firstPos.y : lastPos.y;
        let minY = firstPos.y > lastPos.y ? lastPos.y : firstPos.y;
        posArr = [new JPos(minX, minY), new JPos(maxX, maxY)];
        let posA = new JPos(posArr[1].x, posArr[0].y);
        let posB = new JPos(posArr[0].x, posArr[1].y);
        let newPosArr = [posArr[0], posA, posArr[1], posB];
        return newPosArr;
    }
    /**
     * 获取带圆弧的矩形的数据信息
     * @param startP 起点
     * @param w 宽度
     * @param h 高度
     * @param rx 圆弧x半径
     * @param ry 圆弧y半径,暂不开放
     */
    getRectArcData(startP, w, h, rx, ry) {
        let arcFunc = (p, coorX, coorY) => {
            let center = new JPos(p.x - rx * coorX, p.y - rx * coorY);
            let a = coorX * coorY;
            let end = a == 1 ? new JPos(center.x, p.y) : new JPos(p.x, center.y);
            let start = a == 1 ? new JPos(p.x, center.y) : new JPos(center.x, p.y);
            let endAngle = a == 1 ? Math.PI / 2 * coorX : coorX == 1 ? 0 : -Math.PI;
            let startAngle = a == 1 ? (coorX == 1 ? 0 : -Math.PI) : Math.PI / 2 * coorY;
            let arc = new JArc();
            arc.center = center;
            arc.startAngle = startAngle;
            arc.endAngle = endAngle;
            // let tempAngle=
            arc.radius = rx;
            arc.isCounterClockwise = false;
            return {
                arc, start, end
            };
        };
        let rect = this.getRectByTwoPos(startP, new JPos(startP.x + w, startP.y + h));
        let arcList = [arcFunc(rect[0], -1, -1), arcFunc(rect[1], 1, -1), arcFunc(rect[2], 1, 1), arcFunc(rect[3], -1, 1)];
        return arcList;
    }
    /**
     * 坐标是否相同
     * @param posA 坐标A
     * @param posB 坐标B
     * @param errorValue 误差值,默认0.0001
     * @returns 是否相同
     */
    isSamePos(posA, posB, errorValue = 0.0001) {
        if (posA == null || posB == null)
            return false;
        if (posA == posB)
            return true;
        if ((posA.x + errorValue >= posB.x && posA.x - errorValue <= posB.x) && (posA.y + errorValue >= posB.y && posA.y - errorValue <= posB.y))
            return true;
        return false;
    }
    /**
     * 弧度是否相同(先调整弧度为正常值再比较)
     * @param radianA 弧度A
     * @param radianB 弧度B
     * @param errorValue 误差值,默认0.0001
     * @returns 是否相同
     */
    isSameRadian(radianA, radianB, errorValue = 0.0001) {
        let a = this.getAbsRadian(radianA, true);
        let b = this.getAbsRadian(radianB, true);
        if (a > b - errorValue && a < b + errorValue) {
            return true;
        }
        return false;
    }
    /**
     * 移动坐标集合
     * @param deltaPos 偏移的坐标
     * @param posArr 坐标集合
     * @returns 新的坐标集合
     */
    translate(deltaPos, posArr) {
        let newPosArr = [];
        posArr.forEach(p => {
            let newPos = this.getAdd(deltaPos, p);
            newPosArr.push(newPos);
        });
        return newPosArr;
    }
    /**
     * 坐标是否在当前图形里
     * @param pos 当前坐标
     * @param geo 图形坐标集合(有序)
     * @returns 0代表在外面,1代表在里面,-1代表在线上
     */
    old_isPosInGeo(pos, geo) {
        if (geo.length == 0)
            return 0;
        /** 获取极限坐标组 */
        let limit = this.getLimitPosArr(...geo);
        /** 如果不能通过直接false */
        if (pos.x < limit[1].x || pos.x > limit[0].x || pos.y < limit[1].y || pos.y > limit[0].y) {
            return 0;
        }
        let a = 1;
        if (pos.x == limit[1].x || pos.x == limit[0].x || pos.y == limit[1].y || pos.y == limit[0].y) {
            a = -1;
        }
        let check = false;
        /** 公式运算 */
        let len = geo.length;
        let j;
        for (let i = 0; i < len; i++) {
            j = i == 0 ? len - 1 : i - 1;
            if (((geo[i].y > pos.y) != (geo[j].y > pos.y)) &&
                (pos.x < (geo[j].x - geo[i].x) * (pos.y - geo[i].y) / (geo[j].y - geo[i].y) + geo[i].x))
                check = !check;
        }
        if (check) {
            return a;
        }
        return 0;
    }
    /**
     * 坐标是否在当前图形里
     * @param pos 当前坐标
     * @param geo 图形坐标集合(有序)
     * @param errorVal 误差值,增加误差值会带来计算负担,不是需求请不要填
     * @returns 0代表在外面,1代表在里面,-1代表在线上
     */
    isPosInGeo(pos, geo, errorVal) {
        //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
        //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
        //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。
        var N = geo.length;
        if (N == 0) {
            return 0;
        }
        /**  如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true */
        var boundOrVertex = -1; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        /** cross points count of x  */
        var intersectCount = 0; //cross points count of x 
        /** 浮点类型计算时候与0比较时候的容差 */
        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        /** neighbour bound vertices */
        var p1, p2; //neighbour bound vertices
        /** 测试点 */
        var p = pos; //测试点
        /** 是否同轴,用来判断是否在线上 */
        var sameAxis = false;
        // /** 用来作误差判断 */
        // let errorCheck = false
        p1 = geo[0]; //left vertex        
        // sameAxis = p1.x == p.x || p1.y == p.y
        for (var i = 1; i <= N; ++i) { //check all rays 
            // 在点上       
            if (p.x == p1.x && p.y == p1.y) {
                return boundOrVertex; //p is an vertex
            }
            p2 = geo[i % N]; //right vertex 
            if (errorVal != undefined && this.isInLine(p1, p2, p, errorVal) != undefined) {
                return boundOrVertex;
            }
            // if (!sameAxis) {
            //     sameAxis = p2.x == p.x || p2.y == p.y
            // }
            let minY = Math.min(p1.y, p2.y);
            let maxY = Math.max(p1.y, p2.y);
            // 不在范围内,跳过         
            if (p.y < minY || p.y > maxY) { //ray is outside of our interests                
                p1 = p2;
                continue; //next ray left point
            }
            if (p.y > minY && p.y < maxY) { //ray is crossing over by the algorithm (common part of)
                if (p.x <= Math.max(p1.x, p2.x)) { //x is before of ray    
                    // 水平线且在线上                
                    if (errorVal == undefined && p1.y == p2.y && p.x >= Math.min(p1.x, p2.x)) { //overlies on a horizontal ray
                        return boundOrVertex;
                    }
                    if (p1.x == p2.x) { //ray is vertical          
                        // 垂线且在线上            
                        if (errorVal == undefined && p1.x == p.x) { //overlies on a vertical ray
                            return boundOrVertex;
                        }
                        else { //before ray
                            ++intersectCount;
                        }
                    }
                    else { //cross point on the left side                        
                        var xinters = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x; //cross point of x 
                        // 斜线且在线上
                        if (errorVal == undefined && Math.abs(p.x - xinters) < precision) { //overlies on a ray
                            return boundOrVertex;
                        }
                        if (p.x < xinters) { //before ray
                            ++intersectCount;
                        }
                    }
                }
            }
            else { //special case when ray is crossing through the vertex      
                if (p.y != p2.y) {
                    p1 = p2; //next ray left point
                    continue;
                }
                // 水平线且在线上
                if (!sameAxis && p1.y == p2.y) {
                    sameAxis = true;
                }
                if (p.x <= p2.x) { //p crossing over p2  
                    var p3 = geo[(i + 1) % N]; //next vertex                    
                    if (p.y >= Math.min(p1.y, p3.y) && p.y <= Math.max(p1.y, p3.y)) { //p.y lies between p1.y & p3.y
                        ++intersectCount;
                    }
                    else {
                        intersectCount += 2;
                    }
                }
            }
            p1 = p2; //next ray left point
        }
        if (intersectCount % 2 == 0) { //偶数在多边形外
            return 0;
        }
        else { //奇数在多边形内
            return sameAxis ? -1 : 1;
        }
    }
    /**
     * 获取包围盒
     * @param posArr 坐标集合
     * @returns 对象{起点,宽,高,终点}
     */
    getHitBox(posArr) {
        let maxX = undefined;
        let maxY = undefined;
        let minX = undefined;
        let minY = undefined;
        posArr.forEach(pos => {
            if (maxX == undefined || maxX < pos.x)
                maxX = pos.x;
            if (maxY == undefined || maxY < pos.y)
                maxY = pos.y;
            if (minX == undefined || minX > pos.x)
                minX = pos.x;
            if (minY == undefined || minY > pos.y)
                minY = pos.y;
        });
        return { p: new JPos(minX, minY), w: maxX - minX, h: maxY - minY, maxP: new JPos(maxX, maxY) };
    }
    /**
     * 获取闭合图形之间的关系
     * @param this
     * @param targetGeo
     * @param otherGeo
     * @returns 不相交为0,包括为1,被包括为-1,存在点在闭合图形为2,闭合图形没有点存在但有切割为-2
     */
    getGeoGeoRelation(targetGeo, otherGeo) {
        let check = this.isPosArrInGeo(otherGeo, targetGeo, true);
        if (check) {
            return 1;
        }
        check = this.isPosArrInGeo(targetGeo, otherGeo, true);
        if (check) {
            return -1;
        }
        check = this.isPosArrInGeo(otherGeo, targetGeo, false);
        if (check) {
            return 2;
        }
        check = this.isLinesCrossLines(targetGeo, true, otherGeo, true);
        if (check) {
            return -2;
        }
        return 0;
    }
    /**
     * 获取两个矩形的关系
     * @param startRect
     * @param endRect
     * @param toFixed 四舍五入小数位,默认为-1,不四舍五入
     * @returns same 完全一致;inInclude endRect包含startRect;outInclude startRect包含endRect;noShip 没有任何相交;halfInclude 互相相交且至少一方包含对方部分的点;onlyCut 互相相交且彼此没包含对方的任意点;onePint 仅有一点重合且不包含不相交;near 仅相切且不包含不相交
     */
    getTwoRectRelationship(startRect, endRect, toFixed = -1) {
        if (toFixed >= 0) {
            startRect = startRect.map(p => {
                return new JPos(Number(p.x.toFixed(toFixed)), Number(p.y.toFixed(toFixed)));
            });
            endRect = endRect.map(p => {
                return new JPos(Number(p.x.toFixed(toFixed)), Number(p.y.toFixed(toFixed)));
            });
        }
        /** 第一个矩形的点在第二个矩形里的个数 */
        let startPIndex = 0;
        /** 第一个矩形与第二个矩形重合线的个数 */
        let startLineIndex = 0;
        /** 第一个矩形与第二个矩形重合点的个数 */
        let startSameIndex = 0;
        startRect.forEach((p) => {
            let index = endRect.findIndex(endP => {
                return this.isSamePos(p, endP, 0);
            });
            if (index != -1) {
                startSameIndex++;
                return;
            }
            let check = this.isPosInGeo(p, endRect);
            if (check == 1) {
                startPIndex++;
            }
            else if (check == -1) {
                startLineIndex++;
            }
        });
        // 完全重合
        if (startSameIndex == 4) {
            return "same";
        }
        /** 第一个矩形所有重叠情况的个数 */
        let startIndex = startPIndex + startLineIndex + startSameIndex;
        // 4点都在里面
        if (startIndex == 4) {
            return "inInclude";
        }
        // 至少有一点在对方里面
        if (startPIndex > 0) {
            return "halfInclude";
        }
        /** 第二个矩形的点在第一个矩形里的个数 */
        let endPIndex = 0;
        /** 第二个矩形与第一个矩形重合线的个数 */
        let endLineIndex = 0;
        /** 第二个矩形与第一个矩形重合点的个数 */
        let endSameIndex = 0;
        endRect.forEach(p => {
            let index = startRect.findIndex(startP => {
                return this.isSamePos(p, startP, 0);
            });
            if (index != -1) {
                endSameIndex++;
                return;
            }
            let check = this.isPosInGeo(p, startRect);
            if (check == 1) {
                endPIndex++;
            }
            else if (check == -1) {
                endLineIndex++;
            }
        });
        /** 第二个矩形所有重叠情况的个数 */
        let endIndex = endPIndex + endLineIndex + endSameIndex;
        // 4点都在里面
        if (endIndex == 4) {
            return "outInclude";
        }
        // 至少有一点在对方里面
        if (endPIndex > 0) {
            return "halfInclude";
        }
        // 没有任何点在彼此里面
        if (startPIndex == 0 && endPIndex == 0) {
            // 如果有两个点重合,则有可能是刚好相切
            if (startSameIndex == 2 || startLineIndex || endLineIndex) {
                /** 第一个矩形的极限 */
                let startLimit = this.getLimitPosArr(...startRect);
                /** 第二个矩形的极限 */
                let endLimit = this.getLimitPosArr(...endRect);
                /** 两个矩形的极限 */
                let bigLimit = this.getLimitPosArr(...startRect, ...endRect);
                let bigL = (bigLimit[0].x - bigLimit[1].x);
                let bigH = (bigLimit[0].y - bigLimit[1].y);
                let startL = (startLimit[0].x - startLimit[1].x);
                let startH = (startLimit[0].y - startLimit[1].y);
                let endL = (endLimit[0].x - endLimit[1].x);
                let endH = (endLimit[0].y - endLimit[1].y);
                // 如果两个矩形的极限宽等于所有的极限宽且所有极限高必须比叠加小(大的话,就是远离了),则可以认为是相切
                if ((bigL == startL + endL) && bigH <= startH + endH) {
                    return "near";
                }
                // 如果两个矩形的极限高等于所有的极限高且所有极限宽必须比叠加小(大的话,就是远离了),则可以认为是相切
                else if ((bigH == startH + endH) && bigL <= startL + endL) {
                    return "near";
                }
            }
            let check = this.isLinesCrossLines(startRect, true, endRect, true);
            // 纯粹相交
            if (check) {
                return "onlyCut";
            }
            // 有一个点在对方的点上且没线切,既可以判定仅单点重合
            if (startPIndex == 0 && startLineIndex == 0 && startSameIndex == 1 && endLineIndex == 0) {
                return "onePoint";
            }
            // 连相交都没有,直接判定没关系
            return "noShip";
        }
        // 有一个点在对方的点上且没线切,既可以判定仅单点重合
        if (startPIndex == 0 && startLineIndex == 0 && startSameIndex == 1 && endLineIndex == 0) {
            return "onePoint";
        }
        // 只要有一个线切就可以判定线切了
        if (startPIndex == 0 && endPIndex == 0 && (startLineIndex > 0 || endLineIndex > 0)) {
            return "near";
        }
        /** 两点重合意味着也是线切 */
        if (startSameIndex == 2) {
            return "near";
        }
        // 如果什么都没有,还来到这步,就是什么关系都没有了
        return "noShip";
        // let startBox = this.getHitBox(startRect)
        // let startArr = [startBox.p, new JPos(startBox.p.x, startBox.maxP.y), startBox.maxP, new JPos(startBox.maxP.x, startBox.p.y)]
        // let endBox = this.getHitBox(endRect)
        // let endArr = [endBox.p, new JPos(endBox.p.x, endBox.maxP.y), endBox.maxP, new JPos(endBox.maxP.x, endBox.p.y)]
    }
}
class PosUtil_Line {
    /**
     * 根据长度获取直线上的一点
     * @param lineStart 线段起点
     * @param lineEnd 线段终点
     * @param distance 要去的线段长度
     * @returns 线上坐标
     */
    getPosByLineDistance(lineStart, lineEnd, distance) {
        let radian = this.getRadian(lineStart, lineEnd);
        let newPos = this.getRayPos(lineStart, radian, distance);
        return newPos;
    }
    /**
     * 根据百分比获取某条线段上某点坐标
     * @param lineStart 线段起点
     * @param lineEnd 线段终点
     * @param per 百分比
     * @returns 线上坐标
     */
    getPosByLinePer(lineStart, lineEnd, per) {
        let newDistance = this.getDistance(lineStart, lineEnd) * per;
        return this.getPosByLineDistance(lineStart, lineEnd, newDistance);
    }
    /**
     * 求点与直线垂直相交点
     * @param targetPos 目标点
     * @param lineStart 线段起点
     * @param lineEnd 线段终点
     * @returns 相交坐标
     */
    getRightAngleIntersect(targetPos, lineStart, lineEnd) {
        if (this.isSamePos(lineStart, lineEnd))
            return lineStart;
        /** 获取线段的弧度 */
        let radian = this.getRadian(lineStart, lineEnd);
        /** 垂直直线 */
        let newPos = this.getRayPos(targetPos, radian + (Math.PI / 2), 10);
        /** 相交得点 */
        let intersectPos = this.getIntersect(targetPos, newPos, lineStart, lineEnd, true);
        return intersectPos;
    }
    /**
     * 删除同点的线
     * @param lineArr 线段集合
     */
    removeSamePosLine(lineArr) {
        for (let i = lineArr.length - 1; i >= 0; i--) {
            if (lineArr[i][0].x == lineArr[i][1].x && lineArr[i][0].y == lineArr[i][1].y) {
                lineArr.splice(i, 1);
            }
        }
    }
    /** 判断点是否在线段内
     * @param errorValue 误差距离 默认0.001
     * @returns 不在为undefined,在为距离值
     */
    isInLine(lineStart, lineEnd, pos, errorValue) {
        if (errorValue == undefined)
            errorValue = 0.001;
        let newPos = this.getPointToLinePos(pos, lineStart, lineEnd);
        let newDistance = this.getDistance(newPos, pos);
        if (newDistance <= errorValue)
            return newDistance;
        else
            return undefined;
    }
    /**
     * 判断点是否在弧线内
     * @param center 弧的圆心
     * @param radius 弧的半径
     * @param startAngle 弧的起始弧
     * @param endAngle 弧的终止弧
     * @param isCounterClockwise 是否逆时针,默认false
     * @param targetPos 目标点
     * @param errorValue 误差值,默认0.001
     * @returns 不在为undefined,在为距离值
     */
    isInArcLine(center, radius, startAngle, endAngle, targetPos, isCounterClockwise, errorValue) {
        if (errorValue == undefined)
            errorValue = 0.001;
        let distance = this.getDistance(targetPos, center);
        // 大于误差值,则不符合
        let abs = Math.abs(radius - distance);
        if (abs > errorValue)
            return undefined;
        let check = false;
        let targetRadian = this.getRadian(center, targetPos);
        let angle = this.getAbsRadian(endAngle - startAngle, true);
        let targetAngle = this.getAbsRadian(targetRadian - startAngle, true);
        if (Math.abs(targetAngle) - Math.abs(angle) < 0 && targetAngle * angle > 0)
            check = true;
        if (isCounterClockwise)
            check = !check;
        if (check)
            return abs;
        return undefined;
    }
    /**
     * 获取线延长线
     * @param line 线段
     * @param distance ,默认999999999
     * @returns 数组[posStart,posEnd]
     */
    getlongLine(line, distance = 99999999999) {
        let radian = this.getRadian(line[0], line[1]);
        let newPosA = this.getRayPos(line[1], radian, distance);
        let newPosB = this.getRayPos(line[0], radian, -distance);
        return [newPosB, newPosA];
    }
    /**
     * 快速获取延长线(用于直线计算,减少运算量)
     * @param this
     * @param line 线段
     * @param ratio 向量倍数,默认99999999999
     * @returns 数组[posStart,posEnd]
     */
    quickGetLongLine(line, ratio = 99999999999) {
        let vec = this.getSub(line[1], line[0]);
        vec.x *= ratio;
        vec.y *= ratio;
        let newPosA = new JPos(line[1].x + vec.x, line[1].y + vec.y);
        let newPosB = new JPos(line[0].x - vec.x, line[0].y - vec.y);
        return [newPosB, newPosA];
    }
    /**
    * 获取同向的线段
    * @param templateLine 模板线
    * @param targetLine 目标线
    * @returns 目标线的正反
    */
    getSameTrendLine(templateLine, targetLine) {
        /** 向量点乘判断是否同向 */
        if (this.isSameDirection(templateLine[0], templateLine[1], targetLine[0], targetLine[1]) < 0)
            return [targetLine[1], targetLine[0]];
        return [targetLine[0], targetLine[1]];
    }
    /**
     * 判断点在线段内外 点必须在直线上
     * @param lineStart 线段起点
     * @param lineEnd 线段终点
     * @param targetPos 目标坐标
     * @returns 是否在内外
     */
    isLineOut(lineStart, lineEnd, targetPos) {
        let out = false;
        /** 线的向量 */
        let vector = new JPos(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y);
        /** 点到线头的向量 */
        let newVector = new JPos(targetPos.x - lineStart.x, targetPos.y - lineStart.y);
        /** 用向量点乘判断内外 */
        let a = this.getMultiply(vector, newVector);
        if (a <= 0) {
            out = true;
        }
        else {
            let b = this.getMultiply(this.getSub(newVector, vector), vector);
            if (b >= 0) {
                out = true;
            }
        }
        return out;
    }
    /**
     * 获取圆弧度直径线段
     * @param centerPos 中心点
     * @param radius 半径
     * @param radian 弧度
     * @returns 线坐标[lineStart,lineEnd]
     */
    getLineByCenterPos(centerPos, radius, radian) {
        let newPosA = this.getRayPos(centerPos, radian, radius);
        let newPosB = this.getRayPos(centerPos, radian + Math.PI, radius);
        return [newPosA, newPosB];
    }
    /**
     * 弧度是否平行
     * @param radianA 弧度A
     * @param radianB 弧度B
     * @param errorValue 误差范围,默认0.0001
     * @returns 是否平行
     */
    isParallelRadian(radianA, radianB, errorValue = 0.0001) {
        let value = radianB - radianA;
        value = value % Math.PI;
        value = Math.abs(value);
        if (value <= errorValue || value >= Math.PI - errorValue) {
            return true;
        }
        return false;
    }
    /**
     * 判断投影点是否在线段范围之内
     * @param targetPos
     * @param lineStart
     * @param lineEnd
     * @returns 0 为在线段内,-1为在线段起点附近,1为在线段终点附近,-0.5为线段起点,0.5为线段终点
     */
    isprojectPInLine(targetPos, lineStart, lineEnd) {
        if (this.isSamePos(lineStart, lineEnd))
            return -1;
        let cross = ((lineEnd.x - lineStart.x) * (targetPos.x - lineStart.x)) + ((lineEnd.y - lineStart.y) * (targetPos.y - lineStart.y));
        let d = ((lineEnd.x - lineStart.x) * (lineEnd.x - lineStart.x)) + ((lineEnd.y - lineStart.y) * (lineEnd.y - lineStart.y));
        if (cross < 0) {
            return -1;
        }
        else if (cross == 0) {
            return -0.5;
        }
        else if (cross > d) {
            return 1;
        }
        else if (cross == d) {
            return 0.5;
        }
        return 0;
    }
    /**
     * 获取点到线段最近的点
     * @param targetPos 目标点
     * @param lineStart 线段起点
     * @param lineEnd 线段终点
     * @return 最近点坐标
     */
    getPointToLinePos(targetPos, lineStart, lineEnd) {
        let a = this.isprojectPInLine(targetPos, lineStart, lineEnd);
        if (a > 0)
            return lineEnd;
        else if (a < 0)
            return lineStart;
        else {
            let newPos = this.getRightAngleIntersect(targetPos, lineStart, lineEnd);
            return newPos;
        }
    }
    /**
     * 获取直线的垂直偏移
     * @param start 线段起点
     * @param end 线段终点
     * @param distance 偏移距离
     * @returns 数组[start,end]
     */
    getLineVerticalOffset(start, end, distance) {
        let radian = this.getRadian(start, end);
        let startRay = this.getRayPos(start, radian + (Math.PI / 2), distance);
        let endRay = this.getRayPos(end, radian + (Math.PI / 2), distance);
        return [startRay, endRay];
    }
    /**
     * 获取直线上某点垂直偏移的坐标
     * @param start 线段起点
     * @param end 线段终点
     * @param pt 目标点
     * @param distance 偏移距离
     * @returns 偏移坐标
     */
    getLineDistancePos(start, end, pt, distance) {
        let radian = this.getRadian(start, end);
        let ray = this.getRayPos(pt, radian + (Math.PI / 2), distance);
        return ray;
    }
    /**
     * 获取线段中心垂直偏移坐标
     * @param start 线段起点
     * @param end 线段终点
     * @param distance 偏移距离
     * @returns 偏移坐标
     */
    getCenterDistancePos(start, end, distance) {
        let centerPos = this.getCenterPos(start, end);
        let ray = this.getLineDistancePos(start, end, centerPos, distance);
        return ray;
    }
    /**
    * 是否同方向
    * @param lineAStart 如果为向量,可为undefined
    * @param lineAEnd 如果为向量,则为向量值
    * @param lineBStart 如果为向量,可为undefined
    * @param lineBEnd 如果为向量,则为向量值
    * @returns 数值,大于等于0为同向,小于0为反向
    */
    isSameDirection(lineAStart, lineAEnd, lineBStart, lineBEnd) {
        new JPos(lineBEnd.x - lineBStart.x, lineBEnd.y - lineBStart.y);
        let vectorA = lineAStart ? new JPos(lineAEnd.x - lineAStart.x, lineAEnd.y - lineAStart.y) : lineAEnd;
        let vectorB = lineBStart ? new JPos(lineBEnd.x - lineBStart.x, lineBEnd.y - lineBStart.y) : lineBEnd;
        let a = (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
        return a;
    }
    /**
    * 获取两个坐标沿某直线弧度的偏移距离
    * @param start 如果为向量,可为undefined
    * @param end 终点,如果为向量,则为向量值
    * @param radian 某直线弧度
    * @返回 正反距离
    */
    getOffsetDistance(start, end, radian) {
        if (!start)
            start = { x: 0, y: 0 };
        let otherA = this.getRayPos(start, radian, 10);
        let otherB = this.getRayPos(end, radian + Math.PI / 2, 10);
        let inter = this.getIntersect(start, otherA, end, otherB);
        let distance = this.getDistance(start, inter);
        let a = this.isSameDirection(start, otherA, start, end);
        return a >= 0 ? distance : distance * -1;
    }
    /**
     * 线转弧,重写线转弧线
     * @param start 线起点
     * @param end 线终点
     * @param distance 圆弧中心点的距离线的垂直高度,可为负值,圆心会不同,绝对值大于半径为大弧,小于半径为小弧
     *
     */
    lineToArc(start, end, distance) {
        /** 距离绝对值,用来判断顺逆时针 */
        let absDistance = Math.abs(distance);
        /** 通过距离绝对值算出半径 */
        let radius = ((this.getPowDistance(start, end) / 4) + Math.pow(absDistance, 2)) / (2 * absDistance);
        /** 通过两点的中心点延长求出圆心 */
        let center = this.getRayPos(this.getCenterPos(start, end), this.getRadian(start, end) - Math.PI / 2, distance > 0 ? radius - absDistance : absDistance - radius);
        /** 通过圆心求出旋转角度 */
        let startAngle = this.getAbsRadian(this.getRadian(center, start), true);
        let endAngle = this.getAbsRadian(this.getRadian(center, end), true);
        let angle = this.getAbsRadian((startAngle - endAngle), true) * 180 / Math.PI;
        angle = distance > 0 ? angle : (angle - 360);
        return {
            radius, startAngle: -startAngle * 180 / Math.PI, angle
        };
    }
    /**
     * 判断线段与线段是否相交(在直线相交基础上强化),只能判断线段,不能判断直线
      * @param lineAStart 线段A起点
     * @param lineAEnd 线段A终点
     * @param lineBStart 线段B起点
     * @param lineBEnd 线段B终点
     * @returns 相交1,点重合为-1,不相交0
     */
    isLineCrossLine(lineAStart, lineAEnd, lineBStart, lineBEnd) {
        let delta = this.isIntersect(lineAStart, lineAEnd, lineBStart, lineBEnd);
        if (delta == 0)
            return 0;
        let r = ((lineBStart.x - lineAStart.x) * (lineBStart.y - lineBEnd.y) - (lineBStart.x - lineBEnd.x) * (lineBStart.y - lineAStart.y)) / delta;
        let u = ((lineAEnd.x - lineAStart.x) * (lineBStart.y - lineAStart.y) - (lineBStart.x - lineAStart.x) * (lineAEnd.y - lineAStart.y)) / delta;
        /** 判断相交点是否在线段内 */
        if ((r >= 0 && r <= 1) && (u >= 0 && u <= 1)) {
            // 重合
            if ((r == 0 || r == 1) && (u == 0 || u == 1)) {
                return -1;
            }
            return 1;
        }
        return 0;
    }
    /**
     * 判断点在直线左边还是右边
     * @param lineStart 直线起点
     * @param lineEnd  直线终点
     * @param targetP 目标点
     * @returns 0为在直线上,-1和1在左右,2为直线重合为点
     */
    checkPointByLineLeftRight(lineStart, lineEnd, targetP) {
        if (this.isSamePos(lineStart, lineEnd, 0)) {
            return 2;
        }
        let area = this.getArea(lineStart, lineEnd, targetP);
        if (area == 0) {
            return 0;
        }
        return area > 0 ? 1 : -1;
    }
    /**
     * 求点与直线垂直距离
     * @param targetP 目标点
     * @param lineStart 直线起点
     * @param lineEnd 直线终点
     * @param isNoAbs 是否不需要绝对值,默认false
     * @returns 距离
     */
    getRightAngleDistance(targetP, lineStart, lineEnd, isNoAbs) {
        if (!isNoAbs)
            return this.getDistance(targetP, this.getRightAngleIntersect(targetP, lineStart, lineEnd));
        let s = this.checkPointByLineLeftRight(lineStart, lineEnd, targetP);
        if (s == 0)
            return 0;
        return this.getDistance(targetP, this.getRightAngleIntersect(targetP, lineStart, lineEnd)) * s;
    }
    /**
     * 循环线条
     * @param pArr 闭合坐标点集合
     * @param cb 循环线的回调方法
     */
    loopLines(pArr, cb) {
        if (pArr.length < 2) {
            return;
        }
        if (pArr.length == 2) {
            cb(pArr[0], pArr[1], 0);
            return;
        }
        for (let i = 0; i < pArr.length - 1; i++) {
            cb(pArr[i], pArr[i + 1], i);
        }
        cb(pArr[pArr.length - 1], pArr[0], pArr.length - 1);
    }
    /**
     * 获取循环线
     * @param pArr 闭合坐标点集合
     * @returns 循环线 [起点,终点][]
     */
    getLoopLines(pArr) {
        let lines = [];
        if (pArr.length < 2) {
            return lines;
        }
        if (pArr.length == 2) {
            lines.push([pArr[0], pArr[1]]);
            return lines;
        }
        for (let i = 0; i < pArr.length - 1; i++) {
            lines.push([pArr[i], pArr[i + 1]]);
        }
        lines.push([pArr[pArr.length - 1], pArr[0]]);
        return lines;
    }
}
/**
 * dom元素操作工具类
 * @author Jeef
 */
class DomUtil {
    /**
     * 获取元素起点坐标
     * @param element 对应的元素
     */
    static getAbsPosition(element) {
        var abs = { x: 0, y: 0 };
        while (element != document.body) {
            abs.x += element.offsetLeft;
            abs.y += element.offsetTop;
            element = element.offsetParent;
        }
        //计算想对位置  
        abs.x += window.screenLeft +
            document.body.clientLeft - document.body.scrollLeft;
        abs.y += window.screenTop +
            document.body.clientTop - document.body.scrollTop;
        return abs;
    }
    /**
     * 复制字符串到剪切板
     * @param str 字符串
     * @returns 返回是否成功
     */
    static copyStr(str, isMobile) {
        if (isMobile) {
            let div = document.createElement("div");
            div.innerHTML = str.toString();
            document.body.appendChild(div);
            let range = document.createRange();
            range.selectNode(div);
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }
            selection.addRange(range);
            let check = document.execCommand("copy");
            document.body.removeChild(div);
            return check;
        }
        let textArea = document.createElement('textarea');
        textArea.innerHTML = str.toString();
        document.body.appendChild(textArea);
        textArea.select();
        let check = document.execCommand('copy');
        document.body.removeChild(textArea);
        return check;
    }
    /**
     * 复制对象的字符串化到剪切板
     * @param obj 对象
     * @returns 返回是否成功
     */
    static copyObjData(obj, isMobile) {
        if (typeof (obj) == "string" || typeof (obj) == "number") {
            this.copyStr(obj, isMobile);
        }
        else {
            try {
                obj = JSON.stringify(obj);
                let check = this.copyStr(obj, isMobile);
                return check;
            }
            catch (e) {
                console.log(e);
                throw "不是规范数据";
            }
        }
    }
    /**
     * 读取文件
     * @return 返回未解析的文件对象,需搭配解析方法使用
     */
    static readFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let input = document.createElement("input");
                input.setAttribute("type", "file");
                input.onchange = (e) => {
                    let data = {
                        files: e.target.files,
                        value: e.target.value
                    };
                    resolve(data);
                };
                input.click();
            });
        });
    }
    /**
     * 解析文件
     * @param file 文件对象
     * @param type 类型 默认text
     * @param encoding 解码类型,当为文本才会触发,默认"utf-8"
     * @returns 返回文件内容
     */
    static decodeFile(file, type = "text", encoding = "utf-8") {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!file) {
                    reject();
                }
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    console.log(file);
                    resolve(fileReader.result);
                };
                switch (type) {
                    case "buffer":
                        fileReader.readAsArrayBuffer(file);
                        break;
                    case "binary":
                        fileReader.readAsBinaryString(file);
                        break;
                    case "dataUrl":
                        fileReader.readAsDataURL(file);
                        break;
                    case "text":
                    default:
                        fileReader.readAsText(file, encoding);
                        break;
                }
            });
        });
    }
    /**
     * 保存文本文件
     * @param text 文本内容
     * @param fileName 保存的文件名
     */
    static saveStrFile(text, fileName) {
        var blob = new Blob([text]);
        this.saveBlobFile(blob, fileName);
    }
    /**
     * 保存二进制文件
     * @param blob 二进制内容
     * @param fileName 保存的文件名
     */
    static saveBlobFile(blob, fileName) {
        this.saveBase64File(window.URL.createObjectURL(blob), fileName);
    }
    /**
     * 保存base64文件
     * @param base64 base64字符串内容
     * @param fileName 保存的文件名
     */
    static saveBase64File(base64, fileName) {
        let a = document.createElement("a");
        a.href = base64;
        a.download = fileName;
        a.click();
    }
    /**
     * 获取链接所有查询字符串
     * @returns 返回字典对象
     */
    static getAllQueryString() {
        let text = window.location.search.substr(1);
        let textArr = text.split('&&');
        let objArr = {};
        for (let i = 0; i < textArr.length; i++) {
            let arr = textArr[i].split('=');
            let key = arr[0].toLowerCase();
            objArr[key] = arr[1];
        }
        return objArr;
    }
    /**
     * 用于修改链接(可属性追踪)
     * @param datas
     * @param mainUrl
     * @param attrArr 如果有属性,则修改属性,否则直接修改字符串
     */
    static changeObjUrlByattrs(datas, mainUrl, attrArr) {
        for (let i = 0; i < datas.length; i++) {
            if (attrArr) {
                for (let j = 0; j < attrArr.length; j++) {
                    if (datas[i][attrArr[j]].indexOf(".") != -1 && datas[i][attrArr[j]].indexOf("/") != -1) {
                        datas[i][attrArr[j]] = datas[i][attrArr[j]][0] == '/' ? mainUrl + datas[i][attrArr[j]] : mainUrl + '/' + datas[i][attrArr[j]];
                    }
                }
            }
            else {
                if (datas[i].indexOf(".") != -1 && datas[i].indexOf("/") != -1) {
                    datas[i] = datas[i][0] == '/' ? mainUrl + datas[i] : mainUrl + '/' + datas[i];
                }
            }
        }
    }
    /**
     * 用于修改链接(标记追踪)
     * @param data
     * @param mainUrl
     * @param flag
     */
    static changeObjUrlByflag(data, mainUrl, flag) {
        let flagLength = flag.length;
        if (data != null) {
            for (let key in data) {
                switch (typeof data[key]) {
                    case 'string':
                        let str = data[key];
                        let a = str.slice(0, flagLength);
                        if (a == flag) {
                            a = str.slice(flagLength);
                            a = a[0] == '/' ? mainUrl + a : mainUrl + '/' + a;
                            data[key] = a;
                        }
                        break;
                    case "object":
                        this.changeObjUrlByflag(data[key], mainUrl, flag);
                        break;
                }
            }
        }
    }
    /**
     * 访问链接对象超级版
     * @param attrName 属性名
     */
    static getQueryStringSuper(attrName) {
        attrName = attrName.toLowerCase();
        let obj = this.getAllQueryString();
        return obj[attrName];
    }
    /**
     *  获取地址后面数据字符串
     */
    static getLocationAttrStr() {
        let url = window.location.hash;
        if (url == '') {
            return undefined;
        }
        else {
            let urls = url.split('#')[1];
            return urls;
        }
    }
    /**
     * 访问链接对象
     * @param name
     */
    static getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var text = window.location.search.substr(1);
        // console.log(text)
        var r = text.match(reg);
        // console.log(r)
        if (r != null)
            return decodeURI(r[2]);
        return null;
    }
    /**
     * 加载script
     * @param textOrUrl 文本或者路径
     * @param isUrl 加载方式是否为路径 默认为false
     * @param headDom 插入元素
     */
    static loadScript(textOrUrl, isUrl = false, headDom) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        if (isUrl)
            script.src = textOrUrl;
        else
            script.innerHTML = textOrUrl;
        if (!headDom)
            headDom = document.body;
        headDom.appendChild(script);
    }
    /**
     * fetch方式读取js,script放入的是文本
     * @param url 路径
     * @param isUrl 加载方式是否为url,默认为false
     * @param headDom 放入的元素,默认为document.body
     * @returns 返回url的内容
     */
    static fetchJS(url, isUrl = false, headDom) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let response = yield fetch(url);
                if (response.status != 200) {
                    console.log(`文件:${url}不存在`);
                    reject(response.status);
                }
                else {
                    let text = yield response.text();
                    if (isUrl)
                        this.loadScript(url, true, headDom);
                    else
                        this.loadScript(text, false, headDom);
                    resolve(text);
                }
            }));
        });
    }
    /**
     * require方式读取js
     * 如果没有require,用fetch,fetch可能用到head
     * @param url 读取路径
     * @param head 头元素
     */
    static requireJS(url, head) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                /** require */
                if (window['require']) {
                    window['require']([url], (obj) => {
                        resolve({ type: "require", data: obj });
                    });
                }
                /** fetch */
                else {
                    let text = yield this.fetchJS(url, false, head).catch((e) => {
                        reject(e);
                    });
                    if (!text)
                        resolve({ type: "fetch", data: text });
                }
            }));
        });
    }
    /**
     * httpPost请求(未完成)
     * @param url 请求路径
     * @param json json数据
     */
    static httpPostJson(url, json) {
        let formDom = document.createElement("form");
        formDom.action = url;
        formDom.method = 'post';
        formDom.style.display = 'none';
        for (let key in json) {
        }
        let opt = document.createElement("textarea");
        opt.name = 'sex';
        opt.value = 'male';
        formDom.append(opt);
        document.body.appendChild(formDom);
        formDom.submit();
        document.body.removeChild(formDom);
    }
    /** 获取矩阵 */
    static getMatrix(m) {
        return `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
    }
    /**
     * svg转base64,svg记得增加xmlns="http://www.w3.org/2000/svg"的属性
     * @param svg svg对象
     * @param type 图片类型
     * @param quality 图片质量
     */
    static svgToBase64(svg, type, quality) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let image = new Image();
                let canvas = document.createElement('canvas');
                image.onload = () => {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, image.width, image.height);
                    ctx.drawImage(image, 0, 0);
                    resolve(canvas.toDataURL(type, quality));
                };
                image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg.outerHTML)));
            });
        });
    }
    /**
     * 判断粘贴是文字还是文件还是没有
     * @param e 粘贴事件
     */
    static getPasteType(e) {
        let items = e.clipboardData.items;
        for (let key in items) {
            let item = items[key];
            if (item.kind === "file") {
                return "file";
            }
            else {
                return "string";
            }
        }
        return "none";
    }
    /**
     * 获取粘贴文件
     * @param e 粘贴事件
     */
    static getPasteFile(e) {
        let items = e.clipboardData.items;
        let index;
        for (let key in items) {
            index = key;
            break;
        }
        if (!index) {
            return undefined;
        }
        return items[index].getAsFile();
    }
    /**
     * 获取粘贴文件base64,一般用来获取图片base64
     * @param e 粘贴事件
     */
    static getPasteFileAsBase64(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let blob = this.getPasteFile(e);
            if (!blob)
                return undefined;
            return yield this.decodeFile(blob, "dataUrl");
        });
    }
    /** 往前插入dom元素 */
    static insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            // 如果最后的节点是目标元素，则直接添加。因为默认是最后
            parent.appendChild(newElement);
        }
        else {
            parent.insertBefore(newElement, targetElement.nextSibling);
            //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
        }
    }
}
/**
 * 自制异步库,(不用了,新的请移步)
 * @deprecated
 */
class JAsync {
    static concatSeriesByAsync(datas, everyFunc) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let len = 0;
                let arr = [];
                let cbLen = 0;
                /* 数据数组形式,才好判断 */
                let dataArr = [];
                /* 数组类型,不需要重建 */
                if (datas instanceof Array) {
                    for (let i = 0; i < datas.length; i++) {
                        let a = yield everyFunc(datas[i]);
                        yield arr.push(a);
                    }
                    resolve(arr);
                }
                /* 索引数组,需要重建 */
                else {
                    for (let key in datas) {
                        let data = datas[key];
                        let a = yield everyFunc(data);
                        yield arr.push(a);
                    }
                    resolve(arr);
                }
            }));
        });
    }
    /* 串连执行并把计算数据汇总输出数组 */
    static concatSeries(datas, everyFunc, allFunc) {
        let len = 0;
        let arr = [];
        let cbLen = 0;
        let dataArr = [];
        let doFunc = (index, cb) => {
            everyFunc(dataArr[index], cb);
        };
        let cb = (err, data) => {
            if (err)
                return allFunc(err, arr);
            arr.push(...data);
            cbLen++;
            if (cbLen == len) {
                return allFunc(undefined, arr);
            }
            else {
                try {
                    return doFunc(cbLen, cb);
                }
                catch (e) {
                    return allFunc(e, arr);
                }
            }
        };
        /* 数组类型,不需要重建 */
        if (datas instanceof Array) {
            dataArr = datas;
            len = datas.length;
        }
        /* 索引数组,需要重建 */
        else {
            for (let key in datas) {
                let data = datas[key];
                len++;
                // console.log(len)
                dataArr.push(data);
            }
        }
        try {
            if (len == 0)
                allFunc(undefined, arr);
            else
                doFunc(cbLen, cb);
        }
        catch (e) {
            allFunc(undefined, arr);
        }
    }
    /* 瀑布计算,计算得出的结果会塞入下个方法计算,以此循环嵌套 */
    static waterfall(funcs, doneFunc) {
        let index = 0;
        let len = funcs.length;
        let func = (...args) => {
            try {
                funcs[index](...args, (err, ...newArgs) => {
                    if (err) {
                        return doneFunc(err, ...newArgs);
                    }
                    index++;
                    if (index < len) {
                        return func(...newArgs);
                    }
                    else {
                        return doneFunc(null, ...newArgs);
                    }
                });
            }
            catch (e) {
                console.log(e);
                return doneFunc(e, ...args);
            }
        };
        return func();
    }
    /** 连续计算, */
    static series(funcs, doneFunc) {
        if (funcs instanceof Array) {
            return this._seriesByArr(funcs, doneFunc);
        }
        else {
            return this._seriesByObj(funcs, doneFunc);
        }
    }
    static _seriesByArr(funcs, doneFunc) {
        let index = 0;
        let len = funcs.length;
        let arr = [];
        let func = () => {
            try {
                funcs[index]((err, result) => {
                    arr.push(result);
                    if (err) {
                        return doneFunc(err, arr);
                    }
                    index++;
                    if (index < len) {
                        return func();
                    }
                    else {
                        return doneFunc(undefined, arr);
                    }
                });
            }
            catch (e) {
                console.log(e);
                return doneFunc(undefined, arr);
            }
        };
        if (len == 0)
            return doneFunc(undefined, arr);
        return func();
    }
    static _seriesByObj(funcs, doneFunc) {
        let index = 0;
        let len = 0;
        let arr = [];
        for (let key in funcs) {
            arr.push(key);
            len++;
        }
        let newObj = {};
        let func = () => {
            try {
                funcs[arr[index]]((err, result) => {
                    newObj[arr[index]] = result;
                    if (err) {
                        return doneFunc(err, newObj);
                    }
                    index++;
                    if (index < len) {
                        return func();
                    }
                    else {
                        return doneFunc(undefined, newObj);
                    }
                });
            }
            catch (e) {
                console.log(e);
                return doneFunc(undefined, newObj);
            }
        };
        if (len == 0)
            return doneFunc(undefined, newObj);
        return func();
    }
}
class JBitmapUtil {
    static changeDPI(op) {
        let btyes;
        if (op.buffer) {
            btyes = new Uint8Array(op.buffer);
        }
        else if (op.base64) {
            let str = window.atob(op.base64);
            let len = str.length;
            btyes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                btyes[i] = str.charCodeAt(i);
            }
        }
        else if (op.btyes) {
            btyes = op.btyes;
        }
        else {
            return;
        }
        if (!btyes) {
            return;
        }
        let targetWIndex;
        let targetHIndex;
        if (op.type == "png") {
            targetWIndex = [41, 42, 43, 44];
            targetHIndex = [45, 46, 47, 48];
        }
        else if (op.type == "bmp") {
            targetWIndex = [39, 38];
            targetHIndex = [43, 42];
        }
        let targetW = 0;
        let len = targetWIndex.length;
        targetHIndex.forEach((c, i) => {
            targetW += btyes[c] * (Math.pow((16 * 16), len - i - 1));
        });
        let targetH = 0;
        len = targetHIndex.length;
        targetHIndex.forEach((c, i) => {
            targetH += btyes[c] * (Math.pow((16 * 16), len - i - 1));
        });
        if (op.w == undefined && op.h == undefined) {
            return {
                targetH, targetW
            };
        }
        let w = Math.round(op.w);
        let h = Math.round(op.h || w);
        [{ size: w, index: targetWIndex }, { size: h, index: targetHIndex }].forEach(bigC => {
            let str16 = bigC.size.toString(16);
            let zeroLen = targetWIndex.length * 2 - str16.length;
            let zero = "";
            for (let i = 0; i < zeroLen; i++) {
                zero += "0";
            }
            str16 = zero + str16;
            bigC.index.forEach((c, i) => {
                let a = 2 * i;
                let d = parseInt(`${str16[a]}${str16[a + 1]}`, 16);
                btyes[c] = d;
            });
        });
        return {
            btyes, targetH, targetW
        };
    }
}
class JCalUtil {
    /** 快速解析svg的path为离散点 */
    static DecodeSvgPath(d, matrix) {
        let list = [];
        let arr = d.split(/,| /);
        let startP;
        let curPts = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "") {
                continue;
            }
            if (arr[i] == "M") {
                if (curPts && curPts.length > 0) {
                    list.push({ pts: curPts, isClose: false });
                    curPts = [];
                }
                startP = new JPos(Number(arr[i + 1]), Number(arr[i + 2]));
                curPts.push(startP);
                i += 2;
                continue;
            }
            if (arr[i] == "L") {
                let p = new JPos(Number(arr[i + 1]), Number(arr[i + 2]));
                curPts.push(p);
                i += 2;
                continue;
            }
            if (arr[i] == "z" || arr[i] == "Z") {
                if (!curPts || curPts.length == 0) {
                    continue;
                }
                list.push({ pts: curPts, isClose: true });
                curPts = [];
                startP = undefined;
                continue;
            }
            if (arr[i] == "A") {
                let rx = Number(arr[i + 1]);
                let ry = Number(arr[i + 2]);
                let xaxis = Number(arr[i + 3]);
                let largearc = Number(arr[i + 4]);
                let sweepflag = Number(arr[i + 5]);
                let dx = Number(arr[i + 6]);
                let dy = Number(arr[i + 7]);
                let sp = new JPos().copy(startP);
                let bList = PosUtil.arcToBezier(sp.x, sp.y, dx, dy, rx, ry, xaxis, largearc, sweepflag);
                bList.forEach(bchild => {
                    let childList = PosUtil.getPointsByThreeBezier(sp, new JPos(bchild.x, bchild.y), new JPos(bchild.x1, bchild.y1), new JPos(bchild.x2, bchild.y2), 100);
                    curPts.push(...childList);
                    sp = new JPos(bchild.x, bchild.y);
                });
                i += 7;
                continue;
            }
        }
        if (curPts && curPts.length > 0) {
            list.push({ pts: curPts, isClose: false });
        }
        if (matrix) {
            list.forEach(child => {
                if (!child.pts) {
                    return;
                }
                child.pts = PosUtil.getTransformPosArr(child.pts, matrix);
            });
        }
        return list;
    }
    /** 快速获取crc的初始计算值 */
    static _MakeCRC32Table() {
        var c;
        var crcTable = [];
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            crcTable[n] = c;
        }
        return crcTable;
    }
    /** 生成crc32的数值 */
    static crc32(numberList) {
        if (!this.crc32Table) {
            this.crc32Table = this._MakeCRC32Table();
        }
        var crc = 0 ^ (-1);
        for (var i = 0; i < numberList.length; i++) {
            crc = (crc >>> 8) ^ this.crc32Table[(crc ^ numberList[i]) & 0xFF];
        }
        let cal = (crc ^ (-1)) >>> 0;
        return cal;
    }
    /** 通过其他参数快速获取crc32的数据 */
    static crc32ByOP(op) {
        let numberList = [];
        if (op.str16list) {
            numberList = op.str16list.map(c => parseInt(c, 16));
        }
        else if (op.numberList) {
            numberList = [...op.numberList];
        }
        if (op.str) {
            for (let i = 0; i < op.str.length; i++) {
                numberList.push(op.str.charCodeAt(i));
            }
        }
        if (numberList.length == 0) {
            return;
        }
        let data = this.crc32(numberList);
        if (!op.isDetail) {
            return {
                data
            };
        }
        let val16 = data.toString(16);
        let deltaLen = 8 - val16.length;
        let completeVal16 = "";
        for (let i = 0; i < deltaLen; i++) {
            completeVal16 += '0';
        }
        completeVal16 += val16;
        let dataList = [];
        let len = completeVal16.length / 2;
        for (let i = 0; i < len; i++) {
            let a = completeVal16[2 * i];
            let b = completeVal16[2 * i + 1];
            dataList.push(parseInt(a + b, 16));
        }
        return {
            data, val16, completeVal16, dataList
        };
    }
}
class JEventEmitList {
    constructor() {
        this.events = {};
        this.isDebug = false;
    }
    /**
     * 订阅事件
     * @param id 事件对应的id
     * @param func 事件用到的方法
     * @param sortID 排序,影响触发先后顺序,默认1
     */
    addSubcribe(id, func, sortID) {
        return this.getEvent(id).subscribe(func, sortID);
    }
    /** 获取事件 */
    getEvent(id) {
        if (!this.events[id]) {
            this.events[id] = new JEventEmit();
        }
        return this.events[id];
    }
    /**
     * 订阅最后触发的事件,会比subscribe要晚
     * @param id 事件对应的id
     * @param func 事件用到的方法
     */
    addFinalySubsribe(id, func) {
        return this.getEvent(id).finalySubcribe(func);
    }
    /**
     * 订阅事件(强制类型版本)
     * @param id 事件对应的id
     * @param func 事件用到的方法
     */
    addStrongeSubcribe(id, func) {
        return this.addSubcribe(id, func);
    }
    /**
     * 触发事件
     * @param id 事件对应的id
     * @param data 事件可能需要用到的数据
     * @param isAsync 是否同步，默认否
     */
    emitEvent(id, data, isAsync = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.events[id]) {
                if (this.isDebug)
                    console.log(`暂无 ${id} 的事件`);
                return;
            }
            if (!isAsync)
                return this.events[id].emit(data, () => {
                    if (this.isDebug)
                        console.error(`错误事件为:${id}`);
                });
            yield this.events[id].asyncEmit(data);
            return;
        });
    }
    /**
     * 触发事件(强制类型版本)
     * @param id 事件对应的id
     * @param data 事件可能需要用到的数据
     */
    emitStrongEvent(id, data, isAsync = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.emitEvent(id, data, isAsync);
        });
    }
    /**
     * 是否为空
     * @param id 事件对应的id
     */
    isEmpty(id) {
        if (!this.events[id])
            return undefined;
        return this.events[id].isEmpty();
    }
    /**
     * 是否为空(强制版)
     * @param id 事件对应的id
     */
    isStrongEmpty(id) {
        return this.isEmpty(id);
    }
}
class JPos {
    constructor(x, y, z) {
        this.x = (x ? x : 0);
        this.y = (y ? y : 0);
        if (z != undefined)
            this.z = z;
    }
    clone() {
        return new JPos(this.x, this.y, this.z);
    }
    copy(p) {
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
        return this;
    }
}
/** 画布圆弧 */
class JArc {
    clone() {
        let a = new JArc();
        a.center = this.center;
        a.radius = this.radius;
        a.startAngle = this.startAngle;
        a.endAngle = this.endAngle;
        a.isCounterClockwise = this.isCounterClockwise;
        return a;
    }
}
/** svg圆弧 */
class JSvgArc {
    constructor(sx, sy, rx, ry, largeArcFlag, sweepFlag, ex, ey) {
        this.sx = sx;
        this.sy = sy;
        this.rx = rx;
        this.ry = ry;
        this.largeArcFlag = largeArcFlag;
        this.sweepFlag = sweepFlag;
        this.ex = ex;
        this.ey = ey;
    }
    clone() {
        return new JSvgArc(this.sx, this.sy, this.rx, this.ry, this.largeArcFlag, this.sweepFlag, this.ex, this.ey);
    }
}
class LocalStorageUtil {
    constructor(listName = "JList", listMax = 100) {
        this.listName = listName;
        this.listMax = listMax;
        this.length = 0;
        this._listData = {};
        this.init();
    }
    getItem(key) {
        return localStorage.getItem(key);
    }
    /** 初始化 */
    init() {
        let str = localStorage.getItem(this.listName);
        str = str == undefined ? "{}" : str;
        this._listData = JSON.parse(str);
        let arr = Object.keys(this._listData);
        this.length = arr.length;
    }
    /** 重置列表 */
    resetList() {
        this._listData = {};
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key != this.listName) {
                this._listData[key] = 1;
            }
        }
        let arr = Object.keys(this._listData);
        this.length = arr.length;
        this._listUpdate();
    }
    /**
     * 重置
     * @param listName
     * @param listMax
     */
    reset(listName, listMax) {
        this.listName = listName;
        this.listMax = listMax;
        this.init();
    }
    /**
     * 添加列表数据
     * @param key
     */
    _addList(key) {
        this._listData[key] = 1;
        this.length++;
        this._listUpdate();
    }
    /**
     * 移除列表数据
     * @param key
     */
    _removeList(key) {
        delete this._listData[key];
        this.length--;
        this._listUpdate();
    }
    /**
     * 列表数据更新
     */
    _listUpdate() {
        let str = JSON.stringify(this._listData);
        localStorage.setItem(this.listName, str);
    }
    /**
     * 添加数据
     * @param key
     * @param value
     */
    addValue(key, value) {
        localStorage.setItem(key, value);
        this._addList(key);
    }
    /**
     * 移除数据
     * @param key
     */
    removeValue(key) {
        localStorage.removeItem(key);
        this._removeList(key);
    }
    /**
     * 移除第一个数据
     */
    removeFirstValue() {
        for (let key in this._listData) {
            this.removeValue(key);
            break;
        }
    }
    /**
     * 移除最后一个数据
     */
    removeLastValue() {
        let arr = Object.keys(this._listData);
        this.removeValue(arr[arr.length - 1]);
    }
    /**
     * 添加数据(界限版)
     * @param key
     * @param value
     */
    addValueByLimit(key, value) {
        try {
            if (this.length >= this.listMax) {
                this.removeFirstValue();
                this.addValueByLimit(key, value);
            }
            else {
                this.addValue(key, value);
            }
        }
        catch (e) {
            console.log(e);
            if (this.length == 0)
                return false;
            this.removeFirstValue();
            this.addValueByLimit(key, value);
        }
    }
}
/**
 * 对象操作工具类
 */
class ObjUtil {
    /**
     * 在一个数组里删除特定某个元素的方法。================
     * @param array 要被删除数据的数组。
     * @param item 数组里要被剔除的元素。
     */
    static removeItemInArray(array, item) {
        let index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
    /**
     * 更替数组
     * @param target 需要更换目标数组
     * @param newArr 用来插入目标数组的数组
     */
    static replaceArr(target, newArr) {
        target.splice(0);
        target.push(...newArr);
    }
    /**
     * 通过指定的属性名在数组查找对应的元素
     * @param arr 需要查找数组
     * @param value 需要找到的属性对应的值
     * @param attr 查找的属性名
     */
    static findArrByValue(arr, value, attr) {
        return arr[arr.findIndex(item => item[attr] == value)];
    }
    /**
     * 数组转化索引数组(对象)
     * @param arr 需要转化的数组
     * @param attr 需要拿来做索引的属性名
     */
    static arrTransObj(arr, attr) {
        let obj = {};
        arr.forEach(data => { obj[data[attr]] = data; });
        return obj;
    }
    /**
     * 索引数组(对象)转换数组
     * @param obj 需要转换的索引数组(对象)
     * @returns 返回数组
     */
    static objTransArr(obj) {
        let arr = [];
        for (let key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    }
    /**
     * 数组强类型
     * @param obj
     * @param key
     */
    static strongArr(obj, key) {
        return obj[key];
    }
    /** 判断字符串是不是数字 */
    static isNumeric(input) {
        return (input - 0) == input && ('' + input).trim().length > 0;
    }
    /** 克隆(不能是javascript对象) */
    static clone(obj) {
        let o;
        switch (typeof obj) {
            case 'undefined': break;
            case 'string':
                o = obj + '';
                break;
            case 'number':
                o = obj - 0;
                break;
            case 'boolean':
                o = obj;
                break;
            case 'object':
                if (obj === null) {
                    o = null;
                }
                else {
                    if (obj instanceof Array) {
                        o = [];
                        for (let i = 0; i < obj.length; i++) {
                            o.push(this.clone(obj[i]));
                        }
                    }
                    else {
                        o = {};
                        for (let k in obj) {
                            o[k] = this.clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    }
    static assign(target, source) {
        return Object.assign(target, source);
    }
    /**
     *  获取随机16进制的数
     * @param num 位数
     * @param isNum 是否转化数字,默认false,true为10进制数,false为16进制的字符串
     */
    static getRandom16(num = 1, isNum) {
        let int = 1;
        for (let i = 0; i < num; i++) {
            int *= 16;
        }
        let a = Math.floor(Math.random() * int);
        if (isNum)
            return a;
        return a.toString(16);
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
    static find(objs, cb) {
        for (let key in objs) {
            if (cb(objs[key], key))
                return objs[key];
        }
        return undefined;
    }
    static findKey(objs, cb) {
        for (let key in objs) {
            if (cb(objs[key], key))
                return key;
        }
        return undefined;
    }
    static map(objs, cb) {
        let list = [];
        for (let key in objs) {
            list.push(cb(objs[key], key));
        }
        return list;
    }
    static filter(objs, cb) {
        let list = [];
        for (let key in objs) {
            if (cb(objs[key], key))
                list.push(objs[key]);
        }
        return list;
    }
    static slice(objs, ...keys) {
        return keys.map(key => objs[key]);
    }
    static forEach(objs, cb) {
        for (let key in objs) {
            cb(objs[key], key);
        }
    }
    static every(objs, cb) {
        for (let key in objs) {
            if (!cb(objs[key], key))
                return false;
        }
        return true;
    }
    static includes(objs, cb) {
        for (let key in objs) {
            if (cb(objs[key], key))
                return true;
        }
        return false;
    }
    static fill(objs, data) {
        if (Array.isArray(objs)) {
            return objs.fill(data);
        }
        for (let key in objs) {
            objs[key] = data;
        }
        return objs;
    }
    /** json */
    static JsonParse(obj) {
        if (!obj) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     * json转xml
     * @param obj json对象,
     * innerHTML是内容节点,
     * outerHTML是完全内容,
     * extendParam是内容参数(方便快速填充字符串参数),
     * tagName为替换标签头
     * @param elename 首节点名称
     * @param signal 符号,为了配合关键节点使用
     */
    static parseObjToXml(obj, elename, signal) {
        var attrStr = "", childrenStr = "";
        var head = "<" + elename, tail = "/>\n";
        var innerHTML = "";
        let outerHTML = "";
        var extendParam = "";
        if (!signal) {
            signal = "";
        }
        let objKeys = [];
        for (var k in obj) {
            if (k == signal + "innerHTML") {
                innerHTML = obj[k];
                continue;
            }
            if (k == signal + "outerHTML") {
                outerHTML = obj[k];
                continue;
            }
            if (k == signal + 'extendParam') {
                extendParam = obj[k];
                continue;
            }
            if (k == signal + "tagName") {
                continue;
            }
            if (obj[k] == undefined) {
                continue;
            }
            if (typeof obj[k] != "object") {
                attrStr += " " + k + "=\"" + obj[k] + "\"";
                tail = attrStr + "/>\n";
                continue;
            }
            objKeys.push(k);
        }
        for (let j = 0; j < objKeys.length; j++) {
            let k = objKeys[j];
            if (obj[k] instanceof Array) {
                for (var i = 0; i < obj[k].length; i++) {
                    let tagName = obj[k][i][signal + "tagName"];
                    childrenStr += this.parseObjToXml(obj[k][i], tagName ? tagName : k, signal);
                }
                tail = attrStr + ">\n" + childrenStr + "</" + elename + ">\n";
            }
            else {
                let tagName = obj[k][signal + "tagName"];
                childrenStr += this.parseObjToXml(obj[k], tagName ? tagName : k, signal);
                tail = attrStr + ">\n" + childrenStr + "</" + elename + ">\n";
            }
        }
        var pageXml;
        if (extendParam) {
            attrStr += " " + extendParam;
            tail = attrStr + ">\n" + childrenStr + "</" + elename + ">\n";
        }
        if (outerHTML) {
            tail = outerHTML + '\n';
            head = "";
        }
        else if (innerHTML) {
            tail = attrStr + ">" + innerHTML + "</" + elename + ">\n";
        }
        // else if (extendParam) {
        //     console.log(tail)
        //     tail = attrStr + "/>\n"
        // }
        var pageXml = head + tail;
        return pageXml;
    }
    /** 字符串排序 */
    static sortByStr(obj, attr) {
        if (obj == undefined)
            return undefined;
        return obj.sort((a, b) => {
            return a[attr] == b[attr] ? 0 : a[attr] > b[attr] ? 1 : -1;
        });
    }
    static maxObj(objs, calFunc, isHaveKey) {
        let maxData;
        let maxKey;
        let maxCal;
        for (let key in objs) {
            let cal = calFunc(objs[key]);
            if (!maxCal || maxCal < cal) {
                maxCal = cal;
                maxData = objs[key];
                maxKey = key;
            }
        }
        if (isHaveKey) {
            return { data: maxData, key: maxKey, result: maxCal };
        }
        return maxData;
    }
    static minObj(objs, calFunc, isHaveKey) {
        let minData;
        let minKey;
        let minCal;
        for (let key in objs) {
            let cal = calFunc(objs[key]);
            if (!minCal || minCal > cal) {
                minCal = cal;
                minData = objs[key];
                minKey = key;
            }
        }
        if (isHaveKey) {
            return { data: minData, key: minKey, result: minCal };
        }
        return minData;
    }
    static getTimeNow(splice) {
        let time = new Date();
        let year = time.getFullYear();
        let month = (100 + time.getMonth() + 1).toString().slice(1);
        let day = (100 + time.getDate()).toString().slice(1);
        let hour = (100 + time.getHours()).toString().slice(1);
        let min = (100 + time.getMinutes()).toString().slice(1);
        let sec = (100 + time.getSeconds()).toString().slice(1);
        let millisec = (1000 + time.getMilliseconds()).toString().slice(1);
        if (!splice)
            return [year, month, day, hour, min, sec, millisec];
        return `${year}${splice.day}${month}${splice.day}${day}${splice.day}${splice.dayTime}${hour}${splice.time}${min}${splice.time}${sec}${splice.time}${millisec}${splice.time}`;
    }
    /** 替换所有 */
    static replaceAll(str, target, replace) {
        var raRegExp = new RegExp(target.toString().replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
        str = str.toString().replace(raRegExp, replace.toString());
        return str;
    }
    /**
     * 替换所有(加强版)
     * 测试速度比正则表达快一半左右吧
     * @param str 需要替换字符串
     * @param vals 对照表
     * @param tag 关键符号(如$,@,H,L,D)
     * @returns
     */
    static replaceAllEX(str, vals, tag) {
        let newStr = "";
        let isTag = false;
        let addStr = "";
        let a = "";
        let mainKey = undefined;
        for (let i = 0; i < str.length; i++) {
            a = str[i];
            if (isTag) {
                addStr += a;
                if (vals[addStr] == undefined) {
                    if (mainKey) {
                        newStr += vals[mainKey];
                        i--;
                        mainKey = undefined;
                        addStr = "";
                        isTag = false;
                    }
                }
                else {
                    mainKey = addStr;
                }
            }
            else {
                if (tag.indexOf(a) != -1) {
                    addStr = a;
                    isTag = true;
                    if (vals[a] != undefined) {
                        mainKey = a;
                    }
                }
                else {
                    newStr += a;
                }
            }
        }
        if (isTag && mainKey) {
            newStr += vals[mainKey];
        }
        return newStr;
    }
    /** 替换官方用的bind,可以自带提示 */
    static jBind(func, bindData) {
        return func.bind(bindData);
    }
    /** 替换官方用的parse,加强提示 */
    static jParse(obj) {
        if (typeof obj == "string") {
            return JSON.parse(obj);
        }
        return obj;
        Object.assign;
    }
    /**
     * 快速删除数据多余元素
     * @param array 数组
     * @param spliceCheckFunc 检测是否需要删除的方法, true为需要删除,false为不需要删除
     * @returns 删除完多余的数组
     */
    static jSplice(array, spliceCheckFunc) {
        let newParent = [];
        for (let i = 0; i < array.length; i++) {
            if (spliceCheckFunc(array[i], newParent)) {
                continue;
            }
            newParent.push(array[i]);
        }
        return newParent;
    }
    /**
     * 递进大法
     * @param getProgressListFunc
     * @param targetList
     * @param isFloor  true为层级递进,false为钻孔递进
     * @returns
     */
    static JProgress(getProgressListFunc, targetList, isFloor) {
        if (!targetList || targetList.length == 0) {
            return;
        }
        // 层级递进
        if (isFloor) {
            let newList = [];
            for (let i = 0; i < targetList.length; i++) {
                let child = targetList[i];
                let data = getProgressListFunc(child);
                newList.push(...data || []);
            }
            this.JProgress(getProgressListFunc, newList);
        }
        // 钻孔递进
        else {
            for (let i = 0; i < targetList.length; i++) {
                let child = targetList[i];
                let data = getProgressListFunc(child);
                this.JProgress(getProgressListFunc, data || []);
            }
        }
    }
    /**
     * 逆转大法,大量测试速度比原生慢一半,但是胜在不污染数据源
     * @param list 数据源
     * @returns
     */
    static JReverse(list) {
        let newList = [];
        let len = list.length - 1;
        for (let i = len; i >= 0; i--) {
            newList.push(list[i]);
        }
        return newList;
    }
}
/** 转md5 */
ObjUtil.transMd5 = ObjUtil_MD5;
function ObjUtil_MD5(content) {
    /*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */
    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_md5(s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }
    function b64_md5(s) { return binl2b64(core_md5(str2binl(s), s.length * chrsz)); }
    function str_md5(s) { return binl2str(core_md5(str2binl(s), s.length * chrsz)); }
    function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
    function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
    function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }
    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test() {
        return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function core_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }
    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16)
            bkey = core_md5(bkey, key.length * chrsz);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    }
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }
    /*
     * Convert an array of little-endian words to a string
     */
    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
        return str;
    }
    /*
     * Convert an array of little-endian words to a hex string.
     */
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }
    /*
     * Convert an array of little-endian words to a base-64 string
     */
    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32)
                    str += b64pad;
                else
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }
    return hex_md5(content);
}
/**
 * 坐标工具类
 */
class PosUtil {
    /**
     *
     * @author 不是Jeef
     * @param pLine
     * @param pLine02
     * @param pOut
     */
    //第一个参数是直线上的任意一个点的坐标。
    //第二个参数是直线上不同于第一个点的任意一个点的坐标。
    //第三个参数是直线外的一个点。
    //返回直线外的一个点在线段上的投影。
    GetProjectivePoint(pLine, pLine02, pOut) {
        var k = (pLine.y - pLine02.y) / (pLine.x - pLine02.x);
        var pProject = { x: 0, y: 0 };
        if (k == 0) //垂线斜率不存在情况 
         {
            pProject.x = pOut.x;
            pProject.y = pLine.y;
        }
        //当向量垂直的时候。
        else if (pLine.x == pLine02.x) {
            pProject.x = pLine.x;
            pProject.y = pOut.y;
        }
        else {
            pProject.x = (k * pLine.x + pOut.x / k + pOut.y - pLine.y) / (1 / k + k);
            pProject.y = -1 / k * (pProject.x - pOut.x) + pOut.y;
        }
        return pProject;
    }
}
/** 1度的弧度 */
PosUtil.oneAngle = Math.PI / 180;
/** 0.1度的弧度 */
PosUtil.oneTenthAngle = 0.1 * Math.PI / 180;
// !cut Base====================================================================================
/**
 * 获取中心点
 * @param posA 坐标A
 * @param posB 坐标B
 * @returns 中心坐标
 */
PosUtil.getCenterPos = PosUtil_Base.prototype.getCenterPos;
/**
 * 坐标相加
 * @param vecA 向量坐标A
 * @param vecB 向量坐标B
 * @returns x,y相加后的坐标
 */
PosUtil.getAdd = PosUtil_Base.prototype.getAdd;
/**
 * 坐标相减(posA-posB)
 * @param vecA 向量坐标A
 * @param vecB 向量坐标B
 * @returns x,y相减后的坐标
 */
PosUtil.getSub = PosUtil_Base.prototype.getSub;
/**
* 获取两点坐标平方距离(一般用来减少距离运算)
* @param posA 坐标A
* @param posB 坐标B
* @returns 平方距离
*/
PosUtil.getPowDistance = PosUtil_Base.prototype.getPowDistance;
/**
* 获取两点的距离
* @param posA 坐标A
* @param posB 坐标B 可为空,为空时看作单位向量
* @param num 保留的小数位数
* @returns 距离
*/
PosUtil.getDistance = PosUtil_Base.prototype.getDistance;
/**
 * 获取弧度 当点坐标相同时的时候返回null
 * @param posStart 起点
 * @param posEnd 终点,可为空,空为向量
 * @param num 保留的小数位数
 * @returns 弧度值
 */
PosUtil.getRadian = PosUtil_Base.prototype.getRadian;
/**
* 求两个向量夹角
* @param _vector1
* @param _vector2
* @returns 弧度
*/
PosUtil.getAngleFrom2Vector = PosUtil_Base.prototype.getAngleFrom2Vector;
/**
 * 向量旋转特定的角度的自定义函数
 * @param _vec3 向量
 * @param _angle 旋转的弧度
 * @returns
 */
PosUtil.vectorTurnRadian = PosUtil_Base.prototype.vectorTurnRadian;
/**
 * 通过弧度返回向量
 * @param radian
 * @return 返回单位向量
 */
PosUtil.getVectorByRadian = PosUtil_Base.prototype.getVectorByRadian;
/**
 * 获取移动的坐标
 * @param distance 距离
 * @param radian 弧度
 * @param targetPos 需要移动的坐标,默认0,0
 * @returns 移动后的坐标
 */
PosUtil.getMovePos = PosUtil_Base.prototype.getMovePos;
/**
 * 获取角度 当点坐标相同时的时候返回null
 * @param posStart 起点
 * @param posEnd 终点
 * @param num 保留的小数位数
 * @returns 角度值
 */
PosUtil.getAngle = PosUtil_Base.prototype.getAngle;
/**
* 角度转弧度
* @param angle 角度
* @returns 弧度值
*/
PosUtil.getRadianByAngle = PosUtil_Base.prototype.getRadianByAngle;
/**
 * 弧度转角度
 * @param radian 弧度
 * @returns 角度值
 */
PosUtil.getAngleByRadian = PosUtil_Base.prototype.getAngleByRadian;
/**
 * 射线算法
 * @param pos 射线的起点
 * @param radian 射线弧度
 * @param distance 射线距离
 * @returns 射点坐标
 */
PosUtil.getRayPos = PosUtil_Base.prototype.getRayPos;
/**
 * 根据方向点和距离获取偏移点
 * @param pos 射线的起点
 * @param radianPos 在偏移方向上的点
 * @param distance 偏移距离
 * @returns 射点坐标
 */
PosUtil.getOffsetPos = PosUtil_Base.prototype.getOffsetPos;
/**
* 三角距离确定弧度(弧度为A与B夹角即c角)
* @param startD 起始边长
* @param endD  结束边长
* @param centerD  夹角边长
* @returns 夹角弧度
*/
PosUtil.getTriangleRadianByDistance = PosUtil_Base.prototype.getTriangleRadianByDistance;
/**
 * 三点确定弧度,只能求三角形内角
 * @param otherPA 起始坐标
 * @param otherPB 结束坐标
 * @param centerP 夹角坐标坐标
 * @returns 夹角弧度
 */
PosUtil.getTriangleRadianByPosArr = PosUtil_Base.prototype.getTriangleRadianByPosArr;
/**
* 三线长度确定面积
* @param distanceA 边长A
* @param distanceB 边长B
* @param distanceC 边长C
* @returns 面积
*/
PosUtil.getTriangleAreaByDistance = PosUtil_Base.prototype.getTriangleAreaByDistance;
/**
 * 获取三角形面积
 * @param posA 坐标A
 * @param posB 坐标B
 * @param posC 坐标C
 * @returns 面积
 */
PosUtil.getTriangleArea = PosUtil_Base.prototype.getTriangleArea;
/**
 * 获取三角形重心
 * @param posA 坐标A
 * @param posB 坐标B
 * @param posC 坐标C
 * @returns 重心坐标
 */
PosUtil.getTriangleGavityPos = PosUtil_Base.prototype.getTriangleGavityPos;
/**
 * 获取通过矩阵转换的点
 * @param p 坐标
 * @param m 矩阵
 * @returns 坐标点
 */
PosUtil.getTransformPos = PosUtil_Base.prototype.getTransformPos;
/**
 * 获取通过矩阵转换的点数组
 * @param pArr 坐标组
 * @param m 矩阵
 * @returns 坐标数组
 */
PosUtil.getTransformPosArr = PosUtil_Base.prototype.getTransformPosArr;
/**
 * 获取通过逆矩阵转换的点
 * @param p 坐标
 * @param m 矩阵
 * @returns 坐标点
 */
PosUtil.getInvertPos = PosUtil_Base.prototype.getInvertPos;
/**
 * 获取通过逆矩阵转换的点
 * @param pArr 坐标组
 * @param m 矩阵
 * @returns 坐标数组
 */
PosUtil.getInvertPosArr = PosUtil_Base.prototype.getInvertPosArr;
/**
 * 获取夹角,可求任意三点的内外角
 * @param posStart 起始点
 * @param posCenter 两线夹点
 * @param posEnd 结束点
 * @returns 折角弧度值
 */
PosUtil.getIncludedRadian = PosUtil_Base.prototype.getIncludedRadian;
/**
 * 向量标准化
 * @param vector
 */
PosUtil.getNormalize = PosUtil_Base.prototype.getNormalize;
/**
 * 点乘
 * @param vectorA
 * @param vectorB
 */
PosUtil.getMultiply = PosUtil_Base.prototype.getMultiply;
/**
 * 相反
 * @param vector
 */
PosUtil.getOppsite = PosUtil_Base.prototype.getOppsite;
/**
 * 叉乘
 * @param vectorA
 * @param vectorB
 */
PosUtil.getCross = PosUtil_Base.prototype.getCross;
/**
 * 投影
 * @author 不是Jeef
 * @param targetVec 需要投影的向量
 * @param otherVec 投影用的向量
 */
PosUtil.getProjection = PosUtil_Base.prototype.getProjection;
/**
 * 判断两条由两点形成的直线是否相交
 * @param lineAStart 直线A起点
 * @param lineAEnd 直线A终点
 * @param lineBStart 直线B起点
 * @param lineBEnd 直线B终点
 * @returns 相交不为0, 不相交为0
 */
PosUtil.isIntersect = PosUtil_Base.prototype.isIntersect;
/**
 * 计算两条由两点形成的线段或直线相交点
 * @param lineAStart 直线A起点
 * @param lineAEnd 直线A终点
 * @param lineBStart 直线B起点
 * @param lineBPosEnd 直线B终点
 * @param isStraight 是否为直线,默认为true
 * @returns 相交坐标 线段不相交为null
 */
PosUtil.getIntersect = PosUtil_Base.prototype.getIntersect;
// !cut Arc====================================================================================
/**
 * 判断弧度时候在圆弧范围内
 * @param targetRadian 目标弧度
 * @param startRadian 圆弧开始弧度
 * @param endRadian 圆弧结束弧度
 * @param isReverse 是否翻转
 */
PosUtil.isRadianInArc = PosUtil_Arc.prototype.isRadianInArc;
/**
 * 获取弧形真正弧度数据
 * @param this
 * @param startRadian 圆弧开始弧度
 * @param endRadian 圆弧结束弧度
 * @param isReverse 是否翻转
 */
PosUtil.getArcRealRadian = PosUtil_Arc.prototype.getArcRealRadian;
/**
 * 通过步进获取圆弧的点集合
 * @param this
 * @param arc 圆弧对象
 * @param step 步进
 */
PosUtil.getArcPArrByStep = PosUtil_Arc.prototype.getArcPArrByStep;
/**
* 通过个数获取圆弧的点集合
* @param this
* @param arc 圆弧对象
* @param count 个数
*/
PosUtil.getArcPArrByCount = PosUtil_Arc.prototype.getArcPArrByCount;
/**
* 线转弧
* @param start 线起点
* @param end 线终点
* @param distance 圆弧中心点的距离线的垂直高度,可为负值,圆心会不同,绝对值大于半径为大弧,小于半径为小弧
* @returns 标准的画布弧数据
*/
PosUtil.getLineToArc = PosUtil_Arc.prototype.getLineToArc;
/**
* 圆弧转直线
* @param center 圆弧圆心坐标
* @param radius 圆弧的半径
* @param startAngle 圆弧的起始角度,用弧度制
* @param endAngle 圆弧的终止角度,用弧度制
* @returns 标准线数据{start,end}
*/
PosUtil.getArcToLine = PosUtil_Arc.prototype.getArcToLine;
/**
 * 获取圆弧的点集合
 * @param center 中心点
 * @param radius 半径
 * @param startAngle 起始弧度
 * @param endAngle 终止弧度
 * @param isCounterClockwise 是否逆时针(画布框架矩阵有可能会颠倒)
 * @param step 步进长度,默认0.1
 * @returns 圆弧点集合
 */
PosUtil.getArcPosArr = PosUtil_Arc.prototype.getArcPosArr;
/**
 * 通过三角点确定一个圆弧,
 * @param startP 三角起点
 * @param endP 三角终点
 * @param centerP 三角夹角点
 * @param radius 圆弧半径,过大,可能切点会脱离三点范围(看成直线)
 * @returns 标准canvas数据
 */
PosUtil.getArcByTriangle = PosUtil_Arc.prototype.getArcByTriangle;
/**
* 获取圆弧夹角
* @param obj 圆弧数据
* @returns 夹角弧度
*/
PosUtil.getArcRadian = PosUtil_Arc.prototype.getArcRadian;
/**
 * 获取圆弧的周长
 * @param obj 圆弧数据
 * @returns 圆弧周长
 */
PosUtil.getArcPerimeter = PosUtil_Arc.prototype.getArcPerimeter;
/**
 * 获取圆弧横截面积
 * @param obj
 */
PosUtil.getArcCrossArea = PosUtil_Arc.prototype.getArcCrossArea;
/**
 * ! 通过步进和个数获取圆弧的点集合(不能用在开发使用,仅在此工具类内部使用)
 * @param this
 * @param arc 圆弧对象
 * @param data 个数和步进
 * @returns 返回点数组
 */
PosUtil._getArcPArrByStepAndCount = PosUtil_Arc.prototype._getArcPArrByStepAndCount;
/**
* 圆弧转转角
* @param this
* @param arc 圆弧数据
* @returns 返回起点,转角点,终点三个坐标
*/
PosUtil.arcTransCorner = PosUtil_Arc.prototype.arcTransCorner;
/**
 * 圆弧转终点
 * @param this
 * @param arc 圆弧数据
 * @returns 返回起点,弦高点,终点
 */
PosUtil.getArc3pts = PosUtil_Arc.prototype.getArc3pts;
// !cut Geo====================================================================================
/**
  * 获取面积(通过三角面积公式)
  * @param posArr 坐标点集合
  * @returns 面积值
  */
PosUtil.getArea = PosUtil_Geo.prototype.getArea;
/**
 * 获取旋转点坐标 绕中心点旋转
 * @param centerPos 围绕的中心点
 * @param targetPos 目标点
 * @param radian 旋转的弧度
 * @returns 旋转后的点
 */
PosUtil.getRotatePos = PosUtil_Geo.prototype.getRotatePos;
/**
 * 获取旋转点坐标组 绕中心点旋转
 * @param centerPos 围绕的中心点
 * @param targetPosArr 目标点集合
 * @param radian 旋转的弧度
 * @returns 旋转后的点数组
 */
PosUtil.getRotatePosArr = PosUtil_Geo.prototype.getRotatePosArr;
/**
 * 获取角度拨正值
 * @param angle 角度
 * @param isAbs 绝对正,得到值必为为正,否则一半180,一半180,默认fasle
 * @returns 角度值
 */
PosUtil.getAbsAngle = PosUtil_Geo.prototype.getAbsAngle;
/**
 * 获取弧度拨正值
 * @param radian 弧度
 * @param isAbs 绝对正,得到值必为为正(0~360),否则一半正180,一半负180,默认false
 * @returns 弧度值
 */
PosUtil.getAbsRadian = PosUtil_Geo.prototype.getAbsRadian;
/**
 * 获取坐标组中最大最小坐标
 * @param posArr 坐标数组
 * @returns  数组[max,min]
 */
PosUtil.getLimitPosArr = PosUtil_Geo.prototype.getLimitPosArr;
/**
 * 两点获取矩形 顺序的话由左上向右递归
 * @param firstPos 第一个点坐标
 * @param lastPos 对角点坐标
 * @returns 数组[p1,p2,p3,p4]
 */
PosUtil.getRectByTwoPos = PosUtil_Geo.prototype.getRectByTwoPos;
/**
 * 获取带圆弧的矩形的数据信息
 * @param startP 起点
 * @param w 宽度
 * @param h 高度
 * @param rx 圆弧x半径
 * @param ry 圆弧y半径,暂不开放
 */
PosUtil.getRectArcData = PosUtil_Geo.prototype.getRectArcData;
/**
 * 坐标是否相同
 * @param posA 坐标A
 * @param posB 坐标B
 * @param errorValue 误差值,默认0.0001
 * @returns 是否相同
 */
PosUtil.isSamePos = PosUtil_Geo.prototype.isSamePos;
/**
 * 弧度是否相同(先调整弧度为正常值再比较)
 * @param radianA 弧度A
 * @param radianB 弧度B
 * @param errorValue 误差值,默认0.0001
 * @returns 是否相同
 */
PosUtil.isSameRadian = PosUtil_Geo.prototype.isSameRadian;
/**
 * 移动坐标集合
 * @param deltaPos 偏移的坐标
 * @param posArr 坐标集合
 * @returns 新的坐标集合
 */
PosUtil.translate = PosUtil_Geo.prototype.translate;
/**
 * 坐标是否在当前图形里
 * @param pos 当前坐标
 * @param geo 图形坐标集合(有序)
 * @param errorVal 误差值,增加误差值会带来计算负担,不是需求请不要填
 * @returns 是否在里面 0代表在外面,1代表在里面,-1代表在线上
 */
PosUtil.isPosInGeo = PosUtil_Geo.prototype.isPosInGeo;
/**
 * 获取包围盒
 * @param posArr 坐标集合
 * @returns 对象{起点,宽,高}
 */
PosUtil.getHitBox = PosUtil_Geo.prototype.getHitBox;
/**
 * 获取闭合图形之间的关系
 * @param this
 * @param targetGeo
 * @param otherGeo
 * @returns 不相交为0,包括为1,被包括为2,存在点在闭合图形为2,闭合图形没有点存在但有切割为-2
 */
PosUtil.getGeoGeoRelation = PosUtil_Geo.prototype.getGeoGeoRelation;
/**
* 获取两个矩形的关系
* @param startRect
* @param endRect
* @returns same 完全一致;inInclude endRect包含startRect;outInclude startRect包含endRect;noShip 没有任何相交;halfInclude 互相相交且至少一方包含对方部分的点;onlyCut 互相相交且彼此没包含对方的任意点;onePint 仅有一点重合且不包含不相交;near 仅相切且不包含不相交
*/
PosUtil.getTwoRectRelationship = PosUtil_Geo.prototype.getTwoRectRelationship;
// !cut Line====================================================================================
/**
* 根据长度获取直线上的一点
* @param lineStart 线段起点
* @param lineEnd 线段终点
* @param distance 要去的线段长度
* @returns 线上坐标
*/
PosUtil.getPosByLineDistance = PosUtil_Line.prototype.getPosByLineDistance;
/**
 * 根据百分比获取某条线段上某点坐标
 * @param lineStart 线段起点
 * @param lineEnd 线段终点
 * @param per 百分比
 * @returns 线上坐标
 */
PosUtil.getPosByLinePer = PosUtil_Line.prototype.getPosByLinePer;
/**
 * 求点与直线垂直相交点
 * @param targetPos 目标点
 * @param lineStart 线段起点
 * @param lineEnd 线段终点
 * @returns 相交坐标
 */
PosUtil.getRightAngleIntersect = PosUtil_Line.prototype.getRightAngleIntersect;
/**
 * 删除同点的线
 * @param lineArr 线段集合
 */
PosUtil.removeSamePosLine = PosUtil_Line.prototype.removeSamePosLine;
/** 判断点是否在线段内
 * @param errorValue 误差距离 默认0.001
 * @returns 不在为undefined,在为距离值
 */
PosUtil.isInLine = PosUtil_Line.prototype.isInLine;
/**
 * 判断点是否在弧线内
 * @param center 弧的圆心
 * @param radius 弧的半径
 * @param startAngle 弧的起始弧
 * @param endAngle 弧的终止弧
 * @param isCounterClockwise 是否逆时针,默认false
 * @param targetPos 目标点
 * @param errorValue 误差值,默认0.001
 * @returns 不在为undefined,在为距离值
 */
PosUtil.isInArcLine = PosUtil_Line.prototype.isInArcLine;
/**
 * 获取线延长线
 * @param line 线段
 * @param distance ,默认999999999
 * @returns 数组[posStart,posEnd]
 */
PosUtil.getlongLine = PosUtil_Line.prototype.getlongLine;
/**
* 获取同向的线段
* @param templateLine 模板线
* @param targetLine 目标线
* @returns 目标线的正反
*/
PosUtil.getSameTrendLine = PosUtil_Line.prototype.getSameTrendLine;
/**
 * 判断点在线段内外 点必须在直线上
 * @param lineStart 线段起点
 * @param lineEnd 线段终点
 * @param targetPos 目标坐标
 * @returns 是否在内外
 */
PosUtil.isLineOut = PosUtil_Line.prototype.isLineOut;
/**
 * 获取圆弧度直径线段
 * @param centerPos 中心点
 * @param radius 半径
 * @param radian 弧度
 * @returns 线坐标[lineStart,lineEnd]
 */
PosUtil.getLineByCenterPos = PosUtil_Line.prototype.getLineByCenterPos;
/**
 * 弧度是否平行
 * @param radianA 弧度A
 * @param radianB 弧度B
 * @param errorValue 误差范围,默认0.0001
 * @returns 是否平行
 */
PosUtil.isParallelRadian = PosUtil_Line.prototype.isParallelRadian;
/**
 * 判断投影点是否在线段范围之内
 * @param targetPos
 * @param lineStart
 * @param lineEnd
 * @returns 0 为在线段内,-1为在线段起点附近,1为在线段终点附近,-0.5为线段起点,0.5为线段终点
 */
PosUtil.isprojectPInLine = PosUtil_Line.prototype.isprojectPInLine;
/**
 * 获取点到线段最近的点
 * @param targetPos 目标点
 * @param lineStart 线段起点
 * @param lineEnd 线段终点
 * @return 最近点坐标
 */
PosUtil.getPointToLinePos = PosUtil_Line.prototype.getPointToLinePos;
/**
 * 获取直线的垂直偏移
 * @param start 线段起点
 * @param end 线段终点
 * @param distance 偏移距离
 * @returns 数组[start,end]
 */
PosUtil.getLineVerticalOffset = PosUtil_Line.prototype.getLineVerticalOffset;
/**
 * 获取直线上某点垂直偏移的坐标
 * @param start 线段起点
 * @param end 线段终点
 * @param pt 目标点
 * @param distance 偏移距离
 * @returns 偏移坐标
 */
PosUtil.getLineDistancePos = PosUtil_Line.prototype.getLineDistancePos;
/**
 * 获取线段中心垂直偏移坐标
 * @param start 线段起点
 * @param end 线段终点
 * @param distance 偏移距离
 * @returns 偏移坐标
 */
PosUtil.getCenterDistancePos = PosUtil_Line.prototype.getCenterDistancePos;
/**
* 是否同方向
* @param lineAStart 如果为向量,可为undefined
* @param lineAEnd 如果为向量,则为向量值
* @param lineBStart 如果为向量,可为undefined
* @param lineBEnd 如果为向量,则为向量值
* @returns 数值,大于等于0为同向,小于0为反向
*/
PosUtil.isSameDirection = PosUtil_Line.prototype.isSameDirection;
/**
* 获取两个坐标沿某直线弧度的偏移距离
* @param start 如果为向量,可为undefined
* @param end 终点,如果为向量,则为向量值
* @param radian 某直线弧度
* @返回 正反距离
*/
PosUtil.getOffsetDistance = PosUtil_Line.prototype.getOffsetDistance;
/**
 * 线转弧,重写线转弧线
 * @param start 线起点
 * @param end 线终点
 * @param distance 圆弧中心点的距离线的垂直高度,可为负值,圆心会不同,绝对值大于半径为大弧,小于半径为小弧
 *
 */
PosUtil.lineToArc = PosUtil_Line.prototype.lineToArc;
/**
 * 判断线段与线段是否相交(在直线相交基础上强化),只能判断线段,不能判断直线
  * @param lineAStart 线段A起点
 * @param lineAEnd 线段A终点
 * @param lineBStart 线段B起点
 * @param lineBEnd 线段B终点
 * @returns 相交true,不相交false
 */
PosUtil.isLineCrossLine = PosUtil_Line.prototype.isLineCrossLine;
/**
 * 判断点在直线左边还是右边
 * @param lineStart 直线起点
 * @param lineEnd  直线终点
 * @param targetP 目标点
 * @returns 0为在直线上,-1和1在左右
 */
PosUtil.checkPointByLineLeftRight = PosUtil_Line.prototype.checkPointByLineLeftRight;
/**
 * 求点与直线垂直距离
 * @param targetP 目标点
 * @param lineStart 直线起点
 * @param lineEnd 直线终点
 * @param isNoAbs 是否不需要绝对值,默认false
 * @returns 距离
 */
PosUtil.getRightAngleDistance = PosUtil_Line.prototype.getRightAngleDistance;
/**
 * 快速获取延长线(用于直线计算,减少运算量)
 * @param this
 * @param line 线段
 * @param ratio 向量倍数,默认99999999999
 * @returns 数组[posStart,posEnd]
 */
PosUtil.quickGetLongLine = PosUtil_Line.prototype.quickGetLongLine;
/**
 * 循环线条
 * @param pArr 闭合坐标点集合
 * @param cb 循环线的回调方法
 */
PosUtil.loopLines = PosUtil_Line.prototype.loopLines;
/**
* 获取循环线
* @param pArr 闭合坐标点集合
* @returns 循环线 [起点,终点][]
*/
PosUtil.getLoopLines = PosUtil_Line.prototype.getLoopLines;
// !cut Extends====================================================================================
/**
 * 获取居中旋转的矩阵
 * @param obj 旋转所需要的对象
 * @returns 矩阵number[]
 */
PosUtil.getCenterRotateTransform = PosUtil_Extends.prototype.getCenterRotateTransform;
/**
 * 获取圆弧的的中心点
 * @param startPos 起点
 * @param endPos 结束点
 * @param r 半径
 * @returns 中心坐标,起点终点对调,会有不同的中心点,谨记!
 */
PosUtil.getArcCenterPos = PosUtil_Extends.prototype.getArcCenterPos;
/**
 * 已知斜边两点,求等腰直角的点
 * @param leftPos 左腰点
 * @param rightPos 右腰点
 * @returns 等腰直角的顶点
 */
PosUtil.getIsoscelesRightAngle = PosUtil_Extends.prototype.getIsoscelesRightAngle;
/**
 * 计算两条由两点组成直线平移后相交点 lineBDistance为空时,默认为lineADistance
 * @param lineAStart 直线A的起点
 * @param lineAEnd 直线A的终点
 * @param lineBStart 直线B的起点
 * @param lineBEnd 直线B的终点
 * @param lineADistance 直线A平移距离
 * @param lineBDistance 直线B平移距离,没有将默认和A一样
 * @returns 相交的点,如果直线为相同的点,返回空
 */
PosUtil.getIntersectPosByMove = PosUtil_Extends.prototype.getIntersectPosByMove;
/**
 * 获得圆与直线相交点
 * @param lineStart 直线的开头
 * @param lineEnd  直线的结尾
 * @param r  半径
 * @param centerPos 圆心
 * @returns 数组[正方向坐标,负方向坐标],没相交undefined,相切为[同坐标,同坐标]
 */
PosUtil.getCircleLineIntersect = PosUtil_Extends.prototype.getCircleLineIntersect;
/**
 * 获得线段与弧线离起最近的相交点，
 * @param lineStart 直线的开头
 * @param lineEnd  直线的结尾
 * @param arcStart  弧点
 * @param startAngle  起始角度
 * @param angle  旋转角度
 * @param r  半径
 * @returns pos
 */
PosUtil.getLineArcIntersect = PosUtil_Extends.prototype.getLineArcIntersect;
/**
 * 根据新的圆上的点和当前弧线获得新的弧线，
 * @param newPoint 圆上的任意点
 * @param arcStart 原弧点
 * @param startAngle  起始角度
 * @param angle  旋转角度
 * @param r  半径
 * @param isStart  是否用任意点当起点
 */
PosUtil.getArcByNewPoint = PosUtil_Extends.prototype.getArcByNewPoint;
/**
 * 圆圆相交
 * @param mainR 主要圆半径
 * @param mainCenter 主要圆点坐标
 * @param otherR 辅助相切圆半径
 * @param otherCenter 辅助相切圆点坐标
 * @returns 数组[正方向坐标,负方向坐标],没相交undefined,相切为[同坐标,同坐标]
 */
PosUtil.getCircleCircleIntersect = PosUtil_Extends.prototype.getCircleCircleIntersect;
/**
 * 获取两点的沿同个弧度方向的距离
 * @param posA 点A
 * @param posB 点B
 * @param radian 弧度方向
 * @param isAbs 是否有正负值
 * @returns 距离
 */
PosUtil.getTwoPosRadianDistance = PosUtil_Extends.prototype.getTwoPosRadianDistance;
/**
 * 判断线段集合和线段集合是否存在相交情况
 * @param targetPosArr 目标线段集合
 * @param isTargetClose 目标线段集合是否闭合(看作多边形)
 * @param otherPosArr 其他线段集合
 * @param isOtherClose 其他线段集合是否闭合(看作多边形)
 * @returns 只要有相交就true,否则false
 */
PosUtil.isLinesCrossLines = PosUtil_Extends.prototype.isLinesCrossLines;
/**
 * 点集合是否在图形里面
 * @param posArr 点坐标集合
 * @param geo 图形坐标集合
 * @param isAbsInclude 是否完全包括(不完全包括可以理解为只要有个点在里面都为true),默认false
 * @returns 是否在里面
 */
PosUtil.isPosArrInGeo = PosUtil_Extends.prototype.isPosArrInGeo;
/**
 * 图形是否在当前图形里
 * @param targetGeo 目标图形
 * @param otherGeo 当前图形
 * @param isAbsInclude 是否完全包括(不完全包括可以理解为允许切割),默认false
 * @param isOppsite 是否需要判断反向框选(不完全包围才有效),默认false
 * @returns 是否在里面
 */
PosUtil.isGeoInGeo = PosUtil_Extends.prototype.isGeoInGeo;
/**
 * 获取多边形周长
 * @param objs 多边形数据
 * @param isNoClose 是否闭合
 * @returns 周长
 */
PosUtil.getPolygonPerimeter = PosUtil_Extends.prototype.getPolygonPerimeter;
/**
 * 获取多边形面积
 * @param objs 多边形数据
 * @returns 面积
 */
PosUtil.getPolygonArea = PosUtil_Extends.prototype.getPolygonArea;
/**
 * 未完成,请不要使用
 * @param this
 * @param p
 * @param objs
 */
PosUtil.isPosInArcLineArr = PosUtil_Extends.prototype.isPosInArcLineArr;
/**
 * 未完成,请不要使用
 * @param this
 * @param radian
 * @param delta
 */
PosUtil.getDeltaDistance = PosUtil_Extends.prototype.getDeltaDistance;
/**
 * 画布圆弧转svg圆弧
 * @param canvasArc 画布圆弧对象
 * @return svg圆弧对象
 */
PosUtil.canvasArcTransSvgArc = PosUtil_Extends.prototype.canvasArcTransSvgArc;
/**
 * 未完成,请不要使用
 * @param this
 * @param svgArc
 */
PosUtil.svgArcTransCanvasArc = PosUtil_Extends.prototype.svgArcTransCanvasArc;
/**
 * 通过包围碰撞盒集合获取大的包围碰撞盒
 * @param this
 * @param hitBoxes
 */
PosUtil.getHitBoxByHitBoxes = PosUtil_Extends.prototype.getHitBoxByHitBoxes;
// !cut 贝塞尔==================================================================
/** 1阶贝塞尔曲线公式 */
PosUtil._onebsr = PosUtil_Bezier.prototype._onebsr;
/** 1阶贝塞尔
 * @param t 当前百分比
 * @param p1 起点
 * @param p2 终点
 */
PosUtil._oneBezier = PosUtil_Bezier.prototype._oneBezier;
/**
* 2阶贝塞尔转离散点
* @param p1 起点
* @param p2 终点
* @param average 均分的数量
* @returns
*/
PosUtil.getPointsByOneBezier = PosUtil_Bezier.prototype.getPointsByOneBezier;
/** 2阶贝塞尔曲线公式 */
PosUtil._twobsr = PosUtil_Bezier.prototype._twobsr;
/**
 * 2阶贝塞尔
 * @param t 当前百分比
 * @param p1 起点
 * @param p2 终点
 * @param p3 控制点
 */
PosUtil._twoBezier = PosUtil_Bezier.prototype._twoBezier;
/**
 * 2阶贝塞尔转离散点
 * @param p1 起点
 * @param p2 终点
 * @param p3 控制点
 * @param average 均分的数量
 * @returns
 */
PosUtil.getPointsByTwoBezier = PosUtil_Bezier.prototype.getPointsByTwoBezier;
/** 3阶贝塞尔曲线公式 */
PosUtil._threebsr = PosUtil_Bezier.prototype._threebsr;
/**
* 3阶贝塞尔
* @param t 当前百分比
* @param p1 起点
* @param p2 终点
* @param p3 控制点1
* @param p4 控制点2
*/
PosUtil._threeBezier = PosUtil_Bezier.prototype._threeBezier;
/**
 * 3阶贝塞尔转离散点
 * @param p1 起点
 * @param p2 终点
 * @param p3 控制点1
 * @param p4 控制点2
 * @param average 均分的数量
 * @returns
 */
PosUtil.getPointsByThreeBezier = PosUtil_Bezier.prototype.getPointsByThreeBezier;
/** 圆弧转贝塞尔曲线 */
PosUtil.arcToBezier = PosUtil_Bezier.prototype.arcToBezier;
/** 坐标工具实例 */
/** 撤销还原类 */
class JUndoRedo {
    /**
     * 撤销还原类
     * @param maxLength 保存的数据数组长度
     */
    constructor(maxLength = 20) {
        this.maxLength = maxLength;
        /** 缓存数据数组 */
        this.cacheArr = [];
        /** 当前位置 */
        this._currentLocation = -1;
        /** 触发事件,撤销或还原或跳转都会触发 */
        this.doEvent = new JEventEmit();
        /** 添加触发的事件,添加时候触发 */
        this.addEvent = new JEventEmit();
        /** 是否为前置模式,true为先保存后操作,false为先操作后保存 */
        this.isFrontMode = false;
    }
    get currentLocation() { return this._currentLocation; }
    /**
     * 添加缓存
     * @param data 缓存数据
     * @param isCheck 是否需要判断
     */
    addCache(data, isCheck) {
        /** 砍掉当前位置后面的数据 */
        this.cacheArr.splice(this._currentLocation + (this.isFrontMode ? 0 : 1));
        this.cacheArr.push(data);
        /** 如果超过保存长度,需要删减 */
        if (this.cacheArr.length > this.maxLength)
            this.cacheArr.splice(0, 1);
        this._currentLocation = this.cacheArr.length - (this.isFrontMode ? 0 : 1);
        this.addEvent.emit(data);
    }
    /** 是否能够触发撤销 */
    isCanUndo() {
        return this.cacheArr.length > 0 && this.currentLocation >= 1;
    }
    /** 是否能够触发还原 */
    isCanRedo() {
        return this.cacheArr.length > 0 && this.currentLocation >= 0 && this.currentLocation < this.cacheArr.length - 1;
    }
    /**
     * 跳转
     * @param location 跳转位置,会强转整型
     * @returns 返回缓存数据,不符合返回undefined
     */
    jump(location) {
        /** 强转数字 */
        location = parseInt(location.toString());
        /** 不符合条件,不触发 */
        if (location < 0 || this.cacheArr.length == 0 || location >= this.cacheArr.length)
            return undefined;
        /** 保存对应的位置 */
        this._currentLocation = location;
        /** 触发事件 */
        this.doEvent.emit(this.cacheArr[location]);
        return this.cacheArr[location];
    }
    /**
     * 撤销
     * @returns 返回需要撤销的数据,没有返回undefined
     */
    undo() {
        if (!this.isCanUndo())
            return undefined;
        /** 后退一步 */
        this._currentLocation--;
        return this.jump(this._currentLocation);
    }
    /**
     * 还原
     * @returns 返回需要还原的数据,没有返回undefined
     */
    redo() {
        if (!this.isCanRedo())
            return undefined;
        /** 前进一步 */
        this._currentLocation++;
        return this.jump(this._currentLocation);
    }
    /** 清空 */
    clear() {
        this.cacheArr = [];
    }
}
/**
 * 快捷键类
 */
class JHotKey {
    /**
     * 快捷键类
     * @param dom 需要绑定的dom元素,没有将指定document.body
     * @param eventRouter 事件路由,用来指定触发事件的事件组所在位置
     * @param dataRouter 数据路由,用来指定改变数据的快捷键的数据所在位置
     */
    constructor(dom, eventRouter, dataRouter) {
        this.dom = dom;
        /** 事件路由,用来指定触发事件的事件组所在位置 */
        this.eventRouter = {};
        /** 数据路由,用来指定改变数据的快捷键的数据所在位置 */
        this.dataRouter = {};
        /** 监听开关 */
        this._listenON = true;
        /** 下一个id */
        this._nextID = 0;
        /** 快捷键数据字典 */
        this._KeyDict = {};
        /** 快捷键按下触发记录字典 */
        this._keyDownFuncDict = {};
        /** 需要删除原生映射的快捷键数据字典 */
        this._delOriginDict = {};
        if (!dom)
            this.dom = document.body;
        /** 需要开始事件监测 */
        else {
            this.dom.setAttribute("tabindex", "0");
        }
        if (eventRouter)
            this.eventRouter = eventRouter;
        else {
            this.eventRouter = new JEventEmitList().events;
        }
        if (dataRouter)
            this.dataRouter = dataRouter;
        this._bindListen();
    }
    /** 监听开关 */
    get listenON() { return this._listenON; }
    set listenON(data) {
        this._listenON = data;
    }
    /** 下一个id */
    get nextID() { this._nextID++; return this._nextID; }
    /** 快捷键数据字典 */
    get keyDict() { return this._KeyDict; }
    /** 按触发类型 */
    get keyType() { return this._keyType; }
    /** 当前按键 */
    get currentKey() { return this._currentKey; }
    set currentKey(data) {
        if (this._currentKey != data)
            for (let key in this._keyDownFuncDict)
                this._keyDownFuncDict[key] = false;
        this._currentKey = data;
    }
    /** 绑定监听 */
    _bindListen() {
        this.dom.addEventListener('keydown', (e) => {
            if (!this.listenON)
                return false;
            this._keyType = 'keydown';
            this.currentKey = `keydown ${e.key}`;
            this._dispactHotKey(e);
        });
        this.dom.addEventListener('keyup', (e) => {
            if (!this.listenON)
                return false;
            this._keyType = 'keyup';
            this.currentKey = `keyup ${e.key}`;
            this._dispactHotKey(e);
        });
    }
    /**
     * 触发快捷键
     * @param e 按键事件
     */
    _dispactHotKey(e) {
        this.ev = e;
        for (let key in this._KeyDict) {
            if (this._checkKeyData(this._KeyDict[key], e))
                this._doKeyFunc(this._KeyDict[key], e);
        }
    }
    /**
     * 获取小写的键值
     * @param e 按键事件
     */
    _getLowerCaseKey(e) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            return e.key.toLowerCase();
        }
        else {
            return e.key;
        }
    }
    /**
     * 检测快捷键对象是否可以触发
     * @param e 快捷键对象
     * @param obj 按键对象
     */
    _checkKeyData(obj, e) {
        if (this._keyDownFuncDict[obj.id])
            return false;
        if (obj.disabled)
            return false;
        if (obj.scence && (obj.scence != this.scence && obj.scence != this.secondScence && obj.scence != this.thirdScence))
            return false;
        if (obj.keyType != this.keyType)
            return false;
        if (obj.isCtrl && !e.ctrlKey && e.key != 'Control')
            return false;
        if (obj.isAlt && !e.altKey && e.key != 'Alt')
            return false;
        if (obj.isShift && !e.shiftKey && e.key != 'Shift')
            return false;
        if (obj.otherKey == undefined)
            return true;
        /** 有的话返回对应的判断 */
        if (typeof (obj.otherKey) == "number")
            return obj.otherKey == e.keyCode;
        return obj.otherKey == this._getLowerCaseKey(e);
    }
    /**
     * 触发按键的功能
     * @param obj 快捷键对象
     * @param e 键盘事件
     */
    _doKeyFunc(obj, e) {
        switch (obj.funcType) {
            case "data":
                this._doData(obj);
                break;
            case "event":
                this._doEvent(obj, e);
                break;
            default:
                this._doEvent(obj, e);
                break;
        }
        if (obj.keyType == "keydown" && !obj.isDownSutainable) {
            this._keyDownFuncDict[obj.id] = true;
        }
    }
    /**
     * 触发事件
     * @param obj 快捷键对象
     * @param e 键盘事件
     * @returns 如果不成功返回false,成功返回true
     */
    _doEvent(obj, e) {
        /** 当前索引事件 */
        let currentEvent = this.eventRouter;
        let data;
        /** 寻找事件 */
        for (let i = 0; i < obj.dataList.length; i++) {
            try {
                currentEvent = currentEvent[obj.dataList[i]];
                if (currentEvent instanceof JEventEmit) {
                    data = obj.dataList[i + 1];
                    break;
                }
            }
            catch (e) {
                console.log(e);
                console.log(`快捷键${obj.id} 无法找到对应的事件`);
                return false;
            }
        }
        currentEvent.emit(data);
        return true;
    }
    /**
     * 触发数据
     * @param obj 快捷键对象
     * @returns 如果不成功返回false,成功返回true
     */
    _doData(obj) {
        /** 上一个索引数据 */
        let prevData = undefined;
        /** 当前索引数据 */
        let currentData = this.dataRouter;
        /** 寻找数据 */
        for (let i = 0; i < obj.dataList.length - 1; i++) {
            try {
                prevData = currentData;
                currentData = currentData[obj.dataList[i]];
            }
            catch (e) {
                console.log(e);
                console.log(`快捷键${obj.id}无法找到对应的数据`);
                return false;
            }
        }
        // console.log(prevData[obj.dataList[obj.dataList.length - 2]])
        /** 修改对象数据 */
        let value = obj.dataList[obj.dataList.length - 1];
        switch (typeof value) {
            case "string":
            case "boolean":
            case "number":
                prevData[obj.dataList[obj.dataList.length - 2]] = value;
                break;
            case "object":
                Object.assign(currentData, value);
                break;
        }
        return true;
    }
    /**
     * 添加快捷键基础方法
     * @param obj 快捷键对象
     */
    _addKeyBase(obj) {
        if (!obj.id)
            obj.id = "" + this.nextID;
        if (!obj.keyType)
            obj.keyType = 'keydown';
        if (obj.funcType == undefined)
            obj.funcType = "event";
        if (obj.funcType == "event" && obj.dataList == undefined) {
            obj.dataList = [ObjUtil.guid];
        }
        this._KeyDict[obj.id] = obj;
        this._keyDownFuncDict[obj.id] = false;
        if (obj.isDelOrigin)
            this._delOriginDict[obj.id] = obj;
    }
    /**
     * 删除原始按键
     */
    _delOriginKeys() {
        this.dom.onkeydown = (e) => {
            for (let key in this._delOriginDict) {
                let obj = this._delOriginDict[key];
                /** 判断条件 */
                // if (obj.scence && obj.scence != this.scence)
                //     continue
                if (obj.isCtrl && !e.ctrlKey)
                    continue;
                if (obj.isShift && !e.shiftKey)
                    continue;
                if (obj.isAlt && !e.altKey)
                    continue;
                if (obj.otherKey == undefined)
                    return false;
                /** 是否为键码 */
                if (typeof (obj.otherKey) == "number")
                    if (e.keyCode == obj.otherKey)
                        return false;
                /** 如果不是键码 */
                if (this._getLowerCaseKey(e) == obj.otherKey)
                    return false;
            }
        };
    }
    /**
     * 添加快捷键
     * @param obj 快捷键对象
     */
    addKey(obj) {
        this._addKeyBase(obj);
        if (obj.isDelOrigin)
            this._delOriginKeys();
    }
    /**
     * 添加快捷键
     * @param obj 快捷键对象数组
     */
    addKeysByJson(objs) {
        objs.forEach(data => {
            this._addKeyBase(data);
        });
        this._delOriginKeys();
    }
    /**
     * 快速测试
     * @param obj 快捷键对象
     * @param func 如果是事件触发,就订阅事件
     */
    quickTest(obj, func) {
        this.addKey(obj);
        if (obj.funcType == 'event') {
            let prevData = undefined;
            let currentEvent = this.eventRouter;
            obj.dataList.forEach(data => {
                if (!currentEvent[data]) {
                    currentEvent[data] = {};
                }
                prevData = currentEvent;
                currentEvent = currentEvent[data];
            });
            if (!(prevData[obj.dataList[obj.dataList.length - 1]] instanceof JEventEmit)) {
                prevData[obj.dataList[obj.dataList.length - 1]] = new JEventEmit();
            }
            prevData[obj.dataList[obj.dataList.length - 1]].subscribe(func);
        }
    }
}
/** 按键数据基础类 */
class JKeyBase {
    constructor(obj) {
        obj && Object.assign(this, obj);
    }
}
/** 按键数据类 */
class JKey extends JKeyBase {
    constructor(obj) {
        super(obj);
        /** 唯一id */
        this.id = ObjUtil.guid;
        /** 按键触发类型,默认keydown */
        this.keyType = "keydown";
        /** 功能类型,事件还是数据 */
        this.funcType = "event";
        obj && Object.assign(this, obj);
    }
}
class JIndexDB {
    constructor() {
        this.closeEvent = new JEventEmit();
    }
    /**
     * 打开数据库
     * @param name 数据库的名称
     * @param tableList 数据库里要创建的表的名字构成的数组。
     * @param version 数据库的版本号。
     */
    openDB(name, tableList, version) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((reslove, reject) => {
                version = version || 1;
                var request = window.indexedDB.open(name, version);
                request.onerror = (e) => {
                    this.db = undefined;
                    reject((e.currentTarget).error.message);
                };
                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    this.db.onclose = (ev) => {
                        this.closeEvent.emit(ev);
                    };
                    reslove(this.db);
                };
                request.onupgradeneeded = (e) => {
                    this.db = e.target.result;
                    this.db.onclose = (ev) => {
                        this.closeEvent.emit(ev);
                    };
                    for (var i = 0; i < tableList.length; i++) {
                        if (!this.db.objectStoreNames.contains(tableList[i])) {
                            //keyPath就是选id属性作为主键。------------------------------------
                            var store = this.db.createObjectStore(tableList[i], { keyPath: "id" });
                            //创建一个索引，代表name字段也可以用来索引数据。---------------------
                            store.createIndex('nameIndex', 'name', { unique: true });
                        }
                    }
                };
            });
        });
    }
    /** 关闭数据库 */
    closeDB() {
        this.db.close();
    }
    /**
     * 往指定的数据库的某个表里添加数据
     * @param tableName 要添加数据的表。
     * @param data 要添加的数据。
     */
    addData(tableName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                //在对新数据库做任何事情之前，需要开始一个事务
                //这里开始一个读写业务。
                var transaction = this.db.transaction(tableName, 'readwrite');
                //获取到一个表的存储。
                var store = transaction.objectStore(tableName);
                var request = store.add(data);
                //添加数据成功的话。
                request.onsuccess = function (e) {
                    resolve(e);
                };
                //添加数据失败的话。
                request.onerror = function () {
                    reject(this.error);
                };
            });
        });
    }
    /**
    * 遍历数据库里的所有数据的方法
     * @param tableName 要被遍历的数据库的表名。
     * @param onsuccess 每成功读取一条数据执行一次回调函数。
     */
    ergodicData(tableName, onsuccess) {
        var transaction = this.db.transaction(tableName, 'readwrite');
        //获取到一个表的存储。
        var store = transaction.objectStore(tableName);
        var request = store.openCursor();
        request.onsuccess = function (ev) {
            var cursor = ev.target.result;
            if (cursor) {
                if (onsuccess != null) {
                    onsuccess(cursor.value);
                }
                cursor.continue();
            }
        };
    }
    /**
     * 更新数据库里的某条数据。
     * @param tableName
     * @param data
     */
    updateData(tableName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var transaction = this.db.transaction(tableName, 'readwrite');
                var store = transaction.objectStore(tableName);
                var request = store.put(data);
                request.onsuccess = (e) => {
                    resolve(e);
                };
                //更新数据失败的话。
                request.onerror = function () {
                    reject(this.error);
                };
            });
        });
    }
    /**
     * 获取数据库里某条数据
     * @param tableName 要搜寻数据的表的表名
     * @param key 要搜寻的数据的主键
     */
    getDataByKey(tableName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var transaction = this.db.transaction(tableName, 'readwrite');
                var store = transaction.objectStore(tableName);
                var request = store.get(key);
                request.onsuccess = (e) => {
                    resolve(e.target.result);
                };
                //获取数据失败的话。
                request.onerror = function () {
                    reject(this.error);
                };
            });
        });
    }
    /**
     * 清空数据库某个表所有数据的方法。
     * @param tableName 要清除的表的表名
     */
    clearAllData(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var transaction = this.db.transaction(tableName, 'readwrite');
                var store = transaction.objectStore(tableName);
                var request = store.clear();
                request.onsuccess = (e) => {
                    resolve(e);
                };
                //清空数据失败的话。
                request.onerror = function () {
                    reject(this.error);
                };
            });
        });
    }
    /**
     * 删除数据库里的某条数据。
     * @param tableName 要删除数据的表的表名
     * @param key 要删除的数据的主键。
     */
    deleteDataByKey(tableName, key) {
        return new Promise((resolve, reject) => {
            var transaction = this.db.transaction(tableName, 'readwrite');
            var store = transaction.objectStore(tableName);
            var request = store.delete(key);
            request.onsuccess = function (e) {
                resolve(e);
            };
            //清空数据失败的话。
            request.onerror = function () {
                reject(this.error);
            };
        });
    }
}
class JIndexDBEX {
    /**
     *
     * @param dbName
     * @param version 只能使用整数,使用小数会自动取整,且必须>=原来的版本
     */
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
    }
    /** 初始化 */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.request = indexedDB.open(this.dbName, this.version);
                this.request.addEventListener("error", (ev) => {
                    console.log("连接失败");
                    if (this.onerror) {
                        this.onerror(ev);
                    }
                    rej(ev);
                });
                this.request.addEventListener("success", (ev) => {
                    console.log("连接成功");
                    // @ts-ignore
                    this.base = ev.target.result;
                    if (this.onsuccess) {
                        this.onsuccess(ev);
                    }
                    // 版本升级监听
                    this.base.addEventListener("versionchange", (ev) => {
                        if (this.onversionchange) {
                            this.onversionchange(ev);
                        }
                    });
                    // 关闭监听
                    this.base.addEventListener("close", (ev) => {
                        if (this.onclose) {
                            this.onclose(ev);
                        }
                    });
                    res(ev);
                });
                this.request.addEventListener("upgradeneeded", (ev) => {
                    console.log("更新成功");
                    // @ts-ignore
                    this.base = ev.target.result;
                    // @ts-ignore
                    let transaction = ev.target.transaction;
                    if (this.onupgradeneeded) {
                        this.onupgradeneeded(ev, transaction);
                    }
                });
                this.request.addEventListener("blocked", (ev) => {
                    if (this.onblocked) {
                        this.onblocked(ev);
                    }
                });
            });
        });
    }
    /** 删除自己本身 */
    deleteDB() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.request = indexedDB.deleteDatabase(this.dbName);
                this.request.addEventListener("error", (ev) => {
                    console.log("删除失败");
                    if (this.onerror) {
                        this.onerror(ev);
                    }
                    rej(ev);
                });
                this.request.addEventListener("success", (ev) => {
                    console.log("删除成功");
                    if (this.onsuccess) {
                        this.onsuccess(ev);
                    }
                    res(ev);
                });
            });
        });
    }
    /**
     * 创建仓库
     * @param name 仓库名
     * @param options
     * @returns 0为base都没有无法创建,1为没有创建,-1为已经有了不用创建
     */
    createStore(name, options) {
        if (!this.base) {
            return 0;
        }
        if (!this.base.objectStoreNames.contains(name)) {
            this.base.createObjectStore(name, options);
            return 1;
        }
        return -1;
    }
    /** 获取仓库 */
    getStore(storeName, mode, transaction) {
        if (!transaction) {
            transaction = this.base.transaction([storeName], mode);
        }
        /** 连接仓库 */
        let store = transaction.objectStore(storeName);
        return store;
    }
    /** 添加数据数组 */
    addList(storeName, dataList) {
        return __awaiter(this, void 0, void 0, function* () {
            let store = this.getStore(storeName, "readwrite");
            // 添加数据
            for (let i = 0; i < dataList.length; i++) {
                let child = dataList[i];
                yield this.add(store, child);
            }
            return;
        });
    }
    /** 添加数据 */
    add(store, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                if (typeof store == "string") {
                    store = this.getStore(store, "readwrite");
                }
                let addRequest = store.add(data);
                addRequest.addEventListener("error", (e) => {
                    rej(e);
                });
                addRequest.addEventListener("success", (e) => {
                    res(e);
                });
            });
        });
    }
    /** 删除数据 */
    delete(storeName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let store = this.getStore(storeName, "readwrite");
                let deleteRequest = store.delete(query);
                deleteRequest.addEventListener("error", (ev) => {
                    rej(ev);
                });
                deleteRequest.addEventListener("success", (ev) => {
                    res(ev);
                });
            });
        });
    }
    /** 删除多余数组 */
    deleteList(storeName, query, cb, index) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyList = [];
            yield this.foreach(storeName, (child) => {
                if (!cb || cb(child.value, child)) {
                    keyList.push(child.primaryKey);
                }
            }, query, index);
            for (let i = 0; i < keyList.length; i++) {
                let child = keyList[i];
                yield this.delete(storeName, child);
            }
            return;
        });
    }
    /** 修改数据 */
    fix(storeName, data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let store = this.getStore(storeName, "readwrite");
                let fixRequest = store.put(data, key);
                fixRequest.addEventListener("error", (ev) => {
                    rej(ev);
                });
                fixRequest.addEventListener("success", (ev) => {
                    res(ev);
                });
            });
        });
    }
    /** 查找数据 */
    find(storeName, query, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let store = this.getStore(storeName, "readwrite");
                let findRequest;
                if (index != undefined) {
                    findRequest = store.index(index).get(query);
                }
                else {
                    findRequest = store.get(query);
                }
                findRequest.addEventListener("error", (ev) => {
                    rej(ev);
                });
                findRequest.addEventListener("success", (ev) => {
                    res(findRequest.result);
                });
            });
        });
    }
    /** 过滤数据 */
    filter(storeName, query, count, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let store = this.getStore(storeName, "readonly");
                let findRequest;
                if (index != undefined) {
                    findRequest = store.index(index).getAll(query, count);
                }
                else {
                    findRequest = store.getAll(query, count);
                }
                findRequest.addEventListener("error", (ev) => {
                    rej(ev);
                });
                findRequest.addEventListener("success", (ev) => {
                    res(findRequest.result);
                });
            });
        });
    }
    /** 遍历 */
    foreach(storeName, cb, query, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let store = this.getStore(storeName, "readonly");
                let result;
                if (index != undefined) {
                    result = store.index(index).openCursor(query);
                }
                else {
                    result = store.openCursor(query);
                }
                result.addEventListener("error", (ev) => {
                    rej(ev);
                });
                result.addEventListener("success", (ev) => {
                    // @ts-ignore
                    let cursor = ev.target.result;
                    if (cursor) {
                        cb(cursor);
                        cursor.continue();
                    }
                    else {
                        res(ev);
                    }
                });
            });
        });
    }
    /** 存储情况
     * @returns percentageUsed 存储百分比 remaining最多可写空间
     */
    storage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!navigator.storage || !navigator.storage.estimate) {
                return undefined;
            }
            const quota = yield navigator.storage.estimate();
            // quota.usage -> 已用字节数。
            // quota.quota -> 最大可用字节数。
            const percentageUsed = (quota.usage / quota.quota) * 100;
            const remaining = quota.quota - quota.usage;
            return {
                quota,
                percentageUsed,
                remaining
            };
        });
    }
    /** 快速打印存储情况 */
    consoleStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.storage();
            if (!data) {
                return;
            }
            console.log(`您已使用可用存储的 ${data.percentageUsed.toFixed(3)}%。`);
            console.log(`您最多可以再写入 ${Math.round(data.remaining / 1024 / 1024)} MB。`);
        });
    }
}
