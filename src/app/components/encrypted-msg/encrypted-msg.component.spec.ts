import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptedMsgComponent } from './encrypted-msg.component';

describe('EncryptedMsgComponent', () => {
  let component: EncryptedMsgComponent;
  let fixture: ComponentFixture<EncryptedMsgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncryptedMsgComponent]
    });
    fixture = TestBed.createComponent(EncryptedMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
