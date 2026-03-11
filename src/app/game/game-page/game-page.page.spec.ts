import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePagePage } from './game-page.page';

describe('GamePagePage', () => {
  let component: GamePagePage;
  let fixture: ComponentFixture<GamePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
