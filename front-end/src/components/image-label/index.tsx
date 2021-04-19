import { useState, useEffect } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import styles from './style.module.css'
import { Image } from '../../store/image/types'
import { getImage, manualLabel } from '../../services/images'
import { RootState } from '../../store/index'
import { EncodedImage } from '../../components/index'
import { removeQueryImage } from '../../store/image/actions'

type ParamType = {
    imageId: string
}

function ImageLabel() {
    const dispatch = useDispatch()
    const history = useHistory()
    const query = new URLSearchParams(useLocation().search);

    const { imageId } = useParams<ParamType>()
    const [image, setImage] = useState<Image | undefined>(undefined)
    const project = useSelector((state: RootState) => state.project.currentProject)
    const queryImages = useSelector((state: RootState) => state.image.queryImages)
    const isTemporal = query.get('temporal')
    
    const iterateItem = (queryImages: Image[], imageId: string) => {
        const index = queryImages.findIndex(image => image.image_id === imageId)
        return queryImages[(index+1)%queryImages.length]
    }

    useEffect(() => {
        (async () => {
            const image = await getImage(imageId)
            setImage(image)
        })()
    }, [imageId])

    const handleLabel = async (classId: string) => {
        const response = await manualLabel(imageId, classId)
        if (response !== 200) {
            alert('server error')
            return
        }

        const nextImage = iterateItem(queryImages, imageId)
        const currentLength = queryImages.length
        dispatch(removeQueryImage(imageId))
        if (isTemporal === 'TRUE') {
            history.goBack()
        }
        else if (currentLength === 1) {
            history.push(`/label/${project?.project_id}`)
        }
        else {
            history.push(`/image/${nextImage.image_id}`)
        }
    }

    const classScore = image?.class_score
    const filteredClass = project ? project.image_classes.filter(ic => ic.class_id !== '0') : null
    const filteredScoredClass = filteredClass?.map(ic => (
        {
            ...ic,
            score: (classScore && classScore[ic.class_id]) ? classScore[ic.class_id] : 0
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
                image && project &&
                <>
                    <div className={styles.pageHeader}>
                        <div className={styles.headerText}>{project.name}</div>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.imageWrapper}>
                            <EncodedImage encodedString={image.preview_image_blob}/>
                        </div>
                        <div className={styles.classContainer}>
                            <div className={styles.classHeader}>Label</div>
                            <div className={styles.classBox}>
                                {
                                    filteredScoredClass?.map(ic => (
                                        <div className={styles.classItem} key={ic.class_id} onClick={() => { handleLabel(ic.class_id) }}>
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