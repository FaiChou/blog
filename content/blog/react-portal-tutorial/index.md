---
title: "React Portal Tutorial"
date: "2017-12-25"
category: "dev"
emoji: "🥦"
---

## Merry Xmas

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1514207239512.png" width="600"/>



## Before

[Portals](https://reactjs.org/docs/portals.html)是React v16特别有价值的更新, 它的出现打破了`父组件-子组件`这种传统模式, 让你在任意DOM节点下操作组件变得简单.

## Example

[Antd的Modal](https://ant.design/components/modal-cn/): 当你打开DeveloperTools你会发现modal所在的节点并非是在`#root`下,而是和`#root`平级生成的新的Dom. 在v16之前你要做这件事并不容易, 起码你要[这样写](https://github.com/react-component/dialog/blob/master/src/DialogWrap.tsx), 借助`rc-util/lib/Portal`来创建, 但是v16来了, 你只需要`ReactDOM.createPortal(child, container)`这样.

## Journey

代码放到了[这里](https://github.com/FaiChou/ReactTooltip-Tut).

这是一个最简单Modal, 点击button,会在button下展现一个Modal, 点击Modal上的`Hide`button会隐藏掉Modal.



<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1514210537087.png" width="600"/>

`点击后效果`

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1514210570636.png" width="600"/>


    
可以明显的看到在和`root`平级地方多出了一个`<div>`, 这就是刚刚点击button通过portal创建的modal.

## Core Code

```javascript
// Modal.js

import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }
    componentDidMount() {
        document.body.appendChild(this.el);
    }
    componentWillUnmount() {
        document.body.removeChild(this.el);
    }
    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

export default Modal;

```

```javascript
// App.js

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
      modalVisible: false,
    };
    this.showModal = this.showModal.bind(this);
  }
  showModal() {
    const dimensions = this.el.getBoundingClientRect();
    const left = dimensions.left;
    const top = dimensions.top + dimensions.height + 10;
    const height = 200;
    const width = 200;
    const style = { left, top, height, width };
    this.setState({
      style,
      modalVisible: true,
    });
  }
  render() {
    const modal = this.state.modalVisible && (
      <Modal>
        <div className="modal" style={this.state.style}>
          <p>Hello, World!</p>
          <button onClick={() => this.setState({ modalVisible: false })}>
            Hide
          </button>
        </div>
      </Modal>
    );
    return (
      <div className="App">
        { modal }
        <button
          ref={el => this.el = el}
          onClick={this.showModal}>
          Show
        </button>
      </div>
    );
  }
}
```

```css
.modal {
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
```

1. Modal是一个正常的rederable react component.
2. 通过`ReactDOM.createPortal(this.props.children, this.el);`在`document.body`下创建一个`<div>`,并将其子组件加进去.
3. 生命周期结束(`componentWillUnmount`)将`<div>`移除.
4. 在`App.js`中, 借助render方法,将Modal加进去, 可以放在`<div className="App">`下面任意位置,无影响(要保证不出错).
5. 通过ref获得button的宽高及上下左右位置,设置modal的位置.


## After

https://hackernoon.com/using-a-react-16-portal-to-do-something-cool-2a2d627b0202

[这一篇](https://hackernoon.com/using-a-react-16-portal-to-do-something-cool-2a2d627b0202)文章, 大佬不光将modal建立在`root`之外, 更是建立在整个窗体之外.

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1514211751371.png" width="600"/>


可以在[codepen](https://codepen.io/davidgilbertson/pen/xPVMqp)中体验下.

