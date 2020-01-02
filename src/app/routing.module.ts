import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ControlComponent } from './pages/control/control.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [
  { path:  'info/:page', component:  InfoPageComponent},
  { path:  'info/:page', component:  InfoPageComponent},
  { path:  'shop', component:  ShopComponent},
  { path:  'about', component:  AboutPageComponent},
  { path:  'checkout', component:  CheckoutComponent},

  { path: 'admin', component: ControlComponent},
  { path:  '', component:  HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
