type IdsType = "username" | "email" | "message";
type FormObjType = { [K in IdsType]: { labelEl?: HTMLLabelElement, inputValueLength: number } };

const labelsEl = document.querySelectorAll("label");
const formObj: FormObjType = {
    email: {inputValueLength: 0},
    message: {inputValueLength: 0},
    username: {inputValueLength: 0}
};

for (const label of labelsEl) {
    const labelFor = label.getAttribute("for");
    if (labelFor) {
        formObj[labelFor as keyof FormObjType].labelEl = label;
    }
}

const inputListener = (inputEl: HTMLInputElement | HTMLTextAreaElement): (ev: Event) => void => {
    return ev => {
        for (const obj in formObj) {
            const typedObj = obj as keyof FormObjType;
            const label = formObj[typedObj].labelEl;

            if (label) {
                if (obj === inputEl.getAttribute("id")) {
                    formObj[typedObj].inputValueLength = inputEl.value.length;
                    label.style.top = "-1.5em";
                } else {
                    if (formObj[typedObj].inputValueLength) {
                        label.style.top = "-1.5em";
                    } else {
                        label.style.top = obj === "message" ? ".5em" : "calc(50% - 0.6rem)";
                    }
                }
            }
        }
    };
}

for (const obj in formObj) {
    const inputEl = document.getElementById(obj ?? "") as HTMLInputElement | HTMLTextAreaElement;
    if (formObj.hasOwnProperty(obj)) {
        if (inputEl) {
            inputEl.oninput = inputListener(inputEl);
            inputEl.onblur = ev => {
                for (const obj in formObj) {
                    const typedObj = obj as keyof FormObjType;
                    const label = formObj[typedObj].labelEl;

                    if (label) {
                        if (!inputEl.value.length && obj === inputEl.getAttribute("id")) {
                            label.style.top = obj === "message" ? ".5em" : "calc(50% - 0.6rem)";
                        }
                    }
                }
            }
        }
    }
}
