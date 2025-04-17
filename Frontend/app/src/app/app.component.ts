import { Component, Renderer2 } from '@angular/core';
import { AppModule } from '../modules/app.module';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../services/token.service';
import { SubscriptionService } from '../services/subscription.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppModule,
		RouterModule
],
	providers: [
		AuthService,
		UserService,
		SubscriptionService,
		AdminService,
	],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';

	constructor(
		private tokenService: TokenService,
		private renderer: Renderer2,
		private router: Router,
	) {}

	ngOnInit(): void {

		if(!this.isBrowserEnvironment()){
			console.warn("Not in browser environment, skipping token check.");
			return;
		}

		const token = this.tokenService.getToken("token%auth")
		if(!token){
			console.log("Refresh Token Checking... ")
			this.router.navigate(['/home'])
		}
		else {
			const payload = this.tokenService.decodeToken(token)
			if(payload.exp > Date.now() / 1000){
				console.log("Token is valid, setting access token and user role.");
				this.tokenService.setAccessToken(token)
				this.tokenService.setUserEmail()
				this.tokenService.setUserRole()
				this.router.navigate(['/home'])
			} else {
				console.log("Token expired, refreshing token.");
				this.tokenService.refreshToken()
				this.router.navigate(['/home'])
			}
		}


		const appMode = localStorage.getItem("user%app_mode")
		if(!appMode){
			localStorage.setItem("user%app_mode", JSON.stringify({default: "light"}))
			document.body.classList.add("light")
		} else {
			const payload = JSON.parse(appMode)
			if(payload.default == "light"){
				document.body.classList.add('light')
				document.body.classList.remove('dark')
			}
			else if(payload.default == "dark"){
				document.body.classList.add('dark')
				document.body.classList.remove('light')
			}
		}

		const customFontUrl = localStorage.getItem('customFontUrl')
		if(customFontUrl){
			this.loadFont(customFontUrl)
		}

	}

	loadFont(url: string) {
    if (!this.isValidFontUrl(url)) {
			console.warn('Nieprawidłowy URL czcionki:', url);
			return;
    }

    // Usunięcie poprzedniego linku do czcionki, jeśli istnieje
    const existingLink = document.getElementById('customFont');
    if (existingLink) {
			existingLink.remove();
    }

    const linkElement = this.renderer.createElement('link');
    linkElement.id = 'customFont';
    linkElement.rel = 'stylesheet';
    linkElement.href = url;
    this.renderer.appendChild(document.head, linkElement);

    const fontName = this.extractName(url);
    if (fontName) {
			document.body.style.fontFamily = `'${fontName}', sans-serif`;
    }
	}

	isValidFontUrl(url: string): boolean {
    try {
			const parsedUrl = new URL(url);
			return parsedUrl.hostname.includes('fonts.googleapis.com');
    } catch {
			return false;
    }
	}

	extractName(url: string): string | null{
		const match = url.match(/family=([^:&]+)/)
		return match ? match[1].replace(/\+/g, ' ') : null
	}


 	isBrowserEnvironment(): boolean {
  	return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
	}

}
