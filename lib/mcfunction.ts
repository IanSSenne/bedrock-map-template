import { write } from "./io";

export namespace _ {
  interface SelectorOptions {}
  namespace Identifier {
    const counts = new Map<string, number>();
    export function next(type: string) {
      const count = counts.get(type) || 0;
      counts.set(type, count + 1);
      return `_${type}_${count.toString(16)}`;
    }
  }
  export class Entity<O extends {}> {
    constructor(public base: string, public options: SelectorOptions = {}) {
      this.base = base;
      this.options = options;
    }
    toString() {
      return this.base;
    }
  }
  const stack = new Array<MCFunction>();
  export function push(fn: MCFunction) {
    stack.push(fn);
  }
  export function pop() {
    return stack.pop();
  }
  export function current() {
    return stack[stack.length - 1];
  }
  export type Handler = (self: Entity<any>) => void;
  export class MCFunction {
    name: string;
    commands: string[] = [];
    constructor(name: string) {
      this.name = name;
    }
    static create(name: string) {
      return new MCFunction(name);
    }
    write() {
      write(`bp:functions/${this.name}.mcfunction`, this.toString("complete"));
    }
    toString(type: "complete" | "ref" = "ref") {
      if (type === "complete") {
        return this.commands.join("\n");
      } else {
        return `${this.name}`;
      }
    }

    // methods

    _raw(command: string) {
      this.commands.push(command);
    }
  }
  export function _raw(command: string) {
    current()?._raw(command);
  }

  export function func(name: string, handler: Handler) {
    const fn = MCFunction.create(name);
    push(fn);
    handler(new Entity("@s", {}));
    fn.write();
    return fn.toString("ref");
  }
}
export * from "./mcf/commands";
