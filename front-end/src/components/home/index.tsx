import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../store'
import styles from './style.module.css'

function Home() {
    const loadedProject = useSelector((state: RootState) => state.project.loadedProject)

    return (
        <div className={styles.home}>
            <div className={styles.pageHeader}>
                <div className={styles.headerText}>Current Project</div>
                <button className={styles.addProjectButton}>
                    add project
                </button>
            </div>
            {Boolean(loadedProject.length) && "some project"}
            {Boolean(!loadedProject.length) && "no project"}
        </div>
    )
}

export default Home;