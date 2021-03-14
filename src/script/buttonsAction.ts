const scrollToPageSection = (selector: string): void => {
    const jobSections = document.querySelector(selector);
    jobSections?.scrollIntoView({behavior: "smooth"});
}

const seeJobs: HTMLButtonElement | null = document.querySelector(".button");
const about: HTMLLIElement | null = document.querySelector(".about");
const contact: HTMLLIElement | null = document.querySelector(".contact");

if (seeJobs) {
    seeJobs.onclick = (ev: MouseEvent): void => {
        scrollToPageSection(".job-content");
    };
}

if (about) {
    about.onclick = (ev: MouseEvent): void => {
        scrollToPageSection(".avatar");
    }
}

if (contact) {
    contact.onclick = (ev: MouseEvent): void => {
        scrollToPageSection(".form-container");
    }
}



