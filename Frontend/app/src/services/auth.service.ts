import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

	private isLogged: boolean = false

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
	
}
