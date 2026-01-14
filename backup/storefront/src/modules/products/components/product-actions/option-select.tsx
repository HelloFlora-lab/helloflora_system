import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: any
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  //const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-2 text-small-regular">
      <span className="text-large-semi text-theme-text-accent-light">Seleziona una preferenza</span>
       <span className="text-base-regular pb-2">{title}: <span className="text-base-semi">{current}</span></span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {(option.values ?? []).map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v.value)}
              key={v.id}
              className={clx(
                "border-ui-border-base bg-white border text-small-regular h-10 rounded-rounded flex-1 ",
                {
                  "border-ui-border-interactive": v.value === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v.value !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v.value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
