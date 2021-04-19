import { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import styles from './style.module.css'
import { recompute } from '../../services/transitions'

type RecomputeConfirmProps = {
    closePopupEvent: () => void,
    projectId: string
}

function RecomputeConfirm({ closePopupEvent, projectId }: RecomputeConfirmProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const handleConfirm = async () => {
        setLoading(true)
        const response = await recompute(projectId)
        if (response !== 200) {
            alert('server error')
        } else {
            closePopupEvent()
        }
    }

    return (
        <>
            <div className={styles.cardHeader}>Recompute</div>
            <div className={styles.noticeText}>
                recomputing score could take up to an hour and you will not be
                able to do any action
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleConfirm} disabled={loading}>
                    {loading ? <CircularProgress/> : 'confirm'}
                </button>
            </div>
        </>
    )
}

export default RecomputeConfirm