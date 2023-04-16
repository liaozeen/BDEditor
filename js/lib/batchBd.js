/** BD批量处理 */
class BatchBdUtil {
  static bdToDxfs(list, callback) {
    let dxfs = list.map(item => {
      let {
        content,
        filename
      } = item

      filename = filename.replace('.bd', '')

      let json = parseFormulaXml(content, ['SIZE'])
      let dxf = this.bdToDxf(json, filename)
      let dxfName = `${filename}.dxf`

      return {
        filename: dxfName,
        content: dxf
      }
    })

    callback(dxfs)
  }

  static bdToImgs(list, option) {
    option = option || {}
    let {
      width = 800, height = 700, callback
    } = option

    let div = document.createElement('div')
    let jCanvasSys = BatchBdToImg.createCanvasSys(div, width, height)

    if (callback) {
      let files = list.map(item => {
        let {
          content,
          filename
        } = item
        let base64 = BatchBdToImg.bdToImg(content, jCanvasSys)
        base64 = base64.slice(`data:image/jpeg;base64,`.length)
        filename = filename.replace('.bd', '')

        let name = `${filename}.jpg`

        return {
          filename: name,
          content: base64,
          option: {
            base64: true
          }
        }
      })

      callback(files)
    }
  }

  static oldBdToNew(list,callback){
    if(typeof list === "string"){
      list = [list]
    }

    let bds = list.map(item => {
      let {
        content,
        filename
      } = item
      let bd = BatchBdTransform.oldBDToNewBD(content)

      return {
        filename,
        content: bd,
      }
    })  
    callback(bds)
  }

  /** bd转dxf */
  static bdToDxf(data, filename) {
    let dxf = new Dxf();
    let list = this.getOutlineList(data)
    let l = Number(data.attr.L)
    let w = Number(data.attr.W)
    let dxfStr = dxf.toDxf(list, {
      width: l,
      height: w,
      size: data.attr.SIZE || `${l}*${w}*${data.attr.BH}`,
      filename
    })
    return dxfStr
  }

  /** 获取轮廓的点弧 */
  static getOutlineList(data) {
    let graph = data.children.filter(node => node.node === 'Graph')[0]
    let childs = graph.children
    let list = []

    for (let i = 0, len = childs.length; i < len; i++) {
      let node = childs[i]
      let nextNode = i === len - 1 ? childs[0] : childs[i + 1]
      if (node.node === 'Point' && nextNode.node === 'Point') {
        list.push({
          node: 'Line',
          x1: node.attr.X,
          y1: node.attr.Y,
          x2: nextNode.attr.X,
          y2: nextNode.attr.Y,
        })
      }
      if (node.node == 'Arc') {
        list.push(this.calcuArc(node))
      }

      if (node.node === 'TArc') {
        list.push(this.calcuTArc(node))
      }
    }

    return list
  }

  /** 计算Arc */
  static calcuArc(node) {
    let arc = this.HGArcToCanvasArc({
      start: {
        x: node.attr.X,
        y: node.attr.Y
      },
      r: node.attr.R,
      startAngle: node.attr.StartAngle,
      angle: node.attr.Angle
    })

    return {
      node: 'Arc',
      sAngle: arc.startAngle,
      angle: arc.angle,
      center: arc.center,
      r: arc.radius
    }
  }

  /** Tarc */
  static calcuTArc(node) {
    let arc = this.getCanvasArcByHGArc({
      type: 'tArc',
      start: {
        x: node.attr.X,
        y: node.attr.Y
      },
      end: {
        x: node.attr.X2,
        y: node.attr.Y2
      },
      h: node.attr.ChordH,
      isBulge: node.attr.IsBulge
    })

    return {
      node: 'TArc',
      sAngle: arc.startAngle,
      eAngle: arc.endAngle,
      wise: arc.isCounterClockwise,
      r: arc.radius,
      center: arc.center
    }
  }

  // 将华广的弧转为画布的弧
  static HGArcToCanvasArc(hgarcAttr, cfg = {}) {
    let isCounterClockwise = false
    let {
      start,
      r,
      startAngle,
      angle
    } = hgarcAttr
    let center = Math2d.getArcCenter(start.x, start.y, r, startAngle)

    // 兼容特殊处理，一般不用cfg的.为解决画布旋转导致圆弧偏离问题
    startAngle = Math2d.toRads(startAngle - (cfg.rotation || 0))

    angle = Math2d.toRads(angle)

    let endAngle = startAngle + angle
    let middle = this.rotationPoint(center.x, center.y, start.x, start.y, -angle / 2)
    let end = this.rotationPoint(center.x, center.y, start.x, start.y, -angle)

    if (angle < 0) {
      isCounterClockwise = true
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
    }
  }

  // 转换为画布的弧的属性
  static getCanvasArcByHGArc(hgArc, cfg) {
    if (hgArc.type === 'arc') {
      return this.HGArcToCanvasArc(hgArc, cfg)
    } else if (hgArc.type === 'tArc') {
      let tArc = this.getTArcOtherAttr(hgArc, cfg)

      // // 因坐标系已设置原点为左下角，需对角度和绘图方向进行反向赋值
      // tArc.startAngle = -tArc.startAngle
      // tArc.endAngle = -tArc.endAngle
      // tArc.isCounterClockwise = !tArc.isCounterClockwise

      return tArc
    }
  }

  // 计算TArc圆弧得到新属性
  static getTArcOtherAttr(arcAttr, cfg = {}) {
    let {
      start,
      end,
      h,
      isBulge
    } = arcAttr
    let rotation = (cfg.rotation || 0) // 旋转角度

    let direction = isBulge == 1 ? 2 : 3
    let radius = (4 * h * h + (start.x - end.x) ** 2 + (start.y - end.y) ** 2) / (8 * h) // 很重要的公式
    let center = Math2d.getArcCenter2(start, end, radius, direction, h <= radius)
    let startAngle = Math2d.lineAngle(start.x, start.y, center.x, center.y)
    let endAngle = Math2d.lineAngle(end.x, end.y, center.x, center.y)
    let isCounterClockwise = isBulge == 1

    let angle = Math2d.toRads(endAngle - startAngle)

    startAngle = Math2d.toRads(Math2d.toPositiveDegree(startAngle + rotation))
    endAngle = Math2d.toRads(Math2d.toPositiveDegree(endAngle + rotation))

    let middleAngle = (startAngle + endAngle) / 2 - Math2d.toRads(rotation)

    if ((isCounterClockwise && startAngle < endAngle) ||
      (!isCounterClockwise && startAngle > endAngle)
    ) {

      // 取反方向的角度
      middleAngle = middleAngle - Math2d.toRads(180)
    }

    let middle = Math2d.getPointByRad(center, radius, middleAngle)

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
    }
  }

  /**
   * 圆弧拆分成点
   * @param {*} center 圆心
   * @param {*} start 起始点
   * @param {Number} angle 旋转角度（弧度值）
   * @param {Boolean} counterclockwise 是否为逆时圆
   */
  static arcToPoints(center, start, angle, counterclockwise) {
    let points = []
    let dAngle = Math2d.toRads(3)
    let n = Math.abs((angle) / dAngle)

    dAngle = counterclockwise ? dAngle : -dAngle

    for (let i = 0; i < n; i++) {
      let p = this.rotationPoint(center.x, center.y, start.x, start.y, dAngle * i)
      p.type = 'Point'
      points.push(p)
    }

    return points
  }

  // 获取点围绕中心点旋转后的坐标
  static rotationPoint(cx, cy, x, y, rotation) {
    let sin = Math2d.round(Math.sin(rotation), 10)
    let cos = Math2d.round(Math.cos(rotation), 10)
    let x1 = x - cx
    let y1 = y - cy
    let x2 = x1 * cos - y1 * sin
    let y2 = y1 * cos + x1 * sin

    return {
      x: cx + x2,
      y: cy + y2
    }
  }

  // 通过x2dGraph节点得到图元路径
  static getGraphPathD(list, isClosePath = false) {
    let d = ''

    for (let i = 0; i < list.length; i++) {
      let attr = list[i].attr

      if (list[i].node === 'Point') {
        if (i === 0) d += `m ${attr['$X']} ${attr['$Y']},`
        else d += `l ${attr['$X']} ${attr['$Y']},`
      } else if (list[i].node === 'Arc') {
        if (i === 0) {
          d += `m ${attr['$X']} ${attr['$Y']},`
        }

        d += `a ${attr['$X']} ${attr['$Y']} ${attr['$R']} ${attr['$StartAngle']} ${attr['$Angle']},`
      } else if (list[i].node === 'TArc') {
        if (i === 0) {
          d += `m ${attr['$X']} ${attr['$Y']},`
        }
        d += `ta ${attr['$X']} ${attr['$Y']} ${attr['$X2']} ${attr['$Y2']} ${attr['$ChordH']} ${attr['$IsBulge']},`
      }

      if (!isClosePath && i === list.length - 1) {
        // 处理由dxf导入的Arc节点
        if (list[0].node === 'Arc' || list[i].node === 'Arc') {
          break
        }

        d += `l ${list[0].attr['$X']} ${list[0].attr['$Y']}`
      }
    }

    // d += 'z;' // z表示路径闭合，上面已经在路径最后补上第一个点了就不需要加z
    d += ';' // 一条路径结束用分号
    return d
  }
}


class BatchBdToImg {
  static distance = 15
  /** 批量BD转图片 */
  static batchBdToImage(bdXmls, sys, imgType) {
    let result = []
    for (let i = 0; i < bdXmls.length; i++) {
      let bd = bdXmls[i]
      let base64 = this.bdToImg(bd, sys, imgType)
      result.push(base64)
    }

    return result
  }

  /** BD转图片 */
  static bdToImg(bdXml, sys, imgType) {
    let json = parseFormulaXml(bdXml, ["HDirect"])
    let graphs = this.bdToGraphData(json)
    let group = sys.createBitmap("group")

    group.transform = this.getBdMatrix(json.attr, group.transform)

    this.addBitMaps(graphs.Graph, group)
    this.addBitMaps(graphs.FaceA, group)
    this.addBitMaps(graphs.FaceB, group)

    sys.draw()
    group.setCenter(10, 0.1)
    sys.draw()

    let base64 = sys.jcanvas.canvas.toDataURL('image/jpeg')

    sys.jcanvas.clear()
    group.destory()

    return base64
  }

  /** 创建绘制对象 */
  static createCanvasSys(container, width, height) {
    let jcanvas = new JCanvas()
    jcanvas.init(container, width, height)
    jcanvas.setCoordinate(1, -1)

    let canvasSys = new CanvasBitmapSys(jcanvas)
    canvasSys.init()
    return canvasSys
  }

  /** 获取BD的矩阵  */
  static getBdMatrix(bdAttr, transform) {
    let {
      CncBack
    } = bdAttr
    let rotateTable = {
      0: 0,
      1: 180,
      2: 90,
      3: 270
    }

    let angle = rotateTable[CncBack] || 0

    let m = this.getMatirxAfterTotate(transform, Math2d.toRads(angle))
    return m
  }

  /** 获取旋转后的矩阵(弧度制) */
  static getMatirxAfterTotate(m = [1, 0, 0, 1, 0, 0], rad) {
    return MatrixUtil.rotate(m, m, rad)

  }

  /** 解析BD的JSON获取绘制数据 */
  static bdToGraphData(bdJson) {
    let result = {
      Graph: [],
      FaceA: [],
      FaceB: []
    }

    let obj = {}

    bdJson.children.forEach(node => {
      obj[node.node] = node
    })

    let nodeTypes = ["Graph", "FaceA", "FaceB"] // 先处理轮廓，后处理面
    let lines = []
    nodeTypes.forEach(type => {
      let node = obj[type]
      if (type === "Graph") {
        result.Graph = this.graphNodeToGraphData(node.children)
        lines = result.Graph.filter(item => item.type === "Line")
      } else if (["FaceA", "FaceB"].includes(type)) {
        result[node.node] = this.faceNodeToGraphData(node.children, lines)
      }
    })

    return result
  }

  static transformArc(arc) {
    arc.type = "Arc"
    arc.isCounterClockwise = arc.anticlockwise
    arc.startAngle = arcUtil.toRads(arc.startAngle)
    arc.endAngle = arcUtil.toRads(arc.endAngle)
    return arc
  }

  /** 轮廓节点转为绘制数据 */
  static graphNodeToGraphData(list) {
    let bits = []

    for (let i = 0; i < list.length; i++) {
      let node = list[i]
      let nextNode = i === list.length - 1 ? list[0] : list[i + 1];
      let attr = node.attr

      if (node.node === "Point" && nextNode.node === "Point") {
        bits.push({
          type: 'Line',
          start: {
            x: attr.X,
            y: attr.Y
          },
          end: {
            x: nextNode.attr.X,
            y: nextNode.attr.Y
          },
          isAddTag: true
        })
      } else if (node.node === "Arc") {
        let arc = arcUtil.HGArcToCanvasArcTest({
          start: {
            x: attr.X,
            y: attr.Y
          },
          r: attr.R,
          startAngle: attr.StartAngle,
          angle: attr.Angle
        })

        this.transformArc(arc)
        bits.push(arc)
      } else if (node.node === "TArc") {
        let arc = arcUtil.calcuTArcByBDTest({
            x: attr.X,
            y: attr.Y
          }, {
            x: attr.X2,
            y: attr.Y2
          },
          attr.ChordH,
          attr.IsBulge
        )

        this.transformArc(arc)
        bits.push(arc)
      }
    }

    return bits
  }

  /** 面节点转为绘制数据 */
  static faceNodeToGraphData(list, lines) {
    let result = []
    list.forEach(node => {
      if (["BHole", "VHole"].includes(node.node)) {
        let holeGraph = this.getGraphDataByBdHole(node, lines)
        result.push(holeGraph)
      } else if (node.node === "Cut") {
        let cutGraph = this.getGraphDataByBdCut(node)
        result.push(cutGraph)
      } else if (node.node === "Path") {
        let pathGraph = this.getGraphDataByBdPath(node)
        result.push(pathGraph)
      }
    })

    return result
  }

  /** 创建标注 */
  static createTagBitmap(dataObj, groupBit, option = {}) {
    let tagBit = groupBit.createCustom(HGTagBitmap)
    let data = new HGTagDataType();
    for (let key in dataObj) {
      data[key] = dataObj[key]
    }
    tagBit.data = data
    return tagBit
  }

  /** 获取孔位需要绘制的数据 */
  static getGraphDataByBdHole(node, lines) {
    let result = {
      type: "group",
      children: []
    }
    let {
      X: x,
      Y: y,
      HDirect,
      Hole_D: hole_d,
      R = 0,
      Rb = 0,
      Rdepth = 0
    } = node.attr

    let r = R > 0 ? R / 2 : Rb / 2
    let center = {
      type: "Point",
      x,
      y
    }
    let p1 = {
      type: "Point",
      x,
      y
    }
    let p2 = {
      type: "Point",
      x,
      y
    }
    let p3 = {
      type: "Point",
      x,
      y
    }
    let p4 = {
      type: "Point",
      x,
      y
    }



    if (HDirect) {
      let newLines = this.getLinesByDirect(lines, HDirect)

      hole_d = hole_d || this.getHoleD(lines, HDirect, center)

      let range = {
        minx: x - hole_d,
        maxx: x + hole_d,
        miny: y - hole_d,
        maxy: y + hole_d
      };

      if (HDirect === "L" || HDirect === "R") {
        p2.y += r;
        p3.y -= r;
        p1.y = p2.y;
        p4.y = p3.y;
        if (HDirect === "L") {
          p1.x = p4.x = range.minx;
        } else {
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
        } else {
          p1.y = p4.y = range.miny;
        }
      }


      result.children.push({
        type: "Path",
        points: [p2, p1, p4, p3]
      })
    }

    if (r) {
      // 圆形
      let arc = {
        type: "Arc",
        radius: r,
        center,
        startAngle: 0,
        endAngle: 2 * Math.PI
      }
      let d = r * 2 // 直径

      result.children.push(arc)

      if (node.node === "BHole") {
        let line = this.calcuLine(center.x, center.y, d, -45)
        result.children.push(line)
      } else if (node.node === "VHole") {
        let line1 = this.calcuLine(center.x, center.y, d, 0)
        let line2 = this.calcuLine(center.x, center.y, d, 90)
        result.children.push(line1)
        result.children.push(line2)
      }
    }

    return result
  }

  /** 获取槽需要绘制的数据 */
  static getGraphDataByBdCut(node) {
    let result = {
      type: "group",
      children: []
    }
    let {
      X: x1,
      Y: y1,
      X1: x2,
      Y1: y2,
      Hole_Z: w
    } = node.attr

    let p1 = {
      x: x1,
      y: y1
    }
    let p2 = {
      x: x2,
      y: y2
    }
    let points = this.getLinePointsByWidth(p1, p2, w)

    let rect = {
      type: "Path",
      points,
      isClose: true
    }
    result.children.push(rect)
    return result
  }

  /** 获取图元需要绘制的数据 */
  static getGraphDataByBdPath(node) {
    let result = {
      type: "group",
      children: []
    }
    let {
      X: x,
      Y: y,
      d
    } = node.attr

    let ds = this.getPointAndArcListByPathD(d)

    let paths = ds.map(item => {
      let points = arcUtil.pointAndArcToPts(item.data, 10).map(p => {
        p.x += x
        p.y += y
        return p
      })
      return {
        type: "Path",
        points,
        isClose: item.isClose
      }
    })

    result.children.push(...paths)
    return result
  }

  /** 绘制图形 */
  static addBitMaps(list, group) {
    list.forEach(node => {
      if (node.type === "Line") {
        this.addLineBitmap(node, group)
      } else if (node.type === "Arc") {
        this.addArcBitmap(node, group)
      } else if (node.type === "Path") {
        this.addPathBitmap(node, group)
      } else if (node.type === "group") {
        let cGroup = group.createBitmap("group")
        this.addBitMaps(node.children, cGroup)
      }
    })
  }

  static addLineBitmap(node, group) {
    let {
      start,
      end,
      isAddTag = false
    } = node
    let pts = [new JPos(start.x, start.y), new JPos(end.x, end.y)]
    let path = group.createBitmap("path")
    path.data = path.getpolyLinePath(pts)

    if (isAddTag) {
      let len = arcUtil.getLineLength(start.x, start.y, end.x, end.y)
      // 标注
      let tag = this.createTagBitmap({
        start,
        end,
        text: len,
        distance: this.distance,
        fontSizeRatio: 4,
        lineColor: '#02fc14',
        textColor: '#00ffff',
      }, group)
    }

    return path
  }

  static addArcBitmap(node, group) {
    let arc = group.createBitmap("arc")

    let {
      startAngle,
      endAngle,
      radius,
      isCounterClockwise,
      center
    } = node
    arc.data = {
      startAngle,
      endAngle,
      radius,
      isCounterClockwise,
      center
    }

    return arc
  }

  /** 路径（只支持全部都是点的） */
  static addPathBitmap(node, group) {
    let pts = node.points.map(p => new JPos(p.x, p.y))
    let path = group.createBitmap("path")
    path.data = path.getpolyLinePath(pts, node.isClose)

    return path
  }

  /** 由直线的中点、长度和旋转角度得到直线两端的点 */
  static calcuLine(cx, cy, len, angle) {
    let d = len / 2
    let offsetX = d * Math.cos(arcUtil.toRads(angle));
    let offsetY = d * Math.sin(arcUtil.toRads(angle));
    let fromX = cx + offsetX;
    let fromY = cy + offsetY;
    let toX = cx - offsetX;
    let toY = cy - offsetY;
    return {
      type: "Line",
      start: {
        x: fromX,
        y: fromY
      },
      end: {
        x: toX,
        y: toY
      }
    }
  }

  // 获取宽度为w的直线的四个顶点
  static getLinePointsByWidth(p1, p2, w) {
    let d = w / 2
    let x1 = p1.x;
    let y1 = p1.y;
    let x2 = p2.x;
    let y2 = p2.y
    // 只是一个点
    if (x1 === x2 && y1 === y2) {
      return [p1, p1, p1, p1]
    }
    // 垂直线
    if (p1.x === p2.x && p1.y !== p2.y) {
      return [{
          x: p1.x + d,
          y: p1.y
        },
        {
          x: p1.x + d,
          y: p2.y
        },
        {
          x: p2.x - d,
          y: p2.y
        },
        {
          x: p2.x - d,
          y: p1.y
        }
      ]
    }

    // 水平线
    if (p1.x !== p2.x && p1.y === p2.y) {
      return [{
          x: p1.x,
          y: p1.y + d
        },
        {
          x: p2.x,
          y: p1.y + d
        },
        {
          x: p2.x,
          y: p2.y - d
        },
        {
          x: p1.x,
          y: p2.y - d
        }
      ]
    }

    // 斜线
    if (p1.x !== p2.x && p1.y !== p2.y) {
      let pts = this.getParallelLinePoints(p1, p2, d, 2)
      return [{
          x: pts.x1,
          y: pts.y1
        },
        {
          x: pts.x2,
          y: pts.y2
        },
        {
          x: pts.x4,
          y: pts.y4
        },
        {
          x: pts.x3,
          y: pts.y3
        }
      ]
    }
  }

  // 解析图元Path的路径d得到点弧列表
  static getPointAndArcListByPathD(d) {
    let paths = d.split(';').filter(path => path)

    return paths.map(path => {
      let strs = path.split(',')
      let list = []
      let isClosePath = false
      for (let str of strs) {
        let item = str.split(' ').map((string, i) => {
          if (i !== 0) {
            return Number(string)
          }

          return string
        })

        if (item[0] !== 'z') {
          let node = {
            x: item[1],
            y: item[2]
          }

          if (item[0] === 'a') {
            let arc = arcUtil.HGArcToCanvasArcTest({
              start: {
                x: node.x,
                y: node.y
              },
              r: item[3],
              startAngle: item[4],
              angle: item[5]
            })

            node.type = 'Arc'
            Object.assign(node, arc)
          } else if (item[0] === 'ta') {
            let start = {
              x: node.x,
              y: node.y
            }
            let end = {
              x: item[3],
              y: item[4]
            }
            let h = item[5]

            let arc = arcUtil.calcuTArcByBDTest(
              start,
              end,
              h,
              item[6]
            )
            node.type = 'Arc'
            Object.assign(node, arc)
          } else if (item[0] === 'm' || item[0] === 'l') {
            node.type = 'Point'
            if (item[0] === 'm') {
              node.isFirstPoint = true
            } else {
              node.isFirstPoint = false
            }
          }

          list.push(node)
        } else if (item[0] === 'z') {
          isClosePath = true
        }
      }

      return {
        isClose: isClosePath,
        data: list
      }
    })
  }

  /* 获取平行线的顶点
   * @param p1 线段一端顶点的坐标
   * @param p2 线段另一端顶点的坐标
   * @param d 与线段平行的距离
   * @param sideNum 平行线的个数
   * @return {Object} 平行线的顶点坐标
   */
  static getParallelLinePoints(p1, p2, d, sideNum = 1) {
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

  // 获取水平孔到边的距离
  static getHoleD(lines, direct, p) {
    let len = 0;

    lines.forEach(line => {
      let {
        start: p1,
        end: p2
      } = line
      let res = this.isPointInLineRange(p, p1.x, p1.y, p2.x, p2.y);

      if (res) {
        let dist;
        if (direct === "L") dist = p.x - p1.x;
        if (direct === "R") dist = p1.x - p.x;
        if (direct === "U") dist = p1.y - p.y;
        if (direct === "D") dist = p.y - p1.y;
        if (dist && dist > 0) {
          if (len === 0 || len > dist) len = dist;
        }
      }
    })

    let holeD = 29; // 默认水平孔深度
    if (len) {
      holeD = len;
    }

    return holeD
  }

  // 获取某个方向的线
  static getLinesByDirect(lines, direct) {
    let rules = {
      竖正: "L",
      竖负: "R",
      横正: "U",
      横负: "D"
    };

    if (direct) {
      let newLines = lines.filter(line => {
        let {
          start,
          end
        } = line
        let type = this.getLineType(start.x, start.y, end.x, end.y)
        let direction = this.getLineDirect(start.x, start.y, end.x, end.y, type)
        return direct === rules[type + direction];
      })

      return newLines
    }

    return lines
  }

  // 判断是横线还是竖线
  static getLineType(x1, y1, x2, y2) {
    if (x1 !== x2 && y1 === y2) {
      return "横";
    } else if (x1 === x2 && y1 !== y2) {
      return "竖";
    } else {
      return "斜";
    }
  }

  // 判断线的方向
  static getLineDirect(x1, y1, x2, y2, lineType) {
    lineType = lineType || this.getLineType(x1, y1, x2, y2)

    if (lineType === "横") {
      return x2 - x1 >= 0 ? '正' : '负'
    } else {
      return y2 - y1 >= 0 ? '正' : '负'
    }
  }

  //  判断点是否在线段（水平线或垂直线）范围内
  static isPointInLineRange(p, x1, y1, x2, y2, lineType) {
    lineType = lineType || this.getLineType(x1, y1, x2, y2)

    let result = false

    if (lineType === '横') {
      if ((p.x > x1) !== (p.x > x2)) result = true
    }
    if (lineType === '竖') {
      if ((p.y > y1) !== (p.y > y2)) result = true
    }
    return result
  }
}

// 批量新旧BD转换
class BatchBdTransform{
  // 节点Node和需要保存的字段（saveAttrs）的关系
  static nodeIndex = {
    "Board" :"Board",
    "Point":"Graph-Child",
    "Arc":"Graph-Child",
    "BHole":"Hole",
    "VHole":"Hole",
    "Cut":"Cut"
  }
  // 直接拷贝的字段
  static saveAttrs = {
    "Board":[
      "L","W","BH","CA","CB","CC","CD","CE","CF","CG","CH","CI","CJ","CK","CL","CM","CN","CO","CP",
      "BlockMemo","BomStd","CBNO","CLIENT","CLIENTADDR","CLIENTMOBILEPHONE","CLIENTPHONE","Classify1",
      "Classify2","Classify3","Classify4","Classify5","CncBack","CncBack1","Color","DESNO",
      "DFB","FB","LFB","DI","DevCode","DfbName","FBSTR","FbName","GNO","Group","HASHHOLE","HoleFlag","HoleStr","Iswd",
      "JXS","JXSADDR","JXSPHONE","KcFlag","KcStr","LfbName","MEMO","Mat","Mat2","Mat3","NAME","NumberText",
      "ORDER","ORDERNUM","OrderType","PackNo","ProductID","ProductLevel","ProductNums","RFB","RfbName",
      "SIZE","TIME","TYPE","ToHoleDistance","UFB","UNIT","USER","UfbName","VeneerMat","WlCode","WlType",
      "WlUnit","Workflow","YHFB","planeType"
    ],
    "Graph-Child":[
      "X","Y","Angle","Face","HDirect","Hole_Xcap","Hole_Ycap","Holenum_X","Holenum_Y","Hotspot",
      "IsDim","R","Rb","StartAngle","X1","XA","Y1","YA"
    ],
    'Hole':[
      "X","Y","Face","FaceType","HDirect","HoleName","Hole_D","Hole_Xcap","Hole_Ycap","Hole_Z","Holenum_X",
      "Holenum_Y","R","Rb","Rbdepth","Rdepth","Rtype","X1","X1depth"
    ],
    "Cut":[
      "X","Y","X1","Y1","CutName","Cutter","Face","Hole_Z","device"
    ]
  }
  // 需要计算的属性
  static calcuAttrs = {
    "Board":["ABHoleInfo","ABKcInfo","AlienNum","IsAlien"]
  }

  // 需要替换的属性
  static repalceAttrs = {
    "Board":{
      "Classify1":"YGMAT",
      "Classify2":"YGNO1",
      "Classify3":"YGNO2"
    }
  }

  // 旧BD转新BD
  static oldBDToNewBD(xml){
    if(!xml) return ""

    let json = XmlUtil.toJson(xml)[0]

    this.patchNodeAttr(json)
    this.calcuBdAttrs(json)

    let newXml = XmlUtil.toXml(json, {
      "Board":["L","W","BH"],
      "Point":["X","Y"],
      "Arc":["X","Y"],
      "TArc":["X","Y","X2","Y2"],
      "BHole":["X","Y"],
      "VHole":["X","Y"],
      "Cut":["X","Y","X2","Y2"],
    })
    // console.log('[ newXml ] >', newXml)
    return newXml
  }

  // 更新节点属性
  static patchNodeAttr(node){
    let {node:nodeType,children} = node
    let keys = this.saveAttrs[this.nodeIndex[nodeType]]
    let keyObj = this.repalceAttrs[this.nodeIndex[nodeType]]
   
    if(keys){
      let attr = {}
      keys.forEach( key => {
        let val = node.attr[key]
        attr[key] = val !== undefined ? val : ""
      })

      if(keyObj){
        for(let key in keyObj){
          let key2 = keyObj[key]
          let val = node.attr[key2]
          if(val !== undefined){
            attr[key] = val
          }
        }
      }

      node.attr = attr
    }

    if(children){
      children.forEach( child => this.patchNodeAttr(child))
    }
  }

  // 添加需要计算的BD属性
  static calcuBdAttrs(bdJson){
    let graphNode = null
    let faceANode = null
    let faceBNode = null
    bdJson.children.forEach( node => {
      let nodeType = node.node
      if(nodeType === "Graph"){
        graphNode = node
      }else if(nodeType === "FaceA"){
        faceANode = node
      }else if(nodeType === "FaceB"){
        faceBNode = node
      }
    })

    let {aliennum, isAlien} = this.calAliienNums(graphNode.children, bdJson.attr)
    let {abholeinfo,abkcinfo} = this.calHoleInfo(faceANode,faceBNode)
    bdJson.attr["AlienNum"] = aliennum
    bdJson.attr["IsAlien"] = isAlien
    bdJson.attr["ABHoleInfo"] = abholeinfo
    bdJson.attr["ABKcInfo"] = abkcinfo

    this.setBdCncBack(bdJson)
  }

  // 设置BD的CncBack
  static setBdCncBack(bdJson){
    let attr = bdJson.attr
    let cncback = String(attr.CncBack) 
    let vhole = this.getR36VHole(bdJson)
  
    if(vhole){
      // 表示该BD属于门
      let newCncback = this.getCncbackByVHole(vhole)
      if(newCncback != -1 && cncback == 0){
        attr.CncBack = newCncback
      }
    }else if(cncback){
      // 普通板件
      let table = {
        0:  1,
        1:  0,
        2:  3,
        3:  2
      }
      attr.CncBack = table[cncback]
    }
  }

  // 获取第一个垂直孔的R=36
  static getR36VHole(bdJson){
    for(let i = 0; i < bdJson.children.length;i++){
      let node = bdJson.children[i]
      if(['FaceA',"FaceB"].includes(node.node)){
        for(let j = 0; j < node.children.length;j++){
          let hole = node.children[j]
          if(hole.node === "VHole" && Number(hole.attr.R) == 36){
            return hole
          }
        }
      }
    }
  }

  // 判断孔位获取新的cncback值，为-1表示没有匹配的
  static getCncbackByVHole(hole){
    if(hole.node !== "VHole") return -1
    let attr = hole.attr
    let r = Number(attr.R)
    
    if(r !== 36){
      // 36是固定死，只适用易高
      return -1
    }

    let x = Number(attr.X)
    let y = Number(attr.Y)
    let isXNumber = !isNaN(x)
    let isYNumber = !isNaN(y)

    if(isXNumber && isYNumber){
      // x和y都是纯数字
      // return 2  // 不做处理
    }else if(isYNumber && String(attr.X).match('L')){
      return 3
    }else if(String(attr.Y).match('W')){
      return 1
    }

    return -1
  }

  // 计算异形数量
  static calAliienNums(nodes = [],bdAttr = {}){
    let { L : l = 0, W: w = 0} = bdAttr
    let alienedgenums = 0
    let alienarcnums = 0
    
    let len = nodes.length
    for(let i = 0;i < len;i++){
      let n = nodes[i]
      let attr = n.attr

      if(n.node === "Arc"){
        //圆弧边  Angle的值不等于0且R不等于0时，为圆弧边；
        let angle = calcFormula(n.attr.Angle, bdAttr)
        let r = calcFormula(n.attr.R, bdAttr)

        if(Math.abs(angle) > 0 && r != 0){
          alienarcnums++
          continue
        }
      }else if(n.node === "TArc"){
        let chordH = calcFormula(n.attr.ChordH, bdAttr)
        //圆弧边 弦高 ChordH 值不等于0时
        if(chordH !== 0){
          alienarcnums++
          continue
        }
      }else{
        // 点
        let nextNode = i !== len - 1 ? nodes[i + 1] : nodes[0]
        let x = calcFormula(n.attr.X, bdAttr)
        let y = calcFormula(n.attr.Y, bdAttr)
        let x2 = calcFormula(nextNode.attr.X, bdAttr)
        let y2 = calcFormula(nextNode.attr.Y, bdAttr)
        
        if(Math.abs(x- x2) < 1 && Math.abs(y - y2) < 1){
          continue
        }

        if(Math.abs(x - x2) < 1 && (Math.abs(x - 0) < 1 || Math.abs(x - l) < 1)){
          continue
        }

        if(Math.abs(y - y2) < 1 && (Math.abs(y - 0) < 1 || Math.abs(y- w) < 1)){
          continue
        }

        alienedgenums++
      }
    }

    let aliennum = `L${alienedgenums}A${alienarcnums}`
    let isAlien = alienedgenums + alienarcnums === 0 ? "" : "异形"
    return {
      aliennum,
      isAlien
    }
  }

  // 计算孔位信息
  static calHoleInfo(faceANode,faceBNode){
    let r1 = this.hasHC(faceANode)
    let r2 = this.hasHC(faceBNode)

    function getInfo(aHas,bHas){
      if(aHas && !bHas){
        return "A"
      }else if(!aHas && bHas){
        return  "B"
      }else if(aHas && bHas){
        return "C"
      }

      return ""
    }
 
    let abholeinfo = getInfo(r1.hasHole,r2.hasHole)
    let kcInfo = getInfo(r1.hasCut,r2.hasCut)
    let abkcinfo = kcInfo !== "" ? `K${kcInfo}` : ""

    return {abholeinfo,abkcinfo}
  } 

  // 判断是否存在孔槽
  static hasHC(faceNode){
    let hasHole = false
    let hasCut = false
    if(!faceNode) return {
      hasHole,
      hasCut
    }

    for(let i = 0; i < faceNode.children.length;i++){
      let n = faceNode.children[i]
      if(n.node === "BHole" || n.node === "VHole"){
        hasHole = true
      }

      if(n.node === "Cut"){
        hasCut = true
      }

      if(hasHole && hasCut){
        return {hasHole, hasCut}
      }
    }

    return {hasHole, hasCut}
  }
}