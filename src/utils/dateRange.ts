import { DateTime, DurationLike, Interval } from 'luxon'

export const dateRange = (start: DateTime, end: DateTime, splitBy: DurationLike) => {
    const interval = Interval.fromDateTimes(start, end)
    const range = interval.splitBy(splitBy).map((d) => d.start)
    return [...range, end]
}
