import React from "react";
import ReactDOM from "react-dom";
import AccordionWidget from "./AccordionWidget";

class HappeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";

    // Create a shadow root
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Create a container element inside the shadow root
    const container = document.createElement("div");
    shadowRoot.appendChild(container);

    // Render the React component inside the container
    ReactDOM.render(
      <AccordionWidget id={uniqueId} editMode={mode === "edit"} />,
      container,
    );
  }
}

const slug = "accordiondev-emrdme50cammtiqw9q7r";

window.customElements.get(slug) ||
  window.customElements.define(slug, HappeoCustomReactWidget);
