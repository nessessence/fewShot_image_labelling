import axios from 'axios'

const ENDPOINT = 'http://localhost:5001'

const getDataroot = async () => {
    const response = await axios.get(`${ENDPOINT}/dataroot`)
    const {folder_name} = response.data
    return folder_name
}

const getProjects = async () => {
    const response = await axios.get(`${ENDPOINT}/projects`)
    return response.data
}

const postProject = async (projectPath: string) => {
    await axios.post(`${ENDPOINT}/projects`, {
        project_path: projectPath
    })
}

export {
    getDataroot,
    getProjects,
    postProject
}