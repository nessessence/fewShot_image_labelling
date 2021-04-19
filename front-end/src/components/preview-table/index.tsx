import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { EncodedImage } from '../index'
import { Project } from '../../store/project/types'
import styles from './style.module.css'
import { getSupportImage } from '../../services/images'
import { Image } from '../../store/image/types'

type PreviewTableProps = {
    project: Project
}

type ImageMap = {
    [key: string]: Image[]
}

function PreviewTable ({ project }: PreviewTableProps) {
    const projectId = project.project_id
    const imageClasses = project.image_classes
    const filteredClasses = imageClasses.filter(c => c.class_id !== '0')

    const [supportImages, setSupportImages] = useState<ImageMap>({})

    const transformImage = (images: Image[]) => {
        const transformedImages: ImageMap = {}
        images.forEach(image => {
            const classId = image.class_id
            if (!transformedImages[classId]) {
                transformedImages[classId] = []
            }
            transformedImages[classId].push(image)
        })
        return transformedImages
    }
    useEffect(() => {
        (async () => {
            const images = await getSupportImage(projectId)
            const supportImages = transformImage(images)
            setSupportImages(supportImages)
        })()
    }, [projectId])

    return (
        <div className={styles.detailContainer}>
            <div className={styles.tableRow}>
                <div className={styles.tableColumn1}><div className={styles.tableHeader}>#</div></div>
                <div className={styles.tableColumn2}><div className={styles.tableHeader}>class name</div></div>
                <div className={styles.tableColumn3}><div className={styles.tableHeader}>preview</div></div>
            </div>
            {
                filteredClasses.map((imageClass, index) => (
                    <div className={styles.tableRow} key={imageClass.class_name}>
                        <div className={styles.tableColumn1}><div className={styles.tableHeader}>{index+1}</div></div>
                        <div className={styles.tableColumn2}><div className={styles.className}>{imageClass.class_name}</div></div>
                        <div className={styles.tableColumn3}>
                        {
                            imageClass && supportImages[imageClass.class_id] &&
                            supportImages[imageClass.class_id].map(image => (
                                <Link className={styles.imageContainer} key={image.image_id} to={`/image/${image.image_id}`}>
                                    <EncodedImage encodedString={image.preview_image_blob}/>
                                </Link>
                            ))
                        }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default PreviewTable