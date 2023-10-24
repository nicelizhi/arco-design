import React, { forwardRef, useRef, useContext, Fragment } from 'react';
import cs from '../_util/classNames';
import InputComponent from './input-element';
import { ConfigContext } from '../ConfigProvider';
import useMergeProps from '../_util/hooks/useMergeProps';
import { VerificationCodeProps } from './interface';
import useVerificationCode from './baseHooks/useVerificationCode';

const defaultProps = {
  length: 6,
};

export function VerificationCodeComponent(baseProps: VerificationCodeProps, _) {
  const ctx = useContext(ConfigContext);
  const props = useMergeProps(baseProps, defaultProps, {});
  const { size, value: propsValue, separator, status, defaultValue, length, mode } = props;
  const focusEleRefList = useRef([]);
  const { value, getInputProps } = useVerificationCode({
    value: propsValue,
    defaultValue,
    length,
    getInputRefList: () => focusEleRefList.current,
    onChange: props.onChange,
    onFinish: props.onFinish,
  });

  const prefix = ctx.getPrefixCls('verification-code');
  const prefixInput = ctx.getPrefixCls('input');

  return (
    <div className={cs(`${prefix}`, props.className)} style={props.style}>
      {value.map((v, index) => {
        return (
          <Fragment key={index}>
            <InputComponent
              className={cs(prefixInput, `${prefix}-input`, {
                [`${prefixInput}-size-${size}`]: size,
                [`${prefixInput}-${status}`]: status,
              })}
              ref={(node) => {
                focusEleRefList.current[index] = node?.dom;
              }}
              {...getInputProps(index)}
              type={mode === 'password' ? mode : 'text'}
            />
            {separator?.({ index, character: v })}
          </Fragment>
        );
      })}
    </div>
  );
}

const VerificationCode = forwardRef(VerificationCodeComponent);

export default VerificationCode;
