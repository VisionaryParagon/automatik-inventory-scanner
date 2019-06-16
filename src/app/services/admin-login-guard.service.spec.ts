import { TestBed } from '@angular/core/testing';

import { AdminLoginGuardService } from './admin-login-guard.service';

describe('AdminLoginGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminLoginGuardService = TestBed.get(AdminLoginGuardService);
    expect(service).toBeTruthy();
  });
});
