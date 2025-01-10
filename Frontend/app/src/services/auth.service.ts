import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'node:console';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private http: HttpClient,
	) { }


	login(accessToken: any, refreshToken: any): void
	{
		localStorage.setItem('accesToken', accessToken);
		sessionStorage.setItem('refreshToken', refreshToken);
	}

	logout(): void
	{
		localStorage.removeItem('accesToken');
		sessionStorage.removeItem('refreshToken');
	}

	checkRegisterData(login: string, password: string): { valid: boolean; message: string[]}
	{
		const errors: string[] = [];

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(login)) {
      errors.push('Nieprawidłowy format e-maila.');
    }

    // Sprawdzanie hasła
    else if (password.length < 8) {
      errors.push('Hasło musi mieć co najmniej 8 znaków. ');
    }
    else if (!/[A-Z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną wielką literę.');
    }
    else if (!/[a-z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną małą literę.');
    }
    else if (!/[0-9]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną cyfrę.');
    }
    else if (!/[@$!%*?&]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jeden znak specjalny (@, $, !, %, *, ?, &).');
    }
		return { valid: errors.length === 0, message: errors };
	}

	register(data: any)
	{
		const url = 'https://localhost:5000/api/v01/users/register';
		const body = {
			login: data.login,
			password: data.password
		}

		return this.http.post<{token: string}>(url, body).subscribe(
			response =>
			{
				this.setToken(response.token);
				return true;
			},
			error =>
			{
				return false
			}
		)
	}


	private setToken(token: string): void
	{
		sessionStorage.setItem('authToken', token);
	}
	getToken(): string | null
	{
		return sessionStorage.getItem('authToken');
	}


}
