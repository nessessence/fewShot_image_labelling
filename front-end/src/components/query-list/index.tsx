import { useState, useEffect } from 'react'
import Pagination from '@material-ui/lab/Pagination'
import { Link } from 'react-router-dom'

import styles from './style.module.css'
import { Project } from '../../store/project/types'
import { countImageSet, getQueryImage } from '../../services/images'
import { Image, ImageSet } from '../../store/image/types'
import { EncodedImage } from '../index'

type QueryListProps = {
    project: Project
    pageSize: number
}

function QueryList({ project, pageSize }: QueryListProps) {
    const projectId = project.project_id
    const [pageCount, setPageCount] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [queryImages, setQueryImages] = useState<Image[]>([])

    const handleChange = async (_: any, value: number) => {
        setPage(value)
        const queryImages = await getQueryImage(
            pageSize,
            page,
            projectId
        )
        setQueryImages(queryImages)
    }

    useEffect(() => {
        (async () => {
            const queryImageCount = await countImageSet(
                ImageSet.QUERY,
                projectId,
                null
            )
            const pageCount = Math.ceil(queryImageCount/pageSize)
            setPageCount(pageCount)
            const queryImages = await getQueryImage(
                pageSize,
                page,
                projectId
            )
            setQueryImages(queryImages)
        })()
    }, [projectId, pageSize, page])

    return (
        <>
            <div className={styles.imagesDisplay}>
                {
                    queryImages.map((image: Image) => (
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
        </>
    )
}

export default QueryList