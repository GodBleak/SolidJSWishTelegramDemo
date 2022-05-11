import { Component, createSignal, createResource, Show, createEffect } from "solid-js";
import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions';

import {LogIn} from './login'
import logo from "./logo.svg";
import styles from "./App.module.css";



const App: Component = () => {
    // some ui state
    const [logInProptIsOpen, setLogInProptIsOpen] = createSignal(false)
    const [loggedIn, setLoggedIn] = createSignal(false);
    
    // the Telegram Client declaration. 
    const [client] = createResource(
        async () => {
            const stringSession = new StringSession(localStorage.getItem("sessionString") || "");
            const client = new TelegramClient(stringSession, Number(import.meta.env.VITE_API_ID), import.meta.env.VITE_API_HASH as string, {
                connectionRetries: 5,
            })
            
            await client.connect()
            return client
        }, 
        { initialValue: null }
    )
    
    // use signal to prevent using await in JSX
    const [me, setMe] = createSignal<Api.User | null>(null)

    // assign getMe once we're logged in
    createEffect(async (prev) => {
        if(loggedIn()){
            if(prev !== me()) { // prevent enlessly assignment
                setMe((await client()?.getMe()) as Api.User)
            }
            return me()
        }
    })

    // defining the main ui
    return (
        <div class="text-center">
        <header class="bg-base h-screen flex flex-col items-center justify-center">
          <img onClick={() => setLogInProptIsOpen(true)} src={logo} class="animate-pulse animate-infinite h-64 cursor-pointer" alt="logo" />
        <Show when={loggedIn() && me()} fallback={
          <p class="text-green-500 pt-8 font-bold animate-bounce animate-infinite">
            Click logo to sign in
          </p>
        }>
          <p class="text-green-500 pt-8 font-bold animate-tada animate-infinite">
            {`Hello ${me()!.username? `@${me()!.username}` : me()!.firstName}`}
          </p>
        </Show>
        <span class="inline-flex gap-2">
          <a
            class="btn btn-ghost"
            href="https://www.solidjs.com/guides/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            >
            Learn Solid
          </a>
          <a
            class="btn btn-ghost"
            href="https://gram.js.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            Learn GramJS
          </a>
            <Show when={logInProptIsOpen()}>
                <LogIn client={client} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLogInProptIsOpen={setLogInProptIsOpen}/>
            </Show>
            </span>
        </header>
      </div>
    );
  };
  
  export default App;