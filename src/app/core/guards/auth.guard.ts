import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
// import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
        //private authFackservice: AuthfakeauthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.tokenStorageService.getUser()) {
            return true;
        }

        //return true;
        // if (true) {
        //     const currentUser = this.authenticationService.currentUser();
        //     if (currentUser) {
        //         // logged in so return true
        //         return true;
        //     }
        // } 
        // // else {
        // //     const currentUser = this.authFackservice.currentUserValue;
        // //     if (currentUser) {
        // //         // logged in so return true
        // //         return true;
        // //     }
        // //     // check if user data is in storage is logged in via API.
        // //     if(localStorage.getItem('currentUser')) {
        // //         return true;
        // //     }
        // // }
        // // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
