import React from "react"

export interface ChannelView {
    serverId: string,
    channelId: string
}

export interface DMView {
    dmId: string
}


export type View = ChannelView | DMView

export interface ViewContextData {
    view?: View,
    setView?: React.Dispatch<React.SetStateAction<View | undefined>>
}

export const ViewContext = React.createContext<ViewContextData>({})