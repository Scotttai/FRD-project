import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import CheckoutForm from "../../components/CheckoutForm";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useEffect, useState } from "react";
import { API_ORIGIN } from "../../api";
// import "./Payment.css";

// const stripePromise = loadStripe(
//   "pk_live_51M6rISLZBSpUPpls6H2Vmy8uu7NQk2GIfp6v6ic7Ns9sd5OlJbQuDPNn03969Xm80Cafw7ba43H05xqTJq6mXMAs0023VL8CW0"
// );

const stripePromise = loadStripe(
  "pk_test_51M6rISLZBSpUPplseyMLyatFxsKphsFv27pZ0gg5d0BzAjcqUF0AAchzmMOrrDwbCU9TI5qgPoelknFUwsDLMp4x00XgAPDrU4"
);

const Payment: React.FC = () => {
  const [loadStripe, setLoadStripe] = useState();
  let [paymentId, setPaymentId] = useState<String>("");

  const [secret, setSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [clientSecret, setClientSecret] = useState("");

  async function getIdSecret() {
    let result = await fetch(`${API_ORIGIN}/payment/paymentIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: "100000",
      }),
    });
    let paymentAuthorizationInfo = await result.json();

    console.log(paymentAuthorizationInfo.client_secret);

    console.log("client_secret", paymentAuthorizationInfo.client_secret);

    setClientSecret(paymentAuthorizationInfo.client_secret);
    setIsLoading(false);
  }

  useEffect(() => {
    getIdSecret();
    setIsLoading(false);
  }, [setIsLoading]);
  /*const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };*/
  if (isLoading) {
    return <></>;
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle>預授權</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonItem>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            ) : null}
          </IonItem>
        </IonContent>
      </IonPage>
    );
  }
};

//
export default Payment;
