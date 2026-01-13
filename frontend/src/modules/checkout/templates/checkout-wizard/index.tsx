"use client"

import { clx } from "@medusajs/ui"
import Check from "@modules/common/icons/check"

type CheckoutWizardProps = {
  steps: string[]
  currentStep: number
}

const CheckoutWizard = ({ steps, currentStep }: CheckoutWizardProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Cerchio e Testo */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={clx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    {
                      "bg-theme-accent text-white": isCompleted,
                      "border-2 border-theme-accent text-theme-accent": isCurrent,
                      "border border-gray-200 bg-gray-50 text-gray-400": !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <p
                  className={clx("text-xs text-center", {
                    "font-semibold text-theme-accent": isCurrent,
                    "text-gray-500": !isCurrent,
                  })}
                >
                  {step}
                </p>
              </div>

              {/* Linea di connessione (non per l'ultimo elemento) */}
              {index < steps.length - 1 && (
                <div
                  className={clx("flex-1 h-0.5 mx-4", {
                    "bg-theme-accent": isCompleted,
                    "bg-gray-200": !isCompleted,
                  })}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutWizard;