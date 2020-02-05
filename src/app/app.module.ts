import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RoutingModule } from './routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { CaroselComponent } from './component/carousel/carosel.component';
import { QuotesComponent } from './component/quotes/quotes.component';
import { AboutComponent } from './component/about/about.component'
import { FooterComponent } from './component/footer/footer.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ItemComponent } from './component/item/item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SectionTitleComponent } from './component/section-title/section-title.component';
import { IgGalleryComponent } from './component/ig-gallery/ig-gallery.component';
import { MostPopularComponent } from './component/most-popular/most-popular.component';
import { QuoteComponent } from './component/quotes/quote/quote.component';
import { CurrencyPipe } from './pipes/currency.pipe';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about-page/about-page.component'
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataService } from './data.service';
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';
import { CompanyNamePipe } from './pipes/company-name.pipe';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransitionGroupItemDirective, TransitionGroupComponent } from './directives/transition-group-item.directive';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { EnterItemPopupComponent } from './component/item/enter-item-popup/enter-item-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ControlComponent } from './pages/control/control.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddQuoteComponent } from './component/quotes/add-quote/add-quote.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddItemPopupComponent } from './component/item/add-item-popup/add-item-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { PurchaseFormComponent } from './component/purchase-form/purchase-form.component';
import { OrdersComponent } from './pages/control/orders/orders.component';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { ConfirmPurchaseFormComponent } from './component/confirm-purchase-form/confirm-purchase-form.component';
import { SuccessPurchaseComponent } from './component/success-purchase/success-purchase.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ReversePipe } from './pipes/reverse.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CaroselComponent,
    QuotesComponent,
    AboutComponent,
    FooterComponent,
    ShopComponent,
    ItemComponent,
    SectionTitleComponent,
    IgGalleryComponent,
    MostPopularComponent,
    QuoteComponent,
    CurrencyPipe,
    InfoPageComponent,
    HomeComponent,
    AboutPageComponent,
    CompanyNamePipe,
    TransitionGroupItemDirective,
    TransitionGroupComponent,
    EnterItemPopupComponent,
    ControlComponent,
    CheckoutComponent,
    AddQuoteComponent,
    AddItemPopupComponent,
    PurchaseFormComponent,
    OrdersComponent,
    ConfirmPurchaseFormComponent,
    SuccessPurchaseComponent,
    ReversePipe,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatCardModule,
    DragDropModule,
    MatListModule,
    MatBadgeModule,
    MatProgressBarModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    EnterItemPopupComponent,
    AddQuoteComponent,
    AddItemPopupComponent,
    ConfirmPurchaseFormComponent
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
