import { _ } from "../mcfunction";
type Vec3 = any;
type Block = any;
type BlockWithState = any;
let $id = 0;
function ctx(initial: string) {
  let commandSegments = ["execute"];
  var _cond = (base: string, ctx: Execute): ExecuteCondition => ({
    block: (pos: Vec3, block: Block) => {
      commandSegments.push(`${base} block ${pos} ${block}`);
      return ctx;
    },
    blocks: (start: Vec3, end: Vec3, destination: Vec3) => {
      commandSegments.push(`${base} blocks ${start} ${end} ${destination}`);
      return ctx;
    },
    entity: (selector: _.Entity<any>) => {
      commandSegments.push(`${base} entity ${selector}`);
      return ctx;
    },
    score: (target: _.Entity<any> | string, objective: string) => {
      function matches(value: number): Execute {
        commandSegments.push(
          `${base} score ${target} ${objective} matches ${value}`
        );
        return ctx;
      }
      matches.matches = (min: number | null, max: number | null) => {
        commandSegments.push(
          `${base} score ${target} ${objective} matches ${
            min ?? -(2 ** 32) + 1
          }..${max ?? 2 ** 32 - 1}`
        );
        return ctx;
      };
      return { matches };
    },
  });
  var _ctx: Execute = {
    align(axis: ("x" | "y" | "z")[]) {
      // @ts-expect-error
      commandSegments.push(`align ${[...new Set(axis.join(""))].join("")}`);
      return _ctx;
    },
    anchored(anchor: "eyes" | "feet") {
      commandSegments.push(`anchored ${anchor}`);
      return _ctx;
    },
    as(selector: _.Entity<any>) {
      commandSegments.push(`as ${selector}`);
      return _ctx;
    },
    at(selector: _.Entity<any>) {
      commandSegments.push(`at ${selector}`);
      return _ctx;
    },
    facing: (() => {
      function facing(pos: Vec3): Execute {
        commandSegments.push(`facing ${pos}`);
        return _ctx;
      }
      facing.entity = (selector: _.Entity<any>) => {
        commandSegments.push(`facing entity ${selector}`);
        return _ctx;
      };
      return facing;
    })(),
    get if() {
      return _cond("if", _ctx);
    },
    get unless() {
      return _cond("unless", _ctx);
    },
    in: (() => {
      function in_(dimension: string): Execute {
        commandSegments.push(`in ${dimension}`);
        return _ctx;
      }
      in_.overworld = () => in_("overworld");
      in_.nether = () => in_("the_nether");
      in_.end = () => in_("the_end");
      return in_;
    })(),
    positioned: (() => {
      function positioned(pos: Vec3): Execute {
        commandSegments.push(`positioned ${pos}`);
        return _ctx;
      }
      positioned.as = (selector: _.Entity<any>) => {
        commandSegments.push(`positioned as ${selector}`);
        return _ctx;
      };
      return positioned;
    })(),
    rotated: (() => {
      function rotated(yaw: number, pitch: number): Execute {
        commandSegments.push(`rotated ${yaw} ${pitch}`);
        return _ctx;
      }
      rotated.as = (selector: _.Entity<any>) => {
        commandSegments.push(`rotated as ${selector}`);
        return _ctx;
      };
      return rotated;
    })(),
    run: (cb: () => void) => {
      const fn = new _.MCFunction("THIS_FUNCTION_DOES_NOT_EXIST");
      _.push(fn);
      cb();
      _.pop();
      if (fn.commands.length === 0) return; // if the user is dumb...
      // commandSegments.push(`run ${fn.toS}`);
      if (fn.commands.length > 1) {
        let current = _.current();
        fn.name = current.name + "__execute__" + $id++;
        fn.write();
        commandSegments.push(`run function ${fn.toString("ref")}`);
        _._raw(commandSegments.join(" "));
      } else {
        commandSegments.push(`run ${fn.commands[0]}`);
        _._raw(commandSegments.join(" "));
      }
    },
  };
  return _ctx[initial];
}
type ExecuteCondition = {
  block(pos: Vec3, block: Block | BlockWithState): Execute;
  blocks(
    start: Vec3,
    end: Vec3,
    destination: Vec3,
    maskMode: "all" | "masked"
  ): Execute;
  entity(selector: _.Entity<any>): Execute;
  score(
    target: _.Entity<any> | string,
    objective: string
  ): {
    matches(value: number): Execute;
    matches(min: number | null, max: number | null): Execute;
  };
};
type Execute = {
  align(axis: ("x" | "y" | "z")[]): Execute;
  anchored(anchor: "eyes" | "feet"): Execute;
  as(selector: _.Entity<any>): Execute;
  at(selector: _.Entity<any>): Execute;
  facing: {
    (pos: Vec3): Execute;
    entity(selector: _.Entity<any>): Execute;
  };
  if: ExecuteCondition;
  unless: ExecuteCondition;
  in: {
    (dimension: string): Execute;
    overworld(): Execute;
    nether(): Execute;
    end(): Execute;
  };
  positioned: {
    (pos: Vec3): Execute;
    as(selector: _.Entity<any>): Execute;
  };
  rotated: {
    (yaw: number, pitch: number): Execute;
    as(selector: _.Entity<any>): Execute;
  };
  run(fn: () => void): void;
};
export const $execute: Execute = {
  get align() {
    return ctx("align") as unknown as Execute["align"];
  },
  get anchored() {
    return ctx("anchored") as unknown as Execute["anchored"];
  },
  get as() {
    return ctx("as") as unknown as Execute["as"];
  },
  get at() {
    return ctx("at") as unknown as Execute["at"];
  },
  get facing() {
    return ctx("facing") as unknown as Execute["facing"];
  },
  get if() {
    return ctx("if") as unknown as Execute["if"];
  },
  get unless() {
    return ctx("unless") as unknown as Execute["unless"];
  },
  get in() {
    return ctx("in") as unknown as Execute["in"];
  },
  get positioned() {
    return ctx("positioned") as unknown as Execute["positioned"];
  },
  get rotated() {
    return ctx("rotated") as unknown as Execute["rotated"];
  },
  get run() {
    return ctx("run") as unknown as Execute["run"];
  },
};
