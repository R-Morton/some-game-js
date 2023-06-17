export const initialCharacterData = {
    name: "Player",
    isInitialData: true,
    weapon: {
        mainHand: null,
        offHand: null
    },
    armour: {
        head: null,
        chest: null,
        legs: null,
        hands: null,
        feet: null
    },
    level: 1,
    levelExp: 0,
    levelExpMax: 100,
    strength: 1,
    agility: 1,
    luck: 1,
    endurance: 1,
    blade: {
        level: 1,
        exp: 90,
        maxExp: 100
    },
    blunt: {
        level: 1,
        exp: 90,
        maxExp: 100
    },
    heavy: {
        level: 1,
        exp: 0,
        maxExp: 100
    },
    light: {
        level: 1,
        exp: 0,
        maxExp: 100
    },
    maxHealth: null,
    health: null,
    maxStam: null,
    stamina: null,
    damage: null,
    dodgeChance: null,
    blockChance: null,
    critChance: null,
    baseDamage: 10,
    armourRating: 0,
    inventory: [],
    isPlayer: true
}