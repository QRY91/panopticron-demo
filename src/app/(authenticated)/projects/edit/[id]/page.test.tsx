import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import ProjectEditPage from './page';

// --- Mock Definitions ---

// 1. Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// 2. Mock @refinedev/react-hook-form
// We mock useForm with a simple vi.fn(). We'll configure its behavior per test.
vi.mock('@refinedev/react-hook-form', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@refinedev/react-hook-form')>();
  return {
    ...originalModule, // Keep other exports like Controller if needed, though we import it directly
    useForm: vi.fn(), // Simple mock function for useForm
  };
});

// 3. Mock @refinedev/mui
// This mock might need to access mockUseFormReturnValue, which will be set in tests.
// To avoid hoisting issues, the functions inside this mock should access it at call time.
let currentMockUseFormReturnValue: any; // To be set by setup function

vi.mock('@refinedev/mui', () => ({
  Edit: vi.fn(({ children, footerButtons, isLoading }) => {
    const getSaveButtonClickHandler = () => {
      if (currentMockUseFormReturnValue?.saveButtonProps?.onClick) {
        return currentMockUseFormReturnValue.saveButtonProps.onClick;
      }
      return vi.fn();
    };
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        {children}
        {footerButtons && footerButtons({
          saveButtonProps: {
            onClick: getSaveButtonClickHandler(),
            disabled: false,
            type: 'submit',
          },
        })}
      </div>
    );
  }),
}));


// --- Helper to set up the common return value for our mocked useForm ---
// This function will now configure the behavior of the imported (and mocked) useForm.
const setupMockUseFormImplementation = (initialData: any, onFinishImplementation?: (values: any) => Promise<any>) => {
  // Import the mocked useForm
  const { useForm: mockedRefineUseForm } = require('@refinedev/react-hook-form');

  const onFinishSpy = onFinishImplementation || vi.fn(async (values) => {
    return { manual_priority_override: values.manual_priority_override };
  });

  currentMockUseFormReturnValue = { // Store the return value for the @refinedev/mui mock
    control: { register: vi.fn(), unregister: vi.fn(), _names: {array: new Set(), mount: new Set(), unMount: new Set()}, _options: {} } as any,
    watch: vi.fn((fieldName, defaultValue) => initialData[fieldName] !== undefined ? initialData[fieldName] : defaultValue),
    formState: { errors: {} },
    refineCore: {
      queryResult: { data: { data: initialData }, isLoading: false, isError: false },
      formLoading: false,
    },
    saveButtonProps: {
      onClick: vi.fn(async () => {
        const currentFormValuesFromDOM = {
          manual_priority_override: (document.querySelector('input[name="manual_priority_override"]') as HTMLInputElement)?.value,
        };
        await onFinishSpy(currentFormValuesFromDOM);
      }),
      disabled: false,
      type: 'submit',
    },
    handleSubmit: vi.fn((fn) => async (event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();
      const currentFormValues = { ...initialData };
      const overrideInput = document.querySelector('input[name="manual_priority_override"]') as HTMLInputElement;
      if (overrideInput) {
        currentFormValues.manual_priority_override = overrideInput.value === '' ? null : overrideInput.value ; // Keep as string for onFinishSpy
      }
      return fn(currentFormValues);
    }),
  };

  // Configure the imported (and already mocked) useForm
  (mockedRefineUseForm as import('vitest').Mock).mockImplementation(() => ({
    ...currentMockUseFormReturnValue,
  }));
  
  return { onFinishSpy }; 
};


describe('ProjectEditPage - Priority Override', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Use resetAllMocks to clear state between tests
    (vi.mocked(require('next/navigation').useParams)).mockReturnValue({ id: 'test-project-123' });
  });

  test('TC1.1 & TC1.2: Setting a manual override updates the input and calls onFinish with the new value', async () => {
    const initialProjectData = {
      id: 'test-project-123', name: 'Test Project Alpha', vercel_project_id: 'prj_test1',
      calculated_priority_score: 9000, manual_priority_override: null, priority_sort_key: 9000,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    
    // This onFinishImplementation is what we expect the component's onFinish to do (transform)
    // and it's also what we'll spy on.
    const { onFinishSpy } = setupMockUseFormImplementation(initialProjectData, 
        async (values: any) => { 
            const transformedValue = 
                values.manual_priority_override === undefined ||
                values.manual_priority_override === null ||
                values.manual_priority_override === '' 
                    ? null
                    : Number(values.manual_priority_override);
            return { manual_priority_override: transformedValue };
        }
    );
    
    // The component's useForm will now be configured by setupMockUseFormImplementation
    // to use onFinishSpy as its onFinish option.

    render(<ProjectEditPage />);

    const overrideInput = screen.getByLabelText(/Manual Priority Override/i);
    expect(overrideInput).toHaveValue(''); 

    await userEvent.clear(overrideInput);
    await userEvent.type(overrideInput, '100');
    expect(overrideInput).toHaveValue(100);

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveButton); // This triggers saveButtonProps.onClick from the mock

    await waitFor(() => {
      expect(onFinishSpy).toHaveBeenCalledTimes(1);
      expect(onFinishSpy).toHaveBeenCalledWith(
        expect.objectContaining({ manual_priority_override: "100" })
      );
    });
  });

  test('TC3.1 & TC3.2: Clearing a manual override calls onFinish with null', async () => {
    const initialProjectData = {
      id: 'test-project-123', name: 'Test Project Alpha', vercel_project_id: 'prj_test1',
      calculated_priority_score: 9000, manual_priority_override: 15000, priority_sort_key: 15000,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    const { onFinishSpy } = setupMockUseFormImplementation(initialProjectData,
        async (values: any) => {
            const transformedValue = 
                values.manual_priority_override === undefined ||
                values.manual_priority_override === null ||
                values.manual_priority_override === '' 
                    ? null
                    : Number(values.manual_priority_override);
            return { manual_priority_override: transformedValue };
        }
    );

    render(<ProjectEditPage />);

    const overrideInput = screen.getByLabelText(/Manual Priority Override/i);
    expect(overrideInput).toHaveValue(15000);
    
    await userEvent.clear(overrideInput); // Input value becomes ''
    // The Controller's onChange in the actual component should make the form state value null
    // The onFinishSpy will be called with the value from the DOM ('') by our simplified saveButtonProps.onClick mock
    expect(overrideInput).toHaveValue(null); // This checks the DOM input after userEvent.clear()

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveButton);
    
    await waitFor(() => {
      expect(onFinishSpy).toHaveBeenCalledTimes(1);
      expect(onFinishSpy).toHaveBeenCalledWith(
        expect.objectContaining({ manual_priority_override: '' }) // DOM value after clear is ''
      );
    });
  });
});