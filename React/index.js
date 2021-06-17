class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const name = this.getAttribute("name");
    const url = "https://www.google.com/search?q=" + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}

customElements.define("happeo-custom-widget", happeoCustomReactWidget);
