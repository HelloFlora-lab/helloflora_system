import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { CreateFloristDTO } from "../../../modules/florist/types";
import FloristModuleService from "../../../modules/florist/service";
import { FLORIST_MODULE } from "../../../modules/florist";

type StepInput = Omit<CreateFloristDTO, "id">;

export const createFloristStep = createStep(
  "create-florist-step",
  async (input: StepInput, { container }) => {
    const floristModuleService: FloristModuleService = container.resolve(FLORIST_MODULE);

    const [createdFlorist] = await floristModuleService.createFlorists([input]);

    if (!createdFlorist) {
      throw new Error("La creazione del fiorista è fallita.");
    }

    // Passiamo l'ID del fiorista creato alla funzione di compensazione.
    return new StepResponse(createdFlorist, createdFlorist.id);
  },
  async (floristId, { container }) => {
    if (!floristId) {
      return;
    }
    const floristModuleService: FloristModuleService = container.resolve(FLORIST_MODULE);
    await floristModuleService.deleteFlorists([floristId]);
  }
);