import { HoudiniClient } from '$houdini';

export default new HoudiniClient({
    url: "http://localhost:5275/graphql",
    fetchParams({ session }) {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth-token')}`
            }
        }
    }
})
