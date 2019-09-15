export type StateInput = {
  password: string
  passwordRepeat: string
  name: string
}

export type State = {
  error?: string
  create: boolean
  input: StateInput
}

export type ISignIn = ({
  name,
  password,
}: {
  name: StateInput['name']
  password: StateInput['password']
}) => Promise<boolean>

export type ICreate = ({
  name,
  password,
  passwordRepeat,
}: StateInput) => Promise<boolean>
