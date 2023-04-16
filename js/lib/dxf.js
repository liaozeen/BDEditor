class Dxf {
  constructor () {
    this.parser = this.initParser()
  }
  initParser () {
    try {
      // eslint-disable-next-line no-undef
      return new DxfParser()
    } catch (e) {
      console.log('DxfParser不存在')
    }
  }
  parseSync (fileText) {
    return this.parser.parseSync(fileText)
  }
  dxfToBd (dxf) {
    let dxfJson = this.parseSync(dxf)
    let bdJson = this.createBoard2(dxfJson)

    bdJson.children.forEach( node => {
      if(node.node === 'Graph'){
        let posArr = node.children.map( item => {
          if(item.node === 'Point'){
            return {
              x: Number(item.attr.X.value) ,
              y: Number(item.attr.Y.value) 
            }
          }
        }).filter(data => data)

        let area = PosUtil.getArea(...posArr)
        if(area > 0){
          node.children = node.children.reverse()
        }
      }
    })
    return bdJson
  }
  dxfToPath(dxf){
    let dxfJson = this.parseSync(dxf)

    return this.getPathByDxfJson(dxfJson)
  }
  isLwpolyline (json) {
    return json.entities.length === 1 && json.entities[0].type === 'LWPOLYLINE'
  }
  hasLwpolyline (entities) {
    let isHas = false

    entities.forEach(entitie => {
      if (entitie.type === 'LWPOLYLINE') isHas = true
    })

    return isHas
  }
  getVertices (json) {
    return json.entities[0].vertices
  }
  initBoard () {
    return this.createNode('Board',{},[
      this.createNode('Graph'),
      this.createNode('FaceA'),
      this.createNode('FaceB')
    ])
  }
  createNode(node = '',attr = {}, children = []){
    return { node, attr, children }
  }
  createBoard (vertices) {
    let board = this.initBoard()
    board.attr = this.getBoardAttr(vertices)
    board.children[0].children = this.trandformLWPOLYLIN(vertices)

    return board
  }

  // 处理makerjs导出的dxf格式
  createBoard2 (json) {
    let entities = json.entities
    let board = this.initBoard()
    let data = this.sortEntities(entities)

    if(data.graph.length === 0){
      // 可能是图层设置错误，默认只能为0
      board.errorMsg = "图层可能设置有误，请确保轮廓的图层为0"
    }else{
      let vertices = this.getShapeVertices(data.graph)
      // board.attr = this.getBoardAttr2(vertices)
      board.children[0].children = this.getGraphNodes(vertices)
      board.children[1].children = this.getFaceNodes('A', data.hole, data.cut)
  
      let pts = this.getPointsByGraphNodes(board.children[0].children)
      board.attr = this.getBoardAttr2(pts)
  
      this.addRatio(board)
    }
   
    return board
  }
  // 得到只含图元的bd数据
  dxfToDdWithPath(json){
    let entities = json.entities
    let board = this.initBoard()

    let polylineVertices = this.getPolylinesVertices(entities)
    let polylineNodes = polylineVertices.map(polyline => this.caluVertices(polyline))
    let pts = this.getPointsByPolylines(polylineNodes)
    let size = this.getBoardAttr2(pts)

    let pathNode = this.createPath({
      L:size.L,
      W:size.W,
      Face:'A',
      d:this.getPathDByPolylines(polylineNodes,size)
    })

    board.attr = size
    board.children[1].children.push(pathNode)

    return board
  }

  // 通过dxf的json获取图元的json
  getPathByDxfJson(json){
    let entities = json.entities
    let polylineVertices = this.getPolylinesVertices(entities)
    let polylineNodes = polylineVertices.map(polyline => this.caluVertices(polyline))

    let pts = this.getPointsByPolylines(polylineNodes)
    let size = this.getBoardAttr2(pts)

    let path = this.createNode('Path',{
      L:size.L,
      W:size.W,
      Face:'A',
      d:this.getPathDByPolylines(polylineNodes,size)
    })

    return path
  }   
  // 获取多段线的点弧
  getPolylinesVertices(polylines){
    return polylines.map( polyline => this.getShapeVertices([polyline])).filter(vs => vs.length > 0)
  }
  // 计算dxf节点
  caluVertices(vertices){
    let result = []
    
    for (let i = 0; i < vertices.length; i++) {
      let v = vertices[i]

      switch(v.type){
        case 'Point':
          result.push(this.getPointNode(v))
          break
        case 'Bulge':
          let next = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]
          let tArc = this.getTArcNode(v, next, i)
          let start = this.getPointNode(v)
          let end = this.getPointNode(next)
          result.push(start, tArc, end)
          break
        case 'Arc':
          result.push(this.getArcNode(v))
      }
    }
    return result
  }

  createPath(cfg){
    return this.createNode('Path',{
      Face: cfg.Face,
      X:{formula: 0, value:0},
      Y:{formula: 0, value:0},
      d:{formula: cfg.d, value:cfg.d},
      L:{formula: cfg.L, value:cfg.L},
      W:{formula: cfg.W, value:cfg.W},
    })
  }

  getPointNode(v){
    return {
      node:'Point',
      X:Math2d.round(v.x, 4),
      Y:Math2d.round(v.y, 4)
    }
  }

  getTArcNode(v1,v2){
    let tArc = this.getTArcByDxfVertices(v1,v2)
    tArc.node = 'TArc'
    return tArc
  }

  getArcNode(v){
    let arc = this.getArcByDxfVertice(v)
    arc.node = 'Arc'
    return arc
  }

  getPathDByPolylines(polylines,size){
    let ds = polylines.map(nodes => this.getPathdByNodes(nodes,size))
    return ds.join('')
  }

  getPathdByNodes(nodes,size){
    let { L, W } = size
    let xr = `L/${L}`
    let yr = `W/${W}`

    nodes = nodes.map( node => {
      let item = {  
        node:node.node,
        attr:{}
      }

      node.X += `*${xr}`
      node.Y += `*${yr}`

      if (node.node === 'TArc') {
        node.X2 += `*${xr}`
        node.Y2 += `*${yr}`
      }

      for(let key in node){
        if(key !== 'node'){
          item.attr[`$${key}`] = node[key]
        }
      }

      Object.assign(item.attr,node)
      return item
    })
    
    return BatchBdUtil.getGraphPathD(nodes)
  }

  // 创建点
  createPoint (v) {
    let p = { node: 'Point', children: [], attr: {} }
    let x = Math2d.round(v.x, 4)
    let y = Math2d.round(v.y, 4)

    p.attr = {
      X: { formula: x, value: x },
      Y: { formula: y, value: y }
    }
    return p
  }
  // 创建圆弧
  createArc (v1, v2) {
    let arc = { node: 'Arc', children: [], attr: {} } // bd的圆弧
    let sx = v1.x; let sy = v1.y // 圆弧起始点
    let ex = v2.x; let ey = v2.y// 圆弧终止点
    let k // 弦的斜率
    // let centerX1, centerY1 // 圆心坐标1
    // let centerX2, centerY2 // 圆心坐标2
    let dLength // 弦长
    let direction // 圆弧的顺逆
    let r // 圆弧半径
    let isMinorArc // 圆弧的半径是否为较小的
    let degree // 圆滑的角度
    let rads // 圆弧的角度的弧度值
    let center // 确定的圆心
    let startAngle // 圆弧的起始角度（canvas坐标系）
    let dx = sx - ex
    let dy = sy - ey

    rads = 4 * Math.atan(Math.abs(v1.bulge)) // 弧度值
    degree = Math2d.toDegrees(rads) // 角度值

    // 凸度绝对值小于1表示圆弧包角小于180度，大于1表示圆弧包角大于180度
    if (Math.abs(v1.bulge) <= 1) {
      isMinorArc = true
    } else {
      isMinorArc = false
    }

    // 确定圆弧的顺逆
    if (v1.bulge < 0) {
      direction = 2 // 顺圆
    } else {
      direction = 3 // 逆圆
    }

    dLength = Math.sqrt(dx ** 2 + dy ** 2)
    r = Math.abs(0.5 * dLength / Math.sin(0.5 * rads))
    k = dy / dx

    if (k === 0) {
    //   centerX1 = centerX2 = (sx + ex) / 2
    //   centerY1 = sy + Math.sqrt(r ** 2 - (dx ** 2) / 4)
    //   centerY2 = ey - Math.sqrt(r ** 2 - (dx ** 2) / 4)
    } else {
      center = Math2d.getArcCenter2(v1, v2, r, direction, isMinorArc)
    }

    startAngle = Math2d.lineAngle(v1.x, v1.y, center.x, center.y)
    let sAngle = Math.round(Math.abs(startAngle))

    if (sAngle !== 180 && sAngle !== 0) {
      startAngle *= -1
    }
    if (direction === 3) {
      degree *= -1
    }

    let x = Math2d.round(v1.x, 4)
    let y = Math2d.round(v1.y, 4)
    r = Math2d.round(r, 4)

    arc.attr = {
      X: { formula: x, value: x },
      Y: { formula: y, value: y },
      Angle: { formula: degree, value: degree },
      R: { formula: r, value: r },
      StartAngle: { formula: startAngle, value: startAngle },
      IsDim: { formula: '0', value: '0' }
    }
    return arc
  }
  // 创建带弦高的圆弧
  createTArc (v1, v2, i) {
    let arc = { node: 'TArc', children: [], attr: {} }
    let tArc = this.getTArcByDxfVertices(v1,v2)

    arc.attr = {
      X: { formula: tArc.X, value: tArc.X },
      Y: { formula: tArc.Y, value: tArc.Y },
      X2: { formula: tArc.X2, value: tArc.X2 },
      Y2: { formula: tArc.Y2, value: tArc.Y2 },
      ChordH: { formula: tArc.ChordH, value: tArc.ChordH },
      IsBulge: { formula: tArc.IsBulge, value: tArc.IsBulge },
      Hotspot: { formula: '0', value: '0' },
      IsDim: { formula: '0', value: '0' }
    }

    return arc
  }

  // 计算dxf得到带弦高的弧
  getTArcByDxfVertices(v1, v2){
    let sx = v1.x; let sy = v1.y // 圆弧起始点
    let ex = v2.x; let ey = v2.y// 圆弧终止点
    let d = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2)// 弦长
    let h = (Math.abs(v1.bulge) * d) / 2 // 弦高
    let isBulge = 1 // 表示圆弧为凸弧或凹弧（相对于闭合图形）

    // 确定圆弧的顺逆
    if (v1.bulge < 0) {
      isBulge = 1 // 顺圆
    } else {
      isBulge = 0 // 逆圆
    }

    let x1 = Math2d.round(v1.x, 4)
    let y1 = Math2d.round(v1.y, 4)
    let x2 = Math2d.round(v2.x, 4)
    let y2 = Math2d.round(v2.y, 4)
    h = Math2d.round(h, 4)

    return {
      X:x1,
      Y:y1,
      X2:x2,
      Y2:y2,
      ChordH: h,
      IsBulge: isBulge
    }
  }
  // 创建槽
  createCut (face, lines) {
    let cut = { node: 'Cut', children: [], attr: {} }
    let newLines = {}
    lines.forEach(line => {
      let p1 = line.vertices[0]
      let p2 = line.vertices[1]
      let cp = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 } // 线的中点坐标
      let len = Math2d.getLineLength(p1.x, p1.y, p2.x, p2.y)

      if (!newLines.hasOwnProperty(len)) {
        newLines[len] = []
      }
      newLines[len].push(cp)
    })

    let lens = Object.keys(newLines).map(key => parseInt(key))
    let holeZ = Math.min(...lens) // 最小的线长度为开槽宽度
    let points = newLines[holeZ]
    let p1 = points[0]
    let p2 = points[1]

    let x = Math2d.round(p1.x, 4)
    let y = Math2d.round(p1.y, 4)
    let x1 = Math2d.round(p2.x, 4)
    let y1 = Math2d.round(p2.y, 4)

    cut.attr = {
      Face: face,
      Hole_Z: { formula: holeZ, value: holeZ },
      X: { formula: x, value: x },
      Y: { formula: y, value: y },
      X1: { formula: x1, value: x1 },
      Y1: { formula: y1, value: y1 }
    }

    return cut
  }
  // 获取板件的属性
  getBoardAttr (vertices) {
    let item = this.getBoardWL(vertices)

    return {
      L: item.L,
      W: item.W
    }
  }

  // 导出dxf
  toDxf (nodes,option) {
    let models = this.createPaths(nodes)
    
    this.addTextToDxf(models,option)
    
    return makerjs.exporter.toDXF(models, {

    })
  }

  // 创建图形的轮廓的路径
  createPaths (nodes) {
    let model = {
      models: {}
    }

    let graphModel = { paths: {} }
    let hcModel = { paths: {} }
    nodes.forEach((node, key) => {
      if (node.node === 'Line') {
        graphModel.paths['line' + key] = this.addLine(node)
      }
      if (node.node === 'Arc') {
        graphModel.paths['arc' + key] = this.addArc(node)
      }
      if (node.node === 'TArc') {
        graphModel.paths['tArc' + key] = this.addTArc(node)
      }
      if (node.node === 'BHole' || node.node === 'VHole') {
        this.addHoleCircle(node, hcModel.paths, key)
      }
      if (node.node === 'Cut') {
        this.addCutPaths(node, hcModel.paths, key)
      }
    })

    // this.addDimension(model)

    model.models['graph'] = graphModel
    model.models['hc'] = hcModel

    return model
  }
  addLine (node) {
    let line = { type: 'line', origin: [0, 0], end: [0, 0] }
    line.origin = [node.x1, node.y1]
    line.end = [node.x2, node.y2]
    return line
  }
  addArc (node) {
    let arc = {
      type: 'arc',
      origin: [0, 0],
      radius: 0,
      startAngle: 0,
      endAngle: 0
    }

    let sAngle = Math2d.toDegrees(node.sAngle)
    let angle = Math2d.toDegrees(node.angle)
    let eAngle

    if (sAngle !== 0 && sAngle !== 180) {
      sAngle *= -1
    }

    // dxf的弧绘制方向为逆时针,当圆弧为顺圆时，将起始角度和终止角度互换
    if (angle > 0) {
      eAngle = sAngle + (360 - angle);
      [sAngle, eAngle] = [eAngle, sAngle]
    } else {
      eAngle = sAngle - angle
    }

    arc.origin = [node.center.x, node.center.y]
    arc.radius = node.r
    arc.startAngle = sAngle
    arc.endAngle = eAngle
    return arc
  }
  addTArc (node) {
    let arc = {
      type: 'arc',
      origin: [node.center.x, node.center.y],
      radius: node.r,
      startAngle: Math2d.toDegrees(node.eAngle),
      endAngle: Math2d.toDegrees(node.sAngle)
    }

    let sAngle = -Math2d.toDegrees(node.sAngle)
    let eAngle = -Math2d.toDegrees(node.eAngle)

    // dxf的弧绘制方向为逆时针,当圆弧为顺圆时，将起始角度和终止角度互换
    if (!node.wise) {
      [sAngle, eAngle] = [eAngle, sAngle]
    }

    arc.startAngle = sAngle
    arc.endAngle = eAngle
    return arc
  }
  getDxfCircle (x, y, r, id) {
    return {
      type: 'circle',
      origin: [x, y],
      radius: r,
      color: '7', // 7为白色
      layer: id
    }
  }
  addHoleCircle (node, paths, key) {
    let r = parseInt(node.R.value) / 2

    if (r > 0) {
      let X = parseInt(node.X.value)
      let Y = parseInt(node.Y.value)
      let numX = parseInt(node.Holenum_X.value)
      let numY = parseInt(node.Holenum_Y.value)
      let xcap = parseInt(node.Hole_Xcap.value)
      let ycap = parseInt(node.Hole_Ycap.value)

      for (let i = 0; i < numX; i++) {
        let x = X + xcap * i
        let y = Y
        paths[node.node + (key + i) + '_x'] = this.getDxfCircle(x, y, r, node.id)
      }
      for (let i = 0; i < numY; i++) {
        let x = X
        let y = Y + ycap * i
        paths[node.node + (key + i) + '_y'] = this.getDxfCircle(x, y, r, node.id)
      }

      if ((numX === 0 || !xcap) && (numY === 0 || !ycap)) {
        paths[node.node + key] = this.getDxfCircle(X, Y, r, node.id)
      }
    }
  }

  addCutPaths (node, paths, key) {
    let X = node.X.value
    let Y = node.Y.value
    let X1 = node.X1.value
    let Y1 = node.Y1.value
    let W = node.Hole_Z.value
    let d = W / 2
    let p1, p2, p3, p4

    if (X !== X1 && Y === Y1) {
      [p1, p2, p3, p4] = [
        { x: X, y: Y + d },
        { x: X, y: Y - d },
        { x: X1, y: Y - d },
        { x: X1, y: Y + d }
      ]
    } else {
      [p1, p2, p3, p4] = [
        { x: X + d, y: Y },
        { x: X + d, y: Y1 },
        { x: X - d, y: Y1 },
        { x: X - d, y: Y }
      ]
    }

    [p1, p2, p3, p4].forEach((p, index, arr) => {
      let p1 = p
      let p2
      if (index === arr.length - 1) {
        p2 = arr[0]
      } else {
        p2 = arr[index + 1]
      }

      paths['cut' + (key + index)] = {
        type: 'line',
        origin: [p1.x, p1.y],
        end: [p2.x, p2.y],
        layer: node.id
      }
    })
  }

  // 分别获取dxf的轮廓和孔槽
  sortEntities (entities) {
    let data = {
      graph: [],
      hole: [],
      cut: []
    }
    entities.forEach(entitie => {
      let layer = entitie.layer
      if (layer === '0') { // 轮廓的图层标记
        data.graph.push(entitie)
      } else {
        let ids = layer.split('-')
        if (ids[0] === 'h') {
          data.hole.push(entitie)
        }
        if (ids[0] === 'c') {
          data.cut.push(entitie)
        }
      }
    })

    return data
  }
  // 获取轮廓节点
  getGraphNodes (vertices) {
    let result = []

    for (let i = 0; i < vertices.length; i++) {
      let v = vertices[i]
      if (v.type === 'Point') {
        result.push(this.createPoint(v))
      } else if (v.type === 'Bulge') {
        let next = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]

        let tArc = this.createTArc(v, next, i)
        let start = this.createPoint(v)
        let end = this.createPoint(next)

        result.push(start, tArc, end)
      } else if (v.type === 'Arc') {
        result.push(this.createArc2(v))
      }
    }

    return result
  }

  // 获取轮廓的点弧
  getShapeVertices (shapes) {
    let vertices = []
    for (let shape of shapes) {
      if (shape.type === 'LINE' || shape.type === 'LWPOLYLINE') {
        let list = shape.vertices.map(v => {
          v.x = Math2d.round(v.x, 4) // 保留三位小数
          v.y = Math2d.round(v.y, 4)

          if (v.hasOwnProperty('bulge')) {
            v.type = 'Bulge'
          } else {
            v.type = 'Point'
          }

          return v
        })
        vertices.push(...list)
      } else if (shape.type === 'ARC') {
        let start = this.getPointInArc(shape.center, shape.radius, shape.startAngle)
        let end = this.getPointInArc(shape.center, shape.radius, shape.endAngle)

        let arc = {
          type: 'Arc',
          center: {
            x: Math2d.round(shape.center.x, 4),
            y: Math2d.round(shape.center.y, 4)
          },
          radius: Math2d.round(shape.radius, 4),
          startAngle: shape.startAngle,
          endAngle: shape.endAngle,
          angleLength: shape.angleLength
        }

        start.type = end.type = 'Point'
        start.x = Math2d.round(start.x, 4)
        start.y = Math2d.round(start.y, 4)
        end.x = Math2d.round(end.x, 4)
        end.y = Math2d.round(end.y, 4)

        // vertices.push(...[start, arc, end])
        vertices.push(arc)
      }
    }

    vertices = this.filterVertices(vertices)

    return vertices
  }

  // 过滤重复的点
  filterVertices (vertices) {
    let result = []
    let lastArcIndex = -1 // 上个圆弧的位置
    let lastPoint = null

    for (let i = 0; i < vertices.length; i++) {
      let v = vertices[i]

      if (lastPoint) {
        if (v.type === 'Point') {
          if (lastArcIndex === -1 || (lastArcIndex !== -1 && i - lastArcIndex > 2)) {
            if (lastPoint.x !== v.x || lastPoint.y !== v.y) {
              result.push(v)
            }
          } else {
            result.push(v)
          }

          lastPoint = v
        } else if (v.type === 'Bulge') {
          if (lastPoint.x === v.x && lastPoint.y === v.y) {
            result.pop()
            result.push(v)
          } else {
            result.push(v)
          }

          lastPoint = null
        } else if (v.type === 'Arc') {
          lastArcIndex = i
          lastPoint = null
          result.push(v)
        }
      } else {
        result.push(v)
        if (v.type === 'Point') {
          lastPoint = v
        }
      }
    }

    // 解决特殊多段线出现重复坐标计算不出圆弧的圆心导致报错
    if(result.length >= 2){
      // 判断首尾元素的坐标是否相同
      let first = result[0]
      let last = result[result.length - 1]
      if(first.x === last.x && first.y === last.y){
        result.pop()
      }
    }
  
    return result
  }

  // 转换LWPOLYLIN多段线为x2d
  trandformLWPOLYLIN (vertices) {
    let nodes = []
    for (let i = 0; i < vertices.length; i++) {
      let v = vertices[i]
      if (v.hasOwnProperty('bulge')) {
        let next = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]
        let p1 = this.createPoint(v)
        let arc = this.createArc(v, next)
        let p2 = this.createPoint(next)

        nodes.push(p1, arc, p2)
      } else {
        nodes.push(this.createPoint(v))
      }
    }

    return nodes
  }
  // 获取AB面孔槽
  getFaceNodes (face, holes, cuts) {
    let result = []
    let cutNodes = []
    if (cuts.length > 0) {
      let cutLines = {}
      cuts.forEach(line => {
        let layer = line.layer

        if (!cutLines.hasOwnProperty(layer)) {
          cutLines[layer] = []
        }
        cutLines[layer].push(line)
      })

      Object.keys(cutLines).forEach(layer => {
        let lines = cutLines[layer]
        let cut = this.createCut(face, lines)
        cutNodes.push(cut)
      })
    }

    result.push(...cutNodes)
    return result
  }
  getPathPoints (path) {
    return path.vertices.map(point => this.createPoint(point))
  }

  getLinePoints (line) {
    let p1 = this.createPoint(line.vertices[0])
    let p2 = this.createPoint(line.vertices[1])
    return [p1, p2]
  }
  createArc2 (entity) {
    let arc = { node: 'Arc', children: [], attr: {} } // bd的圆弧
    let arcAttr = this.getArcByDxfVertice(entity)

    arc.attr = {
      X: { formula: arcAttr.X, value: arcAttr.X },
      Y: { formula: arcAttr.Y, value: arcAttr.Y },
      Angle: { formula: arcAttr.Angle, value: arcAttr.Angle },
      R: { formula: arcAttr.R, value: arcAttr.R },
      StartAngle: { formula: arcAttr.StartAngle, value: arcAttr.StartAngle },
      Hotspot: { formula: '0', value: '0' },
      IsDim: { formula: '0', value: '0' }
    }
    return arc
  }

  getArcByDxfVertice(v){
    let center = v.center // 圆弧的圆心坐标
    let r = v.radius // 圆弧的半径

    // dxf的圆弧时逆时的，板件编辑默认为顺时的，起始角度和终止角度需要互换
    let sAngle = Math2d.toDegrees(v.startAngle) // 圆弧的起始角度
    let eAngle = Math2d.toDegrees(v.endAngle) // 圆弧的终止角度
    let angle = Math2d.toDegrees(v.angleLength) // 圆弧的角度

    if (angle < 0) {
      [sAngle, eAngle] = [eAngle, sAngle]
      angle = 360 + angle
    } else {
      angle *= -1
    }

    let startPoint = Math2d.getPointInCircular(center, r, sAngle)

    if (sAngle !== 180 && sAngle !== 0) {
      sAngle *= -1
    }

    return {
      X:Math2d.round(startPoint.x, 4),
      Y:Math2d.round(startPoint.y, 4),
      Angle:angle,
      R:r,
      StartAngle: sAngle
    }
  }

  // 获取圆/圆弧上任意角度的坐标
  getPointInArc (center, radius, angle) {
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    }
  }

  getBoardAttr2 (vertices) {
    let item = this.getBoardWL(vertices)

    return {
      L: parseInt(item.L),
      W: parseInt(item.W)
    }
  }

  // 通过节点得到点的几何
  getPointsByGraphNodes (nodes) {
    let pts = []
    nodes.forEach(node => {
      if (node.node === 'Point') {
        pts.push({
          x: node.attr.X.value,
          y: node.attr.Y.value
        })
      } else if (node.node === 'Arc') {
        let arc = BatchBdUtil.getCanvasArcByHGArc({
          type: 'arc',
          start: {
            x: node.attr.X.value,
            y: node.attr.Y.value
          },
          r: node.attr.R.value,
          startAngle: node.attr.StartAngle.value,
          angle: node.attr.Angle.value
        })

        pts.push(...BatchBdUtil.arcToPoints(arc.center, arc.start, arc.angle, !arc.isCounterClockwise))
      } else if (node.node === 'TArc') {
        let arc = BatchBdUtil.getCanvasArcByHGArc({
          type: 'tArc',
          start: {
            x: node.attr.X.value,
            y: node.attr.Y.value
          },
          end: {
            x: node.attr.X2.value,
            y: node.attr.Y2.value
          },
          h: node.attr.ChordH.value,
          isBulge: node.attr.IsBulge.value
        })
        
        let points = BatchBdUtil.arcToPoints(arc.center, arc.start, arc.angle, !arc.isCounterClockwise)

        pts.push(...points)
      }
    })
    return pts
  }

  getPointsByPolylines(polylines){
    let polylinPts = polylines.map(nodes => this.getPointsByPolylineNodes(nodes))
    let pts = []
    polylinPts.forEach( points => {
      pts.push(...points)
    })

    return pts
  }

  getPointsByPolylineNodes(nodes){
    let pts = []
    nodes.forEach(node => {
      if (node.node === 'Point') {
        pts.push({
          x: node.X,
          y: node.Y
        })
      } else if (node.node === 'Arc') {
        let arc = BatchBdUtil.getCanvasArcByHGArc({
          type: 'arc',
          start: {
            x: node.X,
            y: node.Y
          },
          r: node.R,
          startAngle: node.StartAngle,
          angle: node.Angle
        })

        pts.push(...BatchBdUtil.arcToPoints(arc.center, arc.start, arc.angle, !arc.isCounterClockwise))
      } else if (node.node === 'TArc') {
        let arc = BatchBdUtil.getCanvasArcByHGArc({
          type: 'tArc',
          start: {
            x: node.X,
            y: node.Y
          },
          end: {
            x: node.X2,
            y: node.Y2
          },
          h: node.ChordH,
          isBulge: node.IsBulge
        })
        
        let points = BatchBdUtil.arcToPoints(arc.center, arc.start, arc.angle, !arc.isCounterClockwise)

        pts.push(...points)
      }
    })
    return pts
  }

  getBoardWL (vertices) {
    let minx, maxx, miny, maxy

    vertices.forEach(v => {
      if (minx == null || minx > v.x) {
        minx = v.x
      }
      if (maxx == null || maxx < v.x) {
        maxx = v.x
      }
      if (miny == null || miny > v.y) {
        miny = v.y
      }
      if (maxy == null || maxy < v.y) {
        maxy = v.y
      }
    })

    return {
      L: maxx - minx,
      W: maxy - miny
    }
  }

  // 比较两组点集（多边形）是否相似
  compareSimilar (pts1, pts2) {
    let res1 = this.getPolygonAngleAndLine(pts1)
    let res2 = this.getPolygonAngleAndLine(pts2)
    let angles1 = res1.angles
    let angles2 = res2.angles
    let lens1 = res1.lens
    let lens2 = res2.lens

    // 若内角数量或多边形的边数不一致则不相似
    if (angles1.length !== angles2.length ||
            lens1.length !== lens2.length
    ) {
      return false
    }

    angles1.push(...angles1)

    let sourceStr = angles1.join('-')
    let searchStr = angles2.join('-')
    let index = sourceStr.indexOf(searchStr)

    // 多边形内角不全等
    if (index === -1) {
      return false
    }

    let length = lens2.length
    lens1.push(...lens1)
    lens1 = lens1.splice(index, length)

    // 若对应边的长度比例不一样，则不相似
    let scale = lens1[0] / lens2[0]
    for (let i = 1; i < length; i++) {
      let s = lens1[i] / lens2[i]
      if (s !== scale) {
        return false
      }
    }

    return true
  }

  // 获取多边形的内夹角和线段集合
  getPolygonAngleAndLine (pts) {
    let result = {
      angles: [], // 多边形的内夹角集合
      lens: [] // 线段的长度集合
    }

    let p1, p2, p3
    let index1, index2, index3

    for (let i = 0; i < pts.length; i++) {
      index1 = i

      if (i === pts.length - 1) {
        index2 = 0
        index3 = 1
      } else if (i === pts.length - 2) {
        index2 = i + 1
        index3 = 0
      } else {
        index2 = i + 1
        index3 = i + 2
      }

      p1 = pts[index1]
      p2 = pts[index2]
      p3 = pts[index3]

      // 0为三点在同一条直线上，正为逆时针，负为顺时针
      let res = Math2d.threePointsClockwise(p1, p2, p3)
      if (res === 0) {
        pts.splice(index2, 1)
        i++
      } else {
        let angle = Math2d.getAngleBy3Points(p1, p2, p3)
        let len = Math2d.getLineLength(p1.x, p1.y, p2.x, p2.y)

        if (res > 0) {
          angle = 360 - angle
        }

        angle = Math.round(angle)
        result.angles.push(angle)
        result.lens.push(len)
      }
    }

    return result
  }

  // 获取点
  getPoints (lines) {
    let result = []
    lines.forEach(line => {
      let p = line.vertices[0]
      result.push(p)
    })
    return result
  }

  // 创建标注的paths
  addDimension (model) {
    let dimModel = { paths: {} }

    let dimEntity = {
      type: 'aligneddim',
      layer: '',
      origin: [20, 400],
      end: [100, 400],
      Pos: [50, 100],
      options: {
        text: '66666',
        dimensionType: '1'
      }
    }

    dimModel.paths['dim-1'] = dimEntity
    model.models['dimension'] = dimModel
  }

  // 添加百分比变量，可控制整体缩放
  addRatio (board) {
    let { L, W } = board.attr
    let xr = `L/${L}`
    let yr = `W/${W}`

    for (let node of board.children[0].children) {
      node.attr.X.formula += `*${xr}`
      node.attr.Y.formula += `*${yr}`

      if (node.node === 'TArc') {
        node.attr.X2.formula += `*${xr}`
        node.attr.Y2.formula += `*${yr}`
      }
    }
  }

  // 添加文本到dxf里
  addTextToDxf(models,option){
    // 有该属性才添加
    if(option && option.size){
      let cx = option.width / 2
      let cy = option.height / 2
      let fontSize = 20
      models.models.text = {
        paths:{
          text:{
            type:'text',
            center: [cx,cy],
            text: option.size,
            fontSize
          },
          filename:{
            type:'text',
            center: [cx,cy + fontSize + 4],
            text: option.filename,
            fontSize
          }
        }
      }
    }
  }
}
