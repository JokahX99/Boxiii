import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public hasError: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {}

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError = true;
      this.presentToast('Por favor completa todos los campos correctamente.');
      setTimeout(() => {
        this.hasError = false;
      }, 2000);
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(
      (isAuthenticated) => {
        this.isLoading = false;

        if (isAuthenticated) {
          this.presentToast('Inicio de sesión exitoso.');
          this.router.navigateByUrl('/principal');
        } else {
          this.hasError = true;
          this.presentToast('Credenciales inválidas.');
          setTimeout(() => {
            this.hasError = false;
          }, 2000);
        }
      },
      (error) => {
        this.isLoading = false;
        this.presentToast('Ocurrió un error al iniciar sesión.');
        console.error(error);
      }
    );
  }

  Register() {
    this.router.navigate(['/register']);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'primary',
    });
    toast.present();
  }
}
