import React from "react";
import { Card, H4, Button, Intent, TextArea, Divider } from "@blueprintjs/core";
import { UserDataContext } from "../user-data-context";


function Topbar() {

    let [count, setCount] = React.useState(0);

    const countUp = () => {
        setCount(count + 1)
    };

    return (<>
        <Card style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
                <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=identicon" />
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

function Message({message, author}: {message: string, author: {nickname: string}}) {
    return (<>
        <div style={{padding: 10, display: "flex"}}>
            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=identicon&s=40" />
            <div style={{width: 10}}></div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <strong>
                    {author.nickname}
                </strong>
                <div>
                    {message}
                </div>
            </div>
        </div>
    </>)
}

function Messages() {
    return (<>
        <div style={{display: "flex", flexGrow: 1, overflowY: "auto", flexDirection: "column-reverse", height: "100%"}}>
            
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
        <div style={{display: "flex"}}>
            <TextArea
                style={{ resize: "none" }}
                large={true}
                intent={Intent.PRIMARY}
                value={message}
                fill={true}
                onChange={onMessageChange}
                rows={message.split("\n").length < MAX_ROWS_WITHOUT_SCROLLBAR ? message.split("\n").length : MAX_ROWS_WITHOUT_SCROLLBAR}
            />
            <div style={{width: 15}} />
            <Button style={{paddingLeft: 25, paddingRight: 25}} icon="send-message" intent={Intent.PRIMARY}></Button>
        </div>
    </>)
}

export function MessageView() {
    return (<>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{}}>
                <Topbar></Topbar>
            </div>
            <Messages></Messages>
            <div style={{}}>
                <MessageInput></MessageInput>
            </div>
        </div>
    </>)
}