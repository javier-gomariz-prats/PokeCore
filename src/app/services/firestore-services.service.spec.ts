import { TestBed } from '@angular/core/testing';

import { FirestoreServicesService } from './firestore-services.service';

describe('FirestoreServicesService', () => {
  let service: FirestoreServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
