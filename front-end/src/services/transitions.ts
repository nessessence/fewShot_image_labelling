import axios from 'axios'

import { LabelType } from '../store/image/types'
import { ENDPOINT } from './index'

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

const autolabel = async(
    projectId: string,
    limit: number
) => {
    const response = await axios.post(`${ENDPOINT}/autolabel`, {
        project_id: projectId,
        limit: limit
    })
    return response.status
}

export {
    addToSupport,
    recompute,
    autolabel
}