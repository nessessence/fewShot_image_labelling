import { useState } from 'react'
import { useDispatch } from 'react-redux'

import styles from './style.module.css'
import { autolabel } from '../../services/transitions'
import { loadQueryImage } from '../../store/image/actions'

type AutolabelProps = {
    closePopupEvent: () => void,
    projectId: string,
    pageSize: number
}

function Autolabel({ closePopupEvent, projectId, pageSize }: AutolabelProps) {
    const dispatch = useDispatch()

    const [limit, setLimit] = useState<number>(90)

    const handleChange = (e: any) => {
        setLimit(e.target.value)
    }

    const handleSubmit = async () => {
        let parsedLimit: number = limit
        if (limit > 100) {
            parsedLimit = 100
        }
        else if (limit < 0) {
            parsedLimit = 0
        }
        const response = await autolabel(projectId, parsedLimit)
        if (response !== 200) {
            alert('server error')
        } else {
            dispatch(loadQueryImage(pageSize, 1, projectId))
            closePopupEvent()
        }
    }

    return (
        <>
            <div className={styles.cardHeader}>Auto Label</div>
            <div className={styles.noticeText}>
                <span>auto label all images with confidence over</span>
                <input
                    className={styles.input}
                    type="number"
                    value={limit}
                    onChange={handleChange}
                    min='0'
                    max='100'
                />
                <span>%</span>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleSubmit}>
                    submit
                </button>
            </div>
        </>
    )
}

export default Autolabel