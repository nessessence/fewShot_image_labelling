import { useState, useEffect } from 'react'
import Pagination from '@material-ui/lab/Pagination'
import { Link } from 'react-router-dom'

import styles from './style.module.css'
import { Project } from '../../store/project/types'
import { Image, ImageSet, LabelType } from '../../store/image/types'
import { countImageSet, getLabeledImage } from '../../services/images'
import { addToSupport } from '../../services/transitions'
import { EncodedImage } from '../index'

type LabeledListProps = {
    project: Project,
    pageSize: number,
    labelType: LabelType
}

function LabeledList({ project, pageSize, labelType }: LabeledListProps) {
    const projectId = project.project_id
    const [pageCount, setPageCount] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [labeledImages, setLabeledImages] = useState<Image[]>([])

    const handleChange = async (_: any, value: number) => {
        setPage(value)
        const labeledImages = await getLabeledImage(
            pageSize,
            page,
            projectId,
            labelType
        )
        setLabeledImages(labeledImages)
    }

    const handleTransition = async () => {
        const response = await addToSupport(projectId, labelType)
        if (response !== 200) {
            alert('server error')
        }
        reloadData(projectId, pageSize, page, labelType)
    }

    const reloadData = async (
        projectId: string,
        pageSize: number,
        page: number,
        labelType: LabelType
    ) => {
        const queryImageCount = await countImageSet(
            ImageSet.LABELED,
            projectId,
            null
        )
        const pageCount = Math.ceil(queryImageCount/pageSize)
        setPageCount(pageCount)
        const labeledImages = await getLabeledImage(
            pageSize,
            page,
            projectId,
            labelType
        )
        setLabeledImages(labeledImages)
    }

    useEffect(() => {
        reloadData(projectId, pageSize, page, labelType)
    }, [projectId, pageSize, page, labelType])

    return (
        <div className={styles.labeledListContainer}>
            <div className={styles.firstRow}>
                <div className={styles.labelTypeDisplay}>{labelType} labeled</div>
                <button className={styles.button} onClick={handleTransition}>add to support</button>
            </div>
            <div className={styles.imagesDisplay}>
                {
                    labeledImages.map((image: Image) => (
                        <Link className={styles.imageContainer} to={`/image/${image.image_id}`} key={image.image_id}>
                            <EncodedImage encodedString={image.preview_image_blob}/>
                        </Link>
                    ))
                }
            </div>
            <div className={styles.paginationContainer}>
                <div>
                    <Pagination count={pageCount} page={page} onChange={handleChange} />
                </div>
            </div>
        </div>
    )
}

export default LabeledList