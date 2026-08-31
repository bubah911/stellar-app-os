import { create } from 'zustand';

export type ProjectType = 'carbon-credit' | 'tree-planting' | null;

export type PaymentStatus = 'unpaid' | 'pending' | 'paid';

export interface ProjectData {
  // Step 1: Project Selection
  projectType: ProjectType;
  projectName: string;
  location: string;

  // Step 2: Project Parameters
  estimatedCredits: number;
  projectSize: number;
  projectDuration: number;
  pricePerCredit: number;

  // Step 4: Payment (Stellar)
  stellarWalletAddress: string;
  paymentTransactionHash: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number; // New field for the total amount in XLM
}

interface WizardState {
  currentStep: number;
  projectData: ProjectData;
  setCurrentStep: (step: number) => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  resetWizard: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialProjectData: ProjectData = {
  projectType: null,
  projectName: '',
  location: '',
  estimatedCredits: 0,
  projectSize: 0,
  projectDuration: 12,
  pricePerCredit: 15,
  stellarWalletAddress: '',
  paymentTransactionHash: '',
  paymentStatus: 'unpaid',
  paymentAmount: 0,
};

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  projectData: initialProjectData,
  setCurrentStep: (step) => set({ currentStep: step }),
  updateProjectData: (data) =>
    set((state) => {
      const mergedData = { ...state.projectData, ...data };
      // Recalculate payment amount when credits or price changes
      const recalc = data.estimatedCredits !== undefined || data.pricePerCredit !== undefined;
      if (recalc) {
        mergedData.paymentAmount = mergedData.estimatedCredits * mergedData.pricePerCredit;
      }
      return {
        projectData: mergedData,
      };
    }),
  resetWizard: () =>
    set({
      currentStep: 1,
      projectData: initialProjectData,
    }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
}));
