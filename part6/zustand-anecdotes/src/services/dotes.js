const base_url = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(base_url)

    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    const data = await response.json()
    return data
}

const createDot = async (anecdote) => {
    const response = await fetch(base_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(anecdote)
    })

    if (!response.ok) {
        throw new Error('Failed to create anecdote')
    }

    const data = await response.json()
    return data
}

const updateDot = async (id, updatedAnecdote) => {
    const response = await fetch(`${base_url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnecdote)
    })

    if (!response.ok) {
        throw new Error('Failed to update anecdote')
    }

    const data = await response.json()
    return data
}

const deleteDot = async (id) => {
    const response = await fetch(`${base_url}/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Failed to delete anecdote')
    }

    return response
}

export { getAll, createDot, updateDot, deleteDot }