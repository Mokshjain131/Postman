import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAnalyticsComponent } from './api-analytics.component';

describe('ApiAnalyticsComponent', () => {
  let component: ApiAnalyticsComponent;
  let fixture: ComponentFixture<ApiAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
