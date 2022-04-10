import { d as noop, f as safe_not_equal, h as assign, i as now, l as loop, j as identity, c as create_ssr_component, a as subscribe, k as set_store_value, e as escape, n as null_to_empty, o as each } from "./index-221b5e23.js";
/* empty css                                                */function circOut(t) {
  return Math.sqrt(1 - --t * t);
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
var timeStore = readable(0, (set) => {
  {
    set(0);
    return () => {
    };
  }
});
const css = {
  code: ".spinner.svelte-171a5po.svelte-171a5po{display:grid;min-width:128px;min-height:128px;align-items:center;justify-items:center;--dots-scale:1.0;--centroid-shift-scale:0.1}.spinner.svelte-171a5po>.svelte-171a5po{--circle-size:10px;grid-row:1;grid-column:1;width:calc(var(--field) * var(--circle-size) * 4 * var(--intensity));height:calc(var(--field) * var(--circle-size) * 4 * var(--intensity));border:4px solid currentColor;border-radius:100%;--offset:calc(30.5px + (20px * var(--intensity)) + (var(--field) * 1px * var(--intensity)));transform:translateX(calc(var(--x) * var(--offset)))\n      translateY(calc(var(--y) * var(--offset)))\n      scale(0.25)\n    }",
  map: null
};
function round(num) {
  return Math.round(num * 1e3) / 1e3;
}
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentAngle;
  let dotAngles;
  let $intensity, $$unsubscribe_intensity;
  let $timeStore, $$unsubscribe_timeStore;
  $$unsubscribe_timeStore = subscribe(timeStore, (value) => $timeStore = value);
  let { dots = 32 } = $$props;
  let { interval = 2 } = $$props;
  let { active = false } = $$props;
  const intensity = tweened(0, { easing: circOut });
  $$unsubscribe_intensity = subscribe(intensity, (value) => $intensity = value);
  if ($$props.dots === void 0 && $$bindings.dots && dots !== void 0)
    $$bindings.dots(dots);
  if ($$props.interval === void 0 && $$bindings.interval && interval !== void 0)
    $$bindings.interval(interval);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  $$result.css.add(css);
  currentAngle = $timeStore / interval * 360 % 360;
  set_store_value(intensity, $intensity = active ? 1 : 0, $intensity);
  dotAngles = new Array(dots).fill(0).map((_, i) => i / dots * Math.PI * -2);
  $$unsubscribe_intensity();
  $$unsubscribe_timeStore();
  return `<div class="${[
    escape(null_to_empty($$props.class)) + " svelte-171a5po",
    "spinner"
  ].join(" ").trim()}" aria-label="${"Loading indicator"}" style="${"--intensity: " + escape(round($intensity))}">${each(dotAngles, (angle) => {
    return `<div style="${"--angle: " + escape(round(angle / Math.PI * -180)) + "deg; --x: " + escape(round(Math.sin(angle))) + "; --y: " + escape(round(Math.cos(angle))) + "; --field: " + escape(round(Math.max(0, Math.cos(angle + currentAngle / 180 * Math.PI)))) + ";"}" class="${"svelte-171a5po"}"></div>`;
  })}
</div>`;
});
export { Spinner as S };
