## How to install?
`yarn add input_code`

## How to use ?

```tsx
import { CodeInput } from "./inputCode"
...
export default () => {
  const [code, setCode] = useState("")

  return <CodeInput values={code} title="Enter your digit code" fields={4} onComplete={(val: string) => setCode(val)} />
}
```

## Properties ?
name | details
--- | ---
`fields` | number of boxes, default is 6
`values` |  value is string
`className` | classname of wrapper
`onChange` |  event's fired when one box get updated
`onComplete` |  event's fired when one box get updated


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)