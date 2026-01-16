
export interface PatientInfo {
  medistId: string;
  firstName: string;
  lastName: string;
  dob: string;
  bloodType: string;
  gender: string;
  nationality: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Lab Report' | 'Prescription' | 'Imaging' | 'Vaccination';
  title: string;
  provider: string;
  summary: string;
  severity: 'Normal' | 'Critical' | 'Warning';
}

export interface VitalSign {
  timestamp: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  spo2: number;
}
