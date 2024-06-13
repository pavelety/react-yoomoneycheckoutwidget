import {useCallback, useEffect} from 'react';
import {
  YooMoneyCheckoutWidget,
  YooMoneyCheckoutWidgetConfig,
  YooMoneyErrorCallbackResult
} from "types-yoomoneycheckoutwidget";

let isLoading = false;
let isInited = false;
export default function YooWidget({config, onComplete, onSuccess, onFail, onModalClose}: {
  /**
   * Описание https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget/reference#initialization-parameters
   */
  config: YooMoneyCheckoutWidgetConfig,
  /** после успешной оплаты*/
  onComplete?: () => void,
  /** после успешной оплаты, только если не подписались на onComplete*/
  onSuccess?: () => void,
  /** только если вы отключили обработку неуспешных попыток в виджете: пользователь выбрал любой способ оплаты, но платеж не прошел; закончился срок действия токена.*/
  onFail?: () => void,
  /** после закрытия модального окна платежной формы если customization.modal==true */
  onModalClose?: () => void,
}) {
  const isModal = config?.customization?.modal;
  let checkout: YooMoneyCheckoutWidget;
  const destroy = () => {
    console.log('checkout.destroy');
    checkout.destroy();
    isInited = false;
  }

  const initializeWidget = useCallback(
    () => {
      isInited = true;
      isLoading = false;
      if (!isModal) {
        const userErrorCallBack = config.error_callback;
        config.error_callback = (error: YooMoneyErrorCallbackResult) => {
          userErrorCallBack(error);
          isInited = false;
        };
      }
      checkout = new window.YooMoneyCheckoutWidget(config);
      console.log('checkout.create');
      checkout.on('complete', (result) => {
        console.log('on complete', result);
        onComplete && onComplete();
        destroy();
      });
      onSuccess && checkout.on('success', (result) => {
        console.log('on success', result);
        onSuccess();
        destroy();
      });
      onFail && checkout.on('fail', (result) => {
        console.warn('on fail', result);
        onFail();
        destroy();
      });

      if (config.customization?.modal) {
        checkout.on('modal_close', (result) => {
          console.log('on modal_close', result);
          onModalClose && onModalClose();
          destroy();
        });
      }
      checkout.render(config.customization?.modal ? undefined : 'payment-form');

    }, [config, onSuccess]);

  useEffect(() => {
    if (!isLoading && !isInited) {
      if (!window.YooMoneyCheckoutWidget) {
        isLoading = true;
        console.log('load script');
        const script = document.createElement('script');
        script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
        script.async = true;
        script.onload = initializeWidget;
        document.head.appendChild(script);
        return () => {
          console.log('unload script');
          document.head.removeChild(script);
        };
      } else {
        console.log('init without loading');
        initializeWidget();
      }
    }

    return () => {
      if (!isInited && !isModal) {
        destroy();
      }
    }
  });

  return (
    <>
      {isModal ? '' : <div id="payment-form"/>}
    </>
  );
}
