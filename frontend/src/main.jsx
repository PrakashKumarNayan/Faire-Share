import { StrictMode } from "react";
// import { createRoot } from 'react-dom/client'
import App from "./App.jsx";
import "./index.css";
import ReactDom from "react-dom/client";

import store from "./store/configStore.js";

// import '@nextui-org/react/styles.css';

//react router dom imports
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//all pages import
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SignupPage2 from "./pages/SignupPage2.jsx";
import { NextUIProvider } from "@nextui-org/react";
import Conversations from "./components/Conversations.jsx";
import ExpenseDistributionPage from "./pages/ExpenseDistributionPage.jsx";

import { Provider } from "react-redux";
import ChatsPage from "./pages/ChatsPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route path="chats" element={<ChatsPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage2 />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="settings" element={<ProfilePage />} />
      <Route path="conversation" element={<Conversations />} />
      <Route path="expenseDistribution" element={<ExpenseDistributionPage />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
      <Route path="resetPassword" element={<ResetPassword />} />
    </Route>
  )
);

ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <main className="dark text-foreground bg-background">
          <RouterProvider router={router} />
        </main>
      </NextUIProvider>
    </Provider>
  </StrictMode>
);
