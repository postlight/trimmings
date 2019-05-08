const parseArgs = (argString) => {
  const tokens = argString.trim().split(/,\s*/g)
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
