const parseArgs = (argString) => {
  const tokens = argString.trimmings().split(/\s*,\s*/g)
  const args = []
  const options = {}

  tokens.forEach((token) => {
    if (token.indexOf(':') > -1) {
      const [key, value] = token.split(/\s*:\s*/)
      options[key] = value
    } else {
      args.push(token)
    }
  })

  return { args, options }
}

export default parseArgs
