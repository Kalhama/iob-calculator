import { DateTime } from 'luxon'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBolus } from './store/reducers/bolus'

export const InputBolus = () => {
    const [datetime, setDatetime] = useState(DateTime.now().toISO().slice(0, 16))
    const [bolus, setBolus] = useState('0')
    const dispatch = useDispatch()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (bolus === '0') return
        dispatch(
            addBolus({
                datetime: DateTime.fromISO(datetime),
                bolus: Number(bolus)
            })
        )
    }

    return (
        <>
            <h1>Add bolus</h1>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setDatetime(e.target.value)}
                    value={datetime}
                    type={'datetime-local'}
                />
                <input
                    onChange={(e) => setBolus(e.target.value)}
                    value={bolus}
                    type={'number'}></input>
                <input type="submit" value="Save" />
            </form>
        </>
    )
}
