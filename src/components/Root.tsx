import { InputBolus } from './InputBolus'
import { IOBPlot } from './IOBPlot'
import { useDatePicker } from './useDatepicker'

export const Root = () => {
    const [date, DatePicker] = useDatePicker()

    return (
        <>
            <DatePicker />
            <IOBPlot date={date} />
            <InputBolus />
        </>
    )
}
