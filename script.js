let gameStart = false

const botBox = document.getElementById('bot')
const playerBox = document.getElementById('player')

const addCellToBox = (box) => {
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div')
    cell.classList = 'cell'
    cell.id = box.id + i

    box.appendChild(cell)
  }
}

addCellToBox(playerBox)
addCellToBox(botBox)
