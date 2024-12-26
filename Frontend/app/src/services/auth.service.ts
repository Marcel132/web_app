import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private http: HttpClient,
	) { }

	private isLogged?: boolean

	isUserLogged(): boolean
	{
		return this.isLogged || false;
	}

	login(accessToken: any, refreshToken: any): void
	{
		localStorage.setItem('accesToken', accessToken);
		sessionStorage.setItem('refreshToken', refreshToken);

		this.isLogged = true;
	}

	logout(): void
	{
		localStorage.removeItem('accesToken');
		sessionStorage.removeItem('refreshToken');
		this.isLogged = false;
	}

	checkRegisterData(login: string, password: string): { valid: boolean; message: string[]}
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

	saveDataToDatabase(data: any)
	{
		const url = 'http://localhost:3000/v01/register';
		const body = {
			login: data.login,
			password: data.password
		}

		return this.http.post<any>(url, body).pipe(
			map((response) => {
				if(response.status === 200 || response.status === 201){
					this.login(response.accessToken, response.refreshToken);
					return { valid: true, message: ['Rejestracja przebiegła pomyślnie.'] }
				}
				else return { valid: false, message: ['Rejestracja nie powiodła się.'] }
			})
		)

	}


}
