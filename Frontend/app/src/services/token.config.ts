import { BehaviorSubject, Observable } from "rxjs";

const tokenSubject = new BehaviorSubject<string | null>(null);

export const tokenConfig = () => {

	function setToken(token: string): void {
		tokenSubject.next(token);
	}

	function getToken(): Observable<string | null> {
		console.log(tokenSubject.asObservable())
		return tokenSubject.asObservable();
	}

	function getTokenValue(): string | null {
		return tokenSubject.value;
	}

	function clearToken(): void {
		tokenSubject.next(null);
	}


	return {
		setToken,
		getToken,
		getTokenValue,
		clearToken
	}


}
