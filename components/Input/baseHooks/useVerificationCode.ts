import { useMemo, useCallback, ClipboardEvent, MouseEvent, KeyboardEvent, useEffect } from 'react';
import isEqualWith from 'lodash/isEqualWith';
import useMergeValue from '../../_util/hooks/useMergeValue';
import { isExist } from '../../_util/is';
import { Backspace } from '../../_util/keycode';

const defaultLength = 6;

export interface VerificationCodeOptions {
  length?: number;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  onFinish?: (value: string) => void;
  getInputRefList?: () => (HTMLInputElement | HTMLTextAreaElement)[];
}

type VerificationCodeReturnType = {
  value: VerificationCodeOptions['value'];
  setValue: (v: VerificationCodeOptions['value']) => void;
  getInputProps: (index: number) => {
    key: string | number;
    value: string;
    onClick: (e: MouseEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onChange: (v: string) => void;
    onPaste: (e: ClipboardEvent) => void;
  };
};

export default function useVerificationCode(
  props: VerificationCodeOptions
): VerificationCodeReturnType {
  const [mergeValue, setValue] = useMergeValue([], props);

  const length = +props.length > 0 ? +props.length : defaultLength;

  const formatValue = useCallback(
    (val: string[]) => {
      const newVal = val || [];
      return new Array(length).fill('').map((_, index) => {
        return isExist(newVal[index]) ? String(newVal[index]) : '';
      }) as string[];
    },
    [length]
  );

  const filledValue = useMemo(() => {
    return formatValue(mergeValue);
  }, [JSON.stringify(mergeValue), formatValue]);

  const focusFirstEmptyInput = () => {
    const nodeList = props.getInputRefList?.() || [];

    if (nodeList?.indexOf(document.activeElement as any) === -1) {
      return;
    }

    const index = filledValue.findIndex((x) => !x);

    if (index > -1) {
      const realIndex = Math.min(index, nodeList.length - 1);

      nodeList[realIndex]?.focus?.();
    }
  };

  useEffect(() => {
    focusFirstEmptyInput();
  }, [JSON.stringify(filledValue)]);

  const tryUpdateValue = (newVal: VerificationCodeOptions['value']) => {
    const _newVal = formatValue(newVal);
    if (!isEqualWith(_newVal, filledValue)) {
      setValue(_newVal);

      props.onChange?.(_newVal);

      const finishVal = _newVal.join('');
      if (finishVal.length === length) {
        props.onFinish?.(finishVal);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent, index) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData('text');
    if (text) {
      tryUpdateValue(filledValue.slice(0, index).concat(text.split('')));
    }
  };

  return {
    value: filledValue,
    setValue: tryUpdateValue,
    getInputProps: (index) => {
      const indexVal = String(filledValue[index]);
      return {
        key: index,
        value: indexVal,
        onClick: (e) => {
          e.preventDefault();
          if (!filledValue[index]) {
            focusFirstEmptyInput();
          }
        },
        onKeyDown: (e) => {
          const keyCode = e.keyCode || e.which;
          if (keyCode === Backspace.code) {
            let _index = index;
            if (!filledValue[index]) {
              _index -= 1;
            }
            const newVal = [...filledValue];
            newVal[_index] = '';
            tryUpdateValue(newVal);
          }
        },

        onChange: (v) => {
          const char = v?.trim() || '';
          const newVal = [...filledValue];
          newVal[index] = char.replace(indexVal, '').split('').pop() || '';

          tryUpdateValue(newVal);
        },

        onPaste: (e: ClipboardEvent) => {
          handlePaste(e, index);
        },
      };
    },
  };
}
