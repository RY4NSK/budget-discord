import { Button, Card, H4, Intent, TextArea, NonIdealState } from "@blueprintjs/core";
import React, { ChangeEvent } from "react";
import { ViewContext, ChannelView } from "../view-context";
import { FirebaseContext } from "../firebase-context";

interface ChannelData {
    name: string,
    topic: string
}


function ChannelTopbar() {
    let { view, setView } = React.useContext(ViewContext);
    let firebase = React.useContext(FirebaseContext)
    let [channelData, setChannelData] = React.useState<ChannelData>()

    React.useEffect(() => {
        if (view && "serverId" in view) {
            firebase.firestore().collection("servers").doc(view.serverId).collection("channels").doc(view.channelId).onSnapshot(channel => {
                setChannelData(channel.data() as ChannelData)
            })
        }
    }, [firebase, view])

    return <>
        <Card style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
                <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=identicon" alt={channelData?.name + "'s icon"} />
                <div style={{ width: 15 }} />
                <div>
                    <H4>{channelData?.name}</H4>
                    {channelData?.topic}
                </div>
            </div>
        </Card>
    </>
}


function DMTopbar() {
    let [count, setCount] = React.useState(0);

    const countUp = () => {
        setCount(count + 1)
    };

    return (<>
        <Card style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
                <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=identicon" alt={"HeavyWHC" + "'s icon"} />
                <div style={{ width: 15 }} />
                <div>
                    <H4>HeavyWHC</H4>
                    Player Status
                </div>
            </div>
            <div>
                <Button onClick={countUp} text={count} />
            </div>
        </Card>
    </>)
}

function Message({ message }: { message: MessageData }) {
    return (<>
        <div style={{ padding: 10, display: "flex", width: "100%" }}>
            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=identicon&s=40" alt={message.author.nickname + "'s icon"} />
            <div style={{ width: 10 }}></div>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <strong>{message.author.nickname}</strong>
                    <small>{message.timestamp.toString()}</small>
                </div>
                <div>
                    {message.content}
                </div>
            </div>
        </div>
    </>)
}

interface AuthorData {
    nickname: string,
    ref: string
}

interface MessageData {
    author: AuthorData,
    content: string,
    timestamp: Date
}

function Messages() {
    let { view, setView } = React.useContext(ViewContext);
    let firebase = React.useContext(FirebaseContext)
    let [messagesData, setMessagesData] = React.useState<MessageData[]>()

    React.useEffect(() => {
        if (view && "serverId" in view) {
            firebase.firestore().collection("servers").doc(view.serverId).collection("channels").doc(view.channelId).collection("messages").onSnapshot(messages => {
                setMessagesData(messages.docs.map(doc => doc.data() as MessageData))
            })
        }
    }, [firebase, view])

    return (<>
        <div style={{ display: "flex", flexGrow: 1, overflowY: "auto", flexDirection: "column-reverse", height: "100%" }}>
            {messagesData?.map(messageData => <Message message={messageData}></Message>)}
        </div>
    </>)
}

const MAX_ROWS_WITHOUT_SCROLLBAR = 12;

function MessageInput() {
    let [message, setMessage] = React.useState("Hi")

    const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }

    return (<>
        <div style={{ display: "flex" }}>
            <TextArea
                style={{ resize: "none", fontFamily: "Arial" }}
                large={true}
                intent={Intent.PRIMARY}
                value={message}
                fill={true}
                onChange={onMessageChange}
                rows={message.split("\n").length < MAX_ROWS_WITHOUT_SCROLLBAR ? message.split("\n").length : MAX_ROWS_WITHOUT_SCROLLBAR}
            />
            <div style={{ width: 15 }} />
            <Button style={{ paddingLeft: 25, paddingRight: 25 }} icon="send-message" intent={Intent.PRIMARY}></Button>
        </div>
    </>)
}

export function MessageView() {
    let { view, setView } = React.useContext(ViewContext);
    return (<>
        {view ?
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{}}>
                    {
                        "dmId" in view ? <DMTopbar></DMTopbar> : <ChannelTopbar></ChannelTopbar>
                    }
                </div>
                <Messages></Messages>
                <div style={{}}>
                    <MessageInput></MessageInput>
                </div>
            </div> : <NonIdealState title="Get some friends."></NonIdealState>
        }
    </>)
}