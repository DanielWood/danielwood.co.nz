import agent from 'superagent';

class API {
    private static URL = process.env.API_URL || 'http://localhost:5000/v1/';
    private static JWT = localStorage.getItem('jwt') || '';

    public static get(endpoint: string) {
        return agent.get(API.URL + endpoint).set({ Authorization: `Bearer ${API.JWT}` });
    }

    public static post(endpoint: string, body: object) {
        return agent
            .post(API.URL + endpoint)
            .set({ Authorization: `Bearer ${API.JWT}` })
            .send(body);
    }
}

export default API;
