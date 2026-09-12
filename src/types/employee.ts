export interface EmployeeData {
  fullName: string;
  identityNumber: string;
  dateOfBirth: string;
  dateOfIssue: string;
  gender: string;
  oldAddress: string;
  nationality?: string;
  placeOfOrigin?: string;
}

export const EMPTY_EMPLOYEE_DATA: EmployeeData = {
  fullName: "",
  identityNumber: "",
  dateOfBirth: "",
  dateOfIssue: "",
  gender: "",
  oldAddress: "",
  nationality: "",
  placeOfOrigin: "",
};
