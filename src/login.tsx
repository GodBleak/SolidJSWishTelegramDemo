import { createEffect, createMemo, Show } from "solid-js"
import type { Accessor, Component, Resource, Setter } from "solid-js";
import { Api, TelegramClient } from 'telegram'


// element refs -- for easy updating of the form elements
let input: HTMLInputElement;
let prompt: HTMLParagraphElement
let button: HTMLButtonElement;
let tooltip: HTMLDivElement;

// props required for this component
interface LoginProps {
  loggedIn: Accessor<boolean>;
  setLoggedIn: Setter<boolean>;
  setLogInPromptIsOpen: Setter<boolean>;
  client: Resource<TelegramClient | null>
}

export const LogIn: Component<LoginProps> = (props) => {
  // assign passed client instance to a local variable
  const client = createMemo(() => props.client())

  // kickoff the logic of the login flow
  createEffect(async (prev) => {
    if ((prev !== props.loggedIn()) && client()) {
      if (!props.loggedIn()) {
        await initializeAuth(client()!);
        const isAuthorized = await client()!.isUserAuthorized()
        if (isAuthorized) {
          props.setLogInPromptIsOpen(false)
          localStorage.setItem("sessionString", client()!.session.save() as any as string)
        }
        props.setLoggedIn(isAuthorized)
      }
    }
    return props.loggedIn()
  })

  async function logOut() { // the logout function
    client()?.invoke(new Api.auth.LogOut())
    localStorage.removeItem("sessionString")
    props.setLogInPromptIsOpen(false)
    props.setLoggedIn(false)
  }

  //defining the login modal
  return (
    <div class="modal modal-open">
      <div class="modal-box flex flex-col w-min relative">
        <button onclick={() => props.setLogInPromptIsOpen(false)} class="btn btn-circle btn-xs absolute top-2 right-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <Show when={props.loggedIn()} fallback={
          <>
            <h3 class="font-bold text-lg uppercase text-center">Sign into Telegram</h3>
            <span>
              <p ref={prompt} class="py-4"></p> <div ref={tooltip} data-tip="Ensure this is an international format"><input ref={input} class="input input-primary" /></div>
            </span>
            <div class="modal-action">
              <button ref={button} class="btn w-full">Next</button>
            </div>
          </>
        }>
          <h3 class="font-bold text-lg uppercase text-center pt-1">Goodbye!</h3>
          <div class="modal-action">
            <button onClick={async () => await logOut()} class="btn w-full btn-success">logout</button>
          </div>
        </Show>
      </div>
    </div>
  );
};

// the function to that modifies the modal for the current auth state
function askFor(request: string): Promise<string> {
  return new Promise((resolve, reject) => {
    switch (request) {
      case 'phoneNumber':
        prompt.innerHTML = "Enter your phone number";
        input.type = "tel";
        input.placeholder = '12225551234' // give the user a hint as to the format we're expecting
        button.onclick = () => (button.classList.toggle("loading"), resolve(input.value));
        break;

      case "phoneCode":
        button.classList.toggle("loading")
        input.value = ''; // clear the input for the user
        input.type = "number" // help the user avoid typos
        input.placeholder = "Enter your verification code";
        prompt.innerText = "A verification was sent via Telegram or SMS.";
        button.onclick = () => (button.classList.toggle("loading"), resolve(input.value));
        break;

      case "password":
        button.classList.toggle("loading")
        input.value = '';
        input.type = "password";
        input.placeholder = "Enter your password";
        prompt.innerText = "Enter your password";
        button.onclick = () => (button.classList.toggle("loading"), resolve(input.value));
        break;

      // shouldn't need a default case 
    }
  })
}

// the function that prompts the user for their credentials and signs them in 
async function initializeAuth(client: TelegramClient) {
  await client.start({
    phoneNumber: async () => await askFor("phoneNumber"),
    phoneCode: async () => await askFor("phoneCode"),
    password: async () => await askFor("password"),
    // TODO implement actual error handling 
    onError: console.error
  })
}

