import "./say-hello.css";
import { Notificator } from "../notificator/notificator.js";

export default class SayHello {
  constructor(name) {
    this.name = name;
  }

  now() {
    Notificator.notify("Hello: " + this.name);
  }
}
