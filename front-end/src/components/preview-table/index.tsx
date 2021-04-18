import { EncodedImage } from '../index'
import { Project } from '../../store/project/types'
import styles from './style.module.css'

type PreviewTableProps = {
    project: Project
}

function PreviewTable ({ project }: PreviewTableProps) {
    const { image_classes } = project
    const filteredClasses = image_classes.filter(c => c.class_id !== '0')

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
                            imageClass.preview && imageClass.preview.map(binary => (
                                <div className={styles.imageContainer} key={binary}>
                                    <EncodedImage encodedString={binary}/>
                                </div>
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