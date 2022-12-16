import { InputBolusDialog } from './InputBolusDialog'
import { useState } from 'react'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import VaccinesIcon from '@mui/icons-material/Vaccines'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import { InputCarbsDialog } from './InputCarbsDialog'

export const InputBolusFab = () => {
    const [carbsDialog, setCarbsDialog] = useState(false)
    const [bolusDialog, setBolusDialog] = useState(false)

    return (
        <>
            <SpeedDial
                ariaLabel="Add food or insulin"
                sx={{ position: 'fixed', right: '2em', bottom: '6em' }}
                icon={<SpeedDialIcon />}>
                <SpeedDialAction
                    key={'Add carbs'}
                    icon={<LunchDiningIcon />}
                    tooltipTitle={'Add carbs'}
                    onClick={() => setCarbsDialog(true)}
                />
                <SpeedDialAction
                    key={'Add bolus'}
                    icon={<VaccinesIcon />}
                    tooltipTitle={'Add bolus'}
                    onClick={() => setBolusDialog(true)}
                />
            </SpeedDial>
            <InputBolusDialog open={bolusDialog} setOpen={setBolusDialog} />
            <InputCarbsDialog open={carbsDialog} setOpen={setCarbsDialog} />
        </>
    )
}
