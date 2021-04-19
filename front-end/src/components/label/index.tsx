import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import styles from './style.module.css'
import { RootState } from '../../store/index'
import { PreviewTable, QueryList, LabeledList, Popup, RecomputeConfirm } from '../index'
import { setCurrentProject } from '../../store/project/actions'
import { LabelType } from '../../store/image/types'

type ParamType = {
    projectId: string
}

export enum TabItem {
    Support = 'Support',
    Query = 'Query',
    Labeled = 'Labeled'
}

function Label() {
    const dispatch = useDispatch()
    const { projectId } = useParams<ParamType>()
    const project = useSelector((state: RootState) => state.project.currentProject)

    useEffect(() => {
        dispatch(setCurrentProject(projectId))
    }, [dispatch, projectId])

    const [currentTab, setCurrentTab] = useState<TabItem>(TabItem.Support)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const closePopup = () => {
        setShowPopup(false)
    }

    return (
        <div className={styles.label}>
            {
                project &&
                <>
                    {
                        showPopup &&
                        <Popup closePopupEvent={closePopup}>
                            {
                                currentTab === TabItem.Support &&
                                <RecomputeConfirm closePopupEvent={closePopup} projectId={projectId}/>
                            }
                            {
                                currentTab === TabItem.Query &&
                                <div>auto label</div>
                            }
                        </Popup>
                    }
                    <div className={styles.pageHeader}>
                        <div className={styles.headerText}>{project?.name}</div>
                    </div>
                    <div className={styles.tabContainer}>
                        {
                            Object.values(TabItem).map(tab => (
                                <div
                                    className={currentTab === tab ? styles.tabCurrent : styles.tab}
                                    key={tab}
                                    onClick={() => { setCurrentTab(tab) }}
                                >
                                    {tab}
                                </div>
                            ))
                        }
                        {
                            currentTab === TabItem.Support &&
                            <button 
                                onClick={() => { setShowPopup(true) }}
                                className={styles.button}
                            >
                                recompute score
                            </button>
                        }
                        {
                            currentTab === TabItem.Query &&
                            <button 
                                onClick={() => { setShowPopup(true) }}
                                className={styles.button}
                            >
                                auto label
                            </button>
                        }
                    </div>
                    {
                        currentTab === TabItem.Support &&
                        <PreviewTable project={project}/>
                    }
                    {
                        currentTab === TabItem.Query &&
                        <QueryList project={project} pageSize={48}/>
                    }
                    {
                        currentTab === TabItem.Labeled &&
                        <>
                            <LabeledList project={project} pageSize={24} labelType={LabelType.AUTO}/>
                            <LabeledList project={project} pageSize={24} labelType={LabelType.MANUAL}/>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Label