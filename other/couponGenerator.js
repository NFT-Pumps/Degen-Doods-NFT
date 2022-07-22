//npx hardhat run .\other\couponGenerator.js 
const { ethers } = require("hardhat");
const fs = require("fs");

  
const {
    keccak256,
    toBuffer,
    ecsign,
    bufferToHex,
} = require("ethereumjs-utils");

let signerPvtKey1 = process.env.SigPK;

//const signerPvtKey = Buffer.from(signerPvtKey1.substring(2,66), "hex");
const signerPvtKey = Buffer.from(signerPvtKey1, "hex");


let coupons = {};

async function getClaimCodes() {
    //const [owner, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20] = await ethers.getSigners();

    let presaleAddresses = [
        { address : '0x26043762cbaA719cE3194d659278467E29A9ad2E', qty : 1},
        { address : '0xD0f6ddbC9Fb8B8Bac9Fb89AF8B21e640a4B47e8e', qty : 1},
        { address : '0x3AC4161Dc070da4c6734c75538bb6AC64a0F0E63', qty : 1},
        { address : '0x7d055494701e93173A766beB3Ba6Fd2f9b923d89', qty : 7},
        { address : '0x55059722982A53b8FdC4EFF46cb5c2F6ef0aFB47', qty : 6},
        { address : '0x4354A019e9e3471Ed86c86191428FD931992CfC8', qty : 3},
        { address : '0xE3f9Cf2c9e51DD79a60FC78b20cA898dD01FcbfE', qty : 1},
        { address : '0xf8BE5B910c331f368fd724E5c76eE69ca892E6ae', qty : 1},
        { address : '0xF9557eF7afb1A5b75C010A5303eC884443978Bf2', qty : 1},
        { address : '0xf00F459e6EeC67F3700316f6fef6da0DB8576aE3', qty : 1},
        { address : '0xCd43AdcB61949ab14D3f4574BFbDA53d46389715', qty : 4},
        { address : '0xA3F7d136d03a8F17032296ebc9d64928D120540A', qty : 4},
        { address : '0xa7531F5A9D56089A79EBCb295bAba41bED80ca22', qty : 4}      
    ]      
    
    function createCoupon(hash, signerPvtKey) {
        return ecsign(hash, signerPvtKey);
    }
    
    function generateHashBuffer(typesArray, valueArray) {
        return keccak256(
            toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
                valueArray))
        );
    }

    function serializeCoupon(coupon) {
        return {
            r: bufferToHex(coupon.r),
            s: bufferToHex(coupon.s),
            v: coupon.v
        };
    }

    for (let i = 0; i < presaleAddresses.length; i++) {
        const userAddress = ethers.utils.getAddress(presaleAddresses[i].address);
        const hashBuffer = generateHashBuffer(
            ["uint256", "address"],
            [presaleAddresses[i].qty, userAddress]
        );
        const coupon = createCoupon(hashBuffer, signerPvtKey);

        coupons[userAddress] = {
            q : presaleAddresses[i].qty,
            whitelistClaimPass: serializeCoupon(coupon)
        };
    }
    // HELPER FUNCTIONS
    
    // get the Console class
    const { Console } = require("console");
    // get fs module for creating write streams
    const fs = require("fs");

    // make a new logger
    const myLogger = new Console({
    stdout: fs.createWriteStream("ProjectWhitelist-signed-coupons.txt"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });

    myLogger.log(coupons);
   
}

getClaimCodes()