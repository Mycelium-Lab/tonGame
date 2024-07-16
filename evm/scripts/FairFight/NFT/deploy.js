const { ethers } = require("hardhat");

async function main() {
    const decimals = 18
    const collector = '0xE8D562606F35CB14dA3E8faB1174F9B5AE8319c4'
    const charactersBaseURI = 'https://ipfs.io/ipfs/QmVVzQ5kUJ8cArTTgj5gCZ1kp42Fo4FWUfXLM386vDBT6T/'
    const armorsBaseURI = 'https://ipfs.io/ipfs/QmSyjEq4hkGESu8eZDvBJA4VgZsixKzYJxSyNLYVYUTuci/'
    const bootsBaseURI = 'https://ipfs.io/ipfs/QmfF3VLRTFJkVadJFPuykkv4m11DBHXnCo9V6PAZAGyBsE/'
    const weaponsBaseURI = 'https://ipfs.io/ipfs/QmQ9zM41VRfDWLNXQPcsYm55NyLHfoQJDdbyP2wKDrMMnV/'
    const token = "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3"
    const FFNFT = await ethers.getContractFactory("FairFightNFT")
    const Shop = await ethers.getContractFactory("FairFightShop")
    const characters = await FFNFT.deploy("FairFightCharacters", "FFC", charactersBaseURI, ethers.constants.MaxUint256)
    const armors = await FFNFT.deploy("FairFightArmor", "FFA", armorsBaseURI, ethers.constants.MaxUint256)
    const boots = await FFNFT.deploy("FairFightBoots", "FFB", bootsBaseURI, ethers.constants.MaxUint256)
    const weapons = await FFNFT.deploy("FairFightWeapons", "FFW", weaponsBaseURI, ethers.constants.MaxUint256)
    await characters.deployed()
    console.log(`Characters deployed on address: ${characters.address}`)
    await armors.deployed()
    console.log(`Armors deployed on address: ${armors.address}`)
    await boots.deployed()
    console.log(`Boots deployed on address: ${boots.address}`)
    await weapons.deployed()
    console.log(`Weapons deployed on address: ${weapons.address}`)
    let charactersPrices = [
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
    ]
    let armorsPrices = [
        Math.round(2.99 * 10**decimals).toString(),
        Math.round(9.9 * 10**decimals).toString(),
        Math.round(17.9 * 10**decimals).toString(),
        Math.round(29.9 * 10**decimals).toString(),
        Math.round(34.9 * 10**decimals).toString(),
        Math.round(47.9 * 10**decimals).toString(),
        Math.round(77.7 * 10**decimals).toString(),
        Math.round(99.9 * 10**decimals).toString(),
        Math.round(9 * 10**decimals).toString(),
        Math.round(9 * 10**decimals).toString(),
        Math.round(22 * 10**decimals).toString(),
        Math.round(24 * 10**decimals).toString(),
        Math.round(4 * 10**decimals).toString(),
        Math.round(5 * 10**decimals).toString(),
        Math.round(8 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(45 * 10**decimals).toString(),
        Math.round(5 * 10**decimals).toString(),
        Math.round(24 * 10**decimals).toString(),
        Math.round(45 * 10**decimals).toString(),
        Math.round(45 * 10**decimals).toString(),
        Math.round(8 * 10**decimals).toString(),
        Math.round(3 * 10**decimals).toString(),
        Math.round(50 * 10**decimals).toString(),
        Math.round(55 * 10**decimals).toString(),
        Math.round(3.5 * 10**decimals).toString(),
        Math.round(70 * 10**decimals).toString(),
        Math.round(2.5 * 10**decimals).toString(),
        Math.round(25 * 10**decimals).toString(),
        Math.round(3.5 * 10**decimals).toString(),
        Math.round(30 * 10**decimals).toString(),
        Math.round(65 * 10**decimals).toString(),
        Math.round(75 * 10**decimals).toString()
    ]
    let bootsPrices = [
        Math.round(4.3 * 10**decimals).toString(),
        Math.round(9.9 * 10**decimals).toString(),
        Math.round(17.9 * 10**decimals).toString(),
        Math.round(31.9 * 10**decimals).toString(),
        Math.round(51.9 * 10**decimals).toString(),
        Math.round(65.9 * 10**decimals).toString(),
        Math.round(77.7 * 10**decimals).toString(),
        Math.round(99.9 * 10**decimals).toString(),
        Math.round(4 * 10**decimals).toString(),
        Math.round(44 * 10**decimals).toString(),
        Math.round(9 * 10**decimals).toString(),
        Math.round(70 * 10**decimals).toString(),
        Math.round(20 * 10**decimals).toString(),
        Math.round(44 * 10**decimals).toString(),
        Math.round(19 * 10**decimals).toString(),
        Math.round(72 * 10**decimals).toString(),
        Math.round(68 * 10**decimals).toString(),
        Math.round(70 * 10**decimals).toString(),
        Math.round(65 * 10**decimals).toString(),
        Math.round(21 * 10**decimals).toString(),
        Math.round(18 * 10**decimals).toString(),
        Math.round(20 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(8 * 10**decimals).toString(),
        Math.round(10 * 10**decimals).toString(),
        Math.round(9 * 10**decimals).toString(),
        Math.round(50 * 10**decimals).toString(),
        Math.round(48 * 10**decimals).toString(),
        Math.round(44 * 10**decimals).toString(),
        Math.round(68 * 10**decimals).toString(),
        Math.round(21 * 10**decimals).toString(),
        Math.round(8 * 10**decimals).toString(),
        Math.round(45 * 10**decimals).toString()
    ]
    let weaponsPrices = [
        Math.round(4.9 * 10**decimals).toString(),
        Math.round(4.2 * 10**decimals).toString(),
        Math.round(15.5 * 10**decimals).toString(),
        Math.round(3.7 * 10**decimals).toString(),
        Math.round(18.99 * 10**decimals).toString(),
        Math.round(22.9 * 10**decimals).toString(),
        Math.round(22.9 * 10**decimals).toString(),
        Math.round(25.9 * 10**decimals).toString(),
        Math.round(27.9 * 10**decimals).toString(),
        Math.round(29.9 * 10**decimals).toString(),
        Math.round(26.9 * 10**decimals).toString(),
        Math.round(39.9 * 10**decimals).toString(),
        Math.round(29.9 * 10**decimals).toString(),
        Math.round(77.9 * 10**decimals).toString(),
        Math.round(32.99* 10**decimals).toString(),
        Math.round(42.99* 10**decimals).toString(),
        Math.round(49.99* 10**decimals).toString(),
        Math.round(27* 10**decimals).toString(),
        Math.round(40* 10**decimals).toString(),
        Math.round(72.99* 10**decimals).toString(),
        Math.round(24* 10**decimals).toString(),
        Math.round(33.99* 10**decimals).toString(),
        Math.round(51.99* 10**decimals).toString(),
        Math.round(14.99* 10**decimals).toString(),
        Math.round(35.99* 10**decimals).toString(),
        Math.round(74.99* 10**decimals).toString(),
        Math.round(22.99* 10**decimals).toString(),
        Math.round(39.99* 10**decimals).toString(),
        Math.round(73.99* 10**decimals).toString(),
        Math.round(19.99* 10**decimals).toString(),
        Math.round(28.99* 10**decimals).toString(),
        Math.round(29.5* 10**decimals).toString(),
        Math.round(86.99* 10**decimals).toString(),
        Math.round(12.99* 10**decimals).toString(),
        Math.round(15.99* 10**decimals).toString(),
        Math.round(40.99* 10**decimals).toString(),
        Math.round(35.99* 10**decimals).toString(),
        Math.round(17.99* 10**decimals).toString(),
        Math.round(60.99* 10**decimals).toString(),
        Math.round(18.99* 10**decimals).toString(),
        Math.round(24.99* 10**decimals).toString(),
        Math.round(13.99* 10**decimals).toString(),
        Math.round(59.9* 10**decimals).toString(),
        Math.round(23.99* 10**decimals).toString(),
        Math.round(27.99* 10**decimals).toString(),
        Math.round(18.99* 10**decimals).toString(),
        Math.round(27.99* 10**decimals).toString(),
        Math.round(82.99* 10**decimals).toString(),
        Math.round(56.99* 10**decimals).toString(),
        Math.round(66.9* 10**decimals).toString(),
        Math.round(39.99* 10**decimals).toString(),
        Math.round(99.99* 10**decimals).toString(),
        Math.round(20.99* 10**decimals).toString(),
        Math.round(27.99* 10**decimals).toString(),
        Math.round(33.99* 10**decimals).toString(),
        Math.round(37.99* 10**decimals).toString(),
        Math.round(16.99* 10**decimals).toString(),
        Math.round(25.99* 10**decimals).toString(),
        Math.round(15.99* 10**decimals).toString(),
        Math.round(16.99* 10**decimals).toString(),
        Math.round(24.99* 10**decimals).toString(),
        Math.round(31.99* 10**decimals).toString(),
        Math.round(63.99* 10**decimals).toString(),
        Math.round(17.99* 10**decimals).toString(),
        Math.round(28.99* 10**decimals).toString(),
        Math.round(13.99* 10**decimals).toString(),
        Math.round(16.99* 10**decimals).toString(),
        Math.round(59.99* 10**decimals).toString(),
        Math.round(61.99* 10**decimals).toString(),
        Math.round(42.99* 10**decimals).toString(),
        Math.round(36.99* 10**decimals).toString(),
        Math.round(5.99* 10**decimals).toString(),
        Math.round(12.99* 10**decimals).toString(),
        Math.round(22.99* 10**decimals).toString(),
        Math.round(17.99* 10**decimals).toString(),
        Math.round(38.99* 10**decimals).toString(),
        Math.round(62.99* 10**decimals).toString(),
        Math.round(29.99* 10**decimals).toString(),
        Math.round(75.99* 10**decimals).toString(),
        Math.round(72.99* 10**decimals).toString(),
        Math.round(53.99* 10**decimals).toString(),
        Math.round(30.99* 10**decimals).toString(),
        Math.round(35.99* 10**decimals).toString(),
        Math.round(70.99* 10**decimals).toString(),
        Math.round(74.99* 10**decimals).toString(),
        Math.round(3.99* 10**decimals).toString(),
        Math.round(4.99* 10**decimals).toString(),
        Math.round(11.99* 10**decimals).toString(),
        Math.round(4.49* 10**decimals).toString(),
        Math.round(3.33* 10**decimals).toString(),
        Math.round(4.99* 10**decimals).toString(),
        Math.round(9.99* 10**decimals).toString(),
        Math.round(23.99* 10**decimals).toString(),
        Math.round(4.39* 10**decimals).toString(),
        Math.round(10.99* 10**decimals).toString(),
        Math.round(19.99* 10**decimals).toString(),
        Math.round(15.99* 10**decimals).toString(),
        Math.round(3* 10**decimals).toString(),
        Math.round(32.99* 10**decimals).toString(),
        Math.round(33.99* 10**decimals).toString(),
        Math.round(55.55* 10**decimals).toString(),
        Math.round(17.99* 10**decimals).toString(),
        Math.round(66.66* 10**decimals).toString(),
        Math.round(69.99* 10**decimals).toString(),
        Math.round(39.99* 10**decimals).toString(),
        Math.round(63.99* 10**decimals).toString(),
        Math.round(74.99* 10**decimals).toString(),
        Math.round(22.22* 10**decimals).toString(),
        Math.round(79.99* 10**decimals).toString(),
        Math.round(44.9* 10**decimals).toString(),
        Math.round(95.99* 10**decimals).toString(),
        Math.round(27.99* 10**decimals).toString(),
        Math.round(82.99* 10**decimals).toString(),
        Math.round(13.99* 10**decimals).toString(),
        Math.round(23.99* 10**decimals).toString(),
        Math.round(73.99* 10**decimals).toString(),
        Math.round(8.99* 10**decimals).toString(),
        Math.round(12.99* 10**decimals).toString(),
        Math.round(19.99* 10**decimals).toString(),
        Math.round(6.99* 10**decimals).toString(),
        Math.round(99.99* 10**decimals).toString(),
        Math.round(99.99* 10**decimals).toString(),
        Math.round(22.22* 10**decimals).toString(),
        Math.round(88.88* 10**decimals).toString(),
        Math.round(25* 10**decimals).toString(),
        Math.round(16.99* 10**decimals).toString(),
        Math.round(75* 10**decimals).toString(),
        Math.round(18.99* 10**decimals).toString(),
        Math.round(23.99* 10**decimals).toString(),
        Math.round(47.5* 10**decimals).toString(),
        Math.round(30* 10**decimals).toString(),
        Math.round(44.99* 10**decimals).toString(),
        Math.round(99* 10**decimals).toString()
    ]
    const shop = await Shop.deploy(
        characters.address,
        weapons.address,
        armors.address,
        boots.address,
        token,
        charactersPrices,
        weaponsPrices,
        armorsPrices,
        bootsPrices,
        collector
    )
    await shop.deployed()
    console.log(`Shop deployed on address: ${shop.address}`)
    await characters.setAllowedMint(shop.address, true)
    console.log(`Set allowed mint characters`)
    await armors.setAllowedMint(shop.address, true)
    console.log(`Set allowed mint armors`)
    await weapons.setAllowedMint(shop.address, true)
    console.log(`Set allowed mint weapons`)
    await boots.setAllowedMint(shop.address, true)
    console.log(`Set allowed mint boots`)
    console.log(`Characters deployed to ${characters.address}`)
    console.log(`Armors deployed to ${armors.address}`)
    console.log(`Boots deployed to ${boots.address}`)
    console.log(`Weapons deployed to ${weapons.address}`)
    console.log(`Shop deployed to ${shop.address}`)
}

main()
    .catch(err => console.log(err))