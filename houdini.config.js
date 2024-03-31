/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "watchSchema": {
        "url": "http://localhost:5275/graphql"
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
