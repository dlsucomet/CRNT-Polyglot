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

  render() {
    return (
      <textarea {...this.props} onChange={this.handleChange} ref={this.textAreaRef} />
    );
  }

  handleChange = (e: Event) => {
    this.textArea.value = this.textArea.value.replace(/\r?\n/g, "");

    let onChangeFunc = this.props.onChange;
    if (onChangeFunc) { onChangeFunc(e); }

    resizeToFitText(this.textArea, this.padding);
  }
}

function resizeToFitText(elem: HTMLElement, padding: number = 0) {
  elem.style.height = "0";
  elem.style.height = (elem.scrollHeight - padding) + "px";
}
