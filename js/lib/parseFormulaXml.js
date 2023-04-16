/**
 * @author lze
 * @description 解析带公式的XML
 * @version 20210812
 */

let BASEURL = window.locationOriginHm || "http://qdsoft.huaguangsoft.com/"

// 解析带公式的xml
function parseFormulaXml(xml, noCalcuKeys, options = {}) {
  let data = XmlUtil.toJson(xml)[0]
  calcuNode(data, {}, noCalcuKeys, {}, options)
  return data
}

function calcuNode(node, pAttr, noCalcuKeys = [], cache = {}, options = {}) {
  let {
    isSaveAttrOldVal = true, // 是否保留原值
  } = options

  for (let key in node.attr) {
    if (isSaveAttrOldVal) {
      node.attr[`$${key}`] = node.attr[key]
    }

    if (!noCalcuKeys.includes(key)) {
      let value = node.attr[key]
      let newValue = ''

      // 判断公式value是否被计算过
      if (cache[`${value}`] === undefined) {
        // 没有计算过，计算公式
        newValue = calcFormula(value, pAttr)

        cache[`${value}`] = newValue
      } else {
        // 计算过，读取缓存结果
        newValue = cache[value]
      }

      node.attr[key] = newValue
    } else {
      // console.log(key)
    }
  }

  calcDInPath(node, [pAttr, node.attr])

  if (node.children.length > 0) {
    let valueCahce = {}
    let attr = Object.assign({}, pAttr, node.attr)

    for (let childNode of node.children) {
      calcuNode(childNode, attr, noCalcuKeys, valueCahce, options)
    }

    valueCahce = null
  }
}

// 优化后的解析带公式的xml
function parseFormulaHGXml(xml, options = {}) {
  let data = XmlUtil.toJson(xml)[0]
  let {
    isSaveAttrOldVal,
    calcuKeys = [],
    noCalcuKeys = []
  } = options

  let opts = {
    isSaveAttrOldVal,
    isCalcuKey(key) {
      if (calcuKeys.includes(key)) return true
      if (noCalcuKeys.includes(key)) return false
      return false
    },
    nodeHandler(node, attrs = []) {
      calcDInPath(node, attrs)
    }
  }
  let cache = {}
  calcuNodePro(data, {}, opts, cache)
  cache = null
  return data
}

function calcuNodePro(node, pAttr, options = {}, cache = {}) {
  let {
    isSaveAttrOldVal = true, // 是否保留原值
    isCalcuKey, // 判断该字段是否需要计算公式
    nodeHandler // 节点处理程序
  } = options

  for (let key in node.attr) {
    if (isSaveAttrOldVal) {
      node.attr[`$${key}`] = node.attr[key]
    }

    if (isCalcuKey && isCalcuKey(key)) {
      // 计算字段公式
      let value = node.attr[key]
      let newValue = ''

      // 判断公式value是否被计算过
      if (cache[`${value}`] === undefined) {
        // 没有计算过，计算公式
        newValue = calcFormula(value, pAttr)

        cache[`${value}`] = newValue
      } else {
        // 计算过，读取缓存结果
        newValue = cache[value]
      }

      node.attr[key] = newValue
    }
  }

  nodeHandler && nodeHandler(node, [pAttr, node.attr])

  if (node.children.length > 0) {
    let valueCahce = {}
    let attr = Object.assign({}, pAttr, node.attr)

    for (let childNode of node.children) {
      calcuNodePro(childNode, attr, options, valueCahce)
    }

    valueCahce = null
  }
}

// 重新计算解析后的数据
function calc$Node(node, pAttr = {}) {
  for (let key in node.attr) {
    let newKey = key.replace(/^\$/, '')
    if (newKey !== key) {
      node.attr[newKey] = calcFormula(node.attr[key], pAttr)
    }
  }

  calcDInPath(node, [pAttr, node.attr])

  if (node.children.length > 0) {
    let attr = Object.assign({}, (pAttr || {}), node.attr)
    for (let childNode of node.children) {
      calc$Node(childNode, attr)
    }
  }
}

function calcFormula(formula, attrs) {
  if (typeof formula === 'number' || formula === '' || typeof formula === 'boolean') return formula
  if (isNumber(formula)) return Number(formula)

  let attr = mergeObj(attrs)
  let newFormula = replace(formula, attr)

  try {
    return eval(newFormula)
  } catch (error) {
    return newFormula
  }
}

// 特殊处理<Path>节点的d属性
function calcDInPath(node, attrs) {
  // 特殊处理<Path>节点的d属性。d属性的变量优化读取本节点的变量
  if (node.node === 'Path' && node.attr['$d']) {
    node.attr['d'] = Path2dUtil.calcuPathD(node.attr['$d'], attrs)
  }
}

// 判断字符串是否为数字
function isNumber(str) {
  if (typeof str === 'number') return true
  if (typeof str === 'boolean') return false
  if (!str && str !== 0) return false

  let re = /^\d+$/
  let arr = str.split('.')
  if (arr.length === 1) return re.test(arr[0])
  if (arr.length === 2) return re.test(arr[0]) && re.test(arr[1])
  if (arr.length > 2) return false
}

// 合并对象（含变量）
function mergeObj(objs) {
  let result = {}

  if (!(objs instanceof Array)) {
    return objs
  }

  for (let obj of objs) {
    for (let key in obj) {
      if (result[key] === undefined || result[key] === '' || result[key] === null) {
        result[key] = obj[key]
      } else {
        let value = obj[key]
        if (typeof value === 'number') {
          result[key] = value
        } else if (typeof value === 'string') {
          value = replace(value, result)
          try {
            result[key] = eval(value)
          } catch (error) {
            result[key] = value
          }
        }

      }
    }
  }

  return result
}

function replace(formula, attrs) {
  let newFormula = ''
  let list = parseFormula(formula)

  list.forEach(data => {
    if (data.type === 'symbol') {
      newFormula += data.value
    } else if (data.type === 'value') {
      let value = attrs[data.value]
      let newValue = ''
      if (value !== undefined && value !== '' && value !== 'undefined') {
        newValue = `${value}`
      } else {
        newValue = data.value
      }

      if (newValue) {
        newFormula += newValue
      }
    }
  })

  return newFormula
}

// 解析带变量的公式
function parseFormula(string) {
  const ISVALUA = 1
  const ISSYMBOL = 2

  let result = []
  let temp = ''
  let currentStatus = 0
  let length = string.length

  function checkChar(char, i, type1, type2, status1, status2) {
    if (currentStatus === 0) {
      temp = char
    } else if (currentStatus === status1) {
      temp += char
    } else if (currentStatus === status2) {
      result.push({
        type: type1,
        value: temp
      })
      temp = char
    }

    if (length - 1 === i) {
      result.push({
        type: type2,
        value: temp
      })
    }

    currentStatus = status1
  }

  for (let i = 0; i < length; i++) {
    let char = string[i]
    let charNum = char.charCodeAt(0)

    if ((97 <= charNum && charNum <= 122) || // 小写字母
      (65 <= charNum && charNum <= 90) || // 大写字母
      (48 <= charNum && charNum <= 57) || // 数字
      (charNum === 46) // 小数点
    ) {
      checkChar(char, i, 'symbol', 'value', ISVALUA, ISSYMBOL)
    } else {
      checkChar(char, i, 'value', 'symbol', ISSYMBOL, ISVALUA)
    }
  }

  return result
}

class XmlUtil {
  // 通过Element对象获取json对象
  static getNode(element) {
    let Node = {
      node: element.nodeName,
      attr: {},
      children: [],
      text: ''
    }

    let attrs = element.attributes
    let attr = {}
    if (attrs !== undefined) {
      for (let j = attrs.length - 1; j >= 0; j--) {
        let a = attrs[j].name
        let v = attrs[j].value
        attr[a] = v
      }
    }

    Node.attr = attr
    Node.text = element.data

    return Node
  }
  // xml 转 json 对象
  static toJson(xml) {
    // 去掉换行符
    xml = xml.replace(/\\+r\\+n/g, '\n').replace(/\\\\t/g, '\t')

    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(xml, 'text/xml')
    let root = xmlDoc.documentElement
    let jsonobj = []
    if (!root) {
      console.log('文件可能出现乱码，无法解析!')
      return false
    }

    let that = this
    let Node = that.getNode(root)

    function Xml2Json(xml, jsonobj) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        let nodes = xml.childNodes[i]

        if (nodes instanceof Element) {
          let node = that.getNode(nodes)
          if (nodes.hasChildNodes()) {
            Xml2Json(nodes, node.children)
          }
          jsonobj.push(node)
        } else if (nodes instanceof CDATASection) {
          let cdataNode = that.getNode(nodes)
          jsonobj.push(cdataNode)
        }
      }
    }
    Xml2Json(root, Node.children)
    jsonobj.push(Node)
    return jsonobj
  }

  // json 转 xml
  static toXml(obj, keyObj = {}) {
    let xml = '<?xml version="1.0" encoding="utf-8"?>\r\n'
    let o

    if (obj instanceof Array) {
      o = obj[0]
    } else {
      o = obj
    }

    function startTag(obj) {
      let tagName = obj.node
      let attr = obj.attr
      let result = '<' + tagName
      let keys = keyObj[tagName] || []

      Object.keys(obj.attr).sort().forEach(key => {
        if (keys.indexOf(key) === -1) {
          keys.push(key)
        }
      })

      keys.forEach(key => {
        let value = attr[key]
        if (value !== undefined) {
          result += ' ' + key + '=\"' + value + '\"'
        }
      })

      result += '>'
      return result
    }

    function endTag(obj) {
      let result = '</' + obj.node + '>\r\n'
      return result
    }

    function addChildren(arr, level) {
      if (!arr) return ''

      let result = ''

      let t = '\t'.repeat(level - 1)
      arr.forEach((child) => {
        if (child.node === "#cdata-section") {
          result += `${t}<![CDATA[${child.text}]]>\r\n`
        } else {
          let hasChildren = child.children && child.children.length > 0

          result += (t + startTag(child))

          if (hasChildren) {
            result += '\r\n'
            result += addChildren(child.children, level + 1)
            result += (t + endTag(child))
          } else {
            result += endTag(child)
          }
        }
      })
      return result
    }

    xml += (startTag(o) + '\r\n')
    xml += addChildren(o.children, 1)
    xml += endTag(o)
    return xml
  }
}

/**
 * 弧相关的数学计算
 */

const arcUtil = {
  /**
   * 计算圆弧的其他属性(BD的Arc)
   * @param start 圆弧的起点坐标
   * @param radius 圆弧的半径
   * @param startAngle 圆弧的起始角度（弧度制）
   * @param angle 圆弧的旋转角度（弧度制）
   */
  calcuArcByBD(start, radius, startAngle, angle) {
    let isCounterClockwise = false
    let center = this.getArcCenter(start.x, start.y, radius, startAngle)

    let endAngle = startAngle + angle
    let middle = this.rotationPoint(center.x, center.y, start.x, start.y, -angle / 2)
    let end = this.rotationPoint(center.x, center.y, start.x, start.y, -angle)

    if (angle > 0) {
      isCounterClockwise = true
    }

    return {
      start,
      center,
      end,
      radius,
      startAngle: this.hgAngleToCanvasAngle(startAngle),
      endAngle: this.hgAngleToCanvasAngle(endAngle),
      anticlockwise: isCounterClockwise,
      isCounterClockwise,
      middle
    }
  },

  calcuTArcByBD(start, end, h, isBulge) {
    let direction = isBulge == 1 ? 2 : 3
    let radius = (4 * h * h + (start.x - end.x) ** 2 + (start.y - end.y) ** 2) / (8 * h) // 很重要的公式
    let center = this.getArcCenter2(start, end, radius, direction, h <= radius)
    let startAngle = this.toPositiveDegree(this.lineAngle(start.x, start.y, center.x, center.y))
    let endAngle = this.toPositiveDegree(this.lineAngle(end.x, end.y, center.x, center.y))
    let isCounterClockwise = isBulge == 1

    if (!isCounterClockwise && startAngle > endAngle) {
      endAngle += 360
    } else if (isCounterClockwise && endAngle > startAngle) {
      endAngle -= 360
    }

    let angle = endAngle - startAngle
    let middleAngle = this.toRads((startAngle + endAngle) / 2)
    let middle = this.getPointByRad(center, radius, middleAngle)

    return {
      start,
      end,
      h,
      center,
      radius,
      middle,
      startAngle: this.toRads(startAngle),
      endAngle: this.toRads(endAngle),
      middleAngle,
      angle: this.toRads(angle),
      anticlockwise: isCounterClockwise,
      isCounterClockwise
    }
  },

  /**
   * arc转为TArc
   */
  arcToTarc(x, y, r, startAngle, angle) {
    let start = {
      x,
      y
    }
    startAngle = this.toRads(startAngle)
    angle = this.toRads(angle)

    let attr = this.calcuArcByBD(
      start,
      r,
      startAngle,
      angle
    )

    let end = attr.end
    let middle = attr.middle
    let center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    }

    let ChordH = this.getLineLength(middle.x, middle.y, center.x, center.y)
    let IsBulge = attr.isCounterClockwise ? 1 : 0
    return {
      x2: end.x,
      y2: end.y,
      isBulge: attr.isCounterClockwise ? 1 : 0,
      chordH: ChordH,

      X: x,
      Y: y,
      X2: end.x,
      Y2: end.y,
      ChordH,
      IsBulge
    }
  },

  // Tarc转为arc
  tArcToArc(x, y, x2, y2, isBulge, chordH) {
    let attr = this.calcuTArcByBD({
      x,
      y
    }, {
      x: x2,
      y: y2
    },
      chordH,
      isBulge
    )

    let X = x
    let Y = y
    let Angle = this.toDegrees(-attr.angle)
    let StartAngle = this.toDegrees(-attr.startAngle)
    let R = attr.radius

    return {
      x,
      y,
      startAngle: StartAngle,
      angle: Angle,
      radius: R,

      X,
      Y,
      Angle,
      StartAngle,
      R
    }
  },

  /**
   * 华广弧度值转为画布的弧度制
   */
  hgAngleToCanvasAngle(angle) {
    angle = this.toDegrees(angle)

    while (angle >= 360) {
      angle -= 360
    }

    return this.toRads(360 - angle)
  },

  // 负角度转为正角度来表示,且小于360度
  toPositiveDegree(degree) {
    while (degree < 0) {
      degree += 360
    }

    return degree % 360
  },

  /**
   * 获取弧的圆心坐标
   * @param sx 弧的起始点x坐标
   * @param sy 弧的起始点y坐标
   * @param r  弧的半径
   * @param sAngle 弧的起始点角度
   * @return 返回圆心坐标
   */
  getArcCenter(sx, sy, r, sAngle) {
    let rad = -sAngle
    let x0 = sx - Math.cos(rad) * r
    let y0 = sy - Math.sin(rad) * r

    return {
      x: x0,
      y: y0
    }
  },
  // 获取点围绕中心点旋转后的坐标
  rotationPoint(cx, cy, x, y, rotation) {
    let sin = this.round(Math.sin(rotation), 10)
    let cos = this.round(Math.cos(rotation), 10)
    let x1 = x - cx
    let y1 = y - cy
    let x2 = x1 * cos - y1 * sin
    let y2 = y1 * cos + x1 * sin

    return {
      x: cx + x2,
      y: cy + y2
    }
  },
  /**
   * 根据圆弧的弦的向量角度、圆弧的顺逆和圆弧的包角是否为较小的，来确定圆弧的圆心
   * @param p1 起始点
   * @param p2 终止点
   * @param r  圆弧的半径
   * @param direction  圆弧的顺逆，2为顺圆，3为逆圆
   * @param isMinorArc 圆弧的包角是否为较小的
   */
  getArcCenter2(p1, p2, r, direction, isMinorArc) {
    let center // 圆弧的圆心
    let centers = this.getCircleCenter(p1, p2, r) // 求圆弧的两个圆心

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
  },

  /**
   * 已知圆的两个点和圆的半径，求圆心坐标
   * @param p1 圆上的点的坐标
   * @param p2 圆上的点的坐标
   * @param r  圆的半径
   * @return 返回两个圆心坐标
   */
  getCircleCenter(p1, p2, r) {
    if (p1.x === p2.x) {
      let dLen = Math.abs(p2.y - p1.y) // 弦长
      let midX = p1.x // 弦中心点的x
      let midY = (p1.y + p2.y) / 2 // 弦中心点的y
      let cLen = Math.sqrt(r ** 2 - (dLen / 2) ** 2) // 弦心距

      return [{
        x: midX + cLen,
        y: midY
      },
      {
        x: midX - cLen,
        y: midY
      }
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

    return [{
      x: x1,
      y: y1
    },
    {
      x: x2,
      y: y2
    }
    ]
  },

  /**
   * 获取直线(有方向）的角度
   * @param fromX 终点的x坐标
   * @param fromY 终点的y坐标
   * @param toX 起点的x坐标
   * @param toY 起点的y坐标
   * @return 直线的角度（值为弧度）
   */
  lineAngle(fromX, fromY, toX, toY) {
    return Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
  },
  // 角度转弧度
  toRads(degrees) {
    return (Math.PI * degrees) / 180
  },
  // 弧度转角度
  toDegrees(rads) {
    return (rads * 180) / Math.PI
  },
  // 根据弧度、圆心和半径求坐标
  getPointByRad(center, radius, rad) {
    return {
      x: center.x + radius * Math.cos(rad),
      y: center.y + radius * Math.sin(rad)
    }
  },
  // 两点间的距离
  getLineLength(x1, y1, x2, y2) {
    let res = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    // res = Math.round(res)
    return res
  },
  // 对浮点数进行四舍五入，并保留指定位数的小数
  round(num, digit = 0) {
    let int = 10 ** digit
    return Math.round(num * int) / int
  },

  // 将华广的弧转为画布的弧
  HGArcToCanvasArc(hgarcAttr, cfg = {}) {
    let isCounterClockwise = false
    let {
      start,
      r,
      startAngle,
      angle
    } = hgarcAttr
    let center = this.getArcCenter(start.x, start.y, r, startAngle)

    // 兼容特殊处理，一般不用cfg的.为解决画布旋转导致圆弧偏离问题
    startAngle = this.toRads(startAngle - (cfg.rotation || 0))

    angle = this.toRads(angle)

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
  },

  // 将华广的弧转为画布的弧
  HGArcToCanvasArcTest(hgarcAttr) {
    let anticlockwise = false
    let {
      start,
      r,
      startAngle,
      angle
    } = hgarcAttr

    function toRads(angle) {
      return (Math.PI * angle) / 180
    }
    // 基于标准坐标系计算
    function getArcCenter(sx, sy, r, sAngle) {
      let rad = toRads(sAngle)
      let x0 = sx - Math.cos(rad) * r
      let y0 = sy - Math.sin(rad) * r

      return {
        x: x0,
        y: y0
      }
    }

    // 华广角度转为标准坐标系的角度(弧度值)
    function hgAngleAndStandardAngleConversion(angle) {
      angle = 360 - angle

      while (angle < 0 || angle >= 360) {
        if (angle < 0) {
          angle += 360
        } else if (angle >= 360) {
          angle -= 360
        }
      }

      return angle
    }

    function rotationPoint(cx, cy, x, y, rotation) {
      rotation = (Math.PI * rotation) / 180
      let sin = Math.sin(rotation)
      let cos = Math.cos(rotation)
      let x1 = x - cx
      let y1 = y - cy
      let x2 = x1 * cos - y1 * sin
      let y2 = y1 * cos + x1 * sin

      return {
        x: cx + x2,
        y: cy + y2
      }
    }
    let endAngle = hgAngleAndStandardAngleConversion(startAngle + angle)
    startAngle = hgAngleAndStandardAngleConversion(startAngle)
    let center = getArcCenter(start.x, start.y, r, startAngle)

    // 华广坐标系和标准坐标系的方向是相反的
    let middle = rotationPoint(center.x, center.y, start.x, start.y, -angle / 2)
    let end = rotationPoint(center.x, center.y, start.x, start.y, -angle)

    // 标准坐标系角度转为canvas坐标系的角度
    if (angle > 0) {
      anticlockwise = true
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
      anticlockwise
    }
  },

  calcuTArcByBDTest(start, end, h, isBulge) {
    function rotationPoint(cx, cy, x, y, rotation) {
      rotation = (Math.PI * rotation) / 180
      let sin = Math.sin(rotation)
      let cos = Math.cos(rotation)
      let x1 = x - cx
      let y1 = y - cy
      let x2 = x1 * cos - y1 * sin
      let y2 = y1 * cos + x1 * sin

      return {
        x: cx + x2,
        y: cy + y2
      }
    }

    let direction = isBulge == 1 ? 2 : 3
    let radius = (4 * h * h + (start.x - end.x) ** 2 + (start.y - end.y) ** 2) / (8 * h) // 很重要的公式
    let center = this.getArcCenter2(start, end, radius, direction, h <= radius)
    let startAngle = this.toPositiveDegree(this.lineAngle(start.x, start.y, center.x, center.y))
    let endAngle = this.toPositiveDegree(this.lineAngle(end.x, end.y, center.x, center.y))
    let anticlockwise = isBulge == 1

    let angle = endAngle - startAngle
    if (anticlockwise) {
      if (angle < 0) {
        angle *= -1
      } else {
        angle = 360 - angle
      }
    } else {
      if (angle < 0) {
        angle = (360 + angle) * (-1)
      } else {
        angle *= -1
      }
    }

    let middle = rotationPoint(center.x, center.y, start.x, start.y, -angle / 2)
    return {
      start,
      middle,
      center,
      end,
      startAngle,
      angle,
      endAngle,
      radius,
      anticlockwise
    }
  },

  // 转换为画布的弧的属性
  getCanvasArcByHGArc(hgArc) {
    if (hgArc.type === 'arc') {
      return this.HGArcToCanvasArc(hgArc)
    } else if (hgArc.type === 'tArc') {
      // let tArc = this.calcuTArcByBD(hgArc.start,hgArc.end,hgArc.h,hgArc.isBulge)
      let tArc = this.calcuTArcByBDTest(hgArc.start, hgArc.end, hgArc.h, hgArc.isBulge)
      // 因坐标系已设置原点为左下角，需对角度和绘图方向进行反向赋值
      // tArc.startAngle = -tArc.startAngle
      // tArc.endAngle = -tArc.endAngle
      // tArc.isCounterClockwise = !tArc.isCounterClockwise

      return tArc
    }
  },

  /**
   * 射线算法
   * @param pos 射线的起点
   * @param radian 射线弧度
   * @param distance 射线距离
   * @returns 射点坐标
   */
  getRayPos(pos, radian, distance) {
    return {
      x: pos.x + (distance * Math.cos(radian)),
      y: pos.y + (distance * Math.sin(radian))
    }
  },

  // 弧转为离散点
  arcToPts(arc, segmentNum = 10) {
    let pArr = []
    let angle = arc.angle
    let a = angle > 0 ? -1 : 1
    let r = arc.radius
    let offsetAngle = Math.abs(angle / segmentNum)
    let center = arc.center

    for (let i = 0; i <= segmentNum; i++) {
      let endAngle = arc.startAngle + a * offsetAngle * i
      let p = this.getRayPos(center, this.toRads(endAngle), r)
      pArr.push(p)
    }
    return pArr
  },

  /** 将点弧转为离散点 */
  pointAndArcToPts(list, segment) {
    let newList = []
    list.forEach(item => {
      if (item.type === 'Point') {
        newList.push(item)
      } else if (item.type === 'Arc') {
        return arcUtil.arcToPts(item, segment).map(pt => {
          pt.type = 'Point'
          newList.push(pt)
        })
      }
    })

    return newList
  },

  /**
   * 获取圆弧夹角
   * @param obj 圆弧数据
   * @returns 夹角角度
   */
  getArcAngle(obj) {
    let startAngle = this.toRads(obj.startAngle)
    let endAngle = this.toRads(obj.endAngle)
    let radian = this.getArcRadian({
      startAngle,
      endAngle
    })

    return this.toDegrees(radian)
  },

  /**
   * 获取圆弧夹角
   * @param obj 圆弧数据
   * @returns 夹角弧度
   */
  getArcRadian(obj) {
    let start = this.getAbsRadian(obj.startAngle, false);
    let end = this.getAbsRadian(obj.endAngle, false);
    return this.getAbsRadian(end - start, true);
  },

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
}

/** 获取有数据的面 */
function getPlaneData(data) {
  let planeTypes = ['PlaneXY', 'PlaneYZ', 'PlaneXZ']
  let plane = data.children.filter(plane => planeTypes.includes(plane.node) && plane.children.length > 0)[0]
  return plane
}

/** 获取轮廓点弧的列表(兼容x2d和bd) */
function getOutlineList(data) {
  if (data.node === 'Graph') {
    // x2d
    let plane = getPlaneData(data)
    return plane.children
  } else if (data.node === 'Board') {
    // bd
    for (let item of data.children) {
      if (item.node === 'Graph') {
        return item.children
      }
    }
  }

  return []
}

// x2d转为画布的点弧
function x2dXmlPointAndArc(x2dXml, cfg = {}) {
  let {
    BoardAttr,
    arcToPts = false,
    segmentNum = 10
  } = cfg
  let json = XmlUtil.toJson(x2dXml)[0]

  // 替换原来的Board的属性
  if (BoardAttr) {
    Object.assign(json.attr, BoardAttr)
  }

  calcuNode(json, {}, ['HDirect'])

  let list = getOutlineList(json).map(item => {
    let attr = item.attr
    if (item.node === 'Point') {
      return {
        type: 'Point',
        x: attr.X,
        y: attr.Y,
        originData: item
      }
    } else if (item.node === 'Arc') {
      let arc = arcUtil.HGArcToCanvasArcTest({
        start: {
          x: attr.X,
          y: attr.Y
        },
        r: attr.R,
        startAngle: attr.StartAngle,
        angle: attr.Angle
      })
      arc.type = 'Arc'
      arc.originData = item
      return arc
    } else if (item.node === 'TArc') {
      let arc = arcUtil.getCanvasArcByHGArc({
        type: 'tArc',
        start: {
          x: attr.X,
          y: attr.Y
        },
        end: {
          x: attr.X2,
          y: attr.Y2
        },
        h: attr.ChordH,
        isBulge: attr.IsBulge,
      })
      arc.type = 'Arc'
      arc.originData = item
      return arc
    }
  })

  list = list.filter(data => data)

  if (arcToPts) {
    return arcUtil.pointAndArcToPts(list, segmentNum)
  }

  return list
}

/** 图元 */
class Path2dUtil {
  /** 计算图元Path的路径d得到没有带变量的字符串 */
  static calcuPathD(d, attrArray) {
    return d.split(';').filter(d => d).map(d => {
      return d.split(',').map(str => {
        let chars = str.split(' ')
        let newStr = chars[0]
        for (let i = 1; i < chars.length; i++) {
          newStr += ` ${calcFormula(chars[i], attrArray)}`
        }

        return newStr
      }).join(',')
    }).join(';')
  }

  /** 解析图元Path的路径d得到点弧列表 */
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

            arc.type = 'Arc'
            list.push(arc)
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

            let arc = arcUtil.getCanvasArcByHGArc({
              type: 'tArc',
              start,
              end,
              h: h,
              isBulge: item[6]
            })
            arc.type = 'Arc'
            list.push(arc)
          } else if (item[0] === 'm' || item[0] === 'l') {
            node.type = 'Point'
            if (item[0] === 'm') {
              node.isFirstPoint = true
            } else {
              node.isFirstPoint = false
            }

            list.push(node)
          }
        } else if (item[0] === 'z') {
          isClosePath = true
        }
      }

      // if(isClosePath){
      //   list.push({
      //     type: "Point",
      //     x: list[0].x,
      //     y: list[0].y
      //   })
      // }
      return list
    })
  }

  /** 解析路径d得到二维数组离散点 */
  static getPointsByPathD(d, attr) {
    let pathD = this.calcuPathD(d, [attr])
    let lists = this.getPointAndArcListByPathD(pathD)

    return lists.map(list => {
      return arcUtil.pointAndArcToPts(list)
    })
  }

  /** 将点集转换为svg的字符串 */
  static pointsToSvgPolygonPoints(list) {
    let points = ''
    list.forEach((node, i) => {
      if (i === 0) {
        points += `${node.x} ${node.y}`
      } else {
        points += ` ${node.x} ${node.y}`
      }
    })
    return points
  }
}

/** x2d/bd工具 */
class BdX2dUtil {
  /** x2d转为bd */
  static x2dToBd(x2d, holes) {
    holes = holes || {
      A: [],
      B: []
    }

    let dataType = typeof x2d
    let json = x2d
    if (dataType === 'string') {
      json = XmlUtil.toJson(x2d)[0]
    }

    let bdJson = {
      node: 'Board',
      attr: {
        L: 1000,
        W: 1000
      },
      children: [{
        node: 'Graph',
        attr: {},
        children: []
      },
      {
        node: 'FaceA',
        attr: {},
        children: []
      },
      {
        node: 'FaceB',
        attr: {},
        children: []
      }
      ]
    }

    for (let key in json.attr) {
      if (json.attr[key] !== 'undefined' && json.attr[key] !== undefined) {
        bdJson.attr[key] = json.attr[key]
      }
    }

    let graphChildren = []
    let faceAChildren = []
    let faceBChildren = []

    for (let i = 0; i < json.children.length; i++) {
      let plane = json.children[i]
      if (plane.children.length > 0) {
        this.planeAttr = plane.attr
        for (let node of plane.children) {
          if (node.node === 'Extra') {
            for (let item of node.children) {
              if (item.node === 'FaceA') {
                faceAChildren = item.children
              } else if (item.node === 'FaceB') {
                faceBChildren = item.children
              }
            }
          } else {
            graphChildren.push(node)
          }
        }

        break
      }
    }

    // 新增外部传的孔
    faceAChildren.push(...holes.A)
    faceBChildren.push(...holes.B)

    bdJson.children[0].children = graphChildren
    bdJson.children[1].children = faceAChildren
    bdJson.children[2].children = faceBChildren

    if (dataType === 'string') {
      return XmlUtil.toXml(bdJson)
    } else {
      return bdJson
    }
  }

  /** bd转为x2d */
  static bdToX2d(bd, planeType) {

  }

  /** 解析BD的xml */
  static parseBdXml(bdXml) {
    return parseFormulaXml(bdXml, ["HDirect", "SIZE"])
  }

  /** 分析BD的Xml得到绘图数据 */
  static getBdShapes(bdXml, options = {}) {
    let {
      BoardAttr,
      arcToPts = false,
      segmentNum = 10
    } = options

    let data = XmlUtil.toJson(bdXml)[0]
    if (BoardAttr) {
      Object.assign(data.attr, BoardAttr)
    }
    let xml = XmlUtil.toXml(data)
    let json = this.parseBdXml(xml)

    let bdRange = this.getBdRange(json.attr)

    let list = getOutlineList(json)
    let pointAndArcs = this.calcuBdGraphChildren(list)

    if (arcToPts) {
      pointAndArcs = arcUtil.pointAndArcToPts(pointAndArcs, segmentNum)
    }

    let faceA = []
    let faceB = []

    json.children.forEach(item => {
      if (item.node === "FaceA") {
        faceA = this.calcuBdFaceChildren(item.children, bdRange)
      } else if (item.node === "FaceB") {
        faceB = this.calcuBdFaceChildren(item.children, bdRange)
      }
    })

    return {
      Graph: pointAndArcs,
      FaceA: faceA,
      FaceB: faceB
    }
  }

  /** 获取BD的范围（当作完整矩形处理） */
  static getBdRange(attr = {}) {
    let { L: l = 0, W: w = 0 } = attr
    l = Number(l)
    w = Number(w)
    let range = {
      minx: 0,
      miny: 0,
      maxx: l,
      maxy: w
    }

    return range
  }

  /** 计算轮廓的点弧 */
  static calcuBdGraphChildren(list) {
    return list.map(item => {
      let attr = item.attr
      if (item.node === 'Point') {
        return {
          type: 'Point',
          x: attr.X,
          y: attr.Y,
          originData: item
        }
      } else if (item.node === 'Arc') {
        let arc = arcUtil.HGArcToCanvasArcTest({
          start: {
            x: attr.X,
            y: attr.Y
          },
          r: attr.R,
          startAngle: attr.StartAngle,
          angle: attr.Angle
        })
        arc.type = 'Arc'
        arc.originData = item
        return arc
      } else if (item.node === 'TArc') {
        let arc = arcUtil.getCanvasArcByHGArc({
          type: 'tArc',
          start: {
            x: attr.X,
            y: attr.Y
          },
          end: {
            x: attr.X2,
            y: attr.Y2
          },
          h: attr.ChordH,
          isBulge: attr.IsBulge,
        })
        arc.type = 'Arc'
        arc.originData = item
        return arc
      }
    }).filter(data => data)
  }

  /** 计算面的孔槽和图元的绘图数据 */
  static calcuBdFaceChildren(list, bdRange) {
    return list.map(item => {
      if (['BHole', 'VHole', 'Cut'].includes(item.node)) {
        let shapes = this.getBDHCShapes(item.node, item.attr, bdRange)
        return {
          type: item.node,
          shapes,
          originData: item
        }
      } else if (item.node === "Path") {
        let shapes = this.getBDPathShape(item.attr)
        return {
          type: item.node,
          shapes,
          originData: item
        }
      }
    }).filter(data => data)
  }

  /** 获取孔位的绘图数据 */
  static getBDHCShapes(holeType, attr = {}, bdRange) {
    let shapes = []
    let { X: x, Y: y, R: d, Rb: d2 } = attr
    let r = Number(d) / 2
    let range = this.getBdHcBox(holeType, attr, bdRange)
    let rect = {
      type: 'rect',
      ...range
    }
    let circle = {
      type: 'circle',
      x,
      y,
      r
    }

    if (holeType === "Cut") {
      shapes.push(rect)
    } else if (holeType === "VHole") {
      shapes.push(circle)
    } else if (holeType === "BHole") {
      if (d > 0) {
        shapes.push(rect)
        shapes.push(circle)
      } else {
        shapes.push(rect)
      }
    }

    return shapes
  }

  /** 获取图元的绘图数据 */
  static getBDPathShape(attr) {
    let lists = Path2dUtil.getPointAndArcListByPathD(attr.d)
    return lists.map(list => {
      let points = arcUtil.pointAndArcToPts(list)
      return {
        type: "path",
        points
      }
    })
  }

  /** 计算BD的孔槽的包围盒 */
  static getBdHcBox(nodeType, attr, bdRange = {}) {
    let minx = 0
    let miny = 0
    let maxx = 0
    let maxy = 0

    let { X, Y, R, Rb, HDirect, X1, Y1, Hole_Z: w } = attr
    let diameter = R || Rb // 直径。若是大饼孔，R可能为0
    let r = diameter / 2

    if (["BHole", "VHole"].includes(nodeType)) {
      minx = X - r
      miny = Y - r
      maxx = X + r
      maxy = Y + r

      if (nodeType === "BHole") {
        if (HDirect === "L") {
          minx = bdRange.minx === undefined ? minx : bdRange.minx
          maxx -= r
        } else if (HDirect === "R") {
          maxx = bdRange.maxx || maxx
          minx += r
        } else if (HDirect === "U") {
          maxy = bdRange.maxy || maxy
          miny += r
        } else if (HDirect === "D") {
          miny = bdRange.miny === undefined ? miny : bdRange.miny
          maxy -= r
        }
      }
    } else if (nodeType === "Cut") {
      let d = w / 2
      if (X === X1 && Y !== Y1) {
        // 竖槽

        let [y1, y2] = Y < Y1 ? [Y, Y1] : [Y1, Y]
        minx = X - d
        miny = y1
        maxx = X + d
        maxy = y2
      } else if (Y === Y1 && X !== X1) {
        // 横槽

        let [x1, x2] = X < X1 ? [X, X1] : [X1, X]
        minx = x1
        miny = Y - d
        maxx = x2
        maxy = Y + d
      }
    }

    return {
      x: minx,
      y: miny,
      width: maxx - minx,
      height: maxy - miny,
      minx,
      miny,
      maxx,
      maxy
    }
  }
}

/**
 * 华广业务相关的工具库
 * 创建者：lze
 * 更新时间：20210709
 */
class HgServiceTool {
  // _loginId
  // _qdsoftId
  // mainApp // 主页的gMainApp

  static get loginId() {
    if (!this._loginId) {
      this._loginId = localStorage.getItem("loginId") || ""
    }
    return this._loginId
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

  static get qdsoftId() {
    if (!this._qdsoftId) {
      let mainApp;
      try {
        mainApp =
          this.mainApp || (window.opener && window.opener.gMainApp ? window.opener.gMainApp : null);
      } catch (error) {
        console.log("获取不到主页传来的gMainApp", error);
        mainApp = null;
      }

      let info = JSON.parse(localStorage.getItem("loginCorpInfo"));
      let qdId1 = info ? info.qdSoftId : "";
      let qdId2 = mainApp ? mainApp.mQdSoftid : "";

      this.mainApp = mainApp
      this._qdsoftId = qdId1 || qdId2;
    }

    return this._qdsoftId
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

  /** 获取板件的bd的xml */
  static getBdXmlFromMainApp(mainApp, data, callback, cfg = {}) {

    let that = this
    this.mainApp = mainApp
    // 获取可编辑的bd数据(外面传来的不一定是可编辑的)
    if (!cfg.blockNew)
      data = mainApp.GetEditableBD(data.guid)
    if (!data) {
      console.error('未获取到可编辑的bd数据')
      callback()
      return
    }

    let {
      BasicGraphic,
      guid
    } = data
    let result = {
      result: 1,
      bdAttr: {}, // bd的属性
      fileName: '', // 保存的文件名
      xml: '', // 添加过孔槽后的xml
      noHoleXml: '', // 未添加孔槽的xml
      bdJson: {}, // 添加过孔槽后的xml的json
      originXml: '', // 未添加孔槽的xml
      bomName: '', // 物料名称
      label: '', // 标签
      name: '', // bd名称（不带后缀）
      type: '', // 原xml类型
      errorobjs: null // 孔位检测结果
    }

    this.getHoleInfo(mainApp, !cfg.blockNew ? guid : data, info => {
      result.bdAttr = that.getBDAttr(data, info);
      result.errorobjs = info.errorobjs
      if (BasicGraphic === 'BG::RECT') {
        result.bdAttr.originFileName = BasicGraphic
        result.xml = that.createBdXml(result.bdAttr, info)
        result.noHoleXml = that.createBdXml(result.bdAttr)
        result.fileName = that.guid + ".bd"
        result.type = 'x2d'
        result.bdJson = XmlUtil.toJson(result.xml)[0]
        callback(result)
      } else {
        let arr = BasicGraphic.split(".");

        // 没有文件后缀，默认为x2d
        if (arr.length === 1) arr.push("x2d");

        let dataType = arr[arr.length - 1]
        let newName = arr.join('.')

        result.name = arr[0]
        result.type = dataType

        that.getBdData(dataType, newName, data => {
          if (data.result === 0) {
            result.result = 0
            result.message = data.message
            callback(result)
            return
          }

          let {
            xml,
            bomName,
            label
          } = data
          let json = XmlUtil.toJson(xml)[0];
          let noHoleJson = JSON.parse(JSON.stringify(json))

          result.originXml = xml
          result.bomName = bomName
          result.label = label

          if (dataType === 'x2d') {
            result.bdAttr.originFileName = BasicGraphic
            result.fileName = that.guid + ".bd"

            // 添加孔位信息
            json.children.forEach(item => {
              if (item.node === "FaceA") item.children.push(...info.A);
              if (item.node === "FaceB") item.children.push(...info.B);
            });
          } else {
            result.fileName = `${result.name}.bd`
            json.children.forEach(item => {
              if (item.node === "FaceA") {
                item.children = item.children.filter(item => ['BHole', 'VHole', 'Cut'].indexOf(item.node) === -1)
                item.children.push(...info.A);
              } else if (item.node === "FaceB") {
                item.children = item.children.filter(item => ['BHole', 'VHole', 'Cut'].indexOf(item.node) === -1)
                item.children.push(...info.B);
              }
            });
          }

          that.resetBdAttr(json, result.bdAttr)
          that.resetBdAttr(noHoleJson, result.bdAttr)

          result.bdJson = json
          result.xml = XmlUtil.toXml(json)
          result.noHoleXml = XmlUtil.toXml(noHoleJson)
          callback(result)
        })

      }
    }, cfg.isGetHole, cfg.isTransformHole, cfg.defHoleInfo, cfg.blockNew)
  }

  /** 获取非模块的板件数据 */
  static getBdModel(data) {

  }

  /** 转换孔位数据和添加数据到holeinfo里 */
  static transformHoleAndAddAttr(holeinfo, isTransformHole = true) {
    if (isTransformHole) {
      this.transformHoleInfoToBdHole(holeinfo, {
        DI: holeinfo.di
      })
    } else {
      // 清空不添加孔位
      holeinfo.A = []
      holeinfo.B = []
    }

    holeinfo.attr = this.getBoardAttrByMainAppHoleInfo(holeinfo)
    return holeinfo
  }

  /** 获取当前方案指定guid的孔位 */
  static getHoleInfo(mainApp, guid, callback, isGetHole = true, isTransformHole = true, defHoleInfo = undefined, onlyForBd = false) {
    let defalut = {
      A: [],
      B: [],
      desc: '',
      attr: {} // <Board>节点上的属性
    }

    if (!isGetHole) {
      callback(defalut)
      return
    }

    let that = this
    try {
      if (!defHoleInfo) {
        if (!onlyForBd) {
          mainApp.GetBlockHolesInfo(guid, info => {
            if (info) {
              let pGuid = Object.keys(info)[0]

              if (info[pGuid]) {
                let holeinfo = info[pGuid].holeinfo[guid]
                if (holeinfo) {
                  that.transformHoleAndAddAttr(holeinfo, isTransformHole)
                  callback(holeinfo)
                  return
                }
              }
            }
            callback(defalut)
          })
        }
        else {
          //guid代表的是实际的block数据
          mainApp.GetHoleJustForNewBD(guid, info => {
            if (info) {
              let pGuid = Object.keys(info)[0]
              guid = guid.guid;
              if (info[pGuid]) {
                let holeinfo = info[pGuid].holeinfo[guid]
                if (holeinfo) {
                  that.transformHoleAndAddAttr(holeinfo, isTransformHole)
                  callback(holeinfo)
                  return
                }
              }
            }
            callback(defalut)
          })
        }
      }
      else {
        let info = defHoleInfo;
        let pGuid = Object.keys(info)[0];
        if (info[pGuid]) {
          let holeinfo = info[pGuid].holeinfo[guid]
          if (holeinfo) {
            this.transformHoleAndAddAttr(holeinfo, isTransformHole)
            callback(holeinfo)
            return
          }
        }
        callback(defalut)
      }

    } catch (error) {
      console.log(error);
      callback(defalut)
    }
  }

  /** 转换从主页获取到的孔信息转为Bd的孔信息 */
  static transformHoleInfoToBdHole(info, opts) {
    if (info.A) {
      info.A = info.A.map(hole => this.tranformHoleInfo(hole, 'A', opts))
    }
    if (info.B) {
      info.B = info.B.map(hole => this.tranformHoleInfo(hole, 'B', opts))
    }

    // 添加槽
    if (info.KC && info.KC.length > 0) {
      let cuts = this.tranformCut(info.KC)

      cuts.forEach(cut => {
        if (cut.attr.Face === 'A') {
          info.A.push(cut)
        } else if (cut.attr.Face === 'B') {
          info.B.push(cut)
        }
      })
    }

    return info
  }

  /** 添加<Board>节点上的属性 */
  static getBoardAttrByMainAppHoleInfo(info) {
    // bd的xml上字段名与主页的孔位信息的字段名关系
    let table = {
      ddfb: 'DFB',
      fb: 'FB',
      llfb: 'LFB',
      rrfb: 'RFB',
      uufb: 'UFB',
      memo: 'MEMO',
    }
    let result = {}

    for (let key in table) {
      result[table[key]] = info[key] === undefined ? '' : info[key]
    }

    return result
  }

  /** 转换单个孔信息 */
  static tranformHoleInfo(holeInfo, face, opts) {
    let {
      htype,
      x,
      y,
      xx = 0,
      yy = 0,
      r,
      sr,
      sri,
      depth = '',
      srholedepth,
      smallcap,
      sriholedepth,
      notauto = '',
      holename = '',
      pknum,
      pkcap
    } = holeInfo
    let {
      DI
    } = opts

    let rObj = this.getRAndRbtype(r)
    let srObj = this.getRAndRbtype(sr)
    let sriObj = this.getRAndRbtype(sri)

    let hole = {
      node: htype === 'L' ? 'BHole' : 'VHole',
      attr: {
        Face: face,
        X: `${x}+${Number(xx)}`,
        Y: `${y}+${Number(yy)}`,
        // HDirect: getHDirect(holeInfo, DI, face),
        HDirect: holeInfo.hdirect,
        R: rObj.r,
        Rtype: rObj.type,
        Rdepth: depth,
        Rb: srObj.r,
        Rbtype: srObj.type,
        Hole_D: srholedepth,
        Rbdepth: srholedepth,
        Hole_Z: smallcap,
        NotAuto: notauto,
        FaceType: holeInfo.face || '', // 孔在三维空间上的方向
        HoleSource: holeInfo.holesource || '',
        HoleName: holename,
        PKCap: pkcap,
        PKNum: pknum
      },
      children: []
    }

    if (hole.node === 'BHole') {
      hole.attr.X1 = sriObj.r
      hole.attr.X1type = sriObj.type
      hole.attr.X1depth = sriholedepth
    }

    return hole
  }

  /** 转换槽 */
  static tranformCut(data) {
    return data.map(cut => {
      return {
        node: 'Cut',
        attr: {
          Face: cut.face,
          X: cut.x0,
          Y: cut.y0,
          X1: cut.x1,
          Y1: cut.y1,
          CutName: cut.CutName || '',
          Cutter: cut.Cutter || '',
          Hole_Z: cut.Hole_Z || '',
          device: cut.device || '',
          NotAuto: cut.notauto || '',
          HoleSource: cut.holesource || '',
        },
        children: []
      }
    })
  }

  /** 获取孔的数值和类型 */
  static getRAndRbtype(rStr) {
    if (!rStr) return {
      type: '',
      r: 0
    }

    let value = Number(rStr)
    if (isNaN(value)) {
      let type = rStr[rStr.length - 1]
      let r = Number(rStr.slice(0, -1)) || 0

      return {
        type,
        r
      }
    } else {
      // 纯数字
      return {
        type: '',
        r: value
      }
    }
  }

  /** 从主页传来的模型数据中提取BD的属性 */
  static getBDAttr(data, holeInfo) {
    let params = data.MemData.Params // CA-CP的参数
    // 根据DI转换尺寸
    let viewSize = this.transformViewSize(holeInfo.translatedi, holeInfo.gl, holeInfo.gp, holeInfo.gh, holeInfo.di)
    let di = viewSize.di || 0
    let size = this.graphSizeToBDSize(viewSize.gl, viewSize.gp, viewSize.gh, di)
    let cncbacks = this.calcuCncBacks(di, data.ZeroY)

    let attr = {
      DI: di,
      L: holeInfo.L || size.bl, // 优先读取李涛提供的字段
      W: holeInfo.W || size.bw, // 优先读取李涛提供的字段
      BH: holeInfo.BH || size.bh,// 优先读取李涛提供的字段
      CncBack: cncbacks.CncBack,
      CncBack1: cncbacks.CncBack1
    }

    Object.assign(attr, params)

    // 合并BD属性。xml已有的字段就不再设置
    Object.assign(attr, holeInfo.attr);
    return attr
  }

  /** 将其他视图的尺寸转换为正视图的尺寸 */
  static transformViewSize(translatedi, gl, gp, gh, di) {
    let result = {
      gl,
      gp,
      gh,
      di
    }

    // 为空时表示为正视图，不需要转换
    if (!translatedi) return result

    try {
      translatedi = translatedi.replace(/\^/g, "\"")
      translatedi = JSON.parse(translatedi)
    } catch (error) {
      return result
    }

    let oz = translatedi.OZ
    let ox = translatedi.OX
    result.di = translatedi.DI || di

    if (oz == 270 || oz == 90) {
      // 左视图 / 右视图
      result.gl = gp
      result.gp = gl
    } else if (oz == 180) {
      // 背视图(同正视图)

    } else if (ox == 270) {
      // 俯视图
      result.gp = gh
      result.gh = gp
    }

    return result
  }

  /** 图形尺寸转为BD尺寸  */
  static graphSizeToBDSize(l, d, h, di) {
    let bl = l
    let bw = d
    let bh = h

    di = Number(di)

    switch (di) {
      // 层板
      case 0:
      case 1:
      case 5:
        break;
      // 背板
      case 2:
      case 3:
        bl = l
        bw = h
        bh = d
        break;
      // 侧板
      case 4:
      case 6:
        bl = d
        bw = h
        bh = l
        break
    }

    return {
      bl,
      bw,
      bh
    }
  }

  /** 计算靠档 */
  static calcuCncBacks(direct, zero_y) {
    let cncback = 0; //比亚斯、豪迈打孔设备靠档
    let cncback1 = 0; //雕刻机设备靠档 

    direct = Number(direct)
    zero_y = Number(zero_y)

    if ([0, 1, 5].includes(direct)) { // 层板
      //前后封边，左右封边
      cncback = 0; //默认：后封边对应下靠档

      if (zero_y === 4) cncback = 1; //前封边对应上靠档
      if (zero_y === 1) cncback = 2; //左封边对应左靠档
      if (zero_y === 2) cncback = 3; //右封边对应右靠档

      if (direct === 0 || direct === 1) {
        cncback1 = 0; //横纹层板，默认后封边靠档
      } else if (direct === 5) {
        cncback1 = 2; //竖纹层板，默认左封边靠档
      }
    } else if ([2, 3].includes(direct)) { //背板
      //上下封边，左右封边
      cncback = 2; //默认：左封边对应左靠档

      if (zero_y === 5) cncback = 0; //下封边对应下靠档
      if (zero_y === 6) cncback = 1; //上封边对应上靠档
      if (zero_y === 2) cncback = 3; //右封边对应右靠档

      if (direct === 2) {
        cncback1 = 0; //横纹背板，默认下封边靠档
      } else if (direct === 3) {
        cncback1 = 2; //竖纹层板，默认左封边靠档
      }
    } else if ([4, 6].includes(direct)) {
      //前后封边，左右封边
      cncback = 2 //默认：后封边对应左靠档

      if (zero_y === 4) cncback = 3; //下封边对应下靠档
      if (zero_y === 5) cncback = 0; //上封边对应上靠档
      if (zero_y === 6) cncback = 1; //右封边对应右靠档

      if (direct === 4) {
        cncback1 = 2; //竖纹侧板，默认后封边靠档
      } else if (direct === 6) {
        cncback1 = 0; //横纹侧板，默认下封边靠档
      }
    }

    return {
      CncBack: cncback,
      CncBack1: cncback1
    }
  }

  /** 创建bd */
  static createBdXml(attr, holeInfo) {
    function attrToStr(attr) {
      let str = ''
      for (let key in attr) {
        str += ` ${key}="${attr[key]}" `
      }
      return str
    }

    function nodeToXml(node) {
      return `<${node.node} ${attrToStr(node.attr)}></${node.node}>`
    }

    attr = attr || {}
    holeInfo = holeInfo || {}

    let {
      A = [], B = []
    } = holeInfo
    let attrStr = attrToStr(attr)
    let faceAStr = ''
    let faceBStr = ''

    // 添加孔位信息
    A.forEach(hole => {
      faceAStr += nodeToXml(hole)
    })
    B.forEach(hole => {
      faceBStr += nodeToXml(hole)
    })

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
      </Board>`
  }

  /** 处理BD的变量 */
  static resetBdAttr(bdJson, attr) {
    Object.assign(bdJson.attr, attr);
    // 没有的变量设置为0
    let keys = [
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
      "CP"
    ];

    keys.forEach(key => {
      if (bdJson.attr[key] !== undefined && attr[key] === undefined) {
        bdJson.attr[key] = 0;
      }
    });
  }

  /** 请求bd/x2d */
  static async getBdData(dataType, name, callback) {
    if (dataType === 'x2d') {
      this.post({
        url: BASEURL + '/hgsoft_base//BaseGraph/GetTextData/',
        data: {
          group: 'qd_textdata_list_head',
          qdsoft: this.qdsoftId,
          loginId: this.loginId,
          key: name,
          getIcon3dFlag: true
        },
        success(data) {
          if (!data || !data.configdata) {
            callback({
              result: 0,
              message: `不存在名称为${name}的文件`
            })
          } else {
            callback({
              result: 1,
              xml: BdX2dUtil.x2dToBd(data.configdata),
              bomName: data.data.bomName || "",
              label: data.data.label || ""
            })
          }
        },
        error(err) {
          callback({
            result: 0,
            message: err.message
          })
        }
      })
    } else if (dataType === 'bd') {
      let result = await this.getBdFromServer(name)
      callback(result)
    } else {
      callback({
        result: 0,
        message: `传入的文件类型不是BD或X2d`
      })
    }
  }

  /** 从服务器获取bd */
  static getBdFromServer(name) {
    let that = this
    return new Promise(async (resolve, reject) => {
      let data = await that.getBDFromCache(name)

      if (data) {
        resolve({
          result: 1,
          xml: data.data,
          bomName: data.bomName || "",
          label: data.label || ""
        })
      } else {
        that.post({
          url: BASEURL + '/hgsoft_base/fileSource/getResourceByPath.action',
          data: {
            qdsoft: that.qdsoftId,
            type: 'BD',
            fileName: name,
            returnType: 'TXT'
          },
          success(data) {
            if (!data || !data.data) {
              resolve({
                result: 0,
                message: `不存在名称为${name}的文件`
              })
            } else {
              resolve({
                result: 1,
                xml: data.data,
                bomName: data.bomName || "",
                label: data.label || ""
              })
            }
          },
          error(err) {
            resolve({
              result: 0,
              message: err.message
            })
          }
        })
      }
    })
  }

  static get(cfg) {
    let {
      url,
      header,
      data,
      success,
      error
    } = cfg
    url = this.mergeUrl(url, data)

    let client = new XMLHttpRequest();

    this.setHeader(client, header)

    client.onload = function () {
      if (client.readyState !== 4) {
        return;
      }

      if (client.status === 200) {
        let data = client.response ? JSON.parse(client.response) : ''
        success && success(data);
      } else {
        error && error(client.status)
      }
    }
    client.open("get", url, true)
    client.send()
  }

  static post(cfg) {
    let {
      url,
      header,
      data,
      success,
      error
    } = cfg

    let client = new XMLHttpRequest();
    let formData = new FormData();

    this.setHeader(client, header)

    for (let key in data) {
      formData.append(key, data[key])
    }

    client.open("POST", url);
    client.onreadystatechange = function () {
      if (client.readyState !== 4) {
        return;
      }

      if (client.status === 200) {
        // 请求成功
        let result = JSON.parse(client.response || '{}');
        success && success(result)
      } else {
        // 请求失败
        error && error(client.status)
      }
    };
    client.send(formData);
  }

  // 拼接get的URL
  static mergeUrl(url, data) {
    if (!data) return url

    let keys = Object.keys(data);

    keys.forEach((key, i) => {
      if (i === 0) {
        url += "?";
      } else {
        url += "&";
      }

      url += `${key}=${data[key]}`;
    });

    return url;
  }

  /** 设置header */
  static setHeader(request, header) {
    if (!header) return

    for (let key in header) {
      request.setRequestHeader(key, header[key])
    }
  }

  /** 打开BD的数据库操作 */
  static openBDStore(successFn, errorFn) {
    let db = new LIndexDB({
      databaseName: 'QdBdList',
      keyPath: 'md5',
      storeIndexs: [{
        name: 'md5',
        cfg: {
          unique: true
        }
      },
      {
        name: 'data'
      },
      {
        name: 'bomName'
      },
      {
        label: 'data'
      }
      ],
      onsuccess(event) {
        successFn && successFn(db)
      },
      onerror(event) {
        errorFn && errorFn(db)
      }
    })
  }

  /** 读取缓存里的BD */
  static getBDFromCache(name) {
    let that = this
    return new Promise((resolve, reject) => {
      try {
        function successFn(db) {
          db.read(name).then(data => {
            resolve(data)
          })
        }

        function errorFn(db) {
          resolve()
        }
        that.openBDStore(successFn, errorFn)
      } catch (error) {
        resolve()
      }
    })
  }

  /** 保存BD到缓存里 */
  static saveBDToCache(data) {
    let that = this
    return new Promise((resolve, reject) => {
      function successFn(db) {
        db.add(data)
        resolve({ result: 1 })
      }

      function errorFn(db) {
        resolve({ result: 0 })
      }

      that.openBDStore(successFn, errorFn)
    })
  }

  /** 根据李涛返回的孔位信息更新BD */
  static setBDByHoleInfo(bdXml, guid, callback, mainApp) {
    mainApp = mainApp || this.mainApp
    if (mainApp && guid) {
      this.getHoleInfo(mainApp, guid, info => {
        let json = XmlUtil.toJson(bdXml)[0];

        // 设置BD属性
        let bdAttr = {
          L: info.L,
          W: info.W,
          BH: info.BH
        }
        Object.assign(bdAttr, info.attr);

        for (let key in bdAttr) {
          let value = bdAttr[key]
          if (value !== undefined) {
            json.attr[key] = value
          }
        }

        // 添加孔位
        json.children.forEach(item => {
          if (item.node === "FaceA") {
            item.children.push(...info.A);
          } else if (item.node === "FaceB") {
            item.children.push(...info.B);
          }
        });

        let newXml = XmlUtil.toXml(json)
        callback(newXml)
      })
    } else {
      console.log('未获取到主页gMainApp');
      callback()
    }
  }
}

// http://www.ruanyifeng.com/blog/2018/07/indexeddb.html
class LIndexDB {
  constructor(cfg) {
    let {
      databaseName,
      tableName,
      keyPath,
      version,
      storeIndexs,
      onupgradeneeded,
      onerror,
      onsuccess
    } = cfg
    this.db = null
    this.tableName = tableName || 'Data'
    this.keyPath = keyPath
    this.onupgradeneeded = onupgradeneeded
    this.onsuccess = onsuccess
    this.onerror = onerror
    this.openDB(databaseName, {
      tableName,
      keyPath,
      storeIndexs
    }, version)
  }

  /** 打开数据库 */
  openDB(databaseName, option = {}, version) {
    let {
      tableName = 'Data', keyPath = 'id', storeIndexs
    } = option
    let that = this
    if (that.db) {

    }

    var request = window.indexedDB.open(databaseName, version)
    request.onerror = event => {
      that.onerror && that.onerror(event)
      // console.log('数据库打开报错');
    }
    request.onsuccess = event => {
      that.db = request.result
      that.onsuccess && that.onsuccess(event)
      // console.log('数据库打开成功');
    }
    request.onupgradeneeded = event => {
      that.db = event.target.result
      let store
      if (!that.db.objectStoreNames.contains(tableName)) {
        store = that.db.createObjectStore(tableName, {
          keyPath
        })
        if (storeIndexs) {
          for (let data of storeIndexs) {
            let name = data.name
            let cfg = data.cfg || {}
            if (name && name !== this.keyPath) {
              store.createIndex(name, name, cfg)
            }
          }
        }
      }

      that.onupgradeneeded && that.onupgradeneeded(event)
    }
  }

  /** 添加数据 */
  add(data) {
    let store = this.db.transaction([this.tableName], 'readwrite').objectStore(this.tableName)
    let request = store.add(data)

    request.onsuccess = event => {
      // console.log('数据写入成功');
    }

    request.onerror = event => {
      console.log('数据写入失败', event);
    }
  }

  /** 读数据 */
  read(keyValue) {
    return new Promise((resolve, reject) => {
      let store = this.db.transaction([this.tableName]).objectStore(this.tableName)
      let request = store.get(keyValue)
      request.onerror = event => {
        resolve()
        // console.log('读取失败');
      }
      request.onsuccess = event => {
        if (request.result) {
          resolve(request.result)
        } else {
          resolve()
          // console.log('未获取数据记录');
        }
      }
    })
  }
}

class CsvUtil {
  // 输出CSV的文本
  static outputCsvText(data = [], headers) {
    let firstData = data[0] || {}
    headers = headers || Object.keys(firstData)

    // 添加表头
    let csvText = this.getRowText(headers)

    // 添加表格内容
    let newData = this.getDataByHeaders(data, headers)
    newData.forEach(arr => {
      csvText += this.getRowText(arr)
    })
    return csvText
  }

  /** 填充一行数据 */
  static getRowText(arr = []) {
    let length = arr.length
    return arr.reduce((preVal, curVal, i, array) => {
      let isLast = i === length - 1
      let curStr = i === 1 ? preVal + "," + curVal : preVal + curVal

      if (isLast) {
        curStr += '\n'
      } else {
        curStr += ','
      }

      return curStr
    })
  }

  /** 根据表头读取数据 */
  static getDataByHeaders(data = [], headers = []) {
    return data.map(item => {
      return headers.map(key => (item[key] || ""))
    })
  }
}
