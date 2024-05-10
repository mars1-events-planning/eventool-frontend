import { HoudiniClient } from '$houdini';

export default new HoudiniClient({
    url: "https://backend.eventool.online/graphql",
    fetchParams({ session }) {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth-token')}`
            }
        }
    }
})
