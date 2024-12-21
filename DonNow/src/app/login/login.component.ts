import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:8081/api/users/login', credentials).subscribe(
      (response: any) => {
        // Sauvegarder le token dans localStorage
        const token = response.token;
        const userId = response.id;

        localStorage.setItem('jwtToken', token);
        // Redirection vers le profil avec l'id de l'utilisateur
        this.router.navigate([`/Profiles/${userId}`]);
      },
      (error) => {
        console.error('Erreur renvoyée par le backend :', error);
        if (error.status === 404) {
          this.errorMessage = 'Email introuvable.';
          this.showPopup('Email introuvable', false);
        } else if (error.status === 401) {
          this.errorMessage = 'Mot de passe incorrect.';
          this.showPopup('Mot de passe incorrect.', false);
        } else {
          this.errorMessage = `Une erreur est survenue : ${error.message}`;
          this.showPopup(`Erreur : ${error.message}`, false);

        }
      }
    );
  }

  isPopupVisible:any;
  popupMessage:any;
  isError:any;



  showPopup(message: string, isError: boolean): void {
    this.popupMessage = message;
    this.isError = isError;
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }


}
