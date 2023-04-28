import { write } from "@bedrock/io";
import { _, c } from "@bedrock/mcfunction";
function Vec2(x: number, z: number) {
  return {
    x,
    z,
    toString() {
      return `${x} ${z}`;
    },
  };
}
// write.json("rp:manifest.json", getResource("rp:manifest"));
// write.json("bp:manifest.json", getResource("bp:manifest"));

write.json(`bp:${Math.random()}.json`, {
  format_version: "1.16.100",
  value: Math.random(),
});

_.func("test", (self) => {
  c.op.targets("@s");

  c.execute.if
    .score("test", "test")
    .matches(1)
    .run(() => {
      c.tell.message("@s", "hi");
      c.tp.destination("1 2 3");
    });
});
