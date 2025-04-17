import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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

	constructor() {}
	isDarkMode: boolean = false;

	ngOnInit(): void {
		const appMode = localStorage.getItem("user%app_mode");
		console.log("Pobrany tryb z localStorage:", appMode);
		if (!appMode) {
			localStorage.setItem("user%app_mode", JSON.stringify({ default: "light" }));
			this.isDarkMode = false;
		} else {
			try {
				const payload = JSON.parse(appMode);
				this.isDarkMode = payload.default === "dark";
				this.applyTheme(this.isDarkMode);
			} catch (error) {
				console.error("Błąd podczas parsowania danych z localStorage:", error);
				this.isDarkMode = false;
			}
		}
	}

	toggleTheme(event: Event) {
		console.log("works")
		const target = event.target as HTMLInputElement;
		if (target) {
			this.isDarkMode = target.checked;
			localStorage.setItem("user%app_mode", JSON.stringify({
				default: this.isDarkMode ? "dark" : "light"
			}));
			this.applyTheme(this.isDarkMode);
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

}
