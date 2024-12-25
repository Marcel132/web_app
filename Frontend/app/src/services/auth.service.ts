import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

	private isLogged?: boolean

	isUserLogged(): boolean
	{
		return this.isLogged || false;
	}

	login(): void
	{
		this.isLogged = true;
	}

	logout(): void
	{
		this.isLogged = false;
	}

	checkValidData(login: string, password: string): { valid: boolean; message: string[]}
	{
		const errors: string[] = [];

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(login)) {
			console.log("Login" + !emailRegex.test(login))
      errors.push('Nieprawidłowy format e-maila.');
    }

    // Sprawdzanie hasła
    if (password.length < 8) {
      errors.push('Hasło musi mieć co najmniej 8 znaków.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną wielką literę.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną małą literę.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną cyfrę.');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jeden znak specjalny (@, $, !, %, *, ?, &).');
    }
		return { valid: errors.length === 0, message: errors };
	}

}
