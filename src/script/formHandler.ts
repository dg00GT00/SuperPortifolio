import { MessageDisplayStatus, setLoadingSpinnerState, submitButtonState } from "./formState";

const formElem = document.querySelector("form");
const messageDisplay = new MessageDisplayStatus();

formElem?.addEventListener('submit', async (e) => {
    // on form submission, prevent default
    e.preventDefault();
    // construct a FormData object, which fires the formdata event
    const formData = new FormData(formElem);
    const value = Object.fromEntries(formData.entries());

    try {
        submitButtonState(true);
        setLoadingSpinnerState(true);
        const response = await fetch("/api/SendEmailFunction", {
            headers: {
                "Content-Type": "application/json",
            },
            mode: "no-cors",
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(value) // body data type must match "Content-Type" header
        });

        if (response.status >= 400) {
            throw new Error();
        }
        setLoadingSpinnerState(false);
        messageDisplay.setMessageDisplay(true);
    } catch {
        submitButtonState(false);
        setLoadingSpinnerState(false);
        messageDisplay.setMessageDisplay(false);
    }
});