import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

	private isLogged: boolean = true
	private changeMode = new BehaviorSubject<boolean>(true)
	isLoginMode = this.changeMode.asObservable();

	isUserLogged(): boolean
	{
		return this.isLogged;
	}

	login(): void
	{
		this.isLogged = true;
	}

	logout(): void
	{
		this.isLogged = false;
	}

	updateLoginModeValue(value: boolean)
	{
		this.changeMode.next(value);
	}

}
