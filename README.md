# 项目简介
一个的2D图形编辑器，用于对衣柜的板进行查看和修改。

功能点：
- 拖拽
- 定点缩放（基于当前鼠标的位置进行放大缩小）
- 撤销/恢复
- 吸附
- 标注
- 读取Dxf格式的文件（AutoCAD的绘图交换文件格式）
- 图形间的转换

[在线预览](https://liaozeen.github.io/BDEditor/)

# 使用指南
## 页面结构
- 顶部：功能栏
- 正中间：画布，核心部分
- 左侧：画布上的图形列表，查看和编辑图形的属性
- 右上角：板的6个面展示
- 底部：板的基本信息

## 顶部功能区介绍
- 导入：打开本地的.bd文件（自定义的文件格式）
- 源代码：查看.bd文件的内容，即当前画布上显示的板件的XML内容
- 撤销：撤销之前的操作，恢复到之前的状态
- 恢复：重新执行之前的操作
- 导出bd：将当前画布上的图形导出下载
- 导出png：将当前画布上的图形导出为png文件
- 重置为矩形：将当前的多边形重置为矩形
- 导入Dxf：读取dxf文件，显示其图形

## 左侧图形列表操作
- 对点弧的操作
    - 单击：可查看当前选中的图形在画布上的位置
    - 双击：可查看和编辑点和弧的属性
- 对AB面的图形的操作
    - 单击：可查看当前选中的图形在画布上的位置
    - 右击：调出操作列表

## 画布区域的操作
在画布区域的右上角是显示板件的不同面：
- A/B面：为板件的最大的正反两面，在该面可对其进行编辑，比如修改板件的轮廓、添加凹槽（添加图元和孔无法使用）、直线转圆弧。
- L/R/U/D面：为板件的四个侧面，只预览，从侧面查看板件的结构
- 预览：查看带有标注的板件图形

在画布上可选中图形进行拖拽，调整其位置。还能放大缩小，方便对稍大的图形的局部进行操作。
