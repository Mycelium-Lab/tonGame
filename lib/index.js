import { contractAbi, ERC20 } from './contract.js'
import { networks } from './modules/networks.js'
import { tokens } from './modules/tokens.js';
import { addOnlyWalletToLocalStorage, addWalletToLocalStorage, calcAmountWithDecimals, createShortAddress, getAccountFromLocalStorage, getWalletTypeFromLocalStorage, msgSignIn, removeWalletFromLocalStorage, shortFloat, WalletTypes } from './src/utils/utils.js'
import { openFightsFunc } from './src/openFights.js';
import { pastFightsFunc } from './src/pastFights.js';
import * as sapphire from '@oasisprotocol/sapphire-paratime'
//import WalletConnectProvider from "@walletconnect/web3-provider";
import { shop } from './src/shop.js';
import { inventory } from './src/inventory.js'
import { modalWindow } from './src/modules/modal.js'
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { mainF2PEvm } from './src/f2p-evm/index.js';


const mobileAndTabletCheck = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

export const isDesktop = window.innerWidth > 1024

localStorage.removeItem('setted-armor')
localStorage.removeItem('setted-weapon')
localStorage.removeItem('setted-boots')
let network = networks.find(n => n.chainid == 42161);
if (window.location.search.includes('network')) {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let networkID = params.network
  network = networks.find(n => n.chainid == networkID)
}
let selectedToken = {}
let approved = true;
let amountWithDecimals;

$(document).ready(async function () {
// await  openFightsFunc('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'contract', {
//         name: "Hardhat",
//         chainid: 31337,
//         rpc: 'http://localhost:8545',
//         currency: 'ETH',
//         explorer: 'https://etherscan.io',
//         contractAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
//         charactersAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
//         armorsAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
//         bootsAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
//         weaponsAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
//         shopAddress: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
//         lootboxAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
//         multicallNFT: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
//     }, 'signer', sapphire.wrap, {}).catch(err => console.log(err))
//   await pastFightsFunc('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', contract, {
//         name: "Hardhat",
//         chainid: 31337,
//         rpc: 'http://localhost:8545',
//         currency: 'ETH',
//         explorer: 'https://etherscan.io',
//         contractAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
//         charactersAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
//         armorsAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
//         bootsAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
//         weaponsAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
//         shopAddress: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
//         lootboxAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
//         multicallNFT: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
//     }, 'signer', undefined).catch(err => console.log(err))
//   await mainF2PEvm('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', {
//         name: "Hardhat",
//         chainid: 31337,
//         rpc: 'http://localhost:8545',
//         currency: 'ETH',
//         explorer: 'https://etherscan.io',
//         contractAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
//         charactersAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
//         armorsAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
//         bootsAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
//         weaponsAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
//         shopAddress: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
//         lootboxAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
//         multicallNFT: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
//     }, 'sign')

//   setTimeout(() => {
//     const infos = document.querySelectorAll('[data-fight]')
//     const infoModal = document.getElementById('info_modal')
//     infos.forEach((info) => {
//       info.addEventListener('click', async (ev) => {
//         const fightId =  ev.target.dataset.fight
//         infoModal.style.display = 'flex'
//         localStorage.setItem('fight_id', fightId)
//         await pastFightsFunc('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', contract, {
//         name: "Hardhat",
//         chainid: 31337,
//         rpc: 'http://localhost:8545',
//         currency: 'ETH',
//         explorer: 'https://etherscan.io',
//         contractAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
//         charactersAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
//         armorsAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
//         bootsAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
//         weaponsAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
//         shopAddress: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
//         lootboxAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
//         multicallNFT: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
//     }, 'signer').catch(err => console.log(err))
//       })
//     })
//   }, 300)
//   shop('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', {
//     name: "Hardhat",
//     chainid: 31338,
//     rpc: 'http://localhost:8545',
//     currency: 'ETH',
//     explorer: 'https://etherscan.io',
//     contractAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
//     charactersAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
//     armorsAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
//     bootsAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
//     weaponsAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
//     shopAddress: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
//     lootboxAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
//     multicallNFT: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
// }, 'signer', sapphire.wrap, false).catch(err => console.log(err))

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.getElementById('hamburger-overlay').classList.remove('modal-overlay_active')
    document.getElementById('menu-body').classList.remove('menu__box_active')
  });

  let isMobile = mobileAndTabletCheck()
  let address = getAccountFromLocalStorage()
  let walletType = getWalletTypeFromLocalStorage() 
  //baseProvider is either window.ethereum or EthereumClient from walletconnect
  let baseProvider
  //provider is ethers.Web3Provider
  let provider
  let contract
  let signer
  //button that opens the wallet selection
  let ConnectButton = document.querySelector('#connect')
  //wallet disconnect
  let ExitButton = document.querySelector('#network-disconnect')
  let DisconnectAddress = document.querySelector('#disconnect-address')
  //wallet selection modal
  let connectModal = document.querySelector('#install_wallet_modal')



  // const aboutLink = document.getElementById('about_link')
  // aboutLink.onclick = function () {
  //   const aboutModal = document.getElementById("about_modal");
  //   const spanInstall = document.getElementsByClassName("close_modal_window")[3];
  //   aboutModal.style.display = "flex";
  //   spanInstall.onclick = function () {
  //     aboutModal.style.display = "none";
  //   }
  //   window.onclick = function (event) {
  //       if (event.target == aboutModal) {
  //         aboutModal.style.display = "none";
  //       }
  //   }
  // }
  //TODO: оборачивать в sapphire.wrap() если сеть сапфир
  //TODO: смена сети
  if (window.ethereum) {
    window.ethereum.on('chainChanged', function (chaindid) {
      if (networks.find(n => n.chainid == chaindid)) {
        window.location = `/?network=${chaindid.toString()}`
      }
    })
    window.ethereum.on('accountsChanged', function (chaindid) {
      window.location.reload()
    })
  }

  //create walletconnectV2 connection
  const walletConnectFunction = async () => {
    try {
      connectModal.style.display = 'none'
      const _provider = await EthereumProvider.init({
          projectId:'9886e2654e7f10b0bcb4e0282fcc696c', // REQUIRED your projectId
          chains: [23294], // REQUIRED chain ids
          optionalChains: [42262, 503129905, 56, 204, 137, 97, 42161, 1440002],
          showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal,
          qrModalOptions: { 
            themeMode: "light",
            themeVariables: {
                // "--wcm-overlay-background-color": "#FF7C06",
                "--wcm-accent-color": "#FF7C06",
                // "--wcm-accent-fill-color": "#FF7C06",
                "--wcm-background-color": "#FF7C06"
            }
          },
          rpcMap: {
            '503129905': 'https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird',
            '42262': 'https://emerald.oasis.dev',
            '23294': 'https://sapphire.oasis.io',
            '56': 'https://bsc-dataseed.binance.org',
            '204': 'https://opbnb-mainnet-rpc.bnbchain.org',
            '137': 'https://polygon-rpc.com',
            '355113': 'https://testnet.bitfinity.network',
            '97': 'https://bsc-testnet.publicnode.com',
            '42161': 'https://arb1.arbitrum.io/rpc',
            '1440002': 'https://rpc-evm-sidechain.xrpl.org'
          },
          optionalMethods: ['wallet_switchEthereumChain', 'wallet_addEthereumChain'],
          optionalEvents: ['accountsChanged']
      })
      await _provider.enable()
      provider = new ethers.providers.Web3Provider(_provider)
      signer = await provider.getSigner()
      contract = new ethers.Contract(network.contractAddress, contractAbi, signer)
      address = await signer.getAddress()
      addWalletToLocalStorage(address, WalletTypes.WALLET_CONNECT)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  //check if we already connected (account stores in localStorage)
  if (address !== null) {
    DisconnectAddress.textContent = createShortAddress(address)
    //update info about chain, account, provider, contract, signer
    //WalletTypes.INJECTED is metamask usually
    if (walletType === WalletTypes.INJECTED) {
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner()
        contract = new ethers.Contract(network.contractAddress, contractAbi, signer)
        baseProvider = window.ethereum
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        // localStorage.clear()
        const _provider = await EthereumProvider.init({
          projectId:'9886e2654e7f10b0bcb4e0282fcc696c', // REQUIRED your projectId
          chains: [23294], // REQUIRED chain ids
          optionalChains: [42262, 503129905, 56, 204, 137, 97, 42161, 1440002],
          showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal,
          rpcMap: {
            '503129905': 'https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird',
            '42262': 'https://emerald.oasis.dev',
            '23294': 'https://sapphire.oasis.io',
            '56': 'https://bsc-dataseed.binance.org',
            '204': 'https://opbnb-mainnet-rpc.bnbchain.org',
            '137': 'https://polygon-rpc.com',
            '355113': 'https://testnet.bitfinity.network',
            '97': 'https://bsc-testnet.publicnode.com',
            '42161': 'https://arb1.arbitrum.io/rpc',
            '1440002': 'https://rpc-evm-sidechain.xrpl.org'
          },
          optionalMethods: ['wallet_switchEthereumChain', 'eth_requestAccounts','eth_accounts', 'wallet_addEthereumChain'],
          optionalEvents: ['accountsChanged']
        })
        console.log('here')
        await _provider.enable()
        baseProvider = _provider
        provider = new ethers.providers.Web3Provider(_provider)
        signer = await provider.getSigner()
        address = await signer.getAddress()
        addWalletToLocalStorage(address, WalletTypes.WALLET_CONNECT)
        contract = new ethers.Contract(network.contractAddress, contractAbi, signer)
      } catch (error) {
        window.location.reload()
      }
    }
    // ConnectButton.textContent = createShortAddress(address)
    ExitButton.addEventListener('click', async () => {
      if (walletType === WalletTypes.WALLET_CONNECT) {
        const _provider = await EthereumProvider.init({
          projectId:'9886e2654e7f10b0bcb4e0282fcc696c', // REQUIRED your projectId
          chains: [23294], // REQUIRED chain ids
          optionalChains: [42262, 503129905, 56, 204, 137, 97, 42161, 1440002],
          showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal,
          rpcMap: {
            '503129905': 'https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird',
            '42262': 'https://emerald.oasis.dev',
            '23294': 'https://sapphire.oasis.io',
            '56': 'https://bsc-dataseed.binance.org',
            '204': 'https://opbnb-mainnet-rpc.bnbchain.org',
            '137': 'https://polygon-rpc.com',
            '355113': 'https://testnet.bitfinity.network',
            '97': 'https://bsc-testnet.publicnode.com',
            '42161': 'https://arb1.arbitrum.io/rpc',
            '1440002': 'https://rpc-evm-sidechain.xrpl.org'
          },
          optionalMethods: ['wallet_switchEthereumChain', 'eth_requestAccounts','eth_accounts', 'wallet_addEthereumChain'],
          optionalEvents: ['accountsChanged']
        })
        await _provider.enable()
        await _provider.disconnect()
      }
      localStorage.clear()
      window.location.reload()
    })
  } else {
    //if we dont have connected account
    ExitButton.style.display = 'none'
    //if mobile then just walletconnect
    ConnectButton.addEventListener('click', async () => {
      connectModal.style.display = 'block'
      document.querySelector('#connect-modal-close').addEventListener('click', () => connectModal.style.display = 'none')
    })
    let metamaskConnect = document.querySelector('#metamask')
    // if (isMobile) metamaskConnect.style.display = 'none'
    let walletConnect = document.querySelector('#walletconnect')
    metamaskConnect.addEventListener('click', async () => {
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner()
        contract = new ethers.Contract(network.contractAddress, contractAbi, signer)
        let address = await signer.getAddress()
        addWalletToLocalStorage(address, WalletTypes.INJECTED)
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    })
    walletConnect.addEventListener('click', walletConnectFunction)
  }
  let tokenListHTML;
  let tokenListHTML2;
  let networkTokens;
  let networkTokensList
  const btn = document.getElementById("btn_modal_window");
  const btnMobile = document.getElementById("btn_modal_window_mobile");
  try {
    //remove the Buy ROSE modal if the network is not oasis
    if (network.chainid == 42262 || network.chainid == 42261) {
      document.getElementById('howtobuy-show').style.display = 'block'
    } else {
      document.getElementById('howtobuy-show').style.display = 'none'
    }
    let dropDownButton = document.getElementsByClassName('dropdown-wrapper')[0]
    const dropDownCheck = document.getElementById('dropdown-check')
    const dropDownMenu = document.getElementById('networks')
    window.addEventListener ("click", (event) => {
      const classes = Array.from(event.target.classList)
      if (!classes.includes('dropdown-element')) {
        dropDownMenu.classList.remove('network_open');
      }
    })
    function openNetwork() {
  
      const isOpen = dropDownMenu.classList.contains('network_open');
  
      if (isOpen) {
        // Если класс "open" уже есть, удаляем его, чтобы закрыть выпадающий список
        dropDownMenu.classList.remove('network_open');
      } else {
        // Если класса "open" нет, добавляем его, чтобы открыть выпадающий список
          dropDownMenu.classList.add('network_open');
      }
    }
    dropDownCheck.addEventListener("click", (event) => {
      openNetwork();
    })
    // dropDownButton.addEventListener("click", (event) => {
    //   if (event.target !== dropDownCheck) {
    //     dropDownCheck.checked = dropDownCheck.checked ? false : true
    //   }
    // })

    // const connectButton = document.getElementById('connect')
    // const walletDisconnect = document.getElementById("disconnect")
    
    // if(walletDisconnect.style.display === 'none') {
    //   connectButton.style.display = 'block'
    //   dropDownButton.style.display = 'none'
    // }

    window.addEventListener ("click", (event) => {
      const classes = Array.from(event.target.classList)
      if (!classes.includes('dropdown-element')) {
        dropDownMenu.classList.remove('network_open');
      }
   })

   document.querySelector('#approve_modal_close_btn').addEventListener('click', () => {
      document.querySelector('#approve_modal').style.display = 'none'
   })

    dropDownCheck.addEventListener("click", (event) => {
      openNetwork();
    })
    //CREATE GAME MODAL
    const modal = document.getElementById("my_modal");
    //if provider is not connected than when click on NEW GAME btn opens connect wallet modal
    if (!provider) {
      document.getElementById("opengames_empty").style.display = ''
      document.getElementById("opengames").classList.add("empty")
      document.getElementById("pastgames_empty").style.display = ''
      document.getElementById("pastgames").classList.add("empty")
    }

    const hamburger = document.getElementById('hamburger')
    const hamburgerOverlay = document.getElementById('hamburger-overlay')
    const menuBody = document.getElementById('menu-body')
    const menuClose = document.getElementById('menu__close')
    hamburger.onclick = function () {
      menuBody.classList.add('menu__box_active')
      hamburgerOverlay.classList.add('modal-overlay_active')
    }

    /*const selectMap = document.querySelector('#map')
    selectMap.addEventListener('click', () => {
      if(document.querySelector('#select-chevron').style.transform === 'rotate(180deg)') {
        document.querySelector('#select-chevron').style.transform = 'rotate(0deg)'
      }
      else {
        document.querySelector('#select-chevron').style.transform = 'rotate(180deg)'
      }
    })*/

    function hideMenu (ev) {
      ev.stopPropagation(); 
      hamburgerOverlay.classList.remove('modal-overlay_active')
      menuBody.classList.remove('menu__box_active')
    }
   
    hamburgerOverlay.addEventListener('click', hideMenu)

    menuClose.addEventListener('click', hideMenu)

    const networkIcon = document.getElementById('network_icon')
    document.getElementById('network_name').textContent = network.name
    networkTokens = tokens.find(v => v.chaindid == network.chainid)
    networkTokensList =  [...networkTokens.list]
    networkIcon.src = ''
    if (network.chainid == 42262 || network.chainid == 23294 || network.chainid == 355113) {
      networkIcon.src = 'media/svg/emerald.svg'
      networkTokensList.pop()
    }
    if(network.chainid == 503129905) {
      networkIcon.src = 'media/svg/scale.svg'
    }
    if(network.chainid == 56) {
      networkIcon.src = 'media/svg/bnb.svg'
    }
    if(network.chainid == 137) {
      networkIcon.src = 'media/svg/polygon.svg'
    }
    if (network.chainid == 355113) {
      networkIcon.src = 'media/svg/bitfinity.svg'
    }
    if(network.chainid == 204) {
      networkIcon.src = 'media/svg/bnb.svg'
    }
    if(network.chainid == 97) {
      networkIcon.src = 'media/svg/bnb.svg'
    }
    if (network.chainid == 42161) {
    }
    tokenListHTML = document.getElementById('select-token-list')
    tokenListHTML2 = document.getElementById('select-token-list2')
    selectedToken = {
      address: networkTokensList[0].address,
      symbol: networkTokensList[0].symbol,
      decimals: networkTokensList[0].decimals,
      src: networkTokensList[0].src
    }
    document.getElementsByName('amountPerDeath')[0].placeholder = selectedToken.symbol
    btn.addEventListener('click', openNewGame)
    btnMobile.addEventListener('click', openNewGame)
    const totalPrizePoolToken = document.querySelector('#totalPrizePoolToken')
    const yourDepositToken = document.querySelector('#yourDepositToken')
    function openNewGame() {
      showHideBgImages(this.id)
      
      const walletDisconnect = document.getElementById("disconnect")
      if (walletDisconnect.style.display === 'none') {
        const installModal = document.getElementById("install_wallet_modal");
        const spanInstall = document.getElementsByClassName("close_modal_window")[3];
        installModal.style.display = "flex";
        spanInstall.onclick = function () {
          installModal.style.display = "none";
        }
      } else {
      ConnectButton.style.display = 'none'
      // const changeNetworkBtn = document.getElementById("disconnect")
      // changeNetworkBtn.style.display = 'flex'
      // const changeNetworkModal = document.getElementById('change_netowrk_modal')
      // const changeNetworkDropdown  = document.getElementById('dropdown-change-network')
      // const changeNetwork = document.getElementById('change-network')
      // changeNetworkBtn.onclick = function () {
      //   if(changeNetworkDropdown.style.display === 'none') {
      //     changeNetworkDropdown.style.display = 'flex'
      //   } else {
      //   modal.style.display = "flex";
      //   modal.style.alignItems = "center";
      //   }
      // }
      }
    }

    function showHideBgImages(id) {      
      if (window.innerWidth > 500) {
        const bgImg1 = document.querySelector('.my_modal-bg-1');
        const bgImg2 = document.querySelector('.my_modal-bg-2');
        document.getElementById('player-visible-element').classList.add('d-none');
        if (id === 'btn_modal_window') {
          bgImg1.style.display = 'block';
          bgImg2.style.display = 'none';
        }
      }
    }

    ConnectButton.onclick = function () {
      const installModal = document.getElementById("install_wallet_modal");
      const spanInstall = document.getElementsByClassName("close_modal_window")[3];
      installModal.style.display = "flex";
      spanInstall.onclick = function () {
        installModal.style.display = "none";
      }
      window.onclick = function (event) {
          if (event.target == installModal) {
            installModal.style.display = "none";
          }
      }
    }
    
    const changeNetworkBtn = document.getElementById("disconnect")
    const changeNetworkModal = document.getElementById('change_netowrk_modal')
    const changeNetworkDropdown  = document.getElementById('dropdown-change-network')
    const changeNetwork = document.getElementById('change-network')
    changeNetworkBtn.onclick = function () {
      if(changeNetworkDropdown.style.display === 'none') {
        changeNetworkDropdown.style.display = 'flex'
      }
        else {
          console.log(changeNetworkDropdown.style.display)
          changeNetworkDropdown.style.display = 'none'
        }
        /*changeNetworkModal.style.display = 'flex'*/
        const name = document.getElementById('network_name')
        const networkNameWrapper = document.getElementById('network-name-wrapper')
        const address = document.getElementById('disconnect-address')
        const _change_netowrk_modal = document.getElementById("change_netowrk_modal")
          window.onclick = function (event) {
            if (event.target == _change_netowrk_modal) {
              _change_netowrk_modal.style.display = 'none'
            }
            if (event.target !== name && event.target !== address && event.target !== networkNameWrapper) {
              changeNetworkDropdown.style.display = "none";
            }
            }
      }

      changeNetwork.onclick = function () {
        changeNetworkModal.style.display = 'flex'
      }
      if (baseProvider) {
        baseProvider.on('accountsChanged', async (accounts) => {
          addOnlyWalletToLocalStorage(accounts[0])
          console.log(accounts[0])
          window.location.reload()
        })
        baseProvider.on('chainChanged', (data) => {
          const _network = networks.find(n => n.chainid == parseInt(data))
          if (_network) {
            const newLocation = _network.chainid === 42262 ? `/` : `/?network=${_network.chainid}`
            if (!window.location.href.includes(newLocation)) {
              window.location = newLocation
            }
          } else {
            window.location = '/'
          }
        })
      }
      //set chosen network on select list
      document.getElementById('createGame').textContent = 'Create'
      const networkSelect = document.getElementById('networks').getElementsByClassName('network-deactive')
      for (let i = 0; i < networkSelect.length; i++) {
        if (networkSelect.item(i).id.includes(network.chainid)) {
          networkSelect.item(i).classList.replace('network-deactive','network-active')
        }
      } 
      networkTokens = tokens.find(v => v.chaindid == network.chainid)
      //in game we can use different tokens
      //here we take tokens depending on the network
      networkTokensList =  [...networkTokens.list]
      if (network.chainid == 42262 || network.chainid == 23294 || network.chainid == 355113) networkTokensList.pop()
      tokenListHTML = document.getElementById('select-token-list')
      tokenListHTML2 = document.getElementById('select-token-list2')
      selectedToken = {
        address: networkTokensList[0].address,
        symbol: networkTokensList[0].symbol,
        decimals: networkTokensList[0].decimals,
        src: networkTokensList[0].src
      }
      document.getElementById('network_name').textContent = network.name
      //first token in list is always placeholder for chosen token
      document.getElementsByName('amountPerDeath')[0].placeholder = selectedToken.symbol
      btn.addEventListener('click', openNewGameModal) 
      btnMobile.addEventListener('click', openNewGameModal)

      const btnMobileF2P = document.getElementById("btn_modal_window_mobile_f2p")
      btnMobileF2P.addEventListener('click', () => {
        modal.style.display = 'flex'
        const f2p_checker = document.querySelector('#f2p_checker').checked
        const createGameBtnF2P = document.querySelector('#createGame-f2p-evm')
        const createGameBtn = document.querySelector('#createGame')
        if (f2p_checker) {
          createGameBtnF2P.style.display = ''
          createGameBtn.style.display = 'none'
        } else {
          createGameBtnF2P.style.display = 'none'
          createGameBtn.style.display = ''
        }
      })

      function openNewGameModal () {
        const tokensDividerNewgameModal = document.querySelector("#tokens-divider-newgame-modal")
        const tokensNewgameModal = document.querySelector("#tokens-newgame-modal")
        const tokensDivider = document.querySelector("#tokens-divider")
        const totalPrizePool = document.querySelector("#total-prize-pool-element")
        const yourDepositElement = document.querySelector("#your-deposit-element")
        const playerVisibleElement = document.querySelector('#player-visible-element')
        const playerVisibleElementMobile = document.querySelector('#player-visible-mobile-element')
        const amountPerRound = document.querySelector('#amountPerDeath')
        const createGameBtn = document.querySelector('#createGame')
        const createGameBtnF2P = document.querySelector('#createGame-f2p-evm')
        if (modal) modal.style.display = "flex";
        if (tokensDividerNewgameModal) tokensDividerNewgameModal.style.display = ''
        if (tokensNewgameModal) tokensNewgameModal.style.display = ''
        if (tokensDivider) tokensDivider.style.display = ''
        if (totalPrizePool) totalPrizePool.style.display = ''
        if (yourDepositElement) yourDepositElement.style.display = ''
        if (playerVisibleElement) playerVisibleElement.style.display = ''
        if (playerVisibleElementMobile) playerVisibleElementMobile.style.display = ''
        if (amountPerRound) amountPerRound.placeholder = selectedToken.symbol
        if (createGameBtn) createGameBtn.style.display = ''
        if (createGameBtnF2P) createGameBtnF2P.style.display = 'none'
      }
      //network is not right - change or add than change
      // if (baseProvider.networkVersion ? (baseProvider.networkVersion != network.chainid) : (baseProvider.chainId != network.chainid)) {
        try {
          await baseProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(network.chainid) }]
          })
          // .then(() => window.location.reload())
        } catch (err) {
          console.log(err)
            // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await baseProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: network.name,
                  chainId: ethers.utils.hexValue(network.chainid),
                  nativeCurrency: { name: network.currency, decimals: 18, symbol: network.currency},
                  rpcUrls: [network.rpc]
                }
              ]
            })
            // .then(() => window.location.reload())
          }
        }
      // }
      //if network is sapphire
      //wrap provider to sapphire network wrapper
      if (network.chainid == 23294) {
        provider = sapphire.wrap(provider)
      }
      if (network.chainid == 31337 || network.chainid == 97 || network.chainid == 42161) {
        document.getElementById('tournaments-btn').style.display = ''
        document.getElementById('menu-tournaments-btn').style.display = 'block'
      }
      //create network tokens list on the page
      networkTokensList.forEach((v, i) => {
        let selectTokenButton = document.createElement('button')
        selectTokenButton.id = v.symbol
        selectTokenButton.classList.add('figure')
        if (selectedToken.symbol == v.symbol) {
          selectTokenButton.classList.add('token-active')
        } else {
          selectTokenButton.classList.add('token-deactive')
        }
        let selectTokenIMG = document.createElement('img')
        selectTokenIMG.src = v.src
        selectTokenIMG.id = v.symbol
        selectTokenIMG.alt = v.symbol
        let selectTokenCaption = document.createElement('div')
        selectTokenCaption.classList.add('caption')
        selectTokenCaption.textContent = v.symbol
        selectTokenCaption.id = v.symbol
        selectTokenButton.appendChild(selectTokenIMG)
        selectTokenButton.appendChild(selectTokenCaption)
        if (i < 2) {
          tokenListHTML.appendChild(selectTokenButton)
        } else {
          tokenListHTML2.appendChild(selectTokenButton)
        }
        selectTokenButton.addEventListener('click', async (event) => {
          const newSelectedToken = networkTokensList.find(token => token.symbol == event.target.id)
          document.getElementById(selectedToken.symbol).classList.replace('token-active', 'token-deactive')
          selectedToken.address = newSelectedToken.address
          selectedToken.symbol = newSelectedToken.symbol
          selectedToken.decimals = newSelectedToken.decimals
          selectedToken.src = newSelectedToken.src

          totalPrizePoolToken.textContent = selectedToken.symbol
          totalPrizePoolToken.setAttribute('data-text', selectedToken.symbol)
          yourDepositToken.textContent = selectedToken.symbol
          yourDepositToken.setAttribute('data-text', selectedToken.symbol)
          document.getElementsByName('amountPerDeath')[0].placeholder = selectedToken.symbol
          if (!document.getElementById(selectedToken.symbol).classList.replace('token-deactive', 'token-active')) {
            document.getElementById(selectedToken.symbol).classList.add('token-active')
          }
          const amountToPlay = document.querySelector('#rounds-select-selecter')
          const amountPerDeath = document.getElementById("amountPerDeath")
          if (amountToPlay.getAttribute('data-value') != '' && amountPerDeath.value != '') {
            const _amount = parseFloat(amountPerDeath.value) * parseFloat(amountToPlay.getAttribute('data-value'))
            if (selectedToken.address != ethers.constants.AddressZero) {
              const tokenContract = new ethers.Contract(selectedToken.address, ERC20, signer)
              const allowance = await tokenContract.allowance(address, contract.address)
              amountWithDecimals = (_amount * 10**selectedToken.decimals).toString()
              if (BigInt(allowance) >= BigInt(amountWithDecimals)) {
                approved = true;
                //document.getElementById('createGame').textContent = 'Create'
              } else {
                approved = false;
                document.getElementById('createGame').textContent = 'Approve'
              }
            } else {
              approved = true;
              document.getElementById('createGame').textContent = 'Create'
            }
          } 
        })
      })
      if (tokenListHTML2.children.length == 0) {
        tokenListHTML2.style.display = 'none'
      }
      document.querySelector('#opengames_empty-title').textContent = 'Empty :('
      document.querySelector('#opengames_empty-desc').textContent = 'At the moment, there are no games available for joining. But you can always start your own by clicking the "New game" button above.'
      document.querySelector('#pastgames_empty-title').textContent = 'Empty :('
      document.querySelector('#pastgames_empty-desc').textContent = `That's where your game history will be listed.`
      document.querySelector('#up-menu').style.display = 'none'
      document.querySelector('#down-menu').style.display = 'none'
      if(!isDesktop) {
        // document.querySelector("#hamburger").style.display = ''
        //document.querySelector('#up-menu').style.display = 'block'
        //document.querySelector('#down-menu').style.display = 'block'
        $('#shop-inventory-btns').slick({
          infinite: false,
          vertical: true,
          verticalSwiping: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          initialSlide: 0,
          prevArrow: '#up-menu',
          nextArrow: '#down-menu',
      });
      }
      // if (network.chainid != 8453) {
        document.querySelector("#shop-inventory-btns").style.display = ''
        inventory(address, network, signer, sapphire.wrap).catch(err => console.log(err))
        shop(address, network, signer, sapphire.wrap, isMobile).catch(err => console.log(err))
      // } else {
      //   document.querySelectorAll('.wrapper_banners div').forEach(v => v.style.display = 'none')
      // }
      
//       //just see wallet
      if (address) {
        ConnectButton.style.display = 'none'
      }
      const walletDisconnect = document.getElementById("disconnect")
      document.getElementById("disconnect-address").textContent = address.slice(0, 6) + '...' + address.slice(address.length - 4, address.length);
      walletDisconnect.style.display = ''
      document.getElementById("walletHeader").style.display = "none"
      document.getElementById("createGame").disabled = false;
      const amountToPlayText = document.getElementById("amountToPlayText")
      const amountPerDeathText = document.getElementById("amountPerDeathText")
      amountToPlayText.style.display = ''
      amountPerDeathText.style.display = ''
      const span = document.getElementsByClassName("close_modal_window")[0];
      const spanConfirm = document.getElementsByClassName("close_modal_window")[13];
      const spanPending = document.getElementsByClassName("close_modal_window")[14];
      const spanApprove = document.getElementsByClassName("close_modal_window")[10];
      const spanBuy = document.getElementsByClassName("close_modal_window")[11];
      const chooseCharacter = document.getElementsByClassName("close_modal_window")[12];
      // const spanAirDrop = document.getElementsByClassName("close_modal_window")[5]
      // const airDropModalOpen = document.getElementById("airdrop-modal-open")
      const airDropModal = document.getElementById("airdrop_modal")
      // const getFirstAirDropBtn = document.getElementById("get-first")
      // const getPrizeAirDropBtn = document.getElementById("get-prize")
      // const airDropGetFirstText = document.getElementById("airdrop-getfirst-text")
      // const airDropGetPrizeText = document.getElementById("airdrop-getprize-text")
      const modalConfirm = document.getElementById("confirmation_modal")
      const modalPending = document.getElementById("pending_modal")
      const _error_modal = document.getElementById("error_modal")
      const _about_modal = document.getElementById("about_modal")
      const _connect_modal = document.getElementById("connect_modal")
      const _inventory_block = document.getElementById("inventory-block")
      const _shop_block = document.getElementById("shop-block")
      const _inventory_modal = document.getElementById("inventory-modal")
      const approve_modal = document.getElementById("approve_modal")
      const buy_modal = document.getElementById("buy_modal") 
      const chooseCharacterModal = document.getElementById("choose_character_modal")
      
      spanConfirm.onclick = function () {
          modalConfirm.style.display = "none";
      }
      spanPending.onclick = function () {
          modalPending.style.display = "none";
      }
      // span.onclick = function () {
      //     modalConfirm.style.display = 'none'
      //     modalPending.style.display = 'none'
      //     modal.style.display = "none";
      // }
      spanApprove.onclick = function () {
        approve_modal.style.display = 'none'
      }
      spanBuy.onclick = function () {
        buy_modal.style.display = 'none'
      }
      chooseCharacter.onclick = function () {
        chooseCharacterModal.style.display = 'none'
      }
      // document.querySelector('#inventory-close').addEventListener('click', () => {
      //   console.log('here')
      //   document.querySelector('#inventory-modal').style.display = 'none'
      // })
      window.onclick = function (event) {
          if (event.target == modal) {
              modal.style.display = "none";
          } else if (event.target == modalConfirm) {
              modalConfirm.style.display = 'none'
          } else if (event.target == modalPending) {
              modalPending.style.display = 'none'
          } else if (event.target == _error_modal) {
              _error_modal.style.display = 'none'
          } else if (event.target == _about_modal) {
              _about_modal.style.display = 'none'
          } else if (event.target == _connect_modal) {
              _connect_modal.style.display = 'none'
          } else if (event.target == _shop_block) {
            _shop_block.classList.remove("wrapper__nft-shop-modal-overlay_active")
        }
          else if (event.target == _inventory_block) {
              _inventory_block.classList.remove("active")
          } else if (event.target == _inventory_modal) {
            _inventory_modal.classList.remove('wrapper__inventory-modal-overlay_active')
          }
          else if (event.target == document.getElementById("howtobuy_modal")) {
            document.getElementById("howtobuy_modal").style.display = 'none'
          } else if (event.target == airDropModal) {
            airDropModal.style.display = 'none'
          } else if (event.target == document.getElementById("leaderboard_modal")) {
            document.getElementById("leaderboard_modal").style.display = 'none'
          } else if (event.target == approve_modal) {
            approve_modal.style.display = 'none'
          } else if (event.target == buy_modal) {
            buy_modal.style.display = 'none'
          } else if (event.target == chooseCharacterModal) {
            chooseCharacterModal.style.display = 'none'
          }
      }
      
      /*const buttonClose = document.querySelectorAll('[data-button="close"]')
      let infoModal = document.querySelectorAll('.modal')
      infoModal = Array.from(infoModal)
      Array.from(buttonClose).forEach(button => {

      })*/

      const numberOfPlayers = document.querySelector('#players-select-selecter')
      const amountToPlay = document.querySelector('#rounds-select-selecter')
      const amountPerDeath = document.getElementById("amountPerDeath")
      const totalPrizePool = document.getElementById("totalPrizePool")
      const yourDeposit = document.getElementById("yourDeposit")

      const observerNumberOfPlayer = new MutationObserver((mutations) => {
        mutations.forEach(async (mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
        if (amountToPlay.getAttribute('data-value') != '' && amountPerDeath.value != '' && numberOfPlayers.getAttribute('data-value') != '') {
          const _amount = parseFloat(amountPerDeath.value) * parseFloat(amountToPlay.getAttribute('data-value'))
          const stringAmount = `${shortFloat(_amount * parseInt(numberOfPlayers.getAttribute('data-value')))} `
          totalPrizePool.textContent = stringAmount
          totalPrizePool.dataset.text = stringAmount
          yourDeposit.dataset.text = `${shortFloat(_amount)}`
          yourDeposit.textContent = `${shortFloat(_amount)}`
          totalPrizePoolToken.textContent = selectedToken.symbol
          totalPrizePoolToken.setAttribute('data-text', selectedToken.symbol)
          yourDepositToken.textContent = selectedToken.symbol
          yourDepositToken.setAttribute('data-text', selectedToken.symbol)
          if (selectedToken.address != ethers.constants.AddressZero) {
            const tokenContract = new ethers.Contract(selectedToken.address, ERC20, signer)
            const allowance = await tokenContract.allowance(address, contract.address)
            amountWithDecimals = (_amount * 10**selectedToken.decimals).toString()
            if (BigInt(allowance) >= BigInt(amountWithDecimals)) {
              approved = true;
              document.getElementById('createGame').textContent = 'Create'
            } else {
              approved = false;
              document.getElementById('createGame').textContent = 'Approve'
            }
          }
        } else {
          totalPrizePool.textContent = '-'
          yourDeposit.textContent = '-'
          totalPrizePool.dataset.text = '-'
          yourDeposit.dataset.text = '-'
        }}
        });
      });
      observerNumberOfPlayer.observe(numberOfPlayers, { attributes: true })
      const observerNumberOfRounds = new MutationObserver((mutations) => {
        mutations.forEach(async (mutation) => {          
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
        if (amountToPlay.getAttribute('data-value') != '' && amountPerDeath.value != '' && numberOfPlayers.getAttribute('data-value') != '') {
          const _amount = parseFloat(amountPerDeath.value) * parseFloat(amountToPlay.getAttribute('data-value'))
          const stringAmount = `${shortFloat(_amount * parseInt(numberOfPlayers.getAttribute('data-value')))} `
          totalPrizePool.textContent = stringAmount
          yourDeposit.textContent = `${shortFloat(_amount)} `
          totalPrizePool.dataset.text = stringAmount
          yourDeposit.dataset.text = `${shortFloat(_amount)}`
          totalPrizePoolToken.textContent = selectedToken.symbol
          totalPrizePoolToken.setAttribute('data-text', selectedToken.symbol)
          yourDepositToken.textContent = selectedToken.symbol
          yourDepositToken.setAttribute('data-text', selectedToken.symbol)  
          if (selectedToken.address != ethers.constants.AddressZero) {
            const tokenContract = new ethers.Contract(selectedToken.address, ERC20, signer)
            const allowance = await tokenContract.allowance(address, contract.address)
            amountWithDecimals = (_amount * 10**selectedToken.decimals).toString()
            if (BigInt(allowance) >= BigInt(amountWithDecimals)) {
              approved = true;
              document.getElementById('createGame').textContent = 'Create'
            } else {
              approved = false;
              document.getElementById('createGame').textContent = 'Approve'
            }
          }
        } else {
          totalPrizePool.textContent = '-'
          yourDeposit.textContent = '-'
          totalPrizePool.dataset.text = '-'
          yourDeposit.dataset.text = '-'
        }}
      });
      });
      observerNumberOfRounds.observe(amountToPlay, { attributes: true })
      amountPerDeath.addEventListener('input', async () => {
        if (amountToPlay.getAttribute('data-value') != '' && amountPerDeath.value != '' && numberOfPlayers.getAttribute('data-value') != '') {
          const _amount = parseFloat(amountPerDeath.value) * parseFloat(amountToPlay.getAttribute('data-value'))
          const stringAmount =`${shortFloat(_amount * parseInt(numberOfPlayers.getAttribute('data-value')))} `
          totalPrizePool.textContent = stringAmount
          totalPrizePool.dataset.text = stringAmount
          yourDeposit.textContent = `${shortFloat(_amount)} `
          yourDeposit.dataset.text = `${shortFloat(_amount)} `
          totalPrizePoolToken.textContent = selectedToken.symbol
          totalPrizePoolToken.setAttribute('data-text', selectedToken.symbol);
          yourDepositToken.textContent = selectedToken.symbol
          if (selectedToken.address != ethers.constants.AddressZero) {
            const tokenContract = new ethers.Contract(selectedToken.address, ERC20, signer)
            const allowance = await tokenContract.allowance(address, contract.address)
            amountWithDecimals = (_amount * 10**selectedToken.decimals).toString()
            if (BigInt(allowance) >= BigInt(amountWithDecimals)) {
              approved = true;
              //document.getElementById('createGame').textContent = 'Create'
            } else {
              approved = false;
              document.getElementById('createGame').textContent = 'Approve'
            }
          }
        } else {
          totalPrizePool.textContent = '-'
          yourDeposit.textContent = '-'
          totalPrizePool.dataset.text = '-'
          yourDeposit.dataset.text = '-'
        }
      });
      document.getElementById("connect").disabled = true;
      document
        .getElementById("createGame")
        .addEventListener("click", async function () {
          try {
            window.addEventListener("popstate", () => {});
            const error_modal = document.getElementById("error_modal")
            const error_modal_text = document.getElementById("error_modal_text")
            try {
              if(isNaN(parseFloat(amountPerDeath.value)) || isNaN(parseFloat(amountToPlay.getAttribute('data-value')))) throw Error('Enter a number')
              if (
                parseFloat(amountPerDeath.value) < 0 
                || 
                parseFloat(amountToPlay.getAttribute('data-value')) < 0
                ||
                parseFloat(amountPerDeath.value) == 0 
                || 
                parseFloat(amountToPlay.getAttribute('data-value')) == 0
                ) throw Error('The number must be greater than 0')
              const amountPerDeathValue = amountPerDeath.value * 10**selectedToken.decimals
              const amountToPlayValue = amountToPlay.getAttribute('data-value') * amountPerDeath.value * 10**selectedToken.decimals
              document.getElementById("confirmation_modal").style.display = 'flex'
              let promise;
              if (approved) {
                if (selectedToken.address == ethers.constants.AddressZero) {
                  if (network.chainid == 23294) {
                    promise = contract.connect(sapphire.wrap(signer)).create(BigInt(Math.round(amountPerDeathValue)).toString(),amountToPlay.getAttribute('data-value'),numberOfPlayers.getAttribute('data-value'), selectedToken.address, {value: BigInt(Math.round(amountToPlayValue)).toString()})
                  } else {
                    promise = contract.create(BigInt(Math.round(amountPerDeathValue)).toString(),amountToPlay.getAttribute('data-value'),numberOfPlayers.getAttribute('data-value'), selectedToken.address, {value: BigInt(Math.round(amountToPlayValue)).toString()})
                  }
                } else {
                  if (network.chainid == 23294) {
                    promise = contract.connect(sapphire.wrap(signer)).create(BigInt(Math.round(amountPerDeathValue)).toString(),amountToPlay.getAttribute('data-value'),numberOfPlayers.getAttribute('data-value'), selectedToken.address)
                  } else {
                    promise = contract.create(BigInt(Math.round(amountPerDeathValue)).toString(),amountToPlay.getAttribute('data-value'),numberOfPlayers.getAttribute('data-value'), selectedToken.address)
                  }
                }
              } else {
                const tokenContract = new ethers.Contract(selectedToken.address, ERC20, signer)
                if (network.chainid == 23294) {
                  promise = tokenContract.connect(sapphire.wrap(signer)).approve(contract.address, ethers.constants.MaxUint256)
                } else {
                  promise = tokenContract.approve(contract.address, ethers.constants.MaxUint256)
                }
              }
              const map = document.querySelector('#map-select-selecter').getAttribute('data-value')
              promise 
                .then(async (tx) => {
                  document.getElementById("confirmation_modal").style.display = 'none'
                  document.getElementById("pending_modal").style.display = 'flex'
                  tx.wait()
                    .then(async (_waited) => {
                      if (!approved) {
                        approved = true;
                        try {
                          const approveEvent = _waited.events.find(v => v.event === 'Approval')
                          const approvedAmount = BigInt((approveEvent.args.value).toString())
                          approved = approvedAmount >= BigInt(Math.round(amountToPlayValue)) ? true : false
                        } catch (error) {
                          console.log(error)
                        }
                        if (approved) {
                          document.getElementById("pending_modal").style.display = 'none'
                          document.getElementById('approved_token').textContent = selectedToken.symbol.length != 0 ? selectedToken.symbol : 'Token'
                          document.getElementById('approved_text').textContent = 'Now you can create a game.'
                          document.getElementById('approve_token_img').src = selectedToken.src
                          document.getElementById('createGame').textContent = 'Create'
                          approve_modal.style.display = 'flex'
                        } else {
                          document.getElementById("pending_modal").style.display = 'none'
                          document.getElementById('approved_token').textContent = selectedToken.symbol.length != 0 ? `${selectedToken.symbol} not` : 'Token not'
                          document.getElementById('approved_text').textContent = 'Please enter the correct amount for approve.'
                          document.getElementById('approve_token_img').src = selectedToken.src
                          document.getElementById('createGame').textContent = 'Approve'
                          approve_modal.style.display = 'flex'
                        }
                      } else {
                        setTimeout(async () => {
                          let gameid = 0
                          try {
                            const receipt = await provider.getTransactionReceipt(tx.hash);
                            const event = contract.interface.parseLog(receipt.logs[0]);
                            gameid = event.args.ID.toString()
                          } catch (error) {
                            gameid = (await contract.lastPlayerFight(address)).toString()
                          }
                          await fetch("/setgamesprops", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({gameid, chainid: network.chainid, map})
                          }).catch(err => console.log(err))
                          amountPerDeath.value = 0
                          amountPerDeath.value = 0
                          document.getElementById("my_modal").style.display = 'none'
                          document.getElementById("pending_modal").style.display = 'none'
                          if (isDesktop) {
                              btn.style.visibility = ''
                              btn.style.display = 'block'
                            }
                            else {
                              btnMobile.style.visibility = ''
                              btnMobile.style.display = 'block'
                          }
                          openFightsFunc(address, contract, network, signer, sapphire.wrap, {
                            ID: gameid,
                            token: selectedToken.address,
                            owner: address,
                            finishTime: 0,
                            createTime: Math.floor(Date.now() / 1000) + 10,
                            amountPerRound: BigInt(Math.round(amountPerDeathValue)).toString(),
                            baseAmount: BigInt(Math.round(amountToPlayValue)).toString(),
                            rounds: amountToPlay.getAttribute('data-value').toString(),
                            playersAmount: numberOfPlayers.getAttribute('data-value')
                          }).catch(err => console.log(err))
                        }, 5000)
                      }
                    })
                    .catch(err => console.log(err))
                })
                .catch(async (err) => {
                  console.log(err)
                  document.getElementById("confirmation_modal").style.display = 'none'
                  document.getElementById("pending_modal").style.display = 'none'
                  let msg = ''
                  if (err.message) msg = err.message
                  if (err.reason) msg = err.reason
                  if (err.data) msg = err.data.message
                  console.log(msg)
                  if (msg != undefined) {
                      if (msg.includes("Too little amount per round")) {
                        
                        const _minAmountForOneRound = await contract.minAmountPerRound(selectedToken.address)
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Bet per round must be higher or equal ${calcAmountWithDecimals(_minAmountForOneRound, selectedToken.decimals)} ${selectedToken.symbol}`
                      }
                      if (msg.includes("must be divided")) {
                        if(amountToPlay.getAttribute('data-value').includes(',') || amountToPlay.getAttribute('data-value').includes('.')) {
                          error_modal.style.display = 'flex'
                          error_modal_text.textContent = `The number should be written without a dot or a comma`
                        } else {
                          error_modal.style.display = 'flex'
                          error_modal_text.textContent = `Your deposit must be divisible by bet per round without remainder`
                        }
                      }
                      if (msg.includes("have open fight")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `You already have open fight.\nYou may not have claimed your prize yet.`
                      }
                      if (msg.includes("Wrong rounds amount")) {
                        const _maxRounds = await contract.maxRounds()
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `The maximum number of rounds is ${_maxRounds.toString()}`
                      }
                      if (msg.includes("transfer amount exceeds balance")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `${selectedToken.symbol} transfer amount exceeds balance`
                      }
                      if (msg.includes("User rejected the transaction")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `User rejected the transaction`
                      }
                      if (msg.includes("execution failed: out of funds")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Execution failed: out of funds`
                      }
                  } 
                  try {
                    if (err.data.message.includes("out of fund")){
                      const error_modal = document.getElementById("error_modal")
                      const error_modal_text = document.getElementById("error_modal_text")
                      error_modal.style.display = 'flex'
                      error_modal_text.textContent = `Out of fund`
                    }
                  } catch (error) {
                    console.error(error)
                  }
                })
            } catch (error) {
              if(amountPerDeath.value.includes(',')) {
                error_modal.style.display = 'flex'
                error_modal_text.textContent = `The number should be written with a dot, not a comma`
              }
              try {
                if (error.message == 'The number must be greater than 0') {
                  error_modal.style.display = 'flex'
                  error_modal_text.textContent = error.message
                }
                if (error.message == 'Enter a number') {
                  error_modal.style.display = 'flex'
                  error_modal_text.textContent = error.message
                }
              } catch (error) {
                console.error(error)
              }
            }  
          } catch (error) {
            console.log(error)
          }
        });
      let sign = localStorage.getItem('sign_evm')
      if (!sign) {
        sign = await signer.signMessage(msgSignIn)
        if (sign) {
          localStorage.setItem('sign_evm', sign)
        }
      } else {
        const recoveredAddress = ethers.utils.verifyMessage(msgSignIn, sign)
        if (recoveredAddress != address) {
          sign = await signer.signMessage(msgSignIn)
          if (sign) {
            localStorage.setItem('sign_evm', sign)
          }
        }
      }
      openFightsFunc(address, contract, network, signer, sapphire.wrap, undefined).catch(err => console.log(err))
      await pastFightsFunc(address, contract, network, signer, isDesktop).catch(err => console.log(err))
      await mainF2PEvm(address, network, sign)

      setTimeout(() => {
        const infos = document.querySelectorAll('[data-fight]')
        const infoModal = document.getElementById('info_modal')
        infos.forEach((info) => {
          info.addEventListener('click', async (ev) => {
            const fightId =  ev.target.dataset.fight
            infoModal.style.display = 'flex'
            localStorage.setItem('fight_id', fightId)
            await pastFightsFunc(address, contract, network, signer, isDesktop).catch(err => console.log(err))
          })
        })
      }, 300)
  } catch (error) {
    console.log(error)
  }
});
