export function getReactComponentName(component) {
  return component.displayName || component.name || '[anonymous]';
}