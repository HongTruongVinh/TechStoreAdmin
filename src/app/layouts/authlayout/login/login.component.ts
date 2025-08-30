import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from '../../../store/authentication/auth.actions';
import { selectAuthAdmin, selectAuthLoading, selectAuthError } from '../../../store/authentication/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '../../../core/services/auth.service';
import { LoginRequestModel } from '../../../models/models/user/login-request.model';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // admin = toSignal(this.store.select(selectAuthAdmin), { initialValue: null });
  // loading = toSignal(this.store.select(selectAuthLoading), { initialValue: false });
  // error = toSignal(this.store.select(selectAuthError), { initialValue: null });

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  a: any = 10;
  b: any = 20;
  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private store: Store,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin@gmail.com', [Validators.required, Validators.email]],
      password: ['1', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    const email = this.f['email'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form

    const LoginRequest: LoginRequestModel = {
      loginIdentifier: email,
      password: password
    };

    this.authenticationService.loginNormalAccount(LoginRequest).subscribe((res) => {
      if (res.retCode == 0) {
        const data = res.data;
        if (data) {
          this.tokenStorageService.saveUser(data.user);
          this.tokenStorageService.saveToken(data.token);
          this.router.navigate(['']);
        }
      }
    })
    // Login Api
    //this.store.dispatch(login({ email: email, password: password }));
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
