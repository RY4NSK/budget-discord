import { Button, Card, Collapse, H3, InputGroup, Intent, ITreeNode, Label, Tree, Position } from "@blueprintjs/core";
import { TimezonePicker, TimezoneDisplayFormat } from "@blueprintjs/timezone";
import React, { ChangeEvent } from "react";
import { toaster } from "../App";
import { UserDataContext, UserData } from "../user-data-context";
import { FirebaseContext } from "../firebase-context";

//create your forceUpdate hook
function useForceUpdate() {
    const [, setValue] = React.useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

function ChannelLists() {
    let forceUpdate = useForceUpdate();
    let [serverNodes, setServerNodes] = React.useState<ITreeNode[]>([
        {
            id: 1,
            icon: "cloud",
            label: <>Bot Testing</>,
            hasCaret: true,
            childNodes: [
                {
                    id: 2,
                    icon: "chat",
                    label: <>Test Channel</>
                }
            ]
        }
    ])

    let firebase = React.useContext(FirebaseContext)

    React.useEffect(() => {
        firebase.firestore().collection("servers").onSnapshot(async snapshot => {
            setServerNodes(await Promise.all(snapshot.docs.map(async server => ({
                    id: server.id,
                    icon: "cloud",
                    label: server.data().name,
                    hasCaret: true,
                    childNodes: (await server.ref.collection("channels").get()).docs.map(channel => ({
                        id: channel.id,
                        label: channel.data().name,
                        icon: "chat"
                    })) as ITreeNode[]
                } as ITreeNode)
            )))
        })
    }, [firebase])

    const handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        // Open/switch channel.
    }

    const handleNodeExpand = (nodeData: ITreeNode) => {
        // Expand server.
        nodeData.isExpanded = true;
        forceUpdate()
    }

    const handleNodeCollapse = (nodeData: ITreeNode) => {
        // Collapse server.
        nodeData.isExpanded = false;
        forceUpdate()
    }

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
                        onNodeClick={handleNodeClick}
                        onNodeExpand={handleNodeExpand}
                        onNodeCollapse={handleNodeCollapse}
                        contents={serverNodes}
                    />
                </div>
            </Card>
        </div>
    </>)
}

function SettingsPanel() {
    let [settingsOpen, setSettingsOpen] = React.useState(false);
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
            <Button text="Procure Toast" intent={Intent.SUCCESS} style={{ width: "100%" }} onClick={toast} />
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
                <Button icon="floppy-disk" intent={Intent.SUCCESS} text="Save" onClick={saveSettings} />
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
