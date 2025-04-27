let gameStart = false
let playerTurn = true
const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const botBox = document.getElementById('bot')
const playerBox = document.getElementById('player')
const turnText = document.getElementById('turn-info')

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

const turn = () => {
  if (playerTurn) {
    turnText.innerText = 'bot Turn'
    playerTurn = false
  } else {
    turnText.innerText = 'player Turn'
    playerTurn = true
  }
}

const hitCell = (box, element) => {
  if (playerTurn) {
    if (box.id === 'player') {
      alert('You cannot hit your own ship')
      return
    }
    const cellId = element.target.id
    const cell = botCells.find((cell) => cell.id === cellId)
    if (cell.isHit) {
      alert('Already hit this cell')
      return
    }
    if (cell.isShip) {
      cell.isHit = true
      element.target.style.backgroundColor = 'red'
      const ship = botShips.find((ship) => ship.cells.includes(cell))
      ship.checkSunk()
      if (ship.isSunk) {
        alert('You sunk a ship!')
      }
    } else {
      cell.isHit = true
      element.target.style.backgroundColor = 'black'

      setTimeout(() => {
        turn()
        botTurn()
      }, 1000)
    }
  }
}

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

    cell.addEventListener('click', (element) => {
      if (!gameStart) {
        alert('Game not started yet')
        return
      } else {
        hitCell(box, element)
      }
    })

    box.appendChild(cell)
  }
}
const botTurn = () => {
  if (playerTurn) {
    return
  }

  const randomCell = Math.floor(Math.random() * 100)
  const cell = playerCells[randomCell]
  if (cell.isHit) {
    botTurn()
    return
  }
  cell.isHit = true
  const cellElement = document.getElementById(cell.id)
  if (cell.isShip) {
    cellElement.style.backgroundColor = 'red'
    const ship = playerShips.find((ship) => ship.cells.includes(cell))
    ship.checkSunk()
    if (ship.isSunk) {
      alert('Bot sunk your ship!')
    }
    setTimeout(() => {
      botTurn()
    }, 2000)
    return
  } else {
    cellElement.style.backgroundColor = 'black'
    turn()
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
