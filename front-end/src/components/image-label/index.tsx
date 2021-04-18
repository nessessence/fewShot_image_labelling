import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import styles from './style.module.css'
import { Image } from '../../store/image/types'
import { getImage } from '../../services/images'
import { RootState } from '../../store/index'
import { EncodedImage } from '../../components/index'

type ParamType = {
    imageId: string
}

function ImageLabel() {
    const { imageId } = useParams<ParamType>()
    const [image, setImage] = useState<Image | undefined>(undefined)
    const project = useSelector((state: RootState) => state.project.currentProject)

    useEffect(() => {
        (async () => {
            const image = await getImage(imageId)
            setImage(image)
        })()
    }, [imageId])

    const classScore = image?.class_score
    const filteredClass = project ? project.image_classes.filter(ic => ic.class_id !== '0') : null
    const filteredScoredClass = filteredClass?.map(ic => (
        {
            ...ic,
            score: classScore ? classScore.find(cs => cs.class_id === ic.class_id)?.class_score : 0
        }
    ))
    filteredScoredClass?.sort((_t, _o) => {
        const t = _t.score || 0
        const o = _o.score || 0

        if (t > o) {
            return -1
        }
        else if (t === o) {
            return 0
        }
        else return 1;
    })

    return (
        <div className={styles.image}>
            {
                image && project && image.blob &&
                <>
                    <div className={styles.pageHeader}>
                        <div className={styles.headerText}>{project.name}</div>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.imageWrapper}>
                            <EncodedImage encodedString={image.blob}/>
                        </div>
                        <div className={styles.classContainer}>
                            <div className={styles.classHeader}>Label</div>
                            <div className={styles.classBox}>
                                {
                                    filteredScoredClass?.map(ic => (
                                        <div className={styles.classItem} key={ic.class_id}>
                                            <div className={styles.classItemName}>{ic.class_name}</div>
                                            <div className={styles.classItemScore}>score : {ic.score}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default ImageLabel