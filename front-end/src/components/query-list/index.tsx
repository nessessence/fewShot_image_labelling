import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '@material-ui/lab/Pagination'
import { Link } from 'react-router-dom'
import { loadQueryImage } from '../../store/image/actions'

import styles from './style.module.css'
import { Project } from '../../store/project/types'
import { countImageSet } from '../../services/images'
import { Image, ImageSet } from '../../store/image/types'
import { EncodedImage } from '../index'
import { RootState } from '../../store/index'

type QueryListProps = {
    project: Project
    pageSize: number
}

function QueryList({ project, pageSize }: QueryListProps) {
    const dispatch = useDispatch()

    const projectId = project.project_id
    const [pageCount, setPageCount] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const queryImages = useSelector((state: RootState) => state.image.queryImages)

    const handleChange = async (_: any, value: number) => {
        setPage(value)
        dispatch(loadQueryImage(pageSize, page, projectId))
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
            dispatch(loadQueryImage(pageSize, page, projectId))

        })()
    }, [projectId, pageSize, page, dispatch])

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