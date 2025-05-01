import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../../pipes/translate.pipe';
import { BooleanHandlerPipe } from '../../../../../pipes/boolean-handler.pipe';
import { SubscriptionInterface } from '../../../../../interfaces/subscription';
import { SubscriptionService } from '../../../../../services/subscription.service';
import { StateService } from '../../../../../services/state.service';

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslatePipe,
    BooleanHandlerPipe,
],
  templateUrl: './account-dashboard.component.html',
  styleUrl: './account-dashboard.component.scss'
})
export class AccountDashboardComponent implements OnInit {

	constructor(
		private stateService: StateService,
		private route: Router,
		private cdr: ChangeDetectorRef,
	) {	}

	customFontUrl: string =''
	isLogged: boolean = false
	user = {
		email: '',
		role: '',
	}
	userDetails = {
		sex: 'Nie podano',
		age: 0,
		height: 0,
		weight: 0,
		pal: 0,
	}
	package!: SubscriptionInterface | null

	validationInfo = {
		fontValid: true,
		fontError: ''
	}


	updateDataList = {
		sex: null,
		age: null,
		height: null,
		weight: null,
	}

	formatDate: {purchaseDate: string, expireDate: string} = {
		purchaseDate: 'dd/MM/yyyy | HH:mm:ss',
		expireDate: 'dd/MM/yyyy | HH:mm:ss'
	}

	handlerErrorMessage = {
		sex: '',
		age: '',
		height: '',
		weight: ''
	}
	handlerList = {
		editSex: false,
		editWeight: false,
		editHeight: false,
		editAge: false
	}

	ngOnInit(): void {
		this.stateService.userEmailSubject$.subscribe((email) => {
			this.user.email = email
		})

		this.stateService.userRoleSubject$.subscribe((role) => {
			this.user.role = role
		})
		this.stateService.subscriptionDetailsSubject$.subscribe((details) => {
			this.package = details
		})

		this.stateService.userEmailSubject$.subscribe((email) => {
			if(email){
				this.isLogged = true
			}
		})

		if(typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
			const customFontUrl = localStorage.getItem('customFontUrl')
			const userDetails = localStorage.getItem("user%package_body_details")
			if(userDetails){
				const parseData = JSON.parse(userDetails)
				// body {sex: string | null, age: number, weight: number, height: number}
				this.userDetails.sex = parseData.sex
				this.userDetails.age = parseData.age
				this.userDetails.height = parseData.height
				this.userDetails.weight = parseData.weight
			}
		}
	}

	updateDetailsValue(select: string) {
		const storage = localStorage.getItem("user%package_body_details")
		if(storage){
			const storageParse = JSON.parse(storage)
			switch(select){
				case 'sex':
					if(this.updateDataList.sex == null || this.updateDataList.sex == ''){
						this.handlerErrorMessage.sex = "Musisz wybrać płeć"
						break;
					} else {
						storageParse.sex = this.updateDataList.sex
						this.userDetails.sex = this.updateDataList.sex
						this.toggleEditMode('sex')
					}
				break;
				case 'age':
					if(this.updateDataList.age == null ||this.updateDataList.age <= 0){
						this.handlerErrorMessage.age = "Wiek musi być większy niż 0"
						break
					} else {
						storageParse.age = this.updateDataList.age
						this.userDetails.age = this.updateDataList.age
						this.toggleEditMode('age')

					}
				break;
				case 'height':
					if(this.updateDataList.height == null ||this.updateDataList.height <= 0){
						this.handlerErrorMessage.height = "Wzrost musi być większy niż 0"
						break
					} else {
						storageParse.height = this.updateDataList.height
						this.userDetails.height = this.updateDataList.height
						this.toggleEditMode('height')
					}
				break;
				case 'weight':
					if(this.updateDataList.weight == null ||this.updateDataList.weight <= 0){
						this.handlerErrorMessage.weight = "Waga musi być większa niż 0"
						break
					} else {
						storageParse.weight = this.updateDataList.weight
						this.userDetails.weight = this.updateDataList.weight
						this.toggleEditMode('weight')
					}
				break;
				default:
					this.cdr.detectChanges()
				break;
			}
			const storageString = JSON.stringify(storageParse)
			localStorage.setItem("user%package_body_details", storageString)
		}
		else {
			const body = {
				sex: 'Nie podano',
				age: 0,
				weight: 0,
				height: 0,
				pal: 0
			}
			switch(select){
				case 'sex':
					if(this.updateDataList.sex == null || this.updateDataList.sex == ''){
						this.handlerErrorMessage.sex = "Musisz wybrać płeć"
						break;
					} else {
						body.sex = this.updateDataList.sex;
						this.userDetails.sex = this.updateDataList.sex
						this.toggleEditMode('sex')
					}
				break;
				case 'age':
					if(this.updateDataList.age == null || this.updateDataList.age <= 0){
						this.handlerErrorMessage.age = "Wiek musi być większy niż 0"
						break
					} else {
						body.age = this.updateDataList.age
						this.userDetails.age = this.updateDataList.age
						this.toggleEditMode('age')
					}
				break;
				case 'height':
					if(this.updateDataList.height == null ||this.updateDataList.height <= 0){
						this.handlerErrorMessage.height = "Wzrost musi być większy niż 0"
						break
					} else {
						body.height = this.updateDataList.height
						this.userDetails.height = this.updateDataList.height
						this.toggleEditMode('height')
					}
				break;
				case 'weight':
					if(this.updateDataList.weight == null ||this.updateDataList.weight <= 0){
						this.handlerErrorMessage.weight = "Waga musi być większa niż 0"
						break
					} else {

						body.weight = this.updateDataList.weight
						this.userDetails.weight = this.updateDataList.weight
						this.toggleEditMode('weight')
					}
				break;
				default:
					this.cdr.detectChanges()
					break;
			}
			localStorage.setItem("user%package_body_details", JSON.stringify(body))
		}

	}

	deleteUserDetails(){
		this.userDetails = { sex: 'Nie podano', age: 0, height: 0, weight: 0, pal: 0}
		this.cdr.detectChanges()
		localStorage.removeItem("user%package_body_details")
	}



	saveFont() {
		if (this.validFontUrl(this.customFontUrl.trim())) {
			localStorage.setItem('customFontUrl', this.customFontUrl);
      alert('Font zapisany! Odśwież stronę, aby zobaczyć efekt.');
    }
  }

	validFontUrl(url: string) : boolean{
		if(url == ''){
			this.validationInfo.fontError = 'URL nie może być pusty'
			this.validationInfo.fontValid = false
			return false
		}
		else if(!url.includes("https://fonts.googleapis.com/")){
			this.validationInfo.fontError = 'Czcionka nie pochodzi z Google Fonts'
			this.validationInfo.fontValid = false
			return false
		}
		else if(url.includes("https://fonts.googleapis.com/")){
			this.validationInfo.fontError = ''
			this.validationInfo.fontValid = true
			return true
		}
		else {
			this.validationInfo.fontError = 'Nieprawidłowy URL czcionki'
			this.validationInfo.fontValid = false
			return false
		}

	}

	buyPremium(){
		this.route.navigate(['/buy-premium'])
	}

	toggleEditMode(select: string){
		this.handlerErrorMessage = {sex: '', age: '', height: '', weight: ''}
		this.updateDataList = {sex: null, age: null, height: null, weight: null}
		this.handlerList = {editSex: false, editAge: false, editHeight: false, editWeight: false}
		switch(select) {
			case "sex":
				this.handlerList.editSex = !this.handlerList.editSex
				break;
			case "age":
				this.handlerList.editAge = !this.handlerList.editAge
				break;
			case "height":
				this.handlerList.editHeight = !this.handlerList.editHeight
				break;
			case "weight":
				this.handlerList.editWeight = !this.handlerList.editWeight
				break;
		}
	}

	changeFormatDate(index: number){
		if(index === 0){
			this.formatDate.purchaseDate = this.formatDate.purchaseDate === 'dd/MM/yyyy | HH:mm:ss'
			? 'dd/MM/yyyy | hh:mm:ss a'
			: 'dd/MM/yyyy | HH:mm:ss'
		}
		else if(index === 1){
			this.formatDate.expireDate = this.formatDate.expireDate === 'dd/MM/yyyy | HH:mm:ss'
			? 'dd/MM/yyyy | hh:mm:ss a'
			: 'dd/MM/yyyy | HH:mm:ss'
		}
	}
}
