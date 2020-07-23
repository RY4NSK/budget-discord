import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import { View, ViewContext } from "../view-context";
import { MessageView } from "./MessageView";
import { Sidebar } from "./Sidebar";

export function Main() {
    let [currentView, setCurrentView] = React.useState<View>()
    return (<>
        <ViewContext.Provider value={{view: currentView, setView: setCurrentView}}>
            <div style={{ display: "flex", height: "100vh" }}>
                <Card style={{ flexGrow: 20, margin: 10 }} elevation={Elevation.TWO}>
                    <Sidebar></Sidebar>
                </Card>
                <Card style={{ flexGrow: 80, margin: 10 }} elevation={Elevation.TWO}>
                    <MessageView></MessageView>
                </Card>
            </div>
        </ViewContext.Provider>
    </>)
}