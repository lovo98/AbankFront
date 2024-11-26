import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  employee: any[] = [];
  loading: boolean = false;
  loadingActions: boolean = false;
  isVisibleMiddle: boolean = false;
  isVisibleEdit = false;
  validateForm = this.fb.group({
    nombres: this.fb.control('', [Validators.required]),
    apellidos: this.fb.control('', [Validators.required]),
    telefono: this.fb.control('', [Validators.required]),
    correo: this.fb.control('', [Validators.required]),
    idArea: this.fb.control(0, [Validators.required]),
    fechaCreacion: this.fb.control(''),
  });

  validateFormEdit = this.fb.group({
    nombres: this.fb.control('', [Validators.required]),
    apellidos: this.fb.control('', [Validators.required]),
    telefono: this.fb.control('', [Validators.required]),
    correo: this.fb.control('', [Validators.required]),
    idArea: this.fb.control(0, [Validators.required]),
    fechaCreacion: this.fb.control(''),
    fechaModificacion: this.fb.control(''),
    id: this.fb.control(''),
  });

  constructor(
    private dashboardService: DashboardService,
    private fb: NonNullableFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  // ptecion listado de empleados
  getAllEmployees = () => {
    this.loading = true;
    this.dashboardService.getData().subscribe(
      (response) => {
        this.loading = false;
        this.employee = response;
      },
      (error) => {
        console.error('Error al obtener los datos', error);
        this.loading = false;
      }
    );
  };

  // abrir modal para agregar un empleado
  showModalMiddle(status: boolean): void {
    this.isVisibleMiddle = status;
    if (!status) {
      this.validateForm.reset();
    }
  }

  // Abrir modal para editar y asignat valores al formulario
  showModalMiddleEdit(status: boolean, item: any): void {
    this.isVisibleEdit = status;
    if (item) {
      const employeeToForm = {
        ...item,
        idArea: item.idArea.toString(),
        id: item.id,
      };
      this.validateFormEdit.patchValue(employeeToForm);
    }

    if (!status) {
      this.validateFormEdit.reset();
    }
  }

  // Manejar la adición de un nuevo empleado
  handleAddEmployee(): void {
    if (this.validateForm.valid) {
      this.loadingActions = true;
      const formData = { ...this.validateForm.value };
      if (formData.idArea) {
        formData.idArea = +formData.idArea;
      }
      formData.fechaCreacion = new Date().toISOString();

      this.dashboardService.addEmployee(formData).subscribe(
        (response) => {
          this.loadingActions = false;
          this.showModalMiddle(false);
          this.getAllEmployees();
        },
        (error) => {
          if (error.status === 200) {
            this.loadingActions = false;
            this.showModalMiddle(false);
            this.getAllEmployees();
          } else {
            this.loadingActions = false;
            console.log('Ocurrio un error al crear');
          }
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // Manejar la edición de un empleado
  handleEditEmployee(): void {
    if (this.validateFormEdit.valid) {
      this.loadingActions = true;
      const formData = { ...this.validateFormEdit.value };
      if (formData.idArea) {
        formData.idArea = +formData.idArea;
      }
      formData.fechaModificacion = new Date().toISOString();

      this.dashboardService.editEmployee(formData).subscribe(
        (response) => {
          this.loadingActions = false;
          this.showModalMiddleEdit(false, null);
          this.getAllEmployees();
        },
        (error) => {
          if (error.status === 200) {
            this.loadingActions = false;
            this.showModalMiddleEdit(false, null);
            this.getAllEmployees();
          } else {
            this.loadingActions = false;
            console.log('Ocurrio un error al editar');
          }
        }
      );
    } else {
      Object.values(this.validateFormEdit.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // cerrar sesion
  logout = () => {
    localStorage.clear();
    this.router.navigate(['/']);
  };
}
