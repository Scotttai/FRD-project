import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTabButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  heartOutline,
  chatbubblesOutline,
  ribbonOutline,
  searchOutline,
  lockOpenOutline,
  lockOpenSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  peopleCircleOutline,
  personOutline,
  personSharp,
  receiptOutline,
  receiptSharp,
  trashOutline,
  trashSharp,
} from "ionicons/icons";
// import ExploreContainer from "../../components/ExploreContainer";

import "./Profile.css";
import icon from "../../image/usericon.png";

import { Route, useLocation } from "react-router";

const Profile: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <IonPage>
        <IonContent fullscreen>
          <IonSplitPane contentId="profile">
            <IonMenu contentId="profile">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>設定</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem routerLink="/AccountSetting">
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>設定個人帳號</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/NoticeSetUp">
                    <IonIcon icon={paperPlaneOutline} slot="start" />
                    <IonLabel>通知設定</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/PasswordChange">
                    <IonIcon icon={lockOpenOutline} slot="start" />
                    <IonLabel>更改密碼</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/Invoice">
                    <IonIcon icon={receiptOutline} slot="start" />
                    <IonLabel>電子收據</IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonMenu>
            <IonPage id="profile">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                  </IonButtons>
                  <IonTitle>個人資料</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem className="personalIconContainer">
                    <IonImg src={icon} className="personalIcon" />

                    <IonIcon icon={heartOutline} className="chat" />
                    <IonIcon icon={chatbubblesOutline} className="chat" />
                    <IonIcon icon={ribbonOutline} className="chat" />
                  </IonItem>
                  <IonItem className="personalInfo">
                    <IonLabel>Nickname</IonLabel>
                    <IonLabel>@username</IonLabel>

                    <IonLabel>Joined since 2022.02.10</IonLabel>
                  </IonItem>
                  <IonItem className="search">
                    <IonIcon className="searchIcon" icon={searchOutline} />
                    <IonInput placeholder="搜尋此賣家的產品"></IonInput>
                  </IonItem>
                  <IonItem className="portfolioContainer">
                    <IonLabel>My product</IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPage>
          </IonSplitPane>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Profile;
