import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  PopoverController,
} from '@ionic/angular/standalone';
import { GetDateTimeFormComponent } from '../get-date-time-form/get-date-time-form.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private popoverController: PopoverController) {}

  protected async showForm(ev: any): Promise<void> {
    try {
      const popover = await this.popoverController.create({
        component: GetDateTimeFormComponent,        
        translucent: false,
        backdropDismiss: true,
        event: ev,
      });

      await popover.present();
      const onDidDismissResult = await popover.onDidDismiss();
    } catch (error) {
      console.error(`Error in showForm: ${error}`);
    }
  }
}

