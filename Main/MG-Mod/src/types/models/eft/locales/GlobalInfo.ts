export interface GeneralInfo {
    id:string
    desc:string
}
export interface ItemsInfo {
    id:string
    desc:ItemsDesc
}
export interface TraderInfo {
    id:string
    desc:TraderDesc
}
export interface QuestInfo {
    id:string
    desc:QuestDesc
    other?:{
        [key:string]: string
    }
}

export interface ItemsDesc {
    Name:string
    Nickname:string
    Description?:string
}
export interface TraderDesc {
    FullName:string
    FirstName:string
    Nickname:string
    Location?:string
    Description?:string
}
export interface QuestDesc{
    name:string
    description:string
    failMessageText?:string
    successMessageText?:string
    acceptPlayerMessage?:string
    declinePlayerMessage?:string
    completePlayerMessage?:string
}