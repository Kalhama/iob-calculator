import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'

/**
 *
 * @param interval how often to update in seconds
 */
export const useNow = (interval = 1) => {
    const [now, setNow] = useState(DateTime.now())
    useEffect(() => {
        const i = setInterval(() => {
            setNow(DateTime.now())
        }, interval * 1000)
        return () => clearInterval(i)
    }, [])
    return now
}
