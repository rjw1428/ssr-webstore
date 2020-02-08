import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ControlComponent } from './pages/control/control.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SuccessPurchaseComponent } from './component/success-purchase/success-purchase.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: NavbarComponent, canActivate: [AuthGuard], children: [
    { path: '', component: ControlComponent, canActivate: [AuthGuard] },
  ] },
  { path: '', component: NavbarComponent, children: [
      { path: 'info/:page', component: InfoPageComponent },
      { path: 'info/:page', component: InfoPageComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'about', component: AboutPageComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'success', component: SuccessPurchaseComponent },
      { path: '', component: HomeComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
