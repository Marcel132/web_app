import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
		CommonModule,
	],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit{
deleteAccount() {
throw new Error('Method not implemented.');
}

	constructor(
		private userService: UserService
	) {}
	settings = {
		isDarkMode: false,
		isRememberMe: false,
		defaultFontSize: 16,
	}

	ngOnInit(): void {
		const userSettings = localStorage.getItem("user%settings")
		if (!userSettings) {
			this.userService.updateUserSettings({theme: "light"})
			this.settings.isDarkMode = false;
			this.settings.isRememberMe = false;
			this.settings.defaultFontSize = 16;
		} else {
			try {
				const payload = JSON.parse(userSettings);
				this.settings.isDarkMode = payload.theme === "dark";
				this.settings.isRememberMe = payload.rememberMe === true
				this.settings.defaultFontSize = payload.defaultFontSize || 16;
				this.applyTheme(this.settings.isDarkMode);
			} catch (error) {
				console.error("Błąd podczas parsowania danych z localStorage:", error);
				this.settings.isDarkMode = false;
				this.settings.isRememberMe = false;
			}
		}
	}

	toggleTheme(event: Event) {
		console.log("works")
		const target = event.target as HTMLInputElement;
		if (target) {
			this.settings.isDarkMode = target.checked;
			this.userService.updateUserSettings({theme: this.settings.isDarkMode ? "dark" : "light"})
			this.applyTheme(this.settings.isDarkMode);
		} else {
			console.error("Nie można odczytać stanu checkboxa.");
		}
	}

	applyTheme(isDark: boolean) {
		const body = document.body;
		if (isDark) {
			body.classList.add('dark');
		} else {
			body.classList.remove('dark');
		}
	}

	rememberMe(event: Event){
		const target = event.target as HTMLInputElement;
		if(target){
			this.settings.isRememberMe = target.checked
			this.userService.updateUserSettings({rememberMe: this.settings.isRememberMe ? true : false})
			if(this.settings.isRememberMe === true){
				this.changeStorageRef("token%auth")
			} else if(this.settings.isRememberMe === false){
				this.changeStorageRef("token%auth")
			}
		}
	}

	applyFontSize(event: Event) {
		console.log("works")
		const target = event.target as HTMLInputElement;
		if (target) {
			this.settings.defaultFontSize = parseInt(target.value, 10);
			console.log(this.settings.defaultFontSize)
			this.userService.updateUserSettings({defaultFontSize: this.settings.defaultFontSize})
			document.body.style.fontSize = `${this.settings.defaultFontSize}px`;
		} else {
			console.error("Nie można odczytać wartości inputa.");
		}
	}

	private changeStorageRef(storage: string){
		const sessionToken = sessionStorage.getItem(storage)
		const localToken = localStorage.getItem(storage)

		console.group("Tokeny: ")
		console.log("Local: ", localToken)
		console.log("Session: ", sessionToken)
		console.groupCollapsed()

		if(localToken) {
			sessionStorage.setItem(storage, localToken)
			localStorage.removeItem(storage)
		} else if(sessionToken){
			localStorage.setItem(storage, sessionToken)
			sessionStorage.removeItem(storage)
		}

	}

}
