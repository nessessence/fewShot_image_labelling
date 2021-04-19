import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../store'
import styles from './style.module.css'
import { storeProjects } from '../../store/project/actions'
import { ProjectPreview, Popup, LoadProject } from '../index'

function Home() {
    const loadedProject = useSelector((state: RootState) => state.project.loadedProject)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(storeProjects())
    }, [dispatch])

    const [showPopup, setShowPopup] = useState(false)
    const togglePopup = () => {
        setShowPopup(!showPopup)
    }
    const closePopup = () => {
        setShowPopup(false)
    }
    const reloadEvent = () => {
        dispatch(storeProjects())
    }

    return (
        <div className={styles.home}>
            {
                showPopup &&
                <Popup closePopupEvent={closePopup}>
                    <LoadProject closePopupEvent={closePopup} reloadEvent={reloadEvent}/>
                </Popup>
            }
            <div className={styles.pageHeader}>
                <div className={styles.headerText}>Current Project</div>
                <button className={styles.addProjectButton} onClick={togglePopup}>
                    add project
                </button>
            </div>
            {Boolean(loadedProject.length) && 
                loadedProject.map(project => (
                    <ProjectPreview project={project} key={project.project_id}/>
                ))
            }
            {Boolean(!loadedProject.length) && 
                <div className={styles.noProject}>
                    currently no project
                </div>
            }
        </div>
    )
}

export default Home;