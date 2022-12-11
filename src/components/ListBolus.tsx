import { BolusTable } from './BolusTable'
import { InputBolus } from './InputBolus'
import { useDatePicker } from './useDatepicker'

export const ListBolus = () => {
    const [date, DatePicker] = useDatePicker()

    return (
        <>
            <DatePicker />
            <BolusTable date={date} />
            <InputBolus />
        </>
    )
}
