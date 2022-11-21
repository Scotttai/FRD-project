import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { SetStateAction, useEffect, useState } from "react";
import SignUp from "../SignUp/SignUp";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../routes";
import { Route } from "react-router";
import Profile from "../Tabs/Profile";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";
import { useHistory } from "react-router-dom";
import { useIonFormState } from "react-use-ionic-form";
import { API_ORIGIN } from "../../api";

const Login: React.FC = () => {
  const jwtKey = useSelector((state: RootState) => state.jwtKey);
  const id = useSelector((state: RootState) => state.id);
  const dispatch = useDispatch();
  const history = useHistory();
  const router = useIonRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [isUsernameOk, setIsUsernameOk] = useState(true);
  const [isPasswordOk, setIsPasswordOk] = useState(true);
  const [isUserCorrect, setIsUserCorrect] = useState(true);

  // const [isBanned, setIsBanned] = useState(false);

  const onSubmit = async (data: any) => {
    if (data.username.length == 0) {
      setIsUsernameOk(false);
      return;
    } else {
      setIsUsernameOk(true);
    }
    if (data.password.length == 0) {
      setIsPasswordOk(false);
      return;
    } else {
      setIsPasswordOk(true);
    }

    let res = await fetch(`${API_ORIGIN}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    });
    let result = await res.json();
    let token = result.access_token;
    if (token) {
      setIsUserCorrect(true);
      let res2 = await fetch(`${API_ORIGIN}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let userInfo = await res2.json();
      // console.log("userInfo: ", userInfo)
      dispatch(
        updateJwt({
          newJwtKey: token,
          newId: userInfo.id,
          newUsername: userInfo.username,
          newNickname: userInfo.nickname,
          newPhone: userInfo.phone,
          newEmail: userInfo.email,
          newJoinedTime: userInfo.joinedTime,
          newIsAdmin: userInfo.isAdmin,
        })
      );
      // history.push(`/tab/Profile`);
      router.push(routes.tab.profile, "forward", "replace");
    } else {
      setIsUserCorrect(false);
      // alert(JSON.stringify("冇人識你喎...", null, 2));
    }
  };

  const { state, item } = useIonFormState({
    username: "",
    password: "",
  });

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          path={routes.tab.profile}
          exact={true}
          render={() => <Profile user={id} />}
        />
      </IonRouterOutlet>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>登入</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="ion-padding">
          {item({
            name: "username",
            renderLabel: () => <IonLabel position="floating">帳號:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isUsernameOk ? (
              <IonText color="warning">帳號呢？?</IonText>
            ) : null}
          </div>

          {item({
            name: "password",
            renderLabel: () => <IonLabel position="floating">密碼:</IonLabel>,
            renderContent: (props) => (
              <IonInput
                type="password"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    onSubmit(state);
                  }
                }}
                {...props}
              ></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isPasswordOk ? (
              <IonText color="warning">密碼呢???</IonText>
            ) : null}
          </div>
          <IonButton
            className="ion-margin-top"
            onClick={() => {
              onSubmit(state);
            }}
            expand="block"
          >
            登入
          </IonButton>
          <div className="ion-text-center">
            {!isUserCorrect ? (
              <IonText color="warning">冇人識你喎...</IonText>
            ) : null}
          </div>
          <IonButton
            className="ion-margin-top"
            expand="block"
            onClick={() => setIsOpen(true)}
          >
            註冊
          </IonButton>
        </IonList>

        <IonContent className="ion-padding">
          <IonModal isOpen={isOpen}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>註冊</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>關閉</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <SignUp onSignUp={() => setIsOpen(false)} />
          </IonModal>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Login;
