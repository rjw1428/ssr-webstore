import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    // if (location.hostname === "localhost")
    //   return true
      
    const user = await this.firebaseAuth.auth.currentUser
    const isLoggedIn = !!user
    if (!isLoggedIn)
      this.router.navigate(['/','login'])

    return isLoggedIn
  }
  
}
