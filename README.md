# React Component for YooKassa Widget - YooMoneyCheckoutWidget (ЮKassa)

![YooWidget](https://static.yoomoney.ru/checkout-docs-portal/articles-public/developers-widget-process.image.ru.gif)

# Installation

> `npm i react-yoomoneycheckoutwidget`
>
> `npm i -D types-yoomoneycheckoutwidget`

# Summary

This package contains a wrapper component
for `window.YooMoneyCheckoutWidget` (https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget/basics).

# Details

It downloads js script (https://yookassa.ru/checkout-widget/v1/checkout-widget.js) in runtime only on first component
call.

Creates a component with typed configuration and callbacks.

Manages create/destroy cycles.

# Usage

Create a payment (from backend) as described
here: https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget/quick-start#process-create-payment

Use `confirmation_token` from response.

## Quick start example

```tsx
const config: YooMoneyCheckoutWidgetConfig = {
  confirmation_token: 'ct-12312323-1231-1231-1231-123123123123',
  error_callback: (result: YooMoneyErrorCallbackResult) => {
    console.error('error_callback', result.error);
  },
  customization: {
    modal: true
  }
}
const onComplete = () => {
  alert('Payment accepted');
};
const onModalClose = () => {
  alert('Payment not finished');
}

return (
  <>
    <YooWidget config={config} onComplete={onComplete} onModalClose={onModalClose}/>
  </>
)
```

## Full example

```tsx
import YooWidget from "react-yoomoneycheckoutwidget";
import {YooMoneyCheckoutWidgetConfig, YooMoneyErrorCallbackResult} from "types-yoomoneycheckoutwidget";
import {useState} from "react";


function App() {
  const [widgetShown, setWidgetShown] = useState(false)
  const config: YooMoneyCheckoutWidgetConfig = {
    confirmation_token: 'ct-12312323-1231-1231-1231-123123123123',
    error_callback: (result: YooMoneyErrorCallbackResult) => {
      console.error('error_callback', result.error);
    },
    //optional
    customization: {
      //optional
      modal: true,
      //optional
      payment_methods: ['bank_card'],
      // optional
      colors: {
        //optional
        control_primary: "#00BF96",
        //optional
        control_primary_content: "#FFFFFF",
        //optional
        control_secondary: "#FFFFFF",
        //optional
        background: "#F2F3F5",
        //optional
        border: "#FFFFFF",
        //optional
        text: "#000000",
      }
    },
    //optional
    // return_url: "https://example.com"
  }
  const toggleWidget = () => setWidgetShown(!widgetShown);
  const onComplete = () => {
    setWidgetShown(false)
    alert('Payment accepted');
  };
  const onModalClose = () => {
    setWidgetShown(false);
    alert('Payment not finished');
  }

  return (
    <>
      <button onClick={toggleWidget}>{widgetShown ? 'Hide' : 'Show'} widget</button>
      {widgetShown ? <YooWidget config={config} onComplete={onComplete} onModalClose={onModalClose}/> : ''}
    </>
  )
}

export default App
```

## TSDoc

Full docs for widget configuration can be found here:

https://github.com/pavelety/types-yoomoneycheckoutwidget/blob/master/index.d.ts

Docs for widget component API can be found here:

https://github.com/pavelety/react-yoomoneycheckoutwidget/blob/master/YooWidget.tsx

# Credits

This repo was created by [Pavel Antoshenko](https://dinamex.ru).

Implementation was inspired by [yookassa-widget](https://www.npmjs.com/package/yookassa-widget)
