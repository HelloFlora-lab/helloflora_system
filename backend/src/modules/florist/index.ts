import { Module } from "@medusajs/framework/utils"
import FloristModuleService from "./service"

export const FLORIST_MODULE = "florist"

export default Module(FLORIST_MODULE, {
  service: FloristModuleService,
})