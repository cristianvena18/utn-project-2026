import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  PHARMACY_ALERT_REPOSITORY,
  type PharmacyAlertRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class ListPharmacyAlertsUseCase {
  constructor(
    @Inject(PHARMACY_ALERT_REPOSITORY)
    private readonly alerts: PharmacyAlertRepository,
  ) {}
  execute() {
    return this.alerts.list();
  }
}
