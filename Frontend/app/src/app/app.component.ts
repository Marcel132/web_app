import { Component, Renderer2 } from '@angular/core';
import { AppModule } from '../modules/app.module';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { RouterModule } from '@angular/router';
import { TokenService } from '../services/token.service';
import { SubscriptionService } from '../services/subscription.service';
import { StateService } from '../services/state.service';

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
	],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';

	constructor(
		private tokenService: TokenService,
		private stateService: StateService,
		private subscriptionService: SubscriptionService,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		if(typeof window !== 'undefined'){
			const token = this.tokenService.getToken("token%auth")
			// Update value of token in BehaviorSubject
			if(!token){
				console.log("Refresh Token Checking... ")
				this.tokenService.refreshToken()
			}

			// When user has token in storage, add data to BehaviorSubject's to update the state
			if( token && !this.stateService.accessTokenSubject$){
				this.tokenService.setAccessToken(token)
				this.tokenService.setUserEmail()
				this.tokenService.setUserRole()
			}

			// Load custom font if it was set
			const customFontUrl = localStorage.getItem('customFontUrl')
			if(customFontUrl){
				this.loadFont(customFontUrl)
			}
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
}
