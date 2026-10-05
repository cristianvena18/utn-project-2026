import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { InsuranceType } from '../../modules/admissions/domain/patient';
import { PatientOrmEntity } from '../../modules/admissions/infrastructure/persistence/patient.orm-entity';
import { Role } from '../../modules/iam/domain/role';
import { UserOrmEntity } from '../../modules/iam/infrastructure/persistence/user.orm-entity';
import { BedStatus } from '../../modules/resources/domain/bed';
import { BedOrmEntity } from '../../modules/resources/infrastructure/persistence/bed.orm-entity';
import { SupplyOrmEntity } from '../../modules/resources/infrastructure/persistence/supply.orm-entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(PatientOrmEntity)
    private readonly patients: Repository<PatientOrmEntity>,
    @InjectRepository(BedOrmEntity)
    private readonly beds: Repository<BedOrmEntity>,
    @InjectRepository(SupplyOrmEntity)
    private readonly supplies: Repository<SupplyOrmEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedUsers();
    await this.seedPatients();
    await this.seedBeds();
    await this.seedSupplies();
  }

  private async seedUsers(): Promise<void> {
    if ((await this.users.count()) > 0) {
      return;
    }
    const demo = [
      {
        email: 'admin@hospital.local',
        name: 'Administrator',
        role: Role.ADMINISTRATOR,
        password: 'Admin123!',
      },
      {
        email: 'doctor@hospital.local',
        name: 'Dr. Perez',
        role: Role.DOCTOR,
        password: 'Doctor123!',
      },
      {
        email: 'nurse@hospital.local',
        name: 'Nurse Ruiz',
        role: Role.NURSE,
        password: 'Nurse123!',
      },
      {
        email: 'reception@hospital.local',
        name: 'Reception',
        role: Role.RECEPTIONIST,
        password: 'Reception123!',
      },
      {
        email: 'patient@hospital.local',
        name: 'Laura Gómez',
        role: Role.PATIENT,
        password: 'Patient123!',
      },
    ];
    for (const item of demo) {
      await this.users.save(
        this.users.create({
          email: item.email,
          name: item.name,
          role: item.role,
          passwordHash: await hash(item.password, 10),
        }),
      );
    }
    this.logger.log('Demo users created');
  }

  private async seedPatients(): Promise<void> {
    if ((await this.patients.count()) > 0) {
      return;
    }
    const patientUser = await this.users.findOne({
      where: { email: 'patient@hospital.local' },
    });
    await this.patients.save(
      this.patients.create({
        nationalId: '30111222',
        firstName: 'Laura',
        lastName: 'Gómez',
        birthDate: '1992-06-15',
        insuranceType: InsuranceType.PRIVATE,
        insuranceName: 'OSDE',
        userId: patientUser?.id ?? null,
      }),
    );
  }

  private async seedBeds(): Promise<void> {
    if ((await this.beds.count()) > 0) {
      return;
    }
    await this.beds.save(
      this.beds.create({
        code: '101',
        status: BedStatus.AVAILABLE,
        patientId: null,
        blockReason: null,
      }),
    );
  }

  private async seedSupplies(): Promise<void> {
    if ((await this.supplies.count()) > 0) {
      return;
    }
    await this.supplies.save([
      this.supplies.create({ name: 'Gauze', stock: 100, unit: 'u' }),
      this.supplies.create({ name: 'Syringes', stock: 80, unit: 'u' }),
      this.supplies.create({ name: 'Saline', stock: 40, unit: 'bag' }),
    ]);
  }
}
