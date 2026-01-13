export const getDeliveryMinDate = (shippingCode?: string) => {
  const now = new Date()
  const currentHour = now.getHours()

  if (shippingCode === 'TSS') {
     // 24h notice -> Tomorrow
     const tomorrow = new Date(now)
     tomorrow.setDate(tomorrow.getDate() + 1)
     return tomorrow
  }

  if (shippingCode === 'STD') {
      // If past 16:00, no slots available today -> Tomorrow
      if (currentHour >= 16) {
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return tomorrow
      }
  }

  if (shippingCode === 'EXP') {
      // Last slot is 19:00. Need 2h gap.
      // If now is 17:00 -> 19:00 is possible (exactly 2h).
      // If now is 17:01 -> 19:01 (too late for 19:00 slot).
      // So cutoff is roughly 17:00.
      if (currentHour >= 17) {
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return tomorrow
      }
  }
  
  return now
}

export const getStandardDeliverySlots = (deliveryDate: Date | null) => {
  if (!deliveryDate) return []
  const isToday = deliveryDate.toDateString() === new Date().toDateString()
  const now = new Date()
  const currentHour = now.getHours()
  
  const slots = [
    { value: 'mattina', label: 'Mattina (9:00 - 13:00)' },
    { value: 'pomeriggio', label: 'Pomeriggio (14:00 - 20:00)' }
  ]

  if (isToday) {
    return slots.filter(s => {
        if (s.value === 'mattina' && currentHour >= 10) return false
        if (s.value === 'pomeriggio' && currentHour >= 16) return false
        return true
    })
  }
  return slots
}

export const getTimeSpecificSlots = (shippingCode: string | undefined, deliveryDate: Date | null) => {
    const slots: string[] = []
    const startHour = 10 // EXP range 10-19
    const endHour = 19
    const now = new Date()
    const isToday = deliveryDate?.toDateString() === now.toDateString()
    
    for (let h = startHour; h <= endHour; h++) {
        for (let m of [0, 30]) {
            if (h === endHour && m === 30) continue;

            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
            
            slots.push(timeString)
        }
    }
    return slots
}
