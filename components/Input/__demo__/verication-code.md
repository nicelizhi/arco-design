---
order: 13
title:
  zh-CN: 验证码输入组件
  en-US: Verification Code Input
---

## zh-CN

验证码输入

## en-US

Verification Code Input

```js
import { Input } from '@arco-design/web-react';

const App = () => {

  return <div >
  <Input.VerificationCode defaultValue={['1', '2', '3', '4', '5', '6']} style={{width: 300}} allowClear   />
  <br/>


  <Input.VerificationCode  defaultValue={['1', '2', '3', '4', '5', '6']}  style={{width: 300}} allowClear mode="password"  onFinish={v => {console.log(v)}} />
  <br/>

  <Input.VerificationCode   defaultValue={['1', '2', '3', '4', '5', '6']}  style={{width: 300}} status="error" allowClear   />
  <br/>

  <Input.VerificationCode style={{width: 400}} length={9}  separator={({ index, character }) => {
    return ((index + 1) % 3 || index > 7 )? null : '-'
  }}  allowClear   /><br/>
  </div>;
};

export default App;
```
