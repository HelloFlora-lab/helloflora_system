"use client"

import { clx } from "@medusajs/ui"
import Clock from "@modules/common/icons/clock"
import XClose from "@modules/common/icons/x-close"
import React from "react"

type TimePickerProps = {
  label: string
  value: string // Formato "HH:mm"
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  name?: string
  className?: string // 1. Aggiungi className alle props
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  id = "delivery-time",
  name = "delivery-time",
  className, // 2. Destruttura className
}) => {
  // Genera le opzioni per le ore (da 08 a 20)
  const hourOptions = Array.from({ length: 13 }, (_, i) =>
    String(8 + i).padStart(2, "0")
  )
  // Opzioni per i minuti (step di 15)
  const minuteOptions = ["00", "15", "30", "45"]

  const [currentHour, currentMinute] = value ? value.split(":") : ["", ""]

  // Gestisce il cambio di ora o minuti
  const handleSelectChange = (
    type: "hour" | "minute",
    selectedValue: string
  ) => {
    let newTime = ""
    if (type === "hour") {
      // Se si cambia l'ora, si usa il minuto corrente o si imposta '00'
      newTime = `${selectedValue}:${currentMinute || "00"}`
    } else {
      // Se si cambiano i minuti, si usa l'ora corrente o si imposta '08'
      newTime = `${currentHour || "08"}:${selectedValue}`
    }

    // Simula un evento per la coerenza con la prop onChange
    const syntheticEvent = {
      target: { name, value: newTime },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  // Funzione per resettare il valore
  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const syntheticEvent = {
      target: { name, value: "" },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  return (
    // 3. Applica className al div principale
    <div >
      <label htmlFor={id} className="block text-sm font-medium text-ui-fg-base mb-2">
        {label}
      </label>
      <div
        className={clx(
          className,
          "txt-compact-medium relative flex w-full items-center rounded-md bg-ui-bg-field text-ui-fg-base shadow-buttons-neutral transition-colors",
          "border border-ui-border-base",
          "hover:bg-ui-bg-base-hover"
        )}
      >
        <span className="flex h-full items-center justify-center border-r border-ui-border-base px-3">
          <Clock className="text-ui-fg-muted" />
        </span>

        {/* Contenitore per i due menu a tendina */}
        <div className="flex flex-row items-center">
          <select
            id={id}
            value={currentHour}
            onChange={(e) => handleSelectChange("hour", e.target.value)}
            className="w-full appearance-none bg-transparent py-2 px-3 outline-none"
          >
            <option value="" disabled>
              Ora
            </option>
            {hourOptions.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>

          <span className="text-ui-fg-muted">:</span>

          <select
            value={currentMinute}
            onChange={(e) => handleSelectChange("minute", e.target.value)}
            className="w-full appearance-none bg-transparent py-2 px-3 outline-none"
          >
            <option value="" disabled>
              Minuti
            </option>
            {minuteOptions.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>

        {value && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-3 cursor-pointer"
          >
            <XClose className="text-ui-fg-muted" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default TimePicker