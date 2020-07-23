import { Button, Card, Collapse, H3, InputGroup, Intent, ITreeNode, Label, Position, Tree, Checkbox, Alignment } from "@blueprintjs/core";
import { TimezoneDisplayFormat, TimezonePicker } from "@blueprintjs/timezone";
import React, { ChangeEvent } from "react";
import { toaster } from "../App";
import { FirebaseContext } from "../firebase-context";
import { UserData, UserDataContext } from "../user-data-context";
import { ViewContext } from "../view-context";
import { ThemeContext } from "../theme-context";

//create your forceUpdate hook
function useForceUpdate() {
    const [, setValue] = React.useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

function ChannelLists() {
    let forceUpdate = useForceUpdate();
    let [serverNodes, setServerNodes] = React.useState<ITreeNode[]>([])
    let {setView} = React.useContext(ViewContext)

    let firebase = React.useContext(FirebaseContext)

    const handleChannelClick = React.useCallback((nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        // Open/switch channel.
        if (setView) {
            setView({serverId: (nodeData.id as string).split("/")[0], channelId: (nodeData.id as string).split("/")[1]})
        }
    }, [])

    const handleServerExpand = React.useCallback((nodeData: ITreeNode) => {
        // Expand server.
        nodeData.isExpanded = true;
        forceUpdate()
    }, [forceUpdate])

    const handleServerCollapse = React.useCallback((nodeData: ITreeNode) => {
        // Collapse server.
        nodeData.isExpanded = false;
        forceUpdate()
    }, [forceUpdate])

    React.useEffect(() => {
        firebase.firestore().collection("servers").onSnapshot(async snapshot => {
            setServerNodes(await Promise.all(snapshot.docs.map(async server => ({
                id: server.id,
                icon: "cloud",
                label: server.data().name,
                hasCaret: true,
                childNodes: (await server.ref.collection("channels").get()).docs.map(channel => ({
                    id: server.id  + "/" + channel.id,
                    label: channel.data().name,
                    icon: "chat"
                })) as ITreeNode[]
            } as ITreeNode)
            )))
        })
    }, [firebase])

    return (<>
        <div style={{ display: 'flex', height: '100%', flexDirection: "column" }}>
            <Card style={{ flexGrow: 1 }}>
                <H3>Friends</H3>
            </Card>
            <div style={{ height: 20 }}></div>
            <Card style={{ flexGrow: 1 }}>
                <H3>Channels</H3>
                <div style={{ height: "100%" }}>
                    <Tree
                        contents={serverNodes}
                        onNodeClick={handleChannelClick}
                        onNodeCollapse={handleServerCollapse}
                        onNodeExpand={handleServerExpand}
                    />
                </div>
            </Card>
        </div>
    </>)
}

function SettingsPanel() {
    let [settingsOpen, setSettingsOpen] = React.useState(false);
    let {isDarkMode, setIsDarkMode} = React.useContext(ThemeContext)
    let userData = React.useContext(UserDataContext);
    let [settings, setSettings] = React.useState<UserData>(userData)
    const firebase = React.useContext(FirebaseContext);

    const toggleSettings = () => {
        setSettingsOpen(prev => !prev)
        if (userData) setSettings(userData)
    }

    const handleTimezoneChange = (value: string) => {
        setSettings(prev => ({ ...prev, timezone: value }))
    }

    const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, nickname: event.target.value }))
    }

    const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, status: event.target.value }))
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    const toast = () => {
        toaster.show({
            action: {
                href: "https://www.google.com/search?q=toast&source=lnms&tbm=isch",
                target: "_blank",
                text: <strong>Yum.</strong>,
            },
            intent: Intent.PRIMARY,
            message: (
                <>
                    One toast created. <em>Toasty.</em>
                </>
            )
        })
    }

    const saveSettings = () => {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser?.uid).set(settings)
    }

    return (<>
        <Button text={settingsOpen ? "Close Settings" : "Open Settings"} intent={Intent.SUCCESS} onClick={toggleSettings} />
        <Collapse isOpen={settingsOpen} keepChildrenMounted={true}>
            <div style={{ height: 15 }} />
            <Button text="Procure Toast" intent={Intent.PRIMARY} style={{ width: "100%" }} onClick={toast} />
            <div style={{ height: 15 }} />
            <Card>
                <Label>
                    Nickname
                    <InputGroup value={settings ? settings.nickname : ""} onChange={handleNicknameChange} fill={true} />
                </Label>
                <Label>
                    Status
                    <InputGroup value={settings ? settings.status : ""} onChange={handleStatusChange} fill={true} />
                </Label>
                <Label>
                    Timezone
                    <TimezonePicker
                        value={settings ? settings.timezone : ""}
                        valueDisplayFormat={TimezoneDisplayFormat.COMPOSITE}
                        onChange={handleTimezoneChange}
                        popoverProps={{ position: Position.BOTTOM }}
                    />
                </Label>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                    <Button icon="floppy-disk" intent={Intent.SUCCESS} text="Save" onClick={saveSettings} />
                    <Checkbox checked={isDarkMode} onChange={(e) => {if (setIsDarkMode) setIsDarkMode(!isDarkMode)}} alignIndicator={Alignment.RIGHT}>Dark Mode?</Checkbox>
                </div>
            </Card>
            <div style={{ height: 15 }} />
            <Card>
                <Label>
                    Enter Friend Code
                    <InputGroup leftIcon="grid" fill={true} rightElement={
                        <Button icon="new-person" minimal={true} />
                    } />
                </Label>
                <Label>
                    Your Code
                    <InputGroup leftIcon="grid" value="00FFB6" fill={true} disabled={true} rightElement={
                        <>
                            <Button icon="refresh" minimal={true} />
                            <Button icon="duplicate" minimal={true} />
                        </>
                    } />
                </Label>
            </Card>
            <div style={{ height: 15 }} />
            <Button intent={Intent.PRIMARY} text="Sign Out" onClick={signOut} />
        </Collapse>
    </>)
}

export function Sidebar() {
    return (<>
        <div style={{ display: 'flex', height: '100%', flexDirection: "column" }}>
            <div style={{ flexGrow: 100 }}>
                <ChannelLists></ChannelLists>
            </div>
            <div style={{ flexGrow: 1, marginTop: 15 }}>
                <SettingsPanel></SettingsPanel>
            </div>
        </div>
    </>)
}
