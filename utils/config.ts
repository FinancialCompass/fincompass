"server only"

import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
    pinataJwt: `${process.env.PINATA_JWT}`,
    pinataGateway: `${process.env.PINATA_GATEWAY_URL}`
})

const files = await pinata.files.list().group("0193394e-b683-7aee-af8a-2807cd0d92db")

console.log(files)