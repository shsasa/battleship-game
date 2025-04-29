let gameStart = false
let playerTurn = true
const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const botBox = document.getElementById('bot')
const playerBox = document.getElementById('player')
const turnText = document.getElementById('turn-info')
const playerCells = []
const botCells = []
const playerShips = []
const botShips = []
let playerShipsCount = 5
let botShipsCount = 5
let botWinCount = 0
let playerWinCount = 0

const playerShipsCountText = document.getElementById('player-info')
const botShipsCountText = document.getElementById('bot-info')
const winnerInfo = document.getElementById('winner-info')
const gameStatus = document.getElementById('game-status')
const notificationText = document.getElementById('notification')
const shipListContainer = document.getElementById('ship-list')
class Cell {
  constructor(id) {
    this.id = id
    this.isHit = false
    this.isShip = false
  }
}

class Ship {
  constructor(id, length, horizontal) {
    this.id = id
    this.length = length
    this.cells = []
    this.isSunk = false
    this.horizontal = horizontal
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

const turn = () => {
  if (playerShipsCount === 0) {
    alert('Bot wins!')
    gameStart = false
    resetButton.click()
  }
  if (botShipsCount === 0) {
    alert('Player wins!')
    gameStart = false
    resetButton.click()
  }
  if (!gameStart) {
    turnText.innerText = 'Game not started yet'
    return
  }
  if (playerTurn) {
    turnText.innerText = 'Bot turn'
    playerTurn = false
  } else {
    turnText.innerText = 'Your turn'
    playerTurn = true
  }
  playerShipsCountText.innerText = playerShipsCount
  botShipsCountText.innerText = botShipsCount
}

const updateNotification = (updateText, color = 'black') => {
  notificationText.innerText = updateText
  setTimeout(() => {
    notificationText.innerText = ''
  }, 3000)

  if (color) {
    notificationText.style.color = color
  }
}

const hitCell = (box, element) => {
  if (playerTurn) {
    if (box.id === 'player') {
      updateNotification('You cannot hit your own ship', 'red')
      return
    }
    const cellId = element.target.id
    const cell = botCells.find((cell) => cell.id === cellId)
    if (cell.isHit) {
      updateNotification('Already hit this cell', 'red')
      return
    }
    if (cell.isShip) {
      cell.isHit = true
      element.target.classList = 'cell-hit'
      const ship = botShips.find((ship) => ship.cells.includes(cell))
      ship.checkSunk()
      if (ship.isSunk) {
        botShipsCount--
        if (botShipsCount === 0) {
          updateNotification('You sunk all ships! You win!', 'green')
          winnerInfo.innerText = 'You win!'
          gameStatus.innerText = ''
          gameStart = false

          startButton.disabled = false
          playerWinCount++
        }
        updateNotification('You sunk a ship!', 'green')
      }
    } else {
      cell.isHit = true
      element.target.classList = 'cell-non-a'

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
  const availableCells = playerCells.filter((cell) => !cell.isHit)
  const randomCell =
    availableCells[Math.floor(Math.random() * availableCells.length)]

  const cell = playerCells[randomCell]
  if (cell.isHit) {
    botTurn()
    return
  }
  cell.isHit = true
  const cellElement = document.getElementById(cell.id)
  if (cell.isShip) {
    cellElement.classList = 'cell-hit'
    const ship = playerShips.find((ship) => ship.cells.includes(cell))
    ship.checkSunk()
    if (ship.isSunk) {
      playerShipsCount--
      if (playerShipsCount === 0) {
        updateNotification('Bot sunk all your ships! You lose!', 'red')
        botWinCount++
        gameStart = false

        startButton.disabled = false
      }
    }
    setTimeout(() => {
      botTurn()
    }, 2000)
    return
  } else {
    cellElement.classList = 'cell-non-a'
    turn()
  }
}
const dragstartHandler = (ev) => {
  ev.dataTransfer.setData('text', ev.target.id)
}

const dragoverHandler = (ev) => {
  ev.preventDefault()
}

const dropHandler = (ev) => {
  ev.preventDefault()
  const data = ev.dataTransfer.getData('text')
  ev.target.appendChild(document.getElementById(data))
}

const addShips = (cells, ships, player) => {
  ships.forEach((ship) => {
    let placed = false
    while (!placed) {
      const startCell = Math.floor(Math.random() * 100)
      const cellsToPlace = []
      for (let i = 0; i < ship.length; i++) {
        let cellId
        if (ship.horizontal) {
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

  if (player) {
    ships.forEach((ship) => {
      ship.cells.forEach((cell) => {
        const cellElement = document.getElementById(cell.id)

        cellElement.classList = `ship`
      })
    })
  }
}
const sortShips = (ships) => {
  for (let i = 0; i < ships.length; i++) {
    const cell = document.createElement('div')
    cell.id = ships[i].name
    cell.draggable = true
    cell.addEventListener('dragstart', dragstartHandler)
    cell.addEventListener('dragover', dragoverHandler)
    cell.addEventListener('drop', dropHandler)
    cell.classList = `ship-${ships[i].length}-h`

    shipListContainer.appendChild(cell)
  }
}

const startGame = () => {
  addCellToBox(playerBox)
  addCellToBox(botBox)

  playerShips.push(new Ship('ship1', 5, Math.random() < 0.5))
  playerShips.push(new Ship('ship2', 4, Math.random() < 0.5))
  playerShips.push(new Ship('ship3', 3, Math.random() < 0.5))
  playerShips.push(new Ship('ship4', 3, Math.random() < 0.5))
  playerShips.push(new Ship('ship5', 2, Math.random() < 0.5))
  botShips.push(new Ship('ship1', 5, Math.random() < 0.5))
  botShips.push(new Ship('ship2', 4, Math.random() < 0.5))
  botShips.push(new Ship('ship3', 3, Math.random() < 0.5))
  botShips.push(new Ship('ship4', 3, Math.random() < 0.5))
  botShips.push(new Ship('ship5', 2, Math.random() < 0.5))
  // addShips(playerCells, playerShips, true)
  sortShips(playerShips)
  addShips(botCells, botShips, false)
  playerShipsCountText.innerText = playerShipsCount
  botShipsCountText.innerText = botShipsCount
  turnText.innerText = 'Your turn'
  gameStatus.innerText = 'Game started'
  turnText.style.color = 'green'
}

startButton.addEventListener('click', () => {
  if (gameStart) {
    updateNotification('Game already started')
    return
  }
  gameStart = true

  startButton.disabled = true
  startGame()
})
resetButton.addEventListener('click', () => {
  gameStart = false
  playerTurn = true
  playerShipsCount = 5
  botShipsCount = 5
  playerShips.length = 0
  botShips.length = 0
  playerCells.length = 0
  botCells.length = 0
  playerBox.innerHTML = ''
  botBox.innerHTML = ''
  playerShipsCountText.innerText = playerShipsCount
  botShipsCountText.innerText = botShipsCount

  startButton.disabled = false
  turnText.innerText = 'Game not started yet'
  const cells = document.querySelectorAll('.cell')

  cells.forEach((cell) => {
    cell.classList = 'cell'
  })
})
