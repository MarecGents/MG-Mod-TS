export enum PathTypes {
    //Relative path to the main folder
    /**
     * @param TraderList path is set for customed trader with single alone package
     * @param KeyList path is set for the function of MG-Mod --> "keys classify (by maps)" 
     * @param PriceList path is set to save price.json for sync- online flea market price (PVP)
     * @param QuestList patth is set to save the newest copied quests.json file
     * @param SuperItemList ↓
     * @param BrothersItemList and ↓
     * @param MGItemList is set to open space for placing the corrresponding customed items files (.json type) downloaded from online or made by yourself
     * @param AssortItemList is set to place the trader's purchace assort file, like whole weapon build assort
     * @@param ModConfigList is set to place the customed config file for mod maker to ensure the mod run succeefully
     */
    TraderPath = "traders/",
    ModConfigPath = "res/config/",
    KeyPath = "res/Keys/",
    PricePath = "res/price/",
    QuestPath = "res/quest/",
    ProfilePath = "res/profile/",
    ServicesPath = "res/services/",
    SuperItemPath = "db/SuperModItem/",
    BrothersItemPath = "db/BrothersItem/",
    MGItemPath = "db/MGItem/",
    AssortItemPath = "db/assort/",



}