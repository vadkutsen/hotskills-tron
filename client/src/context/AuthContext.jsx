import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const { tronWeb, tronLink } = window;

export const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const connectWallet = async () => {
    try {
      if (!tronLink) {
        alert("Please install TronLink -> https://www.tronlink.org/");
        return;
      }
      // Fancy method to request access to account.
      const response = await tronLink.request({
        method: "tron_requestAccounts",
      });
      console.log("response: ", response);
      if (response.code === 200) {
        const account = await tronWeb.defaultAddress.base58;
        console.log("Yes, catch it:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (tronLink) {
    window.addEventListener("message", (e) => {
      if (e.data.message && e.data.message.action === "setAccount") {
        console.log("setAccount event", e.data.message);
        console.log("current address:", e.data.message.data.address);
        setCurrentAccount(e.data.message.data.address);
      }
      if (e.data.message && e.data.message.action === "setNode") {
        console.log("setNode event", e.data.message);
        if (e.data.message.data.node.chain === "_") {
          console.log("tronLink currently selects the main chain");
        } else {
          console.log("tronLink currently selects the side chain");
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "connect") {
          console.log("connect event", e.data.message.isTronLink);
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "disconnect") {
          console.log("disconnect event", e.data.message.isTronLink);
          setCurrentAccount("");
          window.location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "accountsChanged") {
          console.log("accountsChanged event", e.data.message);
          console.log("current address:", e.data.message.data.address);
          setCurrentAccount("");
          window.location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "connectWeb") {
          console.log("connectWeb event", e.data.message);
          console.log("current address:", e.data.message.data.address);
          setCurrentAccount(e.data.message.data.address);
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "accountsChanged") {
          console.log("accountsChanged event", e.data.message);
          setCurrentAccount("");
          window.location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "acceptWeb") {
          console.log("acceptWeb event", e.data.message);
        }
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "disconnectWeb") {
          console.log("disconnectWeb event", e.data.message);
          setCurrentAccount("");
          window.location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "rejectWeb") {
          console.log("rejectWeb event", e.data.message);
          setCurrentAccount("");
          window.location.replace("/");
        }
      }
    });
  }

  useEffect(() => {
    const requestAccounts = async () => {
      await tronLink.request({
        method: "tron_requestAccounts",
      });
    };
    requestAccounts().catch(console.error);
  });

  return (
    <AuthContext.Provider
      value={{
        connectWallet,
        currentAccount,
        tronWeb,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
