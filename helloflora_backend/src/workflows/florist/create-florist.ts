import { createStep, createWorkflow, StepResponse, transform, WorkflowData, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

import { createFloristStep } from "./steps/create-florist-step";
import { CreateFloristDTO } from "../../modules/florist/types";
import FloristModuleService from "../../modules/florist/service";
import { FLORIST_MODULE } from "../../modules/florist";
import { container } from "@medusajs/framework";
import { createRemoteLinkStep, useQueryGraphStep } from "@medusajs/core-flows";
import { LinkDefinition } from "@medusajs/framework/types";


type WorkflowInput = CreateFloristDTO;

export const createFloristWorkflow = createWorkflow(
  "create-florist-workflow",
  function (input: WorkflowData<WorkflowInput>) {

    const floristData = transform(input, (data) => {
      const  floristDetails  = data;
      return floristDetails;
    });


    const newFlorist = createFloristStep(floristData);

    /*
    const linksToCreate = transform({ post: newPost, input }, (data) => {
      if (!data.input.tag_ids || data.input.tag_ids.length === 0) {
        return [];
      }

      return data.input.tag_ids.map((tagId) => ({
        [BLOG_MODULE]: {
          post: data.post.id,
          post_tag: tagId,
        },
      }));
    });

    createRemoteLinkStep(linksToCreate as WorkflowData<LinkDefinition[]>);
*/
    return new WorkflowResponse(newFlorist);
  }
);