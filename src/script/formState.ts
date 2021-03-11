export const submitButtonState = (isDisabled: boolean): void => {
    const buttonEl: HTMLButtonElement | null = document.querySelector("button[type=submit]");
    if (buttonEl) {
        buttonEl.disabled = isDisabled;
    }
}

export const setLoadingSpinnerState = (isLoading: boolean): void => {
    const spinnerEl: HTMLDivElement | null = document.querySelector(".loading-spinner");
    if (spinnerEl) {
        spinnerEl.style.display = isLoading ? "block" : "none";
    }
}

export class MessageDisplayStatus {
    #_successfullyContainer: HTMLDivElement | null = document.querySelector(".message-sent-successfully");
    #_failedContainer: HTMLDivElement | null = document.querySelector(".message-sent-failed");

    public setMessageDisplay(isMessageSuccessfully: boolean): void {
        if (this.#_successfullyContainer && this.#_failedContainer) {
            if (isMessageSuccessfully) {
                this.#_failedContainer.style.display = "none";
                this.#_successfullyContainer.style.display = "flex";
                const timeout = setTimeout(() => {
                    if (this.#_successfullyContainer) {
                        this.#_successfullyContainer.style.display = "none";
                        clearTimeout(timeout);
                    }
                }, 1000);
            } else {
                this.#_successfullyContainer.style.display = "none";
                this.#_failedContainer.style.display = "flex";
                const timeout = setTimeout(() => {
                    if (this.#_failedContainer) {
                        this.#_failedContainer.style.display = "none";
                        clearTimeout(timeout);
                    }
                }, 1000);
            }
        }
    }
}