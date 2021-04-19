import axios from 'axios'

import { LabelType } from '../store/image/types'

const ENDPOINT = 'http://localhost:5001'

const addToSupport = async (
    projectId: string,
    labelType: LabelType
) => {
    const response = await axios.post(`${ENDPOINT}/add_to_support`, {
        project_id: projectId,
        type: labelType
    })
    return response.status
}

const recompute = async (
    projectId: string,
) => {
    const response = await axios.post(`${ENDPOINT}/recompute`, {
        project_id: projectId,
    })
    return response.status
}

export {
    addToSupport,
    recompute
}