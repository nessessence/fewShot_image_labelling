import { getDataroot, getProjects, getProject } from '../../services/projects'

export const DISCOVER_DATAROOT = 'DISCOVER_DATAROOT'
export const STORE_PROJECTS = 'STORE_PROJECTS'
export const SET_CURRENT_PROJECTS = 'SET_CURRENT_PROJECTS'

export const discoverDataroot = () => {
    return async (dispatch: any) => {
        const folderNames = await getDataroot()
        dispatch({
            type: DISCOVER_DATAROOT,
            folderNames: folderNames
        })
    }
}

export const storeProjects = () => {
    return async (dispatch: any) => {
        const projects = await getProjects()
        dispatch({
            type: STORE_PROJECTS,
            projects: projects
        })
    }
}

export const setCurrentProject = (projectId: string) => {
    return async (dispatch: any) => {
        const project = await getProject(projectId)
        dispatch({
            type: SET_CURRENT_PROJECTS,
            project: project
        })
    }
}