export interface GeneralInfo {
    _id: string;
    desc: string;
}

export interface ItemsInfo {
    _id: string;
    desc: ItemsDesc;
}

export interface TraderInfo {
    _id: string;
    desc: TraderDesc;
}

export interface QuestInfo {
    _id: string;
    desc: QuestDesc;
    other?: {
        [key: string]: string;
    }
}

export interface ItemsDesc {
    Name: string;
    Nickname: string;
    Description?: string;
}

export interface TraderDesc {
    FullName: string;
    FirstName: string;
    Nickname: string;
    Location?: string;
    Description?: string;
}

export interface QuestDesc {
    name: string;
    description: string;
    failMessageText?: string;
    successMessageText?: string;
    acceptPlayerMessage?: string;
    declinePlayerMessage?: string;
    completePlayerMessage?: string;
}

export interface AnyInfo {
    [key: string]: string;
}