import axios from "axios";

export async function postSettingsPom(workTime, relaxTime, cycleNum, user) {
    await axios.post('http://localhost:8000/api/pomodoro/addSettingsPom', {
                     "workTime":workTime.value, 
                     "relaxTime":relaxTime.value, 
                     "cycleNum":cycleNum.value, 
                     "user":user.value
    })
    .then(({data}) => {
        console.log(data);
    })
}

export async function getSettingsPomUser(username){
    console.log(username)
    try {
        const response = await axios.get(`http://localhost:8000/api/pomodoro/getUserSettingsPom`, {
            params: {
                user:username
            }
        })
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching pom settings user: ', error);
        throw error;
    }
}