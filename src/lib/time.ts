export function timeLabel(minutes: number): string {
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    const rest = minutes % 1440;
    return `${days === 1 ? 'יום' : days === 2 ? 'יומיים' : `${days} ימים`}${rest ? ` ו${rest < 60 ? '־' : ''}${timeLabel(rest)}` : ''}`;
  }
  if (minutes < 60) return `${minutes} דקות`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest
    ? `${hours === 1 ? 'שעה' : hours === 2 ? 'שעתיים' : `${hours} שעות`} ו־${rest} דקות`
    : hours === 1
      ? 'שעה'
      : hours === 2
        ? 'שעתיים'
        : `${hours} שעות`;
}

export function timeRangeLabel(minimum: number, maximum?: number): string {
  return maximum !== undefined && maximum > minimum
    ? `${timeLabel(minimum)}–${timeLabel(maximum)}`
    : timeLabel(minimum);
}
