import * as React from 'react';
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import styled from "styled-components"

const KEY_CODE = {
  backspace: 8,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

interface ICodeInputProps {
  values: string,
  title: string,
  type?: string,
  fields?: number,
  disabled?: boolean,
  required?: boolean,
  onChange?: Function,
  onComplete?: Function,
  className?: string
}

export const CodeInput = (props: ICodeInputProps) => {

  const type = props.type || "number";
  const fields = props.fields || 6;

  const [values, setValues] = useState<string[]>(new Array(fields).fill(''))

  useEffect(() => {
    const value = type === "number" ? props.values.replace(/[^\d]/gi, '') : props.values;
    let vals = value ? value.split('').slice(0, fields) : new Array<string>(fields).fill('');
    while (vals.length < fields) {
      vals.push('')
    }
    setValues(vals)
  }, [props.values])

  let inputRefs: any[] = []
  for (let idx = 0; idx < fields; idx++) {
    inputRefs.push(useRef())
  }

  const triggerChange = (vals: string[]) => {
    const { onChange, onComplete, fields } = props;
    const val = vals.join('');
    onChange && onChange(val);
    if (onComplete && val.length >= fields) {
      onComplete(val);
    }
  }

  const onChange = (evt: any, index: number) => {
    let { value } = evt.target;
    if (type === 'number') {
      value = value.replace(/[^\d]/gi, '');
    }
    if (value === '' || (type === 'number' && !evt.target.validity.valid)) {
      return;
    }

    let next;
    const vals = [...values];
    if (value.length > 1) {
      let nextIndex = value.length + index - 1;
      if (nextIndex >= fields) {
        nextIndex = fields - 1;
      }

      next = inputRefs[nextIndex];
      value.split('').forEach((char: string, idx: number) => {
        const cursor = index + idx;
        if (cursor < fields) {
          vals[cursor] = char;
        }
      });
    } else {
      next = inputRefs[index + 1];
      vals[index] = value;
    }

    if (next) {
      next.current.focus();
      next.current.select();
    }

    setValues(vals)
    triggerChange(vals);
  }

  const onKeyDown = (evt: KeyboardEvent, index: number) => {
    const prevIndex = index - 1;
    const nextIndex = index + 1;
    const prev = inputRefs[prevIndex];
    const next = inputRefs[nextIndex];
    switch (evt.keyCode) {
      case KEY_CODE.backspace:
        evt.preventDefault();
        const vals = [...values];
        if (values[index]) {
          vals[index] = '';
        } else if (prev) {
          vals[prevIndex] = '';
          prev.current.focus();
        }
        setValues(vals)
        triggerChange(vals);
        break;
      case KEY_CODE.left:
        evt.preventDefault();
        if (prev) {
          prev.current.focus();
        }
        break;
      case KEY_CODE.right:
        evt.preventDefault();
        if (next) {
          next.current.focus();
        }
        break;
      case KEY_CODE.up:
      case KEY_CODE.down:
        evt.preventDefault();
        break;
      default:
        break;
    }
  }

  const onFocus = (evt: any) => {
    // https://blog.danieljohnson.io/react-ref-autofocus/
    evt.currentTarget.select(evt)
  }

  return <Wrapper className={props.className || ""}>
    {props.title && <p className={"title"}>{props.title}</p>}
    <div className="input-wrapper">
      {values.map((value: string, index: number) => (
        <InputBox fields={fields} key={`${props.title.replace(/ /g, "-")}${index}`}>
          <input
            type={type === 'number' ? 'tel' : type}
            pattern={type === 'number' ? '[0-9]*' : undefined}
            value={value}
            ref={inputRefs[index]}
            onChange={(evt: ChangeEvent) => onChange(evt, index)}
            onKeyDown={(evt: KeyboardEvent) => onKeyDown(evt, index)}
            onFocus={(evt: FocusEvent) => onFocus(evt)}
            disabled={props.disabled}
            required={props.required}
          />
        </InputBox>
      ))}
    </div>
  </Wrapper>
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    margin: 20px 0 25px 0;
    font-weight: 500;
  }

  .input-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`

const InputBox = styled.div`
  flex: ${(props: any) => (props.fields && props.fields > 6) ? (1 / props.fields) : '0.1666666666'};
  height: 50px;
  margin: 0 5px;
  box-shadow: none;

  & > input {
    border: 1px solid #ddd;
    width: 100%;
    line-height: 50px;
    text-align: center;
    box-shadow: none;
  }
`