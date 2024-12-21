import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})


export class TransactionComponent{


  formData: any = {
    name: '',
    description: '',
    donationAmount: '',
    file: null,
    finale: ''
  };
  id:any;
  slug: any;
  showPopup?:boolean;
  isDisabled: boolean = false; // Le bouton est activé par défaut


  selectedFile: File | null = null;

  private apiUrl = 'http://localhost:8081/api/compagnes/create'; // compagnes

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  // Handle file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {


    if (isNaN(Number(this.formData.donationAmount)) || Number(this.formData.donationAmount) <= 0) {
      this.showPopupe('Veuillez entrer un montant valide.', false);
      return;
    }
    if (!this.selectedFile) {
      this.showPopupe("Veuillez choisir une image.", false);
      return;
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.isDisabled = true;
    // Préparation des données pour l'envoi
    const formData = new FormData();
    formData.append('titre', this.formData.name); // Correspond à @RequestParam("titre")
    formData.append('description', this.formData.description); // Correspond à @RequestParam("description")
    formData.append('Montant_necessaire', String(this.formData.donationAmount)); // Correspond à @RequestParam("Montant_necessaire") (Double attendu)
    formData.append('file', this.selectedFile as File); // Correspond à @RequestPart("file")
    formData.append('date_final', this.formData.finale); // Correspond à @RequestParam("date_final")
    formData.append('id_Auteur', String(this.id)); // Correspond à @RequestParam("id_Auteur") (Long attendu)
    // Envoi des données au backend
    this.http.post(this.apiUrl, formData).subscribe(
      (response) => {

        if ('slug' in response) {
          this.showPopup = true;
          this.slug = response.slug;

        }

      },
      (error) => {
        this.isDisabled = false ;

        console.error('Erreur lors de l\'envoi :', error);
        this.showPopupe('Une erreur est survenue.', false);
      }
    );
  }



  closePopup(): void {
    this.showPopup = false; // Cache le popup
    this.formData={};
  }


  isPopupVisible:any;
  popupMessage:any;
  isError:any;


  showPopupe(message: string, isError: boolean): void {
    this.popupMessage = message;
    this.isError = isError;
    this.isPopupVisible = true;
  }

  closePopupe(): void {
    this.isPopupVisible = false;
  }

}
