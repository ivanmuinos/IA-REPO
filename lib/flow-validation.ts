export const NODE_TYPES = {
  SEQUENTIAL: ["inicio", "fin", "final"],
  // otros tipos...
}

// También modificar cualquier función que valide específicamente los nodos de inicio/fin
// para que reconozca tanto "fin" como "final" como nodos finales válidos

export const isValidEndNode = (nodeType: string): boolean => {
  return nodeType === "fin" || nodeType === "final" || nodeType === "final-screen" || nodeType === "error_state"
}

export const isValidStartNode = (nodeType: string): boolean => {
  return nodeType === "inicio"
}

// Example usage (can be removed or modified as needed)
// console.log(isValidEndNode("fin")); // true
// console.log(isValidEndNode("final")); // true
// console.log(isValidEndNode("otro")); // false
// console.log(isValidStartNode("inicio")); // true
// console.log(isValidStartNode("fin")); // false
