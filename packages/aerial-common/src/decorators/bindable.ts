import { CallbackBus, IBus } from "mesh7";
import { IObservable, Observable } from "../observable";
import { CoreEvent, PropertyMutation } from "../messages";

function shouldBubbleEvents(proto: any, property: string) {
  return proto[`$bubbleEvents$${property}`];
}

export function bindable(bubbles: boolean = false) {

  class BindableValue {
    private _value: any;
    private _shouldBubbleEvents: boolean;
    private _valueObserver: IBus<any, any>;

    constructor(readonly target: IObservable, readonly property: string) {
      if (shouldBubbleEvents(target, property)) {
        this._valueObserver = new CallbackBus(this.onValueEvent.bind(this));
      }
    }

    getValue() {
      return this._value;
    }

    setValue(value: any) {
      if (this._valueObserver && this._value && this._value.unobserve) {
        (<IObservable>this._value).unobserve(this._valueObserver);
      }
      this._value = value;
      if (this._valueObserver && this._value && this._value.observe) {
        (<IObservable>this._value).observe(this._valueObserver);
      }
    }

    private onValueEvent(event: CoreEvent) {
      this.target.notify(event);
    }
  }

  return (proto: IObservable, property: string = undefined, descriptor: PropertyDescriptor = undefined) => {

    function getBindableValue(object): BindableValue {
      return object[`$binding$${property}`] || (object[`$binding$${property}`] = new BindableValue(object, property));
    }

    Object.defineProperty(proto, property, {
      get() {
        return getBindableValue(this).getValue();
      },
      set(newValue) {
        const bv = getBindableValue(this);

        const oldValue = bv.getValue();
        if (oldValue !== newValue) {
          bv.setValue(newValue);
          this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, property, newValue, oldValue).toEvent(bubbles));
        }
      }
    });
  };
}

export function bubble() {
  return (proto: IObservable, property: string = undefined, descriptor: PropertyDescriptor = undefined) => {
    proto[`$bubbleEvents$${property}`] = true;
  };
}