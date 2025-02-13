import { ActionTypes, InventoryTypes, mobileAndTabletCheck } from "../utils/utils"

// import charactersJsons from '../../jsons/characters.json'
import armorsJsons from '../../jsons/armors.json'
import bootsJsons from '../../jsons/boots.json'
import weaponsJsons from '../../jsons/weapons.json'

const regexForImageID = /\/(\d+)\.png$/
const chooseCharacterButtonId = `inventory-character-choose-`
const chooseArmorButtonId = `inventory-armor-choose-`
const chooseWeaponButtonId = `inventory-weapon-choose-`
const chooseBootsButtonId = `inventory-boots-choose-`

const playerHealth = document.querySelector('#player-health')
const playerBullets = document.querySelector('#player-bullets')
const playerSpeed = document.querySelector('#player-speed')
const playerJump = document.querySelector('#player-jump')

let __address
let drawTimeout

let basicPlayerCharacteristics = {
    health: 3,
    bullets: 3,
    speed: 480,
    jump: 160
}

let playerCharacteristics = {...basicPlayerCharacteristics}

const isMobile = mobileAndTabletCheck()

export const inventoryTon = async (address) => {
    if (address) {

        __address = address
        const inventory = await getInventory(address)
        let __character = new URLSearchParams();
        __character.append("address", address)
        __character.append("chainid", 0)
        __character.append("typeofimage", 'preview')
        const rawResponse3 = await fetch('/getcharacterimage?' + __character)
        let player1Image = await rawResponse3.blob().catch(err => console.log(err))
        if (!isNaN(parseInt(inventory.health_bonus))) playerCharacteristics.health += inventory.health_bonus
        if (!isNaN(parseInt(inventory.bullets_bonus))) playerCharacteristics.bullets += inventory.bullets_bonus
        if (!isNaN(parseInt(inventory.speed_bonus))) playerCharacteristics.speed += inventory.speed_bonus
        if (!isNaN(parseInt(inventory.jump_bonus))) playerCharacteristics.jump += inventory.jump_bonus
        updatePlayerCharacteristics()
        localStorage.setItem('chosenCharacter', inventory.characterid)
        localStorage.setItem('chosenArmor', inventory.armor)
        localStorage.setItem('chosenWeapon', inventory.weapon)
        localStorage.setItem('chosenBoots', inventory.boots)
        await inventoryModal(address, inventory)
        if (!isNaN(parseInt(inventory.characterid))) {
            const img = document.querySelector('#character-slot3')
            try {
                drawCharacterAnimation(player1Image)
            } catch (error) {
                console.log(error)
            }
            // let image = URL.createObjectURL(player1Image)
            // document.querySelector('#character-background').style.backgroundImage = `url(${image})`;
            img.src =  `/media/characters/${inventory.characterid}.png`
            rmSettedItemFromList(inventory.characterid, InventoryTypes.CHARACTERS)
        }
        if (!isNaN(parseInt(inventory.armor))) {
            const nftObject = inventory.nfts.find(obj => obj && obj.type === InventoryTypes.ARMORS && obj.id === inventory.armor);
            const nftItemAddress = nftObject.address
            const img = document.createElement('img')
            img.src = `/media/armors/${inventory.armor}.png`
            img.className = 'slot-wrap__slot-img'
            localStorage.setItem('setted-armor', img.src)
            const armorSlot = document.querySelector('#armor-slot')
            armorSlot.appendChild(img)
            armorSlot.classList.remove('armor__slot-background')
            armorSlot.classList.add('slot-wrap__slot_active')
            armorSlot.setAttribute('data-address', address)
            armorSlot.setAttribute('data-chainid', 0)
            armorSlot.setAttribute('data-type', InventoryTypes.ARMORS)
            armorSlot.setAttribute('data-image', `/media/armors/${inventory.armor}.png`)
            armorSlot.setAttribute('data-id', inventory.armor)
            armorSlot.setAttribute('data-action', ActionTypes.TAKEOFF)
            armorSlot.setAttribute('data-nftaddress', nftItemAddress)
            armorSlot.draggable = true
            armorSlot.addEventListener('dragstart', dragStartExistedElement)
            rmSettedItemFromList(inventory.armor, InventoryTypes.ARMORS)
        } else {
            localStorage.setItem('setted-armor', '')
        }
        if (!isNaN(parseInt(inventory.boots))) {
            const nftObject = inventory.nfts.find(obj => obj && obj.type === InventoryTypes.BOOTS && obj.id === inventory.boots);
            const nftItemAddress = nftObject.address
            const img = document.createElement('img')
            img.src = `/media/boots/${inventory.boots}.png`
            img.className = 'slot-wrap__slot-img'
            localStorage.setItem('setted-boots', img.src)
            const bootsSlot = document.querySelector('#boots-slot')
            bootsSlot.appendChild(img)
            bootsSlot.classList.remove('boots__slot-background')
            bootsSlot.classList.add('slot-wrap__slot_active')
            bootsSlot.setAttribute('data-address', address)
            bootsSlot.setAttribute('data-chainid', 0)
            bootsSlot.setAttribute('data-type', InventoryTypes.BOOTS)
            bootsSlot.setAttribute('data-image', `/media/boots/${inventory.boots}.png`)
            bootsSlot.setAttribute('data-id', inventory.boots)
            bootsSlot.setAttribute('data-action', ActionTypes.TAKEOFF)
            bootsSlot.setAttribute('data-nftaddress', nftItemAddress)
            bootsSlot.draggable = true
            bootsSlot.addEventListener('dragstart', dragStartExistedElement)
            rmSettedItemFromList(inventory.boots, InventoryTypes.BOOTS)
        } else {
            localStorage.setItem('setted-boots', '')
        }
        if (!isNaN(parseInt(inventory.weapon))) {
            const nftObject = inventory.nfts.find(obj => obj && obj.type === InventoryTypes.WEAPONS && obj.id === inventory.weapon);
            const nftItemAddress = nftObject.address
            const img = document.createElement('img')
            img.src = `/media/weapons/${inventory.weapon}.png`
            localStorage.setItem('setted-weapon', img.src)
            const weaponSlot = document.querySelector('#weapon-slot')
            weaponSlot.appendChild(img)
            weaponSlot.classList.remove('weapon__slot-background')
            weaponSlot.classList.add('slot-wrap__slot_active')
            weaponSlot.setAttribute('data-address', address)
            weaponSlot.setAttribute('data-chainid', 0)
            weaponSlot.setAttribute('data-type', InventoryTypes.WEAPONS)
            weaponSlot.setAttribute('data-image', `/media/weapons/${inventory.weapon}.png`)
            weaponSlot.setAttribute('data-id', inventory.weapon)
            weaponSlot.setAttribute('data-action', ActionTypes.TAKEOFF)
            weaponSlot.setAttribute('data-nftaddress', nftItemAddress)
            weaponSlot.draggable = true
            weaponSlot.addEventListener('dragstart', dragStartExistedElement)
            rmSettedItemFromList(inventory.weapon, InventoryTypes.WEAPONS)
            if (img.width === 293 || img.width === 120 || img.width === 64) {
                img.classList.add('slot-wrap__slot-img-wider')
            } else {
                img.classList.add('slot-wrap__slot-img')
            }
        } else {
            localStorage.setItem('setted-weapon', '')
        }
        setInventoryImage(inventory.characterid)
        inventorySwitcher()
        document.getElementById('btn-close-item-detail-modal').addEventListener('click', closeInventoryItemModal)
        setImage('armor-img', inventory.armor == null ? '/media/svg/inventory/armor.svg' : `/media/armors/${inventory.armor}.png`)
        setImage('weapons-img', inventory.weapon == null ? '/media/svg/inventory/weapon.svg' : `/media/weapons/${inventory.weapon}.png`)
        setImage('boots-img', inventory.boots == null ? '/media/svg/inventory/boots.svg' : `/media/boots/${inventory.boots}.png`)
        document.querySelector('#weapon-slot').addEventListener('click', async () => await showInventoryItemModalForSettedItem(InventoryTypes.WEAPONS))
        document.querySelector('#armor-slot').addEventListener('click', async () => await showInventoryItemModalForSettedItem(InventoryTypes.ARMORS))
        document.querySelector('#boots-slot').addEventListener('click', async () => await showInventoryItemModalForSettedItem(InventoryTypes.BOOTS))
        
    }
}

const inventoryModal = async (address, inventory) => {
    const characterHave = {
        id: 0,
        image: "/media/characters/0.png",
        name: "Fair Person",
        attributes: [
            {
                "trait_type": "Type",
                "value": "Character"
            }
        ],
        description: "Classic character with his own charm and charm. Available by default."
    }
    addInventoryItem("#left-inventory-characters-list", characterHave, InventoryTypes.CHARACTERS, address, 0, 0, inventory.address, inventory.characterid)
    let charactersCounter = 1
    let weaponsCounter = 0
    let armorsCounter = 0
    let bootsCounter = 0
    inventory.nfts.forEach(v => {
        if (v) {
            if (v.type == InventoryTypes.CHARACTERS) {
                addInventoryItem("#left-inventory-characters-list", v, InventoryTypes.CHARACTERS, address, 0, charactersCounter, v.address, inventory.characterid)
                charactersCounter += 1
            }
            if (v.type == InventoryTypes.WEAPONS) {
                addInventoryItem("#left-inventory-weapons-list", v, InventoryTypes.WEAPONS, address, 0, weaponsCounter, v.address, inventory.weapon)
                weaponsCounter += 1
            }v
            if (v.type == InventoryTypes.ARMORS) {
                addInventoryItem("#left-inventory-armors-list", v, InventoryTypes.ARMORS, address, 0, armorsCounter, v.address, inventory.armor)
                armorsCounter += 1
            }
            if (v.type == InventoryTypes.BOOTS) {
                addInventoryItem("#left-inventory-boots-list", v, InventoryTypes.BOOTS, address, 0, bootsCounter, v.address, inventory.boots)
                bootsCounter += 1
            }
        }
    })
    const charactersListItem = document.querySelector("#left-inventory-characters-list")
    const weaponsListItem = document.querySelector("#left-inventory-weapons-list")
    const armorListItem = document.querySelector("#left-inventory-armors-list")
    const bootsListItem = document.querySelector("#left-inventory-boots-list")
    document.querySelector('#character-slot1').addEventListener('dragover', (event) => event.preventDefault())
    document.querySelector('#character-slot1').addEventListener('drop', drop)
    document.querySelector('#armor-slot').addEventListener('dragover', (event) => event.preventDefault())
    document.querySelector('#armor-slot').addEventListener('drop', drop)
    document.querySelector('#boots-slot').addEventListener('dragover', (event) => event.preventDefault())
    document.querySelector('#boots-slot').addEventListener('drop', drop)
    document.querySelector('#weapon-slot').addEventListener('dragover', (event) => event.preventDefault())
    document.querySelector('#weapon-slot').addEventListener('drop', drop)
    charactersListItem.addEventListener('dragover', (event) => event.preventDefault())
    charactersListItem.addEventListener('drop', dropExistedElement)
    weaponsListItem.addEventListener('dragover', (event) => event.preventDefault())
    weaponsListItem.addEventListener('drop', dropExistedElement)
    armorListItem.addEventListener('dragover', (event) => event.preventDefault())
    armorListItem.addEventListener('drop', dropExistedElement)
    bootsListItem.addEventListener('dragover', (event) => event.preventDefault())
    bootsListItem.addEventListener('drop', dropExistedElement)
}

export const addInventoryItem = (itemListId, item, itemType, address, network, i, nftItemAddress, settedId, _height, _width) => {
    const lowerCollection = item.collection ? item.collection.toLowerCase() : 'character'
    const listItem = document.querySelector(itemListId)
    let list = listItem.querySelectorAll('.item-list__slot')
    const img = document.createElement('img')
    img.src = item.image
    let width = img.width
    let height = img.height
    if (_height) height = _height
    if (_width) width = _width
    img.classList.add((width === 293 || width === 120) ? 'inventory-items-wider' : 'inventory-items', `list-items__item_${lowerCollection}`)
    img.draggable = true
    img.setAttribute('data-address', address)
    img.setAttribute('data-chainid', network)
    img.setAttribute('data-type', itemType)
    img.setAttribute('data-image', item.image)
    img.setAttribute('data-id', item.id)
    img.setAttribute('data-action', ActionTypes.TAKEON)
    img.setAttribute('data-nftaddress', nftItemAddress)
    img.addEventListener('dragstart', dragStart)
    img.addEventListener('dragend', dropStartElement)
    img.addEventListener('click', () => 
        {    
            showInventoryItemModal(
            item.image, item.name, item.attributes, item.description ? item.description : 'Description', itemType, item.id, '', undefined, undefined,nftItemAddress
            )
        }
    )

    let collectionClass = `item-list__slot_green`
    if (itemType === InventoryTypes.CHARACTERS) {
        collectionClass = `item-list__slot_silver`
    }
    if (lowerCollection === 'epic') {
        collectionClass = `item-list__slot_purple`
    }
    if (lowerCollection === `legendary`) {
        collectionClass = `item-list__slot_orange`
    }
    if (lowerCollection === `basic`) {
        collectionClass = `item-list__slot_silver`
    }
    if (lowerCollection === `rare`) {
        collectionClass = `item-list__slot_blue`
    }
    if (!list.item(i)) {
        const _slot = document.createElement('div')
        _slot.classList.add('item-list__slot')
            const corner1Image = document.createElement('img')
            const corner2Image = document.createElement('img')
            const corner3Image = document.createElement('img')
            const corner4Image = document.createElement('img')
            corner1Image.className = 'board-edge_sm  modal-content__corner'
            corner2Image.className = 'board-edge_sm  modal-content__corner'
            corner3Image.className = 'board-edge_sm  modal-content__corner'
            corner4Image.className = 'board-edge_sm  modal-content__corner'
            corner1Image.src = 'media/svg/inventory/basic-edge-slot.svg'
            corner2Image.src = 'media/svg/inventory/basic-edge-slot.svg'
            corner3Image.src = 'media/svg/inventory/basic-edge-slot.svg'
            corner4Image.src = 'media/svg/inventory/basic-edge-slot.svg'
            _slot.append(corner1Image, corner2Image, corner3Image, corner4Image)
        listItem.querySelector('.list-wrap__item-list').appendChild(_slot)
        _slot.classList.add(collectionClass)
        _slot.appendChild(img)
        if (settedId === i) {
            _slot.style.display = 'none'
        }
    } else {
        list.item(i).classList.add(collectionClass)
        list.item(i).appendChild(img)
        if (settedId === i) {
            list.item(i).style.display = 'none'
        }
    }
    try {
        Array.from(list.item(i).children).forEach((child) => {
            if(lowerCollection === 'character') {
                return
            }
            if(child.className.includes('board-edge')) {
                child.src = `media/svg/inventory/${lowerCollection}-edge-slot.svg`
            }
        })
    } catch (error) {
    }
}

const showInventoryItemModalForSettedItem = async (itemType) => {
    //получаем id по картинке которая на установленном item'e
    let element = document.querySelector('#weapon-slot')
    if (itemType === InventoryTypes.ARMORS) {
        element = document.querySelector('#armor-slot')
    }
    if (itemType === InventoryTypes.BOOTS) {
        element = document.querySelector('#boots-slot')
    }
    if (element.firstElementChild) {
        const nftItemAddress = element.getAttribute('data-nftaddress')
        const itemId = element.firstElementChild.src.match(regexForImageID)[1]
        const itemImage = `/media/${itemType}/${itemId}.png`
        let jsonData = weaponsJsons[itemId]
        if (itemType === InventoryTypes.ARMORS) {
            jsonData = armorsJsons[itemId]
        }
        if (itemType === InventoryTypes.BOOTS) {
            jsonData = bootsJsons[itemId]
        }
        await showInventoryItemModal(
            itemImage, 
            jsonData.name,
            jsonData.attributes,
            jsonData.description,
            itemType,
            itemId,
            '',
            undefined
            ,
            undefined,
            nftItemAddress
        )
    }
}

export const showInventoryItemModal = async (
    itemImage, itemName, itemFeatures, itemDescription,
    itemType, itemId, currentItemIdOfThisType, from, payload, itemNftAddress, infoPricingBuyNowWrapper = null
    ) => {
    let current;
    if (itemType === InventoryTypes.CHARACTERS) {
        let elementToCheckCurrent = document.querySelector('#character-slot3')
        const match = elementToCheckCurrent.src.match(regexForImageID)
        if (match) current = match[1]
    }
    if (itemType === InventoryTypes.WEAPONS) {
        let elementToCheckCurrent = document.querySelector('#weapon-slot')
        if (elementToCheckCurrent.firstElementChild && elementToCheckCurrent.firstElementChild.src) {
            const match = elementToCheckCurrent.firstElementChild.src.match(regexForImageID)
            if (match) current = match[1]
        }
    }
    if (itemType === InventoryTypes.ARMORS) {
        let elementToCheckCurrent = document.querySelector('#armor-slot')
        if (elementToCheckCurrent.firstElementChild && elementToCheckCurrent.firstElementChild.src) {
            const match = elementToCheckCurrent.firstElementChild.src.match(regexForImageID)
            if (match) current = match[1]
        }
    }
    if (itemType === InventoryTypes.BOOTS) {
        let elementToCheckCurrent = document.querySelector('#boots-slot')
        if (elementToCheckCurrent.firstElementChild && elementToCheckCurrent.firstElementChild.src) {
            const match = elementToCheckCurrent.firstElementChild.src.match(regexForImageID)
            if (match) current = match[1]
        }
    }
    const itemCollection = itemType === InventoryTypes.CHARACTERS || payload?.nftTypeName === InventoryTypes.CHARACTERS ? 'Character' :  itemFeatures.find(v => v.trait_type === 'Class').value
    const itemFeaturesSlice = itemFeatures.slice(2)
    const name = document.querySelector('#inventory-item-modal-name')
    const collection = document.querySelector('#inventory-item-modal-collection')
    const features = document.querySelector('#inventory-item-modal-features')
    const description = document.querySelector('#inventory-item-modal-description')
    const image = document.querySelector('#inventory-item-modal-image')
    const edges = document.querySelectorAll('[data-edge="inventory-item"]')
    const useButton = document.querySelector('#inventory-item-modal-use')
    const tryonButton = document.querySelector('#inventory-item-modal-tryon')
     ? document.querySelector('#inventory-item-modal-tryon') : document.querySelector('#inventory-item-modal-tryon-collection')
    const takeoffButton = document.querySelector('#inventory-item-modal-takeitoff')
    const inventoryItemModal= document.querySelector('#inventory-item-modal')
    const actionButton = document.querySelectorAll('[data-button="action"]')
    const closeInventoryModal = document.getElementById('btn-close-item-detail-modal')

    closeInventoryModal.onclick = function() {
        closeInventoryItemModal()
    }

    const inventoryItemBody = document.getElementById('inventory-item-body')
    inventoryItemBody.className = `inventory-item-body_${itemCollection.toLowerCase()}`

    edges.forEach(el => {
        if(itemType === InventoryTypes.CHARACTERS || payload?.nftTypeName === InventoryTypes.CHARACTERS) {
            el.src = `media/svg/inventory-modal/inventory-item-edge-basic.svg`
            return
        }
        el.src = `media/svg/inventory-modal/inventory-item-edge-${itemCollection.toLowerCase()}.svg`
    })

    name.textContent = itemName
    name.className = `text-item__${itemCollection.toLowerCase()}`
    collection.textContent = itemCollection
    description.textContent = itemDescription
    image.src = itemImage
    itemFeaturesSlice.forEach(v => {
        const featureElement = document.createElement('div')
        featureElement.classList.add('props-item__prop')
            const featureElementImgWrap = document.createElement('img')
            featureElementImgWrap.classList.add('prop__img-wrap')
                if (v.trait_type.includes('Bullets')) {
                    featureElementImgWrap.src = `media/svg/props-items/ammunition-quantity.svg`
                }
                if (v.trait_type.includes('Health')) {
                    featureElementImgWrap.src = `media/svg/props-items/heals.svg`
                }
                if (v.trait_type.includes('Speed')) {
                    featureElementImgWrap.src = `media/svg/props-items/speed.svg`
                }
                if (v.trait_type.includes('Jump')) {
                    featureElementImgWrap.src = `media/svg/props-items/jump.svg`
                }
            featureElement.appendChild(featureElementImgWrap)
            const featureElementName = document.createElement('span')
            featureElementName.classList.add('prop__title')
            featureElementName.textContent = v.trait_type
            const featureElementValue = document.createElement('span')
            featureElementValue.classList.add('prop__value')
            featureElementValue.textContent = `+${v.value}`
            featureElement.append(featureElementName, featureElementValue)
        features.appendChild(featureElement)
    })
    document.querySelector('#inventory-item-modal').style.display = 'flex'
   
    if (from === 'shop'){
        if(actionButton) {
            actionButton.forEach(button => {
                button.style.display = 'block'
            })
        }

        payload.tryOn.style.display = 'block'
        
        const inventoryItemModal = document.getElementById('inventory-item-modal').querySelector(".body__item-detail")
        const parent = document.querySelector('#inventory-item-body')
        const oldButtonsWrap = document.querySelector('.detail-buttons') 
        const newButtonsWrap = document.createElement('div') 
        newButtonsWrap.classList.add('detail-buttons', 'item-detail__btns-wrap') 

        const takeitoff = document.createElement('button')
        takeitoff.setAttribute('id', 'inventory-item-modal-takeitoff')
        takeitoff.textContent = 'Take it off'
        takeitoff.style.display = 'none'
        const use = document.createElement('button')
        use.setAttribute('id', 'inventory-item-modal-use')
        use.textContent = 'Use'    
        use.style.display = 'none'
        const gToInventory = document.createElement('button')
        gToInventory.setAttribute('id', 'go-to-inventory-btn-from-loot')
        gToInventory.textContent = 'Go to inventory'    
        gToInventory.style.display = 'none'
        gToInventory.classList.add('go-inventory_from-loot', 'go-inventory')


        newButtonsWrap.append(takeitoff, use, gToInventory, payload.tryOn, payload.infoPricingBuyNowButton)
        inventoryItemModal.appendChild(payload.infoPricingBuyNowDropdown)

        parent.replaceChild(newButtonsWrap, oldButtonsWrap);
    }
    else if(from === 'loot') {
        useButton.style.display = 'none'
        tryonButton.style.display = 'none'
        if(actionButton) {
            actionButton.forEach(button => {
                button.style.display = 'none'
            })
        }
        document.querySelector('#inventory-item-modal-takeitoff').style.display = 'none'
        const goToInventoryBtn = document.querySelector('#go-to-inventory-btn-from-loot')

        goToInventoryBtn.style.display = 'block'
        goToInventoryBtn.addEventListener('click', () => {
            const inventoryModalOverlay = document.getElementById('inventory-modal')
            inventoryModalOverlay.classList.toggle('modal-overlay_active')
          
            if (inventoryModalOverlay.classList.contains('modal-overlay_active')) {
              document.body.style.overflow = 'hidden'
            }
            else {
              document.body.style.overflow = 'auto'
            }
            const shopModal = document.querySelector('#shop-block')
            shopModal.classList.remove('wrapper__nft-shop-modal-overlay_active')
            document.querySelector('#inventory-item-modal').style.display = 'none'
          })

    }
    else {
        tryonButton.style.display = 'none'
        if(actionButton) {
            actionButton.forEach(button => {
                button.style.display = 'none'
            })
        }
        document.querySelector('#go-to-inventory-btn-from-loot').style.display = 'none'
        if (current) {
            if (itemType !== InventoryTypes.CHARACTERS) {
                if (current.toString() === itemId.toString()) {
                    useButton.style.display = 'none'
                    const clonedButton = takeoffButton.cloneNode(true);
                    takeoffButton.parentNode.replaceChild(clonedButton, takeoffButton);
                    clonedButton.style.display = ''
                    clonedButton.addEventListener('click', async () => await useItemFromModal(itemType, null, itemImage, itemNftAddress))
                } else {
                    takeoffButton.style.display = 'none'
                    const clonedButton = useButton.cloneNode(true);
                    useButton.parentNode.replaceChild(clonedButton, useButton);
                    clonedButton.style.display = ''
                    clonedButton.addEventListener('click', async () => await useItemFromModal(itemType, itemId, itemImage, itemNftAddress))
                }
            } else {
                if (current.toString() === itemId.toString()) {
                    takeoffButton.style.display = 'none'
                    useButton.style.display = 'none'
                } else {
                    takeoffButton.style.display = 'none'
                    const clonedButton = useButton.cloneNode(true);
                    useButton.parentNode.replaceChild(clonedButton, useButton);
                    clonedButton.style.display = ''
                    clonedButton.addEventListener('click', async () => await useItemFromModal(itemType, itemId, itemImage, itemNftAddress))
                }
            }
        } else {
            takeoffButton.style.display = 'none'
             document.querySelector('#go-to-inventory-btn-from-loot').style.display = 'none'
            const clonedButton = useButton.cloneNode(true);
            useButton.parentNode.replaceChild(clonedButton, useButton);
            clonedButton.style.display = ''
            clonedButton.addEventListener('click', async () => await useItemFromModal(itemType, itemId, itemImage, itemNftAddress))
        }
    }
}

const useItemFromModal = async (itemType, itemId, itemImage, itemNftAddress) => {
    try {
        let element
        let url
        if (itemType === InventoryTypes.CHARACTERS) {
            element = document.querySelector("#character-slot3")
            url = 'ton/setcharacter'
            addBigLoaderToInventoryItem(element.parentElement)
        } else if (itemType === InventoryTypes.WEAPONS) {
            element = document.querySelector('#weapon-slot')
            element.classList.remove('weapon__slot-background')
            url = 'ton/setweapon'
            if (element.firstElementChild) element.firstElementChild.style.display = 'none'
            addLoaderToInventoryItem(element)
        } else if (itemType === InventoryTypes.ARMORS) {
            element = document.querySelector('#armor-slot')
            element.classList.remove('armor__slot-background')
            url = 'ton/setarmor'
            if (element.firstElementChild) element.firstElementChild.style.display = 'none'
            addLoaderToInventoryItem(element)
        } else if (itemType === InventoryTypes.BOOTS) {
            element = document.querySelector('#boots-slot')
            element.classList.remove('boots__slot-background')
            url = 'ton/setboots'
            if (element.firstElementChild) element.firstElementChild.style.display = 'none'
            addLoaderToInventoryItem(element)
        }
        closeInventoryItemModal()
        const status = await setInventory(__address, 0, url, itemId, itemNftAddress)
        if (itemType === InventoryTypes.CHARACTERS) {
            removeBigLoaderToInventoryItem(element.parentElement)
        } else {
            removeLoaderToInventoryItem(element)
            if (element.firstElementChild) element.firstElementChild.style.display = ''
        }
        if (status === 200) {
            if (itemType === InventoryTypes.CHARACTERS) {
                const previousId = element.src.match(regexForImageID)[1]
                showSettedItemFromList(previousId, itemType)
                element.src = itemImage
                rmSettedItemFromList(itemId, itemType)
            } else {
                if (itemId !== null) {
                    if (element.firstElementChild) {
                        const previousId = element.getAttribute('data-id')
                        showSettedItemFromList(previousId, itemType)
                        element.firstElementChild.src = itemImage
                        element.setAttribute('data-address', __address)
                        element.setAttribute('data-chainid', 0)
                        element.setAttribute('data-type', itemType)
                        element.setAttribute('data-image', itemImage)
                        element.setAttribute('data-id', itemId)
                        element.setAttribute('data-action', ActionTypes.TAKEOFF)
                        element.setAttribute('data-nftaddress', itemNftAddress)
                        element.draggable = true
                        element.addEventListener('dragstart', dragStartExistedElement)
                    } else {
                        const img = document.createElement('img')
                        img.src = itemImage
                        element.setAttribute('data-address', __address)
                        element.setAttribute('data-chainid', 0)
                        element.setAttribute('data-type', itemType)
                        element.setAttribute('data-image', itemImage)
                        element.setAttribute('data-id', itemId)
                        element.setAttribute('data-action', ActionTypes.TAKEOFF)
                        element.setAttribute('data-nftaddress', itemNftAddress)
                        element.draggable = true
                        element.addEventListener('dragstart', dragStartExistedElement)
                        element.appendChild(img)
                        element.classList.add('slot-wrap__slot_active')
                        element.classList.remove('weapon__slot-background')
                        element.classList.remove('armor__slot-background')
                        element.classList.remove('boots__slot-background')
                        showSettedItemFromList(itemId, itemType)
                    }
                    const _img = document.createElement('img')
                    _img.src = itemImage
                    if (itemType === InventoryTypes.WEAPONS) {
                        if (_img.width === 293 || _img.width === 120 || _img.width === 64) {
                            element.firstElementChild.classList.remove(...element.firstElementChild.classList)
                            element.firstElementChild.classList.add('slot-wrap__slot-img-wider')
                        } else {
                            element.firstElementChild.classList.remove(...element.firstElementChild.classList)
                            element.firstElementChild.classList.add('slot-wrap__slot-img')
                        }
                        const _item = weaponsJsons[itemId]
                        const _bullets = _item.attributes[2].value
                        playerCharacteristics.bullets = basicPlayerCharacteristics.bullets + parseInt(_bullets)
                    }
                    if (itemType === InventoryTypes.ARMORS) {
                        const _item = armorsJsons[itemId]
                        const _health = _item.attributes[2].value
                        playerCharacteristics.health = basicPlayerCharacteristics.health + parseInt(_health)
                        element.firstElementChild.className = 'slot-wrap__slot-img'
                    }
                    if (itemType === InventoryTypes.BOOTS) {
                        const _item = bootsJsons[itemId]
                        const _speed = _item.attributes[2].value
                        const _jump = _item.attributes[3].value
                        playerCharacteristics.speed = basicPlayerCharacteristics.speed + parseInt(_speed)
                        playerCharacteristics.jump = basicPlayerCharacteristics.jump + parseInt(_jump)
                        element.firstElementChild.className = 'slot-wrap__slot-img'
                    }
                    rmSettedItemFromList(itemId, itemType)
                    updatePlayerCharacteristics()
                } else {
                    if (itemType === InventoryTypes.WEAPONS) {
                        if (element.firstElementChild) {
                            const previousId = element.getAttribute('data-id')
                            showSettedItemFromList(previousId, itemType)
                            element.firstElementChild.remove()
                        }
                        element.classList.remove('slot-wrap__slot_active')
                        element.classList.add('weapon__slot-background')
                        playerCharacteristics.bullets = basicPlayerCharacteristics.bullets
                    }
                    if (itemType === InventoryTypes.ARMORS) {
                        if (element.firstElementChild) {
                            const previousId = element.getAttribute('data-id')
                            showSettedItemFromList(previousId, itemType)
                            element.firstElementChild.remove()
                        }
                        element.classList.remove('slot-wrap__slot_active')
                        element.classList.add('armor__slot-background')
                        playerCharacteristics.health = basicPlayerCharacteristics.health
                    }
                    if (itemType === InventoryTypes.BOOTS) {
                        if (element.firstElementChild) {
                            const previousId = element.getAttribute('data-id')
                            showSettedItemFromList(previousId, itemType)
                            element.firstElementChild.remove()
                        }
                        element.classList.remove('slot-wrap__slot_active')
                        element.classList.add('boots__slot-background')
                        playerCharacteristics.speed = basicPlayerCharacteristics.speed
                        playerCharacteristics.jump = basicPlayerCharacteristics.jump
                    }
                    updatePlayerCharacteristics()
                }
            }
        } else {
            errorModal.style.display = 'flex'
            errorModalText.textContent = "The player has the open game or does not have the item"
        }
    } catch (error) {
        
    }
}

const closeInventoryItemModal = () => {
    document.querySelector('#inventory-item-modal-use').style.display = 'block'
    document.querySelector('#inventory-item-modal-tryon') ?
    document.querySelector('#inventory-item-modal-tryon').style.display = 'block'
    : document.querySelector('#inventory-item-modal-tryon-collection').style.display = 'block'
    document.querySelector('#inventory-item-modal-takeitoff').style.display = 'block'
    document.querySelector('#go-to-inventory-btn-from-loot').style.display = 'block'
    const actionButton = document.querySelectorAll('[data-button="action"]')
    actionButton.forEach(button => {
        button.style.display = 'block'
    })
    const features = document.querySelector('#inventory-item-modal-features')
    features.replaceChildren()
    document.querySelector('#inventory-item-modal').style.display = 'none'
    document.querySelectorAll('.buy-now-btn__wrapper-dropdown').forEach(element => element.style.cssText = 'display: none !important;')
}

const dragStart = (event) => {
    try {
        const slot = event.target;
        const itemType = slot.getAttribute('data-type')
        const itemId = slot.getAttribute('data-id')
        const itemImage = slot.getAttribute('data-image')
        const itemAddress = slot.getAttribute('data-address')
        const itemChainid = slot.getAttribute('data-chainid')
        const itemAction = slot.getAttribute('data-action')
        const itemNftAddress = slot.getAttribute('data-nftaddress')
        const characterSlot = document.querySelector('#character-slot2')
        const weaponSlot = document.querySelector('#weapon-slot')
        const armorSlot = document.querySelector('#armor-slot')
        const bootsSlot = document.querySelector('#boots-slot')
        if (itemType === InventoryTypes.CHARACTERS) {
            characterSlot.classList.add('available-slot')
            weaponSlot.classList.add('dont-available-slot')
            armorSlot.classList.add('dont-available-slot')
            bootsSlot.classList.add('dont-available-slot')
        }
        if (itemType === InventoryTypes.WEAPONS) {
            characterSlot.classList.add('dont-available-slot')
            weaponSlot.classList.add('available-slot')
            armorSlot.classList.add('dont-available-slot')
            bootsSlot.classList.add('dont-available-slot')
        }
        if (itemType === InventoryTypes.ARMORS) {
            characterSlot.classList.add('dont-available-slot')
            weaponSlot.classList.add('dont-available-slot')
            armorSlot.classList.add('available-slot')
            bootsSlot.classList.add('dont-available-slot')
        }
        if (itemType === InventoryTypes.BOOTS) {
            characterSlot.classList.add('dont-available-slot')
            weaponSlot.classList.add('dont-available-slot')
            armorSlot.classList.add('dont-available-slot')
            bootsSlot.classList.add('available-slot')
        }
        event.dataTransfer.setData('text/plain', JSON.stringify({ action: itemAction, type: itemType, id: itemId, image: itemImage, address: itemAddress, chainid: itemChainid, nftAddress: itemNftAddress }));    
    } catch (error) {
        
    }
}

const drop = async (event) => {
    try {
        const errorModal = document.querySelector('#new-error-modal')
        const errorModalText = document.querySelector('#new-error-modal-text')
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const itemType = data.type; 
        const itemId = data.id;
        const itemImage = data.image;
        const itemAddress = data.address;
        const itemChainid = data.chainid;
        const itemAction = data.action;
        if (itemAction === ActionTypes.TAKEON && (event.target.id === 'character-slot1' || event.target.id === 'character-slot2' || event.target.id === 'character-slot3' || event.target.id === 'character-background') && itemType === InventoryTypes.CHARACTERS) {
            const img = document.querySelector('#character-slot3')
            addBigLoaderToInventoryItem(img.parentElement)
            img.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setcharacter', itemId)
            removeBigLoaderToInventoryItem(img.parentElement)
            if (status === 200) {
                const previousId = img.src.match(regexForImageID)[1]
                showSettedItemFromList(previousId, itemType)
                img.src = itemImage
                rmSettedItemFromList(itemId, InventoryTypes.CHARACTERS)
            } else {
                errorModal.style.display = 'flex'
                errorModalText.textContent = "The player has the open game or does not have the item"
            }
        }
        if (itemAction === ActionTypes.TAKEON && event.target.id === 'weapon-slot' && itemType === InventoryTypes.WEAPONS) {
            event.target.classList.remove('weapon__slot-background')
            addLoaderToInventoryItem(event.target)
            if (event.target.firstElementChild) event.target.firstElementChild.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setweapon', itemId)
            removeLoaderToInventoryItem(event.target)
            if (event.target.firstElementChild) event.target.firstElementChild.style.display = ''
            if (status === 200) {
                rmSettedItemFromList(itemId, InventoryTypes.WEAPONS)
                if (event.target.firstElementChild) {
                    const previousId = event.target.getAttribute('data-id')
                    showSettedItemFromList(previousId, itemType)
                    event.target.classList.add('slot-wrap__slot_active')
                    event.target.firstElementChild.src = itemImage
                    event.target.setAttribute('data-address', itemAddress)
                    event.target.setAttribute('data-chainid', itemChainid)
                    event.target.setAttribute('data-type', itemType)
                    event.target.setAttribute('data-image', itemImage)
                    event.target.setAttribute('data-id', itemId)
                    event.target.draggable = true
                    event.target.setAttribute('data-action', ActionTypes.TAKEOFF)
                    event.target.addEventListener('dragstart', dragStartExistedElement)
                } else {
                    const img = document.createElement('img')
                    img.src = itemImage
                    event.target.setAttribute('data-address', itemAddress)
                    event.target.setAttribute('data-chainid', itemChainid)
                    event.target.setAttribute('data-type', itemType)
                    event.target.setAttribute('data-image', itemImage)
                    event.target.setAttribute('data-id', itemId)
                    event.target.setAttribute('data-action', ActionTypes.TAKEOFF)
                    event.target.draggable = true
                    event.target.addEventListener('dragstart', dragStartExistedElement)
                    event.target.appendChild(img)
                }
                //depends on image in weapon slot diff size
                const _img = document.createElement('img')
                _img.src = itemImage
                if (_img.width === 293 || _img.width === 120 || _img.width === 64) {
                    event.target.firstElementChild.classList.remove(...event.target.firstElementChild.classList)
                    event.target.firstElementChild.classList.add('slot-wrap__slot-img-wider')
                } else {
                    event.target.firstElementChild.classList.remove(...event.target.firstElementChild.classList)
                    event.target.firstElementChild.classList.add('slot-wrap__slot-img')
                }
                const _item = weaponsJsons[itemId]
                const _bullets = _item.attributes[2].value
                playerCharacteristics.bullets = basicPlayerCharacteristics.bullets + parseInt(_bullets)
                updatePlayerCharacteristics()
                event.target.classList.add('slot-wrap__slot_active')
                event.target.classList.remove('weapon__slot-background')
            } else {
                errorModal.style.display = 'flex'
                errorModalText.textContent = "The player has the open game or does not have the item"
            }
        }
        if (itemAction === ActionTypes.TAKEON && event.target.id === 'armor-slot' && itemType === InventoryTypes.ARMORS) {
            event.target.classList.remove('armor__slot-background')
            addLoaderToInventoryItem(event.target)
            if (event.target.firstElementChild) event.target.firstElementChild.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setarmor', itemId)
            removeLoaderToInventoryItem(event.target)
            if (event.target.firstElementChild) event.target.firstElementChild.style.display = ''
            if (status === 200) {
                rmSettedItemFromList(itemId, InventoryTypes.ARMORS)
                if (event.target.firstElementChild) {
                    const previousId = event.target.getAttribute('data-id')
                    showSettedItemFromList(previousId, itemType)
                    event.target.classList.add('slot-wrap__slot_active')
                    event.target.firstElementChild.src = itemImage
                    event.target.setAttribute('data-address', itemAddress)
                    event.target.setAttribute('data-chainid', itemChainid)
                    event.target.setAttribute('data-type', itemType)
                    event.target.setAttribute('data-image', itemImage)
                    event.target.setAttribute('data-id', itemId)
                    event.target.draggable = true
                    event.target.setAttribute('data-action', ActionTypes.TAKEOFF)
                    event.target.addEventListener('dragstart', dragStartExistedElement)
                } else {
                    const img = document.createElement('img')
                    img.src = itemImage
                    event.target.setAttribute('data-address', itemAddress)
                    event.target.setAttribute('data-chainid', itemChainid)
                    event.target.setAttribute('data-type', itemType)
                    event.target.setAttribute('data-image', itemImage)
                    event.target.setAttribute('data-id', itemId)
                    event.target.setAttribute('data-action', ActionTypes.TAKEOFF)
                    event.target.draggable = true
                    event.target.addEventListener('dragstart', dragStartExistedElement)
                    event.target.appendChild(img)
                }
                event.target.firstElementChild.className = 'slot-wrap__slot-img'
                const _item = armorsJsons[itemId]
                const _health = _item.attributes[2].value
                playerCharacteristics.health = basicPlayerCharacteristics.health + parseInt(_health)
                updatePlayerCharacteristics()
                event.target.classList.add('slot-wrap__slot_active')
                event.target.classList.remove('armor__slot-background')
            } else {
                errorModal.style.display = 'flex'
                errorModalText.textContent = "The player has the open game or does not have the item"
            }
        }
        if (itemAction === ActionTypes.TAKEON && event.target.id === 'boots-slot' && itemType === InventoryTypes.BOOTS) {
            event.target.classList.remove('boots__slot-background')
            addLoaderToInventoryItem(event.target)
            if (event.target.firstElementChild) event.target.firstElementChild.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setboots', itemId)
            removeLoaderToInventoryItem(event.target)
            if (event.target.firstElementChild) event.target.firstElementChild.style.display = ''
            if (status === 200) {
                rmSettedItemFromList(itemId, InventoryTypes.BOOTS)
                if (event.target.firstElementChild) {
                    const previousId = event.target.getAttribute('data-id')
                    showSettedItemFromList(previousId, itemType)
                    event.target.classList.add('slot-wrap__slot_active')
                    event.target.firstElementChild.src = itemImage
                    event.target.setAttribute('data-address', itemAddress)
                    event.target.setAttribute('data-chainid', itemChainid)
                    event.target.setAttribute('data-type', itemType)
                    event.target.setAttribute('data-image', itemImage)
                    event.target.setAttribute('data-id', itemId)
                    event.target.setAttribute('data-action', ActionTypes.TAKEOFF)
                    event.target.draggable = true
                    event.target.addEventListener('dragstart', dragStartExistedElement)
                } else {
                    const img = document.createElement('img')
                    img.src = itemImage
                    event.target.setAttribute('data-address', itemAddress)
                    event.target.setAttribute('data-chainid', itemChainid)
                    event.target.setAttribute('data-type', itemType)
                    event.target.setAttribute('data-image', itemImage)
                    event.target.setAttribute('data-id', itemId)
                    event.target.setAttribute('data-action', ActionTypes.TAKEOFF)
                    event.target.draggable = true
                    event.target.addEventListener('dragstart', dragStartExistedElement)
                    event.target.appendChild(img)
                }
                event.target.firstElementChild.className = 'slot-wrap__slot-img'
                const _item = bootsJsons[itemId]
                const _speed = _item.attributes[2].value
                const _jump = _item.attributes[3].value
                playerCharacteristics.speed = basicPlayerCharacteristics.speed + parseInt(_speed)
                playerCharacteristics.jump = basicPlayerCharacteristics.jump + parseInt(_jump)
                updatePlayerCharacteristics()
                event.target.classList.add('slot-wrap__slot_active')
                event.target.classList.remove('boots__slot-background')
            } else {
                errorModal.style.display = 'flex'
                errorModalText.textContent = "The player has the open game or does not have the item"
            }
        }
        dropStartElement()
    } catch (error) {
        console.log(error)
    }
}

const dropStartElement = () => {
    document.querySelector('#character-slot2').classList.remove('available-slot', 'dont-available-slot')
    document.querySelector('#weapon-slot').classList.remove('available-slot', 'dont-available-slot')
    document.querySelector('#armor-slot').classList.remove('available-slot', 'dont-available-slot')
    document.querySelector('#boots-slot').classList.remove('available-slot', 'dont-available-slot')
}

const dragStartExistedElement = (event) => {
    try {
        const slot = event.target
        event.target.classList.add('slot-wrap__slot_active')
        const itemType = slot.getAttribute('data-type')
        const itemId = slot.getAttribute('data-id')
        const itemImage = slot.getAttribute('data-image')
        const itemAddress = slot.getAttribute('data-address')
        const itemChainid = slot.getAttribute('data-chainid')
        const itemAction = slot.getAttribute('data-action')
        event.dataTransfer.setData('text/plain', JSON.stringify({ action: itemAction, type: itemType, id: itemId, image: itemImage, address: itemAddress, chainid: itemChainid }));    
    } catch (error) {
        
    }
}

const dropExistedElement = async (event) => {
    try {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const itemType = data.type; 
        const itemId = data.id;
        const itemImage = data.image;
        const itemAddress = data.address;
        const itemChainid = data.chainid;
        const itemAction = data.action;
        if (itemAction === ActionTypes.TAKEOFF && (event.target.classList.contains('item-list__slot') || event.target.classList.contains('list-wrap__item-list')) && itemType === InventoryTypes.WEAPONS) {
            const weaponSlot = document.querySelector('#weapon-slot')
            weaponSlot.classList.remove('slot-wrap__slot_active')
            addLoaderToInventoryItem(weaponSlot)
            weaponSlot.firstElementChild.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setweapon', null, null)
            removeLoaderToInventoryItem(weaponSlot)
            weaponSlot.firstElementChild.style.display = ''
            if (status === 200) {
                weaponSlot.classList.add('weapon__slot-background')
                playerCharacteristics.bullets = basicPlayerCharacteristics.bullets
                showSettedItemFromList(itemId, itemType)
                weaponSlot.firstElementChild.remove()
            }
        }
        if (itemAction === ActionTypes.TAKEOFF && (event.target.classList.contains('item-list__slot') || event.target.classList.contains('list-wrap__item-list')) && itemType === InventoryTypes.ARMORS) {
            const armorSlot = document.querySelector('#armor-slot')
            armorSlot.classList.remove('slot-wrap__slot_active')
            addLoaderToInventoryItem(armorSlot)
            armorSlot.firstElementChild.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setarmor', null, null)
            removeLoaderToInventoryItem(armorSlot)
            armorSlot.firstElementChild.style.display = ''
            if (status === 200) {
                armorSlot.classList.add('armor__slot-background')
                armorSlot.firstElementChild.remove()
                playerCharacteristics.health = basicPlayerCharacteristics.health
                showSettedItemFromList(itemId, itemType)
            }
        }
        if (itemAction === ActionTypes.TAKEOFF && (event.target.classList.contains('item-list__slot') || event.target.classList.contains('list-wrap__item-list')) && itemType === InventoryTypes.BOOTS) {
            const bootsSlot = document.querySelector('#boots-slot')
            bootsSlot.classList.remove('slot-wrap__slot_active')
            addLoaderToInventoryItem(bootsSlot)
            bootsSlot.firstElementChild.style.display = 'none'
            const status = await setInventory(itemAddress, itemChainid, 'ton/setboots', null, null)
            removeLoaderToInventoryItem(bootsSlot)
            bootsSlot.firstElementChild.style.display = ''
            if (status === 200) {
                bootsSlot.classList.add('boots__slot-background')
                bootsSlot.firstElementChild.remove()
                playerCharacteristics.speed = basicPlayerCharacteristics.speed
                playerCharacteristics.jump = basicPlayerCharacteristics.jump
                showSettedItemFromList(itemId, itemType)
            }
        }
        updatePlayerCharacteristics()
    } catch (error) {
        
    }
}


const setInventory = async (address, chainid, url, itemId, itemNftAddress) => {
    try {
        let jsonToSet = {address, chainid, nftAddress: itemNftAddress}
        if (url.includes('character')) {
            jsonToSet.characterid= itemId
        }
        if (url.includes('weapon')) {
            jsonToSet.weapon = itemId
            localStorage.setItem('setted-weapon', itemId === null ? '' : `/media/weapons/${itemId}.png`)
        }
        if (url.includes('armor')) {
            jsonToSet.armor = itemId
            localStorage.setItem('setted-armor', itemId === null ? '' :  `/media/armors/${itemId}.png`)
        }
        if (url.includes(InventoryTypes.BOOTS)) {
            jsonToSet.boots = itemId
            localStorage.setItem('setted-boots', itemId === null ? '' :  `/media/boots/${itemId}.png`)
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonToSet)
        })
        if (res.status === 200) {
            let playerImage = await res.blob()
            try {
                clearTimeout(drawTimeout)
                drawCharacterAnimation(playerImage)
            } catch (error) {
                console.log(error)
            }
        } else {
            const errorModal = document.querySelector('#new-error-modal')
            const errorModalText = document.querySelector('#new-error-modal-text')
            errorModal.style.display = 'flex'
            errorModalText.textContent = "The player has the open game or does not have the item"
        }
        return res.status
    } catch (error) {
        console.log(error)
        const errorModal = document.querySelector('#new-error-modal')
        const errorModalText = document.querySelector('#new-error-modal-text')
        errorModal.style.display = 'flex'
        errorModalText.textContent = "The player has the open game or does not have the item"
    }
}

export const getInventory = async (address) => {
    const rawResponse = await fetch('/ton/inventory', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address})
    }).catch(err => {
        console.log(err)
        return {}
    });
    return await rawResponse.json();
}


const setChosenCharacter = (newCharacterId) => {
    const previousCharacter = localStorage.getItem('chosenCharacter')
    const previousButton = document.querySelector(`#${chooseCharacterButtonId}${previousCharacter}`)
    previousButton.disabled = false
    previousButton.textContent = 'Choose'
    localStorage.setItem('chosenCharacter', newCharacterId)
    const newButton = document.querySelector(`#${chooseCharacterButtonId}${newCharacterId}`)
    newButton.disabled = true
    newButton.textContent = 'Chosen'
}
const setChosenArmor = (newID) => {
    const previous = localStorage.getItem('chosenArmor')
    const previousButton = document.querySelector(`#${chooseArmorButtonId}${previous}`)
    try {
        previousButton.disabled = false
        previousButton.textContent = 'Choose'
    } catch (error) {
        
    }
    localStorage.setItem('chosenArmor', newID)
    const newButton = document.querySelector(`#${chooseArmorButtonId}${newID}`)
    newButton.disabled = true
    newButton.textContent = 'Chosen'
}
const setChosenWeapon = (newID) => {
    const previous = localStorage.getItem('chosenWeapon')
    const previousButton = document.querySelector(`#${chooseWeaponButtonId}${previous}`)
    try {
        previousButton.disabled = false
        previousButton.textContent = 'Choose'
    } catch (error) {
        
    }
    localStorage.setItem('chosenWeapon', newID)
    const newButton = document.querySelector(`#${chooseWeaponButtonId}${newID}`)
    newButton.disabled = true
    newButton.textContent = 'Chosen'
}
const setChosenBoots = (newID) => {
    const previous = localStorage.getItem('chosenBoots')
    const previousButton = document.querySelector(`#${chooseBootsButtonId}${previous}`)
    try {
        previousButton.disabled = false
        previousButton.textContent = 'Choose'
    } catch (error) {
        
    }
    localStorage.setItem('chosenBoots', newID)
    const newButton = document.querySelector(`#${chooseBootsButtonId}${newID}`)
    newButton.disabled = true
    newButton.textContent = 'Chosen'
}

const setInventoryImage = (characterid) => {
    const characterInventoryImage = document.querySelector("#inventory-character-image")
    if (characterid == 0) {
        characterInventoryImage.src = `/media/characters/0.svg`
    } else {
        characterInventoryImage.src = `/media/characters/${characterid}.png`
    }
}

const setImage = (queryID, pic) => {
    const image = document.querySelector(`#${queryID}`)
    image.src = pic
}

const inventorySwitcher = () => {
    const inventoryCharactersList = document.querySelector('#left-inventory-characters-list')
    const inventoryWeaponsList = document.querySelector('#left-inventory-weapons-list')
    const inventoryArmorsList = document.querySelector('#left-inventory-armors-list')
    const inventoryBootsList = document.querySelector('#left-inventory-boots-list')
    document.querySelector('#inventory__tab-1').addEventListener('click', () => {
        inventoryCharactersList.style.display = 'block'
        inventoryWeaponsList.style.display = 'none'
        inventoryArmorsList.style.display = 'none'
        inventoryBootsList.style.display = 'none'
    })
    document.querySelector('#inventory__tab-2').addEventListener('click', () => {
        inventoryCharactersList.style.display = 'none'
        inventoryWeaponsList.style.display = 'block'
        inventoryArmorsList.style.display = 'none'
        inventoryBootsList.style.display = 'none'
    })
    document.querySelector('#inventory__tab-3').addEventListener('click', () => {
        inventoryCharactersList.style.display = 'none'
        inventoryWeaponsList.style.display = 'none'
        inventoryArmorsList.style.display = 'block'
        inventoryBootsList.style.display = 'none'
    })
    document.querySelector('#inventory__tab-4').addEventListener('click', () => {
        inventoryCharactersList.style.display = 'none'
        inventoryWeaponsList.style.display = 'none'
        inventoryArmorsList.style.display = 'none'
        inventoryBootsList.style.display = 'block'

    })
}

const updatePlayerCharacteristics = () => {
    playerHealth.textContent = playerCharacteristics.health
    playerBullets.textContent = playerCharacteristics.bullets
    playerSpeed.textContent = playerCharacteristics.speed
    playerJump.textContent = playerCharacteristics.jump
}

const rmSettedItemFromList = (itemId, itemType) => {
    if (itemType === InventoryTypes.CHARACTERS) {
        const list = document.querySelector('#left-inventory-characters-list').querySelectorAll('.item-list__slot')
        _rmSettedItemFromList(list, itemId)
    }
    if (itemType === InventoryTypes.WEAPONS) {
        const list = document.querySelector('#left-inventory-weapons-list').querySelectorAll('.item-list__slot')
        _rmSettedItemFromList(list, itemId)
    }
    if (itemType === InventoryTypes.ARMORS) {
        const list = document.querySelector('#left-inventory-armors-list').querySelectorAll('.item-list__slot')
        _rmSettedItemFromList(list, itemId)
    }
    if (itemType === InventoryTypes.BOOTS) {
        const list = document.querySelector('#left-inventory-boots-list').querySelectorAll('.item-list__slot')
        _rmSettedItemFromList(list, itemId)
    }
}

const showSettedItemFromList = (itemId, itemType) => {
    if (itemType === InventoryTypes.CHARACTERS) {
        const list = document.querySelector('#left-inventory-characters-list').querySelectorAll('.item-list__slot')
        _showSettedItemFromList(list, itemId)
    }
    if (itemType === InventoryTypes.WEAPONS) {
        const list = document.querySelector('#left-inventory-weapons-list').querySelectorAll('.item-list__slot')
        _showSettedItemFromList(list, itemId)
    }
    if (itemType === InventoryTypes.ARMORS) {
        const list = document.querySelector('#left-inventory-armors-list').querySelectorAll('.item-list__slot')
        _showSettedItemFromList(list, itemId)
    }
    if (itemType === InventoryTypes.BOOTS) {
        const list = document.querySelector('#left-inventory-boots-list').querySelectorAll('.item-list__slot')
        _showSettedItemFromList(list, itemId)
    }
}

const _rmSettedItemFromList = (list, itemId) => {
    list.forEach(v => {
        if (v.lastElementChild && v.lastElementChild.getAttribute('data-id') === itemId.toString()) {
            v.style.display = 'none'
        }
    })
}

const _showSettedItemFromList = (list, itemId) => {
    list.forEach(v => {
        if (v.lastElementChild && v.lastElementChild.getAttribute('data-id') === itemId.toString()) {
            v.style.display = ''
        }
    })
}

const addLoaderToInventoryItem = (itemDocument) => {
    itemDocument.classList.add('lds-dual-ring')
}

const removeLoaderToInventoryItem = (itemDocument) => {
    itemDocument.classList.remove('lds-dual-ring')
}

const addBigLoaderToInventoryItem = (itemDocument) => {
    document.querySelector('#character-background').style.display = 'none'
    itemDocument.classList.add('lds-dual-ring-big')
}

const removeBigLoaderToInventoryItem = (itemDocument) => {
    itemDocument.classList.remove('lds-dual-ring-big')
    document.querySelector('#character-background').style.display = ''
}

const drawCharacterAnimation = (imageBlob) => {
    let canvas = document.querySelector('#character-background')
    let ctx = canvas.getContext('2d');
    let imageUrl = URL.createObjectURL(imageBlob);

    let img = new Image();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    img.onload = function () {
        // Размеры кадров
        let frameWidth = 456;
        let frameHeight = 456;

        // Проигрываемые кадры
        let numFrames = 12;

        const scale = 1.1;

        canvas.width = frameWidth * 1;
        canvas.height = frameHeight * 0.8;

        let interval = 150; // Время задержки между кадрами (в миллисекундах)
        let currentFrame = 0;

        function animateFrames() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(
                img, // Исходное изображение
                currentFrame * frameWidth, // X-координата начала текущего кадра
                0, // Y-координата начала текущего кадра
                frameWidth, // Ширина текущего кадра
                frameHeight, // Высота текущего кадра
                isMobile ? -25 : -45, // X-координата отрисовки на canvas
                -165, // Y-координата отрисовки на canvas
                frameWidth * scale, // Ширина отрисовываемого кадра на canvas (с учетом масштабирования)
                frameHeight * scale // Высота отрисовываемого кадра на canvas (с учетом масштабирования)
            );

            currentFrame++;

            // Если достигнут последний кадр, перезапустим анимацию
            if (currentFrame >= numFrames) {
                currentFrame = 0;
            }

            drawTimeout = setTimeout(animateFrames, interval);
        }

        animateFrames();
    };

    img.src = imageUrl;
}
