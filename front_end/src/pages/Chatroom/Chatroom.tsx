import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  navigateOutline,
} from "ionicons/icons";
import moment from "moment";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Socket } from "socket.io-client";
import { resultingClientExists } from "workbox-core/_private";
import { API_ORIGIN } from "../../api";
import { useSocket } from "../../hooks/use-socket";
import { routes } from "../../routes";
import { RootState } from "../../store";

type PostDetail = {
  post_title: string;
  original_price: string;
  max: number;
  json_agg: string[];
};

type MSG = {
  id: number;
  chatroom_id: number;
  content: string;
  sender_id: number;
  send_time: string;
  icon_src: string;
};

const Chatroom: React.FC = () => {
  const [newWsMessageId, setNewWsMessageId] = useState(null);
  const router = useIonRouter();

  useSocket(
    useCallback((socket: Socket) => {
      socket.on("new-msg", (data) => {
        console.log("received", data);
        setMsgList(data.newMSG);
        setNewWsMessageId(data.newMSG[data.newMSG.length - 1].id);
      });
      return () => {};
    }, [])
  );

  useLayoutEffect(() => {
    if (!newWsMessageId) return;
    let ionCard = document.querySelector(
      `[dataset-message-id="${newWsMessageId}"]`
    );
    // console.log({ newWsMessageId, ionCard });

    if (ionCard) {
      ionCard.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [newWsMessageId]);

  let jwtState = useSelector((state: RootState) => state.jwt);

  // const [chatList, setChatList] = useState<
  //   { id: number; image: string; name: string; message: string }[]
  // >([]);
  const [postDetail, setPostDetail] = useState({
    post_title: "",
    original_price: "",
    max: 0,
    json_agg: [""],
  } as PostDetail);
  const [currentMsg, setCurrentMsg] = useState("");
  const [msgList, setMsgList] = useState([]) as any;
  let chatroomId: any = useParams();

  useEffect(() => {
    console.log("chat", chatroomId.id);
    const getChatroomMsg = async () => {
      let res = await fetch(`${API_ORIGIN}/chatroom/msg/${chatroomId.id}`);
      let result = await res.json();
      console.log("msg:", result);
      setMsgList(result);
      let latestMSG = document.querySelector(
        `[dataset-message-id="${result[result.length - 1].id}"]`
      );

      if (latestMSG) {
        latestMSG.scrollIntoView({
          block: "end",
        });
      }
    };

    const getChatroomDetail = async () => {
      let res = await fetch(
        `${API_ORIGIN}/chatroom/roomDetail/${chatroomId.id}`
      );
      let result = await res.json();
      console.log("result", result);
      setPostDetail(result);
    };
    getChatroomMsg();
    getChatroomDetail();
  }, []);

  function backToMain() {
    router.push("/", "forward", "replace");
  }

  function backToChat() {
    router.push(routes.tab.notices, "forward", "replace");
  }

  async function sendMsg(msg: string) {
    console.log("chatroomId", chatroomId.id);
    let send = await fetch(`${API_ORIGIN}/chatroom/send/${chatroomId.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg, senderId: jwtState.id }),
    });
    let result = await send.json();
    if (!("id" in result)) {
      alert("something wrong");
      return;
    }
    console.log("msg", result);
    setCurrentMsg("");
  }

  return (
    <IonPage className="ChatListTab">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                backToMain();
              }}
            >
              <IonIcon size="large" icon={chevronBackOutline}></IonIcon> 主頁
            </IonButton>
          </IonButtons>
          <IonTitle>Chatroom</IonTitle>

          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                backToChat();
              }}
            >
              聊天室
              <IonIcon size="large" icon={chevronForwardOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonAvatar>
              <img src={postDetail.json_agg[0]} />
            </IonAvatar>
            <IonLabel>{postDetail.post_title}</IonLabel>
            <IonLabel>HK${postDetail.original_price}</IonLabel>
          </IonItem>
          {msgList.length > 0 ? (
            <>
              {msgList.map((msg: MSG) => {
                return (
                  <div key={msg.id} dataset-message-id={msg.id}>
                    {msg.sender_id == jwtState.id ? (
                      <>
                        <IonLabel>{moment(msg.send_time).format("L")}</IonLabel>
                        ：
                        <IonLabel>
                          {moment(msg.send_time).format("LT")}
                        </IonLabel>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <IonAvatar>
                            <img src={msg.icon_src}></img>
                          </IonAvatar>
                          <IonLabel>{msg.content}</IonLabel>
                        </div>
                      </>
                    ) : (
                      <>
                        <IonLabel>{moment(msg.send_time).format("L")}</IonLabel>
                        ：
                        <IonLabel>
                          {moment(msg.send_time).format("LT")}
                        </IonLabel>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <IonAvatar>
                            <img src={msg.icon_src}></img>
                          </IonAvatar>
                          <IonLabel>{msg.content}</IonLabel>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <IonItem>沒有對話紀錄</IonItem>
            </>
          )}
          <IonLabel></IonLabel>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonItem>
            <IonInput
              value={currentMsg}
              onIonChange={(e: any) => setCurrentMsg(e.target.value)}
            ></IonInput>
            <IonIcon
              icon={navigateOutline}
              onClick={() => sendMsg(currentMsg)}
            ></IonIcon>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Chatroom;
