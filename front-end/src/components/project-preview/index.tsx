import { Link } from 'react-router-dom'

import styles from './style.module.css'
import { Project } from '../../store/project/types'

type ProjectPreviewProps = {
    project: Project
}

function ProjectPreview({ project }: ProjectPreviewProps) {
    const {
        name,
        image_classes,
        unlabeled_image_count
    } = project

    const filteredClasses = image_classes.filter(c => c.class_id !== '0')

    return (
        <Link to={`/label/${project.project_id}`} className={styles.projectPreview}>
            <div className={styles.projectPreviewContainer}>
                <div className={styles.innerContainer}>
                    <div className={styles.projectName}>
                        {name}
                    </div>
                    <div className={styles.separator} />
                    <div className={styles.projectBrief}>
                        {`${filteredClasses.length} labeled classes, ${unlabeled_image_count} unlabeled images`}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProjectPreview