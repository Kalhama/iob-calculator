import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { useState } from 'react'
import TimelineIcon from '@mui/icons-material/Timeline'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import CalculateIcon from '@mui/icons-material/Calculate'

export const Navbar = () => {
    const [value, setValue] = useState(0)
    return (
        <>
            <Outlet />
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                    }}>
                    <BottomNavigationAction to={'/'} component={NavLink} icon={<TimelineIcon />} />
                    <BottomNavigationAction
                        to={'/bolus'}
                        component={NavLink}
                        icon={<FormatListBulletedIcon />}
                    />
                    <BottomNavigationAction
                        to={'/calculator'}
                        component={NavLink}
                        icon={<CalculateIcon />}
                    />
                </BottomNavigation>
            </Paper>
        </>
    )
}
