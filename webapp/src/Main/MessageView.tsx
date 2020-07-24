import { Button, Card, H4, Intent, NonIdealState, TextArea } from "@blueprintjs/core";
import firebase from 'firebase/app';
import 'firebase/firestore';
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { FirebaseContext } from "../firebase-context";
import { UserDataContext } from "../user-data-context";

const fbTimestamp = firebase.firestore.Timestamp

interface ChannelData {
    name: string,
    topic: string
}


function ChannelTopbar() {
    let {serverId, channelId} = useParams();
    let firebase = React.useContext(FirebaseContext)
    let [channelData, setChannelData] = React.useState<ChannelData>()

    React.useEffect(() => {
        if (serverId && channelId) {
            firebase.firestore().collection("servers").doc(serverId).collection("channels").doc(channelId).onSnapshot(channel => {
                setChannelData(channel.data() as ChannelData)
            })
        }
    }, [firebase, serverId, channelId])

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
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <strong>{message.author.nickname}</strong>
                    <small>{message.timestamp.toDate().toLocaleString()}</small>
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
    id: string,
    author: AuthorData,
    content: string,
    timestamp: firebase.firestore.Timestamp
}

function Messages() {
    let {serverId, channelId, dmId} = useParams();
    let firebase = React.useContext(FirebaseContext)
    let [messagesData, setMessagesData] = React.useState<MessageData[]>()

    React.useEffect(() => {
        if (serverId && channelId) {
            firebase.firestore()
                .collection("servers").doc(serverId)
                .collection("channels").doc(channelId)
                .collection("messages").orderBy("timestamp", "desc")
                .onSnapshot(messages => {
                    setMessagesData(messages.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageData)))
                })
        }
    }, [firebase, serverId, channelId])

    return (<>
        <div style={{ display: "flex", flexGrow: 1, overflowY: "auto", flexDirection: "column-reverse", height: "100%" }}>
            {messagesData?.map(messageData => <Message key={messageData.id} message={messageData}></Message>)}
        </div>
    </>)
}

const MAX_ROWS_WITHOUT_SCROLLBAR = 12;

function MessageInput() {
    let [message, setMessage] = React.useState("")
    let userData = React.useContext(UserDataContext);
    let {serverId, channelId, dmId} = useParams()
    let firebase = React.useContext(FirebaseContext)

    const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }

    const onMessageSend = () => {
        if (message.length) {
            if (serverId && channelId) {
                firebase.firestore().collection("servers").doc(serverId).collection("channels").doc(channelId).collection("messages").add({
                    author: {
                        nickname: userData.nickname,
                        ref: "/users/" + firebase.auth().currentUser?.uid
                    },
                    content: message,
                    timestamp: fbTimestamp.now()
                })
                setMessage("")
            }
        }
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
            <Button style={{ paddingLeft: 25, paddingRight: 25 }} icon="send-message" intent={Intent.PRIMARY} onClick={onMessageSend}></Button>
        </div>
    </>)
}

export function MessageView() {
    return (<>
        <Switch>
            <Route path="/server/:serverId/channel/:channelId">
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <ChannelTopbar></ChannelTopbar>
                    <Messages></Messages>
                    <MessageInput></MessageInput>
                </div>
            </Route>
            <Route path="/dm/:dmId">
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <DMTopbar></DMTopbar>
                    <Messages></Messages>
                    <MessageInput></MessageInput>
                </div>
            </Route>
            <Route path="/">
                <NonIdealState title="Get some friends."></NonIdealState>
            </Route>
        </Switch>
    </>)
}