import { useTypedSelector } from "./use-typed-selector";

export const useComulative = (cellId: string) => {
  return useTypedSelector((state) => {
    // const { data, order } = state.cells
    const orderedCells = state.cells?.order.map((id) => state.cells?.data[id]);

    const showFunc = `
      import _React from 'react'
      import _ReactDOM from 'react-dom'
      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object'){
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root)
          } else {
          root.innerHTML = JSON.stringify(value);
        }} else {
          root.innerHTML = value;
        }
      }
    `;

    const showFuncNoop = "var show = () => {}";

    const comulativeCode = [];

    if (orderedCells) {
      for (let c of orderedCells) {
        if (c?.type === "code") {
          if (c.id === cellId) {
            comulativeCode.push(showFunc);
          } else {
            comulativeCode.push(showFuncNoop);
          }
          comulativeCode.push(c.content);
        }
        if (c?.id === cellId) {
          break;
        }
      }
      return comulativeCode;
    }
  })?.join("\n");
};
