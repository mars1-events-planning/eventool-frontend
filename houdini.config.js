/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "watchSchema": {
        "url": "https://backend.eventool.online/graphql"
    },
    "plugins": {
        "houdini-svelte": {
            quietQueryErrors: true
        }
    },
    scalars: {
        "UUID": {
            type: "string"
        }
    }
}

export default config
