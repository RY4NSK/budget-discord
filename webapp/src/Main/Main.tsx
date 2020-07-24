import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import { MessageView } from "./MessageView";
import { Sidebar } from "./Sidebar";

export function Main() {
    return (<>
        <div style={{ display: "flex", height: "100vh" }}>
            <Card style={{ flexGrow: 20, margin: 10 }} elevation={Elevation.TWO}>
                <Sidebar></Sidebar>
            </Card>
            <Card style={{ flexGrow: 80, margin: 10 }} elevation={Elevation.TWO}>
                <MessageView></MessageView>
            </Card>
        </div>
    </>)
}