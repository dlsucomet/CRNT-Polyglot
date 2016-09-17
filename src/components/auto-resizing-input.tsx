import * as React from 'react';

export default class AutoResizingInput extends React.Component<any, {}> {
  textArea: HTMLTextAreaElement;
  textAreaRef = (ref) => { this.textArea = ref; };
  padding: number;

  componentDidMount() {
    let topPadding = getComputedStyle(this.textArea).getPropertyValue("padding-top"); 
    let bottomPadding = getComputedStyle(this.textArea).getPropertyValue("padding-bottom");
    this.padding = parseInt(topPadding) + parseInt(bottomPadding);

    resizeToFitText(this.textArea, this.padding);
  }

  componentDidUpdate() {
    resizeToFitText(this.textArea, this.padding);
  }

  render() {
    return (
      <textarea {...this.props} ref={this.textAreaRef} />
    );
  }
}

function resizeToFitText(elem: HTMLElement, padding: number = 0) {
  elem.style.height = "0";
  elem.style.height = (elem.scrollHeight - padding) + "px";
}
