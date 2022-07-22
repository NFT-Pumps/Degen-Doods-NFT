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
        { address : '0xFd4938b02074DF1d3Aa15a97Ee561f40704b2195', qty : 4},
        { address : '0x4D00D10855EE5B0c76A0Fa72787C2ECC0F2F7766', qty : 4},
        { address : '0x4f54cAE0F923892a58721D06C2363d7A353F3A0d', qty : 4},
        { address : '0x41FD3dC049F8c1aC6670dE119698D3488017c0b6', qty : 4},
        { address : '0xe67d102CAd14CAeEC42F4cFC7C862B1b0d305943', qty : 4},
        { address : '0x5aa8C06f9DFc455Cf4005e4D923b5034EF97cdf7', qty : 4},
        { address : '0x5F50aaFe3920c227099919F6B5Ce482E023b98fc', qty : 4},
        { address : '0xB3c64a8318131802c2D77cCEb9AF7e5412196397', qty : 4},
        { address : '0x1Be8bBac70d8574eF80e2a3471B6Ed219952931b', qty : 4},
        { address : '0x203A550caB392e30B09048bBAb2F7C133f553e15', qty : 4},
        { address : '0xf616a69aeE4f0174FFf7A1055afF334de481B93F', qty : 4},
        { address : '0x67515BCb2e93AF3E6D632FD12d0fc884a1f24d0D', qty : 4},
        { address : '0xA10DEE78Cf06D8d83738B3dc9bAeaD402805Dd22', qty : 4},
        { address : '0x0d02865BD52d63b549eF2e258a2dDCEf715d4E81', qty : 4},
        { address : '0x1D1F2356d94325FafBe1C022F728bf07B415A5F1', qty : 4},
        { address : '0x33895f4A011497460865d8A08608a8870A503b7F', qty : 4},
        { address : '0x92a293f563872671750060Ab5935e1117c3f7294', qty : 4},
        { address : '0xd865C9b31B5d0232fFdB8D2Db8D8006FEB955935', qty : 4},
        { address : '0x62b615759E6Ba4754d33d69F799AAf386a6EF279', qty : 4},
        { address : '0xCd43AdcB61949ab14D3f4574BFbDA53d46389715', qty : 5},
        { address : '0xd4F1AcE4299fE40566aDF8813a46f48bB0383e37', qty : 4},
        { address : '0xbF9A9d3D1A330AE27c5d9632A17F20D129c40209', qty : 4},
        { address : '0x23AEb45378AD26437cE1c3dD0ac4A015E9865596', qty : 4},
        { address : '0xc5915dd28886523DCf96Bc29B5bFb1a77c4166D8', qty : 4},
        { address : '0xf3C11bA805765Bd0aFce51f605FfDe875e04ef17', qty : 4}       
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