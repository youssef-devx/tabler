figma.showUI(__html__)

async function createTable({ rowsCount, colsCount }: { rowsCount: number, colsCount: number }) {
  const nodes: SceneNode[] = []
  const DEFAULT_TEXT_WIDTH = 47 + 16
  const DEFAULT_TEXT_HEIGHT = 15 + 16
  const TABLE_WIDTH = colsCount * DEFAULT_TEXT_WIDTH
  const TABLE_HEIGHT = rowsCount * DEFAULT_TEXT_HEIGHT
  const LONGEST_WIDTH = Math.max(...figma.currentPage.children.map(c => c.width))

  // Create Table' frame
  const tableFrame = figma.createFrame()
  tableFrame.name = "Table"
  tableFrame.x = LONGEST_WIDTH + 40
  tableFrame.y = 0
  tableFrame.fills = []
  tableFrame.layoutMode = "VERTICAL"
  tableFrame.layoutSizingHorizontal = "HUG"
  tableFrame.layoutSizingVertical = "HUG"

  // Creating rows
  for (let i = 0; i < rowsCount; i++) {
    const rowFrame = figma.createFrame()
    rowFrame.name = i < 1 ? "Table Head" : "Row " + i
    rowFrame.resize(DEFAULT_TEXT_WIDTH, DEFAULT_TEXT_HEIGHT)
    rowFrame.y = DEFAULT_TEXT_HEIGHT * i
    rowFrame.fills = []

    rowFrame.layoutMode = "HORIZONTAL"
    rowFrame.layoutSizingVertical = "HUG"
    rowFrame.itemSpacing = 0

    // Create row's cells
    for (let j = 0; j < colsCount; j++) {
      const cellText = figma.createText()
      await figma.loadFontAsync({ family: "Inter", style: "Regular" })
      cellText.characters = i < 1 ? "Head" : "Cell Text"
      cellText.resize(DEFAULT_TEXT_WIDTH, DEFAULT_TEXT_HEIGHT)
      cellText.textAlignHorizontal = "CENTER"
      cellText.textAlignVertical = "CENTER"
      cellText.fills = [{ "type": "SOLID", "visible": true, "opacity": 1, "blendMode": "NORMAL", "color": { "r": 1, "g": 1, "b": 1 }, "boundVariables": {} }]
      rowFrame.appendChild(cellText)
    }

    const rowLine = figma.createLine()
    rowLine.name = "Row bottom border"
    rowLine.y = DEFAULT_TEXT_HEIGHT
    rowLine.resize(TABLE_WIDTH, 0)
    rowLine.strokes = [{ "type": "SOLID", "visible": true, "opacity": 1, "blendMode": "NORMAL", "color": { "r": 1, "g": 1, "b": 1 }, "boundVariables": {} }]

    tableFrame.appendChild(rowFrame)
    rowFrame.appendChild(rowLine)
    rowLine.layoutPositioning = "ABSOLUTE"

    nodes.push(rowFrame)
  }

  for (let i = 0; i < tableFrame.children.length; i++) {
    // @ts-ignore
    tableFrame.children[i].layoutSizingHorizontal = "FILL"
  }

  for (let i = 0; i < (colsCount + 1); i++) {
    // Create col's line
    const colLine = figma.createLine()
    colLine.name = "Col line"
    colLine.resize(TABLE_HEIGHT, 0)
    colLine.rotation = 90
    colLine.strokes = [{ "type": "SOLID", "visible": true, "opacity": 1, "blendMode": "NORMAL", "color": { "r": 1, "g": 1, "b": 1 }, "boundVariables": {} }]
    tableFrame.appendChild(colLine)
    colLine.layoutPositioning = "ABSOLUTE"
    colLine.x = i < 1 ? 1 : i * DEFAULT_TEXT_WIDTH
    colLine.y = TABLE_HEIGHT
  }

  // Create top border
  const topRowLine = figma.createLine()
  topRowLine.name = "Top border"
  topRowLine.resize(TABLE_WIDTH, 0)
  topRowLine.strokes = [{ "type": "SOLID", "visible": true, "opacity": 1, "blendMode": "NORMAL", "color": { "r": 1, "g": 1, "b": 1 }, "boundVariables": {} }]

  tableFrame.appendChild(topRowLine)
  topRowLine.layoutPositioning = "ABSOLUTE"
  topRowLine.y = 1

  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView([tableFrame])
}
figma.ui.onmessage = msg => {
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = []
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createEllipse()
      rect.x = i * 150
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }

  if (msg.type === 'create-table') createTable(msg)
  if (msg.type === 'cancel') figma.closePlugin()
}

figma.ui.resize(300, 256)