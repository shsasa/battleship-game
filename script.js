let gameStart = false
let playerTurn = true
const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const botBox = document.getElementById('bot')
const playerBox = document.getElementById('player')

class Cell {
  constructor(id) {
    this.id = id
    this.isHit = false
    this.isShip = false
  }
}

class Ship {
  constructor(id, length) {
    this.id = id
    this.length = length
    this.cells = []
    this.isSunk = false
  }

  addCell(cell) {
    this.cells.push(cell)
  }

  checkSunk() {
    this.isSunk = this.cells.every((cell) => cell.isHit)
    if (this.isSunk) {
      this.cells.forEach((cell) => {
        const cellElement = document.getElementById(cell.id)
        cellElement.style.backgroundColor = 'red'
      })
    }
  }
}

const playerCells = []
const botCells = []
const playerShips = []
const botShips = []
const playerShipsCount = 5
const botShipsCount = 5

const addCellToBox = (box) => {
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div')
    cell.classList = 'cell'
    cell.id = box.id + i
    if (box.id === 'player') {
      playerCells.push(new Cell(cell.id))
    }
    if (box.id === 'bot') {
      botCells.push(new Cell(cell.id))
    }

    cell.addEventListener('click', (e) => {
      if (!gameStart) {
        alert('Game not started yet')
        return
      }
      if (playerTurn) {
        if (box.id === 'player') {
          alert('You cannot hit your own ship')
          return
        }
        const cellId = e.target.id
        const cell = botCells.find((cell) => cell.id === cellId)
        if (cell.isHit) {
          alert('Already hit this cell')
          return
        }
        cell.isHit = true
        e.target.style.backgroundColor = 'red'
        // playerTurn = false
      }
    })

    box.appendChild(cell)
  }
}

const addShips = (cells, ships) => {
  ships.forEach((ship) => {
    let placed = false
    while (!placed) {
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'
      const startCell = Math.floor(Math.random() * 100)
      const cellsToPlace = []
      for (let i = 0; i < ship.length; i++) {
        let cellId
        if (direction === 'horizontal') {
          cellId = startCell + i
          if (cellId % 10 === 0) {
            break
          }
        } else {
          cellId = startCell + i * 10
          if (cellId >= 100) {
            break
          }
        }
        const cell = cells[cellId]
        if (cell.isShip) {
          break
        }
        cellsToPlace.push(cell)
      }
      if (cellsToPlace.length === ship.length) {
        cellsToPlace.forEach((cell) => {
          cell.isShip = true
          ship.addCell(cell)
        })
        placed = true
      }
    }
  })

  if (cells === playerCells) {
    ships.forEach((ship) => {
      ship.cells.forEach((cell) => {
        const cellElement = document.getElementById(cell.id)
        cellElement.style.backgroundColor = 'blue'
      })
    })
  }
}

const startGame = () => {
  addCellToBox(playerBox)
  addCellToBox(botBox)

  playerShips.push(new Ship('ship1', 5))
  playerShips.push(new Ship('ship2', 4))
  playerShips.push(new Ship('ship3', 3))
  playerShips.push(new Ship('ship4', 3))
  playerShips.push(new Ship('ship5', 2))
  botShips.push(new Ship('ship1', 5))
  botShips.push(new Ship('ship2', 4))
  botShips.push(new Ship('ship3', 3))
  botShips.push(new Ship('ship4', 3))
  botShips.push(new Ship('ship5', 2))
  addShips(playerCells, playerShips)
  addShips(botCells, botShips)
}

startButton.addEventListener('click', () => {
  if (gameStart) {
    alert('Game already started')
    return
  }
  gameStart = true
  startButton.style.backgroundColor = 'green'
  startButton.style.color = 'white'
  startButton.style.border = '1px solid green'
  startButton.innerText = 'Game Started'
  startButton.style.cursor = 'not-allowed'
  startButton.disabled = true
  startGame()
})
resetButton.addEventListener('click', () => {
  if (!gameStart) {
    alert('Game not started yet')
    return
  }

  gameStart = false
  startButton.style.backgroundColor = 'white'
  startButton.style.color = 'black'
  startButton.style.border = '1px solid black'
  startButton.innerText = 'Start Game'
  startButton.style.cursor = 'pointer'
  startButton.disabled = false
})
