const match = (element, nodeNameArg, datasetKey) => {
  const nodeNames = (nodeNameArg instanceof String) ? [nodeNameArg] : nodeNameArg
  return nodeNames.includes(element.nodeName) && typeof element.dataset[datasetKey] !== 'undefined'
}

export default match
