

export const playerReducer = (previousState, instructions) => {
    let stateEditable = {...previousState}

    switch (instructions.type) {
        // Sets up local storage saving
        case "setup":
            let localStorageData = instructions.data
            stateEditable = localStorageData
            
            return stateEditable
        
        case "create":
            break    

            
        case "update":
            // Updated stats passed in and set into global state.
            let updatedStats = instructions.data
            stateEditable = updatedStats
            return stateEditable
        
        case "addGeneralExp":
            let tempStats = stateEditable
            tempStats.levelExp += instructions.data

            if (tempStats.levelExp >= tempStats.levelExpMax){
                tempStats.level += 1
                tempStats.levelExp = 0 + (tempStats.levelExp - tempStats.levelExpMax)
            }

            stateEditable = tempStats
            console.log(stateEditable)
            return stateEditable
        
        case "addArmourExp":
            let lightCount = 0
            let heavyCount = 0

            for (let armour of Object.values(stateEditable.armour)) {
                if (armour?.type === 'heavy'){
                    heavyCount += 1
                } else if (armour?.type === "light") {
                    lightCount += 1
                }
            }

            console.log("heavy count " + heavyCount)
            console.log("light count " + lightCount)

            const updatedArmourSkillState = {
                ...stateEditable,
                heavy: {
                    ...stateEditable.heavy,
                    exp: stateEditable.heavy.exp + (heavyCount * 2)
                },
                light: {
                    ...stateEditable.light,
                    exp: stateEditable.light.exp + (lightCount * 2)
                }
            };

            return updatedArmourSkillState

        case "addWeaponExp":
            
            const updatedBladeState = {
                ...stateEditable,
                blade: {
                ...stateEditable.blade,
                exp: stateEditable.blade.exp + 10
                }
            };

            const updatedBluntState = {
                ...stateEditable,
                blunt: {
                ...stateEditable.blunt,
                exp: stateEditable.blunt.exp + 10
                }
            };

            if (stateEditable.weapon.mainHand?.type === "blade") {
                return updatedBladeState
            } else if (stateEditable.weapon.mainHand?.type === "blunt") {
                return updatedBluntState
            } else {
                return stateEditable
            }
        
        case "increaseWeaponSkillLevel":{
            let weaponSkill = instructions.skill
            
            const updatedBladeState = {
                ...stateEditable,
                blade: {
                ...stateEditable.blade,
                level: stateEditable.blade.level + 1,
                exp: 0,
                maxExp: stateEditable.blade.maxExp + 10
                }
            };

            const updatedBluntState = {
                ...stateEditable,
                blunt: {
                ...stateEditable.blunt,
                level: stateEditable.blunt.level + 1,
                exp: 0,
                maxExp: stateEditable.blunt.maxExp + 10
                }
            };

            if (weaponSkill === "blade") {
                return updatedBladeState
            } else {
                return updatedBluntState
            }


        }
        case "modifyStamina":
            if (instructions.modifier === 'minus'){
                stateEditable.stamina -= instructions.amount
            } else if (instructions.modifier === 'plus') {
                stateEditable.stamina += instructions.amount
            }
            return stateEditable
        
        case "modifyHealth":
            if (instructions.modifier === 'minus') {
                stateEditable.health -= instructions.amount
            }
            else if (instructions.modifier === 'plus') {
                stateEditable.health += instructions.amount
            }
            return stateEditable

        case "resetStats":
            stateEditable.health = stateEditable.maxHealth 
            stateEditable.stamina = stateEditable.maxStam 

            return stateEditable
        
        case "equipWeapon":
            let weapon = instructions.data
            if (weapon.twoHanded) {
                stateEditable.weapon.mainhand = instructions.data
                stateEditable.weapon.offHand = instructions.data
            }

            else {
                if (stateEditable.weapon.offHand?.twoHanded) {
                    stateEditable.weapon.mainhand = instructions.data
                    stateEditable.weapon.offHand = null
                } else {
                    stateEditable.weapon.mainhand = instructions.data
                }
            }

            stateEditable.weapon.mainHand = instructions.data
            return stateEditable
        
        case "equipArmour":
            let armour = instructions.data
            let armourSlots = stateEditable.armour
            for (let slot in armourSlots) {
                if (slot === armour.slot) {
                    armourSlots[slot] = armour
                    stateEditable.armour[slot] = armourSlots[slot]

                }
            }
            return stateEditable
        
        case "delete":
            break
        default:
            console.log("Invalid instruction")

    }
}