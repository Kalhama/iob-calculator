import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { InputBolusDialog } from './InputBolusDialog'
import { useState } from 'react'

export const InputBolusFab = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Fab
                onClick={() => setOpen(true)}
                sx={{ position: 'fixed', right: '2em', bottom: '6em' }}
                color="primary"
                aria-label="add">
                <AddIcon />
            </Fab>
            <InputBolusDialog open={open} setOpen={setOpen} />
        </>
    )
}
