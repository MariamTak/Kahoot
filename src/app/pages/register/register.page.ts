import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth';
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonRow,
  IonCol,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  template: ` <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Register</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-input
        formControlName="email"
        fill="solid"
        label="Email"
        labelPlacement="floating"
        placeholder="user@gmail.com"
        type="email"
        [errorText]="invalidEmailText"
      ></ion-input>
      <ion-input
        formControlName="alias"
        fill="solid"
        label="Alias"
        labelPlacement="floating"
        placeholder="enter your alias"
        type="text"
        [errorText]="invalidAliasText"
      ></ion-input>
      <ion-input
        formControlName="password"
        fill="solid"
        label="Password"
        labelPlacement="floating"
        minlength="6"
        [errorText]="invalidPasswordText"
      ></ion-input>

      <ion-input
        formControlName="passwordConfirm"
        fill="solid"
        label="Password Confirmation"
        labelPlacement="floating"
        errorText="Does not match password"
      ></ion-input>

      <ion-button [disabled]="registerForm.invalid" expand="block" type="submit"
        >Register</ion-button>
        <ion-row>
            <ion-col>
              <ion-button
                expand="block"
                fill="outline"
                type="button"
                (click)="registerWithGoogle()"
                >Register with Google
                <ion-icon
                  [style.margin-left.rem]="0.25"
                  name="logo-google"
                ></ion-icon
              ></ion-button>
            </ion-col>
          </ion-row>
    </ion-content>
  </form>`,
  imports: [
    IonButton,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonRow,
    IonCol,
    IonIcon,
    IonInput,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  invalidEmailText = 'Not a valid email';
  invalidAliasText = 'Alias is required';
  invalidPasswordText = 'Password should have at least 6 characters';
  invalidPasswordConfirmText = 'Does not match password';

  registerForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    alias: ['', [Validators.required]],
    password: ['', Validators.minLength(6)],
    passwordConfirm: ['', passwordConfirmMatchPasswordValidator()],
  });

  onSubmit() {
    const { email, password, alias } = this.registerForm.value;
    this.authService.register(email!, password!, alias!);
  }

registerWithGoogle() {
  this.authService.signInWithGoogle(); 
}
}

export function passwordConfirmMatchPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controls = control.parent?.controls as {
      [key: string]: AbstractControl | null;
    };

    const password = controls ? controls['password']?.value : null;
    const passwordConfirm = control?.value;

    return passwordConfirm === password
      ? null
      : { passwordConfirmMissmatch: true };
  };

  
}