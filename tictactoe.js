// Module Pattern IIFE  => Singleton

const GameBoard = (() => {
    const clearGameBoard = () => Array(9)

    let _gameBoard =clearGameBoard()
    const clearBoard =()=> {
        console.log('Clear board')
        _gameBoard=clearGameBoard()
    }
    const getBoard=()=> _gameBoard
    const setField=(x,y,value) => {
        let index = x + y*3
        _gameBoard[index]=value
    }
    return {clearBoard,getBoard,setField}
})()

//Function Pattern
const Player = ((name) => {
    const sayName= ()=> {
        console.log(`My Name is ${name}`)
    }

    return {sayName}
})
