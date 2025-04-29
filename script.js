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
let shipsPlaced = false

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
  if (!shipsPlaced) {
    updateNotification('You must place all ships before playing!', 'red')
    return
  }
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
const handleDropShip = (event, boxId) => {
  if (boxId !== 'player') return

  event.preventDefault()

  const shipId = event.dataTransfer.getData('shipId')

  const ship = playerShips.find((ship) => ship.id === shipId)

  const dropCell = event.target

  if (!dropCell.classList.contains('cell')) {
    updateNotification('You must drop on a valid cell.', 'red')
    return
  }

  const dropCellId = dropCell.id
  const cellIndex = playerCells.findIndex((cell) => cell.id === dropCellId)

  if (cellIndex === -1) return

  const cellsToOccupy = []

  for (let i = 0; i < ship.length; i++) {
    let targetIndex
    if (ship.horizontal) {
      targetIndex = cellIndex + i
      if (Math.floor(targetIndex / 10) !== Math.floor(cellIndex / 10)) {
        updateNotification('Cannot place ship across rows!', 'red')
        return
      }
    } else {
      targetIndex = cellIndex + i * 10
      if (targetIndex >= 100) {
        updateNotification('Ship goes out of bounds!', 'red')
        return
      }
    }

    const targetCell = playerCells[targetIndex]
    if (!targetCell || targetCell.isShip) {
      updateNotification('Cannot place ship on occupied space!', 'red')
      return
    }
    cellsToOccupy.push(targetCell)
  }

  cellsToOccupy.forEach((cell) => {
    cell.isShip = true
    const cellElement = document.getElementById(cell.id)
    cellElement.classList.add('ship')
  })

  const shipElement = document.getElementById(shipId)
  shipElement.remove()

  if (shipListContainer.children.length === 0) {
    shipsPlaced = true
    updateNotification('All ships placed! You can start playing.', 'green')
  }
}

const addCellToBox = (box) => {
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div')
    cell.classList = 'cell'
    cell.id = box.id + i

    const newCell = new Cell(cell.id)

    if (box.id === 'player') {
      playerCells.push(newCell)

      cell.addEventListener('dragover', (e) => {
        e.preventDefault()
      })

      cell.addEventListener('drop', (e) => {
        e.preventDefault()
        handleDropShip(e, box.id)
      })
    }

    if (box.id === 'bot') {
      botCells.push(newCell)
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
  if (playerTurn || !gameStart) return

  const availableCells = playerCells.filter((cell) => !cell.isHit)
  if (availableCells.length === 0) return

  const cell = availableCells[Math.floor(Math.random() * availableCells.length)]

  cell.isHit = true
  const cellElement = document.getElementById(cell.id)

  if (cell.isShip) {
    cellElement.classList = 'cell-hit'
    const ship = playerShips.find((ship) => ship.cells.includes(cell))
    if (ship) {
      ship.checkSunk()
      if (ship.isSunk) {
        playerShipsCount--
        if (playerShipsCount === 0) {
          updateNotification('Bot sunk all your ships! You lose!', 'red')
          botWinCount++
          gameStart = false
          startButton.disabled = false
          return
        }
      }
    }
    setTimeout(botTurn, 2000)
  } else {
    cellElement.classList = 'cell-non-a'
    turn()
  }
}

const dragstartHandler = (ev) => {
  const shipId = ev.target.id
  const ship = playerShips.find((ship) => ship.id === shipId)
  if (!ship) return
  ev.dataTransfer.setData('shipId', ship.id)
  ev.dataTransfer.setData('shipLength', ship.length)
  ev.dataTransfer.setData('shipHorizontal', ship.horizontal)
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
  ships.forEach((ship) => {
    const shipElement = document.createElement('div')
    shipElement.id = ship.id
    shipElement.draggable = true
    shipElement.classList.add('ship')
    shipElement.classList.add(
      `ship-${ship.length}-${ship.horizontal ? 'h' : 'v'}`
    )

    shipElement.dataset.length = ship.length
    shipElement.dataset.horizontal = ship.horizontal

    shipElement.addEventListener('dragstart', dragstartHandler)

    shipListContainer.appendChild(shipElement)
  })
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
  addShips(botCells, botShips, false)
  sortShips(playerShips)
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
  shipListContainer.innerHTML = ''
  shipsPlaced = false

  cells.forEach((cell) => {
    cell.classList = 'cell'
  })
})
