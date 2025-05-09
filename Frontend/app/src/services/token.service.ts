import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from '../env/env.route';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
		private http: HttpClient,
		private route: Router,
		private stateService: StateService,
	) {
		if(typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'){
			const token = this.getToken("token%auth")
			if(token){
				this.setAccessToken(token)
				this.setUserEmail()
				this.setUserRole()
			}
		}
	}

	setAccessToken(token: string): {state: boolean, message: string} {
		this.stateService.setAccessToken(token)
		this.stateService.accessTokenSubject$.subscribe(response => {
			if(response){
				try {
					return { state: true, message: "Access token set" };
				} catch (error) {
					return { state: false, message: `Error: Failed to set token in BehaviorSubject \n ${error}` };
				}
			}
			return { state: false, message: "Error: BS is not work"}
		})
		return { state: false, message: "Error: Function is not work"}

	}

	setUserRole() {
		this.stateService.accessTokenSubject$.subscribe((accessToken) => {
			if(accessToken){
				try {
					const payload = this.decodeToken(accessToken)
					this.stateService.setUserRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
					return { state: true, message: " Role BS set" };
				} catch (error) {
					console.error(error)
					return { state: false, message: ` Error: Failed to set token in BehaviorSubject. \n ${error} ` };
				}
			}
			return { state: false, message: " Error: Failed to set token in BehaviorSubject. accessToken doesn't exists" };
		})
	}

	setUserEmail() {

		this.stateService.accessTokenSubject$.subscribe((accessToken) => {
			if(accessToken){
				try {
					const payload = this.decodeToken(accessToken)
					this.stateService.setUserEmail(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"])
					return { state: true, message: " Email BS set" };
				} catch (error) {
					console.error(error)
					return { state: false, message: ` Error: Failed to set token in BehaviorSubject. \n ${error}` };
				}
			} else {
				return { state: false, message: " Error: Failed to set token in BehaviorSubject. accessToken doesn't exists" };
			}
		})
	}
	saveToken(key: string, value: any){
		const isRememberMe = this.storageValidation("user%settings")

		if(isRememberMe.rememberMe){
			localStorage.setItem(key, value)
		} else {
			sessionStorage.setItem(key, value)
		}
	}

	getToken(key: string){
		const isRememberMe = this.storageValidation("user%settings")

		if(!isRememberMe){
			return localStorage.setItem("user%settings", JSON.stringify({
				theme: 'light',
				rememberMe: false,
				defaultFontSize: 16,
			}))
		} else {
			if(isRememberMe.rememberMe){
				return localStorage.getItem(key)
			} else {
				return sessionStorage.getItem(key)
			}
		}
	}

	clearToken(key: any){
		sessionStorage.removeItem(key)
		localStorage.removeItem(key)
	}

	// // For refreshing a token
	refreshToken(): void {
		if(window){
			this.stateService.accessTokenSubject$.subscribe((accessToken => {
				if(accessToken){
					const payload = this.decodeToken(accessToken)
					const expire = payload.exp
					const currentTime = Math.floor(Date.now() / 1000)

					if(expire < currentTime){
						console.log("Twój token wygasł")
						const url = apiUrl.refresh
						const body = {
							accessToken: accessToken
						}
						this.http.post<{accessToken: string}>(url, body , {withCredentials: true})
						.subscribe(response => {
							this.saveToken("token%auth", response.accessToken)
							this.stateService.setAccessToken(response.accessToken)
						})
						console.log("Token odświeżony")
					} else {
						console.log("Twój token jest aktualny")
					}

				} else {
					const token = this.getToken("token%auth")
				}
			}))
		}

	}


	// 	//For decodeing a token
	decodeToken(token: string): any {
		if(token == null) {
			console.log("Token is null")
			return null
		}
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = atob(base64)
		return JSON.parse(jsonPayload)
	}

	private storageValidation(key: string){
		if(key){
			const locStorage = localStorage.getItem(key)
			const sessStorage = sessionStorage.getItem(key)

			if(locStorage){
				return JSON.parse(locStorage);
			}
			else if(sessStorage)
				return JSON.parse(sessStorage);

		} else {
			console.log("There is no key")
			return false
		}
	}

}
