<h1 align="center">2D Web Design Tool</h1>

<div align="center">

[Demo](https://liaozeen.github.io/BDEditor/)</div>

![](./img/%E9%A2%84%E8%A7%88%E5%9B%BE.png)

# Features
- Drag and drop
- Zoom in/out based on the current mouse position
- Undo/Redo
- Snap to grid/snap to object
- Annotation
- Read Dxf files (AutoCAD's drawing exchange file format)
- Conversion between different graphic formats

# Instruction
## Page Structure
- Top: Function bar
- Center: Canvas, core part
- Left: List of graphics on the canvas, view and edit graphic properties
- Upper right corner: Display of 6 sides of the board 
- Bottom: Basic information about the board

## Introduction to Top Function Area 
- Import: Open local .bd file (custom file format)
- Source Code: View content of .bd file, i.e. XML content displayed on current canvas 
- Undo：Undo previous operation and restore to previous state 
- Redo：Re-execute previous operation 
- Export bd：Export graphics on current canvas for download  
- Export png：Export graphics on current canvas as a png file  
- Reset to rectangle：Reset current polygon to rectangle  
- Import Dxf：Read dxf files and display their graphics 

## Operations in Graphic List on Left Side   
- Operations for point arcs:
    - Single click : View position of currently selected graphic on the canvas    
    - Double-click : View and edit properties of points and arcs  

- Operations for AB-side Graphics:
    - Single click : View position of currently selected graphic on the canvas    
    - Right-click : Call up operation list  

## Operations in Canvas Area   
In upper right corner are different faces displaying boards:
   - A/B side ：The largest positive/negative two sides of board can be edited here, such as modifying outline or adding grooves (adding elements and holes cannot be used), converting straight lines into arcs.
   - L/R/U/D side ：Four side views previewing structure of board from different angles.  
   - Preview ：View annotated board shape   

On the canvas, you can select graphics for dragging to adjust their positions. You can also zoom in/out conveniently for partial operations with slightly larger graphics.
