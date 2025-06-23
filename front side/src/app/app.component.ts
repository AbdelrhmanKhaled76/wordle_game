import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { WordleService } from './services/wordle.service';
import { ToastrService } from 'ngx-toastr';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnInit {
  guess!: string;
  allGuesses: string[] = Array.from({ length: 30 }, () => '');
  styledGuesses: string[] = Array.from(
    { length: 30 },
    () => 'border-[#DFE1E8]'
  );
  guessPointer: number = 0;
  guessPointerEnd: number = 5;
  trials: number = 0;
  phrase: string = '';
  isCorrect: boolean = false;
  show: boolean = false;
  notCorrect: boolean = false;
  keyboard!: Keyboard;

  @ViewChild('gameBoard') gameBoard!: ElementRef;

  ngOnInit(): void {
    this.getNewWord();
  }

  ngAfterViewInit(): void {
    this.gameBoard.nativeElement.focus();
    this.keyboard = new Keyboard({
      layout: {
        default: [
          'Q W E R T Y U I O P Backspace',
          'A S D F G H J K L Enter',
          'Z X C V B N M',
        ],
      },
      display: {
        'Backspace': '⌫',
        'Enter': '↩',
      },
      theme: 'hg-theme-default',
      onKeyPress: (button) => this.onPressing(button),
    });
  }
  constructor(
    private _WordleService: WordleService,
    private toastr: ToastrService
  ) {}

  newGameButton(): void {
    window.location.reload();
  }

  getNewWord(): void {
    this._WordleService
      .getRandomWord()
      .pipe(
        take(1), // Cancel when component destroys
        catchError((err) => {
          this.toastr.error('Error fetching word. Please try again.');
          return of({ word: 'DEFAULT' }); // Fallback
        })
      )
      .subscribe({
        next: (res) => {
          if (res.word) {
            this.guess = res.word.toUpperCase();
            console.log(this.guess);
            this.phrase = `Unfortunately, you lost! The word was "${this.guess}"`;
          }
        },
      });
  }

  checkExistingWord(searchWord: string): Observable<boolean> {
    return this._WordleService.checkGuess(searchWord).pipe(
      take(1),
      map((res) => res.exists),
      catchError((err) => {
        this.toastr.error(
          'Error checking word: ' + (err.error?.message || 'Server error')
        );
        return of(false);
      })
    );
  }

  wrongWordStyling(startIndex: number): void {
    for (let i = 0; i < 5; i++) {
      this.styledGuesses[startIndex + i] = 'animation';
    }

    setTimeout(() => {
      for (let i = startIndex; i < startIndex + 5; i++) {
        if (this.styledGuesses[i] === 'animation') {
          this.styledGuesses[i] = 'border-[#DFE1E8]';
        }
      }
      this.styledGuesses = [...this.styledGuesses]; // 🔥 Ensure Angular detects change
    }, 300);
  }

  styleWord(startIndex: number): void {
    for (let i = 0; i < 5; i++) {
      const index = startIndex + i;
      const letter = this.allGuesses[index];
      if (letter === this.guess[i]) {
        this.styledGuesses[index] =
          'border-green-500 bg-green-200 rotate-x-[360deg]';
      } else if (this.guess.includes(letter)) {
        this.styledGuesses[index] =
          'border-yellow-500 bg-yellow-200 rotate-x-[360deg]';
      } else {
        this.styledGuesses[index] =
          'border-gray-800 bg-gray-200 rotate-x-[360deg]';
      }
    }
  }

  styledLetters(index: number): string {
    return this.allGuesses[index] ? 'border-gray-500' : '';
  }

  onPressing(event : any): void {

    let key : string = event.key ?? event;

    if (
      !/^[a-zA-Z]$/.test(key) &&
      key !== 'Backspace' &&
      key !== 'Enter'
    ) {
      return;
    }

    if (key === 'Enter') {
      if (this.guessPointer === this.guessPointerEnd) {
        const guessedWord = this.allGuesses
          .slice(this.guessPointer - 5, this.guessPointer)
          .join('');
        if (guessedWord === this.guess) {
          this.styleWord(this.guessPointer - 5);
          this.isCorrect = true;
          this.phrase = `Congratulations, you won! 🎉, it took you ${this.trials + 1} guesses to beat it`;
          this.show = true;
        } else {
          this.checkExistingWord(guessedWord.toLowerCase()).subscribe(
            (exists) => {
              if (exists) {
                this.styleWord(this.guessPointer - 5);
                this.trials++;
                this.guessPointerEnd = Math.min(this.guessPointerEnd + 5, 30);
                if (this.trials === 6) {
                  this.show = true;
                }
              } else {
                this.wrongWordStyling(this.guessPointerEnd - 5);
              }
            }
          );
        }
      } else {
        this.wrongWordStyling(this.guessPointerEnd - 5);
      }
    } else if (key === 'Backspace') {
      if (this.guessPointer > this.trials * 5) {
        this.allGuesses[--this.guessPointer] = '';
      }
    } else {
      if (this.guessPointer < this.guessPointerEnd) {
        this.allGuesses[this.guessPointer] = key.toUpperCase();
        this.guessPointer++;
      }
    }
  }
}
