import { ERC20 } from '../contract.js'
import { isDesktop } from '../index.js'
import { accountHide } from '../modules/accountsHide.js'
import { addToPastFights } from './pastFights.js'
import { addressMaker, changeErrMessage, getMap } from './utils/utils.js'
const displayCreateGame = (display) => {
    document.getElementById("btn_modal_window").style.visibility = display
}

const modalConfirm = document.getElementById("confirmation_modal")
const modalPending = document.getElementById("pending_modal")
const error_modal = document.getElementById("error_modal")
const error_modal_text = document.getElementById("error_modal_text")
const approve_modal = document.getElementById("approve_modal")

export const openFightsFunc = async (address, contract, network, signer, wrap, createdBattle) => {  
    const opengamesBtn = isDesktop ? document.querySelector('#opengames-btn-desktop') : document.querySelector('#opengames-btn')
    const openOpenFights = () => {
      document.querySelector('#amountPerDeath').placeholder = document.querySelector('#yourDepositToken').textContent
      const opengames = isDesktop ? document.getElementById("opengames-desktop") : document.getElementById("opengames")
      const openGamesList = isDesktop ? document.getElementById('opengames-list-desktop') : document.getElementById('opengames-list').querySelector('.simplebar-content')
      const pastgames = isDesktop ? document.getElementById("pastgames-desktop") : document.getElementById("pastgames")
      opengames.classList.add('active')
      opengames.style.display = ''
      pastgames.style.display = 'none'
      pastgames.classList.remove('active')
      const children = Array.from(openGamesList.children);
      
      if (children.length === 1) {
          isDesktop ? document.getElementById("opengames_empty-desktop").style.display = '' : document.getElementById("opengames_empty").style.display = '';
          opengames.classList.add("empty")
      }
      else {
          isDesktop ? document.getElementById("opengames_empty-desktop").style.display = 'none' : document.getElementById("opengames_empty").style.display = 'none'
          opengames.classList.remove("empty")
          // pastgames.appendChild(pastGamesList)
      }
      document.querySelector('#opengames-btn-desktop').classList.add('active')
      document.querySelector('#pastgames-btn-desktop').classList.remove('active')
    }
    const btnP2PEvmMenu = document.querySelector('#menu-p2p-btn-evm')
    const openGamesF2PEvmDesktop = document.querySelector('#opengames-f2p-evm-desktop')
    const pastGamesF2PEvmDesktop = document.querySelector('#pastgames-f2p-evm-desktop')
    const openGamesEmptyF2PEvmDesktop = document.querySelector('#opengames-empty-f2p-evm-desktop')
    opengamesBtn.addEventListener('click', () => {
      openOpenFights()
    })
    if (btnP2PEvmMenu) {
      btnP2PEvmMenu.addEventListener('click', () => {
        openOpenFights()
        document.querySelector('#games_checker-desktop').style.display = ''
        document.querySelector('#games_checker-f2p-desktop').style.display = 'none'
        openGamesF2PEvmDesktop.style.display = 'none'
        pastGamesF2PEvmDesktop.style.display = 'none'
        openGamesEmptyF2PEvmDesktop.style.display = 'none'
        document.querySelector('#btn_modal_window').style.display = ''
        document.querySelector('#btn_modal_window-f2p-evm').style.display = 'none'
      })      
    }
    let fights = await Promise.all([
      contract.getChunkFights(0, 10).catch(err => []),
      contract.getChunkFights(10, 10).catch(err => []),
      contract.getChunkFights(20, 10).catch(err => []),
      contract.getChunkFights(30, 10).catch(err => []),
      contract.getChunkFights(40, 10).catch(err => [])
    ]).then(result => [].concat(...result))
    fights = fights.filter(v => v.owner != ethers.constants.AddressZero && v.finishTime == 0 && !accountHide[`${v.owner.toLowerCase()}`])
    // let fights = [
    //     {
    //       ID: 1,
    //       amountPerRound: 1e18, // в зависимости от значения
    //       baseAmount: 1e18,      // аналогично
    //       createTime: 1730000009,               // примерное значение
    //       finishTime: 0,
    //       playersAmount: 2,
    //       rounds: 1,
    //       owner: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    //       token: "0x0000000000000000000000000000000000000000"
    //     },    
    //     {
    //       ID: 2,
    //       amountPerRound: 1e18, // в зависимости от значения
    //       baseAmount: 1e18,      // аналогично
    //       createTime: 1730000009,               // примерное значение
    //       finishTime: 0,
    //       playersAmount: 2,
    //       rounds: 1,
    //       owner: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    //       token: "0x0000000000000000000000000000000000000000"
    //     },    
    //     {
    //       ID: 3,
    //       amountPerRound: 1e18, // в зависимости от значения
    //       baseAmount: 1e18,      // аналогично
    //       createTime: 1730000009,               // примерное значение
    //       finishTime: 0,
    //       playersAmount: 2,
    //       rounds: 1,
    //       owner: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    //       token: "0x0000000000000000000000000000000000000000"
    //     }    
    // ]
    let opengames = document.getElementById("opengames")
    let openGamesListBar = document.getElementById("opengames-list")
    let openGamesDesktop = document.querySelector('#opengames-desktop')
    let openGamesDesktopListBarList = document.querySelector('#opengames-list-desktop')
    if (!SimpleBar.instances.get(openGamesListBar)) {
      new SimpleBar(openGamesListBar, { });        
    }
    if (!SimpleBar.instances.get(openGamesDesktopListBarList)) {
      new SimpleBar(openGamesDesktopListBarList, { });        
    }
    let openGamesDesktopListBar = openGamesDesktopListBarList.querySelector('.simplebar-content')
    let openGamesList = openGamesListBar.querySelector('.simplebar-content')
    if (fights.length === 0) {
      document.getElementById("opengames_empty").style.display = '';
      document.getElementById("opengames_empty-desktop").style.display = '';
      document.querySelector('#opengames_empty-title-desktop').textContent = 'Empty:(';
      document.querySelector('#opengames_empty-desc-desktop').textContent = 'At the moment, there are no games available for joining. But you can always start your own by clicking the "New game" button above.'
      opengames.classList.add('empty')
      openGamesDesktop.classList.add('empty')
    } else {
      document.getElementById("opengames_empty").style.display = 'none';
      document.getElementById("opengames_empty-desktop").style.display = 'none';
      opengames.classList.remove('empty')
      openGamesDesktop.classList.remove('empty')
    }
    //get ids of games in list on site
    // const openGamesListArray = [...Array.from(openGamesList.children).map(e => e.value)]
    //get ids of of open games
    let fightsIDs = [...fights.map(e => e.ID.toString())]
    //check if exist games that still in list on site but not in opengames in contract
    // const gamesToDelete = openGamesListArray.filter((v1) => !fightsIDs.includes(v1))
    //delete games from site if they not in open games in contract
    contract.on('CreateFight', async (ID, owner, token) => {
      try {
        if (localStorage.getItem('lastAddedID') != ID.toString()) {
          localStorage.setItem('lastAddedID',ID.toString())
          const fight = await contract.fights(ID)
          let players = await contract.getFightPlayers(ID)
          players = players.filter(p => p.toLowerCase() === address.toLowerCase())
          //check if ended
          if (fight.finishTime.toString() === '0' && fight.owner != ethers.constants.AddressZero && !accountHide[`${fight.owner.toLowerCase()}`] && !players.length) {
            //check if not already added
            if (!fightsIDs.includes(ID.toString())) {
              //add to fights
              fightsIDs.push(ID.toString())
              //check if this players fight
              if (owner.toLowerCase() !== address.toLowerCase()) {
                const child = await appendOpenFight(address, fight, network, contract, signer, wrap)
                if (isDesktop) {
                  document.getElementById("opengames_empty-desktop").style.display = 'none';
                  openGamesDesktop.classList.remove('empty')
                  openGamesDesktopListBar.appendChild(child)
                } else {
                  document.getElementById("opengames_empty").style.display = 'none';
                  opengames.classList.remove('empty')
                  openGamesList.appendChild(child)
                }
              } 
            }
          }
        }
      } catch (error) {
        
      }
    })
    contract.on('Withdraw', async (ID) => {
      try {
        const fight = document.getElementById(`openbattle_${ID.toString()}`)
        if (isDesktop) {
          openGamesDesktopListBar.removeChild(fight)
          if (openGamesDesktopListBar.children.length === 1) {
            document.getElementById("opengames_empty-desktop").style.display = '';
            openGamesDesktop.classList.add('empty')
          }
        } else {
          openGamesList.removeChild(fight)
          if (openGamesList.children.length === 1) {
            document.getElementById("opengames_empty").style.display = '';
            opengames.classList.add('empty')
          }
        }
      } catch (error) {
        
      }
    })
    contract.on('JoinFight', async (ID, joiner, token) => {
      try {
        const fight = await contract.fights(ID)
        // const players = await contract.getFightPlayers(ID)
        let querySignExist = new URLSearchParams();
        querySignExist.append("gameID", ID.toString())
        querySignExist.append("address", address)
        querySignExist.append("chainid", network.chainid)
        const sign = await fetch('/sign?' + querySignExist.toString()).then(async(res) => await res.json())
        if (fight.owner.toLowerCase() === address.toLowerCase() && fight.finishTime.toString() === '0' && sign.r.length === 0) {
          if (fight.playersAmount == 2) {
            let fightTokenSymbol = network.currency
            let fightTokenDecimals = 18
            if (token !== ethers.constants.AddressZero) {
              const fightToken = new ethers.Contract(token, ERC20, signer)
              fightTokenSymbol = await fightToken.symbol()
              fightTokenDecimals = await fightToken.decimals()
            } 
            window.location.href = `/game/?ID=${ID.toString()}&network=${network.chainid}&token=${fightTokenSymbol}&decimals=${fightTokenDecimals}`
          } else {
            const endTime = parseInt(fight.createTime) * 1000 + 3 * 60 * 1000
            async function updateCountdown(_endTime) {
              const timerSpan = document.querySelector('#mygame_timer')
              let now = Date.now();
              let timeLeft = Math.max(0, (_endTime - now) / 1000); // Оставшееся время в секундах
  
              let minutes = Math.floor(timeLeft / 60);
              let seconds = Math.floor(timeLeft % 60);
  
              // Добавляем ведущие нули для формата времени
              let formattedMinutes = String(minutes).padStart(2, '0');
              let formattedSeconds = String(seconds).padStart(2, '0');
  
              // Выводим результат на страницу
              timerSpan.textContent = formattedMinutes + ":" + formattedSeconds;
  
              // Обновляем таймер каждую секунду
              if (timeLeft > 0) {
                  setTimeout(function () {
                      updateCountdown(_endTime);
                  }, 1000);
              } else {
                let fightTokenSymbol = network.currency
                let fightTokenDecimals = 18
                if (token !== ethers.constants.AddressZero) {
                  const fightToken = new ethers.Contract(token, ERC20, signer)
                  fightTokenSymbol = await fightToken.symbol()
                  fightTokenDecimals = await fightToken.decimals()
                } 
                window.location.href = `/game/?ID=${ID.toString()}&network=${network.chainid}&token=${fightTokenSymbol}&decimals=${fightTokenDecimals}`
              }
            }
            updateCountdown(endTime)
          }
        } else {
        }
      } catch (error) {
        console.log(error)
      }
    })
    fights.forEach(async (v) => {
      if (v.owner.toLowerCase() != address.toLowerCase()) {
        let alreadyExistHere = false
        let players = await contract.getFightPlayers(v.ID)
        // let players = []
        players = players.filter(p => p.toLowerCase() === address.toLowerCase())
        if (isDesktop) {
          for (let i = 0; i < openGamesDesktopListBar.children.length; i++) {
            const value = openGamesDesktopListBar.children[i].getAttribute("value")
            if (v.ID.toString() == value) {
              alreadyExistHere = true
              break;
            }
          }
        } else {
          for (let i = 0; i < openGamesList.children.length; i++) {
            const value = openGamesList.children[i].getAttribute("value")
            if (v.ID.toString() == value) {
              alreadyExistHere = true
              break;
            }
          }
        }
        if (alreadyExistHere == false && !players.length) {
          const child = await appendOpenFight(address, v, network, contract, signer, wrap)
          if (isDesktop) {
            
            openGamesDesktopListBar.appendChild(child)
          } else {
            openGamesList.appendChild(child)
          }
        }
      }
    })
    let currentBattleID
    let currentBattle
    let currentBattleToken = network.currency
    let currentBattleDecimals = 18
    let playerClaimed
    let players
    let player2
    if (createdBattle) {
      currentBattleID = createdBattle.ID
      currentBattle = createdBattle
      if (currentBattle.token != ethers.constants.AddressZero) {
        const currentTokenContract = new ethers.Contract(currentBattle.token, ERC20, signer)
        currentBattleToken = await currentTokenContract.symbol()
        currentBattleDecimals = await currentTokenContract.decimals()
      }
      playerClaimed = false
      players = [address]
    } else {
      try {
        currentBattleID = await contract.lastPlayerFight(address)
        currentBattle = await contract.fights(currentBattleID)
        if (currentBattle.token != ethers.constants.AddressZero) {
          const currentTokenContract = new ethers.Contract(currentBattle.token, ERC20, signer)
          currentBattleToken = await currentTokenContract.symbol()
          currentBattleDecimals = await currentTokenContract.decimals()
        }
        playerClaimed = await contract.playerClaimed(address, currentBattleID)
        players = await contract.getFightPlayers(currentBattleID)
        player2 = players[1]
      } catch (error) {
        
      }
    }
    players = players.map(v => v.toLowerCase())
    let checker = playerClaimed == false && players.includes(address.toLowerCase());
    if (player2 === undefined && currentBattle.finishTime != 0) {
      checker = false;
    }
    if (checker) {
      displayCreateGame('')
      document.getElementById("opengames_empty").style.display = 'none';
      opengames.classList.remove('empty')
      let alreadyExistHere = false;
      if (isDesktop) {
        for (let i = 0; i < openGamesDesktopListBar.children.length; i++) {
          if (currentBattle.ID.toString() == openGamesDesktopListBar.children[i].getAttribute("value")) {
            alreadyExistHere = true
            const games__item = document.getElementsByClassName('games__item')[2]
            // games__item.lastChild.id = `amount_deposit_or_claim_p_${currentBattleID.toString()}`
            break;
          }
        }
      } else {
        for (let i = 0; i < openGamesList.children.length; i++) {
          if (currentBattle.ID.toString() == openGamesList.children[i].getAttribute("value")) {
            alreadyExistHere = true
            const games__item = document.getElementsByClassName('games__item')[2]
            // games__item.lastChild.id = `amount_deposit_or_claim_p_${currentBattleID.toString()}`
            break;
          }
        }
      }
      if (alreadyExistHere == false) {
        let queryGameProps = new URLSearchParams();
        queryGameProps.append("gameid", currentBattle.ID.toString())
        queryGameProps.append("chainid", network.chainid)
        let mapID = await fetch('/getgamesprops?' + queryGameProps).then(async (res) => (await res.json()).map).catch(err => {
          console.log(err)
          return 0
        })
        const map = getMap(mapID)
        let li = document.createElement('div')
        li.className = 'games__row border-style'
        li.id = `openbattle_${currentBattle.ID.toString()}`
        li.value = currentBattle.ID
        li.setAttribute('value', currentBattle.ID.toString())
        const corn1 = document.createElement('div')
        const corn2 = document.createElement('div')
        const corn3 = document.createElement('div')
        const corn4 = document.createElement('div')
        corn1.className = 'corn corn1'
        corn2.className = 'corn corn2'
        corn3.className = 'corn corn3'
        corn4.className = 'corn corn4'
        li.append(corn1, corn2, corn3, corn4)
        const addressPlayer1 = addressMaker(currentBattle.owner);
        const headerDiv = document.createElement('div')
        headerDiv.className = `games__item`
        const pID = document.createElement('p')
        const pIDData = document.createElement('span')
        pID.textContent = 'id: '
        pIDData.textContent = `${currentBattle.ID.toString()}`
        pID.appendChild(pIDData)
        const pCreator = document.createElement('p')
        const pCreatorData = document.createElement('a')
        pCreator.textContent = 'Creator: '
        pCreatorData.target = "_blank"
        pCreatorData.href = `${network.explorer}/address/${currentBattle.owner}`
        pCreatorData.textContent = `${addressPlayer1}`
        pCreatorData.className = 'creator-link active'
        pCreator.appendChild(pCreatorData)
        const pMap = document.createElement('p')
        const pMapData = document.createElement('span')
        pMap.textContent = 'Map: '
        pMapData.textContent = map.name
        pMapData.className = 'active map-show'
        const mapHiddenModal = document.querySelector('#modal__map')
        pMapData.addEventListener("mouseover", (event) => {
          mapHiddenModal.src = map.image
          mapHiddenModal.classList.add('active')
        });
        pMapData.addEventListener("mouseleave", (event) => {
          mapHiddenModal.classList.remove('active')
        });
        pMap.appendChild(pMapData)
        headerDiv.appendChild(pID)
        headerDiv.appendChild(pCreator)
        headerDiv.appendChild(pMap)
        const currentBattleRoundsElem = document.createElement('p')
        currentBattleRoundsElem.classList.add('current_battle_rounds')
        currentBattleRoundsElem.classList.add('right')
        headerDiv.appendChild(currentBattleRoundsElem)
        const middleDiv = document.createElement('div')
        const middleDivP = document.createElement('p')
        const middleDivSpan = document.createElement('span')
        middleDivP.textContent = 'Status: '
        middleDivSpan.id = `mygame_status_${currentBattleID.toString()}`
        middleDivP.appendChild(middleDivSpan)
        middleDiv.appendChild(middleDivP)
        if (currentBattle.playersAmount > 2) {
          const middleDivPTimer = document.createElement('p')
          const middleDivSpanTimer = document.createElement('span')
          middleDivSpanTimer.id = 'mygame_timer'
          middleDivPTimer.textContent = 'Timer: '
          middleDivSpanTimer.textContent = '00:00'
          middleDivPTimer.appendChild(middleDivSpanTimer)
          middleDiv.appendChild(middleDivPTimer)
        }
        const pPlayers = document.createElement('p')
        pPlayers.textContent = `Players: ${currentBattle.playersAmount.toString()}`
        middleDiv.appendChild(pPlayers)
        middleDiv.className = 'games__item'
        const bottomDiv = document.createElement('div')
        bottomDiv.className = 'games__item_last games__item'
        const betPerRoundP = document.createElement('p')
        betPerRoundP.textContent = 'Bet per round: '
        const betPerRound = document.createElement('span')
        betPerRound.id = `bet_per_round`
        betPerRoundP.appendChild(betPerRound)
        const amountDepositOrClaimP = document.createElement('P')
        amountDepositOrClaimP.textContent = 'To deposit: '
        amountDepositOrClaimP.id = `amount_deposit_or_claim_p_${currentBattleID.toString()}`
        const amountDepositOrClaim = document.createElement('span')
        amountDepositOrClaim.id = `amount_deposit_or_claim`
        amountDepositOrClaimP.appendChild(amountDepositOrClaim)
        bottomDiv.appendChild(betPerRoundP)
        bottomDiv.appendChild(amountDepositOrClaimP)

        betPerRound.textContent = `${currentBattle.amountPerRound / 10**currentBattleDecimals} ${currentBattleToken}`
        amountDepositOrClaim.textContent = `${currentBattle.baseAmount / 10**currentBattleDecimals} ${currentBattleToken}`
        li.appendChild(headerDiv)
        li.appendChild(middleDiv)
        li.appendChild(bottomDiv)
        // btn.style.display = 'none'
        let queryStatsPlayer = new URLSearchParams();
        queryStatsPlayer.append("gameID", currentBattle.ID)
        queryStatsPlayer.append("address", address)
        queryStatsPlayer.append("chainid", network.chainid)
        fetch('/statistics?' + queryStatsPlayer.toString())
            .then(async (res) => {
            const playerStats = await res.json()
            const playerOneStats = playerStats.find(v => v.player.toLowerCase() === address.toLowerCase())
            currentBattleRoundsElem.textContent = createdBattle ? 
            ` Current round: 0/${parseInt(currentBattle.rounds)}`
              :
            ` Current round: ${parseInt(currentBattle.rounds) - parseInt(playerOneStats.remainingrounds)}/${parseInt(currentBattle.rounds)}`
            })
            .catch(err => console.error(err))
        if (isDesktop) {
          try { openGamesDesktopListBar.insertBefore(li, openGamesDesktopListBar.firstChild) } catch (error) {} 
        } else {
          try { openGamesList.insertBefore(li, openGamesList.firstChild) } catch (error) {}
        }
      }
      const currentBattleInList = Array.from(openGamesList.children).find(v => v.getAttribute('value') === currentBattle.ID.toString())
      if (isDesktop) {
        try{openGamesDesktopListBar.removeChild(currentBattleInList)} catch(error) {};
        try{openGamesDesktopListBar.insertBefore(currentBattleInList, openGamesDesktopListBar.firstChild)} catch(error) {};
      } else {
        try {openGamesList.removeChild(currentBattleInList)} catch (error) {};
        try {openGamesList.insertBefore(currentBattleInList, openGamesList.firstChild)} catch(error) {};
      }
      let querySignExist = new URLSearchParams();
      querySignExist.append("gameID", currentBattle.ID)
      querySignExist.append("address", address)
      querySignExist.append("chainid", network.chainid)
      let query = new URLSearchParams();
      query.append("ID", currentBattle.ID)
      query.append("network", network.chainid)
      fetch('/sign?' + querySignExist.toString()).then(async(res) => {
        let buttonID = `openbattle_btn_${currentBattle.ID.toString()}`
        let button;
        let li = document.getElementById(`openbattle_${currentBattle.ID.toString()}`)
        
        if (document.getElementById(buttonID) == null) {
          button = document.createElement("button")
          button.id = buttonID
          button.className = 'btn opengames__btn'
          li.appendChild(button)
        } else {
          button = document.getElementById(buttonID)
          // li.removeChild(button)
          // button = document.createElement("button")
          // button.id = buttonID
          // li.appendChild(button)
        }
        const data = await res.json()
        if (data.r.length > 0) {
          document.getElementById("opengames_empty").style.display = 'none';
          //thats for check if event was already created
          const buttonValue = 'event_exist'
          if (button.value != buttonValue) {
            button.value = buttonValue
            button.textContent = "Claim"
            button.className = 'close-button opengames__btn claim-button'
            document.getElementById(`mygame_status_${currentBattleID.toString()}`).textContent = `Game over. Claim your reward`
            document.getElementById(`amount_deposit_or_claim_p_${currentBattleID.toString()}`).textContent = 'Amount to claim: '
            const amountDepositOrClaim = document.createElement('span')
            // amountDepositOrClaim.id = `amount_deposit_or_claim`
            amountDepositOrClaim.textContent = `
            ${data.amount / 10**currentBattleDecimals} ${currentBattleToken}
            `
            document.getElementById(`amount_deposit_or_claim_p_${currentBattleID.toString()}`).appendChild(amountDepositOrClaim)
            let queryStatsPlayer = new URLSearchParams();
            queryStatsPlayer.append("gameID", currentBattle.ID)
            queryStatsPlayer.append("address", address)
            queryStatsPlayer.append("chainid", network.chainid)
            const currentBattleRounds = document.getElementsByClassName(`current_battle_rounds`)[0]
            const rounds = parseInt(currentBattle.rounds)
            fetch('/statistics?' + queryStatsPlayer.toString())
              .then(async (res) => {
                const playerStats = await res.json()
                const playerOneStats = playerStats.find(v => v.player.toLowerCase() === address.toLowerCase())
                const currentBattle = document.getElementById(`openbattle_${currentBattleID}`)
                const gamesItem = currentBattle.getElementsByClassName('games__item')
                gamesItem[0].lastChild.lastChild.textContent = `Current round: ${rounds - parseInt(playerOneStats.remainingrounds)}/${rounds}`
              })
              .catch(err => console.error(err))
          // const amountDepositOrClaim = document.createElement('span')
          // amountDepositOrClaim.id = ``
            button.addEventListener('click' , async () => {
              try {
                window.addEventListener("popstate", () => {});
                if (data.r.length == 0) {throw Error('Signature does not exist')}
                else {
                modalConfirm.style.display = 'flex'
                let promise;
                if (network == 23294) {
                  promise = contract.connect(wrap(signer)).finish(currentBattle.ID, data.amount, data.r, data.v, data.s)
                } else {
                  promise = contract.finish(currentBattle.ID, data.amount, data.r, data.v, data.s)
                }
                promise 
                  .then(async (tx) => {
                    modalConfirm.style.display = 'none'
                    modalPending.style.display = 'flex'
                    await tx.wait()
                      .then(async () => {
                        modalPending.style.display = 'none'
                        try {
                          document.querySelector('#opengames-list .simplebar-content').removeChild(li)
                        } catch (error) {}
                        try {
                          document.querySelector('#opengames-list').removeChild(li)
                        } catch (error) {}
                        displayCreateGame('')
                        if (document.querySelector('#opengames-list .simplebar-content').children.length === 1) {
                          document.getElementById("opengames_empty").style.display = '';
                          opengames.classList.add('empty')
                        }
                        else {
                          document.getElementById("opengames_empty").style.display = 'none';
                        }
                        await addToPastFights(currentBattle, network, signer, address, 'fromOpenFights')
                      })
                  })
                  .catch(async (err) => {
                    console.log(err)
                    modalConfirm.style.display = 'none'
                    modalPending.style.display = 'none'
                    const msg = err.reason === undefined ? err.data.message : err.reason
                    if (msg != undefined) {
                      if (msg.includes("You dont have access")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `You don't have access.`
                      }
                      if (msg.includes("Already sended")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Already sended`
                      }
                      if (msg.includes("Not success payment")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Not success payment`
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
                }
              } catch(err){
              }
            }, {passive: true})
          }
        }
        let player2;
        try {
          const players = await contract.getFightPlayers(currentBattle.ID)
          player2 = players[1]
        } catch (error) {
          
        }
        if (data.r == '' && player2 != undefined && currentBattle.finishTime == 0) {
          window.location.href = `/game/?ID=${currentBattleID}&network=${network.chainid}&token=${currentBattleToken}&decimals=${currentBattleDecimals}`
        }
        if (data.r == '' && player2 == undefined && currentBattle.finishTime == 0) {
            if (currentBattle.playersAmount > 2) {
              setInterval(async () => {
                try {
                  const players = await contract.getFightPlayers(currentBattleID)
                  if (players[1]) {
                    const endTime = parseInt(currentBattle.createTime) * 1000 + 3 * 60 * 1000
                    async function updateCountdown(_endTime) {
                      const timerSpan = document.querySelector('#mygame_timer')
                      let now = Date.now();
                      let timeLeft = Math.max(0, (_endTime - now) / 1000); // Оставшееся время в секундах
          
                      let minutes = Math.floor(timeLeft / 60);
                      let seconds = Math.floor(timeLeft % 60);
          
                      // Добавляем ведущие нули для формата времени
                      let formattedMinutes = String(minutes).padStart(2, '0');
                      let formattedSeconds = String(seconds).padStart(2, '0');
          
                      // Выводим результат на страницу
                      timerSpan.textContent = formattedMinutes + ":" + formattedSeconds;
          
                      // Обновляем таймер каждую секунду
                      if (timeLeft > 0) {
                          setTimeout(function () {
                              updateCountdown(_endTime);
                          }, 1000);
                      } else {
                        window.location.href = `/game/?ID=${currentBattleID.toString()}&network=${network.chainid}&token=${currentBattleToken}&decimals=${currentBattleDecimals}`
                      }
                    }
                    updateCountdown(endTime)
                  }
                } catch (error) {
                  console.log(error)
                }
              }, 10000)
            }
            //thats for check if event was already created
            const buttonValue = 'event_exist'
            // const currentBattleRounds = document.getElementsByClassName(`current_battle_rounds`)[0]
            // console.log(document.getElementsByClassName(`current_battle_rounds`))
            const rounds = parseInt(currentBattle.rounds)
            // currentBattleRounds.textContent = ` Current round: 0/${rounds}`
            try {
              document.querySelector('.current_battle_rounds.right').textContent = `Current round: 0/${rounds}`
              // document.querySelector('.close-button.join-button').style.display = 'none'
            } catch (error) {}
            if (button.value != buttonValue) {
                button.value = buttonValue
                button.textContent = "Withdraw"
                button.className = 'close-button_big close-button withdraw-button'
                document.getElementById(`mygame_status_${currentBattleID.toString()}`).textContent = `Your game. Waiting for an opponent or timer`
                document.getElementById(`amount_deposit_or_claim`).textContent = `
                ${currentBattle.baseAmount / 10**currentBattleDecimals} ${currentBattleToken}
                `
                // document.getElementsByClassName(`current_battle_rounds`)[0].textContent = `Current rounds: ${0}/${currentBattle.rounds}`
                // button.removeEventListener('click', previousWithdrawEventListener)
                button.addEventListener('click', async (event) => {
                window.addEventListener("popstate", () => {});
                modalConfirm.style.display = 'flex'
                let promise;
                if (network == 23294) {
                  promise = contract.connect(wrap(signer)).withdraw(currentBattle.ID)
                } else {
                  promise = contract.withdraw(currentBattle.ID)
                }
                promise
                    .then(async (tx) => {
                        modalConfirm.style.display = 'none'
                        modalPending.style.display = 'flex'
                        await tx.wait().then(() => {
                        modalPending.style.display = 'none'
                        const _openGamesList = document.getElementById("opengames-list")
                        _openGamesList.removeChild(li)
                        displayCreateGame('')
                        document.getElementById("opengames_empty").style.display = 'none';
                        if (_openGamesList.children.length === 1) {
                          document.getElementById("opengames_empty").style.display = '';
                          opengames.classList.add('empty')
                        }
                        else {
                          document.getElementById("opengames_empty").style.display = 'none';
                        }
                        })
                    })
                    .catch(async (err) => {
                    modalConfirm.style.display = 'none'
                    modalPending.style.display = 'none'
                    const msg = err.reason === undefined ? err.data.message : err.reason
                    if (msg != undefined) {
                      if (msg.includes("You're not fight's owner")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `You're not fight's owner`
                      }
                      if (msg.includes("Fight is over")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Fight is over`
                      }
                      if (msg.includes("Fight has players")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Fight has players. Wait for redirect.`
                      }
                      if (msg.includes("Not success payment")) {
                        error_modal.style.display = 'flex'
                        error_modal_text.textContent = `Not success payment`
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
                })
            }
          
        }})
    } else {
      displayCreateGame('')
    }
}

async function appendOpenFight(address, fight, network, contract, signer, wrap) {
  let li = document.createElement('div')
  let input = document.createElement('input')
  input.type = 'hidden'
  input.value = fight.ID.toString()
  input.className = 'id'
  console.log(2222222222, isDesktop);
  
  li.className = `games__row border-style ${isDesktop ? 'desktop' : '' }`
  if (isDesktop) {
    const dote1 = document.createElement('div')
    const dote2 = document.createElement('div')
    const dote3 = document.createElement('div')
    const dote4 = document.createElement('div')
    const border1 = document.createElement('div')
    const border2 = document.createElement('div')
    const border3 = document.createElement('div')
    const border4 = document.createElement('div')
    const border5 = document.createElement('div')
    const border6 = document.createElement('div')
    const border7 = document.createElement('div')
    const border8 = document.createElement('div')
    dote1.className = 'dote dote1'
    dote2.className = 'dote dote2'
    dote3.className = 'dote dote3'
    dote4.className = 'dote dote4'
    border1.className = 'c-border border1'
    border2.className = 'c-border border2'
    border3.className = 'c-border border3'
    border4.className = 'c-border border4'
    border5.className = 'c-border border5'
    border6.className = 'c-border border6'
    border7.className = 'c-border border7'
    border8.className = 'c-border border8'
    li.append(dote1, dote2, dote3, dote4, border1, border2, border3, border4, border5, border6, border7, border8)    
  }
  li.appendChild(input)
  li.id = `openbattle_${fight.ID.toString()}`
  li.setAttribute('value', fight.ID.toString())

  let button = document.createElement("button")
  button.value = fight.ID.toString()
  let buttonText = 'Join'
  button.textContent = "Join"
  let tokenContract;
  let token = network.currency
  let decimals = 18
  let allowance
  if (fight.token != ethers.constants.AddressZero) {
    try {
      tokenContract = new ethers.Contract(fight.token, ERC20, signer)
      token = await tokenContract.symbol()
      decimals = await tokenContract.decimals()
      allowance = BigInt(await tokenContract.allowance(address, contract.address))
      if (allowance < BigInt(fight.baseAmount)) {
        buttonText = 'Approve'
      } 
    } catch (error) {
      
    }
  }
  button.textContent = buttonText
  button.className = 'close-button join-button opengames__btn'
  button.addEventListener('click', async (event) => {
    window.addEventListener("popstate", () => {});
    const amountToPlay = fight.baseAmount
    modalConfirm.style.display = 'flex'
    let promise;
    if (buttonText === 'Join') {
      if (fight.token != ethers.constants.AddressZero) {
        if (network.chainid == 23294) {
          promise = contract.connect(wrap(signer)).join(event.target.value)
        } else {
          promise = contract.join(event.target.value)
        }
      } else {
        if (network.chainid == 23294) {
          promise = contract.connect(wrap(signer)).join(event.target.value, {value: amountToPlay.toString()})
        } else {
          promise = contract.join(event.target.value, {value: amountToPlay.toString()})
        }
      }
    } else {
      if (network.chainid == 23294) {
        promise = tokenContract.connect(wrap(signer)).approve(contract.address, ethers.constants.MaxUint256)
      } else {
        promise = tokenContract.approve(contract.address, ethers.constants.MaxUint256)
      }
    }
    promise 
    .then(async (tx) => {
      modalConfirm.style.display = 'none'
      modalPending.style.display = 'flex'
      await tx.wait().then(async () => {
        modalPending.style.display = 'none'
        if (buttonText === 'Join') {
          if (fight.playersAmount > 2) {
            const endTime = parseInt(fight.createTime) * 1000 + 3 * 60 * 1000
            async function updateCountdown(_endTime) {
              const timerSpan = document.querySelector(`#game_timer_${fight.ID.toString()}`)
              let now = Date.now();
              let timeLeft = Math.max(0, (_endTime - now) / 1000); // Оставшееся время в секундах
  
              let minutes = Math.floor(timeLeft / 60);
              let seconds = Math.floor(timeLeft % 60);
  
              // Добавляем ведущие нули для формата времени
              let formattedMinutes = String(minutes).padStart(2, '0');
              let formattedSeconds = String(seconds).padStart(2, '0');
  
              // Выводим результат на страницу
              timerSpan.textContent = formattedMinutes + ":" + formattedSeconds;
  
              // Обновляем таймер каждую секунду
              if (timeLeft > 0) {
                  setTimeout(function () {
                      updateCountdown(_endTime);
                  }, 1000);
              } else {
                window.location.href = `/game/?ID=${fight.ID.toString()}&network=${network.chainid}&token=${token}&decimals=${decimals}`
              }
            }
            updateCountdown(endTime)
            button.style.display = 'none'
          } else {
            let query = new URLSearchParams();
            query.append("ID", event.target.value)
            query.append("network", network.chainid)
            query.append("token", token)
            query.append("decimals", decimals)
            window.location.href = "/game?" + query.toString();
          }
        } else {
          allowance = BigInt(await tokenContract.allowance(address, contract.address))
          if (allowance < BigInt(fight.baseAmount)) {
            document.getElementById('approved_token').textContent = token.length != 0 ? token : 'Token'
            document.getElementById('approved_token').textContent = `${document.getElementById('approved_token').textContent} not`
            document.getElementById('approved_text').textContent = 'Please enter the correct amount for approve.'
            approve_modal.style.display = 'flex'
          } else {
            button.style.backgroundImage = "url('../media/svg/join-button.svg')"
            button.style.width = "175px"
            button.style.height = "48px"
            button.style.backgroundRepeat = 'no-repeat'
            buttonText = 'Join'
            button.textContent = 'Join'
            document.getElementById('approved_token').textContent = token.length != 0 ? token : 'Token'
            document.getElementById('approved_text').textContent = 'Now you can join a game.'
            approve_modal.style.display = 'flex'
          }
        }
      })
    })
    .catch(err => {
      modalConfirm.style.display = 'none'
      modalPending.style.display = 'none'
      const msg = err.reason
      console.log(msg)
      // const msg = err.reason === undefined ? err.data.message : changeErrMessage(err.reason)
      if (msg != undefined) {
        if (msg.includes("Wrong amount")) {
          error_modal.style.display = 'flex'
          error_modal_text.textContent = `Wrong amount`
        } else if (msg.includes("You have open fight")) {
          error_modal.style.display = 'flex'
          error_modal_text.textContent = `You already have open fight`
        } else if (msg.includes("Fight is over")) {
          error_modal.style.display = 'flex'
          error_modal_text.textContent = `Fight is over`
        } else if (msg.includes("Fight is full")) {
          error_modal.style.display = 'flex'
          error_modal_text.textContent = `Fight is full of players`
        } else if (msg.includes('insufficient allowance')) {
          error_modal.style.display = 'flex'
          error_modal_text.textContent = `Insufficient allowance`
        } else if (msg.includes('transfer amount exceeds balance')) {
          error_modal.style.display = 'flex'
          error_modal_text.textContent = `Transfer amount exceeds balance`
        }
      } else {
        error_modal.style.display = 'flex'
        error_modal_text.textContent = `Something went wrong`
      }
    })
  })
  let queryGameProps = new URLSearchParams();
  queryGameProps.append("gameid", fight.ID.toString())
  queryGameProps.append("chainid", network.chainid)
  let mapID = await fetch('/getgamesprops?' + queryGameProps).then(async (res) => (await res.json()).map).catch(err => {
    console.log(err)
    return 0
  })
  const map = getMap(mapID)
  const addressPlayer1 = addressMaker(fight.owner);
  const headerDiv = document.createElement('div')
  headerDiv.className = `games__item`
  const pID = document.createElement('p')
  const pIDData = document.createElement('span')
  pID.textContent = 'id: '
  pIDData.textContent = `${fight.ID.toString()}`
  pID.appendChild(pIDData)
  const pCreator = document.createElement('p')
  const pCreatorData = document.createElement('a')
  pCreator.textContent = 'Creator: '
  pCreatorData.target = "_blank"
  pCreatorData.href = `${network.explorer}/address/${fight.owner}`
  pCreatorData.textContent = `${addressPlayer1}`
  pCreatorData.className = 'creator-link active'
  pCreator.appendChild(pCreatorData)
  const pMap = document.createElement('p')
  const pMapData = document.createElement('span')
  pMap.textContent = 'Map: '
  pMapData.textContent = map.name
  pMapData.className = 'active map-show'
  const mapHiddenModal = document.querySelector('#modal__map')
  pMapData.addEventListener("mouseover", (event) => {
    mapHiddenModal.src = map.image
    mapHiddenModal.classList.add('active')
  });
  pMapData.addEventListener("mouseleave", (event) => {
    mapHiddenModal.classList.remove('active')
  });
  pMap.appendChild(pMapData)
  headerDiv.appendChild(pID)
  headerDiv.appendChild(pCreator)
  headerDiv.appendChild(pMap)
  const currentBattleRoundsElem = document.createElement('p')
  const rounds = fight.rounds
  currentBattleRoundsElem.innerHTML = `Current round: <span>${0}/${rounds}</span>`
  currentBattleRoundsElem.className = `right`
  headerDiv.appendChild(currentBattleRoundsElem)
  const middleDiv = document.createElement('div')
  const middleDivP = document.createElement('p')
  const middleDivSpan = document.createElement('span')
  middleDivP.textContent = 'Status: '
  middleDivSpan.id = `mygame_status_${fight.ID.toString()}`
  middleDivSpan.textContent = `Waiting for an opponent or timer`
  middleDivP.appendChild(middleDivSpan)
  middleDiv.appendChild(middleDivP)
  if (fight.playersAmount > 2) {
    const middleDivPTimer = document.createElement('p')
    const middleDivSpanTimer = document.createElement('span')
    middleDivSpanTimer.id = `game_timer_${fight.ID.toString()}`
    middleDivPTimer.textContent = 'Timer: '
    middleDivSpanTimer.textContent = '00:00'
    middleDivPTimer.appendChild(middleDivSpanTimer)
    middleDiv.appendChild(middleDivPTimer)
  }
  const pPlayers = document.createElement('p')
  pPlayers.innerHTML = `Players: <span>${fight.playersAmount.toString()}</span>`
  middleDiv.appendChild(pPlayers)
  middleDiv.className = 'games__item'
  const bottomDiv = document.createElement('div')
  bottomDiv.className = 'games__item_last games__item'
  const betPerRoundP = document.createElement('p')
  betPerRoundP.textContent = 'Bet per round: '
  const betPerRound = document.createElement('span')
  // betPerRound.id = `bet_per_round`
  betPerRoundP.appendChild(betPerRound)
  const amountDepositOrClaimP = document.createElement('P')
  amountDepositOrClaimP.textContent = 'To deposit: '
  const amountDepositOrClaim = document.createElement('span')
  amountDepositOrClaimP.appendChild(amountDepositOrClaim)
  bottomDiv.appendChild(betPerRoundP)
  bottomDiv.appendChild(amountDepositOrClaimP)
  amountDepositOrClaimP.id = `amount_deposit_or_claim_p_${fight.ID.toString()}`
  betPerRound.textContent = `${fight.amountPerRound / 10**decimals} ${token}`
  amountDepositOrClaim.textContent = `${fight.baseAmount / 10**decimals} ${token}`
  li.appendChild(headerDiv)
  li.appendChild(middleDiv)
  li.appendChild(bottomDiv)
  bottomDiv.appendChild(button)
  return li
}