export class OutOfContextError extends Error {
  constructor(contextName: string) {
    super(`O hook use${contextName} só pode ser usado em componentes abaixo do ${contextName}Provider.`);
    this.name = 'OutOfContextError';
  }
}
