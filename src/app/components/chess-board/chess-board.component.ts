import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import chessBoard from '../../../public/chess-board'
import colors from '../../../public/colors'
import chessPieces from '../../../public/chessPieces';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {
  chessBoard = chessBoard;

  whiteTurn: boolean = true;

  selectedRow: number;
  selectedColumn: number;
  selectedSquare: string;
  selectedPiece: object;

  clickedRow: number;
  clickedColumn: number;
  clickedSquare: string;
  clickedPiece: object;

  validMoves: string[];

  onClick(rowIdx: number, columnIdx: number) {
    this.clickedRow = rowIdx;
    this.clickedColumn = columnIdx;
    this.clickedSquare = `${rowIdx}${columnIdx}`;
    this.clickedPiece = this.getClickedPiece();


    if (this.validMove()) {
      this.movePiece();
      return;
    }

    // if clicked square has peice (pawn, bishop, etc ...), select square
    if (this.clickedPiece) {
      this.selectSquare();
      return;
    }
  }

  validRowMove(rowMove) {
    return this.selectedRow + rowMove === this.clickedRow;
  }

  validColumnMove(columnMove) {
    return this.selectedColumn + columnMove === this.clickedColumn;
  }

  movedToSquareWithSameColor() {
    // if moving peice to empty square, piece is not moving to square with same color piece
    if (!this.clickedPiece) {
      return false;
    }
    // white/black piece can't with to square with piece of the same color
    if (this.clickedPiece['color'] === this.selectedPiece['color']) {
      return true;
    }
    return false;
  }

  validPieceMove() {
    const moves = this.selectedPiece['moves'];
    let isValid = false;
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (this.validRowMove(move.row) &&
        this.validColumnMove(move.column)) {
        isValid = true;
      }
    }
    return isValid;
  }

  hoppedOverPiece() {
    let selectedColumn = this.selectedColumn
    let clickedColumn = this.clickedColumn
    let selectedRow = this.selectedRow
    let clickedRow = this.clickedRow

    let foundInteruptingPiece = false;
    while (true) {
      if (selectedColumn !== clickedColumn) {
        selectedColumn > clickedColumn ? selectedColumn -= 1 : selectedColumn += 1
      }
      if (selectedRow !== clickedRow) {
        selectedRow > clickedRow ? selectedRow -= 1 : selectedRow += 1
      }

      if (selectedColumn === clickedColumn && selectedRow === clickedRow) {
        break;
      }

      if (chessBoard[selectedRow][selectedColumn]) {
        foundInteruptingPiece = true;
      }
    }

    return foundInteruptingPiece;
  }

  validMove() {
    // can't move piece if piece is not selected
    if (!this.selectedPiece) {
      return false;
    }

    if (this.movedToSquareWithSameColor()) {
      return false;
    }

    if (!this.validPieceMove()) {
      return false;
    }

    if (this.hoppedOverPiece()) {
      return false;
    }

    return true;
  }

  movePiece() {
    const pieceToMove = this.chessBoard[this.selectedRow][this.selectedColumn];
    // location from which piece moved from is now blank
    this.chessBoard[this.selectedRow][this.selectedColumn] = null;
    // location that piece moves to now has piece
    this.chessBoard[this.clickedRow][this.clickedColumn] = pieceToMove;
    // piece is no longer selected after it is moved
    this.selectedSquare = null;
    // Black's turn after white moves piece and vise versa
    this.whiteTurn = !this.whiteTurn;
  }

  // if clicked square has piece, select square
  getClickedPiece() {
    // if chess piece found at clicked square return true
    const pieceType = this.chessBoard[this.clickedRow][this.clickedColumn];
    return chessPieces[pieceType];
  }

  selectSquare() {
    // If selected square is clicked, deselect it
    if (this.clickedSquare === this.selectedSquare) {
      this.selectedRow = null;
      this.selectedColumn = null;
      this.selectedSquare = null;
      this.selectedPiece = null;
    } else {
      // if unselected square is clicked, select it
      this.selectedRow = this.clickedRow;
      this.selectedColumn = this.clickedColumn;
      this.selectedSquare = this.clickedSquare;
      this.selectedPiece = this.getClickedPiece();
    }
  }

  getChessPiece(row: number, column: number) {
    return chessPieces[this.chessBoard[row][column]]
  }

  color(rowIdx, columnIdx) {
    if (this.selectedSquare === `${rowIdx}${columnIdx}`) {
      return colors.SELECTED;
    }
    // Every other square has either even color or odd color
    return ((rowIdx + columnIdx) % 2 === 0) ? colors.EVEN : colors.ODD;
  }

  constructor() { }

  ngOnInit() {
  }
}
