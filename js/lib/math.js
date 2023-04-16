// 矩阵
class Mat2d {
    constructor () {
      this.values = this.identity()
    }
    // 单元矩阵
    static identity () {
      let m = new Float32Array(9)
      // 第一列
      m[0] = 1
      m[1] = 0
      m[2] = 0
      // 第二列
      m[3] = 0
      m[4] = 1
      m[5] = 0
      // 第三列
      m[6] = 0
      m[7] = 0
      m[8] = 1
  
      return m
    }
    // 坐标的矩阵
    static createCoord (x, y) {
      let m = new Float32Array(9)
      // 第一列
      m[0] = x
      m[1] = y
      m[2] = 1
  
      // 第二列
      m[3] = 0
      m[4] = 0
      m[5] = 0
      // 第三列
      m[6] = 0
      m[7] = 0
      m[8] = 0
  
      return m
    }
    // 矩阵相乘
    static multiply (left, right) {
      let target = new Float32Array(9)
      // 矩阵 left 的第一行
      let a11 = left[0]
      let a12 = left[3]
      let a13 = left[6]
      // 矩阵 left 的第二行
      let a21 = left[1]
      let a22 = left[4]
      let a23 = left[7]
      // 矩阵 left 的第三行
      let a31 = left[2]
      let a32 = left[5]
      let a33 = left[8]
      // 矩阵 right 的第一列
      let b11 = right[0]
      let b21 = right[1]
      let b31 = right[2]
      // 矩阵 right 的第二列
      let b12 = right[3]
      let b22 = right[4]
      let b32 = right[5]
      // 矩阵 right 的第三列
      let b13 = right[6]
      let b23 = right[7]
      let b33 = right[8]
  
      // 相乘得到的新矩阵
      // 新矩阵的第一列
      target[0] = a11 * b11 + a12 * b21 + a13 * b31
      target[1] = a21 * b11 + a22 * b21 + a23 * b31
      target[2] = a31 * b11 + a32 * b21 + a33 * b31
      // 新矩阵的第二列
      target[3] = a11 * b12 + a12 * b22 + a13 * b32
      target[4] = a21 * b12 + a22 * b22 + a23 * b32
      target[5] = a31 * b12 + a32 * b22 + a33 * b32
      // 新矩阵的第三列
      target[6] = a11 * b13 + a12 * b23 + a13 * b33
      target[7] = a21 * b13 + a22 * b23 + a23 * b33
      target[8] = a31 * b13 + a32 * b23 + a33 * b33
  
      return target
    }
    // 多个矩阵相乘
    static multiplyMore (matrixs) {
      let matrix = matrixs[0]
      for (let i = 1; i < matrixs.length; i++) {
        let m = matrixs[i]
        matrix = mat2d.multiply(matrix, m)
      }
      return matrix
    }
    // 平移矩阵
    static makeTranslation (tx, ty) {
      let m = new Float32Array(9)
      // 第一列
      m[0] = 1
      m[1] = 0
      m[2] = 0
      // 第二列
      m[3] = 0
      m[4] = 1
      m[5] = 0
      // 第三列
      m[6] = tx
      m[7] = ty
      m[8] = 1
  
      return m
    }
    // 缩放矩阵
    static makeScale (sx, sy) {
      let m = new Float32Array(9)
      // 第一列
      m[0] = sx
      m[1] = 0
      m[2] = 0
      // 第二列
      m[3] = 0
      m[4] = sy
      m[5] = 0
      // 第三列
      m[6] = 0
      m[7] = 0
      m[8] = 1
  
      return m
    }
    // 旋转矩阵
    static makeRotation (degree) {
      let m = new Float32Array(9)
      let sin = Math.sin(math2d.toRads(degree))
      let cos = Math.cos(math2d.toRads(degree))
      // 第一列
      m[0] = cos
      m[1] = sin
      m[2] = 0
      // 第二列
      m[3] = -sin
      m[4] = cos
      m[5] = 0
      // 第三列
      m[6] = 0
      m[7] = 0
      m[8] = 1
  
      return m
    }
    // 逆矩阵
    static invert (m) {
      // 第一列
      let m00 = m[0]
      let m10 = m[1]
      let m20 = m[2]
      // 第二列
      let m01 = m[3]
      let m11 = m[4]
      let m21 = m[5]
      // 第三列
      let m02 = m[6]
      let m12 = m[7]
      let m22 = m[8]
  
      // 求余子式矩阵
      // 第一列
      let y00 = m11 * m22 - m21 * m12
      let y10 = m01 * m22 - m21 * m02
      let y20 = m01 * m12 - m11 * m02
      // 第二列
      let y01 = m10 * m22 - m20 * m12
      let y11 = m00 * m22 - m20 * m02
      let y21 = m00 * m12 - m10 * m02
      // 第三列
      let y02 = m10 * m21 - m20 * m11
      let y12 = m00 * m21 - m20 * m01
      let y22 = m00 * m11 - m10 * m01
  
      // 乘以1/行列式
      let d = m00 * y00 - m01 * y01 + m02 * y02
  
      // 代数余子式矩阵
      y10 = -y10
      y01 = -y01
      y21 = -y21
      y12 = -y12
  
      // 转置矩阵
      let target = new Float32Array(9)
      // 第一列
      target[0] = y00
      target[1] = y01
      target[2] = y02
      // 第二列
      target[3] = y10
      target[4] = y11
      target[5] = y12
      // 第三列
      target[6] = y20
      target[7] = y21
      target[8] = y22
  
      // 转置矩阵乘以1/行列式得到逆矩阵
      for (let i = 0; i < target.length; i++) {
        target[i] = target[i] * (1 / d)
      }
      return target
    }
    static transformCoord (pos, matrix) {
      let m1 = this.createCoord(pos.x, pos.y)
      let m2 = this.multiply(matrix, m1)
      return {
        x: m2[0],
        y: m2[1]
      }
    }
    /** 批量转换点 */
    static transformCoords(poss,matrix){
      return poss.map( p => this.transformCoord(p,matrix) )
    }
  }
  
// 数学计算
class Math2d {
// 角度转弧度
static toRads (degrees) {
    return (Math.PI * degrees) / 180
}
// 弧度转角度
static toDegrees (rads) {
    return (rads * 180) / Math.PI
}
// 两点间的距离
static getLineLength (x1, y1, x2, y2) {
    let res = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    // res = Math.round(res)
    return res
}
/**
     * 获取弧的圆心坐标
     * @param sx 弧的起始点x坐标
     * @param sy 弧的起始点y坐标
     * @param r  弧的半径
     * @param sAngle 弧的起始点角度
     * @return 返回圆心坐标
     */
static getArcCenter (sx, sy, r, sAngle) {
    let rad = this.toRads(-sAngle)
    let x0 = sx - Math.cos(rad) * r
    let y0 = sy - Math.sin(rad) * r

    return {
    x: x0,
    y: y0
    }
}
/**
     * 求直线与水平线或垂直线的交点坐标
     * @param HDirect 水平孔朝向
     * @param type    x或y。x表示求直线与某点的水平线的交点，y表示求直线与某点垂直线的交点
     * @param valX    某点的x坐标
     * @param valY    某点的y坐标
     * @param lineObj 线段的数组集合
     * @return 存在交点返回点坐标，不存在交点返回false
     */
    static getIntersectionBy2Line (HDirect, type, valX, valY, lineObj) {
    let x, y
    let x1 = lineObj.x1
    let y1 = lineObj.y1
    let x2 = lineObj.x2
    let y2 = lineObj.y2

    if (type === 'x') {
    if (x1 === x2) return false
    if ((valX < x1) === (valX < x2)) return false
    x = valX
    y = ((y2 - y1) / (x2 - x1)) * (x - x1) + y1
    }

    if (type === 'y') {
    if (y1 === y2) return false
    if ((valY < y1) === (valY < y2)) return false
    y = valY
    x = ((x2 - x1) / (y2 - y1)) * (y - y1) + x1
    }

    if (
    (HDirect === 'L' && (valX < x)) ||
            (HDirect === 'R' && (valX > x)) ||
            (HDirect === 'U' && (valY > y)) ||
            (HDirect === 'D' && (valY < y))
    ) {
    return false
    }

    return {
    type: 'Point',
    x,
    y
    }
}
/**
     * 获取直线(有方向）的角度
     * @param fromX 终点的x坐标
     * @param fromY 终点的y坐标
     * @param toX 起点的x坐标
     * @param toY 起点的y坐标
     * @return 直线的角度（值为弧度）
     */
static lineAngle (fromX, fromY, toX, toY) {
    return Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
}
/**
     * 获取平行线的顶点
     * @param p1 线段一端顶点的坐标
     * @param p2 线段另一端顶点的坐标
     * @param d 与线段平行的距离
     * @param sideNum 平行线的个数
     * @return {Object} 平行线的顶点坐标
     */
static getParallelLinePoints (p1, p2, d, sideNum = 1) {
    let angle = this.lineAngle(p1.x, p1.y, p2.x, p2.y)
    let len = math2d.getLineLength(p1.x, p1.y, p2.x, p2.y)
    let sin = Math.abs((p2.y - p1.y)) / len
    let cos = Math.abs((p2.x - p1.x)) / len

    // 设置标注的位置
    if (angle >= 0 && angle < 90) {
    cos = -cos
    }

    if (angle > -180 && angle <= -90) {
    sin = -sin
    }

    if (angle > -90 && angle < 0) {
    sin = -sin
    cos = -cos
    }

    if (sideNum === 1) {
    return {
        x1: p1.x + d * sin,
        y1: p1.y + d * cos,
        x2: p2.x + d * sin,
        y2: p2.y + d * cos
    }
    }

    if (sideNum === 2) {
    return {
        x1: p1.x + d * sin,
        y1: p1.y + d * cos,
        x2: p2.x + d * sin,
        y2: p2.y + d * cos,
        x3: p1.x - d * sin,
        y3: p1.y - d * cos,
        x4: p2.x - d * sin,
        y4: p2.y - d * cos
    }
    }
}
/**
     * 获取线段的中心坐标
     * @param p1 线段顶点坐标
     * @param p2 线段顶点坐标
     * @return 返回线段中心点的坐标
     */
    static getLineCenter (p1, p2) {
    return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
    }
}
static getLineEqualPoints (p1, p2, num) {
    let points = []
    let len = this.getLineLength(p1.x, p1.y, p2.x, p2.y)
    let dx = (p2.x - p1.x) / num
    let dy = (p2.y - p1.y) / num
    let min = 1
    let angle = this.lineAngle(p1.x, p1.y, p2.x, p2.y)

    // 限制拆分的最小值
    if (Math.abs(dx) < min && Math.abs(dx) !== 0) {
    let lenX = Math.abs(Math.cos(this.toRads(angle)) * min)
    dx = dx < 0 ? -lenX : lenX
    num = len / min
    }
    if (Math.abs(dy) < min && Math.abs(dy) !== 0) {
    let lenY = Math.abs(Math.sin(this.toRads(angle)) * min)

    dy = dy < 0 ? -lenY : lenY
    num = len / min
    }

    for (let i = 1; i < num; i++) {
    points.push({
        x: p1.x + dx * i,
        y: p1.y + dy * i
    })
    }

    return points
}
/*
    * 获取折线上，距离折线的转折点距离为 dist 的两个点
    * @param obj 含有折线三个点的坐标
    * @param pointNum 获得的点的个数，2或3.
    * @param dist 距离折线的转折点的距离
    * @returns 返回点坐标的集合。pointNum为2时返回斜线切角的两点，为3时返回直角切角的三个点
    */
static getPointsIn2Line (obj, pointNum = 2, dist1 = 30, dist2 = 30) {
    let last = getCoordinate(obj.last)
    let center = getCoordinate(obj.center)
    let next = getCoordinate(obj.next)
    let p1 = this.getNewPointInLineByDist(center.x, center.y, last.x, last.y, dist1)
    let p2 = this.getNewPointInLineByDist(center.x, center.y, next.x, next.y, dist2)

    if (pointNum === 2) {
    return [p1, p2]
    } else {
    // 该角度为标准坐标系的角度，非canvas坐标系的
    let angle = this.lineAngle(p2.x, p2.y, p1.x, p1.y)

    let r = [
        angle > 0 && angle < 90, // 第一象限
        angle > 90 && angle < 180, // 第二象限
        angle > -180 && angle < -90, // 第三象限
        angle > -90 && angle < 0 // 第四象限
    ]
    let p3 = { x: 0, y: 0 }
    if (r[0] || r[2]) {
        p3.x = p2.x
        p3.y = p1.y
        if (p3.x === center.x && p3.y === center.y) {
        p3.x = p1.x
        p3.y = p2.y
        }
    }
    if (r[1] || r[3]) {
        p3.x = p1.x
        p3.y = p2.y
        if (p3.x === center.x && p3.y === center.y) {
        p3.x = p2.x
        p3.y = p1.y
        }
    }

    return [p1, p3, p2]
    }
}
/**
    * 求直线与圆的交点
    * @param cx  圆X轴坐标
    * @param cy  圆y轴坐标
    * @param r   圆半径
    * @param stx 起点直线的X轴坐标
    * @param sty 起点直线的轴坐标
    * @param edx 终点直线的X轴坐标
    * @param edy 终点直线的Y轴坐标
    * @return 交点坐标(x,y)
    */
static getPoint (cx, cy, r, stx, sty, edx, edy) {
    // 求直线
    let k = (edy - sty) / (edx - stx)
    let b = edy - k * edx

    // 列方程
    let x1, y1, x2, y2
    let c = cx * cx + (b - cy) * (b - cy) - r * r
    let a = (1 + k * k)
    let b1 = (2 * cx - 2 * k * (b - cy))
    
    let tmp = Math.sqrt(b1 * b1 - 4 * a * c)
    x1 = (b1 + tmp) / (2 * a)
    y1 = k * x1 + b
    x2 = (b1 - tmp) / (2 * a)
    y2 = k * x2 + b
    // 判断求出的点是否在圆上
    let res = Math.round((x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy))

    let p = {}
    if (res === r * r) {
    if ((x1 >= stx) === (x2 >= edx)) {
        p.x = x2
        p.y = y2
    } else {
        p.x = x1
        p.y = y1
    }
    }else{
    console.error('计算新点错误')
    }

    return p
}
/**
     * 获取三个点形成的内夹角,即p2对应的角。三个点连成一条折线
     * @param p1 折线的起点
     * @param p2 折线的转折点
     * @param p3 折线的终点
     * @return 折线的内角的角度（弧度）
     */
static getAngleBy3Points (p1, p2, p3) {
    let vp = (p1.x - p2.x) * (p3.x - p2.x) + (p1.y - p2.y) * (p3.y - p2.y)
    let vl1 = math2d.getLineLength(p1.x, p1.y, p2.x, p2.y)
    let vl2 = math2d.getLineLength(p2.x, p2.y, p3.x, p3.y)
    let cos = vp / (vl1 * vl2)
    let angle = Math.acos(cos) * 180 / Math.PI
    return angle
}
/**
     * 已知圆的两个点和圆的半径，求圆心坐标
     * @param p1 圆上的点的坐标
     * @param p2 圆上的点的坐标
     * @param r  圆的半径
     * @return 返回两个圆心坐标
     */
static getCircleCenter (p1, p2, r) {
    if (p1.x === p2.x) {
    let dLen = Math.abs(p2.y - p1.y)// 弦长
    let midX = p1.x // 弦中心点的x
    let midY = (p1.y + p2.y) / 2 // 弦中心点的y
    let cLen = Math.sqrt(r ** 2 - (dLen / 2) ** 2) // 弦心距

    return [
        { x: midX + cLen, y: midY },
        { x: midX - cLen, y: midY }
    ]
    }

    // 将圆上的两个点代入圆的方程式解得圆心的坐标，有两个解
    let C1 = (p2.x ** 2 - p1.x ** 2 + p2.y ** 2 - p1.y ** 2) / (2 * (p2.x - p1.x))
    let C2 = (p2.y - p1.y) / (p2.x - p1.x)
    let A = 1 + C2 ** 2
    let B = 2 * (p1.x - C1) * C2 - 2 * p1.y
    let C = (p1.x - C1) ** 2 + p1.y ** 2 - r ** 2
    // 加Math.abs是为了因为浮点数导致计算出负数
    let y1 = (-B + Math.sqrt(Math.abs(B ** 2 - 4 * A * C))) / (2 * A)
    let y2 = (-B - Math.sqrt(Math.abs(B ** 2 - 4 * A * C))) / (2 * A)
    let x1 = C1 - C2 * y1
    let x2 = C1 - C2 * y2

    return [
    { x: x1, y: y1 },
    { x: x2, y: y2 }
    ]
}
/**
     * 根据圆弧的弦的向量角度、圆弧的顺逆和圆弧的包角是否为较小的，来确定圆弧的圆心
     * @param p1 起始点
     * @param p2 终止点
     * @param r  圆弧的半径
     * @param direction  圆弧的顺逆，2为顺圆，3为逆圆
     * @param isMinorArc 圆弧的包角是否为较小的
     */
static getArcCenter2 (p1, p2, r, direction, isMinorArc) {
    let center // 圆弧的圆心
    let centers = this.getCircleCenter(p1, p2, r) // 求圆弧的两个圆心
    // console.log(centers)

    let sx = p1.x // 起始点的x
    let sy = p1.y // 起始点的y
    let ex = p2.x // 终止点的x
    let ey = p2.y // 终止点的y
    let dx = sx - ex
    let dy = sy - ey
    let dLength = Math.sqrt(dx ** 2 + dy ** 2) // 弦长
    let angleChordX = Math.acos(-dx / dLength) * 180 / Math.PI // 弦向量的X正方向的角度
    if (dy > 0) {
    angleChordX *= -1
    }

    let fourQuadrant = [
    angleChordX >= 0 && angleChordX < 90, // 第一象限
    angleChordX >= 90 && angleChordX <= 180, // 第二象限
    angleChordX >= -180 && angleChordX < -90, // 第三象限
    angleChordX >= -90 && angleChordX < 0 // 第四象限
    ]

    if (fourQuadrant[0] || fourQuadrant[3]) { // 弦向量角度在 第一象限 或 第四象限
    if (direction === 2) { // 顺圆
        if (isMinorArc) {
        center = centers[1]
        } else {
        center = centers[0]
        }
    } else if (direction === 3) { // 逆圆
        if (isMinorArc) {
        center = centers[0]
        } else {
        center = centers[1]
        }
    }
    } else if (fourQuadrant[1] || fourQuadrant[2]) { // 弦向量角度在 第二象限 或 第三象限
    if (direction === 2) { // 顺圆
        if (isMinorArc) {
        center = centers[0]
        } else {
        center = centers[1]
        }
    } else if (direction === 3) { // 逆圆
        if (isMinorArc) {
        center = centers[1]
        } else {
        center = centers[0]
        }
    }
    }

    return center
}
// 对浮点数进行四舍五入，并保留指定位数的小数
static round (num, digit = 0) {
    let int = 10 ** digit
    return Math.round(num * int) / int
}

// 根据角度求在圆上的坐标
static getPointInCircular (center, r, angle) {
    return this.getPointByRad(center,r,math2d.toRads(angle))
    
    let sin = Math.sin(math2d.toRads(angle))
    let cos = Math.cos(math2d.toRads(angle))
    return {
    x: center.x + r * cos,
    y: center.y + r * sin
    }
}
// 根据弧度、圆心和半径求坐标
static getPointByRad(center,radius,rad){
    return {
    x: center.x + radius * Math.cos(rad),
    y: center.y + radius * Math.sin(rad)
    }
}
/**
     * 获取线段上A顶点距离为 d 的点
     * @param x1 顶点A的x坐标
     * @param y1 顶点A的y坐标
     * @param x2 线段另一个顶点的x坐标
     * @param y2 线段另一个顶点的y坐标
     * @param d  离顶点A的距离
     * @return 线段上点的坐标
     */
static getNewPointInLineByDist (x1, y1, x2, y2, d) {
    let p
    if (x1 === x2) {
    p = {
        x: x1,
        y: y1 > y2 ? y1 - d : y1 + d
    }
    } else if (y1 === y2) {
    p = {
        x: x1 > x2 ? x1 - d : x1 + d,
        y: y1
    }
    } else {
    p = math2d.getPoint(x1, y1, d, x1, y1, x2, y2)
    }

    return p
}

// 将canvas坐标系的角转为标准坐标系的角（均为正值角）
static toPositiveAngle (angle) {
    if (angle === 0 || angle === 180) return angle
    if (angle < 0) {
    return -angle
    } else {
    return 360 - angle
    }
}

// 点是否在圆内
static isInCircle (mouse, center, r) {
    let len = this.getLineLength(mouse.x, mouse.y, center.x, center.y)
    if (len <= r) {
    return true
    } else {
    return false
    }
}

// 判断三点是顺时针还是逆时针方向
// 为正时，p1-p2-p3   路径的走向为逆时针，
// 为负时，p1-p2-p3   走向为顺时针，
// 为零时，p1-p2-p3   所走的方向不变，亦即三点在一直线上。
static threePointsClockwise (p1, p2, p3) {
    let x1 = p1.x
    let y1 = p1.y
    let x2 = p2.x
    let y2 = p2.y
    let x3 = p3.x
    let y3 = p3.y
    let result = x1 * y2 + x2 * y3 + x3 * y1 - y1 * x2 - y2 * x3 - y3 * x1

    return this.round(result)
}

// 判断数组里数字正负情况
// 1为全正，-1为全负，0为正负都有
static isPositiveOrNegative (nums) {
    let hasPositive = false
    let hasNegative = false
    nums.forEach(num => {
    if (num < 0) hasNegative = true
    else hasPositive = true
    })
    if (hasPositive && !hasNegative) return 1
    if (!hasPositive && hasNegative) return -1
    if (hasPositive && hasNegative) return 0
}

// 负角度转为正角度来表示,且小于360度
static toPositiveDegree(degree){
    while(degree < 0){
    degree += 360
    }

    return degree % 360
}

// 比较两个数字是否近似相等（在指定的误差范围内）
static isCloseToEqual(n1,n2, debiation = Number.EPSILON){
    return Math.abs(n1 - n2) < debiation
}

/**
 * 判断两个线段在X/Y方向重叠情况
 * 返回数字：> 0表示相离，0表示相切，< 0 表示重叠
 */
static isLinesOverlap(start1,end1,start2,end2,axisDirection = "x"){
    let [min1,max1] = this.getLineProjectionRange(start1,end1,axisDirection)
    let [min2,max2] = this.getLineProjectionRange(start2,end2,axisDirection)
    return this.isRangeOverlap(min1,max1,min2,max2)
}

/** 判断两个区间是否重叠 */
static isRangeOverlap(min1,max1,min2,max2){
    return (min1 - max2) * (max1 - min2)
}

// 计算线段的中点
static getLineCenter(start,end){
    return {
    x:( start.x + end.x) / 2,
    y:( start.y + end.y) / 2,
    }
}

/**
 * 获取在X/Y轴的投影范围
 * @returns [Number,Number],前面的值小，后面的大
 */
    static getLineProjectionRange(start,end,axisDirection = "x"){
    let a = start[axisDirection]
    let b = end[axisDirection]

    return a <= b ? [a, b] : [b, a]
}
}