export type StateInput = {
  email: string
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
  email,
  password,
}: {
  email: StateInput['email']
  password: StateInput['password']
}) => Promise<boolean>

export type ICreate = ({
  name,
  email,
  password,
  passwordRepeat,
}: StateInput) => Promise<boolean>
