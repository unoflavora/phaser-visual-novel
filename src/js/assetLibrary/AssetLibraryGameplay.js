import { AssetType } from "Modules/assetLoader";

export const GameplayAsset = {
    // character:{
    //     key: 'character',
    //     path: '/img/gameplay/character',
    //     json_file: 'character.json',
    //     atlas_file: ['character.atlas'],
    //     type: AssetType.SPINE,
    // },

    story : {
        key: 'story',
        path: '/story/gameplay-flow-v0.json',
        type: AssetType.JSON,
    },
    character_agari: {
        key: 'character_agari',
        path: '/img/gameplay/characters/character_agari.png',
        type: AssetType.STATIC
    },
    character_bolebole: {
        key: 'character_bolebole',
        path: '/img/gameplay/characters/character_bolebole.png',
        type: AssetType.STATIC
    },
    character_ifuly: {
        key: 'character_ifuly',
        path: '/img/gameplay/characters/character_ifuly.png',
        type: AssetType.STATIC
    },
    character_imuc: {
        key: 'character_imuc',
        path: '/img/gameplay/characters/character_imuc.png',
        type: AssetType.STATIC
    },
    character_ota: {
        key: 'character_ota',   
        path: '/img/gameplay/characters/character_ota.png',
        type: AssetType.STATIC
    },
    character_triplet:
    {
        key: 'character_bolebole agari imuc',
        path: '/img/gameplay/characters/character_triplet.png',
        type: AssetType.STATIC
    },
    character_pomoro:
    {
        key: 'character_pomoro',
        path: '/img/gameplay/characters/character_pomoro.png',
        type: AssetType.STATIC
    },

};
