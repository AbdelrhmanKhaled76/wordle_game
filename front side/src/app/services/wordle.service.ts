import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface WordleNewWord {
  status: number;
  message: string;
  word: string;
}

interface WordleCheckWord {
  status: number;
  word: string;
  exists: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WordleService {
  constructor(private _HttpClient: HttpClient) {}

  getRandomWord() : Observable<WordleNewWord> {
    return this._HttpClient
    .get<WordleNewWord>(`http://localhost:3000/api/new-word`)
  }

  checkGuess(searchWord : string) : Observable<WordleCheckWord> {
    return this._HttpClient
    .get<WordleCheckWord>(`http://localhost:3000/api/check-word`, {
      params : {
        searchWord
      }
    });
  }
}
