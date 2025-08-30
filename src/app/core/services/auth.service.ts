import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponeModel } from '../../store/authentication/auth.models';
import { map, Observable } from 'rxjs';
import { TransferHttpService } from '../transfer-http/transfer-http.service';
import { LinkSettings } from '../../library/linkseting/LinkSetting';
import { RepositoryModel } from '../../models/models/repository_base';
import { LoginRequestModel } from '../../models/models/user/login-request.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private transferHttp: TransferHttpService
  ) { }

  // login(username: string, password: string): Observable<LoginResponeModel> {
  //   return this.http.post<LoginResponeModel>(this.api, { username, password });
  // }

  loginNormalAccount(loginRequestModel: LoginRequestModel) {
    const ApiUrl = LinkSettings.GetResLinkSetting('Authentication', 'LoginNormalAccount');
    return this.transferHttp.post(ApiUrl, loginRequestModel).pipe(map((res: RepositoryModel<LoginResponeModel>) => res));
  }

  currentUser() {
    return ;
  }
}
