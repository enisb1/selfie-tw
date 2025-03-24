export const getServerTime = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/time/serverTime`);
        if (!response.ok) throw await response.json();
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
};

export const setNewGlobalTime = async (date) => {
    try {
        const response = await fetch(`http://localhost:8000/api/time/setNewGlobalTime`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date }),
        });
        if (!response.ok) throw await response.json();
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const rollBackTime = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/time/rollBackTime`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw await response.json();
        return await response.json();
    } catch (error) {
        throw error;
    }
};

window.getServerTime = getServerTime;
window.setNewGlobalTime = setNewGlobalTime;
window.rollBackTime = rollBackTime;