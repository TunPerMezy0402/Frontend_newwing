import { create } from "zustand";
import { EMPTY_EMPLOYEE_DATA, EmployeeData } from "../types/employee";

interface EmployeeStore {
  employeeData: EmployeeData;
  newAddress: string;
  frontImagePreview: string | null;
  backImagePreview: string | null;
  isExtracting: boolean;
  isConverting: boolean;
  isConfirmed: boolean;

  setFrontImagePreview: (url: string | null) => void;
  setBackImagePreview: (url: string | null) => void;
  setIsExtracting: (v: boolean) => void;
  setIsConverting: (v: boolean) => void;
  setEmployeeData: (data: Partial<EmployeeData>) => void;
  setNewAddress: (addr: string) => void;
  confirmEmployeeData: () => void;
  clearSession: () => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employeeData: { ...EMPTY_EMPLOYEE_DATA },
  newAddress: "",
  frontImagePreview: null,
  backImagePreview: null,
  isExtracting: false,
  isConverting: false,
  isConfirmed: false,

  setFrontImagePreview: (url) => set({ frontImagePreview: url }),
  setBackImagePreview: (url) => set({ backImagePreview: url }),
  setIsExtracting: (v) => set({ isExtracting: v }),
  setIsConverting: (v) => set({ isConverting: v }),
  setEmployeeData: (data) =>
    set((state) => ({ employeeData: { ...state.employeeData, ...data } })),
  setNewAddress: (addr) => set({ newAddress: addr }),
  confirmEmployeeData: () => set({ isConfirmed: true }),

  // Xóa toàn bộ dữ liệu tạm thời trong phiên làm việc (nút [XÓA PHIÊN])
  clearSession: () =>
    set({
      employeeData: { ...EMPTY_EMPLOYEE_DATA },
      newAddress: "",
      frontImagePreview: null,
      backImagePreview: null,
      isExtracting: false,
      isConverting: false,
      isConfirmed: false,
    }),
}));
