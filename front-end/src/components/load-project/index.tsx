import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { discoverDataroot } from '../../store/project/actions'
import { RootState } from '../../store/index'
import { postProject } from '../../services/projects'
import styles from './style.module.css'

type LoadProjectProps = {
    closePopupEvent: () => void,
    reloadEvent: () => void
}

function LoadProject({ closePopupEvent, reloadEvent } : LoadProjectProps) {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(discoverDataroot())
    }, [dispatch])

    const dataroot = useSelector((state: RootState) => state.project.dataroot)

    const [projectPath, setProjectPath] = useState('')
    const handleChange = (e: any) => {
        setProjectPath(e.target.value)
    }

    const handleSubmit = async () => {
        await postProject(projectPath)
        closePopupEvent()
        reloadEvent()
    }

    return (
        <div className={styles.container}>
            <div className={styles.popupHeader}>Upload Project</div>
            <TextField
                id="standard-select-currency"
                select
                label="Select"
                value={projectPath}
                onChange={handleChange}
                style={{ width: '100%' }}
            >
                {
                    dataroot.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))
                }
            </TextField>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleSubmit} disabled={projectPath === ''}>
                    submit
                </button>
            </div>
        </div>
    )
}

export default LoadProject
